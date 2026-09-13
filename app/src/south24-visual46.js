/* Physical south building24, not manifest24. The two roof slopes and the
 * registered2013 eastern gable replace the inherited shared heren block.
 * Plan, eaves and ornaments are image fits, not a measured survey. The2023 south image and native winter imagery independently support the long roof; western gable details remain open. */
(function(Y){'use strict';
const A=Y.Architecture30,G=Y.Geo,ID='relation/12815353',prior=A.render;
// Raw ground walls, not the elevated bright roof strip. The north door shares
// OSM node10796554803 with way1160812189; both flanking paths remain outside.
const P={centre:[90.22475,731.55075],rotation:.04968380779364279,W:51.20,D:11.72268,roofW:52.60,roofD:13.12,entryX:-.2689879493069703,entryZ:-5.861341664510534,faceSkew:.00585045,
 wallRing:[[-25.54579855,6.01097703],[25.65525966,5.71142447],[25.53941388,-5.71142447],[-.26898795,-5.86134166],[-25.64887499,-6.01097703],[-25.54579855,6.01097703]]};
const H={base:.45,floor:3.2,eave:10.10,ridge:12.85};
const C={brick:'#91968f',stone:'#b3b4a7',roof:'#69716e',tile:'#8d9589',red:'#863a33',glass:'#5b706c',green:'#3e685d'};
const roofY=v=>H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,1-Math.abs(v)/(P.roofD/2)),1.43);
function roof(b,x,z,w,d,y,rise,key){
 const main=new G.Geometry(),ribs=new G.Geometry(),end=new G.Geometry(),cap=new G.Geometry(),N=32;
 const profile=v=>y+rise*Math.pow(Math.max(0,1-Math.abs(v)/(d/2)),1.43);
 for(let j=0;j<N;j++){
  const a=-d/2+d*j/N,c=-d/2+d*(j+1)/N,pa=profile(a),pc=profile(c);
  main.quad([x-w/2,pa,z+a],[x-w/2,pc,z+c],[x+w/2,pc,z+c],[x+w/2,pa,z+a]);
  for(let u=-w/2+.10;u<w/2;u+=.24)ribs.quad([x+u-.023,pa+.027,z+a],[x+u-.023,pc+.027,z+c],[x+u+.023,pc+.027,z+c],[x+u+.023,pa+.027,z+a]);
  for(const side of [-1,1]){
   // The hard-gable wall is at the actual wall face, not at the projecting
   // roof tip: an outer closure would hide the attic vent and the three eaves.
   const wallX=x+side*(key==='main'?P.W/2:w/2),q=[[wallX,y,z+a],[wallX,y,z+c],[wallX,pc,z+c],[wallX,pa,z+a]];if(side>0)q.reverse();end.quad(...q);
   cap.quad([x+side*w/2-.075,pa+.08,z+a],[x+side*w/2-.075,pc+.08,z+c],[x+side*w/2+.075,pc+.08,z+c],[x+side*w/2+.075,pa+.08,z+a]);
  }
 }
 const m=(name,g,col,mat)=>b.mesh('south24-'+key+'-'+name,g,0,0,0,1,1,1,col,mat);
 m('two-slopes',main,C.roof,2);ribs.detailWidth=.046;m('tile-rows',ribs,C.tile,2);m('hard-gable',end,C.brick,30);m('gable-coping',cap,C.tile,2);
 b.box(x,y+rise+.055,z,w,.16,.23,C.tile,2);
 for(const s of[-1,1]){b.box(x,y-.12,z+s*d/2,w,.24,.19,C.red,6);for(let u=-w/2+.12;u<w/2;u+=.29)b.box(x+u,y-.11,z+s*(d/2-.17),.085,.12,.49,C.green,6);}
}
function window(b,x,y,z,w=1.9,h=1.98){
 b.box(x,y,z,w+.14,h+.16,.10,C.red,6);b.box(x,y,z+.065,w,h,.040,C.glass,5);
 for(const q of[-1/6,1/6])b.box(x+q*w,y+h*.12,z+.099,.052,h*.73,.04,C.red,6);
 b.box(x,y-h*.245,z+.100,w,.055,.05,C.red,6);b.box(x,y-h*.375,z+.103,.052,h*.25,.04,C.red,6);
 b.box(x,y+h*.55,z-.010,w+.32,.20,.18,C.stone,10);b.box(x,y-h*.54,z+.11,w+.24,.15,.28,C.stone,10);
}
function archedDoor(b){
 const door=new G.Geometry(),rim=new G.Geometry(),half=.87,spring=2.2,base=.36;
 const pts=[[-half,base,0],[half,base,0],[half,spring,0]];for(let j=1;j<=24;j++){const a=j/24*Math.PI;pts.push([half*Math.cos(a),spring+half*Math.sin(a),0]);}pts.push([-half,base,0]);
 for(let j=0;j+1<pts.length;j++)door.tri([0,1.6,.045],pts[j],pts[j+1]);
 for(let j=0;j<24;j++){const a=j/24*Math.PI,c=(j+1)/24*Math.PI;rim.quad([Math.cos(a)*half,spring+Math.sin(a)*half,.07],[Math.cos(a)*(half+.16),spring+Math.sin(a)*(half+.16),.07],[Math.cos(c)*(half+.16),spring+Math.sin(c)*(half+.16),.07],[Math.cos(c)*half,spring+Math.sin(c)*half,.07]);}
 b.mesh('south24-gable-arched-door',door,0,0,0,1,1,1,C.red,6);b.mesh('south24-gable-arch-stone',rim,0,0,0,1,1,1,C.stone,10);
 for(const x of[-.91,.91])b.box(x,1.3,.065,.16,2.3,.14,C.stone,10);
 for(const s of[-1,1])b.box(s*.43,1.67,.11,.69,.91,.035,C.glass,5);
 b.box(0,1.38,.14,.085,2.0,.06,C.red,6);b.box(0,2.23,.14,1.7,.075,.06,C.red,6);
}
function gable(b,side){b.local(side*P.W/2,0,0,side*Math.PI/2,()=>{
 for(const x of[-2.20,0,2.20]){window(b,x,5.05,.09,x===0?1.85:1.38,2.05);window(b,x,8.18,.09,x===0?1.85:1.38,x===0?2.65:2.05);}
 for(const x of[-3.2,-1.15,1.15,3.2])b.box(x,6.3,.17,.24,6.5,.34,C.stone,10);
 b.local(0,0,.11,0,()=>archedDoor(b));
 b.box(0,3.68,.91,6.7,.22,1.72,C.stone,10);
 for(const x of[-3.18,3.18])b.box(x,2.0,.73,.28,3.4,.32,C.stone,10);
 // Observed second-floor solid ornamental parapet, with low open top rail.
 b.box(0,4.11,1.74,6.65,.67,.17,C.stone,10);b.box(0,4.60,1.74,6.65,.13,.18,C.stone,10);
 for(const x of[-3.2,-1.6,0,1.6,3.2])b.box(x,4.44,1.74,.13,.68,.18,C.stone,10);
 for(const x of[-3.24,3.24]){b.box(x,4.12,.93,.17,.68,1.66,C.stone,10);b.box(x,4.60,.93,.18,.13,1.66,C.stone,10);}
 for(const [x,w,y] of[[-2.24,2.22,9.74],[0,3.0,10.26],[2.24,2.22,9.74]]){
  const q=new G.Geometry(),fascia=new G.Geometry(),N=20,profile=u=>y+.38*Math.pow(Math.abs(u)/(w/2),3);
  for(let j=0;j<N;j++){const u=-w/2+w*j/N,v=-w/2+w*(j+1)/N,a=profile(u),c=profile(v);q.quad([x+u,a,1.02],[x+v,c,1.02],[x+v,c+.38,.04],[x+u,a+.38,.04]);fascia.quad([x+u,a-.17,1.02],[x+v,c-.17,1.02],[x+v,c,1.02],[x+u,a,1.02]);}
  b.mesh('south24-gable-three-decorative-eaves-'+x,q,0,0,0,1,1,1,C.roof,2);b.mesh('south24-gable-curved-red-fascia-'+x,fascia,0,0,0,1,1,1,C.red,6);for(let u=-w/2+.12;u<w/2;u+=.26)b.box(x+u,profile(u)-.11,.67,.07,.12,.7,C.green,6);
 }
 // The attic vent is not resolved in the backlit24 original.
 });}
