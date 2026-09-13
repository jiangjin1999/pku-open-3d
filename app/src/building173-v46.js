/* 127, Chengze residential court. Three storeys, T footprint and short red
 * perimeter roof slopes from the identifiable 2024 square photograph.
 * Unseen south/east openings are intentionally left unverified. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/916931886',O=[-967.412,21.596],R=Math.atan2(.255,19.438),C=Math.cos(R),S=Math.sin(R),H=9.65;
const local=q=>[(q[0]-O[0])*C-(q[1]-O[1])*S,(q[0]-O[0])*S+(q[1]-O[1])*C];
const K={wall:'#dfdfd8',base:'#b7b6ab',glass:'#75968b',white:'#e9ebe3',red:'#a46a5a',dark:'#485e56',cap:'#66695f'};
function render(b,f){b.id=f.properties.pickId;const p=f.geometry.coordinates[0].slice(0,-1).map(local),old=b.e.add;b.e.add=function(k,...a){return old.call(this,'173-'+k,...a);};
 const mesh=(k,g,col,mat=24)=>b.mesh(k,g,0,0,0,1,1,1,col,mat);
 function window(x,y,w,h,z=0){b.box(x,y,z-.045,w,h,.045,K.glass,5);for(const dx of[-w/2,0,w/2])b.box(x+dx,y,z-.08,.055,h+.09,.07,K.white,24);for(const dy of[-h/2,h/2])b.box(x,y+dy,z-.08,w+.10,.055,.07,K.white,24);}
 function roofInset(q,d){let area=0;for(let i=0;i<q.length;i++)area+=q[i][0]*q[(i+1)%q.length][1]-q[(i+1)%q.length][0]*q[i][1];const sign=Math.sign(area);const lines=q.map((a,i)=>{const c=q[(i+1)%q.length],v=[c[0]-a[0],c[1]-a[1]],l=Math.hypot(...v);return{a:[a[0]-sign*v[1]*d/l,a[1]+sign*v[0]*d/l],v};});return q.map((_,i)=>{const a=lines[(i+q.length-1)%q.length],c=lines[i],cross=(x,y)=>x[0]*y[1]-x[1]*y[0],v=[c.a[0]-a.a[0],c.a[1]-a.a[1]],t=cross(v,c.v)/cross(a.v,c.v);return[a.a[0]+a.v[0]*t,a.a[1]+a.v[1]*t];});}
 try{b.local(O[0],0,O[1],R,()=>{
  const walls=new G.Geometry();for(let i=0;i<p.length;i++){const a=p[i],q=p[(i+1)%p.length];walls.quad([a[0],.04,a[1]],[q[0],.04,q[1]],[q[0],H,q[1]],[a[0],H,a[1]]);}
  mesh('original-T-walls',walls,K.wall);mesh('base',G.polygon(p,.08),K.base);
  const inside=roofInset(p,.92),roof=new G.Geometry();for(let i=0;i<p.length;i++){const j=(i+1)%p.length,a=p[i],q=p[j],c=inside[j],d=inside[i];roof.quad([a[0],H,a[1]],[q[0],H,q[1]],[c[0],H+.80,c[1]],[d[0],H+.80,d[1]]);b.beam([a[0],H-.18,a[1]],[q[0],H-.18,q[1]],.19,K.base,24);b.beam([d[0],H+.82,d[1]],[c[0],H+.82,c[1]],.095,K.cap,24);}
  mesh('short-red-perimeter-slopes',roof,K.red,2);mesh('flat-roof-centre',G.polygon(inside,H+.80),K.cap,2);
  // North wall visible at left in the numbered 127 photograph; windows are
  // fitted to its photographed paired groups, not survey coordinates.
  for(let floor=0;floor<3;floor++)for(const x of[2.05,3.35,6.2,7.5,11.85,13.15,16.35,17.65])window(x,1.95+floor*3.05,.90,1.72);
  for(const y of[.70,3.35,6.40])b.box(9.72,y,-.018,19.44,.055,.07,K.base,24);
  // Recessed northern entrance with low round arch, visible behind the board.
  b.box(9.65,1.17,-.075,1.72,2.28,.07,K.dark,6);const arch=new G.Geometry();for(let i=0;i<24;i++){const a=Math.PI*i/24,q=Math.PI*(i+1)/24;arch.quad([9.65+.86*Math.cos(a),1.72+.86*Math.sin(a),-.13],[9.65+1.05*Math.cos(a),1.72+1.05*Math.sin(a),-.13],[9.65+1.05*Math.cos(q),1.72+1.05*Math.sin(q),-.13],[9.65+.86*Math.cos(q),1.72+.86*Math.sin(q),-.13]);}mesh('north-entry-arch',arch,K.base);
  for(const x of[8.70,10.60])b.box(x,.90,-.12,.17,1.65,.12,K.base,24);
  // The photograph places the red glazed strip immediately around the
  // north-west bar corner, ahead of the blank wall carrying the 127 number.
  // It is not on the recessed southern stem.
  b.local(p[0][0],0,p[0][1],Math.PI/2,()=>{for(let floor=0;floor<3;floor++){window(-1.65,2.05+floor*3.05,2.70,1.70,-.18);if(floor<2)b.box(-1.65,3.21+floor*3.05,-.20,2.82,.56,.11,K.red,24);}});
 });}finally{b.e.add=old;}
 return{id:ID,strategy:'building173-v46',floors:3,originalTOutline:true,shortPerimeterSlope:true,northPhotoNumberReadable:127,heightMeasured:false,allFacadesVerified:false,limits:'OSM house 127 and official numbered photograph. Three floors and short red roof edges; dimensions fitted. Southern/eastern openings and roof drainage details unresolved.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building173={id:ID,render,local};})(YY);
