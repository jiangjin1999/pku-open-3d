/* The I-shaped wing north of Humanities Building 6: two transverse grey
 * tiled ranges and a narrower longitudinal link. PKU's Chinese Department
 * court photograph shows the southern two-storey red window wall; aerial and
 * satellite register the three roof ranges. Hidden faces, openings and exact
 * heights are fitted, and no unverified main entrance or plaque is added. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745060';
const O=[137.765,-513.335],R=Math.atan2(4.741,30.711),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(30.711,4.741),D=39.167763;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#9b4436',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:4.12,eave:7.65,ridge:11.35};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'089-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('089-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,y,t){mesh(name,G.polygon(poly,y),C.stone);if(name!=='base')return;/* Interior slab edges coincide with the wall; only the exposed base needs an edge. */const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,C.stone);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo,n=q.panes||4;
  b.box(q.x,y,-.09,q.w-.04,h-.04,.04,C.glass,5);
  for(let i=0;i<=n;i++)b.box(q.x-q.w/2+q.w*i/n,y,.015,.065,h+.06,.20,C.red,6);
  for(const yy of[q.lo,q.hi,q.hi-.38])b.box(q.x,yy,.015,q.w+.07,.065,.20,C.red,6);
  b.box(q.x,q.lo-.065,.02,q.w+.17,.08,.25,C.stone,24);
 }
 function face(name,a,c,holes,extra){const dx=c[0]-a[0],dz=c[1]-a[1],width=Math.hypot(dx,dz),r=-Math.atan2(dz,dx);
  b.local(a[0],0,a[1],r,()=>{
   const levels=[H.base,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
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
 function bays(width,count){const q=[];for(let i=0;i<count;i++)for(let fl=0;fl<2;fl++)q.push({x:width*(i+.5)/count,w:width/count*.86,lo:fl?4.57:1.03,hi:fl?6.99:3.70});return q;}
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
 b.local(O[0],0,O[1],R,()=>{
  // The three intersecting roofs follow this individual I-shaped footprint;
  // the two courtyard recesses are never covered by a bounding-box slab.
  slab('base',H.base,H.base-.02);slab('floor',H.floor,.24);slab('eaves',H.eave-.16,.14);
  const names=['north-long','north-east-end','north-south-court','connector-east','south-north-east','south-east-end','south-long','south-west-end','south-north-west','connector-west','north-small-return','north-west-end'];
  const counts=[6,0,4,2,1,0,5,0,2,2,0,0];
  for(let i=0;i<poly.length;i++){
   const a=poly[(i+1)%poly.length],c=poly[i],width=Math.hypot(c[0]-a[0],c[1]-a[1]);
   // Upper gable apertures can be registered in the aerial. Main entrance,
   // hidden doors and an independent institutional plaque are not established.
   const holes=counts[i]?bays(width,counts[i]):([1,5,7,11].includes(i)?[{x:width*.51,w:1.72,lo:4.73,hi:6.35,panes:2}]:[]);
   face(names[i],a,c,holes,width=>{
    if(counts[i])group(names[i]+'-red-piers',()=>{for(let j=0;j<=counts[i];j++)b.box(width*j/counts[i],4.10,.06,.20,6.81,.18,C.red,6);});
   });
  }
  roof('north-bar',-.48,W+.50,6.445,7.10,H.eave,H.ridge-H.eave,true);
  roof('south-bar',-11.50,15.27,32.543,7.28,H.eave,H.ridge-H.eave,true);
  // Lower north-south ridge enters beneath the two higher transverse ridges.
  // Its terminal gables are buried inside the bars, preventing an invented
  // freestanding gable at either internal roof junction.
  b.local(3.736,0,6.445,-Math.PI/2,()=>roof('connecting-range',0,26.098,0,5.75,H.eave,2.85,true));
 });
 return{id:ID,strategy:'building089-v46',floors:2,eaveHeight:H.eave,ridgeHeight:H.ridge,roofAxes:['east-west','north-south','east-west'],roofSegments:3,originalOutline:true,mainEntranceVerified:false,limits:'South two-storey red window wall and split roofs are documented; northern hidden elevations, use, exact height and bay dimensions remain fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building089={id:ID,render,world,local,width:W,depth:D};
})(YY);
