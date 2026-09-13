/* Changchun east court, 58: retained stepped footprint, six visible floors,
 * north enclosed balconies and circular stair lights registered to frame 48.
 * Bay widths and height are photo fits; rear openings remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/849765889';
const O=[-589.44,8.45],R=Math.atan2(4.019,40.977),CO=Math.cos(R),SI=Math.sin(R),H=18.6;
const local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const C={wall:'#dfded4',roof:'#85887e',edge:'#c3c6b9',glass:'#54736e',frame:'#e4e7dc',base:'#589081',dark:'#344d49'};
function render(b,f){
 b.id=f.properties.pickId;const p=f.geometry.coordinates[0].slice(0,-1).map(local);
 const mesh=(name,g,c,m=24)=>b.mesh('133-'+name,g,0,0,0,1,1,1,c,m);
 const box=(name,x,y,z,w,h,d,c,m=24)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'133-'+name+'-'+k,...a);};try{b.box(x,y,z,w,h,d,c,m);}finally{b.e.add=old;}};
 function pane(name,x,y,z,w,h){
  box(name+'-glass',x,y,z,w,h,.05,C.glass,5);
  for(const dx of[-w/2,0,w/2])box(name+'-vertical',x+dx,y,z-.035,.055,h+.10,.07,C.frame);
  for(const yy of[y-h/2,y+h/2])box(name+'-horizontal',x,yy,z-.035,w+.10,.055,.07,C.frame);
 }
 function disc(name,x,y,z,r,c){const g=b.geo('133-unit-circular-light',()=>{const g=new G.Geometry();for(let i=0;i<24;i++){const a=2*Math.PI*i/24,q=2*Math.PI*(i+1)/24;g.tri([0,0,0],[Math.cos(q),Math.sin(q),0],[Math.cos(a),Math.sin(a),0]);}return g;});b.mesh('133-unit-circular-light',g,x,y,z,r,r,1,c,5);}
 b.local(O[0],0,O[1],R,()=>{
  mesh('ground',G.polygon(p,.04),C.base);
  mesh('roof',G.polygon(p,H),C.roof);
  const walls=new G.Geometry();for(let i=0;i<p.length;i++){const a=p[i],q=p[(i+1)%p.length];walls.quad([a[0],.04,a[1]],[q[0],.04,q[1]],[q[0],H,q[1]],[a[0],H,a[1]]);
   const dx=q[0]-a[0],dz=q[1]-a[1],len=Math.hypot(dx,dz);b.local((a[0]+q[0])/2,0,(a[1]+q[1])/2,-Math.atan2(dz,dx),()=>{
    box('perimeter-base',0,.42,0,len,.78,.10,C.base);box('roof-parapet',0,H+.28,0,len,.55,.15,C.edge);box('roof-cap',0,H+.57,0,len+.08,.065,.22,C.roof);
   });
  }mesh('retained-stepped-walls',walls,C.wall);
  // Explicit north photograph layout; the east part is set 3.6 m northward.
  // No balcony/door repetitions are copied to the unseen southern facade.
  const northZ=x=>x>p[7][0]?(p[5][1]+p[6][1])/2:0;
  const balconies=[{x:2.8,w:4.2},{x:19.9,w:9.0},{x:36.7,w:4.25},{x:46.5,w:4.1},{x:55.0,w:3.7},{x:64.5,w:4.15}];
  for(const [i,q]of balconies.entries()){
   const z=northZ(q.x),depth=.58;for(let floor=0;floor<6;floor++){
    const y=.50+floor*3.0;
    box('north-balcony-'+i+'-apron',q.x,y+.38,z-depth/2,q.w,.68,depth,C.wall);
    pane('north-balcony-'+i,q.x,y+1.62,z-depth-.025,q.w-.20,1.78);
    for(const x of[q.x-q.w/2+.08,q.x+q.w/2-.08])box('north-balcony-'+i+'-cheek',x,y+1.38,z-depth/2,.16,2.8,depth,C.wall);
    box('north-balcony-'+i+'-sill',q.x,y+2.84,z-depth/2,q.w+.12,.13,depth+.12,C.edge);
   }box('balcony-roof-'+i,q.x,H+.20,z-depth/2,q.w+.18,.20,depth+.15,C.roof);
  }
  for(const [i,x]of [10.8,30.3,50.1,60.3].entries()){
   const z=northZ(x)-.10;for(let floor=1;floor<6;floor++)disc('north-stair-light-'+i,x,1.53+floor*3,z,.34,C.dark);
   const arch=new G.Geometry(),radius=.85,spring=1.6;for(let j=0;j<20;j++){const a=Math.PI*j/20,q=Math.PI*(j+1)/20;arch.quad([x+radius*Math.cos(a),spring+radius*Math.sin(a),z-.08],[x+(radius+.18)*Math.cos(a),spring+(radius+.18)*Math.sin(a),z-.08],[x+(radius+.18)*Math.cos(q),spring+(radius+.18)*Math.sin(q),z-.08],[x+radius*Math.cos(q),spring+radius*Math.sin(q),z-.08]);}mesh('north-entry-arch-'+i,arch,C.base);
   pane('north-entry-'+i,x,1.08,z-.04,1.62,2.04);for(const xx of[x-.94,x+.94])box('north-entry-jamb-'+i,xx,.9,z-.10,.18,1.6,.12,C.base);
  }
  for(const x of[6.5,14.0,26.1,33.0,42.8,48.5,52.0,57.5,62.0,67.4])for(let floor=0;floor<6;floor++)pane('north-small-window',x,2.05+floor*3,northZ(x)-.055,.90,1.35);
 });
 return{id:ID,strategy:'building133-v46',floors:6,originalOutline:true,northFacadeRegistered:true,roof:'flat-stepped-outline',measuredHeight:false,allFacadesVerified:false,limits:'Six visible floors; north balconies, four circular stair-light bays and arch entries are photo fits. South and end openings, exact height and roof fixtures remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building133={id:ID,render,local};
})(YY);
