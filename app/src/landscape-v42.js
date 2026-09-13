/* Local relief from user ground knowledge and official pavilion photographs.
   Shoreline stays in the common map frame. Heights are visual estimates. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,M=Y.M;
const sourceIsland=Y.CAMPUS.features.find(f=>f.properties.id==='precinct/531').geometry,ring=sourceIsland.coordinates[0],channelBox=[-92,-197.9,-70,-191.0],channel={type:'Polygon',coordinates:[[[-92,-197.9],[-70,-197.9],[-70,-191],[-92,-191],[-92,-197.9]]]},island={type:'MultiPolygon',coordinates:[[-110,-210,-92,-110],[-70,-210,0,-110],[-92,-210,-70,-197.9],[-92,-191,-70,-110]].flatMap(bb=>Y.Architecture30.clipGeometry(sourceIsland,bb).coordinates)},hill=[-296.3645,-330.4495],regions=[[-101,-205,-7,-115],[-315,-350,-277,-311]];
const rimPath=Y.CAMPUS.features.find(f=>f.properties.id==='way/304218700').geometry.coordinates.slice(1);
const smooth=t=>{t=M.clamp(t,0,1);return t*t*(3-2*t)};
function islandHeight(x,z){const p=[x,z],d0=Math.min(...ring.slice(1).map((q,i)=>F.distSegment(p,ring[i],q))),dc=Math.hypot(Math.max(channelBox[0]-x,0,x-channelBox[2]),Math.max(channelBox[1]-z,0,z-channelBox[3]));const dp=Math.min(...rimPath.slice(1).map((q,i)=>F.distSegment(p,rimPath[i],q)));return .80+3.85*(F.insideRing(p,rimPath)?smooth(Math.min((Math.min(d0,dc)-4.5)/5.0,(dp-2.0)/4.8)):0);}
function elevation(x,z){const p=[x,z];if(x>-101&&x<-7&&z>-205&&z<-115){const d0=Math.min(...ring.slice(1).map((q,i)=>F.distSegment(p,ring[i],q))),inChannel=x>channelBox[0]+1e-6&&x<channelBox[2]-1e-6&&z>channelBox[1]+1e-6&&z<channelBox[3]-1e-6;if(inChannel)return 0;if(F.inside(p,sourceIsland)||d0<1e-6)return islandHeight(x,z);}
 const r=Math.hypot((x-hill[0])/1.03,z-hill[1]);return r<18?3.65*(1-smooth((r-5.9)/12.1)):0;
}
function reliefSurface(g,profile){const mesh=F.profiledSurface(g,p=>profile(...p),1),d=.06;for(let i=0;i<mesh.v.length;i+=8){const x=mesh.v[i],z=mesh.v[i+2],n=M.norm([-(profile(x+d,z)-profile(x-d,z))/(2*d),1,-(profile(x,z+d)-profile(x,z-d))/(2*d)]);for(let k=0;k<3;k++)mesh.v[i+3+k]=n[k];}return mesh;}

function walkElevation(x,z){return Math.abs(x+80.775)<1.3&&z>-198&&z<-190.75?1.14:elevation(x,z)}

function warp(geo){const out=new G.Geometry();
 function tri(a,b,c,depth=0){const xs=[a[0],b[0],c[0]],zs=[a[2],b[2],c[2]],bb=[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)];if(!regions.some(r=>bb[0]<r[2]&&bb[2]>r[0]&&bb[1]<r[3]&&bb[3]>r[1])){out.tri(a,b,c);return;}
  const span=Math.max(Math.hypot(a[0]-b[0],a[2]-b[2]),Math.hypot(c[0]-b[0],c[2]-b[2]),Math.hypot(a[0]-c[0],a[2]-c[2]));if(span>1.1&&depth<12){const mid=(p,q)=>p.map((v,i)=>(v+q[i])/2),ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);tri(a,ab,ca,depth+1);tri(ab,b,bc,depth+1);tri(ca,bc,c,depth+1);tri(ab,bc,ca,depth+1);}else out.tri(...[a,b,c].map(p=>[p[0],p[1]+walkElevation(p[0],p[2]),p[2]]));
 }
 for(let i=0;i<geo.v.length;i+=24)tri(...[0,8,16].map(k=>geo.v.slice(i+k,i+k+3)));return out;
}
function withElevation(b,f,fn){const p=f.properties,dy=elevation(...p.centre),original=b.e.add;if(!dy)return fn();b.e.add=function(k,g,m,c,a,uv){const mm=new Float32Array(m);mm[13]+=dy;return original.call(this,k,g,mm,c,a,uv)};try{return fn()}finally{b.e.add=original}}
function ground(b,add){const id=Y.CAMPUS.features.find(f=>f.properties.id==='precinct/531').properties.pickId;
 add('island42-water-under-bridge',F.surface(channel,.5),'#689a91',4,Y.CAMPUS.features.find(f=>f.properties.id==='way/838526031').properties.pickId);
 add('island42-shore-wall',F.walls(island,.24,.81),'#9d9e89',10,id);
 add('island42-relief',reliefSurface(island,(x,z)=>islandHeight(x,z)+.04),'#a5b68d',0,id);
 const hr=Array.from({length:65},(_,i)=>[hill[0]+18.3*Math.cos(i*Math.PI/32),hill[1]+18.3*Math.sin(i*Math.PI/32)]),hg={type:'Polygon',coordinates:[hr]};
 const pavilionId=Y.CAMPUS.features.find(f=>f.properties.id==='way/1056350630').properties.pickId;add('xiaojing42-hill',reliefSurface(hg,(x,z)=>elevation(x,z)+.06),'#a7b58e',0,pavilionId);
 // Irregular exposed stone, confined to the pavilion mound. No invented rock wall.
 b.id=pavilionId;for(const [cx,cz]of[[-306,-333],[-300,-339],[-286,-325]])for(let j=0;j<5;j++){const a=j*2.399,x=cx+Math.cos(a)*(j*.38),z=cz+Math.sin(a)*(j*.37),y=elevation(x,z);b.sphere(x,y+.12,z,.65+(j%3)*.35,.4+(j%4)*.17,.55+(j%2)*.4,j%2?'#969c87':'#abb09a',10,0,false);}
 // Short ascent from the adjacent eastern path to the pavilion platform.
 for(let j=0;j<14;j++){const x=hill[0]+6.3+j*.55,y=elevation(x,hill[1])+.12;b.box(x,y-.10,hill[1],.60,.22,2.05,'#b7baa7',10);}

}
function conifer(b,t){const old=[b.id,b.anim];b.id=t.id;b.local(t.point[0],elevation(...t.point),t.point[1],0,()=>{const h=t.height;b.cyl(0,0,0,.25+h*.012,h*.88,'#746e59',10,.45,6);for(let row=0;row<9;row++){const y=h*(.20+row*.081),r=h*.20*(1-row/10);for(let j=0;j<6;j++){const a=j*Math.PI/3+row*.77;b.beam([0,y-.6,0],[Math.cos(a)*r*.9,y+.08,Math.sin(a)*r*.9],.065,'#726b53',6);}}
 const key='conifer42-needles-'+t.id,geo=b.geo(key,()=>{const g=new G.Geometry(),R=M.rng(t.id);for(let i=0;i<1800;i++){const y=.16+R()*.87,r=.20*Math.pow(Math.max(.012,1-(y-.16)/.87),.64)*Math.pow(R(),.35),a=R()*Math.PI*2,center=[Math.cos(a)*r,y,Math.sin(a)*r],n=M.norm([R()-.5,R()-.25,R()-.5]),side=M.norm(M.cross(n,Math.abs(n[1])>.9?[1,0,0]:[0,1,0])),up=M.cross(n,side),sz=.018+R()*.015,pt=(x,z)=>M.add(center,M.add(M.mul(side,x*sz),M.mul(up,z*sz)));g.quad(pt(-1,-1),pt(1,-1),pt(1,1),pt(-1,1),n);}return g;});b.anim=1;b.mesh(key,geo,0,0,0,h,h,h,'#527341',46);
 });[b.id,b.anim]=old;}

const officeTrees=[{point:[-338,-137],height:11},{point:[-338.3,-154.5],height:13},{point:[-357,-118],height:18},{point:[-358,-175],height:17}].map((t,i)=>({...t,id:805420+i,type:'conifer',zone:'office-photo42',source:'北大新闻网2024办公楼前合影，四株主要常绿树可辨；单株落点与树种近似'}));
function bridge(b,f){if(f.properties.id!=='heritage/lake-flat-bridge')return false;b.id=f.properties.pickId;
 b.local(-80.775,0,-194.399,0,()=>{const w=2.8,d=7.15,deck=1.32;
  b.box(0,deck-.10,0,w,.20,d,'#adb5ad',10);for(let z=-d/2+.37;z<d/2;z+=.72)b.box(0,deck-.012,z,w-.025,.045,.704,'#b8beb4',10);
  // Six stone supports leave five short openings. The surviving bridge has no balustrades.
  for(let j=0;j<=5;j++){const z=-d/2+j*d/5;b.box(0,.63,z,w-.38,.79,.35,'#98a69e',10);b.box(0,1.06,z,w+.10,.20,.56,'#a8b2a7',10);}
  for(let j=0;j<7;j++)b.box(0,.12+(j+.5)*.166,-7.0+(j+.5)*.50,w,.166,.53,'#b5bcb0',10);
  for(let j=0;j<3;j++)b.box(0,1.19-j*.145,d/2+.23+j*.47,w,.16,.49,'#b5bcb0',10);
 });return true;}

Y.Landscape42={elevation,walkElevation,warp,withElevation,ground,conifer,officeTrees,bridge,island,sourceIsland,channel,hill};
})(YY);
