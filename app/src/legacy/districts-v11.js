/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* Library precinct exterior study. East elevation follows the 2020 photo;
 * west courts and annex geometry remain explicitly qualified approximations.
 * No ancient-library position or undocumented interior is invented. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
const C={stone:'#b3b2a8',pale:'#d2d0c2',belt:'#dedbcf',dark:'#313d3e',glass:'#526a70',bronze:'#484338',roof:'#666e6a',metal:'#535b59',paving:'#b9b7a9'};
P.libBeam=function(key,a,b,thick,depth,col=C.belt,part=1.4){let dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),vx=dx/len,vy=dy/len;const local=new Float32Array([vx*len,vy*len,0,0,-vy*thick,vx*thick,0,0,0,0,depth,0,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,1]);this.e.add(key,this.geo(key,G.box),M.multiply(M.transform(this.origin,[1,1,1],this.rotation),local),col,[24,this.id,this.anim,part]);};
P.libWindow=function(x,y,z,w,h,r=0,grid=true){this.local(x,y,z,r,()=>{
 this.box(0,0,-.13,w+.40,h+.36,.22,'#8b8e84',10,.60);this.box(0,0,0,w,h,.13,C.dark,20,.64);this.box(0,0,.074,w-.27,h-.27,.026,C.glass,5,.65);
 for(const s of[-1,1]){this.box(s*(w/2+.09),0,.12,.25,h+.51,.40,C.belt,24,.70);this.box(0,s*(h/2+.07),.12,w+.39,.23,.41,C.belt,24,.70);}
 this.box(0,-h/2-.20,.20,w+.66,.17,.73,C.stone,10,.74);
 const n=Math.max(2,Math.round(w/1.30));for(let i=1;i<n;i++)this.box(-w/2+w*i/n,0,.139,.077,h-.22,.135,C.dark,20,.75);
 this.box(0,h*.22,.148,w-.20,.075,.15,C.dark,20,.75);this.box(0,-h*.24,.148,w-.20,.070,.15,C.dark,20,.75);
 if(grid){let strip=Math.min(.78,w*.20);for(const s of[-1,1]){for(let j=1;j<8;j++)this.box(s*(w/2-strip/2-.17),-h/2+h*j/8,.158,strip,.045,.08,C.dark,20,.77);this.box(s*(w/2-strip-.17),0,.154,.065,h-.19,.10,C.dark,20,.77);}}
 });};
