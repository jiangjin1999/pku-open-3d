/* Linhuxuan: three stepped north halls and two south wings from its own aerial and source ring. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/272353675';
const O=[-102.783,-37.219],R=Math.atan2(1.432,42.198),CO=Math.cos(R),SI=Math.sin(R);
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
// Coordinates are approximate eave projections, not measured wall or structural axes.
const parts=[{key:'north-west',x0:0,x1:7.5,z0:0,z1:6.72,eave:3.55,rise:1.65,axis:'x'},
{key:'north-center',x0:7.5,x1:24,z0:0,z1:6.72,eave:4.1,rise:2.0,axis:'x'},
{key:'north-east',x0:24,x1:42.222,z0:0,z1:6.834,eave:3.55,rise:1.7,axis:'x'},
{key:'west-wing',x0:0,x1:4.801,z0:3.36,z1:16.895,eave:3.55,rise:1.65,axis:'z',northHip:true},
{key:'east-wing',x0:22.536,x1:33.12,z0:3.417,z1:17.919,eave:3.55,rise:2.75,axis:'z',northHip:true}];
const C={wall:'#a0a49b',roof:'#646c66',tile:'#7d867d',red:'#943b31',glass:'#516361',stone:'#bfc2b3',blue:'#49605b',green:'#486c50'};
function profile(s,u,v){let t=s.axis==='x'?1-Math.abs((v-(s.z0+s.z1)/2)/((s.z1-s.z0)/2)):1-Math.abs((u-(s.x0+s.x1)/2)/((s.x1-s.x0)/2));if(s.northHip)t=Math.min(t,(v-s.z0)/((s.x1-s.x0)/2));return s.eave+s.rise*Math.pow(Math.max(0,Math.min(1,t)),1.22);}
const within=(s,p)=>p[0]>=s.x0-1e-6&&p[0]<=s.x1+1e-6&&p[1]>=s.z0-1e-6&&p[1]<=s.z1+1e-6;
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];},group=(key,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'050-'+key+'-'+k,...v)};try{fn()}finally{b.e.add=old}};
 const cut=(poly,fun)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],av=fun(a),cv=fun(c);if(av>=-1e-8)out.push(a);if((av>=0)!==(cv>=0)){const t=av/(av-cv);out.push(a.map((v,j)=>v+(c[j]-v)*t));}}return out;};
 const visible=(poly,s)=>{const mid=poly.reduce((a,p)=>[a[0]+p[0]/poly.length,a[1]+p[1]/poly.length],[0,0]);for(const other of parts){if(other===s||!within(other,mid))continue;poly=cut(poly,p=>profile(s,...p)-profile(other,...p));if(poly.length<3)return [];}return poly;};
 const levels=(lo,hi,extra)=>[...new Set([lo,hi,...extra.filter(x=>x>lo&&x<hi),...Array.from({length:Math.ceil((hi-lo)/.22)},(_,i)=>lo+(hi-lo)*i/Math.ceil((hi-lo)/.22))])].sort((a,b)=>a-b);
 for(const s of parts){const mesh=new G.Geometry(),tiles=new G.Geometry(),xs=levels(s.x0,s.x1,parts.flatMap(p=>[p.x0,p.x1])),zs=levels(s.z0,s.z1,parts.flatMap(p=>[p.z0,p.z1]));
 const push=(target,p,offset=0,mask=null)=>{if(mask)p=cut(p,mask);if(p.length<3)return;p=visible(p,s);for(let k=1;k<p.length-1;k++)target.tri(...[p[0],p[k],p[k+1]].map(q=>vertex(q[0],profile(s,...q)+offset,q[1])));};
 for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){const a=[xs[i-1],zs[j-1]],c=[xs[i],zs[j-1]],d=[xs[i],zs[j]],e=[xs[i-1],zs[j]];push(mesh,[a,c,d]);push(mesh,[a,d,e]);}
 // Tile ribs follow each hall's own downslope direction and stop at adjoining higher roofs.
 const alongX=s.axis==='x',lo=alongX?s.x0:s.z0,hi=alongX?s.x1:s.z1,across=alongX?zs:xs;
 for(let q=lo+.12;q<hi-.07;q+=.29)for(let j=1;j<across.length;j++)for(let k=0;k<4;k++){const d0=-.075+k*.0375,d1=d0+.0375,a=across[j-1],c=across[j],pp=alongX?[[q+d0,a],[q+d1,a],[q+d1,c],[q+d0,c]]:[[a,q+d0],[c,q+d0],[c,q+d1],[a,q+d1]],off=.018+.052*Math.sqrt(Math.max(0,1-Math.pow((d0+d1)/.15,2)));push(tiles,pp,off,s.northHip?p=>Math.abs(p[0]-(s.x0+s.x1)/2)+(p[1]-s.z0)-(s.x1-s.x0)/2:null);}
 if(s.northHip){const half=(s.x1-s.x0)/2,mid=(s.x0+s.x1)/2,rs=levels(s.z0,s.z0+half,parts.flatMap(p=>[p.z0,p.z1]));for(let q=s.x0+.12;q<s.x1-.07;q+=.29)for(let j=1;j<rs.length;j++)for(let k=0;k<4;k++){const d0=-.075+k*.0375,d1=d0+.0375,a=rs[j-1],c=rs[j],poly=[[q+d0,a],[q+d1,a],[q+d1,c],[q+d0,c]],off=.018+.052*Math.sqrt(Math.max(0,1-Math.pow((d0+d1)/.15,2)));push(tiles,poly,off,p=>half-Math.abs(p[0]-mid)-(p[1]-s.z0));}}
 add('050-'+s.key+'-roof',mesh,C.roof,25,id);add('050-'+s.key+'-tiles',tiles,C.tile,25,id);
 }
 // Aerial images show paved courts between roofs; these low surfaces never close the courtyard air space.
 const loop=(x0,z0,x1,z1)=>[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0]].map(p=>world(...p));
 add('050-central-court-paving',F.surface({type:'Polygon',coordinates:[loop(4.801,6.72,22.536,17.919),loop(11.15,7.1,13.52,11.1),loop(16.88,7.1,19.25,11.1)]},.065),'#9a9e96',24,id);
 add('050-east-court-paving',F.surface({type:'Polygon',coordinates:[loop(33.12,6.834,42.222,12.45)]},.07),'#b2b8ac',24,id);
 b.local(O[0],0,O[1],R,()=>{
 for(const s of parts)group(s.key+'-ridge',()=>{const along=s.axis==='x',lo=along?s.x0:s.z0+(s.northHip?(s.x1-s.x0)/2:0),hi=along?s.x1:s.z1,mid=along?(s.z0+s.z1)/2:(s.x0+s.x1)/2,n=Math.ceil((hi-lo)/.30);for(let i=0;i<n;i++){const a=lo+(hi-lo)*i/n,c=lo+(hi-lo)*(i+1)/n,q=along?[(a+c)/2,mid]:[mid,(a+c)/2],y=profile(s,...q);if(parts.some(o=>o!==s&&within(o,q)&&profile(o,...q)>y+.025))continue;const q0=along?[a,mid]:[mid,a],q1=along?[c,mid]:[mid,c];b.beam([q0[0],profile(s,...q0)+.075,q0[1]],[q1[0],profile(s,...q1)+.075,q1[1]],.11,C.tile,25);}if(s.axis==='z'){const v=s.z1;for(let i=0;i<40;i++){const a=s.x0+(s.x1-s.x0)*i/40,c=s.x0+(s.x1-s.x0)*(i+1)/40;b.beam([a,profile(s,a,v)+.05,v],[c,profile(s,c,v)+.05,v],.07,C.tile,25);}}});
 function facade(key,u,v,length,rot,top,count,doorIndex=-1,base=.48,porch=false){b.local(u,0,v,rot,()=>group(key,()=>{const w=length/count,panel=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.09,c-a,hi-lo,.18,C.wall,30);};let cursor=0;for(let k=0;k<count;k++){const mid=(k+.5)*w,door=k===doorIndex,ww=Math.min(door?2.2:1.85,w*.66),a=mid-ww/2,c=mid+ww/2,lo=door?base:base+.6,hi=top-.4;panel(cursor,a,base,top);panel(a,c,base,lo);panel(a,c,hi,top);const cy=(lo+hi)/2;for(const x of[a,c])b.box(x,cy,-.01,.08,hi-lo,.22,C.red,24);for(const y of[lo,hi])b.box(mid,y,-.01,ww,.08,.22,C.red,24);b.box(mid,cy,-.14,ww-.1,hi-lo-.08,.04,C.glass,5);for(let x=a+.28;x<c;x+=.29)b.box(x,cy,-.10,.033,hi-lo,.04,C.red,24);for(let y=lo+.25;y<hi;y+=.31)b.box(mid,y,-.10,ww,.033,.04,C.red,24);b.box(mid,cy,-.08,.07,hi-lo,.05,C.red,24);if(door)b.box(mid,base+.26,-.04,ww-.1,.48,.06,C.red,24);cursor=c;}panel(cursor,length,base,top);b.box(length/2,.24,-.12,length,.48,.45,C.stone,24);b.box(length/2,top-.09,.04,length,.18,.35,C.red,24);for(let i=0;i<=count;i++){const x=Math.max(.08,Math.min(length-.08,i*w));b.cyl(x,base,porch?.55:.15,.105,top-base-.15,C.red,10,1,24);}b.box(length/2,top+.08,.13,length,.12,.5,C.blue,24);
 const support=new G.Geometry(),n=Math.ceil(length/.16),co=Math.cos(rot),si=Math.sin(rot),point=(q,depth)=>[u+q*co+depth*si,v-q*si+depth*co],height=p=>Math.max(top,...parts.filter(s=>within(s,p)).map(s=>profile(s,...p)));
 for(let j=0;j<n;j++){const q0=length*j/n,q1=length*(j+1)/n,a=point(q0,-.09),c=point(q1,-.09);support.quad(vertex(a[0],top-.02,a[1]),vertex(c[0],top-.02,c[1]),vertex(c[0],height(c)-.012,c[1]),vertex(a[0],height(a)-.012,a[1]));}add('050-'+key+'-wall-roof-contact',support,C.wall,30,id);
 }));}
 // Facades are split at real footprint turns; the two courtyard gaps remain open.
 facade('north-west-face',7.5,.38,7.12,Math.PI,3.55,3);
 facade('north-center-face',24,.38,16.5,Math.PI,4.1,5,2);
 facade('north-east-face',41.84,.38,17.84,Math.PI,3.55,5);
 facade('court-west-south',4.43,6.38,3.07,0,3.55,1);
 facade('court-center-south',7.5,6.38,15.4,0,4.1,5,2);
 facade('east-court-south',32.76,6.46,9.08,0,3.55,3,-1,.48,true);
 facade('west-outer',.38,.38,16.16,-Math.PI/2,3.55,5);
 facade('west-court',4.43,16.54,10.16,Math.PI/2,3.55,3);
 facade('west-wing-end',.38,16.54,4.05,0,3.55,1);
 facade('east-wing-west',22.90,6.38,11.16,-Math.PI/2,3.55,3);
 facade('east-wing-east',32.76,17.54,11.08,Math.PI/2,3.55,3);
 facade('east-wing-end',22.9,17.54,9.86,0,3.55,3);
 facade('east-end',41.84,6.37,5.99,Math.PI/2,3.55,2);
 // Vertical ends of the stepped north roofs close only the height difference.
 for(const [u,a,c] of [[7.5,parts[0],parts[1]],[24,parts[1],parts[2]]]){const mesh=new G.Geometry();for(let j=0;j<32;j++){const v0=6.72*j/32,v1=6.72*(j+1)/32;mesh.quad(vertex(u,Math.min(profile(a,u,v0),profile(c,u,v0)),v0),vertex(u,Math.min(profile(a,u,v1),profile(c,u,v1)),v1),vertex(u,Math.max(profile(a,u,v1),profile(c,u,v1)),v1),vertex(u,Math.max(profile(a,u,v0),profile(c,u,v0)),v0));}add('050-north-roof-step-'+u,mesh,C.wall,30,id);}
 // Southern approach and carved basin: dimensions fitted to photos; exact hall correspondence remains open.
 group('bamboo-entry-provisional',()=>{const x=15.2,z=6.38;b.box(x,.24,z+.44,3.1,.48,1.08,C.stone,24);for(let k=0;k<3;k++){const h=.16*(3-k);b.box(x,h/2,z+1.14+k*.33,3.1,h,.34,C.stone,24);}b.box(x,.05,z+3.8,1.45,.10,.93,C.stone,24);b.box(x,.28,z+3.8,.92,.38,.58,C.stone,24);b.box(x,.53,z+3.8,1.17,.12,.73,C.stone,24);for(const dz of[-.41,.41])b.box(x,.81,z+3.8+dz,1.65,.48,.12,C.stone,24);for(const dx of[-.82,.82])b.box(x+dx,.81,z+3.8,.12,.48,.84,C.stone,24);b.box(x,.60,z+3.8,1.5,.08,.70,'#717766',24);
 const leaves=new G.Geometry();
 for(const side of[-1,1])for(let i=0;i<15;i++){const xx=x+side*(2.1+(i%3)*.49),zz=z+.8+Math.floor(i/3)*.82,h=3.65+(i%4)*.21,leanX=Math.sin(i*2.3)*.20,leanZ=Math.cos(i*1.7)*.19;const stem=t=>[xx+leanX*t,h*t,zz+leanZ*t];b.beam([xx,0,zz],stem(1),.022,'#6e8151',24);
 for(let j=0;j<5;j++){const frac=.48+j*.105,root=stem(frac),ang=.6+i*2.1+j*1.5,tip=[root[0]+Math.cos(ang)*.70,root[1]+.12,root[2]+Math.sin(ang)*.70];b.beam(root,tip,.011,'#607349',24);for(let k=1;k<=7;k++)for(const sideLeaf of[-1,1]){const t=k/8,c=[root[0]+(tip[0]-root[0])*t,root[1]+.14,root[2]+(tip[2]-root[2])*t],a=ang+sideLeaf*.78,len=.21+(k%3)*.035,w=.033,ux=Math.cos(a),uz=Math.sin(a),px=-uz,pz=ux,pts=[[c[0],c[1],c[2]],[c[0]+ux*len*.5+px*w,c[1]+.035,c[2]+uz*len*.5+pz*w],[c[0]+ux*len,c[1]-.04,c[2]+uz*len],[c[0]+ux*len*.5-px*w,c[1]+.03,c[2]+uz*len*.5-pz*w]];leaves.quad(...pts.map(q=>vertex(...q)));}}}
 add('050-bamboo-fine-leaves',leaves,'#638049',3,id);
 });
 });
 return{strategy:'building050-v46',sourceFootprint:true,northHalls:3,southWings:2,courtyardFilled:false,uniformTwoStoreys:false,visibleStoreys:1,wholeCourtyardFloorsVerified:false,entryLocationVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add)};Y.Building050={id:ID,render,world,local,parts,profile};
})(YY);
