/* Songlin: red-brick shop behind an open forecourt; two blue dining shelters.
   User correction 2026-09-12: restore the original OSM envelope and the gap to
   Xueyi; keep east entrances aligned. Twin shelter gables are seen from the side.
   Local authoring coordinates retain the details; dimensions remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/444894328';
const W=22.50,I=.30,ENTRY=14.50;
const O=[-181.065,622.259],R=Math.atan2(16.699,-.905),CO=Math.cos(R),SI=Math.sin(R);
const SX=Math.hypot(.905,16.699)/W,X=Y.Building053;
// Align the shop door itself with Xueyi's east door. The open forecourt is an
// outdoor extension beyond the restored OSM building footprint.
const doorBack=X.local([O[0]+ENTRY*SX*CO,O[1]-ENTRY*SX*SI]);
const east=X.world(1,0).map((v,i)=>v-X.world(0,0)[i]);
const FRONT=(X.W-X.I-doorBack[0])/(SI*east[0]+CO*east[1]),D=FRONT+7.824,GATE=FRONT+7.63,SZ=1;
const H={base:.84,wall:4.22,deck:4.28,cap:4.68,top:5.18};
const C={brick:'#966953',cream:'#d0cbb9',stone:'#aaa697',dark:'#46524e',roof:'#7f8579',glass:'#596d68',gold:'#c6ac63',blue:'#476ba0',iron:'#404c47',wood:'#a6815e',paving:'#bdc0b3',green:'#72856a'};
const world=(u,v)=>[O[0]+u*SX*CO+v*SZ*SI,O[1]-u*SX*SI+v*SZ*CO],local=p=>[((p[0]-O[0])*CO-(p[1]-O[1])*SI)/SX,((p[0]-O[0])*SI+(p[1]-O[1])*CO)/SZ];
const sheds=[{x0:.90,x1:8.10,z0:FRONT+.65,z1:FRONT+4.00},{x0:.90,x1:8.10,z0:FRONT+4.00,z1:FRONT+7.35}],SH={eave:2.61,ridge:4.31};
// A closed extrusion of a building-specific vertical profile, not an opaque box behind an opening.
function profile(points,z0,z1){const g=new G.Geometry(),flat=G.polygon(points,0),n=points.length;for(let i=0;i<flat.v.length;i+=24){const a=flat.v.slice(i,i+3),c=flat.v.slice(i+8,i+11),b=flat.v.slice(i+16,i+19);g.tri([a[0],a[2],z1],[b[0],b[2],z1],[c[0],c[2],z1]);g.tri([a[0],a[2],z0],[c[0],c[2],z0],[b[0],b[2],z0]);}for(let j=0;j<n;j++){const a=points[j],b=points[(j+1)%n];g.quad([a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]);}return g;}
function render(b,f,add){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'054-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('054-'+name,g,0,0,0,1,1,1,col,mat);
 function paintSign(key,draw,x,y,z,w,h){const old=b.e.add;/* Keep this sign's sampling inside its own atlas cell, including mip filtering. */b.e.add=function(k,g,m,c,p,uv){const q=uv&&[uv[0]+8/4096,uv[1]+8/4096,uv[2]-16/4096,uv[3]-16/4096];return old.call(this,k,g,m,c,p,q);};try{b.sign('054-'+key,x,y,z,w,h,0,true);}finally{b.e.add=old;}const uv=b.signs.get('054-'+key+'_true');if(!uv)return;const px=uv[0]*4096,py=(1-uv[1]-uv[3])*4096;b.ctx.save();b.ctx.translate(px,py);b.ctx.clearRect(0,0,512,128);draw(b.ctx);b.ctx.restore();}
 function letters(key,words,x,y,z,w,h,col=C.gold,small=''){paintSign(key,c=>{c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.font='600 96px "Kaiti SC","Songti SC",serif';c.fillText(words,256,small?46:67,492);if(small){c.font='500 34px Arial';c.fillText(small,256,106,445);}},x,y,z,w,h);}
 function curve(points,r=.018){for(let j=1;j<points.length;j++)b.beam(points[j-1],points[j],r,C.iron,9);}
 function spiral(cx,cy,z,rx,ry,hand=1,turns=1.05){curve(Array.from({length:19},(_,k)=>{const t=k/18,a=hand*t*Math.PI*2*turns,s=1-.80*t;return[cx+Math.cos(a)*rx*s,cy+Math.sin(a)*ry*s,z];}));}
 function window(x,y,z,w,h,rot=0){b.local(x,0,z,rot,()=>{b.box(0,y,0,w+.26,h+.26,.24,C.cream,24);b.box(0,y,.145,w,h,.04,C.glass,5);for(const xx of[-w/2,0,w/2])b.box(xx,y,.21,.055,h,.075,C.cream,24);for(const yy of[y-h/2,y+h/2,y+h*.19])b.box(0,yy,.21,w,.055,.075,C.cream,24);b.box(0,y-h/2-.15,.10,w+.42,.13,.46,C.cream,24);});}
 function post(x,z,h=1.1){b.box(x,h/2+.10,z,.32,h,.32,C.stone,24);b.box(x,h+.14,z,.43,.12,.43,C.cream,24);b.cyl(x,h+.20,z,.18,.24,C.dark,8,1,9);b.cyl(x,h+.25,z,.15,.18,C.cream,8,1,24);b.cyl(x,h+.45,z,.20,.07,C.dark,8,.7,9);}
 function fence(x0,x1,z){b.box((x0+x1)/2,.32,z,x1-x0,.48,.30,C.stone,24);b.box((x0+x1)/2,.59,z,x1-x0+.06,.07,.36,C.cream,24);for(const y of[.75,1.37])b.beam([x0,y,z],[x1,y,z],.027,C.iron,9);const count=Math.max(1,Math.round((x1-x0)/.63));for(let k=0;k<=count;k++){const x=x0+(x1-x0)*k/count;b.beam([x,.64,z],[x,1.45,z],.022,C.iron,9);if(k<count)spiral(x+.21,1.22,z,.16,.22,-1,.85);}}
 // Fit the old detail layout to the original, east-west OSM parcel. Beams are
 // rebuilt with circular cross-sections so the fit cannot shear their normals.
 const M=Y.M,emit=b.e.add,fit=M.transform([O[0],0,O[1]],[SX,1,SZ],R);
 b.e.add=function(k,g,m,...rest){const n=M.multiply(fit,m);if(k.endsWith('cyl8_1')){const up=M.norm(Array.from(n.slice(4,7))),side=M.norm(M.cross(up,Math.abs(up[2])>.95?[1,0,0]:[0,0,1])),front=M.cross(side,up);const radius=Math.hypot(...m.slice(0,3));for(let i=0;i<3;i++){n[i]=side[i]*radius;n[8+i]=front[i]*radius;}}return emit.call(this,k,g,n,...rest);};
 try{b.local(0,0,0,0,()=>{
  group('forecourt-paving',()=>b.box(W/2,.075,(FRONT+D)/2,W-.62,.15,D-FRONT-.15,C.paving,26));
  // The opaque shop occupies only the fitted rear part; the blue shelters and entry approach stay open.
  group('shop-body',()=>{b.box(W/2,H.base/2,(I+FRONT)/2,W-2*I,H.base,FRONT-I,C.stone,24);b.box(W/2,(H.base+H.wall)/2,I,W-2*I,H.wall-H.base,.24,C.brick,27);for(const x of[I,W-I])b.box(x,(H.base+H.wall)/2,(I+FRONT)/2,.24,H.wall-H.base,FRONT-I,C.brick,27);
   for(const [a,c]of[[I,ENTRY-1.45],[ENTRY+1.45,W-I]])b.box((a+c)/2,(H.base+H.wall)/2,FRONT,c-a,H.wall-H.base,.24,C.brick,27);b.box(ENTRY,3.83,FRONT,2.90,.78,.24,C.brick,27);
   b.box(W/2,H.deck,(I+FRONT)/2,W-2*I,.16,FRONT-I,C.roof,25);
   for(const z of[I,FRONT]){b.box(W/2,4.43,z,W-.18,.31,.30,C.dark,24);b.box(W/2,4.63,z,W,.10,.50,C.dark,24);}
   for(const x of[I,W-I]){b.box(x,4.43,(I+FRONT)/2,.30,.31,FRONT-I,C.dark,24);b.box(x,4.63,(I+FRONT)/2,.50,.10,FRONT-I+.10,C.dark,24);}
   for(const x of[I+.13,W-I-.13,ENTRY-2.28,ENTRY+2.28])for(let k=0;k<11;k++)b.box(x,1.04+k*.28,FRONT+.14,k%2?.46:.69,.21,.15,C.cream,24);
  });
  group('front-glazing',()=>{for(const [x,w]of[[3.55,3.2],[8.18,3.25]])window(x,2.45,FRONT+.13,w,1.80);
   b.box(ENTRY,2.10,FRONT+.035,2.82,2.52,.05,C.glass,5);for(const x of[ENTRY-1.41,ENTRY,ENTRY+1.41])b.box(x,2.10,FRONT+.10,.08,2.60,.13,C.dark,24);for(const y of[.84,2.91,3.39])b.box(ENTRY,y,FRONT+.10,2.88,.08,.13,C.dark,24);for(const x of[ENTRY-.13,ENTRY+.13])b.box(x,1.75,FRONT+.20,.045,.47,.045,C.iron,9);
   const x=19.62;b.box(x,2.41,FRONT+.10,4.14,2.21,.26,C.cream,24);b.box(x,2.41,FRONT+.27,3.88,1.98,.05,'#a1bf9f',24);
   paintSign('display-window',c=>{c.fillStyle='#a9c7b0';c.fillRect(0,0,512,128);for(const [x,y,r,col]of[[115,96,69,'#e3c9a2'],[239,50,37,'#d38855'],[393,73,56,'#d5b577']]){c.fillStyle=col;c.beginPath();c.ellipse(x,y,r,r*.72,0,0,Math.PI*2);c.fill();}c.fillStyle='#ab694f';for(const x of[98,130]){c.beginPath();c.arc(x,70,5,0,Math.PI*2);c.fill();}},x,2.41,FRONT+.31,3.88,1.98);
   b.box(x,1.04,FRONT+.13,4.20,.44,.42,C.stone,24);
  });
  group('fitted-other-facades',()=>{for(const x of[3.4,7.7,12.1,17.2])window(x,2.62,I-.16,1.92,1.18,Math.PI);for(const z of[FRONT*2.75/8.90,FRONT*6.35/8.90])window(I-.16,2.36,z,1.84,1.64,-Math.PI/2);window(W-I+.16,2.62,FRONT*3.00/8.90,1.86,1.20,Math.PI/2);});
  group('stone-entry',()=>{for(const s of[-1,1]){const x=ENTRY+s*1.93;b.box(x,2.26,FRONT+.22,.85,2.84,.58,C.stone,24);for(let k=0;k<8;k++)for(let j=0;j<2;j++){const xx=x+(j-.5)*.38+(k%2?.07:-.07);b.box(xx,1.04+k*.345,FRONT+.53,.33,.28,.035,k%3?'#b8ad94':'#8c9180',24);}}});
  group('arched-dark-canopy',()=>{
   b.box(ENTRY,3.96,FRONT+.70,5.48,.15,1.86,C.dark,24);b.box(ENTRY,4.075,FRONT+.70,5.62,.09,1.96,C.dark,24);
   const p=[[ENTRY-2.64,3.94],[ENTRY+2.64,3.94]];for(let k=0;k<=20;k++){const u=2.64-5.28*k/20;p.push([ENTRY+u,3.23+.35*(1-(u/2.64)**2)]);}mesh('arched-entry-frieze',profile(p,FRONT+1.48,FRONT+1.68),C.dark);
   for(const side of[-1,1]){const g=new G.Geometry();g.quad([ENTRY+side*.48,3.86,FRONT+.20],[ENTRY+side*2.45,3.52,FRONT+.20],[ENTRY+side*2.45,3.52,FRONT+1.48],[ENTRY+side*.48,3.86,FRONT+1.48]);g.quad([ENTRY+side*.48,3.84,FRONT+1.48],[ENTRY+side*2.45,3.50,FRONT+1.48],[ENTRY+side*2.45,3.50,FRONT+.20],[ENTRY+side*.48,3.84,FRONT+.20]);mesh('canopy-cream-soffit-'+side,g,C.cream);}
   mesh('small-front-pediment',profile([[ENTRY-2.20,4.61],[ENTRY,5.12],[ENTRY+2.20,4.61]],FRONT-.10,FRONT+.19),C.dark);letters('shop-gold-name','松 林 快 餐',ENTRY,4.56,FRONT+.30,6.82,.95);
  });
  group('entry-steps',()=>{b.box(ENTRY,H.base/2,FRONT+.74,4.84,H.base,1.62,C.stone,24);for(let k=0;k<6;k++){const h=.14*(6-k);b.box(ENTRY,h/2,FRONT+1.67+k*.31,4.84,h,.32,C.stone,24);}for(const side of[-1,1]){b.box(ENTRY+side*2.60,.66,FRONT+1.78,.28,1.10,2.35,C.cream,24);post(ENTRY+side*2.60,FRONT+2.82,1.02);}});
  // Two independent, thin blue pitched shelters, with no opaque walls below them.
  sheds.forEach((rect,index)=>group('blue-shed-'+index,()=>b.local(rect.x0,0,rect.z1,Math.PI/2,()=>{const s={x0:0,x1:rect.z1-rect.z0,z0:0,z1:rect.x1-rect.x0},mid=s.x1/2,narrow=s.x1/4.40,g=new G.Geometry();for(const side of[-1,1]){const x=side<0?s.x0:s.x1;g.quad([x,SH.eave,s.z0],[x,SH.eave,s.z1],[mid,SH.ridge,s.z1],[mid,SH.ridge,s.z0]);g.quad([mid,SH.ridge-.035,s.z0],[mid,SH.ridge-.035,s.z1],[x,SH.eave-.035,s.z1],[x,SH.eave-.035,s.z0]);}mesh('blue-roof-'+index,g,C.blue,24);
   for(const z of[s.z0,(s.z0+s.z1)/2,s.z1]){for(const x of[s.x0,s.x1]){b.beam([x,.15,z],[x,SH.eave,z],.038,C.iron,9);b.box(x,.25,z,.13,.23,.13,C.iron,9);}curve([[s.x0,SH.eave,z],[mid,SH.ridge,z],[s.x1,SH.eave,z]],.037);b.beam([s.x0,SH.eave,z],[s.x1,SH.eave,z],.03,C.iron,9);}
   for(const x of[s.x0,mid,s.x1]){const y=x===mid?SH.ridge:SH.eave;b.beam([x,y,s.z0],[x,y,s.z1],.030,C.iron,9);}for(let k=1;k<8;k++){const z=s.z0+(s.z1-s.z0)*k/8;curve([[s.x0,SH.eave+.01,z],[mid,SH.ridge+.01,z],[s.x1,SH.eave+.01,z]],.012);}
   const pitch=(SH.ridge-SH.eave)/(4.64-2.61),ornamentY=y=>SH.eave+(y-2.61)*pitch;
   for(const z of[s.z0,s.z1]){for(const side of[-1,1]){spiral(mid+side*.91*narrow,ornamentY(3.12),z,.61*narrow,.35*pitch,side,1.15);spiral(mid+side*.39*narrow,ornamentY(3.78),z,.26*narrow,.26*pitch,-side,1.12);spiral(mid+side*1.55*narrow,ornamentY(2.91),z,.23*narrow,.20*pitch,-side,1.10);}b.beam([mid,SH.eave,z],[mid,SH.ridge,z],.025,C.iron,9);}
   for(const z of[1.10,3.60,6.10]){for(let k=0;k<4;k++)b.box(mid,.84,z-.30+k*.20,2.90*narrow,.09,.17,C.wood,24);for(const side of[-1,1]){const bz=z+side*.76;b.box(mid,.46,bz,2.96*narrow,.095,.34,C.wood,24);for(const x of[mid-1.12*narrow,mid+1.12*narrow]){b.box(x,.28,bz,.055,.38,.055,C.iron,9);b.box(x,.45,z,.06,.74,.40,C.iron,9);b.beam([x,.19,bz],[x,.22,z],.023,C.iron,9);}}}
  })));
  group('low-garden-boundary',()=>{fence(.65,10.75,GATE);fence(17.45,22.05,GATE);for(const x of[.65,10.75,17.45,22.05])post(x,GATE,.84);b.local(.61,0,FRONT+7.45,Math.PI/2,()=>fence(0,6.64,0));b.local(22.05,0,FRONT+1.06,-Math.PI/2,()=>fence(0,6.40,0));});
  group('hanging-garden-sign',()=>{const x=19.87,z=FRONT+6.78;for(const q of[x-1.66,x+1.66])b.box(q,1.93,z,.085,3.68,.085,C.iron,9);b.beam([x-1.66,3.55,z],[x+1.66,3.55,z],.045,C.iron,9);for(const side of[-1,1]){spiral(x+side*.92,3.68,z,.49,.19,side,.92);spiral(x+side*.31,3.91,z,.22,.19,-side,1.1);}curve([[x-.34,3.94,z],[x,4.28,z],[x+.34,3.94,z]],.022);
   const outline=[[-1.30,.40],[-.94,.46],[-.83,.67],[-.42,.64],[0,.74],[.42,.64],[.83,.67],[.94,.46],[1.30,.40],[1.25,-.13],[1.12,-.42],[.70,-.48],[.38,-.64],[-.38,-.64],[-.70,-.48],[-1.12,-.42],[-1.25,-.13]].map(([u,y])=>[u+x,y+2.54]);mesh('shaped-wood-plaque',profile(outline,z-.045,z+.045),'#a58b66');curve([...outline,outline[0]].map(([u,y])=>[u,y,z+.065]),.025);for(const q of[x-.89,x+.89])b.beam([q,3.12,z],[q,3.55,z],.018,C.iron,9);letters('garden-name','松林餐厅',x,2.76,z+.10,2.30,.58,'#5d5545');paintSign('garden-english',c=>{c.fillStyle='#5d5545';c.textAlign='center';c.textBaseline='middle';c.font='500 80px Arial';c.fillText('SONG LIN RESTAURANT',256,67,445);},x,2.29,z+.11,2.20,.35);
  });
  group('right-planting-strip',()=>{b.box(21.48,.23,FRONT+3.96,.68,.36,4.65,C.stone,24);for(let k=0;k<8;k++)b.sphere(21.48,.86,FRONT+2.02+k*.55,.49,.61,.44,C.green,3,0,true);});
 });}finally{b.e.add=emit;}
 return{strategy:'building054-v46',floorsFitted:1,sourceEnvelopePreserved:true,placementSource:'user-2026-09-12-original-osm-gap',shopFrontFitted:FRONT*SZ,openForecourt:true,blueShelters:2,shelterObservationsVerified:true,doorDirectionVerified:true,internalPartitionVerified:false,allFacadesVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building054={id:ID,render,world,local,W,D,I,H,FRONT,ENTRY,GATE,sheds,SH,profile,SX,SZ};
})(YY);
