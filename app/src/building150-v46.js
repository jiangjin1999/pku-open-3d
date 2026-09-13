/* Changchunyuan 51: six storeys independently documented in the municipal
   building records. The registered 2017 river-road views show a red west end
   and red spandrel bands between white-framed north windows. Their dimensions
   are photo fits; the existing opening rhythm is still explicitly unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,ID='way/849765898';
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const ring=f.geometry.coordinates[0],sign=F.area(ring)>0?1:-1;
 const northAngle=Math.atan2((ring[1][1]-ring[0][1])*sign,-(ring[1][0]-ring[0][0])*sign),box=b.box;
 // The inherited projecting floor beams occupy the observed red spandrel zone.
 // Colour those existing north beams as well as the backing strip; otherwise
 // they mask the photo-supported bands. Other faces and all dimensions stay.
 b.box=function(x,y,z,w,h,d,col,...rest){
  const north=Math.cos(this.rotation-northAngle)>.9999;
  const beam=(Math.abs(h-.38)<1e-8&&Math.abs(d-.42)<1e-8)||(Math.abs(h-.08)<1e-8&&Math.abs(d-.29)<1e-8)||(Math.abs(h-.13)<1e-8&&Math.abs(d-.11)<1e-8);
  return box.call(this,x,y,z,w,h,d,north&&beam?'#a4634e':col,...rest);
 };
 let result;
 try{result=previous.call(this,b,f,(key,g,col,mat,id)=>add(key,g,key.startsWith('v30-walls-')?'#d4d5cb':col,mat,id));}
 finally{b.box=box;}
 const body=result.bodyHeight,id=f.properties.pickId,old=[b.origin,b.rotation,b.id,b.anim];
 b.id=id;b.anim=0;
 try{
  for(const edgeIndex of [0,3]){
   const a=ring[edgeIndex],c=ring[edgeIndex+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,r=Math.atan2(nx,nz);
   b.local((a[0]+c[0])/2+nx*.008,0,(a[1]+c[1])/2+nz*.008,r,()=>{
    if(edgeIndex===3)b.box(0,(body+.30)/2,0,len,body-.30,.015,'#995b48',24);
    else for(let floor=1;floor<6;floor++)b.box(0,.55+floor*(body-.55)/6-.05,.015,len,.74,.020,'#a4634e',24);
   });
  }
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{...result,strategy:'building150-v46',observedNorthSpandrelBands:true,observedWestRedWall:true,facadeBaysVerified:false};
}
Y.Building150={id:ID,documentedFloors:6,bandHeightFit:.74};A.render=render;
})(YY);
