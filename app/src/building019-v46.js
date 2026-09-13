/* Dormitories 38/39: official first/2-6F plans, three mapped roof bars. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825539';
const O=[-189.870,674.301],R=Math.atan2(2.409,57.135),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#a4aba2',frame:'#ccd1c6',glass:'#657b78',roof:'#7b847d',tile:'#969e93',stone:'#a8afa5',door:'#526762'};
const H={floor:3.1,wall:18.6,eave:18.78,ridge:22.6},entrances=[{number:38,u:28.632,v:24.10},{number:39,u:28.636,v:46.70}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'019-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('019-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'38-north',box:[0,0,57.186,18.503],axis:0,rise:3.82},{name:'39-south',box:[-9.35,51.861,56.406,69.387],axis:0,rise:3.82},{name:'central-connector',box:[28.638,19.63,47.205,50.50],axis:1,rise:3.30}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('019-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('019-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 // Room boundaries are taken from the north-arrowed plans; exact metre widths remain footprint-fitted.
 const map38=x=>(x-166)/(1424-166)*57.186,map39=x=>-9.35+(x-165)/(1480-165)*(56.406+9.35);
 const cells=xs=>xs.slice(1).map((x,i)=>[xs[i],x]);
 const north38=cells([166,240,315,390,463,537,611,685,759,833,905,980,1050,1127,1200,1274,1347,1424].map(map38));
 const south38=cells([166,242,315,390,463,537,611,685,759,832,905,980,1050,1127,1200,1274,1347,1424].map(map38));
 const north39=cells([165,232,298,364,429,495,562,628,693,759,825,891,956,1022,1088,1155,1220,1286,1350,1416,1480].map(map39));
 const south39=cells([165,232,298,364,429,495,562,628,693,759,825,891,956,1022,1088,1155,1220,1286,1350,1416,1480].map(map39));
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv);let face='minor-return',source=[];
  if(horizontal&&Math.abs(la[1])<.1){face='38-north';source=north38;}
  else if(horizontal&&la[1]>17.8&&la[1]<18.6){face='38-south';source=south38;}
  else if(horizontal&&la[1]>51.7&&la[1]<52.2){face='39-north';source=north39;}
  else if(horizontal&&la[1]>69.2){face='39-south';source=south39;}
  else if(!horizontal&&la[0]>28&&la[0]<48&&Math.min(la[1],lc[1])>17){face=la[0]<35?'connector-west':'connector-east';source=cells([18.02,21.5,25.4,29.0,32.7,36.0,39.7,43.4,47.1,51.86]);}
  else if(!horizontal&&len>10){face=la[1]<20?'38-end':'39-end';source=cells([Math.min(la[1],lc[1]),(la[1]+lc[1])/2,Math.max(la[1],lc[1])]);}
  const positions=source.map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len;return[Math.min(t0,t1)+.16,Math.max(t0,t1)-.16];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    if(face==='connector-west'&&floor===0)for(const door of entrances){const x=(door.v-la[1])/dv*len;if(x>1.5&&x<len-1.5){openings=openings.filter(q=>q.e<x-1.35||q.s>x+1.35);openings.push({s:x-1.2,e:x+1.2,bottom:.60,top:2.86,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:.55;
     // Returns and recessed glazing form real apertures, without extruded continuous corridors.
     for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [q.bottom,q.top])b.box(x,yy,-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.05,x,q.e-.05])b.box(xx,y,-depth+.05,.045,h,.07,C.frame,6);
     for(const yy of [q.bottom+.035,q.top-.035])b.box(x,yy,-depth+.05,w,.055,.07,C.frame,6);
     if(!q.door)b.box(x,base+1.95,-depth+.055,w,.035,.07,C.frame,6);
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.04,.025,len,.12,.16,C.frame,24);
   }
   b.box(len/2,H.wall+.04,.035,len,.16,.18,C.frame,24);
  }));
 }
 // Both plan-labelled entrance halls face the western recess. The L stairs are footprint-fitted.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.number,()=>{
  const s=q.number===38?1:-1,v=q.v;
  b.box(27.85,.30,v,1.58,.60,2.50,C.stone,24);
  b.box(25.48,.15,v,1.22,.30,1.22,C.stone,24);
  for(let k=0;k<3;k++){const h=.10*(k+1);b.box(25.48,h/2,v-s*(1.70-k*.43),1.22,h,.46,C.stone,24);}
  for(let k=0;k<3;k++){const h=.40+k*.10;b.box(26.25+k*.36,h/2,v,.37,h,1.22,C.stone,24);}
  for(const [u,vv,h] of [[24.86,v-s*1.70,.10],[24.86,v,.30],[27.0,v+s*.65,.60]])b.cyl(u,h,vv,.026,.83,'#6c7870',8,1,6);
  b.beam([24.86,.93,v-s*1.70],[24.86,1.13,v],.027,'#6c7870',6);b.beam([25.0,1.13,v+s*.65],[27.0,1.43,v+s*.65],.027,'#6c7870',6);
 });});
 return{strategy:'building019-v46',floors:6,sourceOutline:true,northWing:38,southWing:39,connectorShared:true,threeRoofBars:true,seventhStoreyUnmodeled:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building019={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
