/* Original fictional campus walkers. All routes are bounded portions of mapped,
   rendered footways; metre dimensions and the complete swept corridor are audited.
   This layer owns its small buffers. It never invalidates the static scene cache. */
(function(Y){'use strict';
const M=Y.M,TAU=Math.PI*2,STRIDE=1.12,MAT=47;
const ROUTES=[{"id":"lake-south","source":"way/240825571","segment":25,"a":[-86.03614278336762,-69.9285848778657],"b":[-116.07185721663238,-84.1654151221343],"width":2,"length":33.239005353962526,"y":0.12,"radius":0.38,"count":2,"speed":1.02,"label":"未名湖南步道西段","ribbonQuad":[[-121.06431366048042,-85.42664407681798],[-120.11568633951958,-87.18735592318203],[-81.17145273029517,-68.72503251002306],[-81.86454726970483,-66.84896748997696]]},{"id":"lake-east","source":"way/595764186","segment":2,"a":[144.73871834054881,-183.85802372356048],"b":[158.2742816594512,-130.54697627643952],"width":2,"length":55.0025386165875,"y":0.12,"radius":0.38,"count":2,"speed":1.08,"label":"未名湖东侧步道","ribbonQuad":[[141.8011374883779,-191.36440065918248],[143.73886251162213,-191.8595993408175],[161.21224703455493,-123.0390897925686],[159.27375296544506,-122.54691020743141]]},{"id":"campus-south","source":"way/595764185","segment":0,"a":[13.421847954729273,-8.636714401915183],"b":[91.88115204527072,-9.195285598084816],"width":2,"length":78.46129236861476,"y":0.12,"radius":0.38,"count":3,"speed":1.12,"label":"湖区南侧校园步道","ribbonQuad":[[7.414880933014135,-9.593974659121544],[97.87391791286461,-10.237974921706442],[97.88808208713539,-8.238025078293557],[7.429119066985864,-7.594025340878454]]}];
const PALETTES=[['#768b81','#344956','#e4dfcc','#343c37','#ba8866'],['#a16851','#293942','#eee9dc','#7b563c','#dcac8b'],['#36536b','#b5aa93','#f1f0e7','#a37e56','#c99879'],['#bcb19a','#39424c','#d9ddd5','#3a554c','#b98364'],['#59727f','#4a4541','#e5e2d9','#9f6345','#d1a180'],['#866b78','#334954','#eeeadf','#4c5544','#bc8769'],['#d0b270','#4b5651','#deddd2','#516578','#daa785']];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)},mod=(x,n)=>(x%n+n)%n;
function routeFrame(r){let dx=r.b[0]-r.a[0],dz=r.b[1]-r.a[1],l=Math.hypot(dx,dz);const clip=r.ribbonQuad.map((a,i)=>{const b=r.ribbonQuad[(i+1)%4],x=b[0]-a[0],z=b[1]-a[1],n=Math.hypot(x,z);return[-z/n,x/n,(z*a[0]-x*a[1])/n];});return{...r,clip,bound:[(r.a[0]+r.b[0])/2,r.y+.9,(r.a[1]+r.b[1])/2],boundRadius:l/2+10,ux:dx/l,uz:dz/l,length:l,perimeter:2*l+TAU*r.radius};}
// Arc length gives a tangent-continuous racetrack wholly inside one original
// ribbon segment. Its semicircular ends turn inside the paving, never join roads.
function sample(r,d,out){d=mod(d,r.perimeter);const l=r.length,h=Math.PI*r.radius;let x,z,fx,fz,turn=0;
 if(d<l){x=d;z=r.radius;fx=1;fz=0;turn=Math.min(d,l-d);}
 else if(d<l+h){let a=(d-l)/r.radius;x=l+r.radius*Math.sin(a);z=r.radius*Math.cos(a);fx=Math.cos(a);fz=-Math.sin(a);}
 else if(d<2*l+h){x=2*l+h-d;z=-r.radius;fx=-1;fz=0;turn=Math.min(x,l-x);}
 else{let a=(d-2*l-h)/r.radius;x=-r.radius*Math.sin(a);z=-r.radius*Math.cos(a);fx=-Math.cos(a);fz=Math.sin(a);}
 out.x=r.a[0]+r.ux*x-r.uz*z;out.z=r.a[1]+r.uz*x+r.ux*z;out.fx=r.ux*fx-r.uz*fz;out.fz=r.uz*fx+r.ux*fz;out.y=r.y;out.turn=turn;return out;
}
function anchor(r,d,side,out,tmp){sample(r,d,tmp);out.x=tmp.x+tmp.fz*side;out.y=r.y+.093;out.z=tmp.z-tmp.fx*side;out.fx=tmp.fx;out.fz=tmp.fz;return out;}
function foot(r,d,phase,side,out,a,b,tmp){const q=d/STRIDE+phase,k=Math.floor(q),u=q-k,touch=(k-phase)*STRIDE;
 anchor(r,touch+STRIDE*.30,side,a,tmp);anchor(r,touch+STRIDE*1.30,side,b,tmp);
 if(u<.60){Object.assign(out,a);out.lift=0;out.stance=true;}
 else{let f=(u-.60)/.40,t=smooth(f);out.x=a.x+(b.x-a.x)*t;out.y=r.y+.093+.11*Math.sin(Math.PI*f);out.z=a.z+(b.z-a.z)*t;let fx=a.fx+(b.fx-a.fx)*t,fz=a.fz+(b.fz-a.fz)*t,L=Math.hypot(fx,fz)||1;out.fx=fx/L;out.fz=fz/L;out.lift=.11*Math.sin(Math.PI*f);out.stance=false;}
 return out;
}
function knee(h,f,forward,out){const dx=f.x-h.x,dy=f.y-h.y,dz=f.z-h.z,L=Math.hypot(dx,dy,dz),u1=.445,u2=.430,a=clamp((u1*u1-u2*u2+L*L)/(2*L),0,u1),height=Math.sqrt(Math.max(0,u1*u1-a*a));let bx=forward.fx,by=0,bz=forward.fz,dd=(bx*dx+bz*dz)/(L*L);bx-=dx*dd;by-=dy*dd;bz-=dz*dd;let bl=Math.hypot(bx,by,bz)||1;out.x=h.x+dx/L*a+bx/bl*height;out.y=h.y+dy/L*a+by/bl*height;out.z=h.z+dz/L*a+bz/bl*height;return out;}
// A rounded rectangular loft makes clothed volumes; silhouettes are not sticks.
function loft(profile,n=16){const g=new Y.Geo.Geometry(),rings=profile.map(([y,rx,rz])=>Array.from({length:n},(_,j)=>{let a=j/n*TAU,c=Math.cos(a),s=Math.sin(a);return[Math.sign(c)*Math.pow(Math.abs(c),.55)*rx,y,Math.sign(s)*Math.pow(Math.abs(s),.55)*rz]}));for(let i=1;i<rings.length;i++)for(let j=0;j<n;j++){let k=(j+1)%n;g.quad(rings[i-1][j],rings[i][j],rings[i][k],rings[i-1][k]);}for(let j=0;j<n;j++){let k=(j+1)%n;g.tri([0,profile[0][0],0],rings[0][j],rings[0][k]);g.tri([0,profile.at(-1)[0],0],rings.at(-1)[k],rings.at(-1)[j]);}return g;}
function hair(){const g=new Y.Geo.Geometry(),n=18,m=7;for(let j=0;j<m;j++)for(let k=0;k<n;k++){let at=(a,b)=>{let t=b/n*TAU,p=a/m*Math.PI*(.49-.10*Math.sin(t));return[Math.sin(p)*Math.cos(t),Math.cos(p),Math.sin(p)*Math.sin(t)]},a=at(j,k),b=at(j+1,k),c=at(j+1,k+1),d=at(j,k+1);g.quad(a,b,c,d);}return g;}
function indexGeometry(g){const unique=[],ind=[],map=new Map();for(let i=0;i<g.v.length;i+=8){const v=g.v.slice(i,i+8),key=v.map(x=>Math.round(x*1e7)).join(','),old=map.get(key);if(old!==undefined)ind.push(old);else{map.set(key,unique.length/8);ind.push(unique.length/8);unique.push(...v);}}return{vertices:new Float32Array(unique),indices:new Uint16Array(ind)};}
const SHADOW_VERT=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=3)in mat4 iMatrix;uniform mat4 uVP;uniform vec3 uSun;uniform float uGround;out vec2 vXZ;
void main(){vec3 w=(iMatrix*vec4(aPosition,1.)).xyz;float h=max(0.,w.y-uGround);vXZ=w.xz-uSun.xz*h/max(.23,uSun.y);gl_Position=uVP*vec4(vXZ.x,uGround+.007,vXZ.y,1.);}`;
const SHADOW_FRAG=`#version 300 es
precision highp float;in vec2 vXZ;uniform vec3 uClip0;uniform vec3 uClip1;uniform vec3 uClip2;uniform vec3 uClip3;uniform float uOpacity;uniform vec3 uPlaneDepth;uniform vec2 uResolution;out vec4 outColor;
void main(){vec3 q=vec3(vXZ,1.);if(min(min(dot(q,uClip0),dot(q,uClip1)),min(dot(q,uClip2),dot(q,uClip3)))<.015)discard;vec2 ndc=gl_FragCoord.xy/uResolution*2.-1.;gl_FragDepth=dot(uPlaneDepth,vec3(ndc,1.))*.5+.5;outColor=vec4(.035,.045,.039,uOpacity);}`;
// All projected triangles share one analytic screen-space depth plane. Using
// interpolated triangle depths here causes repeated blending from rounding noise.
function planeDepth(vp,y,x,z){const q=[[x,y,z,1],[x+10,y,z,1],[x,y,z+10,1]].map(p=>{const a=M.apply(vp,p);return[a[0]/a[3],a[1]/a[3],a[2]/a[3]]}),a=q[0],b=q[1],c=q[2],bx=b[0]-a[0],by=b[1]-a[1],cx=c[0]-a[0],cy=c[1]-a[1],det=bx*cy-cx*by;if(!Number.isFinite(det)||Math.abs(det)<1e-16)return null;const A=((b[2]-a[2])*cy-(c[2]-a[2])*by)/det,B=(bx*(c[2]-a[2])-cx*(b[2]-a[2]))/det;return[A,B,a[2]-A*a[0]-B*a[1]];}
function fillFrustum(m,out){for(let i=0;i<6;i++){const p=out[i],b=i>>1,s=i%2===0?1:-1;for(let j=0;j<4;j++)p[j]=m[3+j*4]+s*m[b+j*4];const n=Math.hypot(p[0],p[1],p[2]);for(let j=0;j<4;j++)p[j]/=n;}return out;}
class Walkers{
 constructor(engine,campus,state){this.engine=engine;this.routes=ROUTES.map(routeFrame);this.state=state;this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.pending=0;this.animate=false;this.active=false;this.mask=-1;this.gpu=false;this.mainPlanes=Array.from({length:6},()=>[0,0,0,0]);this.refPlanes=Array.from({length:6},()=>[0,0,0,0]);this.version=0;this.disposed=false;
  state.peopleProgress46 ||= this.routes.map(()=>0);this.progress=state.peopleProgress46;this.people=[];let id=0;for(let ri=0;ri<this.routes.length;ri++){const r=this.routes[ri];for(let i=0;i<r.count;i++){const colors=PALETTES[id%PALETTES.length].map(M.color);this.people.push({id:id++,ri,offset:(i+.18+(ri*.13)%1)/r.count*r.perimeter,scale:1+(id%3-1)*.035,colors,root:{},feet:[{},{}],hips:[{},{}],knees:[{},{}],normalizedFoot:{},shoulder:{},elbow:{},hand:{},a:{},b:{},tmp:{}});}}
  this.meshes=new Map();const capacities={round:14,coat:11,limb:8,shoe:4,hair:1,box:9};for(const [key,g]of [['round',Y.Geo.sphere(16,10)],['coat',loft([[-.5,.41,.40],[-.43,.48,.48],[.32,.5,.5],[.46,.44,.44],[.5,.36,.38]])],['limb',loft([[0,.42,.42],[.05,.50,.50],[.88,.41,.41],[1,.30,.30]],12)],['shoe',loft([[-.5,.34,.35],[-.32,.50,.50],[.30,.47,.48],[.5,.33,.39]],12)],['hair',hair()],['box',Y.Geo.box()]])this.meshes.set(key,{...indexGeometry(g),data:new Float32Array(this.people.length*capacities[key]*28),ranges:this.routes.map(()=>({start:0,count:0})),shadowVAOs:[],shadowStarts:[],count:0,buffer:null,vao:null});
  this.metrics={people:this.people.length,routes:this.routes.length,poseBuilds:0,uploads:0,uploadedBytes:0,mainCalls:0,reflectionCalls:0,shadowCalls:0};
 }
 setMotion(dt,enabled){this.pending=Math.min(.16,Math.max(0,dt));this.animate=enabled&&!this.motion.matches;}
 prepare(vp,refVP,state=this.state){this.state=state;const dt=this.pending;this.pending=0;this.active=this.state.people!==false&&!this.state.isolate;if(!this.active){this.mask=-1;return;}const planes=fillFrustum(vp,this.mainPlanes),ref=fillFrustum(refVP,this.refPlanes);let mask=0;
  for(let i=0;i<this.routes.length;i++){const r=this.routes[i],p=r.bound,radius=r.boundRadius;if(M.sphereVisible(planes,p,radius)||M.sphereVisible(ref,p,radius)){mask|=1<<i;if(this.animate&&dt){// Each walker uses the same route clock: spacing remains ordered.
     // Integrate travel time, not one leader's speed: the distance field below
     // slows each person smoothly at either turnaround independently.
     this.progress[i]+=dt;}}
  }
  const moving=this.animate&&dt>0&&mask!==0;if(mask===this.mask&&!moving&&this.version)return;this.mask=mask;for(const m of this.meshes.values())m.count=0;
  for(let ri=0;ri<this.routes.length;ri++){for(const m of this.meshes.values()){m.ranges[ri].start=m.count;m.ranges[ri].count=0;}if(mask&(1<<ri))for(const p of this.people)if(p.ri===ri)this.pose(p,this.distance(this.routes[ri],this.progress[ri],p.offset));for(const m of this.meshes.values())m.ranges[ri].count=m.count-m.ranges[ri].start;}
  this.version++;this.metrics.poseBuilds++;this.metrics.instances=0;this.metrics.triangles=0;for(const m of this.meshes.values()){this.metrics.instances+=m.count;this.metrics.triangles+=m.count*m.indices.length/3;}this.metrics.activeRoutes=mask;this.uploadVersion=-1;
 }
 // Time-to-distance lookup is monotone and periodic; independent starting times
 // preserve spacing through the slower end turns without avoidance randomness.
 distance(r,time,offset){if(!r.timeTable){let ds=.08,N=Math.ceil(r.perimeter/ds),sum=0,table=[0],tmp={};for(let i=0;i<N;i++){sample(r,(i+.5)/N*r.perimeter,tmp);const speed=r.speed*(.40+.60*smooth(tmp.turn/2));sum+=r.perimeter/N/speed;table.push(sum);}r.timeTable=table;r.duration=sum;r.samples=N;}
  const initial=offset/r.perimeter*r.duration,absolute=time+initial,t=mod(absolute,r.duration),table=r.timeTable;let lo=0,hi=r.samples;while(lo+1<hi){let mid=(lo+hi)>>1;if(table[mid]<=t)lo=mid;else hi=mid;}return Math.floor(absolute/r.duration)*r.perimeter+(lo+(t-table[lo])/(table[hi]-table[lo]))/r.samples*r.perimeter;
 }
 add(key,p,x,y,z,sx,sy,sz,color,fx=p.root.fx,fz=p.root.fz,pitch=0){const mesh=this.meshes.get(key),o=mesh.count++*28,d=mesh.data,c=Math.cos(pitch),s=Math.sin(pitch),k=p.scale;
  // Right, up and forward are orthogonal, including limb pitch.
  d[o]=fz*sx*k;d[o+1]=0;d[o+2]=-fx*sx*k;d[o+3]=0;
  d[o+4]=fx*s*sy*k;d[o+5]=c*sy*k;d[o+6]=fz*s*sy*k;d[o+7]=0;
  d[o+8]=fx*c*sz*k;d[o+9]=-s*sz*k;d[o+10]=fz*c*sz*k;d[o+11]=0;
  d[o+12]=x;d[o+13]=y;d[o+14]=z;d[o+15]=1;d[o+16]=color[0];d[o+17]=color[1];d[o+18]=color[2];d[o+19]=1;d[o+20]=MAT;d[o+21]=0;d[o+22]=0;d[o+23]=0;d[o+24]=d[o+25]=0;d[o+26]=d[o+27]=1;
 }
 local(key,p,x,y,z,sx,sy,sz,col,pitch=0){const q=p.root,k=p.scale;this.add(key,p,q.x+(q.fz*x+q.fx*z)*k,q.y+y*k,q.z+(-q.fx*x+q.fz*z)*k,sx,sy,sz,col,q.fx,q.fz,pitch);}
 segment(key,p,a,b,width,depth,col){const m=this.meshes.get(key),o=m.count++*28,d=m.data,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,L=Math.hypot(dx,dy,dz),ux=dx/L,uy=dy/L,uz=dz/L;let rx=p.root.fz,ry=0,rz=-p.root.fx,dot=rx*ux+rz*uz;rx-=ux*dot;ry-=uy*dot;rz-=uz*dot;const rl=Math.hypot(rx,ry,rz);rx/=rl;ry/=rl;rz/=rl;const fx=ry*uz-rz*uy,fy=rz*ux-rx*uz,fz=rx*uy-ry*ux;
  d[o]=rx*width;d[o+1]=ry*width;d[o+2]=rz*width;d[o+3]=0;d[o+4]=dx;d[o+5]=dy;d[o+6]=dz;d[o+7]=0;d[o+8]=fx*depth;d[o+9]=fy*depth;d[o+10]=fz*depth;d[o+11]=0;d[o+12]=a.x;d[o+13]=a.y;d[o+14]=a.z;d[o+15]=1;d[o+16]=col[0];d[o+17]=col[1];d[o+18]=col[2];d[o+19]=1;d[o+20]=MAT;d[o+21]=d[o+22]=d[o+23]=d[o+24]=d[o+25]=0;d[o+26]=d[o+27]=1;
 }
 pose(p,d){const r=this.routes[p.ri],q=sample(r,d,p.root),k=p.scale,[coat,pants,sole,pack,skin]=p.colors,hairCol=HAIR,pale=PALE,dark=DARK,bob=.014*Math.cos(d/STRIDE*TAU*2),hip=.858+bob;
  // The root and head sway by centimetres; feet remain world anchored during stance.
  this.local('coat',p,0,hip+.07,0,.32,.20,.22,pants);
  this.local('coat',p,0,hip+.32,-.014,.43,.48,.25,coat);
  this.local('box',p,0,hip+.55,.116,.020,.095,.014,sole);
  this.local('box',p,0,hip+.29,.117,.009,.38,.010,dark);
  this.local('coat',p,-.080,hip+.55,.071,.12,.05,.08,sole,-.32);this.local('coat',p,.080,hip+.55,.071,.12,.05,.08,sole,.32);
  this.local('round',p,0,hip+.58,0,.066,.075,.066,skin);
  this.local('round',p,0,hip+.755,.012,.135,.192,.126,skin);
  this.local('hair',p,0,hip+.755,.012,.144,.201,.137,hairCol);
  if(p.id===1||p.id===4)this.local('round',p,0,hip+.765,-.153,.072,.069,.085,hairCol);
  this.local('round',p,0,hip+.735,.132,.027,.034,.036,skin);
  for(const side of[-1,1]){this.local('round',p,side*.135,hip+.747,.012,.025,.040,.019,skin);this.local('round',p,side*.047,hip+.783,.127,.015,.011,.008,pale);this.local('round',p,side*.047,hip+.782,.134,.006,.006,.004,dark);this.local('box',p,side*.047,hip+.809,.126,.035,.010,.008,hairCol);}
  this.local('box',p,0,hip+.688,.131,.035,.008,.006,LIP);
  // A shaped backpack, raised pocket, zipper and two distinct shoulder straps.
  if(p.id%3!==2){this.local('coat',p,0,hip+.34,-.20,.32,.39,.19,pack);this.local('coat',p,0,hip+.255,-.303,.24,.15,.055,pack);this.local('box',p,0,hip+.33,-.334,.19,.009,.008,sole);this.local('box',p,.033,hip+.315,-.339,.011,.034,.009,dark);this.local('coat',p,0,hip+.555,-.197,.085,.030,.045,dark);for(const side of[-1,1]){this.local('coat',p,side*.135,hip+.35,.121,.035,.35,.022,pack);this.local('coat',p,side*.15,hip+.542,-.012,.038,.044,.265,pack);}}
  for(let i=0;i<2;i++){const side=i===0?-1:1,f=foot(r,d,i*.5,side*.09*k,p.feet[i],p.a,p.b,p.tmp),h=p.hips[i],j=p.knees[i];h.x=q.x+q.fz*side*.095*k;h.y=q.y+hip*k;h.z=q.z-q.fx*side*.095*k;
   // IK lengths are scaled with the person; solve in normalized metres then restore.
   const fn=p.normalizedFoot;fn.x=h.x+(f.x-h.x)/k;fn.y=h.y+(f.y-h.y)/k;fn.z=h.z+(f.z-h.z)/k;knee(h,fn,q,j);j.x=h.x+(j.x-h.x)*k;j.y=h.y+(j.y-h.y)*k;j.z=h.z+(j.z-h.z)*k;
   this.segment('limb',p,h,j,.176*k,.184*k,pants);this.segment('limb',p,j,f,.140*k,.154*k,pants);
   this.add('shoe',p,f.x+f.fx*.040*k,r.y+.032*k+f.lift,f.z+f.fz*.040*k,.123,.064,.275,sole,f.fx,f.fz);
   this.add('shoe',p,f.x+f.fx*.038*k,r.y+.083*k+f.lift,f.z+f.fz*.038*k,.115,.068,.255,dark,f.fx,f.fz);
   this.add('box',p,f.x+f.fx*.050*k,r.y+.121*k+f.lift,f.z+f.fz*.050*k,.075,.006,.075,sole,f.fx,f.fz);
   const swing=-Math.cos(d/STRIDE*TAU+i*Math.PI)*.24,sh=p.shoulder,el=p.elbow,hand=p.hand;sh.x=q.x+q.fz*side*.236*k;sh.y=q.y+(hip+.50)*k;sh.z=q.z-q.fx*side*.236*k;el.x=sh.x+q.fx*swing*.65*k;el.y=sh.y-.265*k;el.z=sh.z+q.fz*swing*.65*k;hand.x=el.x+q.fx*(swing*.5+.06)*k;hand.y=el.y-.235*k;hand.z=el.z+q.fz*(swing*.5+.06)*k;
   this.segment('limb',p,sh,el,.135*k,.139*k,coat);this.segment('limb',p,el,hand,.102*k,.110*k,coat);this.add('round',p,hand.x,hand.y-.04*k,hand.z,.041,.068,.032,skin);this.add('round',p,hand.x+q.fx*.033*k,hand.y-.014*k,hand.z+q.fz*.033*k,.022,.036,.022,skin);
  }
 }
 ensureGPU(){if(this.gpu)return;const e=this.engine,g=e.gl;this.shadow=e.program(SHADOW_VERT,SHADOW_FRAG);for(const m of this.meshes.values()){m.vertex=g.createBuffer();m.index=g.createBuffer();m.buffer=g.createBuffer();m.vao=g.createVertexArray();g.bindVertexArray(m.vao);g.bindBuffer(g.ARRAY_BUFFER,m.vertex);g.bufferData(g.ARRAY_BUFFER,m.vertices,g.STATIC_DRAW);for(let a=0;a<3;a++){g.enableVertexAttribArray(a);g.vertexAttribPointer(a,a===2?2:3,g.FLOAT,false,32,[0,12,24][a]);}g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,m.index);g.bufferData(g.ELEMENT_ARRAY_BUFFER,m.indices,g.STATIC_DRAW);g.bindBuffer(g.ARRAY_BUFFER,m.buffer);g.bufferData(g.ARRAY_BUFFER,m.data.byteLength,g.DYNAMIC_DRAW);for(let a=3;a<=9;a++){g.enableVertexAttribArray(a);g.vertexAttribPointer(a,4,g.FLOAT,false,112,(a-3)*16);g.vertexAttribDivisor(a,1);}}g.bindVertexArray(null);this.gpu=true;}
 // Body VAOs retain offset zero. Shadow VAOs retain the route slice and are
 // reconfigured only when the active route layout changes; the GPU buffer is owned
 // by the mesh and never replaced. Main/reflection reuse the same body VAO.
 shadowVAO(m,ri,start){const g=this.engine.gl;let v=m.shadowVAOs[ri];if(!v){v=m.shadowVAOs[ri]=g.createVertexArray();g.bindVertexArray(v);g.bindBuffer(g.ARRAY_BUFFER,m.vertex);for(let a=0;a<3;a++){g.enableVertexAttribArray(a);g.vertexAttribPointer(a,a===2?2:3,g.FLOAT,false,32,[0,12,24][a]);}g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,m.index);g.bindBuffer(g.ARRAY_BUFFER,m.buffer);for(let a=3;a<=9;a++){g.enableVertexAttribArray(a);g.vertexAttribDivisor(a,1);}m.shadowStarts[ri]=-1;}g.bindVertexArray(v);if(m.shadowStarts[ri]!==start){g.bindBuffer(g.ARRAY_BUFFER,m.buffer);for(let a=3;a<=9;a++)g.vertexAttribPointer(a,4,g.FLOAT,false,112,start*112+(a-3)*16);m.shadowStarts[ri]=start;}return v;}
 upload(){if(this.uploadVersion===this.version)return;const g=this.engine.gl;let bytes=0;for(const m of this.meshes.values())if(m.count){g.bindBuffer(g.ARRAY_BUFFER,m.buffer);g.bufferSubData(g.ARRAY_BUFFER,0,m.data,0,m.count*28);bytes+=m.count*112;}this.uploadVersion=this.version;this.metrics.uploads++;this.metrics.uploadedBytes+=bytes;}
 draw(vp,eye,pass){if(!this.active||!this.mask||this.disposed)return;this.ensureGPU();this.upload();const e=this.engine,g=e.gl;let calls=0,shadows=0;
  // Directional silhouette projected onto the proven flat road only. Equal-depth
  // LESS writes form one union, so overlapping body triangles do not darken it.
  // No moving object is baked into the cached campus shadow map.
  if(pass===0&&e.day>.01){const p=this.shadow;g.useProgram(p.p);e.uniform(p,'uVP',vp);e.uniform(p,'uSun',e.sun);e.uniform(p,'uResolution',[e.canvas.width,e.canvas.height]);e.uniform(p,'uOpacity',.23*e.day*(this.state.weather===1||this.state.weather===2?.40:1));g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.depthFunc(g.LESS);g.depthMask(true);
   // Every chosen road has exactly the same .12 m flat surface. Clip each shadow
   // against its source ribbon by route; consecutive route ranges draw only their own instances,
   // and the three proven corridors are disjoint by tens of metres.
   for(let i=0;i<this.routes.length;i++)if(this.mask&(1<<i)){const r=this.routes[i],depth=planeDepth(vp,r.y+.007,(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2);if(!depth)continue;e.uniform(p,'uPlaneDepth',depth);e.uniform(p,'uGround',r.y);for(let j=0;j<4;j++)e.uniform(p,'uClip'+j,r.clip[j]);for(const m of this.meshes.values()){const range=m.ranges[i];if(!range.count)continue;this.shadowVAO(m,i,range.start);g.drawElementsInstanced(g.TRIANGLES,m.indices.length,g.UNSIGNED_SHORT,0,range.count);shadows++;}}
   g.disable(g.BLEND);g.depthFunc(g.LEQUAL);
  }
  e.stateUniforms(e.main,vp,eye,pass);e.sampler(e.main,'uShadowMap',0,e.shadowTarget.tex);e.sampler(e.main,'uReflectionMap',1,pass===3?e.dummy:e.reflectTarget.tex);e.sampler(e.main,'uAtlas',2,e.atlas||e.dummy);e.sampler(e.main,'uMaterials',3,e.materials||e.dummy);
  for(const m of this.meshes.values())if(m.count){g.bindVertexArray(m.vao);g.drawElementsInstanced(g.TRIANGLES,m.indices.length,g.UNSIGNED_SHORT,0,m.count);calls++;}g.bindVertexArray(null);this.metrics[pass===3?'reflectionCalls':'mainCalls']=calls;this.metrics.shadowCalls=shadows;
 }
 labelBoxes(){if(!this.active||!this.mask)return[];const boxes=[];for(const p of this.people)if(this.mask&(1<<p.ri)){const q=p.root,a=this.engine.project([q.x,q.y+1.86*p.scale,q.z]),b=this.engine.project([q.x,q.y,q.z]),h=Math.abs(b.y-a.y);if(a.visible&&b.visible&&h>30){const w=h*.44;boxes.push([(a.x+b.x)/2-w/2,Math.min(a.y,b.y)-4,w,h+8]);}}return boxes;}
 closeView(){const p=this.people[0],r=this.routes[0],q={};sample(r,this.distance(r,this.progress[0],p.offset),q);const ox=r.uz*2.6-q.fx*7,oz=-r.ux*2.6-q.fz*7;return{target:[q.x+q.fx*1.5,.92,q.z+q.fz*1.5],distance:9.7,elevation:.09,yaw:Math.atan2(ox,oz)};}
 dispose(){if(this.disposed)return;this.disposed=true;const g=this.engine.gl;if(this.gpu){for(const m of this.meshes.values()){g.deleteVertexArray(m.vao);for(const v of m.shadowVAOs)if(v)g.deleteVertexArray(v);g.deleteBuffer(m.vertex);g.deleteBuffer(m.index);g.deleteBuffer(m.buffer);}g.deleteProgram(this.shadow.p);}this.meshes.clear();}
}
const HAIR=M.color('#302a26'),PALE=M.color('#ddd3bc'),DARK=M.color('#303332'),LIP=M.color('#976552');
Y.Pedestrians46={create:(e,c,s)=>new Walkers(e,c,s),routes:ROUTES,sample,foot,knee,planeDepth,Walkers};
})(YY);
