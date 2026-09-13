/* Small south-facing entrance range in the central humanities court.
 * The seventeen-point outline gives a higher projecting centre, two low wings
 * and a narrow northward west return. Ground/aerial registration supports one
 * storey and the red south gate; rear elevation and precise height stay open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745066';
const O=[117.319,-384.301],R=Math.atan2(.722,5.295),CO=Math.cos(R),SI=Math.sin(R),W=32.611,D=20.192;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#a04837',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:0,eave:4.85,ridge:8.25};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'095-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('095-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,poly,y,t,edge=false){mesh(name,G.polygon(poly,y),C.stone);if(!edge)return;const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,C.stone);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo,n=q.panes||4;
  b.box(q.x,y,-.085,q.w-.03,h-.03,.035,C.dark,5);
  for(let i=0;i<=n;i++)b.box(q.x-q.w/2+q.w*i/n,y,.02,.070,h+.08,.19,C.red,6);
  for(const yy of[q.lo,q.hi])b.box(q.x,yy,.02,q.w+.07,.07,.20,C.red,6);
  // Rectilinear lattice behind the heavier red mullions, photographed south face.
  for(let j=0;j<n;j++){
   const cx=q.x-q.w/2+q.w*(j+.5)/n,ww=q.w/n-.13;
   for(let yy=q.lo+.20;yy<q.hi-.08;yy+=.37){b.box(cx,yy,.068,ww,.028,.045,C.wood,6);b.box(cx-ww*.26,yy+.08,.068,.028,.20,.045,C.wood,6);b.box(cx+ww*.26,yy+.08,.068,.028,.20,.045,C.wood,6);}
  }
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
   group(name+'-belt',()=>{for(const[y,h,d]of[[.64,.11,.06]])b.box(width/2,y,.015,width,h,d,C.stone,24);});
   if(extra)extra(width);
  });
 }
 function roof(name,x0,x1,zmid,half,eave,rise,main=false){
  const span=x1-x0,point=(x,t,s)=>[x,eave+rise*Math.pow(t,1.30)+.38*Math.pow(Math.abs((x-(x0+x1)/2)/(span/2)),10)*(1-t),zmid+s*half*(1-t)];
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
   for(const s of[-1,1]){
    // Red eave boards and pale rafter ends follow the photographed roof curve.
    for(let i=0;i<24;i++){const a=point(x0+span*i/24,0,s),q=point(x0+span*(i+1)/24,0,s);b.beam([a[0],a[1]-.24,a[2]],[q[0],q[1]-.24,q[2]],.16,C.red,6);}
    for(let x=x0+.12;x<x1;x+=.235){const p=point(x,0,s);b.box(x,p[1]-.11,p[2],.11,.12,.30,C.tile,2);b.box(x,p[1]-.34,p[2]-.06*s,.085,.12,.15,C.gold,6);}
   }
   for(const x of[x0+.23,x1-.23]){b.beam([x,eave+rise,zmid],[x+(x<(x0+x1)/2?-.13:.13),eave+rise+.46,zmid],.13,C.tile,2);}
  });
 }
 function paintedBeam(name,width,y){group(name,()=>{
  b.box(width/2,y,0,width,.24,.25,C.red,6);
  for(let x=.12;x<width;x+=2.4){b.box(x,y,.14,.22,.31,.035,'#386b5b',6);for(const dx of[-.07,.07])b.box(x+dx,y,.166,.025,.28,.025,C.gold,9);}
 });}
 b.local(O[0],0,O[1],R,()=>{
  // Cut the stair bay out of the raised base. Otherwise its solid slab hides
  // the lower treads even though the steps themselves have correct heights.
  const frontMid=(poly[12][0]+poly[10][0])/2,frontZ=(poly[12][1]+poly[10][1])/2;
  const stairW=4.75,base=poly.slice(0,11).concat([[frontMid+stairW/2,frontZ],[frontMid+stairW/2,frontZ-.96],[frontMid-stairW/2,frontZ-.96],[frontMid-stairW/2,frontZ]],poly.slice(11));
  slab('base',base,H.base,H.base-.02,true);
  const core=[poly[3],poly[4],poly[5],poly[6],[poly[6][0],poly[9][1]],poly[9],poly[10],poly[11],poly[12],poly[13],[poly[3][0],poly[13][1]]];
  const westWing=[poly[2],poly[3],[poly[3][0],poly[13][1]],poly[13],poly[14],poly[15]];
  const eastWing=[poly[6],poly[7],poly[8],poly[9],[poly[6][0],poly[9][1]]];
  const westReturn=[poly[0],poly[1],poly[2],poly[15],poly[16]];
  slab('core-ceiling',core,H.eave-.16,.14);
  for(const [name,p]of[['west-wing',westWing],['east-wing',eastWing],['west-return',westReturn]])slab(name+'-ceiling',p,3.54,.14);
  function row(width,count,eave){return Array.from({length:count},(_,i)=>({x:width*(i+.5)/count,w:width/count*.73,lo:1.04,hi:eave-.59}));}
  const counts=[0,2,2,0,3,0,2,0,2,0,0,0,0,2,0,0,2];
  for(let i=0;i<poly.length;i++){
   // Two nearly collinear south edges form one continuous central front.
   if(i===10||i===11)continue;
   const a=poly[(i+1)%poly.length],c=poly[i],w=Math.hypot(c[0]-a[0],c[1]-a[1]);
   const high=[3,4,5,9,12].includes(i),eave=high?H.eave:3.70;
   face('face-'+i,a,c,counts[i]?row(w,counts[i],eave):[],width=>{
    if(counts[i]){paintedBeam('painted-'+i,width,eave-.24);group('posts-'+i,()=>{for(let j=0;j<=counts[i];j++)b.cyl(width*j/counts[i],H.base,-.03,.12,eave-.30-H.base,C.red,12,1,6);});}
   },eave);
  }
  // South front is recessed inside the existing projecting centre, including
  // its three internal steps, so no new apron consumes the original courtyard.
  const a=poly[12],c=poly[10],width=c[0]-a[0],z=(a[1]+c[1])/2,doorWidth=4.15,doorHigh=3.50,depth=.96;
  const openings=[{x:width/2,w:doorWidth,lo:H.base,hi:doorHigh,door:true},...[-1,1].map(s=>({x:width/2+s*4.50,w:3.44,lo:1.22,hi:4.04,panes:4}))];
  face('south-front',[a[0],z-depth],[c[0],z-depth],openings,w=>{
   group('south-entry',()=>{
    b.box(w/2,2.05,-.18,doorWidth+.25,3.18,.12,C.dark,6);
    for(const side of[-1,1]){
     const x=w/2+side*doorWidth/4;b.box(x,2.02,-.09,doorWidth/2-.04,2.98,.14,C.red,6);
     for(let row=0;row<7;row++)for(let col=0;col<5;col++)b.box(x-doorWidth/4+.25+col*(doorWidth/2-.50)/4,1.01+row*.33,.004,.066,.066,.040,C.gold,9);
    }
    b.box(w/2,2.03,.006,.055,2.98,.035,C.wood,6);
    for(const x of[w/2-doorWidth/2-.12,w/2+doorWidth/2+.12])b.box(x,2.02,.055,.19,3.06,.24,C.wood,6);
    for(const y of[.55,3.53])b.box(w/2,y,.055,doorWidth+.40,.16,.24,C.wood,6);
    for(let j=0;j<4;j++)b.box(w/2-1.3+j*.86,3.73,.12,.13,.13,.10,'#405d77',6);
   });
   paintedBeam('south-front-beam',w,4.59);
   group('south-front-posts',()=>{for(const x of[.22,w/2-doorWidth/2-.45,w/2+doorWidth/2+.45,w-.22])b.cyl(x,H.base,depth-.12,.145,3.99,C.red,12,1,6);});
   group('south-front-transom',()=>{for(const x of[w/2-4.50,w/2+4.50]){b.box(x,4.28,.025,3.50,.23,.11,C.red,6);for(let dx=-1.5;dx<=1.5;dx+=.3)b.box(x+dx,4.28,.093,.040,.20,.045,C.gold,6);}});
   group('south-steps',()=>{for(let j=0;j<3;j++){const top=.17*(j+1);b.box(w/2,top/2,depth-.32*j-.16,stairW,top,.32,C.stone,24);}});
  });
  face('front-return-west',[a[0],z],[a[0],z-depth],[],null,H.eave);face('front-return-east',[c[0],z-depth],[c[0],z],[],null,H.eave);
  b.local(2.678,0,0,-Math.PI/2,()=>roof('west-return',-.43,11.00,0,3.12,3.70,1.55,true));
  roof('west-wing',3.66,12.50,14.48,4.24,3.70,1.65,true);
  roof('east-wing',25.15,33.06,14.39,4.16,3.70,1.65,true);
  roof('central-hall',10.62,26.59,14.40,6.34,H.eave,3.40,true);
 });
 return{id:ID,strategy:'building095-v46',floors:1,eaveHeight:H.eave,ridgeHeight:H.ridge,roofAxes:['north-south','east-west','east-west','east-west'],roofSegments:4,originalOutline:true,southDoorPresent:true,doorWidth:4.15,stepsWithinOriginalProjection:true,limits:'South single-storey red lattice front, central doorway and higher centre registered with aerial / ground photographs; exact identity, north elevation, west return, heights and ornament remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building095={id:ID,render,world,local,width:W,depth:D};
})(YY);
