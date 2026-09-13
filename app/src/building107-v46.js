/* Honghu north hall only. Registered in native imagery, official 2015 photograph
 * and aerial frames 34/36/38. One south-facing seven-bay storey; rear evidence remains unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009052000';
const O=[-295.728,-426.506],R=.015013693312084983,CO=Math.cos(R),SI=Math.sin(R),W=31.03949825625408,D=16.0298;
const H={base:.62,eave:4.65,ridge:8.75},C={stone:'#c6c4b6',wall:'#b8b7a9',red:'#994838',wood:'#784336',glass:'#69776b',roof:'#697267',tile:'#959c8b',paint:'#38776b',gold:'#baa775'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
// Seven front bays are read from frame 38; exact dimensions are fitted to this hall's own source ring.
const posts=[.35,4.55,8.73,12.91,18.13,22.31,26.49,W-.35];
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'107-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('107-'+name,g,0,0,0,1,1,1,col,mat);
 function roof(){const x0=-.55,x1=W+.55,half=D/2+.66,mid=D/2,span=x1-x0,breakT=.27,shrink=1.75;
  const end=(t,s)=>s<0?x0+shrink*Math.min(t/breakT,1):x1-shrink*Math.min(t/breakT,1);
  const point=(x,t,s)=>[x,H.eave+(H.ridge-H.eave)*Math.pow(t,1.32)+.37*Math.pow(Math.abs((x-W/2)/(span/2)),10)*(1-t),mid+s*half*(1-t)];
  const g=new G.Geometry(),tiles=new G.Geometry();
  function patch(target,a,c,t,u,s,dy=0){const p=[point(a[0],t,s),point(c[0],t,s),point(c[1],u,s),point(a[1],u,s)].map(q=>[q[0],q[1]+dy,q[2]]);if(s<0)p.reverse();target.quad(...p);}
  for(const s of[-1,1])for(let j=0;j<16;j++){const t=j/16,u=(j+1)/16;
   for(let i=0;i<32;i++)patch(g,[end(t,-1)+(end(t,1)-end(t,-1))*i/32,end(u,-1)+(end(u,1)-end(u,-1))*i/32],[end(t,-1)+(end(t,1)-end(t,-1))*(i+1)/32,end(u,-1)+(end(u,1)-end(u,-1))*(i+1)/32],t,u,s);
   for(let x=x0+.04;x<x1;x+=.235){const lo=Math.max(x,end(t,-1),end(u,-1)),hi=Math.min(x+.08,end(t,1),end(u,1));if(hi>lo)patch(tiles,[lo,lo],[hi,hi],t,u,s,.035);}
  }
  // Lower end hips and visible triangular red upper gables distinguish this hall from a plain box gable.
  const hips=new G.Geometry(),gables=new G.Geometry();
  for(const e of[-1,1]){
   for(let j=0;j<8;j++){const t=breakT*j/8,u=breakT*(j+1)/8;for(let k=0;k<16;k++){const q=-1+2*k/16,v=-1+2*(k+1)/16;
    const pt=(tt,zz)=>{const p=point(end(tt,e),tt,zz);p[2]=mid+zz*half*(1-tt);return p;};const p=[pt(t,q),pt(t,v),pt(u,v),pt(u,q)];if(e>0)p.reverse();hips.quad(...p);
   }}
   for(const s of[-1,1])for(let j=0;j<12;j++){const t=breakT+(1-breakT)*j/12,u=breakT+(1-breakT)*(j+1)/12,x=end(1,e),a=point(x,t,s),c=point(x,u,s),bottom=point(x,breakT,s)[1];const p=[[x,bottom,a[2]],a,c,[x,bottom,c[2]]];if((e>0)===(s>0))p.reverse();gables.quad(...p);}
  }
  mesh('roof-main-surface',g,C.roof,2);mesh('roof-lower-hips',hips,C.roof,2);tiles.detailWidth=.025;mesh('roof-tiles',tiles,C.tile,2);mesh('roof-upper-red-gables',gables,C.red,6);
  group('roof-trim',()=>{
   b.box(W/2,H.ridge+.1,mid,span-shrink*2,.20,.31,C.tile,2);
   for(const e of[-1,1]){const x=end(1,e);b.beam([x,H.ridge,mid],[x+e*.16,H.ridge+.43,mid],.15,C.tile,2);}
   for(const s of[-1,1]){
    for(let j=0;j<32;j++){const a=point(x0+span*j/32,0,s),c=point(x0+span*(j+1)/32,0,s);b.beam(a,c,.15,C.red,6);}
    for(let x=x0+.1;x<x1;x+=.235){const p=point(x,0,s);b.box(x,p[1]-.15,p[2],.11,.12,.29,C.tile,2);}
   }
   for(const e of[-1,1])for(const s of[-1,1])for(let j=0;j<16;j++){const t=j/16,u=(j+1)/16,a=point(end(t,e),t,s),c=point(end(u,e),u,s);b.beam(a,c,.10,C.tile,2);}
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  const poly=f.geometry.coordinates[0].slice(0,-1).map(local);mesh('source-base',G.polygon(poly,H.base),C.stone);mesh('source-ceiling',G.polygon(poly,H.eave-.18),C.wall);
  const foundation=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];foundation.quad([a[0],0,a[1]],[c[0],0,c[1]],[c[0],H.base,c[1]],[a[0],H.base,a[1]]);}mesh('source-foundation',foundation,C.stone);
  // Rear and end walls are bounded placeholders, without invented openings.
  group('unseen-walls',()=>{b.box(W/2,(H.eave+H.base)/2,.12,W,H.eave-H.base,.24,C.wall,24);for(const x of[.12,W-.12])b.box(x,(H.eave+H.base)/2,D/2,.24,H.eave-H.base,D,C.wall,24);});
  group('south-plinth',()=>{for(const [a,c] of[[0,posts[3]],[posts[4],W]])b.box((a+c)/2,.94,D-.14,c-a,.64,.28,C.stone,24);});
  group('south-posts',()=>{for(const x of posts){b.box(x,.73,D+.03,.38,.23,.40,C.stone,24);b.cyl(x,.85,D-.01,.13,H.eave-.85,C.red,12,1,6);}});
  // Six window bays, four main panes each; upper transoms and fine lattice are fitted details.
  for(let bay=0;bay<7;bay++)if(bay!==3)group('south-window-'+bay,()=>{const a=posts[bay]+.16,c=posts[bay+1]-.16,x=(a+c)/2,w=c-a,lo=1.25,hi=4.08,z=D-.13;
   b.box(x,(lo+hi)/2,z-.11,w,hi-lo,.05,C.glass,5);
   for(let j=0;j<=4;j++)b.box(a+w*j/4,(lo+hi)/2,z,.075,hi-lo,.14,C.red,6);
   for(const y of[lo,3.34,hi])b.box(x,y,z,w,.085,.16,C.red,6);
   for(let j=0;j<4;j++){const cx=a+w*(j+.5)/4;for(let yy=lo+.22;yy<3.30;yy+=.35)b.box(cx,yy,z+.06,w/4-.13,.025,.04,C.wood,6);}
  });
  group('south-door',()=>{const a=posts[3]+.2,c=posts[4]-.2,w=c-a,x=(a+c)/2,lo=H.base,hi=4.08,z=D-.17;
   b.box(x,(lo+hi)/2,z-.14,w,hi-lo,.08,C.wood,6);
   for(let j=0;j<=4;j++)b.box(a+w*j/4,(lo+hi)/2,z,.075,hi-lo,.15,C.red,6);
   for(const y of[lo,1.04,2.36,3.34,hi])b.box(x,y,z,w,.09,.15,C.red,6);
   for(let j=0;j<4;j++){const cx=a+w*(j+.5)/4;b.box(cx,2.83,z-.05,w/4-.13,.83,.035,C.glass,5);for(let k=0;k<4;k++)b.box(cx,1.18+k*.26,z+.05,w/4-.15,.026,.04,C.gold,6);}
  });
  group('south-painted-beam',()=>{b.box(W/2,4.33,D-.05,W,.28,.28,C.paint,6);for(let x=.65;x<W;x+=1.3){b.box(x,4.33,D+.1,.55,.1,.035,C.gold,6);b.box(x,4.33,D+.13,.30,.055,.02,C.stone,24);}});
  // Only shallow threshold treads are added; the separate lake bank and neighboring 105 remain untouched.
  group('south-threshold',()=>{for(let j=0;j<3;j++){const h=.20*(3-j);b.box(W/2,h/2,D+.18+j*.32,5.35,h,.33,C.stone,24);}});
  roof();
 });
 return{id:ID,strategy:'building107-v46',floors:1,originalOutline:true,southBays:7,southPrincipalEntrances:1,southDoorLeaves:4,roofAxes:['east-west'],roofSegments:1,lowerEndHips:true,eaveHeight:H.eave,ridgeHeight:H.ridge,heightMeasured:false,rearElevationVerified:false,identityVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building107={id:ID,render,world,local,width:W,depth:D,heights:H,posts};
})(YY);
