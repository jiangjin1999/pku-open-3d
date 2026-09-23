// Trusted renderer. It evaluates only our renderer code; model JSON is passed as data.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
const [modelFile,outDir]=process.argv.slice(2);if(!modelFile||!outDir)throw Error('Usage: check-model.mjs model.json output-dir');
const root=path.resolve(import.meta.dirname,'../community/web'),model=JSON.parse(await readFile(modelFile,'utf8'));
const allowed=new Map([['/check.html','check.html'],['/static/preview.js','preview.js']]);
const server=createServer(async(req,res)=>{try{const file=allowed.get(new URL(req.url,'http://localhost').pathname);if(!file){res.writeHead(404).end();return}const bytes=await readFile(path.join(root,file));res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':'text/html'}).end(bytes)}catch{res.writeHead(500).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{const base=`http://127.0.0.1:${server.address().port}`;browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:960,height:640}});await page.route('**/*',r=>r.request().url().startsWith(base+'/')?r.continue():r.abort());const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/check.html');await page.waitForFunction(()=>typeof window.PKU_RENDER_MODEL==='function');const stats=await page.evaluate(async m=>await window.PKU_RENDER_MODEL(m),model);if(errors.length||!stats.triangles||!stats.draw_calls)throw Error(errors.join(';')||'Empty model render');await mkdir(outDir,{recursive:true});await page.screenshot({path:path.join(outDir,'preview.png')});await writeFile(path.join(outDir,'render.json'),JSON.stringify({ok:true,...stats}));process.stdout.write(JSON.stringify({ok:true,...stats})+'\n')}finally{await browser?.close();await new Promise(r=>server.close(r))}
