/* Canopy regions checked against assets/campus-imagery.jpg (2026-01-11).
   The mapped green boundaries are retained. Individual trees are indicative,
   not a tree census; open lawns are not automatically treated as woodland. */
(function(Y){'use strict';
const F=Y.Footprints;
const zones=[
 {id:'way/876533967',label:'未名湖周边树群',spacing:12,height:[7,12],limit:460},
 {id:'way/1101205978',label:'镜春园树群',spacing:13,height:[6,10],limit:260},
 {id:'way/531129099',label:'燕南园树群',spacing:12,height:[6,10],limit:180},
 // V40: winter aerial canopy belts beside the Jingyuan courts and science avenue.
 // These are additional indicative groves, not individually surveyed trees.
 {id:'way/1100981080',label:'静园东侧院落树荫',spacing:10,height:[8,13],limit:70},
 {id:'way/1100981081',label:'静园西侧院落树荫',spacing:10,height:[8,13],limit:70},
 {id:'way/1100981088',label:'理科一号楼西侧北段树荫',spacing:10,height:[7,11],limit:16},
 {id:'way/1100981089',label:'理科一号楼西侧南段树荫',spacing:10,height:[7,11],limit:16}

];
function originalPoints(D){
 const random=Y.M.rng(330909),trees=[],solids=D.features.filter(f=>['building','sport','water','pier','heritage','gate'].includes(f.properties.kind)),roads=D.features.filter(f=>f.properties.kind==='road');
 const distanceToRing=(p,r)=>Math.min(...r.slice(1).map((q,i)=>F.distSegment(p,r[i],q)));
 function clear(p){
  for(const f of solids){const b=f.properties.bounds;
   if(f.geometry.type==='Point'){
    const radius=f.properties.kind==='gate'?Math.max(9,(f.properties.displayRadius||18)*.55):Math.max(5,...(f.properties.envelopeMetres||[5]));
    if(Math.hypot(p[0]-f.properties.centre[0],p[1]-f.properties.centre[1])<radius)return false;
   }else if(p[0]>b[0]-5&&p[0]<b[2]+5&&p[1]>b[1]-5&&p[1]<b[3]+5){
    if(F.inside(p,f.geometry)||F.polygons(f.geometry).some(pg=>pg.some(r=>distanceToRing(p,r)<5)))return false;
   }
  }
  for(const f of roads){const b=f.properties.bounds,w=(f.properties.width||3)/2+4;if(p[0]<b[0]-w||p[0]>b[2]+w||p[1]<b[1]-w||p[1]>b[3]+w)continue;
   if(f.geometry.type==='LineString'){const r=f.geometry.coordinates;if(r.slice(1).some((q,i)=>F.distSegment(p,r[i],q)<w))return false;}
   else if(F.inside(p,f.geometry)||F.polygons(f.geometry).some(pg=>pg.some(r=>distanceToRing(p,r)<4)))return false;
  }
  return true;
 }
 for(const zone of zones){const f=D.landcover.find(f=>f.id===zone.id);if(!f)continue;const r=f.ring,xs=r.map(p=>p[0]),zs=r.map(p=>p[1]),candidates=[];
  const left=Math.min(...xs),top=Math.min(...zs),width=Math.max(...xs)-left,depth=Math.max(...zs)-top,minGap=zone.spacing*.73;
  for(let attempt=0;attempt<Math.ceil(width*depth/zone.spacing**2)*10;attempt++){
   const p=[left+random()*width,top+random()*depth];
   if(!F.insideRing(p,r)||!clear(p)||candidates.some(t=>Math.hypot(t.point[0]-p[0],t.point[1]-p[1])<minGap))continue;
   candidates.push({point:p,height:zone.height[0]+random()*(zone.height[1]-zone.height[0]),zone:zone.id,rank:random()});
  }
  // Sampling across the whole region avoids filling only its western edge.
  candidates.sort((a,b)=>a.rank-b.rank);trees.push(...candidates.slice(0,zone.limit));
 }
 return trees.map((t,i)=>({...t,id:800000+i}));
}
Y.Vegetation33={generate:originalPoints,zones};
})(YY);

/* V46: reviewed native aerial belts. OSM grass polygons alone do NOT plant trees.
   Existing sample identities are retained; new belts have independent seeds/IDs. */
