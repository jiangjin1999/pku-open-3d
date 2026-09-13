/* Old Panda building, distinct from the new building south of it. The school's
 * own exterior photo supplies two storeys, white walls, red columns, painted
 * beams and an open low-roof portico. Recess depths and hidden faces are fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/679485570';
const O=[-372.224,-424.929],R=-Math.atan2(.566,36.835),CO=Math.cos(R),SI=Math.sin(R);
const W=Math.hypot(36.835,.566),D=14.670,LW=8.05,RW=5.85,BACK=9.75,WING=13.42;
const H={base:.65,wall:6.88,eave:7.48,ridge:9.42},ENTRY={x:(LW+W-RW)/2,z:BACK,front:13.80,width:11.8};
const C={wall:'#e0dfcf',base:'#a4aaa2',stone:'#bbbbb0',frame:'#554c3e',glass:'#718b8a',red:'#a04a3a',darkRed:'#763d30',blue:'#284c68',cyan:'#448482',gold:'#c5b97c',cream:'#e0d8ae',tile:'#858a80',ridge:'#a6aaa0'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const add=b.e.add;b.e.add=function(k,...v){return add.call(this,'067-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=add;}};
 const mesh=(key,g,c,mat=24)=>b.mesh('067-'+key,g,0,0,0,1,1,1,c,mat);
 function frame(q){group('windows',()=>{
  const {x,w,lo,hi}=q,h=hi-lo;b.box(x,(lo+hi)/2,-.10,w,h,.038,C.glass,5);
  for(let i=0;i<=q.panes;i++)b.box(x-w/2+w*i/q.panes,(lo+hi)/2,-.018,.058,h+.06,.18,C.frame,6);
  for(const y of[lo,hi,hi-.43])b.box(x,y,-.008,w+.07,.058,.20,C.frame,6);
  b.box(x,lo-.075,.06,w+.24,.11,.32,C.stone,24);
  b.box(x,hi+.055,.025,w+.18,.09,.13,C.wall,24);
 });}
 function painted(width,y=7.10){group('painted-beams',()=>{
  b.box(width/2,y,.095,width,.43,.22,C.blue,10);
  for(const dy of[-.23,.23])b.box(width/2,y+dy,.125,width+.05,.043,.24,C.cream,10);
  for(const dy of[-.18,.18])b.box(width/2,y+dy,.225,width,.022,.02,C.gold,10);
  const n=Math.max(1,Math.round(width/4.4)),step=width/n;
  for(let i=0;i<n;i++){
   const x=(i+.5)*step,w=step*.68,h=.25,cut=.14,points=[[-w/2+cut,-h/2],[w/2-cut,-h/2],[w/2,0],[w/2-cut,h/2],[-w/2+cut,h/2],[-w/2,0]];
   const line=new G.Geometry();for(let k=0;k<points.length;k++){const p=points[k],q=points[(k+1)%points.length],dy=q[1]-p[1],dx=q[0]-p[0],len=Math.hypot(dx,dy),nx=-dy/len*.012,ny=dx/len*.012;line.quad([x+p[0]-nx,y+p[1]-ny,.232],[x+q[0]-nx,y+q[1]-ny,.232],[x+q[0]+nx,y+q[1]+ny,.232],[x+p[0]+nx,y+p[1]+ny,.232]);}
   mesh('beam-cartouche-'+width+'-'+y+'-'+i,line,C.gold,10);
   b.box(x,y,.226,w-.36,.115,.013,C.cyan,10);
   for(const side of[-1,1]){
    const a=x+side*step*.445;b.box(a,y,.227,.11,.29,.025,C.cream,10);
    for(let j=0;j<8;j++){const t=j*Math.PI/4;b.sphere(a+Math.cos(t)*.088,y+Math.sin(t)*.088,.245,.031,.031,.012,C.gold,10);}
    b.sphere(a,y,.249,.044,.044,.015,C.cream,10);
   }
  }
 });}
 function face(name,x,z,r,width,bays,door=false,decor=true){b.local(x,0,z,r,()=>group('face-'+name,()=>{
  const holes=[];for(const [i,u]of bays.entries()){
   holes.push({x:u,w:Math.min(name==='south-west-wing'?4.55:3.28,width/bays.length*.68),lo:4.32,hi:6.46,panes:name==='south-west-wing'?4:3});
   if(door&&i===2)holes.push({x:u,w:2.24,lo:.19,hi:3.08,door:true});else holes.push({x:u,w:Math.min(name==='south-west-wing'?4.55:3.28,width/bays.length*.68),lo:1.01,hi:2.99,panes:name==='south-west-wing'?4:3});
  }
  const levels=[0,H.base,H.wall,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b),wall=(a,c,lo,hi)=>{if(c>a+1e-5)b.box((a+c)/2,(lo+hi)/2,-.19,c-a,hi-lo,.38,hi<=H.base?C.base:C.wall,24);};
  for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.001&&q.hi>=hi-.001).sort((a,b)=>a.x-b.x);let c=0;
   for(const q of cuts){wall(c,q.x-q.w/2,lo,hi);c=q.x+q.w/2;}wall(c,width,lo,hi);
  }
  for(const q of holes)if(q.door){group('recessed-door-fitted',()=>{
   b.box(q.x,1.63,-.21,2.2,2.84,.075,C.frame,6);
   for(const dx of[-.53,.53])b.box(q.x+dx,1.65,-.161,.94,2.50,.026,C.glass,5);
   b.box(q.x,1.66,-.12,.07,2.79,.07,C.frame,6);
   for(const dx of[-.09,.09])b.box(q.x+dx,1.43,-.063,.027,.30,.036,'#b7afa0',9);
  });}else frame(q);
  for(const y of[H.base+.015,3.36,3.64])b.box(width/2,y,.025,width,.035,.065,C.wall,24);
  if(decor)painted(width);
 }));}
 function column(x,z,height,r=.255){b.cyl(x,.26,z,r,height-.26,C.red,24,1,10);b.cyl(x,.06,z,r+.10,.22,C.base,24,1,24);for(const y of[height-.12,height-.24])b.cyl(x,y,z,r+.012,.037,C.gold,24,1,10);}
 // Cross width and longitudinal length; local roof ridge runs north/south.
 function roof(name,cx,cz,cross,len,angle,eave,top,ends=true){b.local(cx,0,cz,angle,()=>b.local(-cross/2,0,-len/2,0,()=>group('roof-'+name,()=>{
  const mid=cross/2,shoulder=cross*.17,lip=.78,end=Math.min(1.55,len*.16),rise=top-eave;
  const curve=[[-lip,eave],[0,eave-.08],[shoulder*.5,eave+rise*.15],[shoulder,eave+rise*.35],[(shoulder+mid)/2,eave+rise*.60],[mid,top]];
  const gabled=name==='portico',endAt=x=>gabled?-lip:x<=0?x:x<=shoulder*.5?x/(shoulder*.5)*end*.45:x<shoulder?end*.45+(x-shoulder*.5)/(shoulder*.5)*end*.55:end;
  const g=new G.Geometry(),tiles=new G.Geometry();
  for(const side of[-1,1]){
   const xx=x=>side<0?x:cross-x;
   for(let i=1;i<curve.length;i++){
    const [x0,y0]=curve[i-1],[x1,y1]=curve[i],a=endAt(x0),c=endAt(x1);
    g.quad([xx(x0),y0,a],[xx(x0),y0,len-a],[xx(x1),y1,len-c],[xx(x1),y1,c]);
    for(let z=-lip+.08;z<len+lip-.04;z+=.185){const lo=Math.max(z,a,c),hi=Math.min(z+.035,len-a,len-c);if(hi>lo)tiles.quad([xx(x0),y0+.018,lo],[xx(x0),y0+.018,hi],[xx(x1),y1+.018,hi],[xx(x1),y1+.018,lo]);}
   }
  }
  for(const side of[-1,1]){
   const zz=z=>side<0?z:len-z,bands=[[-lip,eave,-lip],[0,eave-.08,0],[end*.45,eave+rise*.15,shoulder*.5],[end,eave+rise*.35,shoulder]];
   for(let i=1;!gabled&&i<bands.length;i++){
    const [a,ya,xa]=bands[i-1],[c,yc,xc]=bands[i];g.quad([xa,ya,zz(a)],[cross-xa,ya,zz(a)],[cross-xc,yc,zz(c)],[xc,yc,zz(c)]);
    for(let x=-lip+.06;x<cross+lip;x+=.185){const lo=Math.max(x,xa,xc),hi=Math.min(x+.035,cross-xa,cross-xc);if(hi>lo)tiles.quad([lo,ya+.018,zz(a)],[hi,ya+.018,zz(a)],[hi,yc+.018,zz(c)],[lo,yc+.018,zz(c)]);}
   }
   const p=gabled?[...curve,...curve.slice(0,-1).reverse().map(([x,y])=>[cross-x,y])].map(([x,y])=>[x,y,zz(-lip)]):[[shoulder,eave+rise*.35,zz(end)],[(shoulder+mid)/2,eave+rise*.60,zz(end)],[mid,top,zz(end)],[cross-(shoulder+mid)/2,eave+rise*.60,zz(end)],[cross-shoulder,eave+rise*.35,zz(end)]],gable=new G.Geometry();
   if(gabled){const base=[mid,eave-.23,zz(-lip)];for(let i=1;i<p.length;i++)gable.tri(base,p[i-1],p[i]);}else for(let i=1;i<p.length-1;i++)gable.tri(p[0],p[i],p[i+1]);mesh(name+'-upper-gable-'+side,gable,gabled?C.darkRed:C.frame,6);
   if(ends){
    const z=zz(end-.20),ornament=new G.Geometry(),profile=[[0,0],[.28,.05],[.43,.31],[.37,.56],[.18,.64],[-.06,.60],[-.17,.42],[-.06,.23]];
    for(const dx of[-.09,.09])for(let j=1;j<profile.length-1;j++)ornament.tri([mid+dx,top+profile[0][1],z+side*profile[0][0]],[mid+dx,top+profile[j][1],z+side*profile[j][0]],[mid+dx,top+profile[j+1][1],z+side*profile[j+1][0]]);
    for(let j=0;j<profile.length;j++){const a=profile[j],c=profile[(j+1)%profile.length];ornament.quad([mid-.09,top+a[1],z+side*a[0]],[mid+.09,top+a[1],z+side*a[0]],[mid+.09,top+c[1],z+side*c[0]],[mid-.09,top+c[1],z+side*c[0]]);}mesh(name+'-ridge-end-'+side,ornament,C.ridge,2);
   }
  }
  mesh(name+'-curved-surfaces',g,C.tile,2);tiles.detailWidth=.035;mesh(name+'-tile-channels',tiles,C.ridge,2);b.box(mid,top+.045,len/2,.22,.14,gabled?len+2*lip:len-2*end+.50,C.ridge,2);
  // Red rafters, pale painted ends, and a thin dark tile lip below the roof.
  for(const [x,z,r,width]of[[0,len,0,cross],[cross,0,Math.PI,cross],[cross,len,Math.PI/2,len],[0,0,-Math.PI/2,len]])b.local(x,0,z,r,()=>{
   b.box(width/2,eave-.19,.36,width+1.50,.12,.65,C.darkRed,6);
   for(let u=-.57;u<width+.60;u+=.28){b.box(u,eave-.14,.45,.085,.095,.54,C.red,6);b.box(u,eave-.14,.732,.091,.095,.029,C.gold,10);}
   b.box(width/2,eave-.025,.752,width+1.53,.052,.082,C.ridge,2);
  });
 })));}
 function portico(){group('open-portico',()=>{
  const x=ENTRY.x,w=ENTRY.width,back=BACK+.18,front=ENTRY.front;
  b.box(x,.12,(back+front)/2,w+.28,.24,front-back+.55,C.base,21);
  b.box(x,.055,front+.54,w+.56,.11,.55,C.stone,21);
  for(const u of[-w/2,-w/6,w/6,w/2])column(x+u,front-.20,3.22,.185);
  for(const u of[-w/2,w/2])column(x+u,back+.15,3.22,.185);
  b.local(x-w/2,0,front-.20,0,()=>painted(w,3.27));
  for(const u of[-w/2,w/2])b.box(x+u,3.24,(back+front)/2,.25,.27,front-back,C.darkRed,6);
  b.local(x-w/2,0,back,-Math.PI/2,()=>painted(front-back,3.27));
  b.local(x+w/2,0,front,Math.PI/2,()=>painted(front-back,3.27));
 });roof('portico',ENTRY.x,(BACK+ENTRY.front)/2,ENTRY.front-BACK+.35,ENTRY.width+.42,Math.PI/2,3.63,4.47,false);}
 b.local(O[0],0,O[1],R,()=>{
  const body=[[0,0],[W,0],[W,WING],[W-RW,WING],[W-RW,BACK],[LW,BACK],[LW,WING],[0,WING],[0,0]];
  group('floor',()=>mesh('fitted-recessed-body-floor',F.surface({type:'Polygon',coordinates:[body]},.17),C.base,21));
  const span=W-LW-RW,bays=Array.from({length:5},(_,i)=>(i+.5)*span/5);
  face('south-main',LW,BACK,0,span,bays,true);
  face('south-west-wing',0,WING,0,LW,[LW/2]);
  face('south-east-wing',W-RW,WING,0,RW,[RW/2]);
  face('west',0,0,-Math.PI/2,WING,[2.78,7.03,11.28]);
  face('east-fitted',W,WING,Math.PI/2,WING,[2.78,7.03,11.28]);
  face('north-fitted',W,0,Math.PI,W,Array.from({length:8},(_,i)=>(i+.5)*W/8));
  face('west-return-fitted',LW,WING,Math.PI/2,WING-BACK,[(WING-BACK)/2],false,false);
  face('east-return-fitted',W-RW,BACK,-Math.PI/2,WING-BACK,[(WING-BACK)/2],false,false);
  group('two-storey-red-columns',()=>{
   for(let i=0;i<=5;i++)column(LW+i*span/5,BACK+.18,6.95);
   column(LW-.10,WING+.12,6.95);column(W-RW+.10,WING+.12,6.95);
  });
  roof('west-wing',LW/2,WING/2,WING,LW,Math.PI/2,H.eave+.10,H.ridge+.15);
  roof('east-wing',W-RW/2,WING/2,WING,RW,Math.PI/2,H.eave+.10,H.ridge+.15);
  roof('main',LW+span/2,BACK/2,BACK,span,Math.PI/2,H.eave,H.ridge);
  portico();
  group('west-courtyard-marker',()=>{b.box(.98,1.43,WING+.68,1.1,2.86,.35,C.wall,24);b.box(.413,1.85,WING+.68,.035,1.65,.22,'#8d7954',9);});
  group('west-rainpipe',()=>{b.cyl(.15,.65,WING+.06,.035,6.12,C.wall,12,1,9);});
 });
 return{strategy:'building067-v46',floors:2,roofGroups:4,entranceFacing:'south-registered',openPortico:true,sourceOutlinePreserved:true,recessDepthMeasured:false,allFacadesVerified:false,doorLeafArrangementVerified:false,annexBoundaryVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building067={id:ID,render,W,D,LW,RW,BACK,WING,H,ENTRY,R,world,local};
})(YY);
