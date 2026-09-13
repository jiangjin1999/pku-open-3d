/* Photo-led Second Teaching Building. Original mapped L is never translated or scaled. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render;
const ID='way/240825557',C={brick:'#827d76',stone:'#a5a49b',glass:'#71868b',frame:'#394747',top:'#dedbc9',roof:'#686c69'};
// Retain the existing 5 × 3.5m convention; all vertical dimensions remain fitted.
const levels={low:10.5,body:14,top:17.5,ridge:20};
function plan(f){
 const r=f.geometry.coordinates[0],a=r[0],b=r[1],c=r[2],d=r[3],e=r[4],h=r[5];
 const cross=(u,v)=>u[0]*v[1]-u[1]*v[0],sub=(u,v)=>[u[0]-v[0],u[1]-v[1]];
 const t=cross(sub(c,a),sub(d,c))/cross(sub(h,a),sub(d,c));
 const q=[a[0]+(h[0]-a[0])*t,a[1]+(h[1]-a[1])*t];
 return {north:[a,b,c,q],west:[q,d,e,h],ring:r};
}
function point(q,u,v){return [0,1].map(i=>(1-v)*((1-u)*q[0][i]+u*q[1][i])+v*((1-u)*q[3][i]+u*q[2][i]));}
function patch(q,u0,u1,v0,v1){const r=[point(q,u0,v0),point(q,u1,v0),point(q,u1,v1),point(q,u0,v1)];return {type:'Polygon',coordinates:[[...r,r[0]]]};}
// Exact parallel inset of the six source edges: the concave corner remains a concave corner.
function inset(r,d){
 const lines=r.slice(1).map((b,i)=>{const a=r[i],x=b[0]-a[0],z=b[1]-a[1],l=Math.hypot(x,z);return {a:[a[0]-z/l*d,a[1]+x/l*d],v:[x,z]};});
 const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 const q=lines.map((b,i)=>{const a=lines[(i+lines.length-1)%lines.length],t=cross([b.a[0]-a.a[0],b.a[1]-a.a[1]],b.v)/cross(a.v,b.v);return [a.a[0]+t*a.v[0],a.a[1]+t*a.v[1]];});
 return [...q,q[0]];
}
function render(b,f,add){
 const id=f.properties.pickId,p=plan(f);b.id=id;let count=0;
 function mass(name,q,u0,u1,v0,v1,y,h,col=C.brick){
  const g=patch(q,u0,u1,v0,v1);add('026-'+name+'-'+count++,F.walls(g,y,h),col,24,id);add('026-cap-'+count++,F.surface(g,h),C.roof,22,id);
 }
 function face(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(l));}
 function win(x,y,w,h,z=0){
  b.box(x,y,z,w+.15,h+.15,.10,C.frame,29);b.box(x,y,z+.065,w,h,.035,C.glass,28);
  if(w>1.2)b.box(x,y,z+.10,.065,h,.05,C.frame,29);b.box(x,y+h*.23,z+.10,w,.065,.05,C.frame,29);
 }
 function curtain(x,width,height,z=0,columns=2){
  b.box(x,height/2+.15,z,width,height,.14,C.glass,28);
  for(let k=0;k<=Math.ceil(height/1.6);k++)b.box(x,.15+k*height/Math.ceil(height/1.6),z+.10,width,.08,.09,C.frame,29);
  for(let k=0;k<=columns;k++)b.box(x-width/2+k*width/columns,height/2+.15,z+.11,.085,height,.09,C.frame,29);
 }
 function shaft(x,width,height,depth){
  // A volume: front, two glass sides, glass top and edge frames. 1.2m depth is fitted.
  curtain(x,width,height,depth);
  for(const s of [-1,1]){
   b.box(x+s*width/2,height/2+.15,depth/2,.10,height,depth,C.glass,28);
   for(let k=0;k<=Math.ceil(height/1.6);k++)b.box(x+s*width/2,.15+k*height/Math.ceil(height/1.6),depth/2,.09,.08,depth,C.frame,29);
  }
  b.box(x,height+.18,depth/2,width,.10,depth,C.glass,28);
 }
 // Satellite shows the low strip WEST of the continuous roof, not on the north front.
 // West road face runs north to south: high block -> recessed entry -> lower forewing.
 mass('north-body',p.north,0,1,0,1,0,levels.body);
 mass('west-core',p.west,.15,.78,0,1,0,levels.body);
 mass('west-road-high',p.west,0,.15,0,.16,0,levels.body);
 mass('west-road-entry-lintel',p.west,0,.15,.16,.36,5.1,levels.body);
 mass('west-road-low',p.west,0,.15,.36,.88,0,levels.low);
 mass('west-road-end',p.west,0,.15,.88,1,0,levels.body);
 mass('west-court-south',p.west,.78,1,.56,1,0,levels.body);
 mass('west-court-lintel',p.west,.78,1,.40,.56,5.5,levels.body);
 mass('west-court-north',p.west,.78,1,0,.40,0,levels.body);
 // Both bars have an inset fifth storey and ONE connected L-shaped pitched roof.
 const eaves=inset(p.ring,3.5),upper=inset(p.ring,4.1),upperG={type:'Polygon',coordinates:[upper]};
 add('026-inset-fifth',F.walls(upperG,levels.body,levels.top),C.top,24,id);
 const v=(p,y)=>[p[0],y,p[1]],cs=eaves.slice(0,6).map(p=>v(p,levels.top));
 const elbow=v([(eaves[0][0]+eaves[3][0])/2,(eaves[0][1]+eaves[3][1])/2],levels.ridge);
 const east=v(point(p.north,.86,.5),levels.ridge),south=v(point(p.west,.5,.80),levels.ridge);
 const planes=[[cs[0],cs[1],east,elbow],[cs[1],cs[2],east],[cs[2],cs[3],elbow,east],[cs[3],cs[4],south,elbow],[cs[4],cs[5],south],[cs[5],cs[0],elbow,south]];
 const roof=new G.Geometry();for(const ps of planes)ps.length===3?roof.tri(...ps):roof.quad(...ps);add('026-continuous-L-roof',roof,C.roof,2,id);
 // Rooflights lie on the two courtyard-facing roof planes, following satellite positions.
 function light(plane,u0,u1,v0,v1,name){
  const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t),at=(u,v)=>mix(mix(plane[0],plane[1],u),mix(plane[3],plane[2],u),v).map((x,i)=>i===1?x+.035:x);
  const g=new G.Geometry();g.quad(at(u0,v0),at(u1,v0),at(u1,v1),at(u0,v1));add('026-rooflight-'+name,g,C.glass,28,id);
 }
 for(const [i,a,c] of [[0,.13,.33],[1,.40,.59],[2,.66,.82]])light(planes[2],a,c,.55,.77,'north-'+i);
 light(planes[3],.22,.77,.52,.75,'west');
 // West outside: photo1/5 now follows N -> S, so its left/high and right/low order is preserved.
 face(p.north[0],p.west[3],len=>{
  const joint=Math.hypot(p.west[0][0]-p.north[0][0],p.west[0][1]-p.north[0][1])/len;
  const entry0=joint+(1-joint)*.16,entry1=joint+(1-joint)*.36,low0=entry1,low1=joint+(1-joint)*.88;
  for(let i=0;i<22;i++){const u=(i+.5)/22,x=u*len;
   if(u>low0&&u<low1){if(i%3!==0)win(x,5.5,1.65,7.5);else win(x,8.8,.65,.55);continue;}
   for(let j=0;j<4;j++){if(u>entry0-.015&&u<entry1+.015&&j<2)continue;win(x,1.9+j*3.5,i===6?.7:2.35,2.35);}
  }
  shaft(len*.075,2.7,14.1,.9);shaft(len*.88,2.7,14.1,.9);
  const x=len*(entry0+entry1)/2,w=len*(entry1-entry0)*.92;
  b.box(x,4.3,.9,w,.18,2.1,C.frame,29);for(let j=0;j<5;j++)b.box(x,.1+j*.12,1.65-j*.33,w,.20,.9,C.stone,10);
 });
 face(point(p.west,.135,.16),point(p.west,.135,.36),len=>curtain(len/2,len*.83,3.7));
 // Courtyard east face runs S -> N: long glazing -> projecting shaft -> recess -> second shaft.
 face(p.west[2],p.west[1],len=>{
  for(let i=0;i<16;i++){const u=(i+.5)/16,x=u*len;
   if(Math.abs(u-.33)<.06||Math.abs(u-.91)<.06)continue;
   for(let j=0;j<4;j++){if(u>.13&&u<.27&&j<3)continue;if(u>.42&&u<.62&&j<2)continue;if(u>.62&&u<.80&&j<2)continue;win(x,1.9+j*3.5,i%7===3?.65:2.10,2.25);}
  }
  for(const u of [.17,.23])curtain(len*u,2.2,9.8,.12);
  // 2011 photographer images 133179/412905 show broad double-height glass north of the recess.
  curtain(len*.71,len*.15,5.35,.12,4);
  shaft(len*.33,2.75,14.35,1.2);shaft(len*.91,2.7,14.15,1.2);
 });
 face(point(p.west,.79,.56),point(p.west,.79,.40),len=>curtain(len/2,len*.8,4.8));
 face(p.west[3],p.west[2],len=>{curtain(len*.62,len*.51,10.2,.12);for(const u of [.15,.35,.65,.85])win(u*len,12.4,1.8,2.1);});
 // North and north-bar courtyard elevations lack complete photo coverage: conservative windows.
 for(const [a,c,n] of [[p.north[1],p.north[0],22],[p.north[3],p.north[2],19],[p.north[2],p.north[1],4]])face(a,c,len=>{
  for(let i=0;i<n;i++)for(let j=0;j<4;j++)win((i+.5)*len/n,1.9+j*3.5,i%6===0?.75:2.1,2.1);
 });
 for(let k=0;k<6;k++)face(upper[k+1],upper[k],len=>{for(let i=0;i<Math.floor(len/4);i++)win((i+.5)*len/Math.floor(len/4),15.55,2.35,1.75);});
 return {strategy:'building026-v46',floors:5,lowFloors:3,westFloors:5,sourceOutline:true,fittedHeights:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building026={render,plan,point,patch,inset,levels,id:ID};
})(YY);
