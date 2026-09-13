/* Xueyi Dining Hall: own long low hall, south glazed portal and separate east canopy.
   South doorway type is identified in 2026 official photographs; exact offsets and dimensions are fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/372945805';
const O=[-235.014,629.754],R=Math.atan2(3.198,75.702),CO=Math.cos(R),SI=Math.sin(R),W=75.7695,D=18.70,I=.24,M=W/2,Z=D/2;
const H={base:.85,wall:5.90,deck:6.02,parapet:6.34,top:6.50};
const C={brick:'#92958a',white:'#d2d3c7',frame:'#c8cec3',glass:'#637975',roof:'#7b8176',edge:'#a5aa9d',stone:'#b7b8aa',metal:'#939f98',red:'#b6463f'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const entrances=[{name:'south-glazed',side:2,u:M,v:D-I,faceVerified:true,positionVerified:false},{name:'east-canopy',side:1,u:W-I,v:Z,faceVerified:true,positionVerified:false}];
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'053-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 // Roof membrane follows this building's source perimeter. The three low panels are a satellite fit.
 add('053-own-roof-deck',F.surface(f.geometry,H.deck),C.roof,25,id);
 function textSign(key,content,x,y,z,w,h,latin=false){b.sign('053-'+key,x,y,z,w,h,0,true);const uv=b.signs.get('053-'+key+'_true');if(!uv)return;const px=uv[0]*4096,py=(1-uv[1]-uv[3])*4096;b.ctx.clearRect(px,py,512,128);b.ctx.fillStyle=C.red;b.ctx.textAlign='center';b.ctx.textBaseline='middle';b.ctx.font=latin?'600 70px Arial':'600 100px "Kaiti SC","Songti SC",serif';b.ctx.fillText(content,px+256,py+66,495);}
 function glazing(q){const x=q.x,w=q.w,lo=q.lo,hi=q.hi,h=hi-lo,cy=(lo+hi)/2;
  for(const xx of[x-w/2,x+w/2])b.box(xx,cy,-.025,.085,h+.10,.20,C.frame,24);for(const yy of[lo,hi])b.box(x,yy,-.025,w+.12,.09,.20,C.frame,24);
  b.box(x,cy,-.145,w-.07,h-.07,.035,C.glass,5);const splits=q.splits||(q.door?[-w/4,0,w/4]:[-w/6,w/6]);for(const dx of splits)b.box(x+dx,cy,-.08,.043,h-.07,.085,C.frame,24);
  const transom=q.door?3.34:hi-.47;if(transom>lo+.15&&transom<hi-.05)b.box(x,transom,-.07,w-.07,.06,.085,C.frame,24);
  if(!q.door)b.box(x,lo-.07,.05,w+.21,.12,.35,C.edge,24);
 }
 b.local(O[0],0,O[1],R,()=>{
  group('plinth',()=>b.box(M,H.base/2,Z,W-2*I,H.base,D-2*I,C.stone,24));
  group('flat-roof-edges',()=>{for(const z of[.12,D-.12]){b.box(M,6.16,z,W,.36,.24,C.brick,30);b.box(M,6.365,z,W+.05,.08,.35,C.edge,24);}for(const x of[.12,W-.12]){b.box(x,6.16,Z,.24,.36,D-.24,C.brick,30);b.box(x,6.365,Z,.35,.08,D-.20,C.edge,24);}
   for(const x of[W/3,W*2/3])b.box(x,6.065,Z,.16,.085,D-.45,C.edge,24);
  });
  for(let side=0;side<4;side++){const long=side%2===0,width=long?W-2*I:D-2*I,ox=side===1?W-I:side===3?I:M,oz=side===0?I:side===2?D-I:Z,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side];
   b.local(ox,0,oz,rot,()=>group('face-'+side,()=>{
    const panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.07,c-a,hi-lo,.16,C.brick,30);};
    let openings=[];
    if(side===2){const xs=[...Array.from({length:7},(_,i)=>4.0+i*4.70),...Array.from({length:7},(_,i)=>W-4.0-i*4.70)].map(x=>x-M).sort((a,c)=>a-c);for(const x of xs)for(const [lo,hi]of[[1.26,3.26],[3.65,5.47]])openings.push({x,w:2.60,lo,hi});openings.push({x:0,w:5.80,lo:H.base,hi:5.53,door:true});}
    // The service-side lower wall and the unphotographed west end remain conservative fits.
    if(side===0)for(let k=0;k<15;k++)openings.push({x:(k-7)*4.76,w:2.14,lo:4.18,hi:5.47});
    if(side===3)for(const x of[-5.3,0,5.3])for(const [lo,hi]of[[1.26,3.26],[3.65,5.47]])openings.push({x,w:2.60,lo,hi});
    if(side===1)openings.push({x:0,w:4.30,lo:H.base,hi:4.10,door:true,splits:[0]});
    // Split by vertical bands, allowing stacked lights without adding an intermediate floor.
    const levels=[H.base,...openings.flatMap(q=>[q.lo,q.hi]),H.wall].filter((x,i,a)=>a.indexOf(x)===i).sort((a,c)=>a-c);
    for(let k=1;k<levels.length;k++){const lo=levels[k-1],hi=levels[k],active=openings.filter(q=>q.lo<=lo+.0001&&q.hi>=hi-.0001).sort((a,c)=>a.x-c.x);let cursor=-width/2;for(const q of active){panel(cursor,q.x-q.w/2,lo,hi);cursor=q.x+q.w/2;}panel(cursor,width/2,lo,hi);}
    for(const q of openings)glazing(q);
    for(const x of[-width/2+.13,width/2-.13])b.box(x,3.39,.025,.26,5.08,.23,C.white,24);
    b.box(0,5.86,.06,width+.18,.21,.33,C.edge,24);
    if(side===2||side===3){const xs=[...new Set(openings.filter(q=>!q.door).map(q=>q.x))];for(const x of xs)b.box(x,3.455,.05,2.78,.33,.20,C.white,24);}
    if(side===2){group('south-glazed-portal',()=>{
     for(const x of[-3.39,3.39]){b.box(x,3.22,.29,.78,4.74,.68,C.white,24);b.box(x,3.19,.645,.80,.07,.05,C.edge,24);}b.box(0,5.65,.29,7.56,.24,.87,C.white,24);
     // The 2026 caption identifies this windowed entrance as the south door.
     for(const x of[-2.88,0,2.88])b.box(x,3.19,.10,.075,4.68,.15,C.frame,24);b.box(0,3.38,.10,5.82,.095,.15,C.frame,24);
     textSign('south-chinese','学 一 食 堂',0,4.62,.21,5.12,.84);textSign('south-latin','XUE YI SHI TANG',0,3.99,.22,4.90,.60,true);
     b.box(0,5.94,.65,8.05,.23,1.62,C.white,24);b.box(0,6.065,.65,8.05,.035,1.62,C.edge,24);
     b.box(0,H.base/2,.87,7.53,H.base,1.79,C.stone,24);for(let k=0;k<5;k++){const h=.17*(5-k);b.box(0,h/2,1.91+k*.33,7.53,h,.34,C.stone,24);}
    });}
    if(side===1){group('east-canopy-user-confirmed',()=>{
     for(const x of[-2.66,2.66])b.box(x,3.02,.17,1.0,4.34,.42,C.white,24);b.box(0,4.70,.17,6.34,1.20,.42,C.white,24);
     b.box(0,5.38,.74,6.91,.30,1.83,C.white,24);b.box(0,5.555,.74,6.91,.05,1.83,C.edge,24);textSign('east-chinese','学 一 食 堂',0,5.97,1.62,5.45,.70);
     b.box(0,H.base/2,.91,7.34,H.base,1.94,C.stone,24);for(let k=0;k<5;k++){const h=.17*(5-k);b.box(0,h/2,2.00+k*.34,7.34,h,.35,C.stone,24);}
     // The student photograph has thin metal side rails and a central divider.
     for(const x of[-3.12,0,3.12]){const pts=[[x,1.81,.48],[x,1.81,1.54],[x,.99,3.53]];for(let k=1;k<pts.length;k++)b.beam(pts[k-1],pts[k],.025,C.metal,9);for(const [z,y]of[[.53,H.base],[1.52,H.base],[3.50,.17]])b.beam([x,y,z],[x,y+.96,z],.024,C.metal,9);b.beam([x,1.48,1.54],[x,.66,3.53],.018,C.metal,9);}
     b.box(-3.20,4.45,.17,.31,.21,.20,'#4e5d58',24);b.box(-3.20,4.45,.285,.24,.14,.035,'#d9ddcc',24);
    });}
   }));
  }
 });
 return{strategy:'building053-v46',hallFloorsFitted:1,clerestory:true,intermediateSlab:false,lowRoofPanels:3,southDoorTypeVerified:true,southDoorOffsetVerified:false,eastPhotoDirectionVerified:true,allFacadesVerified:false,heightMeasured:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building053={id:ID,render,world,local,W,D,I,H,entrances};
})(YY);
