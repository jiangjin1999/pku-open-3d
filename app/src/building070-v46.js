/* Integrated Science Research Center No. 2. Own college photograph and the
 * first part of the 2022 fire-drill report, registered against the south block
 * in satellite imagery. Entrance compass and hidden elevations remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/866277585';
const O=[-301.253,392.596],R=Math.atan2(2.887,74.113),CO=Math.cos(R),SI=Math.sin(R);
const W=74.17,D=23.49,X=48.32,Z=61.07,ENTRY=60.1;
const H={base:.60,brick:16.0,upper:19.83,eave:20.15,ridge:23.80,landing:.66};
const C={brick:'#959da1',stone:'#d2d1c8',joint:'#acaea8',white:'#e4e5df',glass:'#6e8f9c',frame:'#465f6f',roof:'#a4aaa1',rib:'#bbc0b7',deck:'#626c66',metal:'#a8b3b1',dark:'#344750'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],pi=greater?p[axis]>=k:p[axis]<=k,qi=greater?q[axis]>=k:q[axis]<=k;if(pi)out.push(p);if(pi!==qi){const t=(k-p[axis])/(q[axis]-p[axis]);out.push(p.map((v,j)=>v+t*(q[j]-v)));}}return out;}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'070-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,c,mat=24)=>b.mesh('070-'+key,g,0,0,0,1,1,1,c,mat);
 function window(q){const h=q.hi-q.lo,y=(q.lo+q.hi)/2;
  b.box(q.x,y,-.17,q.w-.07,h-.07,.035,C.glass,5);
  for(const x of[q.x-q.w/2,q.x+q.w/2,q.x-q.w*.18])b.box(x,y,-.045,.068,h+.04,.27,C.frame,9);
  for(const yy of[q.lo,q.hi,q.hi-(q.upper?.37:.52)])b.box(q.x,yy,-.045,q.w+.07,.068,.27,C.frame,9);
  b.box(q.x,q.hi+.12,.032,q.w+.18,.18,.43,C.stone,24);
  b.box(q.x,q.lo-.065,.015,q.w+.15,.09,.36,C.brick,30);
 }
 function face(name,x,z,angle,width,count,{upper=false,door=false,piers=false,blankRight=0}={}){b.local(x,0,z,angle,()=>group(name,()=>{
  const min=upper?16.32:H.base,max=upper?H.upper:H.brick,holes=[],usable=width-blankRight,step=usable/count;
  for(let fl=0;fl<(upper?1:4);fl++)for(let i=0;i<count;i++){
   const u=(i+.5)*step,w=Math.min(upper?2.45:2.92,step*.61);
   if(door&&fl<2&&Math.abs(x+u-ENTRY)<5.6)continue;
   const lo=upper?17.01:1.1+fl*3.7,hi=upper?18.66:3.64+fl*3.7;
   holes.push({x:u,w,lo,hi,upper});
  }
  if(door)holes.push({x:ENTRY-x,w:8.7,lo:H.base,hi:8.46,open:true});
  const levels=[min,max,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  const wall=(a,c,lo,hi)=>{if(c>a+.00001)b.box((a+c)/2,(lo+hi)/2,-.23,c-a,hi-lo,.46,upper?C.white:C.brick,upper?24:30);};
  for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.00001&&q.hi>=hi-.00001).sort((a,b)=>a.x-b.x);let cursor=0;for(const q of cuts){wall(cursor,q.x-q.w/2,lo,hi);cursor=q.x+q.w/2;}wall(cursor,width,lo,hi);}
  for(const q of holes)if(!q.open)group('window',()=>window(q));
  if(!upper){
   for(const[a,c]of door?[[0,ENTRY-x-4.35],[ENTRY-x+4.35,width]]:[[0,width]])b.box((a+c)/2,H.base/2,-.18,c-a,H.base,.57,C.stone,24);
   if(piers)for(let i=0;i<=count;i++){const u=i*step;if(door&&Math.abs(x+u-ENTRY)<5.3)continue;b.box(u,8.32,.05,.76,15.34,.62,C.brick,30);}
   b.box(width/2,16.12,-.06,width+.05,.24,.85,C.white,24);
  }
 }));}
 function parapet(x,z,w,d){group('white-eaves',()=>{
  // White deep soffit around the inset fifth floor; the pitched roof starts above it.
  for(const y of[16.25,19.95]){const thick=y<17?.20:.30;
   b.box(x+w/2,y,z,w+.45,thick,.98,C.white,24);b.box(x+w/2,y,z+d,w+.45,thick,.98,C.white,24);
   b.box(x,y,z+d/2,.98,thick,d,C.white,24);b.box(x+w,y,z+d/2,.98,thick,d,C.white,24);
  }
 });}
 function roof(name,outer,inner){
  const [a,n,c,s]=outer,[l,t,r,u]=inner,e=H.eave,h=H.ridge;
  const polys=[[[a,e,n],[c,e,n],[r,h,t],[l,h,t]],[[c,e,n],[c,e,s],[r,h,u],[r,h,t]],[[c,e,s],[a,e,s],[l,h,u],[r,h,u]],[[a,e,s],[a,e,n],[l,h,t],[l,h,u]]];
  for(let side=0;side<4;side++){
   const p=polys[side],g=new G.Geometry(),ribs=new G.Geometry(),axis=side%2?2:0;
   const emit=(geo,poly,dy)=>{for(let j=1;j<poly.length-1;j++)geo.tri(...[poly[0],poly[j+1],poly[j]].map(q=>[q[0],q[1]+dy,q[2]]));};
   emit(g,p,0);const lo=Math.min(...p.map(q=>q[axis])),hi=Math.max(...p.map(q=>q[axis]));
   for(let v=lo+.07;v<hi;v+=.24)for(let k=0;k<3;k++)emit(ribs,clip(clip(p,axis,v+k*.02,true),axis,v+(k+1)*.02,false),.018+Math.sin((k+.5)*Math.PI/3)*.025);
   ribs.detailWidth=.02;mesh('roof-'+name+'-slope-'+side,g,C.roof,2);mesh('roof-'+name+'-ribs-'+side,ribs,C.rib,2);
  }
  if(r-l>.1&&u-t>.1){mesh(name+'-service-terrace',G.polygon([[l,t],[r,t],[r,u],[l,u]],h+.01),C.deck,7);
   group('roof-service',()=>{for(const xx of[l+7,l+20,l+34])if(xx<r-2){b.box(xx,h+.16,(t+u)/2,1.1,.32,1.75,C.metal,9);for(let k=0;k<6;k++)b.box(xx-.44+k*.176,h+.34,(t+u)/2,.025,.045,1.65,C.dark,9);}});
  }else group('roof-ridge',()=>b.box((l+r)/2,h+.08,(t+u)/2,.22,.17,u-t+.15,C.rib,2));
  group('roof-hips',()=>{for(let i=0;i<4;i++){const p=polys[i];b.beam(p[0].map((v,k)=>v+(k===1?.055:0)),p[3].map((v,k)=>v+(k===1?.055:0)),.072,C.rib,2);}});
 }
 function atrium(){const p=[[10.1,24.3],[47.8,24.3],[47.8,58.2]],height=(x,z)=>6.1-(z-24.3)*.065;
  const g=new G.Geometry();g.tri(...[p[0],p[2],p[1]].map(q=>[q[0],height(...q),q[1]]));mesh('atrium-glass',g,'#789a9c',44);
  mesh('atrium-floor',G.polygon(p,.15),C.stone,21);
  group('atrium-frame',()=>{const grid=new G.Geometry();
   for(let axis=0;axis<2;axis++){const lo=Math.min(...p.map(q=>q[axis])),hi=Math.max(...p.map(q=>q[axis]));for(let k=lo+1.4;k<hi;k+=2.05){const strip=clip(clip(p,axis,k,true),axis,k+.12,false);for(let j=1;j<strip.length-1;j++)grid.tri(...[strip[0],strip[j+1],strip[j]].map(v=>[v[0],height(...v)+.038,v[1]]));}}
   grid.detailWidth=.12;mesh('atrium-grid',grid,C.frame,9);
   for(let i=0;i<3;i++){const a=p[i],c=p[(i+1)%3];b.beam([a[0],height(...a)+.07,a[1]],[c[0],height(...c)+.07,c[1]],.11,C.frame,9);}
  });
  const a=p[0],c=p[2],len=Math.hypot(c[0]-a[0],c[1]-a[1]),count=Math.ceil(len/2.4);
  group('atrium-diagonal',()=>{const glass=new G.Geometry();for(let i=0;i<count;i++){
   const v=a.map((q,k)=>q+(c[k]-q)*i/count),w=a.map((q,k)=>q+(c[k]-q)*(i+1)/count);
   glass.quad([v[0],.68,v[1]],[w[0],.68,w[1]],[w[0],height(...w),w[1]],[v[0],height(...v),v[1]]);
   b.beam([v[0],.20,v[1]],[v[0],height(...v),v[1]],.075,C.frame,9);
   b.beam([v[0],.45,v[1]],[w[0],.45,w[1]],.20,C.stone,24);
  }mesh('atrium-diagonal-glass',glass,C.glass,44);});
 }
 function entrance(){group('entrance',()=>{
  const x=ENTRY,z=Z+.04;
  // Tall outer stone portal and the smaller inset door frame visible in the fire-drill photo.
  for(const dx of[-4.13,4.13])b.box(x+dx,4.53,z+.26,1.32,7.74,.96,C.stone,24);
  b.box(x,8.04,z+.26,9.58,.78,.96,C.stone,24);
  for(const dx of[-3.35,3.35])b.box(x+dx,4.3,z+.05,.17,7.27,.51,C.stone,24);
  b.box(x,7.69,z+.05,6.85,.22,.51,C.stone,24);
  for(const dx of[-1.80,1.80])b.box(x+dx,2.80,z+.31,.38,4.28,.57,C.stone,24);
  b.box(x,4.85,z+.31,3.98,.45,.57,C.stone,24);
  for(const dx of[-2.47,2.47])b.box(x+dx,4.03,z-.21,1.33,6.68,.035,C.glass,5);
  b.box(x,6.23,z-.21,3.20,2.18,.035,C.glass,5);
  for(const dx of[-.79,.79])b.box(x+dx,2.30,z-.20,1.51,3.26,.035,C.glass,5);
  b.box(x,4.25,z-.20,3.19,.54,.035,C.glass,5);
  for(const dx of[-3.14,-1.64,0,1.64,3.14])b.box(x+dx,2.98,z-.08,.075,4.62,.18,C.frame,9);
  for(const yy of[H.landing,3.95,4.56,7.42])b.box(x,yy,z-.08,6.38,.075,.18,C.frame,9);
  for(const dx of[-.15,.15])b.box(x+dx,2.14,z+.03,.026,.38,.035,C.metal,9);
  for(const side of[-1,1])for(let yy=1.42;yy<8.15;yy+=.74)b.box(x+side*4.13,yy,z+.747,1.31,.012,.013,C.joint,24);
  for(let xx=x-4.8;xx<x+4.8;xx+=1.36)b.box(xx,8.04,z+.747,.012,.77,.013,C.joint,24);
  b.box(x,H.landing/2,z+.66,10.3,H.landing,1.32,C.stone,21);
  for(let i=0;i<4;i++){const h=(4-i)*.165;b.box(x,h/2,z+1.32+(i+.5)*.36,10.5,h,.36,C.stone,21);}
  for(const side of[-1,1]){const xx=x+side*5.35;for(let i=0;i<4;i++)b.cyl(xx,Math.max(0,H.landing-i*.18),z+.70+i*.68,.037,.94,C.metal,8,1,9);b.beam([xx,1.56,z+.70],[xx,.99,z+2.74],.043,C.metal,9);b.beam([xx,1.13,z+.70],[xx,.56,z+2.74],.025,C.metal,9);}
 });}
 b.local(O[0],0,O[1],R,()=>{
  mesh('footprint-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},.045),C.stone,21);
  face('face-north',W,0,Math.PI,W,13);
  face('face-west',0,0,-Math.PI/2,D,4);
  face('face-long-south',0,D,0,X,8,{piers:true});
  face('face-upper-east',W,21.34,Math.PI/2,21.34,4);
  face('face-notch-south',70.5,21.34,0,W-70.5,1);
  face('face-notch-east',70.5,25.61,Math.PI/2,4.27,1);
  face('face-notch-north',W,25.61,Math.PI,W-70.5,1);
  face('face-east',W,Z,Math.PI/2,Z-25.61,7);
  face('face-inner-west',X,D,-Math.PI/2,Z-D,7,{piers:true});
  face('face-south',X,Z,0,W-X,5,{door:true,piers:true,blankRight:4.5});
  // Short inset neck retains two distinct roof masses and does not join the northern neighbour.
  group('neck',()=>{b.box(59.41,8.0,24.52,22.18,16.0,2.07,C.brick,30);b.box(59.41,16.2,24.52,22.18,.40,2.3,C.white,24);b.box(59.41,18.0,24.52,20.5,3.2,1.4,C.glass,5);b.box(59.41,19.7,24.52,22.0,.22,2.1,C.white,24);});
  const inset=1.18;
  face('upper-north',W-inset,inset,Math.PI,W-2*inset,13,{upper:true});
  face('upper-west',inset,inset,-Math.PI/2,D-2*inset,4,{upper:true});
  face('upper-long-south',inset,D-inset,0,W-2*inset,13,{upper:true});
  face('upper-short-east',W-inset,D-inset,Math.PI/2,D-2*inset,4,{upper:true});
  face('upper-east',W-inset,Z-inset,Math.PI/2,Z-25.61-2*inset,7,{upper:true});
  face('upper-inner-west',X+inset,25.61+inset,-Math.PI/2,Z-25.61-2*inset,7,{upper:true});
  face('upper-south',X+inset,Z-inset,0,W-X-2*inset,5,{upper:true});
  face('upper-wing-north',W-inset,25.61+inset,Math.PI,W-X-2*inset,5,{upper:true});
  parapet(0,0,W,D);parapet(X,25.61,W-X,Z-25.61);
  roof('north',[-.42,-.42,W+.42,D+.42],[9.2,3.4,W-9.2,9.4]);
  roof('east',[X-.32,25.77,W+.32,Z+.38],[63.9,34.7,63.9,52.5]);
  atrium();entrance();
  // Reproduce the visible vertical name; its exact facade registration remains provisional.
  group('name',()=>{const text='综合科研楼',x=W-2.25,z=Z+.075;
   const old=b.e.add;b.e.add=()=>{};try{b.sign(text,x,12.3,z,2.0,5.8,0,true);}finally{b.e.add=old;}
   const uv=b.signs.get(text+'_true'),px=uv[0]*4096,py=(1-uv[1]-uv[3])*4096,c=b.ctx;
   c.clearRect(px,py,512,128);c.save();c.translate(px+256,py+64);c.rotate(-Math.PI/2);c.translate(-64,-256);
   c.textAlign='center';c.textBaseline='middle';c.fillStyle='#eeeeea';c.font='600 62px "Songti SC",serif';for(let i=0;i<text.length;i++)c.fillText(text[i],88,88+i*78);
   c.save();c.translate(25,256);c.rotate(Math.PI/2);c.font='600 13px sans-serif';c.fillText('INTEGRATED SCIENCE RESEARCH CENTER',0,0);c.restore();c.restore();
   // Builder's atlas cells are horizontal; rotate only this sign's UVs, not its world normal.
   const g=G.plane();for(let i=0;i<g.v.length;i+=8){const u=g.v[i+6],v=g.v[i+7];g.v[i+6]=1-v;g.v[i+7]=u;}
   // Replace the helper plane with the portrait plane using the same allocated atlas cell.
   b.mesh('070-portrait-name',g,x,12.3,z+.002,2.0,5.8,1,'#ffffff',8,1,0,uv);
  });
 });
 return{strategy:'building070-v46',fifthFloorVerified:true,sourceOutlinePreserved:true,roofMasses:2,lowTriangularAtrium:true,entranceFacing:'south-provisional',entranceCompassVerified:false,completeRoofPlanVerified:false,allFacadesVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building070={id:ID,render,O,R,W,D,X,Z,ENTRY,H,world,local};
})(YY);
