/* 109: west wing of the three-part roof group north of Caizhai. The source
 * polygon and shared east boundary are retained. North elevation and
 * courtyard-side openings remain unverified; no entrance is invented. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009052002';
const O=[-202.373,-308.887],R=.01193303606916781,C=Math.cos(R),S=Math.sin(R),W=11.145793556315295,D=16.85615;
const local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const H={base:.12,eave:7,ridge:10},P={wall:'#e3e3d7',stone:'#b9bdb3',wood:'#865042',dark:'#435652',roof:'#67736d',tile:'#859088',red:'#984c3c'};
function render(b,f){b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'109-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,color,mat=24)=>b.mesh('109-'+name,g,0,0,0,1,1,1,color,mat);
 function wall(name,a,c,holes=[]){const w=Math.hypot(c[0]-a[0],c[1]-a[1]);b.local(a[0],0,a[1],-Math.atan2(c[1]-a[1],c[0]-a[0]),()=>{
  const ys=[H.base,7,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b).filter((x,i,a)=>!i||x!==a[i-1]);group(name,()=>{for(let j=1;j<ys.length;j++){const lo=ys[j-1],hi=ys[j],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.x-b.x);let prev=0;for(const q of [...cuts,{x:w,w:0}]){const end=q.x-q.w/2;if(end>prev)b.box((prev+end)/2,(lo+hi)/2,-.15,end-prev,hi-lo,.30,P.wall,24);prev=q.x+q.w/2;}}
   b.box(w/2,.47,-.035,w,.70,.26,P.stone,24);
   for(const q of holes){const cy=(q.lo+q.hi)/2,hh=q.hi-q.lo;b.box(q.x,cy,-.055,q.w,hh,.07,P.dark,5);for(const x of [q.x-q.w/2,q.x,q.x+q.w/2])b.box(x,cy,.03,.085,hh+.10,.15,P.wood,6);for(const y of[q.lo,q.lo+.38,q.hi-.35,q.hi])b.box(q.x,y,.03,q.w+.10,.085,.15,P.wood,6);b.box(q.x,q.lo-.10,.04,q.w+.22,.12,.26,P.stone,24);}
  });});}
 b.local(O[0],0,O[1],R,()=>{
  mesh('original-base',G.polygon(poly,H.base),P.stone);mesh('ceiling',G.polygon(poly,H.eave-.10),P.wall);
  // South two-by-two openings are a scale fit to the actual west-wing view
  // in 7zvHO6x3pFE frame 1. West openings are only partially observed in meipian-23 and their
  // three-bay arrangement is an explicit fit. North remains unresolved.
  const southWidth=Math.hypot(poly[2][0]-poly[1][0],poly[2][1]-poly[1][1]);
  wall('south',poly[1],poly[2],[.30,.70].flatMap(q=>[{x:southWidth*q,w:1.82,lo:1.10,hi:3.06},{x:southWidth*q,w:1.82,lo:4.38,hi:6.42}]));
  wall('west-partially-observed',poly[0],poly[1],[.20,.50,.80].flatMap(q=>[{x:D*q,w:1.82,lo:1.10,hi:3.06},{x:D*q,w:1.82,lo:4.38,hi:6.42}]));wall('north-unverified',poly[4],poly[0]);
  group('corner-posts',()=>{for(const q of[poly[0],poly[1],poly[2]]){b.box(q[0],3.91,q[1],.26,6.18,.26,P.red,6);for(const h of[3.4,6.6])b.box(q[0],h,q[1],.28,.09,.28,'#b7a476',6);}});
  // East is entirely shared with 111 in OSM. Only a closure mesh is emitted,
  // with no duplicated exterior opening, plinth, eave fascia or doorway.
  const shared=new G.Geometry();for(const [a,c]of[[poly[2],poly[3]],[poly[3],poly[4]]])shared.quad([a[0],.12,a[1]],[c[0],.12,c[1]],[c[0],7,c[1]],[a[0],7,a[1]]);mesh('shared-east-closure',shared,P.wall,24);
  const cut=.23,half=W/2+.40,cx=W/2,roof=new G.Geometry(),tiles=new G.Geometry(),gable=new G.Geometry();
  const end=t=>.60-1.35*Math.min(1,t/cut),y=t=>H.eave+3*Math.pow(t,1.4),pt=(side,t,u)=>[cx+side*half*(1-t),y(t),-end(t)+(D+2*end(t))*u];
  function patch(g,side,t0,t1,u0,u1,dy=0){const a=[pt(side,t0,u0),pt(side,t0,u1),pt(side,t1,u1),pt(side,t1,u0)].map(q=>[q[0],q[1]+dy,q[2]]);if(side>0)a.reverse();g.quad(...a);}
  for(const side of[-1,1])for(let j=0;j<18;j++){const t0=j/18,t1=(j+1)/18;patch(roof,side,t0,t1,0,1);for(let z=.07;z<D-.02;z+=.24){const u=z/D;patch(tiles,side,t0,t1,u,Math.min(1,u+.055/D),.038);}}
  for(const south of[false,true]){
   for(let j=0;j<8;j++){const a=cut*j/8,c=cut*(j+1)/8,z=t=>south?D+end(t):-end(t);const ps=[[-half*(1-a)+cx,y(a),z(a)],[half*(1-a)+cx,y(a),z(a)],[half*(1-c)+cx,y(c),z(c)],[-half*(1-c)+cx,y(c),z(c)]];if(!south)ps.reverse();roof.quad(...ps);}
   const z=south?D-.75:.75;const a=[cx-half*(1-cut),y(cut),z],c=[cx+half*(1-cut),y(cut),z],top=[cx,10,z];if(south)gable.tri(a,c,top);else gable.tri(c,a,top);
  }
  mesh('north-south-curved-roof',roof,P.roof,2);tiles.detailWidth=.055;mesh('roof-tile-ribs',tiles,P.tile,2);mesh('red-gables',gable,P.red,6);
  group('roof-trim',()=>{b.box(cx,10.08,D/2,.28,.18,D-1.25,P.tile,2);for(const z of[.75,D-.75]){b.beam([cx-half*(1-cut),y(cut),z],[cx,10,z],.12,P.stone,24);b.beam([cx,10,z],[cx+half*(1-cut),y(cut),z],.12,P.stone,24);}b.box(-.32,6.83,D/2,.25,.28,D+.8,P.wood,6);});
  // Visible green/blue paint bands and pale rafter ends on the western eave
  // are fitted from meipian-23. Individual carved motifs remain unresolved.
  group('visible-eave-paint',()=>{
   b.box(-.34,6.68,D/2,.27,.13,D+.5,'#456b52',6);b.box(-.38,6.57,D/2,.29,.09,D+.5,'#647d83',6);
   for(let z=.60;z<D-.30;z+=.42)b.box(-.42,6.92,z,.45,.11,.17,'#c4bd99',6);
   for(const x of[0,W]){b.box(x,6.52,D-.08,.49,.22,.54,'#476a50',6);b.box(x,6.72,D+.03,.64,.15,.70,'#739083',6);b.box(x,6.86,D+.10,.81,.13,.82,'#93634a',6);b.box(x,6.45,D+.19,.29,.20,.16,'#497c80',6);}
  });
 });return{id:ID,strategy:'building109-v46',floors:2,eaveHeight:7,ridgeHeight:10,originalOutline:true,sharedEastBoundary:true,roofAxis:'north-south',entranceVerified:false,allFacadesVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building109={id:ID,render,local,width:W,depth:D,heights:H};
})(YY);
