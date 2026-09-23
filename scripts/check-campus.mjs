// Browser-only synthetic geometry checks; this script makes no production writes.
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.PKU_SITE||'http://127.0.0.1:18430';
await mkdir('output/playwright',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/campus/');await page.waitForFunction(()=>window.Yanyuan&&window.PKU_COMMUNITY,{},{timeout:180000});
 await page.screenshot({path:'output/playwright/campus-baseline.png'});
 const model=JSON.parse(await readFile('models/examples/partial-floor.json','utf8'));
 const result=await page.evaluate(model=>{
  const Y=Yanyuan,E=Y.engine,pick=1500000;
  const count=()=>[...E.buckets.values()].reduce((n,b)=>n+b.count,0),before=count();
  const centre=Y.orbit.target;model.origin=[centre[0],50,centre[2]];
  PKU_COMMUNITY.append(model,pick);const after=count();
  if(after!==before+model.nodes.filter(n=>n.type!=='group').length)throw Error('Adapter lost baseline instances');
  E.render(Y.camera(),Y.state);
  const bucket=[...E.buckets.values()].find(b=>b.data[21]===pick);if(!bucket?.resource.vertexBuffer)throw Error('No uploaded community geometry');
  PKU_COMMUNITY.removeBaseline(pick);if(count()!==before)throw Error('Part removal affected other geometry');
  E.render(Y.camera(),Y.state);
  const feature=Y.data.features.find(f=>f.properties.kind==='building');Y.select(feature.properties.pickId,true);
  return {baseline_instances:before,added_instances:after-before,webgl_error:E.gl.getError(),place:feature.properties.label};
 },model);
 await page.locator('#community-links a').first().waitFor();assert.equal(result.webgl_error,0);assert.deepEqual(errors,[]);
 await page.locator('#community-links a').filter({hasText:'指出问题'}).click();await page.locator('#place').waitFor();
 const context=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('pku-feedback-context')));assert(context?.place_id&&context.screenshot?.startsWith('data:image/jpeg'));
 const report={ok:true,...result,feedback_camera_and_screenshot:true};await writeFile('output/playwright/campus-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close()}
