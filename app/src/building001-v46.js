/* Science Building 5: retained courtyard, annular pitched roof, photo-led north facade. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/3249764';
const O=[367.851,375.730],R=Math.atan2(2.143,43.898),CO=Math.cos(R),SI=Math.sin(R);
const C={wall:'#9d9c9a',frame:'#747d80',glass:'#61767d',roof:'#727a76',tile:'#8d9590',stone:'#a5a3a0',door:'#516972'};
const H={wall:21.1,eave:21.26,ridge:24.8},entrance={u:12,v:0,width:10,depth:2.2,positionFitted:true};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'001-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 add('001-source-roof-deck',F.surface(f.geometry,H.wall),C.roof,24,id);
 // Eight annular roof faces run outer eave -> closed ridge -> courtyard eave, never across the hole.
 const outer=[[-6.773,0],[50.513,0],[50.513,57.129],[-6.773,57.129]],inner=[[6.343,17.551],[36.442,17.175],[36.731,38.933],[6.632,39.309]],ridge=outer.map((p,i)=>p.map((x,j)=>(x+inner[i][j])/2));
 const regions=[];
 for(let i=0;i<4;i++){const j=(i+1)%4;regions.push({name:['north','east','south','west'][i]+'-outer',p:[outer[i],outer[j],ridge[j],ridge[i]],h:[H.eave,H.eave,H.ridge,H.ridge]});regions.push({name:['north','east','south','west'][i]+'-inner',p:[ridge[i],ridge[j],inner[j],inner[i]],h:[H.ridge,H.ridge,H.eave,H.eave]});}
 function intersect(poly,cl){let p=poly,sign=Math.sign(F.area([...cl,cl[0]]));for(let i=0;i<cl.length&&p.length;i++){const aa=cl[i],cc=cl[(i+1)%cl.length],out=[],d=s=>sign*((cc[0]-aa[0])*(s[1]-aa[1])-(cc[1]-aa[1])*(s[0]-aa[0]));for(let j=0;j<p.length;j++){const s=p[j],e=p[(j+1)%p.length],ds=d(s),de=d(e);if(ds>=-1e-8)out.push(s);if((ds>=-1e-8)!==(de>=-1e-8)){const t=ds/(ds-de);out.push(s.map((x,k)=>x+t*(e[k]-x)));}}p=out;}return p;}
 const roofPlanes=[];
 for(const q of regions){const mesh=new G.Geometry();for(const inds of [[0,1,2],[0,2,3]]){const tri=inds.map(i=>q.p[i]),hs=inds.map(i=>q.h[i]),[a,c,d]=tri,den=(c[1]-d[1])*(a[0]-d[0])+(d[0]-c[0])*(a[1]-d[1]);const height=p=>{const u=((c[1]-d[1])*(p[0]-d[0])+(d[0]-c[0])*(p[1]-d[1]))/den,v=((d[1]-a[1])*(p[0]-d[0])+(a[0]-d[0])*(p[1]-d[1]))/den;return u*hs[0]+v*hs[1]+(1-u-v)*hs[2];};roofPlanes.push({tri,height});for(const src of pieces(f,[-7,0,51,58])){const pp=intersect(src,tri);for(let k=1;k<pp.length-1;k++)mesh.tri(...[pp[0],pp[k],pp[k+1]].map(p=>vertex(p[0],height(p),p[1])));}}add('001-ring-roof-'+q.name,mesh,C.roof,2,id);}
 // Clipped stepped corners expose a short upper wall, not an unsupported roof edge.
 function roofAt(p){for(const q of roofPlanes){const [a,c,d]=q.tri,den=(c[1]-d[1])*(a[0]-d[0])+(d[0]-c[0])*(a[1]-d[1]),u=((c[1]-d[1])*(p[0]-d[0])+(d[0]-c[0])*(p[1]-d[1]))/den,v=((d[1]-a[1])*(p[0]-d[0])+(a[0]-d[0])*(p[1]-d[1]))/den;if(Math.min(u,v,1-u-v)>-1e-5)return q.height(p);}return H.eave;}
 const skirt=new G.Geometry();for(const pg of F.polygons(f.geometry))for(const ring of pg)for(let i=1;i<ring.length;i++){const a=local(ring[i-1]),c=local(ring[i]),n=Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])*2);for(let j=0;j<n;j++){const p=a.map((x,k)=>x+(c[k]-x)*j/n),q=a.map((x,k)=>x+(c[k]-x)*(j+1)/n);skirt.quad(vertex(p[0],H.wall,p[1]),vertex(q[0],H.wall,q[1]),vertex(q[0],roofAt(q),q[1]),vertex(p[0],roofAt(p),p[1]));}}add('001-roof-edge-upper-wall',skirt,C.wall,24,id);
 const levels=[{lo:0,hi:3.2,bottom:.45,top:2.92,n:7,ratio:.66},{lo:3.2,hi:7.8,bottom:3.4,top:7.48,n:7,ratio:.81},{lo:7.8,hi:11.2,bottom:8.62,top:10.52,n:13,ratio:.60},{lo:11.2,hi:14.6,bottom:12.02,top:13.92,n:13,ratio:.60},{lo:14.6,hi:18,bottom:15.42,top:17.32,n:13,ratio:.60},{lo:18,hi:21.1,bottom:19.05,top:20.60,n:26,ratio:.28}];
 for(const pg of F.polygons(f.geometry))for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if((ri===0&&positive)||(ri>0&&!positive))[a,c]=[c,a];const la=local(a),lc=local(c),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),du=lc[0]-la[0],dv=lc[1]-la[1],north=ri===0&&Math.abs((la[1]+lc[1])/2)<.02&&len>40,face=ri?'courtyard-fitted':north?'north-photo':'outer-fitted';
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{
 const panel=(x0,x1,y0,y1)=>{if(x1>x0&&y1>y0)b.box((x0+x1)/2,(y0+y1)/2,-.045,x1-x0,y1-y0,.09,C.wall,24);};
 for(let floor=0;floor<6;floor++){const lv=levels[floor],n=north?lv.n:Math.max(1,Math.floor(len/3.4)),opens=[];
 if(len>3)for(let k=0;k<n;k++){const x=len*(k+.5)/n,w=Math.min(north?len/n*lv.ratio:1.7,len/n-.65);if(w>.35)opens.push({s:x-w/2,e:x+w/2,bottom:north?lv.bottom:lv.lo+.7,top:north?lv.top:Math.min(lv.hi-.45,lv.lo+2.6),depth:.32});}
 if(north){const range=(u,w)=>{const x=(u-la[0])/du*len;return[x-w/2,x+w/2];};
 const [gs,ge]=range(42.4,1.05);for(let j=opens.length-1;j>=0;j--)if(opens[j].e>gs-.15&&opens[j].s<ge+.15)opens.splice(j,1);opens.push({s:gs,e:ge,bottom:lv.lo+.08,top:Math.min(lv.hi-.08,18),depth:.22,curtain:true});
 if(floor===0){const [s,e]=range(entrance.u,entrance.width);for(let j=opens.length-1;j>=0;j--)if(opens[j].e>s-.12&&opens[j].s<e+.12)opens.splice(j,1);opens.push({s,e,bottom:.12,top:3.08,depth:entrance.depth,door:true});}}
 opens.sort((a,c)=>a.s-c.s);let cursor=0;
 for(const q of opens.filter(q=>q.s>.05&&q.e<len-.05&&q.top>q.bottom)){panel(cursor,q.s,lv.lo,lv.hi);panel(q.s,q.e,lv.lo,q.bottom);panel(q.s,q.e,q.top,lv.hi);const x=(q.s+q.e)/2,y=(q.bottom+q.top)/2,w=q.e-q.s,h=q.top-q.bottom,d=q.depth;
 for(const xx of [q.s,q.e])b.box(xx,y,-d/2,.065,h,d,C.frame,24);for(const yy of [q.bottom,q.top])b.box(x,yy,-d/2,w,.065,d,C.frame,24);b.box(x,y,-d,w-.09,h-.06,.045,q.door?C.door:C.glass,5);
 const cols=q.door?6:north&&floor===1?3:q.curtain?2:1;for(let k=1;k<cols;k++)b.box(q.s+w*k/cols,y,-d+.04,.045,h,.075,C.frame,6);
 if(q.door)b.box(x,.9,-d+.045,w,.045,.075,C.frame,6);else if((north&&floor===1)||q.curtain)for(let k=1;k<3;k++)b.box(x,q.bottom+h*k/3,-d+.04,w,.045,.075,C.frame,6);
 cursor=q.e;}
 panel(cursor,len,lv.lo,lv.hi);
 }
 }));}}
 // Fitted north-side covered recess; the route photo supports a coffered soffit and bust/plinth relationship.
 b.local(O[0],0,O[1],R,()=>{
 group('north-entrance-coffers',()=>{for(let k=0;k<=5;k++)b.box(entrance.u-5+k*2,3.00,1.10,.13,.14,2.2,C.stone,24);for(let k=0;k<=3;k++)b.box(entrance.u,3.00,k*2.2/3,10,.14,.13,C.stone,24);});
 group('entrance-central-pier',()=>b.box(entrance.u,1.60,2.08,.64,3.20,.32,C.wall,24));
 group('historical-bust',()=>{const u=entrance.u,v=.8;b.box(u,.08,v,.94,.16,.82,'#795754',24);b.box(u,.74,v,.70,1.32,.64,'#815c57',24);b.sphere(u,1.57,v,.34,.22,.20,'#50534f',24,0,true);b.cyl(u,1.66,v,.10,.16,'#50534f',12,1,24);b.sphere(u,1.92,v,.17,.23,.16,'#50534f',24,0,true);});
 });
 return{strategy:'building001-v46',floors:6,sourceOutline:true,courtyardOpen:true,ringRoofFaces:8,northApproachSupported:true,entrancePositionFitted:true,fourWingEqualHeightVerified:false,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building001={id:ID,render,world,local,pieces,heights:H,entrance};
})(YY);