P.libRoof=function(key,x,y,z,w,d,h,part=2){this.local(x,y,z,0,()=>{
 const half=t=>.5-.17*t,height=(t,u)=>h*Math.pow(t,1.58)+.78*Math.pow(Math.abs(u),10)*Math.pow(1-t,3),roof=this.geo(key,()=>{let g=new G.Geometry();for(const s of[-1,1])for(let j=0;j<24;j++)for(let i=0;i<36;i++){let t=j/24,tt=(j+1)/24,u=-1+2*i/36,v=-1+2*(i+1)/36,f=(t,u)=>[w*half(t)*u,height(t,u),s*d*.5*(1-t)];if(s===1)g.quad(f(t,u),f(t,v),f(tt,v),f(tt,u));else g.quad(f(t,v),f(t,u),f(tt,u),f(tt,v));}for(const s of[-1,1])for(let j=0;j<24;j++)for(let i=0;i<16;i++){let t=j/24,tt=(j+1)/24,u=-1+2*i/16,v=-1+2*(i+1)/16,f=(t,u)=>[s*w*half(t),height(t,1),d*.5*(1-t)*u];if(s===1)g.quad(f(t,v),f(t,u),f(tt,u),f(tt,v));else g.quad(f(t,u),f(t,v),f(tt,v),f(tt,u));}return g;});
 this.mesh(key,roof,0,0,0,1,1,1,C.roof,25,part);this.box(0,-.20,0,w-.8,.27,d-.8,'#726f60',20,part-.08);
 const ribkey=key+'-tiles',ribs=this.geo(ribkey,()=>{let g=new G.Geometry();g.detailWidth=.114;for(const s of[-1,1])for(let xx=-w/2+.20;xx<w/2;xx+=.42){let prev;for(let j=0;j<=28;j++){let t=j/28;if(Math.abs(xx)>w*half(t)-.015)break;let yy=height(t,xx/(w*half(t)))+.115,zz=s*d*.5*(1-t),ring=[];for(let k=0;k<=4;k++){let a=k*Math.PI/4;ring.push([xx+.057*Math.cos(a),yy+.057*Math.sin(a),zz]);}if(prev)for(let k=0;k<4;k++)s===1?g.quad(prev[k],prev[k+1],ring[k+1],ring[k]):g.quad(prev[k+1],prev[k],ring[k],ring[k+1]);prev=ring;}}return g;});this.mesh(ribkey,ribs,0,0,0,1,1,1,'#838982',25,part+.02);
 this.box(0,h+.04,0,w*.66,.34,.59,'#707970',25,part+.04);
 for(const s of[-1,1]){this.libBeam(key+'-ridge-finial',[s*w*.33,h+.06,0],[s*(w*.33+.65),h+.86,0],.32,.64,'#737c73',part+.08);this.sphere(s*(w*.33+.62),h+.92,0,.22,.26,.31,'#747c73',25,part+.08,true);for(let xx=-w/2+.3;xx<w/2;xx+=.80){let up=.78*Math.pow(Math.abs(xx/(w/2)),10);this.box(xx,-.36+up,s*(d*.5-1.8),.17,.24,3.9,C.belt,24,part-.12);}}
 });};
