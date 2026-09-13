/* KIAA: three photographed volumes on the unchanged eight-corner OSM footprint.
 * Red galleries, green rails and the painted tiled entrance follow PKU sources.
 * The west-end entrance placement, hidden facades and dimensions are provisional.
 * See data/building079-v46.json; this is a partial reconstruction, not a survey. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/876428136';
const C={wall:'#d5d1bf',brick:'#979c98',stone:'#b9bdb7',red:'#9e4936',green:'#356b56',blue:'#286594',gold:'#bca866',glass:'#586e6d',roof:'#697571',beam:'#334f46'};
function render(b,f,add){
 b.id=f.properties.pickId;const ring=f.geometry.coordinates[0],O=ring[0],R=-Math.atan2(ring[7][1]-O[1],ring[7][0]-O[0]),c=Math.cos(R),s=Math.sin(R),p=ring.slice(0,-1).map(q=>[(q[0]-O[0])*c-(q[1]-O[1])*s,(q[0]-O[0])*s+(q[1]-O[1])*c]);
 const end=p[3][0],ann=p[4][0],W=p[7][0],D=p[1][1],AD=p[6][1],CD=p[3][1],base=.8,fh=3.3,eave=10.7;
 const volumes=[{name:'main',floors:3,eave,poly:[p[0],p[1],p[2],p[3],[end,0]]},{name:'connector',floors:2,eave:7.4,poly:[[end,0],p[3],p[4],[ann,0]]},{name:'annex',floors:3,eave,poly:[[ann,0],p[4],p[5],p[6],p[7]]}];
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'079-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const mesh=(key,g,col,mat=24)=>b.mesh('079-'+key,g,0,0,0,1,1,1,col,mat);
 function slab(name,poly,y,thickness,col){mesh(name,G.polygon(poly,y),col,24);const g=new G.Geometry();for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length];g.quad([a[0],y-thickness,a[1]],[q[0],y-thickness,q[1]],[q[0],y,q[1]],[a[0],y,a[1]]);}mesh(name+'-edge',g,col,24);}
 function rail(width,y,col=C.green,stone=false){
  const h=stone?.92:1.03;
  for(const yy of[y+.12,y+h])b.box(width/2,yy,.04,width,.085,.12,col,stone?10:6);
  const n=Math.ceil(width/(stone?1.45:1.28));
  for(let i=0;i<=n;i++)b.box(i*width/n,y+h/2,.04,stone?.16:.085,h+.13,stone?.2:.12,col,stone?10:6);
  for(let i=0;i<n;i++){
   const x=(i+.5)*width/n,w=width/n-.18;
   if(stone){b.box(x,y+.52,.04,w,.32,.12,col,10);continue;}
   // Alternating rectangular turns match the visible open green lattice rhythm.
   for(const side of[-1,1]){b.box(x+side*w*.26,y+.57,.04,.052,.67,.075,col,6);b.box(x+side*w*.13,y+(side>0?.77:.36),.04,w*.51,.052,.075,col,6);}
  }
 }
 function face(name,x,z,angle,width,bays,floors,gallery,options={}){
  b.local(x,0,z,angle,()=>group(name,()=>{
   const depth=gallery?1.85:0,bw=width/bays;
   for(let fl=0;fl<floors;fl++){
    const y=base+fl*fh,lo=y+.53,hi=y+2.72,win=bw*.69;
    group('wall',()=>{
     for(const [a,q] of[[y,lo],[hi,y+fh]])b.box(width/2,(a+q)/2,-depth-.17,width,q-a,.34,options.col||C.wall,options.col?13:24);
     let cursor=0;
     for(let i=0;i<bays;i++){const mid=bw*(i+.5),a=mid-win/2;if(a>cursor)b.box((a+cursor)/2,(lo+hi)/2,-depth-.17,a-cursor,hi-lo,.34,options.col||C.wall,options.col?13:24);cursor=mid+win/2;}
     b.box((width+cursor)/2,(lo+hi)/2,-depth-.17,width-cursor,hi-lo,.34,options.col||C.wall,options.col?13:24);
    });
    for(let i=0;i<bays;i++){
     const mid=bw*(i+.5);group('window-'+fl+'-'+i,()=>{
      b.box(mid,(lo+hi)/2,-depth-.07,win-.08,hi-lo-.06,.045,C.glass,5);
      for(const a of[mid-win/2,mid,mid+win/2])b.box(a,(lo+hi)/2,-depth+.005,.09,hi-lo+.10,.16,C.red,6);
      for(const yy of[lo,hi,hi-.5])b.box(mid,yy,-depth+.01,win+.1,.09,.17,C.red,6);
     });
    }
    if(gallery){group('gallery',()=>{
     b.box(width/2,y-.11,-depth/2,width,.22,depth+.24,C.stone,24);
     b.box(width/2,y+fh-.29,.015,width,.57,.48,C.red,6);
     if(fl>0)rail(width,y+.04);
    });}else b.box(width/2,y+fh-.12,.035,width,.24,.42,C.stone,24);
   }
   if(gallery)group('columns',()=>{for(let i=0;i<=bays;i++){
    const xx=i*bw;b.cyl(xx,base,.03,.22,fh*floors-.25,C.red,12,1,6);b.box(xx,base-.1,.03,.56,.3,.57,C.stone,10);
    b.box(xx,base+fh*floors-.32,.03,.64,.3,.70,C.beam,6);
   }});
   else for(const xx of[.2,width-.2])b.box(xx,(base+fh*floors)/2,-.05,.38,base+fh*floors,.45,C.brick,13);
  }));
 }
 function hip(name,x0,x1,depth,rise){
  const a=x0-.9,q=x1+.9,z0=-1.05,z1=depth+1.05,half=(z1-z0)/2,mid=(z0+z1)/2,r0=a+half*.88,r1=q-half*.88;
  const height=(t,u)=>eave+rise*Math.pow(t,1.40)+.27*Math.pow(Math.abs(u),8)*Math.pow(1-t,2);
  const long=(sign,t,u)=>[(a+(q-a)*(u+1)/2)*(1-t)+(r0+(r1-r0)*(u+1)/2)*t,height(t,u),mid+sign*half*(1-t)];
  const endFace=(sign,t,u)=>[sign<0?a+(r0-a)*t:q+(r1-q)*t,height(t,u),mid+u*half*(1-t)];
  function surface(key,point){const g=new G.Geometry(),nx=16,nt=10;const tri=(a,q,d)=>{const ny=(q[2]-a[2])*(d[0]-a[0])-(q[0]-a[0])*(d[2]-a[2]);if(Math.abs(ny)<1e-9)return;if(ny<0)[q,d]=[d,q];g.tri(a,q,d);};
   for(let i=0;i<nx;i++)for(let j=0;j<nt;j++){const u=-1+2*i/nx,v=-1+2*(i+1)/nx,t=j/nt,tt=(j+1)/nt,a=point(t,u),q=point(t,v),d=point(tt,v),e=point(tt,u);tri(a,q,d);tri(a,d,e);}mesh('roof-surface-'+name+'-'+key,g,C.roof,19);
  }
  for(const sign of[-1,1]){surface('long'+sign,(t,u)=>long(sign,t,u));surface('end'+sign,(t,u)=>endFace(sign,t,u));}
  group(name+'-roof-trim',()=>{
   b.box((r0+r1)/2,eave+rise+.10,mid,r1-r0+.2,.2,.32,C.roof,19);
   for(const sign of[-1,1])for(let i=0;i<16;i++){const u=-1+2*i/16,v=-1+2*(i+1)/16;b.beam(long(sign,0,u),long(sign,0,v),.12,C.roof,19);}
   for(const sign of[-1,1])for(let i=0;i<10;i++){const t=i/10,tt=(i+1)/10;for(const u of[-1,1])b.beam(endFace(sign,t,u),endFace(sign,tt,u),.11,C.roof,19);}
   for(const xx of[r0,r1])b.beam([xx,eave+rise+.12,mid],[xx+(xx===r0?-.42:.42),eave+rise+.42,mid],.12,C.roof,19);
  });
 }
 function entrance(){
  // A provisional west-end fit. Photo directions are not geotagged; do not
  // promote this placement to accepted simply because the component is rendered.
  b.local(0,0,D/2,-Math.PI/2,()=>{
   group('entrance-door',()=>{
    b.box(0,2.05,-1.72,3.1,2.52,.08,C.glass,5);
    for(const xx of[-1.61,0,1.61])b.box(xx,2.05,-1.64,.12,2.64,.16,'#543f30',6);
    b.box(0,3.38,-1.64,3.32,.13,.16,'#543f30',6);
    for(let i=0;i<4;i++)b.box(0,.1+i*.2,3.12-i*.35,5.65,.2,1.8-i*.35,C.stone,10);
   });
   group('entrance-posts',()=>{for(const xx of[-2.36,2.36])b.cyl(xx,.8,2.28,.20,2.57,C.green,12,1,6);});
   group('entrance-painted-frame',()=>{
    for(const yy of[3.16,3.80])b.box(0,yy,2.30,5.35,.37,.35,C.blue,6);
    for(const yy of[2.96,3.37,3.60,4.03])b.box(0,yy,2.49,5.30,.065,.07,C.gold,6);
    for(const xx of[-2.38,2.38]){b.box(xx,3.49,2.31,.42,1.12,.44,C.red,6);b.sphere(xx,2.84,2.3,.25,.32,.24,C.blue,6,0,true);}
    for(let i=0;i<3;i++){const xx=(i-1)*1.53;for(const yy of[3.18,3.81]){b.box(xx,yy,2.495,1.18,.26,.035,'#dad1ab',24);for(let j=0;j<3;j++)b.beam([xx-.43+j*.27,yy-.06,2.522],[xx-.19+j*.21,yy+.06,2.522],.017,C.green,6);}}
    for(let i=0;i<5;i++){const xx=-1.96+i*.98;b.box(xx,3.5,2.4,.81,.22,.11,C.green,6);b.beam([xx-.32,3.45,2.48],[xx,3.59,2.48],.028,C.gold,6);b.beam([xx,3.59,2.48],[xx+.32,3.45,2.48],.028,C.gold,6);}
    for(let i=0;i<23;i++)b.box(-2.75+i*.25,4.13,2.65,.09,.14,.24,i%2?C.gold:C.green,6);
   });
   const roofY=4.23,rise=1.15,zmid=1.25,half=1.64,w=6.05,point=(x,t,sign)=>[x,roofY+rise*Math.pow(t,1.4)+.17*Math.pow(Math.abs(x)/(w/2),8)*(1-t),zmid+sign*half*(1-t)];
   for(const sign of[-1,1]){const g=new G.Geometry();for(let i=0;i<20;i++)for(let j=0;j<10;j++){let a=point(-w/2+w*i/20,j/10,sign),q=point(-w/2+w*(i+1)/20,j/10,sign),d=point(-w/2+w*(i+1)/20,(j+1)/10,sign),e=point(-w/2+w*i/20,(j+1)/10,sign);if(sign>0)g.quad(a,q,d,e);else g.quad(q,a,e,d);}mesh('entrance-canopy-surface-'+sign,g,C.roof,19);}
   group('entrance-bargeboards',()=>{
    b.box(0,roofY+rise+.12,zmid,w+.22,.21,.25,C.roof,19);
    for(const xx of[-w/2,w/2])for(const sign of[-1,1])for(let i=0;i<10;i++){const a=point(xx,i/10,sign),q=point(xx,(i+1)/10,sign);b.beam([a[0],a[1]-.08,a[2]],[q[0],q[1]-.08,q[2]],.15,C.red,6);b.beam(a,q,.08,C.roof,19);if(i%2===0)b.sphere(xx, a[1]-.10,a[2],.06,.065,.065,C.gold,9,0,true);}
   });
   group('entrance-name',()=>{
    for(let i=0;i<54;i++)b.box(-5.65+i*.215,7.14,.33,.055,1.32,.075,'#b9c3ba',9);
    // An empty, checked atlas region keeps every earlier glyph slot unchanged.
    const px=2560,py=3584,uv=[px/4096,1-(py+256)/4096,512/4096,256/4096],paint=()=>{
     const q=b.ctx;q.save();q.clearRect(px,py,512,256);q.textAlign='center';q.textBaseline='middle';q.fillStyle='#e8e8da';q.font='500 26px \"Noto Sans CJK SC\",sans-serif';q.fillText('科维理天文与天体物理研究所',px+256,py+110,500);q.font='500 11px Arial';q.fillText('Kavli Institute for Astronomy and Astrophysics',px+256,py+140,500);q.restore();
    };
    if(b.e.setAtlas){const old=b.e.setAtlas;b.e.setAtlas=function(canvas){this.setAtlas=old;const result=old.call(this,canvas),pixels=canvas.getContext('2d').getImageData(px/2,py/2,256,128).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i])throw Error('079 label slot occupied');paint();if(this.gl)this.setAtlas(canvas);return result;};}else paint();
    b.mesh('plane',b.geo('plane',G.plane),.42,7.14,.39,11,5.5,1,'#ffffff',8,.85,0,uv);
    b.sphere(-4.95,7.21,.41,.48,.48,.055,'#799ca9',9,0,true); // Approximate emblem silhouette, not a facsimile logo.
   });
  });
 }
 b.local(O[0],0,O[1],R,()=>{
  for(const v of volumes){mesh('footprint-'+v.name,G.polygon(v.poly,.025),C.stone,24);for(let fl=0;fl<=v.floors;fl++)slab(v.name+'-slab-'+fl,v.poly,base+fl*fh,.23,C.stone);}
  face('main-south',0,D,0,end,12,3,true);
  face('main-west',0,2,-Math.PI/2,D-4,3,3,true);
  face('main-west-north-flank',0,0,-Math.PI/2,2,1,3,false,{col:C.brick});
  face('main-west-south-flank',0,D-2,-Math.PI/2,2,1,3,false,{col:C.brick});
  face('main-north',end,0,Math.PI,end,12,3,false);
  face('main-east',end,D,Math.PI/2,D,4,3,false);
  face('connector-south',end,CD,0,ann-end,3,2,true);
  face('connector-north',ann,0,Math.PI,ann-end,3,2,false);
  face('annex-south',ann,AD,0,W-ann,4,3,true);
  face('annex-west',ann,0,-Math.PI/2,AD,4,3,false);
  face('annex-east',W,AD,Math.PI/2,AD,4,3,false);
  face('annex-north',W,0,Math.PI,W-ann,4,3,false);
  group('connector-terrace',()=>{
   mesh('deck',G.polygon(volumes[1].poly,7.45),'#bfc4b7',24);
   for(const [x,z,r] of[[end,CD,0],[ann,0,Math.PI]])b.local(x,0,z,r,()=>rail(ann-end,7.47,'#d9dcd0',true));
   for(let i=0;i<4;i++)b.box((end+ann)/2,.1+i*.2,CD+1.3-i*.36,ann-end-.5,.2,1.8-i*.36,C.stone,10);
  });
  hip('main',0,end,D,3.95);hip('annex',ann,W,AD,3.45);entrance();
 });
 return{id:ID,strategy:'building079-v46',volumes:volumes.map(({name,floors,eave})=>({name,floors,eave})),connectorRecess:D-CD,origin:O.slice(),rotation:R,limits:'Entrance position, hidden facades, bay counts and dimensions remain provisional.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
})(YY);
