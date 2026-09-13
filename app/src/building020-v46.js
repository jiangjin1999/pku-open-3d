/* Dormitories 40/41/42: six individual official plans and five mapped roof bars. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825542';
const O=[-287.691,678.410],R=Math.atan2(1.255,33.299),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#a4aba2',frame:'#ccd1c6',glass:'#657b78',roof:'#7b847d',tile:'#969e93',stone:'#a8afa5',door:'#526762'};
const H={floor:3.1,wall:18.6,eave:18.78,ridge:22.6},entrances=[{number:40,u:41.69,v:24.1,face:'40-west',axis:1},{number:41,u:24.7,v:51.066,face:'41-north',axis:0},{number:42,u:10.72,v:21.0,face:'42-east',axis:1}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'020-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('020-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'42-north',box:[0,0,33.326,17.59],axis:0,rise:3.82},{name:'42-west-stem',box:[-7.375,17.59,10.729,49.76],axis:1,rise:3.30},{name:'40-north',box:[42.946,-.541,87.402,17.562],axis:0,rise:3.82},{name:'40-east-stem',box:[41.658,17.562,60.086,49.807],axis:1,rise:3.30},{name:'41-south',box:[-5.714,51.047,74.002,68.775],axis:0,rise:3.82}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('020-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('020-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 // Window bay pitches follow plan room rhythm, fitted to the map; they are not surveyed facade widths.
 const cells=(lo,hi,n)=>Array.from({length:n},(_,i)=>[lo+(hi-lo)*i/n,lo+(hi-lo)*(i+1)/n]);
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv);let face='minor-return',source=[];
  const mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;
  if(horizontal&&mv<1){face=mx<40?'42-north':'40-north';source=mx<40?cells(0,33.326,9):cells(42.946,87.402,12);}
  else if(horizontal&&mv>68){face='41-south';source=cells(-5.714,74.002,22);}
  else if(horizontal&&mv>50&&mv<52){face='41-north';source=cells(-5.714,74.002,22);}
  else if(horizontal&&mv>15&&mv<18){face=mx<40?'42-south':'40-south';source=mx<40?cells(0,33.326,9):cells(42.946,87.402,12);}
  else if(!horizontal&&mv>18&&mv<50&&len>20){face=mx<0?'42-west':mx<20?'42-east':mx<50?'40-west':'40-east';source=cells(17.6,49.4,9);}
  else if(!horizontal&&len>10){face=mv>50?'41-end':mx<40?'42-end':'40-end';source=cells(Math.min(la[1],lc[1]),Math.max(la[1],lc[1]),2);}
  const positions=source.map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len;return[Math.min(t0,t1)+.16,Math.max(t0,t1)-.16];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len;if(x>1.5&&x<len-1.5){openings=openings.filter(q=>q.e<x-1.35||q.s>x+1.35);openings.push({s:x-1.2,e:x+1.2,bottom:.60,top:2.86,door:true});}}
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
 // First-floor plans place 40 west, 41 north and 42 east. Step heights and ramp gradient are fitted.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.number,()=>{
  if(q.number===40){
   b.box(q.u-.7,.30,q.v,1.4,.6,2.5,C.stone,24);
   for(let k=0;k<5;k++){const h=.1*(k+1);b.box(q.u-3.35+k*.43,h/2,q.v,.45,h,2.0,C.stone,24);}
  }else if(q.number===41){
   b.box(q.u,.30,q.v-.7,2.5,.6,1.4,C.stone,24);
   for(let k=0;k<5;k++){const h=.1*(k+1);b.box(q.u,h/2,q.v-3.35+k*.43,2.0,h,.45,C.stone,24);}
  }else{
   b.box(q.u+.75,.30,q.v,1.5,.6,2.4,C.stone,24);
   // The first-floor plan also shows a short northern stair into this platform.
   group('entrance-42-north-steps',()=>{for(let k=0;k<5;k++){const h=.1*(k+1);b.box(q.u+.875,h/2,q.v-3+k*.4,1.25,h,.45,C.stone,24);}});
   // A narrow external run descends south from the east entrance, as drawn on the first-floor plan.
   const mesh=new G.Geometry(),u0=q.u+.25,u1=q.u+1.5,v0=q.v+1.15,v1=q.v+10.5;
   mesh.quad(...[[u0,.6,v0],[u1,.6,v0],[u1,.03,v1],[u0,.03,v1]].map(p=>b.world(p)));
   b.e.add('ramp',mesh,Y.M.identity(),C.stone,[24,id,0,0]);
   for(const u of [u0,u1]){b.beam([u,1.45,v0],[u,.88,v1],.025,'#6c7870',6);for(let k=0;k<5;k++){const t=k/4;b.cyl(u,.6-.57*t,v0+(v1-v0)*t,.024,.85,'#6c7870',8,1,6);}}
  }
 });});
 return{strategy:'building020-v46',floors:6,sourceOutline:true,northWest:42,northEast:40,southWing:41,fiveRoofBars:true,secondFloor42LayoutUnverified:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building020={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
