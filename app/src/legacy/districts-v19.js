/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v19: Science Two and the observed entrance volume of Yingjie.
 * Facade motifs follow the source photos; inherited plot transforms, heights,
 * terrace depths and unobserved elevations remain modelling estimates.
 */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,PI=Math.PI;
const C={wall:'#e5e5dc',joint:'#c6cdc8',roof:'#696168',glass:'#415f67',frame:'#b2c3bf',metal:'#788a87',stone:'#b7bdb1'};
P.s19box=function(k,x,y,z,w,h,d,c,mat=24,part=.55){this.mesh(k,this.geo(k,G.box),x,y,z,w,h,d,c,mat,part);};
P.s19Window=function(x,y,z,w,h,r=0){this.local(x,y,z,r,()=>{
 this.s19box('v19-facade-glass',0,0,.015,w,h,.09,C.glass,28,.73);
 for(const xx of[-w/2,0,w/2])this.s19box('v19-facade-frame',xx,0,.085,.075,h+.14,.14,C.frame,29,.76);
 for(const yy of[-h/2,h*.08,h/2])this.s19box('v19-facade-frame',0,yy,.085,w+.14,.075,.14,C.frame,29,.76);
 this.s19box('v19-window-sill',0,-h/2-.12,.16,w+.32,.16,.49,'#cbd2c9',24,.70);
});};
P.s19Wall=function(w,d,h,levels=4,bays=8){this.solid(0,0,w,d);
 this.s19box('v19-pale-tile-body',0,h/2,0,w,h,d,C.wall,24,.50);
 this.s19box('v19-ground-plinth',0,.32,0,w+.25,.64,d+.25,C.stone,10,.15);
 const storey=(h-.9)/levels;
 for(const s of[-1,1]){
  for(let j=0;j<levels;j++)for(let i=0;i<bays;i++)this.s19Window(-w/2+(i+.5)*w/bays,1.0+storey*(j+.45),s*(d/2+.04),Math.min(3.9,w/bays*.75),Math.min(2.22,storey*.60),s<0?PI:0);
  for(let j=0;j<levels-1;j++)for(let i=0;i<bays;i++){if((i+j)%3===1)continue;const x=-w/2+(i+.5)*w/bays,y=.7+storey*(j+.45)-Math.min(2.22,storey*.60)/2;
   this.local(x,y,s*(d/2+.42),s<0?PI:0,()=>{this.s19box('v19-ac-body',0,0,0,1.02,.66,.48,'#d9d7c9',24,.87);this.s19box('v19-ac-grille',.09,0,.26,.64,.46,.035,'#97a5a0',29,.89);for(let j=0;j<5;j++)this.s19box('v19-ac-slat',.09,-.18+j*.09,.29,.63,.027,.027,'#bbc5b8',29,.90);});
  }
  for(let y=1;y<h-.1;y+=.70)this.s19box('v19-tile-course',0,y,s*(d/2+.012),w,.018,.017,C.joint,24,.55);
  for(let x=-w/2+.70;x<w/2;x+=1.4)this.s19box('v19-tile-joint',x,h/2,s*(d/2+.013),.013,h,.016,'#d0d5cc',24,.55);
  this.s19box('v19-rainpipe',s*(w/2-.28),h/2,d/2+.28,.16,h,.16,C.metal,29,.81);
 }
 for(const s of[-1,1]){let n=Math.max(2,Math.floor(d/4.7));for(let j=0;j<levels;j++)for(let i=0;i<n;i++)this.s19Window(s*(w/2+.04),1+storey*(j+.45),-d/2+(i+.5)*d/n,Math.min(2.3,d/n*.56),Math.min(2.22,storey*.60),s*PI/2);}
};
/* Extruded mansard: paired inclined glass planes are genuinely coplanar with
 * their roof slope, not upright dormer boxes. All custom mesh keys include the
 * parameters that change vertex data (the engine buckets geometry by key).
 */