P.libDoor=function(x,z,w=12){this.local(x,0,z,0,()=>{this.box(0,3.45,0,w,5.85,.22,C.dark,20,.64);this.box(0,3.45,.125,w-.32,5.52,.032,'#455653',5,.66);for(let i=-3;i<=3;i++)this.box(i*w/7,3.45,.22,.15,5.68,.18,C.metal,20,.7);this.box(0,4.3,.24,w-.12,.18,.2,C.metal,20,.71);for(let i=-2;i<=2;i++)this.box(i*w/6+.15,2.8,.36,.065,.85,.13,'#b5b6a7',9,.73);});};
P.libraryEast=function(p,w=110,d=50){
 this.noPlant(0,12,135,101);this.box(0,.30,0,w+1.5,.60,d+1.5,C.stone,10,.15);
 // Discrete lower masses produce a real recessed entrance, not a flat front.
 const blocks=[[-40,0,30,50],[40,0,30,50],[0,-5,50,40]];
 for(const [x,z,bw,bd]of blocks){this.solid(x,z,bw,bd);this.box(x,13.0,z,bw,25.0,bd,C.stone,10,.5);for(const yy of[6.95,13.35,19.75,26.15]){this.box(x,yy,z,bw+.66,.42,bd+.66,C.belt,24,1.0);this.box(x,yy+.33,z,bw+.28,.19,bd+.30,'#c6c6b9',24,1.03);}this.box(x,26.58,z,bw+.52,.43,bd+.52,C.belt,24,1.10);}
 // Four visible facade tiers; internal storeys are not inferred from windows.
 const ys=[3.73,10.18,16.58,22.98];for(let f=0;f<4;f++){
  for(const s of[-1,1])for(const a of[30,40,50])this.libWindow(s*a,ys[f],25.08,8.05,f===0?4.45:4.63,0,true);
  for(const a of[-20,-10,0,10,20])if(f||a!==0)this.libWindow(a,ys[f],15.10,8.05,f===0?4.45:4.63,0,true);
  // Side returns reveal the setback between center and projecting wings.
  for(const s of[-1,1])this.local(s*25.1,0,20.0,-s*Math.PI/2,()=>this.libWindow(0,ys[f],.04,8.2,4.57,0,true));
  for(const s of[-1,1])for(let zz=-18;zz<=18;zz+=9)this.libWindow(s*55.08,ys[f],zz,7.15,4.45,s*Math.PI/2,false);
  for(let xx=-49;xx<51;xx+=9.8)this.libWindow(xx,ys[f],-25.09,7.8,4.4,Math.PI,false);
 }
 for(const s of[-1,1]){for(let j=0;j<=3;j++)this.box(s*(25+j*10),13.4,25.50,.82,25.9,.7,C.pale,10,1.10);for(let x=s*26;x*s<55;x+=s*2)this.box(x,27.12,25.1,.042,.87,.027,'#9c9f93',10,1.13);}
 this.libDoor(0,15.18,12.8);
 // Raised hall with a seven-bay structural register and neutral stone piers.
 this.box(0,29.55,-1.8,78,6.0,31.5,C.stone,10,1.20);
 for(let i=0;i<7;i++){let xx=-31.5+i*10.5;this.libWindow(xx,28.40,14.07,8.85,3.70,0,true);this.box(xx,31.10,14.05,8.95,.90,.14,C.dark,20,1.32);for(let j=-3;j<=3;j++)this.box(xx+j*1.13,31.08,14.21,.07,.80,.16,'#a8aa9d',24,1.35);
  this.libBeam('v11-east-truss',[xx-4.22,31.90,15.82],[xx,33.42,15.82],.27,.44,C.belt,1.48);this.libBeam('v11-east-truss',[xx,33.42,15.82],[xx+4.22,31.90,15.82],.27,.44,C.belt,1.48);this.box(xx,31.77,15.81,8.93,.26,.49,C.belt,24,1.47);this.box(xx,32.35,15.82,.24,1.21,.48,C.belt,24,1.5);
 }
 for(let i=0;i<=7;i++){let xx=-36.75+i*10.5;this.box(xx,29.76,15.28,.95,7.07,1.28,C.pale,10,1.30);for(let k=0;k<3;k++){this.box(xx,32.45+k*.43,16.15+k*.31,1.22+k*.51,.34,.86+k*.41,C.belt,24,1.55+k*.035);}this.box(xx,33.61,17.08,.38,.54,3.4,C.belt,24,1.66);}
 this.box(0,33.53,15.84,81.2,.37,.74,C.belt,24,1.71);this.sign('北京大学图书馆',0,31.64,16.49,17.8,2.2,0,false);
 this.libRoof('v11-east-roof',0,33.82,-1.8,103.0,50.0,8.5,2.25);
 // Thin compound metal canopy: a closed shell with independent underside ribs.
 const canopy=this.geo('v11-curved-canopy',()=>{let g=new G.Geometry(),N=28,yy=u=>10.12-2.35*Math.pow(Math.abs(u),1.75),canopyDepth=u=>1.45+.45*Math.abs(u),pos=(u,v,under)=>[u*(v?.88:1)*15,yy(u)+v*.52-(under?canopyDepth(u):0),19+v*15];for(let i=0;i<N;i++){let u=-1+2*i/N,v=-1+2*(i+1)/N;g.quad(pos(u,0,0),pos(v,0,0),pos(v,1,0),pos(u,1,0));g.quad(pos(u,1,1),pos(v,1,1),pos(v,0,1),pos(u,0,1));g.quad(pos(u,1,0),pos(v,1,0),pos(v,1,1),pos(u,1,1));}for(let s of[-1,1])g.quad(pos(s,0,1),pos(s,1,1),pos(s,1,0),pos(s,0,0));return g;});this.mesh('v11-curved-canopy',canopy,0,0,0,1,1,1,C.bronze,9,1.8);
 const trim=this.geo('v11-canopy-trim',()=>{let g=new G.Geometry();for(const level of[.10,1.30])for(let i=0;i<56;i++){let u=-1+2*i/56,v=-1+2*(i+1)/56,f=(u,off)=>[u*13.2,10.64-2.35*Math.pow(Math.abs(u),1.75)-level-.25*Math.abs(u)+off,34.025];g.quad(f(u,-.025),f(v,-.025),f(v,.025),f(u,.025));}return g;});this.mesh('v11-canopy-trim',trim,0,0,0,1,1,1,'#837d69',9,1.81);

 for(let x=-12;x<=12;x+=3){const y=8.60-2.35*Math.pow(Math.abs(x/15),1.75)-.45*Math.abs(x/15);this.beam([x,y,19],[x*.88,y+.52,34],.10,'#292f2c',9,1.77);}for(const s of[-1,1]){this.box(s*6.3,3.53,22.7,.24,6.25,.24,'#464c43',9,1.4);this.beam([s*6.3,5.55,22.7],[s*10,7.32,30.7],.075,'#6b7168',9,1.76);}
 // Forecourt is usable space, not a building footprint. Paving remains near level.
 this.box(0,.16,40.7,119,.28,31.0,C.paving,26,.05);for(const s of[-1,1]){this.box(s*39,.33,47,36,.13,13,'#7b8b66',13,.05);for(let x=21;x<57;x+=4){this.box(s*x,.55,37.2,.32,1.12,.42,C.belt,24,.2);this.box(s*x,1.18,37.2,.45,.12,.51,C.stone,10,.22);}this.box(s*39,1.12,37.2,36,.21,.31,C.belt,24,.23);this.box(s*39,.26,37.2,36,.22,.51,C.stone,10,.20);}
 for(let i=0;i<3;i++)this.box(0,.14+i*.17,17.7-i*.64,14.7,.28,1.33,C.pale,10,.20);
 for(const x of[-54,-32,32,54]){this.box(x,.36,32.8,.63,.65,.63,C.stone,10,.18);this.box(x,2.15,32.8,.16,3.7,.16,'#748074',9,.35);this.box(x,4.10,32.8,.56,.67,.56,'#bac0ad',24,.40);for(const s of[-1,1])this.box(x+s*.24,4.10,32.8,.05,.74,.63,'#576557',9,.42);}
};
P.libraryWest=function(p,w=70,d=100){
 this.noPlant(8,0,109,105);this.box(0,.19,0,w+1,.34,d+1,'#b5b7aa',21,.08);
 // Three parallel wings and an east spine: the open court spaces are not solid.
 const blocks=[[0,-44,70,12,18.5],[0,44,70,12,18.5],[0,0,70,12,21.9],[29,0,12,76,18.5]];
 for(const [x,z,bw,bd,h] of blocks){this.solid(x,z,bw,bd);this.box(x,h/2+.42,z,bw,h,bd,'#bbbcb1',24,.48);this.box(x,h+.51,z,bw+.55,.31,bd+.55,C.belt,24,1.1);this.box(x,h+.75,z,bw-.6,.22,bd-.6,'#8e958b',21,1.85);
  for(const yy of[4.9,9.4,13.9,18.4])this.box(x,yy,z,bw+.18,.20,bd+.24,'#d0d1c5',24,.9);
  for(const side of[-1,1])for(let f=0;f<4;f++)for(let i=0;i<Math.floor(bw/5.7);i++){let n=Math.floor(bw/5.7),xx=x-bw/2+(i+.5)*bw/n;this.libWindow(xx,2.84+f*4.49,z+side*(bd/2+.05),bw/n*.69,2.9,side===1?0:Math.PI,false);}
  for(const side of[-1,1])for(let f=0;f<4;f++)for(let j=0;j<Math.floor(bd/6);j++){let n=Math.floor(bd/6),zz=z-bd/2+(j+.5)*bd/n;this.libWindow(x+side*(bw/2+.05),2.84+f*4.49,zz,bd/n*.65,2.9,side*Math.PI/2,false);}
 }
 for(const s of[-1,1]){this.box(-7,.39,s*24,40,.20,24,'#869474',13,.04);this.box(-7,.45,s*24,18,.16,2.1,C.paving,21,.10);for(const zz of[-31,-18])this.local(-19,0,s*Math.abs(zz),Math.PI/2,()=>this.bench(0,0));}
 // Connect existing wings to the east building, with actual inter-building gap.
 for(const s of[-1,1]){this.solid(52.5,s*37,35,6);this.box(52.5,9.50,s*37,35,18,6,C.stone,24,.5);for(let f=0;f<4;f++)for(let j=0;j<5;j++)for(const side of[-1,1])this.libWindow(39+j*6.7,2.8+f*4.45,s*37+side*3.08,5.0,3.05,side===1?0:Math.PI,false);this.box(52.5,18.80,s*37,35.3,.28,6.3,'#8d968a',21,1.85);}
 this.local(0,0,-50.15,Math.PI,()=>{this.libDoor(0,.01,7.2);this.box(0,6.40,1.7,11.0,.36,3.9,'#a3aba0',9,1.7);this.sign('图书馆西楼',0,7.91,.38,10.6,1.18,0,true);for(let i=0;i<3;i++)this.box(0,.12+i*.15,2.90-i*.58,8.3,.25,1.16,C.stone,10,.15);});
};
P.libraryAnnex=function(p,w=20,d=20){
 this.noPlant(0,0,w+12,d+13);this.solid(0,0,w,d);this.box(0,.42,0,w+.8,.84,d+.8,C.stone,10,.15);this.box(0,6.8,0,w,12.1,d,C.stone,10,.5);
 for(const s of[-1,1])for(let f=0;f<2;f++){for(const x of[-6.5,0,6.5])this.libWindow(x,4.0+f*5.55,s*(d/2+.04),4.7,4.05,s===1?0:Math.PI,true);for(const z of[-6.5,0,6.5])this.libWindow(s*(w/2+.04),4.0+f*5.55,z,4.7,4.05,s*Math.PI/2,true);}
 for(const y of[6.46,12.75])this.box(0,y,0,w+.48,.35,d+.48,C.belt,24,1.15);
 for(let x=-9;x<10;x+=3)this.box(x,13.05,d/2+.47,.41,1.3,1.33,C.belt,24,1.43);
 this.libRoof('v11-annex-roof',0,13.54,0,w+4.5,d+4.5,2.6,2.0);
 this.libDoor(0,d/2+.1,6.2);this.box(0,6.7,d/2+1.0,8.5,.25,2.4,C.belt,24,1.32);
 // Open rising gallery connects towards the main mass; this is not a walkable
 // fire-escape simulation. Step count and level are marked as estimates.
 const toward=p.libraryModel.side;this.local(toward*(w/2+.25),0,-d/2+3,toward*Math.PI/2,()=>{
  const L=14.0,N=28,W=3.6;for(let j=0;j<N;j++){let z=j*L/N,y=1.02+j*.36;this.box(0,y,z,W,.18,L/N+.025,C.pale,10,.70+j*.006);}
  for(const s of[-1,1]){this.beam([s*W/2,.89,-.1],[s*W/2,10.90,L-.15],.085,C.metal,9,1.10);this.beam([s*W/2,2.22,-.1],[s*W/2,12.20,L-.15],.060,C.metal,9,1.20);for(let j=0;j<=14;j++){let z=j*(L-.25)/14,y=1.02+z*.72;this.box(s*W/2,y+.58,z,.07,1.15,.07,C.metal,9,1.23);}for(let j=0;j<=3;j++){let z=j*4.5,y=3.48+z*.72;this.box(s*2.17,y/2,z,.24,y,.24,C.pale,24,1.36);}this.beam([s*2.17,3.68,0],[s*2.17,13.50,13.7],.13,C.belt,24,1.40);}
  const key='v11-open-rising-gallery',g=this.geo(key,()=>new G.Geometry().quad([-2.45,3.88,-.38],[2.45,3.88,-.38],[2.45,14.02,14.1],[-2.45,14.02,14.1]));this.mesh(key,g,0,0,0,1,1,1,'#6e7871',25,1.8);
 });
};
})(YY);
