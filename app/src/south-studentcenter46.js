/* New Sun Student Center, way/445016209. Dedicated C-shaped three-wing model.
 * Roof topology: 2026-01-11 native WV02 imagery. East entrance apertures,
 * stair bridge and sunken courts: university 2025 photos and 2019 repair PDF.
 * Heights, upper-wing facade rhythms and courtyard depth remain fitted;
 * no construction-period window grid or relocated service is presented as current. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/445016209';
const O=[35.246,460.116],R=.05620279059964731,C=Math.cos(R),S=Math.sin(R);
const world=p=>[O[0]+p[0]*C+p[1]*S,O[1]-p[0]*S+p[1]*C];
const local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const H={court:-2.65,entrance:1.85,front:11.30,glass:10.85,wingEave:17.20,wingRidge:19.80,westEave:21.00,westRidge:23.50};
const N=7.894,T=49.532,MID=(N+T)/2,U=41.69;
const court=[[41.43,N+.12],[61.18,N+.12],[61.18,T-.12],[41.43,T-.12]],ring=court.map(world);ring.push(ring[0]);
const groundCut={id:ID,pickId:195,ring,floor:H.court,geometry:{type:'Polygon',coordinates:[ring]},basis:'Two side courts below the east stair bridge; outer dimensions fitted to original C-shaped building bay.'};
const P={brick:'#999b96',stone:'#c8cdc6',cap:'#d9dbd2',roof:'#626b66',tile:'#7c8580',glass:'#49615b',wood:'#6b4338',steel:'#7f8c87',shade:'#33413c',floor:'#b7b9ae'};
// Subtract only this court from displayed road/route ribbon triangles. Keep
// source roads and network intact; outside triangles retain all eight attributes.
function clipGroundRibbon(g){
 const edges=[[0,41.43,1],[0,61.18,-1],[1,N+.12,1],[1,T-.12,-1]],out=new G.Geometry();let changed=false;
 const coord=(p,k)=>local([p[0],p[2]])[k];
 function half(poly,e,inside){const [k,v,s]=e,result=[],dist=p=>(coord(p,k)-v)*s*(inside?1:-1);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a),db=dist(b),ia=da>=0,ib=db>=0;if(ia)result.push(a);if(ia!==ib){const t=da/(da-db);result.push(a.map((v,j)=>v+(b[j]-v)*t));}}return result;}
 const area=poly=>Math.abs(poly.reduce((s,p,i)=>{const q=poly[(i+1)%poly.length];return s+p[0]*q[2]-q[0]*p[2];},0))/2;
 const emit=poly=>{for(let j=1;j+1<poly.length;j++)if(area([poly[0],poly[j],poly[j+1]])>1e-10)out.v.push(...poly[0],...poly[j],...poly[j+1]);};
 for(let i=0;i<g.v.length;i+=24){const tri=[g.v.slice(i,i+8),g.v.slice(i+8,i+16),g.v.slice(i+16,i+24)];let inner=tri;for(const e of edges)inner=half(inner,e,true);if(inner.length<3||area(inner)<1e-10){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;let remain=tri;for(const e of edges){emit(half(remain,e,false));remain=half(remain,e,true);if(remain.length<3)break;}}
 if(!changed)return g;if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'studentcenter46-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,c,mat=24)=>b.mesh('studentcenter46-'+name,g,0,0,0,1,1,1,c,mat);
 const slab=(name,poly,y,c,mat=24)=>mesh(name,G.polygon(poly,y),c,mat);
 const box=(name,x,y,z,w,h,d,c,mat=24)=>group(name,()=>b.box(x,y,z,w,h,d,c,mat));
 const rect=(a,n,c,t)=>[[a,n],[c,n],[c,t],[a,t]];
 function glass(name,x,y,z,w,h,rotation=0,columns=2){
  b.local(x,y,z,rotation,()=>group(name,()=>{
   b.box(0,0,-.10,w,h,.06,P.glass,5);
   for(let j=0;j<=columns;j++)b.box(-w/2+w*j/columns,0,.005,.065,h+.10,.13,P.wood,6);
   for(const yy of[-h/2,h/2,h/2-.46])b.box(0,yy,.012,w+.10,.07,.14,P.wood,6);
  }));
 }
 function wingFace(name,a,q,top,rows,bays,{blank=false,clerestory=true,base=H.entrance}={}){
  const len=Math.hypot(q[0]-a[0],q[1]-a[1]);
  b.local(a[0],0,a[1],-Math.atan2(q[1]-a[1],q[0]-a[0]),()=>{
   // The outside is +local z; each pier is real masonry, with glazing recessed.
   group(name+'-masonry',()=>{
    if(base===H.entrance)b.box(len/2,(base-.1)/2,-.18,len,base+.1,.36,P.stone,24);
    if(blank)b.box(len/2,(top+base)/2,-.25,len,top-base,.50,P.brick,18);
    else{const bw=len/bays,ww=Math.min(2.35,bw*.58),rowTop=clerestory?top-3.25:top-.45,fh=(rowTop-base)/rows;
     for(let i=0;i<bays;i++){
      const x=(i+.5)*bw;
      b.box(i*bw+(bw-ww)/4,(top+base)/2,-.23,(bw-ww)/2,top-base,.46,P.brick,18);
      b.box((i+1)*bw-(bw-ww)/4,(top+base)/2,-.23,(bw-ww)/2,top-base,.46,P.brick,18);
      for(let j=0;j<rows;j++){
       const lo=base+j*fh,hi=lo+fh,wl=lo+.62,wh=hi-.44;
       b.box(x,(lo+wl)/2,-.23,ww,wl-lo,.46,P.brick,18);
       b.box(x,(wh+hi)/2,-.23,ww,hi-wh,.46,P.brick,18);
       glass(name+'-window',x,(wl+wh)/2,-.045,ww,wh-wl,0,2);
      }
      if(clerestory){
       b.box(x,rowTop+.30,-.23,ww,.60,.46,P.brick,18);
       glass(name+'-clerestory',x,top-1.64,-.045,ww,1.36,0,2);
       b.box(x,top-.47,-.23,ww,.94,.46,P.brick,18);
      }
     }
    }
    b.box(len/2,top-.13,.12,len+.32,.26,.72,P.cap,24);
    b.box(len/2,top-.50,.045,len,.14,.54,P.stone,24);
   });
  });
 }
 function hip(name,a,n,c,t,eave,ridge,axis){
  const ext=.55,A=a-ext,B=c+ext,Nn=n-ext,Tt=t+ext,g=new G.Geometry(),ribs=new G.Geometry();
  const h=axis==='ns'?(B-A)/2:(Tt-Nn)/2;
  const p=axis==='ns'?[[(A+B)/2,ridge,Nn+h],[(A+B)/2,ridge,Tt-h]]:[[A+h,ridge,(Nn+Tt)/2],[B-h,ridge,(Nn+Tt)/2]];
  const corners=[[A,eave,Nn],[B,eave,Nn],[B,eave,Tt],[A,eave,Tt]];
  if(axis==='ns'){
   g.tri(corners[0],p[0],corners[1]);g.quad(corners[1],p[0],p[1],corners[2]);g.tri(corners[2],p[1],corners[3]);g.quad(corners[3],p[1],p[0],corners[0]);
  }else{
   g.quad(corners[0],p[0],p[1],corners[1]);g.tri(corners[1],p[1],corners[2]);g.quad(corners[2],p[1],p[0],corners[3]);g.tri(corners[3],p[0],corners[0]);
  }
  mesh(name+'-hip',g,P.roof,2);
  // Fine strips follow each planar pitch, without changing the hip silhouette.
  const at=(u,v)=>{const dist=Math.min(u-A,B-u,v-Nn,Tt-v);return eave+(ridge-eave)*Math.min(1,dist/h);};
  if(axis==='ns')for(let v=Nn+.2;v<Tt-.1;v+=.34){const br=[A,Math.min(B,A+Math.min(v-Nn,Tt-v)),Math.max(A,B-Math.min(v-Nn,Tt-v)),B].sort((x,y)=>x-y);for(let i=1;i<br.length;i++)if(br[i]-br[i-1]>.001)ribs.quad([br[i-1],at(br[i-1],v+.045)+.017,v+.045],[br[i],at(br[i],v+.045)+.017,v+.045],[br[i],at(br[i],v)+.017,v],[br[i-1],at(br[i-1],v)+.017,v]);}
  else for(let u=A+.2;u<B-.1;u+=.34){const br=[Nn,Math.min(Tt,Nn+Math.min(u-A,B-u)),Math.max(Nn,Tt-Math.min(u-A,B-u)),Tt].sort((x,y)=>x-y);for(let i=1;i<br.length;i++)if(br[i]-br[i-1]>.001)ribs.quad([u,at(u,br[i-1])+.017,br[i-1]],[u,at(u,br[i])+.017,br[i]],[u+.045,at(u+.045,br[i])+.017,br[i]],[u+.045,at(u+.045,br[i-1])+.017,br[i-1]]);}
  ribs.detailWidth=.045;mesh(name+'-tile-lines',ribs,P.tile,2);
  group(name+'-ridge',()=>b.beam(p[0].map((x,i)=>i===1?x+.07:x),p[1].map((x,i)=>i===1?x+.07:x),.16,P.tile,2));
  slab(name+'-soffit',rect(A,Nn,B,Tt),eave-.18,P.stone);
 }
 b.local(O[0],0,O[1],R,()=>{
  const original=f.geometry.coordinates[0].slice(0,-1).map(local);
  slab('original-occupied-floor',original,.12,P.stone);
  // Individual wings; the west block never occupies the glass hall.
  slab('west-ceiling',rect(0,0,20,58.94),H.westEave-.32,P.brick,18);
  slab('north-ceiling',rect(20,-6.752,56.7,N),H.wingEave-.32,P.brick,18);
  slab('south-ceiling',rect(20,T,56.6,63.749),H.wingEave-.32,P.brick,18);
  wingFace('west-outside',[0,0],[0,58.94],H.westEave,4,15);
  wingFace('west-north-end',[20,0],[0,0],H.westEave,4,5);
  wingFace('west-south-end',[0,58.94],[20,58.94],H.westEave,4,5);
  // Courtyard upper west wall is above the low glass roof; no masonry fills the hall.
  wingFace('west-above-atrium',[20,T],[20,N],H.westEave,2,11,{base:H.glass,clerestory:true});
  wingFace('west-northeast-upper',[20,N],[20,0],H.westEave,1,1,{base:H.wingEave,blank:true,clerestory:false});
  wingFace('west-southeast-upper',[20,58.94],[20,T],H.westEave,1,1,{base:H.wingEave,blank:true,clerestory:false});
  box('atrium-rear-support',19.76,H.glass/2,MID,.48,H.glass,T-N,P.brick,18);
  wingFace('north-outside',[56.7,-6.752],[20,-6.752],H.wingEave,3,9);
  wingFace('north-shoulder-outer',[61.255,-6.752],[56.7,-6.752],H.wingEave-1.5,3,1,{clerestory:false});
  wingFace('south-outside',[20,63.749],[56.6,63.749],H.wingEave,3,9);
  wingFace('south-shoulder-outer',[56.6,63.749],[61.133,63.749],H.wingEave-1.5,3,1,{clerestory:false});
  wingFace('southwest-south',[10.358,63.749],[20,63.749],H.wingEave-1.5,3,2,{clerestory:false});
  wingFace('southwest-west',[10.358,58.94],[10.358,63.749],H.wingEave-1.5,3,1,{blank:true,clerestory:false});
  wingFace('north-inner',[20,N],[56.7,N],H.wingEave,3,9);
  wingFace('north-shoulder-inner',[56.7,N],[61.255,N],H.wingEave-1.5,3,1,{clerestory:false});
  wingFace('south-inner',[56.6,T],[20,T],H.wingEave,3,9);
  wingFace('south-shoulder-inner',[61.133,T],[56.6,T],H.wingEave-1.5,3,1,{clerestory:false});
  // Eastern terminations are flat-roofed shoulders, directly present in native imagery.
  wingFace('north-east',[61.255,N],[61.255,-6.752],H.wingEave-1.50,3,3,{clerestory:false});
  wingFace('south-east',[61.133,63.749],[61.133,T],H.wingEave-1.50,3,3,{clerestory:false});
  slab('north-flat-shoulder',rect(56.7,-6.752,61.255,N),H.wingEave-1.50,P.floor);
  slab('south-flat-shoulder',rect(56.6,T,61.133,63.749),H.wingEave-1.50,P.floor);
  slab('southwest-flat-link',rect(10.358,58.94,20,63.749),H.wingEave-1.50,P.floor);
  wingFace('north-shoulder-upper-step',[56.7,N],[56.7,-6.752],H.wingEave,1,1,{base:H.wingEave-1.5,blank:true,clerestory:false});
  wingFace('south-shoulder-upper-step',[56.6,63.749],[56.6,T],H.wingEave,1,1,{base:H.wingEave-1.5,blank:true,clerestory:false});
  // Northwest short connection belongs to the source notch, with no invented door.
  slab('northwest-flat-link',[[4.931,-6.752],[20,-6.752],[20,0],[4.927,0]],H.wingEave-1.50,P.floor);
  wingFace('northwest-north',[20,-6.752],[4.931,-6.752],H.wingEave-1.50,3,4,{clerestory:false});
  wingFace('northwest-west',[4.931,-6.752],[4.927,0],H.wingEave-1.50,3,1,{blank:true,clerestory:false});
  hip('west',0,0,20,58.94,H.westEave,H.westRidge,'ns');
  hip('north',20,-6.752,56.7,N,H.wingEave,H.wingRidge,'ew');
  hip('south',20,T,56.6,63.749,H.wingEave,H.wingRidge,'ew');
  // Two-storey low front hall with real recessed bays; the source C footprint stays intact.
  const frontV=[...Array.from({length:4},(_,i)=>MID-5.65-i*3.6).reverse(),MID,...Array.from({length:4},(_,i)=>MID+5.65+i*3.6)];
  const openings=frontV.map(v=>({v,w:v===MID?6.5:2.0}));
  group('east-front-masonry',()=>{
   const cuts=[{v:N,w:0},...openings,{v:T,w:0}];for(let i=1;i<cuts.length;i++){const left=cuts[i-1].v+cuts[i-1].w/2,right=cuts[i].v-cuts[i].w/2;if(right>left)b.box(U-.48,(2.10+10.20)/2,(left+right)/2,.96,8.10,right-left,P.brick,18);}
   b.box(U-.48,10.75,MID,.96,1.10,T-N,P.brick,18);
   b.box(U-.42,H.front+.03,MID,1.16,.15,T-N+.30,P.cap,24);
   const baseHoles=openings.filter(q=>q.v!==MID).map(q=>({v:q.v,w:1.85}));
   const baseCuts=[{v:N,w:0},...baseHoles,{v:T,w:0}];
   for(let i=1;i<baseCuts.length;i++){const a=baseCuts[i-1].v+baseCuts[i-1].w/2,c=baseCuts[i].v-baseCuts[i].w/2;if(c>a)b.box(U-.30,(H.court+H.entrance)/2,(a+c)/2,.60,H.entrance-H.court,c-a,P.stone,24);}
   for(const q of baseHoles){b.box(U-.30,(H.court-2.28)/2,q.v,.60,-2.28-H.court,q.w,P.stone,24);b.box(U-.30,(.20+H.entrance)/2,q.v,.60,H.entrance-.20,q.w,P.stone,24);}
   for(const q of openings){b.box(U-.35,5.65,q.v,1.12,.58,q.w,P.stone,24);}
  });
  for(const [i,q]of openings.entries()){
   glass('east-front-lower',U-.95,3.55,q.v,q.w-.15,3.10,Math.PI/2,q.v===MID?5:2);
   glass('east-front-upper',U-.95,7.90,q.v,q.w-.15,3.14,Math.PI/2,q.v===MID?5:2);
   if(q.v!==MID)glass('east-basement',U-.025,-1.04,q.v,1.75,2.48,Math.PI/2,2);
  }
  // Central glazed entrance at the bridge landing; shallow, human-scale double leaves.
  b.local(U-.66,H.entrance,MID,Math.PI/2,()=>group('main-door',()=>{
   for(const x of[-.64,.64]){b.box(x,1.28,.02,1.25,2.56,.10,P.glass,5);for(const xx of[x-.64,x+.64])b.box(xx,1.28,.10,.10,2.70,.16,P.wood,6);b.box(x,2.56,.10,1.28,.12,.16,P.wood,6);b.box(x>0?.17:-.17,1.22,.22,.04,.65,.08,P.steel,9);}
  }));
  group('building-name',()=>b.lettering('新太阳学生中心',U+.025,10.60,MID,15.0,.83,Math.PI/2,'#4a423d'));
  // Flat glass roof and white orthogonal structure, supported by the low hall.
  slab('atrium-raised-floor',rect(20.22,N+.18,U-.40,T-.18),H.entrance,P.stone);
  slab('atrium-glass',rect(20.22,N+.18,U-.97,T-.18),H.glass,'#a7b8af',28);
  group('atrium-grid',()=>{
   const a=20.22,c=U-.97,n=N+.18,t=T-.18;
   for(let i=0;i<=9;i++)b.box(a+(c-a)*i/9,H.glass+.04,(n+t)/2,.13,.20,t-n,P.cap,29);
   for(let j=0;j<=18;j++)b.box((a+c)/2,H.glass+.04,n+(t-n)*j/18,c-a,.20,.13,P.cap,29);
  });
  // Genuine excavated side courts. A ground-cut registration removes all map
  // and ground patches here; the visible deck alone bridges the opening.
  slab('sunken-court-floor',court,H.court,P.floor);
  group('court-stone-walls',()=>{
   for(const v of[N+.15,T-.15])b.box((U+61.18)/2,(H.court+.22)/2,v,61.18-U,.22-H.court,.26,P.stone,24);
   b.box(61.07,(H.court+.22)/2,MID,.24,.22-H.court,T-N-.26,P.stone,24);
   for(const v of[N+.12,T-.12])b.box((U+61.18)/2,.30,v,61.18-U,.15,.42,P.cap,24);
   b.box(61.16,.30,MID,.40,.15,T-N-.26,P.cap,24);
  });
  group('stair-bridge',()=>{
   const width=12.5,step=.19; // Scale fit, not surveyed riser dimensions.
   for(let i=0;i<6;i++)b.box(60.80-i*.39,(.20+step*(i+1))/2,MID,.42,.20+step*(i+1),width,P.stone,24);
   b.box(53.52,1.34-.14,MID,10.24,.28,width,P.stone,24);
   for(let i=0;i<3;i++)b.box(48.20-i*.40,1.34+(.51/3)*(i+.5),MID,.42,.51/3,width,P.stone,24);
   b.box(43.895,1.85-.14,MID,6.69,.28,width,P.stone,24);
   for(const v of[MID-width/2,MID+width/2]){
    const wall=new G.Geometry(),points=[[47.08,1.34],[47.08,2.95],[56.80,2.45],[56.80,1.34]];
    for(const off of[-.18,.18]){const ps=points.map(p=>[p[0],p[1],v+off]);if(off>0)ps.reverse();wall.quad(...ps);}for(let i=0;i<points.length;i++){const a=points[i],c=points[(i+1)%points.length];wall.quad([a[0],a[1],v-.18],[a[0],a[1],v+.18],[c[0],c[1],v+.18],[c[0],c[1],v-.18]);}mesh('bridge-brick-parapet-'+v,wall,P.brick,18);
    b.beam([47.08,2.99,v],[56.8,2.49,v],.19,P.cap,24);
    for(const u of[60.9,59.65,58.4]){const ground=.22+(60.9-u)/.39*.19;b.box(u,ground+.48,v,.10,.96,.11,P.steel,9);}
    b.beam([60.9,1.18,v],[58.4,2.40,v],.065,P.steel,9);
    b.beam([60.9,.72,v],[58.4,1.94,v],.045,P.steel,9);
   }
  });
  // Visible protection at the street edge of each lower court; no speculative access door.
  group('court-railings',()=>{for(const [n,t]of[[N+.5,MID-6.4],[MID+6.4,T-.5]]){
   for(let v=n;v<=t;v+=1.6)b.box(61.15,.83,v,.065,1.0,.065,P.steel,9);
   b.box(61.15,1.29,(n+t)/2,.065,.065,t-n,P.steel,9);b.box(61.15,.85,(n+t)/2,.06,.06,t-n,P.steel,9);
  }});
 });
 return{id:ID,strategy:'south-studentcenter46',entranceFacing:'east',roofAxes:['north-south','east-west','east-west'],glassHall:true,groundCutRequired:true,heights:H,heightsMeasured:false,allFacadesVerified:false,originalOutlineRetained:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};
Y.StudentCenterSouth46={id:ID,render,world,local,groundCut,clipGroundRibbon,heights:H,facadeOpenings:9};
})(YY);
