/* Chengzeyuan 124: original eight-point T wall ring, three official storeys.
   The 2017 east-road photographs show white walls and shallow grey tile edges;
   the native aerial shows a flat central area. Rim dimensions are fitted.
   Openings retain the prior display rhythm until their individual bays and
   entrances can be registered. This is a partial correction, not facade closure. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,ID='way/916931883',H=9.3;
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const g=f.geometry,ring=g.coordinates[0],id=f.properties.pickId,sign=F.area(ring)>0?1:-1;
 const edges=ring.slice(1).map((c,k)=>{const a=ring[k],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len;return{a,c,len,ux,uz,nx:uz*sign,nz:-ux*sign};});
 // Intersections of the displaced original edge lines keep the T shoulders.
 function offset(distance){
  const r=edges.map((e,k)=>{const p=edges[(k+edges.length-1)%edges.length],a=[e.a[0]+p.nx*distance,e.a[1]+p.nz*distance],c=[e.a[0]+e.nx*distance,e.a[1]+e.nz*distance];
   const cross=p.ux*e.uz-p.uz*e.ux,t=((c[0]-a[0])*e.uz-(c[1]-a[1])*e.ux)/cross;
   return[a[0]+p.ux*t,a[1]+p.uz*t];});r.push(r[0]);return r;
 }
 const outer=offset(.24),inner=offset(-1.10),outside={type:'Polygon',coordinates:[outer]},inside={type:'Polygon',coordinates:[inner]};
 add('170-original-t-walls',F.walls(g,.30,H),'#d5d7d0',24,id);
 add('170-original-t-plinth',F.walls(g,.03,.30),'#aaa99e',10,id);
 add('170-shallow-eave-fascia',F.walls(outside,H-.05,H+.12),'#bac0b8',24,id);
 const tiles=new Y.Geo.Geometry();
 for(let k=0;k<edges.length;k++)tiles.quad([outer[k][0],H+.12,outer[k][1]],[outer[k+1][0],H+.12,outer[k+1][1]],[inner[k+1][0],H+.70,inner[k+1][1]],[inner[k][0],H+.70,inner[k][1]]);
 add('170-observed-grey-shallow-rim',tiles,'#727b77',19,id);
 add('170-aerial-central-flat-roof',F.surface(inside,H+.70),'#83877e',22,id);
 const old=[b.origin,b.rotation,b.id,b.anim];b.id=id;b.anim=0;
 try{
  const fh=(H-.55)/3;
  for(const e of edges){
   if(e.len<3.4)continue;
   const r=Math.atan2(e.nx,e.nz),count=Math.max(1,Math.floor(e.len/4.35)),stride=e.len/count,ww=Math.min(2.75,stride*.68),wh=Math.min(2.65,fh*.63);
   for(let floor=0;floor<3;floor++)for(let k=0;k<count;k++){
    const t=(k+.5)*stride;b.window(e.a[0]+e.ux*t+e.nx*.045,.55+fh*(floor+.52),e.a[1]+e.uz*t+e.nz*.045,ww,wh,r,'#d5d9d2');
   }
  }
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{id:ID,strategy:'building170-v46',roof:'flat-with-shallow-tile-rim',bodyHeight:H,roofRise:.70,sourceOutline:true,floors:3,wholeRoofProfileVerified:false,facadeBaysVerified:false};
}
Y.Building170={id:ID,wallHeightFit:H,rimRiseFit:.70,rimInsetFit:1.10};A.render=render;
})(YY);
