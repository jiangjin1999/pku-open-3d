/* Central court north range. Four individually bounded roof spans follow the
 * public fourteen-vertex outline: west room, narrower west link, taller central
 * room and east link. The two-storey court elevation is visible in aerial 24/26;
 * storeys of the west room and the level/openness of links remain fitted.
 * This object is not the entire humanities precinct; no institutional plaque
 * or unregistered doorway is introduced. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745064';
const O=[103.228,-420.254],R=Math.atan2(1.766,11.999),CO=Math.cos(R),SI=Math.sin(R),W=47.2583,D=14.5147;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#a04837',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:4.12,eave:7.65,ridge:11.35};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'093-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('093-'+name,g,0,0,0,1,1,1,col,mat);
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
 function room(name,p,eave,counts,southGallery=false){
  slab(name+'-floor',p,H.floor,.24);slab(name+'-eaves',p,eave-.16,.14);
  for(let i=0;i<p.length;i++){
   let a=p[(i+1)%p.length],c=p[i];const w=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(southGallery&&i===6){
    // South gallery stays within the existing central projection.
    a=[a[0],a[1]-1.30];c=[c[0],c[1]-1.30];
   }
   const count=counts[i]||0,holes=count?bays(w,count,eave):[];
   face(name+'-face-'+i,a,c,holes,width=>{
    if(count)group(name+'-piers-'+i,()=>{for(let j=0;j<=count;j++)b.box(width*j/count,(H.base+eave-.30)/2,.03,.19,eave-.30-H.base,.16,C.red,6);});
    if(count)paintedBeam(name+'-painted-'+i,width,eave-.29);
   },eave);
  }
 }
 function link(name,p){
  const floor=4.12,eave=6.65;
  slab(name+'-deck',p,floor,.24,true);
  // Elevated covered-link expression is a spatial fit, not surveyed access.
  // Keep its underside open; never fill the connecting strip as a five-storey wall.
  group(name+'-posts',()=>{for(const i of[0,1,2,3]){const q=p[i];b.cyl(q[0],H.base,q[1],.11,3.36,'#4e6559',8,1,24);b.cyl(q[0],floor,q[1],.115,2.44,'#496959',8,1,6);}});
  for(const [i,j]of[[0,1],[3,2]]){
   const a=p[i],c=p[j],w=Math.hypot(c[0]-a[0],c[1]-a[1]);
   b.local(a[0],0,a[1],-Math.atan2(c[1]-a[1],c[0]-a[0]),()=>{
    group(name+'-rail-'+i,()=>{for(const y of[4.34,4.94])b.box(w/2,y,0,w,.08,.09,C.wood,6);for(let x=.15;x<w;x+=.54)b.box(x,4.64,0,.06,.63,.07,C.wood,6);});
    paintedBeam(name+'-painted-'+i,w,eave-.21);
   });
  }
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,true);
  const west=[poly[0],poly[1],[poly[1][0],10.058],poly[13]];
  const westLink=[poly[2],poly[3],poly[12],[poly[1][0],10.058]];
  const core=[poly[3],poly[4],poly[5],poly[6],[poly[6][0],9.942],poly[9],poly[10],poly[11],poly[12]];
  const eastLink=[poly[6],poly[7],poly[8],poly[9]];
  room('west-room',west,7.10,[2,0,2,0]);
  room('central-room',core,H.eave,[0,5,0,0,0,0,5,0,0],true);
  link('west-link',westLink);link('east-link',eastLink);
  group('south-gallery',()=>{
   const left=poly[11][0],right=poly[10][0],z=14.49,step=(right-left)/5;
   b.box((left+right)/2,H.floor-.07,z-.57,right-left,.24,1.42,C.stone,24);
   for(let i=0;i<=5;i++)b.cyl(left+step*i,H.base,z-.04,.14,6.79,C.red,12,1,6);
   for(const y of[4.32,5.02])b.box((left+right)/2,y,z,right-left,.08,.1,C.red,6);
   for(let x=left+.2;x<right;x+=.50){b.box(x,4.66,z,.06,.7,.075,C.red,6);b.box(x+.14,4.68,z,.28,.055,.075,C.red,6);}
  });
  roof('west-room',-.55,12.69,5.029,5.59,7.10,2.90,true);
  roof('west-link',11.95,19.04,6.056,4.48,6.65,1.50,true);
  roof('central-room',17.68,40.14,7.606,7.46,H.eave,3.70,true);
  roof('east-link',38.20,47.81,6.447,4.05,6.65,1.50,true);
 });
 return{id:ID,strategy:'building093-v46',floors:2,eaveHeight:H.eave,ridgeHeight:11.35,roofAxes:['east-west','east-west','east-west','east-west'],roofSegments:4,linkDeckHeight:4.12,originalOutline:true,mainEntranceVerified:false,limits:'Central court-facing two-storey gallery and four roof spans registered from aerial; west room, link openness/level, all north and end openings, exact height and use remain fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building093={id:ID,render,world,local,width:W,depth:D};
})(YY);
