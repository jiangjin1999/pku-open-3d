/* Beijing NMR Center: its official banner and satellite roof signature.
 * Two visible storeys, two west-slope dormers, low flat terminal wings and
 * a flat brick entrance. Hidden elevations and measured dimensions stay open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/866277589';
const O=[-195.464,371.677],R=-Math.atan2(40.372,2.067),CO=Math.cos(R),SI=Math.sin(R);
const W=Math.hypot(40.372,2.067),D=14.24,WING_D=21.32,M0=4.7,NORTH=10.674,SOUTH=31.354,ENTRY=21.0,PORCH=D+3.0;
const H={base:.55,main:7.93,wing:5.72,portico:5.82,eave:8.12,ridge:11.62,landing:.725};
const C={brick:'#9b9e96',darkBrick:'#878d83',stone:'#c4c6bc',white:'#e0e1d9',red:'#853c37',glass:'#778f92',metal:'#b0b7ad',roof:'#7b817a',tile:'#a3a79d',deck:'#8b9285',dark:'#46514c'};
const DORMERS=[14.0,23.5],DF=12.25,DW=2.8,DE=10.49,DR=11.43,LIP=.55,HALF=D/2+LIP;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const roofY=(x,z)=>H.eave+(H.ridge-H.eave)*Math.max(0,Math.min(1,(x-M0+LIP)/HALF,(SOUTH+LIP-x)/HALF,(z+LIP)/HALF,(D+LIP-z)/HALF));
const roofZ=y=>D+LIP-(y-H.eave)/(H.ridge-H.eave)*HALF;
function clip(poly,evalSide,inside=true){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=evalSide(p),c=evalSide(q),pi=inside?a>=-1e-9:a<=1e-9,qi=inside?c>=-1e-9:c<=1e-9;if(pi)out.push(p);if(pi!==qi){const t=a/(a-c);out.push(p.map((v,k)=>v+(q[k]-v)*t));}}return out;}
function subtract(poly,hole){let carry=poly;const result=[];for(let i=0;i<hole.length&&carry.length>=3;i++){const p=hole[i],q=hole[(i+1)%hole.length],side=v=>(q[0]-p[0])*(v[1]-p[1])-(q[1]-p[1])*(v[0]-p[0]);const outer=clip(carry,side,false);if(outer.length>=3)result.push(outer);carry=clip(carry,side,true);}return result;}
const dormerHole=x=>[[x-DW/2,roofZ(DE)],[x,roofZ(DR)],[x+DW/2,roofZ(DE)],[x+DW/2,DF],[x-DW/2,DF]];
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'071-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('071-'+name,g,0,0,0,1,1,1,c,mat);
 function window(q){const h=q.hi-q.lo,y=(q.lo+q.hi)/2;
  b.box(q.x,y,-.13,q.w-.07,h-.07,.035,C.glass,5);
  for(const x of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(x,y,-.015,.056,h+.05,.22,C.red,6);
  for(const yy of[q.lo,q.hi,q.hi-.38])b.box(q.x,yy,-.015,q.w+.07,.056,.22,C.red,6);
  b.box(q.x,q.hi+.06,.025,q.w+.15,.075,.28,C.stone,24);
  b.box(q.x,q.lo-.055,.02,q.w+.18,.09,.30,C.stone,24);
 }
 function face(name,x,z,angle,width,height,holes){b.local(x,0,z,angle,()=>group(name,()=>{
  const levels=[0,H.base,height,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>v>=0&&v<=height&&a.indexOf(v)===i).sort((a,b)=>a-b);
  for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.00001&&q.hi>=hi-.00001).sort((a,b)=>a.x-b.x);let cursor=0;
   const wall=(a,c)=>{if(c>a+.00001)b.box((a+c)/2,(lo+hi)/2,-.19,c-a,hi-lo,.38,hi<=H.base?C.stone:C.brick,hi<=H.base?24:30);};
   for(const q of cuts){wall(cursor,q.x-q.w/2);cursor=q.x+q.w/2;}wall(cursor,width);
  }
  for(const q of holes)if(!q.open){if(q.vent)group('vent',()=>{b.box(q.x,(q.lo+q.hi)/2,-.14,q.w,q.hi-q.lo,.04,C.dark,24);for(let i=0;i<5;i++)b.box(q.x,q.lo+(i+.5)*(q.hi-q.lo)/5,.012,q.w,.025,.20,C.white,24);b.box(q.x,q.hi+.09,.075,q.w+.38,.11,.38,C.stone,24);});else group('window',()=>window(q));}
  if(height>7)b.box(width/2,4.34,.005,width,.16,.41,C.darkBrick,30);
 }));}
 function holes(width,count,upper=true){const out=[],step=width/count;for(let i=0;i<count;i++){const x=(i+.5)*step;out.push({x,w:Math.min(1.30,step*.52),lo:1.38,hi:3.38});if(upper)out.push({x,w:Math.min(1.23,step*.49),lo:5.76,hi:7.48});}return out;}
 function wing(name,poly){group('wing-'+name,()=>{
  mesh('wing-'+name+'-deck',G.polygon(poly,5.78),C.deck,25);
  for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),rot=-Math.atan2(dz,dx),count=Math.max(1,Math.round(len/3.25));
   const list=holes(len,count,false).map(v=>({...v,lo:1.60,hi:3.87,w:Math.min(1.55,len/count*.48)}));
   face('elevation-'+i,p[0],p[1],rot,len,H.wing,list);
   b.local(p[0],0,p[1],rot,()=>{
    for(const [y,h,depth]of[[4.90,.14,.48],[5.36,.11,.53],[5.82,.28,.60],[6.04,.12,.72]])b.box(len/2,y,-.01,len+.08,h,depth,C.darkBrick,30);
    for(const u of[.20,len-.20])b.box(u,2.65,.02,.38,5.3,.50,C.darkBrick,30);
   });
  }
 });}
 function mainRoof(){const a=M0-LIP,c=SOUTH+LIP,n=-LIP,s=D+LIP,mid=D/2,l=M0+D/2,r=SOUTH-D/2;
  const polys=[[[a,n],[c,n],[r,mid],[l,mid]],[[c,n],[c,s],[r,mid]],[[a,s],[l,mid],[r,mid],[c,s]],[[a,n],[l,mid],[a,s]]];
  const holes=DORMERS.map(dormerHole),cut=p=>holes.reduce((parts,h)=>parts.flatMap(q=>subtract(q,h)),[p]);
  const emit=(geo,p)=>{for(let j=1;j<p.length-1;j++){const pts=[p[0],p[j],p[j+1]],area=(pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])-(pts[1][1]-pts[0][1])*(pts[2][0]-pts[0][0]);if(Math.abs(area)<1e-9)continue;const order=area<0?pts:[pts[0],pts[2],pts[1]];geo.tri(...order.map(q=>[q[0],roofY(...q),q[1]]));}};
  for(let side=0;side<4;side++){const p=polys[side],g=new G.Geometry(),ribs=new G.Geometry(),axis=side%2?1:0;
   for(const q of side===2?cut(p):[p])emit(g,q);
   const lo=Math.min(...p.map(v=>v[axis])),hi=Math.max(...p.map(v=>v[axis]));
   for(let u=lo+.035;u<hi;u+=.205)for(let k=0;k<3;k++){
    const strip=clip(clip(p,v=>v[axis]-(u+k*.022)),v=>(u+(k+1)*.022)-v[axis]);
    for(const q of side===2?cut(strip):[strip]){const part=new G.Geometry();emit(part,q);for(let j=1;j<part.v.length;j+=8)part.v[j]+=.018+Math.sin((k+.5)*Math.PI/3)*.025;ribs.v.push(...part.v);}
   }
   ribs.detailWidth=.022;mesh('main-roof-surface-'+side,g,C.roof,2);mesh('main-roof-ribs-'+side,ribs,C.tile,2);
  }
  group('main-roof-trim',()=>{
   b.box((l+r)/2,H.ridge+.05,mid,r-l+.10,.12,.23,C.tile,2);
   for(const [p,q]of[[[a,n],[l,mid]],[[a,s],[l,mid]],[[c,n],[r,mid]],[[c,s],[r,mid]]])b.beam([p[0],H.eave+.055,p[1]],[q[0],H.ridge+.055,q[1]],.055,C.tile,2);
   for(const z of[n+.07,s-.07])b.box((a+c)/2,H.eave-.15,z,c-a,.28,.32,C.white,24);
   for(const x of[a+.07,c-.07])b.box(x,H.eave-.15,mid,.32,.28,s-n,C.white,24);
  });
 }
 function dormer(x,index){const a=x-DW/2,c=x+DW/2,sideZ=roofZ(DE),ridgeZ=roofZ(DR),base=roofY(x,DF)-.03;
  group('dormer-'+index,()=>{
   const aperture={x:DW/2,w:1.98,lo:9.39,hi:10.32};
   b.local(a,0,DF,0,()=>{
    b.box(DW/2,(base+aperture.lo)/2,-.085,DW,aperture.lo-base,.17,C.white,24);
    const jamb=(DW-aperture.w)/2;for(const xx of[jamb/2,DW-jamb/2])b.box(xx,(base+DE)/2,-.085,jamb,DE-base,.17,C.white,24);
    b.box(DW/2,(aperture.hi+DE)/2,-.085,DW,DE-aperture.hi,.17,C.white,24);
    group('window',()=>window(aperture));
   });
   const gable=new G.Geometry();gable.tri([a,DE,DF],[c,DE,DF],[x,DR,DF]);mesh('dormer-gable-'+index,gable,C.white,24);
   for(const [side,outer]of[[-1,a],[1,c]]){
    const roof=new G.Geometry();roof.tri([outer,DE,DF+.14],[x,DR,DF+.14],[x,DR,ridgeZ]);roof.tri([outer,DE,DF+.14],[x,DR,ridgeZ],[outer,DE,sideZ]);
    mesh('dormer-roof-'+index+'-'+side,roof,C.roof,2);
    const cheek=new G.Geometry();cheek.tri([outer,base,DF],[outer,DE,DF],[outer,DE,sideZ]);mesh('dormer-cheek-'+index+'-'+side,cheek,C.white,24);
    // Thick white bargeboards, with a true sloping profile rather than a flat lintel.
    const bar=new G.Geometry(),p=[outer+side*.15,DE-.03,DF+.18],q=[x,DR+.10,DF+.18],t=.18;
    bar.quad(p,q,[q[0],q[1]-t,q[2]],[p[0],p[1]-t,p[2]]);mesh('dormer-bargeboard-'+index+'-'+side,bar,C.white,24);
    b.beam([outer,DE-.03,DF],[outer,DE-.03,sideZ],.065,C.white,24);
   }
  });
 }
 function portico(){group('portico',()=>{
  const w=7.5,z=PORCH;
  for(const dx of[-w/2+.34,w/2-.34])b.box(ENTRY+dx,2.43,D+1.48,.68,3.41,3.30,C.brick,30);
  b.box(ENTRY,4.79,D+1.45,w,1.34,3.42,C.brick,30);
  for(const[y,h,depth,width]of[[4.17,.17,3.51,7.57],[5.42,.14,3.57,7.70],[5.72,.20,3.62,7.82]])b.box(ENTRY,y,D+1.47,width,h,depth,C.darkBrick,30);
  b.box(ENTRY,5.835,D+1.48,7.3,.03,3.14,C.deck,25);
  b.box(ENTRY,H.landing/2,D+1.60,7.54,H.landing,3.28,C.stone,21);
  for(const dx of[-3.43,3.43])b.box(ENTRY+dx,3.72,z+.19,.72,.19,.49,C.stone,24);
  // Deep dark four-part glazed doorway set back behind the two brick returns.
  const front=D+.11,width=5.98,edges=[-width/2,-1.51,0,1.51,width/2];
  for(let i=1;i<edges.length;i++)b.box(ENTRY+(edges[i-1]+edges[i])/2,2.28,front-.11,edges[i]-edges[i-1]-.07,3.06,.036,C.glass,5);
  for(const dx of edges)b.box(ENTRY+dx,2.29,front,.075,3.20,.22,C.dark,9);
  for(const y of[H.landing,3.43,3.88])b.box(ENTRY,y,front,width+.07,.075,.22,C.dark,9);
  for(const dx of[-.19,.19])b.box(ENTRY+dx,2.19,front+.135,.027,.43,.035,C.metal,9);
  b.box(ENTRY-3.42,3.38,PORCH+.192,.86,.50,.045,C.white,24);
  b.sign('北京核磁共振中心',ENTRY-3.42,3.40,PORCH+.219,.79,.18,0,true);
 });
 group('stairs',()=>{
  for(let i=0;i<5;i++){const h=(5-i)*.145;b.box(ENTRY,h/2,PORCH+.23+(i+.5)*.34,7.38,h,.34,C.stone,21);}
  for(const side of[-1,1]){const g=new G.Geometry(),x=ENTRY+side*3.94,w=.40,z0=PORCH+.16,z1=PORCH+2.06,p=[[x-w/2,0,z0],[x+w/2,0,z0],[x+w/2,0,z1],[x-w/2,0,z1],[x-w/2,.91,z0],[x+w/2,.91,z0],[x+w/2,.12,z1],[x-w/2,.12,z1]];
   for(const q of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])g.quad(...q.map(i=>p[i]));mesh('stair-cheek-'+side,g,C.stone,24);
  }
 });}
 b.local(O[0],0,O[1],R,()=>{
  mesh('footprint-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},.045),C.stone,21);
  const front=holes(SOUTH-M0,12).filter(q=>q.lo>5||Math.abs(q.x+M0-ENTRY)>3.25);
  front.push({x:ENTRY-M0,w:6.14,lo:H.landing,hi:3.95,open:true});
  for(const q of front.slice())if(q.lo<2&&!q.open&&q.x+M0>NORTH+.7)front.push({x:q.x,w:1.1,lo:.25,hi:.72,vent:true});
  face('main-west',M0,D,0,SOUTH-M0,H.main,front);
  face('main-east',SOUTH,0,Math.PI,SOUTH-M0,H.main,holes(SOUTH-M0,12));
  face('main-north',M0,0,-Math.PI/2,D,H.main,holes(D,5));
  face('main-south',SOUTH,D,Math.PI/2,D,H.main,holes(D,5));
  wing('north',[[0,0],[0,WING_D],[NORTH,WING_D],[NORTH,D],[M0,D],[M0,0]]);
  wing('south',[[SOUTH,0],[SOUTH,WING_D],[W,WING_D],[W,0]]);
  mainRoof();DORMERS.forEach(dormer);portico();
 });
 return{strategy:'building071-v46',twoVisibleStoreysVerified:true,westSlopeDormers:2,lowFlatTerminalWings:true,flatBrickPortico:true,sourceOutlinePreserved:true,entranceFacing:'west-satellite-matched',entranceCompassVerified:false,atticFloorConventionVerified:false,allFacadesVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building071={id:ID,render,O,R,W,D,WING_D,M0,NORTH,SOUTH,ENTRY,PORCH,H,DORMERS,DF,roofY,dormerHole,world,local};
})(YY);
