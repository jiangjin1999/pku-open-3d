/* 45-number dormitory only. Six own floor plans, independent low southwest hall. */
(function(Y){'use strict';
const F=Y.Footprints,A=Y.Architecture30,previous=A.render,ID='way/272303341';
const O=[-394.574,451.81],R=Math.atan2(.544,12.768),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.2,wall:19.2,hall:3.3};
const C={wall:'#bdc0b7',frame:'#dce0d5',glass:'#788b88',roof:'#999e93',stone:'#acb2a6',door:'#526762'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const planX=x=>12.783+(x-353)/(1842-353)*(76.971-12.783),wingY=y=>(y-397)/(790-397)*16.971;
const entrances=[{name:'unit-west',u:planX(707),v:24.798,width:2.4,sill:.3},{name:'unit-east',u:planX(1490),v:24.789,width:2.4,sill:.3},{name:'southwest-hall',u:6.22,v:24.802,width:3.8,sill:.45}];
const stairBays=[[659,755],[1442,1539]].map(([s,e])=>[planX(s),planX(e)]);
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'046-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 const cells=xs=>xs.slice(1).map((e,i)=>[xs[i],e]);
 const south=cells([353,435,512,589,667,747,825,903,981,1060,1141,1219,1297,1372,1450,1532,1610,1688,1766,1842].map(planX));
 const north=cells([353,435,512,589,659,755,824,901,980,1060,1141,1219,1297,1372,1442,1539,1608,1685,1764,1842].map(planX));
 const west=cells([397,478,556,631,709,790].map(wingY));
 const inner=cells([397,478,556,631,677].map(y=>(y-397)/(677-397)*11.548));
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
 add('046-source-roof',F.surface(f.geometry,H.wall),C.roof,24,id);
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2,len=Math.hypot(c[0]-a[0],c[1]-a[1]);let name='return',source=[];
  if(horizontal&&mv>24){name='south';source=south;}
  else if(horizontal&&mv>11&&mv<12){name='court-north';source=north.filter(([s,e])=>!stairBays.some(([a,b])=>(s+e)/2>a&&(s+e)/2<b));}
  else if(horizontal&&mv<.1){name='wing-north';source=[[5.5,7.3]];}
  else if(!horizontal){name=mx<1?'wing-west':mx<20?'wing-east':'east';source=name==='wing-west'?west:name==='wing-east'?inner:[[11.548,16.8],[16.8,19],[19,24.785]];}
  const ax=horizontal?0:1,d=horizontal?du:dv,positions=source.map(([s,e])=>{const t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*.60;return{s:Math.max(.12,mid-w/2),e:Math.min(len-.12,mid+w/2),mid,original:(s+e)/2};}).filter(q=>q.mid>0&&q.mid<len&&q.e-q.s>.4);
  facade(a,c,name,(floor)=>{let qs=positions.map(q=>({...q}));
   if(name==='wing-west')qs=qs.flatMap(q=>q.original>wingY(478)?[{...q,e:q.s+.78,door:true},{...q,s:q.s+.88}]:[q]);
   if(floor===0&&name==='south')for(const door of entrances.slice(0,2)){const x=(door.u-la[0])/du*len,s=x-door.width/2,e=x+door.width/2;qs=qs.filter(q=>q.e<s-.1||q.s>e+.1);qs.push({s,e,door:true});}
   return qs;
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  // West-wing outside strip is present on all six own plans, except the north end room.
  group('wing-balconies',()=>{const s=wingY(478),e=16.971,w=e-s;
   for(let floor=0;floor<6;floor++){const y=floor*H.floor+(floor===0?.3:.12);b.box(-.50,y-.08,(s+e)/2,1.18,.16,w,C.stone,24);b.box(-1.04,y+1,(s+e)/2,.06,.06,w,C.frame,6);
    for(let v=s;v<e+.1;v+=.7)b.box(-1.04,y+.52,Math.min(v,e),.05,1,.05,C.frame,6);
    for(const v of [s,e])b.box(-.5,y+.52,v,1.18,1,.06,C.wall,24);
   }
  });
  // A low southwest hall fills only the first-floor extension, leaving all five upper levels empty.
  group('southwest-hall',()=>{const u0=.004,u1=12.45,v0=16.95,v1=24.802,door=entrances[2],s=door.u-door.width/2,e=door.u+door.width/2;
   b.box((u0+u1)/2,H.hall,(v0+v1)/2,u1-u0,.16,v1-v0,C.roof,24);
   b.box(u0,H.hall/2,(v0+v1)/2,.08,H.hall,v1-v0,C.wall,24);
   for(const [l,r] of [[u0,s],[e,u1]])b.box((l+r)/2,H.hall/2,v1,r-l,H.hall,.08,C.wall,24);
   b.box(door.u,.225,v1,door.width,.45,.08,C.stone,24);b.box(door.u,3.14,v1,door.width,.32,.08,C.wall,24);
   b.box(door.u,1.7,v1-.25,door.width,2.5,.05,C.door,5);
   for(const x of [s,door.u,e])b.box(x,1.7,v1-.2,.05,2.5,.08,C.frame,6);
   for(const y of [.45,2.95])b.box(door.u,y,v1-.2,door.width,.05,.08,C.frame,6);
  });
  for(const q of entrances)group('entrance-'+q.name,()=>{const d=q.name==='southwest-hall'?1.5:.8;b.box(q.u,q.sill/2,q.v+d/2-.02,q.width+.3,q.sill,d+.06,C.stone,24);const n=Math.round(q.sill/.15);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u,h/2,q.v+d+.18+k*.36,q.width+.3,h,.37,C.stone,24);}});
 });
 // Two stair heads project north in all six plans; no ground entrance is added beneath them.
 for(const [s,e] of stairBays){const v=10.48;facade(world(e,v),world(s,v),'north-stair',()=>[{s:.65,e:e-s-.65}]);
  b.local(O[0],0,O[1],R,()=>group('north-stair-sides',()=>{for(const u of [s,e])b.box(u,H.wall/2,(v+11.55)/2,.08,H.wall,11.55-v,C.wall,24);b.box((s+e)/2,H.wall,(v+11.55)/2,e-s,.12,11.55-v,C.roof,24);}));
 }
 return{strategy:'building046-v46',floors:6,estimatedHeight:true,sourceOutline:true,lowSouthwestHall:true,southUnitEntrances:2,groundPlanEntrances:3,westWingBalconies:true,northStairProjections:2,fullFacadeVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building046={id:ID,render,world,local,heights:H,entrances,stairBays};
})(YY);
