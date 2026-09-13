const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8');
function setup(fallback=false){const ctx=vm.createContext({});vm.runInContext('var YY={M:{}};'+(fallback?'ArrayBuffer.prototype.transfer=undefined;':''),ctx);vm.runInContext(source,ctx);const calls=[],gl=new Proxy({createBuffer:()=>({}),createVertexArray:()=>({}),bufferSubData:(target,offset,data,start,length)=>calls.push(Buffer.from(data.buffer,data.byteOffset+start*4,length*4))},{get:(o,k)=>k in o?o[k]:(()=>{})}),e=Object.create(ctx.YY.Engine.prototype);e.gl=gl;e.stats={instanceUploadBytes:0};const array=n=>vm.runInContext(`new Float32Array(${n})`,ctx);return{e,calls,array};}
function fill(a,seed){const u=new Uint32Array(a.buffer,a.byteOffset,a.length);for(let i=0;i<u.length;i++)u[i]=(seed+i)%17===0?0x7fc00123:((seed+i)*12347981)>>>0;return Buffer.from(u.buffer,u.byteOffset,u.byteLength);}
for(const fallback of [false,true])test('instance stream growth keeps exact bytes '+(fallback?'with the older-browser copy fallback':'and immediately detaches discarded native storage'),()=>{
 const {e,array}=setup(fallback),s=e.instanceStream(0),expected=[];let expansions=0;
 for(const [i,count] of [1500,700,800,1200,2600].entries()){
  const v=array(count*28),bytes=Buffer.from(fill(v,i*500)),old=s.data.buffer,capacity=s.data.length,offset=s.used,b={passes:new Map(),resource:{vertexBuffer:{},indexBuffer:null}};expected.push(bytes);
  const record=e.instanceCache(b,0,count,s,v);assert.ok(s.data.length<=Math.max(65536,Math.ceil(s.used*1.25)),'CPU reserve should stay within 25 percent of peak use');assert.equal(record.offset,offset);assert.equal(record.count,count);assert.deepEqual(Buffer.from(v.buffer),bytes,'input is never detached or changed');
  if(offset+count*28>capacity){expansions++;assert.equal(old.byteLength===0,!fallback,'native resize must release old backing storage without waiting for GC');}
 }
 assert.ok(expansions>=2);assert.deepEqual(Buffer.from(s.data.buffer,0,s.used*4),Buffer.concat(expected));
});
test('transferred streams remain independent by phase and reuse their capacity on the next frame',()=>{
 const {e,calls,array}=setup(),a=e.instanceStream(0),b=e.instanceStream(2),v=array(280),bytes=Buffer.from(fill(v,21)),bucket={passes:new Map(),resource:{vertexBuffer:{},indexBuffer:null}};
 e.instanceCache(bucket,0,10,a,v);e.instanceCache(bucket,2,10,b,v);assert.notEqual(a.data.buffer,b.data.buffer);e.uploadInstances(a);e.uploadInstances(b);assert.deepEqual(calls,[bytes,bytes]);
 const old=a.data.buffer;assert.equal(e.instanceStream(0),a);assert.equal(a.used,0);e.instanceCache(bucket,0,10,a,v);assert.equal(a.data.buffer,old);assert.equal(b.used,280);assert.equal(e.stats.instanceUploadBytes,bytes.length*2);
});
