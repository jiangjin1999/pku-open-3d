/* South Pavilion: independent southern footprint; shared roof type, east entry still provisional. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/272353674';
const O=[-227.285,52.331],R=Math.atan2(.234,18.729),CO=Math.cos(R),SI=Math.sin(R),CX=9.365,CZ=9.244;
const H={plinth:.90,lowerWall:4.25,lowerEave:4.65,lowerInner:6.05,upperWall:8.45,upperEave:8.75,apex:12.15,finial:13.50};
const C={wall:'#d9ddce',red:'#8f332a',wood:'#6c2926',glass:'#526564',roof:'#a3a391',tile:'#c4bfa4',blue:'#315b6b',green:'#476b50',stone:'#a3aa9b'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(x,y,z)=>{const p=world(CX+x,CZ+z);return[p[0],y,p[1]];},group=(key,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'049-'+key+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
// Each lower panel is a trapezoidal annular band. Its inner rectangle remains open around storey two.
function roofPoint(side,t,r,upper){const ox=upper?8.88:9.365,oz=upper?8.80:9.244,ix=upper?0:6.0,iz=upper?0:6.2,rx=ix+(ox-ix)*r,rz=iz+(oz-iz)*r;let x,z;if(side===0){x=t*rx;z=-rz;}else if(side===1){x=rx;z=t*rz;}else if(side===2){x=-t*rx;z=rz;}else{x=-rx;z=-t*rz;}const y=upper?H.apex-(H.apex-H.upperEave)*Math.pow(r,.62)+.57*Math.pow(Math.abs(t),6)*Math.pow(r,8):H.lowerInner-(H.lowerInner-H.lowerEave)*r+.42*Math.pow(Math.abs(t),6)*Math.pow(r,7);return[x,y,z];}
const roofTriangles={lower:[],upper:[]};
for(const upper of[false,true]){const label=upper?'upper-pointed':'lower-annular',mesh=new G.Geometry(),tiles=new G.Geometry();for(let side=0;side<4;side++){for(let i=0;i<32;i++)for(let j=0;j<12;j++){const t0=-1+i/16,t1=t0+1/16,r0=j/12,r1=(j+1)/12,p=[roofPoint(side,t0,r0,upper),roofPoint(side,t1,r0,upper),roofPoint(side,t1,r1,upper),roofPoint(side,t0,r1,upper)];mesh.quad(...p.map(p=>vertex(...p)));roofTriangles[upper?'upper':'lower'].push([p[0],p[1],p[2]],[p[0],p[2],p[3]]);}// Tile courses are parallel within each triangular slope, ending at the hip instead of radiating from the apex.
 const outer=side%2?(upper?8.80:9.244):(upper?8.88:9.365),inner=upper?0:(side%2?6.2:6.0),n=Math.ceil(outer*2/.30),half=.085;
 for(let i=0;i<=n;i++){const q=-outer+.07+(outer*2-.14)*i/n,rStart=Math.max(.0001,(Math.abs(q)+half-inner)/(outer-inner));if(rStart>=1)continue;
  const tilePoint=(q,r)=>{const t=q/(inner+(outer-inner)*r);return roofPoint(side,t,r,upper);};
  for(let j=0;j<24;j++){const r0=rStart+(1-rStart)*j/24,r1=rStart+(1-rStart)*(j+1)/24;for(let k=0;k<4;k++){const s0=-1+k/2,s1=s0+.5,at=(s,r)=>{const p=tilePoint(q+s*half,r);return vertex(p[0],p[1]+.016+.055*Math.sqrt(Math.max(0,1-s*s)),p[2]);};tiles.quad(at(s0,r0),at(s1,r0),at(s1,r1),at(s0,r1));}}
 }
 }add('049-'+label+'-roof',mesh,C.roof,25,id);add('049-'+label+'-tile-ribs',tiles,C.tile,25,id);}
b.local(O[0],0,O[1],R,()=>b.local(CX,0,CZ,0,()=>{
 group('stone-plinth',()=>{b.box(0,.45,0,14.0,.90,14.0,C.stone,24);});
 for(const upper of[false,true]){const hx=upper?5.96:6.8,hz=upper?6:6.8,base=upper?5.95:.90,top=upper?8.45:4.25;for(let side=0;side<4;side++){const width=side%2?hz*2:hx*2,ox=side===1?hx:side===3?-hx:0,oz=side===0?-hz:side===2?hz:0,rot=[Math.PI,Math.PI/2,0,-Math.PI/2][side];b.local(ox,0,oz,rot,()=>group((upper?'upper':'lower')+'-face-'+side,()=>{
 const positions=upper?[-3.55,0,3.55]:[-4.7,-2.35,0,2.35,4.7],holeWidth=upper?2.3:1.80,doorSide=!upper&&side===1,holes=positions.map(x=>({x,w:doorSide&&x===0?2.05:holeWidth,lo:doorSide&&x===0?base:base+.65,hi:top-.33,door:doorSide&&x===0}));let cursor=-width/2;const panel=(s,e,lo,hi)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.045,e-s,hi-lo,.09,C.wall,24);};for(const q of holes){const s=q.x-q.w/2,e=q.x+q.w/2;panel(cursor,s,base,top);panel(s,e,base,q.lo);panel(s,e,q.hi,top);const cy=(q.lo+q.hi)/2,h=q.hi-q.lo;for(const x of[s,e])b.box(x,cy,-.08,.10,h,.22,C.red,24);for(const y of[q.lo,q.hi])b.box(q.x,y,-.08,q.w,.10,.22,C.red,24);b.box(q.x,cy,-.22,q.w-.12,h-.1,.05,C.glass,5);for(let x=s+.25;x<e;x+=.28)b.box(x,cy,-.175,.038,h-.10,.055,C.red,24);for(let y=q.lo+.22;y<q.hi;y+=.34)b.box(q.x,y,-.175,q.w-.10,.038,.055,C.red,24);b.box(q.x,cy,-.14,.085,h,.08,C.red,24);if(q.door){b.box(q.x,q.lo+.36,-.14,q.w-.13,.65,.09,C.red,24);}cursor=e;}panel(cursor,width/2,base,top);
 for(const x of upper?[-5.55,-2.0,2.0,5.55]:[-6.35,-3.52,-1.17,1.17,3.52,6.35]){if(Math.abs(x)>width/2-.15)continue;b.cyl(x,base, .13,.15,top-base,C.red,12,1,24);}
 // Only a thin perimeter support band bridges the wall/beam to the actual local roof surface.
 group('roof-wall-contact',()=>{const mesh=new G.Geometry(),co=Math.cos(b.rotation),si=Math.sin(b.rotation),toFace=p=>{const w=vertex(...p),dx=w[0]-b.origin[0],dz=w[2]-b.origin[2];return[dx*co-dz*si,w[1],dx*si+dz*co];};
 for(const tri of roofTriangles[upper?'upper':'lower']){let polygon=tri.map(toFace);for(const [axis,k,greater] of[[0,-width/2,true],[0,width/2,false],[2,-.09,true],[2,.04,false]]){const out=[];for(let j=0;j<polygon.length;j++){const a=polygon[j],c=polygon[(j+1)%polygon.length],ain=greater?a[axis]>=k:a[axis]<=k,cin=greater?c[axis]>=k:c[axis]<=k;if(ain)out.push(a);if(ain!==cin){const t=(k-a[axis])/(c[axis]-a[axis]);out.push(a.map((v,i)=>v+t*(c[i]-v)));}}polygon=out;if(!polygon.length)break;}
 if(polygon.length<3)continue;const upperPoints=polygon.map(p=>b.world([p[0],p[1]-.001,p[2]])),lower=polygon.map(p=>b.world([p[0],top-.01,p[2]]));for(let k=1;k<polygon.length-1;k++){mesh.tri(upperPoints[0],upperPoints[k],upperPoints[k+1]);mesh.tri(lower[0],lower[k+1],lower[k]);}for(let k=0;k<polygon.length;k++){const next=(k+1)%polygon.length;mesh.quad(lower[k],lower[next],upperPoints[next],upperPoints[k]);}}
 b.e.add('support-band',mesh,Y.M.identity(),C.green,[24,id,0,0]);});

 b.box(0,top+.12,.08,width+.15,.25,.42,C.blue,24);b.box(0,top+.29,.16,width+.4,.12,.64,C.green,24);for(let x=-width/2+.45;x<width/2;x+=.9){b.box(x,top+.13,.31,.58,.11,.035,'#93a47a',24);b.box(x,top+.43,.27,.25,.20,.75,C.green,24);b.box(x,top+.55,.38,.50,.08,1.0,C.blue,24);}
 }));}}
 // Short ribs follow each sloping corner to a single apex; no longitudinal ridge is introduced.
 for(const upper of[false,true]){group(upper?'upper-hip-ribs':'lower-hip-ribs',()=>{for(let side=0;side<4;side++)for(let j=0;j<20;j++){const a=roofPoint(side,1,j/20,upper),c=roofPoint(side,1,(j+1)/20,upper);a[1]+=.10;c[1]+=.10;b.beam(a,c,.09,C.tile,25);}for(let side=0;side<4;side++){const p=roofPoint(side,1,1,upper);b.sphere(p[0],p[1]+.20,p[2],.16,.24,.16,C.roof,25);}});}
 group('finial',()=>{b.cyl(0,12.15,0,.42,.25,C.stone,8,1,24);b.cyl(0,12.40,0,.30,.36,C.roof,8,1,24);b.cyl(0,12.76,0,.42,.14,C.tile,8,1,24);b.cyl(0,12.90,0,.33,.40,C.roof,8,.82,24);b.sphere(0,13.31,0,.28,.19,.28,C.roof,24);});
 // The visible sister-pavilion stair form is provisionally placed toward the eastern courtyard.
 // This is a separate hypothesis from north pavilion's planter and western door.
 group('east-entry-provisional',()=>{const x=6.8,w=2.35,d=1.05;b.box(x+d/2-.02,.45,0,d+.06,.9,w,C.stone,24);for(let k=0;k<6;k++){const h=.15*(6-k);b.box(x+d+.18+k*.36,h/2,0,.37,h,w,C.stone,24);}for(const z of [-w/2-.12,w/2+.12]){b.box(x+d/2,.59,z,d,.28,.20,C.stone,24);}});

}));
return{strategy:'building049-v46',floors:2,lowerRoofAnnular:true,roofApexCount:1,longRidge:false,doorDirectionVerified:false,provisionalDoorFace:'east',entranceUsesStairHypothesis:true,northPlanterCopied:false,heightMeasured:false,outlineMeansEstimatedEaveProjection:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building049={id:ID,render,world,local,heights:H,center:[CX,CZ]};
})(YY);
