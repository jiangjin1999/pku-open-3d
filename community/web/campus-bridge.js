/* Maintained adapter. Only validated public model JSON reaches the campus engine. */
(async function(){
'use strict';
const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error('社区资料暂不可用');return r.json()};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for(let i=0;!window.Yanyuan&&i<1800;i++)await sleep(100);
if(!window.Yanyuan)return;
const Y=window.Yanyuan,E=Y.engine,M=YY.M,G=YY.Geo;
const [{places},{models}]=await Promise.all([get('/api/v1/places?limit=1000'),get('/api/v1/models')]);
const byPick=new Map(places.filter(p=>p.pick_id).map(p=>[p.pick_id,p])),byPlace=new Map(places.map(p=>[p.id,p]));
let nextPick=1000000;
for(const m of models){const p=byPlace.get(m.place_id);if(!p||p.pick_id)continue;p.pick_id=nextPick++;byPick.set(p.pick_id,p);const [x,,z]=m.origin;
 Y.registerCommunityFeature({type:'Feature',geometry:{type:'Polygon',coordinates:[[[x-4,z-4],[x+4,z-4],[x+4,z+4],[x-4,z+4],[x-4,z-4]]]},properties:{id:p.id,pickId:p.pick_id,label:p.name,name:p.name,kind:'building',category:'社区共建',centre:[x,z],bounds:[x-4,z-4,x+4,z+4],height:0,heightSource:'仅展示已提交部位；整栋高度未知',aliases:[],architecture:{summary:'社区资料支持的局部模型，尚未实地核实。'},scopeNote:'未建模的部位保持未知。室内细节从局部空间入口打开。'}});
}
function removeBaseline(id){
 for(const [key,b] of E.buckets){if(!b.data)continue;const keep=[];for(let i=0;i<b.count;i++)if(b.data[i*28+21]!==id)keep.push(i);if(keep.length===b.count)continue;
  if(!keep.length){E.buckets.delete(key);continue}const data=new Float32Array(keep.length*28),spatial=new Float32Array(keep.length*5);keep.forEach((i,j)=>{data.set(b.data.subarray(i*28,i*28+28),j*28);spatial.set(b.spatial.subarray(i*5,i*5+5),j*5)});b.data=data;b.spatial=spatial;b.count=keep.length;E.compileBucket(b);E.prepareRanges(b);
 }
}
function append(model,pick){
 const parents=new Map(),origin=M.transform(model.origin),g=E.gl;
 for(const n of model.nodes){const transform=M.multiply(n.parent_id?parents.get(n.parent_id):origin,M.transform(n.position,[1,1,1],n.rotation));parents.set(n.id,transform);if(n.type==='group')continue;
  let geometry,matrix=transform;if(n.type==='box'){geometry=G.box();matrix=M.multiply(transform,M.transform([0,0,0],n.size))}
  else if(n.type==='cylinder'){geometry=G.cylinder(n.segments);matrix=M.multiply(transform,M.transform([0,-n.height/2,0],[n.radius,n.height,n.radius]))}
  else{geometry=new G.Geometry();for(const face of n.indices)geometry.tri(...face.map(i=>n.vertices[i]))}
  const vertices=new Float32Array(geometry.v),resource={vertexCount:vertices.length/8,indexType:null,vertexBuffer:g.createBuffer(),indexBuffer:null};g.bindVertexArray(null);g.bindBuffer(g.ARRAY_BUFFER,resource.vertexBuffer);g.bufferData(g.ARRAY_BUFFER,vertices,g.STATIC_DRAW);
  const data=new Float32Array([...matrix,...M.color(n.color),1,0,pick,0,0,0,0,1,1]);const b={resource,vertexCount:resource.vertexCount,count:1,data,spatial:YY.Visibility.prepare(data,geometry),passes:new Map(),detailWidth:0};
  E.meshResources.push(resource);E.buckets.set('community/'+model.part_id+'/'+n.id,b);E.compileBucket(b);E.prepareRanges(b);
 }
 g.bindVertexArray(null);E.visibilityCaches.clear();E.shadowDirty=true;
}
// Exteriors join the existing scene; interiors are fetched only in the separate floor viewer.
const exteriors=models.filter(m=>m.space==='exterior');
for(const meta of exteriors){const {model}=await get(meta.url);if(meta.replaces_baseline&&meta.baseline_pick_id)removeBaseline(meta.baseline_pick_id);append(model,byPlace.get(meta.place_id).pick_id)}
const strip=document.createElement('div');strip.id='community-links';strip.style.cssText='margin-top:16px;padding-top:14px;border-top:1px solid #bbb;display:flex;flex-wrap:wrap;gap:12px;font-size:13px;';document.querySelector('#detail').append(strip);
function detail(){const p=byPick.get(Y.state.selected);strip.replaceChildren();if(!p)return;for(const [name,route] of [['提供照片','contribute'],['指出问题','feedback'],['地点档案','place']]){const a=document.createElement('a');a.textContent=name+' ↗';a.href='/'+route+'/?'+(route==='place'?'id':'place')+'='+encodeURIComponent(p.id);if(route==='feedback')a.onclick=()=>{try{Y.engine.render(Y.camera(),Y.state);const canvas=Y.engine.canvas||document.querySelector('canvas');const image=document.createElement('canvas');image.width=960;image.height=Math.round(canvas.height/canvas.width*960);image.getContext('2d').drawImage(canvas,0,0,image.width,image.height);sessionStorage.setItem('pku-feedback-context',JSON.stringify({place_id:p.id,pick_id:p.pick_id,revision:'upstream-1.2.0',model_revisions:Object.fromEntries(models.filter(m=>m.place_id===p.id).map(m=>[m.part_id,m.revision])),view:{target:[...Y.orbit.target],yaw:Y.orbit.yaw,elevation:Y.orbit.elevation,distance:Y.orbit.distance},screenshot:image.toDataURL('image/jpeg',.85)}))}catch{sessionStorage.removeItem('pku-feedback-context')}};strip.append(a)}
 if(models.some(m=>m.place_id===p.id)){const a=document.createElement('a');a.textContent='查看局部 / 室内空间 ↗';a.href='/preview/?place='+encodeURIComponent(p.id);strip.append(a)}
}
new MutationObserver(detail).observe(document.querySelector('#detail-title'),{childList:true,subtree:true});detail();
const home=document.createElement('a');home.href='/';home.textContent='← 共建北大';home.style.cssText='position:fixed;bottom:40px;left:12px;z-index:50;background:#fff;padding:8px 12px;border-radius:8px;color:#842733;font:13px sans-serif;';document.body.append(home);
window.PKU_COMMUNITY={models,places,append,removeBaseline};
const source=new URLSearchParams(location.search).get('place');if(source&&byPlace.get(source)?.pick_id)Y.select(byPlace.get(source).pick_id,true);
})().catch(()=>{console.warn('社区部位暂未载入；校园底模保持可用。')});
