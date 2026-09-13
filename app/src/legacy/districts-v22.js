/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v22: named buildings replace missing identities and generic background masses.
   User-supplied map topology; official visible facade references. No surveyed dimensions. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,PI=Math.PI;
const C={wall:'#d8d8cc',red:'#8d4032',roof:'#717a72',stone:'#a5a89b',glass:'#45646b',trim:'#c7ccbd'};
P.yuanpeiRussian=function(p,w,d){
 this.noPlant(0,0,w+3,d+5);this.solid(0,0,w,d);
 const h=10.7,bay=(w-2.2)/9,front=d/2+.09;
 this.n17Box('v22-ru-plinth',0,.35,0,w+.9,.7,d+.8,C.stone,10,.1);
 this.n17Box('v22-ru-wall',0,5.55,0,w,10.1,d,C.wall,24,.5);
 for(let i=0;i<9;i++){const x=(i-4)*bay;
  for(const y of[3.03,7.83])this.n17Lattice(x,y,front,bay-.65,3.7);
  this.n17Box('v22-ru-spandrel',x,5.3,front+.06,bay-.16,.65,.21,'#dedfcd',24,.9);
 }
 // Ten full-height posts define nine bays, rather than two generic window rows.
 for(let i=0;i<=9;i++)this.n17Column((i-4.5)*bay,front+.31,10.02,.7);
 this.n17Box('v22-ru-front-frieze',0,10.48,front+.31,w,.52,.4,'#3c676c',6,1.5);
 this.n17Box('v22-ru-gold-line',0,10.5,front+.54,w-.7,.08,.08,'#bba977',29,1.6);
 this.n17Box('v22-ru-entry-shadow',0,2.42,front+.23,bay-.3,3.7,.1,'#233d3d',5,.86);
 for(const x of[-.58,.58])this.n17Lattice(x,2.6,front+.39,1.02,3.2);
 for(let i=0;i<4;i++)this.n17Box('v22-ru-steps',0,.10+i*.15,front+2.35-i*.42,5.6,.25,1.06,C.stone,10,.12);
 // Photo does not expose the rear: regular restrained windows, clearly approximate.
 for(const s of[-1,1])for(const y of[3,7.8])for(let i=0;i<3;i++)this.n17Lattice(s*(w/2+.07),y,(i-1)*d*.29,2.5,3.2,s*PI/2);
 for(let i=0;i<7;i++)for(const y of[3,7.8])this.n17Lattice((i-3)*w/8,y,-d/2-.08,2.6,3.15,PI);
 this.n17Roof(0,h+.2,0,w+3.4,d+3.5,3.2);
 this.sign('元培学院',0,9.59,front+.58,5.6,1.1,0,false);
 this.sign('俄文楼',w/2-1.45,1.75,front+.28,1.55,.48,0,true);
};
// Compact courtyard units. Solid footprints register ONLY occupied wings; voids stay open.
P.bicmrCourtyard=function(p,w,d){
 if(p.parcelPlan25){
  this.n17Box('math-mapped-court-base',0,.10,0,w,.12,d,'#adad9c',21,.01);
  for(const [x,z,ww,dd,h]of p.parcelPlan25.wings){const W=ww*w,L=dd*d;this.local(x*w,0,z*d,W<L?PI/2:0,()=>this.n17Hall(Math.max(W,L),Math.min(W,L),h,{one:true,gallery:false}));}
  for(const [x,z,ww,dd]of[[-.04,-.22,.34,.11],[.24,.12,.15,.12],[-.26,.12,.10,.10]])this.n17Box('math-mapped-court-bed',x*w,.19,z*d,ww*w,.15,dd*d,'#7b8d68',0,.02);
  for(const x of[-.11*w,-.03*w]){this.n17Column(x,d*.46,3.5,.3);this.solid(x,d*.46,.6,.6);}
  this.n17Roof(-.07*w,3.95,d*.46,w*.12,3.7,1.3);
  this.sign('怀新园',-.07*w,3.4,d*.46+1.9,5.2,.8,0,false);
  return;
 }

 this.noPlant(0,0,w+2,d+2);this.n17Box('v22-math-court-ground',0,.11,0,w,.12,d,'#bbbba8',7,.02);
 const two=p.courts===2||p.parcelNumber==='78',wing=Math.min(8.0,w*.18),deep=Math.min(8.7,d*.19),h=two?5.7:5.2;
 const hall=(x,z,ww,dd,rot=0)=>this.local(x,0,z,rot,()=>this.n17Hall(ww,dd,h,{one:true}));
 hall(0,-d/2+deep/2,w,deep);
 for(const s of[-1,1])hall(s*(w/2-wing/2),0,d-2*deep,wing,PI/2);
 const gap=Math.min(5.2,w*.25),ww=(w-gap)/2;
 for(const s of[-1,1])hall(s*(gap/2+ww/2),d/2-deep/2,ww,deep);
 if(two)hall(0,-2.0,w-2*wing,deep);
 this.n17Roof(0,4.3,d/2-deep/2,gap+1.6,deep+1,1.8);
 this.n17Box('v22-math-gate-lintel',0,4.1,d/2-deep/2,gap,.35,deep,'#805243',6,1.4);
 for(const zz of two?[-d*.27,d*.23]:[0]){
  const cw=Math.max(3,w-2*wing-9),cd=two?d*.19:Math.max(2,d-2*deep-7);
  this.n17Box('v22-math-garden-bed',0,.19,zz,cw,.12,cd,'#81916d',0,.03);
  this.n17Box('v22-math-court-path',-cw/2-1.3,.27,zz,1.4,.1,cd+3,'#c9c9b5',7,.03);
 }
 const title=p.parcelNumber==='78'?'怀新园':('镜春园'+p.parcelNumber+'号');
 this.sign(title,0,3.45,d/2+.13,Math.min(6,w*.35),.86,0,false);
 if(p.parcelNumber==='78')this.sign('北京国际数学研究中心',-w*.24,2.15,d/2+.13,Math.min(11,w*.46),.58,0,true);
};
P.bicmrHall=function(p,w,d){
 this.noPlant(0,0,w+3,d+5);this.n17Box('v22-jyb-court',0,.14,0,w,.15,d,'#bdbbaa',7,.01);
 // Three joined low halls and two shorter side wings, not a filled enclosure.
 const side=Math.min(12,w*.18),backDepth=d*.4;
 this.local(0,0,-d/2+backDepth/2,0,()=>this.n17Hall(w,backDepth,7.2,{one:true,gallery:false}));
 for(const s of[-1,1])this.local(s*(w/2-side/2),0,backDepth/2,PI/2,()=>this.n17Hall(d-backDepth,side,6.4,{one:true}));
 this.n17Roof(0,4.9,d/2-1.4,11,5.8,1.8);
 for(const s of[-1,1])this.n17Column(s*4.2,d/2-.6,4.0,.75);
 this.sign('甲乙丙楼',0,4.25,d/2+1.0,6.6,.95,0,false);
 this.sign('北京国际数学研究中心',0,2.9,-d/2+backDepth+.13,20,1.15,0,true);
 for(let i=0;i<3;i++)this.n17Box('v22-jyb-steps',0,.10+i*.17,d/2+1.7-i*.5,8,.24,1,C.stone,10,.1);
};
const oldCanteen=P.canteen;
P.canteen=function(p,w,d){
 if(p.id!==205)return oldCanteen.call(this,p,w,d);
 this.noPlant(0,0,w+3,d+5);this.solid(0,0,w,d);const h=7.15;
 this.n17Box('v22-yn-stone-base',0,.3,0,w+.5,.6,d+.5,C.stone,10,.1);
 this.n17Box('v22-yn-wall',0,3.7,0,w,6.8,d,'#d6d9cd',24,.55);
 for(const s of[-1,1])for(const y of[2.1,5.48])for(let i=0;i<10;i++){
  let x=(i-4.5)*w/10;this.n17Box('v22-yn-glass',x,y,s*(d/2+.08),w/10-.72,2.15,.12,C.glass,5,.75);
  for(const a of[-1,0,1])this.n17Box('v22-yn-mullion',x+a*(w/10-.72)/2,y,s*(d/2+.17),.085,2.18,.09,C.trim,24,.86);
 }
 this.n17Box('v22-yn-belt',0,3.55,0,w+.18,.22,d+.18,'#a9b8ad',24,.85);
 this.n17Box('v22-yn-roof',0,h+.13,0,w+1.2,.30,d+1.2,'#a9b2aa',12,2.1);
 // Low roof and repeated glazed skylights: roof openings are supported by the renovation record.
 for(const z of[-d*.23,d*.23])for(let i=0;i<6;i++){
  let x=(i-2.5)*w/6.6;
  this.n17Box('v22-yn-skylight-curb',x,h+.35,z,4.4,.3,3.1,'#788d87',12,2.12);
  this.n17Box('v22-yn-skylight-glass',x,h+.54,z,4.10,.12,2.81,'#6f9a9e',5,2.14);
  this.n17Box('v22-yn-skylight-bar',x,h+.62,z,.07,.05,2.85,C.trim,24,2.15);
 }
 for(const s of[-1,1])this.n17Box('v22-yn-parapet',0,h+.48,s*d/2,w,.5,.25,'#bdc4b9',24,2.17);
 this.n17Box('v22-yn-entry-glass',0,2,d/2+.25,7.0,3.1,.16,'#355b60',5,.9);
 for(const x of[-3.5,0,3.5])this.n17Box('v22-yn-entry-frame',x,2,d/2+.35,.11,3.1,.12,C.trim,24,.95);
 this.n17Box('v22-yn-canopy',0,3.9,d/2+1.55,11,.22,3.3,'#b2bab1',12,1.5);
 this.sign('燕南美食',0,4.65,d/2+.35,8.5,1.0,0,true);
 for(let i=0;i<3;i++)this.n17Box('v22-yn-steps',0,.09+i*.15,d/2+2.5-i*.5,10,.23,1.05,C.stone,10,.12);
};
// Garden context remains a landscape, not a building footprint or a substitute for its 17 addresses.
P.yannanGarden=function(p,w,d){
 const low=(x,z,ww,dd)=>this.n17Box('v22-yn-boundary',x,.65,z,ww,1.3,dd,'#8b9380',10,.08);
 low(0,-d/2,w,.5);low(-w/2,-d*.18,.5,d*.63);low(w/2,d*.2,.5,d*.59);
 low(-w*.30,d/2,w*.37,.5);low(w*.23,d/2,w*.46,.5);
 this.sign('燕南园',-w*.1,1.1,d/2+.35,5.0,1.2,0,true);
 const q=Y.DATA.toWorld([503,486]),o=Y.DATA.toWorld([p.x,p.z]);
 this.n17Box('v22-yn-central-lawn',q[0]-o[0],.12,q[1]-o[1],22,.035,23,'#8c9c77',0,.01);
};
// Humanistic precinct: three high main halls, lower connecting wings and open courts.
// Visible mass hierarchy from 7zvHO6x3pFE 40.28–55.24 s; dimensions remain map-scaled estimates.
P.humanitiesPrecinct=function(p,w,d){
 const span=w*.67,depth=d*.145,side=w*.135;
 const hall=(x,z,ww,dd,h,rot=0,gallery=true)=>this.local(x,0,z,rot,()=>this.n17Hall(ww,dd,h,{one:h<7,gallery}));
 for(const [z,h] of [[-d*.35,10.2],[0,12.4],[d*.35,10.4]])hall(w*.08,z,span,depth,h);
 // Set-back connecting halls register their own footprint; the courtyard is never a solid box.
 for(const [x,z,len,h] of [[-w*.29,-d*.175,d*.205,6.0],[w*.34,-d*.175,d*.205,6.0],[-w*.29,d*.175,d*.205,6.2],[w*.34,d*.175,d*.205,6.0]])hall(x,z,len,side,h,PI/2,false);
 for(const [x,z]of[[-w*.39,-d*.40],[-w*.39,d*.30]])hall(x,z,w*.16,d*.12,6.2,PI/2,false);
 for(const z of[-d*.175,d*.175]){
  this.n17Box('humanities-court-paving',w*.05,.10,z,w*.44,.14,d*.17,'#b3b1a2',7,.02);
  this.n17Box('humanities-court-bed',-w*.12,.18,z,w*.10,.16,d*.075,'#7d8a62',0,.02);
 }
 // Entrance platform and lower gallery remain readable from the western garden.
 this.n17Box('humanities-entry-paving',-w*.32,.15,0,w*.29,.18,d*.15,'#b6b5a5',10,.04);
 for(let k=0;k<3;k++)this.n17Box('humanities-entry-step',-w*.19,.15+k*.16,depth/2+1.8-k*.42,w*.24,.22,1.1,'#bcbcaf',10,.1);
};
// Langrun: connected courtyard fabric and a taller eastern hall, visible in episode 2.
P.langrunPrecinct=function(p){
 const scale=Y.DATA.scale,hall=(x,z,w,d,h)=>this.local((x-p.x)*scale,0,(z-p.z)*scale,w<d?PI/2:0,()=>this.n17Hall(Math.max(w,d)*scale,Math.min(w,d)*scale,h,{one:h<7,gallery:h>9}));
 for(const [x,z,w,d,h]of[[520,61,16,5,6],[542,60,17,6,9.7],[566,60,18,7,11],[520,80,16,5,5.8],[542,80,17,5,6],[565,80,17,5,6.2],[511,70,3,14,5.5],[529,70,3,14,5.4],[553,70,3,14,5.5],[576,71,3,13,5.6]])hall(x,z,w,d,h);
 for(const x of[520,542,565]){const X=(x-p.x)*scale,Z=(70-p.z)*scale;this.n17Box('langrun-court',X,.11,Z,14*scale,.14,12*scale,'#aeb09f',21,.01);this.n17Box('langrun-court-bed',X-3,.20,Z+3,5,.15,6,'#7b8b62',0,.02);}
};
})(YY);
