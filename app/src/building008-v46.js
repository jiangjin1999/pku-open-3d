/* Lui Che Woo Building: officially captioned views, two roof bars and a sunken court. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/13259482';
const R=Math.atan2(3.609,66.384),CO=Math.cos(R),SI=Math.sin(R),O=[222.409,55.384];
const C={brick:'#777c7a',stone:'#d7d8ce',glass:'#698a99',frame:'#424f53',roof:'#6b7474',wood:'#94745a'};
const H={floor:-3.8,brick:18,eave:22,ridge:24.4,platform:18.2};
const ring=[[242.581,82.132],[254.947,81.488],[256.177,83.676],[261.131,81.166],[267.323,80.844],[268.091,95.645],[255.306,96.3],[253.94,93.869],[248.85,96.633],[243.35,96.922],[242.581,82.132]];
// Preserve the mapped court; excavation also reaches the photographed west undercroft.
const groundCut={id:ID,pickId:19,ring,floor:H.floor,geometry:{type:'Polygon',coordinates:[ring]}};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO];
const local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const westNorth=local(ring[0]),westSouth=local(ring[9]);
const recessRing=[ring[0],ring[9],world(15,westSouth[1]),world(15,westNorth[1]),ring[0]];
groundCut.excavationRing=[...ring.slice(0,10),world(15,westSouth[1]),world(15,westNorth[1]),ring[0]];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,bi=greater?b[axis]>=k:b[axis]<=k;if(ai)out.push(a);if(ai!==bi){const t=(k-a[axis])/(b[axis]-a[axis]);out.push(a.map((x,j)=>x+t*(b[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){
 const id=f.properties.pickId;b.id=id;
 function block(name,box,base,top,color=C.brick){
  const ps=pieces(f,box),mesh=new G.Geometry(),cap=new G.Geometry();
  for(const p of ps){for(let i=0;i<p.length;i++){const a=world(...p[i]),c=world(...p[(i+1)%p.length]);mesh.quad([a[0],base,a[1]],[c[0],base,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]);}
   for(let i=1;i<p.length-1;i++){const vs=[p[0],p[i],p[i+1]].map(p=>{const w=world(...p);return [w[0],top,w[1]];});cap.tri(...vs);if(base>H.floor)mesh.tri(...vs.map(v=>[v[0],base,v[2]]).reverse());}
  }
  add('008-'+name,mesh,color,color===C.glass?28:24,id);add('008-'+name+'-cap',cap,C.roof,22,id);
 }
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function win(x,y,w,h,z=.05){b.box(x,y,z,w+.12,h+.10,.09,C.frame,29);b.box(x,y,z+.065,w,h,.028,C.glass,28);if(w>1.2)b.box(x,y,z+.09,.055,h,.04,C.frame,29);b.box(x,y+h*.25,z+.09,w,.06,.04,C.frame,29);}
 function glass(w,base,top,z=0){b.box(w/2,(top+base)/2,z,w,top-base,.10,C.glass,28);for(let x=0;x<=w;x+=2.1)b.box(x,(top+base)/2,z+.08,.055,top-base,.08,C.frame,29);for(let y=base+.04;y<=top-.03;y+=2.2)b.box(w/2,y,z+.09,w,.06,.09,C.frame,29);}
 for(const [name,lo,hi] of [['north',-1,23],['south',47.2,71]]){block(name+'-brick',[-1,lo,68,hi],H.floor,H.brick);block(name+'-top',[-1,lo,68,hi],H.brick,H.eave,C.stone);}
 block('east-glass-connection',[19,23,68,47.2],H.floor,H.platform,C.glass);
 block('west-core',[7.8,23,15,47.2],H.floor,H.platform,C.glass);
 block('court-west-upper',[15,23,19,47.2],.6,H.platform,C.glass);
 block('court-west-north-support',[15,23,19,27.75],H.floor,.6,C.stone);
 block('court-west-south-support',[15,42.7,19,47.2],H.floor,.6,C.stone);
 block('court-central-support',[16,34,19,36.6],H.floor,.6,C.stone);
 block('west-brick-screen',[-1,28,7.8,42],H.floor,17.8);
 // Gallery slots have slabs and railings, never a full-height front wall.
 for(const [a,c] of [[23,28],[42,47.2]]){
  for(const y of [.6,5.0,9.4,13.8,18.2])block('west-gallery-'+a+'-'+y,[-1,a,7.8,c],y-.20,y,C.stone);
  frame(7.8,a,-Math.PI/2,()=>glass(c-a,H.floor,18.2));
  frame(1.8,a,-Math.PI/2,()=>{for(const y of [.6,5,9.4,13.8]){b.box((c-a)/2,y+.95,0,c-a,.06,.07,C.frame,29);for(let x=.3;x<c-a;x+=.75)b.box(x,y+.48,0,.045,.95,.055,C.frame,29);}});
 }
 // Two parallel planar hipped roofs, without curved eaves or ceremonial finials.
 for(const [name,u,v,w,d] of [['north',33.24,11.50,67.5,24.2],['south',33.12,58.52,66.7,23.9]])frame(u,v,0,()=>{
  b.mesh('008-hip-'+name,b.geo('008-hip',()=>{const g=new G.Geometry(),a=[-.5,0,-.5],c=[.5,0,-.5],d=[.5,0,.5],e=[-.5,0,.5],l=[-.36,1,0],r=[.36,1,0];g.quad(l,r,c,a);g.tri(r,d,c);g.quad(r,l,e,d);g.tri(l,a,e);return g;}),0,H.eave,0,w,H.ridge-H.eave,d,C.roof,2);
  b.box(0,H.eave-.16,0,w,.32,d,C.stone,24);
 });
 // Three equipment assemblies sit on the lower west platform, not over the courtyard.
 for(const vv of [28.9,35.0,41.1])frame(11.6,vv,0,()=>{
  for(const x of [-1.5,1.5])b.box(x,18.65,0,.16,.9,2.7,C.frame,29);
  b.box(0,20.1,0,4.2,2.1,2.7,'#a7b0b0',29);b.box(0,19.55,-1.38,3.8,.7,.12,C.frame,29);
  for(let j=0;j<5;j++)b.box(0,19.9+j*.22,1.38,3.8,.08,.08,'#6d8289',29);
 });
 frame(15.5,24.8,0,()=>{b.box(0,18.9,0,2.2,1.4,1.9,'#bdc4bf',29);b.box(2.1,18.55,0,2.0,.6,.9,'#b4bdbb',29);});
 // EAST main front is glass, with suspended flat glass canopy and short straight steps.
 frame(64.46,47.1,Math.PI/2,()=>{
  glass(24.0,.5,18.2);const x=12;
  b.box(x,5.3,1.5,8.8,.14,3.3,C.glass,28);for(const xx of [x-4.0,x+4.0]){b.beam([xx,5.32,2.9],[xx,8.2,.05],.045,C.frame,29);b.box(xx,5.3,1.5,.12,.18,3.3,C.frame,29);}
  for(let j=0;j<5;j++)b.box(x,.08+j*.11,2.8-j*.4,7.8,.16,1.0,C.stone,10);
  win(x,2.2,6.5,3.4,.13);
 });
 // WEST central screen: ten narrow vertical slots; no east entrance copied here.
 frame(1.79,28,-Math.PI/2,()=>{for(let i=0;i<10;i++)win(.95+i*1.34,8.9,.42,15.6,.06);});
 // End faces of both long wings: central wide vertical glazing and four narrow side strips.
 for(const [u,v,len,r] of [[.02,0,22.6,-Math.PI/2],[66.47,23,23,Math.PI/2],[.43,47.2,22.6,-Math.PI/2],[65.83,69.8,22.6,Math.PI/2]])frame(u,v,r,()=>{
  win(len/2,8.4,2.15,15.2);for(const d of [-5.1,-3.4,3.4,5.1]){win(len/2+d,6.7,.67,11.2);win(len/2+d,15.3,.67,2.3);}
  for(let i=0;i<3;i++){win((i+.5)*len/3,20,Math.min(5.8,len/3-.85),3.2);if(i)b.box(i*len/3,20,-.04,.55,4,.32,C.stone,24);}
 });
 // SOUTH twelve visible axes: bottom windows, two-storey vertical groups + louvres,
 // independent rectangle row, then broad top-floor windows between pale columns.
 frame(.6,69.84,0,()=>{
  for(let i=0;i<12;i++){const x=2.7+i*5.4;win(x,2.0,3.25,3.1);win(x,8.8,3.25,9.7);win(x,15.55,3.25,2.8);win(x,20,4.4,3.25);
   b.box(x,8.5,.18,3.3,.90,.12,'#929c99',29);for(let k=0;k<7;k++)b.box(x,8.15+k*.115,.26,3.3,.045,.045,'#586663',29);
   if(i<11)b.box(x+2.7,20,-.08,.6,4,.42,C.stone,24);
  }
  if(b.lettering)b.lettering('吕志和楼  LUI CHE WOO BUILDING',32.3,17.6,.12,31.0,.84,0,'#dce0d8');
 });
 // NORTH evidence is an oblique partial photo: same vocabulary, deliberately unverified count.
 frame(66.1,0,Math.PI,()=>{for(let i=0;i<11;i++){const x=3.0+i*5.95;win(x,2.0,3.0,3.1);win(x,8.8,3.0,9.7);win(x,15.55,3.0,2.8);win(x,20,4.6,3.25);b.box(x,8.5,.15,3.05,.85,.12,'#929c99',29);}});
 // Court skins follow EVERY original angled segment. Five visible bands are not floor labels.
 for(let i=1;i<ring.length;i++){
  const a=ring[i-1],c=ring[i],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),west=local(a)[0]<19&&local(c)[0]<19;
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{
   for(let j=0;j<5;j++){const y=H.floor+j*4.4;if(west&&j===0)continue;
    b.box(len/2,y+.30,.04,len,.60,.16,C.stone,24);const n=Math.max(1,Math.floor(len/1.7));for(let k=0;k<n;k++)win((k+.5)*len/n,y+2.35,len/n-.11,3.25,.05);
   }
   b.box(len/2,18.0,.04,len,.4,.16,C.stone,24);
  });
 }
 // Sunken floor follows the exact hole; no lid is added at the old ground level.
 add('008-court-grass-floor',F.surface(groundCut.geometry,H.floor),'#727e59',3,id);
 add('008-undercroft-floor',F.surface({type:'Polygon',coordinates:[recessRing]},H.floor),'#aaa99c',10,id);
 for(const [u,v,w,d] of [[24.0,35.3,5.8,5.2],[37.8,35.0,5.4,5.8]])frame(u,v,0,()=>{
  b.box(0,H.floor+.09,0,w,.18,d,C.wood,6);for(let x=-w/2+.2;x<w/2;x+=.24)b.box(x,H.floor+.19,0,.035,.025,d,'#78634e',6);
 });
 const path=new G.Geometry();for(let j=0;j<20;j++){
  const p=t=>{const u=20.2+22*t,v=35.1+1.8*Math.sin(t*Math.PI*2);return [u,v];},a=p(j/20),c=p((j+1)/20),dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),n=[-dz/l*.45,dx/l*.45];
  path.quad(...[[a[0]+n[0],a[1]+n[1]],[c[0]+n[0],c[1]+n[1]],[c[0]-n[0],c[1]-n[1]],[a[0]-n[0],a[1]-n[1]]].map(p=>{const w=world(...p);return[w[0],H.floor+.025,w[1]];}));
 }
 add('008-court-curved-path',path,'#c1bfb0',10,id);
 return {strategy:'building008-v46',visibleBands:5,officialStoreysUnresolved:true,courtFloor:H.floor,groundCutRequired:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building008={id:ID,render,world,local,pieces,heights:H,groundCut};
})(YY);
