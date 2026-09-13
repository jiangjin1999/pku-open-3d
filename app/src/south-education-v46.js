/* Education College / real building 27, not refinement item 027.
 * 2009 GSE bulletin and registered 2013 street photographs establish the
 * west recessed entrance, three-storey end wings, lower glazed porch roof,
 * east red-framed bays and stair strips. 2026 native roofs support the same
 * short high hip between flat end decks. The metre dimensions and obscured
 * north face remain fits; the 2026 entrance photo verifies only that entrance. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/240832249';
const O=[122.068,446.625],W=24.041,D=70.329;
const U=[(146.075-O[0])/W,(445.348-O[1])/W],V=[(125.825-O[0])/D,(516.854-O[1])/D];
const P=(u,v,y=0)=>[O[0]+U[0]*u+V[0]*v,y,O[1]+U[1]*u+V[1]*v];
const polygon=points=>({type:'Polygon',coordinates:[[...points,points[0]].map(([u,v])=>{const p=P(u,v);return[p[0],p[2]];})]});
const rect=(u0,u1,v0,v1)=>polygon([[u0,v0],[u1,v0],[u1,v1],[u0,v1]]);
// This open west forecourt is part of the outer silhouette, not a hole in a
// continuous five-storey box. Raw OSM is retained in the independent record.
const footprint=()=>polygon([[0,0],[W,0],[W,D],[0,D],[0,D-13],[5,D-13],[5,13],[0,13]]);
const H={base:.45,low:12.45,porch:9.00,fourth:16.0,eave:18.95,ridge:22.0};
const C={brick:'#8f918b',stone:'#a7aaa1',cap:'#c9ccc1',roof:'#67756e',tile:'#879087',deck:'#999e95',red:'#79473d',glass:'#647f7e',metal:'#9aa89e',dark:'#3f4b46'};
function render(b,f){
 const saved=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=f.properties.pickId;b.anim=0;
 let detailInstances=0;const surfaceGroups=new Map();
 // Identical material/colour world-space faces share a mesh without altering
 // any vertex, normal or UV. Fine roof courses retain their own detail width.
 const mesh=(name,g,c,mat=c===C.brick?18:24)=>{const key=[c,mat,g.detailWidth||0].join('|');let q=surfaceGroups.get(key);if(!q){q={g:new G.Geometry(),c,mat};q.g.detailWidth=g.detailWidth;surfaceGroups.set(key,q);}q.g.v.push(...g.v);};
 // Exact unit-box reuse keeps the numerous window frames in one bucket.
 const box=(name,u,v,y,w,d,h,c,mat=c===C.brick?18:24)=>{const p=P(u,v,y);detailInstances++;b.local(p[0],0,p[2],-Math.atan2(U[1],U[0]),()=>b.mesh('south-education-unit-box',b.geo('south-education-box',G.box),0,y,0,w,h,d,c,mat));};
 const up=(g,a,c,d,e)=>{const p=[a,c,d,e].map(q=>P(...q));if((p[1][2]-p[0][2])*(p[2][0]-p[0][0])-(p[1][0]-p[0][0])*(p[2][2]-p[0][2])<0)p.reverse();g.quad(...p);};
 function mass(name,q,bottom,top,c=C.brick){mesh(name+'-walls',F.walls(q,bottom,top),c);mesh(name+'-top',F.surface(q,top),C.deck,22);}
 function windowEW(name,u,v,y,w,h,east,cols=3){
  const sign=east?1:-1,du=sign*.055;
  box(name+'-reveal',u+du,v,y,.10,w+.14,h+.14,C.dark);
  box(name+'-glass',u+sign*.115,v,y,.045,w,h,C.glass,28);
  for(let j=0;j<=cols;j++)box(name+'-mullion',u+sign*.15,v-w/2+j*w/cols,y,.055,.06,h,C.red);
  for(const yy of[y-h/2,y+h/2,y-h*.22])box(name+'-transom',u+sign*.15,v,yy,.055,w,.055,C.red);
 }
 function windowNS(name,u,v,y,w,h,south,cols=3){
  const sign=south?1:-1;
  box(name+'-reveal',u,v+sign*.055,y,w+.14,.10,h+.14,C.dark);
  box(name+'-glass',u,v+sign*.115,y,w,.045,h,C.glass,28);
  for(let j=0;j<=cols;j++)box(name+'-mullion',u-w/2+j*w/cols,v+sign*.15,y,.06,.055,h,C.red);
  for(const yy of[y-h/2,y+h/2,y-h*.22])box(name+'-transom',u,v+sign*.15,yy,w,.055,.055,C.red);
 }
 function railEW(name,u,v,y,span){
  for(let j=0;j<=Math.ceil(span/.55);j++)box(name+'-upright',u,v-span/2+j*span/Math.ceil(span/.55),y+.52,.05,.05,1.04,C.metal,9);
  for(const yy of[y+.30,y+.68,y+1.04])box(name+'-horizontal',u,v,yy,.055,span,.055,C.metal,9);
 }
 function mainRoof(){
  const a=7.5,c=W+.50,n=7.0,s=D-7.0,mid=(a+c)/2,r0=n+(c-a)*.46,r1=s-(c-a)*.46,q=new G.Geometry(),lines=new G.Geometry();
  up(q,[a,n,H.eave],[mid,r0,H.ridge],[mid,r1,H.ridge],[a,s,H.eave]);
  up(q,[mid,r0,H.ridge],[c,n,H.eave],[c,s,H.eave],[mid,r1,H.ridge]);
  q.tri(P(c,n,H.eave),P(a,n,H.eave),P(mid,r0,H.ridge));q.tri(P(a,s,H.eave),P(c,s,H.eave),P(mid,r1,H.ridge));
  mesh('long-north-south-four-pitch',q,C.roof,19);
  const at=(u,v)=>H.eave+(H.ridge-H.eave)*Math.max(0,Math.min(1,(u-a)/(mid-a),(c-u)/(c-mid),(v-n)/(r0-n),(s-v)/(s-r1)));
  // Tile courses remain on their actual hip plane and stop at the seam.
  for(let v=n+.28;v<s-.15;v+=.29){
   for(const [lo,hi]of[[a,mid],[mid,c]]){
    const x0=lo,x1=hi,breaks=[x0,x1];
    for(const z of[(v-n)/(r0-n),(s-v)/(s-r1)])if(z>0&&z<1){const x=lo===a?a+z*(mid-a):c-z*(c-mid);if(x>x0&&x<x1)breaks.push(x);}
    breaks.sort((x,y)=>x-y);for(let j=1;j<breaks.length;j++){const x=breaks[j-1],z=breaks[j];up(lines,[x,v,at(x,v)+.025],[z,v,at(z,v)+.025],[z,v+.035,at(z,v+.035)+.025],[x,v+.035,at(x,v+.035)+.025]);}
   }
  }
  lines.detailWidth=.018;mesh('roof-tile-courses',lines,C.tile,19);
  box('roof-ridge',mid,(r0+r1)/2,H.ridge+.06,.19,r1-r0,.13,C.roof,19);
  box('east-eave',c,(n+s)/2,H.eave-.15,.28,s-n,.30,C.cap,10);
  box('west-eave',a,(n+s)/2,H.eave-.15,.28,s-n,.30,C.cap,10);
  for(const v of[n,s])box('end-eave',(a+c)/2,v,H.eave-.15,c-a,.28,.30,C.cap,10);
 }
 function westPorch(){
  const n=13,s=D-13,entry=D/2;
  // Two storeys of the recessed middle front; the real end wings stand 5 m forward.
  mass('lower-west-gallery-north',rect(5,8.05,n,entry-5.75),H.base,H.porch);
  mass('lower-west-gallery-south',rect(5,8.05,entry+5.75,s),H.base,H.porch);
  mass('entry-upper-storey',rect(5,8.05,entry-5.75,entry+5.75),4.65,H.porch);
  // Recess the central ground door between substantial piers: no solid slab
  // is left over the doorway opening when seen from the west.
  // The door plane is behind the column line; dark recess adds real depth.
  box('entry-dark-recess',7.97,entry,2.47,.07,11.45,4.04,C.dark);
  box('entry-floor',5.5,entry,.55,5.0,13.2,.30,C.stone,10);
  for(const v of[entry-6.4,entry+6.4])box('entry-two-storey-brick-pier',4.55,v,4.65,1.3,1.25,8.5,C.brick);
  box('entry-portal-fascia',4.54,entry,4.95,.8,11.5,.85,C.cap,10);
  box('entry-door-glass',7.80,entry,2.35,.045,5.9,3.42,C.glass,28);
  for(const vv of[entry-2.95,entry-1.62,entry,entry+1.62,entry+2.95])box('entry-door-red-jamb',7.75,vv,2.35,.11,.115,3.50,C.red);
  for(const yy of[.64,4.06])box('entry-door-red-transom',7.75,entry,yy,.11,5.98,.115,C.red);
  for(const vv of[entry-.16,entry+.16])box('entry-paired-door-handle',7.59,vv,2.28,.075,.05,.74,C.metal,9);
  windowEW('entry-upper-deep-red-grid',4.84,entry,6.90,10.7,2.74,false,6);
  railEW('entry-upper-balustrade',4.08,entry,5.37,11.4);
  for(let j=0;j<5;j++)box('entry-west-facing-step',3.70-j*.37,entry,.06*(5-j),.40,13.2,.12*(5-j),C.stone,10);
  // Visible thin glazing above this gallery slopes up toward the tall block;
  // it is not a second tiled main roof and does not cover the west forecourt.
  const g=new G.Geometry(),bars=new G.Geometry();up(g,[4.70,n,9.12],[8.05,n,12.52],[8.05,s,12.52],[4.70,s,9.12]);
  mesh('west-sloping-glazed-roof',g,C.glass,28);
  for(let v=n+.40;v<s;v+=1.25)up(bars,[4.70,v,9.16],[8.05,v,12.56],[8.05,v+.055,12.56],[4.70,v+.055,9.16]);
  mesh('west-glazed-roof-mullions',bars,C.metal,9);
  for(const v of[17.0,22.3,27.6,42.7,48.0,53.3])for(const y of[2.55,6.70])windowEW('west-gallery-bays',4.99,v,y,3.05,2.65,false);
  for(const v of[14.3,19.65,24.95,30.5,39.8,45.35,50.65,55.9])box('west-gallery-pier',4.84,v,4.7,.36,.76,8.5,C.brick);
  for(const v of[21.8,48.3]){box('west-gallery-balcony-fascia',4.73,v,4.84,.54,12.6,.72,C.cap,10);railEW('west-gallery-rail',4.36,v,5.23,12.4);}
  // Only the observed fascia receives the inscription, not a huge sign near the roof.
  if(b.lettering){const pos=P(4.06,entry,4.99);b.local(pos[0],0,pos[2],-Math.atan2(U[1],U[0])-Math.PI/2,()=>b.lettering('教育学院',0,4.99,.015,6.7,.48,0,'#635447'));}
 }
 function southWingFront(){
  const v=D-6.4;
  // The own southwest view shows an arched ground window, an upper balcony,
  // and a three-part small decorative roof. No northern mirror is inferred.
  const g=new G.Geometry(),frame=new G.Geometry(),centerY=2.62,r=1.20;
  const pts=[[-r,.62],[r,.62],[r,centerY]];
  for(let j=1;j<=16;j++){const a=j/16*Math.PI;pts.push([r*Math.cos(a),centerY+r*Math.sin(a)]);}
  for(let j=1;j<pts.length-1;j++)g.tri(P(-.072,v+pts[0][0],pts[0][1]),P(-.072,v+pts[j][0],pts[j][1]),P(-.072,v+pts[j+1][0],pts[j+1][1]));
  for(let j=0;j<16;j++){const a=j*Math.PI/16,c=(j+1)*Math.PI/16;frame.quad(P(-.11,v+r*Math.cos(a),centerY+r*Math.sin(a)),P(-.11,v+(r+.16)*Math.cos(a),centerY+(r+.16)*Math.sin(a)),P(-.11,v+(r+.16)*Math.cos(c),centerY+(r+.16)*Math.sin(c)),P(-.11,v+r*Math.cos(c),centerY+r*Math.sin(c)));}
  mesh('southwest-ground-arched-glass',g,C.glass,28);mesh('southwest-ground-arch-stone',frame,C.cap,10);
  for(const vv of[v-r-.08,v+r+.08])box('arch-stone-jamb',-.12,vv,(centerY+.62)/2,.20,.16,centerY-.62,C.cap,10);
  box('arch-red-center-bar',-.14,v,2.03,.06,.065,2.8,C.red);box('arch-red-transom',-.14,v,centerY,.06,2.4,.06,C.red);
  for(const yy of[6.30,10.10])for(const vv of[v-2.4,v,v+2.4])windowEW('southwest-three-bays',0,vv,yy,vv===v?2.45:1.4,2.28,false,vv===v?3:2);
  box('southwest-balcony-slab',-.52,v,4.85,1.0,7.8,.24,C.cap,10);box('southwest-balcony-front',-1.0,v,5.38,.12,7.8,1.05,C.cap,10);
  for(const vv of[v-3.9,v+3.9])box('southwest-balcony-return',-.5,vv,5.38,1.0,.12,1.05,C.cap,10);
  // Short upturned cover strips, as photographed above only these three bays.
  const small=new G.Geometry();for(const [vv,span,peak]of[[v,3.25,12.4],[v-2.85,2.25,11.96],[v+2.85,2.25,11.96]]){
   for(let j=0;j<10;j++){const a=-span/2+j*span/10,c=a+span/10,at=t=>peak+.36*Math.pow(Math.abs(t)/(span/2),5);up(small,[-.20,vv+a,at(a)],[-1.04,vv+a,at(a)-.20],[-1.04,vv+c,at(c)-.20],[-.20,vv+c,at(c)]);}
  }mesh('southwest-three-small-tiled-hoods',small,C.roof,19);
 }
 try{
  // Preserve the two existing atlas slots in their original order. Suppress
  // only these registration instances; the old generic building is not drawn.
  if(b.lettering){const add=b.e.add;b.e.add=()=>{};try{b.lettering('教育学院',0,0,0,1,1,0,'#635447');b.lettering('北京大学教育学院',0,0,0,1,1,0,'#66554c');}finally{b.e.add=add;}}
  mass('recessed-plan-plinth',footprint(),.015,H.base,C.stone);
  mass('east-long-three-storey-base',rect(8,W,0,D),H.base,H.low);
  for(const [name,n,s]of[['north',0,13],['south',D-13,D]]){
   mass(name+'-three-storey-west-wing',rect(0,8,n,s),H.base,H.low);
   for(const u of[.13,W-.13])box(name+'-deck-edge',u,(n+s)/2,H.low+.21,.26,s-n,.42,C.brick);
   for(const v of[n,s])box(name+'-deck-edge',(W)/2,v,H.low+.21,W,.26,.42,C.brick);
   // Courtyard-facing visible narrow window and open balcony stacks.
   const inward=name==='north',face=inward?s:n;
   for(const y of[2.42,6.36,10.30]){
    windowNS(name+'-courtyard-window',6.15,face,y,1.52,2.40,inward,2);
    windowNS(name+'-courtyard-recess',2.25,face,y,2.65,2.85,inward,3);
    if(y>3){box(name+'-courtyard-balcony-fascia',2.25,face+(inward?.20:-.20),y-1.27,2.95,.47,.62,C.cap,10);for(let j=0;j<=5;j++)box(name+'-courtyard-balcony-rail',.93+j*.528,face+(inward?.46:-.46),y-.54,.04,.04,.90,C.metal,9);for(const yy of[y-.30,y-.70])box(name+'-courtyard-balcony-hand',2.25,face+(inward?.46:-.46),yy,2.67,.045,.045,C.metal,9);}
   }
  }
  mass('fourth-floor-inset-ends',rect(8,W,7,D-7),H.low,H.fourth);
  mass('fifth-floor-under-eave',rect(8.8,W-.7,7.8,D-7.8),H.fourth,H.eave);
  // Stone lower storey is observed along the east middle, bounded by the two
  // stair strips; the end wings retain exposed grey brick down to the base.
  box('east-middle-stone-band',W+.07,D/2,2.62,.18,35.7,4.25,C.stone,10);
  const endBays=[2.65,6.05,9.45,12.85,D-12.85,D-9.45,D-6.05,D-2.65];
  const middleBays=Array.from({length:11},(_,i)=>18.45+i*3.35);
  for(const v of[...endBays,...middleBays]){
   for(const y of[2.40,6.34,10.28])windowEW('east-three-pane-bays',W+(y<4&&v>17.315&&v<53.015?.12:0),v,y,2.30,2.57,true);
   if(v>7.5&&v<D-7.5)windowEW('east-fourth-paired-bays',W,v,14.27,1.95,1.62,true,2);
   if(v>9&&v<D-9)windowEW('east-fifth-recessed-small-bays',W-.7,v,17.36,2.30,1.12,true,2);
  }
  for(const v of[15.95,D-15.95]){
   windowEW('east-stair-strip',W+.02,v,8.6,2.45,13.9,true,3);
   for(const y of[3.0,6.9,10.8,14.4])box('east-stair-transom',W+.19,v,y,.08,2.47,.12,C.red);
   for(const vv of[v-1.55,v+1.55])box('east-stair-projecting-pier',W+.21,vv,8.1,.45,.44,15.3,C.brick);
  }
  for(const v of[.8,4.35,7.75,11.15,14.45,D-.8,D-4.35,D-7.75,D-11.15,D-14.45]){box('east-end-vertical-brick-fin',W+.20,v,6.52,.42,.34,12.14,C.brick);box('east-end-white-fin-cap',W+.21,v,12.44,.43,.36,.63,C.cap,10);}
  // Narrow fourth-floor windows and top clerestory above the west glazed slope.
  for(const v of middleBays){windowEW('west-fourth-visible-bays',8,v,14.26,2.05,1.6,false,2);windowEW('west-fifth-small-bays',8.8,v,17.33,2.18,1.13,false,2);}
  westPorch();southWingFront();mainRoof();
  let groupIndex=0;for(const q of surfaceGroups.values())b.mesh('south-education-surface-'+groupIndex++,q.g,0,0,0,1,1,1,q.c,q.mat);
  // The north exterior and end-deck equipment are obscured: no mirrored hood,
  // dense northern window array or guessed roof plant is generated.
 }finally{[b.origin,b.rotation,b.id,b.anim]=saved;}
 return {id:ID,strategy:'south-education-v46',sourceFloors:5,westEndWingFloors:3,entrance:'west',mainRidge:'north-south',westRecessDepthFit:5,endRoofSetbackFit:7,sourceOutlineRetainedSeparately:true,heightMeasured:false,exactBayCountVerified:false,northFacadeVerified:false,wholeCurrentExteriorVerified:false,detailInstances};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.SouthEducation46={id:ID,render,P,footprint,rect,heights:H,width:W,depth:D};
})(YY);
