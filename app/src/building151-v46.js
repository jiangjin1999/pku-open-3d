/* 151: the registered north shop frontage, two-storey east return and west stair.
 * 2013/2017 panoramas register the original ring; 2025 repeats the east corner.
 * Heights, front-gallery depth and window rhythm are proportional fits. The
 * unobserved south elevations and internal floor divisions remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,F=Y.Footprints,G=Y.Geo,ID='way/849765899';
const O=[-815.419,-132.475],R=Math.atan2(.977,43.181),CO=Math.cos(R),SI=Math.sin(R);
const local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const H={base:.12,front:3.5,split:3.2,main:7.3},C={wall:'#dddeda',stone:'#b2aaa1',red:'#a35645',roof:'#858c87',glass:'#607b7e',frame:'#a9b0aa',dark:'#354749'};
function parts(f){const g={type:'Polygon',coordinates:f.geometry.coordinates.map(r=>r.map(local))};return {g,front:A.clipGeometry(g,[-100,-100,100,H.split]),main:A.clipGeometry(g,[-100,H.split,100,100])};}
function render(b,f){
 b.id=f.properties.pickId;const q=parts(f);
 const mesh=(key,g,c,mat=24)=>b.mesh('151-'+key,g,0,0,0,1,1,1,c,mat);
 const group=(key,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'151-'+key+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 function wall(key,a,c,height,holes=[],bottom=H.base,trim=true){
  const w=Math.hypot(c[0]-a[0],c[1]-a[1]),rot=-Math.atan2(c[1]-a[1],c[0]-a[0]);
  b.local(a[0],0,a[1],rot,()=>{
   const levels=[bottom,height,...holes.flatMap(h=>[h.lo,h.hi])].filter(v=>v>=bottom&&v<=height).filter((v,i,s)=>s.indexOf(v)===i).sort((a,c)=>a-c);
   group(key,()=>{
    for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(h=>h.lo<=lo+1e-8&&h.hi>=hi-1e-8).sort((a,c)=>a.x-c.x);let p=0;
     const piece=(a,c)=>{if(c>a+1e-7)b.box((a+c)/2,(lo+hi)/2,-.13,c-a,hi-lo,.26,hi<.7?C.stone:C.wall,24);};
     for(const h of cuts){piece(p,h.x-h.w/2);p=h.x+h.w/2;}piece(p,w);
    }
    for(const h of holes){const y=(h.lo+h.hi)/2,hh=h.hi-h.lo;b.box(h.x,y,-.10,h.w,hh,.045,h.door?C.dark:C.glass,28);
     const count=h.continuous?Math.max(1,Math.round(h.w/1.6)):3;
     for(let k=0;k<=count;k++)b.box(h.x-h.w/2+h.w*k/count,y,.024,.07,hh+.06,.15,C.frame,29);
     for(const yy of[h.lo,h.lo+hh*.70,h.hi])b.box(h.x,yy,.025,h.w+.07,.075,.16,C.frame,29);
    }
    if(trim){b.box(w/2,height-.28,.013,w,.56,.14,C.red,24);if(height>6&&bottom<3)b.box(w/2,3.65,.015,w,.38,.16,C.red,24);}
   });
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  mesh('original-base',F.surface(q.g,H.base),C.stone);mesh('low-front-flat-roof',F.surface(q.front,H.front),C.roof,22);mesh('two-storey-flat-roof',F.surface(q.main,H.main),C.roof,22);
  for(const [name,g,h]of[['front',q.front,H.front],['main',q.main,H.main]])for(const pg of F.polygons(g))for(const ring of pg)for(let i=1;i<ring.length;i++){
   const a=ring[i-1],c=ring[i],w=Math.hypot(c[0]-a[0],c[1]-a[1]);
   const step=Math.abs(a[1]-H.split)<1e-7&&Math.abs(c[1]-H.split)<1e-7;
   if(name==='front'&&step)continue;
   if(name==='main'&&step){wall('north-upper-strip',a,c,h,[{x:w/2,w:w-.6,lo:4.55,hi:6.56,continuous:true}],H.front);continue;}
   if(name==='front'){
    const holes=w>3?[{x:w/2,w:w-.35,lo:.70,hi:3.24,continuous:true}]:[];
    wall('low-glass-'+i,a,c,h,holes,H.base,false);
    continue;
   }
   const holes=[];if(w>3.4){const count=Math.max(1,Math.floor(w/4.35)),stride=w/count;for(let floor=0;floor<2;floor++)for(let k=0;k<count;k++)holes.push({x:(k+.5)*stride,w:Math.min(2.55,stride*.66),lo:floor?4.65:1.10,hi:floor?6.38:2.96});}
   wall('body-'+i,a,c,h,holes);
  }
  // The glazed vestibule and landing are fitted within the registered north edge.
  group('north-entry',()=>{
   const x=22.6,w=3.15;b.box(x,1.78,-.10,w,3.18,.14,C.dark,28);
   for(const xx of[x-w/2,x,x+w/2])b.box(xx,1.78,-.20,.08,3.18,.13,C.frame,29);
   b.box(x,3.34,-.25,3.55,.15,.65,C.frame,29);
   for(let i=0;i<3;i++)b.box(x,.10+i*.13,-.42+i*.13,3.55,.20+i*.26,.30,C.stone,24);
  });
  // The west-side stair rises toward the southern upper landing, directly seen.
  group('west-exterior-stair',()=>{
   const n=16,z0=3.65,run=7.0,w=1.50;
   for(let i=0;i<n;i++){const h=.12+(i+1)*3.42/n;b.box(-w/2,h/2,z0+run*(i+.5)/n,w,h,run/n+.015,C.red,24);}
   for(const x of[-w,-.03]){b.beam([x,1.0,z0],[x,4.42,z0+run],.055,C.frame,29);for(let i=0;i<=n;i+=2){const z=z0+run*i/n,y=.12+3.42*i/n;b.box(x,y+.45,z,.045,.90,.045,C.frame,29);}}
  });
 });
 return {id:ID,strategy:'building151-v46',originalOutline:true,observedStoreys:2,frontGalleryHeight:H.front,bodyHeight:H.main,frontGalleryDepth:H.split,heightsMeasured:false,completeSouthFacadeVerified:false,internalFloorsVerified:false,windowsProportionalFit:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):prior(b,f,add);};Y.Building151={id:ID,render,parts,local,heights:H};
})(YY);
