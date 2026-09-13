/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v16: named landmark geometry and the western forecourt. All dimensions below
 * are modelling parameters, not a survey. Evidence and its limitations live in
 * the canonical inventory. Previous landmarks are not replaced globally. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M,PI=Math.PI,TAU=2*PI;
const C={stone:'#b3b8b4',edge:'#d1d4ce',shadow:'#343e43',glass:'#527b89',frame:'#65767a',roof:'#aeb9bb',dark:'#4a5b62'};
P.v16box=function(k,x,y,z,w,h,d,c,mat=24,part=.8){this.mesh(k,this.geo(k,G.box),x,y,z,w,h,d,c,mat,part);};
// Each face has real projecting stone piers, inset glazing, mullions and sills.
P.v16TowerFace=function(key,x,y,z,width,height,bays,rows,rotation=0){this.local(x,y,z,rotation,()=>{
 this.v16box('v16-wang-window',0,height/2,-.17,width,height,.11,C.glass,28,.8);
 const bw=width/bays,fh=height/rows;
 for(let i=0;i<=bays;i++){let xx=-width/2+i*bw;this.v16box(key+'-pier',xx,height/2,.12,.28,height,.58,C.stone,24,.84);}
 for(let j=0;j<=rows;j++){let yy=j*fh;this.v16box(key+'-spandrel',0,yy,.04,width+.1,.63,.48,C.stone,24,.85);if(j<rows)for(let i=0;i<bays;i++){
 let xx=-width/2+bw*(i+.5);this.v16box('v16-wang-sash',xx,yy+fh/2,-.02,.055,fh-.64,.13,C.frame,29,.88);
 this.v16box('v16-wang-sash',xx,yy+fh*.31,-.01,bw-.25,.045,.12,C.frame,29,.88);
 this.v16box('v16-wang-sill',xx,yy+.30,.23,bw-.22,.11,.33,'#c6cbc5',24,.91);}}
 });};
