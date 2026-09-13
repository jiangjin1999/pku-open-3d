/* V35: build the two photo-supported profiles directly in metres.
   Do not stretch a whole legacy scene into a cadastral envelope or slice roofs. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo;
// Rendering/model-plan ownership only. The independently retained rawFeatures
// and raw OSM input are never changed. The shared source edge is removed from
// the model outline rather than leaving a detached pick-25 rectangle.
const two=Y.CAMPUS.features.find(f=>f.properties.id==='relation/14962081'),link=Y.CAMPUS.features.find(f=>f.properties.id==='relation/14962080');
const southPiece=F.polygons(Y.SCIENCE_LINK35.geometry).find(p=>p[0].every(q=>q[0]>390&&q[1]>300));
const sourceFrame=Y.ArchitectureAdapter.frame(two.geometry,0),eq=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<1e-6;
const sourcePolygon=F.polygons(two.geometry)[0],ring=sourcePolygon[0],extension=southPiece[0].slice(0,-1);let unionRing=null;
for(let i=0;i<ring.length-1;i++){
 const a=extension.findIndex(p=>eq(p,ring[i])),c=extension.findIndex(p=>eq(p,ring[i+1]));
 if(a<0||c<0)continue;
 const direction=(a+1)%extension.length===c?-1:1,path=[];let k=a;
 while(k!==c){path.push(extension[k]);k=(k+direction+extension.length)%extension.length;}
 unionRing=[...ring.slice(0,i),...path,...ring.slice(i+1)];break;
}
if(!unionRing)throw Error('Science Two southern source edge changed: re-register before rendering');
const setPlan=(f,geometry)=>{const points=F.flat(geometry.coordinates),p=f.properties;
 p.scienceVisual46={originalGeometry:f.geometry,sourceFrame:f===two?sourceFrame:undefined,scope:'Science Two south stepped-wing reassignment; original OSM retained separately.'};
 f.geometry=geometry;p.bounds=[Math.min(...points.map(q=>q[0])),Math.min(...points.map(q=>q[1])),Math.max(...points.map(q=>q[0])),Math.max(...points.map(q=>q[1]))];
 p.centre=[(p.bounds[0]+p.bounds[2])/2,(p.bounds[1]+p.bounds[3])/2];
 const fr=Y.ArchitectureAdapter.frame(geometry,0);p.envelopeMetres=[fr.w,fr.d].map(v=>Math.round(v*10)/10);
};
setPlan(two,{type:'Polygon',coordinates:[unionRing,...sourcePolygon.slice(1)]});
setPlan(link,{type:'MultiPolygon',coordinates:F.polygons(Y.SCIENCE_LINK35.geometry).filter(p=>p!==southPiece)});
function steppedWing(b){
 const c=Math.cos(sourceFrame.r),s=Math.sin(sourceFrame.r),local=p=>{const x=p[0]-sourceFrame.centre[0],z=p[1]-sourceFrame.centre[1];return[c*x-s*z,s*x+c*z];};
 const ext=southPiece[0].map(local),north=ext.slice(0,-1).sort((a,b)=>a[1]-b[1]).slice(0,2).sort((a,b)=>a[0]-b[0]),left=north[0][0],right=north[1][0],back=31.5;
 // Exact original ground polygon supplies width and final south boundary.
 // The five tier elevations and intermediate setbacks are photograph fits.
 // Order the extension from its NE corner along the south edge back to NW.
 const ne=ext.findIndex(p=>eq(p,north[1])),nw=ext.findIndex(p=>eq(p,north[0])),loop=ext.slice(0,-1),outer=[[left,back],[right,back]];let ix=ne;
 const direction=(ne+1)%loop.length===nw?-1:1;
 while(true){outer.push(loop[ix]);if(ix===nw)break;ix=(ix+direction+loop.length)%loop.length;}
 outer.push(outer[0]);const base={type:'Polygon',coordinates:[outer]};
 const end=Math.max(...ext.map(p=>p[1])),first=Math.max(...north.map(p=>p[1]));
 const tiers=Array.from({length:5},(_,i)=>({front:first+(end-first)*i/4,height:18-3.4*i}));
 const clip=(lo,hi)=>A.clipGeometry(base,[-1000,lo,1000,hi]),height=z=>tiers.find(t=>z<=t.front+1e-7)?.height||tiers[4].height;
 const mesh=(key,g,col,mat=24)=>b.mesh('science2-'+key,g,0,0,0,1,1,1,col,mat);
 const body=new G.Geometry();
 // One continuous outer shell: no buried full-height box walls at tier joins.
 for(let i=1;i<outer.length;i++){
  const a=outer[i-1],q=outer[i],cuts=[0,1];
  if(Math.abs(q[1]-a[1])>1e-8)for(const t of tiers){const u=(t.front-a[1])/(q[1]-a[1]);if(u>1e-7&&u<1-1e-7)cuts.push(u);}
  cuts.sort((a,b)=>a-b);
  for(let j=1;j<cuts.length;j++){const p0=a.map((v,k)=>v+(q[k]-v)*cuts[j-1]),p1=a.map((v,k)=>v+(q[k]-v)*cuts[j]),h=height((p0[1]+p1[1])/2);
   body.quad([p1[0],0,p1[1]],[p0[0],0,p0[1]],[p0[0],h,p0[1]],[p1[0],h,p1[1]]);
  }
 }
 function section(z){const xs=[];for(let i=1;i<outer.length;i++){const a=outer[i-1],p=outer[i];if(Math.abs(p[1]-a[1])<1e-8)continue;const t=(z-a[1])/(p[1]-a[1]);if(t>=-1e-7&&t<=1+1e-7)xs.push(a[0]+(p[0]-a[0])*t);}return[Math.min(...xs),Math.max(...xs)];}
 for(let i=0;i<tiers.length;i++){
  const t=tiers[i],start=i?tiers[i-1].front:back,part=clip(start,t.front);body.v.push(...F.surface(part,t.height).v);
  if(i<4){const [l,r]=section(t.front);body.quad([l,tiers[i+1].height,t.front],[r,tiers[i+1].height,t.front],[r,t.height,t.front],[l,t.height,t.front]);}
  // The roof apron, white fascia, tile seams and end cheeks form each of the
  // five visible eave bands; no four-sided generic terrace parapet boxes.
  const z=t.front-.09,[l,r]=section(z),run=Math.min(1.15,(t.front-start)*.65),top=t.height+.86,low=t.height+.14;
  const roof=new G.Geometry().quad([l-.15,low,z+.16],[r+.15,low,z+.16],[r+.15,top,z-run],[l-.15,top,z-run]);
  mesh('step-apron-'+i,roof,'#696168',2);
  b.s19box('science2-step-fascia',(l+r)/2,low-.12,z+.13,r-l+.52,.28,.24,'#e8e9df',24,1.85);
  for(const x of[l-.10,r+.10]){
   const cheek=new G.Geometry(),w=.22;
   cheek.quad([x-w/2,t.height,z-run],[x+w/2,t.height,z-run],[x+w/2,top+.24,z-run],[x-w/2,top+.24,z-run]);
   for(const side of[-1,1]){const p=[[x+side*w/2,t.height,z+.24],[x+side*w/2,t.height,z-run],[x+side*w/2,top+.24,z-run],[x+side*w/2,low+.24,z+.24]];if(side<0)p.reverse();cheek.quad(...p);}
   mesh('step-cheek-'+i+'-'+x,cheek,'#e5e5dc');
  }
  for(let x=l+.25;x<r;x+=.28)b.beam([x,low+.025,z+.16],[x,top+.025,z-run],.025,'#8b8287',29,2.27);
  // One exposed upper window row on every riser; the lower rows continue on
  // both long sides under the same uninterrupted floor levels.
  if(i<4)for(let j=0;j<4;j++)b.s19Window(l+(j+.5)*(r-l)/4,t.height-1.54,t.front+.045,Math.min(3.6,(r-l)/4*.83),2.04);
 }
 mesh('continuous-step-body',body,'#e5e5dc');
 // Long window bands follow the staircase silhouette, rather than restarting
 // a separate facade grid at each closed terrace box.
 for(let j=0;j<5;j++){
  const y=2.02+3.4*j,z1=tiers[4-j].front-.35,z0=back+.28;if(z1<=z0)continue;
  for(const side of[-1,1]){const x=side<0?left-.045:right+.045,zz=(z0+z1)/2,len=z1-z0;
   b.local(x,y,zz,side*Math.PI/2,()=>{b.s19Window(0,0,0,len,2.02);for(let u=-len/2+1.45;u<len/2;u+=1.45)b.s19box('science2-side-mullion',u,0,.10,.075,2.12,.14,'#b2c3bf',29,.76);});
  }
 }
 const doorX=(left+right)/2,doorZ=end+.055;
 b.box(doorX,1.72,doorZ,5.8,3.05,.16,'#405655',28);b.box(doorX,4.1,doorZ+.34,7,.25,.82,'#aebbb2',29);
 b.lettering('理科二号楼',doorX,3.74,doorZ,8,.48,0,'#4b514a');
 for(const x of[left+2.1,right-2.1])b.s19Window(x,2.0,end+.025,2.9,2.05);
 b.solid((left+right)/2,(back+end)/2,right-left,end-back);
 return {base,tiers,sourceProjection:southPiece,door:[doorX,2,doorZ],heightBasis:'Five eave bands from complete laboratory photograph; heights/intermediate setbacks fitted, not surveyed.'};
}
function science(b){
 const wing=(x,z,w,d,h,levels,roof=true)=>b.local(x,0,z,0,()=>{b.s19Wall(w,d,h,levels,Math.max(3,Math.round(w/4.1)));if(roof)b.s19Roof(w,d,h+.45,6.2,Math.max(3,Math.round(w/4.1)),1.35);});
 // Source ring's north and west ranges enclose the mapped courtyard.
 wing(0,-25.3,43,14,22.2,5);
 b.local(-24,0,-1.5,Math.PI/2,()=>{b.s19Wall(45,10.8,22.2,5,11);b.s19Roof(45,10.8,22.65,6.2,11,.8);});
 // The complete south photograph shows six wall-window rows beneath the
 // main roof, with the highest small apron below that principal eave.
 // 22.2m is the inherited display fit, not a measured facade elevation.
 wing(-1,22,43,19,22.2,6);
 // Native winter imagery shows a continuous east courtyard wing. The five
 // south-facing steps occupy its south end, not the entire courtyard length.
 wing(22.10,-.575,15.40,55.15,22.2,5,false);
 b.s19box('science2-east-deck',22.10,22.32,-.575,15.40,.24,55.15,'#aeb6b0',10,1.4);
 return steppedWing(b);
}
function yingjie(b){
 // The entrance roof remains a single shallow band above two visible levels.
 // Reserve the southern forecourt; it is not a full-depth red-roof building.
 b.yingjieConference({},47,35);
}
A.render=function(b,f,add){const type=f.properties.architecture?.strategy;if(f.properties.id==='relation/14962080'){
 const g=Y.SCIENCE_LINK35.geometry;
 // Exclude only the disconnected SE 149.0454m2 difference polygon. It was
 // rendered as an unsupported 1m-high platform in front of Science Two.
 // The original OSM relation and difference data remain untouched.
 for(const [bb,h,n,key] of [[[-1000,-1000,1000,235],24,5,'north'],[[-1000,235,1000,265],10.5,2,'crosslink'],[[-1000,265,390,1000],1,1,'south-plinth']]){const part=A.clipGeometry(g,bb);if(Y.Footprints.polygons(part).length)A.footprint(b,{...f,geometry:part},add,{height:h,floors:n,style:'science',roof:'flat',key:'science-link35-'+key});}
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[358.5,.15,285.8];b.rotation=Math.PI/2+.0482;b.id=f.properties.pickId;b.anim=0;
 try{b.s19Wall(40,11.2,22.2,5,10);b.s19Roof(40,11.2,22.65,6.2,10,1.0);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {id:f.properties.id,strategy:'science-link35-difference',sourceArea:Y.SCIENCE_LINK35.originalArea,renderArea:Y.SCIENCE_LINK35.renderArea-Math.abs(F.area(southPiece[0]))};
 }if(!['science2','yingjie'].includes(type)||(type==='science2'&&f!==two))return previous(b,f,add);
 const fr=type==='science2'?sourceFrame:Y.ArchitectureAdapter.frame(f.geometry,0),old=[b.origin,b.rotation,b.id,b.anim];b.origin=[fr.centre[0],.15,fr.centre[1]];b.rotation=fr.r;b.id=f.properties.pickId;b.anim=0;let stepped;
 try{if(type==='science2')stepped=science(b);else yingjie(b);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 const result={id:f.properties.id,strategy:type+'-native35',frame:fr,scale:[1,1,1],sourceOutline:false,limits:'分楼翼拟合；立面朝向、楼翼深度和未见背面未实测。'};
 if(stepped)result.steppedWing=stepped;return result;
};
for(const f of Y.CAMPUS.features){const p=f.properties,t=p.architecture?.strategy;if(t==='science2')p.architecture.summary='南侧主翼的六排窗托起大坡屋顶，东南端五道短坡檐逐级降低，入口朝南。';if(t==='yingjie')p.architecture.summary='重做低层入口、整段坡屋面和前场；与理一、理二分别建模。';if(t==='science2')p.scopeNote='楼高、各级退距和檐口宽度为照片拟合；未见的背面细部仍待核实。';if(t==='yingjie')p.scopeNote='平面点位沿用公开地图；楼翼深度、立面朝向与未见背面仍为照片拟合。';}
})(YY);
