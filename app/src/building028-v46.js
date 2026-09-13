/* Democracy Building: two visible levels and traditional wudian roof, own source footprint. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832218';
const O=[-316.874,-246.008],R=Math.atan2(.211,17.773),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.9,wall:7.8,eave:8.05,ridge:12.1};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function render(b,f,add){const id=f.properties.pickId;b.id=id;const ps=F.polygons(f.geometry)[0][0].map(local),xs=ps.map(p=>p[0]),zs=ps.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),half=(x1-x0)/2,cx=(x0+x1)/2;
 const profile=p=>{const [u,v]=local(p),t=Math.max(0,Math.min(1,(u-x0)/half,(x1-u)/half,(v-z0)/half,(z1-v)/half));return H.eave+(H.ridge-H.eave)*Math.pow(t,1.28);};
 add('028-wudian-four-slope-roof',F.profiledSurface(f.geometry,profile,.85),'#646f69',25,id);
 add('028-roof-underside',F.surface(f.geometry,H.wall),'#4e5d56',24,id);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'028-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 // Four diagonal ridges and one north-south main ridge. No gable triangles or copied porch.
 const rn=[cx,z0+half],rs=[cx,z1-half],ridgePaths=[[rn,rs],[[x0,z0],rn],[[x1,z0],rn],[[x0,z1],rs],[[x1,z1],rs]];
 for(let j=0;j<ridgePaths.length;j++){const [a,c]=ridgePaths[j],g=new G.Geometry(),n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/.6)),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),ox=-dz/len*.095,oz=dx/len*.095;for(let k=0;k<n;k++){const t=k/n,t1=(k+1)/n,p=[a[0]+dx*t,a[1]+dz*t],q=[a[0]+dx*t1,a[1]+dz*t1];const pts=[[p[0]+ox,p[1]+oz],[q[0]+ox,q[1]+oz],[q[0]-ox,q[1]-oz],[p[0]-ox,p[1]-oz]].map(v=>{v[0]=Math.max(x0,Math.min(x1,v[0]));v[1]=Math.max(z0,Math.min(z1,v[1]));return vertex(v[0],profile(world(...v))+.12,v[1]);});g.quad(...pts);}add('028-roof-ridge-'+j,g,'#818b80',25,id);}
 // Fine roof tile ribs run down each side, stopping at the appropriate hip break.
 const tile=new G.Geometry();for(let v=z0+.3;v<z1;v+=.43){const inset=Math.min(half,v-z0,z1-v);for(const side of [-1,1]){const from=side<0?x0:x1,to=side<0?x0+inset:x1-inset;for(let k=0;k<16;k++){const a=from+(to-from)*k/16,c=from+(to-from)*(k+1)/16;tile.quad(...[[a,v-.025],[c,v-.025],[c,v+.025],[a,v+.025]].map(p=>vertex(p[0],profile(world(...p))+.03,p[1])));}}}add('028-roof-tile-ribs',tile,'#889188',25,id);
 // End slopes carry their own downslope ribs; stop below the diagonal ridge to avoid double surfaces.
 const endCaps=F.capTriangles(F.polygons(f.geometry)[0]).map(t=>t.map(local));
 const cut=(p,a,k,greater)=>{const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((v,j)=>v+t*(e[j]-v)));}}return out;};
 for(const side of[-1,1]){const g=new G.Geometry();for(let u=x0+.3;u<x1-.1;u+=.43){const inset=Math.min(half,u-x0-.06,x1-u-.06);if(inset<=0)continue;const from=side<0?z0:z1,to=side<0?z0+inset:z1-inset;for(let k=0;k<16;k++){const a=from+(to-from)*k/16,c=from+(to-from)*(k+1)/16;for(const tri of endCaps){let p=tri;for(const[axis,value,greater]of[[0,u-.025,true],[0,u+.025,false],[1,Math.min(a,c),true],[1,Math.max(a,c),false]])if(p.length)p=cut(p,axis,value,greater);for(let j=1;j<p.length-1;j++)g.tri(...[p[0],p[j],p[j+1]].map(q=>vertex(q[0],profile(world(...q))+.03,q[1])));}}}add('028-roof-end-tile-ribs-'+(side<0?'north':'south'),g,'#889188',25,id);}

 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),count=len>25?9:4,stride=len/count;
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+i,()=>{const panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.47,e-s,hi-lo,.12,'#d4d2c3',24);};
 for(let floor=0;floor<2;floor++){const base=H.floor*floor,bottom=base+.88,top=base+3.15;let cursor=0;for(let k=0;k<count;k++){const mid=(k+.5)*stride,w=Math.min(2.45,stride*.61),s=mid-w/2,e=mid+w/2;panel(cursor,s,base,base+H.floor);panel(s,e,base,bottom);panel(s,e,top,base+H.floor);for(const x of[s,e])b.box(x,(bottom+top)/2,-.62,.07,top-bottom,.36,'#744d40',6);for(const y of[bottom,top])b.box(mid,y,-.62,w,.07,.36,'#744d40',6);b.box(mid,(bottom+top)/2,-.82,w-.1,top-bottom-.1,.05,'#4d6260',5);for(let q=1;q<4;q++)b.box(s+w*q/4,(bottom+top)/2,-.78,.045,top-bottom,.07,'#855344',6);b.box(mid,bottom+(top-bottom)*.64,-.78,w,.05,.07,'#855344',6);cursor=e;}panel(cursor,len,base,base+H.floor);b.box(len/2,base+.12,-.285,len,.24,.38,'#deddd0',24);}
 for(let k=0;k<=count;k++)b.box(Math.min(len-.10,Math.max(.1,k*stride)),H.wall/2,-.29,.20,H.wall,.34,'#e1dfce',24);
 b.box(len/2,H.wall-.10,-.22,len,.26,.56,'#6b4a3f',6);b.box(len/2,H.wall+.12,-.12,len,.22,.48,'#44564d',24);
 }));}
 return{strategy:'building028-v46',floors:2,sourceOutline:true,roofType:'wudian',fiveRidges:true,windowRhythmFitted:true,entranceVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building028={id:ID,render,world,local,heights:H};
})(YY);
