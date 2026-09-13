/* Dormitory 31: east-up own floor plans, seven exits and courtyard recessed white balconies. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832244';
const O=[-136.416,509.87],R=Math.atan2(1.166,31.976),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#747b77',frame:'#e4e5dc',glass:'#718b91',roof:'#727e78',tile:'#929e96',stone:'#a8afa5',door:'#526762'};
const H={floor:3.2,wall:19.2,eave:19.4,ridge:22.5},entrances=[{name:'main-east',u:18.76,v:36.8,face:'court-main',axis:1,outward:1,width:5.4,sill:.3},{name:'north-east',u:31.995,v:7.7,face:'north-east',axis:1,outward:1,width:1.9,sill:.3},{name:'south-east',u:31.753,v:69.4,face:'south-east',axis:1,outward:1,width:1.9,sill:.3},{name:'north-west',u:0,v:7.7,face:'west',axis:1,outward:-1,width:1.9,sill:.3},{name:'south-west',u:-.12,v:69.4,face:'west',axis:1,outward:-1,width:1.9,sill:.3},{name:'north-stair',u:19.7,v:0,face:'north',axis:0,outward:-1,width:1.9,sill:.3},{name:'south-stair',u:19.7,v:77.22,face:'south',axis:0,outward:1,width:1.9,sill:.3}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'036-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('036-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'north-wing',box:[-1.648,0,32,19.084],axis:0,rise:3.1},{name:'south-wing',box:[-1.648,58.483,32,77.224],axis:0,rise:3.1},{name:'west-long',box:[-1.648,19.084,18.764,58.483],axis:1,rise:3.1}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('036-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('036-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 const mapX=x=>(1653-x)/(1653-228)*77.223,mapY=y=>(1010-y)/(1010-415)*31.997,cells=(xs,ratio=.68)=>xs.slice(1).map((x,i)=>[Math.min(xs[i],x),Math.max(xs[i],x),ratio]);
 const main=cells([588,653,718,782,845,910,975,1039,1103,1167,1231,1295].map(mapX)),outer=cells([228,350,394,519,584,649,714,779,844,909,974,1039,1104,1169,1234,1299,1364,1488,1531,1653].map(mapX));
 const wing=cells([415,484,551,617,684,750,816,881,946,1010].map(mapY));
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal){face=mv<1?'north':mv>76?'south':mv<20?'north-court':'south-court';source=wing;}else{face=mx<1?'west':mx<25?'court-main':mv<30?'north-east':'south-east';source=face==='court-main'?main:face==='west'?outer:cells([Math.min(la[1],lc[1]),(la[1]+lc[1])/2,Math.max(la[1],lc[1])],.35);}
 const balcony=['court-main','north-court','south-court'].includes(face),setback=balcony?1.1:0,axis=horizontal?0:1,delta=horizontal?du:dv;
 const positions=source.map(([s,e,ratio])=>{const t0=(s-la[axis])/delta*len,t1=(e-la[axis])/delta*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).filter(([s,e])=>s>.1&&e<len-.1&&e-s>.3).sort((a,b)=>a[0]-b[0]);
 const stairX=(42.0-la[1])/dv*len,stairRange=face==='court-main'&&stairX>1.8&&stairX<len-1.8?[stairX-1.8,stairX+1.8]:null;
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
 for(let floor=0;floor<6;floor++){const base=floor*3.2,col=floor===5?C.frame:C.wall,panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-setback-.035,e-s,hi-lo,.07,col,24);};
 let openings=positions.map(([s,e])=>({s,e,bottom:base+.85,top:base+2.65}));if(stairRange){openings=openings.filter(q=>q.e<stairRange[0]||q.s>stairRange[1]);openings.push({s:stairX-.6,e:stairX+.6,bottom:base+1.2,top:base+2.2,stair:true});}
 let doorIntervals=[];if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=Math.max(0,x-door.width/2),e=Math.min(len,x+door.width/2);if(e>s+.15){openings=openings.filter(q=>q.e<s-.1||q.s>e+.1);openings.push({s,e,bottom:.3,top:3.03,door:true});doorIntervals.push([s,e]);}}
 openings.sort((a,b)=>a.s-b.s);let cursor=0;for(const q of openings){panel(cursor,q.s,base,base+3.2);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+3.2);const x=(q.s+q.e)/2,w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2;for(const xx of[q.s,q.e])b.box(xx,y,-setback-.2,.055,h,.40,C.frame,24);for(const yy of[q.bottom,q.top])b.box(x,yy,-setback-.2,w,.055,.40,C.frame,24);b.box(x,y,-setback-.43,w-.1,h-.1,.055,q.door?C.door:C.glass,5);for(const xx of[x-w*.24,x+w*.24])b.box(xx,y,-setback-.385,.05,h,.065,C.frame,24);b.box(x,q.top-.45,-setback-.385,w,.055,.065,C.frame,24);cursor=q.e;}panel(cursor,len,base,base+3.2);
 if(balcony){let bands=[[0,len]];for(const cut of [...doorIntervals,...(stairRange?[stairRange]:[])])bands=bands.flatMap(([s,e])=>[[s,Math.min(e,cut[0])],[Math.max(s,cut[1]),e]]).filter(([s,e])=>e>s);for(const [s,e] of bands){b.box((s+e)/2,base+.12,-.55,e-s,.22,1.1,C.frame,24);b.box((s+e)/2,base+.70,-.075,e-s,.94,.15,C.frame,24);b.box((s+e)/2,base+1.20,-.05,e-s,.06,.20,'#c3ccc0',24);for(const [ps,pe] of positions){const x=(ps+pe)/2;if(x>s&&x<e){const end=Math.min(e,pe+.45);b.box(end,base+1.72,-.55,.13,2.98,1.1,C.frame,24);}}}if(stairRange){const c=floor===5?C.frame:'#89938a';b.box(stairX-1.2,base+1.6,-.08,1.2,3.2,.08,c,24);b.box(stairX+1.2,base+1.6,-.08,1.2,3.2,.08,c,24);b.box(stairX,base+.60,-.08,1.2,1.2,.08,c,24);b.box(stairX,base+2.70,-.08,1.2,1,.08,c,24);}}
 if(!balcony)b.box(len/2,base+3.1,.03,len,.16,.18,C.frame,24);
 }b.box(len/2,19.30,.10,len,.24,.42,C.frame,24);
 }));}
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{const s=q.outward,depth=q.face==='court-main'?1.1:0;if(q.axis===1){b.box(q.u+s*(.35-depth/2),.15,q.v,.7+depth,.3,q.width+.2,C.stone,24);b.box(q.u+s*.9,.075,q.v,.4,.15,q.width+.2,C.stone,24);}else{b.box(q.u,.15,q.v+s*.35,q.width+.2,.3,.7,C.stone,24);b.box(q.u,.075,q.v+s*.9,q.width+.2,.15,.4,C.stone,24);}});});
 return{strategy:'building036-v46',floors:6,basementFloors:2,sourceOutline:true,eastOpenCourt:true,deepBalconies:true,entranceCount:7,groundHallOnly:true,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building036={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
