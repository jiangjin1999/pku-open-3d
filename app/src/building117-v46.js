/* A-seat: own 2013 road-linked panoramas establish a west low room,
 * a two-storey middle annex and a three-storey eastern block. The old
 * north-road OSM ring is kept; segment seams/heights are photo/native fits.
 * The 2024 facade repair and hidden north face remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/1063568534';
const CUT1=-377.767,CUT2=-359.055,BASE=.25;
const C={wall:'#d2d0c3',base:'#929488',roof:'#93998d',frame:'#5a625d',glass:'#667e77',canopy:'#c6c8bd',red:'#754c3f',sign:'#414b46'};
function clipHalfPlane(geometry,distance,keep){
 const p=geometry.coordinates[0].slice(0,-1),out=[];
 for(let i=0;i<p.length;i++){
  const a=p[i],b=p[(i+1)%p.length];
  const signed=q=>{const d=distance(q);return Math.abs(d)<1e-9?0:d*keep;};
  const da=signed(a),db=signed(b),ia=da>=0,ib=db>=0;
  if(ia)out.push(a.slice());
  if(ia!==ib){const t=da/(da-db);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}
 }
 const clean=out.filter((q,i)=>!i||Math.hypot(q[0]-out[i-1][0],q[1]-out[i-1][1])>1e-9);
 if(clean.length>1&&Math.hypot(clean[0][0]-clean.at(-1)[0],clean[0][1]-clean.at(-1)[1])<1e-9)clean.pop();
 // Discard a zero-area boundary excursion left when both ends of the source
 // elbow lie exactly on the clipping line; retaining it would extrude a fin.
 for(let changed=true;changed&&clean.length>3;){
  changed=false;
  for(let i=0;i<clean.length;i++){const a=clean[(i+clean.length-1)%clean.length],b=clean[i],c=clean[(i+1)%clean.length];
   if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<1e-8){clean.splice(i,1);changed=true;break;}
  }
 }
 return {type:'Polygon',coordinates:[[...clean,clean[0].slice()]]};
}
function clipped(geometry,lo,hi){return clipHalfPlane(clipHalfPlane(geometry,p=>p[0]-lo,1),p=>p[0]-hi,-1);}
function elbowDistance(geometry,p){
 const a=geometry.coordinates[0][1],b=geometry.coordinates[0][2];
 return p[0]-a[0]-(p[1]-a[1])*(b[0]-a[0])/(b[1]-a[1]);
}
function partitionBodies(geometry){
 // Continue the original slanted re-entrant edge into the north wall. An
 // averaged vertical x cut leaves a centimetre-wide, full-height fin in the
 // southern middle annex; the source-aligned split keeps that annex low.
 return [clipped(geometry,-392,CUT1),
  clipHalfPlane(clipped(geometry,CUT1,-329),p=>elbowDistance(geometry,p),-1),
  clipHalfPlane(geometry,p=>elbowDistance(geometry,p),1)];
}
function render(b,f){
 const saved=[b.origin,b.rotation,b.id,b.anim];b.id=f.properties.pickId;b.anim=0;
 const mesh=(key,g,col,mat=24)=>b.mesh('117-'+key,g,0,0,0,1,1,1,col,mat);
 // All of these primitives use the same unit-box geometry; keep their exact
 // instance order, transforms, colors and material IDs in one dedicated bucket.
 const box=(key,x,y,z,w,h,d,col,mat=24)=>b.mesh('117-unit-box-instances',b.geo('117-unit-box',G.box),x,y,z,w,h,d,col,mat);
 const south=x=>x<CUT2?-432.291+(x+391.047)*(1.344/32.009):-437.942+(x+359.072)*(-.122/29.55);
 function body(key,q,top){
  mesh(key+'-walls',F.walls(q,BASE,top),C.wall);
  mesh(key+'-deck',F.surface(q,top),C.roof,22);
  // Short parapets follow this segment's actual source perimeter, including
  // its west clipped corner; seam edges do not receive duplicate parapets.
  const p=q.coordinates[0];
  for(let i=0;i<p.length-1;i++){
   const a=p[i],c=p[i+1];if((Math.abs(a[0]-CUT1)<1e-7&&Math.abs(c[0]-CUT1)<1e-7)||(Math.abs(elbowDistance(f.geometry,a))<1e-7&&Math.abs(elbowDistance(f.geometry,c))<1e-7))continue;
   const dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
   b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,-Math.atan2(dz,dx),()=>box(key+'-parapet',0,top+.16,0,length,.32,.16,C.wall));
  }
 }
 function southWindow(key,x,y,w,h){
  const z=south(x)+.065;
  box(key+'-dark-frame',x,y,z,w+.13,h+.13,.085,C.frame);
  box(key+'-glass',x,y,z+.05,w,h,.045,C.glass,28);
  box(key+'-split',x,y,z+.085,.055,h,.045,C.frame);
 }
 try{
  mesh('original-ring-plinth',F.walls(f.geometry,.015,BASE),C.base);
  const parts=partitionBodies(f.geometry);
  body('west-one-storey',parts[0],3.48);
  body('middle-two-storey',parts[1],6.94);
  body('east-three-storey',parts[2],10.48);
  // The low west service room has wide barred windows and a brown door.
  for(const x of[-387.9,-382.9]){
   southWindow('west-barred-opening',x,1.92,2.08,1.42);
   for(let j=-3;j<=3;j++)box('west-window-bars',x+j*.25,1.92,south(x)+.20,.035,1.48,.035,C.frame);
  }
  box('west-service-door',-379.45,1.45,south(-379.45)+.08,1.24,2.38,.085,C.red);
  box('west-door-canopy',-379.45,2.83,south(-379.45)+.42,1.70,.16,.90,C.canopy);
  // Locations are independently fitted within the visible middle wall. The
  // complete bay count and unseen north wall are deliberately not asserted.
  for(const x of[-375.0,-371.1,-367.2,-363.3])for(const y of[1.94,5.27])southWindow('middle-south',x,y,1.37,1.82);
  box('middle-west-door',-376.6,1.45,south(-376.6)+.10,1.12,2.38,.10,C.red);
  box('middle-west-door-canopy',-376.6,2.91,south(-376.6)+.60,1.58,.16,1.24,C.canopy);
  // Thin white projections under the upper windows are visible in the own
  // close south panorama; equipment locations and north openings stay open.
  for(const x of[-375.0,-371.1])for(let j=-2;j<=2;j++)box('middle-upper-small-fin',x+j*.22,4.17,south(x)+.23,.10,.44,.31,C.wall);
  // On the middle east end an open second-floor landing meets the setback
  // main building. Only the visible platform/rail/canopy are reconstructed;
  // the hidden stair run is not guessed.
  box('middle-east-platform-ground-room',CUT2+1.00,1.90,-433.30,2.04,3.30,2.10,C.wall);
  box('middle-east-ground-door-frame',CUT2+.80,1.47,-432.205,1.22,2.48,.085,C.frame);
  box('middle-east-ground-door',CUT2+.80,1.47,-432.15,1.10,2.36,.07,C.wall);
  box('middle-east-landing',CUT2+1.00,3.60,-433.30,2.04,.18,2.10,C.canopy);
  box('middle-east-landing-canopy',CUT2+1.00,5.89,-433.30,2.16,.14,2.22,C.red);
  for(const z of[-434.27,-432.32]){
   box('landing-end-post',CUT2+1.96,4.63,z,.075,2.07,.075,C.red);
   for(let j=0;j<=5;j++)box('landing-end-railing',CUT2+j*.385,4.10,z,.035,.91,.035,C.frame);
   box('landing-end-handrail',CUT2+.97,4.55,z,1.98,.055,.055,C.frame);
  }
  for(let j=0;j<=6;j++)box('landing-front-railing',CUT2+1.96,4.10,-434.27+j*.325,.035,.91,.035,C.frame);
  // Eastern block has two continuous upper window bands, horizontal hoods,
  // an eastern strip of vertical fins, and a south-facing ground lobby.
  for(const y of[5.30,8.52]){
   const x=-345.70,z=south(x)+.07;
   box('east-long-dark-band',x,y,z,21.0,1.61,.08,C.frame);
   box('east-long-glass-band',x,y,z+.05,20.82,1.46,.045,C.glass,28);
   for(let j=0;j<=12;j++)box('east-band-mullion',x-10.41+j*20.82/12,y,z+.08,.055,1.50,.045,C.frame);
   box('east-band-hood',x,y+.98,z+.31,21.24,.20,.65,C.red);
  }
  // The fin rhythm and two upper storeys come from the registered 2013 view;
  // metre dimensions and precise pane subdivisions remain fitted.
  for(let i=0;i<7;i++)box('east-south-vertical-fin',-333.50+i*.54,7.21,south(-331.8)+.39,.19,6.50,.73,C.wall);
  box('east-ground-lobby-door',-337.5,1.70,south(-337.5)+.06,3.23,2.88,.09,C.glass,28);
  for(const dx of[-1.615,0,1.615])box('east-lobby-door-frame',-337.5+dx,1.70,south(-337.5)+.13,.085,2.94,.075,C.frame);
  box('east-dark-letter-wall',-332.87,1.78,south(-332.87)+.09,5.08,3.16,.12,C.sign);
  box('east-lobby-canopy',-336.20,3.86,south(-336.2)+1.08,13.42,.34,2.34,C.canopy);
  box('east-lobby-platform',-335.25,.40,south(-335.25)+1.15,10.66,.30,2.60,C.base);
  for(let j=0;j<4;j++)box('east-lobby-south-step',-335.25,.065*(4-j),south(-335.25)+2.57+j*.31,10.66,.13*(4-j),.35,C.wall);
  // The east end has no giant glazed facade; the identified A-seat wall is
  // predominantly solid, with a small northern column of ordinary windows.
  for(const y of[1.93,5.30,8.52])for(const z of[-441.65,-445.0])box('east-end-opening',-329.485,y,z,.075,1.52,1.12,C.glass,28);
 }finally{[b.origin,b.rotation,b.id,b.anim]=saved;}
 return {id:ID,strategy:'building117-v46',segmentFloors:[1,2,3],originalOutline:true,sourceDate:'2013-09-16',southLobby:true,hiddenStairRunAdded:false,northFacadeVerified:false,partitionMeasured:false,heightMeasured:false,currentFacadeVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building117={id:ID,render,clipped,partitionBodies,elbowDistance,seams:[CUT1,CUT2],tops:[3.48,6.94,10.48]};
})(YY);
