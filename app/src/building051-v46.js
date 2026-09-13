/* Philosophy Building: own long eastern block, western Boya annex and narrow low connector.
   Roof projections follow this source ring; exact heights, window counts and doorway mapping remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='way/272362583';
const O=[12.401,253.048],R=Math.atan2(2.277,62.737),CO=Math.cos(R),SI=Math.sin(R);
const C={brick:'#92958a',frame:'#813e3c',oldFrame:'#65645b',glass:'#586b68',stone:'#b8b9aa',roof:'#777d73',tile:'#7f857b',wood:'#626559'};
const parts=[{name:'east-main',x0:0,x1:62.778,z0:0,z1:22.178,eave:11.75,rise:5.1,floors:3},
 {name:'west-annex',x0:-38.165,x1:-14.475,z0:-.073,z1:15.959,eave:7.75,rise:3.65,floors:2}];
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function point(s,side,q,t){const cx=(s.x0+s.x1)/2,cz=(s.z0+s.z1)/2,hx=(s.x1-s.x0)/2,hz=(s.z1-s.z0)/2,hip=hz*.88;
 let x,z;if(side===0||side===2){x=cx+q*(hx-hip*t);z=cz+(side===0?-1:1)*hz*(1-t);}else{x=cx+(side===1?1:-1)*(hx-hip*t);z=cz+q*hz*(1-t);}
 const y=s.eave+s.rise*Math.pow(t,1.33)+.23*Math.pow(Math.abs(q),6)*Math.pow(1-t,5);return[x,y,z];}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=p=>{const w=world(p[0],p[2]);return[w[0],p[1],w[1]];};
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'051-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 for(const s of parts){const roof=new G.Geometry(),tiles=new G.Geometry();
  for(let side=0;side<4;side++){for(let i=0;i<56;i++)for(let j=0;j<20;j++){const q0=-1+i/28,q1=q0+1/28,t0=j/20,t1=(j+1)/20,p=[point(s,side,q0,t0),point(s,side,q1,t0),point(s,side,q1,t1),point(s,side,q0,t1)];roof.quad(...p.map(vertex));}
   // Parallel tile rows run down each roof plane and stop at its two hips.
   const across=side%2?(s.z1-s.z0)/2:(s.x1-s.x0)/2,inner=side%2?0:across-(s.z1-s.z0)*.44;
   for(let u=-across+.12;u<across-.1;u+=.34){const end=Math.min(.9999,(across-Math.abs(u)-.07)/(across-inner));if(end<=0)continue;
    for(let j=0;j<20;j++){const t0=end*j/20,t1=end*(j+1)/20,at=(offset,t)=>{const q=(u+offset)/(across+(inner-across)*t),p=point(s,side,q,t);p[1]+=.027+.035*Math.sqrt(Math.max(0,1-offset*offset/.0049));return vertex(p);};for(let k=0;k<4;k++){const a=-.07+k*.035,c=a+.035;tiles.quad(at(a,t0),at(c,t0),at(c,t1),at(a,t1));}}
   }
  }tiles.detailWidth=.05;add('051-'+s.name+'-roof',roof,C.roof,25,id);add('051-'+s.name+'-tiles',tiles,C.tile,25,id);
 }
 b.local(O[0],0,O[1],R,()=>{
  for(const s of parts){const cx=(s.x0+s.x1)/2,cz=(s.z0+s.z1)/2,x0=s.x0+.55,x1=s.x1-.55,z0=s.z0+.55,z1=s.z1-.55,top=s.eave-.18,base=.64,fh=(top-base)/s.floors;
   group(s.name+'-plinth',()=>{b.box(cx,.30,cz,x1-x0+.24,.60,z1-z0+.24,C.stone,24);b.box(cx,top-.02,cz,x1-x0,.12,z1-z0,C.wood,24);});
   for(let side=0;side<4;side++){const width=side%2?z1-z0:x1-x0,ox=side===1?x1:side===3?x0:cx,oz=side===0?z0:side===2?z1:cz,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side],main=s.name==='east-main',count=side%2?(main?5:3):(main?17:6);
    b.local(ox,0,oz,rot,()=>group(s.name+'-face-'+side,()=>{
     // The low link joins the ends of both blocks; remove its wall area and apertures.
     const linkFace=(main&&side===3)||(!main&&side===1),linkCenter=linkFace?(main?8.642-cz:cz-8.642):0,linkHalf=4.33;
     const panel=(a,c,lo,hi)=>{if(c<=a||hi<=lo)return;let pieces=[[a,c,lo,hi]];if(linkFace&&lo<3.43)pieces=pieces.flatMap(([a,c,lo,hi])=>[[a,Math.min(c,linkCenter-linkHalf),lo,hi],[Math.max(a,linkCenter+linkHalf),c,lo,hi],[Math.max(a,linkCenter-linkHalf),Math.min(c,linkCenter+linkHalf),3.43,hi]]).filter(q=>q[1]>q[0]&&q[3]>q[2]);for(const [a,c,lo,hi]of pieces)b.box((a+c)/2,(lo+hi)/2,-.035,c-a,hi-lo,.10,C.brick,30);};
     for(let fl=0;fl<s.floors;fl++){const lo=base+fl*fh,hi=lo+fh,positions=!main&&side===3?[-3.6,0,3.6]:Array.from({length:count},(_,i)=>(i-(count-1)/2)*(width-3)/(count-1)),holes=positions.map(x=>({x,w:main?1.7:1.95,lo:lo+.70,hi:!main&&side===3&&fl===0?3.39:hi-.50})).filter(q=>!(linkFace&&fl===0&&q.x+q.w/2>linkCenter-linkHalf&&q.x-q.w/2<linkCenter+linkHalf));
      const door=fl===0&&((main&&side===0)||(!main&&side===3));if(door){const q=holes[Math.floor(holes.length/2)];q.x=0;q.w=main?2.9:2.05;q.lo=base;q.hi=base+2.75;q.door=true;}
      let cursor=-width/2;for(const q of holes){const a=q.x-q.w/2,c=q.x+q.w/2;panel(cursor,a,lo,hi);panel(a,c,lo,q.lo);panel(a,c,q.hi,hi);const skip=linkFace&&fl===0&&c>linkCenter-linkHalf&&a<linkCenter+linkHalf;if(!skip){const col=main?C.oldFrame:C.frame,h=q.hi-q.lo,y=(q.hi+q.lo)/2;for(const x of[a,c])b.box(x,y,-.03,.09,h,.21,col,24);for(const v of[q.lo,q.hi])b.box(q.x,v,-.03,q.w,.09,.21,col,24);b.box(q.x,y,-.16,q.w-.11,h-.10,.045,C.glass,5);b.box(q.x,y,-.11,.055,h-.08,.065,col,24);b.box(q.x,q.hi-.67,-.11,q.w-.08,.065,.07,col,24);if(!q.door)b.box(q.x,q.lo-.06,.045,q.w+.18,.11,.35,C.stone,24);}cursor=c;}panel(cursor,width/2,lo,hi);
     }b.box(0,top+.11,.08,width+.14,.28,.44,C.stone,24);b.box(0,top+.30,.15,width+.38,.12,.60,C.wood,24);
     // The 2013 stone portal and 2026 canopy are separate provisional doors, not fused.
     if((main&&side===0)||(!main&&side===3)){group('entry-provisional',()=>{const w=main?5.2:3.3,d=main?1.25:.83;b.box(0,3.56,d/2-.05,w,.22,d,C.stone,24);if(main)for(const x of[-2.12,2.12])b.box(x,1.98,.30,.48,3.12,.62,C.stone,24);for(let k=0;k<4;k++){const h=.16*(4-k);b.box(0,h/2,.35+k*.33,w-.10,h,.34,C.stone,24);}if(!main)for(const x of[-1.34,1.34]){b.box(x,3.27,.17,.08,.16,.27,C.oldFrame,24);b.sphere(x,3.37,.28,.11,.11,.11,'#e4e1c6',24);}});}
    }));
   }
   group(s.name+'-ridge',()=>{const hx=(s.x1-s.x0)/2,hip=(s.z1-s.z0)*.44; b.box(cx,s.eave+s.rise+.10,cz,(hx-hip)*2,.21,.31,C.tile,25);for(let side=0;side<4;side++){for(let j=0;j<20;j++){const a=point(s,side,1,j/20),c=point(s,side,1,(j+1)/20);a[1]+=.10;c[1]+=.10;b.beam(a,c,.10,C.tile,25);}}});
  }
  group('low-connector-provisional',()=>{const x0=-15.1,x1=.78,z0=4.322,z1=12.962,cx=(x0+x1)/2,cz=(z0+z1)/2;
   b.box(cx,.29,cz,x1-x0,.58,z1-z0,C.stone,24);b.box(cx,3.44,cz,x1-x0,.26,z1-z0,C.stone,24);b.box(cx,3.59,cz,x1-x0-.15,.06,z1-z0-.15,'#83857a',24);
   for(const z of[z0+.18,z1-.18]){b.box(cx,3.25,z,x1-x0,.32,.33,C.stone,24);for(const x of[-14.82,-9.85,-4.87,.48])b.box(x,1.92,z,.28,2.68,.34,C.brick,30);}
  });
 });
 return{strategy:'building051-v46',roofBlocks:2,lowConnector:true,mainFloorsFitted:3,annexFloorsFitted:2,heightsMeasured:false,entryLocationsVerified:false,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building051={id:ID,render,world,local,parts,point};
})(YY);
