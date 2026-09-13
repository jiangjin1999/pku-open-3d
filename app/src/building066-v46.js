/* Fang Lou: five internal storeys and a timber xieshan roof are documented by
 * PKU's 2020 renovation. East/south elevations are registered against Boya.
 * West entrance placement, unseen elevations and dimensions remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/656386276';
const O=[192.654,-40.217],R=Math.atan2(.233,11.717),CO=Math.cos(R),SI=Math.sin(R);
const W=Math.hypot(11.717,.233),D=14.560,H={base:.58,wall:19.65,eave:19.93,break:20.47,ridge:21.82};
const C={brick:'#a1a191',pier:'#a3a393',stone:'#b7b6a1',base:'#cfcec0',red:'#81392f',edge:'#a95342',glass:'#667c76',roof:'#7b7c70',tile:'#99968a',green:'#416b50',dark:'#515c50'};
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const main=[{lo:.98,hi:2.37,w:1.22},{lo:4.34,hi:7.50,w:1.48},{lo:9.22,hi:11.06,w:1.36},{lo:12.64,hi:14.26,w:1.40}];
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const add=b.e.add;b.e.add=function(k,...v){return add.call(this,'066-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=add;}};
 const mesh=(key,g,c,mat=30)=>b.mesh('066-'+key,g,0,0,0,1,1,1,c,mat);
 function window(q){group('windows',()=>{
  const {x,w,lo,hi}=q,h=hi-lo;
  b.box(x,(lo+hi)/2,-.145,w,h,.045,C.glass,5);
  for(const dx of[-w/2,w/2])b.box(x+dx,(lo+hi)/2,-.078,.078,h+.09,.20,C.red,6);
  for(const y of[lo,hi])b.box(x,y,-.065,w+.07,.078,.23,C.red,6);
  b.box(x,(lo+hi)/2,-.042,.072,h,.13,C.red,6);
  if(q.top){
   const h0=1.13;b.box(x,lo+h0/2,-.087,w-.06,h0,.09,C.red,6);
   for(const dx of[-w*.24,w*.24]){
    b.box(x+dx,lo+.64,-.026,w*.22,.75,.024,'#8b9690',5);
    for(const dd of[-w*.12,w*.12])b.box(x+dx+dd,lo+.64,-.011,.032,.80,.04,C.edge,6);
   }
   b.box(x,lo+h0,-.037,w,.082,.14,C.red,6);
  }else if(h>2.4)b.box(x,hi-.62,-.021,w,.075,.18,C.red,6);
  // Pale reveals sit around the actual aperture, never as an opaque back wall.
  for(const dx of[-w/2-.055,w/2+.055])b.box(x+dx,(lo+hi)/2,.004,.075,h+.10,.13,C.stone,24);
  b.box(x,hi+.045,.022,w+.18,.075,.17,C.stone,24);
  b.box(x,lo-.06,.055,w+.27,.12,.36,C.stone,24);
 });}
 function openings(width,style){
  const scale=width/D,columns=[2.40,6.24,8.86,12.40].map(x=>x*scale),v=[];
  for(const [j,x]of columns.entries())for(const [floor,s]of main.entries()){
   if(style==='east'&&j===0)continue;
   if(style==='east'&&floor===0&&j===2)continue;
   if(style==='south'&&j!==0)continue;
   if(style==='south'&&floor===0)continue;
   v.push({x,...s});
  }
  if(style==='east')for(const s of[{lo:2.72,hi:5.92,w:1.42},{lo:8.02,hi:10.02,w:1.40},{lo:11.58,hi:13.47,w:1.40}])v.push({x:columns[0],...s,stair:true});
  for(const x of[1.84,3.06,5.97,7.26,8.55,11.70,12.92])v.push({x:x*scale,w:.98*scale,lo:16.38,hi:18.84,top:true});
  if(style==='west-fitted'){
   // Repair photos show a main door and, before repair, a separate adjacent
   // dark doorway. The latter's present finish and this face's compass are open.
   for(const x of[columns[2],columns[3]]){const i=v.findIndex(q=>q.x===x&&q.lo===main[0].lo);if(i>=0)v.splice(i,1);}
   v.push({x:columns[2],w:1.66,lo:.16,hi:3.28,door:true});
   v.push({x:columns[3],w:1.48,lo:.14,hi:3.18,door:true,service:true});
  }
  return v;
 }
 function door(q){group(q.service?'adjacent-door-fitted':'main-door',()=>{
  const {x,w,lo,hi}=q;b.box(x,(lo+hi)/2,-.11,w,hi-lo,.13,C.red,6);
  const glassTop=hi-.50,glassBottom=lo+1.00;
  for(const dx of[-w*.24,w*.24]){
   const ww=w*.38;b.box(x+dx,(glassTop+glassBottom)/2,-.028,ww,glassTop-glassBottom,.022,C.glass,5);
   for(const edge of[-ww/2,ww/2])b.box(x+dx+edge,(glassTop+glassBottom)/2,.004,.037,glassTop-glassBottom,.05,C.edge,6);
   for(const yy of[glassBottom,glassTop])b.box(x+dx,yy,.004,ww,.034,.05,C.edge,6);
   for(const dd of[-ww*.40,ww*.40])b.box(x+dx+dd,(glassTop+glassBottom)/2,.02,.018,glassTop-glassBottom-.22,.035,C.red,6);
   for(const yy of[glassBottom+.11,glassTop-.11])b.box(x+dx,yy,.02,ww*.8,.019,.035,C.red,6);
   for(const dd of[-ww/2,ww/2])b.box(x+dx+dd,lo+.48,-.004,.024,.73,.032,C.edge,6);
   for(const yy of[lo+.13,lo+.84])b.box(x+dx,yy,-.004,ww,.024,.032,C.edge,6);
  }
  b.box(x,hi-.24,-.024,w-.13,.31,.018,C.glass,5);
  b.box(x,hi-.45,.008,w,.065,.085,C.red,6);
  b.box(x,(hi+lo)/2,.008,.065,hi-lo,.09,C.red,6);
  for(const dx of[-.11,.11])b.box(x+dx,1.40,.078,.035,.27,.047,'#a6aba0',9);
  b.box(x,.08,.71,q.service?2.3:3.2,.16,1.8,C.base,21);
  b.box(x,.04,1.68,q.service?2.5:3.4,.08,.32,C.stone,21);
 });}
 function face(name,x,z,r,width){b.local(x,0,z,r,()=>group('face-'+name,()=>{
  const holes=openings(width,name),piers=[.28,4.45*width/D,10.37*width/D,width-.28];
  const levels=[0,H.base,H.wall,1.0,3.55,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  const wall=(a,c,lo,hi)=>{if(c-a>1e-5)b.box((a+c)/2,(lo+hi)/2,-.22,c-a,hi-lo,.44,hi<=H.base?C.base:C.brick,hi<=H.base?24:30);};
  for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo+.001&&q.hi>=hi-.001).sort((a,b)=>a.x-b.x);let end=0;
   for(const q of cuts){wall(end,q.x-q.w/2,lo,hi);end=q.x+q.w/2;}wall(end,width,lo,hi);
  }
  for(const q of holes)q.door?door(q):window(q);
  for(const [i,u]of piers.entries()){
   const h=i===0||i===3?H.wall:19.03;
   b.box(u,(h+H.base)/2,.12,.54,h-H.base,.32,C.pier,30);
   b.box(u,H.base/2,.12,.56,H.base,.34,C.base,24);
   if(i>0&&i<3){const g=new G.Geometry(),x0=u-.27,x1=u+.27;
    g.quad([x0,h,.29],[x1,h,.29],[x1-.10,h+.33,.035],[x0+.10,h+.33,.035]);mesh(name+'-pier-cap-'+i,g,C.stone,24);
   }
  }
  b.box(width/2,19.29,.07,width,.14,.40,C.stone,24);
  b.box(width/2,19.51,.14,width+.14,.12,.56,C.brick,30);
  if(name==='west-fitted'){
   const q=holes.find(q=>q.door&&!q.service),left=q.x-q.w/2-.82,right=piers[2]+.30;
   b.box((left+q.x-q.w/2)/2,1.775,.038,q.x-q.w/2-left,3.55,.072,C.base,24);
   b.box((q.x+q.w/2+right)/2,1.775,.30,right-q.x-q.w/2,3.55,.085,C.base,24);
   b.box((left+right)/2,3.415,.037,right-left,.27,.075,C.base,24);
  }
 }));}
 function roof(){group('roof',()=>{
  const ridgeX=W/2,z0=1.80,z1=D-1.80,outer=-.86,shoulder=1.60;
  const curve=[[outer,H.eave],[0,19.77],[.70,20.0],[shoulder,H.break],[3.10,20.83],[ridgeX,H.ridge]];
  const planes=new G.Geometry(),seams=new G.Geometry();
  const endAt=x=>x<=0?x:x<=.70?x/.70*.75:x<shoulder?.75+(x-.70)/(shoulder-.70)*(z0-.75):z0;
  for(const side of[-1,1]){
   const xx=x=>side<0?x:W-x;
   for(let i=1;i<curve.length;i++){
    const [x0,y0]=curve[i-1],[x1,y1]=curve[i],a=endAt(x0),c=endAt(x1);
    planes.quad([xx(x0),y0,a],[xx(x0),y0,D-a],[xx(x1),y1,D-c],[xx(x1),y1,c]);
    for(let z=-.78;z<D+.80;z+=.22){const lo=Math.max(z,a,c),hi=Math.min(z+.028,D-a,D-c);if(hi>lo)seams.quad([xx(x0),y0+.012,lo],[xx(x0),y0+.012,hi],[xx(x1),y1+.012,hi],[xx(x1),y1+.012,lo]);}
   }
  }
  // Lower end hips and the two vertical upper gables distinguish xieshan
  // from the generic four-slope hip formerly assigned to the OSM footprint.
  for(const side of[-1,1]){
   const zz=z=>side<0?z:D-z;
   const bands=[[-.86,H.eave,-.86],[0,19.77,0],[.75,20.0,.70],[z0,H.break,shoulder]];
   for(let i=1;i<bands.length;i++){
    const [a,ya,xa]=bands[i-1],[c,yc,xc]=bands[i];
    planes.quad([xa,ya,zz(a)],[W-xa,ya,zz(a)],[W-xc,yc,zz(c)],[xc,yc,zz(c)]);
    for(let x=-.78;x<W+.8;x+=.22){const lo=Math.max(x,xa,xc),hi=Math.min(x+.028,W-xa,W-xc);if(hi>lo)seams.quad([lo,ya+.012,zz(a)],[hi,ya+.012,zz(a)],[hi,yc+.012,zz(c)],[lo,yc+.012,zz(c)]);}
   }
   const g=new G.Geometry(),p=[[shoulder,H.break,zz(z0)],[3.10,20.83,zz(z0)],[ridgeX,H.ridge,zz(z0)],[W-3.10,20.83,zz(z0)],[W-shoulder,H.break,zz(z0)]];
   for(let i=1;i<p.length-1;i++)g.tri(p[0],p[i],p[i+1]);mesh('upper-gable-'+side,g,C.brick,30);
   b.box(ridgeX,H.break-.085,zz(z0),W-2*shoulder,.11,.15,C.red,6);
  }
  mesh('six-curved-roof-faces',planes,C.roof,2);seams.detailWidth=.028;mesh('fine-tile-channels',seams,C.tile,2);
  b.box(ridgeX,H.ridge+.06,D/2,.20,.16,z1-z0+.44,C.tile,2);
  for(const z of[z0-.20,z1+.20])b.box(ridgeX,H.ridge+.16,z,.22,.16,.16,C.tile,2);
  // Roof edges have short red rafters and green cut ends, as repaired in 2020.
  for(const [name,x,z,r,width]of[['south',0,D,0,W],['north',W,0,Math.PI,W],['east',W,D,Math.PI/2,D],['west',0,0,-Math.PI/2,D]])b.local(x,0,z,r,()=>{
   b.box(width/2,19.63,.11,width+.58,.17,.27,C.red,6);
   b.box(width/2,19.65,.46,width+1.64,.075,.76,C.edge,6);
   for(let u=-.61;u<width+.68;u+=.30){b.box(u,19.72,.51,.105,.12,.64,C.red,6);b.box(u,19.72,.839,.11,.12,.025,C.green,6);}
   b.box(width/2,19.86,.846,width+1.71,.052,.055,C.stone,24);
  });
 });}
 b.local(O[0],0,O[1],R,()=>{
  group('base',()=>mesh('footprint-floor',F.surface({type:'Polygon',coordinates:[f.geometry.coordinates[0].map(local)]},.08),C.base,21));
  face('east',W,D,Math.PI/2,D);face('south',0,D,0,W);
  face('west-fitted',0,0,-Math.PI/2,D);face('north-fitted',W,0,Math.PI,W);
  roof();
 });
 return{strategy:'building066-v46',floors:5,roof:'xieshan',sourceOutlinePreserved:true,eastStairWindowsOffset:true,entranceFacing:'west-provisional',entranceDirectionVerified:false,allFacadesVerified:false,heightMeasured:false,areaReconciled:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building066={id:ID,render,W,D,H,R,world,local};
})(YY);
