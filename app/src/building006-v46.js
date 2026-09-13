/* Jin Guang / Sinar Mas Life Sciences: photo-led gallery and separate pitched roof bars. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/13059308';
const R=Math.atan2(1.632,46.955),CO=Math.cos(R),SI=Math.sin(R),O=[354.793,68];
const C={brick:'#777a76',glass:'#94adb4',frame:'#d2d9d3',beam:'#e1e2d7',roof:'#626a69',red:'#8c5756',metal:'#b9c4c3'};
const H={wall:15.2,gallery:18.5,eave:18.9,ridge:25};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function block(name,box,base,top,color=C.brick){const g=new G.Geometry(),cap=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++)cap.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));}add('006-'+name,g,color,24,id);add('006-'+name+'-cap',cap,C.roof,22,id);}
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(len));}
 function win(x,y,w=2.65,h=1.7,z=.11){b.box(x,y,z,w+.16,h+.16,.16,C.frame,29);b.box(x,y,z+.105,w,h,.045,C.glass,28);b.box(x,y,z+.14,.065,h,.045,C.frame,29);b.box(x,y-.14,z+.14,w,.055,.045,C.frame,29);}
 // Carve the south vestibule before adding its recessed glazed back wall.
 block('four-storey-source',[-3,-3,68,62],7.8,H.wall);
 block('entrance-west-solid',[-3,-3,4,62],0,7.8);
 block('entrance-east-solid',[24,-3,68,62],0,7.8);
 block('entrance-recess-back',[4,-3,24,54.8],0,7.8);
 // Fifth-floor accommodation is inset; the outer strip is a real open gallery.
 block('north-fifth',[2.7,3,62,27.7],H.wall,H.gallery);
 block('west-fifth',[2.7,27.7,9.7,50.1],H.wall,H.gallery);
 block('east-fifth',[35.65,27.7,47.7,50.1],H.wall,H.gallery);
 block('south-fifth',[2.7,50.1,47.7,55.25],H.wall,H.gallery);
 const pg=F.polygons(f.geometry)[0];
 for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive===(ri===0))[a,c]=[c,a];const la=local(a),lc=local(c),south=ri===0&&la[1]>58&&lc[1]>58,east=ri===0&&la[0]>50&&lc[0]>50&&Math.abs(la[1]-lc[1])>30;
  boundary(a,c,len=>{if(len<3)return;const n=Math.max(1,Math.round(len/(south?3.65:4.4))),step=(len-1.3)/n;
   // This edge starts at building-local u=4.456, not u=0. Convert the shared recess
   // limits into edge distance before clipping windows, stone joints and floor bands.
   const edgeU=x=>la[0]+(lc[0]-la[0])*x/len;
   const cut=south?[4,24].map(u=>(u-la[0])*len/(lc[0]-la[0])).sort((a,b)=>a-b):[];
   const solidSegments=south?[[0,Math.max(0,Math.min(len,cut[0]))],[Math.max(0,Math.min(len,cut[1])),len]].filter(p=>p[1]-p[0]>1e-6):[[0,len]];
   for(let j=0;j<4;j++){for(let k=0;k<n;k++){
    const x=.65+(k+.5)*step;
    const w=Math.min(2.65,step-.5);
    if(south&&j<2&&edgeU(x+w/2+.08)>4&&edgeU(x-w/2-.08)<24)continue;
    // The two upper storeys each have ONE 3-by-2 small-window group north
    // of the name wall. x<8 covers two bays; repeating it in bay 0 put a
    // second, unsupported group across the lettering near the south corner.
    if(east&&x<8){if(j>1&&k===1)for(const sx of [-.95,0,.95])for(const yy of [-.48,.48])win(x+sx,1.8+j*3.8+yy,.45,.43);continue;}
    win(x,1.8+j*3.8,Math.min(2.65,step-.5),1.75);
   }if(ri===0){const yy=3.8*(j+1)-.2;if(south&&yy<7.8){for(const [lo,hi] of solidSegments)b.box((lo+hi)/2,yy,.14,hi-lo,.12,.44,C.frame,24);}else b.box(len/2,yy,.14,len-.2,.12,.44,C.frame,24);}}
   // Narrow horizontal joints keep the material distinct from plain concrete.
   for(let j=1;j<30;j++){if(south&&j*.5<7.8){for(const [lo,hi] of solidSegments)b.box((lo+hi)/2,j*.5,.012,hi-lo,.011,.017,'#858782',24);}else b.box(len/2,j*.50,.012,len-.05,.011,.017,'#858782',24);}
   if(east&&b.lettering)b.lettering('金光生命科学大楼',3.5,12.8,.26,6.1,.55,0,'#e4e8df');
  });
 }}
 function gallery(u,v,angle,len,inset=3.0){frame(u,v,angle,()=>{
  for(const y of [15.55,15.95,16.35])b.box(len/2,y,.12,len,.06,.075,C.frame,29);
  const n=Math.max(1,Math.round(len/5.5));for(let i=0;i<=n;i++){const x=i*len/n;b.box(x,15.95,.12,.055,.88,.085,C.frame,29);b.box(x,16.85,-.12,.43,3.3,.48,C.brick,24);}

 });}
 gallery(1,58.403,0,50.1,3.15);
 gallery(-.45,5,-Math.PI/2,45,3.15);
 frame(2.7,5,-Math.PI/2,()=>{for(let i=0;i<9;i++)win(2.3+i*4.8,16.85,2.9,1.95,.08);});
 boundary(pg[0][8],pg[0][9],len=>{for(const yy of [15.55,15.95,16.35])b.box(len/2,yy,.12,len,.06,.075,C.frame,29);for(let i=0;i<=10;i++)b.box(i*len/10,16.85,-.1,.43,3.3,.48,C.brick,24);});
 frame(61.5,3,Math.PI,()=>{for(let i=0;i<11;i++)win(2.5+i*4.8,16.85,2.9,1.95,.08);});
 frame(2.7,55.25,0,()=>{for(let i=0;i<6;i++)win(2.5+i*4.8,16.85,3.6,1.95,.08);});
 // East source edge tapers very slightly; use exact boundary for the outer railing.
 boundary(pg[0][3],pg[0][4],len=>{for(const y of [15.55,15.95,16.35])b.box(len/2,y,.12,len,.06,.075,C.frame,29);for(let i=0;i<=8;i++){b.box(i*len/8,15.95,.12,.055,.88,.085,C.frame,29);b.box(i*len/8,16.85,-.16,.43,3.3,.48,C.brick,24);}});
 frame(47.7,55.1,Math.PI/2,()=>{for(let i=0;i<7;i++)win(2.5+i*4.8,16.85,3.1,1.95,.08);});
 const roofSpecs=[];
 function slope(name,axis,start,end,eave,ridge,eaveY,ridgeY,glazed){roofSpecs.push({name,axis,start,end,eave,ridge,eaveY,ridgeY,glazed});}
 function half(poly,fn,positive){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],fa=fn(a),fb=fn(b),ai=positive?fa>=-1e-9:fa<=1e-9,bi=positive?fb>=-1e-9:fb<=1e-9;if(ai)out.push(a);if(ai!==bi){const t=fa/(fa-fb);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
 function roofHeight(r,p){return r.eaveY+(r.ridgeY-r.eaveY)*((r.axis==='u'?p[1]:p[0])-r.eave)/(r.ridge-r.eave);}
 function visible(poly,self){let parts=[poly];for(const other of roofSpecs){if(other===self)continue;const axis=other.axis==='u'?0:1,t=1-axis,lo=Math.min(other.eave,other.ridge),hi=Math.max(other.eave,other.ridge),planes=[p=>p[axis]-other.start,p=>other.end-p[axis],p=>p[t]-lo,p=>hi-p[t],p=>roofHeight(other,p)-roofHeight(self,p)];
   const next=[];for(const original of parts){let rest=original;for(const fn of planes){if(rest.length<3)break;const values=rest.map(fn);if(values.every(v=>Math.abs(v)<1e-8)){continue;}const outside=half(rest,fn,false);if(outside.length>=3)next.push(outside);rest=half(rest,fn,true);} }parts=next;if(!parts.length)break;}return parts;}
 function renderSlope(spec){const {name,axis,start,end,eave,ridge,eaveY,ridgeY,glazed}=spec;
  const to=(s,t,y)=>axis==='u'?vertex(s,y,t):vertex(t,y,s),h=t=>eaveY+(ridgeY-eaveY)*(t-eave)/(ridge-eave),g=new G.Geometry();
  function emit(s0,s1,t0,t1,delta,geo){const uv=(s,t)=>axis==='u'?[s,t]:[t,s];for(let polygon of visible([uv(s0,t0),uv(s1,t0),uv(s1,t1),uv(s0,t1)],spec)){if(F.area([...polygon,polygon[0]])>0)polygon=polygon.slice().reverse();for(let i=1;i<polygon.length-1;i++)geo.tri(...[polygon[0],polygon[i],polygon[i+1]].map(p=>vertex(p[0],roofHeight(spec,p)+delta,p[1])));}}
  emit(start,end,eave,ridge,0,g);add('006-'+name,g,C.roof,22,id);
  const strips=new G.Geometry(),panes=new G.Geometry(),count=Math.max(2,Math.round((end-start)/3.75));
  function tile(s0,s1,t0,t1,delta,geo){emit(s0,s1,t0,t1,delta,geo);}
  // Raised standing seams and four-pane vertical rooflights follow the actual slope plane.
  for(let s=start+.3;s<end;s+=.45)tile(s-.018,s+.018,eave,ridge,.035,strips);
  if(glazed)for(let i=0;i<count;i++){const s=start+(i+.5)*(end-start)/count,w=Math.min(1.5,(end-start)/count*.48),t0=eave+(ridge-eave)*.12,t1=eave+(ridge-eave)*.90;tile(s-w/2-.07,s+w/2+.07,t0,t1,.06,strips);for(let j=0;j<4;j++){const a=t0+(t1-t0)*(j+.035)/4,c=t0+(t1-t0)*(j+.965)/4;tile(s-w/2,s+w/2,a,c,.09,panes);}}
  add('006-'+name+'-seams-frames',strips,C.frame,29,id);if(glazed)add('006-'+name+'-rooflights',panes,C.glass,28,id);
 }
 function gable(name,axis,at,a,ridge,c,flip=false){const g=new G.Geometry(),pt=(s,y)=>axis==='u'?vertex(at,y,s):vertex(s,y,at);const points=[pt(a,H.eave),pt(ridge,H.ridge),pt(c,H.eave)];g.tri(...(flip?points.reverse():points));add('006-'+name,g,C.brick,24,id);}
 // South: east-west ridge; east: north-south ridge with a SOLID southern gable.
 slope('south-outer','u',.8,35.6,60.3,54.7,H.eave,H.ridge,true);
 slope('south-inner','u',.8,35.6,50.10,54.7,H.eave,H.ridge,false);
 gable('south-west-gable','u',.8,50.1,54.7,60.3,true);
 slope('east-outer','v',10.0,58.4,53.3,44.2,H.eave,H.ridge,true);
 // High level inner strip is a fitted closure; only the outer steep pitch is photo-established.
 slope('east-inner','v',18.7,58.4,35.65,44.2,H.ridge,H.ridge,false);
 {const g=new G.Geometry(),p=[[35.65,H.wall],[53.3,H.wall],[53.3,H.eave],[44.2,H.ridge],[35.65,H.ridge]];for(let i=1;i<p.length-1;i++)g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],p[1],58.4)));add('006-east-south-solid-gable',g,C.brick,24,id);}
 // The north bar and west narrow bar remain distinct; the north inner equipment area is flat.
 slope('north-outer','u',6.7,66.0,-1.2,8.6,H.eave,H.ridge,false);
 slope('north-inner','u',6.7,66.0,18.6,8.6,H.eave,H.ridge,true);
 gable('north-east-gable','u',66.0,-1.2,8.6,18.6);
 slope('west-outer','v',5.0,50.1,-1.5,4.3,H.eave,H.ridge,false);
 slope('west-inner','v',5.0,50.1,9.7,4.3,H.eave,H.ridge,false);
 for(const spec of roofSpecs)renderSlope(spec);
 // Flat white soffits and repeated deep exposed beams below the two photographed roof edges.
 frame(.8,60.3,0,()=>{b.box(17.4,18.68,-2.45,34.8,.26,4.9,C.beam,24);b.box(17.4,18.94,.04,34.8,.13,.16,C.red,24);for(let x=.6;x<34.8;x+=2.0)b.box(x,18.18,-2.4,.24,.75,4.9,C.beam,24);});
 frame(53.3,58.4,Math.PI/2,()=>{b.box(24.2,18.68,-2.65,48.4,.26,5.3,C.beam,24);b.box(24.2,18.94,.04,48.4,.13,.16,C.red,24);for(let x=.6;x<48.4;x+=2.0)b.box(x,18.18,-2.65,.24,.75,5.3,C.beam,24);});
 frame(50.6,18.256,0,()=>{for(const yy of [15.55,15.95,16.35])b.box(7.55,yy,.12,15.1,.06,.075,C.frame,29);for(let i=0;i<4;i++)b.box(.2+i*4.9,16.85,-.12,.43,3.3,.48,C.brick,24);b.box(7.55,18.67,-1.7,15.1,.24,3.5,C.beam,24);for(let i=0;i<8;i++)b.box(.6+i*1.9,18.18,-1.7,.24,.75,3.5,C.beam,24);});
 // Offset two-storey silver entrance. Minimal threshold: photographs do not establish grand stairs.
 frame(14.0,58.403,0,()=>{b.box(0,3.5,-3.30,19.8,6.9,.13,C.glass,28);for(let i=0;i<=6;i++)b.box(-10+i*3.33,3.65,2.15,.55,7.3,.6,C.metal,24);b.box(0,7.25,1.2,20.8,1.0,3.0,C.metal,24);for(let i=0;i<9;i++)b.box(0,5.5+i*.14,1.35,20.2,.055,2.8,C.frame,29);for(let i=0;i<7;i++)b.box(-9.6+i*3.2,3.4,-3.18,.07,6.7,.08,C.frame,29);b.box(0,3.4,-3.18,19.8,.07,.08,C.frame,29);for(const x of [-1.6,0,1.6])b.box(x,1.55,-3.12,.065,3.1,.08,C.frame,29);b.box(0,3.1,-3.12,3.2,.065,.08,C.frame,29);for(const x of [-.18,.18])b.box(x,1.35,-3.10,.05,.55,.06,C.frame,29);b.box(0,.06,1.3,20.8,.12,3.4,C.frame,10);if(b.lettering)b.lettering('生命科学学院',0,7.35,2.74,9.0,.63,0,'#5e5841');});
 // Narrow louvred strip on the photographed south face, beside the gable section.
 frame(34.8,58.403,0,()=>{for(let j=0;j<4;j++){b.box(0,1.9+j*3.8,.2,.8,2.5,.16,'#59625f',24);for(let i=0;i<12;i++)b.box(0,.75+j*3.8+i*.20,.33,1.05,.055,.17,C.frame,29);}});
 return {strategy:'building006-v46',floors:6,sourceOutline:true,openFifthGallery:true,heightFitted:true,orientationInferred:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building006={id:ID,render,world,local,pieces,heights:H};
})(YY);
