/* Shaoyuan 3 entrance only, fitted to PKU's 2022 photograph with a visible 3 plaque.
 * Local +z faces out of the doorway; this is NOT a geographic bearing.
 * No campus ID, origin, full building outline, or registration is assigned here.
 * Dimensions are proportional estimates, not measurements. See review.md. */
(function(Y){'use strict';
const C={stone:'#c3c1b3',joint:'#62675d',metal:'#d2d9d6',glass:'#718888',step:'#a4aaa4',brick:'#947c6d'};
const D=Object.freeze({doorWidth:2.76,doorBottom:.42,doorTop:3.11,porchWidth:5.32,columnX:2.38,columnDepth:1.58,canopyBottom:3.70,canopyTop:3.98,platformFront:2.10});
function render(b){
 const add=b.e.add;let part='shell';b.e.add=function(k,...args){return add.call(this,'061-entry-'+part+'-'+k,...args);};
 const group=(p,fn)=>{const old=part;part=p;try{fn();}finally{part=old;}};
 const box=(x,y,z,w,h,d,c=C.stone,m=24)=>b.box(x,y,z,w,h,d,c,m);
 const tube=(a,c,r=.025)=>b.beam(a,c,r,C.metal,9);
 try{
  group('steps',()=>{
   // Two lower treads lead up to the platform. Total stair run remains fitted.
   box(0,.07,1.36,5.76,.14,3.40,C.step,21);
   box(0,.21,1.13,5.64,.14,2.94,C.step,21);
   box(0,.35,.87,5.52,.14,2.46,C.step,21);
   for(const [z,y]of[[3.06,.14],[2.60,.28],[2.10,.42]]){
    box(0,y-.015,z,5.52,.03,.035,'#bbc0b9',21);
    for(let x=-2.1;x<2.6;x+=.72)box(x,y-.07,z+.003,.007,.13,.008,'#838b84',24);
   }
  });
  group('wall',()=>{
   // Separate side panels and a lintel keep the entire doorway open.
   for(const side of[-1,1])box(side*2.02,2.06,-.14,1.28,3.28,.28);
   box(0,3.405,-.14,2.76,.59,.28);
   for(const side of[-1,1]){
    for(const y of[.88,1.53,2.18,2.83])box(side*2.02,y,.008,1.28,.022,.016,C.joint);
    box(side*1.68,2.04,.01,.012,3.20,.018,'#989c8e');
   }
   for(let x=-2.55;x<2.65;x+=.24)box(x,3.415,.013,.018,.55,.016,C.joint);
  });
  group('door-frame',()=>{
   for(const x of[-1.43,1.43])box(x,1.80,.085,.10,2.87,.20);
   box(0,3.19,.085,2.96,.15,.20);
   const y=(D.doorBottom+D.doorTop)/2,h=D.doorTop-D.doorBottom;
   for(const x of[-1.36,-.94,0,.94,1.36])box(x,y,.075,.06,h,.075,C.metal,9);
   for(const q of[D.doorBottom+.04,D.doorTop-.04])box(0,q,.075,2.76,.08,.075,C.metal,9);
   for(const x of[-.47,.47])box(x,D.doorBottom+.15,.082,.90,.20,.065,C.metal,9);
  });
  group('glass',()=>{
   const y=(D.doorBottom+D.doorTop)/2;
   for(const [x,w]of[[-1.15,.36],[-.47,.88],[.47,.88],[1.15,.36]]){
    box(x,y,.035,w,D.doorTop-D.doorBottom-.13,.025,C.glass,5);
    box(x,1.69,.055,w,.11,.012,'#afbab1',24);
   }
  });
  group('handles',()=>{
   for(const x of[-.13,.13]){
    tube([x,1.18,.205],[x,1.91,.205],.018);
    for(const y of[1.25,1.84])tube([x,y,.08],[x,y,.205],.016);
   }
  });
  group('canopy',()=>{
   box(0,(D.canopyTop+D.canopyBottom)/2,.83,5.68,D.canopyTop-D.canopyBottom,2.22);
   for(const x of[-D.columnX,D.columnX])box(x,(.42+D.canopyBottom)/2,D.columnDepth,.36,D.canopyBottom-.42,.38);
   for(const x of[-D.columnX,D.columnX])box(x,3.49,.70,.36,.42,1.88);
  });
  group('left-railing',()=>{
   // One-sided rail: no mirrored right rail is supported by this photograph.
   const x=-2.52,top=1.47;
   for(const z of[.35,1.36,2.00]){
    tube([x,.43,z],[x,top,z]);
    b.cyl(x,.423,z,.068,.035,C.metal,16,1,9);
   }
   for(const y of[top,.96,.64])tube([x,y,.32],[x,y,1.90]);
   // Rounded returns in the y/z plane, matching the bent round tube.
   for(const [cy,cz,r,a0,a1]of[[1.35,1.90,.12,0,Math.PI/2],[1.09,1.90,.12,Math.PI/2,Math.PI]]){
    let prev=null;for(let i=0;i<=12;i++){const a=a0+(a1-a0)*i/12,p=[x,cy+Math.cos(a)*r,cz+Math.sin(a)*r];if(prev)tube(prev,p);prev=p;}
   }
   tube([x,1.35,2.02],[x,1.09,2.02]);
   tube([x,.97,1.90],[x,.97,.32]);
   // End return continues vertically; a sloping extension is not visible.
   tube([x,.28,2.02],[x,1.35,2.02]);
  });
  group('plaque',()=>{
   const key='061-entry-number-3';let uv=b.signs.get(key);
   if(!uv){
    // Paint after all existing labels; reading the shared canvas earlier can
    // switch Canvas2D raster backends and change subsequent label pixels.
    const px=0,py=3584,c=b.ctx;
    uv=[px/4096,1-(py+512)/4096,512/4096,512/4096];b.signs.set(key,uv);
    const paint=()=>{
     c.save();c.translate(px,py);c.scale(512/180,512/310);
     c.fillStyle='#eeeede';c.fillRect(0,0,180,310);c.fillStyle='#a65538';c.fillRect(0,69,180,194);
     c.fillStyle='#f3f0e4';c.textAlign='center';c.textBaseline='middle';c.font='180px sans-serif';c.fillText('3',86,165);
     c.font='18px sans-serif';c.fillText('号楼',137,238);c.fillStyle='#4e5148';c.font='14px sans-serif';c.fillText('北京大学勺园',90,38);c.restore();
    };
    if(b.e.setAtlas){const original=b.e.setAtlas;b.e.setAtlas=function(canvas){
     const occupied=canvas.getContext('2d').getImageData(0,1792,256,256).data;
     for(let i=3;i<occupied.length;i+=4)if(occupied[i])throw Error('061 plaque atlas region is already occupied');
     paint();this.setAtlas=original;return original.call(this,canvas);
    };}else paint();
   }
   box(-1.98,2.66,.045,.54,.93,.042,'#d8dbce');
   b.mesh('plane',b.geo('plane',Y.Geo.plane),-1.98,2.66,.071,.53,.92,1,'#ffffff',8,0,0,uv);
  });
 }finally{b.e.add=add;}
 return{component:'shaoyuan3-entrance',localFacing:[0,0,1],worldPosition:null,worldBearing:null,measuredDimensions:false,photoDate:'2022-09-02'};
}
Y.Entrance061={render,dimensions:D};
})(YY);
