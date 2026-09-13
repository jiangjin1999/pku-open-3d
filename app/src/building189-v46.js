/* 189: only the observed L roof planes are reconstructed. The original six
 * footprint corners, inherited walls/windows and display heights are retained.
 * Eave/ridge height, rear elevations, name and west low corridor remain open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1031892008';
function roofGeometry(f,body,ridge){
 const p=f.geometry.coordinates[0].slice(0,-1),mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],unit=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]);return[(b[0]-a[0])/d,(b[1]-a[1])/d];};
 const east=unit(p[0],p[1]),south=unit(p[0],p[5]),width=Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]),depth=Math.hypot(p[4][0]-p[3][0],p[4][1]-p[3][1]);
 const n0=mid(p[0],p[1]),e0=mid(p[3],p[4]),north=[n0[0]+south[0]*width/2,n0[1]+south[1]*width/2],eastEnd=[e0[0]-east[0]*depth/2,e0[1]-east[1]*depth/2];
 const cross=(a,b)=>a[0]*b[1]-a[1]*b[0],delta=[eastEnd[0]-north[0],eastEnd[1]-north[1]],t=cross(delta,east)/cross(south,east),join=[north[0]+t*south[0],north[1]+t*south[1]];
 const v=p.map(q=>[q[0],body,q[1]]),N=[north[0],ridge,north[1]],E=[eastEnd[0],ridge,eastEnd[1]],J=[join[0],ridge,join[1]],g=new G.Geometry();
 // The concave corner is a valley; both principal ridges meet behind it.
 // Six faces use every original eave corner, without filling the NE notch.
 const faces=[[v[0],v[1],N],[v[1],v[2],J,N],[v[2],v[3],E,J],[v[3],v[4],E],[v[4],v[5],J,E],[v[5],v[0],N,J]];
 for(const face of faces)for(let i=1;i<face.length-1;i++)g.tri(face[0],face[i+1],face[i]);
 return{geometry:g,ridgeNodes:[N,J,E],eaveNodes:v,faces};
}
function render(b,f,add){
 const result=previous(b,f,(key,...args)=>{if(!key.startsWith('v30-roof-'+f.properties.pickId+'-')&&!key.startsWith('v30-roof-ends-'+f.properties.pickId+'-'))add(key,...args);});
 const body=result.bodyHeight,rise=result.roofRise,roof=roofGeometry(f,body,body+rise);
 add('189-observed-l-roof-planes',roof.geometry,'#748b8e',19,f.properties.pickId);
 return{...result,strategy:'building189-v46-roof-only',roofTopology:'north-south ridge with east branch and inner valley',roofPlanes:6,originalOutline:true,inheritedFacadeUnchanged:true,heightMeasured:false,allFacadesVerified:false,corridorRebuilt:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building189={id:ID,roofGeometry,render};
})(YY);
