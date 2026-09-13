/* Humanities Building 5, History Department: main hall facing east, plus its
 * two transverse wings along the original concave footprint. Entrance evidence:
 * wood board with green 歷史學系, right dark vertical plaque, olive lower columns,
 * recessed glazing, four blue door pins and painted two-column porch.
 * Shared construction helpers follow the same campus architectural vocabulary;
 * this site, orientation, wing geometry and plaques belong only to ID 308.
 * Hidden elevations, exact dimensions and wing storeys remain approximate. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745062';
const ORIGIN=[89.785,-485.087],ANGLE=Math.atan2(3.587,25.177),CO=Math.cos(ANGLE),SI=Math.sin(ANGLE);
const siteWorld=(x,z)=>[ORIGIN[0]+x*CO+z*SI,ORIGIN[1]-x*SI+z*CO];
// Main hall runs north-south; its recessed gallery looks east into this court.
const O=siteWorld(-7.015,44.9692),R=ANGLE+Math.PI/2,W=30.981,D=20.752;
const world=(x,z)=>[O[0]+x*Math.cos(R)+z*Math.sin(R),O[1]-x*Math.sin(R)+z*Math.cos(R)],local=p=>[(p[0]-O[0])*Math.cos(R)-(p[1]-O[1])*Math.sin(R),(p[0]-O[0])*Math.sin(R)+(p[1]-O[1])*Math.cos(R)];
const C={brick:'#929993',stone:'#c8c9be',red:'#a74939',wood:'#914b38',roof:'#656f68',tile:'#969f91',green:'#386b5b',blue:'#35586f',gold:'#c2ad79',glass:'#647977',dark:'#263c37'};
const H={base:.72,floor:4.55,eave:8.65,ridge:13.65},START=.60,END=28.626-.60,DEPTH=2.35,ENTRY=(START+END)/2;
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'091-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('091-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,p,y,t,col){mesh(name,G.polygon(p,y),col,24);if(name!=='base')return;const g=new G.Geometry();for(let i=0;i<p.length;i++){const a=p[i],q=p[(i+1)%p.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,col,24);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo;
  b.box(q.x,y,-.11,q.w-.05,h-.05,.035,C.glass,5);
  for(const x of[q.x-q.w/2,q.x-q.w/6,q.x+q.w/6,q.x+q.w/2])b.box(x,y,.005,.065,h+.08,.21,C.red,6);
  for(const yy of[q.lo,q.hi,q.hi-.43])b.box(q.x,yy,.005,q.w+.08,.065,.21,C.red,6);
  for(let i=1;i<8;i++)b.box(q.x-q.w/2+i*q.w/8,q.hi-.23,.04,.027,.35,.091,C.wood,6);
  b.box(q.x,q.lo-.065,.035,q.w+.18,.09,.31,C.stone,24);
 }
 function face(name,x,z,rot,width,holes,col=C.brick,eave=H.eave){b.local(x,0,z,rot,()=>{
  const levels=[H.base,eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
  group(name+'-wall',()=>{for(let j=1;j<levels.length;j++){
   const lo=levels[j-1],hi=levels[j],cuts=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).sort((a,c)=>a.x-c.x);let cursor=0;
   const part=(a,c)=>{if(c>a+1e-6)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,col,30);};
   for(const q of cuts){part(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}part(cursor,width);
  }});
  group(name.replace('-room','')+'-window',()=>{for(const q of holes)if(!q.door)window(q);});
 });}
 function regular(width,count){const list=[];for(let i=0;i<count;i++)for(let fl=0;fl<2;fl++){const base=H.base+fl*3.8;list.push({x:width*(i+.5)/count,w:Math.min(3.55,width/count*.72),lo:base+.64,hi:base+2.85});}return list;}
 function rail(width,y){
  for(const yy of[y+.12,y+1.05])b.box(width/2,yy,0,width,.075,.10,C.red,6);
  const n=Math.ceil(width/.93),w=width/n;
  for(let i=0;i<=n;i++)b.box(i*w,y+.57,0,.07,1.10,.10,C.red,6);
  for(let i=0;i<n;i++){const x=(i+.5)*w;
   for(const s of[-1,1]){b.box(x+s*w*.22,y+.59,0,.048,.59,.09,C.red,6);b.box(x+s*w*.11,y+(s>0?.82:.35),0,w*.46,.047,.09,C.red,6);}
  }
 }
 function roof(name,x0,x1,zmid,half,eave,rise,main=false){
  const span=x1-x0,point=(x,t,s)=>[x,eave+rise*Math.pow(t,1.32)+.22*Math.pow(Math.abs((x-(x0+x1)/2)/(span/2)),10)*(1-t),zmid+s*half*(1-t)];
  const surface=new G.Geometry(),tiles=new G.Geometry();
  function patch(g,a,c,t,u,s,dy=0){const p=[point(a,t,s),point(c,t,s),point(c,u,s),point(a,u,s)].map(q=>[q[0],q[1]+dy,q[2]]);if(s>0)g.quad(...p);else g.quad(p[1],p[0],p[3],p[2]);}
  for(const s of[-1,1]){
   for(let i=0;i<24;i++)for(let j=0;j<14;j++)patch(surface,x0+span*i/24,x0+span*(i+1)/24,j/14,(j+1)/14,s);
   for(let x=x0+.035;x<x1-.07;x+=.235)for(let j=0;j<14;j++)for(let k=0;k<3;k++)patch(tiles,x+k*.025,Math.min(x+(k+1)*.025,x1),j/14,(j+1)/14,s,.018+Math.sin((k+.5)*Math.PI/3)*.035);
  }
  tiles.detailWidth=.025;mesh('roof-'+name+'-surface',surface,C.roof,2);mesh('roof-'+name+'-tiles',tiles,C.tile,2);
  const gables=new G.Geometry();for(const x of[x0+.36,x1-.36])for(const s of[-1,1])for(let i=0;i<14;i++){
   const a=point(x,i/14,s),q=point(x,(i+1)/14,s),p=[[x,eave,a[2]],a,q,[x,eave,q[2]]];if((x>x0+span/2)===(s>0))p.reverse();gables.quad(...p);
  }mesh('roof-'+name+'-gable',gables,name==='main'?C.red:C.brick,name==='main'?6:30);
  group('roof-'+name+'-trim',()=>{
   b.box((x0+x1)/2,eave+rise+.09,zmid,span+.18,.20,.32,C.tile,2);
   for(const x of[x0,x1])for(const s of[-1,1])for(let i=0;i<14;i++){
    const a=point(x,i/14,s),q=point(x,(i+1)/14,s);b.beam([a[0],a[1]-.12,a[2]],[q[0],q[1]-.12,q[2]],main?.15:.12,C.red,6);b.beam(a,q,.075,C.tile,2);
   }
   for(const s of[-1,1]){
    b.box((x0+x1)/2,eave-.12,zmid+s*half,span,.25,.24,C.red,6);
    for(let x=x0+.12;x<x1;x+=.235){const p=point(x,0,s);b.box(x,p[1]-.10,p[2],.095,.12,.32,C.stone,24);}
   }
   for(const x of[x0+.22,x1-.22]){b.beam([x,eave+rise,zmid],[x+(x<(x0+x1)/2?-.13:.13),eave+rise+.65,zmid],.12,C.tile,2);}
  });
 }
 function names(){group('porch-names',()=>{
  // Four green characters on a wood-toned board; the right vertical plaque
  // is dark green, as documented by the History Department entrance photos.
  // Reserve unused atlas rows without shifting subsequent shared sign slots.
  const px=3584,py=3840,paint=()=>{const q=b.ctx;q.save();q.clearRect(px,py,512,256);q.fillStyle='#af803d';q.fillRect(px,py,512,128);q.fillStyle='#478b65';q.textAlign='center';q.textBaseline='middle';q.font='600 87px "Songti SC",serif';q.fillText('歷史學系',px+256,py+65);q.fillStyle='#33413a';q.fillRect(px+222,py+128,68,128);q.fillStyle='#478b65';q.font='600 27px "Songti SC",serif';[...'歷史學系'].forEach((c,i)=>q.fillText(c,px+256,py+146+i*29));q.restore();};
  if(b.e.setAtlas){const old=b.e.setAtlas;b.e.setAtlas=function(canvas){this.setAtlas=old;const result=old.call(this,canvas),pixels=canvas.getContext('2d').getImageData(px/2,py/2,256,128).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i])throw Error('091 label slot occupied');paint();if(this.gl)this.setAtlas(canvas);return result;};}else paint();
  const label=(x,y,z,w,h,u,v,du,dv)=>b.mesh('plane',b.geo('plane',G.plane),x,y,z,w,h,1,'#ffffff',8,.7,0,[u/4096,1-(v+dv)/4096,du/4096,dv/4096]);
  label(ENTRY,4.55,D+3.56,3.60,.92,px,py,512,128);
  label(ENTRY+2.32,2.58,D+.22,.579375,2.06,px+238,py+128,36,128);
 });}
 function paintBracket(x,y,z,w){
  b.box(x,y,z,w,.35,.16,C.green,6);b.box(x,y-.17,z+.015,w*.66,.21,.17,C.blue,6);
  for(const s of[-1,1]){b.box(x+s*w*.38,y,z+.09,.07,.28,.025,C.gold,9);b.box(x+s*w*.28,y-.20,z+.105,w*.30,.055,.025,C.gold,9);}
 }
 function porch(){
  const front=D+3.25,w=8.4,half=3.45;
  group('porch-base',()=>{b.box(ENTRY,H.base/2,D+1.65,w,H.base,3.5,C.stone,10);for(let i=0;i<4;i++)b.box(ENTRY,(i+1)*.18/2,D+4.5-i*.32,7.0,(i+1)*.18,.34,C.stone,10);});
  group('porch-column',()=>{for(const x of[ENTRY-half,ENTRY+half]){b.cyl(x,H.base,front,.285,1.35,'#878972',12,1,6);b.cyl(x,H.base+1.35,front,.285,2.89,C.red,12,1,6);b.cyl(x,H.base-.02,front,.32,.12,C.stone,12,1,24);}});
  group('porch-door',()=>{
   // The outer red lattice leaves stand open; glazing is at the inner vestibule.
   for(const x of[ENTRY-2.3,ENTRY+2.3]){
    b.box(x,2.36,D,.99,3.30,.35,C.red,6);
    for(const y of[.96,1.37])b.box(x,y,D+.195,.75,.24,.045,C.wood,6);
   }
   b.box(ENTRY,4.02,D,5.6,.56,.38,C.red,6);
   for(const x of[ENTRY-1.80,ENTRY+1.80])b.local(x,H.base,D-.12,x<ENTRY?-.94:.94,()=>{
    for(const xx of[-.67,.67])b.box(xx,1.43,0,.09,2.86,.12,C.wood,6);
    for(const yy of[.05,.46,2.16,2.72])b.box(0,yy,0,1.38,.09,.12,C.wood,6);
    for(const yy of[.23,2.38])for(let i=-2;i<=2;i++){b.box(i*.25,yy,0,.045,.33,.11,C.wood,6);b.box(i*.25+.07,yy+.06,0,.14,.04,.11,C.wood,6);}
    b.box(0,1.34,0,1.22,1.64,.055,C.dark,24);
   });
   b.box(ENTRY,2.12,D-DEPTH-.03,3.46,2.79,.035,C.glass,5);
   for(const x of[ENTRY-1.75,ENTRY,ENTRY+1.75])b.box(x,2.13,D-DEPTH+.04,.08,2.85,.13,C.wood,6);
   for(const y of[H.base,3.18,3.55])b.box(ENTRY,y,D-DEPTH+.04,3.56,.08,.13,C.wood,6);
   for(const x of[ENTRY-.12,ENTRY+.12])b.box(x,2.0,D-DEPTH+.14,.03,.48,.04,C.stone,24);
   for(const x of[ENTRY-1.32,ENTRY-.44,ENTRY+.44,ENTRY+1.32]){
    const g=new G.Geometry();for(let i=0;i<6;i++){const a=i*Math.PI/3,c=(i+1)*Math.PI/3;g.tri([x,4.01,D+.25],[x+.115*Math.cos(a),4.01+.115*Math.sin(a),D+.25],[x+.115*Math.cos(c),4.01+.115*Math.sin(c),D+.25]);}mesh('porch-hexagonal-door-pin-'+Math.round((x-ENTRY)*100),g,C.blue,6);
   }
  });
  group('porch-painted-beams',()=>{
   b.box(ENTRY,4.84,front,w-.2,.70,.43,C.red,6);
   for(const x of[ENTRY-half,ENTRY+half]){
    b.box(x,4.84,D+1.56,.34,.66,3.42,C.red,6);
    for(const [y,ww,dd]of[[4.32,.98,.63],[4.57,.78,.80],[4.88,.57,.95]]){b.box(x,y,front,ww,.18,dd,C.green,6);b.box(x,y+.01,front+dd/2+.018,ww-.10,.065,.021,C.gold,9);}
    b.box(x,4.59,front+.50,.29,.64,.028,C.blue,6);
    for(let y=4.32;y<4.95;y+=.105)for(const xx of[x-.115,x+.115])b.sphere(xx,y,front+.526,.025,.025,.012,C.gold,9,0,true);
    paintBracket(x+(x<ENTRY?.45:-.45),4.26,front+.20,.96);
   }
   for(let i=0;i<7;i++)for(let j=0;j<3;j++){
    const x=ENTRY-3.0+i,z=D+.27+j*.94;b.box(x,4.38,z,.93,.045,.86,C.green,6);b.box(x,4.35,z,.68,.045,.52,C.blue,6);b.sphere(x,4.32,z,.20,.023,.12,C.gold,9,0,true);
   }
  });
  roof('porch',ENTRY-w/2,ENTRY+w/2,D+1.65,2.25,5.25,1.40);
  group('porch-eave-painted-ends',()=>{for(let x=ENTRY-w/2+.12;x<ENTRY+w/2;x+=.235){b.box(x,5.13,D+3.92,.095,.12,.035,C.blue,6);b.box(x,5.13,D+3.945,.069,.085,.015,C.gold,9);b.box(x,5.13,D+3.958,.045,.058,.015,C.blue,6);}});names();
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,C.brick);slab('upper-floor',poly,H.floor,.23,C.stone);
  slab('gallery-eaves',[[0,0],[W,0],[W,D],[0,D]],H.eave-.25,.17,C.stone);
  const width=END-START,step=width/5,west=regular(width,5);west.push({x:ENTRY-START,w:3.8,lo:H.base,hi:3.85,door:true});
  // The middle ground-floor opening is a doorway behind the projecting porch.
  const holes=west.filter(q=>q.door||!(q.lo<4&&Math.abs(q.x-(ENTRY-START))<step*.4));
  face('east-room',START,D-DEPTH,0,width,holes);
  face('east-south-return',0,D,0,START,[]);face('east-north-return',END,D,0,28.626-END,[]);
  // Exterior edges retain the actual concave 15-vertex survey-reference ring.
  // The two collinear east-gallery edges are replaced only by its recessed wall.
  const counts=[5,0,3,0,0,0,0,0,0,6,0,1,5,0,0];
  for(let i=0;i<poly.length;i++){
   if(i===5||i===6)continue;
   const a=poly[(i+1)%poly.length],c=poly[i],dx=c[0]-a[0],dz=c[1]-a[1],width=Math.hypot(dx,dz),rot=-Math.atan2(dz,dx);
   const eave=[3,4,12,13].includes(i)?H.eave:7.65;
   const holes=counts[i]?regular(width,counts[i]):([1,8,10,14].includes(i)?[{x:width*.5,w:1.64,lo:4.66,hi:6.35}]:[]);
   face('outer-'+i,a[0],a[1],rot,width,holes,C.brick,eave);
   group('outer-'+i+'-belt',()=>b.local(a[0],0,a[1],rot,()=>{
    b.box(width/2,H.floor-.1,.025,width,.24,.11,C.stone,24);
    if(counts[i])for(let j=0;j<=counts[i];j++)b.box(width*j/counts[i],(H.base+eave)/2,.04,.18,eave-H.base,.14,C.red,6);
   }));
  }
  group('gallery-columns',()=>{for(let i=0;i<=5;i++){const x=START+i*step;b.cyl(x,H.base,D-.05,.20,1.35,'#878972',10,1,6);b.cyl(x,H.base+1.35,D-.05,.20,H.eave-H.base-1.78,C.red,10,1,6);b.box(x,H.eave-.46,D-.03,.47,.32,.55,C.red,6);}
   for(const y of[H.floor-.09,H.eave-.47])b.box((START+END)/2,y,D-.05,width,.28,.52,y<5?C.stone:C.red,y<5?24:6);
  });
  group('gallery-rail',()=>{b.local(START,H.floor+.03,D+.03,0,()=>rail(width,0));/* The ground-floor railing is green metal in the department close-up. */ const old=C.red;C.red='#36554c';for(const [a,c]of[[START,ENTRY-3.7],[ENTRY+3.7,END]])b.local(a,H.base,D+.03,0,()=>rail(c-a,0));C.red=old;});
  group('gallery-painted-frieze',()=>{
   b.box((START+END)/2,7.96,D-.08,width,.77,.22,C.red,6);
   for(let i=0;i<=5;i++){
    const x=START+i*step;b.box(x,8.0,D+.065,.37,.80,.045,C.green,6);
    for(const sx of[-1,1]){b.box(x+sx*.13,8.0,D+.097,.055,.76,.023,C.gold,9);for(let k=0;k<7;k++)b.box(x+sx*.075,7.72+k*.09,D+.105,.032,.043,.024,C.stone,24);}
    for(const sx of[-1,1])if((i>0||sx>0)&&(i<5||sx<0))paintBracket(x+sx*.52,7.39,D+.03,.87);
   }
  });
  roof('main',-.65,W+.65,D/2,D/2+.83,H.eave,H.ridge-H.eave,true);porch();
 });
 b.local(ORIGIN[0],0,ORIGIN[1],ANGLE,()=>{
  roof('north-wing',-.52,25.98,6.92,7.50,7.65,3.80);
  roof('south-wing',-11.92,21.45,51.68,7.65,7.65,3.80);
 });
 return{id:ID,strategy:'building091-v46',floors:2,eaveHeight:H.eave,ridgeHeight:H.ridge,galleryDepth:DEPTH,entrance:world(ENTRY,D+3.15),originalOutline:true,roofAxes:['north-south','east-west','east-west'],limits:'Main east entrance and two storeys documented; wing facades, west elevation, height, bay dimensions and roof ornaments remain fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};
Y.Building091={id:ID,render,world,local,width:W,depth:D,entry:ENTRY};
})(YY);
