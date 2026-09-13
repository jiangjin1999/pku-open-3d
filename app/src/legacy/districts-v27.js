/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* V27: two connected campus districts. Plans combine the user's corrections,
 * university descriptions, the supplied maps, and viewed photos/design images.
 * Building dimensions and hidden elevations remain approximate. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,PI=Math.PI;
const C={brick:'#a4a49a',stone:'#c6c8bd',roof:'#636b6a',glass:'#536e71',frame:'#586660'};

// Exact rectangular wall footprints keep joined wings touching without inflated
// academic-block padding. Windows and roof projections are separate details.
P.v27Wall=function(w,d,h,n=5,tone=C.brick,bays=Math.max(3,Math.round(w/4.6))){
 this.solid(0,0,w,d);this.box(0,h/2+.35,0,w,h,d,tone,1,.5);
 this.box(0,.4,0,w+.2,.8,d+.2,C.stone,10,.12);
 const fh=(h-.6)/n;
 for(const side of[-1,1]){
  for(let f=0;f<n;f++)for(let i=0;i<bays;i++)this.window(-w/2+(i+.5)*w/bays,1.0+(f+.43)*fh,side*(d/2+.12),Math.min(3.1,w/bays*.63),Math.min(2.5,fh*.65),side<0?PI:0,C.frame);
  this.box(0,h+.26,side*(d/2+.14),w+.3,.42,.40,C.stone,10,1.4);
 }
 const ends=Math.max(2,Math.floor(d/4.5));
 for(const side of[-1,1])for(let f=0;f<n;f++)for(let i=0;i<ends;i++)this.window(side*(w/2+.12),1.0+(f+.43)*fh,-d/2+(i+.5)*d/ends,Math.min(2.7,d/ends*.58),Math.min(2.5,fh*.65),side*PI/2,C.frame);
};
P.v27Glazing=function(w,h,z,tone='#47676d'){
 this.box(0,h/2+.4,z,w,h,.12,tone,5,.72);
 for(let x=-w/2;x<=w/2+.01;x+=w/Math.max(2,Math.round(w/1.7)))this.box(x,h/2+.4,z+.09,.12,h,.14,'#879b97',9,.8);
 for(let y=.4;y<h+.4;y+=1.8)this.box(0,y,z+.09,w,.10,.14,'#8c9e98',9,.8);
};
P.scienceLink27=function(p,w,d){
 this.s19Wall(w,d,22.2,5,10);this.s19Roof(w,d,22.75,7.6,10,2.6);
 this.noPlant(0,0,w,d);
};
P.nongyuan27=function(p,w,d){
 // Three storeys, north-south main range and the southeast projecting hall.
 // Roof breaks, portico and sloping glass are traced from the architect's photos.
 const h=13.8,mw=w*.90,md=d*.76,mx=-w*.05,mz=-d*.12;
 this.local(mx,0,mz,0,()=>{this.v27Wall(mw,md,h,3,'#a9a496',12);
  this.local(0,0,0,PI/2,()=>this.hip(0,h+.5,0,md+.8,mw+.8,2.4));
 });
 const ex=w*.22,ez=d*.35,ew=w*.56,ed=d*.30;
 this.local(ex,0,ez,0,()=>{this.local(0,0,-2.4,0,()=>this.v27Wall(ew,ed-4.8,h,3,'#aaa696',8));this.hip(0,h+.5,0,ew+.7,ed+.7,2.4);});
 // The southwest entry recess is not filled with the main building body.
 const sx=-w*.28,sz=d*.29;
 this.local(sx,0,sz,0,()=>{this.entry(8.8,0,4.0,'农园',.55);this.box(0,5.15,1.2,12,.30,3.3,'#b1b5a8',10,1.1);});
 // Southern hall: sloped glass base under a deep, very thin columned canopy.
 const gz=d*.50,gw=w*.48,cx=w*.22,base=0.4,top=6.6,back=gz-4.8;
 const glass=this.geo('nong28-glass',()=>{const g=new G.Geometry();g.quad([cx-gw/2,base,gz],[cx+gw/2,base,gz],[cx+gw/2,top,back],[cx-gw/2,top,back]);return g;});
 this.mesh('nong28-glass',glass,0,0,0,1,1,1,'#8ba19d',5,1.1);
 for(let i=0;i<=10;i++){const x=cx-gw/2+i*gw/10;this.beam([x,base,gz+.03],[x,top,back+.03],.10,'#596762',9,1.2);}
 for(const t of[.0,.5,1])this.beam([cx-gw/2,base+(top-base)*t,gz-4.8*t],[cx+gw/2,base+(top-base)*t,gz-4.8*t],.12,'#596762',9,1.2);
 this.box(cx,10.6,gz-1.4,gw+2,.28,7.4,'#aeb4a6',9,1.4);
 for(const x of[-.45,-.15,.15,.45])this.cyl(cx+gw*x,6.4,gz-1.5,.16,4.2,'#a2aaa0',10,1,9,1.35);
 this.local(mx,0,-d*.50,PI,()=>this.entry(8.5,0,4.0,'农园',.55));
 this.noPlant(sx,d*.38,w*.48,d*.25);
};
P.educationHall27=function(p,w,d){
 const h=18.8;this.v27Wall(w,d,h,5,'#9d9f96',14);this.hip(0,h+.65,0,w+1.6,d+1.8,3.0);
 // Gray brick piers, recessed dark entrance and the balcony seen in the photo.
 const z=d/2;
 this.box(0,4.7,z+.13,13.8,8.7,.20,'#5a6056',5,.65);
 for(const x of[-7.5,7.5])this.box(x,5.05,z+.6,1.3,9.8,1.4,'#a2a49b',1,.7);
 this.entry(9.0,z,4.0,'教育学院',.65);
 this.box(0,4.85,z+.7,13.6,.5,1.3,'#c9c9bd',10,.8);
 for(const x of[-5,-2.5,0,2.5,5])this.box(x,5.95,z+1.10,.065,1.7,.065,'#879288',9,.9);
 for(const yy of[5.35,6.75])this.box(0,yy,z+1.10,13,.065,.07,'#879288',9,.9);
 this.lettering('北京大学教育学院',0,16.8,z+.24,25,1.1,0,'#66554c');
 this.noPlant(0,z+2,18,5);
};
P.sisWing27=function(p,w,d){
 const draw=(ww,dd)=>{
  const h=p.h-2.2,levels=p.floors;
  this.v27Wall(ww,dd,h,levels,'#aba99d',Math.max(4,Math.round(ww/4.4)));
  this.box(0,h+.50,0,ww+1.0,.35,dd+1.2,'#d4d6c9',10,1.5);
  this.hip(0,h+.82,0,ww+1.5,dd+1.7,1.5);
  for(let x=-ww/2+2;x<ww/2;x+=4.6)this.box(x,h+.48,dd/2+.64,.18,.55,1.2,'#81887e',9,1.4);
  if(p.wing==='B'){
   // B is the long north-south wing; this face turns west toward Shaoyuan.
   this.local(0,0,dd/2+.16,0,()=>{this.v27Glazing(ww*.22,h-.5,0);this.entry(5,0,3.6,'瓦洛里楼',.45);});
   this.lettering('瓦洛里楼',ww*.24,h-1.5,dd/2+.3,12,1,0,'#deddd0');
  }else{
   this.local(-ww/2,0,0,-PI/2,()=>{this.v27Glazing(dd*.6,h-.4,.12);this.entry(5.8,.2,3.8,p.wing==='A'?'陈瑞鸿楼':'新鸿基楼',.45);});
   this.lettering(p.wing==='A'?'国际关系学院 · 陈瑞鸿楼':'新鸿基楼',0,h-1.35,dd/2+.25,Math.min(ww*.76,30),1.1,0,'#dfddd0');
  }
 };
 if(p.wing==='B')this.local(0,0,0,-PI/2,()=>draw(d,w));else draw(w,d);
};
P.tongyuan27=function(p,w,d){
 this.v27Wall(w,d,5.7,1,'#b0b0a1',10);this.hip(0,6.05,0,w+1.2,d+1.3,1.65);
 this.local(-w/2,0,0,-PI/2,()=>{this.entry(4.8,0,3.2,'佟园',.35);});
 this.lettering('佟园餐厅',0,4.45,d/2+.3,14,1.0,0,'#567460');
 this.noPlant(-w/2-1,0,4,d+2);
};
P.research27=function(p,w,d){
 const h=20.8,n=5,arm=w*.23,bar=d*(p.id===351?.24:.20);
 const wing=(x,z,ww,dd,height=h,levels=n,r=0)=>this.local(x,0,z,r,()=>{this.v27Wall(ww,dd,height,levels,'#999e96');this.hip(0,height+.65,0,ww+1.4,dd+1.5,Math.min(3.2,dd*.17));});
 if(p.id===351){
  wing(-w/2+arm/2,0,d,arm,h,n,PI/2);
  wing(arm/2,-d/2+bar/2,w-arm,bar);
  wing(arm/2,d/2-bar/2,w-arm,bar);
  this.local(-w/2+arm,0,0,PI/2,()=>{this.v27Glazing(d*.28,h,.15);this.entry(7,.15,4.0,'综合科研1号楼',.6);});
  this.noPlant(arm/2,0,w-arm,d-2*bar);
  this.box(arm/2,.15,0,w-arm,.15,d-2*bar,'#adb6a0',0);
 }else{
  // Larger southern building: long east wing and northern wing enclose a
  // courtyard with a genuinely low southern wing, as in the viewed proposal.
  wing(w/2-arm/2,0,d,arm,h,n,PI/2);
  wing(-arm/2,-d/2+bar/2,w-arm,bar);
  wing(-arm/2,d/2-bar/2,w-arm,bar,6.6,1);
  const glassW=w*.16;
  this.local(w/2-arm-glassW/2,0,-d*.18,0,()=>{this.solid(0,0,glassW,d*.18);this.box(0,6.1,0,glassW,12.2,d*.18,'#516c6d',5,.6);for(const s of[-1,1])this.local(0,0,s*d*.09,s<0?PI:0,()=>this.v27Glazing(glassW,12.2,.14));});
  this.local(w/2-arm,0,0,-PI/2,()=>{this.box(0,5,.5,10.4,10,1.1,'#c5c7be',10,.7);this.entry(6.5,1.1,4.6,'综合科研2号楼',.65);});
  this.noPlant(-arm/2,0,w-arm,d-2*bar);
  this.box(-arm/2,.13,0,w-arm,.15,d-2*bar,'#a6b198',0);
 }
 // Neutral paving and restrained roof/services articulation.
 this.box(0,.21,0,w,.12,3.8,'#bcc1b3',7);
 for(const side of[-1,1]){
  const x=side*(w/2-.8);
  for(let k=0;k<3;k++)this.box(x,h*.5,-d*.2+k*d*.18,1.4,h*.86,1.1,'#bdc3b9',10,.95);
 }
};
})(YY);
