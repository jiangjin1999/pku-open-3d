/* Photo-led Shaoyuan details and a scoped coiled-roof profile for Langrun courtyard models. */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,previous=A.render;
function edges(g){const out=[];for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],l=Math.hypot(c[0]-a[0],c[1]-a[1]);if(l>.01)out.push({a,c,l,ux:(c[0]-a[0])/l,uz:(c[1]-a[1])/l,nx:(c[1]-a[1])/l*sign,nz:-(c[0]-a[0])/l*sign});}}return out;}
function shell(b,f,add,h,floors,style){const id=f.properties.pickId,g=f.geometry,isTwo=style==='dorm';add('shaoyuan44-body-'+id,F.walls(g,.25,h),isTwo?'#d9ded4':'#d2cbb6',24,id);add('shaoyuan44-plinth-'+id,F.walls(g,.035,.25),'#a7afa1',10,id);add('shaoyuan44-roof-'+id,F.surface(g,h),'#909b91',22,id);b.id=id;
 for(const e of edges(g)){const rot=Math.atan2(e.nx,e.nz),fh=h/floors,count=Math.max(1,Math.floor(e.l/(isTwo?3.7:5.6))),stride=e.l/count;
 b.local((e.a[0]+e.c[0])/2,0,(e.a[1]+e.c[1])/2,rot,()=>{b.box(0,h+.28,-.12,e.l,.56,.25,isTwo?'#e1e4db':'#d2cbb6',24);b.box(0,h+.57,-.12,e.l+.03,.10,.36,'#b6bfb1',29);});
 if(e.l<3)continue;for(let j=0;j<floors;j++)for(let i=0;i<count;i++){const t=(i+.5)*stride,x=e.a[0]+e.ux*t+e.nx*.075,z=e.a[1]+e.uz*t+e.nz*.075;if(isTwo&&e.nx>.7&&Math.abs(z-176.1)<6.8)continue;const ww=isTwo?Math.min(2.65,stride*.82):Math.min(4.7,stride*.88),wh=isTwo?1.85:2.25;
 b.local(x,.55+(j+.48)*fh,z,rot,()=>{if(isTwo)b.box(0,-fh*.36,-.015,stride-.14,.62,.04,'#b7846c',24);b.box(0,0,0,ww+.15,wh+.13,.12,'#dfe3d8',29);b.box(0,0,.075,ww,wh,.03,'#738783',28);for(const s of [-1,1])b.box(s*ww*.26,0,.10,.06,wh,.055,'#d9e0d5',29);b.box(0,wh*.18,.11,ww,.055,.04,'#d8dfd3',29);b.box(0,-wh/2-.12,.10,ww+.23,.10,.25,'#dfe1d6',24);});
 }}return{height:h,sourceOutline:true};}
function seven(b,f,add){shell(b,f,add,12.2,3,'stone');b.id=f.properties.pickId;
 // Projecting portico follows the photographed east-facing entrance. Dimensions are fitted.
 b.local(-320.2,0,324,Math.PI/2,()=>{
  b.box(0,2.1,1.8,13.4,4.2,.10,'#4c615d',28);for(let x=-6;x<=6;x+=2.4)b.box(x,2.1,1.87,.12,4.2,.15,'#705647',29);
  for(const x of [-8,-3.6,3.6,8])b.box(x,2.3,3.1,.58,4.6,.65,'#d8d1bc',24);
  for(const x of [-5.8,5.8]){for(let i=-4;i<=4;i++)b.box(x+i*.37,2.18,3.05,.04,3.85,.06,'#646c63',29);for(let y=.5;y<4;y+=.39)b.box(x,y,3.05,3.15,.045,.06,'#656c63',29);}
  b.box(0,4.8,1.8,18.5,.4,4.1,'#715345',29);b.box(0,5.03,1.8,18.8,.10,4.3,'#4e544a',29);
  b.box(0,3.65,3.5,11.5,.75,.18,'#704e3b',6);b.lettering('北京大学正大国际中心',0,3.69,3.62,10.8,.55,0,'#e4e1d1');
  for(let j=0;j<4;j++)b.box(0,.08+j*.105,5.02-j*.37,17,.16,1.0,'#b9bdaf',10);
  b.lettering('勺 园',0,13.95,-2.3,7.6,.7,0,'#adae9b');
 });return{strategy:'shaoyuan7-44',floors:3,entrance:'east photograph; fitted'};}
