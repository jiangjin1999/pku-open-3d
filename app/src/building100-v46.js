/* 48-building only: six own plans, sixteen south bays, two upper balcony stacks and three ground hall entrances; preserve its own shorter outline. */
(function(Y){'use strict';
const F=Y.Footprints,A=Y.Architecture30,previous=A.render,ID='way/986745071';
const O=[-379.808,581.909],R=Math.atan2(2.521,52.369),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.3,wall:19.8,hall:3.3};
const C={wall:'#bdc0b7',frame:'#dce0d5',glass:'#788b88',roof:'#999e93',stone:'#acb2a6',door:'#606b66'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
// Coordinates read from the 48-building plans in a 1880-pixel-wide view, fitted to its own eight-corner OSM footprint.
const planX=x=>13.050096+(x-466)/(1774-466)*(65.479741-13.050096),wingY=y=>(y-367)/(774-367)*17.085689;
const southV=u=>24.879829+(u-12.50015)/(65.485632-12.50015)*(24.896575-24.879829);
const entrances=[{name:'unit-west',u:planX(832),v:southV(planX(832)),width:1.95,sill:.3},{name:'unit-east',u:planX(1407),v:southV(planX(1407)),width:1.95,sill:.3},{name:'southwest-hall',u:6.25,v:24.879829,width:3.6,sill:.45}];
const stairBays=[[782,883],[1356,1458]].map(([s,e])=>[planX(s),planX(e)]);
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'100-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 const cells=xs=>xs.slice(1).map((e,i)=>[xs[i],e]);
 const south=cells([466,550,629,708,788,875,955,1035,1120,1205,1285,1362,1452,1530,1610,1690,1774].map(planX));
 const north=cells([466,550,629,708,782,883,955,1035,1120,1205,1285,1356,1458,1530,1610,1690,1774].map(planX));
 const west=cells([367,450,531,610,690,774].map(wingY));
 const inner=cells([367,450,531,610,657].map(y=>(y-367)/(657-367)*11.500797));
 // Build wall strips around actual glazing recesses rather than a solid box behind windows.
 function facade(a,c,name,openingsForFloor,floors=6){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+name,()=>{
   const panel=(s,e,y0,y1)=>{if(e>s&&y1>y0)b.box((s+e)/2,(y0+y1)/2,-.035,e-s,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<floors;floor++){const base=floor*H.floor,qs=openingsForFloor(floor,len).sort((a,b)=>a.s-b.s);let cursor=0;
    for(const q of qs){const bottom=base+(q.door?(floor===0?.3:.12):.85),top=base+2.7;
     panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,bottom);panel(q.s,q.e,top,base+H.floor);
     const w=q.e-q.s,h=top-bottom,y=(top+bottom)/2,x=(q.s+q.e)/2,depth=q.door?.30:.5;
     for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [bottom,top])b.box(x,yy,-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.04,x,q.e-.04])b.box(xx,y,-depth+.04,.045,h,.06,C.frame,6);
     for(const yy of [bottom+.035,top-.035])b.box(x,yy,-depth+.04,w,.05,.06,C.frame,6);
     if(!q.door)b.box(x,base+1.93,-depth+.05,w,.035,.06,C.frame,6);
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+H.floor-.06,.025,len,.12,.15,C.frame,24);
   }
   b.box(len/2,floors*H.floor+.1,.025,len,.2,.15,C.frame,24);
  }));
 }
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let level=0;level<6;level++)add('100-floor-'+level,F.surface(f.geometry,level*H.floor+.12),C.stone,24,id);
 add('100-source-roof',F.surface(f.geometry,H.wall),C.roof,24,id);
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2,len=Math.hypot(c[0]-a[0],c[1]-a[1]);let name='return',source=[];
  if(horizontal&&mv>24){name='south';source=south;}
  else if(horizontal&&mv>11&&mv<12){name='court-north';source=north.filter(([s,e])=>!stairBays.some(([a,b])=>(s+e)/2>a&&(s+e)/2<b));}
  else if(horizontal&&mv<.1){name='wing-north';source=[[5.5,7.3]];}
  else if(horizontal&&mv>17&&mv<18){name='wing-south';source=[[5.5,7.3]];}
  else if(!horizontal){name=mx<1?'wing-west':mx<20?(mv>17?'bar-west':'wing-east'):'east';source=name==='wing-west'?west:name==='wing-east'?inner:[[17.4,19.15]];}
  const ax=horizontal?0:1,d=horizontal?du:dv,positions=source.map(([s,e])=>{const t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*.60;return{s:Math.max(.12,mid-w/2),e:Math.min(len-.12,mid+w/2),mid,original:(s+e)/2};}).filter(q=>q.mid>0&&q.mid<len&&q.e-q.s>.4);
  facade(a,c,name,(floor)=>{let qs=positions.map(q=>({...q}));
   if(name==='wing-west')qs=qs.flatMap(q=>q.original>wingY(450)?[{...q,e:q.s+.78,door:true},{...q,s:q.s+.88}]:[q]);
   if(floor===0&&(name==='bar-west'||name==='wing-south'))qs=[];
   if(name==='south')for(const door of entrances.slice(0,2)){const x=(door.u-la[0])/du*len,w=floor===0?door.width:1.35,s=x-w/2,e=x+w/2;qs=qs.filter(q=>q.e<s-.1||q.s>e+.1);qs.push({s,e,door:true});}
   return qs;
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  // West-wing outside strip is present on all six own plans, except the north end room.
  group('wing-balconies',()=>{const s=wingY(450),e=17.085689,w=e-s;
   for(let floor=0;floor<6;floor++){const y=floor*H.floor+(floor===0?.3:.12);b.box(-.50,y-.08,(s+e)/2,1.18,.16,w,C.stone,24);b.box(-1.04,y+1,(s+e)/2,.06,.06,w,C.frame,6);
    for(let v=s;v<e+.1;v+=.7)b.box(-1.04,y+.52,Math.min(v,e),.05,1,.05,C.frame,6);
    for(const v of [s,e])b.box(-.5,y+.52,v,1.18,1,.06,C.wall,24);
   }
  });
  // A low southwest hall fills only the first-floor extension, leaving all five upper levels empty.
  group('southwest-hall',()=>{const u0=-.001541,u1=12.50015,v0=17.085689,v1=24.879829,door=entrances[2],s=door.u-door.width/2,e=door.u+door.width/2;
   b.box((u0+u1)/2,H.hall,(v0+v1)/2,u1-u0,.16,v1-v0,C.roof,24);
   b.box(u0,H.hall/2,(v0+v1)/2,.08,H.hall,v1-v0,C.wall,24);
   for(const [l,r] of [[u0,s],[e,u1]])b.box((l+r)/2,H.hall/2,v1,r-l,H.hall,.08,C.wall,24);
   b.box(door.u,.225,v1,door.width,.45,.08,C.stone,24);b.box(door.u,3.14,v1,door.width,.32,.08,C.wall,24);
   b.box(door.u,1.7,v1-.25,door.width,2.5,.05,C.door,5);
   for(const x of [s,door.u,e])b.box(x,1.7,v1-.2,.05,2.5,.08,C.frame,6);
   for(const y of [.45,2.95])b.box(door.u,y,v1-.2,door.width,.05,.08,C.frame,6);
  });
  group('south-upper-balconies',()=>{for(const q of entrances.slice(0,2))for(let floor=1;floor<6;floor++){
   const y=floor*H.floor+.12,w=3.60,depth=1.18,z=q.v+depth/2;
   b.box(q.u,y-.08,z,w,.16,depth+.02,C.stone,24);
   b.box(q.u,y+1.02,q.v+depth,w,.055,.055,C.frame,6);
   for(const x of [q.u-w/2,q.u+w/2])b.box(x,y+1.02,z,.055,.055,depth,C.frame,6);
   for(let j=0;j<=8;j++)b.box(q.u-w/2+w*j/8,y+.54,q.v+depth,.045,1.02,.045,C.frame,6);
   for(const x of [q.u-w/2,q.u+w/2])for(const zz of [q.v+.22,q.v+.66])b.box(x,y+.54,zz,.045,1.02,.045,C.frame,6);
  }});
  for(const q of entrances)group('entrance-'+q.name,()=>{const d=q.name==='southwest-hall'?1.5:.8;b.box(q.u,q.sill/2,q.v+d/2-.02,q.width+.3,q.sill,d+.06,C.stone,24);const n=Math.round(q.sill/.15);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u,h/2,q.v+d+.18+k*.36,q.width+.3,h,.37,C.stone,24);}});
 });
 // Two stair heads project north in all six plans; no ground entrance is added beneath them.
 for(const [s,e] of stairBays){const v=10.40;facade(world(e,v),world(s,v),'north-stair',()=>[{s:.65,e:e-s-.65}]);
  b.local(O[0],0,O[1],R,()=>group('north-stair-sides',()=>{for(const u of [s,e])b.box(u,H.wall/2,(v+11.500797)/2,.08,H.wall,11.500797-v,C.wall,24);b.box((s+e)/2,H.wall,(v+11.500797)/2,e-s,.12,11.500797-v,C.roof,24);}));
 }
 return{strategy:'building100-v46',floors:6,heightAbout20mIn2025Tender:true,estimatedHeight:true,sourceOutline:true,lowSouthwestHall:true,southUnitEntrances:2,principalPlanEntrances:3,electricalRoomDoors:0,groundPlanEntrances:3,southUpperBalconyStacks:2,southUpperBalconyLevels:5,westWingBalconies:true,northStairProjections:2,fullFacadeVerified:false,currentRenovationVerified:false,planDate:2018};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building100={id:ID,render,world,local,heights:H,entrances,stairBays};
})(YY);
