/* 159: the dated 2017 street panorama registers the broad blind west wall of
 * Weixiu 21. The other elevations retain their explicitly unverified display.
 * Five storeys are documented; the inherited display height is not surveyed. */
(function(Y){'use strict';
 const A=Y.Architecture30,prior=A.render,G=Y.Geo,ID='way/876533975';
 function render(b,f,add){
  const ring=f.geometry.coordinates[0],a=ring[0],c=ring[1],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;
  const oldWindow=b.window;let removedWindows=0,result;
  // Suppress only windows facing the registered west edge. The low red-eaved
  // house in front of it is a separate feature and is not absorbed here.
  b.window=function(x,y,z,w,h,r,...args){
   const along=((x-a[0])*dx+(z-a[1])*dz)/len;
   const distance=(x-a[0])*nx+(z-a[1])*nz;
   if(Math.sin(r)*nx+Math.cos(r)*nz>.999&&along>=-.1&&along<=len+.1&&Math.abs(distance)<.15){removedWindows++;return;}
   return oldWindow.call(this,x,y,z,w,h,r,...args);
  };
  try{result=prior(b,f,add);}finally{b.window=oldWindow;}
  const face=new G.Geometry(),at=(p,h)=>[p[0]+nx*.018,h,p[1]+nz*.018];
  face.quad(at(a,.30),at(c,.30),at(c,f.properties.height),at(a,f.properties.height));
  b.id=f.properties.pickId;b.mesh('159-west-blind-wall',face,0,0,0,1,1,1,'#bec0c3',38);
  return {...result,strategy:'building159-west-wall',westBlindWallVerified:true,removedWestWindows:removedWindows,otherFacadesVerified:false,heightMeasured:false,attachedVolumesVerified:false};
 }
 A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):prior(b,f,add);};
 Y.Building159={id:ID,render};
})(YY);
