/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* Economics precinct: original procedural reconstruction from official text and
 * low-resolution image previews. Dimensions, hidden elevations and orientation
 * remain a modelling interpretation. Local +Z faces the inherited east approach.
 * The rounded wing is modelled with arc-length UVs, not an opaque box/cylinder
 * hiding the glazing. No photos are pasted on building facades. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M,TAU=Math.PI*2;
const C={brick:'#a6a69b',edge:'#cccfc7',base:'#919891',glass:'#3e647d',frame:'#4f5c60',metal:'#8e999a',paving:'#babeb2'};
P.econMesh=function(key,x,y,z,w,h,d,c,mat=24,part=.6,r=0){this.mesh(key,this.geo(key,G.box),x,y,z,w,h,d,c,mat,part,r);};
P.econRoundSolid=function(x,z,r){const points=Array.from({length:72},(_,i)=>{const a=i/72*TAU,w=this.world([x+Math.sin(a)*r,0,z+Math.cos(a)*r]);return[w[0],w[2]]}),w=this.world([x,0,z]);this.noPlant(x,z,r*2,r*2);this.mapBuildings.push({x:w[0],z:w[2],w:r*2,d:r*2,id:this.id,polygon:points,r:this.rotation});};
// A real cylindrical wall-band, top/bottom and inner return. Front UV is distance
// along arc in model metres and vertical height. The physical material is scoped.
P.econArcBand=function(x,z,r,y,h,a0,a1,depth=.45,col=C.brick,mat=31,part=.65){
 const key=['v14-arc-band',r,y,h,a0,a1,depth].join('_'),N=Math.max(2,Math.ceil((a1-a0)*r/1.0));
 const geo=this.geo(key,()=>{const g=new G.Geometry(),pt=(a,rr,yy)=>[Math.sin(a)*rr,yy,Math.cos(a)*rr],normal=a=>[Math.sin(a),0,Math.cos(a)];
 for(let i=0;i<N;i++){let a=a0+(a1-a0)*i/N,b=a0+(a1-a0)*(i+1)/N,A=pt(a,r,y),B=pt(b,r,y),C1=pt(b,r,y+h),E=pt(a,r,y+h),uv=[[a*r,y],[b*r,y],[b*r,y+h],[a*r,y+h]],n=normal(a),m=normal(b);g.tri(A,B,C1,[uv[0],uv[1],uv[2]],[n,m,m]);g.tri(A,C1,E,[uv[0],uv[2],uv[3]],[n,m,n]);g.quad(E,C1,pt(b,r-depth,y+h),pt(a,r-depth,y+h),[0,1,0]);g.quad(pt(a,r-depth,y),pt(b,r-depth,y),B,A,[0,-1,0]);}
 for(const a of[a0,a1])g.quad(pt(a,r,y),pt(a,r-depth,y),pt(a,r-depth,y+h),pt(a,r,y+h));return g;});
 this.mesh(key,geo,x,0,z,1,1,1,col,mat,part);
};
P.econWindow=function(x,y,z,w,h,r=0,key='v14-drum-window'){
 this.local(x,y,z,r,()=>{this.econMesh(key,0,0,-.22,w-.16,h-.14,.055,C.glass,28,.9);
 for(const s of[-1,1]){this.econMesh('v14-window-reveal',s*w/2,0,-.12,.10,h+.14,.66,C.edge,24,.93);this.econMesh('v14-window-reveal',0,s*h/2,-.12,w+.12,.10,.66,C.edge,24,.93);}
 this.econMesh('v14-black-sash',0,0,.0,.065,h,.10,C.frame,29,.96);this.econMesh('v14-black-sash',0,-h*.12,0,w,.055,.10,C.frame,29,.96);
 for(const s of[-1,1])this.econMesh('v14-black-sash',s*(w/2-.10),0,.015,.055,h-.1,.10,C.frame,29,.96);
 this.econMesh('v14-projecting-sill',0,-h/2-.12,.12,w+.25,.16,.90,'#bbbbb0',24,.97);
 });
};
P.econDome=function(x,z,r=17.65,y=20.55,rise=4.8){const R=(r*r+rise*rise)/(2*rise),cy=y+rise-R,N=96,rings=24;
 const height=rho=>cy+Math.sqrt(Math.max(0,R*R-rho*rho)),point=(a,rho)=>[Math.sin(a)*rho,height(rho),Math.cos(a)*rho];
 const cap=this.geo('v14-dome-cap',()=>{const g=new G.Geometry(),norm=p=>M.norm([p[0],p[1]-cy,p[2]]);for(let j=0;j<rings;j++)for(let i=0;i<N;i++){
 const a=i/N*TAU,b=(i+1)/N*TAU,lo=r*j/rings,hi=r*(j+1)/rings,A=point(a,lo),B=point(b,lo),C1=point(b,hi),D=point(a,hi),uv=p=>[p[0],p[2]];
 if(j>0)g.tri(A,C1,B,[uv(A),uv(C1),uv(B)],[norm(A),norm(C1),norm(B)]);g.tri(A,D,C1,[uv(A),uv(D),uv(C1)],[norm(A),norm(D),norm(C1)]);
 }return g;});this.mesh('v14-dome-cap',cap,x,0,z,1,1,1,'#909a9c',32,2.8);
 // A very thin normalized circular band shared at multiple radii. No polygonal
 // roof silhouette: smooth cap normals and 96 segments at the eave.
 const ring=this.geo('v14-dome-seam',()=>{const g=new G.Geometry();for(let i=0;i<N;i++){let a=i/N*TAU,b=(i+1)/N*TAU;g.quad([Math.sin(a),0,Math.cos(a)],[Math.sin(b),0,Math.cos(b)],[Math.sin(b),1,Math.cos(b)],[Math.sin(a),1,Math.cos(a)]);}return g;});
 for(let k=1;k<=10;k++){const rho=r*k/10;this.mesh('v14-dome-seam',ring,x,height(rho)+.018,z,rho,.055,rho,'#697779',29,2.81);}
 this.econArcBand(x,z,r+.15,y-.26,.40,0,TAU,.7,'#9eaaa8',29,2.82);
 // Fine standing seams along selected meridians; deliberately restrained.
 for(let i=0;i<16;i++){const a=i/16*TAU;for(let j=1;j<20;j++){const A=point(a,r*j/20),B=point(a,r*(j+1)/20);this.beam([x+A[0],A[1]+.070,z+A[2]],[x+B[0],B[1]+.070,z+B[2]],.018,'#748083',29,2.83);}}
};
P.econCaption=function(text,x,y,z,w,h,key='v14-lettering',color='#dad3b7',part=.94){
 const atlasKey=key+text;let uv=this.signs.get(atlasKey);if(!uv){const k=this.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.fillStyle=color;this.ctx.textAlign='center';this.ctx.textBaseline='middle';const family=' \"Noto Serif CJK SC\",\"Songti SC\",serif';let size=84;this.ctx.font='600 '+size+'px'+family;size=Math.min(size,size*470/Math.max(1,this.ctx.measureText(text).width));this.ctx.font='600 '+size+'px'+family;this.ctx.fillText(text,px+256,py+66);uv=text.length===1?[(px+196)/4096,1-(py+124)/4096,120/4096,120/4096]:[px/4096,1-(py+128)/4096,512/4096,128/4096];if(/^[A-Za-z ]+$/.test(text)){const tm=this.ctx.measureText(text),cw=Math.min(502,Math.ceil(tm.width)+8),ch=Math.min(112,Math.ceil(size)+10);uv=[(px+256-cw/2)/4096,1-(py+66+ch/2)/4096,cw/4096,ch/4096];}this.signs.set(atlasKey,uv);}if(/^[A-Za-z ]+$/.test(text))h=w*uv[3]/uv[2];this.mesh(key,this.geo(key,G.plane),x,y,z,w,h,1,'#ffffff',8,part,0,uv);
};
P.economicsHall=function(p,w=75,d=70){
 this.noPlant(0,1,81,96);
 // Distinct rear and western returns. Their unpictured forms are qualified in
 // the source drawer. Registered footprints don't include forecourt paving.
 const blocks=[[-29,-1,15,65,25.6],[0,-27,70,14,25.6],[-13,-6,15,29,27.8]];
 for(const[x,z,bw,bd,h]of blocks){this.solid(x,z,bw,bd);this.econMesh('v14-brick-wing',x,h/2+.45,z,bw,h,bd,C.brick,30,.55);this.box(x,.38,z,bw+.8,.7,bd+.8,C.base,24,.2);this.box(x,h+.58,z,bw+.65,.20,bd+.7,'#c0c4bc',24,2.25);this.box(x,h+.76,z,bw-.3,.14,bd-.3,'#aeb8b1',21,2.3);}
 // Dedicated round wing. The wall is constructed around the openings rather
 // than as a single opaque cylinder with fake black rectangles painted on it.
 const cx=18.8,cz=1.5,r=17.2,H=19.5,n=30,step=TAU/n;
 this.econRoundSolid(cx,cz,r);this.cyl(cx,.20,cz,r+.65,.62,C.base,96,1,24,.18);
 this.econArcBand(cx,cz,r,.82,1.22,0,TAU,.75,C.brick,31,.6);
 for(let f=0;f<4;f++){const y=2.04+f*4.26;
  this.econArcBand(cx,cz,r,y,1.45,0,TAU,.60,C.brick,31,.66+f*.01);
  for(let i=0;i<n;i++){const a=i*step,b=(i+1)*step,mid=(a+b)/2;
   this.econArcBand(cx,cz,r,y+1.45,2.8,a,a+step*.16,.64,C.brick,31,.7);
   this.econArcBand(cx,cz,r,y+1.45,2.8,b-step*.16,b,.64,C.brick,31,.7);
   this.econWindow(cx+Math.sin(mid)*(r-.03),y+2.85,cz+Math.cos(mid)*(r-.03),2*Math.sin(step*.34)*r,2.70,mid);
  }
 }
 this.econArcBand(cx,cz,r,19.1,1.25,0,TAU,.8,C.brick,31,1.1);this.econArcBand(cx,cz,r+.13,20.33,.2,0,TAU,.85,C.edge,24,2.35);this.econDome(cx,cz,r+.4,20.55,4.8);
 // Full-height glazed entry/atrium: gently curved in plan, stone tower to its
 // left, rounded masonry to right. Shape fitted from previews, not surveyed.
 const xa=-21.2,xb=9.2,segments=20,front=x=>23.8-2.2*Math.cos((x-xa)/(xb-xa)*Math.PI/2);
 for(let i=0;i<segments;i++){let a=xa+(xb-xa)*i/segments,b=xa+(xb-xa)*(i+1)/segments,za=front(a),zb=front(b),ang=-Math.atan2(zb-za,b-a),xx=(a+b)/2,zz=(za+zb)/2,ww=Math.hypot(b-a,zb-za);
  this.local(xx,0,zz,ang,()=>{for(let j=0;j<9;j++){const yy=3.15+j*2.48;this.econMesh('v14-arc-glass',0,yy,0,ww-.075,2.38,.045,(i+j)%7===0?'#608395':C.glass,28,.84);this.econMesh('v14-atrium-transom',0,yy-1.21,.04,ww,.065,.12,'#9aa9ac',29,.9);}this.econMesh('v14-atrium-mullion',-ww/2,13.1,.025,.072,22.62,.14,'#a9b5b4',29,.95);});
 }
 this.solid(-5.5,6.0,29.5,30.0);this.box(-5.5,2.02,8,29.5,.24,32.0,'#b7bcb7',26,.28);this.box(-5.5,24.48,9,31.7,.36,32.0,'#a2afae',29,2.40);
 // Vertical stone blades and small windows on the left facade, not generic
 // unbroken glazing. Building-title characters are neutral, not traced script.
 this.solid(-24.5,32.25,5.8,2.2);this.solid(-17.9,32.05,1.3,1.6);
 this.econMesh('v14-name-pier',-24.5,14.2,32.25,5.8,28.0,2.2,C.brick,30,1.0);
 this.econMesh('v14-name-pier',-17.9,14.45,32.05,1.3,28.5,1.6,C.brick,30,1.0);
 for(let j=0;j<9;j++)this.econMesh('v14-narrow-slit',-20.62,3.3+j*2.80,32.5,1.08,2.57,.08,C.glass,28,.92);
 for(let j=0;j<4;j++)this.econCaption('经济学院'[j],-24.6,22.45-j*1.75,33.365,1.35,1.35,'v14-facade-character','#555e5a',1.1);
 // Photograph-visible rectangular portal. Posts stand apart; no lintel closes
 // the doorway. The vestibule plane is recessed behind the portal by 4 metres.
 for(const x of[-10.3,5.3]){this.solid(x,28.6,1.15,1.62);this.econMesh('v14-entry-portal',x,5.55,28.6,1.15,7.1,1.62,'#b4b6aa',24,1.04);}
 this.econMesh('v14-entry-portal',-2.5,9.12,28.6,16.75,1.1,1.72,'#b4b6aa',24,1.04);
 this.econMesh('v14-entry-door',-2.5,4.0,24.00,12.95,4.0,.065,'#335265',28,.88);
 for(const x of[-8.8,-5.65,-2.5,.65,3.8])this.econMesh('v14-entry-handle-frame',x,4.0,24.08,.08,4.05,.16,'#aab4b2',29,.96);
 for(const x of[-6.9,-.9,2.3])this.econMesh('v14-door-pull',x,3.65,24.29,.048,.65,.15,'#b4beb8',29,.97);
 this.box(-2.5,1.98,26.7,19.8,.35,7.4,C.paving,26,.26);
 for(let k=0;k<10;k++)this.econMesh('v14-entry-tread',-2.5,.20+k*.176,35.3-k*.52,23.1,.35,1.15,'#bec1b8',26,.19);
 for(const s of[-1,1]){let x=-2.5+s*12.05;this.beam([x,1.2,35.6],[x,2.98,30.3],.055,'#879897',29,.32);for(let k=0;k<5;k++)this.cyl(x,.39+k*.35,35.4-k*1.06,.044,.92,'#83918e',8,1,29,.3);}
 for(let f=0;f<5;f++)this.econWindow(-32.0,3.0+f*4.56,31.57,3.45,2.72,0,'v14-front-return-window');
 // Brick side and back windows are approximate, clearly labelled as such.
 for(let f=0;f<5;f++)for(let i=0;i<9;i++)this.econWindow(-31.4+i*7.72,3.0+f*4.56,-34.08,3.45,2.72,Math.PI,'v14-back-window');
 for(let f=0;f<5;f++)for(let i=0;i<8;i++)this.econWindow(-36.55,3+f*4.56,-29+i*7.4,3.50,2.72,-Math.PI/2,'v14-side-window');
 // The garden is contextual: no claim of surveyed paths or tree counts.
 this.box(-2,.18,35.8,72,.24,9.4,C.paving,26,.08);
 for(const x of[-32,28]){this.box(x,.31,32.2,5.3,.23,4.6,'#8d9787',24,.11);this.box(x,.46,32.2,4.7,.10,4.0,'#5e7653',23,.11);this.gsmSapling(x,32.2,7.1,x+450);}
 for(const x of[-15,18]){this.local(x,0,38.0,0,()=>this.bench(0,0));for(let k=0;k<8;k++)this.econMesh('v14-drain-grille',x-2+k*.56,.321,33.8,.30,.014,.14,'#536761',29,.08);}
};
P.economicsMarker=function(){
 this.noPlant(0,0,7.6,3.6);this.solid(0,0,6.35,1.8);this.box(0,.20,0,7.0,.38,2.55,'#97978b',24,.18);this.econMesh('v14-name-stone',0,1.38,0,6.32,2.02,1.25,'#c6bfb0',24,.60);this.box(0,2.43,0,6.38,.11,1.28,'#cbc6b9',24,.62);
 this.econCaption('经济学院',0,1.73,.6265,5.0,1.0,'v14-stone-name-glyph','#a28b53',.60);
 this.econCaption('School of Economics',0,.92,.6265,5.45,.48,'v14-stone-english','#a28b53',.60);
 // No fabricated official seal. Its absence is explicit in the data note.
};
})(YY);
