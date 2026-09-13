/* Public boundary / sports polygons define approximate fence alignments.
   Gate and mapped path clearances are kept open. Height and infill are illustrative. */
(function(Y){'use strict';const F=Y.Footprints;
const excluded=new Set(['way/783033430','way/1101754966','way/1498960703','way/320679832','manual/outdoor-zone']);
// Public campus/building rings disagree by less than one metre at A-seat's
// north-west corner. Keep both source rings: only hide fence intervals inside
// that solid footprint. This is a display intersection fix, not a boundary survey.
function withoutAnimalAInterior(runs,D){
 const f=D.features.find(f=>f.properties.id==='way/1063568534');if(!f)return runs;
 const g=f.geometry,bb=f.properties.bounds,edges=F.polygons(g).flatMap(pg=>pg.flatMap(r=>r.slice(1).map((q,i)=>[r[i],q])));
 return runs.flatMap(run=>{
  if(!run.campus)return[run];const a=run.a,c=run.c;
  if(Math.max(a[0],c[0])<bb[0]||Math.min(a[0],c[0])>bb[2]||Math.max(a[1],c[1])<bb[1]||Math.min(a[1],c[1])>bb[3])return[run];
  const dx=c[0]-a[0],dz=c[1]-a[1],cuts=[0,1],cross=(x,z,u,v)=>x*v-z*u;
  for(const[p,q]of edges){const ex=q[0]-p[0],ez=q[1]-p[1],den=cross(dx,dz,ex,ez);if(Math.abs(den)<1e-10)continue;
   const px=p[0]-a[0],pz=p[1]-a[1],t=cross(px,pz,ex,ez)/den,u=cross(px,pz,dx,dz)/den;
   if(t>1e-9&&t<1-1e-9&&u>=-1e-9&&u<=1+1e-9)cuts.push(t);
  }
  cuts.sort((x,y)=>x-y);const at=t=>[a[0]+dx*t,a[1]+dz*t],out=[];
  for(let k=1;k<cuts.length;k++){const lo=cuts[k-1],hi=cuts[k];if(hi-lo<1e-9)continue;if(!F.inside(at((lo+hi)/2),g))out.push(lo===0&&hi===1?run:{...run,a:at(lo),c:at(hi)});}
  return out;
 });
}
function plan(D){const roads=D.features.filter(f=>f.properties.kind==='road'&&f.geometry.type==='LineString'),gates=D.features.filter(f=>f.properties.kind==='gate'),runs=[];
 for(const f of D.features){const p=f.properties,campus=p.kind==='boundary';if(!campus&&(p.kind!=='sport'||excluded.has(p.id)))continue;
 const mesh=!campus&&!/体育场/.test(p.label),h=campus?2.1:mesh?3.8:2.5;
 for(const pg of F.polygons(f.geometry)){let ring=pg[0];
  // User-confirmed common north-football/south-basketball alignment.
  if(p.id==='way/880624094')ring=[[226.679,503.519],[228.848,543.627],[363.795,535.375],[360.951,497.346],[226.679,503.519]];
  let entrance=null;
  // Put a minimum 3 m pedestrian opening on the outer edge nearest a mapped path.
  if(!campus){let best=Infinity;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],n=Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/2);for(let j=0;j<n;j++){const q=[a[0]+(c[0]-a[0])*(j+.5)/n,a[1]+(c[1]-a[1])*(j+.5)/n];for(const road of roads)for(let k=1;k<road.geometry.coordinates.length;k++){const d=F.distSegment(q,road.geometry.coordinates[k-1],road.geometry.coordinates[k]);if(d<best){best=d;entrance=q;}}}}}
  for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i];if((p.id==='way/880624094'&&i===2)||(p.id==='way/880624093'&&i===4))continue;const len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.max(1,Math.ceil(len/2.4));
   for(let j=0;j<n;j++){const at=t=>[a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t],aa=at(j/n),cc=at((j+1)/n),q=at((j+.5)/n),half=len/n/2;
    if(campus&&gates.some(g=>Math.hypot(q[0]-g.geometry.coordinates[0],q[1]-g.geometry.coordinates[1])<(g.properties.id==='node/2748949454'?20:g.properties.id==='node/380722026'?16:g.properties.id==='node/6018578781'?13:7)+half))continue;
    if(entrance&&Math.hypot(q[0]-entrance[0],q[1]-entrance[1])<2+half)continue;
    if(roads.some(r=>r.geometry.coordinates.slice(1).some((v,k)=>F.distSegment(q,r.geometry.coordinates[k],v)<Math.max(1.4,(r.properties.width||3)/2)+half)))continue;
    runs.push({a:aa,c:cc,height:h,mesh,source:p.id,pickId:campus?0:p.pickId,campus});
   }
  }
 }
 }
 const football=D.features.find(f=>f.properties.id==='way/880624093');
 const z=x=>538.018+(x-321.93)*(535.375-538.018)/(363.795-321.93);
 // One continuous shared boundary, with two small pedestrian entries.
 for(const [left,right]of [[230.3,360.2],[363.2,363.795]]){
 const n=Math.ceil((right-left)/2.4);for(let j=0;j<n;j++){const a=left+(right-left)*j/n,c=left+(right-left)*(j+1)/n;runs.push({a:[a,z(a)],c:[c,z(c)],height:3.8,mesh:true,source:'shared-basketball-football-v36',pickId:football.properties.pickId,campus:false});}}
 return withoutAnimalAInterior(runs,D);
}
function render(b,D){const runs=plan(D),old=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=0;b.anim=0;
 try{
 // Extend the court apron to the shared fence; the intervening strip is not a road.
 const apron=[[228.848,537.807],[363.795,530.29],[363.795,535.375],[228.848,543.627],[228.848,537.807]];
 const gg=b.geo('sports36-apron',()=>{const g=new Y.Geo.Geometry();for(const t of F.capTriangles([apron]))g.tri([t[0][0],.19,t[0][1]],[t[2][0],.19,t[2][1]],[t[1][0],.19,t[1][1]]);return g;});
 b.mesh('sports36-apron',gg,0,0,0,1,1,1,'#7c9d8b',11);
 for(const s of runs){b.id=s.pickId;const len=Math.hypot(s.c[0]-s.a[0],s.c[1]-s.a[1]),r=Math.atan2(-(s.c[1]-s.a[1]),s.c[0]-s.a[0]);b.local((s.a[0]+s.c[0])/2,.16,(s.a[1]+s.c[1])/2,r,()=>{
  const col=s.mesh?'#49675c':'#4b5b51';for(const x of[-len/2,len/2])b.box(x,s.height/2,0,.09,s.height,.09,col,29);
  for(const y of[.22,s.height-.08])b.box(0,y,0,len,.065,.065,col,29);
  if(s.campus)b.box(0,.13,0,len,.26,.34,'#a8aca0',10);
  const spacing=s.mesh?.22:.18,n=Math.ceil(len/spacing);for(let j=1;j<n;j++)b.box(-len/2+len*j/n,s.height/2,0,s.mesh?.018:.035,s.height-.16,s.mesh?.018:.035,col,29);
  if(s.mesh)for(let y=.44;y<s.height-.13;y+=.25)b.box(0,y,0,len,.015,.015,col,29);
 });}}finally{[b.origin,b.rotation,b.id,b.anim]=old;}return runs;
}
Y.Fences35={plan,render};
})(YY);
