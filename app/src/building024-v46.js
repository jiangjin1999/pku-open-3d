/* Dormitory 32: own 2-6F plan, source-aligned three roof bars and eight separate exits. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825546';
const O=[-44.47,602.862],R=Math.atan2(2.843,65.428),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#747b77',frame:'#e4e5dc',glass:'#718b91',roof:'#727e78',tile:'#929e96',stone:'#a8afa5',door:'#526762'};
const H={floor:3.2,wall:19.2,eave:19.4,ridge:22.5},entrances=[{name:'main-south',u:34.4,v:39.066,face:'south',axis:0,outward:1,width:6.8,sill:.75},{name:'court-north',u:36.0,v:19.53,face:'court-north',axis:0,outward:-1,width:1.9,sill:.3},{name:'west-north',u:9.4,v:.039,face:'west-north',axis:0,outward:-1,width:1.8,sill:.3},{name:'east-north',u:56.1,v:-.037,face:'east-north',axis:0,outward:-1,width:1.8,sill:.75},{name:'west-side',u:-.115,v:31.1,face:'west-outer',axis:1,outward:-1,width:1.8,sill:.3},{name:'east-side',u:65.380,v:31.1,face:'east-outer',axis:1,outward:1,width:1.8,sill:.3},{name:'west-court-side',u:18.668,v:2.0,face:'west-inner',axis:1,outward:1,width:1.8,sill:.3},{name:'east-court-side',u:46.671,v:2.0,face:'east-inner',axis:1,outward:-1,width:1.8,sill:.3}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'024-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('024-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'west-short',box:[-.144,0,18.675,19.457],axis:1,rise:3.1},{name:'east-short',box:[46.610,-.073,65.490,19.574],axis:1,rise:3.1},{name:'south-long',box:[-.144,19.70,65.490,39.182],axis:0,rise:3.1}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('024-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('024-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 // The 2-6F plan gives room divisions, not a measured elevation; outer opening ratios remain fitted.
 const map=x=>(x-239)/(1653-239)*65.490,cells=(xs,ratio=.67)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const south=cells([239,315,390,464,538,613,687,761,836,910,984,1058,1133,1207,1281,1356,1430,1504,1578,1653].map(map));
 const court=cells([464,538,613,687,761,836,910,984,1058,1133,1207,1281,1356,1430].map(map));
 const sideRooms=cells([0,3.243,6.486,9.729,12.972,16.215,19.457,23.4,27.3,31.1,35.1,39.1]);
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal&&mv>38.8){face='south';source=south;}
 else if(horizontal&&mv>19.3&&mv<19.65){face='court-north';source=court;}
 else if(horizontal&&mv<.1){face=mx<35?'west-north':'east-north';source=cells([Math.min(la[0],lc[0]),(la[0]+lc[0])/2,Math.max(la[0],lc[0])],.20);}
 else if(!horizontal){face=mx<1?'west-outer':mx<25?'west-inner':mx<60?'east-inner':'east-outer';source=sideRooms;}
  // Numbered 2017 photo is the eastern wing's NORTH end: west stair window, east room's blank end wall.
  if(face==='east-north')source=source.slice(0,1);
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=Math.max(0,x-door.width/2),e=Math.min(len,x+door.width/2);if(e>s+.15){openings=openings.filter(q=>q.e<s-.12||q.s>e+.12);openings.push({s,e,bottom:door.sill,top:3.03,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:.55;
     // Returns and recessed glazing form real apertures, without extruded continuous corridors.
     for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [q.bottom,q.top])b.box(x,yy,-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.05,x,q.e-.05])b.box(xx,y,-depth+.05,.045,h,.07,C.frame,6);
     for(const yy of [q.bottom+.035,q.top-.035])b.box(x,yy,-depth+.05,w,.055,.07,C.frame,6);
     if(!q.door)b.box(x,base+1.95,-depth+.055,w,.035,.07,C.frame,6);
     if(!q.door&&floor===0&&face==='east-north')for(let gx=q.s+.12;gx<q.e-.08;gx+=.16)b.box(gx,y,.02,.03,h,.035,C.frame,6);
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.14,.025,len,.12,.16,C.frame,24);
   }
   b.box(len/2,H.wall+.04,.035,len,.16,.18,C.frame,24);
  }));
 }
 // South main lobby has its own broad outside stair; the other plan-labelled exits remain secondary.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{
 const w=q.width,s=q.outward;
 if(q.name==='main-south'){b.box(q.u,.375,q.v+.60,w+.6,.75,1.2,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(q.u,h/2,q.v+3.45-k*.5,w+.6,h,.51,C.stone,24);}}
 else if(q.name==='east-north'){
  b.box(q.u,.375,q.v-.55,w+.3,.75,1.1,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(q.u,h/2,q.v-3.10+k*.5,w+.3,h,.51,C.stone,24);}
  b.box(q.u,3.13,q.v-.65,w+.8,.15,1.4,C.frame,24);
  for(const edge of [-1,1]){b.box(q.u+edge*(w/2+.4),3.31,q.v-.65,.10,.30,1.4,C.frame,24);
   for(let k=0;k<5;k++){const v=q.v-3.10+k*.5,h=.15*(k+1);b.box(q.u+edge*(w/2+.10),h+.43,v,.04,.86,.04,C.frame,6);}
   b.beam([q.u+edge*(w/2+.10),1.02,q.v-3.10],[q.u+edge*(w/2+.10),1.62,q.v-1.10],.04,C.frame,6);}
 }
 else if(q.axis===0){b.box(q.u,.15,q.v+s*.35,w+.25,.3,.7,C.stone,24);b.box(q.u,.075,q.v+s*.88,w+.25,.15,.38,C.stone,24);}
 else{b.box(q.u+s*.35,.15,q.v,.7,.3,w+.25,C.stone,24);b.box(q.u+s*.88,.075,q.v,.38,.15,w+.25,C.stone,24);}
 });

 });
 return{strategy:'building024-v46',floors:6,basementFloors:2,sourceOutline:true,northUOpening:true,threeRoofBars:true,southMainEntrance:true,undergroundSkylightModeled:false,fullCourtCover:false,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building024={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
