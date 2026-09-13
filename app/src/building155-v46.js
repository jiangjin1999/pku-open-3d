/* Weixiuyuan 19: the west end is a blank grey wall with white storey bands.
   Two public 2015 views are registered by their camera positions and the
   18/19/20 row. Other faces retain the existing display fit; height is unmeasured. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,ID='way/876533971';
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const ring=f.geometry.coordinates[0],a=ring[0],c=ring[1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
 const ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,sign=F.area(ring)>0?1:-1,nx=uz*sign,nz=-ux*sign;
 const r=Math.atan2(nx,nz),cx=(a[0]+c[0])/2,cz=(a[1]+c[1])/2,H=f.properties.height,N=f.properties.floors;
 const local=b.local,window=b.window;
 const west=(x,z,angle)=>Math.abs((x-cx)*nx+(z-cz)*nz)<.8&&Math.abs(Math.sin((angle-r)/2))<.00001;
 let result;
 // Suppress only the original west-end opening grid and its generic bands.
 // The other three sides use the same existing renderer and detail thresholds.
 b.window=function(x,y,z,w,h,angle,col){if(!west(x,z,angle))return window.apply(this,arguments);};
 b.local=function(x,y,z,angle,fn){if(!west(x,z,angle))return local.apply(this,arguments);};
 try{result=previous.call(this,b,f,add);}finally{b.local=local;b.window=window;}
 const old=[b.origin,b.rotation,b.id,b.anim];b.id=f.properties.pickId;b.anim=0;
 try{
  const wall=new Y.Geo.Geometry(),d=.016;
  wall.quad([a[0]+nx*d,.30,a[1]+nz*d],[c[0]+nx*d,.30,c[1]+nz*d],
   [c[0]+nx*d,H,c[1]+nz*d],[a[0]+nx*d,H,a[1]+nz*d]);
  add('155-observed-blank-west-wall',wall,'#777a78',24,f.properties.pickId);
  b.local(cx,0,cz,r,()=>{
   // Band widths and projection are image fits, not survey measurements.
   for(const x of [-len/2+.16,0,len/2-.16])b.box(x,H/2,.09,.27,H,.16,'#d9dad3',24);
   const fh=(H-.55)/N;
   for(let j=1;j<N;j++)b.box(0,.55+j*fh,.10,len,.20,.18,'#d9dad3',24);
   b.box(0,H+.07,.07,len+.18,.22,.34,'#d0d1c9',24);
  });
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {...result,strategy:'building155-v46',westEndObserved:true,westEndOpenings:0,allFacadesVerified:false};
}
Y.Building155={id:ID,observedDate:'2015-03-29',heightMeasured:false};A.render=render;
})(YY);
