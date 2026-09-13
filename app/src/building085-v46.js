/* Philosophy, Humanities Building 2: PKU's 2022/2023 entrance photographs,
 * the 2026-uploaded west-facing aerial sequence and a two-storey eyewitness
 * account. Only the visible west gallery and porch are detailed observations;
 * hidden elevations, exact heights and bay spacing remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/939378517';
const O=[189.844,-373.420],R=-Math.atan2(28.702,3.775),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(28.702,3.775),D=21.305;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#9e493b',wood:'#824234',roof:'#656f68',tile:'#969f91',green:'#386b5b',blue:'#35586f',gold:'#c2ad79',glass:'#647977',dark:'#263c37'};
const H={base:.72,floor:4.52,eave:8.48,ridge:13.88},START=4.55,END=W-.65,DEPTH=2.15,ENTRY=(START+END)/2;
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'085-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('085-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,p,y,t,col){mesh(name,G.polygon(p,y),col,24);const g=new G.Geometry();for(let i=0;i<p.length;i++){const a=p[i],q=p[(i+1)%p.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,col,24);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo;
  b.box(q.x,y,-.11,q.w-.05,h-.05,.035,C.glass,5);
  for(const x of[q.x-q.w/2,q.x-q.w/6,q.x+q.w/6,q.x+q.w/2])b.box(x,y,.005,.065,h+.08,.21,C.red,6);
  for(const yy of[q.lo,q.hi,q.hi-.43])b.box(q.x,yy,.005,q.w+.08,.065,.21,C.red,6);
  for(let i=1;i<8;i++)b.box(q.x-q.w/2+i*q.w/8,q.hi-.23,.04,.027,.35,.085,C.wood,6);
  b.box(q.x,q.lo-.065,.035,q.w+.18,.09,.31,C.stone,24);
 }
 function face(name,x,z,rot,width,holes,col=C.brick){b.local(x,0,z,rot,()=>{
  const levels=[H.base,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
  group(name+'-wall',()=>{for(let j=1;j<levels.length;j++){
   const lo=levels[j-1],hi=levels[j],cuts=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).sort((a,c)=>a.x-c.x);let cursor=0;
   const part=(a,c)=>{if(c>a+1e-6)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,col,30);};
   for(const q of cuts){part(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}part(cursor,width);
  }});
  group(name.replace('-room','')+'-window',()=>{for(const q of holes)if(!q.door)window(q);});
 });}
 function regular(width,count){const list=[];for(let i=0;i<count;i++)for(let fl=0;fl<2;fl++){const base=H.base+fl*3.8;list.push({x:width*(i+.5)/count,w:Math.min(2.45,width/count*.60),lo:base+.64,hi:base+2.85});}return list;}
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
  }mesh('roof-'+name+'-gable',gables,main?C.red:C.red,6);
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
  // These two unused atlas rows are checked after the inherited atlas restore.
  // Keeping nSigns unchanged preserves every subsequent building's glyph UVs.
  const px=2560,py=3840,paint=()=>{const q=b.ctx;q.save();q.clearRect(px,py,512,256);q.fillStyle='#243b35';q.fillRect(px,py,512,128);q.fillStyle='#d4bf83';q.textAlign='center';q.textBaseline='middle';q.font='600 79px "Songti SC",serif';q.fillText('門學哲',px+256,py+66);for(const [cx,t] of[[128,'宗教學系'],[384,'哲學系']]){q.fillStyle='#243b35';q.fillRect(px+cx-55,py+130,110,124);q.fillStyle='#d4bf83';q.font='600 26px "Songti SC",serif';[...t].forEach((c,i)=>q.fillText(c,px+cx,py+145+i*27));}q.restore();};
  if(b.e.setAtlas){const old=b.e.setAtlas;b.e.setAtlas=function(canvas){this.setAtlas=old;const result=old.call(this,canvas),pixels=canvas.getContext('2d').getImageData(px/2,py/2,256,128).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i])throw Error('085 label slot occupied');paint();if(this.gl)this.setAtlas(canvas);return result;};}else paint();
  const label=(x,y,z,w,h,u,v,du,dv)=>b.mesh('plane',b.geo('plane',G.plane),x,y,z,w,h,1,'#ffffff',8,.7,0,[u/4096,1-(v+dv)/4096,du/4096,dv/4096]);
  label(ENTRY,4.43,D+3.40,3.2,.8,px,py,512,128);
  label(ENTRY-2.23,2.56,D+.15,.65,2.18,px+109.5,py+130,37,124);label(ENTRY+2.23,2.56,D+.15,.65,2.18,px+365.5,py+130,37,124);
 });}
 function porch(){
  const front=D+3.15,w=7.7,half=3.25;
  group('porch-base',()=>{b.box(ENTRY,H.base/2,D+1.55,w,H.base,3.3,C.stone,10);for(let i=0;i<4;i++)b.box(ENTRY,(i+1)*.18/2,D+4.3-i*.32,6.9,(i+1)*.18,.34,C.stone,10);});
  group('porch-column',()=>{for(const x of[ENTRY-half,ENTRY+half]){b.cyl(x,H.base,front,.255,4.15,C.red,12,1,6);b.cyl(x,H.base-.02,front,.32,.16,C.stone,12,1,24);}});
  group('porch-door',()=>{
   b.box(ENTRY,2.30,D-.08,3.60,3.15,.045,C.dark,24);
   for(const x of[ENTRY-2.26,ENTRY+2.26])b.box(x,2.40,D,1.0,3.42,.30,C.red,6);
   b.box(ENTRY,4.07,D,5.50,.57,.37,C.red,6);
   for(const x of[ENTRY-1.79,ENTRY+1.79])b.box(x,2.25,D+.04,.12,3.15,.25,C.wood,6);
   for(const x of[ENTRY-1.6,ENTRY+1.6])b.local(x,H.base,D-.30,x<ENTRY?-.9:.9,()=>b.box(0,1.45,-.75,.14,2.90,1.50,C.red,6));
   for(const x of[ENTRY-1.35,ENTRY-.45,ENTRY+.45,ENTRY+1.35])b.sphere(x,4.06,D+.23,.085,.085,.035,C.blue,6,0,true);
  });
  group('porch-painted-beams',()=>{
   b.box(ENTRY,4.76,front,w-.2,.72,.40,C.red,6);
   for(const x of[ENTRY-half,ENTRY+half]){
    b.box(x,4.76,D+1.54,.33,.66,3.40,C.red,6);
    for(const [y,ww,dd]of[[4.26,.86,.57],[4.53,.71,.74],[4.84,.52,.90]]){b.box(x,y,front,ww,.18,dd,C.green,6);b.box(x,y+.01,front+dd/2+.015,ww-.10,.07,.018,C.gold,9);}
    b.box(x,4.55,front+.48,.30,.57,.022,C.blue,6);
   }
   for(let i=0;i<6;i++)for(let j=0;j<3;j++){
    const x=ENTRY-2.6+i*1.04,z=D+.30+j*.91;b.box(x,4.30,z,.97,.045,.84,C.green,6);b.box(x,4.27,z,.63,.045,.47,C.blue,6);b.sphere(x,4.24,z,.22,.028,.13,C.stone,24,0,true);
   }
  });
  roof('porch',ENTRY-w/2,ENTRY+w/2,D+1.55,2.25,5.10,1.38);names();
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,C.brick);slab('upper-floor',poly,H.floor,.23,C.stone);slab('eaves',poly,H.eave-.25,.17,C.stone);
  const width=END-START,step=width/5,west=regular(width,5);west.push({x:ENTRY-START,w:3.8,lo:H.base,hi:3.85,door:true});
  // The middle ground-floor opening is a doorway behind the projecting porch.
  const holes=west.filter(q=>q.door||!(q.lo<4&&Math.abs(q.x-(ENTRY-START))<step*.4));
  face('west-room',START,D-DEPTH,0,width,holes);face('west-north-return',0,D,0,START,regular(START,1));face('west-south-return',END,D,0,W-END,[]);
  face('east',W,0,Math.PI,W,regular(W,6));face('north',0,0,-Math.PI/2,D,regular(D,4));face('south',W,D,Math.PI/2,D,regular(D,4));
  group('gallery-columns',()=>{for(let i=0;i<=5;i++){const x=START+i*step;b.cyl(x,H.base,D-.05,.20,H.eave-H.base-.43,C.red,10,1,6);b.box(x,H.eave-.46,D-.03,.47,.32,.55,C.red,6);}
   for(const y of[H.floor-.09,H.eave-.47])b.box((START+END)/2,y,D-.05,width,.28,.52,y<5?C.stone:C.red,y<5?24:6);
  });
  group('gallery-rail',()=>{b.local(START,H.floor+.03,D+.03,0,()=>rail(width,0));for(const [a,c]of[[START,ENTRY-3.6],[ENTRY+3.6,END]])b.local(a,H.base,D+.03,0,()=>rail(c-a,0));});
  group('gallery-painted-frieze',()=>{b.box((START+END)/2,7.95,D-.08,width,.78,.20,C.red,6);for(let i=0;i<5;i++){const x=START+(i+.5)*step;b.box(x,7.98,D+.035,step-.46,.065,.035,C.gold,9);for(const s of[-1,1])b.box(x+s*(step/2-.27),7.98,D+.04,.08,.62,.04,C.green,6);}});
  roof('main',-.65,W+.65,D/2,D/2+.83,H.eave,H.ridge-H.eave,true);porch();
 });
 return{id:ID,strategy:'building085-v46',floors:2,eaveHeight:H.eave,ridgeHeight:H.ridge,galleryDepth:DEPTH,entrance:world(ENTRY,D+3.15),originalOutline:true,limits:'The east and end elevations, exact height, ornamental painting and bay spacing remain approximate.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};
Y.Building085={id:ID,render,world,local,width:W,depth:D,entry:ENTRY};
})(YY);
