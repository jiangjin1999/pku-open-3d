/* Wenshi Building: own three-storey gray-brick block and xieshan roof.
   Three floors are documented; heights, complete fenestration and entrance directions are fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/372944573';
const O=[114.689,114.665],R=Math.atan2(3.497,66.282),CO=Math.cos(R),SI=Math.sin(R),W=66.38,D=19.64,I=1.65,M=W/2,Z=D/2;
const H={base:.64,wall:11.20,eave:11.62,ridge:15.96,top:17.02};
const C={brick:'#93958b',stone:'#b8bbae',panel:'#adb3a5',red:'#91463e',glass:'#637b77',white:'#d7d7c7',roof:'#777e74',tile:'#80867c',green:'#3f7061',blue:'#567b7a',gold:'#c0ae79'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const g0=4.90,g1=W-g0,zg=3.90,zs=D-zg,roofY=z=>{const t=Math.max(0,1-Math.abs(z-Z)/Z);return H.eave+(H.ridge-H.eave)*Math.pow(t,1.40)+.22*Math.pow(1-t,8);};
const slopes=[{name:'north',p:[[0,0],[W,0],[g1,zg],[g1,Z],[g0,Z],[g0,zg]],axis:1,y:p=>roofY(p[1])},
 {name:'south',p:[[g0,Z],[g1,Z],[g1,zs],[W,D],[0,D],[g0,zs]],axis:1,y:p=>roofY(p[1])},
 {name:'west-hip',p:[[0,0],[g0,zg],[g0,zs],[0,D]],axis:0,y:p=>roofY(p[0]/g0*zg)},
 {name:'east-hip',p:[[g1,zg],[W,0],[W,D],[g1,zs]],axis:0,y:p=>roofY((W-p[0])/g0*zg)}];
function clip(p,axis,k,greater){const out=[];for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],ai=greater?a[axis]>=k:a[axis]<=k,ci=greater?c[axis]>=k:c[axis]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const vertex=p=>{const w=world(p[0],p[2]);return[w[0],p[1],w[1]];};
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'052-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 function surface(name,poly,axis,y){const mesh=new G.Geometry(),tiles=new G.Geometry(),lo=Math.min(...poly.map(p=>p[axis])),hi=Math.max(...poly.map(p=>p[axis])),across=1-axis,a=Math.min(...poly.map(p=>p[across])),c=Math.max(...poly.map(p=>p[across]));
  const emit=(g,p,dy)=>{for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(v=>vertex([v[0],y(v)+(typeof dy==='function'?dy(v):dy),v[1]])));};
  for(let j=0;j<32;j++){const low=lo+(hi-lo)*j/32,high=lo+(hi-lo)*(j+1)/32;emit(mesh,clip(clip(poly,axis,low,true),axis,high,false),0);
   for(let s=a+.12;s<c;s+=.34)for(let t=0;t<4;t++){const u=-.075+t*.0375,v=u+.0375;let p=poly;for(const [ax,k,g]of[[across,s+u,true],[across,s+v,false],[axis,low,true],[axis,high,false]])if(p.length)p=clip(p,ax,k,g);emit(tiles,p,q=>.012+.024*Math.sqrt(Math.max(0,1-Math.pow((q[across]-s)/.075,2))));}
  }
  tiles.detailWidth=.025;add('052-roof-'+name,mesh,C.roof,25,id);add('052-tiles-'+name,tiles,C.tile,25,id);
 }
 slopes.forEach(s=>surface(s.name,s.p,s.axis,s.y));
 const gableBase=roofY(zg);
 for(const x of[g0,g1]){const mesh=new G.Geometry();for(let j=0;j<40;j++){const a=zg+(zs-zg)*j/40,c=zg+(zs-zg)*(j+1)/40;mesh.quad(...[[x,gableBase,a],[x,gableBase,c],[x,roofY(c),c],[x,roofY(a),a]].map(vertex));}add('052-white-gable-'+x,mesh,C.white,24,id);}
 // The low central entry is a small tiled hip roof, separate from the short-end canopy.
 const porch={x0:M-4.70,x1:M+4.70,z0:D-I-.20,z1:D+1.60,eave:4.05,ridge:4.92};
 const pcx=M,pcz=(porch.z0+porch.z1)/2,phz=(porch.z1-porch.z0)/2,px0=porch.x0+phz,px1=porch.x1-phz;
 const py=z=>porch.eave+(porch.ridge-porch.eave)*Math.pow(Math.max(0,1-Math.abs(z-pcz)/phz),1.25);
 surface('entry-north',[[porch.x0,porch.z0],[porch.x1,porch.z0],[px1,pcz],[px0,pcz]],1,p=>py(p[1]));
 surface('entry-south',[[px0,pcz],[px1,pcz],[porch.x1,porch.z1],[porch.x0,porch.z1]],1,p=>py(p[1]));
 surface('entry-west',[[porch.x0,porch.z0],[px0,pcz],[porch.x0,porch.z1]],0,p=>py(porch.z0+p[0]-porch.x0));
 surface('entry-east',[[px1,pcz],[porch.x1,porch.z0],[porch.x1,porch.z1]],0,p=>py(porch.z0+porch.x1-p[0]));
 b.local(O[0],0,O[1],R,()=>{
  group('plinth',()=>b.box(M,H.base/2,Z,W-2*I+.22,H.base,D-2*I+.22,C.stone,24));
  // Real openings are cut into panel walls; frames and glazing sit inside each opening.
  for(let side=0;side<4;side++){const long=side%2===0,width=long?W-2*I:D-2*I,ox=side===1?W-I:side===3?I:M,oz=side===0?I:side===2?D-I:Z,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side];
   b.local(ox,0,oz,rot,()=>group('face-'+side,()=>{
    const panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.075,c-a,hi-lo,.16,C.brick,30);};
    const singles=[-27.45,-22.45,22.45,27.45],pairs=[-18,-10.8,-3.6,3.6,10.8,18];
    for(let fl=0;fl<3;fl++){const lo=[H.base,4.42,7.72][fl],hi=[4.42,7.72,H.wall][fl],bottom=[1.27,5.12,8.38][fl],top=[3.83,7.26,10.64][fl];
     const positions=long?[...singles,...(fl===0?pairs:pairs.flatMap(x=>[x-.97,x+.97]))].sort((a,c)=>a-c):[-4.75,0,4.75];
     let holes=positions.map(x=>({x,w:long?1.63:2.28,lo:bottom,hi:top,door:false}));
     if(fl===0&&[2,3].includes(side)){if(side===3)holes=holes.filter(q=>Math.abs(q.x)>1.5);holes.push({x:0,w:side===2?2.82:2.35,lo:H.base,hi:3.40,door:true});holes.sort((a,c)=>a.x-c.x);}
     let cursor=-width/2;for(const q of holes){const a=q.x-q.w/2,c=q.x+q.w/2;panel(cursor,a,lo,hi);panel(a,c,lo,q.lo);panel(a,c,q.hi,hi);
      const h=q.hi-q.lo,y=(q.lo+q.hi)/2;for(const x of[a,c])b.box(x,y,-.025,.085,h,.20,C.red,24);for(const yy of[q.lo,q.hi])b.box(q.x,yy,-.025,q.w,.085,.20,C.red,24);b.box(q.x,y,-.135,q.w-.10,h-.09,.035,C.glass,5);b.box(q.x,y,-.055,.048,h-.08,.075,C.red,24);b.box(q.x,q.hi-.65,-.055,q.w-.09,.055,.075,C.red,24);if(!q.door)b.box(q.x,q.lo-.07,.025,q.w+.18,.13,.36,C.stone,24);cursor=c;
     }panel(cursor,width/2,lo,hi);
     if(fl>0)for(const x of(long?pairs.flatMap(x=>[x-.97,x+.97]):[-4.75,0,4.75])){const ww=long?1.84:2.47,yy=bottom-.50;b.box(x,yy,.035,ww,.58,.18,C.stone,24);b.box(x,yy,.133,ww-.24,.36,.025,C.panel,24);}
    }
    b.box(0,4.36,.05,width+.09,.18,.31,C.stone,24);
    group('painted-eave',()=>{b.box(0,11.12,.09,width+.20,.22,.45,C.red,24);b.box(0,11.34,.32,width+.50,.18,.67,C.green,24);b.box(0,11.51,.63,width+.90,.10,1.01,C.blue,24);
     for(let x=-width/2+.60;x<width/2-.30;x+=1.61){b.box(x,10.90,.35,.29,.17,.51,C.green,24);b.box(x,11.06,.46,.66,.12,.68,C.blue,24);for(const s of[-1,1])b.beam([x+s*.09,10.84,.51],[x+s*.31,11.13,.73],.045,C.green,24);b.box(x,10.99,.81,.32,.025,.035,C.gold,24);}
     for(let x=-width/2-.45,n=0;x<width/2+.45;x+=.32,n++){b.box(x,11.60,.93,.14,.13,1.28,C.red,24);b.box(x,11.60,1.59,.145,.135,.09,n%2?C.white:C.red,24);}
    });
   }));
  }
  group('red-gable-boards',()=>{for(const [x,face]of[[g0-.025,-1],[g1+.025,1]]){
   const board=new G.Geometry();for(let j=0;j<40;j++){const a=zg+(zs-zg)*j/40,c=zg+(zs-zg)*(j+1)/40,ya=roofY(a),yc=roofY(c);for(const xx of[x-.09,x+.09])board.quad([xx,ya-.66,a],[xx,yc-.66,c],[xx,yc-.035,c],[xx,ya-.035,a]);for(const dy of[-.66,-.035])board.quad([x-.09,ya+dy,a],[x+.09,ya+dy,a],[x+.09,yc+dy,c],[x-.09,yc+dy,c]);}b.mesh('wide-board-'+x,board,0,0,0,1,1,1,C.red,24);
   // Small grouped gold studs follow the photographed boards; spacing is a visual fit.
   for(const s of[-1,1])for(const t of[.19,.43,.67,.88]){const z=Z+s*(Z-zg)*t,y=roofY(z)-.35;for(const dz of[-.085,0,.085])for(const dy of[-.055,.055])b.sphere(x+face*.108,y+dy,z+dz,.018,.023,.023,C.gold,24,0,true);}
   const scroll=[[0,14.87],[.22,14.73],[.28,14.44],[.55,14.35],[.68,14.15],[.61,13.97],[.35,13.95],[.26,14.09],[.38,14.18],[.46,14.11]];
   for(const s of[-1,1])for(let j=1;j<scroll.length;j++)b.beam([x+face*.05,scroll[j-1][1],Z+s*scroll[j-1][0]],[x+face*.05,scroll[j][1],Z+s*scroll[j][0]],.095,C.red,24);
  }});
  group('roof-ridges',()=>{b.box(M,H.ridge+.10,Z,g1-g0+.28,.22,.35,C.tile,25);
   for(const x of[g0,g1]){const face=x===g0?-1:1;b.box(x,H.ridge+.33,Z,.36,.55,.42,C.tile,25);const curl=[[-.12,16.15],[.05,16.50],[.24,16.68],[.43,16.67],[.50,16.82],[.40,16.91],[.25,16.87],[.25,16.77]];for(let j=1;j<curl.length;j++)for(const dz of[-.11,.11])b.beam([x+face*curl[j-1][0],curl[j-1][1],Z+dz],[x+face*curl[j][0],curl[j][1],Z+dz],.08,C.tile,25);b.beam([x,H.ridge+.28,Z],[x-face*.40,H.ridge+.48,Z],.12,C.tile,25);}
   for(const east of[false,true])for(const south of[false,true])for(let j=0;j<25;j++){const t=j/25,tt=(j+1)/25,x=east?W-g0*t:g0*t,xx=east?W-g0*tt:g0*tt,z=south?D-zg*t:zg*t,zz=south?D-zg*tt:zg*tt;b.beam([x,roofY(z)+.08,z],[xx,roofY(zz)+.08,zz],.10,C.tile,25);}
  });
  group('central-tiled-entry-provisional',()=>{b.box(M,.32,pcz,8.64,.64,porch.z1-porch.z0,C.stone,24);for(const x of[M-3.82,M+3.82]){b.box(x,2.23,porch.z1-.56,.46,3.18,.50,C.stone,24);b.box(x,3.86,porch.z1-.56,.65,.17,.64,C.stone,24);}b.box(M,3.93,porch.z1-.56,8.38,.22,.54,C.stone,24);b.box(M,porch.ridge+.065,pcz,px1-px0,.13,.20,C.tile,25);
   for(let k=0;k<4;k++){const h=.16*(4-k);b.box(M,h/2,porch.z1+.05+k*.32,8.57,h,.33,C.stone,24);}
  });
  group('west-low-red-canopy-provisional',()=>{b.box(I-.68,3.94,Z,1.61,.18,5.50,C.red,24);b.box(I-.68,4.055,Z,1.61,.045,5.50,C.stone,24);for(const z of[Z-2.20,Z+2.20])b.beam([I-.06,3.46,z],[I-1.20,3.85,z],.055,C.red,24);for(let k=0;k<4;k++){const h=.16*(4-k);b.box(I-.25-k*.30,h/2,Z,.31,h,5.04,C.stone,24);}});
 });
 return{strategy:'building052-v46',floors:3,floorsVerified:true,xieshan:true,roofGables:2,entranceTypes:2,entryDirectionsVerified:false,wholeWindowCountVerified:false,heightMeasured:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building052={id:ID,render,world,local,W,D,I,H,roofY,slopes,g0,g1,zg,zs};
})(YY);
