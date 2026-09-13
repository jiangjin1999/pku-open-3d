/* 191: correct only the directly registered west gable of the northeast cross-wing.
 * The 4K91 aerial shows an east south-return beyond the OSM rectangle. Its ground
 * boundary and grade are unresolved: do not invent that extension here. Existing
 * height, floors, facade and the unverified east junction remain display estimates. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,F=Y.Footprints,G=Y.Geo,ID='way/1031892010';
function roofProfile(f){
 const g=f.geometry,p=f.properties,r=g.coordinates[0],fr=Y.ArchitectureAdapter.frame(g);
 const edges=r.slice(0,-1).map((q,i)=>[q,r[i+1]]);
 const west=edges.reduce((best,e,i)=>(e[0][0]+e[1][0])<(edges[best][0][0]+edges[best][1][0])?i:best,0);
 const distance=(q,es)=>Math.min(...es.map(e=>F.distSegment(q,...e)));
 // Retain the inherited normalization, rise and body height exactly.
 let maximum=.01;
 for(const pg of F.polygons(g))for(const t of F.capTriangles(pg))for(let u=0;u<=8;u++)for(let v=0;v<=8-u;v++){
  const q=[t[0][0]+(t[1][0]-t[0][0])*u/8+(t[2][0]-t[0][0])*v/8,t[0][1]+(t[1][1]-t[0][1])*u/8+(t[2][1]-t[0][1])*v/8];
  maximum=Math.max(maximum,distance(q,edges));
 }
 const rise=Math.min(5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17),p.height*.29),body=p.height-rise;
 const retained=edges.filter((_,i)=>i!==west);
 const profile=q=>body+rise*Math.max(0,Math.min(1,distance(q,retained)/maximum));
 return {profile,body,rise,west,edges,maximum};
}
function render(b,f,add){
 const q=roofProfile(f);
 const replace=(key,geo,color,mat,id)=>{
  if(key.startsWith('v30-roof-ends-')){
   geo=new G.Geometry();
   for(const [a,c] of q.edges){const length=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.max(1,Math.ceil(length/1.5));
    for(let k=0;k<n;k++){const p=[a[0]+(c[0]-a[0])*k/n,a[1]+(c[1]-a[1])*k/n],r=[a[0]+(c[0]-a[0])*(k+1)/n,a[1]+(c[1]-a[1])*(k+1)/n];
     geo.quad([p[0],q.body,p[1]],[r[0],q.body,r[1]],[r[0],q.profile(r),r[1]],[p[0],q.profile(p),p[1]]);
    }
   }
  }else if(key.startsWith('v30-roof-'))geo=F.profiledSurface(f.geometry,q.profile,2.6);
  add(key,geo,color,mat,id);
 };
 const inherited=A.footprint(b,f,replace,{roof:'hip'});
 return {...inherited,strategy:'building191-v46',correctedWestGable:true,eastReturnUnresolved:true,totalStoreysVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):prior(b,f,add);};
Y.Building191={id:ID,render,roofProfile};
})(YY);
