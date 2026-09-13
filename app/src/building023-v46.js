/* Dormitory 35: official six above-ground floors, three roof bars, north U opening and low daylight strip. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240825545';
const O=[-129.412,605.849],R=Math.atan2(2.676,72.644),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#858b87',frame:'#e4e5dc',glass:'#718b91',roof:'#727e78',tile:'#929e96',stone:'#a8afa5',door:'#526762'};
const H={floor:3.2,wall:19.2,eave:19.4,ridge:22.5},entrances=[{name:'main-south',u:38,v:38.512,face:'south',axis:0,outward:1,width:6.8,sill:.75},{name:'court-north',u:36.3,v:18.87,face:'court-north',axis:0,outward:-1,width:1.9,sill:.3},{name:'west-north',u:9.5,v:.022,face:'west-north',axis:0,outward:-1,width:1.8,sill:.3},{name:'east-north',u:63.2,v:-.023,face:'east-north',axis:0,outward:-1,width:1.8,sill:.3},{name:'west-side',u:-.065,v:30.9,face:'west-outer',axis:1,outward:-1,width:1.8,sill:.75},{name:'east-side',u:72.624,v:30.9,face:'east-outer',axis:1,outward:1,width:1.8,sill:.3},{name:'west-court-side',u:19.000,v:2.0,face:'west-inner',axis:1,outward:1,width:1.8,sill:.3},{name:'east-court-side',u:53.966,v:2.0,face:'east-inner',axis:1,outward:-1,width:1.8,sill:.3}];
const skylight={parts:[[23.0,14.8,34.65,17.5],[38.0,14.8,50.0,17.5]],top:.48,scope:'narrow-underground-daylight-strip-fitted'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'023-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 // The full source footprint gets only a roof-level cap; facade apertures are built as actual openings.
 add('023-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 const roofSpecs=[{name:'west-short',box:[-.081,0,19.004,18.84],axis:1,rise:3.1},{name:'east-short',box:[53.931,-.045,72.693,18.91],axis:1,rise:3.1},{name:'south-long',box:[-.081,19.05,72.693,38.574],axis:0,rise:3.1}];
 for(const q of roofSpecs){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],cmid=(cmin+cmax)/2,hip=(cmax-cmin)*.42,r0=amin+hip,r1=amax-hip;
  const xyz=(u,v)=>a===0?[u,v]:[v,u],height=p=>{const along=p[a],across=p[c],t=Math.min(1,Math.max(0,Math.min((along-amin)/hip,(amax-along)/hip,1-Math.abs(across-cmid)/((cmax-cmin)/2))));return H.eave+q.rise*t;};
  const surfaces=[{p:[xyz(amin,cmin),xyz(amax,cmin),xyz(r1,cmid),xyz(r0,cmid)]},{p:[xyz(r0,cmid),xyz(r1,cmid),xyz(amax,cmax),xyz(amin,cmax)]},{p:[xyz(amin,cmin),xyz(r0,cmid),xyz(amin,cmax)]},{p:[xyz(r1,cmid),xyz(amax,cmin),xyz(amax,cmax)]}],mesh=new G.Geometry(),seams=new G.Geometry();
  for(const sf of surfaces){for(const tri of pieces(f,box)){let p=tri;const poly=sf.p,sign=Math.sign(F.area([...poly,poly[0]]));for(let i=0;i<poly.length&&p.length;i++){const aa=poly[i],cc=poly[(i+1)%poly.length],out=[];const d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e),si=ds>=-1e-8,ei=de>=-1e-8;if(si)out.push(s);if(si!==ei){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}for(let j=1;j<p.length-1;j++)mesh.tri(...[p[0],p[j],p[j+1]].map(p=>vertex(p[0],height(p),p[1])));}}
  add('023-hip-roof-'+q.name,mesh,C.roof,2,id);
  // Sparse tile seams are clipped into each triangular roof plane, leaving the mapped recesses open.
  for(let s=amin+.2;s<amax;s+=.45){const rr=box.slice();rr[a]=s-.025;rr[a+2]=s+.025;for(let j=0;j<24;j++){rr[c]=cmin+(cmax-cmin)*j/24;rr[c+2]=cmin+(cmax-cmin)*(j+1)/24;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)seams.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.035,p[1])));}}
  add('023-roof-tile-seams-'+q.name,seams,C.tile,2,id);
 }
 // The 2-6F plan gives room divisions, not a measured elevation; outer opening ratios remain fitted.
 const map=x=>(x-229)/(1648-229)*72.693,cells=(xs,ratio=.67)=>xs.slice(1).map((x,i)=>[xs[i],x,ratio]);
 const south=cells([229,297,365,433,501,569,637,705,773,841,909,977,1045,1113,1181,1249,1317,1385,1453,1521,1589,1648].map(map));
 const court=cells([433,501,569,637,705,773,841,909,977,1045,1113,1181,1249,1317,1385,1453].map(map));
 const sideRooms=cells([0,3.14,6.28,9.42,12.56,15.70,18.84,22.8,26.7,30.7,34.6,38.5]);
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],horizontal=Math.abs(du)>Math.abs(dv),mx=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face='return',source=[];
 if(horizontal&&mv>38){face='south';source=south;}
 else if(horizontal&&mv>18&&mv<19.1){face='court-north';source=court;}
 else if(horizontal&&mv<.1){face=mx<35?'west-north':'east-north';source=cells([Math.min(la[0],lc[0]),(la[0]+lc[0])/2,Math.max(la[0],lc[0])],.5);}
 else if(!horizontal){face=mx<1?'west-outer':mx<25?'west-inner':mx<60?'east-inner':'east-outer';source=sideRooms;}
  // 2020 official SW photo: wide shared balcony bays only on S and northern W room band.
  if(face==='south')source=south.map(([s,e])=>[s,e,.90]);
  if(face==='west-outer')source=[...cells([0,6.28,12.56,18.84],.94),[19.1,22.5,.30],[22.5,26.6,.32],[26.6,29.9,.36]];
  const positions=source.map(([s,e,ratio])=>{const ax=horizontal?0:1,d=horizontal?du:dv,t0=(s-la[ax])/d*len,t1=(e-la[ax])/d*len,mid=(t0+t1)/2,w=Math.abs(t1-t0)*ratio;return[mid-w/2,mid+w/2];}).map(([s,e])=>[Math.max(.15,s),Math.min(len-.15,e)]).filter(([s,e])=>e-s>.4).sort((a,c)=>a[0]-c[0]);
  b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
   const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.035,x1-x0,y1-y0,.07,(y0>=16&&(face==='south'||face==='west-outer'))?'#d8d9d2':C.wall,24);};
   for(let floor=0;floor<6;floor++){const base=floor*H.floor;let openings=positions.map(([s,e])=>{const v=la[1]+(s+e)/2/len*dv,balcony=face==='south'||(face==='west-outer'&&v<18.84);return{s,e,bottom:base+(balcony?.18:.84),top:base+(balcony?2.94:2.70),door:false,balcony};});
    if(floor===0)for(const door of entrances.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=Math.max(0,x-door.width/2),e=Math.min(len,x+door.width/2);if(e>s+.15){openings=openings.filter(q=>q.e<s-.12||q.s>e+.12);openings.push({s,e,bottom:door.sill,top:3.03,door:true});}}
    openings.sort((a,c)=>a.s-c.s);let cursor=0;
    for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);const w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2,x=(q.s+q.e)/2,depth=q.door?.34:q.balcony?1.35:.55;
     if(q.balcony){
      group('photo-balcony',()=>{const white='#dedfd8',brick=floor===5?'#d8d9d2':'#858983';
       for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.13,h,depth,white,24);
       for(const yy of [base+.16,base+2.99])b.box(x,yy,-depth/2,w,.14,depth,white,24);
       b.box(x,base+.69,-.055,w,1.02,.13,white,24);b.box(x,base+1.24,-.025,w+.05,.09,.20,white,24);
       b.box(x,base+1.56,-depth-.015,w,2.82,.045,brick,24);
       const count=face==='west-outer'?2:1,gw=w/count*.76,gh=1.86,gy=base+1.77;
       for(let j=0;j<count;j++){const cx=q.s+w*(j+.5)/count;b.box(cx,gy,-depth+.04,gw,gh,.05,C.glass,5);
        for(const xx of [cx-gw/2,cx,cx+gw/2])b.box(xx,gy,-depth+.08,.055,gh,.07,white,6);
        for(const yy of [gy-gh/2,gy+gh/2,base+2.12])b.box(cx,yy,-depth+.08,gw,.055,.07,white,6);}
       if(floor===0)for(let gx=q.s+.14;gx<q.e-.08;gx+=.18)b.box(gx,base+2.08,.015,.03,1.58,.035,white,6);
      });cursor=q.e;continue;
     }
     // Returns and recessed glazing form real apertures, without extruded continuous corridors.
     for(const xx of [q.s,q.e])b.box(xx,y,-depth/2,.045,h,depth,C.frame,24);
     for(const yy of [q.bottom,q.top])b.box(x,yy,-depth/2,w,.045,depth,C.frame,24);
     b.box(x,y,-depth,w-.08,h-.06,.055,q.door?C.door:C.glass,5);
     for(const xx of [q.s+.05,x,q.e-.05])b.box(xx,y,-depth+.05,.045,h,.07,C.frame,6);
     for(const yy of [q.bottom+.035,q.top-.035])b.box(x,yy,-depth+.05,w,.055,.07,C.frame,6);
     if(!q.door)b.box(x,base+1.95,-depth+.055,w,.035,.07,C.frame,6);
     cursor=q.e;
    }
    panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.14,.025,len,.12,.16,C.frame,24);
   }
   b.box(len/2,H.wall+.04,.035,len,.16,.18,C.frame,24);
  }));
 }
 // South main lobby has its own broad outside stair; the other plan-labelled exits remain secondary.
 b.local(O[0],0,O[1],R,()=>{for(const q of entrances)group('entrance-'+q.name,()=>{
 const w=q.width,s=q.outward;
 if(q.name==='main-south'){b.box(q.u,3.22,q.v+1.05,w+.8,.14,2.2,C.frame,24);b.box(q.u,.375,q.v+.60,w+.6,.75,1.2,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(q.u,h/2,q.v+3.45-k*.5,w+.6,h,.51,C.stone,24);}}
 else if(q.name==='west-side'){
  b.box(q.u-.55,.375,q.v,1.1,.75,w+.3,C.stone,24);for(let k=0;k<5;k++){const h=.15*(k+1);b.box(q.u-3.10+k*.5,h/2,q.v,.51,h,w+.3,C.stone,24);}
  b.box(q.u-.65,3.13,q.v,1.4,.15,w+.8,C.frame,24);
  for(const edge of [-1,1]){b.box(q.u-.65,3.31,q.v+edge*(w/2+.4),1.4,.30,.10,C.frame,24);
   for(let k=0;k<5;k++){const x=q.u-3.10+k*.5,h=.15*(k+1);b.box(x,h+.43,q.v+edge*(w/2+.10),.04,.86,.04,C.frame,6);}
   b.beam([q.u-3.10,1.02,q.v+edge*(w/2+.10)],[q.u-1.10,1.62,q.v+edge*(w/2+.10)],.04,C.frame,6);}
 }
 else if(q.axis===0){b.box(q.u,.15,q.v+s*.35,w+.25,.3,.7,C.stone,24);b.box(q.u,.075,q.v+s*.88,w+.25,.15,.38,C.stone,24);}
 else{b.box(q.u+s*.35,.15,q.v,.7,.3,w+.25,C.stone,24);b.box(q.u+s*.88,.075,q.v,.38,.15,w+.25,C.stone,24);}
 });
 // Low glazing over the B1/B2 daylight corridor, NOT a roof spanning the open U courtyard.
 group('underground-daylight-strip',()=>{for(const [u0,v0,u1,v1] of skylight.parts){const w=u1-u0,d=v1-v0;
 b.box((u0+u1)/2,.20,v0,w,.4,.12,C.stone,24);b.box((u0+u1)/2,.20,v1,w,.4,.12,C.stone,24);
 b.box(u0,.20,(v0+v1)/2,.12,.4,d,C.stone,24);b.box(u1,.20,(v0+v1)/2,.12,.4,d,C.stone,24);
 b.box((u0+u1)/2,.43,(v0+v1)/2,w,.06,d,'#a4bcc0',5);
 const n=Math.ceil(w/1.5);for(let k=0;k<=n;k++)b.box(u0+w*k/n,.49,(v0+v1)/2,.05,.08,d,C.frame,6);for(const v of [v0,(v0+v1)/2,v1])b.box((u0+u1)/2,.49,v,w,.08,.05,C.frame,6);
 }});
 });
 return{strategy:'building023-v46',floors:6,basementFloors:2,sourceOutline:true,northUOpening:true,threeRoofBars:true,southMainEntrance:true,narrowUndergroundSkylight:true,fullCourtCover:false,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building023={id:ID,render,world,local,pieces,heights:H,entrances,skylight};
})(YY);
