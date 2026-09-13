/* Boya / science-park complex. Six hotel storeys are documented by the 2024
 * Beijing Tourism reporter; roof zoning follows native satellite imagery.
 * Facade rhythm, east-wing storeys, heights, door position and garden depths
 * remain fitted. Original C-shaped geographic outline and duplicate suppression
 * are unchanged. See data/building080-v46.json for source limits. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/880624074';
const O=[260.61,-553.562],R=.09372567983718529,c=Math.cos(R),s=Math.sin(R),floor=-3.3;
const world=p=>[O[0]+p[0]*c+p[1]*s,O[1]-p[0]*s+p[1]*c],local=p=>[(p[0]-O[0])*c-(p[1]-O[1])*s,(p[0]-O[0])*s+(p[1]-O[1])*c];
const courtLocal=[[54.8,23.8],[48,27.1],[42.1,31.4],[37.7,37],[35.3,41.5],[33.8,45.8],[39.5,50],[42.3,54.4],[44.6,60],[43.7,66.7],[41.1,70.6],[37.1,75],[30.9,77.9],[24.7,79.2],[24.9,94.9],[25.4,97.4],[56.9,98.5],[57.2,101.6],[91.3,102.6],[93,47],[101.2,44.8],[102.3,27.1],[98.5,25.2],[94.8,22.9],[90.5,22.7]];
const cutRing=courtLocal.map(world);cutRing.push(cutRing[0]);
const groundCut={id:ID,pickId:286,ring:cutRing,floor,geometry:{type:'Polygon',coordinates:[cutRing]}};
const C={brick:'#91958e',pale:'#d5d1bd',frame:'#50635f',glass:'#708b89',rust:'#965c3e',roof:'#838b80',stone:'#aaa995',dark:'#53625a',grass:'#92a078'};
function render(b,f){
 b.id=f.properties.pickId;const p=f.geometry.coordinates[0].slice(0,-1).map(local),corner=[23.5,24.47];
 const volumes=[
  {name:'hotel',floors:6,height:23.8,poly:[...p.slice(0,6),p[37],corner,p[51],...p.slice(52)]},
  {name:'curved-lobby',floors:1,height:5.6,poly:[...p.slice(37,52),corner]},
  {name:'rotunda',floors:6,height:23.8,poly:[...p.slice(5,20),...p.slice(32,38)]},
  {name:'neck',floors:1,height:5.6,poly:[p[19],p[20],p[31],p[32]]},
  {name:'east-wing',floors:6,height:23.8,poly:p.slice(20,32)}
 ];
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'080-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,col,mat=24)=>b.mesh('080-'+key,g,0,0,0,1,1,1,col,mat);
 const slab=(name,poly,y,thick,col)=>{mesh(name,G.polygon(poly,y),col,24);const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-thick,a[1]],[q[0],y-thick,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,col,24);};
 function face(name,a,q,base,top,{curtain=false,rust=true,blank=false,entry=false}={}){
  const len=Math.hypot(q[0]-a[0],q[1]-a[1]);if(len<.18)return;
  b.local(a[0],0,a[1],Math.atan2(-(q[1]-a[1]),q[0]-a[0]),()=>group(name,()=>{
   const h=top-base,n=Math.max(1,Math.round(len/(curtain?2.0:4.15))),bw=len/n;
   if(blank||len<1.3){b.box(len/2,(base+top)/2,-.18,len,h,.36,C.brick,13);return;}
   const curtainRows=Math.max(1,Math.round(h/2.4)),levels=curtain?Array.from({length:curtainRows+1},(_,i)=>base+h*i/curtainRows):[];
   if(!curtain){levels.push(base);for(let y=4.3;y<top-.01;y+=3.9)if(y>base+.01)levels.push(y);levels.push(top);}
   const rows=levels.length-1;
   // No solid backing slab: the panes occupy actual apertures between the piers.
   for(let i=0;i<n;i++){
    const mid=(i+.5)*bw,ww=bw*(curtain?.96:.76),left=mid-ww/2,right=mid+ww/2;
    if(!curtain){b.box(i*bw+bw*.12,(base+top)/2,-.18,bw*.24,h,.36,C.brick,13);}
    for(let fl=0;fl<rows;fl++){
     const y=levels[fl],fh=levels[fl+1]-y,lo=y+(curtain?.08:.12),hi=y+fh-(curtain?.08:.34),hh=hi-lo;
     group('glass',()=>b.box(mid,(lo+hi)/2,-.065,ww,hh,.045,C.glass,5));
     for(const xx of [left,right,...(curtain?[]:[mid+ww*.12])])b.box(xx,(lo+hi)/2,.015,.065,hh+.12,.15,C.frame,9);
     for(const yy of [lo,hi,...(curtain?[]:[hi-.62])])b.box(mid,yy,.02,ww+.06,.065,.17,C.frame,9);
     if(!curtain){b.box(mid,y+fh-.15,-.07,ww,.30,.29,fl===rows-1?C.pale:C.pale,24);}
     if(!curtain&&rust&&bw>3.0)group('louvre',()=>{
      const lw=bw*.19,x=(i+1)*bw-lw/2;
      for(let j=0;j<14;j++)b.box(x,lo+.12+j*(hh-.24)/13,.065,lw,.05,.19,C.rust,6);
     });
    }
   }
   b.box(len/2,top+.17,-.02,len,.34,.44,C.pale,24);
   if(!curtain){
    // Roof-level open rectangular screen, visible above the tall glazed bays.
    b.box(len/2,top+1.08,-.07,len,.12,.18,C.frame,9);
    for(let i=0;i<=n;i++)b.box(i*bw,top+.66,-.07,.11,.94,.19,C.frame,9);
   }
   if(entry){const x=len*.54;
    group('entrance',()=>{
     b.box(x,3.0,.3,5.3,4.6,.06,C.glass,5);for(const xx of[x-2.7,x,x+2.7])b.box(xx,3.0,.38,.14,4.8,.16,C.frame,9);
     b.box(x,5.54,2.9,11.6,.28,6.3,C.dark,24);
     for(const xx of[x-4.4,x+4.4])b.box(xx,2.8,5.2,.65,5.4,.68,C.brick,13);
     for(let i=0;i<25;i++)b.box(x-5.55+i*.46,5.36,2.9,.12,.18,6.1,C.pale,24);
     for(let j=0;j<3;j++)b.box(x,.12+j*.18,5.7-j*.35,8.8,.18,1.5-j*.35,C.stone,10);
    });
   }
  }));
 }
 b.local(O[0],0,O[1],R,()=>{
  slab('original-footprint',p,.38,.35,C.stone);
  for(const v of volumes){
   slab('roof-'+v.name,v.poly,v.height,.30,C.roof);
   const positive=v.poly.reduce((sum,a,i)=>{const q=v.poly[(i+1)%v.poly.length];return sum+a[0]*q[1]-q[0]*a[1];},0)>0;
   for(let i=0;i<v.poly.length;i++){
    const a=v.poly[i],q=v.poly[(i+1)%v.poly.length],idx=p.indexOf(a),curtain=['curved-lobby','neck','rotunda'].includes(v.name),mid=[(a[0]+q[0])/2,(a[1]+q[1])/2];
    const interior=v.name==='hotel'&&(a===corner||q===corner||idx===37||idx===51);
    // The low lobby and tall wing share an interior seam; only the upper part
    // remains exposed there. No extra external wall closes the curved glass.
    const lowShared=v.name==='curved-lobby'&&(a===corner||q===corner);
    if(lowShared)continue;
    face(v.name+'-face-'+(idx<0?'corner':idx),positive?q:a,positive?a:q,interior?5.6:.4,v.height,{curtain,rust:v.name!=='rotunda',blank:!curtain&&Math.hypot(q[0]-a[0],q[1]-a[1])<3,entry:v.name==='hotel'&&idx===65});
   }
  }
  group('roof-service',()=>{
   // Long set-back service deck on the east wing; approximate equipment sizes.
   b.local(108,0,83,.030,()=>{
    b.box(0,24.0,0,16.2,.32,54,C.dark,24);
    for(const xx of[-8.1,8.1])b.box(xx,24.9,0,.22,1.8,54,C.pale,24);
    for(const zz of[-27,27])b.box(0,24.9,zz,16.4,1.8,.22,C.pale,24);
    for(let i=0;i<7;i++){b.box(i%2?2.4:-1.8,24.7,-21+i*6.2,7.1,1.1,4.4,'#b8bcb3',24);for(const x of[-1.6,1.6])b.cyl((i%2?2.4:-1.8)+x,25.25,-21+i*6.2,.95,.1,C.frame,16,1,9);}
   });
   for(let i=0;i<3;i++){b.box(10,24.25,29+i*27,5.0,.8,4.1,C.pale,24);b.box(10,24.85,29+i*27,3.7,.5,2.9,C.dark,24);}
   b.box(59,24.20,4.1,55,.38,5.8,C.dark,24);
   for(let i=0;i<14;i++)b.box(33+i*4,24.45,4.1,.16,.5,5.8,C.pale,24);
   for(let i=0;i<9;i++)b.box(5.3+i*5.8,24.13,110.2,.65,.4,1.3,C.pale,24);
  });
  // The garden floor lies below the original map surface; GroundCuts46 removes
  // that surface. Perimeter ledges and the winding pool are fitted, not surveyed.
  mesh('court-floor',G.polygon(courtLocal,floor),C.grass,3);
  const walls=new G.Geometry();for(let i=0;i<courtLocal.length;i++){
   const a=courtLocal[i],q=courtLocal[(i+1)%courtLocal.length];walls.quad([a[0],floor,a[1]],[q[0],floor,q[1]],[q[0],.12,q[1]],[a[0],.12,a[1]]);
  }mesh('court-retaining-wall',walls,C.stone,13);
  const path=[[48,29],[58,33],[69,42],[76,54],[76,66],[67,78],[60,88],[65,96],[78,97],[88,92]];
  mesh('garden-path',G.ribbon(path,1.75,floor+.08), '#b4a58b',10);
  const pond=[[35,80],[42,77],[48,69],[48,60],[46,52],[44,45],[48,39],[55,35],[58,32]];
  mesh('garden-pool-edge',G.ribbon(pond,4.2,floor+.16),'#9c9a86',10);mesh('garden-pool',G.ribbon(pond,3.5,floor+.19),'#58776b',4);
  group('garden-stones',()=>{for(let i=0;i<pond.length;i++){const q=pond[i];for(const sign of[-1,1])b.sphere(q[0]+sign*2.15,floor+.3,q[1],.72,.42,1.0,C.stone,8,.18,true);}});
  // The shared tree helper resets world transforms and advances a global random
  // stream. These local trees keep the court transform and their own fixed form.
  group('garden-trees',()=>{for(const [x,z,h]of[[57,42,7.2],[67,36,8],[83,52,7.4],[87,70,8.2],[55,62,6.8],[57,82,7.4],[70,89,7.8],[78,79,6.6]])b.local(x,floor,z,0,()=>{
   b.cyl(0,0,0,.22+h*.014,h*.57,'#756348',7,.58,6);
   b.beam([0,h*.3,0],[h*.14,h*.64,h*.10],.15,'#756348',6);b.beam([0,h*.38,0],[-h*.18,h*.61,-h*.06],.12,'#756348',6);
   const anim=b.anim;b.anim=1;try{b.sphere(0,h*.73,0,h*.36,h*.36,h*.31,'#769152',3);for(let j=0;j<3;j++){const a=j*2.1+.3;b.sphere(Math.cos(a)*h*.20,h*.68,Math.sin(a)*h*.21,h*.27,h*.27,h*.26,'#769152',3);}}finally{b.anim=anim;}
  });});
  group('garden-stairs',()=>{const n=18;for(let i=0;i<n;i++)b.box(81,floor+(i+1)*(-floor+.2)/n-.07,99.4+i*.29,7.3,.14,.31,C.stone,10);});
 });
 return {id:ID,strategy:'building080-v46',volumes:volumes.map(v=>({...v,poly:v.poly.map(world)})),courtFloor:floor,groundCutRequired:true,entrancePositionVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};
Y.Building080={id:ID,render,world,local,groundCut};
})(YY);
