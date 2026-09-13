/* Layered crown forms, fitted to campus vegetation types rather than a tree census.
   Geometry is shared by form/variant. No Builder.random or per-frame allocation. */
(function(Y){'use strict';const {M,Geo:G}=Y;
const palette={broad:['#597b49','#68884e','#718d55'],spreading:['#587748','#63814a','#789057'],upright:['#647e42','#718a47','#7e9352'],pine:['#486b4d','#527655','#5a7e59'],cypress:['#466a4f','#507455','#597b59'],willow:['#729454','#7f9c5e','#6a8a4e']};
const seedOf=n=>Math.imul(n^0x31f90ad,0x45d9f3b)>>>0;
function geometry(type,variant){
 const R=M.rng(460913+variant*179+type.length*131),wood=new G.Geometry(),light=new G.Geometry(),shade=new G.Geometry(),lobes=[];
 const pine=type==='pine',cypress=type==='cypress',willow=type==='willow',upright=type==='upright',wide=type==='spreading';
 const crownWidth=cypress?.20:upright?.30:wide?.43:willow?.43:.37;
 // Swept tapered stems keep true branch crotches and a finer terminal hierarchy.
 function stem(a,b,r0,r1,n=8){const dir=M.norm(M.sub(b,a)),side=M.norm(M.cross(dir,Math.abs(dir[1])>.95?[1,0,0]:[0,1,0])),up=M.cross(dir,side);
  for(let j=0;j<n;j++){const a0=j*Math.PI*2/n,a1=(j+1)*Math.PI*2/n,rad=(ang,r)=>M.add(M.mul(side,Math.cos(ang)*r),M.mul(up,Math.sin(ang)*r)),p=M.add(a,rad(a0,r0)),q=M.add(a,rad(a1,r0)),s=M.add(b,rad(a0,r1)),t=M.add(b,rad(a1,r1));wood.quad(p,q,t,s);}
  // The thin tip is closed; roots and connected crotches are internal surfaces.
  for(let j=1;j<n-1;j++){const rad=i=>M.add(b,M.add(M.mul(side,Math.cos(i*Math.PI*2/n)*r1),M.mul(up,Math.sin(i*Math.PI*2/n)*r1)));wood.tri(rad(0),rad(j),rad(j+1));}
 }
 const lean=[(R()-.5)*.045,0,(R()-.5)*.045],trunk=[[0,0,0],[lean[0]*.2,.22,lean[2]*.2],[lean[0]*.7,.43,lean[2]*.7],[lean[0],.66,lean[2]],[lean[0]*1.2,.91,lean[2]*1.2]];
 for(let i=0;i<4;i++)stem(trunk[i],trunk[i+1],[.027,.020,.014,.007][i],[.020,.014,.007,.0025][i],10);
 const limbCount=cypress?11:pine?9:7;
 for(let j=0;j<limbCount;j++){
  const ang=j*2.399+variant*.49+(R()-.5)*.43,level=cypress?.19+j*.058:pine?.33+j*.058:.43+j*.047;
  const radial=crownWidth*(cypress?(1-(level-.15)*.83):pine?(1-(level-.30)*.62):(.75+R()*.22));
  const start=[lean[0]*level,level,lean[2]*level],elbow=[Math.cos(ang)*radial*.56,level+(pine?.025:.10),Math.sin(ang)*radial*.56];
  const end=[Math.cos(ang)*radial,level+(willow?.10:pine?.03:.18+R()*.045),Math.sin(ang)*radial];
  stem(start,elbow,.0095*(1-j/(limbCount*1.5)),.0058);stem(elbow,end,.0058,.0024);
  const tips=[];
  for(const sign of[-1,1]){const a=ang+sign*(.38+R()*.25),tip=[end[0]*.83+Math.cos(a)*radial*.29,end[1]+(willow?-.08:pine?.025:.055),end[2]*.83+Math.sin(a)*radial*.29];stem(M.lerp(elbow,end,.64),tip,.0028,.0009);tips.push(tip);}
  if(willow){const droop=[end[0]*1.03,end[1]-.24,end[2]*1.03];stem(end,droop,.0024,.0007);tips.push(M.lerp(end,droop,.6));}
  lobes.push({center:M.lerp(elbow,end,.72),rx:radial*.39,ry:willow?.17:pine?.064:cypress?.093:.13,rz:radial*.39,tips});
 }
 lobes.push({center:[lean[0],.91,lean[2]],rx:cypress?.10:upright?.15:.16,ry:.115,rz:cypress?.10:.15,tips:[]});
 // Dense foliage sits around terminal twigs, leaving an irregular open inner crown.
 const count=cypress?540:pine?540:willow?500:480;
 for(let i=0;i<count;i++){
  const l=lobes[i%lobes.length],a=R()*Math.PI*2,u=R()*2-1,r=Math.pow(R(),.45),q=Math.sqrt(1-u*u),center=[l.center[0]+Math.cos(a)*q*l.rx*r,l.center[1]+u*l.ry*r,l.center[2]+Math.sin(a)*q*l.rz*r];
  const n=M.norm([R()-.5,.1+R()*.62,R()-.5]),side=M.norm(M.cross(n,Math.abs(n[1])>.95?[1,0,0]:[0,1,0])),up=M.cross(n,side),size=(pine||cypress?.019:.026)+R()*(pine||cypress?.014:.018),g=i%3===0?shade:light;
  const pt=(x,y)=>M.add(center,M.add(M.mul(side,x*size),M.mul(up,y*size*(willow?1.3:1))));g.quad(pt(-1,-1),pt(1,-1),pt(1,1),pt(-1,1),n);
 }
 let radius=0;for(const g of[wood,light,shade])for(let i=0;i<g.v.length;i+=8)radius=Math.max(radius,Math.hypot(g.v[i],g.v[i+2]));
 return{wood,light,shade,radius,leafCards:count};
}
function tree(x,z,h=12,type='broad',id,metadata={}){
 type=palette[type]?type:'broad';const old=[this.origin,this.rotation,this.id,this.anim],R=M.rng(seedOf(id)),variant=id%6,key='tree46-'+type+'-'+variant;
 this.origin=[x,0,z];this.rotation=R()*Math.PI*2;this.id=id;this.anim=0;
 try{const bundle=this.cache[key]||(this.cache[key]=geometry(type,variant)),evergreen=type==='pine'||type==='cypress';
  this.mesh(key+'-wood',bundle.wood,0,0,0,h,h,h,type==='pine'?'#766b59':'#766f60',6);
  this.anim=1;this.mesh(key+'-shade',bundle.shade,0,0,0,h,h,h,palette[type][0],evergreen?46:45);this.mesh(key+'-light',bundle.light,0,0,0,h,h,h,palette[type][1+id%2],evergreen?46:45);
  this.registry.set(id,{id,name:evergreen?'松柏类树冠 · 景观近似':type==='willow'?'垂枝树冠 · 景观近似':'阔叶树冠 · 景观近似',en:'Evidence-guided canopy, approximate individual tree',type:'tree',zone:metadata.zoneLabel||'校园绿化',center:[x,0,z],h,radius:h*bundle.radius,level:'航片树群范围 · 单株近似',source:'visit',desc:'按原生航片中的树带和空地关系配置，树种类型参考校方植物资料。树干落点、树高和单株树种未经普查；枝叶形态与季节变化为程序表达。',materials:'分叉树干、细枝、分层叶簇',detail:metadata.basis||'树群范围有据；不代表单株测绘。'});
 }finally{[this.origin,this.rotation,this.id,this.anim]=old;}
}
Y.Builder.prototype.tree=tree;Y.Trees46={geometry,tree,seedOf};
})(YY);
