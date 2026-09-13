/* New conservation biology building. Own school photograph: white enclosed
 * entrance, broad granite steps, glazed double leaves and sidelights, painted
 * projecting eaves, two main window rows above a low exposed window band.
 * Compass registration, hidden elevations and roof/level transitions are fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/679485572';
const R=-Math.atan2(.122,28.755),CO=Math.cos(R),SI=Math.sin(R),O=[-369.67+27.40*Math.sin(-R),-407.393];
const W=28.755,D=27.40,WEST=16.60,FRONT=25.25,NORTH_X=7.72,NORTH_W=16.91,SPLIT=14.09;
const H={base:1.73,main:9.15,mainEave:9.75,mainRidge:11.97,north:7.57,link:7.00,hall:5.60,landing:1.62};
const ENTRY={x:22.30,front:D,width:12.155,back:23.60,doorWidth:3.30,doorTop:4.21,stairWidth:9.10,steps:9,tread:.35};
const C={white:'#e8e6da',base:'#afb3ab',stone:'#bcbeb5',frame:'#625247',glass:'#6a807b',red:'#884c3c',blue:'#254c70',cyan:'#418180',green:'#39625c',gold:'#bbaa79',cream:'#dbd8b9',tile:'#898f85',ridge:'#a6aca0',metal:'#9c9c8e'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],pi=greater?p[axis]>=k:p[axis]<=k,qi=greater?q[axis]>=k:q[axis]<=k;if(pi)out.push(p);if(pi!==qi){const t=(k-p[axis])/(q[axis]-p[axis]);out.push(p.map((v,j)=>v+t*(q[j]-v)));}}return out;}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'068-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('068-'+name,g,0,0,0,1,1,1,c,mat);
 function outline(g,points,y,z,thick){for(let i=0;i<points.length;i++){const p=points[i],q=points[(i+1)%points.length],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy),nx=-dy/len*thick/2,ny=dx/len*thick/2;g.quad([p[0]-nx,y+p[1]-ny,z],[q[0]-nx,y+q[1]-ny,z],[q[0]+nx,y+q[1]+ny,z],[p[0]+nx,y+p[1]+ny,z]);}}
 function painted(name,width,y){group('painted-'+name,()=>{
  // Preserve every ordered line vertex while sharing preparation and draw state.
  const gold=new G.Geometry(),cream=new G.Geometry();
  b.box(width/2,y,.17,width,.61,.28,C.blue,10);
  for(const dy of[-.32,.32])b.box(width/2,y+dy,.20,width+.08,.055,.34,C.cream,10);
  for(const dy of[-.26,.26])b.box(width/2,y+dy,.319,width,.027,.022,C.cyan,10);
  const n=Math.max(1,Math.round(width/3.15)),step=width/n;
  for(let i=0;i<n;i++){
   const x=(i+.5)*step,w=step*.69,h=.33,cut=.17;
   outline(gold,[[-w/2+cut,-h/2],[w/2-cut,-h/2],[w/2,0],[w/2-cut,h/2],[-w/2+cut,h/2],[-w/2,0]].map(p=>[p[0]+x,p[1]]),y,.319,.027);
   b.box(x,y,.328,w-.40,.18,.02,C.cyan,10);
   outline(cream,[[-w*.30,-.10],[w*.30,-.10],[w*.34,0],[w*.30,.10],[-w*.30,.10],[-w*.34,0]].map(p=>[p[0]+x,p[1]]),y,.345,.018);
   for(const side of[-1,1]){
    const u=x+side*step*.43;
    for(const radius of[.17,.225])outline(radius<.2?cream:gold,Array.from({length:12},(_,j)=>[u+Math.cos(j*Math.PI/6)*radius,Math.sin(j*Math.PI/6)*radius]),y,.334,.025);
    b.sphere(u,y,.34,.055,.055,.020,C.gold,10,0,true);
   }
  }
  // Small compound painted brackets under the projecting eaves, not red columns.
  for(let x=.42;x<width-.15;x+=1.05){
   b.box(x,y+.24,.31,.15,.37,.57,C.green,6);b.box(x,y+.38,.49,.53,.12,.72,C.cyan,6);
   for(const dx of[-.20,.20])b.box(x+dx,y+.48,.58,.11,.16,.70,C.green,6);
   b.box(x,y+.57,.52,.73,.10,.73,C.blue,6);b.box(x,y+.37,.855,.22,.15,.045,C.cream,10);
  }
  mesh('painted-lines-'+name+'-gold',gold,C.gold,10);mesh('painted-lines-'+name+'-cream',cream,C.cream,10);
 });}
 function window(q){const h=q.hi-q.lo;group('windows',()=>{
  b.box(q.x,(q.lo+q.hi)/2,-.115,q.w,h,.036,C.glass,5);
  const panes=q.low?2:2;
  for(let i=0;i<=panes;i++)b.box(q.x-q.w/2+i*q.w/panes,(q.lo+q.hi)/2,-.012,.074,h+.08,.22,C.frame,6);
  for(const y of q.low?[q.lo,q.hi]:[q.lo,q.hi,q.hi-.40])b.box(q.x,y,.002,q.w+.08,.068,.23,C.frame,6);
  b.box(q.x,q.lo-.10,.075,q.w+.26,.13,.38,C.white,24);
  if(!q.low)b.box(q.x,q.hi+.19,.03,q.w+.18,.15,.15,C.red,6);
 });}
 function face(name,x,z,angle,width,height,positions,rows,entry=false,decor=true){b.local(x,0,z,angle,()=>group('face-'+name,()=>{
  const holes=[];for(const [lo,hi,low]of rows)for(const u of positions)holes.push({x:u,w:Math.min(low?2.26:2.06,width/Math.max(positions.length,1)*.60),lo,hi,low});
  if(entry)holes.push({x:ENTRY.x-x,w:ENTRY.doorWidth,lo:H.landing,hi:ENTRY.doorTop,door:true});
  const levels=[0,H.base,height,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>v<=height&&a.indexOf(v)===i).sort((a,b)=>a-b);
  for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.001&&q.hi>=hi-.001).sort((a,b)=>a.x-b.x);let cursor=0;
   const wall=(a,c)=>{if(c>a+.00001)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,!entry&&hi<=H.base?C.base:C.white,24);};
   for(const q of cuts){wall(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}wall(cursor,width);
  }
  for(const q of holes)if(!q.door)window(q);
  if(!entry){b.box(width/2,H.base+.035,.045,width,.08,.12,C.white,24);b.box(width/2,.11,.02,width,.22,.42,C.base,24);}
  if(decor)painted(name,width,height+.04);
 }));}
 function hip(name,x,z,w,d,eave,ridge){
  const swap=d>w,cross=swap?w:d,long=swap?d:w;
  b.local(x+w/2,0,z+d/2,swap?Math.PI/2:0,()=>b.local(-long/2,0,-cross/2,0,()=>group('roof-'+name,()=>{
   const lip=name==='vestibule'?1.08:1.02,a=-lip,c=long+lip,n=-lip,s=cross+lip,mid=cross/2,half=mid+lip;
   const y=(u,v)=>{const t=Math.max(0,Math.min(1,(u+lip)/half,(long+lip-u)/half,(v+lip)/half,(cross+lip-v)/half));const corner=Math.pow(Math.max(0,1-Math.min(u+lip,long+lip-u)/1.4),2)*Math.pow(Math.max(0,1-Math.min(v+lip,cross+lip-v)/1.4),2);return eave+(ridge-eave)*Math.pow(t,1.45)+.13*Math.pow(1-t,12)+.19*corner;};
   const polys=[[[a,n],[c,n],[long-mid,mid],[mid,mid]],[[mid,mid],[long-mid,mid],[c,s],[a,s]],[[a,n],[mid,mid],[a,s]],[[long-mid,mid],[c,n],[c,s]]];
   for(let side=0;side<4;side++){
    const p=polys[side],axis=side<2?1:0,across=1-axis,g=new G.Geometry(),tiles=new G.Geometry(),lo=Math.min(...p.map(v=>v[axis])),hi=Math.max(...p.map(v=>v[axis]));
    const emit=(geo,poly,dy)=>{for(let j=1;j<poly.length-1;j++)geo.tri(...[poly[0],poly[j],poly[j+1]].map(q=>[q[0],y(...q)+dy,q[1]]));};
    const strips=Array.from({length:18},(_,j)=>clip(clip(p,axis,lo+(hi-lo)*j/18,true),axis,lo+(hi-lo)*(j+1)/18,false));
    for(const q of strips)emit(g,q,0);
    const l=Math.min(...p.map(q=>q[across])),r=Math.max(...p.map(q=>q[across]));
    for(let u=l+.07;u<r;u+=.215)for(let k=0;k<3;k++)for(const q of strips){const t=u-.040+k*.027;emit(tiles,clip(clip(q,across,t,true),across,t+.027,false),.015+Math.sin((k+.5)*Math.PI/3)*.033);}
    tiles.detailWidth=.027;mesh(name+'-roof-surface-'+side,g,C.tile,2);mesh(name+'-tile-ribs-'+side,tiles,C.ridge,2);
   }
   b.box(long/2,ridge+.055,mid,long-cross+.34,.18,.25,C.ridge,2);
   for(const x0 of[mid,long-mid]){
    const ornament=new G.Geometry(),sign=x0<long/2?-1:1,pts=[[0,0],[.26,.10],[.42,.38],[.26,.59],[.06,.51],[-.06,.31],[-.15,.14]];
    for(const dz of[-.105,.105])for(let j=1;j<pts.length-1;j++)ornament.tri(...[pts[0],pts[j],pts[j+1]].map(q=>[x0+q[0]*sign,ridge+.10+q[1],mid+dz]));
    for(let j=0;j<pts.length;j++){const p=pts[j],q=pts[(j+1)%pts.length];ornament.quad([x0+p[0]*sign,ridge+.10+p[1],mid-.105],[x0+q[0]*sign,ridge+.10+q[1],mid-.105],[x0+q[0]*sign,ridge+.10+q[1],mid+.105],[x0+p[0]*sign,ridge+.10+p[1],mid+.105]);}mesh(name+'-ridge-curl-'+x0,ornament,C.ridge,2);
   }
   for(const [p,q]of[[[a,n],[mid,mid]],[[a,s],[mid,mid]],[[c,n],[long-mid,mid]],[[c,s],[long-mid,mid]]])for(let j=0;j<18;j++){const v=p.map((x,k)=>x+(q[k]-x)*j/18),w=p.map((x,k)=>x+(q[k]-x)*(j+1)/18);b.beam([v[0],y(...v)+.07,v[1]],[w[0],y(...w)+.07,w[1]],.10,C.ridge,2);}
   for(const [x0,z0,rot,width]of[[0,cross,0,long],[long,0,Math.PI,long],[long,cross,Math.PI/2,cross],[0,0,-Math.PI/2,cross]])b.local(x0,0,z0,rot,()=>{
    b.box(width/2,eave-.17,.48,width+1.85,.15,1.01,C.red,6);
    for(let u=-.72;u<width+.85;u+=.24){b.box(u,eave-.13,.62,.078,.11,.88,C.red,6);b.box(u,eave-.13,1.064,.081,.112,.040,C.cream,10);}
   });
  })));
 }
 function vestibule(){
  const x=ENTRY.x,z=ENTRY.front;group('enclosed-vestibule',()=>{
   // A framed glazed pair, with two fixed sidelights, in a real wall aperture.
   const w=ENTRY.doorWidth,lo=H.landing,hi=ENTRY.doorTop;
   for(const [a,c]of[[-w/2,-1.04],[-1.04,0],[0,1.04],[1.04,w/2]])b.box(x+(a+c)/2,(lo+hi)/2,z-.13,c-a-.07,hi-lo-.08,.037,C.glass,5);
   for(const u of[-w/2,-1.04,0,1.04,w/2])b.box(x+u,(lo+hi)/2,z-.015,.082,hi-lo+.10,.23,C.frame,6);
   for(const y of[lo+.025,hi])b.box(x,y,z-.012,w+.10,.08,.24,C.frame,6);
   for(const u of[-.12,.12]){b.box(x+u,2.73,z+.13,.026,.37,.035,C.metal,9);b.box(x+u,2.63,z+.07,.026,.028,.15,C.metal,9);b.box(x+u,2.88,z+.07,.026,.028,.15,C.metal,9);}
   for(const u of[-w/2-.19,w/2+.19])b.box(x+u,2.96,z+.075,.23,2.91,.18,C.white,24);
   b.box(x,4.42,z+.075,w+.61,.23,.18,C.white,24);b.box(x,4.84,z+.065,5.40,.22,.12,C.red,6);
   b.box(x-w/2-.95,3.76,z+.095,.58,.42,.075,C.gold,9);
   b.box(x-w/2-.50,3.13,z+.08,.07,.12,.04,C.gold,9);
   b.box(x,H.landing/2,z+.40,ENTRY.stairWidth+.15,H.landing,1.02,C.stone,21);
   for(let i=0;i<ENTRY.steps;i++){
    const high=(ENTRY.steps-i)*.18,zz=z+1+(i+.5)*ENTRY.tread,width=ENTRY.stairWidth+i*.07;
    b.box(x,high/2,zz,width,high,ENTRY.tread,C.stone,21);
    b.box(x,high+.006,zz+ENTRY.tread/2-.026,width,.012,.035,'#8f948e',21);
   }
   for(const side of[-1,1]){
    const g=new G.Geometry(),a=[x+side*(ENTRY.stairWidth/2+.21),z+.03],c=[x+side*(ENTRY.stairWidth/2+.59),z+4.22],th=.22;
    const p=[[a[0]-th,0,a[1]],[a[0]+th,0,a[1]],[c[0]+th,0,c[1]],[c[0]-th,0,c[1]],[a[0]-th,2.48,a[1]],[a[0]+th,2.48,a[1]],[c[0]+th,.63,c[1]],[c[0]-th,.63,c[1]]];
    for(const q of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])g.quad(...q.map(j=>p[j]));mesh('stair-cheek-'+side,g,C.white,24);
    const cap=new G.Geometry(),t=.27,cp=[[a[0]-t,2.48,a[1]],[a[0]+t,2.48,a[1]],[c[0]+t,.63,c[1]],[c[0]-t,.63,c[1]],[a[0]-t,2.56,a[1]],[a[0]+t,2.56,a[1]],[c[0]+t,.71,c[1]],[c[0]-t,.71,c[1]]];
    for(const q of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])cap.quad(...q.map(j=>cp[j]));mesh('stair-cheek-cap-'+side,cap,'#929990',21);
   }
  });
 }
 const highRows=[[.30,1.03,true],[2.30,4.70,false],[6.03,8.51,false]],northRows=[[.30,1.03,true],[2.17,4.27,false],[5.29,7.04,false]],linkRows=[[.30,1.03,true],[2.17,4.27,false],[5.34,6.48,false]];
 b.local(O[0],0,O[1],R,()=>{
  group('floor',()=>mesh('footprint-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},.05),C.base,21));
  face('south-main',0,FRONT,0,WEST,H.main,[2.3,6.3,10.3,14.3],highRows);
  face('west-fitted',0,SPLIT,-Math.PI/2,FRONT-SPLIT,H.main,[2.4,5.7,9.0],highRows);
  face('north-west-step-fitted',NORTH_X,SPLIT,Math.PI,NORTH_X,H.main,[1.8,5.8],highRows);
  face('north-west-fitted',NORTH_X,0,-Math.PI/2,SPLIT,H.north,[2.2,6.7,11.2],northRows);
  face('north-fitted',NORTH_X+NORTH_W,0,Math.PI,NORTH_W,H.north,[2.3,6.4,10.5,14.6],northRows);
  face('north-east-fitted',NORTH_X+NORTH_W,6.38,Math.PI/2,6.38,H.north,[1.7,4.7],northRows);
  face('east-step-fitted',W,6.38,Math.PI,W-NORTH_X-NORTH_W,H.link,[2.0],linkRows);
  face('east-fitted',W,ENTRY.back,Math.PI/2,ENTRY.back-6.38,H.link,[2.2,6.5,10.8,15.0],linkRows);
  face('high-return-fitted',WEST,FRONT,Math.PI/2,FRONT-SPLIT,H.main,[2.5,6.0,9.4],highRows);
  face('entry-front',WEST,D,0,W-WEST,H.hall,[],[],true);
  face('entry-east-fitted',W,D,Math.PI/2,D-ENTRY.back,H.hall,[1.8],[[2.30,3.92,false]]);
  face('entry-west-return',WEST,FRONT,-Math.PI/2,D-FRONT,H.hall,[],[],false,false);
  hip('west-main',0,SPLIT,WEST,FRONT-SPLIT,H.mainEave,H.mainRidge);
  hip('north-block-fitted',NORTH_X,0,NORTH_W,SPLIT,8.17,10.15);
  hip('east-link-fitted',WEST,6.38,W-WEST,ENTRY.back-6.38,7.60,8.90);
  hip('vestibule',WEST,ENTRY.back,W-WEST,D-ENTRY.back,6.21,7.34);
  vestibule();
 });
 return{strategy:'building068-v46',storeyLabels:3,visibleMainWindowRows:2,lowWindowBand:true,enclosedVestibule:true,openPortico:false,roofGroups:4,entranceFacing:'south-provisional',groundStoreyConventionVerified:false,roofTransitionsVerified:false,allFacadesVerified:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building068={id:ID,render,W,D,WEST,FRONT,SPLIT,H,ENTRY,R,world,local};
})(YY);
