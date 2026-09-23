// Isolated end-to-end smoke check. Synthetic images/identities never enter production.
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdtemp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from 'node:net';
const root=path.resolve(import.meta.dirname,'..'),py=process.env.PKU_PYTHON||'python3';
const temporary=await mkdtemp(path.join(tmpdir(),'pku-community-test-')),artifacts=path.join(root,'output/playwright');await mkdir(artifacts,{recursive:true});
const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));const base=`http://127.0.0.1:${port}`;
const env={...process.env,PKU_DATA_DIR:temporary,PKU_PUBLIC_URL:base,PKU_NODE:process.execPath};
const server=spawn(py,['-m','uvicorn','community.app:app','--host','127.0.0.1','--port',String(port),'--no-access-log'],{cwd:root,env,stdio:'ignore'});
let browser;
async function api(route,method='GET',body,token){const r=await fetch(base+'/api/v1'+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});assert(r.ok,`API ${route}: ${r.status}`);return r.json()}
try{
 for(let i=0;i<100;i++){try{if((await fetch(base+'/api/v1/health')).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'zh-CN'}),errors=[],urls=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>urls.push(r.url()));
 await page.goto(base);await page.getByRole('heading',{name:'我有照片',exact:true}).waitFor();assert.equal(await page.locator('.contribution-card').count(),3);
 await page.screenshot({path:path.join(artifacts,'homepage-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(artifacts,'homepage-mobile.png'),fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile page overflows');
 await page.locator('.contribution-card[href="/contribute/"]').click();await page.locator('#place').waitFor();assert.equal(await page.locator('#place').inputValue(),'','Form must not silently select an unknown place');
 await page.selectOption('#place','new');await page.fill('#new-name','自动验收测试（非真实地点）');await page.fill('#target-lon','116.304');await page.fill('#target-lat','39.992');await page.fill('#part','四楼测试走廊');await page.selectOption('#space','floor');await page.fill('#floor','四楼');await page.locator('#next').click();
 const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=160;c.height=100;const x=c.getContext('2d');x.fillStyle='#ddc3a1';x.fillRect(0,0,160,100);x.fillStyle='#965746';x.fillRect(20,30,100,30);return c.toDataURL('image/png').split(',')[1]});
 await page.locator('#photos').setInputFiles({name:'synthetic-test.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});await page.locator('[data-edit="0"]').waitFor();await page.selectOption('#time-precision','unknown');assert.equal(await page.locator('#time-start-field').isVisible(),false);assert.equal(await page.locator('#time-end-field').isVisible(),false);assert.equal(await page.locator('#submit').isVisible(),false);await page.fill('#camera-note','合成测试资料，不是实际拍摄');await page.fill('#direction','测试：朝西');await page.fill('#description','浏览器验收测试');
 await page.screenshot({path:path.join(artifacts,'photo-form-mobile.png'),fullPage:true});
 await page.locator('#next').click();await page.check('#consent');await page.locator('#submit').click();await page.waitForURL(/\/receipt\/#/, {timeout:15000});await page.getByText('谢谢，这份资料有了下一站。').waitFor();
 const receipt=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('pku-last-receipt')));assert(receipt.id&&receipt.receipt);
 assert(!urls.some(u=>/\/campus\/assets\//.test(u)),'Lightweight pages loaded the campus bundle');
 const auth=JSON.parse(execFileSync(py,['-c',`import json\nfrom community.config import Settings\nfrom community.db import connect,token,digest,now\ns=Settings();raw=token()\nwith connect(s,True) as db: db.execute("INSERT INTO sessions VALUES(?,?,?,?)",(digest(raw),"test-builder",now()+3600,"browser"))\nprint(json.dumps({"token":raw}))`],{cwd:root,env,encoding:'utf8'}));
 await page.context().addCookies([{name:'pku_session',value:auth.token,url:base,httpOnly:true,sameSite:'Lax'}]);
 await api('/tasks/'+receipt.task_id+'/claim','POST',{},auth.token);const pack=await api('/tasks/'+receipt.task_id+'/pack','GET',null,auth.token);
 const photo=pack.observations[0].photos[0];assert.equal((await fetch(base+photo.url)).status,401);
 await page.goto(base+'/tasks/?id='+receipt.task_id);await page.locator('#load-pack').click();await page.locator('#copy-prompt').waitFor();assert((await page.locator('#ai-prompt').innerText()).includes('jiangjin1999/pku-open-3d'));
 const model=JSON.parse(await readFile(path.join(root,'models/examples/partial-floor.json'),'utf8'));model.task_id=receipt.task_id;model.place_id=pack.place.id;model.evidence[0].observation_id=receipt.id;
 const submitted=await api('/tasks/'+receipt.task_id+'/preview','POST',model,auth.token);
 execFileSync(py,['-c','from community.config import Settings; from community.worker import process_one; process_one(Settings())'],{cwd:root,env,timeout:250000,stdio:'pipe'});
 const result=await api('/submissions/'+submitted.id,'GET',null,auth.token);assert.equal(result.state,'preview_ready',JSON.stringify(result.report));assert(result.report.ok);
 await page.goto(base+'/preview/?submission='+submitted.id);await page.locator('#preview-stage canvas').waitFor();await page.screenshot({path:path.join(artifacts,'partial-floor-mobile.png'),fullPage:true});
 await page.locator('#model-feedback').click();await page.locator('#place').waitFor();
 // Feedback begins on step one: preserve place/version, then submit without requiring a photo.
 assert.equal(await page.locator('#place').inputValue(),pack.place.id);await page.locator('#next').click();await page.fill('#description','合成模型的走廊宽度不对');await page.fill('#actual','测试观察：应宽一些');await page.selectOption('#time-precision','unknown');await page.locator('#next').click();await page.check('#consent');await page.locator('#submit').click();await page.waitForURL(/\/receipt\/#/);
 const feedback=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('pku-last-receipt')));
 const received=await fetch(base+'/api/v1/observations/'+feedback.id+'/receipt',{headers:{'X-Receipt-Key':feedback.receipt}});const body=await received.json();assert.equal(body.annotation.scene_revision,submitted.content_hash);assert.equal(body.photos.length,1);
 assert.deepEqual(errors,[]);
 const summary={ok:true,desktop:true,mobile:true,anonymous_photo:true,receipt:true,no_campus_download:true,task_sources:true,real_browser_render:true,feedback_context:true,private_photo_access:true};await writeFile(path.join(artifacts,'smoke-result.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
}finally{await browser?.close();server.kill('SIGTERM');if(server.exitCode===null)await new Promise(r=>server.once('exit',r));await rm(temporary,{recursive:true,force:true})}
