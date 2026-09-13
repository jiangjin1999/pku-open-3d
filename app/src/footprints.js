/* Exact even-odd polygon tessellation. All coordinates remain in source metres. */
(function(Y){'use strict';
const EPS=1e-8;
function polygons(g){return g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[]}
function area(r){let a=0;for(let i=1;i<r.length;i++)a+=r[i-1][0]*r[i][1]-r[i][0]*r[i-1][1];return a/2}
function insideRing(p,r){let hit=false;for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit}
function inside(p,g){return polygons(g).some(poly=>insideRing(p,poly[0])&&!poly.slice(1).some(r=>insideRing(p,r)))}
function capTriangles(poly){
 const ys=[...new Set(poly.flat().map(p=>p[1]))].sort((a,b)=>a-b),edges=poly.flatMap(r=>r.slice(1).map((p,i)=>[r[i],p])).filter(([a,b])=>Math.abs(a[1]-b[1])>EPS),out=[];
 const xAt=(e,y)=>e[0][0]+(e[1][0]-e[0][0])*(y-e[0][1])/(e[1][1]-e[0][1]);
 const push=(a,b,c)=>{const cross=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);if(Math.abs(cross)>EPS)out.push(cross>0?[a,c,b]:[a,b,c]);};
 for(let i=1;i<ys.length;i++){let lo=ys[i-1],hi=ys[i],mid=(lo+hi)/2;if(hi-lo<EPS)continue;let active=edges.filter(([a,b])=>Math.min(a[1],b[1])<mid&&Math.max(a[1],b[1])>mid).sort((a,b)=>xAt(a,mid)-xAt(b,mid));if(active.length%2)throw Error('Unpaired polygon edge');for(let j=0;j<active.length;j+=2){const l=active[j],r=active[j+1],a=[xAt(l,lo),lo],b=[xAt(r,lo),lo],c=[xAt(r,hi),hi],d=[xAt(l,hi),hi];push(a,b,c);push(a,c,d);}}
 return out;
}
function surface(g,height=0){const mesh=new Y.Geo.Geometry();for(const poly of polygons(g))for(const tri of capTriangles(poly))mesh.tri(...tri.map(p=>[p[0],height,p[1]]));return mesh}
function walls(g,base,height){const mesh=new Y.Geo.Geometry();for(const poly of polygons(g))poly.forEach((ring,ri)=>{const reverse=(area(ring)>0)!==(ri>0);for(let i=1;i<ring.length;i++){let a=ring[i-1],b=ring[i];if(reverse)[a,b]=[b,a];mesh.quad([a[0],base,a[1]],[b[0],base,b[1]],[b[0],height,b[1]],[a[0],height,a[1]]);}});return mesh}
function distSegment(p,a,b){let dx=b[0]-a[0],dz=b[1]-a[1],l=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(l||1)));return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dz*t)}
function flat(v){return typeof v[0]==='number'?[v]:v.flatMap(flat)}
Y.Footprints={polygons,area,insideRing,inside,capTriangles,surface,walls,distSegment,flat};
if(typeof module!=='undefined')module.exports=Y.Footprints;
})(YY);
/* Subdivide source caps for a roof profile without changing any plan coordinates. */
(function(Y){const F=Y.Footprints;
function profiledSurface(g,profile,step=4){const mesh=new Y.Geo.Geometry();function push(a,b,c,depth=0){const ds=[Math.hypot(a[0]-b[0],a[1]-b[1]),Math.hypot(b[0]-c[0],b[1]-c[1]),Math.hypot(c[0]-a[0],c[1]-a[1])];if(Math.max(...ds)<=step||depth>=12){mesh.tri(...[a,b,c].map(p=>[p[0],profile(p),p[1]]));return}const ab=[(a[0]+b[0])/2,(a[1]+b[1])/2],bc=[(b[0]+c[0])/2,(b[1]+c[1])/2],ca=[(c[0]+a[0])/2,(c[1]+a[1])/2];push(a,ab,ca,depth+1);push(ab,b,bc,depth+1);push(ca,bc,c,depth+1);push(ab,bc,ca,depth+1)}for(const pg of F.polygons(g))for(const t of F.capTriangles(pg))push(...t);return mesh}
F.profiledSurface=profiledSurface;
})(YY);
