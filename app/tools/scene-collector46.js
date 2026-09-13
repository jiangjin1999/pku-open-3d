/* Build-time collector. Uses the same Float32 data and canvas atlas as Engine.add. */
(function(Y){'use strict';
 class Collector{
  constructor(){this.buckets=new Map();this.stats={instances:0,triangles:0};}
  add(key,geometry,matrix,color,meta=[0,0,0,0],uv=[0,0,1,1]){
   let b=this.buckets.get(key);
   if(!b){b={geometry:{v:new Float32Array(geometry.v)},detailWidth:geometry.detailWidth||0,instances:[]};this.buckets.set(key,b);}
   if(typeof color==='string')color=Y.M.color(color);
   b.instances.push(...matrix,...color.slice(0,3),1,...meta,...uv);this.stats.instances++;
  }
  setAtlas(canvas){this.atlas=canvas;}
  upload(){for(const b of this.buckets.values()){b.data=new Float32Array(b.instances);b.instances=null;this.stats.triangles+=b.geometry.v.length/24*(b.data.length/28);}}
 }
 Y.collectScene46=async function(){
  const started=performance.now(),e=new Collector(),campus=Y.createMetricCampus(e);
  const meta={version:1,stats:e.stats,campus:{...campus,registryIds:[...campus.registry.keys()]}};delete meta.campus.registry;
  const post=async(path,body,type='application/octet-stream')=>{const r=await fetch('/__bake/'+path,{method:'POST',headers:{'Content-Type':type},body});if(!r.ok)throw Error(await r.text());};
  await post('meta',JSON.stringify(meta),'application/json');
  const atlas=await new Promise(resolve=>e.atlas.toBlob(resolve,'image/png'));await post('atlas',atlas);
  let count=0;
  for(const[key,b]of e.buckets){
   const spatial=Y.Visibility.prepare(b.data,b.geometry);
   const header=new TextEncoder().encode(JSON.stringify({key,detailWidth:b.detailWidth,vertices:b.geometry.v.length,instances:b.data.length,spatial:spatial.length}));
   const prefix=new Uint32Array([header.length]);
   // Blob avoids an additional concatenated copy of the large vertex arrays.
   await post('bucket',new Blob([prefix,header,b.geometry.v,b.data,spatial]));
   b.geometry=null;b.data=null;
   if(++count%256===0)console.log('Cached',count,'of',e.buckets.size,'source buckets');
  }
  await post('done',JSON.stringify({buildMs:performance.now()-started}),'application/json');
  return{...e.stats,buckets:e.buckets.size,buildMs:performance.now()-started};
 };
})(YY);
