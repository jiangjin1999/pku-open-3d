/* 120: one tall storey west of the Humanities south plaza. The foundation's
 * north-looking original panorama fixes its gray south gable, five-bay east
 * front and recessed middle entrance. No red south gable from neighbour 096. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1075644751';
const O=[109.539,-359.441],R=Math.atan2(1.521,13.391),CO=Math.cos(R),SI=Math.sin(R),W=13.477103620585545,D=20.978734018047895;
const world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const H={base:.20,eave:5,ridge:8.4};const C={brick:'#7f8785',stone:'#bcbeb6',red:'#833b30',roof:'#68716b',tile:'#929b92',glass:'#687974',dark:'#293831',green:'#437969',gold:'#baac6e'};
function render(b,f){b.id=f.properties.pickId;const poly=f.geometry.coordinates[0].slice(0,-1).map(local);
 const mesh=(name,g,c,mat=30)=>b.mesh('120-'+name,g,0,0,0,1,1,1,c,mat),group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'120-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 function face(name,a,c,holes=[],decorate=false){const width=Math.hypot(c[0]-a[0],c[1]-a[1]);b.local(a[0],0,a[1],-Math.atan2(c[1]-a[1],c[0]-a[0]),()=>{
  const levels=[H.base,.44,.92,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,c)=>a-c);
  group(name+'-brick',()=>{for(let i=1;i<levels.length;i++){const lo=levels[i-1],hi=levels[i],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,c)=>a.x-c.x);let end=0;const block=(a,c)=>{if(c>a)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,hi<=.44?C.stone:C.brick,hi<=.44?24:30);};for(const q of cuts){block(end,q.x-q.w/2);end=q.x+q.w/2;}block(end,width);}});
  group(name+'-stone-bands',()=>{for(const yy of[.44,.92]){const door=holes.find(q=>q.door);if(door){const a=door.x-door.w/2,c=door.x+door.w/2;b.box(a/2,yy,.035,a,.1,.08,C.stone,24);b.box((c+width)/2,yy,.035,width-c,.1,.08,C.stone,24);}else b.box(width/2,yy,.035,width,.1,.08,C.stone,24);}});
  if(!decorate)return;
  group('east-four-window-bays',()=>{for(const q of holes.filter(q=>!q.door)){const h=q.hi-q.lo,y=(q.lo+q.hi)/2;b.box(q.x,y,-.1,q.w,h,.04,C.glass,5);for(let j=0;j<=4;j++)b.box(q.x-q.w/2+q.w*j/4,y,.02,.065,h+.06,.18,C.red,6);for(const yy of[q.lo,1.28,3.43,3.91,q.hi])b.box(q.x,yy,.035,q.w+.07,.07,.19,C.red,6);for(let j=0;j<4;j++){const x=q.x-q.w/2+q.w*(j+.5)/4;b.box(x,4.19,.04,q.w/4-.08,.045,.13,C.red,6);}}});
  const q=holes.find(q=>q.door);group('east-central-recess',()=>{b.box(q.x,2.32,-1.16,q.w,4.24,.12,C.dark,5);for(const dx of[-q.w/2,0,q.w/2])b.box(q.x+dx,2.32,-1.08,.1,4.25,.15,C.red,6);for(const dx of[-q.w/2,q.w/2])b.box(q.x+dx,2.46,-.64,.15,4.5,1.28,C.brick,30);b.box(q.x,H.base+.06,-.58,q.w,.12,1.16,C.stone,24);b.box(q.x,.15,.32,q.w+.28,.30,.62,C.stone,24);});
  group('east-red-columns-and-frieze',()=>{for(let j=0;j<=5;j++){const x=.44+(width-.88)*j/5;b.cyl(x,.92,.07,.11,3.72,C.red,10,1,6);b.box(x,4.63,.09,.28,.22,.25,C.green,6);b.box(x,4.71,.115,.16,.06,.27,C.gold,6);}b.box(width/2,4.72,.055,width-.6,.36,.23,C.red,6);b.box(width/2,4.94,.12,width+.16,.14,.31,C.red,6);});
 });}
 b.local(O[0],0,O[1],R,()=>{
  mesh('original-polygon-base',G.polygon(poly,H.base),C.stone,24);mesh('ceiling',G.polygon(poly,H.eave-.12),C.brick,30);
  face('south-gray-gable-wall',poly[0],poly[4]);face('north-unverified',poly[2],poly[1]);face('west-unverified',poly[1],poly[0]);
  const width=Math.hypot(poly[2][0]-poly[4][0],poly[2][1]-poly[4][1]),bay=(width-.88)/5;
  const holes=Array.from({length:5},(_,j)=>({x:.44+bay*(j+.5),w:bay-.30,lo:j===2?H.base:.94,hi:4.52,door:j===2}));face('east-photo',poly[4],poly[2],holes,true);
  const cx=W/2,x0=-.52,x1=W+.52,z0=-.22,z1=D+.22,profile=x=>H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,1-Math.abs(x-cx)/(cx+.52)),1.45);
  const roof=new G.Geometry(),tiles=new G.Geometry();const quad=(g,a,c,z,q,dy=0)=>g.quad([a,profile(a)+dy,z],[a,profile(a)+dy,q],[c,profile(c)+dy,q],[c,profile(c)+dy,z]);
  for(let i=0;i<32;i++)for(let j=0;j<24;j++)quad(roof,x0+(x1-x0)*i/32,x0+(x1-x0)*(i+1)/32,z0+(z1-z0)*j/24,z0+(z1-z0)*(j+1)/24);
  for(let z=z0+.08;z<z1-.05;z+=.235)for(let i=0;i<32;i++)quad(tiles,x0+(x1-x0)*i/32,x0+(x1-x0)*(i+1)/32,z,z+.045,.032);
  tiles.detailWidth=.025;mesh('single-north-south-curved-roof',roof,C.roof,2);mesh('batched-roof-tile-ribs',tiles,C.tile,2);
  for(const [name,z]of[['south',D],['north',0]]){const g=new G.Geometry();for(let i=0;i<32;i++){const a=W*i/32,c=W*(i+1)/32,p=[[a,H.eave,z],[c,H.eave,z],[c,profile(c)-.03,z],[a,profile(a)-.03,z]];if(name==='north')p.reverse();g.quad(...p);}mesh(name+'-gray-brick-gable',g,C.brick,30);}
  group('hard-gable-roof-trim',()=>{b.box(cx,H.ridge+.09,D/2,.3,.18,z1-z0+.08,C.tile,2);for(const z of[z0,z1])for(let i=0;i<32;i++){const a=x0+(x1-x0)*i/32,c=x0+(x1-x0)*(i+1)/32;b.beam([a,profile(a)-.1,z],[c,profile(c)-.1,z],.13,C.stone,24);b.beam([a,profile(a)+.03,z],[c,profile(c)+.03,z],.09,C.tile,2);}for(const x of[x0,x1]){b.box(x,4.94,D/2,.18,.17,z1-z0,C.red,6);for(let z=z0+.11;z<z1;z+=.235){b.cyl(x,4.98,z,.075,.12,C.tile,8,1,2);b.box(x,4.79,z,.19,.16,.065,C.gold,6);}}for(const z of[z0,z1])b.beam([cx,H.ridge,z],[cx,H.ridge+.33,z+(z<D/2?-.12:.12)],.13,C.tile,2);});
 });
 return{id:ID,strategy:'building120-v46',roofAxis:'north-south',roofRidges:1,roofType:'curved-hard-gable',floors:1,oneTallFrontStoreyObserved:true,eastBays:5,eastWindowBays:4,entranceDirection:'east',centralRecess:true,southGableColor:'gray-brick',originalOutline:true,northFacadeVerified:false,westFacadeVerified:false,heightMeasured:false,internalMezzanineVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building120={id:ID,render,world,local,width:W,depth:D,heights:H};
})(YY);
