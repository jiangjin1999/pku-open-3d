const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
async function load(chunks,cost){
 let clock=0,yields=0,workers=0,terminated=0,vertices=0,indices=0,instances=0,finished=false;const progress=[];
 const manifest={version:2,base:'./scene/',atlas:'atlas.png',chunks:Array.from({length:chunks},(_,i)=>({file:i+'.bin',rawBytes:64})),meshes:Array.from({length:chunks},(_,i)=>({buffer:{chunk:i,offset:0,length:8},indices:{chunk:i,offset:32},indexType:'uint16',vertexCount:3})),buckets:Array.from({length:chunks},(_,i)=>({data:{chunk:i,offset:0,length:1},spatial:{offset:4,length:1}})),campus:{registryIds:[]},packedStats:{compressedBytes:1},sourceHash:'fixture'};
 const engine={beginPrepared(){},preparedVertices(){vertices++;clock+=cost;},preparedIndices(){indices++;clock+=cost;},preparedInstances(){instances++;clock+=cost;},setAtlas(){},async finishPrepared(){finished=true;}};
 const Y={SCENE_PACKAGE46:manifest,CAMPUS:{features:[]}};
 class Worker{constructor(){workers++;}postMessage(m){queueMicrotask(()=>this.onmessage({data:{index:m.index,buffer:new ArrayBuffer(64)}}));}terminate(){terminated++;}}
 class Image{set src(value){queueMicrotask(()=>this.onload());}}
 const c=vm.createContext({YY:Y,location:{protocol:'http:'},document:{baseURI:'http://localhost/'},URL,Blob,Worker,Image,performance:{now:()=>clock},requestAnimationFrame(cb){yields++;clock+=16;queueMicrotask(()=>cb(clock));},queueMicrotask});
 vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8'),c);
 await Y.SceneCache46.load(engine,(n,total)=>progress.push([n,total]));
 assert.equal(workers,2);assert.equal(terminated,2);assert.equal(vertices,chunks);assert.equal(indices,chunks);assert.equal(instances,chunks);assert.equal(finished,true);assert.deepEqual(progress.map(x=>x[0]).sort((a,b)=>a-b),Array.from({length:chunks},(_,i)=>i+1));
 return yields;
}
test('small completed chunks do not each force an idle frame',async()=>assert.equal(await load(6,.1),0));
test('upload work still yields when the seven millisecond budget is exhausted',async()=>{const yields=await load(12,2);assert.ok(yields>0);assert.ok(yields<12*3);});
