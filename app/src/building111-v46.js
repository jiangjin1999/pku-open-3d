/* The middle range of the three-part white building north of Cai Zhai.
 * Ground ring stays in OSM; two storeys and the south elevation are matched
 * to the BICMR photograph. Unseen north openings and all heights are fits. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009052004';
const H={base:.12,eave:7,ridge:9.5,wingRidge:10},C={wall:'#e2e3d8',stone:'#a5afa6',wood:'#914938',red:'#9f4536',glass:'#697e79',dark:'#34413a',roof:'#707a70',tile:'#9ba295',gold:'#aa9867'};
const NW=[-191.228,-309.02],NE=[-167.306,-309.287],SW=[-191.048,-292.154],SE=[-167.263,-292.243],P=1.3;
const pt=(u,v)=>{const x=SW[0]*(1-v)+NW[0]*v,z=SW[1]*(1-v)+NW[1]*v;return[x+u*((SE[0]*(1-v)+NE[0]*v)-x),z+u*((SE[1]*(1-v)+NE[1]*v)-z)];};
// The end of this roof stops at the equal-height curve on each adjoining
// north-south wing roof. There is no exposed east/west gable or outer wall.
function wingIntersection(side,height,z){
 const q=side==='west'?{o:[-202.373,-308.887],r:.01193303606916781,w:11.145793556315295,p:1.4,overhang:.40}:{o:[-167.306,-309.287],r:Math.atan2(.022,10.436),w:10.4360232,p:1.34,overhang:0};
 const t=Math.pow(Math.max(0,Math.min(1,(height-H.eave)/(H.wingRidge-H.eave))),1/q.p),half=q.w/2+q.overhang,x=q.w/2+(side==='west'?1:-1)*half*(1-t),co=Math.cos(q.r),si=Math.sin(q.r),localZ=(z-q.o[1]+x*si)/co;
 return[q.o[0]+x*co+localZ*si,height,z];
}
function roofPoint(u,v){const t=Math.max(0,1-Math.abs(2*v-1)),height=H.eave+(H.ridge-H.eave)*Math.pow(t,P),w=wingIntersection('west',height,pt(0,v)[1]),e=wingIntersection('east',height,pt(1,v)[1]);return[w[0]*(1-u)+e[0]*u,height,w[2]*(1-u)+e[2]*u];}
function render(b,f){
 b.id=f.properties.pickId;const ring=f.geometry.coordinates[0].slice(0,-1),mesh=(key,g,c,mat=24)=>b.mesh('111-'+key,g,0,0,0,1,1,1,c,mat);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...q){return old.call(this,'111-'+name+'-'+k,...q);};try{fn();}finally{b.e.add=old;}};
 mesh('base',G.polygon(ring,H.base),C.stone);mesh('ceiling',G.polygon(ring,H.eave-.12),C.wall);
 function win(q){let cy=(q.lo+q.hi)/2,h=q.hi-q.lo; b.box(q.x,cy,-.09,q.w,h,.035,C.dark,5);
  for(const x of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(x,cy,.016,.075,h+.10,.16,C.wood,6);
  for(const yy of[q.lo,q.lo+.35,q.hi-.30,q.hi])b.box(q.x,yy,.026,q.w+.09,.065,.17,C.wood,6);
  for(const x of[q.x-q.w*.34,q.x-q.w*.16,q.x+q.w*.16,q.x+q.w*.34])b.box(x,cy+.10,.044,.025,h-.72,.038,C.wood,6);
  b.box(q.x,q.lo-.09,.018,q.w+.20,.10,.21,C.stone,24);
 }
 function face(name,a,c,holes){const width=Math.hypot(c[0]-a[0],c[1]-a[1]),r=-Math.atan2(c[1]-a[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>{
  const levels=[H.base,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b).filter((v,i,a)=>i===0||v-a[i-1]>1e-8);
  group(name+'-wall',()=>{for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+1e-8&&q.hi>=hi-1e-8).sort((a,b)=>a.x-b.x);let cursor=0;const part=(s,e)=>{if(e>s+1e-7)b.box((s+e)/2,(lo+hi)/2,-.14,e-s,hi-lo,.28,hi<1.0?C.stone:C.wall,24);};for(const q of cuts){part(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}part(cursor,width);}});
  group(name+'-windows',()=>holes.forEach(win));
  if(name==='south'||name==='north'){group(name+'-trim',()=>{b.box(width/2,.73,.02,width,.10,.12,C.stone,24);b.box(width/2,3.61,.02,width,.075,.11,C.stone,24);b.box(width/2,6.80,.025,width,.32,.15,C.red,6);});}
 });}
 const southWidth=Math.hypot(SE[0]-SW[0],SE[1]-SW[1]),northWidth=Math.hypot(NE[0]-NW[0],NE[1]-NW[1]);
 const holes=w=>[0,1].flatMap(f=>Array.from({length:6},(_,i)=>({x:w*(i+.5)/6,w:2.28,lo:1.01+3.35*f,hi:3.03+3.35*f})));
 // All six southern openings are a photo-proportioned count fit; the north
 // uses a restrained provisional row and is not marked as surveyed.
 face('south',SW,SE,holes(southWidth));face('north',NE,NW,holes(northWidth));
 face('east-shared',SE,NE,[]);face('west-shared',NW,[-191.065,-293.608],[]);face('west-shared-short',[-191.065,-293.608],SW,[]);
 const roof=new G.Geometry(),tile=new G.Geometry(),nu=48,nv=24;
 function patch(g,u0,u1,v0,v1,dy=0){const pp=[roofPoint(u0,v0),roofPoint(u1,v0),roofPoint(u1,v1),roofPoint(u0,v1)].map(q=>[q[0],q[1]+dy,q[2]]);g.quad(...pp);}
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++)patch(roof,i/nu,(i+1)/nu,-.025+1.05*j/nv,-.025+1.05*(j+1)/nv);
 for(let i=0;i<103;i++)for(let j=0;j<nv;j++)patch(tile,i/103,Math.min(1,i/103+.003),-.025+1.05*j/nv,-.025+1.05*(j+1)/nv,.028);
 tile.detailWidth=.04;mesh('roof-surface',roof,C.roof,2);mesh('roof-tiles',tile,C.tile,2);
 group('ridge',()=>{const a=roofPoint(0,.5),c=roofPoint(1,.5);b.beam([a[0],a[1]+.09,a[2]],[c[0],c[1]+.09,c[2]],.22,C.tile,2);});
 group('eaves',()=>{for(const v of[-.025,1.025]){const a=roofPoint(0,v),c=roofPoint(1,v);b.beam([a[0],6.89,a[2]],[c[0],6.89,c[2]],.20,C.red,6);for(let i=0;i<103;i++){const q=roofPoint((i+.5)/103,v);b.box(q[0],6.97,q[2],.12,.10,.24,C.tile,2);b.box(q[0],6.78,q[2],.07,.10,.16,C.gold,6);}}});
 return{id:ID,strategy:'building111-v46',floors:2,storeysVerified:true,originalOutline:true,roofAxis:'east-west',eaveHeight:H.eave,ridgeHeight:H.ridge,sharedWalls:['east','west'],entryInvented:false,allFacadesVerified:false,heightsMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building111={id:ID,render,roofPoint,wingIntersection,pt,heights:H};
})(YY);
