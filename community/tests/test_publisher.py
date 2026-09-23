import base64
import copy
import json
import pytest
import httpx
from community.db import connect, dump, digest, now
from community.models import ModelPart
from community.worker import process_one
from conftest import create_task, annotation, model


class GitHubMemory:
    """Simulates Git's immutable trees and exact-head merges, never contacts GitHub."""
    def __init__(self,repo):
        self.repo=repo;self.refs={'main':'base'};self.commits={'base':{'tree':{'sha':'initial'}}}
        self.trees={'initial':{}};self.blobs={};self.pr=None;self.n=0;self.merges=0;self.extra_file=False;self.changed_head=False
    def request(self,method,path,**kw):
        route=path.removeprefix('/repos/'+self.repo);data=kw.get('json',{});params=kw.get('params',{})
        self.n+=1;ident=str(self.n)
        if route=='/pulls' and method=='GET':return [self.pr] if self.pr else []
        if route.startswith('/git/ref/heads/'):
            branch=route.split('/heads/',1)[1]
            if branch not in self.refs:raise httpx.HTTPStatusError('Not found',request=httpx.Request('GET','https://api.github.com/test'),response=httpx.Response(404))
            return {'object':{'sha':self.refs[branch]}}
        if route.startswith('/git/commits/') and method=='GET':return self.commits[route.rsplit('/',1)[1]]
        if route=='/git/blobs':self.blobs[ident]=data['content'];return {'sha':ident}
        if route=='/git/trees':
            tree=dict(self.trees[data['base_tree']]);tree.update({r['path']:self.blobs[r['sha']] for r in data['tree']});self.trees[ident]=tree;return {'sha':ident}
        if route=='/git/commits':self.commits[ident]={'tree':{'sha':data['tree']}};return {'sha':ident}
        if route=='/git/refs':self.refs[data['ref'].removeprefix('refs/heads/')]=data['sha'];return {}
        if route.startswith('/git/refs/heads/'):
            self.refs[route.split('/heads/',1)[1]]=data['sha'];self.pr['head']['sha']=data['sha'];self.pr['base']['sha']=self.refs['main'];return {}
        if route=='/pulls' and method=='POST':
            self.pr={'number':1,'state':'open','merged':False,'head':{'ref':data['head'],'sha':self.refs[data['head']],'repo':{'full_name':self.repo}},'base':{'ref':'main','sha':self.refs['main'],'repo':{'full_name':self.repo}}};return self.pr
        if route=='/pulls/1':
            pr=copy.deepcopy(self.pr)
            if self.changed_head:pr['head']['sha']='tampered'
            return pr
        if route=='/pulls/1/files':
            tree=self.trees[self.commits[self.pr['head']['sha']]['tree']['sha']]
            return [{'filename':p,'status':'added'} for p in tree]+([{'filename':'community/app.py','status':'modified'}] if self.extra_file else [])
        if route.startswith('/contents/'):
            tree=self.trees[self.commits[params['ref']]['tree']['sha']]
            return {'encoding':'base64','content':base64.b64encode(tree[route.removeprefix('/contents/')].encode()).decode()}
        if route=='/check-runs':return {}
        if route=='/pulls/1/merge':
            assert data['sha']==self.pr['head']['sha'];self.merges+=1;self.refs['main']=data['sha'];self.pr.update(merged=True,state='closed',merge_commit_sha=data['sha']);return {'merged':True,'sha':data['sha']}
        raise AssertionError((method,route))


def publish(claimed):
    s,c,h,t,m=claimed;gh=GitHubMemory(s.repo)
    sub=c.post('/api/v1/tasks/'+t['task_id']+'/submit',headers=h,json=m).json()
    def render(*_):return {'ok':True,'content_hash':sub['content_hash'],'triangles':24}
    process_one(s,renderer=render,gh=gh)
    return gh,sub


