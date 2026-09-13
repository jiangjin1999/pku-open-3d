/* Archive / old Yenching Library: three documented floors, two tall visible window tiers. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/226704412';
const O=[-297.137,-83.953],R=Math.atan2(-35.342,.111),CO=Math.cos(R),SI=Math.sin(R),W=35.3422,D=19.088,mid=W/2;
const C={wall:'#d5d9cd',stone:'#acb6ae',red:'#883e31',frame:'#864231',glass:'#70877d',roof:'#798374',tile:'#929d8b',green:'#387b70',blue:'#407b91',gold:'#b8b279'};
const H={wall:8.35,upper:10.35,eave:10.65,ridge:15.25,top:16.1};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'018-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function block(name,box,base,top,color=C.wall){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('018-'+name,g,color,24,id);}
 block('two-tall-window-tier-shell',[-1,-1,W+1,D+1],0,H.wall);
 // The upper band has actual shallow recesses. Its link to internal floor slabs remains unmeasured.
 block('upper-inset-shell',[2.2,.95,W-2.2,D-.95],8.52,H.upper,'#737b6c');
 for(const [a,c] of [[0,2.2],[W-2.2,W]])block('upper-end-pier-'+a,[a,-1,c,D+1],8.52,H.upper);
 block('upper-sill',[-1,-1,W+1,D+1],8.35,8.52,C.red);
 // Exterior roof envelope only: no arbitrarily cut opening for the textually attested inner atrium.
 const x0=-1.35,x1=W+1.35,z0=-1.35,z1=D+1.35,zm=D/2,g0=5,g1=W-5;
 const roofY=v=>{const t=Math.max(0,1-Math.abs(v-zm)/(zm-z0));return 10.38+4.87*Math.pow(t,1.35)+.27*Math.pow(1-t,10);};
 const faces=[{name:'east-long',p:[[x0,z0],[x1,z0],[g1,zm],[g0,zm]],axis:1,y:p=>roofY(p[1])},{name:'west-long',p:[[g0,zm],[g1,zm],[x1,z1],[x0,z1]],axis:1,y:p=>roofY(p[1])},{name:'north-end-fitted',p:[[x0,z0],[g0,zm],[x0,z1]],axis:0,y:p=>roofY(z0+(p[0]-x0)/(g0-x0)*(zm-z0))},{name:'south-end-fitted',p:[[g1,zm],[x1,z0],[x1,z1]],axis:0,y:p=>roofY(z0+(x1-p[0])/(x1-g1)*(zm-z0))}];
 for(const q of faces){const mesh=new G.Geometry(),tiles=new G.Geometry(),axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));for(let j=0;j<30;j++){const p=clip(clip(q.p,axis,lo+(hi-lo)*j/30,true),axis,lo+(hi-lo)*(j+1)/30,false);for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p),p[1])));}add('018-roof-envelope-'+q.name,mesh,C.roof,2,id);
  const across=1-axis,a=Math.min(...q.p.map(p=>p[across])),c=Math.max(...q.p.map(p=>p[across]));for(let s=a+.10;s<c;s+=.33)for(let j=0;j<30;j++){let p=q.p;for(const [ax,k,g] of [[across,s-.024,true],[across,s+.024,false],[axis,lo+(hi-lo)*j/30,true],[axis,lo+(hi-lo)*(j+1)/30,false]])if(p.length)p=clip(p,ax,k,g);for(let i=1;i<p.length-1;i++)tiles.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p)+.035,p[1])));}add('018-tile-ribs-'+q.name,tiles,C.tile,2,id);
 }
 b.local(O[0],0,O[1],R,()=>{
  group('roof-ridge',()=>{b.box(mid,15.31,zm,g1-g0+.3,.16,.30,C.tile,2);for(const x of [g0,g1]){b.box(x,15.61,zm,.22,.46,.25,C.tile,2);b.sphere(x,15.94,zm,.17,.15,.17,C.tile,2,0,true);}});
  function window(x,y,z,w,h){b.box(x,y,z,w,h,.075,C.glass,5);for(const xx of [x-w/2,x-w/6,x+w/6,x+w/2])b.box(xx,y,z+.07,.055,h+.09,.11,C.frame,6);for(const yy of [y-h/2,y-.12,y+h/2-.52,y+h/2])b.box(x,yy,z+.07,w+.10,.055,.11,C.frame,6);for(let xx=x-w/2+.15;xx<x+w/2;xx+=.28){b.box(xx,y+h/2-.25,z+.09,.028,.44,.055,C.frame,6);b.box(xx+.07,y+h/2-.25,z+.10,.14,.03,.04,C.frame,6);}}
  for(const east of [true,false])b.local(east?W:0,0,east?0:D,east?Math.PI:0,()=>{
   const positions=[4.35,9.68,15.0,20.32,25.65,30.98];
   group((east?'east':'west')+'-tall-windows',()=>{for(const x of positions)for(const y of [2.28,6.14])window(x,y,.025,3.58,2.97);});
   group('white-bands-and-piers',()=>{b.box(mid,.38,.025,W,.76,.10,C.stone,24);b.box(mid,4.15,.055,W,.63,.16,C.wall,24);for(const x of [1.18,W-1.18])b.box(x,4.3,.09,1.65,8.0,.14,C.wall,24);for(const y of [3.82,4.48])b.box(mid,y,.13,W,.075,.14,'#bdc8bd',24);});
   group('cross-level-red-posts',()=>{for(const x of [1.45,6.98,12.31,17.65,22.98,28.31,33.89])b.box(x,4.72,.16,.25,8.68,.24,C.red,6);});
   group('short-upper-openings',()=>{for(let j=0;j<11;j++){const x=3.5+j*(W-7)/10;window(x,9.26,-.87,1.65,1.25);b.box(x-.98,9.43,.18,.13,1.67,.18,C.red,6);}});
   group('painted-deep-eave',()=>{b.box(mid,8.42,.24,W,.34,.46,C.blue,6);for(let x=1.1;x<W;x+=2.2){b.box(x,8.43,.51,1.67,.17,.06,C.green,6);b.box(x,8.43,.55,1.21,.035,.05,C.gold,9);}b.box(mid,10.22,.24,W+.7,.22,.70,C.red,6);b.box(mid,10.44,.37,W+.9,.15,.88,C.green,6);for(let x=.2;x<W;x+=.38){b.box(x,10.54,.62,.14,.14,1.40,C.red,6);b.box(x,10.54,1.33,.15,.14,.07,C.gold,9);}});
  });
 });
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[0]-cc[0])>1)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('short-end-fitted',()=>{for(const x of [len*.30,len*.70])for(const y of [2.28,6.14]){b.box(x,y,.035,3.25,2.97,.08,C.glass,5);for(const xx of [x-1.63,x,x+1.63])b.box(xx,y,.10,.055,3.06,.11,C.frame,6);for(const yy of [y-1.485,y+1.485,y+.95])b.box(x,yy,.10,3.35,.055,.11,C.frame,6);}b.box(len/2,4.15,.055,len,.63,.16,C.wall,24);b.box(len/2,8.42,.24,len,.34,.46,C.blue,6);b.box(len/2,10.22,.24,len,.22,.70,C.red,6);}));}
 return{strategy:'building018-v46',floors:3,basementFloors:1,visibleTallWindowTiers:2,sourceOutline:true,atriumCoverUnverified:true,interiorUnmodeled:true,roofEnvelopeFitted:true,entranceUnplaced:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building018={id:ID,render,world,local,pieces,heights:H};
})(YY);
