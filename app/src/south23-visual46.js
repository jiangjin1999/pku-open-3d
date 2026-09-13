/* Physical south23, pick14. Independent courtyard-front and narrow NS hall;
 * dimensions are bounded image fits, and unseen end connections remain open. */
(function(Y){'use strict';
const A=Y.Architecture30,G=Y.Geo,ID='relation/12815355',prior=A.render;
const P={"centre":[60.96357264744615,700.890327655374],"rotation":1.6423182804843675,"W":29.8,"D":11.4,"roofW":31.2,"roofD":12.6};
const H={base:.45,floor:3.2,eave:10.10,ridge:12.85};
const C={brick:'#92948d',stone:'#b4b4a6',plinth:'#b9af9c',roof:'#69716e',tile:'#8d9589',red:'#863a33',glass:'#5b706c',green:'#3e685d'};
const profile=v=>H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,1-Math.abs(v)/(P.roofD/2)),1.43);
function roof(b){
 const top=new G.Geometry(),tile=new G.Geometry(),ends=new G.Geometry(),coping=new G.Geometry();
 for(let j=0;j<32;j++){
  const z=-P.roofD/2+P.roofD*j/32,t=-P.roofD/2+P.roofD*(j+1)/32,y=profile(z),v=profile(t);
  top.quad([-P.roofW/2,y,z],[-P.roofW/2,v,t],[P.roofW/2,v,t],[P.roofW/2,y,z]);
  for(let x=-P.roofW/2+.10;x<P.roofW/2;x+=.24)tile.quad([x-.023,y+.027,z],[x-.023,v+.027,t],[x+.023,v+.027,t],[x+.023,y+.027,z]);
  for(const side of[-1,1]){
   const x=side*P.W/2,q=[[x,H.eave,z],[x,H.eave,t],[x,v,t],[x,y,z]];if(side>0)q.reverse();ends.quad(...q);
   const a=side*P.roofW/2;coping.quad([a-.09,y+.09,z],[a-.09,v+.09,t],[a+.09,v+.09,t],[a+.09,y+.09,z]);
  }
 }
 b.mesh('south23-main-two-slopes',top,0,0,0,1,1,1,C.roof,2);tile.detailWidth=.046;b.mesh('south23-main-tile-rows',tile,0,0,0,1,1,1,C.tile,2);
 b.mesh('south23-hard-gable',ends,0,0,0,1,1,1,C.brick,30);b.mesh('south23-gable-coping',coping,0,0,0,1,1,1,C.tile,2);
 b.box(0,H.ridge+.055,0,P.roofW,.16,.23,C.tile,2);
 for(const s of[-1,1]){
  b.box(0,H.eave-.17,s*P.roofD/2,P.roofW,.25,.19,C.red,6);
  for(let x=-P.roofW/2+.12;x<P.roofW/2;x+=.29)b.box(x,H.eave-.11,s*(P.roofD/2-.17),.085,.12,.49,C.green,6);
  const x=s*(P.roofW/2-.15);b.beam([x,12.96,0],[x-s*.13,13.18,0],.12,C.tile,2);b.beam([x-s*.13,13.18,0],[x-s*.46,13.25,0],.12,C.tile,2);
 }
}
function window(b,x,y,z){
 const w=1.86,h=1.95;b.box(x,y,z,w+.14,h+.14,.10,C.red,6);b.box(x,y,z+.065,w,h,.04,C.glass,5);
 for(const d of[-1/6,1/6])b.box(x+d*w,y+h*.12,z+.10,.052,h*.72,.04,C.red,6);
 b.box(x,y-h*.245,z+.103,w,.055,.045,C.red,6);b.box(x,y-h*.375,z+.106,.052,h*.25,.045,C.red,6);
 b.box(x,y+h*.55,z,w+.28,.18,.20,C.stone,10);b.box(x,y-h*.54,z+.1,w+.22,.15,.27,C.stone,10);
}
function entry(b){
 // The registered east front has a centered rectangular doorway; its shallow
 // tiled canopy is not the large arched gable balcony of physical22.
 b.box(0,1.93,.07,2.70,2.92,.13,C.red,6);b.box(0,2.02,.16,2.47,2.55,.05,C.glass,5);
 for(const x of[-1.05,-.50,.50,1.05])b.box(x,1.96,.205,.07,2.76,.07,C.red,6);
 for(const y of[.90,2.72,3.21])b.box(0,y,.21,2.57,.075,.08,C.red,6);
 for(const x of[-1.64,1.64])b.box(x,1.97,.33,.37,3.40,.62,C.stone,10);
 b.box(0,3.46,.34,3.68,.49,.72,C.stone,10);
 const top=new G.Geometry(),fascia=new G.Geometry(),tiles=new G.Geometry(),w=4.32;
 const yy=x=>3.77+.24*Math.pow(Math.abs(x)/(w/2),4);
 for(let j=0;j<24;j++){
  const x=-w/2+w*j/24,t=-w/2+w*(j+1)/24,a=yy(x),c=yy(t);
  top.quad([x,a,1.12],[t,c,1.12],[t,c+.46,-.12],[x,a+.46,-.12]);
  fascia.quad([x,a-.16,1.12],[t,c-.16,1.12],[t,c,1.12],[x,a,1.12]);
 }
 for(let x=-w/2+.10;x<w/2;x+=.24){const a=yy(x);tiles.quad([x-.024,a+.03,1.12],[x+.024,a+.03,1.12],[x+.024,a+.49,-.12],[x-.024,a+.49,-.12]);}
 b.mesh('south23-east-entry-curved-canopy',top,0,0,0,1,1,1,C.roof,2);b.mesh('south23-east-entry-fascia',fascia,0,0,0,1,1,1,C.red,6);tiles.detailWidth=.048;b.mesh('south23-entry-tile-rows',tiles,0,0,0,1,1,1,C.tile,2);
 for(let x=-w/2+.10;x<w/2;x+=.26)b.box(x,yy(x)-.09,.73,.07,.12,.70,C.green,6);
 for(let j=0;j<3;j++)b.box(0,.08+j*.12,1.20-j*.32,4.10,.16,.65,C.stone,10);
}

