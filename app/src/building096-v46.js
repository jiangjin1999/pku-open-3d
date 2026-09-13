/* Southwest humanities range: two parallel north-south gables share one
 * valley within the original four-corner footprint. Aerial/satellite support
 * roof topology and red south gables; ground elevations and identity stay open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/986745067';
const O=[79.699,-347.06],R=Math.atan2(2.865,19.993),CO=Math.cos(R),SI=Math.sin(R),W=20.19723431561856,D=16.299383314349512;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={brick:'#929993',stone:'#c8c9be',red:'#a04837',wood:'#814335',roof:'#69736b',tile:'#959e91',glass:'#687d79',dark:'#30433e',gold:'#b59f6c'};
const H={base:.52,floor:0,eave:4.15,ridge:7.0};
function render(b,f){
 b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'096-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('096-'+name,g,0,0,0,1,1,1,col,mat);
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
 function roof(name,cx,westHalf,eastHalf,outer){
  const x0=-.46,x1=D+.46,span=x1-x0,eave=H.eave,rise=H.ridge-eave;
  b.local(cx,0,0,-Math.PI/2,()=>{
   const point=(x,t,side)=>[x,eave+rise*Math.pow(t,1.3)+.30*Math.pow(Math.abs((x-(x0+x1)/2)/(span/2)),10)*(1-t),side*(side>0?westHalf:eastHalf)*(1-t)];
   const surface=new G.Geometry(),tiles=new G.Geometry();
   function patch(g,a,c,t,u,side,dy=0){const p=[point(a,t,side),point(c,t,side),point(c,u,side),point(a,u,side)].map(q=>[q[0],q[1]+dy,q[2]]);if(side>0)g.quad(...p);else g.quad(p[1],p[0],p[3],p[2]);}
   for(const side of [-1,1]){
    for(let i=0;i<24;i++)for(let j=0;j<14;j++)patch(surface,x0+span*i/24,x0+span*(i+1)/24,j/14,(j+1)/14,side);
    for(let x=x0+.035;x<x1-.07;x+=.235)for(let j=0;j<14;j++)for(let k=0;k<3;k++)patch(tiles,x+k*.025,Math.min(x+(k+1)*.025,x1),j/14,(j+1)/14,side,.018+Math.sin((k+.5)*Math.PI/3)*.035);
   }
   tiles.detailWidth=.025;mesh('roof-'+name+'-surface',surface,C.roof,2);mesh('roof-'+name+'-tiles',tiles,C.tile,2);
   const gables=new G.Geometry(),southRed=new G.Geometry();
   for(const x of[0,D])for(const side of[-1,1])for(let i=0;i<14;i++){
    const a=point(x,i/14,side),q=point(x,(i+1)/14,side),p=[[x,eave,a[2]],a,q,[x,eave,q[2]]];if((x>D/2)===(side>0))p.reverse();gables.quad(...p);
    if(x===D){const a=point(x,.19+.81*i/14,side),q=point(x,.19+.81*(i+1)/14,side),p=[[x+.014,eave+.15,a[2]],[x+.014,a[1]-.16,a[2]],[x+.014,q[1]-.16,q[2]],[x+.014,eave+.15,q[2]]];if(side>0)p.reverse();southRed.quad(...p);}
   }
   mesh('roof-'+name+'-gables',gables,C.brick,30);mesh('roof-'+name+'-south-red-gable',southRed,C.red,6);
   group('roof-'+name+'-trim',()=>{
    b.box((x0+x1)/2,H.ridge+.10,0,span+.08,.22,.32,C.tile,2);
    for(const x of[x0,x1])for(const side of[-1,1])for(let i=0;i<14;i++){
     const a=point(x,i/14,side),q=point(x,(i+1)/14,side);b.beam([a[0],a[1]-.12,a[2]],[q[0],q[1]-.12,q[2]],.16,C.stone,24);b.beam(a,q,.08,C.tile,2);
    }
    // The two inner roof edges share a valley. Fascia belongs only outside.
    const side=outer;
    for(let i=0;i<24;i++){const a=point(x0+span*i/24,0,side),q=point(x0+span*(i+1)/24,0,side);b.beam([a[0],a[1]-.24,a[2]],[q[0],q[1]-.24,q[2]],.16,C.red,6);}
    for(let x=x0+.12;x<x1;x+=.235){const p=point(x,0,side);b.box(x,p[1]-.11,p[2],.11,.12,.30,C.tile,2);b.box(x,p[1]-.34,p[2]-.06*side,.085,.12,.15,C.gold,6);}
    for(const x of[x0+.23,x1-.23])b.beam([x,H.ridge,0],[x+(x<D/2?-.13:.13),H.ridge+.46,0],.13,C.tile,2);
   });
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('base',poly,H.base,H.base-.02,true);slab('ceiling',poly,H.eave-.16,.14);
  // Openings remain a restrained regional fit; neither entrance nor floor
  // count can be certified from the cropped aerial view of the roof alone.
  for(let i=0;i<4;i++){
   const a=poly[(i+1)%4],c=poly[i],width=Math.hypot(c[0]-a[0],c[1]-a[1]),n=i%2?3:4;
   const openings=Array.from({length:n},(_,j)=>({x:width*(j+.5)/n,w:width/n*.57,lo:1.10,hi:3.32,panes:4}));
   face('face-'+i,a,c,openings,w=>group('face-'+i+'-red-beam',()=>b.box(w/2,3.87,.015,w,.22,.14,C.red,6)));
  }
  roof('west',W/4,W/4+.46,W/4,1);
  roof('east',W*3/4,W/4,W/4+.46,-1);
  group('central-valley',()=>{
   const z0=-.46,z1=D+.46,mid=(z0+z1)/2,half=(z1-z0)/2;
   const y=z=>H.eave+.30*Math.pow(Math.abs((z-mid)/half),10)+.014;
   for(let i=0;i<24;i++){const a=z0+(z1-z0)*i/24,c=z0+(z1-z0)*(i+1)/24;b.beam([W/2,y(a),a],[W/2,y(c),c],.105,C.dark,24);}
  });
 });
 return{id:ID,strategy:'building096-v46',floors:1,storeysVerified:false,eaveHeight:H.eave,ridgeHeight:H.ridge,roofAxes:['north-south','north-south'],roofSegments:2,originalOutline:true,sharedValley:true,southRedGables:2,mainEntranceVerified:false,limits:'Twin north-south roofs and red south gables registered with native satellite and aerial frame 24; one storey, wall openings, roof details, exact height and independent identity remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building096={id:ID,render,world,local,width:W,depth:D};
})(YY);
