const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/engine.js'),'utf8'),c);const e=Object.create(c.YY.Engine.prototype),a={},b={};
const item=(resource,offset,count,ranges=null,vertexCount=36)=>({b:{resource,vertexCount},record:{offset,count,vao:{}},ranges});
function expand(items){return Array.from(items).flatMap(x=>Array.from({length:x.record.count},(_,i)=>({resource:x.b.resource,offset:x.record.offset+i*28,ranges:x.ranges,vertexCount:x.b.vertexCount})));}
test('adjacent draws preserve the exact mesh and instance sequence without mutating original records',()=>{
 const items=[item(a,0,2),item(a,56,3),item(a,140,1),item(b,168,2),item(a,224,1)],before=items.map(x=>({...x.record}));
 const g=e.groupDraws(items,5);assert.equal(g.drawItems.length,3);assert.equal(g.drawClearStart,3);assert.equal(g.drawItems[0].record.vao,items[0].record.vao);assert.deepEqual(expand(g.drawItems),expand(items));assert.deepEqual(items.map(x=>x.record),before);
});
test('ranges, gaps, different meshes, geometry lengths and transparent boundary remain separate',()=>{
 const items=[item(a,0,1),item(a,56,1),item(a,84,1,[[0,12]]),item(a,112,1),item(b,140,1),item(b,168,1,null,72),item(b,196,1,null,72),item(b,224,1,null,72)];
 const g=e.groupDraws(items,6);assert.equal(g.drawItems.length,8);assert.equal(g.drawClearStart,6);assert.deepEqual(expand(g.drawItems),expand(items));
 const clear=e.groupDraws(items,0);assert.equal(clear.drawClearStart,0);assert.equal(clear.drawItems.length,items.length);
 const empty=e.groupDraws([],0);assert.equal(empty.drawItems.length,0);assert.equal(empty.drawClearStart,0);
});
test('visibility rebuilds use newly changed instance counts, not old merged records',()=>{
 const items=[item(a,0,1),item(a,28,2)];assert.equal(e.groupDraws(items,2).drawItems[0].record.count,3);items[1].record.count=1;assert.equal(e.groupDraws(items,2).drawItems[0].record.count,2);assert.equal(items[0].record.count,1);
});
