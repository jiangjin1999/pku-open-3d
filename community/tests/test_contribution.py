import copy
import io
import json
import pytest
from PIL import Image
from community.db import connect, dump, digest, now
from community.models import ModelPart
from community.worker import process_one
from conftest import annotation, create_task, model, photo_bytes


def test_anonymous_guided_fields_and_missing_location(env):
    s,c,auth=env
    for field,value in [('consent',False),('part',''),('camera_note',''),('floor','')]:
        assert c.post('/api/v1/observations',json=annotation(**{field:value})).status_code==422
    t=create_task(c,annotation(new_place={'name':'未知地点（测试）'}))
    h=auth();assert c.post('/api/v1/tasks/'+t['task_id']+'/claim',headers=h).status_code==409
    r=c.post('/api/v1/observations/'+t['id']+'/locate',headers=t['headers'],json={'longitude':116.304,'latitude':39.992})
    assert r.json()['state']=='ready'
    assert c.post('/api/v1/tasks/'+t['task_id']+'/claim',headers=h).status_code==200


def test_task_scoped_photo_access_and_withdrawal(claimed,env):
    s,c,h,t,m=claimed;other=env[2]('another-person')
    url=f"/api/v1/tasks/{t['task_id']}/photos/{t['photo_id']}"
    assert c.get(url).status_code==401
    assert c.get(url,headers=other).status_code==403
    r=c.get(url,headers=h);assert r.status_code==200
    assert 'no-store' in r.headers['cache-control']
    assert not Image.open(io.BytesIO(r.content)).getexif()
    second=create_task(c)
    assert c.post('/api/v1/tasks/'+second['task_id']+'/claim',headers=other).status_code==200
    assert c.get(f"/api/v1/tasks/{second['task_id']}/photos/{t['photo_id']}",headers=other).status_code==404
    assert c.get('/api/v1/observations/'+t['id']+'/receipt').status_code==404
    assert c.delete('/api/v1/observations/'+t['id'],headers=t['headers']).status_code==200
    assert c.get(url,headers=h).status_code==404
    assert not list((s.data/'photos').glob(t['photo_id']+'*'))


def test_sources_are_never_public(claimed):
    s,c,h,t,m=claimed
    for url in ['/api/v1/tasks','/api/v1/tasks/'+t['task_id'],'/api/v1/places','/api/v1/models']:
        text=c.get(url).text
        assert t['receipt'] not in text and t['photo_id'] not in text
        assert '测试用观察' not in text
    assert c.get('/static/../../.local/data/community.sqlite3').status_code==404
    assert c.get('/photos/'+t['photo_id']+'.jpg').status_code==404


def test_feedback_independent_and_context_preserved(env):
    s,c,auth=env
    t=create_task(c,annotation(kind='feedback',description='模型门方向不对',actual='实际朝东',basis='亲眼观察',marks=[[.1,.2],[.3,.4]],view={'yaw':.2},scene_revision='test-version'))
    h=auth();c.post('/api/v1/tasks/'+t['task_id']+'/claim',headers=h)
    pack=c.get('/api/v1/tasks/'+t['task_id']+'/pack',headers=h).json()
    a=pack['observations'][0]['annotation'];assert a['marks']==[[.1,.2],[.3,.4]] and a['scene_revision']=='test-version'
    assert pack['observations'][0]['photos']==[]
    assert c.post('/api/v1/observations/'+t['id']+'/photos',headers=t['headers'],files={'file':('context.jpg',photo_bytes(),'image/jpeg')}).status_code==201


def test_limits_and_image_validation(env):
    s,c,auth=env;t=c.post('/api/v1/observations',json=annotation()).json();h={'X-Receipt-Key':t['receipt']};url='/api/v1/observations/'+t['id']+'/photos'
    assert c.post(url,headers=h,files={'file':('bad.svg',b'<svg><script/></svg>','image/svg+xml')}).status_code==422
    s.quota_bytes=10
    assert c.post(url,headers=h,files={'file':('x.jpg',photo_bytes(),'image/jpeg')}).status_code==507
    assert c.post('/api/v1/observations',content=b'x'*(s.max_body_bytes+1)).status_code==413


def test_deduplicated_photo(claimed):
    s,c,h,t,m=claimed
    r=c.post('/api/v1/observations/'+t['id']+'/photos',headers=t['headers'],files={'file':('x.jpg',photo_bytes(),'image/jpeg')})
    assert r.json()=={'id':t['photo_id'],'duplicate':True}


