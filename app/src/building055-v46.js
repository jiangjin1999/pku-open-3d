/* Building 43: its own rectangular hipped envelope, six documented above-ground floors.
   Complete elevation, floor distribution under the roof and entry axis remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/444894330';
const O=[-302.201,629.865],R=Math.atan2(1.554,48.688),CO=Math.cos(R),SI=Math.sin(R),W=48.72,D=29.04,BASE=.72,TOP=20.77,EAVE=21.05,RISE=5.05;
const C={brick:'#99988f',band:'#a9a99d',white:'#dddcd0',frame:'#d8dcd4',glass:'#5a7779',dark:'#545c5b',stone:'#a8a296',roof:'#8a8d80',tile:'#919589',rail:'#b8c1bd'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const levels=[BASE,4.52,7.77,11.02,14.27,17.52,TOP];
function roofPoint(side,q,t){const hx=W/2,hz=D/2;return side%2?[hx+(side===1?1:-1)*(hx-hz*t),EAVE+RISE*t,hz+q*hz*(1-t)]:[hx+q*(hx-hz*t),EAVE+RISE*t,hz+(side===0?-1:1)*hz*(1-t)];}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'055-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const vertex=p=>{const w=world(p[0],p[2]);return[w[0],p[1],w[1]];};
 const roof=new G.Geometry(),tiles=new G.Geometry();
 for(let s=0;s<4;s++){roof.quad(...[roofPoint(s,-1,0),roofPoint(s,1,0),roofPoint(s,1,1),roofPoint(s,-1,1)].map(vertex));
  const across=s%2?D/2:W/2,inside=s%2?0:(W-D)/2;
  for(let u=-across+.14;u<across-.1;u+=.34){const end=Math.min(.999,(across-Math.abs(u)-.06)/(across-inside));if(end<=0)continue;
   const at=(offset,t)=>{const q=(u+offset)/(across+(inside-across)*t),p=roofPoint(s,q,t);p[1]+=.025+.025*Math.sqrt(Math.max(0,1-offset*offset/.0036));return vertex(p);};
   for(let k=0;k<4;k++){const a=-.06+k*.03,c=a+.03;tiles.quad(at(a,0),at(c,0),at(c,end),at(a,end));}
  }
 }tiles.detailWidth=.05;add('055-own-hip-roof',roof,C.roof,25,id);add('055-own-hip-tiles',tiles,C.tile,25,id);
 b.local(O[0],0,O[1],R,()=>{
  group('plinth',()=>b.box(W/2,BASE/2,D/2,W-1.0,BASE,D-1.0,C.stone,24));
  const textSign=(key,text,x,y,z,w,h)=>{const old=b.e.add;b.e.add=function(k,g,m,c,p,uv){return old.call(this,k,g,m,c,p,uv&&[uv[0]+8/4096,uv[1]+8/4096,uv[2]-16/4096,uv[3]-16/4096]);};try{b.sign('055-'+key,x,y,z,w,h,0,true);}finally{b.e.add=old;}const uv=b.signs.get('055-'+key+'_true');if(!uv)return;b.ctx.save();b.ctx.translate(uv[0]*4096,(1-uv[1]-uv[3])*4096);b.ctx.clearRect(0,0,512,128);b.ctx.fillStyle='#343834';b.ctx.textAlign='center';b.ctx.textBaseline='middle';b.ctx.font='600 82px "Songti SC",serif';
   if(key==='number43'){b.ctx.translate(256,67);b.ctx.scale(3.8,1);b.ctx.fillText(text,0,0,120);}
   else if(key==='icbc-2018'){const c=b.ctx;c.save();c.translate(77,65);c.scale(.46,1);c.font='700 90px Arial';c.fillText('ICBC',0,0);c.restore();c.save();c.translate(340,65);c.scale(.50,1);c.font='600 90px "Songti SC",serif';c.fillText('中国工商银行',0,0);c.restore();c.strokeStyle='#a53230';c.lineWidth=3.8;c.beginPath();c.ellipse(166,64,20,48,0,0,Math.PI*2);c.stroke();c.lineWidth=3;c.strokeRect(155,40,22,48);c.beginPath();c.moveTo(155,52);c.lineTo(164,52);c.lineTo(164,77);c.lineTo(155,77);c.moveTo(177,52);c.lineTo(168,52);c.lineTo(168,77);c.lineTo(177,77);c.stroke();}
   else b.ctx.fillText(text,256,67,480);b.ctx.restore();};
  for(let side=0;side<4;side++){const width=side%2?D-1.10:W-1.10,x=side===1?W-.55:side===3?.55:W/2,z=side===0?.55:side===2?D-.55:D/2,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side];
   b.local(x,0,z,rot,()=>group('face-'+side,()=>{
    const panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.035,c-a,hi-lo,.12,C.brick,30);};
    for(let fl=0;fl<6;fl++){const lo=levels[fl],hi=levels[fl+1],count=side%2?6:12,spacing=(width-3.15)/count;
     let openings=Array.from({length:count},(_,i)=>({x:(i-(count-1)/2)*spacing,w:side%2?1.9:2.18,lo:lo+.80,hi:hi-.48}));
     if(fl===0&&side===0)openings=openings.filter(q=>Math.abs(q.x)>6.1).concat({x:0,w:10.4,lo:BASE,hi:3.65,door:true,bank:true});
     if(fl===0&&side===1)openings=openings.filter(q=>Math.abs(q.x)>4.1).concat({x:0,w:4.35,lo:BASE,hi:3.80,door:true});
     if(fl===0&&side===2)openings=openings.filter(q=>Math.abs(q.x)>3.1).concat({x:0,w:3.5,lo:BASE,hi:3.60,door:true});
     openings.sort((a,c)=>a.x-c.x);let cursor=-width/2;
     for(const q of openings){const a=q.x-q.w/2,c=q.x+q.w/2,h=q.hi-q.lo,y=(q.hi+q.lo)/2;
      panel(cursor,a,lo,hi);panel(a,c,lo,q.lo);panel(a,c,q.hi,hi);
      const frame=q.door&&side===1?C.dark:C.frame;
      group('opening-'+fl,()=>{b.box(q.x,y,-.13,q.w-.12,h-.12,.04,C.glass,5);for(const u of[a,c])b.box(u,y,0,q.bank?.14:.085,h,.24,frame,24);for(const v of[q.lo,q.hi])b.box(q.x,v,0,q.w,.085,.24,frame,24);
       const cols=q.bank?8:q.door?4:2;for(let i=1;i<cols;i++)b.box(a+q.w*i/cols,y,-.06,q.bank?.12:.065,h-.08,.10,frame,24);b.box(q.x,q.door?1.82:q.hi-.62,-.06,q.w-.08,.065,.10,frame,24);
       if(!q.door){b.box(q.x,q.lo-.06,.10,q.w+.22,.12,.38,C.white,24);if(fl>0&&(side%2||Math.abs(q.x)>7.8))b.box(q.x,lo+.34,.015,q.w+.40,.70,.22,C.white,24);}
      });cursor=c;
     }panel(cursor,width/2,lo,hi);
     // Restrained bands come from this building's grey-brick entry photos; upper repetition is fitted.
     if(fl>0)for(const dy of[-.12,.06])b.box(0,lo+dy,.045,width,.07,.10,C.band,30);
    }
    b.box(0,TOP+.05,.10,width+.25,.18,.50,C.white,24);b.box(0,EAVE-.05,.19,width+.54,.12,.74,C.dark,24);
    if(side===0)group('north-bank-2018',()=>{b.box(0,4.27,.34,11.15,1.50,.36,C.white,24);b.box(0,3.65,.535,10.55,.05,.045,'#a83935',24);textSign('icbc-2018','ICBC　中国工商银行',0,4.30,.535,10.40,1.03);
     for(let k=0;k<3;k++){const h=BASE-k*.24;b.box(0,h/2,.64+k*.34,10.6,h,.36,C.stone,24);}b.sphere(0,6.15,.20,.32,.24,.07,C.white,24,0,true);textSign('number43','43',0,6.16,.29,.50,.35);
    });
    if(side===2)group('south-entry-position-fitted',()=>{for(let k=0;k<4;k++){const h=BASE-k*.18;b.box(0,h/2,.33+k*.34,4.1,h,.35,C.stone,24);}});
    if(side===1)group('east-entry-photo-association-provisional',()=>{
     b.box(0,4.20,1.02,7.55,.30,2.55,C.dark,24);b.box(0,4.015,1.02,7.20,.06,2.30,'#858c87',24);
     b.box(.40,BASE/2,.83,6.4,BASE,1.64,C.stone,24);
     for(let k=0;k<4;k++){const h=BASE-k*.18;b.box(-.35,h/2,1.78+k*.34,5.6,h,.35,C.stone,24);}
     // Two local flights are kept open; dimensions and exact stair/ramp configuration are provisional.
     const ramp=(x0,x1,z0,z1,h0,h1)=>{const g=new G.Geometry();g.quad([x0,h0,z0],[x1,h1,z0],[x1,h1,z1],[x0,h0,z1]);g.quad([x0,0,z0],[x1,0,z0],[x1,h1,z0],[x0,h0,z0]);g.quad([x1,0,z1],[x0,0,z1],[x0,h0,z1],[x1,h1,z1]);b.mesh('055-ramp-'+x0+'-'+z0,g,0,0,0,1,1,1,C.stone,24);};
     ramp(3.3,9.3,.20,1.50,.72,.36);ramp(3.3,9.3,1.96,3.26,0,.36);b.box(9.94,.18,1.73,1.28,.36,3.06,C.stone,24);
     const rail=(points)=>{for(let i=0;i<points.length-1;i++){const a=points[i],c=points[i+1],steps=Math.ceil(Math.hypot(c[0]-a[0],c[2]-a[2])/.55);b.beam(a.map((v,k)=>k===1?v+1.0:v),c.map((v,k)=>k===1?v+1.0:v),.022,C.rail,9);for(let j=0;j<=steps;j++){const p=a.map((v,k)=>v+(c[k]-v)*j/steps);b.beam(p,[p[0],p[1]+1,p[2]],.017,C.rail,9);}}};
     rail([[3.3,.72,.20],[9.3,.36,.20],[10.56,.36,.20],[10.56,.36,3.26],[9.3,.36,3.26],[3.3,0,3.26]]);rail([[3.3,.72,1.50],[9.3,.36,1.50]]);rail([[3.3,0,1.96],[9.3,.36,1.96]]);
    });
   }));
  }
  group('roof-ridges',()=>{b.box(W/2,EAVE+RISE+.075,D/2,W-D,.15,.25,C.tile,25);for(let s=0;s<4;s++){const a=roofPoint(s,1,0),c=roofPoint(s,1,1);a[1]+=.065;c[1]+=.065;b.beam(a,c,.075,C.tile,25);}});
  group('satellite-small-vents-fitted',()=>{for(const [x,z]of[[17.2,6.4],[31.0,6.4],[6.5,18.5],[18.0,24.0],[31.0,24.0],[42.2,18.5]]){const y=EAVE+RISE*Math.min(x,W-x,z,D-z)/(D/2);b.box(x,y+.32,z,.40,.65,.42,C.dark,24);b.box(x,y+.65,z,.60,.08,.62,C.white,24);}});
 });
 return{strategy:'building055-v46',aboveGroundFloors:6,documentedBasements:3,wholeFacadeVerified:false,floorDistributionVerified:false,heightMeasured:false,eastEntryPhotoConfirmed:false,northBankHistorical:true,sourceOutlinePreserved:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building055={id:ID,render,world,local,W,D,BASE,TOP,EAVE,RISE,levels,roofPoint};
})(YY);
