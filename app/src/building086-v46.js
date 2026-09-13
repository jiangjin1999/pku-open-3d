/* Humanities Building 2 south wing: PKU's construction photograph identifies
 * its east end with numeral 2; the westward court is registered independently
 * in the aerial sequence. Two visible storeys, enclosed window bays and small
 * end-door canopies replace the old five-storey generic block. Dimensions and
 * hidden junction details remain fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/939378518';
const O=[161.217,-340.287],R=Math.atan2(4.918,35.272),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(35.272,4.918),D=13.858;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#9b4436',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:4.12,eave:7.65,ridge:11.35};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'086-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('086-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,y,t){mesh(name,G.polygon(poly,y),C.stone);const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,C.stone);}
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
 function end(name,width,isEast){const middle=width*.52,holes=[{x:middle,w:1.85,lo:H.base,hi:3.50,door:true},{x:middle,w:1.72,lo:4.73,hi:6.35,panes:2}];if(!isEast)holes.push({x:width*.82,w:2.05,lo:.98,hi:1.52,vent:true});return{holes,extra:()=>{
  group(name+'-door',()=>{b.box(middle,1.98,-.09,1.78,2.84,.045,C.dark,24);for(const x of[middle-.93,middle,middle+.93])b.box(x,2.00,.025,.10,2.99,.23,C.wood,6);for(const y of[.55,1.44,3.49])b.box(middle,y,.025,1.95,.11,.24,C.wood,6);
   for(const s of[-1,1]){b.box(middle+s*.45,1.01,.045,.77,.78,.06,C.red,6);b.box(middle+s*.45,2.42,-.02,.77,1.72,.03,C.glass,5);b.box(middle+s*.45,3.13,.04,.77,.06,.10,C.red,6);b.box(middle+s*.11,1.85,.15,.045,.25,.055,C.gold,9);}
   b.box(middle,.25,.65,2.7,.50,1.45,C.stone,10);for(let i=0;i<3;i++)b.box(middle,(i+1)*.17/2,1.60-i*.32,2.55,(i+1)*.17,.36,C.stone,10);
  });
  group(name+'-canopy-brackets',()=>{for(const x of[middle-1.1,middle+1.1]){b.beam([x,3.05,.10],[x,3.79,1.08],.10,C.wood,6);b.box(x,3.76,.55,.17,.16,1.30,C.wood,6);}});
  roof(name+'-canopy',middle-1.55,middle+1.55,.35,.98,3.88,.52);
  if(!isEast)group('west-low-vent',()=>{b.box(width*.82,1.25,-.10,2.02,.51,.045,C.dark,24);for(let i=0;i<8;i++)b.box(width*.82-.89+i*.25,1.25,.02,.10,.50,.07,C.gold,9);});
  if(isEast)group('east-number-two',()=>{const x=middle-4.1,y=2.37,p=[[-.14,.33],[.13,.33],[.21,.23],[.17,.08],[-.18,-.25],[.21,-.25]];for(let i=1;i<p.length;i++)b.beam([x+p[i-1][0],y+p[i-1][1],.07],[x+p[i][0],y+p[i][1],.07],.06,C.stone,24);});
 }};}
 b.local(O[0],0,O[1],R,()=>{
  slab('base',H.base,H.base-.02);slab('floor',H.floor,.24);slab('eaves',H.eave-.16,.14);
  const west=end('west',Math.hypot(...poly[1]),false),east=end('east',Math.hypot(poly[3][0]-poly[2][0],poly[3][1]-poly[2][1]),true);
  face('west',poly[0],poly[1],west.holes,west.extra);face('south',poly[1],poly[2],bays(W,7),width=>group('south-red-piers',()=>{for(let i=0;i<=7;i++)b.box(width*i/7,4.10,.06,.22,6.81,.20,C.red,6);}));face('east',poly[2],poly[3],east.holes,east.extra);
  face('north-east-return',poly[3],poly[4],[]);face('north-shared-with-085',poly[4],poly[5],[]);
  face('north-court',poly[5],poly[0],bays(Math.hypot(...poly[5]),2));
  roof('main',-.48,W+.48,D/2,D/2+.66,H.eave,H.ridge-H.eave,true);
 });
 return{id:ID,strategy:'building086-v46',floors:2,eaveHeight:H.eave,ridgeHeight:H.ridge,sharedEdge:f.geometry.coordinates[0].slice(4,6),doors:{west:world(poly[1][0]*.52,poly[1][1]*.52),east:world(poly[2][0]+(poly[3][0]-poly[2][0])*.52,poly[2][1]+(poly[3][1]-poly[2][1])*.52)},originalOutline:true,limits:'Use is unverified; bay dimensions, exact height, junction interiors and current condition remain fitted.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building086={id:ID,render,world,local,width:W,depth:D};
})(YY);