@pytest.mark.parametrize('change',[
    {'nodes':[{'id':'x','type':'script','code':'exec'}]},
    {'nodes':[{'id':'x','type':'box','size':[0,2,3]}]},
    {'nodes':[{'id':'x','type':'mesh','vertices':[[0,0,0],[1,0,0],[2,0,0]],'indices':[[0,1,2]]}]},
    {'nodes':[{'id':'x','parent_id':'x','type':'box','size':[1,1,1]}]},
    {'origin':[50000,0,0]}, {'origin':[float('inf'),0,0]}, {'floor':''},
    {'part_id':'../../escape'}, {'uncertainties':[]}, {'replaces_baseline':True},
])
def test_invalid_geometry_rejected(change):
    t={'id':'obs_'+'a'*32,'task_id':'task_'+'b'*32,'place_id':'test'}
    with pytest.raises(ValueError):ModelPart.model_validate(model(t,**change))


def test_source_ownership_idempotency_and_stale_versions(claimed):
    s,c,h,t,m=claimed;url='/api/v1/tasks/'+t['task_id']
    wrong=copy.deepcopy(m);wrong['evidence'][0]['observation_id']='obs_'+'a'*32
    assert c.post(url+'/submit',headers=h,json=wrong).status_code==422
    a=c.post(url+'/submit',headers=h,json=m);assert a.status_code==200,a.text
    b=c.post(url+'/submit',headers=h,json=m);assert b.json()['id']==a.json()['id']
    wrong=copy.deepcopy(m);wrong['title']='another candidate'
    assert c.post(url+'/submit',headers=h,json=wrong).status_code==409
    with connect(s,True) as db:
        doc=ModelPart.model_validate(m).model_dump();document=dump(doc)
        db.execute('INSERT INTO revisions VALUES(?,?,NULL,?,?,NULL,1,?)',(digest(document),m['part_id'],t['place_id'],document,now()))
    assert c.post(url+'/validate',headers=h,json=m).status_code==409


def test_preview_then_submit_and_recoverable_render_failure(claimed):
    s,c,h,t,m=claimed;url='/api/v1/tasks/'+t['task_id'];sub=c.post(url+'/preview',headers=h,json=m).json()
    process_one(s,renderer=lambda *_:{'ok':True,'triangles':24,'content_hash':sub['content_hash']})
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='preview_ready'
    assert c.get('/api/v1/submissions/'+sub['id']).status_code==403
    assert c.post(url+'/submit',headers=h,json=m).json()['id']==sub['id']
    def fail(*_):raise ValueError('测试渲染失败')
    process_one(s,renderer=fail)
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='failed'
    assert c.get('/api/v1/models').json()['models']==[]
    assert c.post(url+'/submit',headers=h,json=m).json()['state']=='queued'


def test_withdrawal_during_render_wins(claimed):
    s,c,h,t,m=claimed;sub=c.post('/api/v1/tasks/'+t['task_id']+'/submit',headers=h,json=m).json()
    def withdrawn(*_):
        c.delete('/api/v1/observations/'+t['id'],headers=t['headers'])
        return {'ok':True,'content_hash':sub['content_hash']}
    process_one(s,renderer=withdrawn)
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='withdrawn'


def test_source_edit_invalidates_candidates(claimed):
    s,c,h,t,m=claimed;sub=c.post('/api/v1/tasks/'+t['task_id']+'/submit',headers=h,json=m).json()
    a=c.get('/api/v1/observations/'+t['id']+'/receipt',headers=t['headers']).json()['annotation'];a['description']='更正观察'
    assert c.patch('/api/v1/observations/'+t['id'],headers=t['headers'],json=a).status_code==200
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='changes_requested'


def test_csrf_and_single_use_pairing(env):
    s,c,auth=env;h=auth();c.cookies.set('pku_session',h['Authorization'].split()[1])
    assert c.post('/api/v1/auth/logout',headers={'Origin':'https://evil.invalid'}).status_code==403
    assert c.post('/api/v1/auth/logout').status_code==403
    p=c.post('/api/v1/auth/pair',headers=h).json()
    assert c.post('/api/v1/auth/pair/poll',headers=h,json={'secret':p['secret']}).status_code==202
    assert c.post('/api/v1/auth/pair/approve',headers=h,json={'code':p['code']}).status_code==200
    result=c.post('/api/v1/auth/pair/poll',headers=h,json={'secret':p['secret']});assert result.status_code==200
    assert result.json()['login']=='builder'
    assert c.post('/api/v1/auth/pair/poll',headers=h,json={'secret':p['secret']}).status_code==400


def test_admin_controls_not_public(claimed,env):
    s,c,h,t,m=claimed
    assert c.post('/api/v1/admin/publication',headers=h,json={'enabled':False}).status_code==403
    admin=env[2]('jiangjin1999')
    assert c.post('/api/v1/admin/publication',headers=admin,json={'enabled':False}).status_code==200
    sub=c.post('/api/v1/tasks/'+t['task_id']+'/submit',headers=h,json=m).json()
    assert process_one(s,renderer=lambda *_: (_ for _ in ()).throw(AssertionError('must not run')))==False
    assert c.get('/api/v1/submissions/'+sub['id'],headers=h).json()['state']=='queued'
