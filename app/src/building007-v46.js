/* Guanghua No.1: mapped court + west forecourt, distinct east/west entrances. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/13068022';
const R=Math.atan2(3.288,68.708),CO=Math.cos(R),SI=Math.sin(R),O=[116.26,258.2];
const C={brick:'#858480',stone:'#d2ccc4',glass:'#829595',frame:'#dce1d9',roof:'#686e6e',rock:'#74766d'};
const heights={low:11.4,main:19,ridge:22.1,bridgeBase:4.3,bridgeTop:7.9};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO];
const local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(poly,axis,k,greater){
 const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,bi=greater?b[axis]>=k:b[axis]<=k;
  if(ai)out.push(a);if(ai!==bi){const t=(k-a[axis])/(b[axis]-a[axis]);out.push(a.map((x,j)=>x+t*(b[j]-x)));}
 }return out;
}
// Clip the actual footprint triangles, including the inner ring; never fill a bounding rectangle.
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){
 let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);
 if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);
 }return out;}
function render(b,f,add){
 const id=f.properties.pickId;b.id=id;
 function block(name,box,base,top,color=C.brick){
  const ps=pieces(f,box),mesh=new G.Geometry(),cap=new G.Geometry();
  for(const p of ps){for(let i=0;i<p.length;i++){const a=world(...p[i]),c=world(...p[(i+1)%p.length]);mesh.quad([a[0],base,a[1]],[c[0],base,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]);}
   for(let i=1;i<p.length-1;i++){const vs=[p[0],p[i],p[i+1]].map(p=>{const w=world(...p);return [w[0],top,w[1]];});cap.tri(...vs);if(base>0)mesh.tri(...vs.map(v=>[v[0],base,v[2]]).reverse());}
  }
  add('007-'+name,mesh,color,color===C.glass?28:24,id);add('007-'+name+'-cap',cap,C.roof,22,id);return ps;
 }
 function frame(u,v,angle,fn){const p=world(u,v);b.local(p[0],0,p[1],R+angle,fn);}
 function win(x,y,w,h,z=.09){
  b.box(x,y,z,w+.15,h+.15,.14,C.frame,29);b.box(x,y,z+.09,w,h,.035,C.glass,28);
  for(const t of [-.25,0,.25])if(w>2||t===0)b.box(x+w*t,y,z+.12,.055,h,.055,C.frame,29);
  b.box(x,y-h*.18,z+.12,w,.055,.055,C.frame,29);
 }
 block('north-low',[-5,-5,24,16.25],0,heights.low,C.stone);
 block('north-main',[24,-5,75,16.25],0,heights.main);
 block('south-low-core',[-5,45.3,56.65,65.5],0,heights.low,C.brick);
 block('south-front-west',[-5,65.5,9.5,70],0,heights.low,C.stone);
 block('south-colonnade-lintel',[9.5,65.5,49.5,70],7.4,heights.low,C.stone);
 block('south-front-east',[49.5,65.5,56.65,70],0,heights.low,C.stone);
 block('east-core',[28,16.25,69,45.3],0,heights.main);
 block('east-core-south',[56.65,45.3,69,70],0,heights.main);
 block('east-front-north',[69,16.25,75,24],0,heights.main);
 block('east-entry-lintel',[69,24,75,37],7.6,heights.main);
 block('east-front-south',[69,37,75,70],0,heights.main);
 const bridge=block('glass-bridge',[0,16.25,28,45.3],heights.bridgeBase,heights.bridgeTop,C.glass);
 // The north/east roof legs are observed; south and far-west roofs remain flat.
 // A connected L hip is restricted to the two high bars, never across the mapped court.
 const q=[[24.5,-1.6],[72.1,-1.6],[72.1,67.4],[59.2,67.4],[59.2,14.8],[24.5,14.8]],v=(p,y)=>{const w=world(...p);return[w[0],y,w[1]];},e=q.map(p=>v(p,19.2));
 const elbow=v([65.65,6.6],22.1),west=v([32.0,6.6],22.1),south=v([65.65,59.5],22.1),roof=new G.Geometry();
 roof.quad(e[0],e[1],elbow,west);roof.quad(e[1],e[2],south,elbow);roof.tri(e[2],e[3],south);roof.quad(e[3],e[4],elbow,south);roof.quad(e[4],e[5],west,elbow);roof.tri(e[5],e[0],west);
 add('007-main-L-roof',roof,C.roof,2,id);
 const bridgeRoof=new G.Geometry();for(const p of bridge)for(let i=1;i<p.length-1;i++)bridgeRoof.tri(...[p[0],p[i],p[i+1]].map(p=>v(p,8.0+.55*Math.max(0,1-Math.abs(p[0]-25.1)/2.7))));
 add('007-sloped-glass-bridge-roof',bridgeRoof,C.glass,28,id);
 // Bridge glazing spans the actual narrow map strip. Its ground storey is open.
 for(const u of [22.74,27.50])frame(u,16.4,u<25?-Math.PI/2:Math.PI/2,()=>{
  const sign=u<25?1:-1;for(let j=0;j<15;j++){const x=sign*(.8+j*1.88);b.box(x,6.1,.035,.065,3.5,.10,C.frame,29);}
  b.box(sign*14.4,5.0,.03,28.8,.10,.10,C.frame,29);b.box(sign*14.4,7.6,.03,28.8,.09,.1,C.frame,29);
 });
 for(const vv of [18.7,42.7])frame(25.1,vv,0,()=>b.box(0,2.15,0,.55,4.3,.55,C.stone,24));
 // Western low-wing courtyard windows: broad groups with stone waist bands, three floors.
 for(const [u,vv] of [[0,13.93],[11.94,16.23]])frame(u,vv,0,()=>{for(let j=0;j<3;j++){for(let i=0;i<2;i++)win(2.8+i*5.4,2+j*3.8,4.3,2.35);b.box(5.8,3.8*(j+1)-.12,.04,11.6,.24,.24,C.stone,24);}});
 frame(22.5,45.6,Math.PI,()=>{for(let j=0;j<3;j++){for(let i=0;i<4;i++)win(2.2+i*5.5,2+j*3.8,4.45,2.35);b.box(11.4,3.8*(j+1)-.12,.02,23,.24,.24,C.stone,24);}});
 // Continue the photographed three-storey stone/window vocabulary BEHIND the bridge.
 // Use the actual inner edges: approximating v=16/45 buried the panes or crossed the returns.
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(len));}
 function courtWindows(len,high=false){
  b.box(len/2,5.7,.055,len-.10,11.4,.14,C.stone,24);
  const n=Math.max(1,Math.floor(len/4.8)),step=(len-1.3)/n,w=Math.min(4.1,step-.6);
  for(let j=0;j<3;j++){
   for(let i=0;i<n;i++)win(.65+(i+.5)*step,2+j*3.8,w,2.35);
   b.box(len/2,3.8*(j+1)-.12,.08,len-.12,.24,.18,C.stone,24);
  }
  if(high){
   // These upper rows are restrained fitting; the photos do not establish their complete count.
   b.box(len/2,17.1,.055,len-.10,3.8,.14,C.stone,24);
   for(let i=0;i<n;i++){const x=.65+(i+.5)*step;win(x,13.45,Math.min(1.65,w),1.45);win(x,17.2,Math.min(2.3,w),1.8);}
  }
 }
 const inner=F.polygons(f.geometry)[0][1],sourceOuter=F.polygons(f.geometry)[0][0];
 boundary(inner[0],inner[5],len=>courtWindows(len,true));
 boundary(inner[2],inner[1],len=>courtWindows(len));
 // The two small eastern inner returns have no complete photograph: narrow fitted panes only.
 for(const [a,c] of [[inner[3],inner[2]],[inner[4],inner[3]]])boundary(a,c,len=>{
  for(let j=0;j<5;j++)win(len/2,2+j*3.8,Math.min(.9,len-.9),1.65);
 });
 function quietEnd(a,c,floors=3){boundary(a,c,len=>{
  const n=Math.max(1,Math.floor(len/4.3)),step=(len-.8)/n;
  if(floors===5)b.box(len/2,17.1,.055,len-.1,3.8,.14,C.stone,24);
  for(let i=0;i<n;i++)for(let j=0;j<floors;j++)win(.4+(i+.5)*step,2+j*3.8,Math.min(2.5,step-.6),2.0);
 });}
 // Low western end faces; their conservative windows are not copied entrance designs.
 quietEnd(sourceOuter[0],sourceOuter[23]);
 quietEnd(sourceOuter[18],sourceOuter[17]);
 // Follow the slightly sloping southern source edge, splitting at the real height change.
 function southAt(u){const a=sourceOuter[15],c=sourceOuter[14],aa=local(a),cc=local(c),t=(u-aa[0])/(cc[0]-aa[0]);return[a[0]+t*(c[0]-a[0]),a[1]+t*(c[1]-a[1])];}
 quietEnd(southAt(1.7),southAt(9.25));
 quietEnd(southAt(49.75),southAt(56.4));
 quietEnd(southAt(56.9),southAt(73.05),5);
 // High/low junctions expose two upper storeys to the west; panes start above the low roof.
 for(const [u,v0,v1] of [[24,-2.9,16.15],[56.65,45.55,68.45]])boundary(world(u,v0),world(u,v1),len=>{
  b.box(len/2,17.1,.055,len-.1,3.8,.14,C.stone,24);
  const n=Math.max(1,Math.floor(len/4.3)),step=(len-.8)/n;
  for(let i=0;i<n;i++){const x=.4+(i+.5)*step;win(x,13.45,2.1,1.9);win(x,17.2,2.3,1.8);}
 });
 // West court hall: shallow stone skin, tall central glazing, ATTACHED round pilasters.
 frame(56.45,29.6,-Math.PI/2,()=>{
  b.box(0,5.7,-.24,25.6,11.4,.42,C.stone,24);
  // The west photograph separates grey fourth-storey brick from the pale fifth-storey band.
  b.box(0,17.1,-.24,25.6,3.8,.42,C.stone,24);
  for(const x of [-6.0,6.0])b.cyl(x,.12,-.10,.42,11.15,C.stone,20,1,24);
  win(0,2.1,4.9,3.6,.04);for(const x of [-9,-4.7,4.7,9])win(x,2.2,2.2,2.9,.04);
  win(0,7.65,4.8,5.6,.04);for(const x of [-4.35,4.35])win(x,7.65,2.2,5.6,.04);
  for(const x of [-10.2,10.2])for(const yy of [5.9,9.3])win(x,yy,.85,1.3,.04);
  for(let j=0;j<11;j++)win(-12.5+j*2.5,17.2,1.9,1.8,.02);
  for(let j=0;j<10;j++)win(-11.5+j*2.5,13.5,1.1,1.15,.02);
 });
 // East entrance: independent TWO heavy round columns, recessed doors, sign and open forecourt.
 frame(73.20,30.5,Math.PI/2,()=>{
  for(const x of [-4.8,4.8]){b.cyl(x,.28,-.25,.70,7.1,C.stone,24,1,24);b.cyl(x,.28,-.25,.79,.42,C.stone,24,1,24);}
  for(const yy of [6.55,7.55])b.box(0,yy,-.05,12.8,.55,1.35,C.stone,24);
  win(0,2.25,7.4,3.7,-4.02);b.box(0,4.72,-3.94,7.9,1.12,.16,'#bdac77',24);
  if(b.lettering)b.lettering('光华管理学院',0,4.74,-3.82,7.4,.76,0,'#61482e');
  for(let j=0;j<3;j++)b.box(0,.10+j*.11,1.0-j*.40,12.5,.19,.85,C.stone,10);
 });
 // South outer wing: two-storey square-column portico, not a one-storey canopy.
 // The colonnade lies just within the mapped southern strip; its recessed wall remains visible.
 frame(29,68.2,0,()=>{
  b.box(0,7.65,-1.05,39,.65,2.6,C.stone,24);
  for(let i=0;i<7;i++)b.box(-18+i*6,3.7,-.12,1.05,7.4,1.10,C.stone,24);
  for(let j=0;j<2;j++)for(let i=0;i<6;i++)win(-15+i*6,2.1+j*3.7,3.4,2.65,-2.36);
  b.box(0,3.9,-2.3,38,.3,.18,C.stone,24);
  for(let i=0;i<8;i++)win(-18+i*5.1,9.65,2.4,1.8,.46);
 });
 // Restrained unobserved north/east window rhythms. Counts are fitting, not an elevation survey.
 const outer=F.polygons(f.geometry)[0][0].map(local);
 for(let i=1;i<outer.length;i++){const a=outer[i-1],c=outer[i];if(Math.max(a[1],c[1])>.5||c[0]-a[0]<3)continue;const len=c[0]-a[0],n=Math.max(1,Math.floor(len/4));
  frame(c[0],(a[1]+c[1])/2,Math.PI,()=>{for(let k=0;k<n;k++){const x=(k+.5)*len/n,floors=c[0]-x<24?3:5;for(let j=0;j<floors;j++)win(x,2+j*3.8,Math.min(2.3,len/n*.7),2);}});
 }
 frame(73.35,67.0,Math.PI/2,()=>{
  for(let i=0;i<13;i++){const vv=67-(i+.5)*4.9;for(let j=0;j<5;j++){if(vv>23&&vv<38&&j<2)continue;win((i+.5)*4.9,2+j*3.8,2.3,2.0);}}
 });
 // 8m × 3.3m from the photographed stone plaque; irregular outline, fitted depth 2.3m.
 frame(9.7,30.5,-Math.PI/2,()=>{
  const profile=[[-4,0],[-3.9,1.5],[-3.1,2.75],[-1.2,3.3],[1.2,3.12],[3.15,2.6],[4,.15]],g=new G.Geometry();
  for(const side of [-1,1])for(let i=1;i<profile.length-1;i++)g.tri(...[profile[0],profile[i],profile[i+1]].map(([x,y])=>[x,y,side*1.15]));
  for(let i=0;i<profile.length;i++){const a=profile[i],c=profile[(i+1)%profile.length];g.quad([a[0],a[1],-1.15],[c[0],c[1],-1.15],[c[0],c[1],1.15],[a[0],a[1],1.15]);}
  b.mesh('007-gandang-stone',g,0,.04,0,1,1,1,C.rock,10);
  if(b.lettering){b.lettering('敢',-1.55,2.05,1.18,1.0,.85,0,'#c4a850');b.lettering('当',-1.55,1.12,1.18,1.0,.85,0,'#c4a850');}
 });
 return {strategy:'building007-v46',floors:5,lowFloors:3,bridgeBase:4.3,sourceOutline:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building007={id:ID,render,world,local,pieces,heights};
})(YY);
