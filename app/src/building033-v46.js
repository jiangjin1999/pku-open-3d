/* Shaoyuan 8: documented five levels / 16.8m, satellite flat roof, generic facade retained. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832238';
const O=[-416.719,291.343],R=Math.atan2(1.377,28.918),CO=Math.cos(R),SI=Math.sin(R),H={body:15.975,total:16.8};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}


function render(b,f,add){const id=f.properties.pickId;b.id=id;
 // Preserve the existing simple five-level window facade; an absence of photos is not a blank-wall claim.
 const proxy={...f,properties:{...f.properties,height:H.body,floors:5,roofTreatment:'flat',architecture:{...f.properties.architecture,strategy:'footprint',style:'dorm'}}};
 A.footprint(b,proxy,(k,...args)=>{if(!k.startsWith('v30-flat-roof-'))add(k,...args);},{height:H.body,floors:5,roof:'flat',style:'dorm',key:'033-unverified-facade'});
 for(const q of[{name:'west-dark-step',box:[-.1,-3,16,19],height:H.body-.28,color:'#737d73'},{name:'main-light-flat',box:[16,-3,66,19],height:H.body,color:'#a5ab99'}]){const g=new G.Geometry();for(const p of pieces(f,q.box))for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(p=>{const w=world(...p);return[w[0],q.height,w[1]];}));add('033-flat-roof-'+q.name,g,q.color,24,id);}
 const a=world(16,.405),c=world(16,18.075),riser=new G.Geometry();riser.quad([a[0],H.body-.28,a[1]],[c[0],H.body-.28,c[1]],[c[0],H.body,c[1]],[a[0],H.body,a[1]]);add('033-west-roof-step-riser',riser,'#919b8d',24,id);
 return{strategy:'building033-v46',floors:5,totalHeight:16.8,roof:'flat',sourceOutline:true,facadePlaceholder:true,facadeVerified:false,entranceVerified:false,restaurantCanopyCopied:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building033={id:ID,render,world,local,pieces,heights:H};
})(YY);
