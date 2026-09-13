/* Langrunyuan 13: the identified southeast photograph supports four storeys,
 * recessed south balconies, a single east-end window column and pale bands.
 * Trees hide much of the south face; balcony spacing and the unseen north/west
 * elevations remain approximations, not surveyed or accepted facades. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/873446769';
const C={wall:'#b5af97',band:'#d4d1bb',base:'#aaa999',frame:'#515f56',glass:'#657371',roof:'#737c74',recess:'#8b8d7e',metal:'#868d80'};
function render(b,f,add){
 b.id=f.properties.pickId;const p=f.geometry.coordinates[0].slice(0,4),fr=Y.ArchitectureAdapter.frame(f.geometry),rise=Math.min(5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17),f.properties.height*.29),body=f.properties.height-rise,fh=(body-.55)/4;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'078-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('078-'+name,g,0,0,0,1,1,1,c,mat);
 mesh('base',F.walls(f.geometry,.03,.55),C.base,24);
 function window(q,depth=-.11,frame=C.frame,name='window'){
  group(name+'-glass',()=>b.box(q.x,(q.lo+q.hi)/2,depth-.06,q.w-.08,q.hi-q.lo-.07,.04,C.glass,5));
  group(name+'-frame',()=>{
   for(const x of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(x,(q.lo+q.hi)/2,depth,.055,q.hi-q.lo+.06,.14,frame,6);
   for(const y of[q.lo,q.hi,q.hi-.43])b.box(q.x,y,depth,q.w+.06,.055,.14,frame,6);
   b.box(q.x,q.lo-.07,depth+.055,q.w+.23,.12,.29,C.band,24);
  });
 }
 function wall(width,holes){
  const levels=[.55,body,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>v>=.55&&v<=body&&a.indexOf(v)===i).sort((a,b)=>a-b);
  group('wall',()=>{for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).sort((a,b)=>a.x-b.x);let cursor=0;
   const part=(a,c)=>{if(c>a+1e-6)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,C.wall,24);};
   for(const q of cuts){part(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}part(cursor,width);
  }});
 }
 function balcony(q,index){
  const floor=.55+q.floor*fh,depth=1.38;
  group('balcony-'+index+'-recess',()=>{
   // Back wall is genuinely behind the aperture; no continuous facade covers it.
   b.box(q.x,(floor+fh/2),-depth-.16,q.w,fh,.32,C.recess,24);
   for(const x of[q.x-q.w/2+.06,q.x+q.w/2-.06])b.box(x,floor+fh/2,-depth/2,.12,fh,depth,C.band,24);
   b.box(q.x,floor+.07,-depth/2,q.w,.14,depth+.08,C.band,24);
   b.box(q.x,floor+fh-.13,-depth/2,q.w,.24,depth+.08,C.band,24);
   window({x:q.x,w:q.w*.72,lo:floor+.35,hi:floor+fh-.54},-depth+.04,C.frame,'back-window');
  });
  if(q.open){group('balcony-'+index+'-rail',()=>{
   for(const y of[floor+.31,floor+1.13])b.box(q.x,y,.025,q.w,.065,.075,C.band,24);
   const count=Math.floor(q.w/.42),step=q.w/count;
   for(let i=0;i<count;i++){
    const x=q.x-q.w/2+(i+.5)*step,w=.24,lo=floor+.42,hi=floor+1.01;
    // Narrow rounded-rectangle motifs in the photographed second-floor rail.
    const pts=[[x-w/2,lo+.09,.025],[x-w/2+.06,lo,.025],[x+w/2-.06,lo,.025],[x+w/2,lo+.09,.025],[x+w/2,hi-.09,.025],[x+w/2-.06,hi,.025],[x-w/2+.06,hi,.025],[x-w/2,hi-.09,.025]];
    for(let j=0;j<pts.length;j++)b.beam(pts[j],pts[(j+1)%pts.length],.014,C.band,9);
   }
  });}else{
   group('balcony-'+index+'-infill',()=>b.box(q.x,floor+.28,-.025,q.w,.56,.22,C.wall,24));
   window({x:q.x,w:q.w-.13,lo:floor+.58,hi:floor+fh-.28},-.025,C.frame,'balcony-'+index+'-enclosure');
   group('balcony-'+index+'-mullions',()=>{for(const t of[-.25,.25])b.box(q.x+t*q.w,floor+fh*.55,.035,.04,fh-.89,.12,C.frame,6);});
  }
 }
 const faceInfo=[];
 for(let side=0;side<4;side++){
  const a=p[side],c=p[(side+1)%4],dx=c[0]-a[0],dz=c[1]-a[1],width=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),name=['west','south','east','north'][side],holes=[];
  // The distant pair and their spacing are a restrained fit to the tree-obscured
  // photograph. Only the nearest east stack and end window column are distinct.
  const stacks=side===1?[{x:width*.25,w:3.10},{x:width*.35,w:3.10},{x:width-2.65,w:4.15}]:[];
  for(let floor=0;floor<4;floor++){
   const base=.55+floor*fh;
   if(side===1){
    for(const q of stacks)holes.push({...q,lo:base+.14,hi:base+fh-.24,balcony:true,floor,open:floor===1});
    for(const x of[width*.07,width*.49,width*.60,width*.72])holes.push({x,w:1.65,lo:base+.94,hi:base+2.68,floor});
   }else{
    const count=side===2?1:side===0?3:9;
    for(let i=0;i<count;i++)holes.push({x:side===2?width*.77:width*(i+.5)/count,w:side===2?1.75:side===0?1.8:2.04,lo:base+.94,hi:base+2.68,floor});
   }
  }
  b.local(a[0],0,a[1],angle,()=>group(name,()=>{
   wall(width,holes);
   for(const q of holes){if(q.balcony)balcony(q,stacks.findIndex(s=>s.x===q.x)+'-'+q.floor);else window(q,-.10,side===2&&q.floor===2?'#d7ddd1':C.frame);}
   group('bands',()=>{
    for(let i=1;i<4;i++)b.box(width/2,.55+i*fh-.10,.025,width,.25,.41,C.band,24);
    for(const x of[.18,width-.18,...(side===2?[width*.61]:[])])b.box(x,body/2,.04,.32,body,.46,C.band,24);
    b.box(width/2,body-.14,.055,width,.28,.47,C.band,24);
    b.box(width/2,body+.025,0,width+.10,.09,.58,'#6e7669',24);
   });
   if(side===2)group('east-details',()=>{
    const y=.55+2*fh+1.1,x=width*.77+1.04;
    b.box(x,y,.29,.58,.49,.43,'#b9bdb0',24);
    for(let i=0;i<5;i++)b.box(x,y-.16+i*.08,.52,.47,.025,.015,C.metal,9);
    // Fine panel joints are visible on the blank east end wall.
    for(const y of[2.35,5.68,9.01,12.34])b.box(width*.32,y,.006,width*.55,.017,.018,'#a49f8c',24);
   });
  }));
  faceInfo.push({side:name,width,windowColumns:side===2?1:side===0?3:side===3?9:4,balconyStacks:stacks.length});
 }
 const planes=p.map((a,i)=>{const c=p[(i+1)%4],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz),nx=dz/length,nz=-dx/length;return[nx,nz,-nx*a[0]-nz*a[1]];});
 function junction(i,j,k){const a=planes[i].map((v,n)=>v-planes[j][n]),c=planes[i].map((v,n)=>v-planes[k][n]),det=a[0]*c[1]-c[0]*a[1],x=(a[1]*c[2]-c[1]*a[2])/det,z=(c[0]*a[2]-a[0]*c[2])/det;return[x,planes[i][0]*x+planes[i][1]*z+planes[i][2],z];}
 const w=junction(0,1,3),e=junction(2,1,3),slope=rise/Math.max(w[1],e[1]),a=[w[0],body+w[1]*slope,w[2]],c=[e[0],body+e[1]*slope,e[2]],q=p.map(v=>[v[0],body,v[1]]);
 [[q[0],q[1],a],[q[1],q[2],c,a],[q[2],q[3],c],[q[3],q[0],a,c]].forEach((points,i)=>{const g=new G.Geometry();for(let j=1;j<points.length-1;j++)g.tri(points[0],points[j],points[j+1]);mesh('roof-slope-'+i,g,C.roof,19);});
 return {id:ID,strategy:'building078-v46',bodyHeight:body,roofRise:rise,sourceOutline:true,faces:faceInfo,limits:'Balcony arrangement is approximate; the north and west facades and both entrance positions remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
})(YY);
