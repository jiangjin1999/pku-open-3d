/* This southern bar retains the OSM Shaoyuan 1 label. Conflicting official maps
   reopened the 1/3 identity-position check; see 061-orientation-review.md.
   The 2020 PKU courtyard
   photograph shows its five-storey north face at the left edge; the large porch
   and balcony stack belong to Shaoyuan 2. Unseen bay counts and the roof join
   remain fitted. No entrance location has been established for this building. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/445016205';
const O=[-371.464,207.979],R=Math.atan2(1.888,49.961),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(49.961,1.888),D=12.511;
const H={base:.28,level:3.08,wall:15.68,eave:15.98,ridge:18.12,top:18.24};
const C={brick:'#977a69',band:'#c4c4b3',edge:'#d5d6c9',joint:'#acb3a5',glass:'#788d8e',frame:'#d6ded6',metal:'#adbaae',roof:'#85918a',rib:'#a4ada2',base:'#a6ada0'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const join=[local([-364.802,207.723])[0],local([-353.538,207.301])[0]];
const roofY=(x,z)=>H.eave+(H.ridge-H.eave)*Math.max(0,Math.min(1,(x+.50)/(D/2+.50),(W+.50-x)/(D/2+.50),(z+.50)/(D/2+.50),(D+.50-z)/(D/2+.50)));
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'060-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 function fan(){const g=new G.Geometry();for(let i=0;i<20;i++){const a=i*Math.PI/10,c=(i+1)*Math.PI/10;g.tri([0,0,0],[Math.cos(a)*.22,Math.sin(a)*.22,0],[Math.cos(c)*.22,Math.sin(c)*.22,0]);}return g;}
 function ac(x,y){group('air-conditioner',()=>{b.box(x,y,.30,.76,.60,.42,C.frame,24);b.mesh('fan',b.geo('060-fan',fan),x-.12,y,.514,1,1,1,'#6e7f77',9);for(let j=-2;j<=2;j++)b.box(x-.12,y+j*.073,.521,.41,.015,.012,C.metal,9);for(let j=0;j<4;j++)b.box(x+.21+j*.032,y,.520,.012,.40,.014,C.metal,9);for(const dx of[-.27,.27])b.box(x+dx,y-.34,.24,.04,.08,.40,C.metal,9);});}
 function face(name,x,z,rot,width,count){b.local(x,0,z,rot,()=>group(name,()=>{
  const stride=width/count,ww=Math.min(2.02,stride-.84),positions=Array.from({length:count},(_,i)=>-width/2+(i+.5)*stride);
  const wall=(a,c,lo,hi,color,mat=24)=>{if(c-a>.001&&hi-lo>.001)b.box((a+c)/2,(lo+hi)/2,-.115,c-a,hi-lo,.23,color,mat);};
  wall(-width/2,width/2,.03,H.base,C.base,10);
  for(let fl=0;fl<5;fl++){const lo=H.base+fl*H.level,hi=lo+H.level,bottom=lo+.72,top=bottom+1.99;let cursor=-width/2;
   wall(-width/2,width/2,lo,bottom-.04,C.band);wall(-width/2,width/2,top+.04,hi,C.band);
   for(const u of positions){const a=u-ww/2,c=u+ww/2;wall(cursor,a,bottom-.04,top+.04,C.brick,30);
    group('window-'+fl,()=>{b.box(u,(bottom+top)/2,-.125,ww-.11,top-bottom-.11,.032,C.glass,5);for(const q of[a,c])b.box(q,(bottom+top)/2,-.017,.067,top-bottom,.18,C.frame,9);for(const y of[bottom,top])b.box(u,y,-.017,ww,.067,.18,C.frame,9);const trans=top-.51;b.box(u,trans,-.005,ww-.08,.052,.13,C.frame,9);b.box(u-.17,(bottom+trans)/2,-.005,.055,trans-bottom,.13,C.frame,9);b.box(u,(trans+top)/2,-.005,.052,top-trans,.13,C.frame,9);b.box(u,bottom-.09,.065,ww+.18,.12,.34,C.edge,24);
     if(fl===0){for(let k=0;k<=12;k++)b.box(a+.04+k*(ww-.08)/12,(bottom+top)/2,.11,.023,top-bottom,.027,C.metal,9);for(const y of[bottom+.07,top-.07])b.box(u,y,.115,ww,.028,.038,C.metal,9);}
    });cursor=c;
   }wall(cursor,width/2,bottom-.04,top+.04,C.brick,30);
   b.box(0,lo+.07,.018,width,.14,.28,C.edge,24);
   // Shallow seams divide the continuous light spandrel band, not projecting columns at every room.
   for(let k=0;k<=count;k++)b.box(-width/2+k*stride,lo+.43,.009,.018,.68,.016,C.joint,24);
   if(name==='north-courtyard'||name==='south-fitted')for(let k=0;k<count-1;k+=2){const u=(positions[k]+positions[k+1])/2;ac(u,bottom+.42);ac(u,bottom+1.17);}
  }
  for(const u of[-width/2+.13,width/2-.13])b.box(u,(H.base+H.wall)/2,.035,.25,H.wall-H.base,.30,C.band,24);
  b.box(0,H.wall-.13,.11,width+.09,.25,.46,C.band,24);b.box(0,H.eave-.16,.18,width+.17,.32,.74,C.edge,24);
  for(let u=-width/2+.8;u<width/2;u+=stride*2){b.box(u,H.wall-.30,.22,.14,.32,.36,C.joint,24);if(name==='north-courtyard'||name==='south-fitted')b.box(u+.17,(H.wall+.30)/2,.31,.036,H.wall-.30,.036,C.frame,9);}
 }));}
 function roof(){const a=-.50,c=W+.50,n=-.50,s=D+.50,m=D/2,cut=D/2,polys=[[[a,n],[c,n],[W-cut,m],[cut,m]],[[cut,m],[W-cut,m],[c,s],[a,s]],[[a,n],[cut,m],[a,s]],[[W-cut,m],[c,n],[c,s]]];
  b.box(W/2,H.eave-.025,D/2,W,.10,D,C.band,24);
  function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,ci=greater?c[axis]>=k:c[axis]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
  for(let side=0;side<4;side++){const p=polys[side],axis=side<2?0:1,g=new G.Geometry(),rib=new G.Geometry(),emit=(g,p,dy)=>{for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(q=>[q[0],roofY(...q)+dy,q[1]]));};emit(g,p,0);b.mesh('hip-surface-'+side,g,0,0,0,1,1,1,C.roof,25);
   const lo=Math.min(...p.map(q=>q[axis])),hi=Math.max(...p.map(q=>q[axis]));for(let t=lo+.12;t<hi;t+=.27){for(let k=0;k<4;k++){const u=t-.035+k*.0175,q=clip(clip(p,axis,u,true),axis,u+.0175,false);emit(rib,q,.013+Math.sin((k+.5)*Math.PI/4)*.025);}}rib.detailWidth=.0175;b.mesh('hip-ribs-'+side,rib,0,0,0,1,1,1,C.rib,25);
  }
  b.box(W/2,H.ridge+.055,m,W-D+.13,.11,.22,C.rib,25);
  for(const [p,q] of [[[a,n],[D/2,m]],[[a,s],[D/2,m]],[[c,n],[W-D/2,m]],[[c,s],[W-D/2,m]]])b.beam([p[0],roofY(...p)+.035,p[1]],[q[0],roofY(...q)+.035,q[1]],.045,C.rib,25);
 }
 b.local(O[0],0,O[1],R,()=>{
  face('north-west',join[0]/2,0,Math.PI,join[0],2);
  face('north-courtyard',(join[1]+W)/2,0,Math.PI,W-join[1],10);
  face('south-fitted',W/2,D,0,W,16);
  face('east-fitted',W,D/2,Math.PI/2,D,4);
  face('west-fitted',0,D/2,-Math.PI/2,D,4);
  // The shared wall is plain and carries no external window frames, AC units or projecting eave.
  group('shared-north-wall',()=>b.box((join[0]+join[1])/2,(H.eave+H.base)/2,.115,join[1]-join[0],H.eave-H.base,.23,C.band,24));
  group('roof',roof);
 });
 return{strategy:'building060-v46',floors:5,ownSouthernWing:true,northFacadePartlyPhotographed:true,balconyStack:false,fullFacadeVerified:false,entranceDirectionVerified:false,heightMeasured:false,roofJunctionVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building060={id:ID,render,W,D,H,world,local,join,roofY};
})(YY);
