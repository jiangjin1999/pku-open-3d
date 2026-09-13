/* 176 / Chengzeyuan 130. Three floors and flat structural roof: PKU 2025.
 * South-facing T projection, two red enclosed-balcony strips and shallow tile
 * edge: attributable public panoramas dated 2019-02-24 and 2023-01-08, against the
 * 2022 PKU road plan and native 2022/2026 imagery. Heights remain display fits;
 * the northern window schedule and present facade material are unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/916931889',EAVE=9.6,EDGE=.70,RISE=.45;
function render(b,f,add){
 const g=f.geometry,id=f.properties.pickId,ring=g.coordinates[0].slice(0,-1),sign=F.area(g.coordinates[0])>0?1:-1;
 const edge=(a,c)=>{const len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len;return{a,c,len,ux,uz,nx:uz*sign,nz:-ux*sign};};
 const es=ring.map((p,i)=>edge(p,ring[(i+1)%ring.length]));
 add('176-t-body',F.walls(g,.30,EAVE),'#d0d0c8',24,id);
 add('176-t-plinth',F.walls(g,.03,.30),'#aaa99e',10,id);
 add('176-original-t-flat-roof',F.surface(g,EAVE),'#777c72',22,id);
 const old=[b.origin,b.rotation,b.id,b.anim];b.id=id;b.anim=0;
 function local(e,fn){b.local(e.a[0],0,e.a[1],-Math.atan2(e.uz,e.ux),fn);}
 function window(e,t,cy,w,h,panes=2){local(e,()=>{
  b.box(t,cy,.042,w,h,.065,'#617978',5);
  for(let j=0;j<=panes;j++)b.box(t-w/2+w*j/panes,cy,.084,.055,h+.08,.09,'#e4e2d8',24);
  for(const yy of [cy-h/2,cy+h/2])b.box(t,yy,.084,w+.10,.07,.09,'#e4e2d8',24);
 });}
 try{
  for(let k=0;k<es.length;k++){
   const e=es[k];
   if(k===3){ // original south projection, west-to-east, not a new footprint
    const stride=e.len/4;
    for(let floor=0;floor<3;floor++){
     const base=.30+floor*3.05;
     for(let j=0;j<4;j++){const middle=j===1||j===2;window(e,(j+.5)*stride,base+1.78,middle?2.36:1.90,1.60,middle?3:2);}
     // The two upper rows of red spandrels are visible in 2019/2023. They stay on the original
     // facade plane; no speculative balcony projection is added to the T.
     if(floor>0)local(e,()=>{for(const j of [1,2])b.box((j+.5)*stride,base+.43,.072,stride-.09,.78,.12,'#ad6756',24);});
    }
    local(e,()=>{for(const t of [0,e.len])b.box(t,EAVE/2,.06,.20,EAVE,.14,'#ece8dc',24);});
   }else if(k===2||k===4){
    // The south-west 2023 view and south-east 2019 view show broad blank
    // return walls, with a narrow opening close to the recessed shoulder.
    // Lower openings are partly obscured; their shared size remains a fit.
    const t=k===2?1.10:e.len-1.10;
    for(let floor=0;floor<3;floor++)window(e,t,.30+floor*3.05+1.78,.62,1.60,1);
   }else{
    // Old neutral window cadence retained as an explicit fit. A single
    // opening on each short south shoulder is consistent with the view;
    // no entrance or balcony volume is inferred on unseen faces.
    if(e.len<3.4)continue;const count=Math.max(1,Math.floor(e.len/4.35)),stride=e.len/count;
    for(let floor=0;floor<3;floor++)for(let j=0;j<count;j++)window(e,(j+.5)*stride,.55+(EAVE-.55)/3*(floor+.52),Math.min(2.75,stride*.68),1.88);
   }
   local(e,()=>b.box(e.len/2,EAVE-.10,.015,e.len,.20,.24,'#e1ded2',24));
  }
  // Constant-width offset of the original eight corners. It follows the
  // visible shallow perimeter cap, including the two concave shoulders;
  // the flat centre remains intact. Width, rise and subdued tile colour
  // are fitted, not measurements or a claim of unchanged 2019 material.
  const cross=(u,v)=>u[0]*v[1]-u[1]*v[0];
  const inner=ring.map((p,i)=>{const a=es[(i+es.length-1)%es.length],c=es[i],p1=[p[0]-a.nx*EDGE,p[1]-a.nz*EDGE],p2=[p[0]-c.nx*EDGE,p[1]-c.nz*EDGE],u=[a.ux,a.uz],v=[c.ux,c.uz],t=cross([p2[0]-p1[0],p2[1]-p1[1]],v)/cross(u,v);return[p1[0]+u[0]*t,p1[1]+u[1]*t];});
  const cap=new G.Geometry(),innerWall=new G.Geometry(),pt=(p,y)=>[p[0],y,p[1]],tri=(a,c,d)=>{const ny=(c[2]-a[2])*(d[0]-a[0])-(c[0]-a[0])*(d[2]-a[2]);if(ny<0)[c,d]=[d,c];cap.tri(a,c,d);};
  for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length,a=pt(ring[i],EAVE+.03),c=pt(ring[j],EAVE+.03),d=pt(inner[j],EAVE+RISE),e=pt(inner[i],EAVE+RISE);tri(a,c,d);tri(a,d,e);innerWall.quad(pt(inner[i],EAVE),pt(inner[j],EAVE),d,e);}
  add('176-observed-shallow-perimeter-cap',cap,'#a18476',19,id);
  add('176-inner-cap-upstand',innerWall,'#b4b3a6',24,id);
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{id:ID,strategy:'building176-three-floor-v46',sourceOutline:true,officialFloors:3,structuralRoofVerified:true,heightMeasured:false,heightFit:EAVE,roofEdgeRiseFit:RISE,roofEdgeWidthFit:EDGE,southProjectionPhotoDate:'2019-02-24',southBalconyStripsObserved:2,facadesVerified:false,entranceVerified:false,currentTileColourVerified:false,limits:'2019 south facade and perimeter cap shape are attributable; three floors and flat structural roof confirmed in 2025. Exact dimensions, present material, entrance and unseen elevations remain open.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building176={id:ID,render,heightFit:EAVE,roofEdgeWidthFit:EDGE,roofEdgeRiseFit:RISE};
})(YY);
