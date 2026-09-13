/* Continuous, source-footprint mathematical centre and the open hill pavilion. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30;
function mathPart(b,f,add,g,height,key){const id=f.properties.pickId,edges=F.polygons(g).flatMap(pg=>pg.flatMap((r,ri)=>r.slice(1).map((c,i)=>{const a=r[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),sgn=(F.area(r)>0?1:-1)*(ri?-1:1);return{a,c,len,ux:(c[0]-a[0])/len,uz:(c[1]-a[1])/len,nx:(c[1]-a[1])/len*sgn,nz:-(c[0]-a[0])/len*sgn};}))),profile=p=>height+Math.min(...edges.map(e=>F.distSegment(p,e.a,e.c)))*.58;
 add('math42-plinth-'+key,F.walls(g,.08,.40),'#a5aba0',10,id);add('math42-wall-'+key,F.walls(g,.4,height),'#d8d4c8',24,id);
 add('math42-continuous-roof-'+key,F.profiledSurface(g,profile,.75),'#707873',25,id);
 b.id=id;for(const e of edges){const r=Math.atan2(e.nx,e.nz),cx=(e.a[0]+e.c[0])/2,cz=(e.a[1]+e.c[1])/2;
 b.local(cx,0,cz,r,()=>{b.box(0,height-.12,0,e.len,.25,.26,'#3b695c',6);b.box(0,height-.44,.03,e.len,.16,.15,'#915747',6);b.box(0,height+.02,0,e.len,.13,.58,'#737b73',25);});
 if(e.len<3.6)continue;const n=Math.max(1,Math.floor(e.len/3.65)),step=e.len/n;for(let k=0;k<n;k++){const t=(k+.5)*step,x=e.a[0]+e.ux*t+e.nx*.06,z=e.a[1]+e.uz*t+e.nz*.06;b.local(x,0,z,r,()=>{const levels=height>6?[2.0,5.55]:[2.15];for(const y of levels){const w=Math.min(2.5,step*.79),h=height>6?2.05:2.35;b.box(0,y,0,w+.15,h+.18,.12,'#934f3b',6);b.box(0,y,.071,w,h,.035,'#456358',28);for(let j=-2;j<=2;j++)b.box(j*w/5,y,.10,.047,h,.055,'#a36b4c',6);for(const yy of[-.65,0,.65])b.box(0,y+yy,.10,w,.048,.055,'#aa7653',6);}b.box(-step*.47,height/2,.06,.15,height-.35,.16,'#9a5940',6);});}
 }
}
function gallery(b,a,c,id){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),r=Math.atan2(c[0]-a[0],c[1]-a[1]);b.id=id;b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,r,()=>{
 b.box(0,.25,0,2.25,.32,len,'#b7b7a6',10);for(let j=0;j<=Math.ceil(len/3.5);j++){const z=-len/2+j*len/Math.ceil(len/3.5);for(const s of[-1,1]){b.cyl(s*.87,.41,z,.10,2.90,'#3e765b',12,1,6);if(j<Math.ceil(len/3.5))b.box(s*.87,1.0,z+len/Math.ceil(len/3.5)/2,.09,.12,len/Math.ceil(len/3.5),'#9a5640',6);}}
 for(const s of[-1,1])b.box(s*.87,3.15,0,.18,.28,len,'#a05a42',6);b.roof(0,3.4,0,len+1.0,2.8,1.0,'#6e7872',Math.PI/2,.82);
 });}
function math(b,f,add){const p=f.properties;if(!['relation/14320160','way/1075644757','way/1075644758','way/1075644754','way/1075644756'].includes(p.id))return false;
 if(p.id==='relation/14320160'){
 const north=A.clipGeometry(f.geometry,[-100,-500,50,-419]),south=A.clipGeometry(f.geometry,[-100,-419,50,-300]);mathPart(b,f,add,north,7.2,p.pickId+'-rear');mathPart(b,f,add,south,4.35,p.pickId+'-courts');
 // Grass courts retain their open sky; all paving stays below the building cap checks.
 for(const hole of F.polygons(f.geometry).flatMap(pg=>pg.slice(1)))add('math42-court-grass-'+p.pickId+'-'+hole[0][0],F.surface({type:'Polygon',coordinates:[hole]},.075),'#8fa875',0,p.pickId);
 for(const [x,z,w,d]of[[-39.6,-414.8,9.0,8.1],[-37.1,-395.8,8.3,5.6],[-34.7,-380.2,7.7,4.8]]){b.id=p.pickId;b.local(x,0,z,.17,()=>{b.box(0,.055,0,w,.045,d,'#91a779',0);b.box(0,.085,0,1.05,.015,d,'#c2c3b1',7);});}
 // Western corridor chain inferred from the archived courtyard photographs.
 for(const [a,c]of[[[-49.0,-420.5],[-46.8,-407.0]],[[-45.7,-400.9],[-44.1,-390.4]],[[-42.8,-383.8],[-41.2,-373.2]]])gallery(b,a,c,p.pickId);
 b.id=p.pickId;b.local(-19.0,0,-357.9,.17,()=>{b.box(0,1.8,.09,3.5,3.1,.14,'#814733',6);for(const x of[-1.8,1.8])b.box(x,1.8,.15,.18,3.4,.25,'#a1593e',6);b.sign('怀新园',0,3.57,.22,3.7,.58);for(let j=0;j<3;j++)b.box(0,.08+j*.10,1.0-j*.25,4.7,.15,.7,'#bdc0b2',10);});
 }else mathPart(b,f,add,f.geometry,p.id==='way/1075644754'?4.8:4.35,p.pickId);
 return {id:p.id,strategy:'math42-continuous',sourceOutline:true,limits:'按映射轮廓连续成面，照片复原高低层与游廊；高度、背面和回廊落点近似'};
}
function pavilion(b,f){const p=f.properties;if(p.id!=='way/1056350630')return false;b.id=p.pickId;
 b.local(p.centre[0],0,p.centre[1],.02,()=>{
 b.box(0,.18,0,7.7,.36,7.7,'#aeb3a2',10);b.box(0,.42,0,7.25,.16,7.25,'#c0c3b2',10);
 for(const x of[-2.58,2.58])for(const z of[-2.58,2.58]){b.cyl(x,.49,z,.23,3.95,'#477660',16,1,6);b.box(x,.61,z,.59,.24,.59,'#bfc2af',10);}
 for(const side of[-1,1]){b.box(0,3.9,side*2.58,5.65,.42,.3,'#326b61',6);b.box(side*2.58,3.9,0,.30,.42,5.65,'#326b61',6);}
 b.roof(0,4.23,0,8.25,8.25,1.65,'#707e73',0,.02);
 for(const s of[-1,1]){b.box(0,5.12,s*1.95,4.15,.96,.18,'#496d61',6);b.box(s*1.95,5.12,0,.18,.96,4.15,'#496d61',6);for(let i=-2;i<=2;i++){b.box(i*.73,5.13,s*2.05,.53,.45,.035,'#91a388',6);b.box(s*2.05,5.13,i*.73,.035,.45,.53,'#91a388',6);}}
 b.roof(0,5.69,0,6.55,6.55,2.04,'#687a6b',0,.02);b.cyl(0,7.6,0,.18,.45,'#a3a77f',12,.6,10);b.sphere(0,8.06,0,.25,.22,.25,'#afb18e',10,0,true);
 for(const s of[-1,1])b.sign('校景亭',0,3.68,s*2.79,2.1,.46,s<0?Math.PI:0);
 });return {strategy:'xiaojing42-open-double-eaves',height:8.3,limits:'官方四角重檐照片与土山记载；尺寸和彩画为近似'};}
Y.Refinements42={render:(b,f,add)=>{if(f.properties.id==='way/1086578218'){add('office42-duplicate-outline',F.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);return {strategy:'duplicate-office-outline',parent:'way/240832216'};}return math(b,f,add)||pavilion(b,f)},math,pavilion};
})(YY);
