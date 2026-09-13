/* Red Six / School of Arts: independent named repair photo facade. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832224';
const O=[-103.825,-267.515],R=-Math.PI/2+Math.atan2(.244,38.227),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.7,wall:7.4,eave:7.65,ridge:11.7};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function render(b,f,add){const id=f.properties.pickId;b.id=id;const ps=F.polygons(f.geometry)[0][0].map(local),xs=ps.map(p=>p[0]),zs=ps.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),half=(x1-x0)/2,cx=(x0+x1)/2;
 const profile=p=>{const [u,v]=local(p),t=Math.max(0,Math.min(1,(u-x0)/half,(x1-u)/half,(v-z0)/half,(z1-v)/half));return H.eave+(H.ridge-H.eave)*Math.pow(t,1.28);};
 add('030-wudian-four-slope-roof',F.profiledSurface(f.geometry,profile,.85),'#646f69',25,id);
 add('030-roof-underside',F.surface(f.geometry,H.wall),'#4e5d56',24,id);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'030-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 // Four diagonal ridges and one north-south main ridge. No gable triangles or copied porch.
 const rn=[cx,z0+half],rs=[cx,z1-half],ridgePaths=[[rn,rs],[[x0,z0],rn],[[x1,z0],rn],[[x0,z1],rs],[[x1,z1],rs]];
 for(let j=0;j<ridgePaths.length;j++){const [a,c]=ridgePaths[j],g=new G.Geometry(),n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/.6)),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),ox=-dz/len*.095,oz=dx/len*.095;for(let k=0;k<n;k++){const t=k/n,t1=(k+1)/n,p=[a[0]+dx*t,a[1]+dz*t],q=[a[0]+dx*t1,a[1]+dz*t1];const pts=[[p[0]+ox,p[1]+oz],[q[0]+ox,q[1]+oz],[q[0]-ox,q[1]-oz],[p[0]-ox,p[1]-oz]].map(v=>{v[0]=Math.max(x0,Math.min(x1,v[0]));v[1]=Math.max(z0,Math.min(z1,v[1]));return vertex(v[0],profile(world(...v))+.12,v[1]);});g.quad(...pts);}add('030-roof-ridge-'+j,g,'#818b80',25,id);}
 b.local(O[0],0,O[1],R,()=>group('ridge-end-ornaments',()=>{for(const [v,sg]of[[z0+half,-1],[z1-half,1]]){b.box(cx,H.ridge+.24,v,.30,.46,.48,'#6b746c',25);for(let k=0;k<5;k++){const t=k/4;b.box(cx,H.ridge+.35+t*.48,v+sg*(.10+t*.30),.24,.18,.22,'#6b746c',25);}}}));
 // Fine roof tile ribs run down each side, stopping at the appropriate hip break.
 const tile=new G.Geometry();for(let v=z0+.3;v<z1;v+=.43){const inset=Math.min(half,v-z0,z1-v);for(const side of [-1,1]){const from=side<0?x0:x1,to=side<0?x0+inset:x1-inset;for(let k=0;k<16;k++){const a=from+(to-from)*k/16,c=from+(to-from)*(k+1)/16;tile.quad(...[[a,v-.025],[c,v-.025],[c,v+.025],[a,v+.025]].map(p=>vertex(p[0],profile(world(...p))+.03,p[1])));}}}add('030-roof-tile-ribs',tile,'#889188',25,id);
 // End slopes carry their own downslope ribs; stop below the diagonal ridge to avoid double surfaces.
 const endCaps=F.capTriangles(F.polygons(f.geometry)[0]).map(t=>t.map(local));
 const cut=(p,a,k,greater)=>{const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((v,j)=>v+t*(e[j]-v)));}}return out;};
 for(const side of[-1,1]){const g=new G.Geometry();for(let u=x0+.3;u<x1-.1;u+=.43){const inset=Math.min(half,u-x0-.06,x1-u-.06);if(inset<=0)continue;const from=side<0?z0:z1,to=side<0?z0+inset:z1-inset;for(let k=0;k<16;k++){const a=from+(to-from)*k/16,c=from+(to-from)*(k+1)/16;for(const tri of endCaps){let p=tri;for(const[axis,value,greater]of[[0,u-.025,true],[0,u+.025,false],[1,Math.min(a,c),true],[1,Math.max(a,c),false]])if(p.length)p=cut(p,axis,value,greater);for(let j=1;j<p.length-1;j++)g.tri(...[p[0],p[j],p[j+1]].map(q=>vertex(q[0],profile(world(...q))+.03,q[1])));}}}add('030-roof-end-tile-ribs-'+(side<0?'north':'south'),g,'#889188',25,id);}

 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 const photoX=x=>(x+50)/(1942+50)*38.227;
 const upper=[[-20,267],[335,636],[704,800],[858,1034],[1092,1187],[1254,1538],[1603,1888]].map(p=>p.map(photoX));
 const lower=[[-20,70],[175,265],[335,432],[538,633],[704,798],[1094,1190],[1257,1352],[1461,1540],[1610,1704],[1800,1887]].map(p=>p.map(photoX));
 const doorCentre=photoX(946.5),doorWidth=photoX(1035)-photoX(858);
 let mainDoor=null;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),la=local(a),lc=local(c),south=len>30&&(la[0]+lc[0])/2>15,count=len>25?9:Math.max(1,Math.round(len/4.1)),stride=len/count;
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group(south?'south-photo-facade':'secondary-facade-'+i,()=>{const panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.47,e-s,hi-lo,.12,'#e0ded2',24);};
 for(let floor=0;floor<2;floor++){const base=H.floor*floor,bottom=base+(floor? .66:.68),top=base+(floor?3.29:2.9);let openings=south?(floor?upper:lower).map(([s,e])=>({s:s/38.227*len,e:e/38.227*len,bottom,top})):Array.from({length:count},(_,k)=>{const mid=(k+.5)*stride,w=Math.min(2.45,stride*.61);return{s:mid-w/2,e:mid+w/2,bottom,top};});
 if(south&&floor===0){const mid=doorCentre/38.227*len,w=doorWidth/38.227*len;openings.push({s:mid-w/2,e:mid+w/2,bottom:.42,top:3.01,door:true});mainDoor={a,c,len,mid,width:w};}
 openings.sort((a,b)=>a.s-b.s);let cursor=0;
 for(const q of openings){const{s,e,bottom,top}=q,mid=(s+e)/2,w=e-s;panel(cursor,s,base,base+H.floor);panel(s,e,base,bottom);panel(s,e,top,base+H.floor);
 for(const x of[s,e])b.box(x,(bottom+top)/2,-.62,.07,top-bottom,.36,'#853d34',6);for(const y of[bottom,top])b.box(mid,y,-.62,w,.07,.36,'#853d34',6);
 b.box(mid,(bottom+top)/2,-.82,w-.1,top-bottom-.1,.05,q.door?'#8e302b':'#4d6260',q.door?6:5);
 if(q.door){for(const x of[mid-w*.25,mid+w*.25])b.box(x,1.95,-.77,w*.39,1.55,.055,'#9d9c81',5);b.box(mid,1.90,-.72,.09,2.1,.09,'#84332e',6);}
 else{const divisions=Math.max(3,Math.round(w/.45));for(let k=1;k<divisions;k++)b.box(s+w*k/divisions,(bottom+top)/2,-.78,.045,top-bottom,.07,'#8b4238',6);for(const y of[bottom+(top-bottom)*.65,bottom+(top-bottom)*.83])b.box(mid,y,-.78,w,.05,.07,'#8b4238',6);}
 cursor=e;}panel(cursor,len,base,base+H.floor);b.box(len/2,base+.12,-.31,len,.24,.38,'#e1dfd3',24);}
 const columns=south?[-32,306,666,1218,1568,1923].map(x=>photoX(x)/38.227*len):Array.from({length:count+1},(_,k)=>Math.min(len-.1,Math.max(.1,k*stride)));
 for(const x of columns)b.box(x,H.wall/2,-.25,.33,H.wall,.40,'#a2483e',6);
 b.box(len/2,.20,-.20,len,.40,.50,'#a5a69c',24);if(!south)b.box(len/2,H.wall-.12,-.18,len,.38,.60,'#3f6b63',24);
 if(south)group('south-painted-frieze',()=>{
 // Own repair photograph: continuous blue-green painted beam, simplified by visible bay boundaries.
 const y=7.235;
 b.box(len/2,y,-.18,len,.39,.60,'#315e68',24);
 for(const yy of[7.055,7.415])b.box(len/2,yy,.135,len,.03,.025,'#709681',24);
 for(let j=0;j<columns.length-1;j++){const mid=(columns[j]+columns[j+1])/2,w=(columns[j+1]-columns[j])*.53;
 b.box(mid,y,.141,w,.245,.016,'#73958c',24);
 const poly=[[-w/2+.13,-.135],[w/2-.13,-.135],[w/2,-.03],[w/2,.03],[w/2-.13,.135],[-w/2+.13,.135],[-w/2,.03],[-w/2,-.03],[-w/2+.13,-.135]];
 for(let k=1;k<poly.length;k++)b.beam([mid+poly[k-1][0],y+poly[k-1][1],.163],[mid+poly[k][0],y+poly[k][1],.163],.019,'#346477',24);
 for(let k=0;k<56;k++){const a=-w*.40+w*.80*k/56,c=-w*.40+w*.80*(k+1)/56;b.beam([mid+a,y+.045*Math.sin(k*Math.PI/8),.169],[mid+c,y+.045*Math.sin((k+1)*Math.PI/8),.169],.023,'#294a4d',24);}
 }
 for(const x of columns){b.box(x,y,.144,.28,.31,.018,'#799791',24);for(const dx of[-.07,.07])b.box(x+dx,y,.163,.028,.23,.016,'#365e77',24);}
 });
 if(south){const x=doorCentre/38.227*len,w=doorWidth/38.227*len; b.box(x,3.48,-.385,w*1.50,.70,.12,'#231e1c',24);b.sign('北京大学艺术学院',x,3.48,-.315,w*1.46,.65,0);const uv=b.signs.get('北京大学艺术学院_false');if(uv){const px=uv[0]*4096,py=(1-uv[1]-uv[3])*4096;b.ctx.fillStyle='#231e1c';b.ctx.fillRect(px,py,512,128);b.ctx.fillStyle='#69aea2';b.ctx.font='600 54px serif';b.ctx.textAlign='center';b.ctx.textBaseline='middle';b.ctx.fillText('北京大学艺术学院',px+256,py+65);}for(const xx of[x-w/2-.45,x+w/2+.45]){b.box(xx,2.85,-.16,.11,.32,.18,'#344342',24);b.box(xx,2.9,-.05,.10,.13,.11,'#d8d4bc',5);}
 b.box(x,.21,.05,w+.18,.42,1.0,'#aaa99f',24);for(let k=0;k<3;k++){const h=.14*(k+1);b.box(x,h/2,1.36-k*.40,w+.18,h,.41,'#aaa99f',24);}}
 }));}

 return{strategy:'building030-v46',floors:2,sourceOutline:true,roofType:'wudian',fiveRidges:true,windowRhythmFitted:true,southFacadePhotoLed:true,entranceVerified:true,artPlaque:true,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building030={id:ID,render,world,local,heights:H};
})(YY);
