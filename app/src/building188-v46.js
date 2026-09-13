/* 188: the native aerial resolves four blue-grey roof planes and a north-south
 * ridge. Replace the sampled medial roof with these explicit planes, retaining
 * the original ground outline and inherited unmeasured elevation/window grid. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1031892007';
const H={eave:5.325,ridge:7.5},C={roof:'#729399',wall:'#668b8b'};
function roofPoints(f){
 const r=f.geometry.coordinates[0];if(r.length!==5)throw Error('188 requires original four-corner outline');
 const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),north=mix(r[0],r[1],.5),south=mix(r[3],r[2],.5);
 return {corners:r.slice(0,4).map(p=>[p[0],H.eave,p[1]]),ridge:[.32,.68].map(t=>{const p=mix(north,south,t);return[p[0],H.ridge,p[1]];})};
}
function render(b,f,add){
 const points=roofPoints(f),c=points.corners,[n,s]=points.ridge,id=f.properties.pickId;
 // The inherited two window rows and all non-roof details remain provisional,
 // byte-identical in shape. Only the directly visible wall/roof palette changes.
 const filtered=(key,g,color,mat,pick)=>{
  if(key.startsWith('v30-roof-'))return;
  add(key,g,key.startsWith('v30-walls-')?C.wall:color,mat,pick);
 };
 const inherited=A.footprint(b,f,filtered,{height:H.ridge,floors:2,roof:'hip',style:'modern',key:'188-inherited-facade'});
 const faces=[[c[0],c[1],n],[c[1],c[2],s,n],[c[2],c[3],s],[c[3],c[0],n,s]];
 for(let i=0;i<faces.length;i++){
  const p=faces[i].slice(),u=p[1].map((x,k)=>x-p[0][k]),v=p[2].map((x,k)=>x-p[0][k]);
  if(u[2]*v[0]-u[0]*v[2]<0)p.reverse();
  const g=new G.Geometry();for(let j=1;j<p.length-1;j++)g.tri(p[0],p[j],p[j+1]);add('188-roof-plane-'+i,g,C.roof,19,id);
 }
 return {...inherited,strategy:'building188-v46',roof:'four-explicit-planes',roofAxis:'north-south',roofPlaneCount:4,groundOutlinePreserved:true,adjacentPassageUnchanged:true,ridgeEndpointsPhotoFitted:true,heightMeasured:false,floorCountFullyVerified:false,facadesAndEntranceVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building188={id:ID,render,roofPoints,H,C};
})(YY);
