/* Geology Building: own three-floor grey-brick block, paired relief panels and two distinct tiled entries.
   The broad entry is provisionally south and the narrow entry north; these directions remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/445012603';
const O=[116.841,166.352],R=Math.atan2(3.453,62.874),CO=Math.cos(R),SI=Math.sin(R),W=62.974,D=18.06,I=.80,M=W/2,Z=D/2;
const H={base:.54,wall:11.28,eave:11.86,ridge:16.52,top:17.12},C={brick:'#9b9c92',stone:'#c0c0b1',panel:'#cac9b9',recess:'#b5b6a6',red:'#97443d',glass:'#637e7b',bronze:'#aa8e6f',roof:'#7c8278',tile:'#888f83',white:'#dddbcb',green:'#3b7261',blue:'#5e8b85',gold:'#cdb374'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const g0=4.45,g1=W-g0,zg=3.50,zs=D-zg,roofY=z=>{const t=Math.max(0,1-Math.abs(z-Z)/Z);return H.eave+(H.ridge-H.eave)*Math.pow(t,1.38)+.20*Math.pow(1-t,8);};
const slopes=[{name:'north',p:[[0,0],[W,0],[g1,zg],[g1,Z],[g0,Z],[g0,zg]],axis:1,y:p=>roofY(p[1])},{name:'south',p:[[g0,Z],[g1,Z],[g1,zs],[W,D],[0,D],[g0,zs]],axis:1,y:p=>roofY(p[1])},{name:'west-hip',p:[[0,0],[g0,zg],[g0,zs],[0,D]],axis:0,y:p=>roofY(p[0]/g0*zg)},{name:'east-hip',p:[[g1,zg],[W,0],[W,D],[g1,zs]],axis:0,y:p=>roofY((W-p[0])/g0*zg)}];
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,ci=greater?c[axis]>=k:c[axis]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
function rounded(w,h,r){const p=[];for(const [cx,cy,start]of[[w/2-r,h/2-r,0],[-w/2+r,h/2-r,Math.PI/2],[-w/2+r,-h/2+r,Math.PI],[w/2-r,-h/2+r,Math.PI*1.5]])for(let j=0;j<=7;j++){const a=start+j*Math.PI/14;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a),0]);}const g=new G.Geometry();for(let j=0;j<p.length;j++)g.tri([0,0,0],p[j],p[(j+1)%p.length]);return g;}
const canopies={broad:[{name:'west',a:-7.25,c:-2.50,edge:4.07,back:4.80,depth:1.58},{name:'middle',a:-2.50,c:2.50,edge:4.29,back:5.04,depth:1.74},{name:'east',a:2.50,c:7.25,edge:4.07,back:4.80,depth:1.58}],narrow:[{name:'single',a:-3.28,c:3.28,edge:4.16,back:4.92,depth:1.50}]};
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=p=>{const w=world(p[0],p[2]);return[w[0],p[1],w[1]];};
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'056-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 for(const s of slopes){const mesh=new G.Geometry(),tiles=new G.Geometry(),axis=s.axis,other=1-axis,lo=Math.min(...s.p.map(p=>p[axis])),hi=Math.max(...s.p.map(p=>p[axis])),left=Math.min(...s.p.map(p=>p[other])),right=Math.max(...s.p.map(p=>p[other]));
  const emit=(g,p,dy)=>{for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(v=>vertex([v[0],s.y(v)+(typeof dy==='function'?dy(v):dy),v[1]])));};
  for(let j=0;j<28;j++){const low=lo+(hi-lo)*j/28,high=lo+(hi-lo)*(j+1)/28;emit(mesh,clip(clip(s.p,axis,low,true),axis,high,false),0);
   for(let u=left+.15;u<right;u+=.34)for(let k=0;k<4;k++){const a=-.07+k*.035,c=a+.035;let p=s.p;for(const [ax,v,more]of[[other,u+a,true],[other,u+c,false],[axis,low,true],[axis,high,false]])if(p.length)p=clip(p,ax,v,more);emit(tiles,p,q=>.015+.025*Math.sqrt(Math.max(0,1-Math.pow((q[other]-u)/.07,2))));}
  }tiles.detailWidth=.035;add('056-own-roof-'+s.name,mesh,C.roof,25,id);add('056-own-tiles-'+s.name,tiles,C.tile,25,id);
 }
 // Half-hip roofs end below the two triangular gables, not at the ridge as in a full hip roof.
 for(const x of[g0,g1]){const mesh=new G.Geometry(),base=roofY(zg);for(let j=0;j<36;j++){const a=zg+(zs-zg)*j/36,c=zg+(zs-zg)*(j+1)/36;mesh.quad(...[[x,base,a],[x,base,c],[x,roofY(c),c],[x,roofY(a),a]].map(vertex));}add('056-gable-infill-'+x,mesh,C.white,24,id);}
 b.local(O[0],0,O[1],R,()=>{
  group('plinth',()=>b.box(M,H.base/2,Z,W-2*I+.24,H.base,D-2*I+.24,C.stone,24));
  for(let side=0;side<4;side++){const long=side%2===0,width=long?W-2*I:D-2*I,ox=side===1?W-I:side===3?I:M,oz=side===0?I:side===2?D-I:Z,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side];
   b.local(ox,0,oz,rot,()=>group('face-'+side,()=>{
    const panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.08,c-a,hi-lo,.17,C.brick,30);};
    const positions=long?Array.from({length:13},(_,i)=>(i-6)*4.65):[-5.05,0,5.05];
    for(let fl=0;fl<3;fl++){const lo=[H.base,4.32,7.76][fl],hi=[4.32,7.76,H.wall][fl],bottom=[1.18,5.14,8.62][fl],top=[3.84,7.31,10.82][fl];let cursor=-width/2;
     for(const x of positions){const door=fl===0&&long&&Math.abs(x)<.1,flanking=fl===0&&side===2&&Math.abs(Math.abs(x)-4.65)<.1,w=flanking?1.48:long?3.15:2.85,low=door||flanking?H.base:bottom,high=door?3.79:top,a=x-w/2,c=x+w/2,h=high-low,y=(low+high)/2,frame=door?C.bronze:C.red;
      panel(cursor,a,lo,hi);panel(a,c,lo,low);panel(a,c,high,hi);
      group('openings-'+fl,()=>{b.box(x,y,-.16,w-.12,h-.12,.045,C.glass,5);for(const u of[a,c])b.box(u,y,-.035,.09,h,.22,frame,24);for(const v of[low,high])b.box(x,v,-.035,w,.09,.22,frame,24);
       const transom=high-.62;b.box(x,transom,-.065,w-.10,.075,.10,frame,24);
       if(door){for(const u of[x-w*.29,x+w*.29])b.box(u,(low+transom)/2,-.065,.075,transom-low,.10,frame,24);b.box(x,(low+transom)/2,-.065,.06,transom-low,.10,frame,24);for(const u of[x-.16,x+.16])b.box(u,1.76,.025,.028,.42,.04,'#c4c5b9',9);}
       else{for(const u of(flanking?[]:[x-w*.23,x+w*.23]))b.box(u,(low+transom)/2,-.065,.065,transom-low,.10,frame,24);b.box(x,(transom+high)/2,-.065,.065,high-transom,.10,frame,24);if(flanking)b.box(x,low+.50,-.08,w-.12,.95,.09,'#557d75',24);else b.box(x,low-.06,.035,w+.18,.12,.34,C.stone,24);}
      });
      if(fl>0)group('paired-relief-panels',()=>{const y=bottom-.44;b.box(x,y,.025,w+.30,.78,.15,C.panel,24);for(const u of[x-.80,x+.80]){b.mesh('056-relief-shadow',b.geo('056-relief-shadow',()=>rounded(1.43,.65,.17)),u,y,.108,1,1,1,'#a7ab9d',24);b.mesh('056-relief-rim',b.geo('056-relief-rim',()=>rounded(1.32,.56,.145)),u,y,.116,1,1,1,C.white,24);b.mesh('056-relief-centre',b.geo('056-relief-centre',()=>rounded(1.15,.40,.11)),u,y,.126,1,1,1,C.panel,24);}});
      cursor=c;
     }panel(cursor,width/2,lo,hi);
    }
    group('brick-pilasters',()=>{const edges=long?Array.from({length:14},(_,i)=>(i-6.5)*4.65):[-7.59,-2.52,2.52,7.59];for(const x of edges)b.box(x,(H.base+H.wall)/2,.05,.38,H.wall-H.base,.24,C.brick,30);});
    b.box(0,4.31,.065,width,.14,.34,C.stone,24);for(let x=-width/2+.10;x<width/2-.10;x+=.32)b.box(x,4.18,.13,.15,.12,.20,C.stone,24);
    group('painted-eave',()=>{b.box(0,11.26,.12,width+.22,.22,.46,C.red,24);b.box(0,11.52,.25,width+.40,.20,.67,C.green,24);for(let x=-width/2+.65;x<width/2-.4;x+=1.55){b.box(x,11.10,.29,.24,.20,.43,C.green,24);b.box(x,11.29,.38,.54,.14,.58,C.blue,24);for(const k of[-1,1])b.beam([x+k*.07,11.10,.43],[x+k*.25,11.37,.60],.045,C.green,24);b.box(x,11.28,.69,.18,.045,.045,C.gold,24);}for(let x=-width/2-.26,n=0;x<width/2+.27;x+=.32,n++){b.box(x,11.76,.35,.13,.14,.89,C.red,24);b.box(x,11.76,.82,.14,.14,.075,n%2?C.white:C.red,24);}});
    if(long){const broad=side===2,segments=broad?canopies.broad:canopies.narrow;
     group(broad?'three-part-entry-provisional-south':'single-entry-provisional-north',()=>{
      for(const s of segments){const roof=new G.Geometry(),ribs=new G.Geometry(),y=(x,z)=>s.back-(s.back-s.edge)*Math.pow(Math.max(0,(z+.18)/(s.depth+.18)),.82)+.13*Math.pow(Math.abs((x-(s.a+s.c)/2)/((s.c-s.a)/2)),10)*Math.pow(Math.max(0,(z+.18)/(s.depth+.18)),4);
       for(let j=0;j<18;j++){const z0=-.18+(s.depth+.18)*j/18,z1=-.18+(s.depth+.18)*(j+1)/18;for(let k=0;k<18;k++){const a=s.a+(s.c-s.a)*k/18,c=s.a+(s.c-s.a)*(k+1)/18;roof.quad([a,y(a,z0),z0],[c,y(c,z0),z0],[c,y(c,z1),z1],[a,y(a,z1),z1]);}
        for(let u=s.a+.10;u<s.c-.06;u+=.25)for(let k=0;k<4;k++){const a=u-.065+k*.0325,c=a+.0325,at=(x,z)=>[x,y(x,z)+.012+.035*Math.sqrt(Math.max(0,1-Math.pow((x-u)/.065,2))),z];ribs.quad(at(a,z0),at(c,z0),at(c,z1),at(a,z1));}
       }b.mesh('056-'+s.name+'-canopy-roof',roof,0,0,0,1,1,1,C.roof,25);ribs.detailWidth=.04;b.mesh('056-'+s.name+'-canopy-tiles',ribs,0,0,0,1,1,1,C.tile,25);
       // Dark-red fascia and blue/green rafters follow the two entry photos, with no freestanding columns.
       b.box((s.a+s.c)/2,s.edge-.15,s.depth-.16,s.c-s.a-.10,.20,.35,C.red,24);b.box((s.a+s.c)/2,s.edge-.21,s.depth-.26,s.c-s.a-.20,.075,.52,C.green,24);
       for(let u=s.a+.20;u<s.c-.12;u+=.28){b.box(u,s.edge-.20,s.depth-.13,.13,.14,.55,C.blue,24);b.box(u,s.edge-.20,s.depth+.16,.145,.15,.035,C.gold,24);b.box(u,s.edge-.20,s.depth+.18,.075,.075,.025,C.blue,24);}
       for(const x of[s.a+.32,s.c-.32]){const g=b.geo('056-curved-solid-knee',()=>{const q=new G.Geometry(),point=(t,xx,top)=>[xx,-.92+.63*Math.sin(t*Math.PI/2)+(top?.19:0),.08+.94*(1-Math.cos(t*Math.PI/2))];for(let k=0;k<24;k++){const t=k/24,u=(k+1)/24;for(const xx of[-.14,.14])q.quad(point(t,xx,false),point(u,xx,false),point(u,xx,true),point(t,xx,true));for(const top of[false,true])q.quad(point(t,-.14,top),point(t,.14,top),point(u,.14,top),point(u,-.14,top));}for(const t of[0,1])q.quad(point(t,-.14,false),point(t,.14,false),point(t,.14,true),point(t,-.14,true));return q;});b.mesh('056-curved-solid-knee',g,x,s.edge,0,1,1,1,C.red,24);b.box(x,s.edge-.48,.025,.31,.94,.15,C.red,24);b.box(x,s.edge-.10,s.depth-.40,.36,.16,.48,C.green,24);}
       const disc=b.geo('056-round-tile-end',()=>{const q=new G.Geometry();for(let k=0;k<32;k++){const a=k*Math.PI/16,c=(k+1)*Math.PI/16;q.tri([0,0,0],[Math.cos(a),Math.sin(a),0],[Math.cos(c),Math.sin(c),0]);}return q;});for(let u=s.a+.10;u<s.c-.06;u+=.25){const yy=y(u,s.depth)+.035;b.mesh('056-round-tile-end',disc,u,yy,s.depth+.025,.105,.105,1,'#747b72',25);b.mesh('056-round-tile-end',disc,u,yy,s.depth+.032,.078,.078,1,C.tile,25);b.mesh('056-round-tile-end',disc,u,yy,s.depth+.038,.060,.060,1,'#7b8278',25);}
       for(const x of[s.a,s.c])for(let j=0;j<18;j++){const z0=-.18+(s.depth+.18)*j/18,z1=-.18+(s.depth+.18)*(j+1)/18;b.beam([x,y(x,z0)+.045,z0],[x,y(x,z1)+.045,z1],.065,C.tile,25);}
      }
      const sw=broad?6.5:4.2;b.box(0,H.base/2,.29,sw,H.base,.58,C.stone,24);for(let k=0;k<3;k++){const h=H.base-k*.18;b.box(0,h/2,.69+k*.36,sw,h,.37,C.stone,24);}
      // The narrow entry's side stones are steep stair cheeks, not certified accessible ramps.
      for(const x of[-sw/2-.25,sw/2+.25]){const q=new G.Geometry();q.quad([x-.25,H.base,.50],[x+.25,H.base,.50],[x+.25,.04,1.65],[x-.25,.04,1.65]);q.quad([x-.25,0,.50],[x-.25,H.base,.50],[x-.25,.04,1.65],[x-.25,0,1.65]);q.quad([x+.25,H.base,.50],[x+.25,0,.50],[x+.25,0,1.65],[x+.25,.04,1.65]);b.mesh('056-stair-cheek-'+x,q,0,0,0,1,1,1,C.stone,24);}
     });
    }
   }));
  }
  group('gable-boards',()=>{for(const x of[g0,g1]){const face=x===g0?-1:1,g=new G.Geometry();for(let j=0;j<36;j++){const a=zg+(zs-zg)*j/36,c=zg+(zs-zg)*(j+1)/36,ya=roofY(a),yc=roofY(c);for(const xx of[x-.08,x+.08])g.quad([xx,ya-.43,a],[xx,yc-.43,c],[xx,yc-.035,c],[xx,ya-.035,a]);}b.mesh('056-red-barge-'+x,g,0,0,0,1,1,1,C.red,24);b.box(x+face*.015,roofY(zg)+.06,Z,.20,.12,zs-zg,C.red,24);}});
  group('roof-ridges',()=>{b.box(M,H.ridge+.09,Z,g1-g0+.20,.20,.32,C.tile,25);for(const x of[g0,g1]){b.box(x,H.ridge+.29,Z,.30,.46,.38,C.tile,25);b.sphere(x,H.ridge+.48,Z,.20,.12,.22,C.tile,25,0,true);}for(const east of[false,true])for(const south of[false,true])for(let j=0;j<24;j++){const t=j/24,tt=(j+1)/24,x=east?W-g0*t:g0*t,xx=east?W-g0*tt:g0*tt,z=south?D-zg*t:zg*t,zz=south?D-zg*tt:zg*tt;b.beam([x,roofY(z)+.07,z],[xx,roofY(zz)+.07,zz],.075,C.tile,25);}});
 });
 return{strategy:'building056-v46',floors:3,floorsDocumented:true,xieshan:true,roofGables:2,broadEntryRoofs:3,narrowEntryRoofs:1,opposedEntriesObserved:true,entryDirectionsVerified:false,wholeWindowCountVerified:false,heightMeasured:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building056={id:ID,render,world,local,W,D,I,H,roofY,slopes,g0,g1,zg,zs,canopies};
})(YY);
