/* 134: Changchunyuan 57. Own upper north elevation in aerial frames 47/49. Lower rows occluded by 58; six floors are an unverified display fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo;
const ID='way/849765890',H=18.6,N=6,FH=3.02;
// Source north edges: the east section is offset north by about four metres.
const faces=[
 {a:[-544.39,34.92],z:[-517.325,32.278],banks:[[.10,.13],[.32,.13],[.56,.14],[.80,.13]],stairs:[.21,.45,.69]},
 {a:[-585.469,42.593],z:[-544.039,38.529],banks:[[.10,.14],[.42,.24],[.81,.16]],stairs:[.25,.65]}
];
function normal(a,z){const l=Math.hypot(z[0]-a[0],z[1]-a[1]);return{l,ux:(z[0]-a[0])/l,uz:(z[1]-a[1])/l,nx:(z[1]-a[1])/l,nz:-(z[0]-a[0])/l};}
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const g=f.geometry,id=f.properties.pickId,old=[b.origin,b.rotation,b.id,b.anim];
 const box=(k,x,y,z,w,h,d,col,mat=24)=>b.mesh(k,b.geo(k,G.box),x,y,z,w,h,d,col,mat);
 add('134-white-wall',F.walls(g,.30,H),'#dedfd8',24,id);
 add('134-base',F.walls(g,.03,.30),'#afb2a5',10,id);
 add('134-main-flat-roof',F.surface(g,H),'#737772',22,id);
 add('134-parapet',F.walls(g,H,H+.30),'#a1a69f',24,id);
 b.id=id;b.anim=0;
 try{
  for(let k=0;k<faces.length;k++){
   const face=faces[k],e=normal(face.a,face.z),r=Math.atan2(e.nx,e.nz);
   function at(t,fn){b.local(face.a[0]+e.ux*t,0,face.a[1]+e.uz*t,r,fn);}
   for(const [fraction,widthFraction] of face.banks){const width=e.l*widthFraction;
    at(e.l*fraction,()=>{
     for(let floor=0;floor<N;floor++){
      const y=.58+floor*FH;
      box('134-north-balcony-glass',0,y+1.25,.048,width,1.70,.06,'#536c6a',28);
      box('134-north-balcony-sill',0,y+.33,.085,width+.10,.20,.16,'#dce0d8');
      box('134-north-balcony-top',0,y+2.16,.080,width+.10,.12,.16,'#e0e4dc');
      const panes=Math.max(2,Math.round(width/.90));
      for(let j=0;j<=panes;j++)box('134-north-balcony-mullion',-width/2+width*j/panes,y+1.25,.098,.055,1.75,.08,'#e5e8de',29);
      box('134-north-balcony-transom',0,y+1.47,.100,width,.06,.08,'#e1e6df',29);
     }
     // Short local slope over each visible top balcony; the main roof stays flat.
     const q=new G.Geometry();q.quad([-width/2,H+.13,.12],[width/2,H+.13,.12],[width/2,H+.68,-1.28],[-width/2,H+.68,-1.28]);
     b.mesh('134-local-balcony-cap-'+k+'-'+fraction,q,0,0,0,1,1,1,'#616a64',22);
    });
   }
   // Round stair lights visible between balcony groups; they do not assert doors.
   for(const fraction of face.stairs)at(e.l*fraction,()=>{
    for(let floor=0;floor<N;floor++){
     const y=1.30+floor*FH,q=new G.Geometry(),R=.24;
     for(let j=0;j<12;j++){const a=j*Math.PI/6,c=(j+1)*Math.PI/6;q.tri([0,0,.074],[R*Math.cos(a),R*Math.sin(a),.074],[R*Math.cos(c),R*Math.sin(c),.074]);}
     b.mesh('134-round-stair-light',q,0,y,0,1,1,1,'#50615e',28);
    }
   });
  }
  // Unseen south and end openings remain a declared six-storey type approximation.
  // They use no invented entrance, balcony projection, sign or equipment.
  const ring=g.coordinates[0];for(let k=1;k<ring.length;k++){
   const a=ring[k-1],z=ring[k],e=normal(a,z),sign=F.area(ring)>0?1:-1;e.nx*=sign;e.nz*=sign;if(e.l<5||e.nz<-.5)continue;
   const count=Math.max(1,Math.floor(e.l/3.7)),r=Math.atan2(e.nx,e.nz);
   for(let j=0;j<count;j++)b.local(a[0]+e.ux*e.l*(j+.5)/count,0,a[1]+e.uz*e.l*(j+.5)/count,r,()=>{
    for(let floor=0;floor<N;floor++){const y=1.80+floor*FH;box('134-unseen-window-fit',0,y,.055,1.85,1.68,.075,'#5a706c',28);box('134-unseen-sill-fit',0,y-.91,.085,2.00,.13,.16,'#d5ddd3');}
   });
  }
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{profile:'134-six-storey-offset-apartments',displayFloors:N,observedUpperRows:3,storeysVerified:false,height:H,heightMeasured:false,roof:'flat-main-local-balcony-slopes',sourceFootprintPreserved:true,unseenFacadesVerified:false,entranceVerified:false};
}
Y.Building134={id:ID,heightFit:H,displayFloors:N,observedUpperRows:3,storeysVerified:false,faces};A.render=render;
})(YY);
