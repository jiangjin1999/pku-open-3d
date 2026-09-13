/* One building shared by the King Abdul Aziz library and the ancient books branch.
 * The official full south photograph fixes the porch, revolving door and facade.
 * Heights and dimensions are fitted; north/west windows remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/628032101';
const O=[-82.065,41.549],R=Math.atan2(2.232,57.204),CO=Math.cos(R),SI=Math.sin(R),W=Math.hypot(57.204,2.232),D=24.724;
const H={base:.58,level:3.42,wall:10.88,eave:11.52,ridge:16.60,top:17.28},ENTRY=27.65;
const C={brick:'#92978f',stone:'#c7c8b9',joint:'#aeb2a5',dark:'#444f48',frame:'#914636',glass:'#76918f',roof:'#81887c',tile:'#a1a594',red:'#973f32',green:'#355d4d',blue:'#38616a',gold:'#ae955f',metal:'#9da79d'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const bays=Array.from({length:12},(_,i)=>4+i*4.3);
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],pi=greater?p[axis]>=k:p[axis]<=k,qi=greater?q[axis]>=k:q[axis]<=k;if(pi)out.push(p);if(pi!==qi){const t=(k-p[axis])/(q[axis]-p[axis]);out.push(p.map((v,j)=>v+t*(q[j]-v)));}}return out;}
const half=D/2+1.45,roofY=(x,z)=>{const t=Math.max(0,Math.min(1,(x+1.45)/half,(W+1.45-x)/half,(z+1.45)/half,(D+1.45-z)/half));return H.eave+(H.ridge-H.eave)*Math.pow(t,1.35)+.18*Math.pow(1-t,12);};
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'064-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,c,mat=24)=>b.mesh('064-'+key,g,0,0,0,1,1,1,c,mat);
 function diamond(x,y,z,w,h){b.mesh('064-diamond',b.geo('064-diamond',()=>{const g=new G.Geometry();g.quad([-.5,0,0],[0,-.5,0],[.5,0,0],[0,.5,0]);return g;}),x,y,z,w,h,1,C.joint,24);}
 function window(x,lo,hi,w){
  b.box(x,(lo+hi)/2,-.13,w-.1,hi-lo-.1,.035,C.glass,5);
  for(const xx of[x-w/2,x+w/2])b.box(xx,(lo+hi)/2,-.01,.10,hi-lo+.12,.23,C.frame,6);
  for(const y of[lo,hi,hi-.47])b.box(x,y,.005,w+.09,.09,.24,C.frame,6);
  for(const dx of[-w/4,0,w/4])b.box(x+dx,(lo+hi)/2,.013,.065,hi-lo,.17,C.frame,6);
  b.box(x,lo-.10,.02,w+.30,.13,.36,C.stone,24);
 }
 function face(name,x,z,rot,width,positions,south=false){b.local(x,0,z,rot,()=>group('face-'+name,()=>{
  const openings=[];
  for(let fl=0;fl<3;fl++)for(const u of positions){
   // The southern entrance replaces two ordinary ground-floor bays.
   if(south&&fl===0&&Math.abs(u-ENTRY)<3)continue;
   const lo=fl===0?1.12:fl===1?4.83:8.63,hi=fl===0?3.89:fl===1?7.18:10.28;
   openings.push({x:u,w:fl===2?2.78:2.87,lo,hi});
  }
  if(south)openings.push({x:ENTRY,w:5.20,lo:H.base,hi:4.02,door:true});
  const levels=[H.base,...openings.flatMap(q=>[q.lo,q.hi]),H.wall].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  const wall=(a,c,lo,hi)=>{if(c-a>1e-5)b.box((a+c)/2,(lo+hi)/2,-.16,c-a,hi-lo,.32,C.brick,30);};
  for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],holes=openings.filter(q=>q.lo<=lo+.001&&q.hi>=hi-.001).sort((a,b)=>a.x-b.x);let cursor=0;for(const q of holes){wall(cursor,q.x-q.w/2,lo,hi);cursor=q.x+q.w/2;}wall(cursor,width,lo,hi);}
  for(const q of openings)if(!q.door)group('window',()=>window(q.x,q.lo,q.hi,q.w));
  for(const [a,c]of south?[[0,ENTRY-2.6],[ENTRY+2.6,width]]:[[0,width]])b.box((a+c)/2,H.base/2,.015,c-a,H.base,.37,C.stone,24);
  b.box(width/2,4.29,.055,width,.69,.42,C.stone,24);
  for(const u of positions){
   b.box(u,7.91,.024,3.05,1.10,.39,C.stone,24);
   b.box(u,8.20,.239,3.0,.055,.027,C.joint,24);
   b.box(u,7.48,.239,3.0,.055,.027,C.joint,24);
   diamond(u,7.67,.245,.35,.27);
   for(const dx of[-1.13,1.13])diamond(u+dx,7.67,.245,.26,.44);
  }
  // Narrow vertical recesses, distinct from a projecting colonnade.
  for(let i=0;i<positions.length-1;i++){const u=(positions[i]+positions[i+1])/2;b.box(u,7.57,.019,.095,6.13,.045,C.dark,24);}
  b.box(width/2,10.80,.14,width+.20,.24,.66,C.red,6);
  b.box(width/2,11.05,.35,width+.38,.23,.86,C.green,6);
  for(let u=.35;u<width;u+=.35){b.box(u,11.36,.51,.11,.14,1.37,C.red,6);b.box(u,11.365,1.17,.115,.14,.085,C.gold,24);}
  for(let u=1.10;u<width;u+=1.82){
   b.box(u,10.81,.49,.21,.25,.54,C.green,6);b.box(u,11.01,.66,.65,.12,.71,C.blue,6);
   for(const dx of[-.24,.24])b.box(u+dx,11.15,.80,.13,.18,.53,C.green,6);
   b.box(u,11.19,.92,.78,.10,.56,C.green,6);b.box(u,11.0,1.035,.50,.034,.028,C.gold,24);
  }
 }));}
 function roof(){
  const a=-1.45,c=W+1.45,n=-1.45,s=D+1.45,m=D/2,cut=D/2,polys=[[[a,n],[c,n],[W-cut,m],[cut,m]],[[cut,m],[W-cut,m],[c,s],[a,s]],[[a,n],[cut,m],[a,s]],[[W-cut,m],[c,n],[c,s]]];
  b.box(W/2,11.48,D/2,W+.15,.14,D+.15,C.dark,24);
  for(let side=0;side<4;side++){
   const p=polys[side],axis=side<2?1:0,across=1-axis,g=new G.Geometry(),tiles=new G.Geometry(),lo=Math.min(...p.map(q=>q[axis])),hi=Math.max(...p.map(q=>q[axis]));
   const emit=(geo,poly,dy)=>{for(let j=1;j<poly.length-1;j++)geo.tri(...[poly[0],poly[j],poly[j+1]].map(q=>[q[0],roofY(...q)+dy,q[1]]));};
   const strips=Array.from({length:24},(_,j)=>clip(clip(p,axis,lo+(hi-lo)*j/24,true),axis,lo+(hi-lo)*(j+1)/24,false));
   for(const q of strips)emit(g,q,0);
   const l=Math.min(...p.map(q=>q[across])),r=Math.max(...p.map(q=>q[across]));
   for(let u=l+.11;u<r;u+=.265)for(let k=0;k<4;k++)for(const q of strips){const t=u-.041+k*.0205,part=clip(clip(q,across,t,true),across,t+.0205,false);emit(tiles,part,.018+Math.sin((k+.5)*Math.PI/4)*.035);}
   tiles.detailWidth=.0205;mesh('roof-surface-'+side,g,C.roof,2);mesh('roof-tile-ribs-'+side,tiles,C.tile,2);
  }
  b.box(W/2,16.65,m,W-D+.15,.16,.39,C.tile,2);
  for(const x of[D/2,W-D/2]){b.box(x,16.87,m,.34,.37,.40,C.tile,2);b.sphere(x,17.13,m,.24,.15,.20,C.tile,2,0,true);b.beam([x,16.80,m],[x+(x<W/2?-.45:.45),17.10,m],.12,C.tile,2);}
  for(const [p,q]of[[[a,n],[cut,m]],[[a,s],[cut,m]],[[c,n],[W-cut,m]],[[c,s],[W-cut,m]]])for(let j=0;j<24;j++){const v=p.map((x,k)=>x+(q[k]-x)*j/24),w=p.map((x,k)=>x+(q[k]-x)*(j+1)/24);b.beam([v[0],roofY(...v)+.085,v[1]],[w[0],roofY(...w)+.085,w[1]],.09,C.tile,2);}
 }
 function porch(){group('south-porch',()=>{
  const w=22.8,front=D+3.55,x0=ENTRY-w/2,x1=ENTRY+w/2;
  b.box(ENTRY,H.base/2,D+1.75,w+.26,H.base,3.74,C.stone,24);
  b.box(ENTRY,4.30,D+1.75,w+.36,.46,3.95,C.stone,24);
  for(let u=x0;u<=x1;u+=.75)b.box(u,4.30,front+.24,.017,.43,.018,C.joint,24);
  // Four compound grey-brick piers frame three open bays; the central bay is wider.
  for(const x of[ENTRY-10.8,ENTRY-4.3,ENTRY+4.3,ENTRY+10.8]){
   b.box(x,2.31,front-.35,.86,3.54,.68,C.brick,30);
   for(const dx of[-.46,.46])b.box(x+dx,2.31,front-.35,.29,3.54,.96,C.brick,30);
   b.box(x,.82,front-.35,1.16,.48,1.02,C.stone,24);b.box(x,4.025,front-.35,1.18,.15,1.04,C.dark,24);
  }
  // Solid lower balustrade with a real slot under its upper rail.
  const rail=(x,z,length,rot)=>b.local(x,0,z,rot,()=>{
   b.box(0,4.74,0,length,.34,.23,C.stone,24);b.box(0,5.23,0,length,.15,.27,C.stone,24);
   const count=Math.ceil(length/1.85);for(let k=0;k<=count;k++)b.box(-length/2+k*length/count,5.08,0,.19,.67,.29,C.stone,24);
  });
  rail(ENTRY,front+.1,w+.10,0);rail(x0,D+1.8,3.6,Math.PI/2);rail(x1,D+1.8,3.6,Math.PI/2);
 });
 group('revolving-entrance',()=>{
  const z=D+.12,lo=H.base,hi=3.90;
  b.box(ENTRY,2.22,D-1.75,5.2,3.3,.12,C.dark,24);
  b.box(ENTRY,3.78,z,5.2,.47,.13,C.glass,5);
  for(const x of[ENTRY-2.62,ENTRY+2.62])b.box(x,2.22,z,.11,3.3,.15,C.frame,6);
  for(const y of[lo,3.52,4.02])b.box(ENTRY,y,z,5.35,.11,.17,C.frame,6);
  for(const dx of[-2.04,2.04]){b.box(ENTRY+dx,2.12,z,1.03,3.0,.06,C.glass,5);b.box(ENTRY+Math.sign(dx)*1.5,2.12,z+.05,.085,3.0,.18,C.frame,6);}
  b.cyl(ENTRY,3.22,D+.45,1.50,.23,C.gold,36,1,9);
  b.cyl(ENTRY,.59,D+.45,.035,2.75,C.gold,12,1,9);
  for(let j=0;j<3;j++)b.local(ENTRY,0,D+.45,j*Math.PI*2/3+.18,()=>{
   b.mesh('064-revolving-clear-'+j,b.geo('plane',G.plane),.66,1.96,0,1.29,2.67,1,C.glass,44);
   for(const x of[0,1.32])b.box(x,1.96,.045,.035,2.70,.045,C.gold,9);
   for(const y of[.62,3.3])b.box(.66,y,.045,1.34,.038,.045,C.gold,9);
  });
 });
 group('entry-approach',()=>{
  const z0=D+3.5,z1=D+7.0,x0=ENTRY-3.85,x1=ENTRY+3.85,g=new G.Geometry();
  g.quad([x0,H.base,z0],[x1,H.base,z0],[x1,.04,z1],[x0,.04,z1]);mesh('entrance-incline',g,C.stone,21);
  for(const x of[x0,x1]){for(let j=0;j<=4;j++){const t=j/4,z=z0+(z1-z0)*t,y=H.base+(.04-H.base)*t;b.box(x,y+.48,z,.035,.96,.035,C.metal,9);}b.beam([x,H.base+.96,z0],[x,1,z1],.022,C.metal,9);}
 });}
 b.local(O[0],0,O[1],R,()=>{
  group('floor',()=>mesh('base-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},H.base),C.stone,21));
  face('south',0,D,0,W,bays,true);
  face('north-fitted',W,0,Math.PI,W,bays.map(x=>W-x).reverse());
  face('east-partly-seen',W,D,Math.PI/2,D,[4.8,9.8,14.8,19.8]);
  face('west-fitted',0,0,-Math.PI/2,D,[4.8,9.8,14.8,19.8]);
  group('roof',roof);porch();
 });
 return{strategy:'building064-v46',floors:3,basementFloors:3,oneSharedLibrary:true,southPorch:true,revolvingDoor:true,courtyardHole:false,fullFacadeVerified:false,heightMeasured:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building064={id:ID,render,W,D,H,ENTRY,world,local,bays,roofY};
})(YY);
