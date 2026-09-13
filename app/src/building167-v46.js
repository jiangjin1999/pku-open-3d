/* 167: the west gable is blank in registered 2015/2016 public panoramas.
   Its base is screened by a nearer shed. Correct only the clearly visible upper
   half; retain the existing unverified height, lower openings and other faces. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/876533990';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const ring=f.geometry.coordinates[0],a=ring[1],c=ring[2],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz),height=f.properties.height;
 const original=b.window,owned=Object.prototype.hasOwnProperty.call(b,'window');let omitted=0;
 b.window=function(x,y,z,...args){
  const along=((x-a[0])*dx+(z-a[1])*dz)/length,distance=Math.abs((x-a[0])*dz-(z-a[1])*dx)/length;
  // This is a visibility boundary within the retained display estimate, not a
  // measured storey division. No total floor count is inferred from wall panels.
  if(distance<.12&&along>=0&&along<=length&&y>=height*.5){omitted++;return;}
  return original.call(this,x,y,z,...args);
 };
 try{
  const result=A.footprint(b,f,add);
  return{...result,strategy:'building167-observed-upper-west-gable',omittedTemplateWindows:omitted,sourceOutline:true,heightMeasured:false,storeysVerified:false,lowerWestWallVerified:false,otherFacadesVerified:false};
 }finally{if(owned)b.window=original;else delete b.window;}
};
Y.Building167={id:ID,scope:'upper-west-gable-template-windows-only',observationDates:['2015-03-29','2016-01-07'],heightMeasured:false};
})(YY);
