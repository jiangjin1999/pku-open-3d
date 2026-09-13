/* 156, Weixiu 17 apartment: five-storey flat-roof bar.
 * The 2023 housing list fixes five floors; the 2024 parking photograph fixes
 * the north face, four stair strips and white wall grid. Absolute heights and
 * the less visible south/west faces remain fitted and explicitly unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/876533972';
const O=[-790.156,-270.558],R=Math.atan2(1.876,64.821),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(64.821,1.876),D=11.064;
const H={base:.24,floor:2.94,eave:14.94,parapet:15.24},C={wall:'#aba99f',frame:'#e4e3da',glass:'#657775',roof:'#8f968c',door:'#968574',base:'#777e74'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
// East-to-west photograph: stair strips occur after three regular bays in
// each five-bay rhythm. Reversed here because x increases west-to-east.
const stairBays=[1,6,11,16],northBayCount=20;
function render(b,f){b.id=f.properties.pickId;const ring=f.geometry.coordinates[0].slice(0,-1).map(local),bay=W/northBayCount;
 const mesh=(name,g,c,mat=24)=>b.mesh('156-'+name,g,0,0,0,1,1,1,c,mat),group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'156-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 function face(name,a,c,holes){const width=Math.hypot(c[0]-a[0],c[1]-a[1]);b.local(a[0],0,a[1],-Math.atan2(c[1]-a[1],c[0]-a[0]),()=>group(name,()=>{
  const ys=[H.base,H.eave,...holes.flatMap(h=>[h.lo,h.hi])].filter((v,i,s)=>s.indexOf(v)===i).sort((a,b)=>a-b);
  for(let j=1;j<ys.length;j++){const lo=ys[j-1],hi=ys[j],cuts=holes.filter(h=>h.lo<=lo+.0001&&h.hi>=hi-.0001).sort((a,b)=>a.x-b.x);let at=0;
   const wall=(l,r)=>{if(r>l)b.box((l+r)/2,(lo+hi)/2,-.16,r-l,hi-lo,.32,C.wall,24);};for(const h of cuts){wall(at,h.x-h.w/2);at=h.x+h.w/2;}wall(at,width);
  }
  for(const h of holes){const cy=(h.lo+h.hi)/2,hh=h.hi-h.lo;b.box(h.x,cy,-.10,h.w,hh,.05,h.door?C.door:C.glass,h.door?24:5);
   const panes=h.stair?2:3;for(let j=0;j<=panes;j++)b.box(h.x-h.w/2+h.w*j/panes,cy,.012,.06,hh+.06,.15,C.frame,24);for(const yy of[h.lo,h.hi])b.box(h.x,yy,.015,h.w+.08,.065,.16,C.frame,24);
   if(!h.door)b.box(h.x,h.lo-.05,.07,h.w+.18,.09,.24,C.frame,24);
  }
 }));}
 b.local(O[0],0,O[1],R,()=>{
  mesh('original-footprint-base',G.polygon(ring,H.base),C.base);mesh('original-flat-roof',G.polygon(ring,H.eave),C.roof);
  const north=[];
  for(let i=0;i<northBayCount;i++)for(let floor=0;floor<5;floor++){const stair=stairBays.includes(i),y=H.base+floor*H.floor;north.push({x:(i+.5)*bay,w:stair?.94:1.70,lo:floor===0&&stair?H.base:y+.78,hi:y+(stair?2.40:2.20),stair,door:floor===0&&stair});}
  // Reverse ring direction so the north wall's detail projects northward.
  face('north-photo-openings',ring[3],ring[0],north.map(h=>({...h,x:W-h.x})));
  // These modest window schedules are fitted, not promoted to photographic
  // facts. The unverified faces do not gain invented balcony volumes.
  const fitted=(width,count)=>Array.from({length:count*5},(_,j)=>{const y=H.base+Math.floor(j/count)*H.floor;return{x:width*(j%count+.5)/count,w:Math.min(1.65,width/count*.58),lo:y+.82,hi:y+2.18};});
  face('south-unverified-fitted',ring[1],ring[2],fitted(W,20));
  face('east-partly-visible-fitted',ring[2],ring[3],fitted(D,3));
  face('west-unverified-fitted',ring[0],ring[1],fitted(D,3));
  group('north-white-grid',()=>{for(let j=0;j<=northBayCount;j++)b.box(j*bay,(H.base+H.eave)/2,-.055,.17,H.eave-H.base,.15,C.frame,24);
   for(let floor=0;floor<=5;floor++){const y=H.base+floor*H.floor;for(let i=0;i<northBayCount;i++){if(floor===0&&stairBays.includes(i))continue;b.box((i+.5)*bay,y,-.055,bay,.15,.15,C.frame,24);}}
   for(const i of stairBays){const x=(i+.5)*bay;b.box(x,2.79,-.44,1.62,.12,.9,C.frame,24);b.box(x,.15,-.38,1.48,.30,.75,C.base,24);}
  });
  group('roof-low-edge',()=>{for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],len=Math.hypot(q[0]-p[0],q[1]-p[1]);b.local(p[0],0,p[1],-Math.atan2(q[1]-p[1],q[0]-p[0]),()=>b.box(len/2,(H.eave+H.parapet)/2,0,len,H.parapet-H.eave,.18,C.frame,24));}});
 });
 return{id:ID,strategy:'building156-v46',floors:5,roof:'flat',northBaysFitted:20,northStairStripsObserved:4,northFacePhoto:true,sourceOutline:true,heightMeasured:false,southFacadeVerified:false,westFacadeVerified:false,allFacadesVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building156={id:ID,render,local,world,H,stairBays,northBayCount};
})(YY);
