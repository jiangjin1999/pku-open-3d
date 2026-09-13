/* 105: the two-storey white archaeology building west of Red Lake.
 * Own T outline, intersecting north-south and east-west xieshan roofs,
 * east red gable and lakeside door from 2015 photo and aerial frames 33-38.
 * Absolute heights and obscured facades are fitted; 107 is a separate building. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009051998';
const O=[-325.91,-413.848],H={base:.50,eave:7.75,ridge:13.95},C={wall:'#e4e2d8',base:'#b6b8ab',wood:'#784334',red:'#993f32',roof:'#737b6d',tile:'#969e8c',dark:'#35473e',stone:'#c8c8b9',beam:'#3c6558',gold:'#b7a26e'};
const local=p=>[p[0]-O[0],p[1]-O[1]],world=(x,z)=>[x+O[0],z+O[1]];
// The coordinates and dimensions below belong to way/1009051998 only.
const roofs=[{name:'north-south',axis:'z',cx:16.05,cz:18.63,long:39.26,half:10.77,inset:2.35,end0:true,end1:false},{name:'east-west',axis:'x',cx:15.85,cz:38.26,long:33.80,half:10.75,inset:2.40,end0:true,end1:true}];
function render(b,f){b.id=f.properties.pickId;
 const mesh=(name,g,c,mat=24)=>b.mesh('105-'+name,g,0,0,0,1,1,1,c,mat);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'105-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 function face(name,a,q,holes,observed=false){const dx=q[0]-a[0],dz=q[1]-a[1],width=Math.hypot(dx,dz);b.local(a[0],0,a[1],-Math.atan2(dz,dx),()=>group(name,()=>{
  const levels=[0,H.base,H.eave,...holes.flatMap(h=>[h.lo,h.hi])].filter((v,i,s)=>s.indexOf(v)===i).sort((a,b)=>a-b);
  for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j],cuts=holes.filter(h=>h.lo<=lo+1e-8&&h.hi>=hi-1e-8).sort((a,b)=>a.x-b.x);let cursor=0;const wall=(l,r)=>{if(r>l+1e-7)b.box((l+r)/2,(lo+hi)/2,-.17,r-l,hi-lo,.34,hi<=H.base?C.base:C.wall,24);};for(const h of cuts){wall(cursor,h.x-h.w/2);cursor=h.x+h.w/2;}wall(cursor,width);}
  for(const h of holes){const mid=(h.lo+h.hi)/2,height=h.hi-h.lo;
   b.box(h.x,mid,-.11,h.w-.02,height-.02,.05,h.door?C.red:C.dark,h.door?6:5);
   const panes=h.door?4:2;
   for(let i=0;i<=panes;i++)b.box(h.x-h.w/2+h.w*i/panes,mid,.015,.064,height+.07,.22,C.wood,6);
   for(const y of[h.lo,h.hi])b.box(h.x,y,.015,h.w+.08,.065,.22,C.wood,6);
   if(h.door){for(let i=0;i<4;i++)for(let y=1.05;y<2.63;y+=.25)b.box(h.x-h.w/2+h.w*(i+.5)/4,y,.031,h.w/4-.10,.027,.05,C.gold,6);}
   else {for(let y=h.lo+.21;y<h.hi-.12;y+=.30)b.box(h.x,y,.026,h.w-.10,.025,.07,C.red,6);b.box(h.x,h.lo-.07,.04,h.w+.21,.10,.28,C.stone,24);}
  }
  b.box(width/2,H.base,.018,width,.085,.11,C.stone,24);
  // Narrow painted eave band is visible on the east elevation. Its motifs
  // are restrained fitted rectangles, not traced or claimed exact artwork.
  b.box(width/2,H.eave-.23,.10,width,.38,.40,C.beam,6);
  if(observed)for(let x=.60;x<width;x+=2.4)b.box(x,H.eave-.23,.305,.45,.13,.024,C.gold,9);
 }));}
 function openings(width,count){const a=[];for(let j=0;j<count;j++)for(const [lo,hi]of[[1.10,3.12],[4.65,6.82]])a.push({x:width*(j+.5)/count,w:Math.min(1.76,width/count*.47),lo,hi});return a;}
 function point(r,u,v){return r.axis==='x'?[r.cx+u,r.cz+v]:[r.cx+v,r.cz+u];}
 function uv(r,p){return r.axis==='x'?[p[0]-r.cx,p[1]-r.cz]:[p[1]-r.cz,p[0]-r.cx];}
 function roofHeight(r,p){const [u,v]=uv(r,p),q=1-Math.abs(v)/r.half;if(q<0||Math.abs(u)>r.long/2+.0001)return -Infinity;
  const limits=[];if(r.end0)limits.push((u+r.long/2)/r.inset*.25);if(r.end1)limits.push((r.long/2-u)/r.inset*.25);
  // The hipped apron terminates below the red gable. Upper roof exists only
  // behind the inset gable plane, unlike a full hip roof.
  if((r.end0&&u<-r.long/2+r.inset)||(r.end1&&u>r.long/2-r.inset))return H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,Math.min(q,...limits)),1.30);
  return H.eave+(H.ridge-H.eave)*Math.pow(q,1.30);
 }
 function clipAbove(poly,other){if(!other)return poly;const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],da=p[1]-roofHeight(other,[p[0],p[2]]),db=q[1]-roofHeight(other,[q[0],q[2]]),a=da>=-.00001,b=db>=-.00001;if(a)out.push(p);if(a!==b){if(!Number.isFinite(da)||!Number.isFinite(db)){out.push(a?p:q);continue;}const t=da/(da-db);out.push(p.map((v,k)=>v+(q[k]-v)*t));}}return out;}
 function roof(r,other){const surface=new G.Geometry(),tiles=new G.Geometry(),gable=new G.Geometry();
  const bounds=t=>[-r.long/2+(r.end0?r.inset*Math.min(t/.25,1):0),r.long/2-(r.end1?r.inset*Math.min(t/.25,1):0)];
  const pt=(u,t,s)=>{const p=point(r,u,s*r.half*(1-t));return[p[0],H.eave+(H.ridge-H.eave)*Math.pow(t,1.30),p[1]];};
  const emit=(g,p,dy=0)=>{const a=clipAbove(p,other);for(let j=1;j<a.length-1;j++){let v=[a[0],a[j],a[j+1]].map(q=>[q[0],q[1]+dy,q[2]]);const n=(v[1][2]-v[0][2])*(v[2][0]-v[0][0])-(v[1][0]-v[0][0])*(v[2][2]-v[0][2]);if(n<0)v.reverse();g.tri(...v);}};
  for(const side of[-1,1])for(let j=0;j<32;j++){const t=j/32,z=(j+1)/32,[a,c]=bounds(t),[d,e]=bounds(z);
   for(let k=0;k<64;k++){const u=k/64,v=(k+1)/64;emit(surface,[pt(a+(c-a)*u,t,side),pt(a+(c-a)*v,t,side),pt(d+(e-d)*v,z,side),pt(d+(e-d)*u,z,side)]);}
   for(let u=-r.long/2+.07;u<r.long/2;u+=.23)for(let k=0;k<3;k++){const lo=u+k*.026,hi=lo+.026,L=Math.max(lo,a,d),R=Math.min(hi,c,e);if(R>L)emit(tiles,[pt(L,t,side),pt(R,t,side),pt(R,z,side),pt(L,z,side)],.017+Math.sin((k+.5)*Math.PI/3)*.033);}
  }
  // Hipped aprons across the gable ends, one at the north end and two on
  // the transverse bar. The south end of the stem is a roof junction.
  for(const [end,on]of[[-1,r.end0],[1,r.end1]])if(on){const outer=end*r.long/2,inner=outer-end*r.inset;
   for(let j=0;j<8;j++){const t=j/8,z=(j+1)/8;const u=outer+(inner-outer)*t,v=outer+(inner-outer)*z,w=r.half*(1-.25*t),w1=r.half*(1-.25*z);
    for(let k=0;k<48;k++){const a=-1+2*k/48,c=-1+2*(k+1)/48;const make=(u,w,t)=>{const p=point(r,u,w);return[p[0],H.eave+(H.ridge-H.eave)*Math.pow(.25*t,1.30),p[1]];};emit(surface,[make(u,a*w,t),make(u,c*w,t),make(v,c*w1,z),make(v,a*w1,z)]);}
   }
   const u=inner-end*.02;for(const s of[-1,1])for(let j=0;j<24;j++){const t=.25+.75*j/24,z=.25+.75*(j+1)/24,a=pt(u,t,s),q=pt(u,z,s),base=H.eave+(H.ridge-H.eave)*Math.pow(.25,1.30);const vs=[[a[0],base,a[2]],a,q,[q[0],base,q[2]]];for(let k=1;k<3;k++)gable.tri(vs[0],vs[k],vs[k+1]);}
  }
  tiles.detailWidth=.026;mesh('roof-'+r.name+'-surface',surface,C.roof,2);mesh('roof-'+r.name+'-tiles',tiles,C.tile,2);mesh('roof-'+r.name+'-red-gables',gable,C.red,6);
  group('roof-'+r.name+'-trim',()=>{const [a,c]=bounds(1),p=point(r,a,0),q=point(r,c,0);b.beam([p[0],H.ridge+.10,p[1]],[q[0],H.ridge+.10,q[1]],.23,C.tile,2);
   for(const [u,on,sg]of[[a,r.end0,-1],[c,r.end1,1]])if(on){const p=point(r,u,0),q=point(r,u+sg*.22,0);b.beam([p[0],H.ridge,p[1]],[q[0],H.ridge+.59,q[1]],.17,C.tile,2);}
   for(const s of[-1,1])for(let k=0;k<80;k++){const u=-r.long/2+r.long*(k+.5)/80,p=pt(u,0,s);if(p[1]<roofHeight(other,[p[0],p[2]])-.01)continue;const q=point(r,u,s*(r.half-.12));b.box(q[0],H.eave-.10,q[1],r.axis==='x'?.13:.40,.13,r.axis==='x'?.40:.13,C.tile,2);}
  });
 }
 b.local(O[0],0,O[1],0,()=>{
  const ring=f.geometry.coordinates[0].slice(0,-1).map(local);mesh('original-footprint-base',G.polygon(ring,H.base),C.stone);mesh('ceiling',G.polygon(ring,H.eave-.15),C.wall);
  // East stem: five upper windows; lower south bay is the photographed door.
  const eastA=ring[4],eastB=ring[3],eastW=Math.hypot(eastB[0]-eastA[0],eastB[1]-eastA[1]);const east=openings(eastW,5);east[0]={x:eastW/10,w:3.35,lo:H.base,hi:3.35,door:true};face('east-main-observed',eastA,eastB,east,true);
  const wingA=ring[6],wingB=ring[5],wingW=Math.hypot(wingB[0]-wingA[0],wingB[1]-wingA[1]);face('east-transverse-observed',wingA,wingB,openings(wingW,3),true);
  // Other elevations keep explicit fitted openings. Their count is not a
  // claimed photographic fact; source ring and the two-storey scale remain.
  const counts={0:1,1:6,2:4,4:1,6:3,7:1,8:2,9:3};for(let i=0;i<ring.length;i++){if(i===3||i===5)continue;const a=ring[(i+1)%ring.length],c=ring[i],w=Math.hypot(c[0]-a[0],c[1]-a[1]);face('face-'+i+'-fitted',a,c,openings(w,counts[i]||1));}
  roof(roofs[0],roofs[1]);roof(roofs[1],roofs[0]);
 });
 return{id:ID,strategy:'building105-v46',storeys:2,visibleEastRows:2,sourceOutlinePreserved:true,roofAxes:['north-south','east-west'],eastMainWindowBays:5,eastTransverseWindowBays:3,doorFacing:'east',separateNorthHall:true,heightMeasured:false,allFacadesVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building105={id:ID,render,local,world,H,roofs};
})(YY);
