/* 128: the 2022 PKU tender specifies three polycarbonate shelters; the
 * registered 2026-01-11 native image resolves three east-west blue bands.
 * This partial correction changes the old automatic north-south roof axis.
 * The old arched section, height and perimeter supports remain provisional. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/1101754970';
function roofProfile(f){
 const fr=Y.ArchitectureAdapter.frame(f.geometry),cs=Math.cos(fr.r),sn=Math.sin(fr.r),h=f.properties.height,rise=Math.min(5,h*.28),body=h-rise;
 const at=q=>{const z=sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1]),t=((z/fr.d+.5)*3)%1;return body+rise*Math.sin(Math.PI*Math.max(0,t));};
 return{fr,body,rise,at};
}
function render(b,f,add){
 const p=f.properties,g=f.geometry,id=p.pickId,{fr,body,rise,at}=roofProfile(f);
 const es=F.polygons(g).flatMap(pg=>pg.flatMap((r,ri)=>r.slice(1).map((c,i)=>{const a=r[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),sgn=(F.area(r)>0?1:-1)*(ri?-1:1);return{a,c,len,ux:(c[0]-a[0])/len,uz:(c[1]-a[1])/len,nx:(c[1]-a[1])/len*sgn,nz:-(c[0]-a[0])/len*sgn};})));
 // Retain the old perimeter frame exactly while its real support layout is unknown.
 for(const e of es){if(e.len<3)continue;for(let t=1;t<e.len;t+=6){const x=e.a[0]+e.ux*t-e.nx*.25,z=e.a[1]+e.uz*t-e.nz*.25;b.id=id;b.box(x,body/2,z,.18,body,.18,'#788e86',29);}}
 add('v30-plinth-'+id+'-undefined',F.walls(g,.03,.30),'#afb5a9',10,id);
 add('128-east-west-roof-bands',F.profiledSurface(g,at,1),'#618d96',29,id);
 const ends=new G.Geometry();
 for(const e of es){const n=Math.max(1,Math.ceil(e.len/1.5));for(let k=0;k<n;k++){const a=[e.a[0]+e.ux*e.len*k/n,e.a[1]+e.uz*e.len*k/n],c=[e.a[0]+e.ux*e.len*(k+1)/n,e.a[1]+e.uz*e.len*(k+1)/n];ends.quad([a[0],body,a[1]],[c[0],body,c[1]],[c[0],at(c),c[1]],[a[0],at(a),a[1]]);}}
 add('128-east-west-roof-ends',ends,'#9baaa2',29,id);
 b.id=id;for(const e of es){if(e.len<3.4)continue;const r=Math.atan2(e.nx,e.nz);b.local((e.a[0]+e.c[0])/2,0,(e.a[1]+e.c[1])/2,r,()=>b.box(0,body-.18,.01,e.len,.24,.30,'#c7cbbf',24));}
 return{id:ID,strategy:'building128-v46',roofRuns:3,roofRunAxis:'east-west',roofRunAxisRadians:-fr.r,roofProfile:'inherited provisional sine arches',bodyHeight:body,roofRise:rise,originalOutline:true,sectionVerified:false,heightMeasured:false,supportLayoutVerified:false,clotheslinesVerified:false,wholeBuildingExteriorVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building128={id:ID,render,roofProfile};
})(YY);
