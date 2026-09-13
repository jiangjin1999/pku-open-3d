/* Tongyuan: white plaster hall, grey tiled cornice and silver glazed vestibule.
   Own 2020 photo establishes the entrance details; OIR adds the wooden doors and left ramp.
   The south entrance, complete window count and low roof ends remain fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/445016204';
const O=[-296.300,243.277],W=33.154,D=11.791,ENTRY=16.40;
const H={base:.54,wall:4.72,eave:5.20,ridge:6.13,top:6.30};
const C={wall:'#deded0',stone:'#aeb1a5',brick:'#656e65',edge:'#8c9387',roof:'#737c70',glass:'#778e86',silver:'#bac7be',wood:'#8c6948',green:'#367567',white:'#eeeedd',gold:'#c9ad59',dark:'#4b5952'};
const ring=[[0,.477],[.470,D],[W,D],[W,0],[0,.477]],shape={type:'Polygon',coordinates:[ring]};
const world=(u,v)=>[O[0]+u,O[1]+v],local=p=>[p[0]-O[0],p[1]-O[1]];
const ramp={start:6.30,end:13.55,near:D+.36,far:D+1.76};
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'059-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('059-'+name,g,0,0,0,1,1,1,c,mat);
 function sign(key,words,x,y,z,w,h,color,background){
  const old=b.e.add;b.e.add=function(k,g,m,c,p,uv){return old.call(this,k,g,m,c,p,uv&&[uv[0]+8/4096,uv[1]+8/4096,uv[2]-16/4096,uv[3]-16/4096]);};try{b.sign('059-'+key,x,y,z,w,h,0,true);}finally{b.e.add=old;}
  const uv=b.signs.get('059-'+key+'_true');if(!uv)return;
  const c=b.ctx;c.save();c.translate(uv[0]*4096,(1-uv[1]-uv[3])*4096);c.clearRect(0,0,512,128);if(background){c.fillStyle=background;c.fillRect(0,0,512,128);}c.fillStyle=color;c.font='600 94px "Kaiti SC","Songti SC",serif';c.textAlign='center';c.textBaseline='middle';c.fillText(words,256,67,472);c.restore();
 }
 function glazing(q){const x=q.x,w=q.w,lo=q.lo,hi=q.hi,top=hi-.48;
  b.box(x,(lo+hi)/2,-.125,w-.10,hi-lo-.10,.035,C.glass,5);
  for(const xx of[x-w/2,x+w/2])b.box(xx,(lo+hi)/2,.015,.065,hi-lo+.06,.17,C.white,24);
  for(const yy of[lo,top,hi])b.box(x,yy,.035,w+.04,.062,.17,C.white,24);
  for(const xx of[x-w*.25,x+w*.25])b.box(xx,(lo+top)/2,.035,.046,top-lo,.11,C.white,24);
  b.box(x,(top+hi)/2,.035,.050,hi-top,.11,C.white,24);
  b.box(x,lo-.09,.07,w+.30,.13,.32,C.stone,24);
 }
 function cornice(w){
  // Projecting courses and rounded tile mouths are observed; back and end repetition is fitted.
  for(const [y,h,d,z]of[[4.73,.14,.26,.01],[4.88,.12,.36,.025],[5.025,.12,.48,.045]])b.box(0,y,z,w+.05,h,d,C.brick,30);
  for(let x=-w/2+.29;x<w/2;x+=.64)for(const y of[4.73,4.88])b.box(x+(y<4.8?0:.30),y,.223,.017,.10,.014,C.edge,24);
  b.box(0,5.18,.055,w+.18,.14,.60,C.brick,30);
  const tiles=new G.Geometry();
  for(let x=-w/2+.16;x<w/2;x+=.29){
   // A thin semicircular tile trough, open at its forward mouth.
   for(let k=0;k<10;k++){const a=Math.PI*k/10,c=Math.PI*(k+1)/10;
    const p=(t,r,z)=>[x+Math.cos(t)*r,5.19-Math.sin(t)*r,z];
    tiles.quad(p(a,.117,.11),p(c,.117,.11),p(c,.117,.375),p(a,.117,.375));
    tiles.quad(p(a,.145,.375),p(c,.145,.375),p(c,.117,.375),p(a,.117,.375));
    tiles.quad(p(a,.145,.11),p(a,.145,.375),p(c,.145,.375),p(c,.145,.11));
   }
  }
  mesh('cornice-tile-mouths',tiles,C.edge,25);
 }
 function face(a,c,name,openings){const dx=c[0]-a[0],dz=c[1]-a[1],w=Math.hypot(dx,dz),rotation=Math.atan2(-dz,dx);
  b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,rotation,()=>group(name,()=>{
   const wall=(l,r,lo,hi)=>{if(r>l&&hi>lo)b.box((l+r)/2,(lo+hi)/2,-.13,r-l,hi-lo,.26,C.wall,24);};
   let cursor=-w/2;for(const q of openings){const l=q.x-q.w/2,r=q.x+q.w/2;wall(cursor,l,H.base,H.wall);wall(l,r,H.base,q.lo);wall(l,r,q.hi,H.wall);if(!q.door)glazing(q);cursor=r;}wall(cursor,w/2,H.base,H.wall);
   b.box(0,.43,-.055,w,.22,.29,C.stone,24);cornice(w);
  }));
 }
 function roof(){
  const ridgeZ=D/2,west=z=>.470*Math.max(0,(z-.477)/(D-.477)),north=x=>.477*(1-x/W),roof=new G.Geometry(),ribs=new G.Geometry();
  // Use the actual tapered footprint; a low gable is a satellite-based provisional roof.
  roof.quad([0,H.eave,.477],[W,H.eave,0],[W,H.ridge,ridgeZ],[west(ridgeZ),H.ridge,ridgeZ]);
  roof.quad([west(ridgeZ),H.ridge,ridgeZ],[W,H.ridge,ridgeZ],[W,H.eave,D],[.470,H.eave,D]);
  for(let x=.75;x<W-.1;x+=.32){const n=north(x),m=ridgeZ;for(const [a,c,ya,yc]of[[n,m,H.eave,H.ridge],[m,D,H.ridge,H.eave]]){
   ribs.quad([x-.035,ya+.026,a],[x+.035,ya+.026,a],[x+.035,yc+.026,c],[x-.035,yc+.026,c]);
  }}
  mesh('low-roof',roof,C.roof,25);mesh('low-roof-tile-joints',ribs,C.edge,25);
  const ends=new G.Geometry();ends.tri([.05,H.eave,.477],[west(ridgeZ),H.ridge,ridgeZ],[.47,H.eave,D]);ends.tri([W,H.eave,D],[W,H.ridge,ridgeZ],[W,H.eave,0]);mesh('fitted-plain-roof-ends',ends,C.wall);
  b.box((W+west(ridgeZ))/2,H.ridge+.085,ridgeZ,W-west(ridgeZ),.17,.25,C.brick,30);
 }
 function entrance(){group('silver-glass-vestibule',()=>{
  const front=D+1.94,w=5.30,left=ENTRY-w/2,right=ENTRY+w/2;
  b.box(ENTRY,H.base/2,D+1.04,5.70,H.base,2.16,C.stone,24);
  // Inner brown double doors and a glazed transom, without a plaster wall behind them.
  b.box(ENTRY,1.76,D-.10,2.57,2.44,.095,C.wood,6);
  for(const xx of[ENTRY-1.32,ENTRY,ENTRY+1.32])b.box(xx,1.82,D+.005,.075,2.56,.15,C.wood,6);
  b.box(ENTRY,3.21,D-.09,2.55,.53,.045,C.glass,5);
  for(const y of[.57,3.0,3.50])b.box(ENTRY,y,D+.018,2.70,.065,.14,C.silver,9);
  for(const xx of[ENTRY-.65,ENTRY+.65]){
   b.box(xx,2.22,D-.03,.87,1.11,.038,C.glass,5);b.box(xx,1.14,D-.038,.91,.73,.035,'#76563c',6);
   for(const yy of[1.50,2.83])b.box(xx,yy,D+.03,1.13,.046,.10,C.wood,6);
  }
  for(const xx of[ENTRY-.17,ENTRY+.17])b.box(xx,1.63,D+.09,.028,.36,.06,C.silver,9);
  // Slim outer frame: one open centre bay with glass sidelights and clear glazing on both sides.
  for(const x of[left,right])for(const z of[D+.10,front])b.box(x,1.99,z,.085,2.90,.10,C.silver,9);
  for(const x of[left,right]){
   // The left access panel is shown open so the observed ramp actually reaches the vestibule.
   // Panel mechanics and exact side-opening width remain fitted.
   if(x===left){b.box(x,3.17,D+1.02,.037,.48,1.72,C.glass,5);b.box(x,1.75,D+.21,.037,2.29,.22,C.glass,5);}
   else b.box(x,1.98,D+1.02,.037,2.78,1.72,C.glass,5);
   for(const y of[.60,2.89,3.44])b.box(x,y,D+1.02,.085,.075,1.88,C.silver,9);
   if(x!==left)b.box(x,1.99,D+1.06,.085,2.82,.060,C.silver,9);
  }
  for(const x of[ENTRY-1.57,ENTRY+1.57])b.box(x,1.99,front,.07,2.90,.10,C.silver,9);
  for(const x of[ENTRY-2.10,ENTRY+2.10])b.box(x,1.93,front,.95,2.62,.035,C.glass,5);
  b.box(ENTRY,3.39,D+1.00,5.35,.055,1.90,C.glass,5);
  for(const z of[D+.075,front])b.box(ENTRY,3.43,z,5.48,.10,.11,C.silver,9);
  for(const x of[ENTRY-1.32,ENTRY,ENTRY+1.32])b.box(x,3.435,D+1.0,.055,.09,1.90,C.silver,9);
  b.box(ENTRY,3.87,front,5.50,.92,.10,C.green,24);
  for(const y of[3.41,4.33])b.box(ENTRY,y,front+.045,5.55,.055,.12,C.silver,9);
  for(const x of[ENTRY-2.76,ENTRY+2.76])b.box(x,3.87,front+.045,.045,.96,.12,C.silver,9);
  // Text order follows the photographed right-to-left plaque, not a newly invented inscription.
  sign('green-name','园 佟 真 清',ENTRY,3.88,front+.065,5.25,.82,C.white,C.green);
  sign('visible-gold-name','園 佟',ENTRY-1.05,4.44,D+.04,2.54,.55,C.gold);
  // Only the one photographed small square ventilation block is reproduced.
  const vx=ENTRY+3.65,vy=4.26;b.box(vx,vy,D+.015,.43,.38,.05,C.stone,24);
  for(const x of[-.125,0,.125])for(const y of[-.095,.095])b.box(vx+x,vy+y,D+.044,.065,.075,.016,C.dark,24);
 });
 group('steps-and-left-ramp',()=>{
  for(let k=0;k<4;k++){const h=H.base-k*.135;b.box(ENTRY,h/2,D+2.20+k*.33,4.92,h,.34,C.stone,24);}
  const {start,end,near,far}=ramp,slope=x=>.03+(H.base-.03)*(x-start)/(end-start),g=new G.Geometry();
  g.quad([start,.03,near],[end,H.base,near],[end,H.base,far],[start,.03,far]);for(const z of[near,far])g.quad([start,0,z],[end,0,z],[end,H.base,z],[start,.03,z]);g.quad([end,0,near],[end,0,far],[end,H.base,far],[end,H.base,near]);mesh('left-ramp-surface',g,C.stone);
  for(const z of[near,far]){for(let k=0;k<=7;k++){const x=start+(end-start)*k/7;b.box(x,slope(x)+.49,z,.045,.98,.045,C.silver,9);}for(const h of[.50,.98])b.beam([start,slope(start)+h,z],[end,slope(end)+h,z],.027,C.silver,9);}
  // Ramp ends at the side opening; no rail cuts across its connection to the platform.
  for(const x of[ENTRY-2.57,ENTRY+2.57]){b.beam([x,1.50,D+2.12],[x,.97,D+3.26],.027,C.silver,9);for(let k=0;k<3;k++){const z=D+2.12+k*.57,y=.53-k*.265;b.box(x,y+.47,z,.044,.94,.044,C.silver,9);}}
 });}
 b.local(O[0],0,O[1],0,()=>{
  group('source-footprint-base',()=>{mesh('base-side',F.walls(shape,0,H.base),C.stone);mesh('base-floor',F.surface(shape,H.base),C.stone);});
  const southMid=(.470+W)/2,south=[3.10,6.80,10.60,22.30,26.20,30.20].map(x=>({x:x-southMid,w:2.28,lo:1.37,hi:3.48}));south.push({x:ENTRY-southMid,w:2.70,lo:H.base,hi:3.53,door:true});south.sort((a,b)=>a.x-b.x);
  face([.470,D],[W,D],'south-front-provisional',south);
  face([W,0],[0,.477],'fitted-north',[-12,-8,-4,0,4,8,12].map(x=>({x,w:2.26,lo:1.43,hi:3.49})));
  face([0,.477],[.470,D],'fitted-west',[-2.7,2.7].map(x=>({x,w:2.0,lo:1.43,hi:3.49})));
  face([W,D],[W,0],'fitted-east',[-2.8,2.8].map(x=>({x,w:2.0,lo:1.43,hi:3.49})));
  group('roof-provisional',roof);entrance();
 });
 return{strategy:'building059-v46',floors:1,sourceOutline:true,whitePlasterObserved:true,tileCorniceObserved:true,silverGlazedVestibuleObserved:true,woodenDoubleDoorObserved:true,leftRampObserved:true,entranceDirectionVerified:false,fullFacadeVerified:false,roofEndsVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building059={id:ID,render,world,local,W,D,H,ENTRY,ramp};
})(YY);
