/* 194 发树楼. Four observed storeys and the north double-height entrance.
 * Roof, absolute display height and source footprint are retained placeholders.
 * The three glass roof folds, upper setback depth and shared bridges are unresolved.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo;
const ID='way/1031892013';
const north={a:[-942.611,-137.616],c:[-903.863,-140.203]};
function render(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const old=[b.origin,b.rotation,b.id,b.anim],window=b.window,local=b.local;
 let result;
 try{
  // Remove the generic north windows and continuous floor belts. Other faces
  // retain the four-row type approximation pending their own elevation evidence.
  b.window=function(x,y,z,w,h,r,...rest){if(Math.cos(r)<-.95)return;return window.call(this,x,y,z,w,h,r,...rest);};
  b.local=function(x,y,z,r,fn){if(y===0&&Math.cos(r)<-.95)return;return local.call(this,x,y,z,r,fn);};
  result=A.footprint(b,f,add,{key:'building194-v46',floors:4});
 }finally{b.window=window;b.local=local;[b.origin,b.rotation,b.id,b.anim]=old;}
 const H=result.bodyHeight,L=Math.hypot(north.c[0]-north.a[0],north.c[1]-north.a[1]);
 const ux=(north.c[0]-north.a[0])/L,uz=(north.c[1]-north.a[1])/L,nx=uz,nz=-ux,r=Math.atan2(nx,nz);
 const point=(t,y,offset=.065)=>[north.a[0]+ux*L*t+nx*offset,y,north.a[1]+uz*L*t+nz*offset];
 const coat=(key,y0,y1,color)=>{const q=new G.Geometry();q.quad(point(0,y0),point(0,y1),point(1,y1),point(1,y0));add(key,q,color,24,f.properties.pickId);};
 // Layer boundaries and opening positions are proportional photo fits, not survey heights.
 coat('194-north-stone-base',.30,H*.285,'#c8c6b7');
 coat('194-north-gray-brick',H*.285,H*.835,'#626663');
 coat('194-north-upper-shadow-band',H*.835,H,'#343e3e');
 const box=(key,x,y,z,w,h,d,color,mat=24)=>b.mesh(key,b.geo(key,G.box),x,y,z,w,h,d,color,mat);
 const at=(fraction,fn)=>{const p=point(fraction,0,.078);b.local(p[0],0,p[2],r,fn);};
 function glazed(key,t,y,w,h){at(t,()=>{
  box(key+'-glass',0,y,.016,w,h,.045,'#567878',28);
  for(const x of[-w/2,w/2])box(key+'-jamb',x,y,.052,.055,h+.07,.065,'#a4aca5',29);
  for(const yy of[y-h/2,y+h/2])box(key+'-rail',0,yy,.052,w+.055,.048,.065,'#a4aca5',29);
  box(key+'-mullion',0,y,.057,.045,h,.065,'#8e9c98',29);
 });}
 b.id=f.properties.pickId;b.anim=0;
 try{
  const columns=[.070,.170,.270,.370,.470,.570,.680,.790,.900];
  for(let i=0;i<columns.length;i++){
   const t=columns[i],inPortal=t>.325&&t<.61,w=i>=3&&i<=5?L*.075:L*.049;
   if(!inPortal){
    glazed('194-north-floor1',t,H*.145,L*.032,H*.190);
    at(t,()=>box('194-north-vertical-spandrel',0,H*.492,.021,w,H*.55,.048,'#525d60'));
    glazed('194-north-floor2',t,H*.435,w,H*.160);
   }
   glazed('194-north-floor3',t,H*.682,w,H*.167);
  }
  for(let i=0;i<13;i++)glazed('194-north-floor4',.06+i*.073,H*.906,L*.060,H*.116);
  // Broad two-storey glazed opening beneath a pale rectangular frame.
  // Steps and the ancient bridge lie outside this ring and are not duplicated.
  at(.47,()=>{
   const w=L*.245,bot=.30,top=H*.545,hh=top-bot;
   box('194-north-entrance-glass',0,bot+hh/2,.064,w,hh,.085,'#466d70',28);
   for(const x of[-w/2-.24,w/2+.24])box('194-north-entrance-stone-jamb',x,bot+hh/2,.114,.48,hh,.20,'#d2cebc');
   box('194-north-entrance-stone-head',0,top+.085,.114,w+.96,.17,.20,'#d2cebc');
   for(let i=-2;i<=2;i++)box('194-north-entrance-mullion',i*w/5,bot+hh/2,.137,.055,hh,.065,'#839894',29);
   for(let i=1;i<=3;i++)box('194-north-entrance-transom',0,bot+hh*i/4,.137,w,.050,.065,'#839894',29);
   box('194-north-entry-door',0,bot+hh*.19,.155,w*.40,hh*.38,.042,'#263f41',28);
  });
  at(.5,()=>box('194-north-eave-edge',0,H-.045,.105,L,.09,.21,'#cfcbb9'));
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {...result,strategy:'building194-v46',floors:4,northEntranceDoubleHeight:true,
  northFacadePhotoFit:true,heightMeasured:false,displayHeightRetained:true,
  roofReconstructed:false,upperSetbackDepthReconstructed:false,sharedStructureReconstructed:false,
  allFacadesVerified:false,scope:'four-storeys-and-north-entrance; inherited-roof-and-display-height'};
}
Y.Building194={id:ID,north,render};A.render=render;
})(YY);
