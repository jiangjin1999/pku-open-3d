/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* Weiming Lake: original, independently selectable exterior models.
 * Documented dimensions are in the inventory. Other dimensions are estimates.
 * No reconstructed tunnel, pagoda interior, active fountain or lost balustrade.
 */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M,TAU=Math.PI*2;
const C={stone:'#b0afa4',edge:'#c2c1b6',concrete:'#a49e8d',shadow:'#797c70',tile:'#646b68',red:'#7b4432',wood:'#72503b',green:'#486b59',bell:'#4d594e',dark:'#263f3b'};
// Smooth tubes are assembled into a single mesh for small repeated relief details.
function tube(g,pts,r,n=9){let rings=[],normals=[];for(let i=0;i<pts.length;i++){let d=M.norm(M.sub(pts[Math.min(pts.length-1,i+1)],pts[Math.max(0,i-1)])),s=M.norm(M.cross(d,Math.abs(d[1])>.95?[1,0,0]:[0,1,0])),v=M.cross(d,s);let nn=Array.from({length:n},(_,j)=>M.add(M.mul(s,Math.cos(j*TAU/n)),M.mul(v,Math.sin(j*TAU/n))));normals.push(nn);rings.push(nn.map(q=>M.add(pts[i],M.mul(q,r))));}for(let i=1;i<rings.length;i++)for(let j=0;j<n;j++){let k=(j+1)%n;g.tri(rings[i-1][j],rings[i-1][k],rings[i][k],undefined,[normals[i-1][j],normals[i-1][k],normals[i][k]]);g.tri(rings[i-1][j],rings[i][k],rings[i][j],undefined,[normals[i-1][j],normals[i][k],normals[i][j]]);}return g;}
function annular(n,profile,corner=0){const g=new G.Geometry();for(let k=0;k<profile.length-1;k++)for(let i=0;i<n;i++)for(let j=0;j<8;j++){const at=(ring,u)=>{let a=i*TAU/n,b=(i+1)*TAU/n,[r,y]=profile[ring],v=1-u;return[(Math.cos(a)*v+Math.cos(b)*u)*r,y+corner*Math.pow(Math.abs(u*2-1),8)*(1-ring/(profile.length-1)),(Math.sin(a)*v+Math.sin(b)*u)*r]};let u=j/8,v=(j+1)/8;g.quad(at(k,v),at(k,u),at(k+1,u),at(k+1,v));}return g;}
function radialPoint(a,r,y){return[Math.cos(a)*r,y,Math.sin(a)*r];}
P.lakeOctagonRoof=function(key,n,r,y,h,part=2){
 const prof=[[r,.09],[r*.98,0],[r*.93,.055],[r*.79,h*.16],[r*.60,h*.43],[r*.34,h*.76],[r*.065,h]],q=this.geo(key,()=>annular(n,prof,.19));this.mesh(key,q,0,y,0,1,1,1,C.tile,25,part);
 const ts=key+'-tile-ribs',geom=this.geo(ts,()=>{let g=new G.Geometry();for(let i=0;i<n;i++){const a=i*TAU/n,b=(i+1)*TAU/n,count=Math.max(8,Math.round(r*.765/.32));for(let j=0;j<=count;j++){let u=j/count,pts=[];for(let k=1;k<prof.length;k++){let R=prof[k][0],yy=prof[k][1]+.035+.19*Math.pow(Math.abs(u*2-1),8)*(1-k/(prof.length-1));pts.push([(Math.cos(a)*(1-u)+Math.cos(b)*u)*R,yy,(Math.sin(a)*(1-u)+Math.sin(b)*u)*R]);}tube(g,pts,.046,6);}}return g;});this.mesh(ts,geom,0,y,0,1,1,1,'#747a73',25,part+.015);
 this.cyl(0,y+h-.07,0,.20,.37,'#777b6f',12,.75,25,part+.08);this.sphere(0,y+h+.37,0,.22,.22,.22,'#9a9684',10,part+.09,true);
};
P.lakePagoda=function(p){
 this.noPlant(0,0,21,21);this.solid(0,0,10.9,10.9);
 // Base and shaft: stone under reinforced-concrete imitation timber, not brick.
 for(let i=0;i<4;i++)this.cyl(0,i*.27,0,6.20-i*.24,.28,i%2?C.edge:C.stone,8,1,10,.09+i*.025);
 this.cyl(0,1.12,0,5.23,.40,C.concrete,8,1,24,.24);this.cyl(0,1.50,0,4.52,6.37,C.concrete,8,.985,24,.43);
 for(let i=0;i<8;i++){let a=(i+.5)*TAU/8,r=4.52*Math.cos(Math.PI/8)+.023;this.local(Math.cos(a)*r,0,Math.sin(a)*r,Math.PI/2-a,()=>{
 // Shallow inset panel and framed arch door/niche; no fabricated walkable interior.
 this.box(0,4.52,.055,2.41,4.92,.075,'#999787',24,.49);
 for(const s of[-1,1]){this.box(s*1.29,4.52,.135,.16,5.18,.17,'#bdb6a2',24,.56);this.box(0,4.52+s*2.58,.135,2.75,.15,.17,'#bcb39e',24,.56);}
 if(i%2===0){this.box(0,3.51,.172,1.48,3.22,.06,'#454d44',20,.64);this.box(0,3.51,.218,.052,3.2,.07,'#817964',20,.66);this.box(0,5.18,.135,1.72,.19,.15,C.edge,24,.57);}else{this.box(0,4.72,.145,1.85,2.66,.04,'#aaa390',24,.62);}
 this.box(0,1.66,.18,3.20,.28,.31,C.stone,10,.58);
 });}
 const levels=[8.10,10.32,12.48,14.57,16.61,18.61,20.57,22.49,24.37,26.21,28.01,29.77,31.49];
 for(let k=0;k<13;k++){
  const y=levels[k],r=6.02-.09*k-.0023*k*k,shaft=4.49-.09*k,dy=k<12?levels[k+1]-y:1.2,part=.85+k*.09;
  this.cyl(0,y-.77,0,shaft+.13,.26,'#b4ab96',8,1,24,part);
  if(k<12)this.cyl(0,y+.31,0,shaft-.07,dy-.03,C.concrete,8,.983,24,part+.045);
  const key='v10-eave-shell-'+k,roofH=k===12?3.16:.86,prof=k===12?[[r,.14],[r*.98,0],[r*.90,.13],[r*.72,.52],[r*.50,1.28],[r*.25,2.24],[.20,3.16]]:[[r,.16],[r*.985,.01],[r*.965,-.07],[r*.905,.01],[r*.825,.34],[r*.735,.73],[r*.69,.86]];
  this.mesh(key,this.geo(key,()=>annular(8,prof,.19)),0,y,0,1,1,1,'#838477',25,part+.23);
  // Continuous fascia, cover tiles and compact cantilevering brackets.
  const tk='v10-tower-cover-'+k,tg=this.geo(tk,()=>{let g=new G.Geometry();for(let i=0;i<8;i++){let a=i*TAU/8,b=(i+1)*TAU/8,n=Math.max(8,Math.floor(r*.765/.32));for(let j=0;j<=n;j++){let u=j/n,pts=[];for(let t=3;t<prof.length;t++){let [R,H]=prof[t];pts.push([(Math.cos(a)*(1-u)+Math.cos(b)*u)*R,H+.03+.19*Math.pow(Math.abs(2*u-1),8)*(1-t/(prof.length-1)),(Math.sin(a)*(1-u)+Math.sin(b)*u)*R]);}tube(g,pts,.041,6);}}return g;});this.mesh(tk,tg,0,y,0,1,1,1,'#b0aa95',25,part+.25);
  for(let i=0;i<8;i++){const a=(i+.5)*TAU/8,ap=shaft*Math.cos(Math.PI/8);this.local(Math.cos(a)*ap,0,Math.sin(a)*ap,Math.PI/2-a,()=>{
    if(k<12){let ww=k<3?.69:.52;this.box(0,y+1.08,.086,ww,.65,.06,'#3b4943',20,part+.16);for(let s of[-1,1])this.box(s*(ww/2+.053),y+1.08,.13,.065,.75,.16,'#b4ac98',24,part+.18);this.box(0,y+.68,.13,ww+.20,.13,.23,C.stone,10,part+.18);}
    for(let j=-1;j<=1;j++)this.local(j*(shaft*.23),y-.83,0,0,()=>{this.box(0,.12,.14,.34,.26,.52,'#b3aa95',24,part+.11);this.box(0,.32,.30,.72,.14,.43,'#999582',24,part+.13);this.box(0,.49,.48,.99,.14,.68,'#b2a993',24,part+.15);for(let s of[-1,1])this.box(s*.38,.55,.47,.15,.20,.57,'#979480',24,part+.17);this.box(0,.66,.69,.25,.12,1.09,'#b9b09b',24,part+.19);});
  });}
 }
 this.cyl(0,34.60,0,.38,.40,'#a7a18c',12,.84,24,2.30);this.sphere(0,35.06,0,.47,.40,.47,'#999480',10,2.33,true);this.cyl(0,35.29,0,.27,1.28,'#a29b87',12,.30,24,2.37);this.sphere(0,36.63,0,.20,.20,.20,'#a9a18b',10,2.4,true);this.cyl(0,36.76,0,.06,.24,'#6c7265',10,.05,9,2.42);
 // Restraint: no painted blue windows, no fabricated interior stair tour.
};
P.lakeLuce=function(p){this.noPlant(0,0,21,21);this.local(0,0,0,Math.PI/8,()=>{
 for(let i=0;i<4;i++)this.cyl(0,i*.28,0,8.20-.22*i,.28,i%2?C.edge:C.stone,8,1,10,.07+i*.03);
 this.cyl(0,1.12,0,7.68,.24,'#bebbad',8,1,10,.21);this.cyl(0,1.37,0,5.47,3.88,'#ddd7c6',8,1,24,.55);this.solid(0,0,10.7,10.7);
 for(let i=0;i<8;i++){let a=i*TAU/8,pt=radialPoint(a,7.10,1.38);this.cyl(pt[0],1.33,pt[2],.40,.23,C.stone,16,1,10,.4);this.cyl(pt[0],1.56,pt[2],.20,4.0,C.red,18,.92,20,.9);
 let mid=(i+.5)*TAU/8,face=5.47*Math.cos(Math.PI/8),bw=2*5.47*Math.sin(Math.PI/8);this.local(Math.cos(mid)*face,0,Math.sin(mid)*face,Math.PI/2-mid,()=>{
 if(i===1)this.heritageDoor(0,1.4,.055,2.38,3.32,0,C.red);else this.v9Lattice(0,3.36,.045,bw-.25,2.85,0,true);
 this.box(0,1.76,.08,bw-.05,.65,.13,'#988979',18,.65);this.v9PaintedBeam(0,5.21,(7.1-5.47)*Math.cos(Math.PI/8),5.2,.65);
 });
 this.local(pt[0],5.12,pt[2],Math.PI/2-a,()=>this.v9Bracket(0,0,0,.64));}
 this.lakeOctagonRoof('v10-luce-roof',8,9.01,5.73,3.34,2.1);
 });};
