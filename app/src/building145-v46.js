/* 145 / Changchunyuan 62. Original stepped slab, independently registered
 * against the middle red building in episode 2, 79.92–83.92s (native 4K).
 * Five full storeys, white setback sixth storey, north roof terraces and
 * two different slab depths. Heights/bay dimensions are fitted, not surveyed.
 * The foreground building with three large roof gables is 61, not this one. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/849765892';
const O=[-676.748,8.761],angle=0.11168052178158522,C={red:'#bd6d59',white:'#e3e3dd',base:'#91958e',glass:'#71898a',dark:'#344344',frame:'#d9dfd9',roof:'#b77861',tile:'#cf9274',terrace:'#92988c',metal:'#bbc0b6'};
const H={base:.42,floor:2.88,terrace:14.82,atticEave:17.65,ridge:20.10};
// The south step is 48.81m from the west end. The north line is continuous.
const wings=[{name:'west',x0:0,x1:48.81,depth:17.934,setback:7.0,ridgeZ:12.45},{name:'east',x0:48.81,x1:71.445,depth:13.307,setback:5.55,ridgeZ:9.40}];
const local=p=>{const x=p[0]-O[0],z=p[1]-O[1],c=Math.cos(angle),s=Math.sin(angle);return[x*c-z*s,x*s+z*c];};
function render(b,f){b.id=f.properties.pickId;
 const mesh=(name,g,col,mat=24)=>b.mesh('145-'+name,g,0,0,0,1,1,1,col,mat);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'145-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 function window(x,y,z,w,h,axis='x',fit=false){
  b.local(x,y,z,axis==='x'?0:Math.PI/2,()=>{
   b.box(0,0,-.115,w,h,.06,C.glass,5);
   for(const q of[-1,1]){b.box(q*w/2,0,.005,.065,h+.09,.18,C.frame,24);b.box(0,q*h/2,.005,w+.09,.065,.18,C.frame,24);}
   const n=w>4?Math.round(w/.70):2;for(let i=1;i<n;i++)b.box(-w/2+i*w/n,0,.012,.042,h,.14,C.frame,24);
   b.box(0,-h*.18,.019,w,.035,.14,C.frame,24);
  });
 }
 // Actual apertures cut through facade panels: no painted glass over a solid wall.
 function facade(name,a,q,top,count,continuous=false){const dx=q[0]-a[0],dz=q[1]-a[1],len=Math.hypot(dx,dz),theta=-Math.atan2(dz,dx),holes=[];
  for(let row=0;row<5;row++){const y=H.base+row*H.floor+.81;for(let i=0;i<count;i++){const pitch=len/count,w=continuous?pitch-.18:Math.min(2.35,pitch*.68);holes.push({x:pitch*(i+.5),lo:y,hi:y+1.68,w});}}
  b.local(a[0],0,a[1],theta,()=>group(name,()=>{
   const levels=[H.base,top,...holes.flatMap(h=>[h.lo,h.hi])].filter((v,i,s)=>s.indexOf(v)===i&&v<=top).sort((a,b)=>a-b);
   for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j],cuts=holes.filter(h=>h.lo<=lo+.001&&h.hi>=hi-.001).sort((a,b)=>a.x-b.x);let cursor=0;const wall=(l,r)=>{if(r-l>.001)b.box((l+r)/2,(lo+hi)/2,-.18,r-l,hi-lo,.36,C.red,24);};for(const h of cuts){wall(cursor,h.x-h.w/2);cursor=h.x+h.w/2;}wall(cursor,len);}
   b.box(len/2,H.base/2,-.18,len,H.base,.36,C.base,24);
   for(const h of holes)window(h.x,(h.lo+h.hi)/2,.06,h.w,h.hi-h.lo);
   for(let row=0;row<5;row++){const y=H.base+row*H.floor;b.box(len/2,y+.08,.035,len,.105,.13,C.white,24);}
   // Independent AC boxes and brackets follow the visible northern window band.
   if(continuous)for(let row=1;row<5;row++)for(let i=1;i<count;i+=3){const x=len*i/count,y=H.base+row*H.floor+.40;
    b.box(x,y,.50,.72,.52,.48,C.metal,24);for(let k=0;k<5;k++)b.box(x,y-.19+k*.095,.753,.57,.025,.025,C.base,24);b.box(x,y-.32,.45,.86,.065,.80,C.base,24);
   }
  }));
 }
 function surface(name,pts,col=C.roof){const g=new G.Geometry();const a=pts[0],b=pts[1],c=pts[2],ny=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]);if(ny<0)pts.reverse();g.quad(...pts);mesh(name,g,col,2);}
 function pitched(name,x0,x1,z0,z1,y0,y1){surface(name,[[x0,y0,z0],[x1,y0,z0],[x1,y1,z1],[x0,y1,z1]]);
  const tile=new G.Geometry(),dy=y1-y0,dz=z1-z0,ln=Math.hypot(dy,dz),q=(...p)=>{if(dz>0)p.reverse();tile.quad(...p);};
  for(let x=x0+.12;x<x1;x+=.24){const w=.032;q([x,y0+.023,z0],[Math.min(x+w,x1),y0+.023,z0],[Math.min(x+w,x1),y1+.023,z1],[x,y1+.023,z1]);}
  for(let t=.34;t<ln;t+=.34){const u=t/ln,v=Math.min(1,(t+.026)/ln);q([x0,y0+dy*u+.020,z0+dz*u],[x1,y0+dy*u+.020,z0+dz*u],[x1,y0+dy*v+.020,z0+dz*v],[x0,y0+dy*v+.020,z0+dz*v]);}
  tile.detailWidth=.026;mesh(name+'-tile-seams',tile,C.tile,2);
 }
 function attic(w){const {name,x0,x1,depth,setback,ridgeZ}=w,L=x1-x0;
  // Northern fifth-storey skirt and exposed terrace do not merge into the
  // higher roof; the six-storey white wall sits back from the original ring.
  pitched(name+'-north-low-skirt',x0-.17,x1+.17,-.25,1.85,H.terrace-.20,H.terrace+.55);
  surface(name+'-open-north-terrace',[[x0,H.terrace,1.85],[x0,H.terrace,setback],[x1,H.terrace,setback],[x1,H.terrace,1.85]],C.terrace);
  const upperHeight=H.atticEave-H.terrace;
  group(name+'-white-attic',()=>{
   b.box((x0+x1)/2,H.terrace+.28,setback+.13,L,.56,.26,C.white,24);b.box((x0+x1)/2,H.atticEave-.20,setback+.13,L,.40,.26,C.white,24);
   // Fitted aperture intervals are explicit; the evidence establishes white
   // pairs here but does not resolve every obscured western opening.
   const n=name==='west'?14:6;for(let i=0;i<n;i++){const pitch=L/n,x=x0+(i+.5)*pitch;window(x,H.terrace+1.51,setback-.035,1.55,1.50);b.box(x-pitch/2+(pitch-1.55)/4,H.terrace+1.51,setback+.13,(pitch-1.55)/2,1.82,.26,C.white,24);b.box(x+pitch/2-(pitch-1.55)/4,H.terrace+1.51,setback+.13,(pitch-1.55)/2,1.82,.26,C.white,24);}
   b.box((x0+x1)/2,(H.terrace+H.atticEave)/2,depth-.14,L,upperHeight,.28,C.white,24);for(let i=0;i<n;i++)b.local(x0+(i+.5)*L/n,H.terrace+1.51,depth+.02,Math.PI,()=>window(0,0,0,1.55,1.50));
  });
  pitched(name+'-upper-north-pitch',x0-.22,x1+.22,setback-.18,ridgeZ,H.atticEave,H.ridge);
  pitched(name+'-upper-south-pitch',x0-.22,x1+.22,ridgeZ,depth+.26,H.ridge,H.atticEave);
  const g=new G.Geometry();for(const x of[x0,x1]){const tri=(...v)=>g.tri(...(x===x0?v.reverse():v));tri([x,H.terrace,setback],[x,H.atticEave,setback],[x,H.terrace,depth]);tri([x,H.atticEave,setback],[x,H.atticEave,depth],[x,H.terrace,depth]);tri([x,H.atticEave,setback],[x,H.ridge,ridgeZ],[x,H.atticEave,depth]);}mesh(name+'-attic-end-walls-fitted',g,C.white);
  group(name+'-roof-edge',()=>{b.beam([x0-.22,H.ridge+.02,ridgeZ],[x1+.22,H.ridge+.02,ridgeZ],.13,C.tile,2);b.beam([x0-.22,H.atticEave,depth+.26],[x1+.22,H.atticEave,depth+.26],.11,C.base,24);});
  // Small rectangular roof vents are directly visible, spacing is fitted.
  group(name+'-roof-vents-fitted',()=>{const count=name==='west'?7:3;for(let i=0;i<count;i++){const x=x0+(i+.5)*L/count,z=setback+(ridgeZ-setback)*.62,y=H.atticEave+(H.ridge-H.atticEave)*.62;
   b.box(x,y+.18,z,1.05,.40,.50,C.metal,24);b.box(x,y+.21,z-.27,.79,.13,.035,C.dark,24);b.box(x,y+.41,z,1.18,.065,.63,C.metal,24);
  }});
 }
 function stair(x,depth,name){group(name,()=>{
  // Narrow white north stair strips and small red gables. Positions are
  // fitted to this building's aerial/satellite, not borrowed from no.61.
  b.box(x,H.terrace/2,-.28,2.00,H.terrace,.85,C.white,24);
  for(let row=0;row<5;row++)window(x,H.base+row*H.floor+1.65,-.72,.92,1.02);
  b.box(x,H.terrace+.70,.18,2.00,1.40,1.65,C.white,24);
  window(x,H.terrace+.78,-.72,1.02,.70);
  const g=new G.Geometry();g.tri([x-1.1,H.terrace+1.36,-.74],[x,H.terrace+2.20,-.74],[x+1.1,H.terrace+1.36,-.74]);mesh(name+'-white-gable',g,C.white);
  surface(name+'-gable-west-roof',[[x-1.22,H.terrace+1.32,-.89],[x,H.terrace+2.23,-.89],[x,H.terrace+2.23,1.96],[x-1.22,H.terrace+1.32,1.96]]);
  surface(name+'-gable-east-roof',[[x,H.terrace+2.23,-.89],[x+1.22,H.terrace+1.32,-.89],[x+1.22,H.terrace+1.32,1.96],[x,H.terrace+2.23,1.96]]);
 });}
 b.local(O[0],0,O[1],angle,()=>{
  const ring=f.geometry.coordinates[0].slice(0,-1).map(local);mesh('exact-original-stepped-base',G.polygon(ring,H.base),C.base);mesh('fifth-floor-ceiling',G.polygon(ring,H.terrace-.08),C.white);
  // Reverse original edges so the facade local +z is outward.
  facade('north-glazed-band-observed',ring[5],ring[0],H.terrace,24,true);
  for(const [i,n]of[[0,6],[1,16],[2,2],[3,8],[4,4]]){const a=ring[(i+1)%ring.length],q=ring[i];facade('other-face-'+i+'-fitted',a,q,H.terrace,n,false);}
  for(const w of wings)attic(w);
  stair(8.15,17.934,'west-end-stair-fitted');stair(40.1,17.934,'west-visible-north-stair');stair(60.05,13.307,'east-visible-north-stair');
  // The original north wall is continuous at the south step; a raised white
  // cross-wall separates the two unequal roof volumes.
  const divider=new G.Geometry(),profile=[[-.26,H.terrace+.10],[1.85,H.terrace+.75],[5.4,H.atticEave+.12],[9.4,H.ridge+.18],[12.45,H.ridge+.18],[13.45,H.ridge-.35]];for(let i=1;i<profile.length;i++){const a=profile[i-1],q=profile[i];for(const x of[48.69,48.93]){const v=[[x,H.terrace,a[0]],[x,a[1],a[0]],[x,q[1],q[0]],[x,H.terrace,q[0]]];divider.quad(...(x===48.69?v.reverse():v));}divider.quad([48.69,q[1],q[0]],[48.93,q[1],q[0]],[48.93,a[1],a[0]],[48.69,a[1],a[0]]);}mesh('roof-division-fitted',divider,C.white);
 });
 return {id:ID,strategy:'building145-v46',storeys:6,fullLowerStoreys:5,northTerrace:true,setbackAttic:true,originalSteppedFootprint:true,roofWings:2,allFacadesVerified:false,exactRoofVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Building145={id:ID,render,O,angle,H,wings,local};
})(YY);
