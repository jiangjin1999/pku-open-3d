/* Shaoyuan 6: photo material bands and recessed upper level; restaurant direction remains unplaced. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832236';
const O=[-392.448,256.756],R=Math.atan2(2.676,53.096),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.1,lowerWall:15.5,wall:18.6,eave:18.8,ridge:21.6},SETBACK=.85;
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}


function insetRing(ring,d){const pts=ring.slice(0,-1),sg=Math.sign(F.area(ring)),lines=pts.map((a,i)=>{const b=pts[(i+1)%pts.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);return{a:[a[0]-dz/len*sg*d,a[1]+dx/len*sg*d],dx,dz};}),out=[];for(let i=0;i<lines.length;i++){const p=lines[(i+lines.length-1)%lines.length],q=lines[i],cross=p.dx*q.dz-p.dz*q.dx;if(Math.abs(cross)<1e-8)out.push(q.a);else{const t=((q.a[0]-p.a[0])*q.dz-(q.a[1]-p.a[1])*q.dx)/cross;out.push([p.a[0]+p.dx*t,p.a[1]+p.dz*t]);}}return[...out,out[0]];}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];},group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'032-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 add('032-setback-ledge',F.surface(f.geometry,H.lowerWall),'#e0dfcc',24,id);
 add('032-source-roof-deck',F.surface(f.geometry,H.wall),'#c9cab8',24,id);
 for(const q of[{name:'west-long',box:[0,-.01,51.205,19.40]},{name:'east-offset',box:[51.205,-.01,73.91,21.11]}]){const box=q.box,half=(box[3]-box[1])/2,mid=(box[3]+box[1])/2,height=p=>H.eave+2.8*Math.max(0,Math.min(1,(p[0]-box[0])/half,(box[2]-p[0])/half,1-Math.abs(p[1]-mid)/half)),mesh=new G.Geometry(),tiles=new G.Geometry();
 for(let u=box[0];u<box[2];u+=.7)for(let v=box[1];v<box[3];v+=.7)for(const p of pieces(f,[u,v,Math.min(u+.7,box[2]),Math.min(v+.7,box[3])]))for(let k=1;k<p.length-1;k++)mesh.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p),p[1])));add('032-hip-roof-'+q.name,mesh,'#667269',2,id);
 const skirt=new G.Geometry(),ring=F.polygons(f.geometry)[0][0];for(let i=1;i<ring.length;i++){const a=local(ring[i-1]),c=local(ring[i]),n=Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/.4);for(let k=0;k<n;k++){const p=a.map((v,j)=>v+(c[j]-v)*k/n),t=a.map((v,j)=>v+(c[j]-v)*(k+1)/n),mid=p.map((v,j)=>(v+t[j])/2);if(mid[0]<box[0]||mid[0]>box[2]||mid[1]<box[1]||mid[1]>box[3])continue;skirt.quad(vertex(p[0],H.wall,p[1]),vertex(t[0],H.wall,t[1]),vertex(t[0],height(t),t[1]),vertex(p[0],height(p),p[1]));}}add('032-roof-edge-skirt-'+q.name,skirt,'#d8d9c7',24,id);
 for(let u=box[0]+.2;u<box[2];u+=.5)for(let v=box[1];v<box[3];v+=.8)for(const p of pieces(f,[u-.025,v,u+.025,Math.min(v+.8,box[3])]))for(let k=1;k<p.length-1;k++)tiles.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.025,p[1])));add('032-roof-tile-lines-'+q.name,tiles,'#8a9489',2,id);
 }
 const source=F.polygons(f.geometry)[0][0],upper=insetRing(source,SETBACK);
 const facade=(ring,upperOnly)=>{const positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),la=local(a),lc=local(c),mu=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2,hor=Math.abs(lc[0]-la[0])>Math.abs(lc[1]-la[1]),north=hor&&mv<4.4,count=Math.max(1,Math.round(len/(upperOnly?4.1:3.7))),stride=len/count;
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group(upperOnly?'cream-setback':'lower-'+(north?'north-candidate':'secondary'),()=>{for(let floor=upperOnly?5:0;floor<(upperOnly?6:5);floor++){const base=floor*H.floor,color=upperOnly?'#e4dfc4':floor===0?'#c1c5c2':'#845145',bottom=base+.77,top=base+2.53,panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.035,e-s,hi-lo,.07,color,24);};let cursor=0;
 for(let k=0;k<count;k++){const x=(k+.5)*stride,w=Math.min(2.3,stride*.62),s=x-w/2,e=x+w/2;panel(cursor,s,base,base+H.floor);panel(s,e,base,bottom);panel(s,e,top,base+H.floor);for(const xx of[s,e])b.box(xx,(bottom+top)/2,-.18,.065,top-bottom,.36,'#3e4747',24);for(const yy of[bottom,top])b.box(x,yy,-.18,w,.065,.36,'#3e4747',24);b.box(x,(bottom+top)/2,-.38,w-.10,top-bottom-.1,.05,'#687f86',5);b.box(x,(bottom+top)/2,-.335,.065,top-bottom,.07,'#354445',24);b.box(x,bottom+(top-bottom)*.75,-.335,w,.055,.07,'#354445',24);
 if(north&&!upperOnly&&floor>0&&len>8){const acx=Math.min(len-.45,x+w/2+.25);b.box(acx,base+.57,.22,.67,.47,.44,'#c8ceca',24);b.box(acx,base+.57,.45,.42,.30,.025,'#87968f',24);}cursor=e;}panel(cursor,len,base,base+H.floor);
 if(floor===0){b.box(len/2,H.floor+.015,.04,len,.14,.16,'#dee0d7',24);for(let y=.4;y<3.1;y+=.65)b.box(len/2,y,.013,len,.025,.025,'#9ea8a4',24);}}
 if(north&&!upperOnly&&len>8){for(let k=0;k<count;k+=2)b.box((k+1)*stride-.18,7.9,.11,.075,15.0,.095,'#d1d7cd',24);}if(upperOnly){b.box(len/2,H.wall+.01,.20,len+.05,.18,.65,'#e5e1c9',24);b.box(len/2,H.lowerWall+.12,.14,len,.16,.40,'#d9d8c6',24);}
 }));}};
 facade(source,false);facade(upper,true);
 return{strategy:'building032-v46',visualRows:6,officialFloorCount:null,floorCountVerified:false,sourceOutline:true,creamSetback:true,restaurantDoorPlaced:false,restaurantWestSideKnown:true,dormMainDoorVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building032={id:ID,render,world,local,pieces,heights:H,insetRing,setback:SETBACK};
})(YY);
