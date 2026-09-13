/* Local openings for photographed sunken courts. Source map polygons remain untouched. */
(function(Y){'use strict';
const F=Y.Footprints;
function bounds(r){return [Math.min(...r.map(p=>p[0])),Math.min(...r.map(p=>p[1])),Math.max(...r.map(p=>p[0])),Math.max(...r.map(p=>p[1]))];}
function overlap(a,b){return a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];}
function crosses(a,b){
 const side=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 for(let i=1;i<a.length;i++)for(let j=1;j<b.length;j++)if(side(a[i-1],a[i],b[j-1])*side(a[i-1],a[i],b[j])<0&&side(b[j-1],b[j],a[i-1])*side(b[j-1],b[j],a[i])<0)return true;
 return false;
}
function geometry(source,cuts){
 if(!cuts.length)return source;
 const polygons=F.polygons(source).map(poly=>{
  const added=[],extent=bounds(poly[0]);
  for(const cut of cuts){
   const ring=cut.excavationRing||cut.ring;if(!overlap(extent,bounds(ring)))continue;
   // This integration is deliberately scoped to courts wholly inside a ground patch.
   // A later court crossing a patch boundary needs polygon clipping, never silent omission.
   const inside=ring.slice(0,-1).map(p=>F.insideRing(p,poly[0]));
   if(!inside.some(Boolean)&&!poly[0].some(p=>F.insideRing(p,ring))&&!crosses(ring,poly[0]))continue;
   if(!inside.every(Boolean))throw Error('Ground cut partially crosses ground patch');
   if(poly.slice(1).some(h=>ring.slice(0,-1).every(p=>F.insideRing(p,h))))continue;
   if(poly.slice(1).some(h=>overlap(bounds(h),bounds(ring))))throw Error('Ground cut partially crosses existing hole');
   added.push(ring);
  }
  return [...poly,...added];
 });
 return {type:'MultiPolygon',coordinates:polygons};
}
function plate(b,add,rect,cuts,index){
 const [x,z,w,d]=rect,source={type:'Polygon',coordinates:[[[x,z],[x+w,z],[x+w,z+d],[x,z+d],[x,z]]]},g=geometry(source,cuts);
 if(F.polygons(g)[0].length===1){b.box(x+w/2,-1.1,z+d/2,w,1.8,d,'#e2e3d8',13);return;}
 add('ground-plate-'+index+'-top',F.surface(g,-.2),'#e2e3d8',13,999999);
 add('ground-plate-'+index+'-sides',F.walls(g,-2,-.2),'#e2e3d8',13,999999);
}
Y.GroundCuts46={geometry,plate};
})(YY);
