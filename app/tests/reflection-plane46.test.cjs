const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8'),c);
const e=Object.create(c.YY.Engine.prototype);
function water(id,x,y,z,radius,part=0){const data=new Float32Array(28);data[23]=part;return{uniformId:id,spatial:new Float32Array([x,y,z,radius,1]),data};}
const lake=water(252,-74.72,.5,-131.587,225),pool=water(286,312.437,-3.11,-502,31.53);
const state={selected:0,isolate:0,explode:0};
test('reflection follows the visible water plane, including the sunken garden',()=>{
 assert.equal(e.reflectionLevel([lake,pool],{target:[-80,0,-160]},state),.5);
 assert.ok(Math.abs(e.reflectionLevel([lake,pool],{target:[312,0,-502]},state)+3.11)<1e-6);
 assert.equal(e.reflectionLevel([],{target:[577,0,474]},state),.5);
 // Old hall coordinates and legacy IDs cannot silently change the plane.
 assert.equal(e.reflectionLevel([lake],{target:[577,0,474]},{...state,selected:21,isolate:21}),.5);
});
test('inspected water wins over proximity, and explosion uses its actual part offset',()=>{
 assert.ok(Math.abs(e.reflectionLevel([lake,pool],{target:[-80,0,-160]},{...state,isolate:286})+3.11)<1e-6);
 const raised=water(999,0,2,0,10,.25),saved=Array.from(raised.data);
 assert.equal(e.reflectionLevel([raised],{target:[0,0,0]},{...state,selected:999,explode:4}),3);
 assert.deepEqual(Array.from(raised.data),saved);
});
