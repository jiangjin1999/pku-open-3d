const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
function runtime(file){const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);return c.YY.Visibility;}
const current=runtime('src/visibility.js'),fixed=runtime('tests/fixtures/visibility-fixed46.js');
function bucket(n,position){const data=new Float32Array(n*28),spatial=new Float32Array(n*5);for(let k=0;k<n;k++){let i=k*28,j=k*5;data[i]=data[i+5]=data[i+10]=data[i+15]=1;data[i+20]=24;data[i+21]=188;const p=position(k);spatial.set([...p,1,1],j);data[i+12]=p[0];data[i+13]=p[1];data[i+14]=p[2];}return{data,spatial,count:n,detailWidth:0};}
const planes=[[1,0,0,10],[-1,0,0,10],[0,1,0,10],[0,-1,0,10],[0,0,1,10],[0,0,-1,10]];
const state={selected:0,isolate:0,explode:0,detailLOD:true,vegetation:true,routeEdges:new Set([1,12])};
function compare(b,p,s,eye=[0,0,100]){const a={...b},z={...b};current.compile(a);fixed.compile(z);const x=current.select(a,p,eye,1000,s),y=fixed.select(z,p,eye,1000,s);assert.equal(x.count,y.count);assert.equal(x.culled,y.culled);assert.deepEqual(Array.from(a.visible?.subarray(0,x.count*28)||[]),Array.from(z.visible?.subarray(0,y.count*28)||[]));}
test('separated instance clusters avoid per-instance plane checks without changing visible bytes',()=>{
 const b=bucket(1024,k=>[k<128?0:(k<576?-1000:1000),0,0]);let reads=0;
 const counted=planes.map(p=>new Proxy(p,{get(t,k){if(k==='0')reads++;return t[k];}}));
 current.compile(b);const result=current.select(b,counted,[0,0,100],1000,state);
 assert.equal(result.count,128);assert.ok(reads<200,`expected grouped rejection, got ${reads} plane checks`);compare(b,planes,state);
});
test('grouped filtering preserves all selected matrices and cull counts across modes and boundaries',()=>{
 let seed=21973;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
 for(let scene=0;scene<12;scene++){
  const b=bucket(513,k=>[(Math.floor(k/64)%3-1)*18+(rand()-.5)*15,(rand()-.5)*26,(rand()-.5)*26]);b.detailWidth=scene%2?.04:0;
  for(let k=0;k<b.count;k++){const i=k*28,j=k*5;b.data[i+20]=[24,38,4,8,7][k%5];b.data[i+21]=[188,186,800001,950001,950999,999999][k%6];b.data[i+23]=(rand()-.5)*8;b.spatial[j+3]=.1+rand()*3;b.spatial[j+4]=rand()*2;}
  for(const mode of [{},{selected:188,isolate:188},{selected:186,explode:7},{selected:188,explode:-9},{vegetation:false},{detailLOD:false}])compare(b,planes,{...state,...mode},[scene%2?1000:0,100,300]);
 }
});
test('tangent spheres, tiny buckets and positive or negative exploded parts remain visible',()=>{
 for(const n of [1,63,64,65,128,129,256]){const b=bucket(n,k=>[k%2?11:-11,0,0]);for(let k=0;k<n;k++)b.data[k*28+23]=k%2?2:-2;for(const explode of[-8,0,8])compare(b,planes,{...state,selected:188,explode,detailLOD:false});}
});
test('fully accepted groups copy exact records without rereading every instance sphere',()=>{
 const b=bucket(513,k=>[(k%7-3)*.1,0,0]);current.compile(b);let reads=0;
 b.spatial=new Proxy(b.spatial,{get(t,k){if(/^\d+$/.test(String(k)))reads++;return Reflect.get(t,k,t);}});
 const result=current.select(b,planes,[0,0,100],1000,state);
 assert.equal(result.count,513);assert.equal(result.culled,0);assert.ok(reads<10,`unexpected individual sphere reads: ${reads}`);
 assert.deepEqual(Array.from(b.visible.subarray(0,513*28)),Array.from(b.data));
});
test('group acceptance remains conservative near projected detail limits and route filtering',()=>{
 for(const distance of [1,259.9999,260,260.0001,400,625,625.0001,1200])for(const detailWidth of [0,.02,.34,1]){
  const b=bucket(257,k=>[(k%7-3)*.1,0,0]);b.detailWidth=detailWidth;
  for(let k=0;k<b.count;k++){b.data[k*28+20]=k%4===0?38:24;b.spatial[k*5+4]=k%5===0?.2:1;}
  for(const mode of [{},{detailLOD:false},{selected:188,explode:1},{isolate:188}])compare(b,planes,{...state,...mode},[0,0,distance]);
  for(let k=0;k<b.count;k+=64)b.data[k*28+21]=950999;
  compare(b,planes,state,[0,0,distance]);
 }
});
test('fully rejected detail groups retain cull accounting and selected-object exemptions',()=>{
 const b=bucket(513,k=>[(k%7-3)*.1,0,0]);current.compile(b);let reads=0;
 b.spatial=new Proxy(b.spatial,{get(t,k){if(/^\d+$/.test(String(k)))reads++;return Reflect.get(t,k,t);}});
 const r=current.select(b,planes,[0,0,1200],1000,state);
 assert.equal(r.count,0);assert.equal(r.culled,513);assert.ok(reads<10);
 const selected=current.select(b,planes,[0,0,1200],1000,{...state,selected:188});
 assert.equal(selected.count,513);assert.equal(selected.culled,0);
 assert.deepEqual(Array.from(b.visible.subarray(0,513*28)),Array.from(b.data));
 compare(bucket(513,k=>[(k%7-3)*.1,0,0]),planes,state,[0,0,1200]);
});
test('one-pass metadata preserves fixed bucket bounds, flags and insertion order',()=>{
 for(const n of [0,1,63,64,65,127,128,129,513,4097]){
  const b=bucket(n,k=>[(k%31-15)*1.7,(k%19-9)*.7,(k%11-5)*2.3]);b.detailWidth=.12;
  for(let k=0;k<n;k++){b.data[k*28+20]=[4,38,24,7,3][k%5];b.data[k*28+21]=[800001,188,950012][k%3];b.data[k*28+23]=k%13-6;}
  const a={...b},z={...b};current.compile(a);fixed.compile(z);
  for(const key of ['coarse','ids','materials','surfaceWidths','essentialFlags'])assert.deepEqual(Array.from(a[key]),Array.from(z[key]),key+' n='+n);
  for(const key of ['uniformMaterial','uniformId','maxPart'])assert.equal(a[key],z[key]);
 }
});
