/* Jingchunyuan 75: two mapped courts, low rolled roofs and a through-gate axis. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/14320161';
const R=Math.atan2(5.452,38.389),CO=Math.cos(R),SI=Math.sin(R),O=[2.391,-429.459];
const C={brick:'#a4a7a0',roof:'#737b77',tile:'#89918a',wood:'#983f31',green:'#286a59',blue:'#376d86',gold:'#c7b26b',glass:'#586e6b',stone:'#b7b6a2'};
const H={wall:3.15,roof:4.95,gate:5.75},gate={u:19.4,v:60.65,width:2.7,orientation:'south-inferred',confidence:'spatial-inference-not-survey'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function block(name,box,base,top,color=C.brick){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('010-'+name,g,color,24,id);}
 block('north-main',[-1,-1,40,10.93],0,H.wall);
 block('west-body',[-1,10.93,8.69,51.87],0,H.wall);
 block('east-body',[29.51,10.93,40,51.87],0,H.wall);
 // Preserve both holes, and cut a real axis through BOTH southern and middle transverse blocks.
 for(const [name,v0,v1] of [['middle',20.52,36.48],['south',51.70,61]]){
  block(name+'-west',[-1,v0,18.05,v1],0,H.wall);block(name+'-east',[20.75,v0,40,v1],0,H.wall);block(name+'-passage-lintel',[18.05,v0,20.75,v1],2.85,H.wall,C.wood);
 }
 // Narrow gallery strips lie on mapped solid ground, with open passages underneath their roofs.
 for(const [u,v0,v1] of [[9.0,11.1,20.5],[29.1,11.1,20.5],[9.8,36.5,51.7],[29.2,36.5,51.7]]){
  frame(u,v0,0,()=>{for(let v=0;v<=v1-v0;v+=3.0)b.cyl(0,.05,v,.11,2.8,C.wood,10,1,6);b.box(0,2.86,(v1-v0)/2,.48,.2,v1-v0,C.green,6);});
 }
 // Smooth-top rolled profiles: zero slope at the crown, slight lifted tile edges, no pointed ridge.
 function rolled(name,box,axis,base=3.17,rise=1.6){const cross=axis==='u'?1:0,mid=(box[cross]+box[cross+2])/2,half=(box[cross+2]-box[cross])/2,mesh=new G.Geometry(),ends=new G.Geometry(),tiles=new G.Geometry();
  const height=p=>{const t=Math.min(1,Math.abs((p[cross]-mid)/half));return base+rise*(1-t*t)+.28*Math.pow(t,12);};
  for(let j=0;j<24;j++){const region=box.slice();region[cross]=box[cross]+j*(half*2)/24;region[cross+2]=box[cross]+(j+1)*(half*2)/24;for(const p of pieces(f,region)){for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],height(p),p[1])));for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];ends.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],height(c),c[1]),vertex(a[0],height(a),a[1]));}}}
  add('010-'+name+'-rolled-roof',mesh,C.roof,2,id);add('010-'+name+'-roof-end',ends,C.brick,24,id);
  // Thin raised tile ribs follow the same curved surface and are clipped to the original footprint.
  const along=1-cross;for(let s=box[along]+.2;s<box[along+2];s+=.34)for(let j=0;j<24;j++){const rr=box.slice();rr[along]=s-.026;rr[along+2]=s+.026;rr[cross]=box[cross]+j*half*2/24;rr[cross+2]=box[cross]+(j+1)*half*2/24;for(const p of pieces(f,rr))for(let i=1;i<p.length-1;i++)tiles.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],height(p)+.045,p[1])));}
  add('010-'+name+'-tile-ribs',tiles,C.tile,2,id);
 }
 rolled('north',[-.05,0,38.78,10.93],'u',3.17,1.75);
 rolled('middle-back',[-.05,20.52,38.82,28.4],'u');rolled('middle-front',[-.05,28.4,38.82,36.48],'u',3.17,1.45);
 rolled('south',[-.05,51.7,38.84,60.65],'u',3.17,1.42);
 rolled('north-west',[0,10.93,8.69,20.52],'v',3.0,1.3);rolled('north-east',[28.75,10.93,38.81,20.67],'v',3.0,1.4);
 rolled('south-west',[0,36.48,9.52,51.86],'v',3.0,1.4);rolled('south-east',[29.51,36.32,38.83,51.71],'v',3.0,1.4);
 function lattice(x,y,w,h,z=.15){b.box(x,y,z,w+.14,h+.14,.15,C.wood,6);b.box(x,y,z+.1,w,h,.04,C.glass,5);for(let i=0;i<=4;i++)b.box(x-w/2+w*i/4,y,z+.15,.04,h,.06,C.wood,6);for(let i=1;i<=4;i++)b.box(x,y-h/2+h*i/5,z+.15,w,.035,.06,C.wood,6);b.box(x,y-h/2-.14,z+.10,w+.17,.22,.13,C.wood,6);}
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1];b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(Math.hypot(dx,dz)));}
 const pg=F.polygons(f.geometry)[0];for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive===(ri===0))[a,c]=[c,a];const aa=local(a),cc=local(c),south=ri===0&&aa[1]>60&&cc[1]>60;boundary(a,c,len=>{const n=Math.max(1,Math.round(len/4.8));for(let k=0;k<n;k++){const x=(k+.5)*len/n,p=[aa[0]+(cc[0]-aa[0])*x/len,aa[1]+(cc[1]-aa[1])*x/len];if(south||(Math.abs(p[0]-19.4)<2.9&&ri>0))continue;lattice(x,1.7,Math.min(2.4,len/n-.8),1.5);}if(Math.abs(cc[0]-aa[0])>10&&(south||ri>0)){const gx=(19.4-aa[0])/(cc[0]-aa[0])*len;for(const [lo,hi] of [[0,gx-1.45],[gx+1.45,len]])if(hi>lo)b.box((lo+hi)/2,.40,.035,hi-lo,.10,.12,'#818a82',24);}else b.box(len/2,.40,.035,len,.10,.12,'#818a82',24);});}}
 // Main gate is placed at the south outer edge as an explicit spatial inference from the full axis.
 frame(gate.u,gate.v,0,()=>{
  for(const x of [-1.63,1.63]){b.box(x,1.68,.10,.40,3.36,.58,C.green,6);b.box(x,3.68,.16,.43,.74,.56,C.gold,9);}
  b.box(0,3.62,.1,4.05,.78,.65,C.blue,6);b.box(0,4.05,.04,5.15,.32,1.3,C.green,6);
  for(let i=0;i<5;i++){const x=-1.52+i*.76;b.box(x,3.63,.455,.64,.43,.075,i%2?C.green:'#25496c',6);for(const yy of [3.41,3.85])b.box(x,yy,.50,.68,.025,.035,C.gold,9);}
  for(const x of [-2.14,2.14])b.box(x,4.2,-.28,.28,.34,1.2,C.wood,6);
  // Open door leaves remain at the two jambs, not across the through passage.
  for(const side of [-1,1]){b.box(side*1.27,1.44,-.65,.13,2.78,1.3,C.wood,6);for(const yy of [.38,2.65])b.box(side*1.35,yy,-.65,.03,.025,1.12,C.gold,9);b.box(side*1.35,1.49,-1.2,.03,2.30,.025,C.gold,9);}
  b.box(0,.075,.1,2.75,.15,.60,C.wood,6);b.box(0,.045,2.1,3.5,.09,4.7,'#b8b9ac',10);
  for(const x of [-4.0,4.0])lattice(x,1.7,2.4,1.55,.12);
  b.box(2.42,2.15,.14,.90,.45,.1,C.gold,9);if(b.lettering)b.lettering('教育基金会',2.42,2.15,.205,.78,.22,0,'#665e3d');
  // Two small carved door stones stay next to the jambs.
  for(const x of [-1.23,1.23]){b.box(x,.14,.65,.38,.28,.43,C.stone,10);b.sphere(x,.42,.67,.20,.27,.19,C.stone,10,0,true);b.sphere(x,.64,.73,.16,.17,.14,C.stone,10,0,true);}
  // The two larger lions are separate objects, outside the entrance and beside its paving.
  for(const x of [-5.8,5.8]){
   b.box(x,.28,3.8,1.05,.56,1.15,C.stone,10);
   b.sphere(x,.96,3.70,.35,.54,.37,C.stone,10,0,true);
   for(const dx of [-.24,.24]){b.sphere(x+dx,.76,3.57,.21,.27,.28,C.stone,10,0,true);b.cyl(x+dx,.56,4.04,.11,.63,C.stone,10,1,10);b.sphere(x+dx,.62,4.18,.15,.09,.24,C.stone,10,0,true);}
   b.sphere(x,1.53,3.93,.33,.34,.30,C.stone,10,0,true);
   for(let j=0;j<13;j++){const a=j*Math.PI*2/13;b.sphere(x+Math.cos(a)*.34,1.59+Math.sin(a)*.31,4.09,.12,.12,.105,C.stone,10,0,true);}
   for(const dx of [-.22,.22]){b.sphere(x+dx,1.82,3.95,.11,.14,.10,C.stone,10,0,true);b.sphere(x+dx*.60,1.60,4.205,.065,.045,.035,'#797c6f',10,0,true);b.sphere(x+dx*.63,1.67,4.20,.11,.045,.06,C.stone,10,0,true);}
   b.sphere(x,1.43,4.255,.23,.115,.09,'#797c6f',10,0,true);
   for(const dx of [-.105,.105])b.sphere(x+dx,1.48,4.27,.13,.10,.12,C.stone,10,0,true);
   b.sphere(x,1.55,4.36,.08,.055,.05,'#858777',10,0,true);
   b.sphere(x,1.33,4.23,.20,.08,.11,C.stone,10,0,true);
  }
 });
 // Separate taller rolled gate roof; its small projection is not a replacement ground footprint.
 const roof=new G.Geometry(),ribs=new G.Geometry(),roofY=(x,z)=>4.35+1.15*(1-Math.pow(z/2.0,2))+.28*Math.pow(Math.abs(z/2),12)+.25*Math.pow(Math.abs(x/3.0),8);
 for(let i=0;i<24;i++)for(let j=0;j<12;j++){const x=-3+i*.25,xx=x+.25,z=-2+j/3,zz=z+1/3;roof.quad(vertex(gate.u+x,roofY(x,z),gate.v+z-.5),vertex(gate.u+x,roofY(x,zz),gate.v+zz-.5),vertex(gate.u+xx,roofY(xx,zz),gate.v+zz-.5),vertex(gate.u+xx,roofY(xx,z),gate.v+z-.5));}
 add('010-decorated-gate-rolled-roof',roof,C.roof,2,id);
 for(let x=-2.85;x<3;x+=.30)for(let j=0;j<24;j++){const z=-2+j/6,zz=z+1/6;ribs.quad(vertex(gate.u+x-.035,roofY(x,z)+.05,gate.v+z-.5),vertex(gate.u+x-.035,roofY(x,zz)+.05,gate.v+zz-.5),vertex(gate.u+x+.035,roofY(x,zz)+.05,gate.v+zz-.5),vertex(gate.u+x+.035,roofY(x,z)+.05,gate.v+z-.5));}add('010-gate-tile-ribs',ribs,C.tile,2,id);
 // A second aligned red framed passage is visible behind the courtyard in the dated photograph.
 frame(19.4,36.4,0,()=>{for(const x of [-1.48,1.48])b.box(x,1.45,.10,.28,2.9,.35,C.wood,6);b.box(0,2.72,.10,3.20,.30,.35,C.wood,6);});
 frame(19.4,10.94,0,()=>{b.box(0,1.28,.13,2.65,2.56,.15,C.wood,6);for(const x of [-.67,.67])lattice(x,1.67,1.15,1.38,.24);});
 // Photo-established front-court path and three short risers before the middle passage.
 // The platform is local to the axis; the rest of either court stays at its existing level.
 function ground(name,u0,u1,v0,v1,top,color){const g=new G.Geometry(),a=vertex(u0,top,v0),c=vertex(u1,top,v0),d=vertex(u1,top,v1),e=vertex(u0,top,v1);g.quad(a,e,d,c);for(const [p,q] of [[a,c],[c,d],[d,e],[e,a]])g.quad([p[0],0,p[2]],[q[0],0,q[2]],q,p);add('010-'+name,g,color,10,id);}
 ground('court-axis-path',17.7,21.1,39.55,51.7,.04,'#b8b9ac');
 ground('gate-passage-path',18.1,20.7,51.7,60.65,.04,'#b8b9ac');
 ground('court-grass-west',10.0,17.65,39.55,51.5,.018,'#819879');
 ground('court-grass-east',21.15,29.0,39.55,51.5,.018,'#819879');
 for(let i=0;i<3;i++)ground('inner-stair-'+(i+1),17.15,21.65,39.1-i*.45,39.55-i*.45,.18+i*.14,'#a8ada4');
 ground('inner-platform',17.15,21.65,36.48,38.2,.46,'#a8ada4');
 // Continue through the existing aperture. Its short internal slope returns to the rear floor
 // without inventing a second exterior staircase that the photographs do not establish.
 ground('passage-landing',18.1,20.7,35.7,36.48,.46,'#a8ada4');
 {const g=new G.Geometry();g.quad(vertex(18.1,.04,32.7),vertex(18.1,.46,35.7),vertex(20.7,.46,35.7),vertex(20.7,.04,32.7));add('010-passage-level-transition',g,'#a8ada4',10,id);}
 ground('middle-passage-floor',18.1,20.7,20.52,32.7,.04,'#b8b9ac');
 // Two conservative cypress silhouettes in the front court; exact trunks remain photo-fitted.
 const originalAdd=b.e.add;b.e.add=function(key,...args){return originalAdd.call(this,'010-vegetation-cypress-'+key,...args);};
 try{for(const [u,v,h] of [[13.0,43.1,8.8],[25.5,41.2,9.3]])frame(u,v,0,()=>{b.cyl(0,0,0,.26,h*.74,'#685d4a',10,.62,6);b.sphere(0,h*.66,0,1.8,h*.35,1.55,'#496b4c',33);b.sphere(.5,h*.85,.1,1.3,h*.18,1.1,'#54784f',33);});}finally{b.e.add=originalAdd;}
 return {strategy:'building010-v46',floors:1,sourceOutline:true,twoCourts:true,throughGate:true,gatePlacementInferred:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building010={id:ID,render,world,local,pieces,heights:H,gate,excludeGeneratedTree(point){const [u,v]=local(point);return u>8.69&&u<29.51&&v>36.48&&v<51.70;}};
})(YY);
