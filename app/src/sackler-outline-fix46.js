/* V46 Sackler: fit the three inset wings before the existing OSM clip.
   This fixes severed wall/roof meshes; hidden facade details remain the old
   reference fit. It does not establish a surveyed plan or current heights. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,F=Y.Footprints,Adapter=Y.ArchitectureAdapter,ID='way/240832217';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return prior(b,f,add);
 const p=f.properties,source=Y.ARCHIVE.legacy[String(p.legacyId)],fr=Adapter.frame(f.geometry,source.r||0);
 const c=Math.cos(fr.r),s=Math.sin(fr.r),ring=F.polygons(f.geometry)[0][0];
 const local=ring.slice(0,-1).map(q=>[c*(q[0]-fr.centre[0])-s*(q[1]-fr.centre[1]),s*(q[0]-fr.centre[0])+c*(q[1]-fr.centre[1])]);
 // Source ring has distinct western/eastern returns. Use the four vertices
 // belonging to the narrower northern stem, keeping the full southern hall.
 const stem=[local[0],local[1],local[6],local[7]],left=Math.max(stem[0][0],stem[1][0]),right=Math.min(stem[2][0],stem[3][0]);
 const fit={widthRatio:(right-left)/fr.w,centreRatio:(left+right)/2/fr.w};
 const method=(bb,ss,w,d)=>{
  const depth=9.7,side=10.2,wn=w*fit.widthRatio-.50,xn=w*fit.centreRatio;
  bb.noPlant(0,0,w+3,d+5);bb.n17Box('v17-museum-court',0,.12,0,w,.16,d,'#c3c4b4',7,.02);
  bb.local(xn,0,-d/2+depth/2,Math.PI,()=>bb.n17Hall(wn,depth,10.8,{gallery:true}));
  bb.local(0,0,d/2-depth/2,0,()=>bb.n17Hall(w,depth,10.8,{gallery:true}));
  for(const sg of[-1,1])bb.local(xn+sg*(wn/2-side/2),0,0,Math.PI/2,()=>bb.n17Hall(d-2*depth,side,10.3,{gallery:false}));
  bb.n17Box('v17-museum-garden',0,.26,0,w*.46,.16,(d-2*depth)*.50,'#7f9366',0,.03);
  bb.n17Box('v17-museum-entry',0,2.8,d/2+.15,5.8,4.4,.14,'#854434',6,.9);
  for(const x of[-1.43,1.43])bb.n17Lattice(x,3.1,d/2+.27,2.4,3.4);
  bb.n17Box('v17-museum-signboard',0,6.12,d/2+1.21,21,.90,.14,'#263f45',29,1.2);
  bb.sign('北京大学赛克勒考古与艺术博物馆',0,6.13,d/2+1.33,20.8,.84,0,false);
  for(let i=0;i<4;i++)bb.n17Box('v17-museum-step',0,.13+i*.17,d/2+3.5-i*.5,10,.24,1.1,'#a3a599',10,.12);
 };
 add('v30-footprint-base-'+p.pickId,F.surface(f.geometry,.045),'#b5bbae',10,p.pickId);
 const result=Adapter.render(b,f,method,source,{name:'sackler-inset-wings46',frame:fr});
 return {...result,insetFit:fit,sourceOutlinePreserved:true,hiddenFacadesVerified:false,heightMeasured:false};
};
})(YY);
