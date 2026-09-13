/* Gate points remain geographic anchors. Dimensions are photo estimates, not surveys. */
(function(Y){'use strict';
function pillar(b,x,h,w){
 b.box(x,.19,0,w+.30,.38,w+.30,'#c9cac0',10);
 b.box(x,h/2,0,w,h-.38,w,'#a8a99f',18);
 for(const s of[-1,1]){b.box(x+s*(w/2-.10),h*.49,w/2+.035,.14,h*.78,.12,'#c0c2b8',10);}
 b.box(x,h-.15,0,w+.26,.26,w+.26,'#c5c8be',10);
 b.box(x,h+.10,0,w+.46,.22,w+.46,'#d4d4c8',10);
 // Four-sided cap without the unrelated long tiled ridge used on buildings.
 b.mesh('gate40-cap',b.geo('gate40-cap',()=>{
  const g=new Y.Geo.Geometry(),levels=[[0,.50],[.12,.46],[.30,.33],[.57,.23],[.82,.18],[1,.17]];
  for(let j=1;j<levels.length;j++){const[y0,a]=levels[j-1],[y1,c]=levels[j];for(let k=0;k<4;k++){const ring=r=>[[-r,-r],[r,-r],[r,r],[-r,r]],p=ring(a),q=ring(c),n=(k+1)%4;g.quad([p[k][0],y0,p[k][1]],[q[k][0],y1,q[k][1]],[q[n][0],y1,q[n][1]],[p[n][0],y0,p[n][1]]);}}
  return g;
 }),x,h+.20,0,w+.74,.65,w+.74,'#d0d1c6',10);
 b.cyl(x,h+.82,0,.16,.20,'#cecec1',12,1,10);
 b.sphere(x,h+1.04,0,.19,.25,.19,'#d4d4ca',10,0,true);
}
function rail(b,a,c,y=1.4){
 for(let x=a;x<=c;x+=.29)b.box(x,y/2+.15,0,.045,y,.045,'#384b45',29);
 for(const h of[.30,y])b.box((a+c)/2,h,0,c-a,.065,.06,'#384b45',29);
}
function east(b){
 for(const s of[-1,1]){
  pillar(b,s*6.4,6.1,1.8);pillar(b,s*11.1,4.75,1.45);pillar(b,s*18.1,4.75,1.45);
  b.box(s*14.6,1.88,0,5.6,3.75,.72,'#a7aaa0',18);
  b.box(s*14.6,3.85,0,5.85,.17,.87,'#c7c9bf',10);
  b.box(s*14.6,2.18,.385,2.8,1.4,.09,'#d0d1c8',10);
  // Curved openwork pedestrian arch, independent of the central vehicle passage.
  for(let j=0;j<20;j++){
   const x0=7.4+j*2.95/20,x1=7.4+(j+1)*2.95/20;
   const h=x=>4.08+.72*Math.sin((x-7.4)/2.95*Math.PI);
   b.beam([s*x0,h(x0),0],[s*x1,h(x1),0],.08,'#34443e',29);
   b.beam([s*x0,h(x0)-.22,0],[s*x1,h(x1)-.22,0],.045,'#34443e',29);
  }
  // Small open rings fill the arch band seen in the 2025 frontal photo.
  for(let j=0;j<8;j++){const cx=7.56+j*2.60/7,cy=4.08+.72*Math.sin((cx-7.4)/2.95*Math.PI)-.11;
   for(let k=0;k<16;k++){const a=k*Math.PI/8,c=(k+1)*Math.PI/8;b.beam([s*(cx+.115*Math.cos(a)),cy+.115*Math.sin(a),0],[s*(cx+.115*Math.cos(c)),cy+.115*Math.sin(c),0],.018,'#34443e',29);}
  }
  b.lion(s*12.1,2,1.03);
 }
 // Individual vertical characters follow the photo's tall plaque.
 b.box(6.4,3.32,.94,.83,3.9,.08,'#deded3',10);
 for(const[i,ch]of [...'北京大学'].entries())b.lettering(ch,6.4,4.5-i*.76,1.0,.58,.58,0,'#33362f');
 // Retracted leaves leave the entrance centre open for walking.
 rail(b,-5.4,-3.2);rail(b,3.2,5.4);
 for(let x=-5;x<=5;x+=2.5)b.sphere(x,.31,2.5,.26,.28,.26,'#c4c6b9',10,0,true);
}

function south(b){
 for(const x of[-7,-4,4,7]){b.box(x,3.3,0,1.05,6.6,1.28,'#b6bcb4',10);b.box(x,.16,0,1.3,.32,1.55,'#a6afa5',10);b.box(x,6.45,0,1.18,.35,1.43,'#9aa69d',10);for(let i=-3;i<=3;i++)b.box(x+i*.12,6.53,.74,.055,.52,.08,'#738078',29);}
 b.box(0,6.99,0,17.2,.66,2.65,'#c2c6bc',10);b.box(0,6.58,0,17,.17,2.46,'#8c9990',10);
 b.box(0,5.88,.15,7.15,1.06,.65,'#354d43',10);b.sign('北京大学',0,5.90,.49,5.8,.73,0,false);
 for(const side of[-1,1]){b.box(side*11.3,1.61,0,7.6,3.22,1.05,'#bbc1b7',10);b.box(side*11.3,3.42,0,7.9,.35,2.1,'#c3c8bd',10);b.box(side*11.3,1.80,.57,4.8,1.45,.12,'#d1d6c9',10);for(let j=0;j<12;j++)b.sphere(side*(7.5+j*.63),3.68,.72,.062,.11,.062,'#d8dcd0',10,0,true);}
 for(let j=0;j<=40;j++)b.sphere(-8.4+j*.42,7.42,.94,.06,.105,.06,'#d6dacd',10,0,true);
 rail(b,-6.2,-5.8);rail(b,5.8,6.2);for(const x of[-3.25,3.25]){b.box(x,.75,.9,.25,1.5,.32,'#c0c7c0',29);b.box(x,1.08,.98,.13,.17,.10,'#283f38',29);}
}

function southeastGroup(b){
 const w=5.8,d=5.2,base=2.95,rise=.83;
 const g=b.geo('southeast33-blue-canopy',()=>{const a=new Y.Geo.Geometry();for(let j=0;j<36;j++){const x=-w/2+j*w/36,xx=-w/2+(j+1)*w/36,h=q=>base+rise*Math.sqrt(Math.max(0,1-(q/(w/2))**2));a.quad([x,h(x),-d/2],[x,h(x),d/2],[xx,h(xx),d/2],[xx,h(xx),-d/2]);a.quad([xx,h(xx),-d/2],[xx,h(xx),d/2],[x,h(x),d/2],[x,h(x),-d/2]);}return a;});
 b.mesh('southeast33-blue-canopy',g,0,0,0,1,1,1,'#458e9c',28);
 for(const side of[-1,1])for(const z of[-d/2,0,d/2])b.box(side*w/2,base/2,z,.13,base,.13,'#a3b4af',29);
 for(const z of[-d/2,0,d/2])for(let j=0;j<24;j++){const x=-w/2+j*w/24,xx=-w/2+(j+1)*w/24,h=q=>base+rise*Math.sqrt(Math.max(0,1-(q/(w/2))**2));b.beam([x,h(x)+.015,z],[xx,h(xx)+.015,z],.045,'#c1ccc5',29);}
 for(const side of[-1,1])b.box(side*w/2,base-.08,0,.13,.18,d,'#a3b4af',29);
 for(const x of[-1.92,-.64,.64,1.92]){b.box(x,.53,.30,.21,1.06,1.10,'#a7b7b1',29);b.box(x,1.12,.60,.18,.22,.14,'#233c37',29);}
 for(const x of[-1.28,0,1.28])for(const side of[-1,1])b.box(x+side*.31,.66,.30,.50,.65,.035,'#bdd7d0',28);
 for(const side of[-1,1])b.local(side*3.45,0,0,Math.PI/2,()=>rail(b,-2.6,2.6,1.2));
}
function southeast(b){
 // North and south groups: three clear lanes between four reader cabinets each.
 for(const x of[-8.2,8.2])b.local(x,0,0,0,()=>southeastGroup(b));
}
function qiuUnverified(b,p){
 // The mapped opening is retained without invented masonry gateposts.
 for(const side of[-1,1])b.box(side*4.2,1.05,0,.10,2.1,.10,'#71867c',29);
}
function provisional(b,p){
 const width=p.tags.motor_vehicle==='no'?4.6:p.id==='node/380722026'?13:8;
 for(const s of[-1,1]){b.box(s*(width/2+.35),1.15,0,.7,2.3,.7,'#adb1a6',18);b.box(s*(width/2+.35),2.36,0,.85,.16,.85,'#c7cbbf',10);rail(b,s<0?-width/2-3:-(-width/2-.8),s<0?-width/2-.8:width/2+3);}
 if(p.tags.access==='no')rail(b,-width/2,width/2);else{rail(b,-width/2,-width/2+1.1);rail(b,width/2-1.1,width/2);}
}
function render(b,f){const p=f.properties;if(p.id==='node/1422005424')return {profile:'existing-west-gate-building'};
 const q=f.geometry.coordinates,r=p.id==='node/380722026'?0:p.id==='node/2485149510'?-Math.PI/2:Math.PI/2;
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[q[0],.12,q[1]];b.rotation=r;b.id=p.pickId;b.anim=0;
 try{if(p.id==='node/2748949454')east(b);else if(p.id==='node/380722026')south(b);else if(p.id==='node/6018578781')southeast(b);else if(['node/380742837','node/10729924621'].includes(p.id))qiuUnverified(b,p);else provisional(b,p);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:({'node/2748949454':'east-paired-quepillars-photo2025','node/380722026':'south-flat-canopy-photo2020','node/6018578781':'southeast-pedestrian-canopy-photo2023'})[p.id]||'entrance-layout-provisional'};
}
for(const f of Y.CAMPUS.features.filter(f=>f.properties.kind==='gate')){
 const p=f.properties;p.gate33=true;p.displayRadius=p.id==='node/2748949454'?39:p.id==='node/380722026'?33:18;
 p.rotation=p.id==='node/380722026'?0:p.id==='node/2485149510'?-Math.PI/2:Math.PI/2;
 if(p.id==='node/2748949454'){
 p.height=7.4;p.architecture={summary:'按 2025 年正面照片重建高低门柱、翼墙与拱形步行入口。'};
 p.scopeNote='平面沿用公开地图点位；门柱尺寸、跨度及背面细部为照片拟合，未实测。';
 p.references=[{title:'东门正面照片 · N509FZ · 2025 · CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:East_gate_of_Peking_University_(20250605110404).jpg'},...(p.references||[])];
 }else if(p.id==='node/380722026'){p.height=7.6;p.architecture={summary:'按 2020 年正面照片重建四柱平顶门、中央匾额和低翼墙。'};p.scopeNote='点位沿用公开地图；跨度、高度和门后设施为照片拟合，临时迎新布置未计入。';p.references=[{title:'南门正面 · 新京报 · 2020-09-01',url:'https://m.bjnews.com.cn/detail/159892572315716.html'}];}else if(p.id==='node/6018578781'){p.height=3.8;p.displayRadius=23;p.architecture={summary:'南北两组蓝色弧形雨棚，每组设三条闸机通道。'};p.scopeNote='南北通道有校方文字记录；每组三条通道按使用者现场反馈，间距和尺寸为拟合。照片仅覆盖单组。';p.references=[{title:'东南门步行入口 · 新京报图 / 半岛都市报转载 · 2023-12-23',url:'https://www.sohu.com/a/746480932_355158'}];}else if(p.id!=='node/1422005424'){p.height=2.5;p.scopeNote='入口点位来自公开地图；外形仍待清晰实拍核对。';if(['node/380742837','node/10729924621'].includes(p.id)){p.architecture={summary:'已撤下无依据的石墩和门扇；暂保留入口位置。'};p.scopeNote='未取得能对应此点位的清晰邱门实拍，当前仅表示开口，尚未完成外观复原。';}}
}
Y.Gates33={render};
})(YY);
