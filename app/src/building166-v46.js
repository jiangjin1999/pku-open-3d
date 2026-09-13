/* 166: Weixiu 16 main bar. Registered aerial 44-46 and the native satellite
 * agree on the pale east-west hipped cap, confined to this source footprint.
 * Four floors and the existing 15 m display envelope remain unmeasured fits;
 * the old neutral facade treatment is not promoted to photographic evidence. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/876533989';
function render(b,f,add){
 const p=f.properties,copy={...f,properties:{...p,roofTreatment:'hip',architecture:{...p.architecture,strategy:'footprint'}}};
 const result=A.footprint(b,copy,(key,...args)=>{if(!key.startsWith('v30-roof-'))add(key,...args);},{key:'166-fitted-body',roof:'hip',height:15,floors:4});
 const ring=f.geometry.coordinates[0].slice(0,-1),eave=result.bodyHeight,top=15;
 const mix=(a,c,t)=>[a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t];
 const north=ring[0],south=ring[2],eastN=ring[5],eastS=ring[4];
 // The native image places the two hip tips about a half roof-depth from
 // either end. Both tips are inside 166; no eave projects into 167.
 const w=mix(mix(north,eastN,.102),mix(south,eastS,.102),.5),e=mix(mix(north,eastN,.898),mix(south,eastS,.898),.5);
 const pt=(p,h)=>[p[0],h,p[1]],roof=new G.Geometry(),wr=pt(w,top),er=pt(e,top),r=ring.map(p=>pt(p,eave));
 const tri=(a,c,d)=>{const ny=(c[2]-a[2])*(d[0]-a[0])-(c[0]-a[0])*(d[2]-a[2]);if(ny<0)[c,d]=[d,c];roof.tri(a,c,d);};
 tri(r[0],wr,er);tri(r[0],er,r[5]);
 tri(r[2],r[3],wr);tri(r[3],r[4],er);tri(r[3],er,wr);
 for(let i=0;i<2;i++)tri(r[i],r[i+1],wr);
 tri(r[4],r[5],er);
 b.id=p.pickId;b.mesh('166-pale-hip-four-faces',roof,0,0,0,1,1,1,'#c3ccc2',19);
 return {...result,id:ID,strategy:'building166-roof-v46',roof:'hip',roofAxis:'east-west',roofShapeObserved:true,sourceOutline:true,westLowBlockExcluded:true,heightMeasured:false,storeysVerified:false,facadesVerified:false,existingDisplayEnvelopeRetained:true,limits:'Roof topology alone is directly registered. The 15 m envelope, four floors, windows and hip rise remain fitted; the west attached low building is a separate object.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building166={id:ID,render};
})(YY);
