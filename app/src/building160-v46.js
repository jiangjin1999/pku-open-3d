/* 160: four light rectangular roof-surface zones seen in native winter imagery.
 * Only the plan arrangement and surface colour are reproduced. These are not
 * asserted to be skylights, equipment or extra rooms. Elevations and the old
 * four-storey body remain unverified; this module does not invent their form. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,ID='way/876533976';
// Normalized to the original west-end ring; north pair shorter than south pair.
const zones=[['nw',.10,.42,.10,.35],['ne',.52,.87,.09,.34],['sw',.09,.45,.53,.88],['se',.54,.88,.55,.88]];
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const result=previous.call(this,b,f,add),r=f.geometry.coordinates[0],H=f.properties.height,id=f.properties.pickId;
 const point=(u,v)=>[r[0][0]+(r[3][0]-r[0][0])*u+(r[1][0]-r[0][0])*v,r[0][1]+(r[3][1]-r[0][1])*u+(r[1][1]-r[0][1])*v];
 for(const [name,x0,x1,z0,z1] of zones){
  const a=point(x0,z0),c=point(x0,z1),d=point(x1,z1),e=point(x1,z0),g={type:'Polygon',coordinates:[[a,c,d,e,a]]};
  // A 15 mm render offset prevents coplanar flicker; it is not a measured step.
  add('160-observed-roof-zone-'+name,F.surface(g,H+.015),'#b9bcb2',22,id);
 }
 return {...result,strategy:'building160-observed-roof-zones-v46',roofZoneCount:4,roofZonePlanObserved:true,zoneHeightVerified:false,zoneFunctionVerified:false,storeysVerified:false,facadesVerified:false,sourceOutline:true};
}
Y.Building160={id:ID,render,zones};A.render=render;
})(YY);
