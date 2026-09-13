/* Dormitories 33/34A/34B: satellite flat roofs, two proven 6F wings and an explicitly unverified east height. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825544';
const O=[-38.064,670.082],R=Math.atan2(2.021,58.809),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#a4aba2',frame:'#ccd1c6',glass:'#657b78',roof:'#7b847d',tile:'#969e93',stone:'#a8afa5',door:'#526762'};
const H={floor:3.1,wall:18.6,eastPlaceholder:17,parapet:.45},entrances=[{number:'33-west',u:8.65,v:15.692,face:'33-south',axis:0,outward:1},{number:'33-middle',u:36.4,v:15.692,face:'33-south',axis:0,outward:1},{number:'33-east-passage',u:48.4,v:11.702,face:'33-passage',axis:0,outward:1,width:1.5},{number:'34A-south',u:9.4,v:64.45,face:'34A-south',axis:0,outward:1},{number:'34B-west',u:42.809,v:32.2,face:'34B-west',axis:1,outward:-1},{number:'34B-east-exit',u:58.855,v:32.2,face:'34B-east',axis:1,outward:1}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'022-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // Satellite-registered roof decks, with the original tiny recesses retained. East elevation is a legacy placeholder.
 const roofSpecs=[{name:'33',box:[-.01,-.01,58.9,15.698],height:H.wall},{name:'34B-placeholder',box:[-.01,15.698,58.9,47.0],height:H.eastPlaceholder},{name:'34A',box:[-.01,47.0,58.9,64.46],height:H.wall}];
 for(const q of roofSpecs){const mesh=new G.Geometry();for(const p of pieces(f,q.box))for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],q.height,p[1])));add('022-flat-roof-'+q.name,mesh,C.roof,2,id);}
 // Close only the vertical height transitions between the fitted wing envelopes.
 const transitions=new G.Geometry();for(const v of [15.698,47.0])for(const p of pieces(f,[0,v-.0001,58.9,v+.0001])){const xs=p.map(p=>p[0]),a=Math.min(...xs),c=Math.max(...xs);transitions.quad(vertex(a,17,v),vertex(c,17,v),vertex(c,18.6,v),vertex(a,18.6,v));}add('022-unverified-height-transition',transitions,C.wall,24,id);
 // Plans give room partitions; ratios and actual elevation window sizes remain fitted.
 const map33=x=>(x-233)/(1610-233)*58.844,mapA=x=>(x-136)/(1730-136)*58.867,cells=(xs,ratio=.70)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const north33=[...cells([233,316,399,480,564,648].map(map33)),...cells([648,730,812,895].map(map33),.38),...cells([895,977,1060,1142,1224,1308,1391,1473,1610].map(map33))];
 const south33=cells([233,316,399,480,564,648,730,812,895,977,1060,1142,1224,1391,1473,1610].map(map33));
 const northA=cells([136,236,336,435,535,635,734,834,933,1033,1133,1232,1332,1432,1531,1631,1730].map(mapA));
 const southA=northA;
 const bRooms=cells([15.698,19.1,22.5,25.9,29.3,35.1,38.5,41.9,47.0]);
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0,edges=[];
 // Split long east edge at roof-zone boundaries so 34B is never accidentally assigned six storeys.
 for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],la=local(a),lc=local(c),ts=[0,1];for(const v of [15.698,47.0]){const t=(v-la[1])/(lc[1]-la[1]);if(t>.00001&&t<.99999)ts.push(t);}ts.sort((a,c)=>a-c);for(let j=1;j<ts.length;j++)edges.push([a.map((x,k)=>x+(c[k]-x)*ts[j-1]),a.map((x,k)=>x+(c[k]-x)*ts[j])]);}
 for(let [a,c] of edges){if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2,isB=mv>15.698&&mv<47.0;let face='minor-return',source=[];
  if(horizontal&&mv<.02){face='33-north';source=north33;}
  else if(horizontal&&mv>15.6&&mv<15.698){face='33-south';source=south33;}
  else if(horizontal&&mv>11.6&&mv<11.8){face='33-passage';}
  else if(horizontal&&mv>47&&mv<47.1){face='34A-north';source=northA;}
  else if(horizontal&&mv>64.3){face='34A-south';source=southA;}
  else if(!horizontal&&isB&&len>20){face=mx<50?'34B-west':'34B-east';source=bRooms;}
  else if(!horizontal&&len>8){face=isB?'34B-return':mv<20?'33-end':'34A-end';source=cells([Math.min(la[1],lc[1]),(la[1]+lc[1])/2,Math.max(la[1],lc[1])],.45);}
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<(isB?1:6);floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,w=door.width||2.4;if(x>w/2+.1&&x<len-w/2-.1){openings=openings.filter(q=>q.e<x-w/2-.12||q.s>x+w/2+.12);openings.push({s:x-w/2,e:x+w/2,bottom:.30,top:2.86,door:true});}}
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
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.04,.025,len,.12,.16,C.frame,24);
   }
   if(isB)panel(0,len,H.floor,H.eastPlaceholder);
   const wallHeight=isB?H.eastPlaceholder:H.wall;b.box(len/2,wallHeight+.225,-.09,len,.45,.18,C.wall,24);b.box(len/2,wallHeight+.46,-.09,len,.06,.24,C.frame,24);
  }));
 }
 // First-floor apertures follow each plan; external sill/steps are fitted shallow transitions, not measured stair counts.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.number,()=>{
  const w=q.width||2.4,s=q.outward,axis=q.axis;
  if(axis===0){b.box(q.u,.15,q.v+s*.42,w+.3,.3,.84,C.stone,24);b.box(q.u,.075,q.v+s*1.0,w+.3,.15,.34,C.stone,24);}
  else{b.box(q.u+s*.42,.15,q.v,.84,.3,w+.3,C.stone,24);b.box(q.u+s*1.0,.075,q.v,.34,.15,w+.3,C.stone,24);}
 });});
 return{strategy:'building022-v46',floors:null,sourceOutline:true,northWing:33,southWing:'34A',eastWing:'34B',northFloors:6,southFloors:6,eastFloors:null,eastUpperWindowsUnmodeled:true,flatRoofsObserved:true,wingMappingInferred:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building022={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