P.wangKezhen=function(p,w,d){
 this.noPlant(0,0,w+6,d+6);this.solid(0,0,w*.94,d*.89);
 const podiumW=w*.94,podiumD=d*.89;
 this.v16box('v16-wang-podium-base',0,.40,0,podiumW+1,.8,podiumD+1,'#969e99',24,.08);
 this.v16box('v16-wang-podium-core',0,6.8,0,podiumW,12.5,podiumD,'#777f80',24,.5);
 for(const s of[-1,1]){this.v16TowerFace('v16-wang-podium',0,.95,s*(podiumD/2+.03),podiumW,11.6,17,3,s<0?PI:0);
 this.v16TowerFace('v16-wang-podium',s*(podiumW/2+.02),.95,0,podiumD,11.6,15,3,s*PI/2);}
 this.v16box('v16-wang-podium-eave',0,13.12,0,podiumW+2,.5,podiumD+2,C.edge,29,1.35);
 // Narrow setback tower; shoulders are explicitly lower than central crown.
 const towerZ=-4.0,base=13.45;
 const blocks=[{x:0,z:towerZ,w:26,d:29,h:58.8,n:15},{x:-18,z:towerZ+1,w:10,d:27,h:47.6,n:12},{x:18,z:towerZ-1,w:10,d:27,h:47.6,n:12}];
 for(const o of blocks){this.v16box('v16-wang-setback-core',o.x,base+o.h/2,o.z,o.w,o.h,o.d,'#6e797b',24,.6);
 for(const s of[-1,1]){this.v16TowerFace('v16-wang-tower',o.x,base,s*o.d/2+o.z,o.w,o.h,Math.round(o.w/2.7),o.n,s<0?PI:0);
 this.v16TowerFace('v16-wang-tower',o.x+s*o.w/2,base,o.z,o.d,o.h,10,o.n,s*PI/2);}
 this.v16box('v16-wang-shoulder-cap',o.x,base+o.h+.35,o.z,o.w+1.1,.55,o.d+1.1,C.edge,29,1.6);}
 // Floor-to-floor cyan corner strips with aluminium pressure plates.
 for(const x of[-13.3,13.3])for(const s of[-1,1]){let z=towerZ+s*14.9;this.v16box('v16-wang-glass-ribbon',x,42.6,z,2.5,56.4,.13,'#628f9b',28,1.05);
 for(let j=0;j<=15;j++)this.v16box('v16-wang-ribbon-crossbar',x,14.4+j*3.72,z+s*.10,2.6,.095,.13,'#a9b9bb',29,1.08);
 for(const dx of[-1.3,0,1.3])this.v16box('v16-wang-ribbon-fin',x+dx,42.6,z+s*.18,.07,56.4,.30,'#bbc6c3',29,1.10);}
 // Recognisable flat projecting crown, separated from the masonry by a clerestory.
 this.v16box('v16-wang-clerestory',0,73.0,towerZ,26.3,1.1,29.3,'#54656c',28,1.7);
 this.v16box('v16-wang-crown',0,74.4,towerZ,34.8,.7,39.2,'#c8cfcb',29,2.0);
 this.v16box('v16-wang-crown',0,74.05,towerZ,35.8,.13,40.2,'#879796',29,1.96);
 for(let x=-16.5;x<=16.5;x+=1.25)this.v16box('v16-wang-crown-rib',x,73.65,towerZ,.15,.75,38.4,'#8d9b9b',29,1.93);
 for(const s of[-1,1])for(const x of[-10.5,10.5])this.beam([x,70.9,towerZ+s*14.5],[x,74,towerZ+s*18.1],.16,'#a2aeaa',29,1.90);
 this.v16box('v16-wang-roof-equipment',-3.4,76.1,towerZ-2,12.8,2.6,10.5,'#a6b0ab',24,2.1);
 // Tower name is legible but not a claimed facsimile of the original calligraphy.
 this.econCaption('王克桢楼',0,69.1,towerZ+15.28,9.9,1.60,'v16-wang-sign','#343f42',1.12);
 // Podium entrance and a low lateral volume are kept lower than the tower.
 for(let j=0;j<6;j++)this.v16box('v16-wang-step',0,.10+j*.15,podiumD/2+3.35-j*.47,12.5,.20,1.02,'#babeb6',24,.05);
 this.v16box('v16-wang-entry-canopy',0,4.45,podiumD/2+1.6,14,.34,5.0,'#839ba0',29,1.25);
 for(const x of[-5.6,5.6])this.v16box('v16-wang-entry-support',x,2.3,podiumD/2+3,.15,4.05,.15,'#909f9f',29,.98);
 for(const x of[-2.9,-.97,.97,2.9]){this.v16box('v16-wang-entry-door',x,2.30,podiumD/2+.36,1.85,3.1,.15,C.glass,28,.94);this.v16box('v16-wang-door-pull',x+.54,2.15,podiumD/2+.49,.055,.72,.10,'#d7dcd5',29,.97);}
};
// V26: visible main hall from the 2016 official west elevation and archived
// aerial HEXhNWX_B_k 50.57–55 s. No invented above-ground swimming annex.
P.qiuGymnasium=function(p,w,d){
 const A=w/2,B=d/2,H=20,inner=16;
 this.noPlant(0,0,w+6,d+6);this.solid(0,0,w-4,d-4);
 this.v16box('qiu26-base',0,.38,0,w-2,.7,d-2,'#b2b5ab',24,.12);
 this.v16box('qiu26-wall',0,H/2,0,w-4,H,d-4,'#b9b9ad',24,.55);
 const face=(width,x,z,r)=>this.local(x,0,z,r,()=>{
  const bays=9,bw=width/bays;
  for(let i=0;i<bays;i++){
   const x=-width/2+(i+.5)*bw;
   // Opaque wall bays and narrow paired windows replace the glass-grid box.
   for(let j=0;j<3;j++)for(const dx of[-bw*.23,bw*.23]){
    this.v16box('qiu26-window',x+dx,3.25+j*5.25,.04,bw*.15,3.30,.12,'#607b7d',28,.70);
    for(let k=0;k<3;k++)this.v16box('qiu26-window-bar',x+dx,2.30+j*5.25+k*.96,.14,bw*.16,.06,.10,'#adb5af',37,.74);
   }
   for(let k=0;k<3;k++)this.v16box('qiu26-panel-joint',x-bw*.32+k*bw*.32,H/2,.02,.025,H,.03,'#8e9995',24,.59);
  }
  for(let i=0;i<=bays;i++)this.v16box('qiu26-pier',-width/2+i*bw,H/2,.42,.75,H,1.05,'#d1d4ca',24,.85);
  for(const y of[.5,5.4,10.6,15.8])this.v16box('qiu26-spandrel',0,y,.07,width,.42,.20,'#b4b7ac',24,.76);
  for(let j=0;j<6;j++)this.v16box('qiu26-eave-louver',0,18.0+j*.27,.55,width,.12,.40,'#606c69',37,1.2);
 });
 face(w-4,0,B-2,0);face(w-4,0,-B+2,PI);face(d-4,A-2,0,PI/2);face(d-4,-A+2,0,-PI/2);
 // V41: two rotating leaves span the entire rectangle; no separate north strip.
 this.local(0,0,0,0,()=>{const A=w/2,B=d/2;
 const radius=a=>Math.min(A/Math.max(1e-9,Math.abs(Math.cos(a))),B/Math.max(1e-9,Math.abs(Math.sin(a))));
 // Parameterize normalized radius AFTER rotation. This is bijective in the
 // rectangle: inverse t=(r-inner)/(radius(theta)-inner), then undo twist.
 const a0=Math.atan2(-B,A),twist=t=>2.15*Math.pow(1-t,1.4);
 const pointCache=new Map();
 const point=(leaf,s,t)=>{
  const key=leaf+','+s+','+t;if(pointCache.has(key))return pointCache.get(key);
  const a=a0+leaf*PI+s*PI,angle=a+twist(t),r=inner+(radius(angle)-inner)*t;
  const q=[r*Math.cos(angle),20.6+4.6*Math.pow(1-t,1.4)+4.2*Math.pow(1-s,2)*(.64+.36*t),r*Math.sin(angle)];pointCache.set(key,q);return q;};
 const quad=(g,a,b,c,d)=>{if(M.cross(M.sub(b,a),M.sub(c,a))[1]<0)g.quad(d,c,b,a);else g.quad(a,b,c,d);};
 for(let leaf=0;leaf<2;leaf++){
  const key='qiu26-roof-'+leaf+'-'+w+'-'+d,g=this.geo(key,()=>{const g=new G.Geometry(),S=96,T=48,normals=new Map();
   const normal=(s,t)=>{const key=s+','+t;if(normals.has(key))return normals.get(key);const e=.0001,a=M.sub(point(leaf,Math.min(1,s+e),t),point(leaf,Math.max(0,s-e),t)),b=M.sub(point(leaf,s,Math.min(1,t+e)),point(leaf,s,Math.max(0,t-e)));let n=M.norm(M.cross(a,b));if(n[1]<0)n=M.mul(n,-1);normals.set(key,n);return n;};
   for(let j=0;j<T;j++)for(let i=0;i<S;i++){let uv=[[i/S,j/T],[(i+1)/S,j/T],[(i+1)/S,(j+1)/T],[i/S,(j+1)/T]],q=uv.map(v=>point(leaf,...v)),n=uv.map(v=>normal(...v));if(M.cross(M.sub(q[1],q[0]),M.sub(q[2],q[0]))[1]<0){q.reverse();n.reverse();uv.reverse();}const emit=(a,b,c)=>g.tri(q[a],q[b],q[c],[uv[a],uv[b],uv[c]],[n[a],n[b],n[c]]);if(M.cross(M.sub(q[2],q[0]),M.sub(q[3],q[0]))[1]<0){emit(0,1,3);emit(1,2,3);}else{emit(0,1,2);emit(0,2,3);}}return g;});
  this.mesh(key,g,0,0,0,1,1,1,'#aaaead',43,2);
  const crest=this.geo(key+'-crest',()=>{const g=new G.Geometry();for(let j=0;j<96;j++){let a=point(leaf,0,j/96),b=point(leaf,0,(j+1)/96),c=[b[0],b[1]-(2.688+1.512*(j+1)/96),b[2]],e=[a[0],a[1]-(2.688+1.512*j/96),a[2]];g.quad(a,b,c,e);}return g;});this.mesh(key+'-crest',crest,0,0,0,1,1,1,'#858e8e',24,2.04);
  // Thin standing seams follow a parallel construction grid; no dark fan.
  const seams=this.geo(key+'-seams28',()=>{const g=new G.Geometry();g.detailWidth=.028;
   const sample=(x,z)=>{const rr=Math.hypot(x,z),theta=Math.atan2(z,x),t=(rr-inner)/(radius(theta)-inner),an=theta-twist(Math.min(1,Math.max(0,t)));if(t<.03||t>1)return null;
    let ang=an-a0;ang=(ang%TAU+TAU)%TAU;const l=ang>=PI?1:0,ss=(ang-l*PI)/PI;if(l!==leaf)return null;
    return [x,20.76+4.6*Math.pow(1-t,1.4)+4.2*(1-ss)*(1-ss)*(.64+.36*t),z];};
   for(let x=-A+.3;x<A;x+=.66)for(let z=-B;z<B-.8;z+=.85){const a=sample(x-.014,z),b=sample(x+.014,z),c=sample(x+.014,z+.84),d=sample(x-.014,z+.84);if(a&&b&&c&&d&&Math.abs(a[1]-d[1])<1.2)quad(g,a,b,c,d);}return g;});
  this.mesh(key+'-seams28',seams,0,0,0,1,1,1,'#a0a5a3',37,2.06);
  for(let j=0;j<64;j++){const a=point(leaf,j/64,1),b=point(leaf,(j+1)/64,1);this.beam(a,b,.19,'#c9cec4',37,2.1);}
 }
 // Raised circular drum and faceted low glass dome visible in the aerial.
 this.cyl(0,23.6,0,15.85,1.1,'#a1aba8',96,1,37,2.2);
 for(let i=0;i<96;i++){const a=i/96*TAU;this.v16box('qiu26-drum-rib',Math.cos(a)*15.90,24.2,Math.sin(a)*15.90,.07,1.1,.07,'#d0d5ca',37,2.3);}
 const dr=15.4,rise=3.8,Y0=24.8,SR=(dr*dr+rise*rise)/(2*rise),cy=Y0+rise-SR,dp=(r,a)=>[r*Math.cos(a),cy+Math.sqrt(Math.max(0,SR*SR-r*r)),r*Math.sin(a)];
 const dome=this.geo('qiu26-dome',()=>{const g=new G.Geometry();for(let j=0;j<12;j++)for(let i=0;i<48;i++)quad(g,dp(j/12*dr,i/48*TAU),dp(j/12*dr,(i+1)/48*TAU),dp((j+1)/12*dr,(i+1)/48*TAU),dp((j+1)/12*dr,i/48*TAU));return g;});this.mesh('qiu26-dome',dome,0,0,0,1,1,1,'#a1b5ad',28,2.5);
 for(let j=1;j<=12;j++)for(let i=0;i<48;i++){const a=dp(j/12*dr,i/48*TAU),b=dp(j/12*dr,(i+1)/48*TAU);a[1]+=.06;b[1]+=.06;this.beam(a,b,.065,'#d2d7cc',37,2.6);if(i%2===0)this.beam(dp((j-1)/12*dr,i/48*TAU),a,.065,'#d2d7cc',37,2.6);}
 });
 // V36 north entry: 40 risers documented in the university's 2020 report.
 // Flight depth, rail heights and doorway dimensions remain photo estimates.
 this.local(0,0,-B+2.0,PI,()=>{
  const width=60,riser=.16,tread=.40,landing=1.35,top=40*riser,near=2.1;
  // Opaque surround masks the inherited generic window grid on this entrance.
  this.v16box('qiu36-entry-surround',0,11.4,.63,w*.74,16.6,1.35,'#b9bfbb',24,.8);
  this.v16box('qiu36-entry-glazing',0,top+2.4,1.36,width-2,4.8,.16,'#405d61',28,.9);
  for(let x=-width/2+1;x<=width/2-1;x+=2.6)this.v16box('qiu36-entry-mullion',x,top+2.4,1.49,.10,4.8,.14,'#becbc5',37,1);
  for(const y of[top+.3,top+2.5,top+4.65])this.v16box('qiu36-entry-transom',0,y,1.49,width-2,.10,.14,'#becbc5',37,1);
  this.v16box('qiu36-top-landing',0,top/2,near+.5,width,top,2.5,'#beb9ad',10,.1);
  // Both flights have twenty risers, with a full-width mid-landing.
  for(let i=0;i<40;i++){
   const z=near+(40-i-.5)*tread+(i<20?landing:0),h=(i+1)*riser;
   this.v16box('qiu36-front-stair',0,h/2,z,width,h,tread+.025,'#beb9ad',10,.1);
  }
  this.v16box('qiu36-mid-landing',0,20*riser/2,near+20*tread+landing/2,width,20*riser,landing,'#beb9ad',10,.1);
  // Slim horizontal railings divide the wide stair into three walking bands.
  const rail=(x,z0,y0,z1,y1)=>{
   for(const dh of[.38,.68,1.0])this.beam([x,y0+dh,z0],[x,y1+dh,z1],.038,'#c1ccc6',37,1);
   const n=Math.ceil(Math.hypot(z1-z0,y1-y0)/1.6);for(let i=0;i<=n;i++){const t=i/n;this.box(x,y0+(y1-y0)*t+.5,z0+(z1-z0)*t,.07,1,.07,'#b9c6c0',37,1);}
  };
  for(const x of[-width/2,-width*.24,width*.24,width/2]){
   rail(x,near+40*tread+landing,.16,near+20*tread+landing,top/2);
   rail(x,near+20*tread+landing,top/2,near+20*tread,top/2);
   rail(x,near+20*tread,top/2,near,top);
  }
  // Shallow clear canopy, visible beams and hanging rods, as in the north photo.
  this.v16box('qiu36-canopy-glass',0,11.85,3.1,width+1,.12,5.0,'#adc3bd',28,1.15);
  for(let x=-width/2;x<=width/2;x+=5){this.v16box('qiu36-canopy-rib',x,11.65,3.1,.15,.24,5.1,'#adbeb9',37,1.18);this.beam([x,14.7,.95],[x,11.8,5.2],.045,'#aebfba',37,1.2);}
  for(const z of[.7,3.0,5.5])this.v16box('qiu36-canopy-crossbar',0,11.71,z,width+1,.16,.13,'#afc0ba',37,1.2);
  this.v16box('qiu36-louver-shadow',0,17.7,1.4,w*.74,3.0,.15,'#344b53',20,1.22);
  for(let j=0;j<8;j++)this.v16box('qiu36-front-louver',0,16.5+j*.35,1.62,w*.74,.13,.38,'#667d84',37,1.24);
  // Flat gold Chinese + English lettering, not extruded improvised glyphs.
  const inscription=(text,y,width,height,font)=>{
   const key='qiu36-inscription-'+text;let uv=this.signs.get(key);
   this.ctx.font=font;const natural=this.ctx.measureText(text).width;
   if(!uv){const k=this.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;
    this.ctx.clearRect(px,py,512,128);this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.fillStyle='#dcc47a';
    this.ctx.fillText(text,px+256,py+64);uv=[px/4096,1-(py+128)/4096,.125,.03125];this.signs.set(key,uv);}
   const scale=Math.min(width/natural,height/(text.startsWith('Khoo')?28:48));
   this.mesh('plane',this.geo('plane',G.plane),0,y,1.89,512*scale,128*scale,1,'#ffffff',8,.85,0,uv);
  };
  inscription('邱德拔体育馆',18.1,17.5,2.25,'48px "Kaiti SC","STKaiti","KaiTi",serif');
  inscription('Khoo Teck Puat Sports Complex',16.65,15.5,.85,'bold 28px Arial,sans-serif');
 });
};
P.yanyuanTower=function(p,w,d){
 this.noPlant(0,0,w+4,d+4);this.solid(0,0,w,d);
 const h=p.h,coreW=w*.92,coreD=d*.68;
 this.v16box('yanyuan26-podium',0,4.5,0,w,9,d,'#bfc0b3',24,.4);
 this.v16box('yanyuan26-tower',0,9+(h-9)/2,-d*.06,coreW,h-9,coreD,'#c5c5b8',24,.6);
 // Broad slab, continuous dark horizontal glazing; 14 above-ground levels
 // documented by the university (2021). Width and height remain estimates.
 for(const s of[-1,1])for(let j=0;j<12;j++){
  const y=10.7+j*(h-11)/12,z=-d*.06+s*(coreD/2+.04);
  this.v16box('yanyuan26-glass-band',0,y,z,coreW*.84,2.7,.16,'#5c737a',28,.8);
  this.v16box('yanyuan26-floor-band',0,y-1.60,z+s*.15,coreW+.30,.42,.55,'#dbdccf',24,1);
  for(let i=-10;i<=10;i++)this.v16box('yanyuan26-mullion',i*coreW*.038,y,z+s*.12,.085,2.8,.10,'#c8cec5',29,.9);
 }
 for(const s of[-1,1])for(let j=0;j<13;j++)for(let i=-2;i<=2;i++)this.v16box('yanyuan26-side-window',s*(coreW/2+.05),5.4+j*(h-8)/13,-d*.06+i*coreD*.16,.14,2.45,coreD*.095,'#657d82',28,.8);
 this.v16box('yanyuan26-cap',0,h+.42,-d*.06,coreW+.8,.65,coreD+1.0,'#d4d7cb',24,1.8);
 this.v16box('yanyuan26-roof-house',w*.21,h+2.4,-d*.02,w*.27,3.4,d*.29,'#a9b3aa',24,1.85);
 for(let i=-6;i<=6;i++)this.v16box('yanyuan26-podium-window',i*w*.065,4.1,d/2+.06,w*.050,5.5,.15,'#5f777d',28,.8);
 this.econCaption('燕园大厦',0,7.6,d/2+.25,13,1.45,'yanyuan26-sign','#454f49',1.1);
};
P.westFlank=function(p,w,d){
 this.noPlant(0,1,w+5,d+8);this.solid(0,0,w,d);this.v16box('v16-west-flank-base',0,.5,0,w+1.8,1,d+1.8,'#b1b1a5',24,.10);
 this.v16box('v16-west-flank-body',0,5.35,0,w,9.7,d,'#c9c7b9',24,.5);
 for(const s of[-1,1])this.local(0,0,s*(d/2+.04),s<0?PI:0,()=>{for(let i=-6;i<=6;i++)for(const yy of[3.17,7.52]){let x=i*(w-6)/13;this.v9Lattice(x,yy,.06,(w-9)/13,3.27,0,false);}for(let i=-6;i<=6;i++)this.v9Bracket(i*(w-6)/13,9.84,.2,.64);this.v9PaintedBeam(0,9.95,.3,w-2,.55);});
 for(const s of[-1,1])this.local(s*(w/2+.04),0,0,s*PI/2,()=>{for(let x of[-4.1,0,4.1])for(let y of[3.2,7.5])this.v9Lattice(x,y,0,2.35,3.2,0,false);});
 this.v9Roof(0,10.7,0,w+3.0,d+3.6,4.2,'hip',2.0);this.heritageDoor(0,1.0,d/2+.44,3.3,3.6,0,'#78382d');
 for(let j=0;j<5;j++)this.v16box('v16-west-flank-step',0,.16+j*.19,d/2+3.0-j*.49,7.0,.26,1.1,'#b9b8ab',24,.09);
 this.econCaption('外文楼',0,9.2,d/2+.6,2.8,.72,'v16-west-flank-name','#3f3932',1.1);
};
P.westArchive=function(p,w,d){
 this.noPlant(0,1,w+5,d+8);
 // Two long wings and two end pieces surround a real open light well.
 const fw=w*.90,fd=d*.92,strip=fd*.32,H=11.7;
 for(const s of[-1,1]){let z=s*(fd/2-strip/2);this.solid(0,z,fw,strip);this.v16box('v16-archive-long-wing',0,H/2+.55,z,fw,H,strip,'#cac8b9',24,.55);this.v9Roof(0,H+1,z,fw+2.2,strip+2.5,2.9,'hip',2);this.local(0,0,s*fd/2,s<0?PI:0,()=>{for(let i=-5;i<=5;i++)for(let j=0;j<3;j++)this.v9Lattice(i*fw/12,2.60+j*3.50,.08,fw/13,2.75,0,false);});}
 for(const s of[-1,1]){const ew=fw*.17,x=s*(fw/2-ew/2);this.solid(x,0,ew,fd-strip*2);this.v16box('v16-archive-end-wing',x,H/2+.55,0,ew,H,fd-strip*2,'#c9c7b9',24,.55);this.local(x,H+1,0,PI/2,()=>this.v9Roof(0,0,0,fd-strip*2+1.5,ew+1.6,2.5,'hip',2));}
 this.v16box('v16-archive-courtyard',0,.18,0,fw*.6,.16,fd*.31,'#adada1',26,.02);
 for(let j=0;j<5;j++)this.v16box('v16-archive-step',0,.13+j*.14,fd/2+2.5-j*.47,7.8,.25,1.0,'#b6b8ac',24,.05);
 this.heritageDoor(0,.65,fd/2+.34,3.6,3.65,0,'#723b30');this.econCaption('北京大学档案馆',0,8.65,fd/2+.45,8.9,.80,'v16-archive-name','#423e35',1.1);
};
})(YY);
