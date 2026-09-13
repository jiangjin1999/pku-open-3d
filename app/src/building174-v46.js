/* 174 / Chengzeyuan 128: source T plan and officially documented three flat-roof floors.
   Heights and openings remain explicit display fits pending attributable elevations. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,ID='way/916931887',H=9.6,N=3;
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const g=f.geometry,id=f.properties.pickId,old=[b.origin,b.rotation,b.id,b.anim];
 add('174-t-body',F.walls(g,.30,H),'#d5d9cc',24,id);
 add('174-t-plinth',F.walls(g,.03,.30),'#afb5a9',10,id);
 add('174-t-flat-roof',F.surface(g,H),'#73776a',22,id);
 // Native aerial shows the T plan; the narrow edge is a non-measured rim fit.
 add('174-t-roof-rim-fit',F.walls(g,H,H+.22),'#abb1a2',24,id);
 b.id=id;b.anim=0;
 try{
  const ring=g.coordinates[0],sign=F.area(ring)>0?1:-1,fh=(H-.55)/N;
  for(let k=1;k<ring.length;k++){
   const a=ring[k-1],c=ring[k],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(len<3.4)continue;
   const ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,r=Math.atan2(nx,nz);
   // Retain the previous generic opening spacing as uncertainty, now in three rows.
   const count=Math.max(1,Math.floor(len/4.35)),stride=len/count,ww=Math.min(2.75,stride*.68),wh=Math.min(2.65,fh*.63);
   for(let floor=0;floor<N;floor++)for(let j=0;j<count;j++){
    const t=(j+.5)*stride;
    b.window(a[0]+ux*t+nx*.045,.55+fh*(floor+.52),a[1]+uz*t+nz*.045,ww,wh,r,'#d2d8c9');
   }
  }
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{profile:'174-original-t-three-floor-flat',observedFloors:N,height:H,heightMeasured:false,sourceFootprintPreserved:true,unseenFacadesVerified:false,entranceVerified:false};
}
Y.Building174={id:ID,heightFit:H,officialFloors:N,roof:'flat'};A.render=render;
})(YY);
