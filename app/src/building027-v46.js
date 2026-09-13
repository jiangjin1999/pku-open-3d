/* Guanghua west long wing: identity-isolated, satellite roof subdivision only. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825567';
const O=[248.252,-311.052],R=Math.atan2(5.274,22.461),CO=Math.cos(R),SI=Math.sin(R),H=16;
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}

const zones=[{name:'north-head',box:[-5,0,29,15],color:'#aaa99b'},{name:'north-middle',box:[-5,15,29,44],color:'#a7b2ac'},{name:'central-service-roof',box:[-5,44,29,59.5],color:'#757f78'},{name:'south-long-west',box:[-5,59.5,14.3,113],color:'#aaa999'},{name:'south-long-east-band',box:[14.3,59.5,29,113],color:'#9caeb0'},{name:'south-end',box:[-5,113,29,131],color:'#a8ada4'}];
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 // Height remains an explicitly unverified inherited envelope; no five-storey inference from glass grids.
 const fallback={...f,properties:{...f.properties,height:H,floors:5,roofTreatment:'flat',architecture:{...f.properties.architecture,strategy:'footprint',style:'modern'}}};
 A.footprint(b,fallback,(key,...args)=>{if(!key.startsWith('v30-flat-roof-'))add(key,...args);},{height:H,floors:5,roof:'flat',style:'modern',key:'027-unverified-facade'});
 for(const q of zones){const g=new G.Geometry();for(const p of pieces(f,q.box))for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(p=>{const w=world(...p);return[w[0],H+.035,w[1]];}));add('027-roof-'+q.name,g,q.color,24,id);}
 return{strategy:'building027-v46',sourceOutline:true,satelliteRoofZones:6,floors:null,heightVerified:false,facadeVerified:false,genericFacadeRetained:true,placeholderWindowRows:5,secondTower:false,secondMottoStone:false,curvedEastLobbyCopied:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building027={id:ID,render,world,local,pieces,zones,height:H};
})(YY);
