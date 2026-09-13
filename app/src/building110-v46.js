/* 110: east end of the three-part building west of BICMR 82 court.
 * Original OSM polygon is retained. White two-storey facades, south red
 * half-hip gable and east canopy are registered to the official 2017 photo.
 * All dimensions are fitted; north facade and the western shared wall stay open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009052003';
const O=[-167.306,-309.287],R=Math.atan2(.022,10.436),CO=Math.cos(R),SI=Math.sin(R),W=10.436023188552093,D=17.044054241408194;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const H={base:.12,stone:.83,eave:7,ridge:10,hip:8.02};
const C={wall:'#e6e5da',stone:'#afb3a9',red:'#854438',roof:'#717a71',tile:'#a4aaa0',dark:'#34443e',glass:'#73867c',green:'#348b79',gold:'#b5a77a'};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const mesh=(name,g,c,mat=24)=>b.mesh('110-'+name,g,0,0,0,1,1,1,c,mat);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'110-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 function window(q){const h=q.hi-q.lo,y=(q.lo+q.hi)/2; b.box(q.x,y,-.065,q.w,h,.035,C.glass,5);
  for(let i=0;i<=3;i++)b.box(q.x-q.w/2+q.w*i/3,y,.035,.075,h+.10,.18,C.red,6);
  for(const yy of[q.lo,q.lo+h*.25,q.hi])b.box(q.x,yy,.035,q.w+.075,.075,.18,C.red,6);
  for(let i=0;i<3;i++){const xx=q.x-q.w/2+q.w*(i+.5)/3; b.box(xx,q.lo+h*.115,.067,q.w/3-.15,.025,.045,C.gold,6);}
 }
 function wall(name,a,c,holes=[]){const width=Math.hypot(c[0]-a[0],c[1]-a[1]),r=-Math.atan2(c[1]-a[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>{
  const levels=[H.base,H.stone,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
  group(name+'-wall',()=>{for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j],cuts=holes.filter(q=>q.lo<=lo+1e-8&&q.hi>=hi-1e-8).sort((a,c)=>a.x-c.x);let end=0;
   const piece=(s,e)=>{if(e>s+1e-6)b.box((s+e)/2,(lo+hi)/2,-.16,e-s,hi-lo,.32,hi<=H.stone?C.stone:C.wall,24);};
   for(const q of cuts){piece(end,q.x-q.w/2);end=q.x+q.w/2;}piece(end,width);
  }});
  group(name+'-windows',()=>holes.filter(q=>!q.door).forEach(window));
  group(name+'-trim',()=>{for(const yy of[3.42,6.74])b.box(width/2,yy,.02,width,.09,.10,C.wall,24);b.box(width/2,6.9,.025,width,.21,.13,C.red,6);});
  group(name+'-doors',()=>{for(const q of holes.filter(q=>q.door)){b.box(q.x,(q.lo+q.hi)/2,-.07,q.w,q.hi-q.lo,.05,C.dark,5);for(const xx of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(xx,(q.lo+q.hi)/2,.035,.085,q.hi-q.lo+.10,.18,C.red,6);for(const yy of[q.lo,q.hi])b.box(q.x,yy,.035,q.w+.1,.09,.18,C.red,6);}});
 });}
 b.local(O[0],0,O[1],R,()=>{
  mesh('base-original-polygon',G.polygon(poly,H.base),C.stone);mesh('ceiling-original-polygon',G.polygon(poly,H.eave-.14),C.wall);
  const southWidth=Math.hypot(poly[2][0]-poly[1][0],poly[2][1]-poly[1][1]);
  const south=Array.from({length:2},(_,floor)=>[.25,.75].map(t=>({x:southWidth*t,w:2.52,lo:floor?4.2:1.05,hi:floor?6.5:3.08}))).flat();
  wall('south-photo',poly[1],poly[2],south);
  // Four east positions are a proportional fit to three partly visible groups;
  // exact obscured window rhythm remains unverified. The canopy itself is visible.
  const eastWidth=Math.hypot(poly[3][0]-poly[2][0],poly[3][1]-poly[2][1]),fractions=[.16,.39,.63,.86];
  const east=fractions.map(t=>({x:eastWidth*t,w:2.30,lo:4.2,hi:6.5}));
  east.push(...fractions.map((t,i)=>({x:eastWidth*t,w:i===2?1.85:2.30,lo:i===2?H.base:1.05,hi:3.08,door:i===2})));
  wall('east-photo',poly[2],poly[3],east);wall('north-unverified',poly[3],poly[0]);
  // West edge is shared with 111: no exterior wall, glazing, door or porch.
  group('corners',()=>{for(const [x,z]of [[W,D],[W,0],[0,D]])b.box(x,3.92,z,.23,5.92,.23,C.red,6);});
  group('east-canopy',()=>{const z=D-eastWidth*.63;b.box(W+1.08,3.19,z,2.18,.22,3.35,C.stone,24);for(const dz of[-1.48,1.48])b.box(W+2.01,1.64,z+dz,.15,3.04,.15,C.stone,24);b.box(W+1.03,H.base+.08,z,2.06,.16,3.35,C.stone,24);});
  const cx=W/2,x0=0,x1=W+.62,z0=-.55,z1=D+.55,gn=1.35,gs=D-1.35;
  const profile=x=>H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,1-Math.abs(x-cx)/(x<cx?cx:x1-cx)),1.34);
  const main=new G.Geometry(),ends=new G.Geometry(),tiles=new G.Geometry();
  const quad=(g,a,c,z,q,fun,raise=0)=>g.quad([a,fun(a,z)+raise,z],[a,fun(a,q)+raise,q],[c,fun(c,q)+raise,q],[c,fun(c,z)+raise,z]);
  const roof=(x,z)=>profile(x);
  const endRoof=(x,z)=>{const t=z<gn?(z-z0)/(gn-z0):(z1-z)/(z1-gs);return Math.min(profile(x),H.eave+(H.hip-H.eave)*Math.pow(Math.max(0,t),1.18))+.18*Math.pow(Math.abs((x-cx)/(x<cx?cx:x1-cx)),7)*(1-t);};
  for(let i=0;i<28;i++)for(let j=0;j<28;j++)quad(main,x0+(x1-x0)*i/28,x0+(x1-x0)*(i+1)/28,gn+(gs-gn)*j/28,gn+(gs-gn)*(j+1)/28,roof);
  for(const [a,c]of[[z0,gn],[gs,z1]])for(let i=0;i<28;i++)for(let j=0;j<10;j++)quad(ends,x0+(x1-x0)*i/28,x0+(x1-x0)*(i+1)/28,a+(c-a)*j/10,a+(c-a)*(j+1)/10,endRoof);
  // Down-slope tile ribs are batched geometry, with the original detail threshold.
  for(let z=gn+.12;z<gs-.07;z+=.235)for(let i=0;i<28;i++)quad(tiles,x0+(x1-x0)*i/28,x0+(x1-x0)*(i+1)/28,z,z+.055,roof,.035);
  for(const [a,c]of[[z0,gn],[gs,z1]])for(let x=x0+.12;x<x1-.05;x+=.235)for(let j=0;j<10;j++)quad(tiles,x,x+.055,a+(c-a)*j/10,a+(c-a)*(j+1)/10,endRoof,.035);
  tiles.detailWidth=.025;mesh('north-south-xieshan-main',main,C.roof,2);mesh('north-south-xieshan-lower-hips',ends,C.roof,2);mesh('roof-tile-ribs',tiles,C.tile,2);
  // Only the photographed south gable receives a red insert; north is unverified.
  for(const [name,z,col]of[['south',gs+.008,C.red],['north',gn-.008,C.wall]]){const g=new G.Geometry();for(let i=0;i<40;i++){const a=x0+(x1-x0)*i/40,c=x0+(x1-x0)*(i+1)/40,ha=profile(a),hc=profile(c);if(ha>H.hip&&hc>H.hip){const v=[[a,H.hip,z],[c,H.hip,z],[c,hc-.025,z],[a,ha-.025,z]];g.quad(...(name==='north'?v.reverse():v));}}mesh(name+'-gable',g,col,6);}
  group('roof-trim',()=>{
   b.box(cx,H.ridge+.10,(gn+gs)/2,.28,.22,gs-gn+.16,C.tile,2);
   for(const z of[gn,gs])for(let i=0;i<28;i++){const a=x0+(x1-x0)*i/28,c=x0+(x1-x0)*(i+1)/28;b.beam([a,profile(a)+.05,z],[c,profile(c)+.05,z],.12,C.tile,2);}
   for(const x of[x1])b.box(x,6.88,D/2,.16,.30,z1-z0,C.red,6);
   for(const z of[z0,z1]){b.box((x0+x1)/2,6.88,z,x1-x0,.22,.16,C.red,6);for(const x of[.12,x1-.12]){b.box(x,6.88,z,.33,.45,.34,C.green,6);b.box(x,6.57,z,.25,.20,.27,C.green,6);}}
   for(const z of[gn,gs])b.beam([cx,H.ridge+.1,z],[cx,H.ridge+.5,z+(z<D/2?-.13:.13)],.16,C.tile,2);
  });
 });
 return {id:ID,strategy:'building110-v46',floors:2,storeysVerified:true,eaveHeight:7,ridgeHeight:10,roofAxis:'north-south',roofType:'xieshan',originalOutline:true,southWindowGroups:2,eastCanopy:true,westSharedBoundary:'way/1009052004',northFacadeVerified:false,eastWindowCountVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building110={id:ID,render,world,local,width:W,depth:D,heights:H};
})(YY);
