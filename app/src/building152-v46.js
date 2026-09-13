/* Changchunyuan 55: dated 2023-01-08 south, southeast and southwest panoramas
 * show a ground level plus four continuous enclosed glazed balcony bands.
 * The 2017 northwest panorama and 2021/2024 PKU photographs instead show
 * punched north windows and pale metal cladding, without the generic piers.
 * The original plan, 15m display body and flat-roof envelope are retained.
 * Glazing subdivisions and vertical proportions fit that existing envelope;
 * they are not measured bays/heights. End steps, roof levels and doors remain open.
 */
(function(Y){'use strict';
const A=Y.Architecture30,F=Y.Footprints,previous=A.render,ID='way/849765900';
function render(b,f,add){
 const ring=F.polygons(f.geometry)[0][0],sign=F.area(ring)>0?1:-1;
 const edges=ring.slice(1).map((c,i)=>{const a=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len;return {a,c,len,ux,uz,nx:uz*sign,nz:-ux*sign};});
 const south=edges.find(e=>e.nz>.9),distance=(e,x,z)=>(x-e.a[0])*e.nx+(z-e.a[1])*e.nz;
 const onWindowLine=(e,x,z)=>Math.abs(distance(e,x,z)-.045)<1e-5;
 const window=b.window,local=b.local;
 let result;
 try{
  b.window=function(x,y,z,w,h,r){
   if(onWindowLine(south,x,z)&&y>f.properties.height/5)return;
   return window.call(this,x,y,z,w,h,r,'#d8dddb');
  };
  // Only the generic per-window dormitory pier/balcony blocks use this
  // ground-based local transform. Keep the roof, plinth and eave transforms.
  b.local=function(x,y,z,r,fn){if(y===0&&edges.some(e=>onWindowLine(e,x,z)))return;return local.call(this,x,y,z,r,fn);};
  result=A.footprint(b,f,(key,g,col,mat,id)=>add(key,g,key.startsWith('v30-walls-')?'#c5d0cf':col,key.startsWith('v30-walls-')?29:mat,id),{key:'building152-v46',floors:5});
 }finally{b.window=window;b.local=local;}
 const fh=(result.bodyHeight-.55)/5,width=south.len-.24,r=Math.atan2(south.nx,south.nz),panes=Math.round(width/1.05),step=width/panes;
 b.id=f.properties.pickId;
 b.local((south.a[0]+south.c[0])/2,0,(south.a[1]+south.c[1])/2,r,()=>{
  for(let floor=1;floor<5;floor++){
   const lo=.55+fh*floor,spandrel=fh*.22,glassHeight=fh-spandrel-.08,gy=lo+spandrel+glassHeight/2;
   b.mesh('building152-south-glass',b.geo('box',Y.Geo.box),0,gy,.10,width,glassHeight,.12,'#789398',5,.7);
   b.box(0,lo+spandrel/2,.075,width,spandrel,.15,'#c9d4d2',29);
   for(const y of [lo+spandrel,lo+fh-.08])b.box(0,y,.19,width,.075,.09,'#e0e4e1',9);
   b.box(0,gy+glassHeight*.24,.19,width,.055,.085,'#e0e4e1',9);
   for(let k=0;k<=panes;k++)b.box(-width/2+k*step,gy,.19,.06,glassHeight,.095,'#e0e4e1',9);
   // Fine standing seams belong only to the photographed opaque spandrels.
   for(let k=0;k<panes*2;k++)b.box(-width/2+(k+.5)*step/2,lo+spandrel/2,.158,.018,spandrel,.018,'#acbab9',29);
  }
 });
 return {...result,strategy:'building152-v46',floors:5,heightMeasured:false,displayHeightRetained:true,southGlazedBands:4,southFacadeObserved:true,northPunchedWindowsObserved:true,facadesVerified:false,entranceVerified:false,scope:'dated-five-storey-south-glazing-and-metal-cladding; retained-display-envelope; other-window-spacing-fitted'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building152={id:ID,render};
})(YY);
