/* Langrunyuan 12: documented four storeys and a straight hipped ridge.
 * The existing footprint, eave/ridge heights and tile material are retained.
 * Facade bays and entrances remain unverified approximations. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/873446760';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous(b,f,add);
 let roofColor,roofMaterial;
 const result=previous(b,f,(key,geometry,color,material,id)=>{
  if(key.startsWith('v30-roof-'+f.properties.pickId+'-')){roofColor=color;roofMaterial=material;return;}
  if(key.startsWith('v30-roof-ends-'+f.properties.pickId+'-'))return;
  add(key,geometry,color,material,id);
 });
 const ring=f.geometry.coordinates[0],p=ring.slice(0,4),eave=result.bodyHeight,ridge=eave+result.roofRise;
 const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2),west=midpoint(p[0],p[1]),east=midpoint(p[2],p[3]);
 const length=Math.hypot(east[0]-west[0],east[1]-west[1]),halfDepth=Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1])/2;
 const inset=halfDepth/length,at=t=>[west[0]+(east[0]-west[0])*t,ridge,west[1]+(east[1]-west[1])*t];
 const a=at(inset),c=at(1-inset),corners=p.map(q=>[q[0],eave,q[1]]);
 const faces=[[corners[0],corners[1],a],[corners[1],corners[2],c,a],[corners[2],corners[3],c],[corners[3],corners[0],a,c]];
 faces.forEach((points,i)=>{
  const geometry=new Y.Geo.Geometry();
  for(let j=1;j<points.length-1;j++)geometry.tri(points[0],points[j],points[j+1]);
  add('073-roof-'+i,geometry,roofColor,roofMaterial,f.properties.pickId);
 });
 return {...result,strategy:'building073-v46',roof:'hip-straight-ridge'};
};
})(YY);
