/* 104: south small range beside Red Lake. Satellite + aerial frame 34/35
 * register the east-west tiled gable and the central north connector (106).
 * Wall openings, heights and floor count remain the inherited unverified fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009051997';
const O=[-325.363,-360.185],U=[22.769,-.266],V=[.154,12.425];
const point=(u,v,y)=>[O[0]+U[0]*u+V[0]*v,y,O[1]+U[1]*u+V[1]*v];
const COL={roof:'#72796c',tile:'#9ca08a',fascia:'#767968',end:'#c5c5b9'};
function render(b,f,add){
 const result=previous(b,f,(key,...args)=>{if(!key.startsWith('v30-roof-'))add(key,...args);});
 const eave=result.bodyHeight,rise=result.roofRise,ridge=eave+rise;
 const u0=-.014,u1=1.014,v0=0,v1=1.028;
 const profile=(u,v)=>{
  const t=Math.max(0,1-Math.abs((v-.5)/.5));
  const end=Math.pow(Math.abs((u-.5)/.514),10);
  return eave+rise*Math.pow(t,1.35)+.14*end*(1-t);
 };
 const mesh=(key,g,c,mat=19)=>{b.id=f.properties.pickId;b.mesh('104-'+key,g,0,0,0,1,1,1,c,mat);};
 const surfaces=new G.Geometry(),tiles=new G.Geometry(),ends=new G.Geometry();
 function patch(g,a,c,v,w,offset=0){
  const ps=[[a,v],[c,v],[c,w],[a,w]].map(([u,z])=>point(u,z,profile(u,z)+offset));
  if(w>v)ps.reverse();g.quad(...ps);
 }
 for(const [a,z] of [[v0,.5],[.5,v1]])for(let i=0;i<24;i++)for(let j=0;j<18;j++)patch(surfaces,u0+(u1-u0)*i/24,u0+(u1-u0)*(i+1)/24,a+(z-a)*j/18,a+(z-a)*(j+1)/18);
 for(let u=u0+.004;u<u1-.006;u+=.0102)for(const [a,z] of [[v0,.5],[.5,v1]])for(let j=0;j<18;j++)for(let k=0;k<3;k++)patch(tiles,u+k*.00105,Math.min(u+(k+1)*.00105,u1),a+(z-a)*j/18,a+(z-a)*(j+1)/18,.011+Math.sin((k+.5)*Math.PI/3)*.032);
 tiles.detailWidth=.024;
 // Real gable closure, no unsupported red-painted insert or invented ornament.
 for(const u of [0,1])for(let j=0;j<36;j++){
  const a=j/36,z=(j+1)/36,ps=[point(u,a,eave),point(u,z,eave),point(u,z,profile(u,z)),point(u,a,profile(u,a))];
  if(u===1)ps.reverse();ends.quad(...ps);
 }
 for(const v of [0,1])for(let j=0;j<24;j++){
  const a=j/24,z=(j+1)/24,ps=[point(a,v,eave),point(z,v,eave),point(z,v,profile(z,v)),point(a,v,profile(a,v))];
  if(v===0)ps.reverse();ends.quad(...ps);
 }
 mesh('roof-surface',surfaces,COL.roof);mesh('roof-tile-rolls',tiles,COL.tile);mesh('roof-gable-closures',ends,COL.end,24);
 b.id=f.properties.pickId;
 const beam=(name,a,c,width,color)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'104-'+name+'-'+k,...args);};try{b.beam(a,c,width,color,19);}finally{b.e.add=old;}};
 beam('ridge-cap',point(u0,.5,ridge+.065),point(u1,.5,ridge+.065),.18,COL.tile);
 for(const u of [u0,u1])for(const [a,z] of [[v0,.5],[.5,v1]])for(let j=0;j<18;j++){
  const v=a+(z-a)*j/18,w=a+(z-a)*(j+1)/18;beam('gable-trim',point(u,v,profile(u,v)-.045),point(u,w,profile(u,w)-.045),.105,COL.fascia);
 }
 // The source connector shares the north boundary between u=.380 and .668.
 // No projecting north eave or fascia crosses that separate building's opening.
 for(const [v,a,z] of [[v1,u0,u1],[v0,u0,.376],[v0,.674,u1]])for(let j=0;j<24;j++){
  const u=a+(z-a)*j/24,w=a+(z-a)*(j+1)/24;beam('eave-edge',point(u,v,profile(u,v)-.065),point(w,v,profile(w,v)-.065),.13,COL.fascia);
 }
 return {...result,id:ID,strategy:'building104-roof-candidate-v46',roofAxis:'east-west',roofSegments:1,bodyGeometryPreserved:true,sourceOutline:true,mainEntranceVerified:false,storeysVerified:false,heightMeasured:false,northConnectorExcluded:true,limits:'Only roof form/material are registered to satellite and aerial context; facade openings, name, floor count, exact roof profile and heights remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building104={id:ID,render,point};
})(YY);
