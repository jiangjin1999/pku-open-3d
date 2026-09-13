const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function runtime(fallback){const c=vm.createContext({YY:{}});if(fallback)vm.runInContext('ArrayBuffer.prototype.transfer=undefined',c);for(const f of ['src/visibility.js','src/engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);return c;}
const planes=[[1,0,0,25],[-1,0,0,25],[0,1,0,25],[0,-1,0,25],[0,0,1,25],[0,0,-1,25]];
const state={selected:0,isolate:0,explode:0,detailLOD:true,vegetation:true,routeEdges:new Set([1,12])};
function bucket(c,n){c.N=n;return vm.runInContext(`(()=>{const data=new Float32Array(N*28),spatial=new Float32Array(N*5);for(let k=0;k<N;k++){const i=k*28;data[i]=data[i+5]=data[i+10]=data[i+15]=1;data[i+20]=[24,38,4,8,7][k%5];data[i+21]=[188,186,800001,950001,950999,999999][k%6];data[i+23]=k%7-3;spatial.set([k%31-15,k%13-6,k%11-5,1,.08+k%4],k*5);}return{data,spatial,count:N,detailWidth:.04};})()`,c);}
const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
for(const fallback of [false,true])test('direct append preserves byte order, mode filtering, prefixes and independent phases; fallback='+fallback,()=>{
 const c=runtime(fallback),V=c.YY.Visibility,gl={createBuffer:()=>({}),createVertexArray:()=>({}),bindVertexArray(){},bindBuffer(){},enableVertexAttribArray(){},vertexAttribPointer(){},vertexAttribDivisor(){}};
 const e=Object.assign(Object.create(c.YY.Engine.prototype),{gl});
 for(const pass of [0,2,3])for(const mode of [{},{isolate:188,selected:188},{selected:186,explode:7},{vegetation:false},{detailLOD:false}]){
  const stream=e.instanceStream(pass),s={...state,...mode},expected=[];
  for(const n of [1,73,4097,9,7001,4,129]){
   const b=bucket(c,n);V.compile(b);Object.assign(b,{resource:{vertexBuffer:{}},passes:new Map()});const copy=Buffer.from(bytes(b.data)),scratch={data:null};
   const old=V.select(b,planes,[0,0,300],1000,s,scratch,true),want=scratch.data?.subarray(0,old.count*28);expected.push(Buffer.from(want?bytes(want):[]));
   const prefix=Buffer.from(bytes(stream.data.subarray(0,stream.used))),result=V.select(b,planes,[0,0,300],1000,s,stream,true,true);
   assert.deepEqual(result,old);assert.deepEqual(bytes(stream.data.subarray(0,stream.used)),prefix);assert.deepEqual(bytes(b.data),copy);
   if(result.count)e.instanceCache(b,pass,result.count,stream,null);
   assert.deepEqual(bytes(stream.data.subarray(0,stream.used)),Buffer.concat(expected));
  }
 }
 const a=e.instanceStreams.get(0),b=e.instanceStreams.get(2);assert.notEqual(a.data.buffer,b.data.buffer);
});
test('rejected ranges can discard an appended candidate without advancing the stream',()=>{
 const c=runtime(false),V=c.YY.Visibility,b=bucket(c,900);V.compile(b);const stream={data:new Float32Array(280),used:28};stream.data.fill(7,0,28);const prefix=Buffer.from(bytes(stream.data.subarray(0,28)));
 V.select(b,planes,[0,0,300],1000,state,stream,true,true);assert.equal(stream.used,28);assert.deepEqual(bytes(stream.data.subarray(0,28)),prefix);
 const small=bucket(c,1);V.compile(small);const r=V.select(small,planes,[0,0,300],1000,{...state,detailLOD:false},stream,true,true);assert.equal(r.count,1);assert.deepEqual(bytes(stream.data.subarray(28,56)),bytes(small.data));
});
