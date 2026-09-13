/* Reuse source architecture in the new metre frame; never reintroduce old campus coordinates. */
(function(Y){'use strict';const F=Y.Footprints,M=Y.M,G=Y.Geo,EPS=1e-6,geoBounds=new WeakMap();
function frame(geometry,preferred=0){
 const rings=F.polygons(geometry).map(p=>p[0]),points=rings.flat(),candidates=[];
 for(const ring of rings)for(let i=1;i<ring.length;i++){
  const a=ring[i-1],b=ring[i];if(Math.hypot(b[0]-a[0],b[1]-a[1])<2)continue;
  for(let k=0;k<4;k++){
   const r=-Math.atan2(b[1]-a[1],b[0]-a[0])+k*Math.PI/2,c=Math.cos(r),s=Math.sin(r),xs=points.map(p=>c*p[0]-s*p[1]),zs=points.map(p=>s*p[0]+c*p[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),x=(x0+x1)/2,z=(z0+z1)/2;
   candidates.push({r,w:x1-x0,d:z1-z0,centre:[c*x+s*z,-s*x+c*z],area:(x1-x0)*(z1-z0),angle:Math.abs(Math.atan2(Math.sin(r-preferred),Math.cos(r-preferred)))});
  }
 }
 const area=Math.min(...candidates.map(x=>x.area));return candidates.filter(x=>x.area<area*1.025).sort((a,b)=>a.angle-b.angle)[0];
}
function frameAt(g,r){const pts=F.polygons(g).map(p=>p[0]).flat(),c=Math.cos(r),s=Math.sin(r),xs=pts.map(p=>c*p[0]-s*p[1]),zs=pts.map(p=>s*p[0]+c*p[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),x=(x0+x1)/2,z=(z0+z1)/2;return {r,w:x1-x0,d:z1-z0,centre:[c*x+s*z,-s*x+c*z]};}
function bounds(geo){if(geoBounds.has(geo))return geoBounds.get(geo);const a=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<geo.v.length;i+=8)for(let j=0;j<3;j++){a[j]=Math.min(a[j],geo.v[i+j]);a[j+3]=Math.max(a[j+3],geo.v[i+j]);}geoBounds.set(geo,a);return a;}
function transformedBounds(geo,m){const a=bounds(geo),out=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const x of[a[0],a[3]])for(const y of[a[1],a[4]])for(const z of[a[2],a[5]]){const p=M.apply(m,[x,y,z,1]);for(let j=0;j<3;j++){out[j]=Math.min(out[j],p[j]);out[j+3]=Math.max(out[j+3],p[j]);}}return out;}
function boundary(geometry){return F.polygons(geometry).flatMap(p=>p.flatMap(r=>r.slice(1).map((b,i)=>[r[i],b])));}
function contains(p,g,edges,tol=.015){return F.inside(p,g)||edges.some(e=>F.distSegment(p,...e)<=tol);}
function bboxInside(bb,g,edges){
 const x0=bb[0],z0=bb[2],x1=bb[3],z1=bb[5],corners=[[x0,z0],[x1,z0],[x1,z1],[x0,z1]];
 if(!corners.every(p=>contains(p,g,edges)))return false;
 // No boundary segment may enter the rectangle's open interior (including courtyard boundaries).
 for(const[a,b]of edges){const loX=Math.min(a[0],b[0]),hiX=Math.max(a[0],b[0]),loZ=Math.min(a[1],b[1]),hiZ=Math.max(a[1],b[1]);if(hiX<=x0+EPS||loX>=x1-EPS||hiZ<=z0+EPS||loZ>=z1-EPS)continue;
  let t0=0,t1=1;const dx=b[0]-a[0],dz=b[1]-a[1];for(const [p,q] of [[-dx,a[0]-x0],[dx,x1-a[0]],[-dz,a[1]-z0],[dz,z1-a[1]]]){if(Math.abs(p)<EPS){if(q<0){t0=2;break;}}else{const t=q/p;if(p<0)t0=Math.max(t0,t);else t1=Math.min(t1,t);}}
  if(t0<t1-EPS){const t=(t0+t1)/2,x=a[0]+dx*t,z=a[1]+dz*t;if(x>x0+EPS&&x<x1-EPS&&z>z0+EPS&&z<z1-EPS)return false;}
 }
 return true;
}
function clipTriangle(vertices,triangle){let out=vertices;const sign=F.area([...triangle,triangle[0]])>=0?1:-1;
 for(let i=0;i<3;i++){const a=triangle[i],b=triangle[(i+1)%3],side=v=>sign*((b[0]-a[0])*(v[2]-a[1])-(b[1]-a[1])*(v[0]-a[0]));const input=out;out=[];if(!input.length)break;
  for(let k=0;k<input.length;k++){const p=input[k],q=input[(k+1)%input.length],dp=side(p),dq=side(q),pin=dp>=-EPS,qin=dq>=-EPS;if(pin)out.push(p);if(pin!==qin){const t=dp/(dp-dq);out.push(p.map((v,j)=>v+(q[j]-v)*t));}}
 }
 return out;
}
function bakeClipped(geo,m,shape,groups,color,params,uv=[0,0,1,1]){
 const detailWidth=(geo.detailWidth||0)*Math.min(...[0,4,8].map(k=>Math.hypot(m[k],m[k+1],m[k+2])));
 const groupKey=color+'|'+params[0]+'|'+detailWidth,out=groups.get(groupKey)||{geo:new G.Geometry(),color,params};if(detailWidth)out.geo.detailWidth=detailWidth;groups.set(groupKey,out);
 const inv=M.inverse(m),normal=n=>M.norm([inv[0]*n[0]+inv[1]*n[1]+inv[2]*n[2],inv[4]*n[0]+inv[5]*n[1]+inv[6]*n[2],inv[8]*n[0]+inv[9]*n[1]+inv[10]*n[2]]);
 for(let i=0;i<geo.v.length;i+=24){const vs=[];for(let k=0;k<3;k++){const a=geo.v.slice(i+k*8,i+k*8+8),p=M.apply(m,[...a.slice(0,3),1]),n=normal(a.slice(3,6));vs.push([...p.slice(0,3),...n,uv[0]+a[6]*uv[2],uv[1]+a[7]*uv[3]]);}const bx=[Math.min(...vs.map(v=>v[0])),Math.min(...vs.map(v=>v[2])),Math.max(...vs.map(v=>v[0])),Math.max(...vs.map(v=>v[2]))];
  for(const part of shape){if(part.bb[2]<bx[0]-EPS||part.bb[0]>bx[2]+EPS||part.bb[3]<bx[1]-EPS||part.bb[1]>bx[3]+EPS)continue;const clipped=clipTriangle(vs,part.tri);for(let k=1;k<clipped.length-1;k++){const t=[clipped[0],clipped[k],clipped[k+1]],cross=M.cross(M.sub(t[1].slice(0,3),t[0].slice(0,3)),M.sub(t[2].slice(0,3),t[0].slice(0,3)));if(Math.hypot(...cross)<1e-7)continue;for(const v of t)out.geo.vertex(v.slice(0,3),M.norm(v.slice(3,6)),v.slice(6,8));}}
 }
}
// Close the vertical cuts made by a mapped boundary through a sloped roof.
// Only callers that explicitly provide a supporting wall height use this.
// Existing pitched triangles and glazing are neither moved nor flattened.
function roofCutFaces(geo,m,g,edges,base,out){
 for(let i=0;i<geo.v.length;i+=24){
  const vs=[0,8,16].map(k=>M.apply(m,[geo.v[i+k],geo.v[i+k+1],geo.v[i+k+2],1]).slice(0,3));
  for(const [a,b]of edges){
   const dx=b[0]-a[0],dz=b[1]-a[1],ll=dx*dx+dz*dz;if(ll<EPS)continue;
   const side=p=>dx*(p[2]-a[1])-dz*(p[0]-a[0]),hits=[];
   for(let k=0;k<3;k++){const p=vs[k],q=vs[(k+1)%3],dp=side(p),dq=side(q);if(Math.abs(dp)<EPS)hits.push(p);if(dp*dq<-EPS*EPS){const t=dp/(dp-dq);hits.push(p.map((v,j)=>v+(q[j]-v)*t));}}
   const ts=hits.map(p=>({p,t:((p[0]-a[0])*dx+(p[2]-a[1])*dz)/ll})).sort((a,b)=>a.t-b.t);
   if(ts.length<2)continue;const lo=ts[0],hi=ts[ts.length-1],s=Math.max(0,lo.t),e=Math.min(1,hi.t);if(e-s<EPS)continue;
   const at=t=>[a[0]+dx*t,lo.p[1]+(hi.p[1]-lo.p[1])*(t-lo.t)/(hi.t-lo.t),a[1]+dz*t];
   const p=at(s),q=at(e);if(Math.max(p[1],q[1])<=base+EPS)continue;
   const len=Math.sqrt(ll),mx=(p[0]+q[0])/2,mz=(p[2]+q[2])/2;
   // This winding initially faces [-dz,0,dx]; reverse when it faces inside.
   const points=[[p[0],base,p[2]],[q[0],base,q[2]],q,p];
   if(F.inside([mx-dz/len*.003,mz+dx/len*.003],g))points.reverse();
   out.quad(...points);
  }
 }
}
function render(b,f,method,source,options={}){
 const p=f.properties,g=f.geometry,records=[],add=b.e.add.bind(b.e),previous=[b.origin,b.rotation,b.id,b.anim],first=b.mapBuildings.length;
 b.e.add=(key,geo,m,color,params,uv)=>{if(![0,3,16].includes(params[0]))records.push({key,geo,m:new Float32Array(m),color,params:[...params],uv});};b.origin=[0,0,0];b.rotation=0;b.id=p.pickId;b.anim=0;
 const w=source.modelSize?.[0]||source.w*2.5,d=source.modelSize?.[1]||source.d*2.5;
 try{if(typeof method==='function')method(b,source,w,d);else b[method](source,w,d);}finally{b.e.add=add;[b.origin,b.rotation,b.id,b.anim]=previous;b.mapBuildings.length=first;}
 const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const rec of records){const q=transformedBounds(rec.geo,rec.m);if(q[4]<Math.min(4,Math.max(1.3,p.height*.08)))continue;for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j+3]);}}
 // A supplied source frame fits the primary roof, excluding detached foreground/flanking pieces.
 const fr=options.frame||frame(g,source.r||0),sf=options.sourceFrame,sx=(fr.w-.15)/(sf?.w||bb[3]-bb[0]),sz=(fr.d-.15)/(sf?.d||bb[5]-bb[2]),sy=options.keepHeight?1:p.height/bb[4],cx=sf?sf.centre[0]:(bb[0]+bb[3])/2,cz=sf?sf.centre[1]:(bb[2]+bb[5])/2;
 const root=M.multiply(M.transform([fr.centre[0],0,fr.centre[1]],[sx,sy,sz],fr.r),M.transform([-cx,0,-cz],[1,1,1],0));
 const edges=boundary(g),shape=F.polygons(g).flatMap(pg=>F.capTriangles(pg)).map(tri=>({tri,bb:[Math.min(...tri.map(p=>p[0])),Math.min(...tri.map(p=>p[1])),Math.max(...tri.map(p=>p[0])),Math.max(...tri.map(p=>p[1]))]})),groups=new Map(),roofCuts=new G.Geometry();let retained=0,clipped=0,dropped=0;
 for(const rec of records){const m=M.multiply(root,rec.m),q=transformedBounds(rec.geo,m);if(q[4]<.10)continue;if(!options.preserveOuterParts&&(q[3]<p.bounds[0]||q[0]>p.bounds[2]||q[5]<p.bounds[1]||q[2]>p.bounds[3])){dropped++;continue;}
  if(options.preserveOuterParts||options.noClip||bboxInside(q,g,edges)){add('v30-'+rec.key,rec.geo,m,rec.color,[rec.params[0],p.pickId,0,rec.params[3]],rec.uv);retained++;}else{bakeClipped(rec.geo,m,shape,groups,rec.color,[rec.params[0],p.pickId,0,rec.params[3]],rec.uv);clipped++;if(options.roofCutBase!=null&&rec.key.startsWith('v19-roof-shell-'))roofCutFaces(rec.geo,m,g,edges,M.apply(root,[0,options.roofCutBase,0,1])[1],roofCuts);}
 }
 for(const[k,v]of groups)if(v.geo.v.length)add('v30-clipped-'+p.pickId+'-'+(options.name||source.id)+'-'+k,v.geo,M.identity(),v.color,v.params);
 if(roofCuts.v.length)add('v30-roof-cut-closure-'+p.pickId,roofCuts,M.identity(),'#e5e5dc',[24,p.pickId,0,2.25]);
 return {id:p.id,strategy:options.name||method,source:source.id,frame:fr,scale:[sx,sy,sz],retained,clipped,dropped};
}
Y.ArchitectureAdapter={frame,frameAt,render,clipTriangle,bboxInside};
})(YY);
