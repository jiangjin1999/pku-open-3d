/* V30: architecture recovered from existing evidence-led models, in the V29 metre frame. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M,F=Y.Footprints,PI=Math.PI;
const C={stone:'#aaa99e',edge:'#d1d4ce',shadow:'#343e43',glass:'#527b89',frame:'#65767a',roof:'#aeb9bb',dark:'#4a5b62'};
P.v16box=function(k,x,y,z,w,h,d,c,mat=24,part=.8){this.mesh(k,this.geo(k,G.box),x,y,z,w,h,d,c,mat,part);};
// Each face has real projecting stone piers, inset glazing, mullions and sills.
P.v16TowerFace=function(key,x,y,z,width,height,bays,rows,rotation=0){this.local(x,y,z,rotation,()=>{
 this.v16box(key+'-stone-face',0,height/2,-.10,width,height,.13,'#aaa99d',24,.78);
 const bw=width/bays,fh=height/rows;
 for(let j=0;j<rows;j++)for(let i=0;i<bays;i++){
 const xx=-width/2+bw*(i+.5),yy=(j+.52)*fh;
 this.v16box(key+'-recess',xx,yy,.005,bw*.60,fh*.69,.09,'#303a3b',20,.81);
 this.v16box(key+'-glass',xx,yy-.03,.063,bw*.47,fh*.52,.035,'#465254',28,.84);
 this.v16box(key+'-mullion',xx,yy,.09,.06,fh*.54,.05,'#9da5a0',29,.86);
 this.v16box(key+'-transom',xx,yy-.25,.09,bw*.48,.06,.05,'#9da5a0',29,.86);
 this.v16box(key+'-sill',xx,yy-fh*.35,.16,bw*.77,.12,.38,'#c7c7bc',24,.91);
 }
 for(let j=0;j<=rows;j++)this.v16box(key+'-belt',0,j*fh,.055,width,.15,.14,'#c0bfb2',24,.87);
});};
P.wangTower30=function(){
 // Narrow setback tower; shoulders are explicitly lower than central crown.
 const towerZ=0,base=13.45;
 const blocks=[{x:0,z:towerZ,w:26,d:29,h:58.8,n:15},{x:-18,z:towerZ+1,w:10,d:27,h:47.6,n:12},{x:18,z:towerZ-1,w:10,d:27,h:47.6,n:12}];
 for(const o of blocks){this.v16box('v16-wang-setback-core',o.x,base+o.h/2,o.z,o.w,o.h,o.d,'#6e797b',24,.6);
 for(const s of[-1,1]){this.v16TowerFace('v16-wang-tower',o.x,base,s*o.d/2+o.z,o.w,o.h,Math.round(o.w/4.5),o.n,s<0?PI:0);
 this.v16TowerFace('v16-wang-tower',o.x+s*o.w/2,base,o.z,o.d,o.h,7,o.n,s*PI/2);}
 this.v16box('v16-wang-shoulder-cap',o.x,base+o.h+.35,o.z,o.w+1.1,.55,o.d+1.1,C.edge,29,1.6);}
 // Silver-gray glazed strips with aluminium pressure plates, fitted to the full photograph.
 for(const x of[-13.3,13.3])for(const s of[-1,1]){let z=towerZ+s*14.9;this.v16box('v16-wang-glass-ribbon',x,42.6,z,4.0,56.4,.13,'#81908d',28,1.05);
 for(let j=0;j<=15;j++)this.v16box('v16-wang-ribbon-crossbar',x,14.4+j*3.72,z+s*.10,4.1,.095,.13,'#a9b9bb',29,1.08);
 for(const dx of[-2,0,2])this.v16box('v16-wang-ribbon-fin',x+dx,42.6,z+s*.18,.07,56.4,.30,'#bbc6c3',29,1.10);}
 // Recognisable flat projecting crown, separated from the masonry by a clerestory.
 this.v16box('v16-wang-clerestory',0,73.0,towerZ,26.3,1.1,29.3,'#54656c',28,1.7);
 this.v16box('v16-wang-crown',0,74.4,towerZ,34.8,.7,39.2,'#c8cfcb',29,2.0);
 this.v16box('v16-wang-crown',0,74.05,towerZ,35.8,.13,40.2,'#879796',29,1.96);
 for(let x=-16.5;x<=16.5;x+=1.25)this.v16box('v16-wang-crown-rib',x,73.65,towerZ,.15,.75,38.4,'#8d9b9b',29,1.93);
 for(const s of[-1,1])for(const x of[-10.5,10.5])this.beam([x,70.9,towerZ+s*14.5],[x,74,towerZ+s*18.1],.16,'#a2aeaa',29,1.90);
 // The reference shows an uninterrupted thin crown silhouette; omit unverified rooftop equipment.
 // Tower name is legible but not a claimed facsimile of the original calligraphy.
 // No invented tower-top name: the archived photo shows an emblem at the crown.

};
function wang(b,feature,add){
 const p=feature.properties,g=feature.geometry,id=p.pickId;
 // The large northern wing is low. The tall stepped block occupies the southern lobe.
 add('wang30-podium',F.walls(g,.30,12.5),'#c4bdac',24,id);
 add('wang30-podium-roof',F.surface(g,12.5),'#a5aaa1',22,id);
 const original=b.e.add.bind(b.e),origin=[415.15,681.7],r=.0447,scale=.76;
 // Transfer only the upper tower from V16. Never reuse its former campus position or podium outline.
 b.e.add=(key,geo,m,color,params,uv)=>{const out=new Float32Array(m);for(const j of [0,2,4,6,8,10])out[j]*=scale;out[12]=origin[0]+(out[12]-origin[0])*scale;out[14]=origin[1]+(out[14]-origin[1])*scale;original(key,geo,out,color,params,uv)};
 try{b.group({id,x:origin[0],z:origin[1],r,w:36,d:36,h:78},()=>b.wangTower30());}finally{b.e.add=original;}
 // Source outline windows are confined to the low base, not carried to the crown.
 const win=new G.Geometry();for(const ring of F.polygons(g).flat()){const sign=F.area(ring)>0?1:-1;for(let k=1;k<ring.length;k++){const a=ring[k-1],c=ring[k],l=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/l,uz=(c[1]-a[1])/l,nx=uz*sign,nz=-ux*sign;for(let t=2.8;t<l-1.5;t+=4.0)for(let row=0;row<3;row++){const x=a[0]+ux*t+nx*.07,z=a[1]+uz*t+nz*.07,y=1.1+row*3.7,w=1.05;win.quad([x-ux*w,y,z-uz*w],[x+ux*w,y,z+uz*w],[x+ux*w,y+2.4,z+uz*w],[x-ux*w,y+2.4,z-uz*w]);}}}
 add('wang30-base-windows',win,'#4b6065',28,id);
 // South entrance: red-brown stone portal around a tall glazed opening.
 const previous=[b.origin,b.rotation,b.id,b.anim];b.origin=[415.6,0,702.5];b.rotation=r;b.id=id;b.anim=0;
 try{
  b.box(0,5.55,.06,9.0,11.1,.24,'#805d4c',24);
  b.box(0,5.50,.20,6.4,8.7,.12,'#354b4b',28);
  for(const x of[-4.0,4.0])b.box(x,5.58,.26,1.0,11.15,.48,'#8f6e59',24);
  b.box(0,10.72,.26,9.0,.96,.48,'#97745d',24);
  for(const x of[-2.8,-1.4,0,1.4,2.8])b.box(x,5.5,.30,.085,8.7,.08,'#a9b1a8',29);
  for(const y of[1.2,3.4,5.6,7.8,9.8])b.box(0,y,.30,6.4,.09,.08,'#a9b1a8',29);
  b.box(0,1.75,.33,2.8,3.1,.09,'#465959',28);b.box(0,1.75,.41,.075,3.1,.07,'#b7bdb1',29);
  b.lettering('王克桢楼',0,11.96,.32,8.0,.65,0,'#635f51');
 }finally{[b.origin,b.rotation,b.id,b.anim]=previous;}

 return {profile:'wang-stepped-tower',baseHeight:12.5,towerCenter:origin,towerHeight:74.75,sourceModel:'districts-v16.js:wangKezhen',limits:'南部高塔位置按影像辨识，比例按照片拟合；总高、背面与层数仍未实测'};
}
Y.Architecture30={wang};
})(YY);
/* Every other footprint receives its individually reviewed roof and facade treatment. */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,M=Y.M,Adapter=Y.ArchitectureAdapter;
const palette={
 guanghua:{wall:'#565761',frame:'#a6afb4',glass:'#355f87',roof:'#878e8d',mat:27},
 modern:{wall:'#c5c5b9',frame:'#657573',glass:'#607b7c',roof:'#8f9991',mat:24},
 graybrick:{wall:'#a6a79c',frame:'#546662',glass:'#5c7675',roof:'#65716e',mat:18},
 science:{wall:'#bfc4bc',frame:'#667875',glass:'#5f7e80',roof:'#949e97',mat:24},
 stoneglass:{wall:'#c2c2b5',frame:'#657371',glass:'#698384',roof:'#8c9891',mat:24},
 dorm:{wall:'#dddcd1',frame:'#596b66',glass:'#546f71',roof:'#737c74',mat:18},
 heritage:{wall:'#d1ccb9',frame:'#854636',glass:'#435959',roof:'#646f69',mat:18},
 courtyard:{wall:'#c9c7b5',frame:'#754b3b',glass:'#455c59',roof:'#6d7970',mat:18},
 redgallery:{wall:'#d2cebb',frame:'#853d30',glass:'#455c59',roof:'#697770',mat:18},
 redvilla:{wall:'#a98e75',frame:'#775342',glass:'#46615d',roof:'#a36f4e',mat:18},
 greenhouse:{wall:'#69867e',frame:'#879791',glass:'#88a39d',roof:'#829f98',mat:28},
 canopy:{wall:'#9baaa2',frame:'#788e86',glass:'#648e96',roof:'#618d96',mat:29}
};
function edges(g){return F.polygons(g).flatMap(pg=>pg.flatMap((r,ri)=>r.slice(1).map((c,i)=>{const a=r[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),sgn=(F.area(r)>0?1:-1)*(ri?-1:1);return{a,c,len,ux:(c[0]-a[0])/len,uz:(c[1]-a[1])/len,nx:(c[1]-a[1])/len*sgn,nz:-(c[0]-a[0])/len*sgn,inner:ri>0};})));}
function subFeature(f,geometry,height){const pts=F.flat(geometry.coordinates),xs=pts.map(p=>p[0]),zs=pts.map(p=>p[1]),bb=[Math.min(...xs),Math.min(...zs),Math.max(...xs),Math.max(...zs)];return {...f,geometry,properties:{...f.properties,height,bounds:bb,centre:[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2]}};}
function clipGeometry(g,bb){
 const clipRing=ring=>{let out=ring.slice(0,-1);for(const[axis,value,sign]of[[0,bb[0],1],[0,bb[2],-1],[1,bb[1],1],[1,bb[3],-1]]){const input=out;out=[];for(let i=0;i<input.length;i++){const p=input[i],q=input[(i+1)%input.length],dp=(p[axis]-value)*sign,dq=(q[axis]-value)*sign;if(dp>=-1e-8)out.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}}}if(out.length>2)out.push(out[0]);return out;};
 const polygons=[];for(const pg of F.polygons(g)){const outer=clipRing(pg[0]);if(outer.length<4||Math.abs(F.area(outer))<.001)continue;const holes=pg.slice(1).map(clipRing).filter(r=>r.length>3&&Math.abs(F.area(r))>.001);polygons.push([outer,...holes]);}return{type:'MultiPolygon',coordinates:polygons};
}
function footprint(b,f,add,opts={}){
 const p=f.properties,g=f.geometry,id=p.pickId,arch=p.architecture||{},style=opts.style||arch.style||'modern',col=palette[style]||palette.modern,es=edges(g),fr=Adapter.frame(g),roof=opts.roof||p.roofTreatment||'flat',h=opts.height||p.height;
 const classic=['heritage','courtyard','redgallery','redvilla'].includes(style),pitched=['hip','gable'].includes(roof),rise=pitched?Math.min(classic?4.4:5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17),h*.29):roof==='barrel'?Math.min(5.0,h*.28):0,body=h-rise;
 const isCanopy=style==='canopy',isGlass=style==='greenhouse',isLv=p.legacyType==='lv';
 if(!isCanopy)add('v30-walls-'+id+'-'+opts.key,F.walls(g,.30,body),col.wall,col.mat,id);
 else{for(const e of es){if(e.len<3)continue;for(let t=1;t<e.len;t+=6){const x=e.a[0]+e.ux*t-e.nx*.25,z=e.a[1]+e.uz*t-e.nz*.25;b.id=id;b.box(x,body/2,z,.18,body,.18,col.frame,29);}}}
 add('v30-plinth-'+id+'-'+opts.key,F.walls(g,.03,.30),classic?'#a7aa9c':'#afb5a9',10,id);
 let profile;
 if(pitched){
  const segments=es.map(e=>[e.a,e.c]),distance=q=>Math.min(...segments.map(e=>F.distSegment(q,...e)));
  // Normalize by a sampled medial maximum: a shallow large flat plateau is not substituted for a ridge.
  let maximum=.01;for(const pg of F.polygons(g))for(const t of F.capTriangles(pg)){for(let u=0;u<=8;u++)for(let v=0;v<=8-u;v++){const q=[t[0][0]+(t[1][0]-t[0][0])*u/8+(t[2][0]-t[0][0])*v/8,t[0][1]+(t[1][1]-t[0][1])*u/8+(t[2][1]-t[0][1])*v/8];maximum=Math.max(maximum,distance(q));}}
  const cs=Math.cos(fr.r),sn=Math.sin(fr.r),local=q=>[cs*(q[0]-fr.centre[0])-sn*(q[1]-fr.centre[1]),sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1])];
  // Simple gables retain their upright end walls. Compound roofs follow each source ring.
  const simple=F.polygons(g).length===1&&F.polygons(g)[0].length===1&&Math.abs(F.area(F.polygons(g)[0][0]))/(fr.w*fr.d)>.91;
  profile=q=>{let t=roof==='gable'&&simple?1-Math.abs(local(q)[fr.w>=fr.d?1:0])/(Math.min(fr.w,fr.d)/2):distance(q)/maximum;t=Math.max(0,Math.min(1,t));return body+rise*(classic?Math.pow(t,1.42):t);};
  add('v30-roof-'+id+'-'+opts.key,F.profiledSurface(g,profile,classic?1.65:2.6),col.roof,classic?25:19,id);
 }else if(roof==='barrel'){
  const cs=Math.cos(fr.r),sn=Math.sin(fr.r),across=fr.w<fr.d?0:1,width=Math.min(fr.w,fr.d),count=(isCanopy||isGlass)?Math.max(1,Math.round(width/7.2)):1;
  profile=q=>{const x=cs*(q[0]-fr.centre[0])-sn*(q[1]-fr.centre[1]),z=sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1]),t=(((across?z:x)/width+.5)*count)%1;return body+rise*Math.sin(Math.PI*Math.max(0,t));};
  add('v30-arched-roof-'+id+'-'+opts.key,F.profiledSurface(g,profile,1.0),col.roof,isGlass?28:29,id);
 }else add('v30-flat-roof-'+id+'-'+opts.key,F.surface(g,body),col.roof,22,id);
 // Close the gable/arched ends. The projected plan never changes.
 if(profile){const ends=new G.Geometry();for(const e of es){const n=Math.max(1,Math.ceil(e.len/1.5));for(let k=0;k<n;k++){const a=[e.a[0]+e.ux*e.len*k/n,e.a[1]+e.uz*e.len*k/n],c=[e.a[0]+e.ux*e.len*(k+1)/n,e.a[1]+e.uz*e.len*(k+1)/n];ends.quad([a[0],body,a[1]],[c[0],body,c[1]],[c[0],profile(c),c[1]],[a[0],profile(a),a[1]]);}}add('v30-roof-ends-'+id+'-'+opts.key,ends,col.wall,col.mat,id);}
 b.id=id;const floors=opts.floors||Math.max(1,Math.min(24,p.floors||Math.round(body/(classic?4.2:3.6)))),fh=(body-.55)/floors;
 for(const e of es){if(e.len<3.4)continue;const r=Math.atan2(e.nx,e.nz),step=classic?4.8:style==='dorm'?3.6:4.35,count=Math.max(1,Math.floor(e.len/step)),stride=e.len/count,ww=Math.min(classic?2.3:2.75,stride*(classic?.55:.68)),wh=Math.min(classic?3.05:2.65,fh*.63);
  if(!isCanopy)for(let floor=0;floor<floors;floor++)for(let k=0;k<count;k++){const t=(k+.5)*stride,x=e.a[0]+e.ux*t+e.nx*.045,z=e.a[1]+e.uz*t+e.nz*.045,y=.55+fh*(floor+.52);
   if(isGlass){b.local(x,y,z,r,()=>{b.box(0,0,0,.075,body,.10,col.frame,29);});continue;}
   if(classic&&floor===0&&wh>1.5)b.v9Lattice(x,y,z,ww,wh,r,style==='courtyard');else b.window(x,y,z,ww,wh,r,col.frame);
   if(style==='dorm'){b.local(x,0,z,r,()=>{b.box(-stride*.47,body/2,-.03,.25,body,.34,'#e4e3d8',24);if(floor>0){b.box(0,.55+floor*fh-.17,.09,stride,.38,.42,'#e2e2d7',24);b.box(0,.55+floor*fh+.22,.08,stride,.08,.29,'#bdc4b8',29);}});}
   if(style==='redgallery'&&!e.inner){b.local(x,0,z,r,()=>{b.box(-stride*.45,body*.52,.18,.22,body*.92,.26,'#8a4030',6);b.box(0,body*.82,.21,stride,.33,.28,'#844030',6);});}
  }
  b.local((e.a[0]+e.c[0])/2,0,(e.a[1]+e.c[1])/2,r,()=>{
   b.box(0,body-.18,.01,e.len,.24,.30,classic?'#8b624d':'#c7cbbf',classic?6:24);
   if(isLv){b.box(0,body+.55,-.06,e.len,.38,1.45,'#d2d3c9',24);b.box(0,body-.48,-.03,e.len,.58,.35,'#777f78',20);if(e.len>18&&!e.inner){const glassWidth=Math.min(8,e.len*.16);b.box(0,body*.51,.06,glassWidth,body*.89,.14,'#576f70',28);for(let j=1;j<floors;j++)b.box(0,.55+j*fh,.17,glassWidth,.17,.20,'#b1bbb4',29);for(const sg of[-1,1])b.box(sg*(glassWidth/2+.23),body*.49,.10,.45,body*.95,.62,'#c7c8bd',24);}}
   if(!pitched&&!isCanopy){b.box(0,body+.35,-.16,e.len,.75,.29,'#b1b8ac',24);b.box(0,body+.76,-.16,e.len+.06,.13,.42,'#cbd0c2',24);}
   if(!classic&&!isCanopy)for(let j=1;j<floors;j++)b.box(0,.55+j*fh,.025,e.len,.13,.11,'#c9cec0',24);
  });
 }
 return {id:p.id,strategy:'footprint',style,roof,bodyHeight:body,roofRise:rise,sourceOutline:true};
}
function library(b,f,add){
 const g=f.geometry,id=f.properties.pickId,split=-4,low=117.5,high=187.5;
 const main=clipGeometry(g,[split,low,200,high]),west=clipGeometry(g,[-200,0,split,300]),north=clipGeometry(g,[split,0,200,low]),south=clipGeometry(g,[split,high,200,300]);
 const part=(geometry,height,key,roof='flat',style='stoneglass')=>{if(F.polygons(geometry).length)footprint(b,subFeature(f,geometry,height),add,{height,style,roof,key,floors:height>12?3:1});};
 part(west,15.3,'west');part(north,10.3,'north','hip','heritage');part(south,10.3,'south','hip','heritage');
 const east=subFeature(f,main,32.5),source=Y.ARCHIVE.legacy['4'];Adapter.render(b,east,'libraryEast',source,{name:'library-east'});
 // The low green dome belongs to the western roof, not the open northern court.
 const domePoint=[-29.7,174.0];if(F.inside(domePoint,west)){b.id=id;b.cyl(domePoint[0],15.4,domePoint[1],7.9,.65,'#aabbb1',48,1,24);b.sphere(domePoint[0],15.75,domePoint[1],7.7,3.25,7.7,'#96b5a9',28,2,true);}
 return {id:f.properties.id,strategy:'library-east-west',parts:4,sourceModels:['libraryEast','libRoof','libWindow'],height:32.5};
}
const methods={dining:'dining',villa:'historicVilla',heren:'heren',lawcourt:'lawCourtyard',shaoyuan:'shaoyuanBlock','historic-segment':(b,p,w,d)=>b.n17Hall(w,d,6.6,{one:true}),'bicmr-segment':(b,p,w,d)=>b.bicmrCourtyard({...p,parcelPlan25:undefined},w,d),science1:'scienceOne',scienceTeaching:'scienceTeaching',quan:'northQuan',historymuseum:'historymuseum',teaching2:'teaching2',westFlank:'westFlank',sackler:'sacklerMuseum',russian:'yuanpeiRussian',jingyuan:'historicJingyuan',science2:'scienceTwo',yingjie:'yingjieConference',zhihua:(b)=>b.zhihua(),studentcenter:'studentcenter',nongyuan:'nongyuan27',jiayuan:(b,p,w,d)=>b.jiayuan(w,d),zhai:'northZhai',qiu:'qiuGymnasium',hall:(b)=>b.hall(),westgate:'historicWestGate',office:'historicOffice',pagoda:'lakePagoda',secondgym:'secondGymHistoric',firstgym:'firstGymHistoric',chenming:'lawChenming',kaiyuan:'lawKaiyuan',guanghua2:'guanghuaTwo',economics:'economicsHall',yanyuantower:'yanyuanTower',teaching3:'lowTeaching',teaching4:'lowTeaching',education:'educationHall27',jian:'northJian',octagon:'northOctagon',luce:'lakeLuce'};
function render(b,f,add){const p=f.properties,strategy=p.architecture?.strategy||'footprint';const refined=Y.Refinements42?.render(b,f,add)||Y.Refinements41?.teacher(b,f,add)||Y.Zhihua38?.render(b,f)||Y.Districts37?.render(b,f);if(refined)return refined;
 if(strategy==='hospital-canteen'){footprint(b,f,add,{key:'hospital',style:'modern',roof:'flat'});b.id=p.pickId;b.local(291.5,0,-401.7,Math.PI,()=>b.canteenEntry32());return {id:p.id,strategy:'hospital-canteen',entryOnly:true};}
 if(strategy==='villa-pair'){const parts=[[-1000,-1000,-50.8,1000,857],[-50.8,-1000,1000,1000,858]];for(const a of parts){const g=clipGeometry(f.geometry,a.slice(0,4));if(F.polygons(g).length)Adapter.render(b,subFeature(f,g,p.height),'historicVilla',Y.ARCHIVE.legacy[String(a[4])],{name:'villa-pair-'+a[4]});}return {id:p.id,strategy:'villa-pair',parts:2};}
 if(strategy==='wang')return A.wang(b,f,add);if(strategy==='library')return library(b,f,add);
 const source=Y.ARCHIVE.legacy[String(p.legacyId)];if(methods[strategy]&&source){if(strategy==='scienceTeaching')footprint(b,f,add,{height:p.height*.88,floors:5,roof:'flat',style:'graybrick',key:'scienceTeaching-wings'});if(strategy==='zhihua')footprint(b,f,add,{height:p.height*.88,floors:5,roof:'flat',style:'modern',key:'zhihua-wings'});if(['guanghua2','economics'].includes(strategy))footprint(b,f,add,{height:p.height*(strategy==='guanghua2'?.50:.68),floors:4,roof:'flat',style:strategy==='guanghua2'?'guanghua':'stoneglass',key:strategy+'-base'});if(strategy==='science1')footprint(b,f,add,{height:p.height*.72,floors:5,roof:'flat',style:'science',key:'science1-links'});if(strategy==='hall'){footprint(b,f,add,{height:10.5,floors:2,roof:'flat',style:'stoneglass',key:'hall-wings'});b.id=p.pickId;b.local(50.60,0,387.28,.879,()=>{b.box(0,5.05,.055,48.8,9.6,.11,'#526b68',28);b.box(0,10.1,.02,49.4,1.0,.7,'#d9d5c7',24);for(let x=-22;x<=22;x+=5.5){for(const d of[-.28,.28])b.box(x+d,5.15,.12,.26,9.6,.62,'#e0ddd2',24);b.box(x,5.2,.12,5.2,.12,.16,'#bcc5bb',29);}});}add('v30-footprint-base-'+p.pickId,F.surface(f.geometry,.045),'#b5bbae',10,p.pickId);const result=Adapter.render(b,f,methods[strategy],source,{name:strategy,...(strategy==='westgate'?{sourceFrame:{w:27.8,d:11.06,centre:[0,0]},preserveOuterParts:true}:{}),...(strategy==='science1'?{roofCutBase:22.2}:{}),...(strategy==='hall'?{frame:{r:.879,w:52,d:46,centre:[42,358]}}:{})});if(strategy==='guanghua2'){b.id=p.pickId;b.local(325.5,0,-306.8,1.35,()=>b.gsmEntry32());}return result;}
 return footprint(b,f,add);
}
Object.assign(A,{render,footprint,library,clipGeometry});
})(YY);