P.lakeStoneBoat=function(p,w=26,d=6.6){
 this.noPlant(0,0,w+4,d+8);
 const plan=[[-.5,-.30],[-.47,-.48],[-.36,-.5],[.37,-.5],[.47,-.43],[.5,-.20],[.5,.20],[.47,.43],[.37,.5],[-.36,.5],[-.47,.48],[-.5,.30]].map(q=>[q[0]*w,q[1]*d]);
 const hull=this.geo('v10-stone-hull',()=>{let g=new G.Geometry();const cy=x=>1.02+.49*Math.pow(Math.max(0,(Math.abs(x)/(w/2)-.68)/.32),1.3);for(let i=0;i<plan.length;i++){let a=plan[i],b=plan[(i+1)%plan.length];g.quad([b[0],.26,b[1]],[a[0],.26,a[1]],[a[0],cy(a[0]),a[1]],[b[0],cy(b[0]),b[1]]);}let top=G.polygon(plan,.99);g.v.push(...top.v);return g;});this.mesh('v10-stone-hull',hull,0,0,0,1,1,1,'#aeb2aa',10,.15);
 // Individual slightly varied flagstones laid on the exposed deck.
 for(let x=-10.6;x<10.7;x+=1.34)for(let z=-2.32;z<2.4;z+=1.14)this.box(x,p.dock24?1.005:1.02,z,1.315,.10,1.112,(Math.round(x*10+z*10)%3)?'#b8baaf':'#a9afa4',10,.24);
 const curbKey='v10-stone-boat-curb'+(p.dock24?'-side-opening-v24':'');
 const curb=this.geo(curbKey,()=>{let g=new G.Geometry();for(const s of[-1,1]){let pts=[];const flush=()=>{if(pts.length>1)tube(g,pts,.13,12);pts=[]};for(let j=0;j<=120;j++){let x=-w/2+j*w/120,u=Math.abs(x)/(w/2),z=s*(d/2-.18)*(u>.88?1-(u-.88)*3.7:1),h=1.33+.64*Math.pow(Math.max(0,(u-.62)/.38),1.4);
 if(p.dock24&&s===p.dock24.side&&Math.abs(x)<p.dock24.gapHalf){flush();continue;}
 const q=[x,h,z];if(pts.length){const a=pts.at(-1);g.quad([a[0],1.0,a[2]],[x,1.0,z],q,a);}pts.push(q);}flush();}return g;});this.mesh(curbKey,curb,0,0,0,1,1,1,C.edge,10,1.0);
 // Low transverse end coping; upper pavilions and tall railings are not present.
 for(let s of[-1,1]){let x=s*w*.491;this.beam([x,1.88,-d*.31],[x,1.88,d*.31],.14,C.edge,10,1.05);}
 for(let x=-11.8;x<12;x+=1.43)for(let s of[-1,1]){this.box(x,.57,s*(d/2+.012),.017,.48,.014,'#858f87',10,.18);this.box(x,.83,s*(d/2+.013),1.41,.018,.014,'#929b92',10,.19);}
 // Outline for maps only; exposed deck is an observation surface, not a solid room.
 let points=plan.map(q=>{let a=this.world([q[0],0,q[1]]);return[a[0],a[2]]});this.mapBuildings.push({id:this.id,polygon:points,x:this.origin[0],z:this.origin[2],w,d,r:this.rotation,walkable:true});
};
P.lakeFlatBridge=function(p,w=4.4,d=7.15){this.noPlant(0,0,w+2,d+1.4);
 for(let i=0;i<5;i++){let z=-d/2+(i+.5)*d/5;this.box(0,.70,z,w,.29,d/5-.027,i%2?'#b7b9ae':'#a8afa4',10,.2);for(let s of[-1,1])this.box(s*(w/2-.19),.843,z,.35,.065,d/5-.03,C.edge,10,.42);}
 // Low bearing stones, not an invented surviving arched bridge or balustrade.
 for(const z of[-d*.40,0,d*.40]){this.box(0,.36,z,w-.38,.43,.40,'#929d92',10,.1);this.box(0,.55,z,w-.17,.14,.57,'#a3aa9e',10,.15);}
};
P.lakeBellPavilion=function(p){this.noPlant(0,0,15.5,15.5);
 for(let i=0;i<3;i++)this.cyl(0,i*.19,0,4.58-i*.22,.19,C.stone,6,1,10,.07+i*.04);
 this.cyl(0,.57,0,4.01,.16,C.edge,6,1,10,.2);
 for(let i=0;i<6;i++){let a=i*TAU/6,q=radialPoint(a,3.39,0);this.cyl(q[0],.74,q[2],.37,.19,C.edge,16,1,10,.42);this.cyl(q[0],.90,q[2],.20,4.22,'#8a5c3b',18,.94,20,.95);let mid=(i+.5)*TAU/6;this.local(Math.cos(mid)*2.94,0,Math.sin(mid)*2.94,Math.PI/2-mid,()=>{this.v9PaintedBeam(0,5.11,0,3.65,.78);for(const s of[-1,1]){this.box(s*1.20,4.40,.06,.045,.60,.07,C.green,20,1.2);this.box(0,4.4+s*.25,.06,3.4,.047,.07,C.red,20,1.2);}this.box(0,4.4,.065,3.4,.035,.06,C.green,20,1.25);});this.local(q[0],4.80,q[2],Math.PI/2-a,()=>this.v9Bracket(0,0,0,.82));}
 this.box(0,5.27,0,.24,.35,5.95,'#55543f',20,1.28);
 // Hollow bell: outer wall, rolled lip and inner wall are one continuous shell.
 const bell=this.geo('v10-hollow-bell',()=>{let g=new G.Geometry(),profile=[[1.01,0],[1.055,.10],[.995,.24],[.91,.44],[.855,.75],[.835,1.65],[.78,2.02],[.66,2.18],[.28,2.29],[.20,2.17],[.59,2.09],[.70,1.94],[.76,1.56],[.78,.75],[.84,.43],[.93,.23],[.95,.12],[.935,.055]];const at=(k,j)=>{let a=j*TAU/96,[r,y]=profile[k],wave=.105*(1-Math.cos(a*8));return[r*Math.cos(a),y+(k<3||k>15?wave:0),r*Math.sin(a)]};for(let k=0;k<profile.length;k++)for(let j=0;j<96;j++)g.quad(at(k,j+1),at(k,j),at((k+1)%profile.length,j),at((k+1)%profile.length,j+1));return g;});this.mesh('v10-hollow-bell',bell,0,2.06,0,1,1,1,C.bell,22,1.0);
 const relief=this.geo('v10-bell-relief',()=>{let g=new G.Geometry();for(const y of[.38,.65,1.53,1.73,1.89]){let r=y>1.65?.81:.863;let pts=[];for(let j=0;j<=128;j++)pts.push(radialPoint(j*TAU/128,r,y));tube(g,pts,.012,5);}for(let i=0;i<12;i++){let a=i*TAU/12;for(const s of[-1,1]){let pts=[];for(let j=0;j<20;j++){let t=j/19;pts.push(radialPoint(a+s*(.035+.09*Math.sin(t*8)),.844, .78+t*.68));}tube(g,pts,.010,5);}}return g;});this.mesh('v10-bell-relief',relief,0,2.06,0,1,1,1,'#76816a',22,1.04);
 // Stylised interlocked suspension ears, not asserted complete dragon carving.
 for(let s of[-1,1]){let pts=[];for(let j=0;j<=24;j++){let a=j*Math.PI/24;pts.push([s*(.15+.25*Math.sin(a)),4.33+.56*Math.sin(a/2),.11*Math.cos(a)]);}let key='v10-bell-ear-'+s;this.mesh(key,this.geo(key,()=>tube(new G.Geometry(),pts,.068,10)),0,0,0,1,1,1,'#5d6854',22,1.14);}
 this.beam([0,4.8,0],[0,5.30,0],.077,'#464b3c',9,1.16);
 this.lakeOctagonRoof('v10-bell-hex-roof',6,5.12,5.82,1.72,2.05);
};
P.lakeStoneFish=function(p){this.noPlant(0,0,4,4);const tawny='#aea180',carve='#a49b7e';
 // Stone sculpture surface, not a collection of visible spherical primitives.
 const rock=this.geo('v10-fish-shore-rock',()=>G.sphere(22,12,.23));this.mesh('v10-fish-shore-rock',rock,0,.11,0,1.02,.18,.62,'#919a8c',22,.05);this.mesh('v10-fish-shore-rock',rock,.73,.09,.37,.39,.20,.27,'#7e8b80',22,.06);
 const sections=[[-.60,.30,.30,.23],[-.42,.29,.41,.21],[-.18,.27,.45,.18],[.05,.27,.39,.16],[.26,.30,.28,.15],[.44,.37,.19,.16],[.59,.46,.14,.16]];
 function bodyAt(x,a){let i=0;while(i<sections.length-2&&x>sections[i+1][0])i++;let l=sections[i],u=sections[i+1],t=M.clamp((x-l[0])/(u[0]-l[0]),0,1),cy=l[1]*(1-t)+u[1]*t,rz=l[2]*(1-t)+u[2]*t,ry=l[3]*(1-t)+u[3]*t;return[x,cy+Math.cos(a)*ry,Math.sin(a)*rz];}
 const body=this.geo('v10-fish-sculpted-body',()=>{let g=new G.Geometry(),N=64,K=56;for(let i=0;i<N;i++)for(let j=0;j<K;j++){let a=j*TAU/K,b=(j+1)*TAU/K,x=-.60+i*1.19/N,y=-.60+(i+1)*1.19/N;g.quad(bodyAt(x,a),bodyAt(y,a),bodyAt(y,b),bodyAt(x,b));}return g;});this.mesh('v10-fish-sculpted-body',body,0,0,0,1,1,1,tawny,22,.5);
 // Flared raised head blends into the body; open mouth has a recessed inner wall.
 const head=this.geo('v10-fish-open-mouth',()=>{let g=new G.Geometry(),profile=[[.29,.20,-.52],[.32,.33,-.56],[.27,.49,-.62],[.222,.63,-.675],[.228,.70,-.682],[.203,.739,-.678],[.166,.718,-.676],[.151,.615,-.66],[.13,.50,-.635]];const at=(i,j)=>{let [r,y,cx]=profile[i],a=j*TAU/72;return[cx+r*Math.cos(a)*.68,y,r*Math.sin(a)]};for(let i=0;i<profile.length-1;i++)for(let j=0;j<72;j++)g.quad(at(i,j+1),at(i,j),at(i+1,j),at(i+1,j+1));return g;});this.mesh('v10-fish-open-mouth',head,0,0,0,1,1,1,tawny,22,.66);
 for(const side of[-1,1]){this.sphere(-.648,.565,side*.215,.034,.037,.014,carve,22,.72,true);const key='v10-fish-gill-'+side,gill=this.geo(key,()=>{let g=new G.Geometry();for(let k=0;k<4;k++){let pts=[];for(let j=0;j<=20;j++){let t=j/20;pts.push([-.48+.055*k+.035*Math.sin(t*Math.PI),.20+t*.32,side*(.31-.07*t)+side*.01*Math.sin(t*Math.PI)]);}tube(g,pts,.0045,8);}return g;});this.mesh(key,gill,0,0,0,1,1,1,carve,22,.73);this.beam([-.20,.15,side*.33],[.19,.12,side*.25],.014,carve,22,.60);}
 // Thick scaled tail makes a compact arch over the back, not a handle-like loop.
 const path=M.catmull([[.44,.32],[.61,.47],[.59,.68],[.40,.80],[.16,.72],[.065,.54]],9,false),frames=path.map((q,i)=>{let a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],d=M.norm([b[0]-a[0],b[1]-a[1]]),t=i/(path.length-1),r=.17*(1-.61*Math.pow(t,3));return{q,n:[-d[1],d[0]],r,rz:r*1.25};});
 function tailAt(i,a){let f=frames[i];return[f.q[0]+f.n[0]*f.r*Math.cos(a),f.q[1]+f.n[1]*f.r*Math.cos(a),f.rz*Math.sin(a)];}
 const tail=this.geo('v10-fish-rolled-tail',()=>{let g=new G.Geometry(),N=48;for(let i=0;i<frames.length-1;i++)for(let j=0;j<N;j++){let a=j*TAU/N,b=(j+1)*TAU/N;g.quad(tailAt(i,a),tailAt(i+1,a),tailAt(i+1,b),tailAt(i,b));}return g;});this.mesh('v10-fish-rolled-tail',tail,0,0,0,1,1,1,tawny,22,.80);
 const scales=this.geo('v10-fish-scale-relief',()=>{let g=new G.Geometry();for(const side of[-1,1])for(let row=0;row<5;row++)for(let i=0;i<9;i++){let x=-.39+i*.078+(row%2)*.036,a=side*(.38+row*.25),pts=[];for(let j=0;j<=12;j++){let t=j*Math.PI/12,pp=bodyAt(x+.035*Math.cos(t),a+side*.105*Math.sin(t));pp[2]+=.0025*side;pts.push(pp);}tube(g,pts,.0029,7);}for(let i=3;i<frames.length-3;i+=3)for(let j=0;j<12;j++){let a=j*TAU/12+(i%2)*.07,pts=[];for(let k=0;k<=9;k++){let t=k*Math.PI/9,ii=Math.min(frames.length-1,i+Math.round(Math.sin(t)*1.6)),pp=tailAt(ii,a+.17*Math.cos(t));pts.push(pp);}tube(g,pts,.003,7);}return g;});this.mesh('v10-fish-scale-relief',scales,0,0,0,1,1,1,carve,22,.84);
 // Fanned terminal fin folds back onto the body, with small incised rays.
 for(let i=0;i<5;i++){let z=(i-2)*.028;this.beam([.064,.55,z],[.02,.46,z*1.8],.006,carve,22,.87);}
};
P.lakeIsland=function(){/* polygon is rendered by the same inventory in scene.js */};
// Topography for graph ribbons and route camera: island paths are ABOVE grass;
// the short flat bridge has one continuous grade, not a stair/arch invention.
})(YY);
