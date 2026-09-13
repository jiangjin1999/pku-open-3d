/* 129: 41/42 courtyard bicycle shelter, explicitly paired N-S barrel roofs.
 * 2023 PKU before/after photos support blue roof and white branching supports.
 * Heights, internal stations and glazing joints are photograph scale fits. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,ID='way/1101754971';
function render(b,f){b.id=f.properties.pickId;const p=f.geometry.coordinates[0].slice(0,4),C={roof:'#369ac4',frame:'#edf1e8',steel:'#b6c4bc',dark:'#617b79'};
 const q=(u,v,h)=>[(1-v)*((1-u)*p[0][0]+u*p[1][0])+v*((1-u)*p[3][0]+u*p[2][0]),h,(1-v)*((1-u)*p[0][1]+u*p[1][1])+v*((1-u)*p[3][1]+u*p[2][1])];
 const mesh=(n,g,c,m=9)=>b.mesh('129-'+n,g,0,0,0,1,1,1,c,m),height=t=>2.75+.93*Math.sin(Math.PI*t),beams=[];
 const beam=(a,c,width,color=C.frame)=>beams.push({a,c,width,color});
 // Front photograph shows broad flat painted plates, not cylindrical struts.
 const W=Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]),D=Math.hypot(p[3][0]-p[0][0],p[3][1]-p[0][1]);
 let plateIndex=0;
 function plate(poly,v){const g=new G.Geometry(),flat=G.polygon(poly),dv=.09/D;
  const at=(a,side)=>q(a[0],v+side*dv,a[1]);
  for(let i=0;i<flat.v.length;i+=24){const a=[flat.v[i],flat.v[i+2]],b=[flat.v[i+8],flat.v[i+10]],c=[flat.v[i+16],flat.v[i+18]];g.tri(at(a,-1),at(b,-1),at(c,-1));g.tri(at(c,1),at(b,1),at(a,1));}
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];g.quad(at(a,1),at(b,1),at(b,-1),at(a,-1));}
  mesh('painted-plate-'+plateIndex++,g,C.frame,38);
 }
 const roofs=[];for(let k=0;k<2;k++){const u0=k/2,u1=(k+1)/2,skin=new G.Geometry(),bottom=new G.Geometry(),edge=new G.Geometry();
  for(let i=0;i<30;i++){const t0=i/30,t1=(i+1)/30,u=u0+(u1-u0)*t0,w=u0+(u1-u0)*t1;const a=q(u,0,height(t0)),c=q(w,0,height(t1)),d=q(w,1,height(t1)),e=q(u,1,height(t0));skin.quad(e,d,c,a);bottom.quad(a.map((x,i)=>i===1?x-.055:x),c.map((x,i)=>i===1?x-.055:x),d.map((x,i)=>i===1?x-.055:x),e.map((x,i)=>i===1?x-.055:x));
   for(const v of[0,1]){const a=q(u,v,height(t0)),c=q(w,v,height(t1));edge.quad(a,c,[c[0],c[1]-.16,c[2]],[a[0],a[1]-.16,a[2]]);}
  }
  mesh('roof-'+k,skin,C.roof,28);mesh('roof-underside-'+k,bottom,'#479cba',28);mesh('roof-end-frame-'+k,edge,C.frame,9);roofs.push({u0,u1});
  for(const v of[.025,.34,.66,.975]){
   // Photo-proportioned four frame stations. Exact structural drawing absent.
   const um=(u0+u1)/2;
   plate([[um-.27/W,.12],[um+.27/W,.12],[um+.17/W,1.35],[um+.22/W,2.08],[um-.22/W,2.08],[um-.17/W,1.35]],v);
   for(const side of[-1,1]){const upper=[],lower=[];for(let j=0;j<=24;j++){const t=j/24,uu=um+side*.215*t,yy=2.03+(height(.5+side*.43)-.12-2.03)*Math.pow(t,.62),half=(.31-.12*t)/2;upper.push([uu,yy+half]);lower.push([uu,yy-half]);}plate([...upper,...lower.reverse()],v);}
   for(let i=0;i<30;i++){const t0=i/30,t1=(i+1)/30;beam(q(u0+(u1-u0)*t0,v,height(t0)-.08),q(u0+(u1-u0)*t1,v,height(t1)-.08),.075);}
  }
  for(const t of[0,.25,.5,.75,1])beam(q(u0+(u1-u0)*t,0,height(t)-.07),q(u0+(u1-u0)*t,1,height(t)-.07),.06,C.steel);
  // Side fascia and glazing joints retain the fitted trapezoid, no solid walls.
  for(const t of[0,1]){const u=u0+(u1-u0)*t;beam(q(u,0,height(t)-.14),q(u,1,height(t)-.14),.12);}
 }
 const old=b.e.add;b.e.add=function(key,...args){return old.call(this,'129-frame-'+key,...args);};try{for(const q of beams)b.beam(q.a,q.c,q.width/2,q.color,38);}finally{b.e.add=old;}
 return{id:ID,strategy:'building129-v46',roofRuns:2,roofAxes:['north-south','north-south'],openSides:true,postStationsFitted:4,lowestRoof:2.75,highestRoof:3.68,originalOutline:true,heightMeasured:false,currentStateVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):prior(b,f,add);};Y.Building129={id:ID,render};
})(YY);
