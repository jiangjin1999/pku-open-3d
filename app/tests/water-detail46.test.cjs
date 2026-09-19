const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),c=vm.createContext({YY:{},atob:s=>Buffer.from(s,'base64').toString('binary')});
vm.runInContext(fs.readFileSync(path.join(root,'src/water-detail.js'),'utf8'),c);
vm.runInContext(fs.readFileSync(path.join(root,'src/engine.js'),'utf8'),c);
const field=c.YY.WATER_SHORE;
function upload(value){c.YY.WATER_SHORE=value;c.YY.CAMPUS={features:[{properties:{id:field.feature,pickId:876}}]};let image;
 const e=Object.create(c.YY.Engine.prototype);e.gl={createTexture:()=>({}),bindTexture(){},texParameteri(){},texImage2D(...args){image={width:args[3],height:args[4],bytes:args.at(-1)};}};e.initShore();return{e,image};}
test('mapped bank field uploads original metric samples and resolves the current feature ID',()=>{
 const {e,image}=upload(field);assert.equal(e.shoreId,876);assert.equal(image.bytes.length,field.width*field.height);assert.equal(image.width,512);assert.equal(image.height,384);
 const campus=JSON.parse(fs.readFileSync(path.join(root,'data/campus.json'),'utf8')),ring=campus.features.find(f=>f.properties.id===field.feature).geometry.coordinates[0];
 const [xmin,zmin,xscale,zscale]=field.bounds,stepX=1/(xscale*field.width),stepZ=1/(zscale*field.height);
 // Samples nearest actual mapped bank vertices must remain within one texel.
 const tolerance=Math.hypot(stepX,stepZ)/2+field.range/255;
 for(const [x,z]of ring){const col=Math.floor((x-xmin)*xscale*field.width),row=Math.floor((z-zmin)*zscale*field.height);assert.ok(image.bytes[row*field.width+col]/255*field.range<=tolerance);}
 assert.ok(image.bytes.some(v=>v===255),'open water retains the saturated, unchanged range');
});
test('missing water detail retains a complete neutral fallback texture',()=>{
 const {e,image}=upload(undefined);assert.equal(e.shoreId,-1);assert.equal(image.width,1);assert.deepEqual(Array.from(image.bytes),[255]);
});
test('malformed, overflowing or truncated bank packets fail before texture upload',()=>{
 for(const raw of [[0,4],[255,2],[1],[1,2]]){const value={...field,width:2,height:1,rle:Buffer.from(raw).toString('base64')};assert.throws(()=>upload(value),/water-bank field/);}
});