function render(b,f){b.id=f.properties.pickId;
 // After19–21 acquired dedicated models, old24 became the first creator of
 // this shared frame bucket. Reserve its original position without a dummy
 // instance; the later real science1 windows supply its unchanged records.
 const frameKey='v30-recessFrametrue';
 if(b.e.buckets&&!b.e.buckets.has(frameKey)){
  const add=b.e.add;b.e.add=(key,geometry)=>{
   if(key==='recessFrametrue'&&!b.e.buckets.has(frameKey))b.e.buckets.set(frameKey,{geometry:{v:new Float32Array(geometry.v)},detailWidth:geometry.detailWidth||0,instances:[]});
  };
  try{b.window(0,0,0,1,1);}finally{b.e.add=add;}
 }
 // Preserve the two existing atlas allocations so later campus labels keep
 // their exact UVs. The old floating facade lettering is not drawn again.
 const add=b.e.add;b.e.add=()=>{};try{b.lettering('24号楼',0,0,0,1,1,0,'#663d34');b.lettering('全球健康发展研究院',0,0,0,1,1,0,'#775749');}finally{b.e.add=add;}
 b.local(P.centre[0],0,P.centre[1],P.rotation,()=>{
 const ground={type:'Polygon',coordinates:[P.wallRing]};
 b.mesh('south24-ground-plinth-walls',Y.Footprints.walls(ground,0,.6),0,0,0,1,1,1,C.stone,10);b.mesh('south24-ground-plinth-top',Y.Footprints.surface(ground,.6),0,0,0,1,1,1,C.stone,10);
 b.mesh('south24-original-ground-walls',Y.Footprints.walls(ground,.5,H.eave),0,0,0,1,1,1,C.brick,30);b.mesh('south24-wall-top',Y.Footprints.surface(ground,H.eave),0,0,0,1,1,1,C.brick,30);
 for(const side of[-1,1])b.local(0,0,side*P.D/2,side<0?Math.PI-P.faceSkew:P.faceSkew,()=>{
  for(const y of[.85,9.94])b.box(0,y,.10,P.W,.19,.22,C.stone,10);
  for(let k=-6;k<=6;k++)for(let f=0;f<3;f++){if(side<0&&k===0&&f===0)continue;window(b,k*3.58,1.88+H.floor*f,.105,1.85,1.95);}
  for(const k of[-6.5,-4.5,-2.5,-.5,.5,2.5,4.5,6.5])b.box(k*3.58,5.23,.20,.29,9.63,.27,C.stone,10);
 });
 roof(b,0,0,P.roofW,P.roofD,H.eave,H.ridge-H.eave,'main');
 for(const side of[-1,1]){if(side===1)gable(b,side);const x=side*(P.roofW/2-.15);for(const[a,c]of[[[x,12.95,0],[x-side*.10,13.16,0]],[[x-side*.10,13.16,0],[x-side*.42,13.25,0]],[[x-side*.42,13.25,0],[x-side*.63,13.13,0]]])b.beam(a,c,.13,C.tile,2);}
 Y.SouthHeren46.galleryDoor(b,-P.W/2,0,-Math.PI/2);
 // The registered2013 north courtyard image establishes the central entry side;
 // its dimensions remain an image fit, distinct from the eastern arched door.
 b.local(P.entryX,0,P.entryZ-.13,Math.PI-P.faceSkew,()=>{
  b.box(0,1.85,.10,2.9,2.8,.16,C.red,6);b.box(0,2.10,.20,2.65,2.0,.05,C.glass,5);
  for(const x of[-1.04,0,1.04])b.box(x,1.87,.25,.09,2.66,.08,C.red,6);
  b.box(0,2.98,.25,2.85,.11,.08,C.red,6);b.box(0,.71,.25,2.83,.09,.08,C.red,6);
  for(const x of[-1.75,1.75])b.box(x,1.87,.37,.38,3.0,.73,C.brick,30);
  roof(b,0,.58,4.4,1.45,3.5,.55,'north-entry');
  for(let j=0;j<3;j++)b.box(0,.08+j*.12,1.28-j*.31,4.12,.16,.64,C.stone,10);
 });
 });return{id:ID,strategy:'south24-independent-hard-gable',floors:3,storeyHeight:3.2,totalHeightApproximate:13,heightIsSurvey:false,roof:'two-curved-slopes-with-ridge',eastGable:'three-decorative-eaves-arched-entry-and-balcony',northEntry:'courtyard',planFit:true,allFacadesVerified:false};}
A.render=(b,f,add)=>f.properties.id===ID?render(b,f):prior(b,f,add);
Y.South24Visual46={id:ID,render,plan:P,height:H,roofY};
})(YY);
