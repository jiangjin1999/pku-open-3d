/* Resources group: independent flat-roof segments; only west annex's one floor and south door are verified. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832252';
const O=[164.069,740.678],R=Math.atan2(7.606,222.494),CO=Math.cos(R),SI=Math.sin(R);
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
// Bounds follow this source ring's six north-edge steps, not any neighbouring building.
const segments=[{name:'west-annex',lo:-1,hi:15.594,h:3.7,rows:1,roof:'#898f86'},
{name:'west-main',lo:15.594,hi:72.2,h:13.2,rows:4,roof:'#baa28b'},
{name:'middle-west',lo:72.2,hi:94.35,h:6.4,rows:2,roof:'#929a90'},
{name:'middle-centre',lo:94.35,hi:121.75,h:3.8,rows:1,roof:'#8b948b'},
{name:'middle-east',lo:121.75,hi:143.2,h:6.4,rows:2,roof:'#959d92'},
{name:'east-main',lo:143.2,hi:224,h:14.0,rows:4,roof:'#a3aaa0'}];
const entrance={u:7.8,v:0,width:2.5,sill:.45,face:'south',annexOnly:true};
function clip(poly,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],ai=greater?a[0]>=k:a[0]<=k,ci=greater?c[0]>=k:c[0]<=k;if(ai)out.push(a);if(ai!==ci){const t=(k-a[0])/(c[0]-a[0]);out.push(a.map((x,j)=>x+t*(c[j]-x)));}}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];},ring=F.polygons(f.geometry)[0][0],raw=ring.map(local),positive=F.area(ring)>0;
function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'042-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
for(const q of segments){const roof=new G.Geometry();for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=clip(clip(tri.map(local),q.lo,true),q.hi,false);for(let k=1;k<p.length-1;k++)roof.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],q.h,p[1])));}add('042-flat-roof-'+q.name,roof,q.roof,24,id);
for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];let la=local(a),lc=local(c),du=lc[0]-la[0];let lo=0,hi=1;if(Math.abs(du)<1e-9){if(la[0]<q.lo||la[0]>q.hi)continue;}else{const ts=[(q.lo-la[0])/du,(q.hi-la[0])/du].sort((a,b)=>a-b);lo=Math.max(0,ts[0]);hi=Math.min(1,ts[1]);if(hi<=lo)continue;}const start=la.map((x,j)=>x+(lc[j]-x)*lo),end=la.map((x,j)=>x+(lc[j]-x)*hi);a=world(...start);c=world(...end);const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.01)continue;const south=Math.abs(start[1])+Math.abs(end[1])<.1,station=q.name==='west-annex'&&south,rotation=Math.atan2(-dz,dx);
b.local(a[0],0,a[1],rotation,()=>group(q.name+'-facade-'+i,()=>{
const wall=station?'#77796f':'#b2b5a8',frame=station?'#9b3b2d':'#77877f',floor=q.h/q.rows;
const panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.045,e-s,hi-lo,.09,wall,24);};
const count=Math.max(1,Math.round(len/(station?3.3:3.7))),spacing=len/count;
for(let fl=0;fl<q.rows;fl++){const base=fl*floor,holes=[];for(let j=0;j<count;j++){const x=(j+.5)*spacing,w=Math.min(station?2.4:1.65,spacing*.62);if(x-w/2<.15||x+w/2>len-.15)continue;holes.push({s:x-w/2,e:x+w/2,lo:base+(station?.45:.85),hi:base+floor-.65});}
if(station){const x=(entrance.u-start[0])/(end[0]-start[0])*len,s=x-entrance.width/2,e=x+entrance.width/2;for(let k=holes.length-1;k>=0;k--)if(holes[k].e>s-.25&&holes[k].s<e+.25)holes.splice(k,1);holes.push({s,e,lo:.45,hi:3.08,door:true});}
holes.sort((a,b)=>a.s-b.s);let cursor=0;for(const h of holes){panel(cursor,h.s,base,base+floor);panel(h.s,h.e,base,h.lo);panel(h.s,h.e,h.hi,base+floor);const x=(h.s+h.e)/2,w=h.e-h.s,hh=h.hi-h.lo,cy=(h.hi+h.lo)/2,set=h.door?.95:.28;
// Returns connect the facade opening to the recessed frame; the approach remains empty.
for(const xx of[h.s,h.e])b.box(xx,cy,-set/2,.10,hh,set,frame,24);for(const yy of[h.lo,h.hi])b.box(x,yy===h.lo?yy-.05:yy+.05,-set/2,w,.10,set,frame,24);b.box(x,cy,-set,w-.10,hh-.10,.05,h.door?'#617d78':'#6c807d',5);
if(station&&!h.door){for(const xx of[x-w*.32,x+w*.32])b.box(xx,cy,-set+.045,.045,hh,.055,frame,24);for(const yy of[cy-hh*.3,cy,cy+hh*.3])b.box(x,yy,-set+.045,w,.045,.055,frame,24);for(const side of[-1,1]){b.box(x+side*w*.17,cy,-set+.045,.035,hh*.4,.055,frame,24);b.box(x+side*w*.25,cy+side*hh*.2,-set+.045,w*.17,.035,.055,frame,24);}}
else b.box(x,cy,-set+.045,.055,hh,.065,frame,24);cursor=h.e;}panel(cursor,len,base,base+floor);
if(!station)b.box(len/2,base+floor-.10,.025,len,.20,.16,'#ced1c4',24);
}b.box(len/2,q.h-.06,.035,len,.12,.22,'#bac1b1',24);
}));}}
// Exact internal vertical boundaries close the high-low junctions, never a shared high cap.
for(let i=1;i<segments.length;i++){const x=segments[i].lo,ys=[];for(let k=1;k<raw.length;k++){const a=raw[k-1],c=raw[k];if((a[0]<=x&&c[0]>=x)||(c[0]<=x&&a[0]>=x)){if(Math.abs(c[0]-a[0])>1e-9)ys.push(a[1]+(c[1]-a[1])*(x-a[0])/(c[0]-a[0]));}}if(ys.length<2)continue;const lo=Math.min(segments[i-1].h,segments[i].h),hi=Math.max(segments[i-1].h,segments[i].h),g=new G.Geometry();g.quad(vertex(x,lo,Math.min(...ys)),vertex(x,hi,Math.min(...ys)),vertex(x,hi,Math.max(...ys)),vertex(x,lo,Math.max(...ys)));add('042-height-junction-'+i,g,'#a8b0a2',24,id);}
b.local(O[0],0,O[1],R,()=>group('annex-south-entry',()=>{
const x=entrance.u;
b.box(x,.225,-.05,3.1,.45,2.1,'#b5bdae',24);for(let k=0;k<3;k++){const h=.15*(k+1);b.box(x,h/2,2.15-k*.5,2.65,h,.51,'#b5bdae',24);}
// Solid sloping cheeks flank the actual steps without replacing the walkable flight.
for(const side of[-1,1]){const a=x+side*1.48,w=.32,p=[a-w/2,a+w/2],g=new G.Geometry();g.quad(vertex(p[0],0,2.4),vertex(p[1],0,2.4),vertex(p[1],.45,.9),vertex(p[0],.45,.9));g.tri(vertex(p[0],0,.9),vertex(p[0],0,2.4),vertex(p[0],.45,.9));g.tri(vertex(p[1],0,2.4),vertex(p[1],0,.9),vertex(p[1],.45,.9));g.quad(vertex(p[0],0,.9),vertex(p[1],0,.9),vertex(p[1],.45,.9),vertex(p[0],.45,.9));g.quad(vertex(p[0],0,2.4),vertex(p[1],0,2.4),vertex(p[1],0,.9),vertex(p[0],0,.9));add('042-step-cheek-'+side,g,'#c3c9ba',24,id);}
for(const side of[-1,1]){b.box(x+side*1.65,1.85,.08,.44,3.7,.50,'#6d756c',24);b.box(x+side*1.65,2.48,.40,.18,.48,.18,'#3e4c47',24);b.box(x+side*1.65,2.48,.51,.13,.33,.035,'#c6d8c1',5);}
b.box(x,3.39,.10,3.5,.64,.55,'#9d342a',24);b.box(x,3.36,.42,2.45,.52,.07,'#543629',24);b.sign('南门驿站',x,3.36,.47,2.38,.48,0);
const canopy=new G.Geometry(),ribs=new G.Geometry(),height=(u,v)=>4.22-.37*(v+.45)/1.5+.38*Math.pow(Math.abs(u)/2.35,6)*Math.pow((v+.45)/1.5,3),pt=(u,v,extra=0)=>vertex(x+u,height(u,v)+extra,v);
for(let j=0;j<8;j++)for(let i=0;i<32;i++){const u=-2.35+i*4.7/32,v=-.45+j*1.5/8;canopy.quad(pt(u,v),pt(u+4.7/32,v),pt(u+4.7/32,v+1.5/8),pt(u,v+1.5/8));}
for(let i=0;i<40;i++){const u=-2.30+i*4.6/39;for(let j=0;j<8;j++){const v=-.45+j*1.5/8;ribs.quad(pt(u-.025,v,.025),pt(u+.025,v,.025),pt(u+.025,v+1.5/8,.025),pt(u-.025,v+1.5/8,.025));}}
add('042-annex-door-curved-canopy',canopy,'#727f79',2,id);add('042-annex-door-tile-ribs',ribs,'#a8afa3',2,id);
// Beam and narrow back support meet the small canopy; no empty slot above the lintel.
b.box(x,3.82,.12,4.0,.32,.55,'#91392e',24);const support=new G.Geometry();for(let i=2;i<30;i++){const u=-2.35+i*4.7/32,du=4.7/32,a=pt(u,-.45,-.001),c=pt(u+du,-.45,-.001),d=pt(u+du,-.2625,-.001),e=pt(u,-.2625,-.001),low=p=>[p[0],3.65,p[2]];support.quad(a,c,d,e);support.quad(low(a),low(c),c,a);support.quad(low(d),low(e),e,d);support.quad(low(e),low(a),a,e);support.quad(low(c),low(d),d,c);}add('042-canopy-back-support',support,'#6d756c',24,id);
for(let u=-1.9;u<2;u+=.24){b.box(x+u,3.75,.42,.12,.14,.5,'#355b47',24);b.box(x+u,3.82,.58,.18,.08,.8,'#95402e',24);}
}));
return{strategy:'building042-v46',flatRoofSegments:6,westAnnexFloors:1,westMainTotalFloors:null,eastMainTotalFloors:null,westAnnexSouthDoorVerified:true,mainEntrancesVerified:false,heightMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building042={id:ID,render,world,local,segments,entrance};
})(YY);
