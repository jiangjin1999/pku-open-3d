/* New rear building: the museum occupies its western part, with a basement
 * and two public storeys. The official exterior panorama registers the
 * east-facing return entrance and south-facing log against the old biology hall.
 * Unseen elevations and the shallow middle roof are fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/628032103';
const O=[104.056,33.199],R=Math.atan2(3.153,66.82),CO=Math.cos(R),SI=Math.sin(R);
const W=Math.hypot(66.82,3.153),D=14.80,LEG=25.32,LW=13.00;
const H={base:.30,wall:7.78,cap:7.98,ridge:9.35},ENTRY={x:LW,z:19.55},LOG={x:24.5,y:1.93,z:D+2.55,r:1,length:5.6};
const C={brick:'#9caaa3',panel:'#d5d2bb',joint:'#b1b1a0',cap:'#dcddca',roof:'#7d8479',tile:'#9a9e8f',frame:'#b3beb9',glass:'#778d8c',wood:'#c09a63',log:'#81725b',end:'#a19272',green:'#377467',metal:'#929e96',dark:'#445751'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'065-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,c,mat=24)=>b.mesh('065-'+key,g,0,0,0,1,1,1,c,mat);
 const ring=f.geometry.coordinates[0].map(local);
 function window(x,lo,hi,w){
  b.box(x,(lo+hi)/2,-.065,w,hi-lo,.045,C.glass,5);
  for(const u of[-w/2,0,w/2])b.box(x+u,(lo+hi)/2,.006,.055,hi-lo+.07,.105,C.frame,9);
  for(const y of[lo,hi,hi-.40])b.box(x,y,.012,w+.08,.055,.13,C.frame,9);
  b.box(x,lo-.09,.07,w+.22,.12,.33,C.cap,24);
 }
 function face(name,x,z,r,width,bays,mode='fitted'){
  b.local(x,0,z,r,()=>group('face-'+name,()=>{
   const openings=[];
   for(let i=0;i<bays.length;i++){
    const u=bays[i];
    if(mode!=='return')openings.push({x:u,w:2.0,lo:5.38,hi:7.16});
    if(mode==='south'?(i===0||i>5):true)openings.push({x:u,w:mode==='return'?1.47:2.0,lo:1.01,hi:2.66});
   }
   if(mode==='return')openings.push({x:LEG-ENTRY.z,w:2.36,lo:H.base,hi:3.23,door:true});
   if(mode==='south')openings.push({x:1.42,w:.97,lo:H.base,hi:2.64,sideDoor:true});
   const levels=[H.base,H.wall,...openings.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
   const wall=(a,c,lo,hi)=>{if(c-a>1e-6)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,C.panel,24);};
   for(let i=1;i<levels.length;i++){
    const lo=levels[i-1],hi=levels[i],holes=openings.filter(q=>q.lo<=lo+.001&&q.hi>=hi-.001).sort((a,b)=>a.x-b.x);let cursor=0;
    for(const q of holes){wall(cursor,q.x-q.w/2,lo,hi);cursor=q.x+q.w/2;}wall(cursor,width,lo,hi);
   }
   for(const q of openings)if(!q.door)group('window',()=>window(q.x,q.lo,q.hi,q.w));
   // Broad grey brick strips alternate with pale panels; the museum return
   // has blank upper panels, as photographed, rather than invented windows.
   const piers=mode==='return'?[.50,3.53,7.90,10.22]:[.45,...bays.slice(0,-1).map((v,i)=>(v+bays[i+1])/2),width-.45];
   for(const u of piers){b.box(u,(H.base+H.wall)/2,.021,.91,H.wall-H.base,.43,C.brick,30);}
   for(const y of[.32,3.12,4.28,5.21,7.52]){
    // Panel joints stop at brick strips and real door/window apertures.
    const cuts=[...piers.map(x=>({x,w:.94})),...openings.filter(q=>q.lo<y+.03&&q.hi>y-.03)].sort((a,b)=>a.x-b.x);let c=0;
    for(const q of cuts){const end=Math.max(0,q.x-q.w/2);if(end>c)b.box((c+end)/2,y,.020,end-c,.025,.027,C.joint,24);c=Math.max(c,q.x+q.w/2);}if(c<width)b.box((c+width)/2,y,.020,width-c,.025,.027,C.joint,24);
   }
   b.box(width/2,H.cap-.10,.21,width+.12,.20,.94,C.cap,24);
  }));
 }
 function roof(){group('roof',()=>{
  // The exact six-sided footprint is retained, including the western leg.
  mesh('flat-deck',F.surface({type:'Polygon',coordinates:[ring]},7.79),C.roof,25);
  const x0=13.20,x1=48.40,z0=.30,z1=D-.30,m=D/2,e=8.0,top=H.ridge,g=new G.Geometry();
  g.quad([x0,e,z0],[x1,e,z0],[x1,top,m],[x0,top,m]);
  g.quad([x0,top,m],[x1,top,m],[x1,e,z1],[x0,e,z1]);
  g.tri([x0,e,z0],[x0,top,m],[x0,e,z1]);g.tri([x1,e,z1],[x1,top,m],[x1,e,z0]);mesh('middle-low-gable-fitted',g,C.roof,2);
  // Fine parallel roof seams share one geometry, without simplifying the roof.
  const seams=new G.Geometry();
  for(let x=x0+.18;x<x1;x+=.265)for(const z of[z0,z1])seams.quad([x-.018,e+.025,z],[x+.018,e+.025,z],[x+.018,top+.025,m],[x-.018,top+.025,m]);
  seams.detailWidth=.036;mesh('middle-seams',seams,C.tile,2);b.box((x0+x1)/2,top+.035,m,x1-x0,.075,.19,C.tile,2);
  b.box(LW/2,7.83,LEG/2,LW-1.2,.08,LEG-1.2,C.panel,25);
  b.box((49.1+W-.6)/2,7.83,D/2,W-.6-49.1,.08,D-1.2,C.panel,25);
 });}
 function doorway(){b.local(ENTRY.x,0,ENTRY.z,Math.PI/2,()=>group('east-return-entry',()=>{
  b.box(0,1.76,-.03,2.34,2.91,.13,C.wood,6);
  for(const x of[-1.30,1.30])b.box(x,1.85,.09,.23,3.1,.32,C.cap,24);
  b.box(0,3.38,.09,2.84,.23,.37,C.cap,24);
  for(const x of[-1.02,-.56,-.11,.11,.56,1.02])b.box(x,1.62,.085,.045,2.37,.085,'#674a30',6);
  for(const y of[.50,1.19,2.57,2.92])b.box(0,y,.10,2.2,.05,.11,'#674a30',6);
  for(const x of[-.55,.55])for(const [y,h]of[[.81,.45],[1.90,1.16]]){
   for(const dx of[-.32,.32])b.box(x+dx,y,.12,.050,h,.055,'#c79859',6);
   for(const dy of[-h/2,h/2])b.box(x,y+dy,.12,.69,.055,.055,'#c79859',6);
  }
  for(const x of[-.11,.11])b.box(x,1.46,.18,.036,.35,.045,'#b69849',9);
  b.box(0,.15,.47,3.30,.30,1.13,C.cap,24);b.box(0,.07,1.15,3.55,.14,.34,C.cap,24);
  // Two horizontal canopy tiers, visible in the museum's exterior panorama.
  b.box(0,3.68,.58,3.85,.20,1.50,C.cap,24);b.box(0,3.83,.48,3.48,.10,1.16,C.joint,24);
  b.box(0,4.23,.37,2.83,.13,1.03,C.cap,24);
  for(const x of[-1.53,1.53]){b.box(x,2.69,.20,.13,.29,.14,C.dark,9);b.box(x,2.69,.29,.085,.18,.075,C.cap,24);}
 }));
 group('south-service-canopy',()=>{
  const x=LW+1.42;b.box(x,3.23,D+.64,1.63,.17,1.48,C.cap,24);
  for(const u of[x-.66,x+.66])b.cyl(u,.29,D+1.20,.04,2.85,C.frame,16,1,9);
  b.box(x,.15,D+.60,1.55,.30,1.47,C.cap,24);
 });}
 function log(){group('log-sign',()=>{
  const p=LOG,g=new G.Geometry(),N=64;
  const point=(x,a,r=1)=>[x,p.y+Math.sin(a)*r,p.z+Math.cos(a)*r];
  for(let j=0;j<N;j++){const a=j/N*2*Math.PI,c=(j+1)/N*2*Math.PI;g.quad(point(p.x-p.length/2,a),point(p.x+p.length/2,a),point(p.x+p.length/2,c),point(p.x-p.length/2,c));}
  mesh('round-trunk',g,C.log,6);
  for(const side of[-1,1]){
   const end=new G.Geometry(),x=p.x+side*(p.length/2+.004);
   for(let j=0;j<N;j++)end.tri([x,p.y,p.z],point(x,j/N*2*Math.PI),point(x,(j+1)/N*2*Math.PI));mesh('cut-end-'+side,end,C.end,6);
   const grain=new G.Geometry();for(let r=.13;r<.98;r+=.08)for(let j=0;j<N;j++){let a=j/N*2*Math.PI,c=(j+1)/N*2*Math.PI;grain.quad(point(x+side*.005,a,r),point(x+side*.005,c,r),point(x+side*.005,c,r+.014),point(x+side*.005,a,r+.014));}mesh('end-rings-'+side,grain,'#6f6551',6);
  }
  const bark=new G.Geometry();for(let j=0;j<83;j++){const a=j/83*2*Math.PI,r=1.008;for(let k=0;k<7;k++){let x0=p.x-p.length/2+k*p.length/7,x1=x0+p.length/7-.03;const a0=a+.015*Math.sin(j*7+k);bark.quad(point(x0,a0,r),point(x1,a0+.006,r),point(x1,a0+.014,r),point(x0,a0+.008,r));}}mesh('weathered-long-grain',bark,'#9a8c70',6);
  for(const x of[p.x-1.65,p.x+1.65]){
   b.box(x,.47,p.z,.59,.94,1.39,C.cap,24);b.box(x,.12,p.z,.77,.24,1.64,C.cap,24);
   for(let y=.28;y<.95;y+=.16){b.box(x,y,p.z+.705,.60,.017,.025,C.joint,24);for(const side of[-1,1])b.box(x+side*.304,y,p.z,.018,.017,1.4,C.joint,24);}
  }
  const px=1536,py=3584,key='065-log-lettering',uv=[px/4096,0,1024/4096,512/4096];
  if(!b.signs.has(key)){
   b.signs.set(key,uv);const paint=()=>{const c=b.ctx;c.save();c.translate(px,py);c.clearRect(0,0,1024,512);c.scale(1,2);c.fillStyle=C.green;c.strokeStyle=C.green;c.lineWidth=5;
    c.beginPath();c.arc(118,116,65,0,2*Math.PI);c.stroke();c.beginPath();c.arc(118,116,55,0,2*Math.PI);c.stroke();
    c.beginPath();c.moveTo(118,70);c.lineTo(118,154);for(const d of[-1,1])for(const y of[90,113,133]){c.moveTo(118,y);c.quadraticCurveTo(118+d*23,y+3,118+d*33,y+20);}c.stroke();
    c.textAlign='center';c.textBaseline='middle';c.font='600 92px "Kaiti SC","Songti SC",serif';c.fillText('生 物 标 本 馆',594,105,764);c.font='51px Arial';c.fillText('Museum of Biology',594,187,750);c.restore();};
   if(b.e.setAtlas){const old=b.e.setAtlas;b.e.setAtlas=function(canvas){this.setAtlas=old;const result=old.call(this,canvas),p=canvas.getContext('2d').getImageData(px/2,py/2,512,256).data;for(let i=3;i<p.length;i+=4)if(p[i])throw Error('065 sign atlas region occupied');paint();if(this.gl)this.setAtlas(canvas);return result;};}else paint();
  }
  const letters=new G.Geometry();for(let j=0;j<24;j++){const a=-.44+j*.98/24,c=a+.98/24;
   const v=[point(p.x-2.5,a,1.014),point(p.x+2.5,a,1.014),point(p.x+2.5,c,1.014),point(p.x-2.5,c,1.014)];
   letters.tri(v[0],v[1],v[2],[[0,j/24],[1,j/24],[1,(j+1)/24]]);letters.tri(v[0],v[2],v[3],[[0,j/24],[1,(j+1)/24],[0,(j+1)/24]]);
  }
  b.mesh('065-curved-letters',letters,0,0,0,1,1,1,'#ffffff',8,0,0,uv);
 });}
 b.local(O[0],0,O[1],R,()=>{
  group('base',()=>mesh('six-sided-floor',F.surface({type:'Polygon',coordinates:[ring]},H.base),C.cap,21));
  face('south',LW,D,0,W-LW,Array.from({length:16},(_,i)=>3.06+i*3.21),'south');
  face('east-return',LW,LEG,Math.PI/2,LEG-D,[1.95,8.79],'return');
  face('south-leg-fitted',0,LEG,0,LW,[2.63,6.48,10.22]);
  face('west-fitted',0,0,-Math.PI/2,LEG,[2.75,6.72,10.7,14.67,18.64,22.61]);
  face('north-fitted',W,0,Math.PI,W,Array.from({length:18},(_,i)=>2.8+i*3.62));
  face('east-fitted',W,D,Math.PI/2,D,[2.7,6.5,10.3,13.15]);
  roof();doorway();log();
  group('museum-front-planting',()=>{
   b.box(25.4,.08,D+2.67,18.5,.12,4.06,'#929d70',0);
   for(let x=LW+3.2;x<35.1;x+=.48)b.sphere(x,.54,D+.83,.35,.39,.30,'#648264',3);
  });
  group('south-rainpipes',()=>{for(const x of[LW+.25,36.40,W-.18])b.cyl(x,.32,D+.27,.043,7.30,C.frame,12,1,9);});
  group('south-air-conditioners',()=>{for(const [x,y]of[[37.7,2.82],[37.7,1.58],[42.1,2.82],[46.7,2.82],[46.7,5.45]]){
   b.box(x,y,D+.44,.75,.52,.40,C.cap,24);b.box(x+.04,y,D+.655,.46,.41,.02,C.joint,24);
   for(let z=-.17;z<=.17;z+=.042)b.box(x+.04,y+z,D+.671,.44,.013,.012,C.metal,9);
   for(const dx of[-.28,.28])b.box(x+dx,y-.33,D+.40,.035,.14,.40,C.metal,9);
  }});
 });
 return{strategy:'building065-v46',floors:2,basementFloors:1,museumInWesternPart:true,sourceOutlinePreserved:true,entranceFacing:'east',logFacing:'south',logDiameter:2,fullFacadeVerified:false,roofProfileVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building065={id:ID,render,W,D,LW,LEG,H,ENTRY,LOG,world,local,R};
})(YY);
