/* Heren 19/20/21: original OSM wall feet, independent depths, three storeys,
 * photographed hard gables, court-facing entries and low terrace links.
 * 2021 completion fixes storey height at 3.2m and overall height about13m.
 * Absolute eaves/crowns, hidden openings and gallery dimensions remain fits.
 * The2025 text calls the roof juanpeng, but its photographs show pointed end
 * gables and a longitudinal ridge; this module follows the actual images. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,G=Y.Geo;
const C={brick:'#97988d',plaster:'#aaa99b',stone:'#b5b5a6',belt:'#b2b3a9',red:'#87362f',glass:'#63736a',roof:'#92978d',tile:'#b7bab0',green:'#497368',dark:'#444e47'};
const S={
 'relation/12815351':{number:19,pick:10,corners:[[54.940,563.633],[106.080,561.390],[106.763,572.782],[55.641,575.636]],front:1,entry:[81.202,574.2090000000001],windowDatum:[72.243,574.714],bays:15,eave:10.25,crown:13.00,ends:[true,false]},
 'relation/12815354':{number:20,pick:13,corners:[[60.094,580.955],[62.896,620.061],[48.343,620.794],[45.533,581.699]],front:0,entry:[61.495000000000005,600.508],windowDatum:[61.376000000000005,598.864],bays:11,eave:10.35,crown:13.65,ends:[true,true]},
 'relation/12815350':{number:21,pick:9,corners:[[57.178,624.858],[108.318,622.615],[109.001,634.007],[57.878,636.860]],front:0,entry:[82.74799999999999,623.7365],windowDatum:[74.293,624.103],bays:15,eave:10.25,crown:13.00,ends:[true,false]}
};
const gallerySpecs=[{"name":"north19-20","ring":[[55.21121648754478,567.9345],[50.81121648754478,567.9345],[51.598213529950854,581.41],[55.99821352995085,581.41]],"width":4.4,"wall":[[54.94,563.633],[55.641,575.636]],"doorZ":569.6345,"endZ":581.41,"north":true,"near":20,"eastOpenEdge":[[55.661,575.636],[55.99821352995085,581.41]],"deckTop":3.64,"deckBottom":3.28},{"name":"south20-21","ring":[[56.935077153807704,620.35],[52.535077153807705,620.35],[53.24715014164307,632.5590000000001],[57.64715014164307,632.5590000000001]],"width":4.4,"wall":[[57.178,624.858],[57.878,636.86]],"doorZ":630.859,"endZ":620.35,"north":false,"near":20,"eastOpenEdge":[[56.935077153807704,620.35],[57.198,624.858]],"deckTop":3.64,"deckBottom":3.28},{"name":"north22-23","ring":[[61.860991168874456,674.2165],[57.46099116887446,674.2165],[58.150137382321084,686.17],[62.55013738232108,686.17]],"width":4.4,"wall":[[61.593,669.915],[62.285,681.918]],"doorZ":675.9165,"endZ":686.17,"north":true,"near":23,"eastOpenEdge":[[62.305,681.918],[62.55013738232108,686.17]],"deckTop":3.64,"deckBottom":3.28},{"name":"south23-24","ring":[[63.67455074154307,715.6],[59.274550741543074,715.6],[60.378150141643054,734.522],[64.77815014164305,734.522]],"width":4.4,"wall":[[64.309,726.821],[65.009,738.823]],"doorZ":732.822,"endZ":715.6,"north":false,"near":23,"eastOpenEdge":[[63.67455074154307,715.6],[64.329,726.821]],"deckTop":3.64,"deckBottom":3.28}];
const links={north:gallerySpecs[0].ring,south:gallerySpecs[1].ring};

// Both courtyards use one gallery construction: a straight deck, open lower
// passage, brick columns and shallow pierced parapet. No elbow compensates
// for a misplaced building. Exact widths/heights remain display fits.
function straightGallery(b,c){
 const old=b.e.add;b.e.add=function(k,...q){return old.call(this,'straight-'+c.name+'-'+k,...q);};
 try{
  const ring=c.ring,top=c.deckTop,lo=c.deckBottom;
  const mesh=(key,g,col,mat=24)=>b.mesh(key,g,0,0,0,1,1,1,col,mat);
  mesh('paving',G.polygon(ring,.14),C.stone);
  const deck=G.polygon(ring,top),under=new G.Geometry(),fascia=new G.Geometry();
  mesh('deck',deck,C.stone);
  for(let k=0;k<deck.v.length;k+=24)under.tri([deck.v[k+16],lo,deck.v[k+18]],[deck.v[k+8],lo,deck.v[k+10]],[deck.v[k],lo,deck.v[k+2]]);
  mesh('underside',under,C.plaster);
  for(let i=0;i<4;i++){const p=ring[i],q=ring[(i+1)%4];fascia.quad([p[0],lo,p[1]],[q[0],lo,q[1]],[q[0],top,q[1]],[p[0],top,p[1]]);}
  mesh('fascia',fascia,C.belt);
  const posts=new Set();
  function rail(p,q,columns=true){
   const w=Math.hypot(q[0]-p[0],q[1]-p[1]);if(w<.10)return;
   b.local(p[0],0,p[1],-Math.atan2(q[1]-p[1],q[0]-p[0]),()=>{
    b.box(w/2,3.92,0,w,.52,.26,C.plaster,24);
    b.box(w/2,4.41,0,w,.12,.35,C.belt,24);
    const n=Math.max(1,Math.round(w/.48));for(let j=0;j<=n;j++)b.box(j*w/n,4.24,0,.20,.24,.30,C.brick,30);
    const bays=Math.max(1,Math.round(w/3.2));
    for(let j=0;j<=bays;j++){
     const x=j*w/bays,key=[p[0]+(q[0]-p[0])*j/bays,p[1]+(q[1]-p[1])*j/bays].map(t=>t.toFixed(3)).join(',');
     if(posts.has(key))continue;posts.add(key);
     if(columns)b.box(x,1.71,0,.42,3.14,.42,C.brick,30);
     b.box(x,4.04,0,.46,1.01,.46,C.brick,30);b.box(x,4.58,0,.62,.12,.62,C.belt,24);
    }
   });
  }
  // Long outer edge is continuous and straight. The other long edge merges
  // with the gable wall; do not run a parapet across that door or attachment.
  rail(ring[1],ring[2]);rail(...c.eastOpenEdge);
  if(c.north)rail(ring[0],ring[1]);else rail(ring[2],ring[3]);
 }finally{b.e.add=old;}
}
// Small ground-level door for previously blank connector gables. Reuses the
// existing red frame and stone lintel rather than importing another style.
function galleryDoor(b,x,z,rotation){b.local(x,0,z,rotation,()=>{
 b.box(0,1.88,.075,2.25,2.80,.12,C.red,6);
 b.box(0,2.02,.15,2.05,2.42,.035,C.glass,5);
 for(const u of[-1.06,0,1.06])b.box(u,1.89,.19,.07,2.76,.08,C.red,6);
 for(const y of[.75,2.77,3.24])b.box(0,y,.19,2.18,.07,.08,C.red,6);
 for(const u of[-1.27,1.27])b.box(u,1.91,.09,.22,3.02,.20,C.belt,24);
 b.box(0,3.48,.24,2.80,.20,.60,C.belt,24);
 for(let j=0;j<3;j++)b.box(0,.15+j*.12,1.20-j*.29,2.72,.16,.62,C.stone,24);
});}

function render(b,f){
 const s=S[f.properties.id];b.id=f.properties.pickId;
 // Keep inherited atlas reservations in the same order without emitting the
 // obsolete giant facade wording. Other buildings keep their exact UV slots.
 if(b.lettering){const add=b.e.add;b.e.add=()=>{};try{b.lettering(s.number+'号楼',0,0,0,1,1,0,'#663d34');b.lettering('河仁苑',0,0,0,1,1,0,'#775749');}finally{b.e.add=add;}}
 const [a,c,d,e]=s.corners, W=(Math.hypot(c[0]-a[0],c[1]-a[1])+Math.hypot(d[0]-e[0],d[1]-e[1]))/2,D=(Math.hypot(e[0]-a[0],e[1]-a[1])+Math.hypot(d[0]-c[0],d[1]-c[1]))/2;
 const pt=(u,v,y=0)=>[(a[0]*(1-u)+c[0]*u)*(1-v)+(e[0]*(1-u)+d[0]*u)*v,y,(a[1]*(1-u)+c[1]*u)*(1-v)+(e[1]*(1-u)+d[1]*u)*v];
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...q){return old.call(this,'heren-'+s.number+'-'+name+'-'+k,...q);};try{return fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>{if(g.v.length)b.mesh('heren-'+s.number+'-'+name,g,0,0,0,1,1,1,col,mat);};
 const openings=[];
 function face(name,p,q,count,entry,end=false){
  const w=Math.hypot(q[0]-p[0],q[1]-p[1]),r=-Math.atan2(q[1]-p[1],q[0]-p[0]),holes=[];
  // User correction2026-09-13: court doors are centered on their own long
  // wall. Keep existing window positions and change only the affected ground
  // opening plus porch/number; public OSM nodes remain independent evidence.
  const entryX=entry&&!end?((s.entry[0]-p[0])*(q[0]-p[0])+(s.entry[1]-p[1])*(q[1]-p[1]))/w:w/2;
  const entryBay=entry&&!end?Math.round(entryX/w*count-.5):Math.floor(count/2);
  const datum=s.windowDatum||s.entry,rhythmX=entry&&!end?((datum[0]-p[0])*(q[0]-p[0])+(datum[1]-p[1])*(q[1]-p[1]))/w:w/2,rhythmBay=entry&&!end?Math.round(rhythmX/w*count-.5):Math.floor(count/2);
  const centres=Array.from({length:count},(_,k)=>entry&&!end?(k<rhythmBay?rhythmX-(rhythmBay-k)*rhythmX/(rhythmBay+.5):k>rhythmBay?rhythmX+(k-rhythmBay)*(w-rhythmX)/(count-rhythmBay-.5):rhythmX):(k+.5)*w/count);
  for(let floor=0;floor<3;floor++)for(let k=0;k<count;k++){
     if(end&&floor===0&&!entry)continue;
     const door=entry&&floor===0&&k===entryBay;let x=door&&!end?entryX:centres[k];
     // Move only a ground opening that would collide with the relocated porch.
     if(entry&&!end&&floor===0&&!door){const clearance=Math.max(3.385,w/count);if(Math.abs(x-entryX)<clearance)x=entryX+Math.sign(x-entryX)*clearance;}
   holes.push({x,w:door?2.25:(end?1.70:1.95),lo:door?.48:1.25+3.2*floor,hi:door?3.22:3.32+3.2*floor,door,floor,k});
  }
  openings.push({face:name,positions:holes,observed:entry||end&&s.ends[name==='end0'?0:1],countFitted:count!==11&&count!==1});
  b.local(p[0],0,p[1],r,()=>{
   group(name+'-wall',()=>{
    const levels=[.05,.95,6.95,s.eave,...holes.flatMap(h=>[h.lo,h.hi])].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-7);
    for(let j=1;j<levels.length;j++){
     const lo=levels[j-1],hi=levels[j];if(hi>s.eave)continue;
     const cuts=holes.filter(h=>h.lo<=lo+1e-7&&h.hi>=hi-1e-7).sort((a,b)=>a.x-b.x);let cursor=0;
     const part=(u,v)=>{if(v-u>1e-7)b.box((u+v)/2,(lo+hi)/2,-.18,v-u,hi-lo,.36,hi<=.95?C.stone:!end&&lo>=6.95?C.plaster:C.brick,hi<=.95||!end&&lo>=6.95?24:30);};
     for(const h of cuts){part(cursor,h.x-h.w/2);cursor=h.x+h.w/2;}part(cursor,w);
    }
    // Seismic belts belong to the observed brick frame, not extra floors.
    for(const yy of[.96,3.63,6.83]){
     const doors=holes.filter(h=>h.door&&yy+.10>h.lo&&yy-.10<h.hi).sort((a,b)=>a.x-b.x);let cursor=0;
     for(const h of doors){const right=h.x-h.w/2;if(right>cursor)b.box((cursor+right)/2,yy,.045,right-cursor,.20,.14,C.belt,24);cursor=h.x+h.w/2;}
     if(cursor<w)b.box((cursor+w)/2,yy,.045,w-cursor,.20,.14,C.belt,24);
    }
    b.box(w/2,s.eave-.14,.055,w,.18,.17,C.brick,30);
    if(!end){const riseAtWall=(s.crown-s.eave)*Math.pow(1-1/(1+1.36/D),1.48);b.box(w/2,s.eave+riseAtWall/2,-.05,w,riseAtWall+.012,.18,C.red,6);}
    for(let k=0;k<=count&&count>0;k++){
     const x=k===0?0:k===count?w:(centres[k-1]+centres[k])/2;
     if(end){if(k===0||k===count)b.box(x,s.eave/2,.07,.28,s.eave,.22,C.belt,24);}
     else b.box(x,(s.eave+6.95)/2,.025,.28,s.eave-6.95,.17,C.brick,30);
    }
   });
   group(name+'-openings',()=>{for(const h of holes){
    const cy=(h.lo+h.hi)/2,hh=h.hi-h.lo;
    b.box(h.x,cy,-.13,h.w,hh,.025,h.door?C.dark:C.glass,h.door?5:28);
    for(const x of[h.x-h.w/2,h.x-h.w/6,h.x+h.w/6,h.x+h.w/2])b.box(x,cy,.015,.07,hh+.07,.11,C.red,6);
    for(const y of[h.lo,h.door?2.81:h.lo+.63,h.hi])b.box(h.x,y,.018,h.w+.06,.065,.12,C.red,6);
    if(h.door){for(const side of[-1,1])b.box(h.x+side*h.w*.38,.92,.045,h.w*.22,.85,.14,C.red,6);}
    else {
     // Archived heritage photographs show concrete lintels and brick reveals.
     // Detail only photographed court faces / identified gable faces; back
     // elevations retain their explicitly approximate existing construction.
     if(entry||end&&s.ends[name==='end0'?0:1]){
      for(const side of[-1,1])b.box(h.x+side*(h.w/2-.055),cy,-.09,.11,hh,.22,C.brick,30);
      b.box(h.x,h.hi+.10,.055,h.w+.32,.20,.29,C.belt,24);
     }
     b.box(h.x,h.lo-.07,.11,h.w+.22,.13,.35,C.brick,30);
    }
   }});
   if(end){
    // Direct19 west /20 ends /21 west originals: one central upper column.
    group(name+'-frame',()=>{for(const x of[w/2-1.25,w/2+1.25])b.box(x,s.eave/2,.10,.26,s.eave,.23,C.belt,24);});
   }
   if(entry&&!end)group(name+'-porch',()=>{
    const x=entryX;
    for(const side of[-1,1]){
     b.box(x+side*1.78,2.02,.76,.53,3.10,1.53,C.brick,30);
     b.box(x+side*1.78,.94,.80,.59,1.02,1.58,C.stone,24);
     for(let j=0;j<4;j++)b.box(x+side*1.78,3.39+j*.12,.81,.60+j*.08,.12,1.58+j*.05,C.brick,30);
    }
    // The awning is a small pitched tile cap, independent of the main roof.
    b.box(x,3.90,.78,4.34,.16,1.90,C.red,6);
    const cap=new G.Geometry();const cp=(u,v)=>[x+u,3.93+.45*Math.pow(1-v,1.4)+.10*Math.pow(Math.abs(u)/2.25,8),.02+v*1.85];
    for(let k=0;k<10;k++)cap.quad(cp(-2.25,k/10),cp(-2.25,(k+1)/10),cp(2.25,(k+1)/10),cp(2.25,k/10));
    b.mesh('porch-tiles',cap,0,0,0,1,1,1,C.roof,2);
    for(let k=0;k<=18;k++)for(let j=0;j<8;j++){const u=-2.22+k*4.44/18;b.beam(cp(u,j/8),cp(u,(j+1)/8),.035,C.tile,2);}
    for(let j=0;j<4;j++)b.box(x,.075+j*.12,2.91-j*.31,4.30,.15,.66,C.stone,24);
    b.box(x,.38,1.35,4.30,.22,2.6,C.stone,24);
    // No.20's photographed porch has solid sloping stone stair cheeks.
    // Keep all doorway positions and the shared straight galleries fixed.
    if(s.number===20){
     const cheek=new G.Geometry();
     for(const side of[-1,1]){
      const x0=x+side*2.15,x1=x+side*2.53,z0=1.94,z1=3.25;
      const a=[x0,.49,z0],c=[x1,.49,z0],d=[x1,.08,z1],e=[x0,.08,z1];
      const quad=(...points)=>cheek.quad(...(side>0?points.reverse():points));
      quad(a,c,d,e);quad(e,d,[x1,0,z1],[x0,0,z1]);
      quad(a,e,[x0,0,z1],[x0,0,z0]);
      quad(d,c,[x1,0,z0],[x1,0,z1]);
     }
     b.mesh('porch-stone-cheeks',cheek,0,0,0,1,1,1,C.stone,24);
    }
    // Small circular number plate is photographed. Geometry avoids adding
    // three new text-atlas slots and changing unrelated objects' texture UVs.
    const disk=new G.Geometry();for(let j=0;j<32;j++){const t=j*Math.PI/16,u=(j+1)*Math.PI/16;disk.tri([x,6.99,.13],[x+Math.cos(t)*.28,6.99+Math.sin(t)*.28,.13],[x+Math.cos(u)*.28,6.99+Math.sin(u)*.28,.13]);}b.mesh('number-disc',disk,0,0,0,1,1,1,'#d5d8cc',24);
    const digits={'0':[0,1,2,3,4,5],'1':[1,2],'2':[0,1,6,4,3],'9':[0,1,2,3,5,6]},segments=[[0,.14,.12,.028],[.07,.075,.025,.13],[.07,-.075,.025,.13],[0,-.14,.12,.028],[-.07,-.075,.025,.13],[-.07,.075,.025,.13],[0,0,.12,.028]];
    [...String(s.number)].forEach((n,k)=>{for(const t of digits[n]){const q=segments[t];b.box(x+(k-.5)*.18+q[0]*.8,6.99+q[1],.15,q[2]*.8,q[3],.02,C.dark,24);}});
   });
   if(entry&&end)group(name+'-end-entry',()=>{b.box(w/2,3.51,.36,2.64,.20,.92,C.belt,24);for(let j=0;j<3;j++)b.box(w/2,.07+j*.14,1.25-j*.26,2.64,.16,.54,C.stone,24);});
  });
 }
 const xy=p=>[p[0],p[2]];
 face('long0',xy(pt(1,0)),xy(pt(0,0)),s.bays,s.front===0);
 face('long1',xy(pt(0,1)),xy(pt(1,1)),s.bays,s.front===1);
 face('end0',xy(pt(0,0)),xy(pt(0,1)),1,true,true);
 face('end1',xy(pt(1,1)),xy(pt(1,0)),s.ends[1]?1:0,s.number===20,true);
 const roof=new G.Geometry(),tiles=new G.Geometry(),gable=new G.Geometry(),over=.68/D,umin=-.055/W,umax=1+.055/W;
 const roofY=v=>s.eave+(s.crown-s.eave)*Math.pow(Math.max(0,1-Math.abs(2*v-1)/(1+2*over)),1.48);
 const rp=(u,v,up=0)=>pt(u,v,roofY(v)+up);
 for(let j=0;j<32;j++){
  const v=-over+(1+2*over)*j/32,q=-over+(1+2*over)*(j+1)/32;
  roof.quad(rp(umin,v),rp(umin,q),rp(umax,q),rp(umax,v));
  for(let u=0;u<=1;u+=.245/W)tiles.quad(rp(u-.032/W,v,.028),rp(u-.032/W,q,.028),rp(u+.032/W,q,.028),rp(u+.032/W,v,.028));
 }
 for(const u of[0,1])for(let j=0;j<32;j++){
  const v=j/32,q=(j+1)/32,points=[pt(u,v,s.eave-.15),pt(u,q,s.eave-.15),rp(u,q),rp(u,v)];if(u===1)points.reverse();gable.quad(...points);
 }
 mesh('gray-timber-gable-roof',roof,C.roof,2);tiles.detailWidth=.064;mesh('gray-tile-courses',tiles,C.tile,2);mesh('hard-gables',gable,C.brick,30);
 group('roof-trim',()=>{
  b.beam(rp(umin,.5,.11),rp(umax,.5,.11),.18,C.tile,2);
  for(const u of[umin,umax]){
   for(let j=0;j<32;j++)b.beam(rp(u,-over+(1+2*over)*j/32,.10),rp(u,-over+(1+2*over)*(j+1)/32,.10),.13,C.tile,2);
   const p=rp(u,.5);b.box(p[0],p[1]+.28,p[2],.20,.42,.28,C.tile,2);
  }
  for(const v of[-over,1+over]){
   const p=rp(0,v),q=rp(1,v);b.beam([p[0],s.eave-.13,p[2]],[q[0],s.eave-.13,q[2]],.14,C.red,6);
   for(let k=0;k<=Math.floor(W/.31);k++){
    const u=k/Math.floor(W/.31),p=rp(u,v),q=pt(u,v<0?0:1,s.eave-.23);
    b.beam([p[0],s.eave-.23,p[2]],q,.062,C.red,6);
    b.box(p[0],s.eave-.18,p[2],.095,.11,.095,C.green,24);
   }
  }
 });
 mesh('ceiling',G.polygon(s.corners,s.eave-.20),C.plaster,24);
 if(s.number===20)for(const c of gallerySpecs.filter(c=>c.near===20))straightGallery(b,c);
 return{id:f.properties.id,strategy:'south-heren-specific-v46',number:s.number,wallFootprint:s.number===20?'user-corrected-west-offset':'original-OSM-baseline',depth:D,length:W,floors:3,storeyHeight:3.2,eave:s.eave,crown:s.crown,roofAxis:s.number===20?'north-south':'east-west',courtEntry:s.number===19?'south':s.number===20?'east':'north',openings,heightMeasured:false,hiddenFacadesVerified:false};
}
A.render=function(b,f,add){return S[f.properties.id]?render(b,f):prior(b,f,add);};Y.SouthHeren46={ids:Object.keys(S),spec:S,links,gallerySpecs,straightGallery,galleryDoor,render};
// The courtyard road/porch edit must not change rejection sampling elsewhere.
// Retain the pre-edit obstacle set only for indicative tree sampling/clearance;
// the single trunk on the new centre path is moved locally, with its ID/shape.
const treeObstacles={"relation/12815350":{"geometry":{"type":"MultiPolygon","coordinates":[[[[57.878,636.86],[109.001,634.007],[108.318,622.615],[74.293,624.103],[57.178,624.858],[57.878,636.86]]],[[[76.54083895612087,624.0044098009663],[72.04516104387915,624.2015901990336],[71.96190709802855,622.3034150805315],[76.45758501027026,622.1062346824642],[76.54083895612087,624.0044098009663]]]]},"bounds":[57.178,622.1062346824642,109.001,636.86]},"relation/12815351":{"geometry":{"type":"MultiPolygon","coordinates":[[[[55.641,575.636],[72.243,574.714],[106.763,572.782],[106.08,561.39],[54.94,563.633],[55.641,575.636]]],[[[69.99649809071299,574.8394159940751],[74.489501909287,574.588584005925],[74.59540874872816,576.4856300626562],[70.10240493015415,576.7364620508064],[69.99649809071299,574.8394159940751]]]]},"bounds":[54.94,561.39,106.763,576.7364620508064]},"relation/12815354":{"geometry":{"type":"MultiPolygon","coordinates":[[[[49.893,620.794],[64.446,620.061],[62.926,598.864],[61.644,580.955],[47.083,581.699],[49.893,620.794]]],[[[55.641,575.636],[61.251,575.324],[61.644,580.955],[56.034,581.242],[55.641,575.636]]],[[[54.243,620.575],[61.702,620.199],[62.05,624.644],[57.178,624.858],[57.559,631.393],[53.861,631.603],[53.451,624.972],[54.538,624.911],[54.243,620.575]]],[[[63.086803422356965,601.1082464791904],[62.76519657764304,596.6197535208097],[64.66033804895933,596.4839639641527],[64.98194489367326,600.9724569225334],[63.086803422356965,601.1082464791904]]]]},"bounds":[47.083,575.324,64.98194489367326,631.603]},"relation/12815355":{"geometry":{"type":"Polygon","coordinates":[[[56.3429,716.1596],[54.2134,686.4357],[65.5842,685.6211],[66.4946,698.3285],[68.1404,698.2106],[68.4491,702.5196],[66.8034,702.6375],[67.7138,715.3449],[56.3429,716.1596]]]},"bounds":[54.2134,685.6211,68.4491,716.1596]},"way/1153752222":{"geometry":{"type":"LineString","coordinates":[[115.42122,595.933],[72.926,598.298],[72.243,574.714]]},"bounds":[72.243,574.714,116.158,598.298]},"way/1153752223":{"geometry":{"type":"LineString","coordinates":[[72.926,598.298],[74.293,624.103]]},"bounds":[72.926,598.298,74.293,624.103]},"way/1153752224":{"geometry":{"type":"LineString","coordinates":[[72.926,598.298],[62.926,598.864]]},"bounds":[62.926,598.298,72.926,598.864]}};
const samplingData=D=>({...D,features:D.features.map(f=>{const q=treeObstacles[f.properties.id];return q?{...f,geometry:q.geometry,properties:{...f.properties,bounds:q.bounds}}:f;})});
if(Y.Vegetation33){const generate=Y.Vegetation33.generate,makeClear=Y.Vegetation33.makeClear;
 Y.Vegetation33.generate=D=>generate(samplingData(D)).map(t=>t.id===815054?{...t,point:[80,613.8]}:t);
 Y.Vegetation33.makeClear=D=>makeClear(samplingData(D));
}

})(YY);
