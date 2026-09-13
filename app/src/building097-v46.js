/* Southwest roadside transverse range: original rectangle, two window bands and one east-west curved gable. Unseen elevations remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745068';
const O=[89.597, -327.907],R=0.1446875647034871,CO=Math.cos(R),SI=Math.sin(R),W=27.721663604480888,D=12.591249211449895;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#a04837',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:3.48,eave:6.40,ridge:9.25};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'097-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('097-'+name,g,0,0,0,1,1,1,col,mat);
 function slab(name,poly,y,t,edge=false){mesh(name,G.polygon(poly,y),C.stone);if(!edge)return;const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-t,a[1]],[q[0],y-t,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,C.stone);}
 function window(q){const y=(q.lo+q.hi)/2,h=q.hi-q.lo,n=q.panes||4;
  b.box(q.x,y,-.085,q.w-.03,h-.03,.035,C.dark,5);
  for(let i=0;i<=n;i++)b.box(q.x-q.w/2+q.w*i/n,y,.02,.070,h+.08,.19,C.red,6);
  for(const yy of[q.lo,q.hi])b.box(q.x,yy,.02,q.w+.07,.07,.20,C.red,6);
  // Rectilinear lattice behind the heavier red mullions, regional fit; exact south mullion counts remain unresolved.
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
 function roof(){
  const x0=-.50,x1=W+.50,zmid=D/2,half=D/2+.52,span=x1-x0;
  const point=(x,t,side)=>[x,H.eave+(H.ridge-H.eave)*Math.pow(t,1.3)+.36*Math.pow(Math.abs((x-W/2)/(span/2)),10)*(1-t),zmid+side*half*(1-t)];
  const surface=new G.Geometry(),tiles=new G.Geometry(),ends=new G.Geometry();
  function patch(g,a,c,t,u,side,dy=0){const p=[point(a,t,side),point(c,t,side),point(c,u,side),point(a,u,side)].map(q=>[q[0],q[1]+dy,q[2]]);if(side>0)g.quad(...p);else g.quad(p[1],p[0],p[3],p[2]);}
  for(const side of[-1,1]){
   for(let i=0;i<32;i++)for(let j=0;j<14;j++)patch(surface,x0+span*i/32,x0+span*(i+1)/32,j/14,(j+1)/14,side);
   for(let x=x0+.035;x<x1-.07;x+=.235)for(let j=0;j<14;j++)for(let k=0;k<3;k++)patch(tiles,x+k*.025,Math.min(x+(k+1)*.025,x1),j/14,(j+1)/14,side,.018+Math.sin((k+.5)*Math.PI/3)*.035);
  }
  tiles.detailWidth=.025;mesh('roof-surface',surface,C.roof,2);mesh('roof-tiles',tiles,C.tile,2);
  for(const x of[0,W])for(const side of[-1,1])for(let i=0;i<14;i++){
   const a=point(x,i/14,side),q=point(x,(i+1)/14,side),p=[[x,H.eave,a[2]],a,q,[x,H.eave,q[2]]];if((x>W/2)===(side>0))p.reverse();ends.quad(...p);
  }
  mesh('gable-ends',ends,C.brick,30);
  group('roof-trim',()=>{
   b.box(W/2,H.ridge+.10,zmid,span+.08,.22,.32,C.tile,2);
   for(const x of[x0,x1])for(const side of[-1,1])for(let i=0;i<14;i++){
    const a=point(x,i/14,side),q=point(x,(i+1)/14,side);b.beam([a[0],a[1]-.12,a[2]],[q[0],q[1]-.12,q[2]],.16,C.stone,24);b.beam(a,q,.08,C.tile,2);
   }
   for(const side of[-1,1]){
    for(let i=0;i<32;i++){const a=point(x0+span*i/32,0,side),q=point(x0+span*(i+1)/32,0,side);b.beam([a[0],a[1]-.23,a[2]],[q[0],q[1]-.23,q[2]],.16,C.red,6);}
    for(let x=x0+.12;x<x1;x+=.235){const p=point(x,0,side);b.box(x,p[1]-.11,p[2],.11,.12,.30,C.tile,2);}
   }
   for(const x of[x0+.23,x1-.23])b.beam([x,H.ridge,zmid],[x+(x<W/2?-.13:.13),H.ridge+.46,zmid],.13,C.tile,2);
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,true);slab('floor',poly,H.floor,.18);slab('ceiling',poly,H.eave-.16,.14);
  for(let i=0;i<4;i++){
   const a=poly[(i+1)%4],c=poly[i],width=Math.hypot(c[0]-a[0],c[1]-a[1]),long=i%2===0,n=long?7:2,openings=[];
   for(const [lo,hi]of[[1.06,2.92],[4.17,5.98]])for(let j=0;j<n;j++)openings.push({x:width*(j+.5)/n,w:long?width/n*.64:1.55,lo,hi,panes:long?4:2});
   face('face-'+i,a,c,openings,w=>{
    // Roadside aerial shows two red window bands separated by a broad gray belt.
    // The precise bay counts, rear and end-wall openings are fitted, not surveyed.
    group('face-'+i+'-storey-belt',()=>b.box(w/2,3.55,.025,w,.80,.13,C.stone,24));
    group('face-'+i+'-red-beam',()=>{for(const y of[3.03,6.18])b.box(w/2,y,.015,w,.14,.14,C.red,6);});
   });
  }
  roof();
 });
 return{id:ID,strategy:'building097-v46',floors:2,southTwoWindowBandsRegistered:true,allStoreysVerified:false,eaveHeight:H.eave,ridgeHeight:H.ridge,roofAxes:['east-west'],roofSegments:1,originalOutline:true,mainEntranceVerified:false,limits:'Aerial frame 24 registers the roadside transverse building, curved tiled gable and two red window bands; precise openings, hidden elevations, entrance, height and independent identity remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building097={id:ID,render,world,local,width:W,depth:D};
})(YY);
