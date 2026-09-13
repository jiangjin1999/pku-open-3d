/* V43. Resolve overlapping source entries only in the model; retain all map records. */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,previous=A.render,by=new Map(Y.CAMPUS.features.map(f=>[f.properties.id,f]));
function sis(b,f,add){const id=f.properties.pickId;
 for(const [sid,roof,key] of [['way/1086578215','hip','north'],['way/1086578214','hip','middle'],['way/1086578216','flat','south']]){
  const part={...f,geometry:by.get(sid).geometry};A.footprint(b,part,(k,g,c,m,owner)=>add(k,g,k.includes('flat-roof')?'#b7977d':k.includes('walls')?'#9a9d94':c,m,owner),{height:roof==='hip'?14.8:11.8,floors:3,style:'science',roof,key:'sis43-'+key});
 }
 const g=Y.MASKS43.sisConnectors;
 add('sis43-glass-link-walls',F.walls(g,.3,10.7),'#617d7b',28,id);add('sis43-glass-link-roof',F.surface(g,10.7),'#748c89',28,id);
 b.id=id;for(const pg of F.polygons(g))for(const ring of pg)for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]);for(let t=1;t<len;t+=1.7){const x=a[0]+(c[0]-a[0])*t/len,z=a[1]+(c[1]-a[1])*t/len;b.box(x,5.5,z,.09,10.4,.09,'#a9b7b2',29);}for(const y of[3.6,7,10.7])b.beam([a[0],y,a[1]],[c[0],y,c[1]],.09,'#a9b7b2',29);}
 return{strategy:'sis43-three-wings',sourceOutline:true,parts:3};
}
function shouren(b,f,add){const p=f.properties,g=f.geometry,id=p.pickId,fr=Y.ArchitectureAdapter.frame(g),cs=Math.cos(fr.r),sn=Math.sin(fr.r),across=fr.w>=fr.d?1:0,width=Math.min(fr.w,fr.d),body=4.65;
 const profile=q=>{const v=[cs*(q[0]-fr.centre[0])-sn*(q[1]-fr.centre[1]),sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1])][across],t=Math.max(0,1-Math.abs(v)/(width/2));return body+2.85*Math.sin(Math.PI/2*Math.pow(t,1.3));};
 add('shouren43-plinth-'+id,F.walls(g,.04,.55),'#989e92',10,id);add('shouren43-grey-brick-'+id,F.walls(g,.55,body),'#969b91',18,id);add('shouren43-coiled-roof-'+id,F.profiledSurface(g,profile,.5),'#70766d',19,id);
 const ends=new G.Geometry();b.id=id;
 for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,steps=Math.max(1,Math.ceil(len/.5));
  for(let j=0;j<steps;j++){const q=[a[0]+ux*len*j/steps,a[1]+uz*len*j/steps],r=[a[0]+ux*len*(j+1)/steps,a[1]+uz*len*(j+1)/steps];ends.quad([q[0],body,q[1]],[r[0],body,r[1]],[r[0],profile(r),r[1]],[q[0],profile(q),q[1]]);if(len<width*1.4)b.beam([q[0],profile(q)+.015,q[1]],[r[0],profile(r)+.015,r[1]],.06,'#bbc0b3',10);}
  if(len>width*1.4){b.beam([a[0],body-.12,a[1]],[c[0],body-.12,c[1]],.20,'#565e53',10);b.beam([a[0],body-.38,a[1]],[c[0],body-.38,c[1]],.16,'#744837',6);}if(len>width*1.4)for(let t=2;t<len-1;t+=3.4){const x=a[0]+ux*t+nx*.09,z=a[1]+uz*t+nz*.09;b.v9Lattice(x,2.5,z,2.1,2.6,Math.atan2(nx,nz),false);}
 }}add('shouren43-hard-gable-'+id,ends,'#9a9d91',18,id);return{strategy:'shouren43-grey-red-coiled-roof',sourceOutline:true};}
A.render=function(b,f,add){const p=f.properties;if(p.supersededBy43){add('v43-reference-outline',F.surface(f.geometry,.045),'#b5bbae',10,p.pickId);return{strategy:'source-record-only',parent:p.supersededBy43};}if(p.id==='way/240832232')return sis(b,f,add);if(p.architecture?.strategy==='shouren43')return shouren(b,f,add);return previous(b,f,add);};
Y.Refinements43={sis,shouren};
})(YY);
