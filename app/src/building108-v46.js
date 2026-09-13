/* 108: registered aerial 55–60 s shows three window rows on the western
 * rectangle and a lower, south-bowed eastern flat roof. East total storeys,
 * precise heights and the roof step position remain unmeasured. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/1009052001';
const HEIGHTS={west:10.5,east:7};
function parts(f){
 const r=f.geometry.coordinates[0];
 if(r.length!==12)throw Error('108 original eleven-corner outline required');
 const ring=indices=>{const p=indices.map(i=>r[i]);return{type:'Polygon',coordinates:[[...p,p[0]]]};};
 return [{name:'west',geometry:ring([3,4,5,6]),height:HEIGHTS.west},
         {name:'east',geometry:ring([0,1,2,3,6,7,8,9,10]),height:HEIGHTS.east}];
}
function render(b,f,add){
 const id=f.properties.pickId,r=f.geometry.coordinates[0],sign=F.area(r)>0?1:-1;
 const walls=new G.Geometry();b.id=id;
 // Only original exterior edges receive facade details. The shared subdivision
 // is a roof step, never a second ground wall or a duplicate row of windows.
 for(let i=0;i<11;i++){
  const a=r[i],c=r[i+1],west=i>=3&&i<=5,h=west?HEIGHTS.west:HEIGHTS.east;
  const len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,rot=Math.atan2(nx,nz);
  const p=sign>0?c:a,q=sign>0?a:c;
  walls.quad([p[0],.3,p[1]],[q[0],.3,q[1]],[q[0],h,q[1]],[p[0],h,p[1]]);
  // Window spacing remains provisional. The east two display bands are not a
  // verified floor count; lower wall openings are obscured in the real view.
  const bands=west?3:2,fh=(h-.55)/bands,count=Math.max(1,Math.floor(len/4.35)),stride=len/count,ww=Math.min(2.75,stride*.68),wh=Math.min(2.65,fh*.63);
  if(len>=3.4)for(let row=0;row<bands;row++)for(let k=0;k<count;k++){
   const t=(k+.5)*stride;b.window(a[0]+ux*t+nx*.045,.55+fh*(row+.52),a[1]+uz*t+nz*.045,ww,wh,rot,'#aeb8b4');
  }
  b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,rot,()=>{
   b.box(0,h-.18,.01,len,.24,.30,'#e1e4dc',24);
   b.box(0,h+.35,-.16,len,.75,.29,'#e1e4dc',24);
   b.box(0,h+.76,-.16,len+.06,.13,.42,'#e1e4dc',24);
  });
 }
 add('108-original-exterior-walls',walls,'#e7e9e1',24,id);
 add('108-original-plinth',F.walls(f.geometry,.03,.30),'#afb5a9',10,id);
 for(const p of parts(f))add('108-'+p.name+'-flat-roof',F.surface(p.geometry,p.height),'#899187',22,id);
 // Visible eastern face of the upper western roof. The line joins existing
 // vertices 3 and 6; its survey position is still an explicit limitation.
 const a=r[3],c=r[6],step=new G.Geometry();
 step.quad([c[0],HEIGHTS.east,c[1]],[a[0],HEIGHTS.east,a[1]],[a[0],HEIGHTS.west+.825,a[1]],[c[0],HEIGHTS.west+.825,c[1]]);
 add('108-roof-step-face',step,'#e7e9e1',24,id);
 // The native 4K view resolves one paired window in this roof-step face.
 // Position and size are photo fits, separate from the provisional facade grid.
 const len=Math.hypot(c[0]-a[0],c[1]-a[1]),nx=(c[1]-a[1])/len,nz=-(c[0]-a[0])/len;
 b.local(a[0]+(c[0]-a[0])*.58+nx*.055,8.85,a[1]+(c[1]-a[1])*.58+nz*.055,Math.atan2(nx,nz),()=>{
  b.v16box('108-step-window-glass',0,0,0,1.5,1.6,.10,'#52766c',28);
  for(const x of[-.77,0,.77])b.v16box('108-step-window-vertical',x,0,.06,.065,1.68,.12,'#c4d0c5',29);
  for(const y of[-.82,.82])b.v16box('108-step-window-horizontal',0,y,.06,1.60,.065,.12,'#c4d0c5',29);
 });
 return{id:ID,strategy:'building108-v46',parts:2,westVisibleWindowRows:3,eastFloors:null,eastDisplayBands:2,westWallHeight:HEIGHTS.west,eastWallHeight:HEIGHTS.east,roof:'stepped-flat',stepWindowPairs:1,stepWindowDimensionsMeasured:false,originalOutline:true,sourceVertices:11,junctionMeasured:false,heightMeasured:false,eastFloorCountVerified:false,roofEquipmentVerified:false,facadesAndEntranceVerified:false,windowLayout:'provisional inherited spacing',westCanopyVerified:false,currentCaptureDateVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building108={id:ID,render,parts,heights:HEIGHTS};
})(YY);
