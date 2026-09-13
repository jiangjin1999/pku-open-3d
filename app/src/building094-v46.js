/* Middle court comb-shaped building: retain its eighteen-vertex outline,
 * three north-facing fingers, unequal court recesses and southern projection.
 * Roof axes come from registered aerial / public imagery, not precinct-wide
 * naming or floor statistics. Outer elevations and measured heights are open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745065';
const O=[99.171,-406.142],R=Math.atan2(1.244,8.95),CO=Math.cos(R),SI=Math.sin(R),W=53.8511,D=26.898;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#a04837',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:4.12,eave:7.10,ridge:10.30};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'094-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('094-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,poly,y,t,edge=false){mesh(name,G.polygon(poly,y),C.stone);if(!edge)return;const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,C.stone);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo,n=q.panes||4;
  b.box(q.x,y,-.09,q.w-.04,h-.04,.04,C.glass,5);
  for(let i=0;i<=n;i++)b.box(q.x-q.w/2+q.w*i/n,y,.015,.065,h+.06,.20,C.red,6);
  for(const yy of[q.lo,q.hi,q.hi-.38])b.box(q.x,yy,.015,q.w+.07,.065,.20,C.red,6);
  b.box(q.x,q.lo-.065,.02,q.w+.17,.08,.25,C.stone,24);
 }
 function face(name,a,c,holes,extra,eave=H.eave){const dx=c[0]-a[0],dz=c[1]-a[1],width=Math.hypot(dx,dz),r=-Math.atan2(dz,dx);
  b.local(a[0],0,a[1],r,()=>{
   const levels=[H.base,eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
   group(name+'-wall',()=>{for(let j=1;j<levels.length;j++){
    const lo=levels[j-1],hi=levels[j],cuts=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).sort((a,c)=>a.x-c.x);let cursor=0;
    const part=(a,c)=>{if(c>a+1e-6)b.box((a+c)/2,(lo+hi)/2,-.16,c-a,hi-lo,.32,C.brick,30);};
    for(const q of cuts){part(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}part(cursor,width);
   }});
   group(name+'-windows',()=>{for(const q of holes)if(!q.door&&!q.vent)window(q);});
   group(name+'-belt',()=>{for(const[y,h,d]of[[.64,.11,.06],[H.floor,.20,.09],[H.floor-.19,.07,.10]])b.box(width/2,y,.015,width,h,d,C.stone,24);});
   if(extra)extra(width);
  });
 }
 function bays(width,count,eave=H.eave){const q=[];for(let i=0;i<count;i++)for(let fl=0;fl<2;fl++)q.push({x:width*(i+.5)/count,w:width/count*.86,lo:fl?4.57:1.03,hi:fl?eave-.66:3.70});return q;}
 function roof(name,x0,x1,zmid,half,eave,rise,main=false){
  const span=x1-x0,point=(x,t,s)=>[x,eave+rise*Math.pow(t,1.30)+.17*Math.pow(Math.abs((x-(x0+x1)/2)/(span/2)),10)*(1-t),zmid+s*half*(1-t)];
  const surface=new G.Geometry(),tiles=new G.Geometry();
  function patch(g,a,c,t,u,s,dy=0){const p=[point(a,t,s),point(c,t,s),point(c,u,s),point(a,u,s)].map(q=>[q[0],q[1]+dy,q[2]]);if(s>0)g.quad(...p);else g.quad(p[1],p[0],p[3],p[2]);}
  for(const s of[-1,1]){for(let i=0;i<24;i++)for(let j=0;j<14;j++)patch(surface,x0+span*i/24,x0+span*(i+1)/24,j/14,(j+1)/14,s);
   for(let x=x0+.035;x<x1-.07;x+=.235)for(let j=0;j<14;j++)for(let k=0;k<3;k++)patch(tiles,x+k*.025,Math.min(x+(k+1)*.025,x1),j/14,(j+1)/14,s,.018+Math.sin((k+.5)*Math.PI/3)*.035);
  }tiles.detailWidth=.025;mesh('roof-'+name+'-surface',surface,C.roof,2);mesh('roof-'+name+'-tiles',tiles,C.tile,2);
  const gables=new G.Geometry();for(const x of[x0+.40,x1-.40])for(const s of[-1,1])for(let i=0;i<14;i++){
   const a=point(x,i/14,s),q=point(x,(i+1)/14,s),p=[[x,eave,a[2]],a,q,[x,eave,q[2]]];if((x>x0+span/2)===(s>0))p.reverse();gables.quad(...p);
  }mesh('roof-'+name+'-gable',gables,main?C.brick:C.wood,main?30:6);
  group('roof-'+name+'-trim',()=>{
   b.box((x0+x1)/2,eave+rise+.10,zmid,span+.08,.22,.32,C.tile,2);
   for(const x of[x0,x1])for(const s of[-1,1])for(let i=0;i<14;i++){
    const a=point(x,i/14,s),q=point(x,(i+1)/14,s);b.beam([a[0],a[1]-.12,a[2]],[q[0],q[1]-.12,q[2]],main?.17:.10,C.stone,24);b.beam(a,q,.08,C.tile,2);
   }
   for(const s of[-1,1]){b.box((x0+x1)/2,eave-.10,zmid+s*half,span,.20,.20,main?C.stone:C.wood,main?24:6);for(let x=x0+.12;x<x1;x+=.235){const p=point(x,0,s);b.box(x,p[1]-.11,p[2],.11,.12,.30,C.tile,2);}}
   for(const x of[x0+.23,x1-.23]){b.beam([x,eave+rise,zmid],[x+(x<(x0+x1)/2?-.13:.13),eave+rise+.46,zmid],.13,C.tile,2);}
  });
 }
 function paintedBeam(name,width,y){group(name,()=>{
  b.box(width/2,y,0,width,.24,.25,C.red,6);
  for(let x=.12;x<width;x+=2.4){b.box(x,y,.14,.22,.31,.035,'#386b5b',6);for(const dx of[-.07,.07])b.box(x+dx,y,.166,.025,.28,.025,C.gold,9);}
 });}
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,true);
  slab('upper-floor',poly,H.floor,.24);slab('eaves',poly,H.eave-.16,.14);
  // The three north fingers and both re-entrant courts are the original OSM
  // boundary, not a bounding rectangle. Only visible central court elevations
  // receive recessed two-level galleries; outer openings remain a fit.
  const counts=[0,3,1,3,0,3,5,3,0,5,0,1,5,1,4,2,0,3];
  for(let i=0;i<poly.length;i++){
   const originalA=poly[(i+1)%poly.length],originalC=poly[i];
   const dx=originalC[0]-originalA[0],dz=originalC[1]-originalA[1],w=Math.hypot(dx,dz),normal=[-dz/w,dx/w];
   const gallery=[5,6,7].includes(i),depth=gallery?1.10:0;
   const a=[originalA[0]-normal[0]*depth,originalA[1]-normal[1]*depth],c=[originalC[0]-normal[0]*depth,originalC[1]-normal[1]*depth];
   const count=counts[i],holes=count?bays(w,count):[];
   face('face-'+i,a,c,holes,width=>{
    if(count)group('piers-'+i,()=>{for(let j=0;j<=count;j++)b.box(width*j/count,(H.base+H.eave-.30)/2,.03,.19,H.eave-.30-H.base,.16,C.red,6);});
    if(count)paintedBeam('painted-'+i,width,H.eave-.29);
   });
   if(gallery){
    b.local(originalA[0],0,originalA[1],-Math.atan2(dz,dx),()=>{
     group('court-gallery-'+i,()=>{
      b.box(w/2,H.floor-.10,-depth/2,w,.24,depth+.12,C.stone,24);
      for(let j=0;j<=count;j++)b.cyl(w*j/count,H.base,-.12,.13,H.eave-.38-H.base,C.red,12,1,6);
      for(const y of[H.floor+.20,H.floor+.90])b.box(w/2,y,-.12,w,.08,.10,C.red,6);
      for(let x=.20;x<w;x+=.52){b.box(x,H.floor+.55,-.12,.06,.70,.08,C.red,6);b.box(x+.14,H.floor+.57,-.12,.28,.055,.08,C.red,6);}
     });
    });
    // Recess returns close each gallery end within its existing wing.
    face('gallery-return-'+i+'-a',originalA,a,[]);face('gallery-return-'+i+'-b',c,originalC,[]);
   }
  }
  // Roof coordinates are independent bounded spans: three north-south roofs,
  // a shallower west crosspiece and the broader projecting south room.
  // North-south spans use a local quarter-turn without rotating the footprint.
  function longitudinal(name,cx,z0,z1,half,rise){
   b.local(cx,0,0,-Math.PI/2,()=>roof(name,z0,z1,0,half,H.eave,rise,true));
  }
  longitudinal('west-finger',4.529,-.50,13.79,5.03,2.55);
  longitudinal('middle-finger',19.522,.55,16.72,5.61,2.80);
  longitudinal('east-finger',48.698,1.22,22.24,5.72,2.80);
  roof('west-crosspiece',6.53,24.45,16.91,5.16,H.eave,1.90,true);
  roof('south-room',23.35,43.82,19.29,8.17,H.eave,3.20,true);
 });
 return{id:ID,strategy:'building094-v46',floors:2,eaveHeight:H.eave,ridgeHeight:H.ridge,roofAxes:['north-south','north-south','north-south','east-west','east-west'],roofSegments:5,northCourtRecesses:2,originalOutline:true,mainEntranceVerified:false,limits:'Three longitudinal roof fingers and the south crosspiece registered from satellite and aerial; central/east inner galleries show two levels. West wing, outer openings, south elevation, joints, height and use remain fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building094={id:ID,render,world,local,width:W,depth:D};
})(YY);
