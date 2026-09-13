/* Zhihua V39. Photo/plan/section reconstruction in local east/south metres.
   FEI Architects: 2023 completed building, photographs by Tian Fangfang/Jiaozi.
   Exterior flat auditorium roof is distinct from the internal vaulted ceiling.
   Unseen dimensions are approximate. No inferred windows on the blank end walls. */
(function(Y){'use strict';const G=Y.Geo,PI=Math.PI,R=.0467;
const C={wall:'#e8ddc6',pier:'#eee3ce',frame:'#706052',glass:'#8a9da3',roof:'#a7aaa1',stone:'#c7c7bb',white:'#e2e6df'};
function box(b,key,x,y,z,w,h,d,col=C.wall,mat=24){b.mesh('zh38-'+key,b.geo('zh38-box',G.box),x,y,z,w,h,d,col,mat);}
const parts=Y.Districts37.zhihuaParts.map(p=>({...p,rect:[...p.rect],h:p.key==='auditorium'?11.1:p.key==='east-foyer'?10.9:p.h}));
parts.push({key:'east-north-connection',rect:[17.4,-24.5,25.55,-17.65],h:8.15,base:3.95},{key:'east-south-connection',rect:[17.4,11.75,20.1,22.2],h:8.15});
function block(b,p){const[x0,z0,x1,z1]=p.rect,x=(x0+x1)/2,z=(z0+z1)/2,w=x1-x0,d=z1-z0,h=p.h,tone=p.key==='east-foyer'?C.white:C.wall;
 const base=p.base||.15;
 box(b,p.key+'-wall',x,(h+base)/2,z,w,h-base,d,tone,p.key==='east-foyer'?36:35);
 box(b,p.key+'-flat-roof',x,h+.025,z,w-.18,.08,d-.18,C.roof);
 for(const s of[-1,1]){box(b,p.key+'-parapet',x+s*(w/2-.12),h+.14,z,.24,.30,d,tone);box(b,p.key+'-parapet',x,h+.14,z+s*(d/2-.12),w,.30,.24,tone);}
 if(!p.base)box(b,p.key+'-plinth',x,.20,z,w+.06,.22,d+.06,'#c3c3b5');
}
function win(b,x,y,z,w,h,r=0,{narrow=false,tall=false,blind=false,door=false}={}){b.local(x,y,z,r,()=>{
 box(b,'window-reveal',0,0,.025,w+.15,h+.15,.12,'#9a9282');
 box(b,'window-glass',0,0,.103,w-.13,h-.13,.045,C.glass,28);
 for(const q of[-1,1]){box(b,'window-frame',q*(w/2-.04),0,.16,.08,h,.12,C.frame,29);box(b,'window-frame',0,q*(h/2-.04),.16,w,.08,.12,C.frame,29);}
 if(!narrow&&!tall){
  // Broad fixed centre pane, narrow opening side lights and a shallow upper transom.
  for(const x of[-w*.32,w*.32])box(b,'window-mullion',x,0,.17,.06,h-.12,.11,C.frame,29);
  box(b,'window-transom',0,h*.24,.17,w-.10,.06,.12,C.frame,29);
 }else if(door){box(b,'door-centre-mullion',0,0,.17,.06,h,.12,C.frame,29);box(b,'door-toplight',0,h*.27,.17,w,.06,.12,C.frame,29);}
 else{box(b,'window-transom',0,-h*.22,.17,w-.10,.055,.11,C.frame,29);if(narrow)box(b,'window-mullion',0,h*.15,.17,.055,h*.67,.10,C.frame,29);}
 if(blind)for(let i=0;i<7;i++)box(b,'interior-blind',0,h*.11-i*.085,.133,w*.53,.015,.012,'#a7afa7',24);
 box(b,'window-sill',0,-h/2-.045,.13,w+.18,.085,.31,'#d7cfbc');
});}
function grid(b,x,z,r,w,h,floors,bays,{first=2.2,fh=3.9,piers=true,ww,wh=1.9,skipGroundCentre=false}={}){b.local(x,0,z,r,()=>{
 const step=w/bays;for(let i=0;i<bays;i++)for(let f=0;f<floors;f++)if(!(skipGroundCentre&&f===0&&i===Math.floor(bays/2)))win(b,-w/2+(i+.5)*step,first+f*fh,.055,ww||step*.68,wh,0,{blind:(i+f)%4===1});
 if(piers){for(let i=0;i<=bays;i++)box(b,'facade-pier',-w/2+i*step,h/2,.30,.40,h,.62,C.pier);box(b,'facade-head',0,h-.37,.31,w+.40,.74,.65,C.pier);}
});}
function letters(b,text,x,y,z,size=.94,r=0){b.local(x,0,z,r,()=>{for(const[i,ch]of[...text].entries())b.lettering(ch,0,y-i*size*1.32,.08,size,size,0,'#8b8c82');});}
function joints(){} // Joint shading uses physical-scale materials 35/36, without shadow-casting strips.
function flight(b,key,x,z,start,dir){
 const run=7.8,rise=2.48,w=1.72,n=16,y0=.16+start*rise;
 // Stairs have a thin sloping underside and an open void below, not solid wedges.
 b.local(x,y0,z,dir,()=>{
  for(let i=0;i<n;i++)box(b,key+'-tread',0,rise*(i+.5)/n,run/2-(i+.5)*run/n,w,.18,run/n+.02,C.stone);
  const slab=b.geo(key+'-slab',()=>{const g=new G.Geometry();for(const xx of[-w/2,w/2])g.quad([xx,-.15,run/2],[xx,.03,run/2],[xx,rise+.03,-run/2],[xx,rise-.15,-run/2]);g.quad([-w/2,-.15,run/2],[-w/2,rise-.15,-run/2],[w/2,rise-.15,-run/2],[w/2,-.15,run/2]);return g;});b.mesh(key+'-slab',slab,0,0,0,1,1,1,C.wall,24);
  for(const side of[-1,1]){const xx=side*(w/2+.055),t=.11;const g=b.geo(key+'-parapet-'+side,()=>{const g=new G.Geometry();for(const dx of[-t,t])g.quad([xx+dx,.01,run/2],[xx+dx,.9,run/2],[xx+dx,rise+.9,-run/2],[xx+dx,rise+.01,-run/2]);g.quad([xx-t,.9,run/2],[xx+t,.9,run/2],[xx+t,rise+.9,-run/2],[xx-t,rise+.9,-run/2]);return g;});b.mesh(key+'-parapet-'+side,g,0,0,0,1,1,1,C.wall,24);}
 });
}
function escapeStair(b,x,z,side){
 // Three alternating flights reach the low exterior landing, mirrored at the two ends.
 for(let k=0;k<3;k++){
  const xx=x+(k%2===0?2.0:.15),r=(k%2===0?side:-side)>0?0:PI;
  flight(b,'escape-'+side+'-'+k,xx,z,k,r);
  const zz=z+(r===0?-1:1)*4.6,level=.16+(k+1)*2.48;
  box(b,'escape-landing',x+1.05,level-.03,zz,4.0,.24,1.5,C.wall);
  box(b,'escape-landing-parapet',x+3.08,level+.43,zz,.20,.93,1.7,C.wall);
 }
}
function planting(b){
 // East forecourt: ground-level lawns, central deck, paths and slim deciduous trees.
 for(const z of[-10,8]){box(b,'east-lawn',35.4,.13,z,14.2,.07,13.5,'#91ab66',0);box(b,'east-low-retaining-wall',29.3,.35,z, .23,.50,13.5,C.white);}
 box(b,'east-deck',36,.21,-2.1,13.2,.10,3.2,'#bca383',20);
 for(const z of[-18.8,17.1])box(b,'east-path',36,.14,z,16,.1,2.8,'#c9c5b7',26);
 for(const z of[-21.4,20.0]){box(b,'east-hedge',31.3,.45,z,9.7,.65,.85,'#71894d',3);}
 for(const [x,z,h,wide]of[[42,-13.5,12.4,1],[43,-3.2,15,.6],[43,12.3,13.8,1.05],[32.8,-15.4,9.3,.65]]){
  b.local(x,0,z,0,()=>{
   b.mesh('zh38-tree-trunk',b.geo('zh38-trunk',()=>G.cylinder(10,.63)),0,.17,0,.16,h*.85,.16,'#92907a',6);
   for(let k=0;k<10;k++){const y=h*(.33+k*.059),a=k*2.399,rr=wide*(.8+Math.sin(k/10*PI)*1.3);b.beam([0,y-.5,0],[Math.cos(a)*rr,y+.7,Math.sin(a)*rr],.065,'#8c8870',6);}
   for(let tone=0;tone<3;tone++){
    const key='zh38-leaves-'+h+'-'+wide+'-'+tone,g=b.geo(key,()=>{const g=new G.Geometry(),rnd=Y.M.rng(Math.round(h*311+tone*93));for(let j=0;j<180;j++){const t=rnd(),y=h*(.34+t*.64),radius=wide*(.3+2.8*Math.pow(Math.sin(t*PI),.60)),a=rnd()*PI*2,rr=radius*Math.sqrt(rnd()),x=Math.cos(a)*rr,z=Math.sin(a)*rr,ang=rnd()*PI*2,sz=.47+rnd()*.34,dx=Math.cos(ang)*sz,dz=Math.sin(ang)*sz;g.quad([x-dx,y-sz*.63,z-dz],[x+dx,y-sz*.63,z+dz],[x+dx,y+sz*.63,z+dz],[x-dx,y+sz*.63,z-dz]);}return g;});b.mesh(key,g,0,0,0,1,1,1,['#799551','#8fa760','#648542'][tone],16);
   }
  });
 }
 // Small planting boxes flank the east stair bases without blocking paths.
 for(const z of[-24,25]){box(b,'flower-box',43,.38,z,2.6,.6,.8,'#805d43',20);box(b,'flower-box-leaves',43,.79,z,2.5,.35,.76,'#7d9a55',3);}
}
function model(b){
 for(const p of parts)block(b,p);
 for(const[z,r,w,x]of[[-36.68,PI,42.7,-1.85],[-21.60,0,41.35,-.38],[36.48,0,48.3,.05],[20.91,PI,44.3,1.95]])grid(b,x,z,r,w,16.45,4,10);
 // End volumes: glazed returns face inward; outward west/east end walls are blank.
 for(const[x,z,w,r]of[[-30.7,-23.35,15,0],[-30.9,22.54,14.4,PI],[26.95,-24.28,15,0],[31.15,20.82,14.3,PI]])grid(b,x,z,r,w,16.45,4,3,{ww:3.0});
 for(const[x,z,w,r]of[[-30.7,-34.59,15,PI],[-30.9,34.86,14.4,0],[26.95,-34.25,15,PI],[31.15,33.66,14.3,0]])grid(b,x,z,r,w,16.45,4,3,{ww:2.8,skipGroundCentre:x===26.95});
 // Four blank west-facing panels selected in comments 3--6; only narrow edge windows.
 joints(b,-38.44,-28.95,-PI/2,11.05,16.45);joints(b,-38.52,28.7,-PI/2,12.1,16.45);
 joints(b,-28.35,-19.45,-PI/2,8.0,16.45);joints(b,-28.25,17.72,-PI/2,9.65,16.45);
 b.local(-28.4,0,-19.45,-PI/2,()=>{for(let f=0;f<4;f++)for(const edge of[-3.15,3.15])win(b,edge,2.2+f*3.9,.02,1.12,1.9,0,{narrow:true});});
 b.local(-28.3,0,17.72,-PI/2,()=>{for(let f=0;f<4;f++)for(const edge of[-4.02,4.02])win(b,edge,2.2+f*3.9,.02,1.10,1.9,0,{narrow:true});});
 // Five-storey west entrance bar: pronounced piers, top lights, broad central panes.
 b.local(-29.60,0,-1.275,-PI/2,()=>{
  grid(b,0,0,0,28.35,20.5,4,7,{first:6.15,fh:3.85,ww:3.12,wh:2.05});
  for(let i=0;i<7;i++)win(b,-12.15+i*4.05,2.51,.13,3.55,3.15,0,{door:true});
  box(b,'west-canopy',0,4.27,1.55,29.55,.28,3.45,'#ddd6c5');
  for(const x of[-12.12,-8.08,-4.04,0,4.04,8.08,12.12])box(b,'west-entry-column',x,2.42,2.81,.27,3.0,.35,C.pier);
  box(b,'west-entry-platform',0,.45,2.2,29.55,.9,4.4,C.stone);
  for(let i=0;i<6;i++)box(b,'west-long-stair',0,.075*(i+1),6.18-i*.34,29.55,.15*(i+1),.37,C.stone);
  for(const x of[-9.3,9.3]){box(b,'west-planter',x,.99,4.2,7.7,.58,1.05,C.white);box(b,'west-planter-foliage',x,1.38,4.2,7.55,.37,.95,'#6e8651',3);}
 });
 grid(b,-20.95,-1.275,PI/2,28.35,20.28,4,7,{first:6.15,fh:3.85,ww:3.12,wh:2.05,piers:false});
 letters(b,'智华楼',-28.49,13.65,-20.35,1.08,-PI/2);
 letters(b,'数学科学学院',-38.63,14.5,27.25,.76,-PI/2);
 // East hall: white tiled wall, two real window levels and the missing upper sign band.
 b.local(25.67,0,-2.95,PI/2,()=>{
  joints(b,0,0,0,29.4,10.9,{tile:true});
  const bays=[-12.3,-8.8,-5.3,-1.8,1.8,5.3,8.8,12.3];
  for(const [i,x]of bays.entries()){
   if(i>=2&&i<=5){win(b,x,4.15,.085,1.91,6.65,0,{tall:true});box(b,'east-window-spandrel',x,4.08,.27,1.79,.55,.08,'#53655f',28);}
   else for(const y of[2.36,6.02])win(b,x,y,.085,1.83,2.92,0,{narrow:true});
  }
  box(b,'east-upper-sign-band',0,9.54,.065,29.4,2.69,.20,C.white,36);
  b.local(0,8.20,.19,0,()=>joints(b,0,0,0,29.4,2.7,{tile:true}));
  for(const x of[-12.4,-8.9,8.9,12.4])win(b,x,9.72,.21,1.60,.73,0,{tall:true});
  b.lettering('数学科学学院',0,9.44,.34,12.8,1.18,0,'#777e77');
 });
 // North is a second-floor bridge; its ground passage must remain open.
 b.local(25.69,0,-21.075,PI/2,()=>{for(const x of[-1.7,1.7])win(b,x,6.15,.075,2.5,3.05,0,{narrow:true});});
 // South connector is recessed from the hall, revealing facing side entrances.
 b.local(20.22,0,16.97,PI/2,()=>{for(const y of[2.38,6.15])for(const x of[-2.61,2.61])win(b,x,y,.075,3.86,3.05,0,{door:y<3,narrow:true});});
 function smallDoor(key,x,z,r,w=1.55){b.local(x,0,z,r,()=>{
  box(b,key+'-door-reveal',0,1.42,.065,w+.25,2.74,.14,'#706b60');
  win(b,0,1.42,.15,w,2.64,0,{door:true,narrow:true});
  box(b,key+'-threshold',0,.13,.36,w+.36,.15,.72,C.stone);
 });}
 smallDoor('south-hall-side',23.0,11.79,0,1.75);
 smallDoor('south-wing-side',23.0,20.86,PI,1.75);
 smallDoor('north-annex-entry',26.95,-34.31,PI,1.85);
 smallDoor('north-court-rear',-21.00,-19.45,PI/2);
 smallDoor('south-court-rear',-20.15,17.72,PI/2);
 // Blank east wing ends with the correctly placed upright north-end name.
 joints(b,34.68,-29.28,PI/2,9.75,16.45);joints(b,38.44,27.25,PI/2,12.6,16.45);
 letters(b,'智华楼',34.86,14.8,-26.55,.88,PI/2);
 escapeStair(b,35.1,-29.2,-1);escapeStair(b,38.85,27.0,1);
 planting(b);
 return{parts:parts.length,westFloors:5,wingFloors:4,eastHallFloors:2,eastConnections:2,flatAuditorium:true,escapeFlights:6,forecourtTrees:4};
}
function render(b,f){if(f.properties.id!=='way/445012606')return null;const old=[b.origin,b.rotation,b.id,b.anim],p=f.properties;b.origin=[p.centre[0],0,p.centre[1]];b.rotation=R;b.id=p.pickId;b.anim=0;try{return{id:p.id,strategy:'zhihua38-photo-model',...model(b)};}finally{[b.origin,b.rotation,b.id,b.anim]=old;}}
Y.Zhihua38={render,parts,window:win};
})(YY);
