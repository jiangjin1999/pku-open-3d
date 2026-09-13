/* Old Biology Building: its south-open court, alternating front windows and four-column stone porch.
   The college's support booklet shows a red/gold xieshan gable and locates a balcony on the middle second floor.
   The porch/balcony is provisionally on the south front; full elevations, dimensions and hidden gables are not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/445012607';
const O=[96.25,65.788],R=Math.atan2(3.620,92.808),CO=Math.cos(R),SI=Math.sin(R);
const H={base:.68,second:4.50,third:8.02,wall:11.64,eave:12.08,top:18.42};
const C={brick:'#a1a39a',stone:'#c5c7ba',panel:'#cdd0c0',shadow:'#b6bdad',red:'#a24740',glass:'#718a86',roof:'#7b837b',tile:'#8a9386',green:'#3c7968',blue:'#5d9c90',gold:'#c8b379',metal:'#78827a'};
const parts=[
 {name:'main',x:19.4,z:-.2,r:0,w:52.6,d:20.0,eave:12.08,rise:4.95,cut:4.20,g:3.05,inset:.75},
 {name:'west',x:-.60,z:35.25,r:Math.PI/2,w:35.9,d:19.7,eave:12.05,rise:4.86,cut:4.45,g:3.04,inset:.78},
 {name:'east',x:72.50,z:34.60,r:Math.PI/2,w:35.30,d:21.00,eave:12.05,rise:5.15,cut:4.35,g:3.26,inset:.80}
];
const joins=[{name:'west',a:17.95,c:20.35},{name:'east',a:71.10,c:73.75}];
const porch={x:45.7,z:19.05,w:16.1,d:4.0,columns:[-7.25,-2.76,2.76,7.25],columnWidth:.98,deck:H.second,ramp:{start:-16.2,end:-8.05,near:1.0,far:2.7}};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const roofY=(p,z)=>{const t=Math.max(0,1-Math.abs(z-p.d/2)/(p.d/2));return p.eave+p.rise*Math.pow(t,1.42)+.20*Math.pow(1-t,8);};
const corner=(p,x,z)=>.30*Math.pow(Math.max(0,1-Math.min(x,p.w-x)/2.7),2)*Math.pow(Math.max(0,1-Math.min(z,p.d-z)/2.7),2);
function slopes(p){const a=p.cut,c=p.w-a,n=p.g,s=p.d-n,m=p.d/2,up=fn=>q=>fn(q)+corner(p,q[0],q[1]);return[
 {name:'north',poly:[[0,0],[p.w,0],[c,n],[c,m],[a,m],[a,n]],axis:1,y:up(q=>roofY(p,q[1]))},
 {name:'south',poly:[[a,m],[c,m],[c,s],[p.w,p.d],[0,p.d],[a,s]],axis:1,y:up(q=>roofY(p,q[1]))},
 {name:'end0',poly:[[0,0],[a,n],[a,s],[0,p.d]],axis:0,y:up(q=>roofY(p,q[0]/a*n))},
 {name:'end1',poly:[[c,n],[p.w,0],[p.w,p.d],[c,s]],axis:0,y:up(q=>roofY(p,(p.w-q[0])/a*n))}
 ];}
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,ci=greater?c[axis]>=k:c[axis]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
function rounded(w,h,r){const p=[];for(const[cx,cy,a]of[[w/2-r,h/2-r,0],[-w/2+r,h/2-r,Math.PI/2],[-w/2+r,-h/2+r,Math.PI],[w/2-r,-h/2+r,Math.PI*1.5]])for(let k=0;k<=8;k++){const t=a+k*Math.PI/16;p.push([cx+r*Math.cos(t),cy+r*Math.sin(t),0]);}const g=new G.Geometry();for(let k=0;k<p.length;k++)g.tri([0,0,0],p[k],p[(k+1)%p.length]);return g;}
function bays(width,alternating,count){const ws=Array.from({length:count},(_,i)=>alternating?(i%2?3.40:1.68):3.28),gap=(width-ws.reduce((s,w)=>s+w,0))/(count+1);let cursor=-width/2+gap;return ws.map(w=>{const x=cursor+w/2;cursor+=w+gap;return{x,w};});}
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'058-'+name+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
 function roof(p){
  for(const s of slopes(p)){const mesh=new G.Geometry(),tiles=new G.Geometry(),other=1-s.axis,lo=Math.min(...s.poly.map(q=>q[s.axis])),hi=Math.max(...s.poly.map(q=>q[s.axis])),left=Math.min(...s.poly.map(q=>q[other])),right=Math.max(...s.poly.map(q=>q[other]));
   const emit=(g,poly,dy)=>{for(let k=1;k<poly.length-1;k++)g.tri(...[poly[0],poly[k],poly[k+1]].map(q=>[q[0],s.y(q)+(typeof dy==='function'?dy(q):dy),q[1]]));};
   for(let j=0;j<30;j++){const a=lo+(hi-lo)*j/30,c=lo+(hi-lo)*(j+1)/30;emit(mesh,clip(clip(s.poly,s.axis,a,true),s.axis,c,false),0);
    for(let u=left+.13;u<right;u+=.34)for(let k=0;k<4;k++){let poly=s.poly;const x=u-.070+k*.035;for(const[axis,v,more]of[[other,x,true],[other,x+.035,false],[s.axis,a,true],[s.axis,c,false]])if(poly.length)poly=clip(poly,axis,v,more);emit(tiles,poly,q=>.014+.027*Math.sqrt(Math.max(0,1-((q[other]-u)/.070)**2)));}
   }tiles.detailWidth=.035;b.mesh('own-roof-'+s.name,mesh,0,0,0,1,1,1,C.roof,25);b.mesh('own-tiles-'+s.name,tiles,0,0,0,1,1,1,C.tile,25);
  }
  const base=roofY(p,p.g),m=p.d/2,zs=p.d-p.g,peak=roofY(p,m);
  for(const x of[p.cut,p.w-p.cut]){const sign=x<p.w/2?-1:1,fill=new G.Geometry(),edge=new G.Geometry();
   for(let k=0;k<36;k++){const a=p.g+(zs-p.g)*k/36,c=p.g+(zs-p.g)*(k+1)/36,ya=roofY(p,a),yc=roofY(p,c);fill.quad([x,base,a],[x,base,c],[x,yc,c],[x,ya,a]);for(const xx of[x-.10,x+.10])edge.quad([xx,ya-.32,a],[xx,yc-.32,c],[xx,yc+.055,c],[xx,ya+.055,a]);}
   b.mesh('red-gable-'+x,fill,0,0,0,1,1,1,'#b66b5c',24);b.mesh('gable-stone-border-'+x,edge,0,0,0,1,1,1,C.tile,25);b.box(x,base+.055,m,.26,.16,zs-p.g+.18,C.stone,24);
   // The booklet shows a tapering gold branching motif, with red space around it, not a white vent.
   const xx=x+sign*.12,stroke=pts=>{for(let k=1;k<pts.length;k++)if([pts[k-1],pts[k]].every(q=>q[0]>base+.13&&q[0]<roofY(p,q[1])-.38))b.beam([xx,...pts[k-1]],[xx,...pts[k]],.024,C.gold,24);};
   const bezier=(a,c,d,e)=>Array.from({length:13},(_,k)=>{const t=k/12,u=1-t;return a.map((v,j)=>u*u*u*v+3*u*u*t*c[j]+3*u*t*t*d[j]+t*t*t*e[j]);});
   for(let row=0;row<5;row++){const yy=base+.27+row*.49,cols=4-row;for(let col=-cols;col<=cols;col++){const zz=m+col*.63;for(const flip of[-1,1]){
    const q=(h,z)=>[yy+h,zz+z*flip];
    stroke(bezier(q(0,0),q(.16,.05),q(.28,.27),q(.44,.15)));
    stroke(bezier(q(.44,.15),q(.56,.06),q(.63,.14),q(.70,.12)));
    stroke(bezier(q(.70,.12),q(.58,.30),q(.36,.28),q(.30,.14)));
    stroke(bezier(q(.30,.14),q(.20,.05),q(.17,.18),q(.07,.20)));
   }}}
   stroke([[base+.2,m],[peak-.44,m]]);
   for(const side of[-1,1])stroke([[base+.25,m+side*(zs-p.g)*.32],[peak-.49,m],[base+.25,m-side*(zs-p.g)*.32]]);
   // Curved ridge terminals follow the observed hooked silhouette; sculptural detail is fitted.
   const yy=peak+.13;b.box(x,yy,m,.32,.29,.36,C.tile,25);
   const hook=new G.Geometry(),outline=[[0,0],[-sign*.25,.22],[-sign*.27,.67],[-sign*.08,.93],[sign*.19,1.02],[sign*.42,.89],[sign*.43,.69],[sign*.22,.60],[sign*.14,.43],[sign*.37,.25],[sign*.43,0]];
   for(let k=1;k<outline.length-1;k++)for(const zz of[-.19,.19])hook.tri([outline[0][0],outline[0][1],zz],[outline[k][0],outline[k][1],zz],[outline[k+1][0],outline[k+1][1],zz]);for(let k=0;k<outline.length;k++){const a=outline[k],c=outline[(k+1)%outline.length];hook.quad([a[0],a[1],-.19],[c[0],c[1],-.19],[c[0],c[1],.19],[a[0],a[1],.19]);}b.mesh('ridge-hook-'+x,hook,x,peak+.16,m,1,1,1,C.roof,25);
  }
  b.box(p.w/2,peak+.12,m,p.w-2*p.cut+.25,.25,.34,C.tile,25);
  for(const east of[false,true])for(const south of[false,true])for(let k=0;k<24;k++){const t=k/24,tt=(k+1)/24,x=east?p.w-p.cut*t:p.cut*t,xx=east?p.w-p.cut*tt:p.cut*tt,z=south?p.d-p.g*t:p.g*t,zz=south?p.d-p.g*tt:p.g*tt;b.beam([x,roofY(p,z)+corner(p,x,z)+.065,z],[xx,roofY(p,zz)+corner(p,xx,zz)+.065,zz],.078,C.tile,25);}
 }
 function paintedEave(width,eave){
  b.box(0,H.wall-.13,.17,width+.20,.27,.54,C.red,24);b.box(0,eave-.43,.28,width+.42,.18,.73,C.green,24);
  for(let x=-width/2+.62;x<width/2-.30;x+=1.50){b.box(x,eave-.63,.31,.30,.24,.52,C.green,24);b.box(x,eave-.43,.46,.62,.16,.73,C.blue,24);for(const side of[-1,1]){b.beam([x+side*.09,eave-.66,.48],[x+side*.30,eave-.35,.76],.065,C.gold,24);b.box(x+side*.23,eave-.43,.80,.15,.065,.05,C.gold,24);}}
  for(let x=-width/2-.23;x<width/2+.24;x+=.30){b.box(x,eave-.14,.45,.15,.15,.99,C.red,24);b.box(x,eave-.14,.95,.16,.16,.065,C.gold,24);b.box(x,eave-.14,.99,.098,.096,.025,C.blue,24);}
 }
 function facade(p){const i=p.inset;
  b.box(p.w/2,H.base/2,p.d/2,p.w-2*i+.20,H.base,p.d-2*i+.20,C.stone,24);
  for(let side=0;side<4;side++){const long=side%2===0,width=(long?p.w:p.d)-2*i,ox=side===1?p.w-i:side===3?i:p.w/2,oz=side===0?i:side===2?p.d-i:p.d/2,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side],front=p.name==='main'&&side===2,count=long?(p.name==='main'?(front?15:13):7):3,positions=bays(width,front,count);
   b.local(ox,0,oz,rot,()=>group('face-'+side,()=>{
    const wall=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.10,c-a,hi-lo,.22,C.brick,30);};
    for(let fl=0;fl<3;fl++){const lo=[H.base,H.second,H.third][fl],hi=[H.second,H.third,H.wall][fl],bottom=[1.30,5.35,8.94][fl],top=[3.95,7.57,11.17][fl];let cursor=-width/2;
     for(let k=0;k<count;k++){const q=positions[k],door=front&&k===7&&fl<2,w=door&&fl===0?3.10:q.w,a=q.x-w/2,c=q.x+w/2,low=door?lo:bottom,high=door?Math.min(top,lo+3.06):top,mid=(low+high)/2;
      wall(cursor,a,lo,hi);wall(a,c,lo,low);wall(a,c,high,hi);
      group('window-'+fl,()=>{b.box(q.x,mid,-.17,w-.12,high-low-.12,.045,C.glass,5);for(const x of[a,c])b.box(x,mid,-.025,.085,high-low,.20,C.red,24);for(const y of[low,high])b.box(q.x,y,-.025,w,.085,.20,C.red,24);const trans=high-.55;b.box(q.x,trans,-.01,w-.1,.075,.14,C.red,24);
       const xs=door||w<2?[q.x]:[q.x-w*.25,q.x+w*.25];for(const x of xs)b.box(x,(low+trans)/2,-.015,.073,trans-low,.12,C.red,24);b.box(q.x,(trans+high)/2,-.015,.065,high-trans,.12,C.red,24);if(door){for(const x of[q.x-.14,q.x+.14])b.box(x,low+1.22,.09,.028,.45,.05,C.metal,9);}else b.box(q.x,low-.075,.07,w+.22,.15,.33,C.stone,24);
      });
      if(fl>0&&!door)group('single-rounded-panel',()=>{const yy=bottom-.85;b.box(q.x,yy,.025,w+.20,1.41,.13,C.panel,24);b.mesh('panel-rim-'+w,b.geo('058-panel-rim-'+w,()=>rounded(w+.01,1.22,.19)),q.x,yy,.105,1,1,1,C.shadow,24);b.mesh('panel-inset-'+w,b.geo('058-panel-inset-'+w,()=>rounded(w-.09,1.13,.17)),q.x,yy,.113,1,1,1,C.panel,24);});
      cursor=c;
     }wall(cursor,width/2,lo,hi);
    }
    // Pilasters remain grey brick; they do not become broad beige strips between every window.
    for(let k=0;k<count-1;k++){const a=positions[k],c=positions[k+1],x=(a.x+a.w/2+c.x-c.w/2)/2,gap=c.x-c.w/2-a.x-a.w/2;b.box(x,(H.base+H.wall)/2,.032,Math.min(.80,gap*.86),H.wall-H.base,.20,C.brick,30);}
    b.box(0,H.base+.08,.075,width,.16,.32,C.stone,24);paintedEave(width,p.eave);
   }));
  }
 }
 function entry(){b.local(porch.x,0,porch.z,0,()=>group('south-porch-provisional',()=>{
  const w=porch.w,d=porch.d,pl=H.base;
  b.box(0,pl/2,d/2,w,pl,d,C.stone,24);
  for(const x of porch.columns){b.box(x,(pl+H.second-.27)/2,d-.58,porch.columnWidth,H.second-.27-pl,porch.columnWidth,C.stone,24);for(let y=pl+.62;y<H.second-.45;y+=.62)b.box(x,y,d-.075,porch.columnWidth+.005,.018,.012,'#a8afa2',24);}
  // Solid slab over the open three-bay portico is the second-floor balcony, not an extra storey.
  b.box(0,H.second-.16,d/2,w+.26,.32,d+.12,C.stone,24);
  for(const x of[-5.1,-1.7,1.7,5.1])b.cyl(x,H.second-.335,2.15,.19,.025,'#dadbcd',24,1,24);
  b.box(0,H.second+.014,d/2,w-.30,.025,d-.30,'#b5bbae',24);
  for(const x of[-w/2,w/2])b.box(x,H.second+.63,d/2,.23,1.25,d,C.stone,24);
  b.box(0,H.second+.63,d-.01,w,1.25,.24,C.stone,24);b.box(0,H.second+1.31,d-.01,w+.18,.15,.36,C.stone,24);
  for(const x of porch.columns){const g=b.geo('058-stone-fascia-bracket',()=>{const g=new G.Geometry(),poly=[[-.20,0],[.20,0],[.18,-.23],[.12,-.40],[-.03,-.48],[-.17,-.35]];for(let k=1;k<poly.length-1;k++)for(const z of[-.18,.18])g.tri([poly[0][0],poly[0][1],z],[poly[k][0],poly[k][1],z],[poly[k+1][0],poly[k+1][1],z]);for(let k=0;k<poly.length;k++){const a=poly[k],c=poly[(k+1)%poly.length];g.quad([a[0],a[1],-.18],[c[0],c[1],-.18],[c[0],c[1],.18],[a[0],a[1],.18]);}return g;});b.mesh('stone-fascia-bracket',g,x,H.second+.13,d+.18,1,1,1,C.stone,24);}
  for(let k=0;k<4;k++){const h=pl-k*.17;b.box(0,h/2,d+.20+k*.36,w-.36,h,.38,C.stone,24);}
  const {start,end,near,far}=porch.ramp,ramp=new G.Geometry(),rampY=x=>.03+(pl-.03)*(x-start)/(end-start);
  ramp.quad([start,.03,near],[end,pl,near],[end,pl,far],[start,.03,far]);for(const z of[near,far])ramp.quad([start,0,z],[end,0,z],[end,pl,z],[start,.03,z]);ramp.quad([end,0,near],[end,0,far],[end,pl,far],[end,pl,near]);b.mesh('west-along-wall-ramp',ramp,0,0,0,1,1,1,C.stone,24);
  // Rails run beside the slope and stop at the porch opening, leaving the ramp mouth clear.
  for(const z of[near,far]){for(let k=0;k<=7;k++){const x=start+(end-start)*k/7,y=rampY(x);b.box(x,y+.52,z,.045,1.04,.045,C.metal,9);}for(const h of[.35,.70,1.02])b.beam([start,rampY(start)+h,z],[end,rampY(end)+h,z],.028,C.metal,9);}
  // A narrow level link avoids a crack between the ramp end and porch plinth.
  b.box(-w/2-.05,pl/2,(near+far)/2,.20,pl,far-near,C.stone,24);
  const old=b.e.add;b.e.add=function(k,g,m,c,p,uv){return old.call(this,k,g,m,c,p,uv&&[uv[0]+8/4096,uv[1]+8/4096,uv[2]-16/4096,uv[3]-16/4096]);};try{b.sign('058-life-sciences',0,H.second+.70,d+.132,9.4,1.05,0,true);}finally{b.e.add=old;}
  const uv=b.signs.get('058-life-sciences_true');if(uv){b.ctx.save();b.ctx.translate(uv[0]*4096,(1-uv[1]-uv[3])*4096);b.ctx.fillStyle='#c6955e';b.ctx.fillRect(0,0,512,128);b.ctx.strokeStyle='#a84b3f';b.ctx.fillStyle='#a54436';b.ctx.lineWidth=2.2;b.ctx.textAlign='center';
   // Correct the atlas cell's horizontal stretch so the fitted round seal stays round on the plaque.
   b.ctx.save();b.ctx.translate(50,64);b.ctx.scale(4/(9.4/1.05),1);for(const rad of[45,35]){b.ctx.beginPath();b.ctx.arc(0,0,rad,0,Math.PI*2);b.ctx.stroke();}
   const letters='PEKING UNIVERSITY';b.ctx.font='600 8px Arial';for(let k=0;k<letters.length;k++){const a=-Math.PI*.93+k/(letters.length-1)*Math.PI*.86;b.ctx.save();b.ctx.rotate(a);b.ctx.translate(0,-40);b.ctx.fillText(letters[k],0,0);b.ctx.restore();}
   b.ctx.font='600 39px "Songti SC",serif';b.ctx.fillText('北',0,-7);b.ctx.font='600 36px "Songti SC",serif';b.ctx.fillText('大',0,20);b.ctx.font='600 9px Arial';b.ctx.fillText('1898',0,39);b.ctx.restore();
   b.ctx.fillStyle='#343f3b';b.ctx.font='600 56px "Kaiti SC","Songti SC",serif';b.ctx.fillText('生命科学学院',298,68,382);b.ctx.restore();}
 }));}
 b.local(O[0],0,O[1],R,()=>{
  for(const p of parts)b.local(p.x,0,p.z,p.r,()=>group(p.name,()=>{roof(p);facade(p);}));
  for(const q of joins)group('covered-join-'+q.name,()=>{const w=q.c-q.a,x=(q.a+q.c)/2;for(const z of[.65,18.45])b.box(x,(H.base+H.wall)/2,z,w,H.wall-H.base,.24,C.brick,30);b.box(x,H.base/2,9.55,w,H.base,18.08,C.stone,24);b.box(x,H.wall+.05,9.55,w,.12,18.08,C.roof,25);});
  entry();
 });
 return{strategy:'building058-v46',floors:3,southOpenCourt:true,roofVolumes:3,xieshanPhotographed:true,porchColumns:4,porchBays:3,alongWallRampCount:1,centralSecondFloorBalcony:true,balconyDirectionVerified:false,entryDirectionVerified:false,fullFacadeVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building058={id:ID,render,world,local,parts,joins,H,porch,roofY,slopes,bays};
})(YY);
