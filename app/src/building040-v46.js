/* 040 Fang Libangqin: 2013 registered ground views, 2018 named southwest facade,
 * 2022/2025 official west doorway and native aerial. Dimensions remain fitted.
 * The mapped ring is never changed; the tall roof occupies the inset middle. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832250';
const O=[129.148,556.216],R=Math.atan2(1.377,24.186),CO=Math.cos(R),SI=Math.sin(R);
const C={brick:'#81857e',red:'#794237',glass:'#71868a',light:'#d2d4c9',roof:'#6e7771',tile:'#939b92',metal:'#697970'};
const H={floor:3.4,front:6.8,low:10.2,attic:13.6,wall:16.15,eave:16.3,ridge:19.15};
const core=[9,8.64,24.22,64.52],roofBox=[8.42,8.06,24.8,65.10],entrances=[{name:'west-main',u:4.94,v:35.7,width:12.4,directionVerified:true}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
const profile=(u,v)=>u>=core[0]-1e-7&&u<=core[2]+1e-7&&v>=core[1]-1e-7&&v<=core[3]+1e-7?H.wall:v<15.78||v>55.78?H.low:H.front;
function render(b,f,add){const id=f.properties.pickId;b.id=id;
function group(name,fn){const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'040-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}}
b.local(O[0],0,O[1],R,()=>{
const emit=(key,g,col,mat=24)=>b.mesh('040-'+key,g,0,0,0,1,1,1,col,mat);
function cap(box,y,key,col=C.light){const g=new G.Geometry();for(const p of pieces(f,box))for(let k=1;k<p.length-1;k++)g.tri([p[0][0],y,p[0][1]],[p[k+1][0],y,p[k+1][1]],[p[k][0],y,p[k][1]]);if(g.v.length)emit(key,g,col);}
// Disjoint caps: exact source footprint, two three-storey ends, two-storey side fronts.
const us=[-.02,4.94,9,24.22,27.82],vs=[-.02,8.64,15.78,55.78,64.52,71.37];
for(let i=1;i<us.length;i++)for(let j=1;j<vs.length;j++){const box=[us[i-1],vs[j-1],us[i],vs[j]],h=profile((box[0]+box[2])/2,(box[1]+box[3])/2);cap(box,h,'cap-'+i+'-'+j,h===H.wall?C.brick:'#a4ada2');}
const bays=Array.from({length:13},(_,i)=>11.8+i*3.98);
// Each facade is cut around its actual openings. Frames, recessed glass and reveals
// share the wall plane; the entrance is a real void, not a door printed on a box.
function face(a,c,y0,y1,name,opts={}){
 const du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv),holes=[];if(len<.03||y1<=y0)return;
 const longitudinal=Math.abs(dv)>Math.abs(du),at=t=>a.map((x,i)=>x+(c[i]-x)*t),pos=v=>(v-a[1])/dv*len;
 const centers=opts.southDecor?[60.10,63.55,67.0].map(pos).filter(x=>x>.35&&x<len-.35):longitudinal&&opts.main?bays.map(pos).filter(x=>x>.65&&x<len-.65):Array.from({length:Math.max(1,Math.round(len/3.9))},(_,i)=>len*(i+.5)/Math.max(1,Math.round(len/3.9)));
 for(let fl=0;fl<5;fl++){const lo=fl*3.4,hi=fl===4?H.wall:lo+3.4;if(hi<=y0+.02||lo>=y1-.02)continue;
  for(const x of centers){const pt=at(x/len);if(opts.southDecor&&fl===0)continue;if(opts.entry&&fl===0&&Math.abs(pt[1]-35.7)<7.5)continue;
   if(opts.entry&&fl===1&&Math.abs(pt[1]-35.7)<4.6)continue;
   if(opts.southDecor&&Math.abs(pt[1]-63.55)>5.2)continue;
   let w=Math.min(opts.main?2.4:2.25,len/centers.length*.61),wy=lo+.8,wh=1.95;
   if(opts.southDecor&&fl===2){wy=lo+.3;wh=1.82;}
   if(fl===4){w=Math.min(3.25,len/centers.length*.81);wy=lo+.48;wh=1.24;}
   // The registered west view shows a broad central upper opening between
   // paired narrow bays. Its exact width remains fitted; do not copy it east.
   if(opts.main&&fl===3&&name.startsWith('west-high')&&Math.abs(pt[1]-35.7)<.6)holes.push({x,y:lo+.64,w:3.25,h:2.25,kind:'window'});
   else if((opts.main&&fl===3)||(opts.end&&!opts.southDecor&&fl===2)){for(const s of[-1,1])holes.push({x:x+s*.67,y:lo+.64,w:.83,h:2.25,kind:'window'});}
   else holes.push({x,y:wy,w,h:wh,kind:'window'});
  }
 }
 if(opts.entry){holes.push({x:pos(35.7),y:0,w:12.4,h:3.4,kind:'entry'});holes.push({x:pos(35.7),y:4.15,w:5.65,h:2.18,kind:'window'});}
 if(opts.stair){const x=pos(22.65);if(x>0&&x<len) {for(let i=holes.length-1;i>=0;i--)if(Math.abs(holes[i].x-x)<1.8)holes.splice(i,1);holes.push({x,y:6.8,w:1.55,h:6.35,kind:'stair'});}}
 const hs=holes.map(h=>({...h,l:Math.max(0,h.x-h.w/2),r:Math.min(len,h.x+h.w/2),lo:Math.max(y0,h.y),hi:Math.min(y1,h.y+h.h)})).filter(h=>h.r>h.l&&h.hi>h.lo);
 const xs=[0,len,...hs.flatMap(h=>[h.l,h.r])].sort((x,y)=>x-y),ys=[y0,y1,...[3.4,6.8,10.2,13.6].filter(y=>y>y0&&y<y1),...hs.flatMap(h=>[h.lo,h.hi])].sort((x,y)=>x-y);
 b.local(a[0],0,a[1],Math.atan2(-dv,du),()=>group(name,()=>{
  const panel=(s,e,lo,hi,col)=>{if(e-s>.001&&hi-lo>.001)b.box((s+e)/2,(lo+hi)/2,-.07,e-s,hi-lo,.14,col,24);};
  for(let i=1;i<xs.length;i++)for(let j=1;j<ys.length;j++){const x=(xs[i-1]+xs[i])/2,y=(ys[j-1]+ys[j])/2;if(hs.some(h=>x>h.l-1e-7&&x<h.r+1e-7&&y>h.lo-1e-7&&y<h.hi+1e-7))continue;const pt=at(x/len),white=opts.main&&y>=13.6||opts.east&&y>=3.4&&y<6.8&&pt[1]>19&&pt[1]<61;panel(xs[i-1],xs[i],ys[j-1],ys[j],white?C.light:C.brick);}
  for(const h of hs){if(h.kind==='entry')continue;const x=(h.l+h.r)/2,y=(h.lo+h.hi)/2,w=h.r-h.l,hh=h.hi-h.lo;
   for(const xx of[h.l,h.r])b.box(xx,y,-.025,.075,hh,.22,C.red,24);
   for(const yy of[h.lo,h.hi])b.box(x,yy,-.025,w,.075,.22,C.red,24);
   b.box(x,y,-.19,w-.08,hh-.08,.04,C.glass,5);b.box(x,y,-.11,.055,hh,.07,C.red,24);
   if(w>1.2)b.box(x,h.hi-.45,-.105,w,.055,.065,C.red,24);
   if(h.kind==='stair')for(let yy=h.lo+.85;yy<h.hi;yy+=1.05)b.box(x,yy,-.07,w,.065,.075,C.red,24);
   b.box(x,h.lo-.08,.045,w+.16,.12,.28,C.light,24);
  }
  if(opts.main&&y1>13.6)b.box(len/2,13.66,.06,len,.16,.28,C.light,24);
  if(opts.end){b.box(len/2,y1-.10,.02,len,.19,.24,C.light,24);for(const x of centers)b.box(x,y1-.35,.065,1.2,.7,.18,C.light,24);}
 }));
}
// Source boundary split at the volume changes. Original intermediate vertices remain.
const raw=F.polygons(f.geometry)[0][0].map(local),positive=F.area(raw)>0;
for(let i=1;i<raw.length;i++){let a=raw[i-1],c=raw[i];if(positive)[a,c]=[c,a];const d=c.map((x,j)=>x-a[j]),ts=[0,1];for(const u of us){const t=(u-a[0])/d[0];if(t>1e-7&&t<1-1e-7)ts.push(t);}for(const v of vs){const t=(v-a[1])/d[1];if(t>1e-7&&t<1-1e-7)ts.push(t);}ts.sort((a,b)=>a-b);
 for(let j=1;j<ts.length;j++){const p=a.map((x,k)=>x+d[k]*ts[j-1]),q=a.map((x,k)=>x+d[k]*ts[j]),mid=p.map((x,k)=>(x+q[k])/2),h=profile(...mid),west=Math.abs(d[1])>Math.abs(d[0])&&mid[0]<5.05,east=mid[0]>27,entry=west&&mid[1]>15.78&&mid[1]<55.78;face(p,q,0,h,'outer-'+i+'-'+j,{entry,east,end:h===H.low,southDecor:west&&mid[1]>55.78});}
}
// The inset tall body starts above its neighbouring low roof, with no doubled wall.
for(const [a,c,name]of[[[9,8.64],[9,64.52],'west-high'],[[24.22,64.52],[24.22,8.64],'east-high'],[[24.22,8.64],[9,8.64],'north-high'],[[9,64.52],[24.22,64.52],'south-high']]){
 // Upper rows cross the lower-volume breaks continuously; do not drop a bay
 // just because its centre coincides with a lower end-roof boundary.
 face(a,c,H.low,H.wall,name+'-upper',{main:true,stair:name==='east-high'});
 if(Math.abs(c[1]-a[1])>.1){const northFirst=c[1]>a[1];face([a[0],northFirst?15.78:55.78],[a[0],northFirst?55.78:15.78],H.front,H.low,name+'-middle',{main:true,stair:name==='east-high'});}
}
// Real N-S hip, set in from both end wings; its soffit and fascia are fully closed.
const [u0,v0,u1,v1]=roofBox,um=(u0+u1)/2,r0=v0+(u1-u0)/2,r1=v1-(u1-u0)/2,ry=H.ridge;
const roof=new G.Geometry();roof.quad([u0,H.eave,v0],[u0,H.eave,v1],[um,ry,r1],[um,ry,r0]);roof.quad([um,ry,r0],[um,ry,r1],[u1,H.eave,v1],[u1,H.eave,v0]);roof.tri([u1,H.eave,v0],[u0,H.eave,v0],[um,ry,r0]);roof.tri([u0,H.eave,v1],[u1,H.eave,v1],[um,ry,r1]);emit('inset-ns-hip',roof,C.roof,2);
b.box(um,H.wall+.025,(v0+v1)/2,u1-u0,.15,v1-v0,C.light,24);
for(const [a,c]of[[[u0,v0],[u1,v0]],[[u1,v0],[u1,v1]],[[u1,v1],[u0,v1]],[[u0,v1],[u0,v0]]]){const du=c[0]-a[0],dv=c[1]-a[1];b.box((a[0]+c[0])/2,H.eave-.10,(a[1]+c[1])/2,Math.hypot(du,dv),.25,.18,C.light,24,0,Math.atan2(-dv,du));}
const roofY=(u,v)=>H.eave+(H.ridge-H.eave)*Math.max(0,Math.min(1,(u-u0)/(um-u0),(u1-u)/(u1-um),(v-v0)/(r0-v0),(v1-v)/(v1-r1)));
const seams=new G.Geometry();for(let v=v0+.35;v<v1;v+=.46)for(let side=0;side<2;side++){const start=side?um:u0,end=side?u1:um;for(let i=0;i<8;i++){const a=start+(end-start)*i/8,c=start+(end-start)*(i+1)/8;seams.quad([a,roofY(a,v)+.027,v-.015],[c,roofY(c,v)+.027,v-.015],[c,roofY(c,v)+.027,v+.015],[a,roofY(a,v)+.027,v+.015]);}}emit('hip-tile-seams',seams,C.tile,2);
b.box(um,H.ridge+.04,(r0+r1)/2,.22,.15,r1-r0,C.roof,2);
// West sloping glass cover above the lower front, seen independently in 2013.
const su=4.94,eu=9,sv=15.78,ev=55.78,sy=7.62,ey=9.67,glass=new G.Geometry();glass.quad([su,sy,sv],[su,sy,ev],[eu,ey,ev],[eu,ey,sv]);glass.quad([su,H.front,sv],[su,sy,sv],[eu,ey,sv],[eu,H.front,sv]);glass.quad([eu,H.front,ev],[eu,ey,ev],[su,sy,ev],[su,H.front,ev]);glass.quad([su,H.front,sv],[su,H.front,ev],[su,sy,ev],[su,sy,sv]);emit('west-glass-slope',glass,'#92afb0',5);
group('glass-ribs',()=>{for(let v=sv;v<=ev+.01;v+=2.4){b.beam([su,sy+.035,v],[eu,ey+.035,Math.min(ev,v+2.35)],.045,C.metal,24);if(v+2.35<=ev)b.beam([su,sy+.035,v+2.35],[eu,ey+.035,v],.045,C.metal,24);}for(const [u,y]of[[su,sy],[eu,ey]])b.beam([u,y+.035,sv],[u,y+.035,ev],.06,C.metal,24);});
// Official doorway pattern is on the west-facing low front (registered 2013 view).
b.local(4.94,0,35.7,-Math.PI/2,()=>group('west-portico',()=>{
 for(const x of[-6.2,-3.1,3.1,6.2])b.box(x,1.72,-.02,.68,3.44,.72,C.brick,24);
 b.box(0,3.43,.015,13.0,.36,.90,C.light,24);
 for(const s of[-1,1]){b.box(s*4.14,1.78,-2.05,4.1,2.92,.16,C.brick,24);b.box(s*6.2,1.78,-1.02,.15,2.92,2.2,C.brick,24);}
 b.box(0,3.20,-2.05,4.2,.35,.16,C.brick,24);b.box(0,3.25,-1.02,12.4,.12,2.2,C.light,24);
 b.box(0,1.62,-2.15,4.12,2.68,.05,C.glass,5);for(const x of[-2.1,-1.04,0,1.04,2.1])b.box(x,1.64,-2.09,.095,2.72,.15,C.red,24);for(const y of[.28,2.4,2.94])b.box(0,y,-2.09,4.26,.09,.16,C.red,24);
 b.box(0,.19,-.9,12.8,.38,2.7,C.light,24);for(let k=0;k<3;k++){const h=.126*(k+1);b.box(0,h/2,.6+(2-k)*.4,12.8,h,.43,C.light,24);}
 for(const y of[3.74,4.05])b.box(0,y,.04,12.4,.055,.065,C.metal,24);for(let x=-6;x<=6;x+=.6)b.box(x,3.88,.04,.04,.40,.055,C.metal,24);
 for(const s of[-1,1]){b.box(s*3.1,2.69,.43,.24,.40,.24,'#45594c',24);b.box(s*3.1,2.69,.49,.13,.25,.15,'#bac5af',10);}
}));
// Only the south-west end has individually attributable three curved caps and balcony.
b.local(0,0,63.55,-Math.PI/2,()=>group('southwest-three-caps',()=>{
 for(const x of[-3.45,0,3.45]){b.mesh('roof-cap',b.geo('fang040-small-cap',()=>G.roof(.66)),x,9.20,.25,3.25,.85,1.8,C.roof,2,1);b.box(x,10.005,.25,2.14,.10,.13,C.roof,2);b.box(x,8.96,.29,2.8,.22,.42,C.red,24);for(const s of[-1,1])b.box(x+s*1.18,8.78,.33,.20,.46,.68,C.red,24);}
 b.box(0,3.37,.65,10.7,.30,1.35,C.light,24);for(const x of[-5.3,-2.65,0,2.65,5.3]){b.box(x,4.04,1.25,.21,1.12,.24,C.light,24);b.box(x,4.62,1.25,.30,.13,.32,C.light,24);}for(let i=0;i<4;i++)b.box(-3.975+i*2.65,4.07,1.25,2.45,.67,.18,C.light,24);
}));
});
return{strategy:'building040-v46',bodyVisualRows:5,totalFloorsVerified:true,sourceOutline:true,mainRoofNorthSouth:true,insetMainRoof:true,lowEndRows:3,entranceDirectionVerified:true,entranceFace:'west',heightMeasured:false,unresolved:['northwest ornamental face tree-occluded','precise bay counts and dimensions fitted','current whole exterior after 2018 incomplete']};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building040={id:ID,render,world,local,pieces,heights:H,entrances,core,roofBox,profile};
})(YY);