(function(Y){'use strict';const F=Y.Footprints,previous=Y.Vegetation33.generate;
const belts=[
 {id:'way/1099363914',label:'图书馆东侧北段树带',spacing:8.5,height:[10,14]},
 {id:'way/1099363915',label:'图书馆东侧中段树带',spacing:8.5,height:[10,14]},
 {id:'way/1099363916',label:'图书馆东南路旁树群',spacing:9,height:[9,13]},
 {id:'way/1100981083',label:'图书馆东前庭北侧树带',spacing:11,height:[9,13]},
 {id:'way/1100981084',label:'图书馆东前庭南侧树带',spacing:11,height:[9,13]},
 {id:'way/1100981086',label:'图书馆东邻北列院边树带',spacing:9,height:[8,12]},
 {id:'way/1100981087',label:'图书馆东邻南列院边树带',spacing:9,height:[8,12]},
 {id:'way/1111656413',label:'二教西侧树带',spacing:9,height:[9,13]},
 {id:'way/1111656414',label:'二教西侧中段树带',spacing:9,height:[9,12]},
 {id:'way/1111656415',label:'二教西侧南段树带',spacing:9,height:[9,12]},
 {id:'way/1100981090',label:'南区宿舍东侧院落树群',spacing:10,height:[8,13]},
 {id:'way/1101754964',label:'南区操场西侧院落树群',spacing:10,height:[8,13]},
 {id:'way/1101490163',label:'南区宿舍北庭西树群',spacing:10,height:[8,12]},
 {id:'way/1101490164',label:'南区宿舍北庭东树群',spacing:10,height:[8,12]},
 {id:'way/1101490165',label:'南区宿舍南庭西树群',spacing:10,height:[8,12]},
 {id:'way/1101490166',label:'南区宿舍南庭东树群',spacing:10,height:[8,12]},
 // Only the wooded northern end seen behind the monument photo; the lawn stays open.
 {id:'way/226703004',label:'静园北端纪念碑旁树群',spacing:13,height:[10,14],clip:[-193,99,-135,138],limit:7,type:'pine'}
];
const within=(p,r)=>p[0]>=r[0]&&p[0]<=r[2]&&p[1]>=r[1]&&p[1]<=r[3];
function makeClear(D){
 const boundary=D.features.find(f=>f.properties.kind==='boundary'),solids=D.features.filter(f=>['building','water','sport','pier','heritage','gate'].includes(f.properties.kind)),roads=D.features.filter(f=>f.properties.kind==='road');
 const edge=(p,g)=>{let d=Infinity;for(const poly of F.polygons(g))for(const r of poly)for(let i=1;i<r.length;i++)d=Math.min(d,F.distSegment(p,r[i-1],r[i]));return d;};
 function clear(p,radius=4){
  if(boundary&&!F.inside(p,boundary.geometry))return false;
  if(Y.Building010?.excludeGeneratedTree(p))return false;
  if(Y.Landscape42?.officeTrees.some(t=>Math.hypot(p[0]-t.point[0],p[1]-t.point[1])<8))return false;
  for(const f of solids){const q=f.properties,g=f.geometry,k=q.kind,margin=k==='building'?radius+.55:k==='water'?2.0:k==='sport'?3:4;
   if(g.type==='Point'){const r=k==='gate'?Math.max(9,(q.displayRadius||18)*.55):Math.max(5,...(q.envelopeMetres||[5]));if(Math.hypot(p[0]-q.centre[0],p[1]-q.centre[1])<r+1)return false;continue;}
   const b=q.bounds;if(p[0]<b[0]-margin||p[0]>b[2]+margin||p[1]<b[1]-margin||p[1]>b[3]+margin)continue;
   if(F.inside(p,g)||edge(p,g)<margin)return false;
  }
  for(const f of roads){const q=f.properties,g=f.geometry,margin=(q.width||3)/2+1.05,b=q.bounds;
   if(p[0]<b[0]-margin||p[0]>b[2]+margin||p[1]<b[1]-margin||p[1]>b[3]+margin)continue;
   if(g.type==='LineString'){const r=g.coordinates;for(let i=1;i<r.length;i++)if(F.distSegment(p,r[i-1],r[i])<margin)return false;}
   else if(F.inside(p,g)||edge(p,g)<1.2)return false;
  }
  return true;
 }
 return clear;
}
function describe(t){
 const R=Y.M.rng(Math.imul(t.id,2654435761)),p=t.point;
 let type=t.type||(['broad','spreading','upright'][Math.floor(R()*3)]),height=t.height;
 // Native image shows large mature crowns in these groves, not evenly sized saplings.
 if(t.zone==='way/876533967'){const cohort=.93+.21*(.5+.5*Math.sin(p[0]*.037+p[1]*.021));height*=cohort;
  // The source names pine/cypress dominance on the island; individual taxonomy remains approximate.
  if(within(p,[-94,-194,-19,-133]))type=t.id%4===0?'cypress':t.id%4===1?'broad':'pine';
  else if(within(p,[-110,-54,-26,14])||within(p,[-235,-70,-180,-26]))type=t.id%3===0?'broad':'pine';
 }
 const radius=height*(type==='cypress'?.245:type==='upright'?.41:type==='spreading'||type==='willow'?.58:.50);
 return{...t,type,height,crownRadius:radius,trunkRadius:.027*height,zoneLabel:t.zoneLabel||Y.Vegetation33.zones.find(z=>z.id===t.zone)?.label||t.zone,basis:'树群/树带：原生航片人工判读；种类仅到景观形态，落点和树高近似'};
}
function generate(D){
 const clear=makeClear(D),out=[];
 for(const raw of previous(D)){const t=describe(raw);if(clear(t.point,t.crownRadius))out.push(t);}
 for(let bi=0;bi<belts.length;bi++){
  const z=belts[bi],f=D.landcover.find(f=>f.id===z.id);if(!f)continue;
  const xs=f.ring.map(p=>p[0]),zs=f.ring.map(p=>p[1]),bb=z.clip||[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)],R=Y.M.rng(460913+bi*907),trials=Math.min(480,Math.ceil((bb[2]-bb[0])*(bb[3]-bb[1])/z.spacing**2)*18);
  for(let a=0;a<trials;a++){
   const point=[bb[0]+R()*(bb[2]-bb[0]),bb[1]+R()*(bb[3]-bb[1])],height=z.height[0]+R()*(z.height[1]-z.height[0]);
   if(!F.insideRing(point,f.ring))continue;
   const t=describe({id:810000+bi*500+a,point,height,type:z.type,zone:z.id,zoneLabel:z.label});
   if(!clear(point,t.crownRadius)||out.some(q=>Math.hypot(q.point[0]-point[0],q.point[1]-point[1])<Math.max(z.spacing*.85,(q.crownRadius+t.crownRadius)*.67)))continue;
   out.push(t);
   if(z.limit&&out.filter(q=>q.zone===z.id).length>=z.limit)break;
  }
 }
 return out;
}
Y.Vegetation33={...Y.Vegetation33,generate,belts,makeClear,describe};
})(YY);
