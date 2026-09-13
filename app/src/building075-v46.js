/* Langrunyuan 10: four documented storeys, original eaves and footprint.
 * Intersections of the four edge-distance planes keep the slightly skewed
 * OSM quadrilateral watertight without snapping its corners to a rectangle.
 * Facades, entrances and roof fittings remain unverified approximations. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/873446762';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous(b,f,add);
 let color,material;
 const result=previous(b,f,(key,g,c,m,id)=>{
  if(key.startsWith('v30-roof-'+f.properties.pickId+'-')){color=c;material=m;return;}
  if(key.startsWith('v30-roof-ends-'+f.properties.pickId+'-'))return;
  add(key,g,c,m,id);
 });
 const p=f.geometry.coordinates[0].slice(0,4),eave=result.bodyHeight;
 const planes=p.map((a,i)=>{const z=p[(i+1)%4],dx=z[0]-a[0],dz=z[1]-a[1],length=Math.hypot(dx,dz),nx=dz/length,nz=-dx/length;return[nx,nz,-nx*a[0]-nz*a[1]];});
 function junction(i,j,k){
  const a=planes[i].map((v,n)=>v-planes[j][n]),c=planes[i].map((v,n)=>v-planes[k][n]),det=a[0]*c[1]-c[0]*a[1];
  const x=(a[1]*c[2]-c[1]*a[2])/det,z=(c[0]*a[2]-a[0]*c[2])/det;
  return[x,planes[i][0]*x+planes[i][1]*z+planes[i][2],z];
 }
 const west=junction(0,1,3),east=junction(2,1,3),slope=result.roofRise/Math.max(west[1],east[1]);
 const a=[west[0],eave+west[1]*slope,west[2]],c=[east[0],eave+east[1]*slope,east[2]],q=p.map(v=>[v[0],eave,v[1]]);
 [[q[0],q[1],a],[q[1],q[2],c,a],[q[2],q[3],c],[q[3],q[0],a,c]].forEach((points,i)=>{
  const g=new Y.Geo.Geometry();for(let j=1;j<points.length-1;j++)g.tri(points[0],points[j],points[j+1]);
  add('075-roof-'+i,g,color,material,f.properties.pickId);
 });
 return {...result,strategy:'building075-v46',roof:'hip-planar-edge-intersections'};
};
})(YY);
