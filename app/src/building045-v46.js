/* Dormitory 45 B: own six-storey plan, official 19.9m height, independent north-bar L. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/272303338';
const O=[-394.976,382.691],R=Math.atan2(2.22,67.042),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#bdc0b7',frame:'#dce0d5',glass:'#788b88',roof:'#999e93',stone:'#acb2a6',door:'#526762'};
const firstX=x=>7.292+(x-279)/(1684-279)*(74.37-7.292),firstY=y=>-2.364+(y-706)/(1078-706)*(13.883+2.364);
const H={floor:3.28,wall:19.68},entrances=[
{name:'main-south',u:firstX(744),v:13.795,face:'south',axis:0,outward:1,width:3.6,sill:.3},
{name:'east-side',u:74.35,v:firstY(895),face:'east-outer',axis:1,outward:1,width:1.8,sill:.3}
];
const basementService={exactPortalUnverified:true,constructionUnverified:true};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'045-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('045-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 // Both official plans are north-up; upper room divisions map only this building.
 const map=x=>7.292+(x-264)/(1693-264)*(74.37-7.292),cells=(xs,ratio=.65)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const divisions=[264,335,405,476,547,619,693,765,836,907,978,1049,1121,1193,1264,1336,1407,1478,1550,1622,1693];
 const north=cells(divisions.map(map)),south=cells(divisions.filter(x=>x>=476).map(map));
 const wingMap=y=>(y-727)/(1303-727)*24.64;
 const sideRooms=cells([727,799,871,943,1015,1087,1159,1230,1303].map(wingMap));
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal&&mv>13.5&&mv<14.1){face='south';source=south;}
 else if(horizontal&&mv<1){face='north';source=north;}
 else if(horizontal&&mv>24){face='wing-end';source=cells([0,7.4,14.76],.3);}
 else if(!horizontal){face=mx<1?'west-outer':mx<20?'west-inner':'east-outer';source=face==='east-outer'?cells([694,827,873,1015].map(y=>-2.364+(y-694)/(1015-694)*(13.883+2.364)),.45):sideRooms;}
 // North outside strip stops before the east end room; south strip breaks at room *28.
 const balconyCell=mid=>face==='north'&&mid<map(1622)||face==='south'&&!(mid>map(693)&&mid<map(765))||face==='west-outer'&&mid<wingMap(1230)||face==='west-inner'&&mid>wingMap(1043);
 const balconies=source.filter(([s,e])=>balconyCell((s+e)/2)).map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,a=(s-la[ax])/d*len,b=(e-la[ax])/d*len;return[Math.max(.08,Math.min(a,b)),Math.min(len-.08,Math.max(a,b))];}).filter(([s,e])=>e-s>.6);
 // First-floor plan has continuous outside strips and a separate projecting main landing.
 // Treat these as low platforms; the plan does not prove a ground-floor railing or room exit doors.
 const groundBands=face==='north'?[[firstX(279),firstX(1612)]]:face==='south'?[[firstX(469),firstX(674)],[firstX(806),firstX(1612)]]:face==='west-outer'?[[0,21.4]]:face==='west-inner'?[[14.2,24.64]]:[];
 const groundBalconies=[];
 const groundPlatforms=groundBands.map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,a=(s-la[ax])/d*len,b=(e-la[ax])/d*len;return[Math.max(.08,Math.min(a,b)),Math.min(len-.08,Math.max(a,b))];}).filter(([s,e])=>e-s>.6);
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[Math.max(.12,mid-w/2),Math.min(len-.12,mid+w/2),mid];}).filter(([s,e,mid])=>mid>0&&mid<len&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   for(const [s,e] of groundPlatforms)group('ground-platform',()=>b.box((s+e)/2,.15,.32,e-s,.3,1.04,C.stone,24));
   const plainPanel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   // First-floor diagonal foyer bridges the northwest concavity; upper walls keep the raw outline.
   let foyerCut=null;
   if(face==='north'&&Math.abs(mv)<.1&&mx<7.3)foyerCut=[4.5,7.30].map(u=>(u-la[0])/du*len).sort((a,b)=>a-b);
   if(face==='west-inner'&&Math.abs(mx-7.292)<.1&&mv<0)foyerCut=[-2.8,.05].map(v=>(v-la[1])/dv*len).sort((a,b)=>a-b);
   const panel=(x0,x1,y0,y1)=>{if(!foyerCut||y0>=3.03||x1<=foyerCut[0]||x0>=foyerCut[1])return plainPanel(x0,x1,y0,y1);plainPanel(x0,Math.min(x1,foyerCut[0]),y0,y1);plainPanel(Math.max(x0,foyerCut[1]),x1,y0,y1);if(y1>3.03)plainPanel(Math.max(x0,foyerCut[0]),Math.min(x1,foyerCut[1]),3.03,y1);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    {const floorBalconies=floor>0?balconies:groundBalconies,sill=floor>0?.12:.3;openings=openings.flatMap(q=>{if(!floorBalconies.some(([s,e])=>(q.s+q.e)/2>s&&(q.s+q.e)/2<e))return[q];const cut=q.s+Math.min(.78,(q.e-q.s)*.4);return[{...q,e:cut,bottom:base+sill,top:base+2.5,door:true},{...q,s:cut+.10}];});
     for(const [s,e] of floorBalconies)group('balcony-'+floor,()=>{const w=e-s,x=(s+e)/2; b.box(x,base+(floor>0?.04:.15),.24,w,floor>0?.16:.3,1.68,C.stone,24); b.box(x,base+1.1,1.03,w,.07,.07,C.frame,6); b.box(x,base+.55,1.03,w,.05,.06,C.frame,6); const n=Math.max(2,Math.ceil(w/.8));for(let k=0;k<=n;k++)b.box(s+w*k/n,base+.61,1.03,.05,.98,.05,C.frame,6);for(const end of [s,e])b.box(end,base+.63,.23,.07,1.02,1.65,C.wall,24);});
    }
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=Math.max(0,x-door.width/2),e=Math.min(len,x+door.width/2);if(e>s+.15){openings=openings.filter(q=>q.e<s-.12||q.s>e+.12);openings.push({s,e,bottom:door.sill,top:3.03,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:.55;
     // Returns and recessed glazing form real apertures, without extruded continuous corridors.
     for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [q.bottom,q.top])b.box(x,yy,-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.05,x,q.e-.05])b.box(xx,y,-depth+.05,.045,h,.07,C.frame,6);
     for(const yy of [q.bottom+.035,q.top-.035])b.box(x,yy,-depth+.05,w,.055,.07,C.frame,6);
     if(!q.door)b.box(x,base+1.95,-depth+.055,w,.035,.07,C.frame,6);
     
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+H.floor-.06,.025,len,.12,.16,C.frame,24);
   }
   b.box(len/2,H.wall+.11,.035,len,.22,.18,C.frame,24);
  }));
 }
 // Landings meet the exact door sill; adjacent short steps overlap rather than leaving seams.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{
 const w=q.width,s=q.outward,n=Math.round(q.sill/.15),depth=q.name==='main-south'?1.15:.72;
 if(q.axis===0){b.box(q.u,q.sill/2,q.v+s*(depth/2-.03),w+.3,q.sill,depth+.08,C.stone,24);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u,h/2,q.v+s*(depth+.19+k*.38),w+.3,h,.39,C.stone,24);}}
 else{b.box(q.u+s*(depth/2-.03),q.sill/2,q.v,depth+.08,q.sill,w+.3,C.stone,24);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u+s*(depth+.19+k*.38),h/2,q.v,.39,h,w+.3,C.stone,24);}}
 } );});
 // The first-plan diagonal exit is a shallow one-storey foyer, fitted to the existing concave corner.
 // Depth, glazing and short stair dimensions are approximate; no six-floor diagonal shaft is invented.
 group('northwest-foyer',()=>{
  const corner=[[4.5,.02],[7.31,.02],[7.31,-2.8]],ring=corner.map(p=>world(...p));ring.push(ring[0]);
  for(const y of [.3,3.22])add('045-northwest-foyer-cap-'+y,F.surface({type:'Polygon',coordinates:[ring]},y),y<1?C.stone:C.roof,24,id);
  const a=world(7.31,-2.8),c=world(4.5,.02),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),w=2.1;
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{
   for(const x of [(len-w)/4,len-(len-w)/4])b.box(x,1.66,-.035,(len-w)/2,3.32,.07,C.wall,24);
   b.box(len/2,3.13,-.035,w,.38,.07,C.wall,24);b.box(len/2,.15,-.035,w,.3,.07,C.stone,24);
   b.box(len/2,1.62,-.22,w,2.64,.05,C.door,5);
   for(const x of [(len-w)/2,len/2,(len+w)/2])b.box(x,1.62,-.18,.05,2.64,.06,C.frame,6);
   for(const y of [.3,2.94])b.box(len/2,y,-.18,w,.05,.06,C.frame,6);
   b.box(len/2,.15,.35,w+.3,.3,.8,C.stone,24);b.box(len/2,.075,.94,w+.3,.15,.4,C.stone,24);
  });
 });
 // Basement portal remains unresolved; diagonal exit geometry is fitted from the first plan.
 return{strategy:'building045-v46',floors:6,officialHeight:19.9,sourceOutline:true,flatLRoof:true,southDormitoryMain:true,groundPlanExits:entrances.length,upperRoomBalconies:true,groundOutsideBands:true,balconyAppearanceVerified:false,basementPortalModeled:false,northwestDiagonalUnresolved:false,northwestAppearanceVerified:false,facadeVerified:false,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building045={id:ID,render,world,local,pieces,heights:H,entrances,basementService};
})(YY);
