const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c=vm.createContext({YY:{Visibility:{compile(){}}}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8'),c);
const e=Object.create(c.YY.Engine.prototype);
function classify(columns,material=45){const data=new Float32Array(28);columns.forEach((v,i)=>data.set(v,i*4));const b={data,count:1,uniformMaterial:material,materials:new Set([material])};e.compileBucket(b);return b.foliageIsotropic;}
test('leaf specialization requires an orthogonal similarity transform',()=>{
 assert.equal(classify([[2,0,0],[0,2,0],[0,0,2]]),true);
 const a=.47,c=Math.cos(a)*7,s=Math.sin(a)*7;
 assert.equal(classify([[c,0,-s],[0,7,0],[s,0,c]],46),true);
 assert.equal(classify([[2,0,0],[0,3,0],[0,0,2]]),false);
 // Equal column lengths alone are insufficient for a sheared transform.
 assert.equal(classify([[1,0,0],[.6,.8,0],[0,0,1]]),false);
 assert.equal(classify([[0,0,0],[0,0,0],[0,0,0]]),false);
});
test('non-leaf and mixed-material geometry always retains the general shader',()=>{
 for(const material of[0,4,18,24,44,null]){
  if(material===44)continue;
  assert.equal(classify([[1,0,0],[0,1,0],[0,0,1]],material),false);
 }
});
