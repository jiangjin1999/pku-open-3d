/* Yannan, after the 2023 reopening. Exterior: dated PKU and visitor photographs.
 * North/east doors are separate; roof opening and mezzanine follow the renovation.
 * Dimensions, unseen elevations and entrance offsets are fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/446944417';
const O=[-5.731,297.939],R=Math.atan2(.911,30.925),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(.911,30.925),D=22.62;
const H={base:.45,mezzanine:3.62,wall:7.32,deck:7.38,parapet:7.75,skylight:7.82,top:8.16};
const C={brick:'#a8aea7',stone:'#c9c7ba',panel:'#a9b2b1',joint:'#515d5c',metal:'#b6c1ba',frame:'#7e8c89',glass:'#829994',roof:'#929b91',white:'#d1d2c5',floor:'#939c96',wood:'#b99d6e',dark:'#424e48',gold:'#bbae82'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const atrium={x0:9,x1:26,z0:5.2,z1:18.3};
const rect=(x0,z0,x1,z1)=>[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]];
function render(b,f,add){b.id=f.properties.pickId;let clearPane=0;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'062-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,col,mat=24)=>b.mesh('062-'+key,g,0,0,0,1,1,1,col,mat);
 const a=atrium,ring=f.geometry.coordinates[0].map(local),cut=rect(a.x0,a.z0,a.x1,a.z1),roof={type:'Polygon',coordinates:[ring,cut]};
 function lettering(slot,words,x,y,z,w,h,vertical=false){
  const key='062-sign-'+slot,px=512+slot*512,py=3584,uv=[px/4096,1-(py+512)/4096,512/4096,512/4096];
  if(!b.signs.has(key)){
   b.signs.set(key,uv);const paint=()=>{const c=b.ctx;c.save();c.translate(px,py);c.clearRect(0,0,512,512);c.fillStyle=C.gold;c.textAlign='center';c.textBaseline='middle';
    if(vertical){c.save();c.scale(h/w,1);c.font='600 102px "Kaiti SC","Songti SC",serif';[...words].forEach((q,i)=>c.fillText(q,220/(h/w),61+i*118));c.restore();c.font='26px Arial';[...'YANNANMEISHI'].forEach((q,i)=>c.fillText(q,363,58+i*35));}
    else{c.scale(1,w/h);c.font='600 98px "Kaiti SC","Songti SC",serif';c.fillText(words,256,78,500);c.font='43px Arial';c.fillText('YAN NAN MEI SHI',256,160,488);}c.restore();};
   if(b.e.setAtlas){const old=b.e.setAtlas;b.e.setAtlas=function(canvas){this.setAtlas=old;const result=old.call(this,canvas);const pixels=canvas.getContext('2d').getImageData(px/2,py/2,256,256).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i])throw Error('062 label slot occupied');paint();if(this.gl)this.setAtlas(canvas);return result;};}else paint();
  }
  group('lettering',()=>b.mesh('plane',b.geo('plane',G.plane),x,y,z,w,h,1,'#ffffff',8,0,0,uv));
 }
 function glass(x,lo,hi,z,w,door=false){const cy=(lo+hi)/2;
  b.mesh('062-clear-pane-'+clearPane++,b.geo('plane',G.plane),x,cy,z-.055,w,hi-lo,1,C.glass,44);
  for(const xx of[x-w/2,x+w/2])b.box(xx,cy,z,.075,hi-lo+.09,.095,C.frame,29);
  for(const yy of[lo,hi])b.box(x,yy,z,w+.08,.075,.095,C.frame,29);
  b.box(x,cy,z,.045,hi-lo,.075,C.frame,29);
  if(door){for(const xx of[x-.12,x+.12]){b.beam([xx,1.08,z+.14],[xx,1.96,z+.14],.02,C.metal,9);for(const yy of[1.16,1.90])b.beam([xx,yy,z],[xx,yy,z+.14],.018,C.metal,9);}b.box(x,1.52,z+.015,w,.075,.015,'#b4beb6',24);}
  else b.box(x,hi-.47,z,w,.05,.075,C.frame,29);
 }
 function vestibule(side,cx,width,depth){group(side+'-vestibule',()=>{
  const hw=width/2,top=4.10;
  b.box(cx,H.base/2,depth/2,width+.44,H.base,depth+.28,C.stone,21);
  for(let k=0;k<3;k++)b.box(cx,(.45-.15*k)/2,depth+.28+k*.34,width+.46,.45-.15*k,.35,C.stone,21);
  // Three paired doors in the east vestibule, two in the narrower north one.
  const count=side==='east'?3:2,step=(width-.65)/count;
  for(let k=0;k<count;k++)glass(cx+(k-(count-1)/2)*step,.45,3.18,depth,step-.14,true);
  for(const dx of[-hw,hw]){
   b.box(cx+dx,2.23,depth,.24,3.56,.22,C.panel,24);
   b.local(cx+dx,0,depth/2,Math.PI/2,()=>glass(0,.52,3.18,0,depth-.28));
   for(const yy of[1.26,2.55])b.box(cx+dx,yy,depth+.12,.245,.018,.015,C.joint,24);
  }
  b.box(cx,3.64,depth,width+.34,.89,.30,C.panel,24);b.box(cx,4.105,depth/2,width+.43,.13,depth+.52,C.roof,25);
  for(let k=0;k<=Math.ceil(width/1.1);k++)b.box(cx-hw+width*k/Math.ceil(width/1.1),3.65,depth+.158,.022,.87,.012,C.joint,24);
  for(const yy of[3.23,3.96])b.box(cx,yy,depth+.17,width+.36,.025,.022,C.joint,24);
  for(const dx of[-hw-.20,hw+.20]){const z0=depth+.12,z1=depth+1.08;b.beam([cx+dx,1.42,z0],[cx+dx,1.0,z1],.023,C.metal,9);for(const[z,y]of[[z0,.45],[z1,.15]])b.beam([cx+dx,y,z],[cx+dx,y+.98,z],.022,C.metal,9);}
  if(side==='north')lettering(0,'燕南美食',cx,4.96,depth+.17,width*.94,2.45);
 });}
 b.local(O[0],0,O[1],R,()=>{
  group('floor',()=>{mesh('ground-floor',F.surface({type:'Polygon',coordinates:[ring]},H.base),C.floor,21);mesh('base-perimeter',F.walls({type:'Polygon',coordinates:[ring]},0,H.base),C.stone,24);});
  group('mezzanine',()=>{mesh('mezzanine-deck',F.surface(roof,H.mezzanine),C.white);mesh('mezzanine-soffit',F.surface(roof,H.mezzanine-.22),C.white);mesh('mezzanine-inner-edge',F.walls({type:'Polygon',coordinates:[cut]},H.mezzanine-.22,H.mezzanine),C.white);});
  group('roof-deck',()=>{mesh('roof-deck-holed',F.surface(roof,H.deck),C.roof,25);mesh('roof-soffit-holed',F.surface(roof,H.deck-.22),C.white);});
  const corners=[[0,0],[W,0],[31.426,22.62],[.716,22.393]],names=['north','east','south','west'];
  for(let side=0;side<4;side++){
   const p=corners[side],q=corners[(side+1)%4],dx=q[0]-p[0],dz=q[1]-p[1],length=Math.hypot(dx,dz),rot=Math.atan2(dz,-dx),ox=(p[0]+q[0])/2,oz=(p[1]+q[1])/2;
   b.local(ox,0,oz,rot,()=>group('face-'+names[side],()=>{
    const openings=[],entryX=side===0?W/2-5.35:-2.7,entryW=side===0?6.20:10.65;
    if(side<2){openings.push({x:entryX,w:entryW,lo:H.base,hi:3.22,door:true});
     if(side===0){for(const x of[-12.5,-8.0,-3.5,1.0,5.5,10.0])for(const[lo,hi]of[[.96,3.08],[4.49,6.69]])if(!(lo<4&&Math.abs(x-entryX)<entryW/2+1.15))openings.push({x,w:2.13,lo,hi});}
     else for(const x of[entryX-3.9,entryX,entryX+3.9])openings.push({x,w:2.06,lo:4.49,hi:6.67});
    }else{for(let k=0;k<(side===2?6:4);k++){const x=-length/2+3.1+k*(length-6.2)/((side===2?6:4)-1);openings.push({x,w:1.8,lo:4.5,hi:6.4});}if(side===3)openings.push({x:2.5,w:1.85,lo:H.base,hi:2.8,door:true});}
    const bands=[H.base,...openings.flatMap(o=>[o.lo,o.hi]),H.wall].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
    const panel=(l,r,lo,hi)=>{if(r-l>1e-5){b.box((l+r)/2,(lo+hi)/2,-.16,r-l,hi-lo,.30,C.brick,30);group('interior-plaster',()=>b.box((l+r)/2,(lo+hi)/2,-.326,r-l,hi-lo,.02,C.white,24));}};
    for(let j=1;j<bands.length;j++){const lo=bands[j-1],hi=bands[j],active=openings.filter(o=>o.lo<=lo+.001&&o.hi>=hi-.001).sort((a,b)=>a.x-b.x);let cursor=-length/2;for(const o of active){panel(cursor,o.x-o.w/2,lo,hi);cursor=o.x+o.w/2;}panel(cursor,length/2,lo,hi);}
    for(const o of openings)group('glazing',()=>glass(o.x,o.lo,o.hi,.025,o.w,!!o.door));
    b.box(0,.33,-.025,length,.66,.36,C.stone,24);b.box(0,7.47,-.02,length+.12,.30,.42,C.stone,24);b.box(0,7.655,-.02,length+.16,.075,.48,C.roof,25);
    for(const x of[-length/2+.16,length/2-.16])b.box(x,3.9,.015,.32,6.6,.35,C.stone,24);
    if(side===0)for(const x of[-10.25,-5.75,-1.25,3.25,7.75])b.box(x,3.9,.025,.29,6.6,.34,C.stone,24);
    if(side===1){
     for(const x of[entryX-entryW/2-.38,entryX+entryW/2+.38])b.box(x,3.76,.24,.70,6.46,.50,C.stone,24);
     b.box(entryX,6.98,.24,entryW+1.45,.40,.50,C.stone,24);
     for(const x of[4.3,8.0]){b.box(x,6.64,.04,1.22,.56,.09,C.frame,29);for(let i=0;i<6;i++)b.box(x,6.41+i*.085,.10,1.11,.038,.055,C.panel,29);}
     lettering(1,'燕南美食',8.37,5.0,.19,1.43,3.3,true);
    }
    if(side<2)vestibule(names[side],entryX,entryW-.15,side===0?2.65:1.9);
    // Small roof guard wire and drainpipe observed at the exposed corner.
    b.beam([-length/2,7.98,-.03],[length/2,7.98,-.03],.012,C.metal,9);
    for(let x=-length/2+.3;x<length/2;x+=3.1)b.beam([x,7.7,-.03],[x,7.99,-.03],.012,C.metal,9);
    if(side===0||side===1)b.box(length/2-.24,3.85,.21,.08,7.1,.10,C.metal,29);
   }));
  }
  group('skylight',()=>{
   for(const x of[a.x0,a.x1]){b.box(x,7.45,(a.z0+a.z1)/2,.32,.73,a.z1-a.z0+.3,C.white);b.box(x,7.84,(a.z0+a.z1)/2,.28,.10,a.z1-a.z0+.4,C.frame,29);}
   for(const z of[a.z0,a.z1]){b.box((a.x0+a.x1)/2,7.45,z,a.x1-a.x0,.73,.32,C.white);b.box((a.x0+a.x1)/2,7.84,z,a.x1-a.x0+.35,.10,.28,C.frame,29);}
   const nx=6,nz=4,sx=(a.x1-a.x0)/nx,sz=(a.z1-a.z0)/nz;
   for(let i=0;i<=nx;i++)b.box(a.x0+i*sx,7.64,(a.z0+a.z1)/2,.15,.31,a.z1-a.z0,C.frame,29);
   for(let j=0;j<=nz;j++)b.box((a.x0+a.x1)/2,7.71,a.z0+j*sz,a.x1-a.x0,.17,.13,C.frame,29);
   for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){
    const x0=a.x0+i*sx+.09,x1=a.x0+(i+1)*sx-.09,z0=a.z0+j*sz+.08,z1=a.z0+(j+1)*sz-.08,open=(j===1&&(i===1||i===4)),rise=open?.27:0;
    const g=new G.Geometry();g.quad([x0,7.78,z0],[x0,7.78+rise,z1],[x1,7.78+rise,z1],[x1,7.78,z0]);mesh((open?'skylight-open-vent-':'skylight-pane-')+i+'-'+j,g,C.glass,44);
    if(open){for(const x of[x0,x1])b.beam([x,7.78,z0],[x,8.05,z1],.027,C.frame,29);b.beam([x0,8.05,z1],[x1,8.05,z1],.027,C.frame,29);}
   }
  });
  group('atrium-frame',()=>{
   for(const x of[a.x0,a.x1])for(const z of[a.z0,(a.z0+a.z1)/2,a.z1])b.box(x,3.93,z,.48,6.96,.54,C.white,24);
   for(const x of[a.x0,a.x1])b.box(x,6.92,(a.z0+a.z1)/2,.55,.78,a.z1-a.z0,C.white,24);
   for(const z of[a.z0,a.z1])b.box((a.x0+a.x1)/2,6.92,z,a.x1-a.x0,.78,.55,C.white,24);
  });
  group('mezzanine-rail',()=>{
   for(const x of[a.x0,a.x1]){const g=new G.Geometry();g.quad([x,3.64,a.z0+.2],[x,4.70,a.z0+.2],[x,4.70,a.z1-.2],[x,3.64,a.z1-.2]);mesh('clear-rail-x-'+x,g,C.glass,44);b.beam([x,4.72,a.z0],[x,4.72,a.z1],.024,C.metal,9);}
   for(const z of[a.z0,a.z1]){const end=z===a.z1?22.5:a.x1,g=new G.Geometry();g.quad([a.x0,3.64,z],[end,3.64,z],[end,4.70,z],[a.x0,4.70,z]);mesh('clear-rail-z-'+z,g,C.glass,44);b.beam([a.x0,4.72,z],[end,4.72,z],.024,C.metal,9);}
  });
  group('southeast-stair',()=>{
   const x=24.2,z0=8.1,run=10.2,n=22,width=2.8,rise=(H.mezzanine-H.base)/n;
   // Each thin tread has a riser; the stair underside remains open.
   for(let i=0;i<n;i++){const y=H.base+(i+1)*rise,z=z0+(i+.5)*run/n;b.box(x,y-.06,z,width,.12,run/n+.015,C.wood,24);b.box(x,y-rise/2,z0+i*run/n,width,rise,.065,C.white,24);}
   for(const xx of[x-width/2,x+width/2]){
    const g=new G.Geometry();g.quad([xx,H.base+1.04,z0],[xx,H.mezzanine+1.04,z0+run],[xx,H.mezzanine,z0+run],[xx,H.base,z0]);mesh('stair-glass-'+xx,g,C.glass,44);b.beam([xx,H.base+1.09,z0],[xx,H.mezzanine+1.09,z0+run],.025,C.metal,9);
    b.beam([xx,H.base-.06,z0],[xx,H.mezzanine-.12,z0+run],.095,C.white,24);
   }
  });
  group('perimeter-counter',()=>{for(let j=0;j<5;j++){const z=4.1+j*3.1;b.box(3.4,.99,z,4.6,1.08,2.6,C.dark,24);b.box(3.4,1.56,z,4.65,.09,2.67,C.metal,9);b.box(1.28,2.64,z,.35,.3,2.61,C.metal,9);}});
  group('furniture',()=>{for(const x of[11.1,14.1,17.1,20.1])for(const z of[7.1,10.1,13.1,16.1]){
   b.box(x,1.24,z,1.75,.10,1.13,C.wood,24);
   for(const dx of[-.65,.65]){for(const dz of[-.39,.39])b.box(x+dx,.83,z+dz,.055,.74,.055,C.dark,9);for(const dz of[-.95,.95]){b.box(x+dx,.93,z+dz,.50,.065,.47,C.wood,24);b.box(x+dx,1.22,z+dz+Math.sign(dz)*.21,.5,.48,.05,C.wood,24);for(const side of[-1,1])for(const back of[-.17,.17])b.box(x+dx+side*.19,.67,z+dz+back,.033,.48,.033,C.dark,9);}}
  }});
 });
 return{strategy:'building062-v46',floors:2,mezzanine:true,skylight:true,blueHistoricPortal:false,centralServingIsland:false,northAndEastDoors:true,allFacadesVerified:false,heightMeasured:false,entranceOffsetsMeasured:false,roofGridMeasured:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building062={id:ID,render,world,local,W,D,H,atrium};
})(YY);