function render(b,f){
 b.id=f.properties.pickId;
 // Keep both existing label-atlas reservations in their original order.
 const add=b.e.add;b.e.add=()=>{};try{b.lettering('23号楼',0,0,0,1,1,0,'#663d34');b.lettering('23号楼',0,0,0,1,1,0,'#775749');}finally{b.e.add=add;}
 b.local(P.centre[0],0,P.centre[1],P.rotation,()=>{
  b.box(0,.30,0,P.W,.60,P.D,C.stone,10);b.box(0,5.30,0,P.W,9.60,P.D,C.brick,30);
  for(const side of[-1,1])b.local(0,0,side*P.D/2,side<0?Math.PI:0,()=>{
   b.box(0,.80,.04,P.W,1.02,.12,C.plinth,10);b.box(0,9.95,.10,P.W,.20,.22,C.stone,10);
   for(let k=-4;k<=4;k++)for(let floor=0;floor<3;floor++){if(side>0&&k===0&&floor===0)continue;window(b,k*3.08,2.07+3.2*floor,.09);}
   for(const x of[-13.7,-4.55,4.55,13.7])b.box(x,6.27,.11,.30,7.35,.26,C.stone,10);
  });
  // The user's corrected connection topology establishes these end doors.
  for(const side of[-1,1])Y.SouthHeren46.galleryDoor(b,side*P.W/2,0,side*Math.PI/2);
  roof(b);b.local(0,0,P.D/2+.12,0,()=>entry(b));
 });
 for(const c of Y.SouthHeren46.gallerySpecs.filter(c=>c.near===23))Y.SouthHeren46.straightGallery(b,c);
 return{id:ID,strategy:'south23-independent-courtyard-hall',floors:3,storeyHeight:3.2,totalHeightApproximate:13,heightIsSurvey:false,roof:'two-curved-slopes-with-ridge',entry:'east-courtyard-centred',endFacadesVerified:false,connectionsVerified:false,connectionTopologyUserConfirmed:true};
}
A.render=(b,f,add)=>f.properties.id===ID?render(b,f):prior(b,f,add);Y.South23Visual46={id:ID,render,plan:P,height:H,roofY:profile};
})(YY);