function two(b,f,add){shell(b,f,add,15.7,5,'dorm');b.id=f.properties.pickId;b.local(-351.16,0,176.1,Math.PI/2,()=>{
  for(const x of [-6.1,6.1])b.box(x,7.95,.15,.5,15.8,.6,'#e1e4db',24);
  for(let j=1;j<5;j++){const y=j*3.14+.15;b.box(0,y,.5,11.8,.18,1.1,'#dee1d6',24);b.box(0,y+1.05,1.0,11.8,.07,.09,'#c7d2c5',29);for(let x=-5.7;x<=5.7;x+=.65)b.box(x,y+.58,1.0,.035,.91,.045,'#c5d1c5',29);for(const x of [-4,0,4])b.window(x,y+1.7,-.07,2.1,2.15,0,'#e4e6dd');}
  b.box(0,1.65,-.03,5.5,3.3,.14,'#536964',28);b.box(0,3.6,.15,6.2,.25,1.0,'#dfe3d9',24);b.lettering('勺园2号楼',0,4.30,1.02,4.8,.55,0,'#536154');b.box(0,16.25,.2,12.8,.16,1.15,'#d8ded2',24);
 });return{strategy:'shaoyuan2-44',floors:5,centralBalconies:4};}
function coiledRoof(x,y,z,w,d,h,rotation=0){this.local(x,y,z,rotation,()=>{
 const H=(t,u)=>Math.sin(Math.PI/2*Math.pow(t,1.48))+.075*Math.pow(Math.abs(u),8)*(1-t)*(1-t),half=t=>.5-.14*Math.min(1,t/.54),roof=this.geo('langrun44-coiled-hip',()=>{const g=new G.Geometry(),N=28,U=20;
 for(const side of [-1,1])for(let j=0;j<N;j++)for(let i=0;i<U;i++){const f=(t,u)=>[u*half(t),H(t,u),side*.5*(1-t)],t=j/N,s=(j+1)/N,u=-1+2*i/U,v=-1+2*(i+1)/U;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}
 for(const side of [-1,1])for(let j=0;j<14;j++)for(let i=0;i<12;i++){const f=(t,u)=>[side*half(t),H(t,1),u*.5*(1-t)],t=j/14*.54,s=(j+1)/14*.54,u=-1+2*i/12,v=-1+2*(i+1)/12;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}return g;});
 this.mesh('langrun44-coiled-hip',roof,0,0,0,w,h,d,'#6b756d',2,2.1);
 const panel=this.geo('langrun44-curved-gable',()=>{const g=new G.Geometry();for(let j=0;j<18;j++){const t=.54+.46*j/18,s=.54+.46*(j+1)/18;g.quad([0,H(t,1),-.5*(1-t)],[0,H(t,1),.5*(1-t)],[0,H(s,1),.5*(1-s)],[0,H(s,1),-.5*(1-s)]);}return g;});
 for(const side of [-1,1]){this.mesh('langrun44-curved-gable',panel,side*w*.36,0,0,1,h,d,'#814c38',6,2.06);this.box(0,-.14,side*d*.5,w,.23,.25,'#4c706b',6,1.9);}
 });}
A.render=function(b,f,add){const p=f.properties;if(p.id==='way/240832237')return seven(b,f,add);if(p.id==='way/445016207')return two(b,f,add);if(p.coiledRoof44){const old=b.n17Roof;b.n17Roof=coiledRoof;try{return previous(b,f,add)}finally{b.n17Roof=old;}}return previous(b,f,add);};
Y.Refinements44={seven,two,coiledRoof};
})(YY);
