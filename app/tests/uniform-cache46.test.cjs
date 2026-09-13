const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
function engine(){const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/engine.js'),'utf8'),c);const calls=[],gl=new Proxy({getUniformLocation:(p,n)=>n==='absent'?null:p+':'+n,TEXTURE0:10,TEXTURE_2D:20,TEXTURE_2D_ARRAY:30},{get:(o,k)=>k in o?o[k]:(...args)=>calls.push([k,...args.map(v=>ArrayBuffer.isView(v)?Array.from(v):v)])});return{e:Object.assign(Object.create(c.YY.Engine.prototype),{gl}),calls};}
test('uniform values are per program; mutable vectors and signed zero still upload changes',()=>{
 const {e,calls}=engine(),a={p:'a',u:{}},b={p:'b',u:{}};
 e.uniform(a,'uTime',0);e.uniform(a,'uTime',0);e.uniform(a,'uTime',-0);e.uniform(a,'uPass',3);e.uniform(a,'uPass',3);
 assert.equal(calls.length,3);assert.equal(calls[2][0],'uniform1i');assert.ok(Object.is(calls[1][2],-0));
 for(const n of [2,3,4,16]){const v=new Float32Array(n);v.fill(2);e.uniform(a,'v'+n,v);const count=calls.length;e.uniform(a,'v'+n,Array.from(v));assert.equal(calls.length,count);v[n-1]=3;e.uniform(a,'v'+n,v);assert.equal(calls.length,count+1);assert.equal(calls.at(-1).at(-1)[n-1],3);}
 const count=calls.length;e.uniform(b,'uTime',0);e.uniform(a,'uTime',-0);e.uniform(a,'absent',4);assert.equal(calls.length,count+1);
 // A replacement linked program after context recovery starts without cached values.
 e.uniform({p:'restored',u:{}},'uTime',-0);assert.equal(calls.length,count+2);
});
test('sampler unit assignments are cached but every texture is still rebound across passes',()=>{
 const {e,calls}=engine(),p={p:'a',u:{}};e.sampler(p,'uAtlas',2,'first');e.sampler(p,'uAtlas',2,'second');e.sampler(p,'uAtlas',1,'third');e.sampler(p,'uMaterials',3,'array');
 assert.deepEqual(calls.filter(c=>c[0]==='bindTexture').map(c=>c.slice(1)),[[20,'first'],[20,'second'],[20,'third'],[30,'array']]);
 assert.equal(calls.filter(c=>c[0]==='uniform1i').length,3);assert.equal(calls.filter(c=>c[0]==='activeTexture').length,4);
});
