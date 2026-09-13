/* Shaoyuan 4: own evacuation plans, no balconies, one-storey south lobby. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832229';
const O=[-426.643,225.422],R=Math.atan2(1.599,48.654),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.1,wall:15.5,eave:15.7,ridge:18.8,lobby:3.1};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
const lobby={u0:28.81,u1:35.61,v0:11.732,v1:17.30,doorV:14.85},exits=[{face:'east-end',axis:1,u:51.083,v:5.73,width:1.9},{face:'southwest-end',axis:0,u:6.25,v:17.831,width:1.9}];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}

function render(b,f,add){const id=f.properties.pickId;b.id=id;
 const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];},group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'031-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 add('031-source-roof-deck',F.surface(f.geometry,H.wall),'#788178',24,id);
 for(const q of[{name:'west-south-short',box:[0,0,12.163,17.831],axis:1},{name:'east-west-long',box:[12.163,0,48.68,11.74],axis:0},{name:'east-service',box:[48.68,0,51.09,11.74],axis:0,low:true}]){const a=q.axis,c=1-a,box=q.box,amin=box[a],amax=box[a+2],cmin=box[c],cmax=box[c+2],half=(cmax-cmin)/2,mid=(cmin+cmax)/2;
 const height=p=>{if(q.low)return H.eave-.10*(p[0]-48.68)/(51.09-48.68);const t=Math.max(0,Math.min(1,(p[a]-amin)/half,(amax-p[a])/half,1-Math.abs(p[c]-mid)/half));return H.eave+3.1*t;},mesh=new G.Geometry(),tiles=new G.Geometry();
 // Fine rectangular subdivisions sample the hip height while every piece is clipped to the original ring.
 for(let u=box[0];u<box[2];u+=.7)for(let v=box[1];v<box[3];v+=.7)for(const p of pieces(f,[u,v,Math.min(u+.7,box[2]),Math.min(v+.7,box[3])]))for(let k=1;k<p.length-1;k++)mesh.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p),p[1])));
 add(q.low?'031-east-service-cap':'031-hip-roof-'+q.name,mesh,'#69776e',2,id);
 if(q.low)continue;
 for(let t=amin+.2;t<amax;t+=.45){const rr=box.slice();rr[a]=t-.025;rr[a+2]=t+.025;for(let n=0;n<18;n++){rr[c]=cmin+(cmax-cmin)*n/18;rr[c+2]=cmin+(cmax-cmin)*(n+1)/18;for(const p of pieces(f,rr))for(let k=1;k<p.length-1;k++)tiles.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],height(p)+.03,p[1])));}}add('031-roof-tiles-'+q.name,tiles,'#929d90',2,id);
 }
 const map=x=>(x-59)/(1316-59)*48.68,first=x=>(x-38)/(857-38)*48.68,cells=xs=>xs.slice(1).map((e,i)=>[xs[i],e]);
 const north=cells([138,216,295,372,383,467,553,637,721,807,892,975,1062,1147,1230,1316].map(map)).filter(([s,e])=>e-s>1);
 const southUpper=[...cells([383,467,553,637,721,807].map(map)),...cells([892,975,1062,1147,1230,1316].map(map))];
 const southFirst=[...cells([249,304,360,415,470,523].map(first)),...cells([637,691,746,801,857].map(first))];
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
 for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),la=local(a),lc=local(c),du=lc[0]-la[0],dv=lc[1]-la[1],hor=Math.abs(du)>Math.abs(dv),mu=(la[0]+lc[0])/2,mv=(la[1]+lc[1])/2;let face=hor?(mv<.1?'north':mv>17?'southwest-end':mv>11?'south':'small-return'):(mu>50?'east-end':mu>47?'east-return':mu>10?'westwing-east':'west-end');
 b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+face,()=>{const panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.035,e-s,hi-lo,.07,'#cbcabe',24);};
 for(let floor=0;floor<5;floor++){const base=floor*H.floor,source=face==='north'?north:face==='south'?(floor?southUpper:southFirst):cells(Array.from({length:Math.max(2,Math.ceil(len/3.1)+1)},(_,k)=>Math.min(la[hor?0:1],lc[hor?0:1])+k*len/Math.max(1,Math.ceil(len/3.1))));
 let openings=source.map(([s,e])=>{const ax=hor?0:1,d=hor?du:dv,ss=(s-la[ax])/d*len,ee=(e-la[ax])/d*len,mid=(ss+ee)/2,w=Math.abs(ee-ss)*(face==='west-end'||face==='westwing-east'?.35:.66);return{s:mid-w/2,e:mid+w/2,bottom:base+.75,top:base+2.63};}).filter(q=>q.s>.1&&q.e<len-.1&&q.e-q.s>.35);
 if(floor===0){for(const door of exits.filter(q=>q.face===face)){const x=(door.axis===0?(door.u-la[0])/du:(door.v-la[1])/dv)*len,s=x-door.width/2,e=x+door.width/2;openings=openings.filter(q=>q.e<s||q.s>e);openings.push({s,e,bottom:.15,top:2.8,door:true});}
 if(face==='south'){const s=(lobby.u0-la[0])/du*len,e=(lobby.u1-la[0])/du*len;openings.push({s:Math.min(s,e),e:Math.max(s,e),bottom:0,top:H.floor,passage:true});}}
 openings.sort((a,b)=>a.s-b.s);let cursor=0;for(const q of openings){panel(cursor,q.s,base,base+H.floor);panel(q.s,q.e,base,q.bottom);panel(q.s,q.e,q.top,base+H.floor);if(!q.passage){const mid=(q.s+q.e)/2,w=q.e-q.s,h=q.top-q.bottom,y=(q.top+q.bottom)/2;for(const x of[q.s,q.e])b.box(x,y,-.20,.05,h,.40,'#e3e3d7',24);for(const yy of[q.bottom,q.top])b.box(mid,yy,-.20,w,.05,.40,'#e3e3d7',24);b.box(mid,y,-.42,w-.09,h-.08,.05,q.door?'#596965':'#637d7b',5);b.box(mid,y,-.37,.055,h,.08,'#d4dacf',6);if(!q.door)b.box(mid,q.bottom+h*.64,-.37,w,.045,.08,'#d4dacf',6);}cursor=q.e;}panel(cursor,len,base,base+H.floor);b.box(len/2,base+3.03,.015,len,.12,.10,'#e0e0d5',24);}
 }));}
 // Added first-floor-only block is evidenced by the first plan but absent from the source ring/typical plan.
 b.local(O[0],0,O[1],R,()=>group('single-storey-south-lobby',()=>{const w=lobby.u1-lobby.u0,d=lobby.v1-lobby.v0; b.box((lobby.u0+lobby.u1)/2,H.lobby,lobby.v0+d/2,w,.16,d,'#92988c',24);b.box(lobby.u0,H.lobby/2,lobby.v0+d/2,.10,H.lobby,d,'#cbcabe',24);b.box((lobby.u0+lobby.u1)/2,H.lobby/2,lobby.v1,w,H.lobby,.10,'#cbcabe',24);
 const s=lobby.doorV-.9,e=lobby.doorV+.9;for(const[a,c]of[[lobby.v0,s],[e,lobby.v1]])b.box(lobby.u1,H.lobby/2,(a+c)/2,.1,H.lobby,c-a,'#cbcabe',24);b.box(lobby.u1,.075,lobby.doorV,.10,.15,1.8,'#cbcabe',24);b.box(lobby.u1,2.95,lobby.doorV,.10,.30,1.8,'#cbcabe',24);b.box(lobby.u1-.38,1.48,lobby.doorV,.055,2.66,1.72,'#596965',5);for(const z of[s,e])b.box(lobby.u1-.19,1.48,z,.38,2.66,.06,'#e3e3d7',24);b.box(lobby.u1+.30,.075,lobby.doorV,.6,.15,2.0,'#b2b4a8',24);
 }));
 return{strategy:'building031-v46',floors:5,floorEvidence:'historical-only-current-unverified',sourceOutline:true,oneStoreyLobby:true,eastFacingLobbyDoor:true,balconies:false,threeExits:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building031={id:ID,render,world,local,pieces,heights:H,lobby,exits};
})(YY);
