const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8');
function decoder(){
 const module=vm.createContext({YY:{}});vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 const worker=vm.createContext({self:{},Uint8Array,Uint32Array});vm.runInContext(module.YY.workerSource,worker);return worker.unshuffle;
}
function arrange(bytes,width){const out=new Uint8Array(bytes.length);let q=0;for(let lane=0;lane<width;lane++)for(let i=lane;i<bytes.length;i+=width)out[q++]=bytes[i];return out.buffer;}
test('scene byte restoration preserves every bit, including uneven lanes and big-endian fallback',()=>{
 const restore=decoder();assert.equal(typeof restore,'function');
 for(const width of [2,4,32])for(let length=0;length<1100;length++){
  const bytes=Uint8Array.from({length},(_,i)=>(i*197+(i>>3)*89+length)&255),shuffled=arrange(bytes,width);
  for(const little of [true,false])assert.deepEqual(new Uint8Array(restore(shuffled,width,little)),bytes,`width ${width}, length ${length}, little ${little}`);
 }
});
test('the worker verifies restored original bytes before transferring the decoded chunk',()=>{
 assert.match(source,/buffer=unshuffle\(inflated,m.shuffle\)/);
 assert.ok(source.indexOf("digest('SHA-256',buffer)")>source.indexOf('buffer=unshuffle(inflated,m.shuffle)'));
 assert.match(source,/actual!==m.sha256/);
 assert.match(source,/postMessage\(\{index:m.index,buffer\},\[buffer\]\)/);
});
