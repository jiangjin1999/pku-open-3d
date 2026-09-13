/* Micro/Nano Electronics: west cantilever boxes and suspended exterior stair, within source envelope. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/11975583';
const R=Math.atan2(5.541,41.276),CO=Math.cos(R),SI=Math.sin(R),O=[321.562,-171.304];
const C={silver:'#b8c3c6',panel:'#9eafb5',glass:'#74959f',dark:'#354e59',frame:'#becfd0',roof:'#a3a9a6',warm:'#776955',stair:'#a2aaa8'};
const H={base:8.4,main:20.5,boxBase:14.25,boxTop:20.5},boxes=[{name:'north',v0:14.0,v1:28.5},{name:'south',v0:46.0,v1:62.0}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function block(name,box,base,top,color=C.silver){const g=new G.Geometry(),cap=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){cap.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('003-'+name,g,color,color===C.glass?28:24,id);add('003-'+name+'-cap',cap,C.roof,22,id);}
 // Carve an actual recessed doorway through the west glazing.
 block('two-storey-glass-base',[4.9,-1,43,36.5],0,H.base,C.glass);
 block('base-south-of-entry',[4.9,42.5,43,79],0,H.base,C.glass);
 block('base-entry-head',[4.9,36.5,43,42.5],3.75,H.base,C.glass);
 block('base-behind-entry',[7.2,36.5,43,42.5],0,3.75,C.glass);
 block('inset-upper-main',[3.5,-1,43,79],H.base,H.main,C.panel);
 // Footprint is not translated: glass cantilevers occupy the existing western envelope.
 for(const q of boxes){const mid=(q.v0+q.v1)/2;
  block(q.name+'-cantilever-floor',[.10,q.v0,4.3,q.v1],H.boxBase,H.boxBase+.42,C.silver);
  block(q.name+'-cantilever-glass',[.10,q.v0,4.3,q.v1],H.boxBase+.42,H.boxTop,C.glass);
  block(q.name+'-narrow-support',[2.5,mid-2.5,3.55,mid+2.5],H.base,H.boxBase,C.glass);
  frame(.10,q.v0,-Math.PI/2,()=>{const len=q.v1-q.v0;for(let i=0;i<=7;i++)b.box(i*len/7,17.55,.055,.065,5.85,.085,C.dark,29);for(const yy of [14.70,15.10,17.3,20.38])b.box(len/2,yy,.055,len,.07,.085,C.dark,29);});
  for(const [vv,ang] of [[q.v0,Math.PI],[q.v1,0]])frame(.10,vv,ang,()=>{const sign=ang===0?1:-1;for(const x of [0,1.4,2.8,4.2])b.box(sign*x,17.55,.055,.065,5.85,.085,C.dark,29);for(const yy of [14.7,15.1,17.3,20.38])b.box(sign*2.1,yy,.055,4.2,.07,.085,C.dark,29);});
  frame(2.5,mid-2.5,-Math.PI/2,()=>{for(let i=0;i<=3;i++)b.box(i*5/3,11.3,.055,.06,5.8,.085,C.dark,29);for(const yy of [8.5,11.2,14.15])b.box(2.5,yy,.055,5,.065,.085,C.dark,29);});
 }
 // Silver cladding behind the two glass projections, with a quiet panel grid rather than fake windows.
 frame(3.5,0,-Math.PI/2,()=>{for(let i=1;i<48;i++)b.box(i*1.62,14.45,.025,.025,12.05,.035,C.silver,24);for(let j=1;j<7;j++)b.box(39,8.4+j*1.7,.025,78,.025,.035,C.silver,24);
  if(b.lettering){b.lettering('微纳电子大厦',38.5,12.3,.085,11.5,1.15,0,'#e0e4de');b.lettering('Micro & Nanoelectronics Building',38.5,11.2,.085,12.5,.42,0,'#dbe0d9');b.lettering('IMNE',4.0,18.8,.085,3.8,.9,0,'#e0e4de');}
 });
 // Low two-storey glazing and separate round columns form the open west colonnade.
 frame(4.9,.4,-Math.PI/2,()=>{for(let i=0;i<=30;i++){const v=.4+i*2.56;if(v>36.5&&v<42.5)b.box(i*2.56,6.025,.055,.055,4.45,.075,C.dark,29);else b.box(i*2.56,4.15,.055,.055,8.2,.075,C.dark,29);}for(const yy of [1.0,4.2,8.2]){if(yy<3.75){b.box(18.0,yy,.055,36,.08,.08,C.dark,29);b.box(59.55,yy,.055,34.9,.08,.08,C.dark,29);}else b.box(38.5,yy,.055,77,.08,.08,C.dark,29);}});
 for(let v=3.5;v<78;v+=7.5){if(v>36.5&&v<42.5)continue;frame(3.55,v,0,()=>b.cyl(0,0,0,.32,8.35,C.silver,16,1,24));}
 // The upper base ceiling is warm toned in the real low-angle photographs.
 frame(4.2,39,0,()=>b.box(0,8.23,0,1.4,.16,77.5,C.warm,24));
 // Four fitted exposed stair runs, with thin sloping plates and treads; never a ground-filled wedge.
 const runs=[{v0:1.2,v1:13.2,y0:16.8,y1:11.95},{v0:17.0,v1:31.0,y0:11.95,y1:8.4},{v0:40.0,v1:54.0,y0:8.4,y1:4.2},{v0:61.0,v1:76.0,y0:4.2,y1:.45}];
 function rail(v0,v1,y0,y1,u){frame(0,0,0,()=>{b.beam([u,y0+1.03,v0],[u,y1+1.03,v1],.045,C.frame,29);const n=Math.ceil(Math.abs(v1-v0)/1.1);for(let i=0;i<=n;i++){const t=i/n;b.box(u,y0+(y1-y0)*t+.52,v0+(v1-v0)*t,.035,1.02,.035,C.frame,29);}});}
 runs.forEach((r,index)=>{const mesh=new G.Geometry(),u0=.50,u1=2.45,th=.19;
  mesh.quad(vertex(u0,r.y0,r.v0),vertex(u0,r.y1,r.v1),vertex(u1,r.y1,r.v1),vertex(u1,r.y0,r.v0));
  mesh.quad(vertex(u1,r.y0-th,r.v0),vertex(u1,r.y1-th,r.v1),vertex(u0,r.y1-th,r.v1),vertex(u0,r.y0-th,r.v0));
  for(const u of [u0,u1])mesh.quad(vertex(u,r.y0-th,r.v0),vertex(u,r.y1-th,r.v1),vertex(u,r.y1,r.v1),vertex(u,r.y0,r.v0));
  add('003-suspended-stair-run-'+index,mesh,C.stair,24,id);
  const n=Math.ceil((r.v1-r.v0)/.31);frame(0,0,0,()=>{for(let i=0;i<n;i++){const t=(i+.5)/n,y=r.y0+(r.y1-r.y0)*t;b.box((u0+u1)/2,y+.07,r.v0+(r.v1-r.v0)*t,u1-u0,.14,(r.v1-r.v0)/n,C.stair,24);}});
  // Outer solid stair cheek is a shallow suspended plate, not a tall wall to the ground.
  const cheek=new G.Geometry();cheek.quad(vertex(u0,r.y0,r.v0),vertex(u0,r.y1,r.v1),vertex(u0,r.y1+.85,r.v1),vertex(u0,r.y0+.85,r.v0));add('003-stair-cheek-'+index,cheek,C.silver,24,id);rail(r.v0,r.v1,r.y0,r.y1,u1);
 });
 for(const [v0,v1,y] of [[13.2,17,11.95],[31,40,8.4],[54,61,4.2]])frame(0,0,0,()=>{b.box(1.5,y-.1,(v0+v1)/2,2,.2,v1-v0,C.stair,24);b.box(.5,y+.42,(v0+v1)/2,.09,.84,v1-v0,C.silver,24);b.box(2.45,y-.18,(v0+v1)/2,3.5,.20,.55,C.silver,24);});
 for(const [v0,v1,y] of [[13.2,17,11.95],[31,40,8.4],[54,61,4.2]])rail(v0,v1,y,y,2.45);
 // Recessed double glass doors, with a continuous landing and clear approach.
 frame(7.12,39.5,-Math.PI/2,()=>{
  b.box(0,.55,1.75,6,.10,3.5,C.silver,10);
  for(const x of [-2.95,0,2.95])b.box(x,2.15,0,.09,3.1,.12,C.dark,29);
  for(const yy of [.64,3.68])b.box(0,yy,0,6,.09,.12,C.dark,29);
  for(const x of [-1.48,1.48])b.box(x,2.15,-.025,2.86,2.98,.055,C.glass,28);
  for(const x of [-.23,.23])b.box(x,1.95,.12,.05,.65,.06,C.frame,29);
 });
 // The entry sign uses the 2023 college wording; building name remains on the wall above.
 frame(3.5,39.5,-Math.PI/2,()=>{b.box(0,4.15,.8,12.8,.32,3.6,C.silver,24);b.box(0,3.95,.8,12.5,.10,3.4,C.warm,24);b.box(0,4.76,2.56,12.0,.95,.16,C.stair,24);if(b.lettering)b.lettering('集成电路学院',0,4.76,2.67,7.4,.70,0,'#e6e8df');
  for(let j=0;j<4;j++)b.box(0,.075+j*.15,2.45-j*.38,9.8,.15,1.20,C.silver,10);b.box(0,.55,-.25,9.8,.10,2.4,C.silver,10);
  for(const side of [-1,1]){b.beam([side*4.7,.65,1.0],[side*4.7,1.10,3.2],.05,C.frame,29);for(const z of [1.1,2.0,3.1])b.box(side*4.7,.65,z,.045,.95,.045,C.frame,29);}
 });
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1];b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(Math.hypot(dx,dz)));}
 const pg=F.polygons(f.geometry)[0];
 // North/south short faces: alternating tall silver-blue panels above clear lower glass.
 for(const [a,c] of [[pg[0][3],pg[0][0]],[pg[0][1],pg[0][2]]]){
  const aa=local(a),cc=local(c),positive=cc[0]>aa[0];boundary(c,a,len=>{const n=24;for(let i=0;i<n;i++){const x=(i+.5)*len/n;if((positive?41.646-x:x)<4.9)continue;
   b.box(x,14.45,.07,len/n-.07,12.0,.1,i%3===1?'#7192a0':i%3===2?'#abc2c9':'#c1ccce',24);
   if(i%3!==0){b.box(x,12.9,.14,len/n-.18,4.0,.035,C.glass,28);b.box(x,18.1,.14,len/n-.18,2.3,.035,C.glass,28);}
   b.box(x,4.15,.055,.06,8.25,.075,C.dark,29);
  }const lo=positive?0:4.9,hi=positive?len-4.9:len;for(const yy of [4.2,8.3,16.2,20.4])b.box((lo+hi)/2,yy,.12,hi-lo,.06,.075,C.frame,29);});
 }
 // Courtyard glazing follows all original inner edges, avoiding a solid anonymous interior wall.
 for(const ring of pg.slice(1)){const positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(!positive)[a,c]=[c,a];boundary(a,c,len=>{const n=Math.max(1,Math.round(len/2.7));for(let j=0;j<5;j++)for(let k=0;k<n;k++){const x=(k+.5)*len/n;b.box(x,2.0+j*4.05,.08,Math.min(2.4,len/n-.2),3.10,.09,C.glass,28);b.box(x,2+j*4.05,.15,.05,3.1,.045,C.frame,29);}for(let j=1;j<5;j++)b.box(len/2,j*4.05,.08,len,.15,.15,C.silver,24);});}}
 // East elevation remains a restrained fitted silver/glass rhythm; do not duplicate west boxes/stair.
 boundary(pg[0][1],pg[0][0],len=>{for(let j=0;j<5;j++)for(let k=0;k<26;k++){const x=(k+.5)*len/26;b.box(x,2+j*4.05,.08,2.35,3.0,.08,j<2?C.glass:(k%3===0?C.glass:C.silver),j<2||k%3===0?28:24);}for(let k=0;k<26;k++)b.box(k*len/26,10.2,.1,.055,20.3,.075,C.frame,29);});
 // Observed rooftop plant vocabulary, placed only on real solid roof areas.
 frame(0,0,0,()=>{for(const [u,v,w,d,h] of [[27,7,6,6,3],[19,37.5,5,5,2.7],[36.7,40,3,6,2.1]])b.box(u,H.main+h/2,v,w,h,d,'#d5dcda',24);for(const v of [4,8,12])b.box(37,H.main+.5,v,2.6,.95,1.8,'#cbd3d1',24);});
 return {strategy:'building003-v46',floors:5,sourceOutline:true,twoCourts:true,westCantilevers:true,suspendedStairs:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building003={id:ID,render,world,local,pieces,heights:H,boxes};
})(YY);