def test_checked_package_auto_merges_and_publishes(claimed):
    s,c,h,t,m=claimed;gh,sub=publish(claimed)
    assert c.get('/api/v1/submissions/'+sub['id']).json()['state']=='pr_open'
    process_one(s,gh=gh)
    assert gh.merges==1
    assert c.get('/api/v1/submissions/'+sub['id']).json()['state']=='published'
    public=c.get('/api/v1/models').json()['models'];assert len(public)==1 and public[0]['floor']=='四楼'
    assert c.get('/api/v1/models/'+public[0]['revision']).json()['model']['space']=='floor'
    assert not process_one(s,gh=gh)
    assert gh.merges==1
    tree=gh.trees[gh.commits[gh.refs['main']]['tree']['sha']]
    assert set(tree)=={'models/parts/'+m['part_id']+'.json','models/places/'+t['place_id']+'.json'}
    assert t['receipt'] not in dump(tree) and t['photo_id'] not in dump(tree)


@pytest.mark.parametrize('tamper',['extra_file','changed_head'])
def test_changed_code_or_head_cannot_auto_publish(claimed,tamper):
    s,c,h,t,m=claimed;gh,sub=publish(claimed);setattr(gh,tamper,True)
    process_one(s,gh=gh)
    assert gh.merges==0
    assert c.get('/api/v1/models').json()['models']==[]
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='failed'


def test_new_feedback_revision_chain_and_rollback(claimed,env):
    s,c,h,t,m=claimed;gh,sub=publish(claimed);process_one(s,gh=gh)
    old=c.get('/api/v1/models').json()['models'][0]['revision']
    other=create_task(c,annotation(kind='feedback',place_id=t['place_id'],new_place=None,description='测试楼层尺寸不符',actual='测试需要加长'))
    c.post('/api/v1/tasks/'+other['task_id']+'/claim',headers=h)
    revised=model(other,base_revision=old);revised['nodes'][0]['size'][0]=9
    sub2=c.post('/api/v1/tasks/'+other['task_id']+'/submit',headers=h,json=revised).json()
    # A fresh in-memory PR provider is enough to test the DB version transition.
    gh2=GitHubMemory(s.repo);process_one(s,renderer=lambda *_:{'ok':True,'content_hash':sub2['content_hash']},gh=gh2);process_one(s,gh=gh2)
    current=c.get('/api/v1/models').json()['models'][0]['revision'];assert current!=old
    admin=env[2]('jiangjin1999');r=c.post('/api/v1/admin/rollback/'+old,headers=admin)
    assert r.status_code==200 and r.json()['auto_publish']==False
    assert c.get('/api/v1/models').json()['models'][0]['revision']==old
    assert c.get('/api/v1/models/'+current).status_code==200
    assert c.post('/api/v1/admin/verify/'+old,headers=h,json={'note':'未经授权的核对记录'}).status_code==403
    note='测试核对记录：仅核对本合成模型的版本链，不代表真实校园。'
    assert c.post('/api/v1/admin/verify/'+old,headers=admin,json={'note':note}).status_code==200
    assert c.get('/api/v1/models/'+old).json()['verification_records'][0]['note']==note
    assert c.get('/api/v1/models').json()['models'][0]['verification']=='有核实记录'


def test_backup_restore_preserves_photos_and_pauses_publication(claimed,tmp_path):
    from ops.backup import backup,verify,restore
    s,c,h,t,m=claimed
    snapshot=backup(s.data,tmp_path/'other-disk');assert verify(snapshot)['files']
    restored=restore(snapshot,tmp_path/'restored')
    import sqlite3
    with sqlite3.connect(restored/'community.sqlite3') as db:
        assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
        assert db.execute('SELECT COUNT(*) FROM photos').fetchone()[0]==1
        assert db.execute('SELECT COUNT(*) FROM sessions').fetchone()[0]==0
        assert db.execute("SELECT value FROM meta WHERE key='auto_publish'").fetchone()[0]=='false'
    with pytest.raises(ValueError):restore(snapshot,restored)
