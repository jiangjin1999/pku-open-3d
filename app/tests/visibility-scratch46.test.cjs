const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function runtime(file){const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);return c.YY.Visibility;}
const current=runtime('src/visibility.js'),fixed=runtime('tests/fixtures/visibility-fixed46.js');
const planes=[[1,0,0,25],[-1,0,0,25],[0,1,0,25],[0,-1,0,25],[0,0,1,25],[0,0,-1,25]],state={selected:0,isolate:0,explode:0,detailLOD:true,vegetation:true,routeEdges:new Set([1,12])};
function bucket(n){const data=new Float32Array(n*28),spatial=new Float32Array(n*5);for(let k=0;k<n;k++){const i=k*28,j=k*5;data[i]=data[i+5]=data[i+10]=data[i+15]=1;data[i+20]=[24,38,4,8,7][k%5];data[i+21]=[188,186,800001,950001,950999,999999][k%6];data[i+23]=k%7-3;const p=[k%31-15,k%13-6,k%11-5];spatial.set([...p,1,.08+k%4],j);data.set(p,i+12);}return{data,spatial,count:n,detailWidth:.04};}
test('one scratch buffer preserves selected bytes and cull counts while alternating small and large buckets',()=>{
 const scratch={data:null},saved=[];
 for(const n of[1,73,1900,9,4097,4,129])for(const mode of[{}, {isolate:188,selected:188}, {selected:186,explode:7}, {vegetation:false}, {detailLOD:false}]){
  const a=bucket(n),z={...a};current.compile(a);fixed.compile(z);const s={...state,...mode},x=current.select(a,planes,[0,0,300],1000,s,scratch),y=fixed.select(z,planes,[0,0,300],1000,s);
  assert.equal(x.count,y.count);assert.equal(x.culled,y.culled);assert.equal(a.visible,undefined);
  const expected=Array.from(z.visible?.subarray(0,y.count*28)||[]),actual=Array.from(scratch.data?.subarray(0,x.count*28)||[]);assert.deepEqual(actual,expected);
  const copy=new Float32Array(actual);saved.push({copy,expected});for(const v of saved)assert.deepEqual(Array.from(v.copy),v.expected);
 }
 assert.ok(scratch.data.length<=4097*28*2);
});
test('phase instance streams own copies before the shared selection scratch is overwritten',()=>{
 const ctx=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(root,'src/engine.js'),'utf8'),ctx);
 const gl={createBuffer:()=>({}),createVertexArray:()=>({}),bindVertexArray(){},bindBuffer(){},enableVertexAttribArray(){},vertexAttribPointer(){},vertexAttribDivisor(){}};
 const e=Object.assign(Object.create(ctx.YY.Engine.prototype),{gl}),scratch={data:null},stream=e.instanceStream(0),expected=[];
 for(const n of[9,4097,73,1]){
  const b=bucket(n);current.compile(b);Object.assign(b,{resource:{vertexBuffer:{}},passes:new Map()});const selected=current.select(b,planes,[0,0,300],1000,{...state,detailLOD:false},scratch),visible=Array.from(scratch.data.subarray(0,selected.count*28));expected.push(...visible);e.instanceCache(b,0,selected.count,stream,scratch.data);
 }
 scratch.data.fill(-9);assert.deepEqual(Array.from(stream.data.subarray(0,stream.used)),expected);
 assert.notEqual(stream.data.buffer,scratch.data.buffer);
});
