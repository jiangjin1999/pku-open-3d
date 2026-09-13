/* Individually observed silhouettes. Hidden faces and carved detail remain approximations. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,stone='#b5b4a5',bronze='#68715b';
function prism(b,key,outline,depth,col){const geo=b.geo(key,()=>{const g=new G.Geometry();let cx=outline.reduce((s,p)=>s+p[0],0)/outline.length,cy=outline.reduce((s,p)=>s+p[1],0)/outline.length;for(let i=0;i<outline.length;i++){const p=outline[i],q=outline[(i+1)%outline.length];g.tri([cx,cy,depth/2],[p[0],p[1],depth/2],[q[0],q[1],depth/2]);g.tri([cx,cy,-depth/2],[q[0],q[1],-depth/2],[p[0],p[1],-depth/2]);g.quad([p[0],p[1],depth/2],[p[0],p[1],-depth/2],[q[0],q[1],-depth/2],[q[0],q[1],depth/2]);}return g});b.mesh(key,geo,0,0,0,1,1,1,col,10);}
function turned(b,key,profile,col=stone){const geo=b.geo(key,()=>{const g=new G.Geometry(),n=40;for(let j=1;j<profile.length;j++)for(let i=0;i<n;i++){const a=2*Math.PI*i/n,c=2*Math.PI*(i+1)/n,p=profile[j-1],q=profile[j];g.quad([p[1]*Math.cos(a),p[0],p[1]*Math.sin(a)],[q[1]*Math.cos(a),q[0],q[1]*Math.sin(a)],[q[1]*Math.cos(c),q[0],q[1]*Math.sin(c)],[p[1]*Math.cos(c),p[0],p[1]*Math.sin(c)]);}return g;});b.mesh(key,geo,0,0,0,1,1,1,col,10);}
function loft(b,key,rows,col=bronze){
 const geo=b.geo(key,()=>{const g=new G.Geometry(),N=40,pt=(r,a)=>[(r[3]||0)+r[1]*Math.cos(a),r[0],(r[4]||0)+r[2]*Math.sin(a)];
  for(let j=1;j<rows.length;j++)for(let k=0;k<N;k++){const a=k*Math.PI*2/N,c=(k+1)*Math.PI*2/N,p=rows[j-1],q=rows[j],dy=q[0]-p[0];
   const normal=(r,t)=>{const k=rows.indexOf(r),lo=rows[Math.max(0,k-1)],hi=rows[Math.min(rows.length-1,k+1)],span=hi[0]-lo[0],nx=Math.cos(t)/r[1],nz=Math.sin(t)/r[2];return Y.M.norm([nx,-((hi[1]-lo[1])*Math.cos(t)*nx+(hi[2]-lo[2])*Math.sin(t)*nz+((hi[3]||0)-(lo[3]||0))*nx+((hi[4]||0)-(lo[4]||0))*nz)/span,nz]);};
   const A=pt(p,a),B=pt(q,a),C=pt(q,c),D=pt(p,c);g.tri(A,B,C,undefined,[normal(p,a),normal(q,a),normal(q,c)]);g.tri(A,C,D,undefined,[normal(p,a),normal(q,c),normal(p,c)]);
  }return g;});b.mesh(key,geo,0,0,0,1,1,1,col,10);
}
function head(b,x,y,z,s,moustache=false){
 b.local(x,y,z,0,()=>{
  loft(b,'portrait34-head-'+s,[[-.25*s,.065*s,.075*s,0,-.012*s],[-.18*s,.125*s,.115*s],[-.07*s,.161*s,.141*s],[.055*s,.173*s,.144*s],[.17*s,.162*s,.132*s],[.235*s,.113*s,.098*s],[.261*s,.015*s,.015*s]]);
  for(const side of[-1,1]){
   b.sphere(side*.174*s,-.005*s,-.008*s,.029*s,.064*s,.032*s,bronze,10,0,true);
   b.beam([side*.025*s,.068*s,.137*s],[side*.117*s,.06*s,.116*s],.011*s,bronze,10);
   b.beam([side*.037*s,.027*s,.143*s],[side*.101*s,.026*s,.13*s],.005*s,'#46503f',10);
  }
  b.sphere(0,-.010*s,.153*s,.029*s,.065*s,.037*s,bronze,10,0,true);
  b.beam([-.047*s,-.111*s,.119*s],[.047*s,-.111*s,.119*s],.007*s,'#4d5845',10);
  if(moustache)for(const side of[-1,1])b.beam([side*.012*s,-.075*s,.151*s],[side*.096*s,-.116*s,.119*s],.017*s,'#46523d',10);
 });
}
P.liDazhao33=function(){
 this.box(0,.10,0,1.85,.20,1.55,stone,10);this.box(0,.29,0,1.32,.18,1.12,stone,10);this.box(0,1.07,0,1.12,1.40,.96,'#a8ada4',10);this.box(0,1.83,0,1.28,.14,1.08,stone,10);this.lettering('李大钊',0,1.28,.492,.72,.28,0,'#716c59');
 this.local(0,1.9,0,0,()=>{loft(this,'li34-bust',[[0,.60,.20],[.09,.59,.22],[.20,.54,.235],[.30,.44,.23],[.39,.31,.20],[.47,.185,.16],[.54,.16,.14]]);this.cyl(0,.45,0,.14,.18,bronze,20,1,10);head(this,0,.86,0,1.28,true);this.sphere(0,1.062,-.027,.212,.073,.176,'#45533e',10,0,true);for(const side of[-1,1])this.sphere(side*.209,.969,-.015,.035,.116,.135,'#45533e',10,0,true);this.local(0,0,.176,0,()=>prism(this,'li33-goatee',[[-.075,.735],[.078,.735],[.064,.638],[0,.599],[-.05,.643]],.045,'#46523b')); for(const s of[-1,1])this.beam([s*.17,.60,.13],[s*.12,.48,.17],.027,bronze,10);this.beam([0,.41,.20],[0,.02,.20],.012,'#3b4937',10);});
};
P.cervantes33=function(){
 this.box(0,.09,0,1.55,.18,1.30,stone,10);this.box(0,.23,0,1.23,.13,1.04,stone,10);this.box(0,.68,0,1.04,.80,.88,'#aaa99e',10);this.box(0,1.13,0,1.16,.13,1.0,stone,10);this.lettering('塞万提斯',0,.76,.45,.84,.20,0,'#716c59');
 this.local(0,1.20,0,0,()=>{
 for(const s of[-1,1]){loft(this,'cerv34-leg-'+s,[[.09,.087,.09,s*.17,.05],[.35,.095,.095,s*.15,.01],[.61,.115,.12,s*.14,0],[.86,.12,.13,s*.13,0]]);this.sphere(s*.17,.08,.12,.11,.07,.21,bronze,10,0,true);}
 loft(this,'cerv33-doublet-rounded',[[.81,.27,.18],[.96,.25,.19],[1.13,.235,.20],[1.40,.28,.21],[1.63,.31,.19],[1.73,.23,.16],[1.78,.17,.13]]);
 this.local(.19,0,-.13,0,()=>{const key='cerv33-draped-cloak',g=this.geo(key,()=>{const g=new G.Geometry();for(let j=0;j<26;j++)for(let k=0;k<32;k++){
  const point=(u,v)=>{const a=.10+v*Math.PI*1.12,y=.43+u*1.29,r=.47-.16*u;return [Math.cos(a)*r,y,-Math.sin(a)*(.24+.06*(1-u))+.033*Math.sin(v*40)*(1-u)];};
  const a=point(j/26,k/32),b=point((j+1)/26,k/32),c=point((j+1)/26,(k+1)/32),d=point(j/26,(k+1)/32);g.quad(a,b,c,d);g.quad(d,c,b,a);
 }return g;});this.mesh(key,g,0,0,0,1,1,1,'#5b6850',10);});
 head(this,0,2.02,0,.98,true);this.sphere(0,2.18,-.01,.19,.11,.17,'#526348',10,0,true);for(let k=0;k<13;k++){const a=k/13*Math.PI*2;this.sphere(Math.cos(a)*.17,2.18+Math.sin(a)*.022,Math.sin(a)*.135-.015,.040,.055,.035,'#56664a',10,0,true);}this.local(0,0,.14,0,()=>prism(this,'cerv33-pointed-beard',[[-.07,1.95],[.07,1.95],[.056,1.85],[0,1.80],[-.05,1.85]],.038,'#526247'));
 for(let j=0;j<11;j++){const a=j*Math.PI*2/11;this.sphere(Math.cos(a)*.16,1.80,Math.sin(a)*.14,.04,.026,.043,bronze,10,0,true);}
 for(const side of[-1,1])loft(this,'cerv34-sleeve-'+side,[[1.12,.125,.125,side*.43,.055],[1.22,.14,.15,side*.42,.035],[1.40,.15,.16,side*.35,.01],[1.58,.16,.17,side*.28,0],[1.69,.115,.13,side*.24,-.01]]);
 loft(this,'cerv34-left-forearm',[[.995,.11,.095,-.65,.18],[1.08,.14,.11,-.58,.12],[1.18,.125,.12,-.44,.06]]);
 this.sphere(-.68,1.01,.18,.075,.06,.07,bronze,10,0,true);this.box(-.72,.94,.24,.35,.055,.22,'#74816a',10,0,-.14);for(const x of[-.87,-.57])this.sphere(x,.968,.25,.07,.035,.12,bronze,10,0,true);
 loft(this,'cerv34-right-forearm',[[1.01,.09,.085,.27,.17],[1.11,.11,.10,.35,.12],[1.22,.12,.13,.43,.04]]);this.sphere(.27,1.03,.17,.07,.08,.065,bronze,10,0,true);
 this.beam([.34,1.06,.03],[.54,.18,-.04],.027,'#394b38',10);this.beam([.24,1.06,.06],[.47,1.10,.06],.022,bronze,10);
 for(let j=0;j<7;j++)this.sphere(0,1.11+j*.07,.18,.015,.017,.015,'#66715b',10,0,true);
 });
};
P.fiveOfferings33=function(){
 this.box(0,.08,0,5.6,.16,3.1,'#b7b6aa',10);
 // Altar sits behind the five free-standing vessels, as in the official photo.
 this.local(0,0,-.68,0,()=>{this.box(0,.24,0,4.75,.22,.98,stone,10);this.box(0,.77,0,4.32,.86,.73,stone,10);this.box(0,1.26,0,4.8,.20,1.05,stone,10);for(let x=-2.2;x<=2.2;x+=.20){this.sphere(x,1.10,.41,.075,.10,.065,'#a5a99b',10,0,true);this.sphere(x,.45,.41,.075,.09,.065,'#a5a99b',10,0,true);}});
 const vase=[[0,.32],[.10,.35],[.17,.24],[.25,.20],[.34,.24],[.48,.30],[.66,.35],[.88,.28],[1.00,.17],[1.10,.17],[1.13,.27],[1.21,.29],[1.23,0]];
 const candle=[[0,.33],[.10,.36],[.17,.31],[.24,.24],[.65,.19],[.71,.28],[.80,.31],[.86,.30],[.88,.09],[1.01,.09],[1.04,0]];
 for(const s of[-1,1]){this.local(s*2.05,.16,.61,0,()=>turned(this,'offering33-vase',vase));this.local(s*1.02,.16,.61,0,()=>turned(this,'offering33-candle',candle));}
 this.local(0,.16,.61,0,()=>{turned(this,'offering33-censer',[[0,.45],[.10,.49],[.18,.44],[.29,.33],[.40,.38],[.50,.43],[.78,.47],[.96,.39],[1.02,.30],[1.08,.33],[1.13,.26],[1.36,.21],[1.41,0]]);for(const s of[-1,1])this.beam([s*.38,.63,0],[s*.47,.29,0],.095,stone,10);});
};
P.stoneScreen33=function(){
 this.box(0,.08,0,4.4,.16,.92,stone,10);
 for(let i=0;i<4;i++){const x=(i-1.5)*1.01;this.box(x,1.55,0,.97,2.94,.32,'#bfc0af',10);for(const s of[-1,1])this.box(x+s*.40,1.51,.19,.065,2.72,.065,'#aeb29f',10);this.box(x,.25,.19,.83,.14,.09,stone,10);this.box(x,2.90,.19,.83,.13,.09,stone,10);for(const s of[-1,1]){this.sphere(x+s*.27,2.83,.22,.16,.08,.035,stone,10,0,true);this.sphere(x+s*.28,.29,.22,.14,.06,.035,stone,10,0,true);}}
 // Letter shapes are omitted rather than inventing engraved calligraphy.
 for(let x=-2.3;x<=2.3;x+=.575)this.box(x,.61,.78,.04,1.12,.04,'#596457',29);
 this.box(0,1.15,.78,4.65,.045,.045,'#596457',29);this.box(0,.18,.78,4.65,.045,.045,'#596457',29);
};
P.martyrs33=function(){
 this.box(0,.07,0,9.1,.14,3.3,'#aeb19f',10);
 this.local(-1.8,0,.52,0,()=>prism(this,'martyrs33-front',[[-2.55,.16],[3.0,.16],[-1.95,3.15],[-2.70,2.45]],.53,'#baae8a'));
 this.local(2.15,0,-.45,0,()=>prism(this,'martyrs33-rear',[[-2.10,.16],[2.35,.16],[-.30,2.13],[-1.25,1.65]],.48,'#aea084'));
 this.lettering('北京大学',-3.05,2.06,.795,1.42,.29,0,'#716c59');this.lettering('革命烈士纪念碑',-2.78,1.54,.795,2.68,.28,0,'#716c59');
};
P.southwestStele33=function(){
 this.box(0,.08,0,1.92,.16,1.44,stone,10);this.box(0,.30,0,1.43,.28,1.12,stone,10);this.box(0,.48,0,1.65,.15,1.26,stone,10);
 const pts=[[-.54,.56],[.54,.56],[.54,2.84],[.70,2.84]];for(let i=0;i<=18;i++){const a=i*Math.PI/18;pts.push([.70*Math.cos(a),2.84+.67*Math.sin(a)]);}pts.push([-.54,2.84]);prism(this,'southwest33-stele',pts,.38,'#b5bdb7');
 for(let j=0;j<22;j++)this.box(0,.84+j*.053,.196,.69,.012,.004,'#7f8982',10);
};

P.grabau33=function(){
 for(let i=0;i<3;i++)this.box(0,.08+i*.16,0,2.85-i*.25,.16,1.65-i*.18,'#424d4d',10);
 this.local(0,.48,-.10,0,()=>prism(this,'grabau33-stone',[[-1.08,0],[1.08,0],[.94,1.32],[0,1.52],[-.94,1.32]],.26,'#c7c9bd'));
 this.lettering('葛利普教授之墓',0,1.12,.042,1.64,.23,0,'#a59050');this.lettering('1870 — 1946',0,1.52,.042,1.24,.17,0,'#a59050');
};
P.meiStele33=function(){
 this.box(0,.08,0,2.1,.16,1.28,stone,10);this.box(0,.31,0,1.58,.30,.94,stone,10);this.box(0,.51,0,1.89,.17,1.11,stone,10);
 this.box(0,1.55,0,1.43,1.96,.36,'#bfc1b1',10);this.mesh('mei33-stone-cap',this.geo('mei33-stone-cap',()=>G.roof(.62)),0,2.57,0,1.99,.39,.99,'#bdc1b1',10);this.box(0,2.56,0,1.99,.13,.99,'#b9bfae',10);
 for(const side of[-1,1])for(let j=0;j<=10;j++)this.box(-1.22+j*.244,.63,side*.85,.033,1.06,.033,'#3e5a4c',29);
 for(const side of[-1,1])this.box(0,1.13,side*.85,2.5,.04,.04,'#3e5a4c',29);
};
P.halfmoonStele33=function(){
 this.box(0,.11,0,1.65,.22,.85,'#a7aa98',10);this.box(0,1.22,0,1.02,1.98,.26,'#bbbca9',10);
 const cap=[[-.72,2.18],[.72,2.18],[.77,2.37],[.71,2.48],[.48,2.52],[.36,2.68],[.17,2.70],[0,2.79],[-.17,2.70],[-.36,2.68],[-.48,2.52],[-.71,2.48],[-.77,2.37]];
 prism(this,'halfmoon33-cap',cap,.33,'#b2b5a1');
 for(const side of[-1,1]){this.box(side*.45,1.24,.15,.035,1.84,.027,'#a0a78f',10);for(let j=0;j<3;j++)this.sphere(side*(.18+j*.19),2.57-j*.067,.174,.11,.07,.025,'#a1aa90',10,0,true);}
 this.beam([-.48,1.03,.146],[.47,1.15,.146],.012,'#939d85',10);
};
P.plantingStele33=function(){
 const pts=[[-.60,0],[.59,0],[.62,1.61]];for(let i=0;i<=9;i++){const a=i*Math.PI/18;pts.push([.42+.20*Math.cos(a),1.62+.20*Math.sin(a)]);}pts.push([-.42,1.82]);for(let i=0;i<=9;i++){const a=Math.PI/2+i*Math.PI/18;pts.push([-.42+.20*Math.cos(a),1.62+.20*Math.sin(a)]);}prism(this,'planting33-stone',pts,.23,'#999f96');
 for(const side of[-1,1])this.box(side*.48,.88,.121,.018,1.43,.005,'#8d958a',10);this.box(0,1.62,.121,.95,.018,.005,'#8d958a',10);
};
P.snowArch33=function(){
 for(const side of[-1,1]){this.box(side*1.32,1.75,0,.40,3.5,.43,'#bbb9aa',10);this.box(side*1.32,.12,0,.55,.24,.65,stone,10);this.box(side*1.32,1.9,.23,.26,2.5,.05,'#c7c2b1',10);}
 this.box(0,3.13,0,2.3,.35,.34,'#b9b6a7',10);this.box(0,3.52,0,3.25,.30,.54,'#c3c0b1',10);this.box(0,3.70,0,3.4,.15,.64,stone,10);
 this.lettering('断桥残雪',0,3.16,.186,1.7,.21,0,'#716c59');
};
P.willowArch33=function(){
 for(const side of[-1,1]){this.box(side*1.22,1.65,0,.39,3.3,.42,'#aaa997',10);for(const z of[-1,1])this.beam([side*1.22,2.97,z*.10],[side*1.76,.06,z*1.0],.065,'#858f85',29);}
 this.box(0,3.30,0,3.15,.28,.50,'#b6b29c',10);this.box(0,3.49,0,3.23,.13,.54,stone,10);
};

P.democracyScience33=function(){
 this.cyl(0,0,0,1.18,.26,'#bcb9aa',8,1,10);
 const ribbon=(key,curve,width)=>{const geo=this.geo(key,()=>{const g=new G.Geometry(),n=100,edges=[];for(let i=0;i<=n;i++){const t=i/n,a=curve(t),prev=curve(Math.max(0,t-.0001)),next=curve(Math.min(1,t+.0001)),dx=next[0]-prev[0],dy=next[1]-prev[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*width/2,ny=dx/l*width/2;edges.push([[a[0]-nx,a[1]-ny,a[2]],[a[0]+nx,a[1]+ny,a[2]]]);}for(let i=0;i<n;i++){const [p,q]=edges[i],[v,r]=edges[i+1];g.quad(p,v,r,q);g.quad(q,r,v,p);}return g;});this.mesh(key,geo,0,.27,0,1,1,1,'#a5aea9',29);};
 ribbon('ds33-d',t=>{const a=t*Math.PI*2;return[-.37+.56*Math.sin(a),.87+.80*Math.cos(a),-.12+.10*Math.sin(a)];},.27);
 ribbon('ds33-s',t=>[.66*Math.sin(t*Math.PI*1.63+.7),.05+t*2.06,.32*Math.sin(t*Math.PI*2)],.40);
 this.sphere(-.291,2.57,.0,.29,.29,.29,'#8c8e79',29,0,true);
};
P.laozi33=function(){
 const white='#d1d3c7';this.box(0,.08,0,1.62,.16,1.35,'#aeb4a8',10);this.cyl(0,.16,0,.66,.23,white,32,1,10);this.lettering('老子',0,.29,.66,.65,.19,0,'#716c59');
 this.local(0,.39,0,0,()=>{
 loft(this,'lao34-robe',[[0,.57,.45],[.12,.59,.45],[.30,.49,.37],[.62,.43,.31],[1.10,.40,.28],[1.43,.40,.28],[1.72,.30,.23],[1.81,.17,.15],[1.86,.05,.05]],white);
 this.sphere(0,1.95,0,.20,.26,.18,white,10,0,true);this.sphere(0,1.91,.165,.038,.077,.040,white,10,0,true);
 this.sphere(0,2.07,-.085,.205,.19,.15,white,10,0,true);
 loft(this,'lao34-beard',[[1.25,.018,.02,0,.34],[1.39,.065,.046,-.015,.36],[1.58,.14,.055,0,.34],[1.72,.15,.061,0,.30],[1.83,.10,.052,0,.25]],white);
 for(const side of[-1,1]){this.beam([side*.035,2.015,.15],[side*.118,2.01,.13],.012,white,10);this.beam([side*.046,1.985,.163],[side*.105,1.981,.145],.005,'#a6aea0',10);}
 for(let j=-2;j<=2;j++){const pts=[[j*.032,1.76,.357],[j*.040,1.62,.395],[j*.028+.018,1.46,.413],[j*.009,1.31,.372]];for(let k=1;k<pts.length;k++)this.beam(pts[k-1],pts[k],.008,'#bdc4b7',10);}
 for(const side of[-1,1])this.local(side*.32,0,.07,0,()=>loft(this,'lao34-sleeve-'+side,[[.66,.09,.12,side*.10,.06],[.81,.13,.16,side*.09,.08],[1.02,.16,.18,side*.06,.10],[1.25,.175,.19,side*.015,.06],[1.48,.16,.18,-side*.04,0],[1.66,.07,.09,-side*.12,-.025]],white));
 this.sphere(-.37,1.20,.31,.08,.10,.10,white,10,0,true);this.sphere(.34,1.39,.29,.075,.12,.09,white,10,0,true);
 for(const side of[-1,1])this.beam([side*.37,1.15,.32],[side*.42,.79,.23],.043,white,10);
 const robeRows=[[0,.57,.45],[.12,.59,.45],[.30,.49,.37],[.62,.43,.31],[1.10,.40,.28],[1.43,.40,.28]];
 for(let j=0;j<9;j++){const a=.17+j*Math.PI*2/9,pts=[];for(let k=0;k<=14;k++){const y=.08+k*.078;let n=1;while(n<robeRows.length-1&&robeRows[n][0]<y)n++;const p=robeRows[n-1],q=robeRows[n],t=(y-p[0])/(q[0]-p[0]),rx=p[1]+t*(q[1]-p[1]),rz=p[2]+t*(q[2]-p[2]),angle=a+.022*Math.sin(k*.4);pts.push([Math.cos(angle)*(rx+.008),y,Math.sin(angle)*(rz+.008)]);}for(let k=1;k<pts.length;k++)this.beam(pts[k-1],pts[k],.012,white,10);}
 this.box(0,1.17,.40,.62,.055,.025,white,10);
 for(const side of[-1,1])for(let j=0;j<3;j++)this.beam([side*(.14+j*.025),2.02,-.02],[side*(.23+j*.015),1.62,.05],.022,'#b6beaf',10);
 });
};

P.revitalization33=function(){
 this.local(0,0,0,0,()=>prism(this,'revitalization33-rock',[[-.83,.06],[.85,.06],[.88,.32],[.52,1.11],[.37,2.61],[.22,2.76],[-.14,2.57],[-.53,1.56]],.48,'#a89c7f'));
 for(const [i,ch]of [...'振興中華'].entries()){
 const key='revival-turquoise-'+ch;let uv=this.signs.get(key);if(!uv){const n=this.nSigns++,px=n%8*512,py=Math.floor(n/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.font='90px "Songti SC",serif';this.ctx.fillStyle='#60b4a2';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.save();this.ctx.translate(px+256,py+64);this.ctx.scale(4,1);this.ctx.fillText(ch,0,0);this.ctx.restore();uv=[px/4096,1-(py+128)/4096,512/4096,128/4096];this.signs.set(key,uv);}this.mesh('plane',this.geo('plane',G.plane),.035,2.16-i*.42,.249,.35,.39,1,'#ffffff',8,0,0,uv);
 }
};

P.pkuStar33=function(){
 this.box(0,.12,0,2.4,.24,1.72,'#aeb5ac',10);this.box(0,.58,0,1.93,.70,1.35,'#929d94',10);
 // Four separate curved bands; dimensions inferred from the two campus photographs.
 for(let k=0;k<4;k++){
  const radius=1.17+k*.255,width=.18,key='pku-star33-band-'+k;
  const geo=this.geo(key,()=>{const g=new G.Geometry();for(let j=0;j<64;j++){
   const a=-.12+j*(Math.PI+ .24)/64,c=-.12+(j+1)*(Math.PI+.24)/64;
   const q=(t,r,z)=>[-Math.cos(t)*r,2.85-Math.sin(t)*r,z];
   const i=radius-width/2,o=radius+width/2;
   g.quad(q(a,i,.20),q(a,o,.20),q(c,o,.20),q(c,i,.20));
   g.quad(q(c,i,-.20),q(c,o,-.20),q(a,o,-.20),q(a,i,-.20));
   g.quad(q(a,o,-.20),q(c,o,-.20),q(c,o,.20),q(a,o,.20));
   g.quad(q(c,i,-.20),q(a,i,-.20),q(a,i,.20),q(c,i,.20));
  }for(const t of[-.12,Math.PI+.12]){const q=(r,z)=>[-Math.cos(t)*r,2.85-Math.sin(t)*r,z],i=radius-width/2,o=radius+width/2;g.quad(q(i,-.20),q(o,-.20),q(o,.20),q(i,.20));}return g;});this.mesh(key,geo,0,0,-k*.055,1,1,1,'#adb5ad',29);
 }
 this.beam([-.10,.92,0],[-.25,1.22,0],.13,'#909f94',29);
 this.sphere(-1.0,2.77,.19,.32,.32,.32,'#b4a16b',29,0,true);
};
})(YY);
