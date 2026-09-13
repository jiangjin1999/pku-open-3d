/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* Guanghua #2: original geometry traced qualitatively from the east exterior.
   Building dimensions/courtyard/back elevations are approximate. +Z = east front
   after the documented 90° group rotation. No photographic facade is pasted on. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
const C={brick:'#565761',edge:'#555b61',glass:'#355f87',dark:'#263940',frame:'#a6afb4',silver:'#bfc7ca',stone:'#a1a49e',paving:'#bbbdb7',roof:'#878e8d'};
P.gsmMesh=function(key,x,y,z,w,h,d,color,mat=24,part=.7,r=0){this.mesh(key,this.geo(key,G.box),x,y,z,w,h,d,color,mat,part,r);};
// Individual glazing panels plus independent pressure caps: large panes do not
// conceal a full-size opaque wall immediately behind them.
P.gsmCurtain=function(x,y,z,w,h,cols,rows,r=0,part=.9){this.local(x,y,z,r,()=>{
 const cw=w/cols,rh=h/rows;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
  const xx=-w/2+(i+.5)*cw,yy=-h/2+(j+.5)*rh;
  this.gsmMesh('v13-curtain-pane',xx,yy,-.15,cw-.085,rh-.09,.045,(i+j*2)%9===0?'#557b9c':C.glass,28,part);
  if(j%2===0&&i%4===1){this.gsmMesh('v13-spandrel',xx,yy-rh*.28,-.18,cw-.10,rh*.41,.035,'#6487a8',28,part+.012);}
 }
 for(let i=0;i<=cols;i++)this.gsmMesh('v13-aluminium-mullion',-w/2+i*cw,0,.01,.075,h+.05,.16,C.frame,29,part+.02);
 for(let j=0;j<=rows;j++)this.gsmMesh('v13-aluminium-mullion',0,-h/2+j*rh,.012,w+.075,.065,.16,C.frame,29,part+.024);
 // Narrow outer reveals give deep glazing edges and real contact shadow.
 for(const s of[-1,1]){this.gsmMesh('v13-window-reveal',s*(w/2+.055),0,-.24,.09,h+.1,.57,C.edge,29,part+.03);this.gsmMesh('v13-window-reveal',0,s*(h/2+.05),-.24,w+.11,.10,.57,C.edge,29,part+.03);}
 });};
P.gsmWindow=function(x,y,z,w,h,r=0){this.local(x,y,z,r,()=>{
 this.box(0,0,-.11,w+.12,h+.14,.26,'#28383b',20,.70);this.gsmCurtain(0,0,.13,w-.20,h-.20,2,2,0,.80);
 for(const s of[-1,1]){this.gsmMesh('v13-projecting-frame',s*w/2,0,.30,.13,h+.28,.62,C.silver,29,.88);this.gsmMesh('v13-projecting-frame',0,s*h/2,.30,w+.13,.13,.62,C.silver,29,.88);}
 this.box(0,-h/2-.17,.40,w+.36,.15,.91,'#888d8d',24,.89);
 });};
P.gsmRoof=function(x,y,z,w,d){this.local(x,y,z,0,()=>{
 this.box(0,0,0,w,.22,d,C.roof,21,2.3);
 for(const s of[-1,1]){this.box(s*(w/2-.15),.34,0,.30,.79,d,C.brick,27,2.4);this.box(0,.34,s*(d/2-.15),w,.79,.30,C.brick,27,2.4);this.box(s*(w/2-.15),.78,0,.45,.08,d+.12,C.edge,29,2.43);this.box(0,.78,s*(d/2-.15),w+.12,.08,.45,C.edge,29,2.43);}
 for(let zz=-d/2+2;zz<d/2-1;zz+=3.4)this.box(0,.125,zz,w-.7,.012,.023,'#6d7776',21,2.32);
 });};
