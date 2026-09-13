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
