import io
import json
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from community.app import create_app
from community.config import Settings
from community.db import connect, digest, now, token


@pytest.fixture
def env(tmp_path):
    settings = Settings(data=tmp_path/"data",public_url="http://testserver",test_mode=True)
    client = TestClient(create_app(settings))
    def auth(login="builder"):
        raw=token()
        with connect(settings, True) as db:
            db.execute("INSERT INTO sessions VALUES(?,?,?,?)",(digest(raw),login,now()+3600,"cli"))
        return {"Authorization":"Bearer "+raw}
    return settings, client, auth


def annotation(**changes):
    return {"kind":"photo","new_place":{"name":"测试场景（非真实建筑）","position":{"longitude":116.304,"latitude":39.992}},
            "part":"四楼东侧走廊（测试）","space":"floor","floor":"四楼","capture_time":{"precision":"unknown"},
            "camera_note":"测试输入，不代表真实校园","description":"测试用观察","consent":True,**changes}


def photo_bytes():
    image=Image.new("RGB",(64,64),(140,120,100));out=io.BytesIO()
    image.save(out,"JPEG")
    return out.getvalue()


def create_task(client, payload=None):
    r=client.post('/api/v1/observations',json=payload or annotation())
    assert r.status_code==201
    result=r.json();headers={'X-Receipt-Key':result['receipt']}
    if (payload or {}).get('kind','photo')=='photo':
        p=client.post(f"/api/v1/observations/{result['id']}/photos",headers=headers,files={'file':('sample.jpg',photo_bytes(),'image/jpeg')})
        assert p.status_code==201
        result['photo_id']=p.json()['id']
    r=client.post(f"/api/v1/observations/{result['id']}/complete",headers=headers)
    assert r.status_code==200,r.text
    receipt=client.get(f"/api/v1/observations/{result['id']}/receipt",headers=headers).json()
    result['place_id']=receipt['annotation']['place_id'];result['headers']=headers
    return result


def model(t, **changes):
    return {"schema_version":1,"part_id":"test-fourth-floor","task_id":t['task_id'],"place_id":t['place_id'],
            "title":"测试样例：局部走廊，不代表真实校园","space":"floor","floor":"四楼","origin":[0,12,0],
            "evidence":[{"observation_id":t['id'],"supports":"测试生成的资料","certainty":"estimated"}],
            "uncertainties":["所有尺寸为测试值，不对应真实建筑"],
            "nodes":[{"id":"floor","type":"box","position":[0,0,0],"size":[8,.2,2],"color":"#b5ad9d"},
                     {"id":"wall","type":"box","position":[0,1.5,-1],"size":[8,3,.2],"color":"#ded5c5"}],**changes}


@pytest.fixture
def claimed(env):
    s,c,auth=env;t=create_task(c);h=auth()
    assert c.post('/api/v1/tasks/'+t['task_id']+'/claim',headers=h).status_code==200
    return s,c,h,t,model(t)