// Vertical signage uses one atlas glyph per character, not a stretched horizontal
// label. Typeface approximates legibility, not a reproduction of calligraphy.
P.gsmVerticalTitle=function(text,x,y,z,size=1.16){for(let i=0;i<text.length;i++){
 const glyph=text[i],key='v13-glyph-'+glyph;let uv=this.signs.get(key);if(!uv){let k=this.nSigns++,px=(k%8)*512,py=Math.floor(k/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.font='500 88px "Noto Serif CJK SC","Songti SC",serif';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.fillStyle='#dde1de';this.ctx.fillText(glyph,px+256,py+64);uv=[(px+196)/4096,1-(py+124)/4096,120/4096,120/4096];this.signs.set(key,uv);}
 const hh=size*120/88;this.mesh('v13-vertical-character',this.geo('v13-vertical-character',G.plane),x,y-i*size*1.30,z,hh,hh,1,'#ffffff',8,1.5,0,uv);
 }};
// The eastern entrance text records magnolias; these are decorative broadleaf
// saplings, not a surveyed count or a botanical scan of actual trees.
P.gsmSapling=function(x,z,h,seed){this.local(x,.5,z,0,()=>{const R=M.rng(seed),ends=[];
 this.cyl(0,0,0,.15,h*.71,'#7a705b',9,.46,20,.10);
 for(let k=0;k<13;k++){let a=k*2.399,yy=h*(.33+k*.034),rad=h*(.22+R()*.06),end=[Math.cos(a)*rad,yy+h*.16,Math.sin(a)*rad];this.beam([0,yy,0],end,.045,'#70634d',20,.10);ends.push(end);}
 const key='v13-broad-leaf-'+seed,geo=this.geo(key,()=>{const g=new G.Geometry(),rr=M.rng(seed*31);for(let k=0;k<330;k++){let c=ends[k%13],a=rr()*Math.PI*2,r=.1+rr()*1.20,p=[c[0]+Math.cos(a)*r,c[1]+(rr()-.3)*1.55,c[2]+Math.sin(a)*r],n=M.norm([rr()-.5,.10+rr()*.75,rr()-.5]),side=M.norm(M.cross(n,[0,1,0])),up=M.cross(n,side),sz=.23+rr()*.15,pt=(x,y)=>M.add(p,M.add(M.mul(side,x*sz),M.mul(up,y*sz)));g.quad(pt(-1,-1),pt(1,-1),pt(1,1),pt(-1,1),n);}return g;});
 const anim=this.anim;this.anim=1;this.mesh(key,geo,0,0,0,1,1,1,'#637b46',16,.1);this.anim=anim;
 });};
P.guanghuaTwo=function(p,w=80,d=75){
 this.noPlant(0,5,86,106);
 // Gross plan follows the existing map envelope. Unknown inner court is kept
 // as a qualified massing study rather than claiming a room-by-room floorplan.
 const blocks=[[-39,-3,2,62,22.6],[-20,-30,40,12,22.6],[0,-27,80,18,22.6],[8.5,7.5,19,54,30.5],[37,-1,6,61,23.6]];
 for(const [x,z,bw,bd,h]of blocks){this.solid(x,z,bw,bd);this.box(x,h/2+.40,z,bw,h,bd,C.brick,27,.60);this.box(x,.29,z,bw+.25,.58,bd+.25,'#757e7a',24,.2);}
 // Long east glass wing and recessed colonnade. Plates end at the rear glass
 // line on the bottom tiers and cantilever to the outer upper facade.
 this.solid(-20,-2,38,42);this.box(-20,1.05,-2,38,1.3,42,'#8d9490',24,.24);
 for(let f=0;f<5;f++){let y=1.73+f*4.31;this.box(-20,y,-3.0,38,.22,42,'#8a9192',24,.75+f*.035);}
 this.gsmCurtain(-20,11.9,21.1,38,20.65,16,10,0,.95);
 this.gsmRoof(-20,22.75,-3,40,54);
 // Two bays are shown ajar with actual small hinged sashes, as a visual study;
 // no live state of the real windows is implied.
 for(const x of[-31.85,-17.6])this.local(x,17.89,21.20,.14,()=>{this.box(0,0,0,2.15,1.95,.04,'#7b9eaa',28,1.02);for(const s of[-1,1])this.box(s*1.08,0,.06,.065,1.98,.09,C.frame,29,1.04);});
 for(let i=0;i<6;i++){const x=-37.4+i*6.08;this.gsmMesh('v13-entry-pier',x,5.6,29.2,1.15,10.9,1.36,C.stone,24,.9);this.box(x,.28,29.2,1.38,.50,1.65,'#8c9390',24,.25);this.box(x,11.20,28.7,1.15,.25,3.6,C.edge,29,1.0);}
 this.box(-22.2,11.48,28.1,33.9,.28,4.3,'#707a7f',29,1.25);
 this.box(-20,.24,28.2,41,.38,12.8,C.paving,26,.12);
 // Distinct central tower: brick wall, five-metre glass slit, and taller right
 // pier. Thin glass between solid masonry, no generic evenly spaced facade.
 this.box(1.0,16.2,34.85,9.1,31.55,.42,C.brick,27,1.18);
 this.gsmCurtain(8.02,15.1,35.16,4.72,29.40,2,13,0,1.24);
 this.box(14.30,16.4,35.25,7.52,32.1,1.04,C.brick,27,1.21);
 // Avoid an intact opaque backing immediately behind the tower glass strip.
 // Main tower core is behind the slit; the visible reveal recess is 0.5m deep.
 this.gsmVerticalTitle('光华管理学院',-.65,24.9,35.13,1.19);
 // No invented school crest: just the verified school name in neutral lettering.
 this.gsmRoof(8.5,31.13,7.5,19.3,54.0);
 this.box(14.35,31.72,8.8,7.58,1.4,53.30,C.brick,27,2.5);
 this.box(14.35,32.45,8.8,7.75,.10,53.42,C.edge,29,2.54);
 this.local(18.04,0,5.0,Math.PI/2,()=>{for(let f=0;f<5;f++)for(let i=0;i<6;i++)this.gsmWindow(-20+i*7.1,3.0+f*5.0,.03,2.25,3.05);});
 // Northern return: individual projecting silver window surrounds and clerestory.
 for(let f=0;f<4;f++)for(let i=0;i<4;i++)this.gsmWindow(21+i*5.0,3.20+f*4.65,-17.86,3.0,2.68);
 this.gsmCurtain(28.0,21.6,-17.85,22.0,2.05,9,1,0,1.3);this.box(28,23.31,-16.7,24.4,.32,3.7,C.edge,29,2.0);
 // Low, gently bowed glass entrance: independent sloped cap, mullions, upper
 // silver band and doors. Curve is fitted visually, not an engineering profile.
 const x0=18.05,x1=39.9,N=18,front=x=>21.7+2.9*Math.sin((x-x0)/(x1-x0)*Math.PI);
 const fascia=this.geo('v13-curved-lobby-fascia',()=>{let g=new G.Geometry();for(let i=0;i<N;i++){let a=x0+(x1-x0)*i/N,b=x0+(x1-x0)*(i+1)/N,za=front(a),zb=front(b);g.quad([a,8.35,za],[b,8.35,zb],[b,9.45,zb],[a,9.45,za]);g.quad([a,9.45,za],[b,9.45,zb],[b,9.45,zb-1.45],[a,9.45,za-1.45]);g.quad([a,8.33,za],[a,8.33,za-1.45],[b,8.33,zb-1.45],[b,8.33,zb]);}return g;});
 this.mesh('v13-curved-lobby-fascia',fascia,0,0,0,1,1,1,'#abbcc3',29,1.55);
 for(let i=0;i<N;i++){let a=x0+(x1-x0)*i/N,b=x0+(x1-x0)*(i+1)/N,za=front(a),zb=front(b),xx=(a+b)/2,zz=(za+zb)/2,angle=-Math.atan2(zb-za,b-a),ww=Math.hypot(b-a,zb-za);this.gsmCurtain(xx,4.36,zz,ww,7.71,1,3,angle,1.02);}
 this.solid(28.1,17.0,20.0,8.5);this.box(28.1,9.2,17.0,20,.32,8.8,'#909d9e',21,2.04);
 for(let i=-1;i<=1;i++){const x=28.5+i*1.7,z=front(x)+.07;this.box(x,1.90,z,.06,3.05,.09,C.frame,29,1.13);this.box(x+.24,1.74,z+.16,.055,.74,.105,'#c5c9c7',29,1.14);}
 for(let j=0;j<3;j++)this.box(28.5,.14+j*.12,25.95-j*.52,14.3,.23,1.15,C.stone,26,.16);
 // Approximate back / lateral windows carry explicit uncertainty in the UI.
 this.gsmRoof(0,23.10,-27,80,18);this.gsmRoof(37,24.07,-1,6,61);
 for(const [xx,r]of[[-40.09,-Math.PI/2],[40.09,Math.PI/2]])for(let f=0;f<4;f++)for(let i=0;i<8;i++)this.gsmWindow(xx,3.5+f*4.65,-30+i*7.4,3.20,2.75,r);
 for(let f=0;f<4;f++)for(let i=0;i<13;i++)this.gsmWindow(-36.7+i*6.1,3.5+f*4.65,-36.10,3.45,2.75,Math.PI);
 // The court is genuinely open but its layout is a modelling approximation.
 this.box(26,.22,0,15.5,.22,25.2,'#afb5ac',26,.08);this.box(26,.35,-1,8.4,.12,12.0,'#78896a',23,.08);this.local(21,0,0,Math.PI/2,()=>this.bench(0,0));
 // Front paving, drainage slots, tree pits and benches are separated from the
 // solid-building map. Decorative trees are not a claim of a tree survey.
 this.box(0,.17,43.0,79,.24,13.0,C.paving,26,.08);
 for(let x=-36;x<39;x+=1.1)this.box(x,.311,37.50,.55,.015,.13,'#586260',29,.09);
 for(const x of[-32,-17,18,35]){this.box(x,.37,44.6,3.7,.18,3.7,'#777e76',24,.11);this.box(x,.48,44.6,3.3,.06,3.3,'#66765c',23,.11);}
 for(const [i,x]of[-32,-17,18,35].entries())this.gsmSapling(x,44.6,[9.3,8.9,8.3,10.0][i],i+451);
 for(const x of[-26,28])this.local(x,0,48.0,0,()=>this.bench(0,0));
 for(const x of[-38,39]){this.box(x,2.65,44.8,.15,5.2,.15,'#5c6c6e',29,.6);this.box(x,5.31,44.8,.52,.24,.36,'#c0c9c1',24,.65);}
};
// The inscription is a face-conformal decal, 1.5 mm above the stone rather
// than a vertical floating text plane. It remains attached while exploding.
P.gsmMottoInscription=function(){
 const text='团结  博采  实践  创新',key='v13-motto-atlas',fontSize=Math.min(76,470/text.length);let uv=this.signs.get(key);
 if(!uv){let k=this.nSigns++,px=(k%8)*512,py=Math.floor(k/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.font=`500 ${fontSize}px "Noto Sans CJK SC","Microsoft YaHei",sans-serif`;this.ctx.fillStyle='#414c44';this.ctx.fillText(text,px+256,py+64);uv=[px/4096,1-(py+128)/4096,.125,.03125];this.signs.set(key,uv);}
 const h=Math.min(.49*128/fontSize,6.7*128/(fontSize*text.length)),w=h*4;
 const g=this.geo('v13-motto-conformal-lettering',()=>{let q=new G.Geometry(),pt=(x,y)=>[x,y,1.199-.18*y+.0015];return q.quad(pt(-w/2,.98-h/2),pt(w/2,.98-h/2),pt(w/2,.98+h/2),pt(-w/2,.98+h/2));});
 this.mesh('v13-motto-conformal-lettering',g,0,0,0,1,1,1,'#ffffff',8,.65,0,uv);
};
P.guanghuaMotto=function(p,w=9.25,d=3.25){
 this.noPlant(0,0,w+3,d+3);this.solid(0,0,w,d);
 this.box(0,.16,0,w,.3,d,'#979c91',26,.10);
 const key='v13-long-motto-stone',shape=this.geo(key,()=>{let g=new G.Geometry(),a=[[-4.3,.2,-1.16],[3.97,.2,-1.2],[4.18,.2,1.163],[-4.33,.2,1.163]],b=[[-3.91,1.61,-.94],[3.81,1.70,-.83],[3.88,1.53,.9236],[-3.87,1.47,.9344]];g.quad(a[0],a[1],a[2],a[3]);g.quad(b[3],b[2],b[1],b[0]);for(let i=0;i<4;i++)g.quad(a[i],b[i],b[(i+1)%4],a[(i+1)%4]);return g;});
 this.mesh(key,shape,0,0,0,1,1,1,'#a2a69a',24,.65);
 this.gsmMottoInscription();
};
})(YY);
