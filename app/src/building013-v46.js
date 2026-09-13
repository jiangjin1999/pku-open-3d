/* Leo KoGuan School of Government: photo-led eastern recesses, no invented court. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/163926083';
const O=[404.592,-342.086],R=Math.atan2(8.045,129.533),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#8e9080',joint:'#a4a593',frame:'#c4cdca',glass:'#526e67',louvre:'#929e94',roof:'#969990',plant:'#d1d6ca'};
const H={ground:4.2,wall:21.6,roof:21.8,plant:25},bays=[{name:'north',v0:24,v1:47},{name:'south',v0:116,v1:128}],length=129.7826;
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'013-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function block(name,box,base,top,color=C.wall){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('013-'+name,g,color,24,id);}
 // The unmodified mapped ring is clipped, never replaced by an enclosing rectangle.
 block('ground-core',[-100,-10,-3.6,35.5],0,H.ground);
 block('ground-core-after-entry',[-100,40.5,-3.6,150],0,H.ground);
 block('entry-back',[-100,35.5,-6.4,40.5],0,H.ground);
 block('entry-head',[-6.4,35.5,-3.6,40.5],3.5,H.ground);
 block('upper-core',[-100,-10,-3.6,150],H.ground,H.wall);
 for(const [a,c] of [[-10,24],[47,116],[128,150]]){
  block('upper-solid-'+a,[-3.6,a,1,c],H.ground,H.wall);
  block('ground-back-'+a,[-3.6,a,-2.3,c],0,H.ground);
 }
 block('thin-flat-roof',[-100,-10,1,150],H.wall,H.roof,C.roof);
 b.local(O[0],0,O[1],R,()=>{
  // Four upper rows plus a genuinely recessed ground floor form five levels.
  for(const [a,c] of [[.5,24],[47,116],[128,length-.2]]){
   const n=Math.max(1,Math.round((c-a)/4.5)),step=(c-a)/n;
   for(let i=0;i<n;i++){const v=a+(i+.5)*step,w=step-.72;
    if(![[19.5,24],[47,51.5],[110,116]].some(([lo,hi])=>v+w/2+.08>lo&&v-w/2-.08<hi))group('east-windows',()=>{for(const y of [6.4,10.7,15,19.3]){
     b.box(.025,y,v,.075,3.05,w,C.glass,5);
     for(const vv of [v-w/2,v,v+w/2])b.box(.10,y,vv,.14,3.18,.09,C.frame,6);
     for(const yy of [y-1.54,y+1.54])b.box(.10,yy,v,.14,.09,w+.12,C.frame,6);
     b.box(.11,y-.42,v,.15,.065,w,C.frame,6);
     // A small opaque panel distinguishes repeated sash from a curtain wall.
     b.box(.12,y+.78,v+w*.30,.12,1.4,w*.17,C.joint,24);
    }});
    group('ground-open-bays',()=>{b.box(-2.25,1.85,v,.08,3.45,w,C.glass,5);for(const vv of [v-w/2,v+w/2])b.box(-2.17,1.85,vv,.12,3.55,.10,C.frame,6);b.box(-.62,2.1,a+i*step,1.24,4.2,.65,C.wall,24);for(const yy of [.7,1.13])b.box(-.07,yy,v,.07,.055,w-.15,C.frame,6);for(let t=-w/2+.2;t<w/2;t+=.7)b.box(-.07,.89,v+t,.055,.45,.045,C.frame,6);});
   }
   group('east-stone-joints',()=>{for(let y=.5;y<21.5;y+=.65){if(y<4.2)continue;b.box(.035,y,(a+c)/2,.04,.024,c-a,C.joint,24);}});
  }
  for(const q of bays){const mid=(q.v0+q.v1)/2,w=q.v1-q.v0;
   group(q.name+'-recess-glass',()=>{if(q.name==='north'){
    b.box(-3.53,12.55,mid,.07,17.9,w-.12,C.glass,5);
    for(const [a,c]of [[q.v0,35.5],[40.5,q.v1]])b.box(-3.53,1.8,(a+c)/2,.07,3.6,c-a-.12,C.glass,5);
   }else b.box(-3.53,10.8,mid,.07,21.4,w-.12,C.glass,5);
   for(let v=q.v0+.15;v<q.v1;v+=2.35){const door=q.name==='north'&&v>35.5&&v<40.5;b.box(-3.43,door?12.55:10.8,v,.11,door?17.9:21.45,.07,C.frame,6);}for(let y=4.2;y<21.6;y+=4.3)b.box(-3.40,y,mid,.13,.16,w-.16,C.frame,6);});
   group(q.name+'-open-louvres',()=>{for(let y=.65;y<21.3;y+=.39){if(q.name==='north'&&y<3.6){for(const [a,c]of [[q.v0,35.5],[40.5,q.v1]])b.box(-.87,y,(a+c)/2,.52,.075,c-a-.10,C.louvre,6);}else b.box(-.87,y,mid,.52,.075,w-.10,C.louvre,6);}
   for(let v=q.v0+.3;v<q.v1;v+=3.1){const door=q.name==='north'&&v>35.5&&v<40.5;b.box(-1.02,door?12.45:10.9,v,.17,door?17.9:21.3,.07,C.frame,6);}});
  }
  // A recessed vestibule and two open glass leaves preserve a real central approach.
  group('north-entry',()=>{
   for(const v of [35.55,40.45])b.box(-4.9,1.75,v,2.9,3.5,.10,C.wall,24);
   for(const v of [36.5,39.5])b.box(-4.45,1.55,v,.12,3.1,.09,C.frame,6);
   b.box(-4.45,3.1,38,.12,.10,3.1,C.frame,6);
   for(const [v,ang,sign]of [[36.5,-Math.PI/4,1],[39.5,Math.PI/4,-1]])b.local(-4.45,0,v,ang,()=>{
    b.box(0,1.52,sign*.55,.07,2.95,1.1,C.glass,5);
    for(const z of [0,sign*1.1])b.box(0,1.52,z,.11,3.02,.07,C.frame,6);
    for(const y of [.05,3.0])b.box(0,y,sign*.55,.11,.07,1.1,C.frame,6);
   });
  });
  // The two pale pillars START ON the canopy, then terminate in short round necks.
  group('north-canopy',()=>{b.box(-.55,4.09,35.5,6.1,.42,23.7,C.plant,24);for(const v of [25,34.2,46])b.box(.65,1.94,v,1.22,3.88,.85,C.wall,24);});
  group('north-high-pillars',()=>{for(const v of [29.2,41.8]){b.box(.20,12.57,v,1.18,16.54,1.25,C.plant,24);b.cyl(.20,20.84,v,.32,.66,C.plant,16,1,24);}});
  group('south-small-canopy',()=>{b.box(-.25,4.1,122,4.9,.30,11.3,C.plant,24);for(const v of [117.2,126.8])b.box(.4,2,v,.45,4,.45,C.wall,24);});
  // A narrow, northern rooftop equipment enclosure, not a full extra floor.
  group('north-roof-screen',()=>{b.box(-8.4,23.15,34,4.2,2.7,32,'#87a49b',5);for(const u of [-10.52,-6.28]){for(let v=18;v<=50;v+=2.1)b.box(u,23.15,v,.075,2.7,.085,C.frame,6);for(const y of [21.84,24.5])b.box(u,y,34,.10,.10,32.2,C.frame,6);}b.box(-8.4,24.55,34,4.35,.10,32.2,C.plant,24);});
  group('north-roof-plant',()=>{for(const v of [14,54]){b.box(-9.1,23.35,v,6.4,3.10,5.8,C.plant,24);b.box(-9.1,24.96,v,6.6,.08,6,C.roof,24);}for(const v of [18,48]){b.box(-12.3,22.6,v,1.8,1.6,2.8,'#aebbb2',24);b.cyl(-12.3,23.4,v,.42,.8,C.frame,12,1,24);}for(const v of [23,30,37,44]){b.box(-14.7,22.35,v,1.7,1.1,2.1,C.plant,24);b.cyl(-14.7,22.9,v,.40,.5,C.frame,12,1,24);}});
  group('south-roof-sparse',()=>{for(const [u,v] of [[-5.8,76],[-4.9,96]]){b.box(u,22.05,v,1,.5,1.2,C.plant,24);b.cyl(u,22.3,v,.18,.40,C.frame,10,1,24);}});
  group('east-eave',()=>{b.box(.13,21.72,length/2,.6,.20,length+.25,C.frame,24);b.box(-.3,22.0,length/2,.18,.30,length,C.roof,24);});
  // Building name is adjacent to the southern louvre, on the stone pier.
  if(b.lettering)group('name',()=>{b.local(.15,0,112.7,Math.PI/2,()=>{b.lettering('廖凯原楼',0,19.6,0,4.9,.75,0,'#d1d6cd');b.lettering('Leo KoGuan Building',0,18.75,0,4.8,.33,0,'#c9d1c9');});});
 });
 // Other original edges retain their own direction, including the irregular western return.
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[0])<.02&&Math.abs(cc[0])<.02)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.5)continue;
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>{group('other-facades',()=>{const n=Math.max(1,Math.round(len/4.4)),step=len/n;for(let k=0;k<n;k++){const x=(k+.5)*step,w=Math.max(.4,step-.75);for(const y of [1.95,6.4,10.7,15,19.3]){b.box(x,y,.025,w,3.05,.08,C.glass,5);for(const xx of [x-w/2,x,x+w/2])b.box(xx,y,.11,.075,3.17,.13,C.frame,6);for(const yy of [y-1.54,y+1.54])b.box(x,yy,.11,w+.12,.08,.13,C.frame,6);}}for(let y=4.4;y<21.5;y+=.65)b.box(len/2,y,.025,len,.024,.035,C.joint,24);b.box(len/2,21.72,.12,len+.15,.20,.45,C.frame,24);b.box(len/2,22,.01,len,.30,.18,C.roof,24);});});
 }
 return{strategy:'building013-v46',floors:5,sourceOutline:true,noInventedCourt:true,recesses:2,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building013={id:ID,render,world,local,pieces,heights:H,bays};
})(YY);
