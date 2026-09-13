/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* District-specific, original exterior models. Photo-visible motifs are separated
   from schematic envelopes; neither these footprints nor heights are surveyed. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo;
const stone='#b8b8ac',cream='#d0d0c6',brick='#92988f',slate='#59605d',trim='#c6c6ba';
P.plainGable=function(x,y,z,w,d,h=2.5,col=slate,part=2){
 const g=this.geo('plain-gable',()=>{const t=new G.Geometry();t.quad([-.5,0,.5],[.5,0,.5],[.5,1,0],[-.5,1,0]);t.quad([.5,0,-.5],[-.5,0,-.5],[-.5,1,0],[.5,1,0]);return t});
 this.mesh('plain-gable',g,x,y,z,w,h,d,col,2,part);
 const end=this.geo('gable-end',()=>new G.Geometry().tri([0,0,-.5],[0,1,0],[0,0,.5]));
 for(let s of[-1,1]){this.mesh('gable-end',end,x+s*(w/2-.28),y,z,1,h,d-.5,brick,1,part);this.box(x,y-.12,z+s*d/2,w,.23,.24,slate,2,part)}
 this.box(x,y+h,z,w,.16,.27,col,2,part);
};
P.airConditioner=function(x,y,z,r=0){this.local(x,y,z,r,()=>{this.box(0,0,0,1.0,.65,.38,'#b7b9ae',9,.85);this.box(0,0,.21,.59,.48,.025,'#818c85',9,.85);for(let k=0;k<6;k++)this.box(-.24+k*.094,0,.235,.012,.44,.01,'#bfc4ba',9,.85);this.box(0,-.41,0,1.12,.055,.46,'#65736b',9,.85)});};
P.westDorm=function(p,w,d){
 const h=p.h,n=p.floors||5,bays=Math.max(5,Math.round(w/4.8));this.solid(0,0,w+.8,d+.8);
 this.box(0,.3,0,w+1,.6,d+1,stone,10);this.box(0,h/2+.45,0,w,h,d,'#c4c3b7',13,.5);
 this.box(0,.86,0,w+.2,.75,d+.2,'#9b9e93',1,.55);
 const step=w/(bays+1),fh=(h-1.2)/n;
 for(let side of[-1,1])for(let f=0;f<n;f++){
  let yy=1.4+(f+.48)*fh;for(let i=1;i<=bays;i++){let xx=-w/2+i*step;
   this.window(xx,yy,side*(d/2+.12),step*.62,fh*.58,side<0?Math.PI:0,'#586867');
   if(f>0&&i%3===1)this.airConditioner(xx+step*.34,yy-.3,side*(d/2+.47),side<0?Math.PI:0);
  }
  this.box(0,1.22+f*fh,side*(d/2+.20),w,.12,.21,trim,10,.9);
 }
 for(let s of[-1,1])for(let f=0;f<n;f++)for(let zz of[-d*.23,d*.23])this.window(s*(w/2+.12),2.2+f*fh,zz,d*.23,fh*.56,s*Math.PI/2,'#647270');
 // Recessed central stair strip with a restrained entrance canopy.
 this.box(0,h/2,d/2+.21,2.35,h-.9,.18,'#a7aea1',13,.7);
 for(let f=0;f<n;f++)this.window(0,2.35+f*fh,d/2+.35,1.45,1.7,0,'#70847d');
 this.entry(4.8,d/2,3.1,'',.5);this.box(0,3.65,d/2+1.1,7.3,.2,2.6,'#c4c8bb',10,1.1);
 this.sign(p.blockNumber+'楼',w*.32,h-2.5,d/2+.3,5.0,1.25,0,true);
 this.parapet(0,h+.45,0,w,d,trim,.7);this.box(0,h+.57,0,w-1.2,.15,d-1.2,'#969e93',7,1.5);
 this.box(0,h+1.25,-d*.15,4,1.2,d*.35,'#aaaFA3',10,1.8);this.drainpipes(w,d,h);this.noPlant(0,d/2+2,10,5);
};
P.shaoyuanBlock=function(p,w,d){
 if(p.blockNumber==='5'||p.blockNumber==='5甲'){this.westDorm({...p,blockNumber:'勺园'+p.blockNumber},w,d);return;}
 let h=p.h,n=p.floors||4;this.block(0,0,w,d,h,n,'#c8c6b9',false,Math.max(3,Math.round(w/5.3)));
 this.box(0,.85,0,w+.15,.7,d+.15,'#9ea196',1,.5);
 for(let z of[-1,1]){for(let f=1;f<n;f++)this.box(0,f*(h/n)+.7,z*(d/2+.19),w+.25,.14,.36,cream,10,.85);
 for(let i=0;i<Math.floor(w/6);i++)if(i%2===0)this.airConditioner(-w*.4+i*6,6,z*(d/2+.4),z<0?Math.PI:0);}
 this.entry(Math.min(6,w*.28),d/2,3.4,'',.5);this.lettering('勺园'+p.blockNumber+'号楼',0,h-1.6,d/2+.31,Math.min(w*.65,20),1.0);
 if(['1','2','3','4'].includes(p.blockNumber)){this.plainGable(0,h+.8,0,w+1.2,d+1.4,Math.min(3,d*.14),'#6b6b60');}
 else this.parapet(0,h+.7,0,w,d,cream,.8);
 this.drainpipes(w,d,h);this.noPlant(0,d/2+1.5,12,5);
};
P.researchComplex=function(p,w,d){
 let h=p.h,n=p.floors||5;
 if(p.id===352){this.block(0,0,w,d,h,n,'#bbbdB3',false,Math.round(w/4.3));}
 else{const spine=w*.30,bar=d*.23;
  this.block(-w/2+spine/2,0,spine,d,h,n,'#b6bdb5',false,4);
  this.block(spine/2,-d/2+bar/2,w-spine,bar,h,n,'#c4c8bf',false,Math.round(w/5.4));
  this.block(spine/2,d/2-bar/2,w-spine,bar,h-3.1,n-1,'#c4c8bf',false,Math.round(w/5.4));
  this.box(w*.13,.15,0,w*.6,.18,d*.40,'#b5b9a7',7);this.noPlant(w*.13,0,w*.6,d*.42);
 }
 for(let side of[-1,1])for(let f=1;f<n;f++)this.box(0,1+f*(h/n),side*(d/2+.16),w,.16,.24,cream,10,.8);
 this.local(w/2,0,0,Math.PI/2,()=>{this.entry(7,0,3.8,'',.65);this.lettering(p.name,0,h-2,.32,Math.min(d*.8,23),1.25);});
 this.drainpipes(w,d,h);this.noPlant(w/2+2,0,6,11);
};
P.scienceTwo=function(p,w,d){
 const top=p.h||24,base=top-6.2,bar=d*.25,wing=w*.31;
 // The public photograph's articulated upper level is not a generic hip roof.
 const block=(x,z,bw,bd,h,n,roof=true)=>this.local(x,0,z,0,()=>{
  this.block(0,0,bw,bd,h,n,'#d0d0c6',false,Math.max(4,Math.round(bw/4.8)));
  for(let s of[-1,1])for(let f=1;f<n;f++){this.box(0,1+f*(h/n),s*(bd/2+.19),bw,.22,.38,'#e0ded1',10,.85);for(let i=0;i<Math.floor(bw/5.7);i++)if(i%2===0)this.airConditioner(-bw*.42+i*5.7,2.1+f*(h/n),s*(bd/2+.54),s<0?Math.PI:0);}
  if(!roof)return;
  const rw=bw+2.8,rd=bd+3.2,rh=4.8;
  this.box(0,h+.45,0,rw,.6,rd,'#b9bcb0',10,1.55);
  let g=this.geo('science2-mansard',()=>{let a=new G.Geometry(),a0=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5]],a1=[[-.38,.95,-.27],[.38,.95,-.27],[.38,.95,.27],[-.38,.95,.27]];
   for(let i=0;i<4;i++){let j=(i+1)%4;a.quad(a0[j],a0[i],a1[i],a1[j]);}a.quad(a1[3],a1[2],a1[1],a1[0],[0,1,0]);return a});
  this.mesh('science2-mansard',g,0,h+.72,0,rw,rh,rd,'#675652',2,2.5);
  const nB=Math.max(4,Math.floor(bw/3.6));
  for(let s of[-1,1])for(let j=0;j<nB;j++){
   const x=-bw*.44+(j+.5)*bw*.88/nB;this.box(x,h-.05,s*(bd/2+.62),.38,1.35,1.48,'#b6b9af',10,1.5);
   this.local(x,h+2.25,s*(bd*.41),s<0?Math.PI:0,()=>{
    this.box(0,0,0,1.45,2.0,.70,'#78665e',2,2.5);this.window(0,.08,.4,.83,1.52,0,'#536461');this.box(0,1.1,.13,1.75,.18,1.25,'#5f5651',2,2.65);
   });
  }
 });
 block(0,-d/2+bar/2,w,bar,base,5,true);
 block(-w/2+wing/2,bar*.10,wing,d-bar,base,5,true);
 block(wing*.3,d/2-bar*.62,w-wing,bar*1.24,base-3.0,4,true);
 // Lower northeastern shoulder and distinct glazed connecting section.
 block(w*.34,d*.025,w*.32,d*.38,base-6.0,3,false);
 this.box(0,.21,0,w*.27,.15,d*.35,'#acb4a3',0);this.noPlant(0,0,w*.26,d*.35);
 this.entry(9,d/2,4.1,'理科二号楼',.8);this.noPlant(0,d/2+2,16,6);
};
P.campusHospital=function(p,w,d){
 const wing=w*.29,bar=d*.25,h=p.h;
 // Open northwest quadrant: never put the canteen inside a solid hospital box.
 this.block(w/2-wing/2,0,wing,d,h,4,'#d0d3cb',false,5);
 this.block(-wing/2,d/2-bar/2,w-wing,bar,h-1,4,'#d3d4cb',false,Math.round(w/5));
 this.block(w*.08,-d/2+bar/2,w*.24,bar,h-4,3,'#c4cec6',false,4);
 this.box(-w*.12,.18,-d*.08,w*.51,.2,d*.57,'#bdc3b4',7);this.noPlant(-w*.12,-d*.08,w*.5,d*.57);
 this.local(w/2,0,5,Math.PI/2,()=>{this.entry(9,0,4.0,'北京大学医院',.4);this.box(0,4.6,1.8,16,.2,4.1,'#8eaaa4',9,1.3);});
 for(let f=1;f<4;f++){this.box(0,1+f*4.2,d/2+.1,w,.19,.3,'#c7d4cf',10,.9);this.box(w*.23,1+f*4.2,-d/2-.1,w*.54,.19,.3,'#c7d4cf',10,.9);}
 this.local(w/2-wing/2,0,0,0,()=>this.drainpipes(wing,d,h));this.noPlant(w/2+1.6,5,6,18);
};
P.chengfuyuan=function(p,w,d){
 this.block(0,0,w,d,p.h,1,'#c1c3b7',false,5);this.entry(4.8,d/2,3.2,'',.35);
 this.box(0,3.7,d/2+.9,w-.2,.16,2.2,'#697e73',9,1.35);
 this.lettering('成府园食堂',0,4.65,d/2+.35,Math.min(17,w*.77),1.0,0,'#635447');
 for(let s of[-1,1])this.window(s*w*.29,2.05,d/2+.2,w*.24,2.45,0,'#73837a');
 this.parapet(0,p.h+.44,0,w,d,cream,.5);this.box(w*.30,p.h+1,-d*.1,3,1.25,3,'#87958b',9,1.8);this.noPlant(0,d/2+1.3,w,5);this.drainpipes(w,d,p.h);
};
P.historicVilla=function(p,w,d){
 const h=p.h,style=p.villaStyle,gray=p.houseNumber%3===0?'#9da397':p.houseNumber%3===1?'#8e9690':'#a7a99c';
 const house=(x,z,bw,bd,hh,n)=>this.local(x,0,z,0,()=>{
  this.solid(0,0,bw+.35,bd+.35);this.box(0,.3,0,bw+.4,.6,bd+.4,'#858b81',10);
  this.box(0,hh/2+.3,0,bw,hh,bd,gray,1,.6);let nx=Math.max(2,Math.round(bw/3.1));
  for(let s of[-1,1])for(let f=0;f<n;f++)for(let i=0;i<nx;i++)this.window(-bw*.4+(i+.5)*bw*.8/nx,1.65+f*3.15,s*(bd/2+.10),Math.min(1.55,bw/nx*.55),1.7,s<0?Math.PI:0,'#65766e');
  for(let s of[-1,1])for(let f=0;f<n;f++)this.window(s*(bw/2+.1),1.65+f*3.15,0,1.45,1.65,s*Math.PI/2,'#637169');
  this.box(0,2,bd/2+.14,1.25,3,.2,'#464e49',6,.85);
  this.plainGable(0,hh+.4,0,bw+1.1,bd+1.2,Math.min(2.7,bd*.29),'#626960');
  if(n>1){this.box(0,3.45,bd/2+.15,bw,.2,.3,'#b2b5a6',10,.95);this.box(-bw*.28,hh+2.0,-bd*.14,.9,2.9,1.1,'#959b90',1,2.2);}
 });
 const gateZ=d/2,gateW=2.0;
 if(style==='courtyard'){
  const hd=d*.40;house(0,-d/2+hd/2,w,hd,h,1);
  house(-w/2+w*.14,0,w*.28,d*.22,h*.78,1);
  this.box(w*.12,.1,d*.02,w*.60,.12,d*.47,'#a7b09a',0);this.noPlant(0,d*.05,w*.7,d*.5);
  // Brick walls are split at the entrance; the perforation motif is real geometry.
  for(let s of[-1,1]){
   const seg=(w-gateW)/2,x=s*(gateW/2+seg/2);this.box(x,.64,gateZ,seg,1.28,.30,gray,1,.2);
   for(let r=0;r<4;r++)for(let i=0;i<Math.floor(seg/.55);i++){let xx=s*gateW/2+s*(i+.5)*seg/Math.floor(seg/.55);this.box(xx,1.42+r*.22,gateZ,r%2?.30:.43,.13,.31,gray,1,.2)}
   this.box(x,2.26,gateZ,seg,.17,.42,'#797f75',2,.25);
   this.box(s*w/2,1.04,0,.32,2.1,d,gray,1,.2);this.solid(s*w/2,0,.32,d);this.solid(x,gateZ,seg,.3);
  }
  for(let s of[-1,1])this.box(s*(gateW/2+.27),1.4,gateZ,.52,2.8,.66,'#a2a798',10,.5);
  this.box(0,1.21,gateZ+.05,gateW,2.42,.17,'#353e42',6,.55);this.box(0,1.22,gateZ+.16,.03,2.44,.04,'#202d32',9,.55);
  for(let s of[-1,1]){this.sphere(s*.24,1.33,gateZ+.24,.055,.065,.03,'#ada480',9,.6,true);this.cyl(s*.24,1.19,gateZ+.27,.055,.02,'#a99f74',10,1,9,.6);}
  this.plainGable(0,2.95,gateZ,gateW+1.45,1.6,.72,'#6f7568',2.1);
  if(p.houseNumber===57)this.sign('冯友兰故居',0,2.58,gateZ+.45,2.2,.55);
  this.sign(String(p.houseNumber),gateW/2+.60,1.94,gateZ+.38,.84,.25,0,true);
 }else{
  house(0,0,w,d,h,style==='western'?2:1);
  if(style==='western'){this.local(-w*.17,0,d/2+.53,0,()=>{this.box(0,.25,0,w*.31,.5,1.9,stone,10);for(let s of[-1,1])this.box(s*w*.12,1.5,.5,.26,2.7,.26,'#a3a99b',10,.7);this.plainGable(0,3.05,.5,w*.34,2.1,.8,'#747b6d',1.8);});}
  this.sign(String(p.houseNumber),w*.3,2.6,d/2+.18,.88,.25,0,true);
 }
 this.noPlant(0,0,w+1.7,d+2.8);
};
P.yannanGarden=function(p,w,d){
 // Boundary / historic path character only: not one solid garden-wide hit box.
 const bx=-w/2,bz=-d/2;
 const wall=(a,b)=>{let mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],len=Math.hypot(b[0]-a[0],b[1]-a[1]),r=-Math.atan2(b[1]-a[1],b[0]-a[0]);this.local(mid[0],0,mid[1],r,()=>{this.box(0,.80,0,len,1.6,.5,'#8d9284',10,.1);this.box(0,1.65,0,len,.14,.65,'#797f72',2,.2);});};
 // South and side gates left open. Existing path geometry uses canonical network.
 wall([bx,bz],[w/2,bz]);wall([bx,bz],[bx,30]);wall([bx,40],[bx,d/2]);
 wall([w/2,bz],[w/2,-45]);wall([w/2,-33],[w/2,d/2]);
 const southGate=(487-p.x)*Y.DATA.scale;wall([bx,d/2],[southGate-3.5,d/2]);wall([southGate+3.5,d/2],[w/2,d/2]);
 this.local(southGate,0,d/2,0,()=>{for(let s of[-1,1])this.box(s*3.5,1.1,0,.75,2.2,.9,'#969b8a',10);this.sign('燕南园',6.8,1.3,.35,4.2,1.05,0,true);});
 const green=Y.DATA.toWorld([508,484]),center=Y.DATA.toWorld([p.x,p.z]);this.box(green[0]-center[0],.04,green[1]-center[1],26,.035,25,'#8c9c77',0);
};
P.site=function(){ /* logical compound; constituent models carry pick geometry */ };
})(YY);
