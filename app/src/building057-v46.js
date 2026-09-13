/* Old Chemistry Building: own north-open U, three distinct xieshan roofs and a fitted connecting terrace.
   The courtyard direction is mapped. Exact entrance, terrace location, window counts and heights remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/445012604';
const O=[104.406,205.98],R=Math.atan2(2.965,90.716),CO=Math.cos(R),SI=Math.sin(R),H={base:.60,wall:11.94,terrace:8.48,top:18.55};
const C={brick:'#a3a398',stone:'#c6c4b4',panel:'#ccc6b4',relief:'#bdb7a5',frame:'#485650',glass:'#728682',red:'#88433b',gold:'#bfa06a',green:'#387363',blue:'#588b82',roof:'#7d8379',tile:'#899185',white:'#d3d1bf'};
const parts=[{name:'main',x:21,z:12.50,r:0,w:50.60,d:23.15,eave:12.42,rise:5.20,cut:4.40,zg:3.60,vent:true,longBays:11,shortBays:4},{name:'west',x:0,z:35.65,r:Math.PI/2,w:35.70,d:18.20,eave:12.35,rise:4.90,cut:4.00,zg:2.75,vent:false,longBays:7,shortBays:3},{name:'east',x:74.25,z:35.65,r:Math.PI/2,w:36.42,d:16.95,eave:12.35,rise:4.90,cut:4.00,zg:2.60,vent:false,longBays:7,shortBays:3}];
const connectors=[{name:'west',a:17.45,c:21.75,n:13.25,s:34.90},{name:'east',a:70.85,c:75.00,n:13.25,s:34.90}];
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const partPoint=(p,u,v)=>[p.x+u*Math.cos(p.r)+v*Math.sin(p.r),p.z-u*Math.sin(p.r)+v*Math.cos(p.r)];
function roofY(p,v){const t=Math.max(0,1-Math.abs(v-p.d/2)/(p.d/2));return p.eave+p.rise*Math.pow(t,1.48)+.19*Math.pow(1-t,8);}
function corner(p,u,v){const a=Math.max(0,1-Math.min(u,p.w-u)/2.8),c=Math.max(0,1-Math.min(v,p.d-v)/2.8);return .32*a*a*c*c;}
function slopes(p){const a=p.cut,c=p.w-a,z=p.zg,s=p.d-z,m=p.d/2,withCorner=fn=>q=>fn(q)+corner(p,q[0],q[1]);return[
 {name:'north',p:[[0,0],[p.w,0],[c,z],[c,m],[a,m],[a,z]],axis:1,y:withCorner(q=>roofY(p,q[1]))},
 {name:'south',p:[[a,m],[c,m],[c,s],[p.w,p.d],[0,p.d],[a,s]],axis:1,y:withCorner(q=>roofY(p,q[1]))},
 {name:'end-0',p:[[0,0],[a,z],[a,s],[0,p.d]],axis:0,y:withCorner(q=>roofY(p,q[0]/a*z))},
 {name:'end-1',p:[[c,z],[p.w,0],[p.w,p.d],[c,s]],axis:0,y:withCorner(q=>roofY(p,(p.w-q[0])/a*z))}];}
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,ci=greater?c[axis]>=k:c[axis]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
function rounded(w,h,r){const p=[];for(const [cx,cy,start]of[[w/2-r,h/2-r,0],[-w/2+r,h/2-r,Math.PI/2],[-w/2+r,-h/2+r,Math.PI],[w/2-r,-h/2+r,Math.PI*1.5]])for(let j=0;j<=7;j++){const a=start+j*Math.PI/14;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a),0]);}const g=new G.Geometry();for(let j=0;j<p.length;j++)g.tri([0,0,0],p[j],p[(j+1)%p.length]);return g;}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'057-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 function roof(p){
  for(const s of slopes(p)){const mesh=new G.Geometry(),tiles=new G.Geometry(),axis=s.axis,other=1-axis,lo=Math.min(...s.p.map(q=>q[axis])),hi=Math.max(...s.p.map(q=>q[axis])),left=Math.min(...s.p.map(q=>q[other])),right=Math.max(...s.p.map(q=>q[other]));
   const emit=(g,poly,dy)=>{for(let k=1;k<poly.length-1;k++)g.tri(...[poly[0],poly[k],poly[k+1]].map(q=>[q[0],s.y(q)+(typeof dy==='function'?dy(q):dy),q[1]]));};
   for(let j=0;j<30;j++){const low=lo+(hi-lo)*j/30,high=lo+(hi-lo)*(j+1)/30;emit(mesh,clip(clip(s.p,axis,low,true),axis,high,false),0);
    for(let u=left+.12;u<right;u+=.34)for(let k=0;k<4;k++){const a=u-.07+k*.035,c=a+.035;let poly=s.p;for(const [ax,v,more]of[[other,a,true],[other,c,false],[axis,low,true],[axis,high,false]])if(poly.length)poly=clip(poly,ax,v,more);emit(tiles,poly,q=>.015+.026*Math.sqrt(Math.max(0,1-Math.pow((q[other]-u)/.07,2))));}
   }tiles.detailWidth=.035;b.mesh('own-roof-'+s.name,mesh,0,0,0,1,1,1,C.roof,25);b.mesh('own-tiles-'+s.name,tiles,0,0,0,1,1,1,C.tile,25);
  }
  const base=roofY(p,p.zg),mid=p.d/2,end=p.d-p.zg;
  for(const u of[p.cut,p.w-p.cut]){const face=u<p.w/2?-1:1,fill=new G.Geometry(),barge=new G.Geometry();
   for(let k=0;k<40;k++){const a=p.zg+(end-p.zg)*k/40,c=p.zg+(end-p.zg)*(k+1)/40,ya=roofY(p,a),yc=roofY(p,c);fill.quad([u,base,a],[u,base,c],[u,yc,c],[u,ya,a]);for(const xx of[u-.10,u+.10])barge.quad([xx,ya-.30,a],[xx,yc-.30,c],[xx,yc+.04,c],[xx,ya+.04,a]);}
   b.mesh('red-gable-'+u,fill,0,0,0,1,1,1,C.red,24);b.mesh('gray-gable-barge-'+u,barge,0,0,0,1,1,1,C.tile,25);b.box(u,base+.045,mid,.24,.13,end-p.zg+.14,C.tile,25);
   const xx=u+face*.115;
   const stroke=points=>{for(let k=1;k<points.length;k++){const a=points[k-1],c=points[k];if([a,c].every(q=>q[0]>base+.16&&q[0]<roofY(p,q[1])-.31))b.beam([xx,a[0],a[1]],[xx,c[0],c[1]],.025,C.gold,24);}};
   const curl=(yy,zz,rx,ry,flip)=>stroke(Array.from({length:24},(_,k)=>{const t=k/23,a=.2+t*Math.PI*3,r=1-.70*t;return[yy+Math.sin(a)*ry*r,zz+Math.cos(a)*rx*r*flip];}));
   if(p.vent){
    const y=base+.62;b.box(xx,y,mid,.08,.96,1.86,C.glass,5);for(const z of[mid-.99,mid-.34,mid+.34,mid+.99])b.box(xx+face*.055,y,z,.08,1.10,.095,C.white,24);for(const h of[y-.55,y+.55])b.box(xx+face*.055,h,mid,.08,.095,2.06,C.white,24);
    for(const side of[-1,1]){curl(base+.72,mid+side*2.35,.75,.57,side);curl(base+2.02,mid+side*.64,.54,.72,side);}stroke([[base+1.52,mid],[base+2.42,mid],[base+2.79,mid-.11]]);
   }else{
    // The photographed wing gable is densely gilded. Small branching curls convey its density;
    // these fitted strokes do not claim to reproduce the unresolved carving pattern.
    const peak=roofY(p,mid),height=peak-base;
    for(let row=0;row<7;row++){
     const yy=base+.36+row*.40;
     for(let col=-8;col<=8;col++){
      const z=mid+(col+(row%2)*.5)*.59;
      if(yy+.30>=roofY(p,z)-.34||z<=p.zg+.25||z>=end-.25)continue;
      const side=col<0?-1:1;curl(yy,z,.25,.23,side);
      stroke([[yy-.13,z-side*.24],[yy+.02,z],[yy+.32,z+side*.24]]);
      stroke([[yy+.08,z+side*.04],[yy+.26,z-side*.12],[yy+.20,z-side*.23]]);
     }
    }
    stroke([[base+.18,mid],[base+height*.82,mid],[peak-.43,mid+.10]]);
   }
   // Ridge ornaments follow the visible curved silhouette; carving strokes are fitted.
   const ridge=p.eave+p.rise;b.box(u,ridge+.12,mid,.30,.30,.35,C.tile,25);
   const hook=[[0,.20],[.13,.33],[.24,.53],[.25,.70],[.17,.77],[.05,.73],[.015,.63],[.065,.57]];
   for(let k=1;k<hook.length;k++)b.beam([u+face*hook[k-1][0],ridge+hook[k-1][1],mid],[u+face*hook[k][0],ridge+hook[k][1],mid],.105-k*.006,C.tile,25);
  }
  b.box(p.w/2,p.eave+p.rise+.09,mid,p.w-p.cut*2+.12,.20,.35,C.tile,25);
  for(const far of[false,true])for(const south of[false,true])for(let k=0;k<30;k++){const a=k/30,c=(k+1)/30,x=far?p.w-p.cut*a:p.cut*a,xx=far?p.w-p.cut*c:p.cut*c,z=south?p.d-p.zg*a:p.zg*a,zz=south?p.d-p.zg*c:p.zg*c;b.beam([x,roofY(p,z)+corner(p,x,z)+.07,z],[xx,roofY(p,zz)+corner(p,xx,zz)+.07,zz],.08,C.tile,25);}
 }
 function paintedEave(width,eave){
  group('painted-eave',()=>{b.box(0,eave-.52,.10,width+.14,.28,.47,C.red,24);b.box(0,eave-.22,.26,width+.32,.17,.70,C.green,24);
   for(let x=-width/2+.58;x<width/2-.30;x+=1.53){b.box(x,eave-.75,.15,.25,.27,.40,C.green,24);b.box(x,eave-.57,.30,.46,.15,.61,C.blue,24);b.box(x,eave-.41,.39,.75,.14,.77,C.green,24);for(const side of[-1,1]){b.beam([x+side*.06,eave-.70,.36],[x+side*.28,eave-.44,.66],.046,C.green,24);b.box(x+side*.21,eave-.44,.79,.15,.035,.03,C.gold,24);}b.box(x,eave-.57,.635,.18,.09,.035,C.gold,24);}
   for(let x=-width/2-.25,n=0;x<width/2+.25;x+=.31,n++){b.box(x,eave-.055,.38,.135,.15,1.10,C.red,24);b.box(x,eave-.055,.945,.145,.15,.045,n%2?C.white:C.red,24);b.box(x,eave-.20,.77,.13,.055,.055,C.blue,24);}
  });
 }
 function facades(p){const inset=.75;
  b.box(p.w/2,H.base/2,p.d/2,p.w-2*inset+.22,H.base,p.d-2*inset+.22,C.stone,24);
  for(let side=0;side<4;side++){const long=side%2===0,width=(long?p.w:p.d)-2*inset,ox=side===1?p.w-inset:side===3?inset:p.w/2,oz=side===0?inset:side===2?p.d-inset:p.d/2,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side],count=long?p.longBays:p.shortBays,pitch=(width-3.00)/Math.max(1,count-1);
   b.local(ox,0,oz,rot,()=>group('face-'+side,()=>{
    const panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.08,c-a,hi-lo,.17,C.brick,30);};
    for(let fl=0;fl<3;fl++){const lo=[H.base,4.40,8.10][fl],hi=[4.40,8.10,H.wall][fl],bottom=[1.33,5.72,9.31][fl],top=[3.99,7.76,11.47][fl];let cursor=-width/2;
     for(let k=0;k<count;k++){const x=(k-(count-1)/2)*pitch,northDoor=p.name==='main'&&side===0&&fl===0&&k===(count-1)/2,terraceDoor=p.name==='main'&&side===1&&fl===2&&k===1,door=northDoor||terraceDoor,w=long?2.82:2.57,low=door?(terraceDoor?H.terrace:H.base):bottom,high=door?Math.min(top,low+2.98):top,a=x-w/2,c=x+w/2,y=(low+high)/2,h=high-low;
      panel(cursor,a,lo,hi);panel(a,c,lo,low);panel(a,c,high,hi);
      group('openings-'+fl,()=>{b.box(x,y,-.18,w-.12,h-.12,.045,C.glass,5);for(const u of[a,c])b.box(u,y,-.035,.085,h,.21,C.frame,24);for(const v of[low,high])b.box(x,v,-.035,w,.085,.21,C.frame,24);const transom=high-.53;b.box(x,transom,-.065,w-.11,.08,.10,C.frame,24);for(const u of door?[x]:[x-w*.23,x+w*.23])b.box(u,(low+transom)/2,-.065,.068,transom-low,.11,C.frame,24);for(const u of[x-w*.23,x+w*.23])b.box(u,(transom+high)/2,-.065,.06,high-transom,.10,C.frame,24);if(door){for(const u of[x-.14,x+.14])b.box(u,low+1.16,.025,.035,.39,.045,'#b9b9ab',9);}else b.box(x,low-.065,.065,w+.24,.13,.32,C.stone,24);});
      if(fl>0&&!terraceDoor)group('single-relief-panel',()=>{const yy=bottom-.81;b.box(x,yy,.02,w+.24,1.33,.13,C.panel,24);b.mesh('relief-shadow-'+w,b.geo('057-relief-shadow-'+w,()=>rounded(w+.03,1.18,.18)),x,yy,.092,1,1,1,C.relief,24);b.mesh('relief-face-'+w,b.geo('057-relief-face-'+w,()=>rounded(w-.12,1.02,.145)),x,yy,.107,1,1,1,C.panel,24);});
      if(northDoor)group('plain-entry-provisional-north',()=>{for(const u of[a-.18,c+.18])b.box(u,2.21,.065,.24,3.42,.36,C.stone,24);b.box(x,3.92,.14,w+.63,.23,.65,C.stone,24);b.box(x,H.base/2,.28,4.50,H.base,.56,C.stone,24);for(let s=0;s<3;s++){const h=H.base-s*.20;b.box(x,h/2,.74+s*.35,4.50,h,.37,C.stone,24);}});
      cursor=c;
     }panel(cursor,width/2,lo,hi);
    }
    for(let k=0;k<=count;k++){const x=Math.max(-width/2+.14,Math.min(width/2-.14,(k-count/2)*pitch));b.box(x,(H.base+H.wall)/2,.035,.32,H.wall-H.base,.23,C.brick,30);}
    b.box(0,H.base+.08,.06,width,.15,.29,C.stone,24);paintedEave(width,p.eave);
    // The documented east facade has small concrete equipment shelters; no doorway is inferred from them.
    if(p.name==='east'&&side===2)group('east-equipment-shelters',()=>{for(const k of[1,2]){const x=(k-(count-1)/2)*pitch;b.box(x,4.06,.48,3.02,.20,1.11,C.stone,24);for(const u of[x-1.21,x+1.21])b.box(u,2.59,.91,.055,2.75,.055,'#666e65',9);b.box(x-.64,1.51,.62,.77,1.37,.35,'#bfc1b5',24);for(let v=0;v<7;v++)b.box(x-.64,1.08+v*.13,.808,.62,.022,.024,'#858f85',9);}});
   }));
  }
 }
 b.local(O[0],0,O[1],R,()=>{
  for(const p of parts)b.local(p.x,0,p.z,p.r,()=>group(p.name,()=>{roof(p);facades(p);}));
  for(const c of connectors)group('connector-'+c.name,()=>{
   const w=c.c-c.a,d=c.s-c.n,m=(c.a+c.c)/2,z=(c.n+c.s)/2;
   b.box(m,H.base/2,z,w,H.base,d,C.stone,24);
   // Two lower storeys carry the connecting deck, so the terrace is not suspended between disconnected volumes.
   for(const zz of[c.n,c.s]){b.box(m,2.26,zz,w,3.32,.22,C.brick,30);b.box(m,4.005,zz,w,.18,.25,C.stone,24);b.box(m,6.18,zz,w,4.18,.22,C.brick,30);}
   b.box(m,H.terrace-.15,z,w,.30,d,C.stone,24);
   if(c.name==='east')group('terrace-provisional-east',()=>{
    b.box(m,H.terrace+.015,z,w-.08,.035,d-.08,'#b4b5ab',24);
    for(let zz=c.n+.48;zz<c.s;zz+=.64)b.box(m,H.terrace+.037,zz,w-.08,.008,.012,'#919b94',24);
    // Two visible railing types are fitted to opposite ends of one terrace, not asserted as two separate balconies.
    b.box(m,H.terrace+.53,c.n+.10,w,.96,.24,C.panel,24);b.box(m,H.terrace+1.07,c.n+.10,w+.08,.16,.38,C.stone,24);
    b.box(m,H.terrace+.13,c.s-.10,w,.22,.25,C.stone,24);b.box(m,H.terrace+1.06,c.s-.10,w+.08,.16,.38,C.stone,24);
    for(let k=0;k<5;k++){const x=c.a+.17+k*(w-.34)/4;b.box(x,H.terrace+.61,c.s-.10,.20,.83,.23,C.stone,24);}
    // Loose furniture communicates the photographed use without filling the walking strip next to the door.
    for(const zz of[c.n+3.35,c.s-3.30]){b.cyl(m,H.terrace,zz,.035,.73,'#4b5e58',12,1,9);b.cyl(m,H.terrace+.73,zz,.57,.055,'#4f625b',32,1,9);for(const shift of[-1,1]){const zc=zz+shift*.90;b.box(m,H.terrace+.44,zc,.47,.05,.46,'#53675e',24);for(const xx of[m-.19,m+.19])for(const off of[-.17,.17])b.box(xx,H.terrace+.23,zc+off,.027,.43,.027,'#4b5e58',9);for(const yy of[.67,.89])b.box(m,H.terrace+yy,zc+shift*.22,.48,.11,.035,'#53675e',24);}}
   });else{for(const zz of[c.n,c.s])b.box(m,H.terrace+.16,zz,w,.31,.23,C.stone,24);}
  });
 });
 return{strategy:'building057-v46',floors:3,northOpenCourt:true,independentRoofs:3,gableCount:6,mainGableVent:true,terraceCount:1,terracePositionVerified:false,entryDirectionVerified:false,fullFacadeVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building057={id:ID,render,world,local,partPoint,parts,connectors,roofY,slopes,H};
})(YY);
