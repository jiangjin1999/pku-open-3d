/* Student dormitory 28: its own east-up plan, west-open court and eight ground exits. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832247';
const O=[-14.075,504.829],R=Math.atan2(1.043,31.429),CO=Math.cos(R),SI=Math.sin(R),H={wall:19.2,eave:19.4,ridge:22.5};
const C={wall:'#a0a69d',frame:'#d9ddd1',glass:'#687e82',roof:'#737e78',tile:'#939e95',stone:'#b3baac'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const entrances=[{name:'main-east',u:32.55,v:37.64,w:5.5},{name:'court-west',u:14.08,v:39.0,w:2.5},{name:'north-east',u:31.45,v:9.64,w:1.9},{name:'south-east',u:31.44,v:67.8,w:1.9},{name:'north-west',u:0,v:9.64,w:1.9},{name:'south-west',u:.08,v:67.8,w:1.9},{name:'north-court-stair',u:1.4,v:19.264,w:1.9},{name:'south-court-stair',u:1.4,v:58.593,w:1.9}];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'039-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('039-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'north-wing',box:[0,-.01,32.56,19.264],axis:0,rise:3.1},{name:'south-wing',box:[0,58.593,32.56,76.69],axis:0,rise:3.1},{name:'east-long',box:[14.075,19.264,32.56,58.593],axis:1,rise:3.1}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('039-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('039-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }

// Piecewise registration of this building's drawing, not the neighbouring 31 plan.
const mapX=x=>x<525?(x-238)/(525-238)*19.264:x<1360?19.264+(x-525)/(1360-525)*(58.593-19.264):58.593+(x-1360)/(1650-1360)*(76.678-58.593);
const mapY=y=>y<768?31.446-(y-475)/(768-475)*(31.446-14.08):14.08-(y-768)/(1052-768)*14.08;
const mainCuts=[525,590,655,720,785,850,912,975,1040,1105,1170,1235,1300,1360].map(mapX),wingCuts=[475,540,603,668,730,795,860,925,990,1052].map(mapY).sort((a,b)=>a-b);
const original=F.polygons(f.geometry)[0][0],raw=original.slice(0,-1).filter((p,i,ps)=>{const a=ps[(i+ps.length-1)%ps.length],c=ps[(i+1)%ps.length],dx=c[0]-a[0],dz=c[1]-a[1];return Math.abs((p[0]-a[0])*dz-(p[1]-a[1])*dx)/Math.hypot(dx,dz)>.025;});raw.push(raw[0]);const positive=F.area(raw)>0,edges=[];
for(let i=1;i<raw.length;i++){let a=raw[i-1],c=raw[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);edges.push({a,c,la,lc,len,rotation:Math.atan2(-dz,dx),doors:[]});}
for(const d of entrances){let best=null;for(const e of edges){const du=e.lc[0]-e.la[0],dv=e.lc[1]-e.la[1],t=Math.max(0,Math.min(1,((d.u-e.la[0])*du+(d.v-e.la[1])*dv)/(du*du+dv*dv))),dist=Math.hypot(e.la[0]+t*du-d.u,e.la[1]+t*dv-d.v);if(!best||dist<best.dist)best={e,t,dist};}best.e.doors.push({...d,x:best.t*best.e.len});}
for(const e of edges){const {a,la,lc,len}=e,du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),axis=horizontal?0:1,delta=lc[axis]-la[axis],mid=(la[axis]+lc[axis])/2;
let cuts=horizontal?wingCuts:mid>19.264&&mid<58.593?mainCuts:[0,9.632,19.264,58.593,67.8,76.678];
let positions=[];for(let k=1;k<cuts.length;k++){const c=(cuts[k]+cuts[k-1])/2,w=Math.abs(cuts[k]-cuts[k-1])*.62,x=(c-la[axis])/delta*len;if(x-w/2>.15&&x+w/2<len-.15)positions.push([x-w/2,x+w/2]);}
// A source edge may split a room's interval; merge window centres by projecting only those which fit.
b.local(a[0],0,a[1],e.rotation,()=>group('facade-'+edges.indexOf(e),()=>{
const panel=(s,t,lo,hi)=>{if(t>s&&hi>lo)b.box((s+t)/2,(lo+hi)/2,-.08,t-s,hi-lo,.16,C.wall,24);};
for(let floor=0;floor<6;floor++){const base=floor*3.2;let holes=positions.map(([s,t])=>({s,t,lo:base+.9,hi:base+2.6}));if(floor===0)for(const d of e.doors){const s=d.x-d.w/2,t=d.x+d.w/2;holes=holes.filter(h=>h.t<s||h.s>t);holes.push({s,t,lo:.3,hi:3.02,door:true});}holes.sort((a,b)=>a.s-b.s);let prev=0;
for(const h of holes){panel(prev,h.s,base,base+3.2);panel(h.s,h.t,base,h.lo);panel(h.s,h.t,h.hi,base+3.2);const x=(h.s+h.t)/2,w=h.t-h.s,y=(h.lo+h.hi)/2,hh=h.hi-h.lo;for(const xx of[h.s,h.t])b.box(xx,y,-.10,.07,hh,.30,C.frame,24);for(const yy of[h.lo,h.hi])b.box(x,yy,-.10,w,.07,.30,C.frame,24);b.box(x,y,-.28,w-.1,hh-.1,.05,C.glass,5);b.box(x,y,-.23,.06,hh,.08,C.frame,24);prev=h.t;}panel(prev,len,base,base+3.2);b.box(len/2,base+3.13,.03,len,.14,.20,C.frame,24);}
for(const d of e.doors)group('entrance-'+d.name,()=>{b.box(d.x,.15,.40,d.w+.24,.3,.96,C.stone,24);b.box(d.x,.075,1.02,d.w+.24,.15,.3,C.stone,24);});
}));}
return{strategy:'building039-v46',floors:6,basementFloors:2,entranceCount:8,groundHallOnly:true,westOpenCourt:true,facadesVerified:false};}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building039={id:ID,render,world,local,entrances,heights:H};
})(YY);
