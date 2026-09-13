/* North Chemistry / Daya Hall: two floors, continuous red columns, northern candidate entrance. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/226704221';
const O=[-385.445,-110.479],R=Math.atan2(-.244,59.775),CO=Math.cos(R),SI=Math.sin(R),W=59.776,D=23.828,mid=W/2;
const C={wall:'#e0e1d5',stone:'#aeb7b1',red:'#77382f',frame:'#714132',glass:'#779291',roof:'#737d79',tile:'#96a19a',green:'#287368',blue:'#357292',gold:'#c3b773'};
const H={wall:8.70,eave:9.85,ridge:14.2,top:15.2},entrance={side:'north',inferred:true,u:mid,v:0};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'016-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function block(name,box,base,top,color=C.wall){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('016-'+name,g,color,24,id);}
 block('body-west',[-1,-1,mid-1.7,25],0,H.wall);block('body-east',[mid+1.7,-1,61,25],0,H.wall);block('door-back-body',[mid-1.7,1.2,mid+1.7,25],0,H.wall);block('door-lintel',[mid-1.7,-1,mid+1.7,1.2],3.95,H.wall);
 // A single continuous four-slope hipped roof, without upper gable walls.
 const x0=-1.4,x1=W+1.4,z0=-1.4,z1=D+1.4,zm=D/2,g0=7,g1=W-7;
 const roofY=v=>{const t=Math.max(0,1-Math.abs(v-zm)/(zm-z0));return 9.63+4.57*Math.pow(t,1.25)+.22*Math.pow(1-t,10);};
 const faces=[{name:'north',p:[[x0,z0],[x1,z0],[g1,zm],[g0,zm]],axis:1,y:p=>roofY(p[1])},{name:'south',p:[[g0,zm],[g1,zm],[x1,z1],[x0,z1]],axis:1,y:p=>roofY(p[1])},{name:'west',p:[[x0,z0],[g0,zm],[x0,z1]],axis:0,y:p=>roofY(z0+(p[0]-x0)/(g0-x0)*(zm-z0))},{name:'east',p:[[g1,zm],[x1,z0],[x1,z1]],axis:0,y:p=>roofY(z0+(x1-p[0])/(x1-g1)*(zm-z0))}];
 for(const q of faces){const mesh=new G.Geometry(),tiles=new G.Geometry(),axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));for(let j=0;j<32;j++){const p=clip(clip(q.p,axis,lo+(hi-lo)*j/32,true),axis,lo+(hi-lo)*(j+1)/32,false);for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p),p[1])));}add('016-hip-roof-'+q.name,mesh,C.roof,2,id);
  const across=1-axis,a=Math.min(...q.p.map(p=>p[across])),c=Math.max(...q.p.map(p=>p[across]));for(let s=a+.1;s<c;s+=.31)for(let j=0;j<32;j++){let p=q.p;for(const [ax,k,g] of [[across,s-.026,true],[across,s+.026,false],[axis,lo+(hi-lo)*j/32,true],[axis,lo+(hi-lo)*(j+1)/32,false]])if(p.length)p=clip(p,ax,k,g);for(let i=1;i<p.length-1;i++)tiles.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p)+.04,p[1])));}add('016-tile-ribs-'+q.name,tiles,C.tile,2,id);
 }
 b.local(O[0],0,O[1],R,()=>{
  group('ridge-and-end-ornaments',()=>{b.box(mid,14.27,zm,g1-g0+.3,.22,.38,C.tile,2);for(const x of [g0,g1]){b.box(x,14.62,zm,.27,.6,.34,C.tile,2);b.sphere(x,15.02,zm,.22,.17,.22,C.tile,2,0,true);}for(const east of [false,true])for(const south of [false,true])for(let j=0;j<24;j++){const t=j/24,tt=(j+1)/24,x=east?x1-(x1-g1)*t:x0+(g0-x0)*t,xx=east?x1-(x1-g1)*tt:x0+(g0-x0)*tt,v=south?z1-(z1-zm)*t:z0+(zm-z0)*t,vv=south?z1-(z1-zm)*tt:z0+(zm-z0)*tt;b.beam([x,roofY(v)+.06,v],[xx,roofY(vv)+.06,vv],.13,C.tile,2);}});
  function lattice(x,y,z,w,h){b.box(x,y,z,w,h,.07,C.glass,5);for(const xx of [x-w/2,x,x+w/2])b.box(xx,y,z+.07,.065,h+.08,.11,C.frame,6);for(const yy of [y-h/2,y+.10,y+h/2-.65,y+h/2])b.box(x,yy,z+.07,w+.10,.065,.11,C.frame,6);for(let xx=x-w/2+.12;xx<x+w/2;xx+=.28){b.box(xx,y+h/2-.32,z+.09,.035,.59,.06,C.frame,6);for(const yy of [y+h/2-.49,y+h/2-.18])b.box(xx+.09,yy,z+.09,.19,.025,.06,C.frame,6);}}
  const breaks=[.35,8.55,16.75,24.95,34.83,43.03,51.23,W-.35];
  for(const north of [true,false])b.local(north?W:0,0,north?0:D,north?Math.PI:0,()=>{
   group((north?'north':'south')+'-two-storey-windows',()=>{for(let i=1;i<breaks.length;i++){const a=breaks[i-1],c=breaks[i],span=c-a;if(i===4){for(const y of [2.40,6.52]){for(const x of [a+1.65,c-1.65])lattice(x,y,.02,2.35,3.03);if(!north||y>3)lattice((a+c)/2,y,.02,3.35,3.03);}}else for(const x of [a+span*.265,a+span*.735])for(const y of [2.40,6.52])lattice(x,y,.02,span*.36,3.03);}});
   group((north?'north':'south')+'-continuous-red-columns',()=>{for(const x of breaks)b.cyl(x,.70,.18,.30,8.57,C.red,20,1,6);});
   group('white-waist-plinth',()=>{b.box(mid,4.48,.065,W,.94,.17,C.wall,24);for(const y of [4.0,4.96])b.box(mid,y,.13,W,.09,.22,'#c8d2c9',24);if(north){for(const [a,c] of [[0,mid-1.7],[mid+1.7,W]])b.box((a+c)/2,.36,.035,c-a,.72,.11,C.stone,24);}else b.box(mid,.36,.035,W,.72,.11,C.stone,24);});
   group('painted-eave',()=>{b.box(mid,8.59,.2,W+.6,1.00,.7,C.green,6);b.box(mid,9.26,.28,W+.9,.24,.9,C.red,6);for(let i=1;i<breaks.length;i++){const a=breaks[i-1],c=breaks[i],x=(a+c)/2,w=c-a-.55;for(const cy of [8.34,8.84]){
     b.box(x,cy,.58,w,.40,.08,C.blue,6);
     for(const yy of [cy-.20,cy+.20])b.box(x,yy,.64,w,.038,.055,C.gold,9);
     b.box(x,cy,.65,w*.56,.19,.06,'#c9d6be',24);
     for(const side of [-1,1]){const sx=x+side*w*.36;
      b.box(sx,cy,.65,.60,.28,.055,C.green,6);
      for(const yy of [cy-.115,cy+.115])b.box(sx,yy,.69,.47,.03,.045,C.gold,9);
      for(const xx of [sx-.235,sx+.235])b.box(xx,cy,.69,.03,.23,.045,C.gold,9);
      b.box(sx,cy,.70,.18,.10,.045,C.gold,9);
     }
    }}for(const x of breaks){b.box(x,9.05,.48,.61,.32,.64,C.green,6);b.box(x,9.30,.57,.92,.18,.85,C.blue,6);b.box(x,9.04,.81,.27,.18,.05,C.gold,9);}for(let x=.2;x<W;x+=.40){b.box(x,9.57,.67,.15,.15,1.37,C.red,6);b.box(x,9.57,1.37,.16,.14,.09,C.gold,9);}});
  });
  // North is a spatial inference from the west-gate axis, not from the building's name.
  b.local(W,0,0,Math.PI,()=>{
   group('north-daya-door',()=>{b.box(mid,2.33,-1.10,3.25,3.10,.09,C.red,6);for(const x of [mid-.82,mid+.82]){b.box(x,2.52,-1.025,1.46,2.45,.05,C.glass,5);for(let y=1.43;y<3.75;y+=.48)b.box(x,y,-.98,1.40,.055,.065,C.frame,6);}for(const x of [mid-1.65,mid,mid+1.65])b.box(x,2.33,-.97,.10,3.13,.12,C.red,6);b.box(mid,3.88,-.97,3.38,.10,.12,C.red,6);for(const x of [mid-.13,mid+.13])b.box(x,2.24,-.89,.035,.45,.08,C.gold,9);b.box(mid,.73,-.55,3.38,.08,1.25,C.stone,24);});
   group('daya-signs',()=>{b.box(mid,4.49,.19,2.70,.64,.10,'#252e2b',6);if(b.lettering)b.lettering('堂雅大',mid,4.49,.25,2.42,.45,0,C.gold);for(const x of [mid-1.94,mid+1.94]){b.box(x,2.41,.15,.35,3.0,.08,'#252e2b',6);for(let y=1.2;y<3.8;y+=.27)b.box(x,y,.20,.105,.055,.025,C.gold,9);}});
   group('small-stairs',()=>{for(let i=0;i<5;i++){const z=2.0-i*.38,top=.15*(i+1);b.box(mid,top/2,z,3.55,top,.39,C.stone,24);}b.box(mid,.375,-.12,3.55,.75,1.0,C.stone,24);for(const side of [-1,1]){const x=mid+side*1.91;for(const [z,y] of [[.1,.75],[2.12,.15]])b.cyl(x,y,z,.028,.86,'#45514c',8,1,6);b.beam([x,1.61,.1],[x,1.01,2.12],.034,'#45514c',6);group('stair-rail-infill',()=>{b.beam([x,1.02,.15],[x,.45,2.07],.025,'#45514c',6);for(const z of [.42,.92,1.42,1.92]){const y=1.61-.6*(z-.1)/2.02;b.beam([x,y-.06,z],[x,y-.57,z],.023,'#45514c',6);b.beam([x,y-.30,z],[x,y-.30,z-.24],.023,'#45514c',6);}});}});
  });
 });
 // Short ends retain two restrained rows and no invented secondary door or extra storey.
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[1]-cc[1])<1)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('short-ends',()=>{for(let j=0;j<4;j++)for(const y of [2.4,6.52]){const x=(j+.5)*len/4;b.box(x,y,.04,3.25,3.03,.09,C.glass,5);for(const xx of [x-1.63,x,x+1.63])b.box(xx,y,.11,.08,3.14,.10,C.frame,6);for(const yy of [y-1.515,y+.85,y+1.515])b.box(x,yy,.11,3.35,.08,.10,C.frame,6);}b.box(len/2,4.48,.06,len,.94,.17,C.wall,24);b.box(len/2,.36,.03,len,.72,.11,C.stone,24);b.box(len/2,8.84,.20,len,.56,.70,C.green,6);b.box(len/2,9.26,.28,len,.24,.9,C.red,6);for(let x=.2;x<len;x+=.4)b.box(x,9.57,.67,.15,.15,1.37,C.red,6);}));}
 return{strategy:'building016-v46',floors:2,sourceOutline:true,hipRoof:true,continuousColumns:true,entranceInferred:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building016={id:ID,render,world,local,pieces,heights:H,entrance};
})(YY);
