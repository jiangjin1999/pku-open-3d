const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/engine.js'),'utf8');
function renderer(supported){
 const calls=[],shaders=[],ext={FIRST_VERTEX_CONVENTION_WEBGL:0x8e4d,provokingVertexWEBGL(mode){calls.push(['mode',mode]);}};
 const gl=new Proxy({getExtension(name){calls.push(['extension',name]);return name==='WEBGL_provoking_vertex'&&supported?ext:null;}},{get(o,k){return k in o?o[k]:(()=>{});}});
 const context=vm.createContext({console,YY:{M:{rng:()=>()=>.5}}});vm.runInContext(source,context);
 context.YY.Engine.prototype.program=function(v,f){calls.push(['program']);shaders.push(v,f);return {p:{}};};
 context.YY.Engine.prototype.target=()=>({});
 return {engine:new context.YY.Engine({getContext:()=>gl}),calls,shaders};
}
test('native flat-shading convention is configured before programs on every new context',()=>{
 for(let restored=0;restored<2;restored++){
  const {calls}=renderer(true),mode=calls.findIndex(c=>c[0]==='mode');
  assert.ok(mode>=0);assert.equal(calls[mode][1],0x8e4d);
  assert.ok(mode<calls.findIndex(c=>c[0]==='program'));
 }
});
test('an unsupported extension retains the WebGL default and all surface programs',()=>{
 const {calls,shaders}=renderer(false);
 assert.equal(calls.filter(c=>c[0]==='mode').length,0);
 assert.equal(shaders.length,12);
 assert.ok(calls.some(c=>c[1]==='WEBGL_provoking_vertex'));
});
test('all flat outputs are constant per instance, so first and last vertices have identical values',()=>{
 const {shaders}=renderer(true);
 for(const vertex of shaders.filter((_,i)=>i%2===0)){
  for(const [,name]of vertex.matchAll(/flat\s+out\s+\w+\s+(\w+)\s*;/g)){
   const assignments=[...vertex.matchAll(new RegExp('\\b'+name+'\\s*=([^;]+);','g'))];
   assert.equal(assignments.length,1,'audit newly assigned flat output '+name);
   assert.match(assignments[0][1],/^iMeta\.[xy]$/,'flat outputs must not depend on individual vertex data');
  }
 }
 assert.match(source,/layout\(location=8\) in vec4 iMeta/);
 assert.match(source,/for\(let a=3;a<=9;a\+\+\).*?vertexAttribDivisor\(a,1\)/s);
});
