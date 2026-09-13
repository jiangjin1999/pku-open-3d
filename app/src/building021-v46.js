/* Dormitories 36/37: north/south L plans and separate inward entrance halls. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825543';
const O=[-118.882,672.580],R=Math.atan2(2.476,66.982),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#a4aba2',frame:'#ccd1c6',glass:'#657b78',roof:'#7b847d',tile:'#969e93',stone:'#a8afa5',door:'#526762'};
const H={floor:3.1,wall:18.6,eave:18.78,ridge:22.6},entrances=[{number:36,u:36.87,v:18.058,face:'36-south',outward:1},{number:37,u:37.25,v:51.824,face:'37-north',outward:-1}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'021-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('021-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'36-north',box:[0,0,67.036,18.059],axis:0,rise:3.82},{name:'37-south',box:[.254,51.82,67.813,69.406],axis:0,rise:3.82},{name:'west-connector',box:[-2.817,19.078,15.747,49.426],axis:1,rise:3.30}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('021-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('021-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 // Each wing has its own measured image-pixel room boundaries. Service blocks use narrow windows;
 // facade opening ratios and heights remain fitted, not a claim that the plan is an elevation.
 const map36=x=>(x-107)/(1540-107)*67.036,map37=x=>.254+(x-136)/(1512-136)*(67.813-.254);
 const cells=(xs,ratio=.72)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const north36=[...cells([107,179,250,322,394,466,537,608,681,751,823,894].map(map36)),...cells([894,966,1037,1108].map(map36),.38),...cells([1108,1178,1250,1324,1396,1469,1540].map(map36))];
 const south36=[...cells([252,323,466].map(map36),.62),...cells([466,537,608,681,751,823,894,966].map(map36)),...cells([966,1037].map(map36),.42),...cells([1037,1108,1178,1250,1324,1396,1469,1540].map(map36))];
 const north37=[...cells([273,342,480].map(map37),.62),...cells([480,550,619,687,756,824,894,964].map(map37)),...cells([964,1032,1101,1169,1237].map(map37),.38),...cells([1237,1306,1375,1444,1512].map(map37))];
 const south37=cells([136,205,273,342,411,480,550,619,687,756,824,894,964,1032,1101,1169,1237,1306,1375,1444,1512].map(map37));
 // 36 has four paired rooms toward the shared end; 37's standard plan shows five.
 const west36=[...cells([19.078,22.0,24.9],.38),...cells([24.9,27.4,29.9,32.4,34.9])];
 const west37=[...cells([34.9,37.3,39.7,42.1,44.5,46.9]),...cells([46.9,49.426],.38)];
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv);let face='minor-return',source=[];
  const mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;
  if(horizontal&&mv<.1){face='36-north';source=north36;}
  else if(horizontal&&mv>17.9&&mv<18.2){face='36-south';source=south36;}
  else if(horizontal&&mv>51.7&&mv<52){face='37-north';source=north37;}
  else if(horizontal&&mv>69){face='37-south';source=south37;}
  else if(!horizontal&&mv>19&&mv<50&&len>20){face=mx<0?'connector-west':'connector-east';source=[...west36,...west37];}
  else if(!horizontal&&len>9){face=mv<19?'36-end':'37-end';source=cells([Math.min(la[1],lc[1]),(la[1]+lc[1])/2,Math.max(la[1],lc[1])],.4);}
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>{
    const t=(s+e)/2/len,u=la[0]+t*du,v=la[1]+t*dv;
    const balcony=(face==='36-south'&&u>map36(466)&&!(u>map36(966)&&u<map36(1037)))||
      (face==='connector-east'&&v>24.9&&v<34.9);
    return {s,e,bottom:base+(balcony?.18:.84),top:base+(balcony?2.94:2.70),door:false,balcony};
   });
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.u-la[0])/du*len;if(x>1.5&&x<len-1.5){openings=openings.filter(q=>q.e<x-1.35||q.s>x+1.35);openings.push({s:x-1.2,e:x+1.2,bottom:.60,top:2.86,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:q.balcony?1.25:.55;
     if(q.balcony){
      // 2010 official photographs identify No.36's courtyard balcony recesses.
      // Keep these inside the mapped outer face; No.37 is not inferred from them.
      group('36-balcony',()=>{
       const white='#dadbd5',brick='#90928e';
       for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.13,h,depth,white,24);
       b.box(x,base+.16,-depth/2,w,.14,depth,white,24);
       b.box(x,base+2.99,-depth/2,w,.14,depth,white,24);
       b.box(x,base+.66,-.055,w,.98,.13,white,24);
       b.box(x,base+1.17,-.035,w+.06,.09,.19,white,24);
       b.box(x,base+1.56,-depth-.015,w,2.82,.045,brick,24);
       const gw=w*.78,gh=1.90,gy=base+1.70;
       b.box(x,gy,-depth+.04,gw,gh,.05,C.glass,5);
       for(const xx of [x-gw/2,x+gw/2,x])b.box(xx,gy,-depth+.08,.06,gh,.07,white,6);
       for(const yy of [gy-gh/2,gy+gh/2,base+2.12])b.box(x,yy,-depth+.08,gw,.055,.07,white,6);
       if(floor===0){for(let gx=q.s+.16;gx<q.e-.08;gx+=.18)b.box(gx,base+1.95,.015,.035,1.52,.035,white,6);}
      });
      cursor=q.e;continue;
     }
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
 // The two separately drawn entrance halls face each other across the open court.
 // Their first-floor external stairs run straight outward, unlike 38/39's folded stairs.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.number,()=>{
  const sign=q.outward;
  b.box(q.u,.30,q.v+sign*.55,4.3,.6,1.1,C.stone,24);
  for(let k=0;k<5;k++){const h=.1*(k+1);b.box(q.u,h/2,q.v+sign*(2.90-k*.4),3.8,h,.42,C.stone,24);}
 });});
 return{strategy:'building021-v46',floors:6,sourceOutline:true,northWing:36,southWing:37,westConnector:true,threeRoofBars:true,inwardSeparateEntrances:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building021={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
