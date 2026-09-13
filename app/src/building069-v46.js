/* Biotechnology building: own school photograph, two visible window rows,
 * projecting glazed hall, broad red eaves and louvred grey base.
 * Rear elevations, compass registration and roof junctions remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/679485574';
const R=-Math.atan2(.266,46.306),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(46.306,.266),D=20;
const O=[-385.231-D*SI,-348.526-D*CO],CX=W*.47,EW=8.2,EF=D+1.35;
const H={base:.82,wall:6.92,eave:8.12,ridge:10.30,entry:7.34,landing:1.16};
const C={white:'#e5e1d7',base:'#aaa9a0',stone:'#c2c2b7',frame:'#4e504a',glass:'#677f79',red:'#914b40',darkRed:'#633e34',cream:'#d0c7b2',tile:'#81877d',ridge:'#a1a597',gold:'#b5a16e',metal:'#aeb4ab'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],pi=greater?p[axis]>=k:p[axis]<=k,qi=greater?q[axis]>=k:q[axis]<=k;if(pi)out.push(p);if(pi!==qi){const t=(k-p[axis])/(q[axis]-p[axis]);out.push(p.map((v,j)=>v+t*(q[j]-v)));}}return out;}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'069-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('069-'+name,g,0,0,0,1,1,1,c,mat);
 function eaves(width,height){
  b.box(width/2,height+.34,.09,width,.78,.45,C.red,6);
  b.box(width/2,height+.88,.23,width+.28,.26,.72,C.darkRed,6);
  for(let x=.20;x<width;x+=3.1)b.box(x,height+.42,.345,.17,.94,.07,'#796453',6);
 }
 function window(q){const h=q.hi-q.lo,mid=(q.lo+q.hi)/2;
  if(q.vent){group('vents',()=>{
   b.box(q.x,mid,-.13,q.w,h,.035,'#595f57',6);
   for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,mid,.01,.05,h+.08,.15,C.cream,9);
   for(const y of[q.lo,q.hi])b.box(q.x,y,.01,q.w+.08,.05,.15,C.cream,9);
   for(let i=0;i<8;i++)b.box(q.x,q.lo+(i+.5)*h/8,.04,q.w-.06,.024,.10,C.cream,9);
  });return;}
  group(q.upper?'upper-windows':'lower-windows',()=>{
   b.box(q.x,mid,-.135,q.w,h,.036,C.glass,5);
   const n=q.upper?4:3;
   for(let i=0;i<=n;i++)b.box(q.x-q.w/2+i*q.w/n,mid,-.006,.056,h+.06,.25,C.frame,9);
   for(const y of[q.lo,q.hi,q.hi-(q.upper?.42:.63)])b.box(q.x,y,-.006,q.w+.07,.057,.25,C.frame,9);
   b.box(q.x,q.lo-.07,.035,q.w+.16,.09,.27,C.white,24);
  });
 }
 function face(name,x,z,angle,width,height,holes,red=true){b.local(x,0,z,angle,()=>group('face-'+name,()=>{
  const levels=[0,H.base,height,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>v>=0&&v<=height&&a.indexOf(v)===i).sort((a,b)=>a-b);
  for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.00001&&q.hi>=hi-.00001).sort((a,b)=>a.x-b.x);let cursor=0;
   const wall=(a,c)=>{if(c>a+.00001)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,hi<=H.base?C.base:C.white,24);};
   for(const q of cuts){wall(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}wall(cursor,width);
  }
  for(const q of holes)if(!q.open)window(q);
  b.box(width/2,H.base,.03,width,.055,.09,C.cream,24);
  if(red)eaves(width,height);
 }));}
 function standardHoles(width,count){const out=[],step=width/count;for(let i=0;i<count;i++){const x=(i+.5)*step;out.push({x,w:Math.min(3.15,step*.72),lo:4.72,hi:6.55,upper:true},{x,w:Math.min(2.25,step*.57),lo:1.52,hi:3.70},{x,w:Math.min(1.7,step*.48),lo:.20,hi:.64,vent:true});}return out;}
 function hip(name,x,z,w,d,eave,ridge){
  const swap=d>w,cross=swap?w:d,long=swap?d:w;
  b.local(x+w/2,0,z+d/2,swap?Math.PI/2:0,()=>b.local(-long/2,0,-cross/2,0,()=>group('roof-'+name,()=>{
   const lip=name==='entry'?1.08:1.02,a=-lip,c=long+lip,n=-lip,s=cross+lip,mid=cross/2,half=mid+lip;
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

 function entry(){group('entry',()=>{
  const width=EW-.72;
  face('entry-front',CX-EW/2,EF,0,EW,H.entry,[{x:EW/2,w:width,lo:H.landing,hi:3.55,open:true},{x:EW/2,w:width,lo:3.84,hi:7.15,open:true}]);
  face('entry-east-return',CX+EW/2,EF,Math.PI/2,EF-D,H.entry,[],false);
  face('entry-west-return',CX-EW/2,D,-Math.PI/2,EF-D,H.entry,[],false);
  // Four upper columns, two tall lower rows and a narrow top transom.
  for(let col=0;col<4;col++)for(const [lo,hi]of[[3.84,4.95],[4.95,6.68],[6.68,7.15]])b.box(CX-width/2+(col+.5)*width/4,(lo+hi)/2,EF-.14,width/4-.055,hi-lo-.055,.034,C.glass,5);
  for(let i=0;i<=4;i++)b.box(CX-width/2+i*width/4,5.495,EF-.016,.067,3.39,.25,C.frame,9);
  for(const y of[3.84,4.95,6.68,7.15])b.box(CX,y,EF-.016,width+.07,.067,.25,C.frame,9);
  const cuts=[-width/2,-2.2,-1.1,0,1.1,2.2,width/2];
  for(let i=1;i<cuts.length;i++)b.box(CX+(cuts[i-1]+cuts[i])/2,(H.landing+3.55)/2,EF-.14,cuts[i]-cuts[i-1]-.06,3.55-H.landing-.07,.034,C.glass,5);
  for(const x of cuts)b.box(CX+x,(H.landing+3.55)/2,EF-.015,.07,3.55-H.landing+.07,.25,C.frame,9);
  for(const y of[H.landing,3.12,3.55])b.box(CX,y,EF-.01,width+.07,.068,.25,C.frame,9);
  for(const x of[-2.04,-.94,.16,1.26])b.box(CX+x,2.12,EF+.16,.028,.37,.05,C.metal,9);
  b.box(CX,3.70,EF+.16,EW+.18,.20,.61,C.cream,21);
  b.box(CX,H.landing/2,EF+.46,8.7,H.landing,.94,C.stone,21);
  for(let i=0;i<8;i++){const high=(8-i)*.145,z=EF+.93+(i+.5)*.34;
   b.box(CX,high/2,z,8.2+i*.035,high,.34,C.stone,21);
   b.box(CX,high+.006,z+.148,8.2+i*.035,.012,.035,'#92998f',21);
  }
  for(const side of[-1,1]){
   const g=new G.Geometry(),a=CX+side*4.50,c=CX+side*4.64,n=EF+.03,s=EF+3.73,t=.27;
   const p=[[a-t,0,n],[a+t,0,n],[c+t,0,s],[c-t,0,s],[a-t,1.87,n],[a+t,1.87,n],[c+t,.46,s],[c-t,.46,s]];
   for(const q of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])g.quad(...q.map(i=>p[i]));mesh('stair-cheek-'+side,g,C.white,24);
   b.cyl(CX+side*3.62,H.landing,EF+.37,.32,.38,'#66645a',12,.82,21);
   b.cyl(CX+side*3.62,H.landing+.37,EF+.37,.08,.25,'#73624a',8,.8,6);
   const leaves=new G.Geometry();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=.72+(i%3)*.08,h=.20+(i%4)*.08,x=CX+side*3.62,z=EF+.37,y=H.landing+.62,dx=Math.cos(a),dz=Math.sin(a),sx=-dz*.105,sz=dx*.105;
    leaves.tri([x,y,z],[x+dx*.48+sx,y+h,z+dz*.48+sz],[x+dx*r,y-.08,z+dz*r]);leaves.tri([x,y,z],[x+dx*r,y-.08,z+dz*r],[x+dx*.48-sx,y+h,z+dz*.48-sz]);
   }mesh('potted-fronds-'+side,leaves,'#59794c',33);
  }
  // A thin loose board visible in the photo; no permanent ramp is inferred.
  const board=new G.Geometry(),x=CX-3.18,w=.90,z0=EF+1.12,z1=EF+3.86;
  const top=[[x-w/2,1.245,z0],[x+w/2,1.245,z0],[x+w/2,.072,z1],[x-w/2,.072,z1]],bottom=top.map(p=>[p[0],p[1]-.025,p[2]]);
  board.quad(...top);board.quad(...bottom.slice().reverse());for(let i=0;i<4;i++)board.quad(top[i],top[(i+1)%4],bottom[(i+1)%4],bottom[i]);mesh('loose-stair-board',board,'#b5a08a',20);
 });}
 b.local(O[0],0,O[1],R,()=>{
  group('floor',()=>mesh('footprint-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},.045),C.base,21));
  const left=CX-EW/2,rightStart=CX+EW/2,right=W-rightStart;
  face('south-west',0,D,0,left,H.wall,standardHoles(left,4));
  const eastHoles=[];for(let i=0;i<4;i++)eastHoles.push({x:(i+.5)*right/4,w:3.65,lo:4.72,hi:6.55,upper:true});
  for(const [x,w]of[[2.65,2.10],[8.25,2.48],[15.85,3.12]])eastHoles.push({x,w,lo:1.52,hi:3.70});
  for(const [x,w]of[[2.65,1.6],[8.25,1.9],[15.85,2.45],[19.05,1.30]])eastHoles.push({x,w,lo:.20,hi:.64,vent:true});
  face('south-east',rightStart,D,0,right,H.wall,eastHoles);
  const ring=f.geometry.coordinates[0].map(local);
  for(let i=0;i<ring.length-1;i++){if(i===1)continue;const p=ring[i],q=ring[i+1],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);face('perimeter-fitted-'+i,p[0],p[1],-Math.atan2(dz,dx),len,H.wall,standardHoles(len,Math.max(2,Math.round(len/5.4))));}
  hip('main-long',-.24,-.85,W+.35,D+.85,H.eave,H.ridge);
  hip('entry',CX-EW/2,D-4.8,EW,EF-D+4.8,8.54,9.80);
  entry();
  group('name-plaque',()=>{b.box(W-1.67,4.30,D+.075,2.62,.62,.12,C.gold,9);b.sign('\u751f\u7269\u6280\u672f\u697c',W-1.67,4.30,D+.141,2.46,.49,0,true);});
 });
 return{strategy:'building069-v46',visibleMainWindowRows:2,ventilatedBase:true,projectingGlazedEntry:true,plainRedEaves:true,openPortico:false,entranceFacing:'south-provisional',sourceOutlinePreserved:true,allFacadesVerified:false,completeRoofPlanVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building069={id:ID,render,W,D,EF,EW,CX,H,R,world,local};
})(YY);
