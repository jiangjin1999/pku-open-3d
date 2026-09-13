/* 132: the uniquely aligned original aerial of 59 shows six storeys.
 * Correct only the four-storey display count. Keep the original metre
 * envelope; 15m is still an unmeasured prior display estimate.
 * January 2023 east-road panoramas show the upper east end as a plain wall.
 * The lowest fitted level stays unresolved behind the perimeter wall.
 * Balcony caps, full facades and entrances remain unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/849765888';
function render(b,f,add){
 const ring=f.geometry.coordinates[0],a=ring[4],c=ring[5],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
 const onEast=(x,z)=>{const t=((x-a[0])*dx+(z-a[1])*dz)/(len*len);return t>=-.03&&t<=1.03&&Math.abs((x-a[0])*dz-(z-a[1])*dx)/len<.6;};
 const body=f.properties.height,lowestTop=.55+(body-.55)/6,baseY=b.origin[1],window=b.window,box=b.box;
 let suppressedWindows=0,result;
 b.window=function(x,y,z,...args){if(onEast(x,z)&&y>lowestTop){suppressedWindows++;return;}return window.call(this,x,y,z,...args);};
 b.box=function(x,y,z,...args){const q=this.world([x,y,z]),height=q[1]-baseY;if(onEast(q[0],q[2])&&height>lowestTop&&height<body-.5)return;return box.call(this,x,y,z,...args);};
 try{result=A.footprint(b,f,add,{key:'building132-v46',floors:6});}finally{b.window=window;b.box=box;}
 // A thin surface finish covers only the directly observed upper end. The
 // original load-bearing wall and unobserved lowest level keep their geometry.
 const sign=Y.Footprints.area(ring)>0?1:-1,nx=dz/len*sign,nz=-dx/len*sign,skin=.012,finish=new Y.Geo.Geometry();
 const q=[[a[0]+nx*skin,lowestTop,a[1]+nz*skin],[c[0]+nx*skin,lowestTop,c[1]+nz*skin],[c[0]+nx*skin,body,c[1]+nz*skin],[a[0]+nx*skin,body,a[1]+nz*skin]];if(sign>0)q.reverse();finish.quad(...q);
 b.id=f.properties.pickId;b.mesh('132-observed-east-upper-wall-finish',finish,0,0,0,1,1,1,'#dedfd7',24);
 return {...result,strategy:'building132-v46',floors:6,heightMeasured:false,displayHeightRetained:true,facadesVerified:false,entranceVerified:false,eastUpperWallObserved:true,eastUpperWallFinishObserved:true,eastLowestLevelVerified:false,suppressedEastUpperWindows:suppressedWindows,scope:'six-floor-count-and-observed-plain-east-upper-wall; other-facades-and-height-fitted'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building132={id:ID,render};
})(YY);
