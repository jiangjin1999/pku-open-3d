/* Dormitory 45 A only: north-up six-storey plan and independent flat L footprint. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/272303337';
const O=[-394.198,407.286],R=Math.atan2(2.055,56.477),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#bdc0b7',frame:'#dce0d5',glass:'#788b88',roof:'#999e93',stone:'#acb2a6',door:'#526762'};
const H={floor:3.2,wall:19.2},entrances=[
{name:'main-north',u:25.44,v:15.115,face:'court-north',axis:0,outward:-1,width:3.6,sill:.45},
{name:'north-safety',u:53.51,v:15.115,face:'court-north',axis:0,outward:-1,width:2.0,sill:.3},
{name:'south-stair-west',u:22.32,v:30.84,face:'south',axis:0,outward:1,width:1.9,sill:.3},
{name:'south-stair-east',u:50.57,v:30.84,face:'south',axis:0,outward:1,width:1.9,sill:.3},
{name:'east-side',u:70.692,v:20.20,face:'east-outer',axis:1,outward:1,width:1.8,sill:.3},
{name:'east-stair',u:70.697,v:29.25,face:'east-outer',axis:1,outward:1,width:1.6,sill:.3},
{name:'wing-west',u:-.102,v:5.4,face:'west-outer',axis:1,outward:-1,width:1.8,sill:.3},
{name:'wing-east-emergency',u:14.842,v:1.8,face:'west-inner',axis:1,outward:1,width:1.8,sill:.3}
];
const basementService={direction:'southeast',separateFromDormitoryMain:true,exactPortalUnverified:true,constructionUnverified:true};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'044-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('044-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 // Both official plans are north-up; upper room divisions map only this building.
 const map=x=>(x-105)/(1742-105)*70.698,cells=(xs,ratio=.65)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const south=cells([298,374,449,526,603,681,757,834,910,984,1060,1136,1212,1288,1364,1438,1514,1590,1666,1742].map(map));
 const court=cells([478,526,603,681,757,834,910,984,1060,1136,1212,1288,1364,1438,1514,1590,1666,1742].map(map));
 const sideRooms=cells([0,3.73,7.48,11.21,14.95,18.68,22.4,25.8,28.8,30.84]);
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal&&mv>30.5){face='south';source=south;}
 else if(horizontal&&mv>15.0&&mv<15.3){face='court-north';source=court;}
 else if(horizontal&&mv<.2){face='wing-north';source=cells([Math.min(la[0],lc[0]),(la[0]+lc[0])/2,Math.max(la[0],lc[0])],.18);}
 else if(!horizontal){face=mx<1?'west-outer':mx<20?'west-inner':'east-outer';source=sideRooms;}
  const balconyCell=(mid)=>face==='south'&&!((mid>map(681)&&mid<map(757))||(mid>map(1364)&&mid<map(1438)))||face==='west-outer'&&mid>3.73&&mid<18.68||face==='west-inner'&&mid<14.95;
  const balconies=source.filter(([s,e])=>balconyCell((s+e)/2)).map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,a=(s-la[ax])/d*len,b=(e-la[ax])/d*len;return[Math.max(.08,Math.min(a,b)),Math.min(len-.08,Math.max(a,b))];}).filter(([s,e])=>e-s>.6);
  const firstMap=x=>(x-147)/(1729-147)*70.698;
  const groundBands=face==='south'?[[327,609],[754,1244],[1384,1664]].map(([s,e])=>[firstMap(s),firstMap(e)]):face==='west-outer'?[[7.48,18.68]]:face==='west-inner'?[[3.73,14.95]]:[];
  const groundBalconies=groundBands.map(([s,e])=>{const ax=horizontal?0:1,d=horizontal?du:dv,a=(s-la[ax])/d*len,b=(e-la[ax])/d*len;return[Math.max(.08,Math.min(a,b)),Math.min(len-.08,Math.max(a,b))];}).filter(([s,e])=>e-s>.6);
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[Math.max(.12,mid-w/2),Math.min(len-.12,mid+w/2),mid];}).filter(([s,e,mid])=>mid>0&&mid<len&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
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
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.14,.025,len,.12,.16,C.frame,24);
   }
   b.box(len/2,H.wall+.04,.035,len,.16,.18,C.frame,24);
  }));
 }
 // Landings meet the exact door sill; adjacent short steps overlap rather than leaving seams.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{
 const w=q.width,s=q.outward,n=Math.round(q.sill/.15),depth=q.name==='main-north'?1.15:.72;
 if(q.axis===0){b.box(q.u,q.sill/2,q.v+s*(depth/2-.03),w+.3,q.sill,depth+.08,C.stone,24);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u,h/2,q.v+s*(depth+.19+k*.38),w+.3,h,.39,C.stone,24);}}
 else{b.box(q.u+s*(depth/2-.03),q.sill/2,q.v,depth+.08,q.sill,w+.3,C.stone,24);for(let k=0;k<n;k++){const h=.15*(n-k);b.box(q.u+s*(depth+.19+k*.38),h/2,q.v,.39,h,w+.3,C.stone,24);}}
 } );});
 // Official 2026 text locates a basement service access southeast but gives no surveyed door/stair form.
 // Keep it separate in metadata; do not invent a second ground-floor door or a basement stair beneath shared terrain.
 return{strategy:'building044-v46',floors:6,sourceOutline:true,flatLRoof:true,northDormitoryMain:true,groundPlanExits:entrances.length,upperRoomBalconies:true,groundOutsideBands:true,balconyAppearanceVerified:false,basementServiceSeparate:true,basementPortalModeled:false,facadeVerified:false,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building044={id:ID,render,world,local,pieces,heights:H,entrances,basementService};
})(YY);
