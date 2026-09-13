/* Meng Minwei at PKU: west portico, glazed lower front, two west-facing decorated end wings; dimensions remain fitted. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832251';
const O=[134.998,656.325],R=Math.atan2(1.277,25.126),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#747b77',frame:'#e4e5dc',glass:'#718b91',roof:'#727e78',tile:'#929e96',stone:'#a8afa5',door:'#526762'};
const H={floor:3.4,wall:17.0,eave:17.15,ridge:20.5,low:13.6,front:7.6},entrances=[{name:'west',u:6.61,v:35.5,width:17.2,directionVerified:true}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Affine slope factors also give exact break points where a clipped wall crosses a roof hip.
const mainRoofBox=[9.60,8.218,25.16,62.974],roofHalf=(mainRoofBox[2]-mainRoofBox[0])/2,roofHip=(mainRoofBox[2]-mainRoofBox[0])*.42;
const roofFactors=(u,v)=>[1,(v-mainRoofBox[1])/roofHip,(mainRoofBox[3]-v)/roofHip,(u-mainRoofBox[0])/roofHalf,(mainRoofBox[2]-u)/roofHalf];
const roofHeight=(u,v)=>H.eave+3.35*Math.max(0,Math.min(...roofFactors(u,v)));
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'041-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 
 const roofSpecs=[{name:'north-south-main',box:mainRoofBox,axis:1,rise:3.35}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>roofHeight(p[0],p[1]);
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('041-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('041-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 const raw=F.polygons(f.geometry)[0][0],ring=raw,positive=F.area(ring)>0;
 // Heights are fitted to the photographed hierarchy, not surveyed floor elevations.
 for(const q of[{name:'north-end',box:[-.01,-.01,28.51,8.218],h:H.low},{name:'northwest',box:[-.01,8.218,9.60,15.56],h:H.low},{name:'south-end',box:[-.01,62.974,28.51,70.97],h:H.low},{name:'southwest',box:[-.01,56.04,9.60,62.974],h:H.low},{name:'east-legacy-unresolved',box:[25.16,8.21,28.51,62.98],h:3.78}]){const g=new G.Geometry();for(const p of pieces(f,q.box))for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],q.h,p[1])));add('041-low-flat-'+q.name,g,'#afb4a6',24,id);}
 function facade(u,v,yaw,len,height,name,{door=false,wideTop=false,levels=5,floor=3.4,minY=0}={}){
  b.local(O[0],0,O[1],R,()=>b.local(u,0,v,yaw,()=>group(name,()=>{
   const panel=(a,c,lo,hi,color='#858e84')=>{lo=Math.max(lo,minY);if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.045,c-a,hi-lo,.09,color,24);};
   const n=Math.max(1,Math.round(len/3.7)),bay=len/n,doorX=35.5-v;
   // Front bays stop at the portal piers. Cutting an unrelated full-wall grid
   // produced spurious sliver windows beside the outer columns.
   const bays=door?[[0,doorX-8.6],[doorX+8.6,len]].flatMap(([a,c])=>{const n=Math.max(1,Math.round((c-a)/3.7));return Array.from({length:n},(_,k)=>[a+(c-a)*k/n,a+(c-a)*(k+1)/n]);}):Array.from({length:n},(_,k)=>[k*bay,(k+1)*bay]);
   for(let fl=0;fl<levels;fl++){
    const base=fl*floor,top=Math.min(height,(fl+1)*floor);if(top<=base||top<=minY)continue;
    for(const span of bays){
     const spans=[span];
     for(const [a,c]of spans){
      const x=(a+c)/2,ribbon=wideTop&&fl===4,tallFront=door&&fl===1,w=ribbon?Math.max(.2,c-a-.32):Math.min(2.0,(c-a)*.60),lo=tallFront?base+.2:base+.8,hi=ribbon?Math.min(top-.35,base+2.27):tallFront?top-.35:Math.min(base+2.78,top-.12);
      if(c-a<.6||hi<=lo){panel(a,c,base,top);continue;}
      panel(a,x-w/2,base,top,ribbon?'#d5d8cb':undefined);panel(x+w/2,c,base,top,ribbon?'#d5d8cb':undefined);panel(x-w/2,x+w/2,base,lo);panel(x-w/2,x+w/2,hi,top,ribbon?'#d5d8cb':undefined);
      for(const xx of[x-w/2,x+w/2])b.box(xx,(lo+hi)/2,-.13,.065,hi-lo,.26,ribbon?'#d5d8cb':'#773e31',24);
      for(const yy of[lo,hi])b.box(x,yy,-.13,w,.065,.26,ribbon?'#d5d8cb':'#773e31',24);
      b.box(x,(lo+hi)/2,-.31,w-.12,hi-lo-.1,.05,'#687e80',5);b.box(x,(lo+hi)/2,-.25,.06,hi-lo,.065,'#773e31',24);
      if(!ribbon)b.box(x,hi-.45,-.25,w,.055,.065,'#773e31',24);
      if(tallFront){
       b.box(x,base-.2,-.18,w+.25,.65,.32,'#d5d8cb',24);
       for(const y of[lo+.12,lo+.65])b.box(x,y,.03,w,.055,.07,'#8e9d96',24);
       for(let z=-w/2;z<=w/2+.001;z+=.30)b.box(x+z,lo+.38,.03,.045,.53,.055,'#8e9d96',24);
      }
     }
    }
    if(top-base>.9)b.box(len/2,top-.09,.02,len,.18,.22,'#d5d8cb',24);
   }
  })));
 }
 // Preserve the eastern and end elevations as explicitly unverified fits. The
 // newly photographed west central wall and decorated west ends are built below.
 for(let i=1;i<ring.length;i++){
  let a=local(ring[i-1]),c=local(ring[i]);if(positive)[a,c]=[c,a];
  const du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv),mu=(a[0]+c[0])/2,mv=(a[1]+c[1])/2;
  if(Math.abs(du)<.08&&(mu<2||mu>6.5&&mu<6.8&&mv>15.55&&mv<56.05))continue;
  const cuts=[0,1];for(const u of[9.6,25.16]){const t=(u-a[0])/du;if(t>0&&t<1)cuts.push(t);}cuts.sort((a,b)=>a-b);
  for(let k=1;k<cuts.length;k++){const s=cuts[k-1],e=cuts[k],u=a[0]+du*(s+e)/2,h=mv<8.218||mv>62.974?H.low:u<9.6?H.low:u>25.17?3.78:H.wall;facade(a[0]+du*s,a[1]+dv*s,Math.atan2(-dv,du),len*(e-s),h,'legacy-face-'+i+'-'+k);}
 }
 facade(6.61,15.555,-Math.PI/2,40.493,H.front,'west-lower-front',{door:true,levels:2,floor:3.8});
 // The glazed lean-to is behind the two-storey west front, below the high
 // west elevation. Its existence is photographed; its depth/slope are fitted.
 const canopy=new G.Geometry(),slopeHeight=u=>7.68+(u-6.61)/(9.60-6.61)*2.27;
 canopy.quad(vertex(6.61,7.68,15.56),vertex(6.61,7.68,56.04),vertex(9.60,9.95,56.04),vertex(9.60,9.95,15.56));add('041-west-glazed-lean-to',canopy,'#8ba1a2',5,id);
 b.local(O[0],0,O[1],R,()=>group('west-canopy-frame',()=>{for(let v=15.56;v<56.1;v+=1.15)b.beam([6.61,7.73,v],[9.60,10.0,v],.055,'#596b67',24);for(const u of[6.61,8.105,9.60])b.beam([u,slopeHeight(u)+.05,15.56],[u,slopeHeight(u)+.05,56.04],.065,'#596b67',24);}));
 // Higher west wall is inset behind the sloping glass. Only its observed
 // upper two rows are exposed; the original equal-window top row is removed.
 facade(9.60,8.218,-Math.PI/2,54.756,H.wall,'west-main-upper',{wideTop:true,minY:7.6});
 facade(25.16,62.974,Math.PI/2,54.756,H.wall,'inset-east-main',{minY:3.78});
 facade(9.60,62.974,0,15.56,H.wall,'main-south-upper',{minY:H.low,wideTop:true});
 facade(25.16,8.218,Math.PI,15.56,H.wall,'main-north-upper',{minY:H.low,wideTop:true});
 b.local(O[0],0,O[1],R,()=>group('west-portico',()=>{
  const u=6.61,v=35.5;
  // Front columns span both occupied levels, with a first-floor beam and
  // open balcony above, as in the 2021/2025/2026 own-building photographs.
  for(const x of[-7.2,-3.6,3.6,7.2]){b.box(u,3.8,v+x,.78,7.6,.78,'#858e84',24);b.box(u,.50,v+x,.86,1.0,.86,'#aeb5aa',24);}
  for(const z of[-8.09,8.09])b.box(u,3.8,v+z,.12,7.6,1.02,'#858e84',24);
  b.box(u-.08,3.52,v,.98,.36,18.0,'#d5d8cb',24);b.box(u-.06,7.51,v,.60,.18,17.8,'#d5d8cb',24);
  for(const x of[-5.4,0,5.4]){const w=x===0?6.35:2.72;for(const y of[3.97,4.41])b.box(u-.14,y,v+x,.075,.065,w,'#8e9d96',24);for(let z=-w/2;z<=w/2+.001;z+=.61)b.box(u-.14,4.18,v+x+z,.065,.52,.05,'#8e9d96',24);}
  // Recessed back door and second-floor glazing. No invented eastern portal.
  for(const x of[-5.575,5.575])b.box(u+2.3,1.925,v+x,.12,2.95,3.25,'#858e84',24);
  for(const x of[-7.2,7.2])b.box(u+1.15,1.925,v+x,2.42,2.95,.12,'#858e84',24);
  b.box(u+2.3,3.275,v,.12,.25,7.90,'#858e84',24);b.box(u+2.39,1.76,v,.05,2.62,7.8,'#657b7b',5);
  for(const z of[-3.95,0,3.95])b.box(u+2.31,1.78,v+z,.14,2.66,.10,'#783d30',24);for(const y of[.45,2.73,3.1])b.box(u+2.31,y,v,.14,.09,8.05,'#783d30',24);
  for(const z of[-5.4,0,5.4]){const w=z===0?6.35:2.72;b.box(u+2.32,5.5,v+z,.06,3.1,w,'#657b7b',5);for(const y of[3.95,5.3,6.7,7.08])b.box(u+2.24,y,v+z,.12,.07,w,'#783d30',24);for(let x=-w/2;x<=w/2+.001;x+=w/3)b.box(u+2.24,5.5,v+z+x,.12,3.18,.07,'#783d30',24);}
  b.box(u+1.15,3.70,v,2.42,.18,14.4,'#858e84',24);b.box(u+1.15,7.51,v,2.42,.18,14.4,'#858e84',24);
  b.box(u+1.15,.225,v,3.1,.45,15.0,'#b5bdae',24);for(let k=0;k<3;k++){const h=.15*(k+1);b.box(u-1.6+k*.5,h/2,v,.51,h,17.6,'#b5bdae',24);}
  for(const z of[-4.4,4.4]){const pts=Array.from({length:13},(_,i)=>[u-.57,2.85+.28*Math.sin(i/12*Math.PI*1.5),v+z+.22*Math.cos(i/12*Math.PI*1.5)]);for(let j=1;j<pts.length;j++)b.beam(pts[j-1],pts[j],.025,'#303d35',24);b.box(u-.58,2.40,v+z,.24,.42,.26,'#35463c',24);b.box(u-.72,2.40,v+z,.025,.27,.18,'#b8c3af',5);}
 }));
 // Close only the vertical boundary between the wall top and the clipped main slope.
 // The west annex roofs and the recessed outdoor strip stay independent and open.
 const roofSkirt=new G.Geometry();
 function skirtEdge(a,c){
 const factorsA=roofFactors(...a),factorsC=roofFactors(...c),cuts=[0,1];
 for(let i=0;i<factorsA.length;i++)for(let j=i+1;j<factorsA.length;j++){
 const start=factorsA[i]-factorsA[j],end=factorsC[i]-factorsC[j],t=start/(start-end);
 if(t>1e-8&&t<1-1e-8)cuts.push(t);
 }
 cuts.sort((a,b)=>a-b);
 for(let i=1;i<cuts.length;i++){
 const point=t=>a.map((x,k)=>x+(c[k]-x)*t),p=point(cuts[i-1]),q=point(cuts[i]);
 roofSkirt.quad(vertex(p[0],H.wall,p[1]),vertex(q[0],H.wall,q[1]),vertex(q[0],roofHeight(...q),q[1]),vertex(p[0],roofHeight(...p),p[1]));
 }
 }
 // Clip the source outline to the main roof box before making its perimeter closure.
 // This introduces the inset east boundary; the outer one-storey strip never gets a high skirt.
 let mainBoundary=ring.slice(0,-1).map(local);
 for(const [axis,k,greater]of[[0,mainRoofBox[0],true],[0,mainRoofBox[2],false],[1,mainRoofBox[1],true],[1,mainRoofBox[3],false]])mainBoundary=clip(mainBoundary,axis,k,greater);
 for(let i=0;i<mainBoundary.length;i++)skirtEdge(mainBoundary[i],mainBoundary[(i+1)%mainBoundary.length]);
 add('041-main-roof-wall-closure',roofSkirt,'#858e84',24,id);
 b.local(O[0],0,O[1],R,()=>{
  for(const q of[{name:'northwest',u:.002,v:0,len:15.555,south:false},{name:'southwest',u:1.236,v:56.052,len:14.909,south:true}])group(q.name+'-west-decorated-wall',()=>{
   const mid=q.v+q.len/2,cols=[{v:mid-2.7,w:1.35},{v:mid,w:2.5},{v:mid+2.7,w:1.35}],panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box(q.u,(lo+hi)/2,(a+c)/2,.12,hi-lo,c-a,'#858e84',24);};
   // Two visibly stacked rectangular window groups sit below the three small
   // eaves. The blank parapet continues above; these are not a main roof.
   for(const row of[{base:4.2,top:8.1,lo:4.85,hi:7.35},{base:8.1,top:H.low,lo:8.75,hi:10.95}]){
    let a=q.v;for(const c of cols){panel(a,c.v-c.w/2,row.base,row.top);panel(c.v-c.w/2,c.v+c.w/2,row.base,row.lo);panel(c.v-c.w/2,c.v+c.w/2,row.hi,row.top);a=c.v+c.w/2;
     b.box(q.u+.20,(row.lo+row.hi)/2,c.v,.05,row.hi-row.lo-.12,c.w-.1,'#687e80',5);
     for(const z of[c.v-c.w/2,c.v,c.v+c.w/2])b.box(q.u-.04,(row.lo+row.hi)/2,z,.18,row.hi-row.lo,.065,'#783d30',24);for(const y of[row.lo,row.hi-.52,row.hi])b.box(q.u-.04,y,c.v,.18,.065,c.w,'#783d30',24);b.box(q.u-.08,row.lo-.10,c.v,.22,.17,c.w+.2,'#d5d8cb',24);
    }panel(a,q.v+q.len,row.base,row.top);
   }
   // Only the southwest arch is visible in direct street imagery. The north
   // ground opening stays a plain fit, with no mirrored invented arch.
   const dw=2.8;panel(q.v,mid-dw/2,0,4.2);panel(mid+dw/2,q.v+q.len,0,4.2);
   if(q.south){const centre=2.35,radius=dw/2,g=new G.Geometry();for(let k=0;k<28;k++){const a=-Math.PI/2+k*Math.PI/28,c=a+Math.PI/28,va=mid+radius*Math.sin(a),vc=mid+radius*Math.sin(c),ha=centre+radius*Math.cos(a),hc=centre+radius*Math.cos(c);g.quad(vertex(q.u-.02,ha,va),vertex(q.u-.02,hc,vc),vertex(q.u-.02,4.2,vc),vertex(q.u-.02,4.2,va));b.beam([q.u-.10,ha,va],[q.u-.10,hc,vc],.12,'#a6aa98',24);}add('041-southwest-ground-arch-masonry',g,'#858e84',24,id);b.box(q.u+.22,1.82,mid,.05,3.60,2.66,'#617a77',5);}
   else{panel(mid-dw/2,mid+dw/2,3.45,4.2);b.box(q.u+.22,1.75,mid,.05,3.4,2.66,'#617a77',5);}
   for(const z of[mid-dw/2,mid,mid+dw/2])b.box(q.u-.06,1.7,z,.17,3.4,.08,'#783d30',24);
   // Three solid stone balcony panels and open space behind their rail.
   b.box(q.u-.77,4.18,mid,1.58,.25,8.5,'#c5c4b2',24);
   for(const z of[mid-4.10,mid-1.37,mid+1.37,mid+4.10]){b.box(q.u-1.48,4.80,z,.23,1.3,.23,'#d2cebb',24);b.box(q.u-1.48,5.48,z,.27,.16,.27,'#d2cebb',24);}
   for(const z of[mid-2.74,mid,mid+2.74]){b.box(q.u-1.45,4.75,z,.17,.94,2.57,'#c5c4b2',24);b.box(q.u-1.55,4.75,z,.025,.70,2.29,'#b7bbaa',24);}for(const z of[mid-4.12,mid+4.12])b.box(q.u-.73,4.75,z,1.45,.94,.16,'#c5c4b2',24);
   for(const z of[mid-5.5,mid+5.5]){b.box(q.u-.06,11.08,z,.18,.16,1.5,'#d5d8cb',24);b.box(q.u-.06,4.68,z,.18,.14,1.45,'#d5d8cb',24);}
   for(const c of[{v:mid-2.7,w:2.35,h:11.35},{v:mid,w:3.25,h:11.85},{v:mid+2.7,w:2.35,h:11.35}]){
    b.box(q.u-.38,c.h-.16,c.v,.67,.24,c.w-.05,'#713e2d',24);b.box(q.u-.63,c.h+.01,c.v,.23,.10,c.w+.18,'#466b59',24);
    const g=new G.Geometry(),rise=t=>c.h+.12+.30*Math.pow(Math.abs(t),5);
    for(let k=0;k<24;k++){const a=-1+k/12,z=a+1/12;g.quad(vertex(q.u-1.10,rise(a),c.v+a*c.w/2),vertex(q.u-1.10,rise(z),c.v+z*c.w/2),vertex(q.u-.05,rise(z)+.28,c.v+z*c.w/2),vertex(q.u-.05,rise(a)+.28,c.v+a*c.w/2));}
    add('041-small-west-wall-rooflet-'+q.name+'-'+c.v,g,C.roof,2,id);
    for(let z=-c.w/2;z<=c.w/2;z+=.23){const y=rise(2*z/c.w);b.beam([q.u-1.12,y+.03,c.v+z],[q.u-.05,y+.31,c.v+z],.046,'#929e96',2);b.box(q.u-.68,c.h-.04,c.v+z,.45,.07,.10,'#466b59',24);}
   }
   b.box(q.u,H.low-.04,mid,.27,.12,q.len+.14,'#d5d8cb',24);
  });
 });
 return{strategy:'building041-v46',minimumAboveGroundFloors:5,basementPresent:true,topFloorFormVerified:false,westTopWindowBandVerified:true,sourceOutline:true,westLowRoofs:2,eastLowRoof:true,mainRoofNorthSouth:true,entranceDirectionVerified:true,decoratedEndDirectionVerified:true,entranceFace:'west',decoratedFaces:['northwest-wing-west','southwest-wing-west'],heightMeasured:false,eastFacadeStillUnverified:true,roofDimensionsFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building041={id:ID,render,world,local,pieces,heights:H,entrances,mainRoofBox};
})(YY);