P.s19Roof=function(w,d,eave,rise,bays,overhang=1.65){const ww=w+2*overhang,dd=d+2*overhang,run=Math.min(dd*.27,rise*.72),shape=[ww,dd,run,rise].join('_');
 this.s19box('v19-roof-soffit',0,eave-.30,0,ww,.55,dd,'#c2cbc3',24,1.7);
 const roofKey='v19-roof-shell-'+shape;
 const roof=this.geo(roofKey,()=>{const g=new G.Geometry(),a=ww/2,b=dd/2,t=b-run;
 g.quad([-a,0,b],[a,0,b],[a,rise,t],[-a,rise,t]);
 g.quad([a,0,-b],[-a,0,-b],[-a,rise,-t],[a,rise,-t]);
 g.quad([-a,rise,t],[a,rise,t],[a,rise,-t],[-a,rise,-t]);return g;});
 this.mesh(roofKey,roof,0,eave,0,1,1,1,C.roof,2,2.2);
 const cheekKey='v19-roof-cheek-'+shape;
 const cheek=this.geo(cheekKey,()=>{let g=new G.Geometry();for(const s of[-1,1]){const pts=[[s*ww/2,0,-dd/2],[s*ww/2,0,dd/2],[s*ww/2,rise,dd/2-run],[s*ww/2,rise,-dd/2+run]];if(s>0)pts.reverse();g.quad(...pts);}return g;});
 this.mesh(cheekKey,cheek,0,eave,0,1,1,1,C.wall,24,2.25);
 for(const s of[-1,1])this.local(0,eave,0,s<0?PI:0,()=>{
  this.s19box('v19-white-eave-fascia',0,-.12,dd/2+.08,ww+.25,.50,.30,'#e8e9df',24,1.85);
  for(let i=0;i<=bays;i++){const x=-w/2+i*w/bays;this.s19box('v19-soffit-support',x,-.73,d/2+overhang*.43,.26,.42,overhang+1.1,'#cbd0c7',24,1.5);}
  for(let i=0;i<bays;i++){const x=-w/2+(i+.5)*w/bays,pw=Math.min(2.65,w/bays*.44),t0=.16,t1=.87,y0=rise*t0+.035,z0=dd/2-run*t0+.035;
   this.mesh('v19-slope-glass',this.geo('v19-slope-glass',()=>new G.Geometry().quad([-.5,0,0],[.5,0,0],[.5,1,-1],[-.5,1,-1])),x,y0,z0,pw,rise*(t1-t0),run*(t1-t0),C.glass,28,2.30);
   const p=(u,t)=>[x+u,rise*t+.10,dd/2-run*t+.10];
   for(const u of[-pw/2,pw/2])this.beam(p(u,t0),p(u,t1),.065,C.frame,29,2.34);
   for(let j=0;j<=4;j++){let t=t0+(t1-t0)*j/4;this.beam(p(-pw/2,t),p(pw/2,t),.055,C.frame,29,2.34);}
  }
  // Subtle roof seams are geometry, without covering up the inclined panes.
  for(let i=0;i<=bays;i++){let x=-w/2+i*w/bays;this.beam([x,.035,dd/2+.018],[x,rise+.035,dd/2-run+.018],.025,'#8b8287',29,2.27);}
 });
};
P.s19Terrace=function(x,z,w,d,h,levels){this.local(x,0,z,0,()=>{
 this.s19Wall(w,d,h,levels,Math.max(3,Math.round(w/4.5)));
 this.mesh('v19-terrace-slope',this.geo('v19-terrace-slope',()=>new G.Geometry().quad([-.5,0,0],[.5,0,0],[.5,1,-1],[-.5,1,-1])),0,h+.55,d/2+.45,w+.7,1.20,3.2,C.roof,2,1.7);
 this.s19box('v19-terrace-deck',0,h+.12,0,w+.35,.25,d+.35,'#aeb6b0',10,1.4);
 for(const s of[-1,1]){this.s19box('v19-terrace-parapet',0,h+.70,s*(d/2-.10),w,1.1,.32,C.wall,24,1.5);this.s19box('v19-terrace-parapet',s*(w/2-.1),h+.7,0,.32,1.1,d,C.wall,24,1.5);this.s19box('v19-terrace-coping',0,h+1.3,s*(d/2-.1),w+.20,.14,.49,'#a3b1aa',29,1.55);}
});};
P.scienceTwo=function(p,w,d){this.noPlant(0,0,w+2,d+3);
 const bar=d*.245,west=w*.27,base=22.2;
 // Retain the inherited multi-wing organisation, without pretending that a
 // single facade photograph supplies a measured complete footprint.
 this.local(0,0,-d/2+bar/2,0,()=>{this.s19Wall(w,bar,base,5,13);this.s19Roof(w,bar,base+.55,7.6,13,3.6);});
 const long=d-bar;
 this.local(-w/2+west/2,0,bar/2,PI/2,()=>{this.s19Wall(long,west,base,5,12);this.s19Roof(long,west,base+.55,7.6,12,3.6);});
 const southW=w-west;
 this.local(west/2,0,d/2-bar*.48,0,()=>{this.s19Wall(southW,bar*.96,18.0,4,9);this.s19Roof(southW,bar*.96,18.55,6.1,9,2.8);});
 const tw=w*.255,td=d*.16,x=w/2-tw/2;
 this.s19Terrace(x,-d*.175,tw,td,22.2,5);
 this.s19Terrace(x,-d*.015,tw,td,18.0,4);
 this.s19Terrace(x,d*.145,tw,td,13.8,3);
 this.s19Terrace(x,d*.305,tw,td,9.6,2);
 // South model entrance: access point is explicitly not a surveyed doorway.
 this.s19box('v19-entry-reveal',0,2.0,d/2+.10,6.2,3.9,.16,'#3f5554',28,.66);
 this.s19box('v19-entry-canopy',0,4.25,d/2+1.0,8.2,.30,2.2,'#acbab3',29,1.1);
 this.sign('理科二号楼',0,5.15,d/2+.17,9,1.0,0,true);
 for(let i=0;i<3;i++)this.s19box('v19-entry-step',0,.10+i*.1,d/2+1.3-i*.35,7.4,.19,.78,C.stone,10,.08);
};
P.yingjieConference=function(p,w,d){this.noPlant(0,0,w+2,d+4);const depth=d*.40,cz=-d*.09,eave=6.8;
 this.local(0,0,cz,0,()=>{
 this.solid(0,0,w,depth);this.s19box('v19-entrance-body',0,eave/2,0,w,eave,depth,C.wall,24,.50);
 // Front is the observed two-level entrance pavilion. No administrative claim
 // is made about the taller surrounding buildings or all other centre rooms.
 this.s19box('v19-lobby-glass',0,3.42,depth/2+.10,w*.39,6.3,.16,'#385a59',28,.85);
 for(let i=-4;i<=4;i++)this.s19box('v19-lobby-mullion',i*w*.39/8,3.42,depth/2+.21,.105,6.3,.12,'#bdcdc3',29,.91);
 for(const y of[1.65,3.25,4.85,6.55])this.s19box('v19-lobby-mullion',0,y,depth/2+.21,w*.39,.105,.12,'#bdcdc3',29,.91);
 for(const s of[-1,1]){
  this.s19box('v19-entrance-pier',s*w*.235,eave/2,depth/2+.37,1.05,eave,.70,C.wall,24,1.10);
  this.s19Window(s*w*.367,2.0,depth/2+.12,w*.208,3.2);
  this.s19Window(s*w*.367,5.3,depth/2+.12,w*.208,1.65);
  this.s19box('v19-entrance-pier',s*(w/2-.38),eave/2,depth/2+.30,.76,eave,.6,C.wall,24,1.10);
 }
 for(let i=0;i<7;i++)this.s19Window(-w/2+(i+.5)*w/7,3.4,-depth/2-.06,w/7*.58,4.3,PI);
 for(const s of[-1,1])for(let i=0;i<4;i++)this.s19Window(s*(w/2+.05),3.4,-depth/2+(i+.5)*depth/4,2.65,4.3,s*PI/2);
 this.s19box('v19-entry-transom',0,6.6,depth/2+.36,w,.55,.78,'#e5e8de',24,1.18);
 this.s19Roof(w,depth,eave+.4,3.3,11,1.4);
 this.sign('英杰交流中心',0,5.96,depth/2+.31,10.2,.70,0,true);
 });
 const front=cz+depth/2;
 this.s19box('v19-forecourt',0,.09,(front+d/2)/2,w,.15,d/2-front,'#c8cabe',7,.05);
 for(let i=0;i<4;i++)this.s19box('v19-entry-step',0,.10+i*.10,front+1.4-i*.31,w*.60,.18,.65,'#b8c0b5',10,.08);
 for(const s of[-1,1]){this.s19box('v19-planter-edge',s*w*.42,.27,front+4.8,w*.14,.42,5.2,'#a2b3a0',10,.07);this.s19box('v19-low-hedge',s*w*.42,.72,front+4.8,w*.13,.62,5.0,'#5b7a58',19,.1);}
};
})(YY);
