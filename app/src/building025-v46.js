/* Dormitory 44: own first/typical-floor plans, satellite L roof and independent north stairs. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825551';
const O=[-297.931,586.373],R=Math.atan2(.999,27.03),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#747b77',frame:'#e4e5dc',glass:'#718b91',roof:'#727e78',tile:'#929e96',stone:'#a8afa5',door:'#526762'};
const H={floor:3.2,wall:19.2,eave:19.4,ridge:22.5},entrances=[{name:'main-north',u:21.23,v:.92,face:'north-main',axis:0,outward:-1,width:6.5,sill:.75},{name:'west-end',u:0,v:10.7,face:'west-end',axis:1,outward:-1,width:1.8,sill:.3},{name:'east-end',u:45.14,v:10.7,face:'east',axis:1,outward:1,width:1.8,sill:.3},{name:'northwing-west',u:27.05,v:-10.0,face:'west-northwing',axis:1,outward:-1,width:1.8,sill:.3}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'025-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 add('025-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const p=F.polygons(f.geometry)[0][0].slice(0,-1).map(local),[sw,se,ne,nw,re,wm]=p;
 const rw=[9.573,9.573],rj=[36.555,9.573],rn=[36.555,-2.211];
 const faces=[[wm,rw,sw],[sw,rw,rj,se],[se,rj,rn,ne],[ne,rn,nw],[nw,rn,rj,re],[re,rj,rw,wm]];
 // One joined L roof: its valley terminates exactly at the source reentrant corner.
 const isRidge=q=>q===rw||q===rj||q===rn;
 faces.forEach((face,i)=>{const mesh=new G.Geometry();for(let k=1;k<face.length-1;k++)mesh.tri(...[face[0],face[k],face[k+1]].map(q=>vertex(q[0],isRidge(q)?H.ridge:H.eave,q[1])));add('025-continuous-hip-face-'+i,mesh,C.roof,2,id);});
 const map=x=>(x-210)/(1438-210)*46.065,cells=(xs,ratio=.68)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const south=cells([210,308,402,495,590,685,778,871,965,1057,1151,1245,1338,1438].map(map));
 const north=cells([210,308,402,495,590,685,778,871,970].map(map));
 const eastY=y=>-11.72+(y-195)/(1003-195)*30.866;
 const east=cells([195,294,385,480,574,666,758,818,909,1003].map(eastY));
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal&&mv>19){face='south';source=south;}
 else if(horizontal&&Math.abs(mv)<.1){face='north-main';source=north;}
 else if(horizontal&&mv<-11){face='north-end';source=cells([27.05,31.8,36.55,41.3,46.06],.25);}
 else if(!horizontal){face=mx<1?'west-end':mx<30?'west-northwing':'east';source=east;}
 const balcony=face==='south'?[[0,len]]:face==='east'?[[eastY(195),eastY(758)]]:face==='north-main'?[[map(210),map(590)],[map(685),map(970)]]:face==='west-northwing'?[[eastY(294),eastY(385)]]:[];
 const ax=horizontal?0:1,d=horizontal?du:dv;
 const bands=face==='south'?balcony:balcony.map(([s,e])=>[(s-la[ax])/d*len,(e-la[ax])/d*len].sort((a,b)=>a-b));
 // Set the wall behind the source outer edge on balcony-bearing faces. Open balcony air is real.
 const setback=balcony.length?.92:0;
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).filter(([s,e])=>s>.12&&e<len-.12&&e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-setback-.035,x1-x0,y1-y0,.07,C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>({s,e,bottom:base+.84,top:base+2.70,door:false}));
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=Math.max(0,x-door.width/2),e=Math.min(len,x+door.width/2);if(e>s+.15){openings=openings.filter(q=>q.e<s-.12||q.s>e+.12);openings.push({s,e,bottom:door.sill,top:3.03,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:.55;
     // Returns and recessed glazing form real apertures, without extruded continuous corridors.
     for(const xx of [q.s,q.e])b.box(xx,y,-setback-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [q.bottom,q.top])b.box(x,yy,-setback-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-setback-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.05,x,q.e-.05])b.box(xx,y,-setback-depth+.05,.045,h,.07,C.frame,6);
     for(const yy of [q.bottom+.035,q.top-.035])b.box(x,yy,-setback-depth+.05,w,.055,.07,C.frame,6);
     if(!q.door)b.box(x,base+1.95,-setback-depth+.055,w,.035,.07,C.frame,6);
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.14,-setback+.025,len,.12,.16,C.frame,24);
    let activeBands=bands;if(floor===0&&face==='north-main'){const doorX=(21.23-la[0])/du*len;activeBands=bands.flatMap(([s,e])=>[[s,Math.min(e,doorX-3.3)],[Math.max(s,doorX+3.3),e]]).filter(([s,e])=>e>s);}
    for(const [ss,ee] of activeBands){const s=Math.max(.05,ss),e=Math.min(len-.05,ee);if(e<=s)continue;
     b.box((s+e)/2,base+.11,-setback/2,e-s,.20,setback,C.stone,24);
     b.box((s+e)/2,base+.66,-.055,e-s,.90,.11,C.wall,24);
     b.box((s+e)/2,base+1.13,-.055,e-s,.05,.15,C.frame,24);
     for(const [ps,pe] of positions){const x=(ps+pe)/2;if(x>s&&x<e)b.box(x,base+.65,-.055,.04,1.1,.12,C.frame,24);}
     for(const x of [s,e])b.box(x,base+.65,-setback/2,.09,1.1,setback,C.wall,24);
    }
   }
   b.box(len/2,H.wall+.04,.035,len,.16,.18,C.frame,24);
  }));
 }
 // Four entrances from the first-floor plan; the narrow outside stair is a separate element.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{
 const w=q.width,s=q.outward;
 if(q.name==='main-north'){b.box(q.u,.375,q.v-.60,w+.4,.75,1.2,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(q.u,h/2,q.v-3.45+k*.5,w+.4,h,.51,C.stone,24);}}
 else if(q.axis===1){const extension=q.name==='northwing-west'?.92:0;/* Preserve the outer step; extend only the landing to the recessed west wall. */b.box(q.u+s*.35-s*extension/2,.15,q.v,.7+extension,.3,w+.25,C.stone,24);b.box(q.u+s*.88,.075,q.v,.38,.15,w+.25,C.stone,24);}
 });
 group('separate-narrow-stair',()=>{b.box(26.15,.375,-1.5,1.15,.75,1.5,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(26.15,h/2,-4.25+k*.4,1.15,h,.41,C.stone,24);}b.box(26.7,.375,-.70,1.3,.75,.85,C.stone,24);});
 });
 return{strategy:'building025-v46',floors:6,basementFloors:2,sourceOutline:true,northwestVoid:true,continuousLRoof:true,northMainEntrance:true,separateOutsideStair:true,floorCountAsBuiltVerified:false,dimensionFitted:true};
}

A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building025={id:ID,render,world,local,pieces,heights:H,entrances};
})(YY);
