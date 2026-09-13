/* Yanyuan WebGL2 renderer; original scene assets remain local. */
(function(Y){'use strict';const M=Y.M;
const VERT=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;layout(location=1) in vec3 aNormal;layout(location=2) in vec2 aUV;
layout(location=3) in mat4 iMatrix;layout(location=7) in vec4 iColor;layout(location=8) in vec4 iMeta;layout(location=9) in vec4 iUV;
uniform mat4 uVP;uniform mat4 uLightVP;uniform mat4 uReflectionVP;uniform float uTime;uniform float uSelected;uniform float uExplode;
out vec3 vWorld;out vec3 vNormal;out vec4 vColor;out vec2 vUV;out vec2 vSurfaceUV;out vec4 vShadow;out vec4 vReflection;
flat out float vId;flat out float vMat;
void main(){vec4 w=iMatrix*vec4(aPosition,1.0);
 if(iMeta.z>0.5&&iMeta.z<1.5){float tip=max(0.0,aPosition.y+.5);w.x+=sin(uTime*1.35+iMatrix[3].x*.21+iMatrix[3].z*.09)*tip*.4;w.z+=cos(uTime*.8+iMatrix[3].z*.1)*tip*.25;}
 // Unrouted ambient bicycles remain parked; do not move through walls.
 if(iMeta.z>4.5&&iMeta.z<5.5){w.y+=sin(uTime*1.5+iMeta.y)*.018;}
 if(abs(iMeta.y-uSelected)<.1&&uSelected>.5){w.y+=uExplode*iMeta.w;}
 vec3 nx=iMatrix[0].xyz,ny=iMatrix[1].xyz,nz=iMatrix[2].xyz;
 vNormal=normalize(nx*aNormal.x/dot(nx,nx)+ny*aNormal.y/dot(ny,ny)+nz*aNormal.z/dot(nz,nz));
 vec3 metric=aPosition*vec3(length(nx),length(ny),length(nz));
 vec3 an=abs(aNormal);vSurfaceUV=an.y>.55?metric.xz:(an.z>an.x?metric.xy:metric.zy);
 vWorld=w.xyz;vUV=iUV.xy+aUV*iUV.zw;vColor=iColor;vId=iMeta.y;vMat=iMeta.x;vShadow=uLightVP*w;vReflection=uReflectionVP*w;gl_Position=uVP*w;
}`;
const FRAG=`#version 300 es
precision highp float;
in vec3 vWorld;in vec3 vNormal;in vec4 vColor;in vec2 vUV;in vec2 vSurfaceUV;in vec4 vShadow;in vec4 vReflection;flat in float vId;flat in float vMat;
uniform vec3 uEye;uniform vec3 uSun;uniform vec3 uSky;uniform float uDay;uniform float uTime;uniform float uSelected;uniform float uIsolate;uniform float uSeason;uniform float uWeather;uniform float uFog;uniform float uWaterLevel;uniform int uPass;uniform vec4 uSelection;
uniform highp sampler2D uShadowMap;uniform highp sampler2D uReflectionMap;uniform highp sampler2D uAtlas;uniform highp sampler2DArray uMaterials;
out vec4 frag;
const float PI=3.14159265;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
vec4 material(float m,vec2 uv){float mm=clamp(floor(m+.2),0.,15.);return textureGrad(uMaterials,vec3(uv,mm),dFdx(uv),dFdy(uv));}
// v20 receiver-plane depth comparison avoids patterned self-shadow on slopes.
float shadow(vec3 n){vec3 p=vShadow.xyz/vShadow.w*.5+.5;if(p.x<0.0||p.x>1.0||p.y<0.0||p.y>1.0||p.z>1.0)return 1.0;float s=0.0;vec3 dx=dFdx(p),dy=dFdy(p);float det=dx.x*dy.y-dx.y*dy.x;vec2 slope=abs(det)>1e-12?vec2(dy.y*dx.z-dx.y*dy.z,dx.x*dy.z-dy.x*dx.z)/det:vec2(0.);float bias=.00013+.00020*(1.0-max(0.0,dot(n,uSun)));for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){vec2 off=vec2(x,y)*2.3/vec2(textureSize(uShadowMap,0));float d=texture(uShadowMap,p.xy+off).r;float receiver=p.z+dot(slope,off);s+=receiver-bias>d?0.:1.;}return s/9.0;}
vec3 bump(vec3 n,float height){vec3 p1=dFdx(vWorld),p2=dFdy(vWorld),r1=cross(p2,n),r2=cross(n,p1);float det=dot(p1,r1);return normalize(abs(det)*n-sign(det)*(dFdx(height)*r1+dFdy(height)*r2));}
vec3 fresnel(float cosT,vec3 f0){return f0+(1.-f0)*pow(1.-cosT,5.);}
// Average procedural microtexture once a pixel covers several texture cells.
float filteredNoise(vec2 p){float footprint=max(length(dFdx(p)),length(dFdy(p)));return mix(noise(p),.5,smoothstep(.35,1.5,footprint));}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
bool vegetation46Visible(float mat,vec2 uv,float season){
 vec2 q=fract(uv*3.)-.5;
 float cell=floor(fract(uv.x)*3.)+floor(fract(uv.y)*3.)*3.;
 float angle=cell*2.399;vec2 r=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*q;
 vec2 shape=mat==46.?vec2(5.2,1.60):vec2(3.1,2.05);
 if(dot(r*shape,r*shape)>1.)return false;
 if(mat==45.&&season>2.5)return false;
 return true;
}
void main(){
 if(uIsolate>.5&&abs(vId-uIsolate)>.1&&vId<999998.0)discard;
 if(uPass==3&&(vWorld.y<uWaterLevel-.025||abs(vMat-4.0)<.1))discard;
 if(vMat==8. && texture(uAtlas,vUV).a<.38)discard;
 if(vMat==16.){vec2 q=fract(vUV*3.)-.5;float cell=floor(vUV.x*3.)+floor(vUV.y*3.)*3.;float a=cell*2.399;vec2 r=mat2(cos(a),-sin(a),sin(a),cos(a))*q;if(dot(r*vec2(3.1,2.05),r*vec2(3.1,2.05))>1.)discard;if(uSeason>2.5&&hash(vec2(cell,vId))>.22)discard;}
 if((vMat==45.||vMat==46.)&&!vegetation46Visible(vMat,vUV,uSeason))discard;
 if(uPass==1){int id=int(vId+.5);frag=vec4(float(id&255)/255.0,float((id>>8)&255)/255.0,float((id>>16)&255)/255.0,1);return;}
 vec3 gn=normalize(vNormal);if(!gl_FrontFacing)gn=-gn;vec3 n=gn,V=normalize(uEye-vWorld),base=vColor.rgb;float mat=vMat,dist=length(uEye-vWorld);float rough=.83,metal=0.;vec2 st=vSurfaceUV;
 if(mat<18.&&mat!=4.&&mat!=5.&&mat!=8.&&mat!=12.&&mat!=3.&&mat!=16.){float scale=2.4;if(mat==14.)scale=4.8;if(mat==0.)scale=3.6;if(mat==2.)scale=2.;if(mat==6.)scale=2.1;vec4 t=material(mat,st/scale);float footprint=max(length(dFdx(st)),length(dFdy(st)));base*=mix(t.rgb,vec3(.95),smoothstep(.55,2.5,footprint));float relief=.023;if(mat==13.||mat==9.||mat==0.)relief=.006;if(mat==7.||mat==10.||mat==14.)relief=.006;if(mat==2.)relief=.04;if(dist<260.)n=bump(n,t.a*relief);}

 // v8 region materials: physically small masonry and clay tiles, anti-aliased at distance.
 // Source photos inform the material family, not a copied photograph texture.
 if(mat==18.){
  vec2 b=st/vec2(.24,.074);b.x+=mod(floor(b.y),2.)*.5;vec2 q=fract(b),fw=fwidth(b);
  vec2 a=smoothstep(vec2(.025),vec2(.055)+fw,q)*smoothstep(vec2(.025),vec2(.055)+fw,1.-q);
  float joint=a.x*a.y,variation=mix(hash(floor(b)),.5,smoothstep(.45,2.,max(fw.x,fw.y)));float patina=noise(st*.53)*.055+noise(st*14.)*.016;
  vec3 brick=base*(.85+.18*variation-patina);base=mix(vec3(.43,.45,.40),brick,joint);
  float blend=smoothstep(.45,2.,max(fw.x,fw.y));base=mix(base,brick,blend);rough=.93;
  if(dist<95.)n=bump(n,joint*.0024+noise(st*19.)*.0005);
 }
 if(mat==19.){
  vec2 t=st/vec2(.235,.34),q=fract(t),fw=fwidth(t);float gutter=.5+.5*cos(q.x*6.28318);
  float lip=1.-smoothstep(.02,.075+fw.y,q.y);float fade=1.-smoothstep(.35,1.7,max(fw.x,fw.y));
  base*=.82+.14*mix(.5,noise(floor(t)),fade)+.10*gutter*fade-.05*lip*fade;rough=.91;
  if(dist<90.)n=bump(n,(gutter*.018-lip*.004)*fade);
 }
 // v13FacadeMaterial: dedicated fine dark masonry, blue glazing and aluminium.
 // v14ArcMasonry: flat brick uses metric surface UV; curved brick uses the
 // constructor's physical arc-length UV. Avoids triplanar seams on round wings.
 if(mat==32.){rough=.52;metal=.32;base*=.97+.022*filteredNoise(st*vec2(12.,77.));}
 if(mat==30.){vec2 b=st/vec2(.24,.060);b.x+=mod(floor(b.y),2.)*.5;vec2 q=fract(b),fw=fwidth(b);vec2 aa=smoothstep(vec2(.015,.020),vec2(.035,.055)+fw,q)*smoothstep(vec2(.015,.020),vec2(.035,.055)+fw,1.-q);float mortar=aa.x*aa.y,fade=1.-smoothstep(.4,1.8,max(fw.x,fw.y));base*=.97+.045*(hash(floor(b))-.5)*fade;base*=mix(.80,1.,mix(1.,mortar,fade));rough=.95;if(dist<50.)n=bump(n,mortar*.0013*fade);}
 if(mat==31.){vec2 b=vUV/vec2(.24,.060);b.x+=mod(floor(b.y),2.)*.5;vec2 q=fract(b),fw=fwidth(b);vec2 aa=smoothstep(vec2(.015,.020),vec2(.035,.055)+fw,q)*smoothstep(vec2(.015,.020),vec2(.035,.055)+fw,1.-q);float mortar=aa.x*aa.y,fade=1.-smoothstep(.4,1.8,max(fw.x,fw.y));base*=.97+.045*(hash(floor(b))-.5)*fade;base*=mix(.80,1.,mix(1.,mortar,fade));rough=.95;if(dist<50.)n=bump(n,mortar*.0013*fade);}
 if(mat==27.){vec2 b=st/vec2(.255,.060);b.x+=mod(floor(b.y),2.)*.5;vec2 q=fract(b),fw=fwidth(b);vec2 aa=smoothstep(vec2(.010,.018),vec2(.024,.048)+fw,q)*smoothstep(vec2(.010,.018),vec2(.024,.048)+fw,1.-q);float mortar=aa.x*aa.y,fade=1.-smoothstep(.32,1.7,max(fw.x,fw.y));vec3 brick=base*(.97+.045*(hash(floor(b))-.5)*fade);base=mix(brick*1.10,brick,mix(1.,mortar,fade));rough=.91;if(dist<60.)n=bump(n,mortar*.0014*fade+noise(st*37.)*.00025);}
 if(mat==28.){rough=.10;metal=.08;base*=.88+.07*noise(st*.47);}
 if(mat==38.){rough=.94;base*=.96;}
 if(mat==29.||mat==37.||mat==43.){rough=mat==29.?.28:.64;metal=mat==29.?.62:.25;base*=.94+.04*filteredNoise(st*vec2(4.,130.));}
 if(mat==20.){float grain=noise(st*vec2(5.,110.));base*=.89+.15*grain;rough=.82;}
 // v9: lime-plaster and physical clay-tile meshes, with subtle microtexture only.
 // Zhihua: subtle antialiased plaster joints and square stone panels, no relief strips.
 if(mat==35.||mat==36.){vec2 pitch=mat==36.?vec2(1.08):vec2(2.45,100.);vec2 q=fract(st/pitch),fw=max(fwidth(st/pitch),vec2(.0001));vec2 edge=min(q,1.-q);vec2 line=1.-smoothstep(vec2(.002),vec2(.006)+fw,edge);float joint=mat==35.?line.x:max(line.x,line.y);base*=.975-joint*.055;rough=.92;}
 if(mat==24.){base*=.94+.035*noise(st*2.)+.020*filteredNoise(st*70.);rough=.94;vec3 detailNormal=bump(n,noise(st*25.)*.00065);n=normalize(mix(n,detailNormal,1.-smoothstep(35.,45.,dist)));}
 if(mat==25.){base*=.91+.045*noise(st*7.)+.025*filteredNoise(st*55.);rough=.89;vec3 detailNormal=bump(n,noise(st*23.)*.0008);n=normalize(mix(n,detailNormal,1.-smoothstep(45.,55.,dist)));}
 // Qiu roof standing seams: world-space spacing with pixel filtering.
 if(mat==43.){float u=(vWorld.x*.9989-vWorld.z*.0467)/.66;float fw=max(fwidth(u),.0001);float edge=abs(fract(u+.5)-.5);float seam=1.-smoothstep(.025-fw*.5,.025+fw*.5,edge);float fade=1.-smoothstep(.45,1.2,fw);base*=1.-.15*seam*fade;}
 // Evergreen needles use 33; 26 remains the library paving material.
 if(mat==33.){base*=.88+.17*noise(vWorld.xz*2.3+vWorld.y*.6);rough=.93;if(uSeason>2.5)base=mix(base,vec3(.86,.89,.87),smoothstep(.60,.98,gn.y)*.62);}
 // Library forecourt: physical-scale paving joints with derivative antialiasing.
 if(mat==26.){vec2 t=st/vec2(1.25,.85),q=fract(t),fw=fwidth(t);vec2 a=smoothstep(vec2(.004),vec2(.010)+fw,q)*smoothstep(vec2(.004),vec2(.010)+fw,1.-q);float joint=a.x*a.y,fade=1.-smoothstep(.16,.70,max(fw.x,fw.y));base*=.90+.035*noise(floor(t))+.025*filteredNoise(st*27.);base*=1.-(1.-joint)*.28*fade;rough=.93;if(dist<65.)n=bump(n,joint*.0015*fade);}
 if(mat==23.){base*=.92+.08*noise(vWorld.xz*4.);rough=.94;if(uSeason>2.5)base=mix(base,vec3(.84,.87,.84),smoothstep(.4,.95,gn.y)*.50);}
 if(mat==22.){base*=.89+.12*filteredNoise(st*31.);rough=.94;}
 if(mat==34.){vec2 q=st/1.15,cell=floor(q);float first=100.,second=100.,tone=.5;for(int ix=-1;ix<=1;ix++){for(int iz=-1;iz<=1;iz++){vec2 c=cell+vec2(float(ix),float(iz)),site=c+vec2(.20)+.60*vec2(hash(c),hash(c+vec2(17.7)));float dd=length(q-site);if(dd<first){second=first;first=dd;tone=hash(c+vec2(9.1));}else second=min(second,dd);}}float aa=max(.008,length(fwidth(q))),edge=smoothstep(.025-aa,.025+aa,second-first);base*=mix(.69,.94+tone*.09,edge);rough=.96;}
 if(mat==21.){float footprint=max(length(dFdx(st)),length(dFdy(st)));float fine=1.-smoothstep(.006,.035,footprint);float grain=mix(.5,filteredNoise(st*55.),fine),big=mix(.5,noise(st*1.7),1.-smoothstep(.25,.8,footprint));base*=.86+.16*grain+.05*big;rough=.98;if(dist<65.&&fine>.01)n=bump(n,grain*.0012);}
 // The mapped ground keeps its existing texture, relief and two noise scales.
 // Softer, differently oriented colour variation avoids large square patches.
 if(mat==40.)base*=vec3(.94,.94,.925);
 if(mat==0.){vec2 groundA=mat2(.8,-.6,.6,.8)*vWorld.xz,groundB=mat2(.9238795,.3826834,-.3826834,.9238795)*vWorld.xz;base*=.84+.07*noise(groundA*.035)+.035*noise(groundB*.21);if(uSeason>2.5)base=vec3(.86,.89,.88);if(uSeason>1.5&&uSeason<2.5)base*=vec3(1.05,1.,.92);}
 if(mat==16.){vec2 leaf=fract(vUV*3.)-.5;float vein=1.-smoothstep(.007,.021,abs(leaf.y));base*=1.-vein*.11;} if(mat==3.||mat==16.){float tone=hash(vec2(vId,vId*.41));base*=.91+.13*noise(vWorld.xz*1.7);if(uSeason>1.5&&uSeason<2.5)base=mix(vec3(.58,.23,.052),vec3(.89,.61,.14),tone);if(uSeason<.5)base=mix(base,vec3(.45,.63,.21),.22);if(uSeason>2.5)base=mix(base*.50,vec3(.88,.91,.90),smoothstep(.15,.7,gn.y));rough=.88;}
 // Trees46: evergreen needles stay green, deciduous crowns reveal the branch hierarchy in winter.
 if(mat==45.||mat==46.){base*=.94+.09*noise(vWorld.xz*1.7);rough=.89;
  if(mat==45.){float tone=hash(vec2(vId,vId*.41));if(uSeason>1.5&&uSeason<2.5)base=mix(vec3(.54,.36,.13),vec3(.88,.69,.19),tone);if(uSeason<.5)base=mix(base,vec3(.48,.65,.28),.18);}
  else if(uSeason>2.5)base=mix(base,vec3(.83,.87,.86),smoothstep(.72,.98,gn.y)*.22);
 }
 if(mat==8.){base=texture(uAtlas,vUV).rgb;rough=.8;}
 if(mat==9.){rough=.30;metal=.72;}
 if(mat==10.||mat==14.)rough=.62;
 if(mat==5.){rough=.115;metal=.05;base=vec3(.24,.32,.35);}
 if(uSeason>2.5&&(mat==2.||mat==7.))base=mix(base,vec3(.89,.93,.94),smoothstep(.10,.8,gn.y));
 if(uWeather>.5&&uWeather<1.5){rough*=.58;base*=.86;}
 base=pow(max(base,vec3(.0)),vec3(2.2));
 float ndl=max(0.,dot(n,uSun)),ndv=max(.001,dot(n,V)),sh=shadow(gn);vec3 H=normalize(V+uSun);float ndh=max(0.,dot(n,H)),hdv=max(0.,dot(H,V));
 float a=rough*rough,a2=a*a,den=ndh*ndh*(a2-1.)+1.;float D=a2/(PI*den*den+.0001);float k=(rough+1.)*(rough+1.)/8.;float G=ndv/(ndv*(1.-k)+k)*ndl/(ndl*(1.-k)+k);
 vec3 F=vec3(.04),spec=vec3(0.);if(mat==5.||mat==9.||mat==4.||mat==10.||mat==28.||mat==29.||mat==32.||mat==37.||mat==43.){F=fresnel(hdv,mix(vec3(.04),base,metal));spec=D*G*F/(4.*ndv*ndl+.001);}vec3 kd=(1.-F)*(1.-metal);
 float ao=mix(.78,1.,smoothstep(.0,6.,vWorld.y));vec3 amb=mix(vec3(.035,.049,.085),vec3(.33,.365,.40),uDay)*(0.55+0.45*max(n.y,-.3));vec3 sunCol=mix(vec3(.13,.23,.46),vec3(3.05,2.93,2.70),uDay);
 vec3 col=base*amb*ao+(kd*base/PI+spec)*sunCol*ndl*sh;col+=base*vec3(.080,.068,.050)*(1.-max(n.y,0.))*uDay;
 if(mat==3.||mat==16.||mat==45.||mat==46.){float trans=pow(max(0.,dot(-uSun,V)),3.);col+=base*sunCol*.13*(.24+.76*trans)*(1.-ndl);}
 if(mat==5.){vec3 R=reflect(-V,n);vec3 env=mix(vec3(.14,.18,.16),pow(uSky,vec3(2.2)),smoothstep(-.35,.65,R.y));float trees=noise(R.xz*13.+vWorld.xz*.013);env*=mix(.68,1.,smoothstep(.35,.69,trees));float f=.16+.74*pow(1.-ndv,4.);col=mix(col,env,f);col+=vec3(.84,.39,.10)*(1.-uDay)*(.12+.20*hash(floor(vWorld.xy*.18)));}
 if(mat==28.){vec3 R=reflect(-V,n);float skyward=smoothstep(-.16,.7,R.y);vec3 sky=pow(mix(uSky,vec3(.52,.68,.78),.30*uDay),vec3(2.2));vec3 environment=mix(vec3(.040,.064,.061),sky,skyward);float cloud=smoothstep(.62,.89,noise(R.xz*3.7/(abs(R.y)+.38)));environment=mix(environment,pow(uSky,vec3(2.2))*.98,cloud*skyward*.27);float reflectance=.23+.65*pow(1.-ndv,4.);col=mix(col,environment*mix(vec3(.69,.87,.98),vec3(1.),skyward*.44),reflectance);col+=base*.035*uDay;}
 if(mat==12.)col=base*(.75+(1.-uDay)*3.8);
 // Reuse the six existing calm wave phases and the already sampled shadow.
 // Direct water light and sun glints receive shadows; sky reflection does not.
 // The separately calibrated hall pool (pick 21) retains its original formula.
 if(mat==4.){vec2 w=vec2(sin(vWorld.x*.37+vWorld.z*.22+uTime*.63)+.43*sin(vWorld.x*1.27-vWorld.z*.43-uTime*.91)+.17*sin(vWorld.x*2.13+vWorld.z*1.90+uTime*.24),cos(vWorld.z*.31-vWorld.x*.24+uTime*.44)+.40*cos(vWorld.z*1.60+vWorld.x*.21-uTime*.80)+.14*cos(vWorld.x*2.31-vWorld.z*.63+uTime*.53))*(vId==21.?.003:.018);n=normalize(vec3(w.x,1.,w.y));vec2 uv=vReflection.xy/vReflection.w*.5+.5;vec3 ref=pow(texture(uReflectionMap,clamp(uv+w*.09,vec2(.001),vec2(.999))).rgb,vec3(2.2));float f=.10+.82*pow(1.-max(0.,dot(n,V)),3.);vec3 water=mix(vec3(.005,.014,.012),vec3(.014,.044,.033),uDay);if(vId==21.){water=vec3(.003,.008,.009);f=.24+.68*pow(1.-max(0.,dot(n,V)),3.);}if(vId!=21.)water*=mix(1.,.66+.34*sh,uDay);col=mix(water,ref,f);col+=pow(max(0.,dot(n,normalize(V+uSun))),230.)*vec3(1.,.80,.55)*uDay*.8*(vId==21.?1.:sh);if(uSeason>2.5)col=mix(col,vec3(.40,.55,.61),.79);}
 if(mat==17.)col=pow(vec3(.22,.64,.57),vec3(2.2))*.8;
 if(uWeather>1.5&&uWeather<2.5)col*=.88;
 if(abs(vId-uSelected)<.1&&uSelected>.5){float rim=pow(1.-abs(dot(n,V)),3.);col=mix(col,vec3(.73,.80,.71),rim*.16);}
 if(false){float ring=1.-smoothstep(.15,.8,abs(length(vWorld.xz-uSelection.xy)-uSelection.z));col=mix(col,vec3(.39,.45,.36),ring*.20);}
 if(uIsolate>.5&&vId>999998.)col=vec3(.82,.86,.89)*(.65+.35*sh);
 col=pow(aces(col*1.10),vec3(1./2.2));float fog=1.-exp(-pow(dist*uFog,1.55));col=mix(col,uSky,min(.94,fog));frag=vec4(col,1.);
}`;
// Material 44 is an explicitly ordered, single-pane glass surface. Keep the
// existing opaque shader unchanged so previous materials retain their appearance.
const GLASSFRAG=FRAG.replace('float mat=vMat,','float mat=28.,')
 .replace('frag=vec4(col,1.);','frag=vec4(col,.13+.65*pow(1.-ndv,4.));');
const SHADOWF=`#version 300 es
precision highp float;in vec3 vWorld;in vec2 vUV;flat in float vId;flat in float vMat;uniform float uIsolate;uniform float uSeason;
bool vegetation46Visible(float mat,vec2 uv,float season){
 vec2 q=fract(uv*3.)-.5;
 float cell=floor(fract(uv.x)*3.)+floor(fract(uv.y)*3.)*3.;
 float angle=cell*2.399;vec2 r=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*q;
 vec2 shape=mat==46.?vec2(5.2,1.60):vec2(3.1,2.05);
 if(dot(r*shape,r*shape)>1.)return false;
 if(mat==45.&&season>2.5)return false;
 return true;
}
void main(){if(vWorld.y<.48)discard;if((vMat==45.||vMat==46.)&&!vegetation46Visible(vMat,vUV,uSeason))discard;if(uIsolate>.5&&abs(vId-uIsolate)>.1&&vId<999998.)discard;if(vMat==4.||vMat==8.)discard;if(vMat==16.){vec2 q=fract(vUV*3.)-.5;float cell=floor(vUV.x*3.)+floor(vUV.y*3.)*3.;float a=cell*2.399;vec2 r=mat2(cos(a),-sin(a),sin(a),cos(a))*q;if(dot(r*vec2(3.1,2.05),r*vec2(3.1,2.05))>1.)discard;if(uSeason>2.5)discard;}}`;
const SKYV=`#version 300 es
precision highp float;out vec2 vUV;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUV=p;gl_Position=vec4(p*2.0-1.0,1.0,1.0);}`;
const SKYF=`#version 300 es
precision highp float;in vec2 vUV;uniform mat4 uInvVP;uniform vec3 uEye;uniform vec3 uSun;uniform vec3 uSky;uniform float uDay;uniform float uTime;uniform float uIsolate;uniform float uWeather;out vec4 frag;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){vec4 w=uInvVP*vec4(vUV*2.-1.,1,1);vec3 d=normalize(w.xyz/w.w-uEye);float up=max(0.,d.y);vec3 top=mix(vec3(.026,.055,.104),vec3(.38,.60,.78),uDay);vec3 c=mix(uSky,top,pow(up,.42));vec2 p=d.xz/(max(.12,up))*2.4+vec2(uTime*.002,0);float cloud=smoothstep(.57,.83,n(p)*.65+n(p*2.1)*.25+n(p*4.3)*.1)*smoothstep(.02,.25,up);c=mix(c,mix(vec3(.12,.15,.21),vec3(.93,.95,.94),uDay),cloud*.6);float sun=pow(max(0.,dot(d,uSun)),650.0);c+=sun*vec3(1.,.8,.5)*uDay*.7;if(uDay<.25){vec2 s=d.xz/(.1+up)*190.;float st=step(.996,h(floor(s)))*(1.-smoothstep(.0,.18,length(fract(s)-.5)));c+=st*(1.-uDay)*smoothstep(0.,.3,up);}if(uWeather>.5&&uWeather<2.5)c=mix(c,uSky,.50);if(uIsolate>.5)c=mix(vec3(.86,.89,.86),vec3(.97,.98,.96),clamp(vUV.y,0.,1.));frag=vec4(c,1);}`;
const PARTICLEV=`#version 300 es
precision highp float;layout(location=0) in vec4 aP;uniform mat4 uVP;uniform vec3 uEye;uniform float uTime;uniform float uWeather;out float vAlpha;void main(){float snow=step(2.5,uWeather);float range=max(170.,uEye.y+70.);vec3 p=vec3(mod(aP.x+uTime*(snow*1.4+2.),650.)-325.+uEye.x,mod(aP.y*range-uTime*mix(55.,6.,snow),range),mod(aP.z,650.)-325.+uEye.z);p.x+=sin(uTime*.7+aP.y*19.)*snow*3.;p.y-=aP.w*mix(5.5,.0,snow);gl_Position=uVP*vec4(p,1);gl_PointSize=clamp(500./length(p-uEye),1.5,4.);vAlpha=mix(.23,.68,snow);}`;
const PARTICLEF=`#version 300 es
precision highp float;in float vAlpha;uniform float uWeather;out vec4 frag;void main(){if(uWeather>2.5&&length(gl_PointCoord-.5)>.5)discard;frag=vec4(.88,.94,.98,vAlpha);}`;
const POSTF=`#version 300 es
precision highp float;
in vec2 vUV;uniform sampler2D uSceneColor;uniform highp sampler2D uSceneDepth;
uniform vec2 uResolution;uniform mat4 uInvVP;uniform vec3 uEye;uniform float uContact;
out vec4 frag;
vec3 world(vec2 uv,float depth){vec4 p=uInvVP*vec4(uv*2.-1.,depth*2.-1.,1.);return p.xyz/p.w;}
float contactShade(vec2 uv,float depth){
 if(depth>.999995)return 1.;
 vec3 p=world(uv,depth);vec2 stepUV=1./uResolution;
 // v13: select the continuous side of a depth edge, instead of allowing a
 // text stroke / window-frame edge to tilt the normal of the whole wall.
 vec2 rightUV=uv+vec2(stepUV.x,0.),leftUV=uv-vec2(stepUV.x,0.);
 vec2 upUV=uv+vec2(0.,stepUV.y),downUV=uv-vec2(0.,stepUV.y);
 vec3 dxForward=world(rightUV,texture(uSceneDepth,rightUV).r)-p;
 vec3 dxBackward=p-world(leftUV,texture(uSceneDepth,leftUV).r);
 vec3 dyForward=world(upUV,texture(uSceneDepth,upUV).r)-p;
 vec3 dyBackward=p-world(downUV,texture(uSceneDepth,downUV).r);
 vec3 dx=dot(dxForward,dxForward)<dot(dxBackward,dxBackward)?dxForward:dxBackward;
 vec3 dy=dot(dyForward,dyForward)<dot(dyBackward,dyBackward)?dyForward:dyBackward;
 vec3 n=normalize(cross(dx,dy));if(dot(n,uEye-p)<0.)n=-n;
 float viewDist=length(p-uEye),radius=clamp(viewDist*.0035,.32,2.1);
 float pix=clamp(radius*uResolution.y/(viewDist*.84),1.7,17.);float occ=0.,weight=0.;
 for(int i=0;i<12;i++){float a=float(i)*2.399963;float rr=sqrt((float(i)+.5)/12.);vec2 offset=vec2(cos(a),sin(a))*pix*rr/uResolution;
 vec2 uv2=clamp(uv+offset,vec2(.001),vec2(.999));float d=texture(uSceneDepth,uv2).r;
 if(d<.999995){vec3 q=world(uv2,d)-p;float l=length(q);float atten=1.-smoothstep(radius*.45,radius*1.5,l);float facing=max(0.,dot(q,n)/max(l,.001)-.13);occ+=facing*atten;weight+=1.;}}
 return clamp(1.-occ/max(weight,1.)*1.5*uContact,.66,1.);
}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
void main(){vec2 px=1./uResolution;vec3 c=texture(uSceneColor,vUV).rgb;
 vec3 n=texture(uSceneColor,vUV+vec2(0,px.y)).rgb,s=texture(uSceneColor,vUV-vec2(0,px.y)).rgb;
 vec3 e=texture(uSceneColor,vUV+vec2(px.x,0)).rgb,w=texture(uSceneColor,vUV-vec2(px.x,0)).rgb;
 float lo=min(lum(c),min(min(lum(n),lum(s)),min(lum(e),lum(w)))),hi=max(lum(c),max(max(lum(n),lum(s)),max(lum(e),lum(w))));
 float contrast=hi-lo,edge=smoothstep(.035,.16,contrast);vec3 filtered=(n+s+e+w+c*4.)/8.;c=mix(c,filtered,edge*.28);
 c*=contactShade(vUV,texture(uSceneDepth,vUV).r);frag=vec4(c,1.);}`;
class Engine{
 // Compile both surface programs before scene loading so first draw does not
 // wait for an additional shader link. Blending and all material formulas stay unchanged.
 constructor(canvas){this.canvas=canvas;const gl=canvas.getContext('webgl2',{antialias:false,alpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});if(!gl)throw Error('浏览器未启用 WebGL 2。请使用开启硬件加速的 Chrome、Edge 或 Firefox。');this.gl=gl;
 // All flat outputs (vId/vMat) come from iMeta, which is constant per instance.
 // Selecting the native first vertex avoids ANGLE index rewrites on Metal;
 // unsupported contexts keep the WebGL default with identical flat values.
 const provoking=gl.getExtension('WEBGL_provoking_vertex');if(provoking)provoking.provokingVertexWEBGL(provoking.FIRST_VERTEX_CONVENTION_WEBGL);
 this.buckets=new Map();this.visibilityCaches=new Map();this.stats={instances:0,triangles:0,visibilityBuilds:0,instanceUploadBytes:0};this.main=this.program(VERT,FRAG);this.glass=this.program(VERT,GLASSFRAG);this.shadow=this.program(VERT,SHADOWF);this.skyProg=this.program(SKYV,SKYF);this.particles=this.program(PARTICLEV,PARTICLEF);this.post=this.program(SKYV,POSTF);this.dummy=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.dummy);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([115,150,145,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 this.shadowDirty=true;let dbg=gl.getExtension('WEBGL_debug_renderer_info');this.rendererName=dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):'WebGL 2';this.software=/swiftshader|llvmpipe|software/i.test(this.rendererName);this.quality=this.software?.66:1;this.shadowSize=this.software?768:2048;this.shadowTarget=this.target(this.shadowSize,this.shadowSize,true);this.emptyVAO=gl.createVertexArray();let random=M.rng(23),arr=[];for(let i=0;i<550;i++){let p=[random()*650,random(),random()*650];arr.push(...p,0,...p,1)}this.particleVAO=gl.createVertexArray();gl.bindVertexArray(this.particleVAO);let pb=this.particleBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arr),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,4,gl.FLOAT,false,16,0);this.particleCount=arr.length/4;gl.bindVertexArray(null);this.lastReflection=-1;this.frame=0;
 }
 program(v,f){let gl=this.gl,compile=(src,type)=>{let sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(sh);gl.deleteShader(sh);throw Error(message);}return sh};let p=gl.createProgram(),vs=compile(v,gl.VERTEX_SHADER),fs=compile(f,gl.FRAGMENT_SHADER);gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.detachShader(p,vs);gl.detachShader(p,fs);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){const message=gl.getProgramInfoLog(p);gl.deleteProgram(p);throw Error(message);}return{p,u:{}}}
 // Uniform storage belongs to a linked program and survives switching programs.
 // Snapshot vector values because the camera and lighting arrays can mutate in place.
 uniform(p,name,value){let gl=this.gl;if(!(name in p.u))p.u[name]=gl.getUniformLocation(p.p,name);let u=p.u[name];if(u===null)return;
  const cache=p.values||(p.values=Object.create(null)),old=cache[name];
  if(typeof value==='number'){if(Object.is(old,value))return;cache[name]=value;if(name==='uPass')gl.uniform1i(u,value);else gl.uniform1f(u,value);return;}
  const n=value.length;if(n!==16&&n!==4&&n!==3&&n!==2)return;
  let same=old?.length===n;if(same)for(let i=0;i<n;i++)if(!Object.is(old[i],value[i])){same=false;break;}if(same)return;
  const saved=old?.length===n?old:new Float64Array(n);for(let i=0;i<n;i++)saved[i]=value[i];cache[name]=saved;
  if(n===16)gl.uniformMatrix4fv(u,false,value);else if(n===4)gl.uniform4fv(u,value);else if(n===3)gl.uniform3fv(u,value);else gl.uniform2fv(u,value);
 }
 sampler(p,name,unit,texture){let gl=this.gl;if(!(name in p.u))p.u[name]=gl.getUniformLocation(p.p,name);gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(name==='uMaterials'?gl.TEXTURE_2D_ARRAY:gl.TEXTURE_2D,texture);
  const units=p.samplerUnits||(p.samplerUnits=Object.create(null));if(units[name]!==unit){gl.uniform1i(p.u[name],unit);units[name]=unit;}
 }
 target(w,h,depthOnly=false){let g=this.gl,f=g.createFramebuffer();g.bindFramebuffer(g.FRAMEBUFFER,f);let tex=g.createTexture();g.bindTexture(g.TEXTURE_2D,tex);g.texImage2D(g.TEXTURE_2D,0,depthOnly?g.DEPTH_COMPONENT24:g.RGBA8,w,h,0,depthOnly?g.DEPTH_COMPONENT:g.RGBA,depthOnly?g.UNSIGNED_INT:g.UNSIGNED_BYTE,null);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,depthOnly?g.NEAREST:g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,depthOnly?g.NEAREST:g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.framebufferTexture2D(g.FRAMEBUFFER,depthOnly?g.DEPTH_ATTACHMENT:g.COLOR_ATTACHMENT0,g.TEXTURE_2D,tex,0);let depth=null;if(depthOnly){g.drawBuffers([g.NONE]);g.readBuffer(g.NONE)}else{depth=g.createRenderbuffer();g.bindRenderbuffer(g.RENDERBUFFER,depth);g.renderbufferStorage(g.RENDERBUFFER,g.DEPTH_COMPONENT24,w,h);g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,depth)}if(g.checkFramebufferStatus(g.FRAMEBUFFER)!==g.FRAMEBUFFER_COMPLETE)throw Error('Framebuffer initialization failed');g.bindFramebuffer(g.FRAMEBUFFER,null);return{f,tex,depth,w,h}}
 colorDepthTarget(w,h){let t=this.target(w,h),g=this.gl;g.deleteRenderbuffer(t.depth);let depth=g.createTexture();g.bindTexture(g.TEXTURE_2D,depth);g.texImage2D(g.TEXTURE_2D,0,g.DEPTH_COMPONENT24,w,h,0,g.DEPTH_COMPONENT,g.UNSIGNED_INT,null);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.NEAREST);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.NEAREST);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.bindFramebuffer(g.FRAMEBUFFER,t.f);g.framebufferTexture2D(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.TEXTURE_2D,depth,0);if(g.checkFramebufferStatus(g.FRAMEBUFFER)!==g.FRAMEBUFFER_COMPLETE)throw Error('Depth-texture framebuffer incomplete');g.bindFramebuffer(g.FRAMEBUFFER,null);let msF=g.createFramebuffer();g.bindFramebuffer(g.FRAMEBUFFER,msF);let msColor=g.createRenderbuffer(),msDepth=g.createRenderbuffer(),samples=Math.min(4,g.getParameter(g.MAX_SAMPLES));g.bindRenderbuffer(g.RENDERBUFFER,msColor);g.renderbufferStorageMultisample(g.RENDERBUFFER,samples,g.RGBA8,w,h);g.framebufferRenderbuffer(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.RENDERBUFFER,msColor);g.bindRenderbuffer(g.RENDERBUFFER,msDepth);g.renderbufferStorageMultisample(g.RENDERBUFFER,samples,g.DEPTH_COMPONENT24,w,h);g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,msDepth);if(g.checkFramebufferStatus(g.FRAMEBUFFER)!==g.FRAMEBUFFER_COMPLETE)throw Error('Multisample framebuffer incomplete');g.bindFramebuffer(g.FRAMEBUFFER,null);return{...t,depth,depthTexture:true,msF,msColor,msDepth};}
 present(){let g=this.gl,p=this.post,t=this.sceneTarget;g.bindFramebuffer(g.READ_FRAMEBUFFER,t.msF);g.bindFramebuffer(g.DRAW_FRAMEBUFFER,t.f);g.blitFramebuffer(0,0,t.w,t.h,0,0,t.w,t.h,g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT,g.NEAREST);g.bindFramebuffer(g.FRAMEBUFFER,null);g.viewport(0,0,this.canvas.width,this.canvas.height);g.disable(g.DEPTH_TEST);g.depthMask(false);g.useProgram(p.p);this.sampler(p,'uSceneColor',0,this.sceneTarget.tex);this.sampler(p,'uSceneDepth',1,this.sceneTarget.depth);this.uniform(p,'uResolution',[this.canvas.width,this.canvas.height]);this.uniform(p,'uInvVP',M.inverse(this.vp));this.uniform(p,'uEye',this.camera.eye);this.uniform(p,'uContact',this.state.contact===false?0:1);g.bindVertexArray(this.emptyVAO);g.drawArrays(g.TRIANGLES,0,3);g.bindVertexArray(null);g.depthMask(true);g.enable(g.DEPTH_TEST);}
 disposeTarget(t){if(!t)return;let g=this.gl;g.deleteFramebuffer(t.f);g.deleteTexture(t.tex);if(t.msF){g.deleteFramebuffer(t.msF);g.deleteRenderbuffer(t.msColor);g.deleteRenderbuffer(t.msDepth)}if(t.depth){if(t.depthTexture)g.deleteTexture(t.depth);else g.deleteRenderbuffer(t.depth)}}
 dispose(){
  if(this.disposed)return;this.disposed=true;const g=this.gl;this.people?.dispose();this.people=null;
  for(const fence of this.frameFences||[])g.deleteSync(fence);this.frameFences=[];
  for(const b of this.buckets.values())for(const p of b.passes?.values()||[])g.deleteVertexArray(p.vao);
  for(const stream of this.instanceStreams?.values()||[])g.deleteBuffer(stream.buffer);this.instanceStreams?.clear();
  for(const m of this.meshResources||[]){g.deleteBuffer(m.vertexBuffer);if(m.indexBuffer)g.deleteBuffer(m.indexBuffer);}
  for(const key of ['pickTarget','reflectTarget','sceneTarget','shadowTarget']){this.disposeTarget(this[key]);this[key]=null;}
  for(const key of ['atlas','materials','dummy'])if(this[key])g.deleteTexture(this[key]);
  for(const key of ['main','glass','shadow','skyProg','particles','post'])if(this[key])g.deleteProgram(this[key].p);
  g.deleteVertexArray(this.emptyVAO);g.deleteVertexArray(this.particleVAO);g.deleteBuffer(this.particleBuffer);
  this.buckets.clear();this.visibilityCaches.clear();this.meshResources=[];this.visibilityScratch=null;
 }
 resize(w,h){if(this.disposed)return;let d=Math.min(window.devicePixelRatio||1,1.5)*this.quality,w1=Math.max(1,Math.round(w*d)),h1=Math.max(1,Math.round(h*d));if(this.sceneTarget&&w1===this.canvas.width&&h1===this.canvas.height)return;this.canvas.width=w1;this.canvas.height=h1;this.disposeTarget(this.pickTarget);this.disposeTarget(this.reflectTarget);this.disposeTarget(this.sceneTarget);this.sceneTarget=this.colorDepthTarget(w1,h1);this.pickTarget=this.target(w1,h1);let rf=Math.min(this.software?512:896,w1*.72)/w1;this.reflectTarget=this.target(Math.round(w1*rf),Math.round(h1*rf));this.aspect=w1/h1;this.shadowDirty=true;}
 add(key,geometry,matrix,color,meta=[0,0,0,0],uv=[0,0,1,1]){let b=this.buckets.get(key);if(!b){b={geometry:{v:new Float32Array(geometry.v)},detailWidth:geometry.detailWidth||0,instances:[]};this.buckets.set(key,b)}if(typeof color==='string')color=M.color(color);b.instances.push(...matrix,...color.slice(0,3),1,...meta,...uv);this.stats.instances++}
 beginPrepared(manifest){
  this.meshResources=manifest.meshes.map(m=>({...m,vertexBuffer:null,indexBuffer:null}));this.buckets=new Map();this.visibilityCaches.clear();
  Object.assign(this.stats,manifest.stats);
  for(const record of manifest.buckets){const resource=this.meshResources[record.mesh];this.buckets.set(record.key,{resource,vertexCount:resource.vertexCount,detailWidth:resource.detailWidth||0,count:record.count,passes:new Map()});}
 }
 preparedVertices(index,vertices){if(this.disposed)throw Error('Scene loading was interrupted');const g=this.gl,m=this.meshResources[index];m.vertexBuffer=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,m.vertexBuffer);g.bufferData(g.ARRAY_BUFFER,vertices,g.STATIC_DRAW);}
 preparedIndices(index,indices){if(this.disposed)throw Error('Scene loading was interrupted');const g=this.gl,m=this.meshResources[index];m.indexBuffer=g.createBuffer();g.bindVertexArray(null);g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,m.indexBuffer);g.bufferData(g.ELEMENT_ARRAY_BUFFER,indices,g.STATIC_DRAW);g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,null);}
 preparedInstances(record,data,spatial){if(this.disposed)throw Error('Scene loading was interrupted');const b=this.buckets.get(record.key);b.data=data;b.spatial=spatial;}
 compileBucket(b){Y.Visibility.compile(b);if(b.materials.has(44)&&(b.uniformMaterial!==44||b.count!==1))throw Error('Clear glass requires one pane per bucket');}
 async finishPrepared(yieldUI){let checkpoint=performance.now();for(const b of this.buckets.values()){
  if(this.disposed)throw Error('Scene loading was interrupted');
  if(!b.resource.vertexBuffer||(b.resource.indexType&&!b.resource.indexBuffer)||!b.data||b.data.length!==b.count*28||b.spatial.length!==b.count*5)throw Error('Incomplete prepared scene bucket');
  this.compileBucket(b);this.prepareRanges(b);if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}
 }this.gl.bindVertexArray(null);this.visibilityCaches.clear();}
 upload(){
  const g=this.gl;this.stats.triangles=0;this.meshResources=[];
  for(const b of this.buckets.values()){
   const resource={vertexCount:b.geometry.v.length/8,indexType:null,vertexBuffer:g.createBuffer(),indexBuffer:null};
   this.meshResources.push(resource);g.bindBuffer(g.ARRAY_BUFFER,resource.vertexBuffer);g.bufferData(g.ARRAY_BUFFER,b.geometry.v,g.STATIC_DRAW);
   b.resource=resource;b.vertexCount=resource.vertexCount;b.count=b.instances.length/28;b.data=new Float32Array(b.instances);b.instances=null;
   b.spatial=Y.Visibility.prepare(b.data,b.geometry);b.geometry=null;b.passes=new Map();this.compileBucket(b);this.stats.triangles+=b.vertexCount/3*b.count;
  }
  g.bindVertexArray(null);this.visibilityCaches.clear();
 }
 instanceStream(pass){
  this.instanceStreams ||= new Map();let stream=this.instanceStreams.get(pass);
  if(!stream){stream={buffer:this.gl.createBuffer(),data:new Float32Array(65536),used:0,capacity:0};this.instanceStreams.set(pass,stream);}
  stream.used=0;return stream;
 }
 instanceCache(bucket,pass,count,stream,visible=bucket.visible){
  const g=this.gl,offset=stream.used,next=offset+count*28;let c=bucket.passes.get(pass);
  if(next>stream.data.length){
   const length=Math.max(next,Math.ceil(stream.data.length*1.25)),buffer=stream.data.buffer;
   // Keep 25% CPU headroom; GPU upload capacity still follows actual peak use.
   // This CPU array belongs only to this stream; VAOs reference the GPU buffer.
   // Transfer releases discarded backing storage immediately, keeping all bytes.
   if(typeof buffer.transfer==='function')stream.data=new Float32Array(buffer.transfer(length*4));
   else{const data=new Float32Array(length);data.set(stream.data.subarray(0,offset));stream.data=data;}
  }
  // A null source means Visibility already gathered this exact prefix into
  // the owned stream. Other callers retain the original copying path.
  if(visible)stream.data.set(visible.subarray(0,count*28),offset);stream.used=next;
  if(!c){
   c={vao:g.createVertexArray(),offset:-1};bucket.passes.set(pass,c);g.bindVertexArray(c.vao);g.bindBuffer(g.ARRAY_BUFFER,bucket.resource.vertexBuffer);
   for(const[a,n,offset]of[[0,3,0],[1,3,12],[2,2,24]]){g.enableVertexAttribArray(a);g.vertexAttribPointer(a,n,g.FLOAT,false,32,offset);}
   if(bucket.resource.indexBuffer)g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,bucket.resource.indexBuffer);
   for(let a=3;a<=9;a++){g.enableVertexAttribArray(a);g.vertexAttribDivisor(a,1);}
  }
  if(c.offset!==offset){g.bindVertexArray(c.vao);g.bindBuffer(g.ARRAY_BUFFER,stream.buffer);for(let a=3;a<=9;a++)g.vertexAttribPointer(a,4,g.FLOAT,false,112,offset*4+(a-3)*16);c.offset=offset;}
  c.count=count;return c;
 }
 uploadInstances(stream){
  if(!stream.used)return;const g=this.gl,bytes=stream.used*4;g.bindBuffer(g.ARRAY_BUFFER,stream.buffer);
  stream.capacity=Math.max(stream.capacity,bytes);g.bufferData(g.ARRAY_BUFFER,stream.capacity,g.DYNAMIC_DRAW);
  g.bufferSubData(g.ARRAY_BUFFER,0,stream.data,0,stream.used);this.stats.instanceUploadBytes+=bytes;
 }

 setAtlas(canvas){let g=this.gl;this.atlas=this.atlas||g.createTexture();g.bindTexture(g.TEXTURE_2D,this.atlas);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,canvas);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);g.generateMipmap(g.TEXTURE_2D);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR_MIPMAP_LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);}
 async loadMaterials(){
 const source=Y.SceneCache46?await Y.SceneCache46.textureSource('materials',Y.MATERIAL_ATLAS):Y.MATERIAL_ATLAS,img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('材质图集无法解码'));img.src=source});
 if(this.disposed)throw Error('Material loading was interrupted');
 // Independent mip chains remove atlas-edge grids and cross-material colour bleeding.
 const g=this.gl,N=img.width/4,canvas=document.createElement('canvas');canvas.width=canvas.height=N;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});this.materials=g.createTexture();g.bindTexture(g.TEXTURE_2D_ARRAY,this.materials);
 g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);g.texImage3D(g.TEXTURE_2D_ARRAY,0,g.RGBA8,N,N,16,0,g.RGBA,g.UNSIGNED_BYTE,null);
 for(let layer=0;layer<16;layer++){ctx.setTransform(1,0,0,-1,0,N);ctx.clearRect(0,0,N,N);ctx.drawImage(img,(layer%4)*N,Math.floor(layer/4)*N,N,N,0,0,N,N);g.texSubImage3D(g.TEXTURE_2D_ARRAY,0,0,0,layer,N,N,1,g.RGBA,g.UNSIGNED_BYTE,canvas);}
 g.generateMipmap(g.TEXTURE_2D_ARRAY);g.texParameteri(g.TEXTURE_2D_ARRAY,g.TEXTURE_MIN_FILTER,g.LINEAR_MIPMAP_LINEAR);g.texParameteri(g.TEXTURE_2D_ARRAY,g.TEXTURE_MAG_FILTER,g.LINEAR);
 g.texParameteri(g.TEXTURE_2D_ARRAY,g.TEXTURE_WRAP_S,g.REPEAT);g.texParameteri(g.TEXTURE_2D_ARRAY,g.TEXTURE_WRAP_T,g.REPEAT);
 let ext=g.getExtension('EXT_texture_filter_anisotropic');if(ext)g.texParameterf(g.TEXTURE_2D_ARRAY,ext.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,g.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
 }

 stateUniforms(p,vp,eye,pass){let g=this.gl;g.useProgram(p.p);const s=this.state;let vals={uVP:vp,uLightVP:this.lightVP,uReflectionVP:this.refVP,uTime:s.time,uEye:eye,uSun:this.sun,uSky:this.skyColor,uDay:this.day,uSeason:s.season,uWeather:s.weather,uSelected:s.selected,uIsolate:s.isolate,uExplode:s.explode,uFog:this.fog,uWaterLevel:this.waterLevel||.5,uPass:pass,uSelection:s.selection||[0,0,0,0]};for(let [k,v]of Object.entries(vals))this.uniform(p,k,v)}
 prepareRanges(b){
  // Only static single-instance meshes qualify; moving vegetation remains unchanged.
  if(b.count!==1||!b.resource.ranges||b.data[22]!==0)return;
  const m=b.data;if(m[3]||m[7]||m[11]||m[15]!==1)return;
  b.worldRanges=b.resource.ranges.map(r=>{const c=[(r[2]+r[5])/2,(r[3]+r[6])/2,(r[4]+r[7])/2],e=[(r[5]-r[2])/2,(r[6]-r[3])/2,(r[7]-r[4])/2],out=[r[0],r[1]];
   for(let k=0;k<3;k++)out.push(m[k]*c[0]+m[4+k]*c[1]+m[8+k]*c[2]+m[12+k]);
   for(let k=0;k<3;k++)out.push(Math.abs(m[k])*e[0]+Math.abs(m[4+k])*e[1]+Math.abs(m[8+k])*e[2]+.05);
   return out;
  });
 }
 visibleRanges(b,planes,slot){
  if(!b.worldRanges||this.state.meshCulling===false)return null;
  const out=[],lift=b.data[21]===this.state.selected?this.state.explode*b.data[23]:0,clip=slot===2?.48:slot===3?this.waterLevel-.025:-Infinity;
  for(const r of b.worldRanges){const x=r[2],y=r[3]+lift,z=r[4];if(y+r[6]<clip)continue;
   let visible=true;for(const p of planes)if(p[0]*x+p[1]*y+p[2]*z+p[3]+Math.abs(p[0])*r[5]+Math.abs(p[1])*r[6]+Math.abs(p[2])*r[7]<0){visible=false;break;}
   if(!visible)continue;const last=out[out.length-1];if(last&&last[0]+last[1]===r[0])last[1]+=r[1];else out.push([r[0],r[1]]);
  }return out;
 }
 // Merge only adjacent, opaque, full-mesh draws with byte-contiguous instances.
 // Keep original visibility records intact for inspection and later cache rebuilds.
 groupDraws(items,clearStart){
  const drawItems=[];let drawClearStart=0;
  for(let i=0;i<items.length;i++){
   const item=items[i],last=drawItems[drawItems.length-1];
   if(i<clearStart&&last&&!last.ranges&&!item.ranges&&last.b.resource===item.b.resource&&last.b.vertexCount===item.b.vertexCount&&last.record.offset+last.record.count*28===item.record.offset){
    const combined=last===items[i-1]?{...last,record:{...last.record}}:last;
    combined.record.count+=item.record.count;drawItems[drawItems.length-1]=combined;
   }else drawItems.push(item);
   if(i+1===clearStart)drawClearStart=drawItems.length;
  }
  return{drawItems,drawClearStart};
 }
 visibleScene(vp,slot){
  const state=this.state,hidden=state.inspectionMask?.objectId===state.isolate?state.inspectionMask.buckets:null;
  const lodEye=this.camera.eye,focal=this.canvas.clientHeight/(2*Math.tan((this.camera.fov||.80)/2));
  const key=[...vp,...lodEye,focal,state.selected,state.isolate,state.explode,state.detailLOD!==false,state.vegetation!==false,state.meshCulling!==false,this.waterLevel,[...(state.routeEdges||[])].join('/'),hidden?[...hidden].join('/'):null].join(',');
  let cached=this.visibilityCaches.get(slot);
  if(!cached||cached.key!==key){
   const planes=M.frustum(vp),items=[],clear=[],stream=this.instanceStream(slot);let submitted=0,triangles=0,culled=0;
   for(const[name,b]of this.buckets){
    if(hidden?.has(name)||(slot===2&&(b.uniformMaterial===4||b.uniformMaterial===8||b.uniformMaterial===44))||(slot===3&&b.uniformMaterial===4))continue;const result=Y.Visibility.select(b,planes,lodEye,focal,state,stream,true,true);culled+=result.culled;if(!result.count)continue;
    const ranges=this.visibleRanges(b,planes,slot);if(ranges&&!ranges.length)continue;
    const record=this.instanceCache(b,slot,result.count,stream,null),item={b,record,ranges};
    if(b.uniformMaterial===44){
     // One pane per bucket, sorted only when the visibility cache changes.
     const x=b.spatial[0],y=b.spatial[1]+(b.data[21]===state.selected?(state.explode||0)*b.data[23]:0),z=b.spatial[2];
     item.depth=(vp[2]*x+vp[6]*y+vp[10]*z+vp[14])/(vp[3]*x+vp[7]*y+vp[11]*z+vp[15]);clear.push(item);
    }else items.push(item);
    submitted+=result.count;triangles+=(ranges?ranges.reduce((s,r)=>s+r[1],0):b.vertexCount)/3*result.count;
   }
   const clearStart=items.length;clear.sort((a,b)=>b.depth-a.depth);items.push(...clear);
   this.uploadInstances(stream);cached={key,items,clearStart,...this.groupDraws(items,clearStart),submitted,triangles:Math.round(triangles),culled,hasWater:items.some(({b})=>b.materials.has(4))};this.visibilityCaches.set(slot,cached);this.stats.visibilityBuilds++;
  }
  return cached;
 }
 draw(p,vp,eye,pass){
  const g=this.gl;this.stateUniforms(p,vp,eye,pass);
  if(p===this.main){this.sampler(p,'uShadowMap',0,this.shadowTarget.tex);this.sampler(p,'uReflectionMap',1,pass===3?this.dummy:this.reflectTarget.tex);this.sampler(p,'uAtlas',2,this.atlas||this.dummy);this.sampler(p,'uMaterials',3,this.materials||this.dummy);}
  const cached=this.visibleScene(vp,pass===1?0:pass);
  let calls=0,blending=false,index=0;try{for(const{b,record,ranges}of cached.drawItems){
   if(index===cached.drawClearStart&&(pass===0||pass===3))this.people?.draw(vp,eye,pass);
   if(index++===cached.drawClearStart&&(pass===0||pass===3)){
    const glass=this.glass;this.stateUniforms(glass,vp,eye,pass);
    this.sampler(glass,'uShadowMap',0,this.shadowTarget.tex);this.sampler(glass,'uReflectionMap',1,pass===3?this.dummy:this.reflectTarget.tex);this.sampler(glass,'uAtlas',2,this.atlas||this.dummy);this.sampler(glass,'uMaterials',3,this.materials||this.dummy);
    g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.depthMask(false);blending=true;
   }
   g.bindVertexArray(record.vao);
   if(ranges){for(const[first,count]of ranges){if(b.resource.indexBuffer)g.drawElementsInstanced(g.TRIANGLES,count,b.resource.indexType==='uint16'?g.UNSIGNED_SHORT:g.UNSIGNED_INT,first*(b.resource.indexType==='uint16'?2:4),record.count);else g.drawArraysInstanced(g.TRIANGLES,first,count,record.count);calls++;}}
   else{if(b.resource.indexBuffer)g.drawElementsInstanced(g.TRIANGLES,b.vertexCount,b.resource.indexType==='uint16'?g.UNSIGNED_SHORT:g.UNSIGNED_INT,0,record.count);else g.drawArraysInstanced(g.TRIANGLES,0,b.vertexCount,record.count);calls++;}
  }if(cached.drawClearStart===cached.drawItems.length&&(pass===0||pass===3))this.people?.draw(vp,eye,pass);
  }finally{if(blending){g.depthMask(true);g.disable(g.BLEND);}g.bindVertexArray(null);}
  if(pass===0){const people=this.people?.active&&this.people.mask?this.people.metrics:null;Object.assign(this.stats,{drawnInstances:cached.submitted+(people?.instances||0),drawnTriangles:cached.triangles+(people?.triangles||0),detailCulled:cached.culled,drawCalls:calls+(people?.mainCalls||0)+(people?.shadowCalls||0),people});}
 }

 sky(vp,eye){let g=this.gl,p=this.skyProg;g.useProgram(p.p);g.disable(g.DEPTH_TEST);g.depthMask(false);let o={uInvVP:M.inverse(vp),uEye:eye,uSun:this.sun,uSky:this.skyColor,uDay:this.day,uTime:this.state.time,uIsolate:this.state.isolate,uWeather:this.state.weather};for(let[k,v]of Object.entries(o))this.uniform(p,k,v);g.bindVertexArray(this.emptyVAO);g.drawArrays(g.TRIANGLES,0,3);g.bindVertexArray(null);g.enable(g.DEPTH_TEST);g.depthMask(true)}
 frameAvailable(){
  const g=this.gl,q=this.frameFences||(this.frameFences=[]);
  while(q.length){const status=g.clientWaitSync(q[0],0,0);if(status===g.TIMEOUT_EXPIRED)break;g.deleteSync(q.shift());}
  // Bound GPU work in flight so buffer uploads never wait on an ever-growing queue.
  return q.length<2;
 }
 render(camera,state){this.state=state;this.camera=camera;let g=this.gl;this.day=M.clamp(Math.sin((state.hour-5.5)/14*Math.PI)*1.22,0,1);let angle=(state.hour-6)/12*Math.PI;this.sun=M.norm([Math.cos(angle),Math.max(.23,Math.sin(angle)),.30]);this.skyColor=M.lerp([.045,.075,.12],[.79,.84,.87],this.day);if(state.weather===1||state.weather===2)this.skyColor=M.lerp(this.skyColor,[.55,.62,.64],.4);this.fog=Y.Atmosphere.fog(state,camera);
 let proj=M.perspective(camera.fov||.80,this.aspect,M.clamp(Math.hypot(...M.sub(camera.eye,camera.target))*.012,.15,18),Math.max(6500,Math.hypot(...M.sub(camera.eye,camera.target))*2.3));proj[8]=camera.offsetX||0;proj[9]=-(camera.offsetY||0);let view=M.lookAt(camera.eye,camera.target,camera.up||[0,1,0]);this.vp=M.multiply(proj,view);let radius=M.clamp(Math.hypot(...M.sub(camera.eye,camera.target))*.73,95,1550),tc=[camera.target[0],0,camera.target[2]];if(!this.shadowCenter||Math.hypot(tc[0]-this.shadowCenter[0],tc[2]-this.shadowCenter[2])>4||Math.abs(radius-(this.shadowRadius||0))>3){this.shadowDirty=true;this.shadowCenter=tc;this.shadowRadius=radius}const L=this.shadowCenter;this.lightVP=M.multiply(M.ortho(-this.shadowRadius,this.shadowRadius,-this.shadowRadius,this.shadowRadius,10,5100),M.lookAt(M.add(L,M.mul(this.sun,2300)),L));let hallCenter=Y.DATA.toWorld([577,474]),nearHall=Math.hypot(camera.target[0]-hallCenter[0],camera.target[2]-hallCenter[1])<150;this.waterLevel=nearHall?1.0725+(Y.Terrain20?Y.Terrain20.objectElevation(Y.DATA.places.find(p=>p.id===21)):0)+(state.isolate===21?state.explode*.05:0):.5;let refEye=[camera.eye[0],this.waterLevel*2-camera.eye[1],camera.eye[2]],refTarget=[camera.target[0],this.waterLevel*2-camera.target[1],camera.target[2]];let nextRefVP=M.multiply(proj,M.lookAt(refEye,refTarget,[0,-1,0]));if(!this.refVP)this.refVP=nextRefVP;g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.disable(g.CULL_FACE);g.disable(g.BLEND);
 this.people?.prepare(this.vp,nextRefVP,this.state);
 if(this.shadowDirty){g.bindFramebuffer(g.FRAMEBUFFER,this.shadowTarget.f);g.viewport(0,0,this.shadowSize,this.shadowSize);g.clear(g.DEPTH_BUFFER_BIT);this.draw(this.shadow,this.lightVP,camera.eye,2);this.shadowDirty=false}
 let cameraRange=Math.hypot(...M.sub(camera.eye,camera.target)),lakeCenter=Y.DATA.toWorld([547,238]),nearLake=Math.hypot(camera.target[0]-lakeCenter[0],camera.target[2]-lakeCenter[1])<330;
 let reflectKey=[...camera.eye,...camera.target,camera.offsetX||0,camera.offsetY||0,this.waterLevel,state.isolate,this.canvas.width,this.canvas.height,state.hour,state.season,state.weather,state.explode].join(",");if(this.visibleScene(this.vp,0).hasWater&&(!state.isolate||state.isolate===21)&&(reflectKey!==this.lastReflectKey||this.frame++%3===0||this.lastReflection<0)){this.lastReflectKey=reflectKey;this.refVP=nextRefVP;let t=this.reflectTarget;g.bindFramebuffer(g.FRAMEBUFFER,t.f);g.viewport(0,0,t.w,t.h);g.clear(g.DEPTH_BUFFER_BIT);this.sky(this.refVP,refEye);this.draw(this.main,this.refVP,refEye,3);this.lastReflection=state.time}
 g.bindFramebuffer(g.FRAMEBUFFER,this.sceneTarget.msF);g.viewport(0,0,this.canvas.width,this.canvas.height);g.clear(g.DEPTH_BUFFER_BIT);this.sky(this.vp,camera.eye);this.draw(this.main,this.vp,camera.eye,0);
 if((state.weather===1||state.weather===3)&&!state.isolate){let p=this.particles;g.useProgram(p.p);this.uniform(p,'uVP',this.vp);this.uniform(p,'uEye',camera.eye);this.uniform(p,'uTime',state.time);this.uniform(p,'uWeather',state.weather);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);g.depthMask(false);g.bindVertexArray(this.particleVAO);g.drawArrays(state.weather===3?g.POINTS:g.LINES,0,this.particleCount);g.bindVertexArray(null);g.depthMask(true);g.disable(g.BLEND)}
 this.present();
 this.frameAvailable();this.frameFences.push(g.fenceSync(g.SYNC_GPU_COMMANDS_COMPLETE,0));g.flush();
 }
 pick(x,y){
  const g=this.gl,t=this.pickTarget,rect=this.canvas.getBoundingClientRect(),px=M.clamp(Math.floor(x/rect.width*t.w),0,t.w-1),py=M.clamp(t.h-1-Math.floor(y/rect.height*t.h),0,t.h-1),pixel=new Uint8Array(4);
  g.bindFramebuffer(g.FRAMEBUFFER,t.f);g.viewport(0,0,t.w,t.h);g.disable(g.BLEND);g.enable(g.SCISSOR_TEST);g.scissor(px,py,1,1);
  try{g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);this.draw(this.main,this.vp,this.camera.eye,1);g.readPixels(px,py,1,1,g.RGBA,g.UNSIGNED_BYTE,pixel);}
  finally{g.disable(g.SCISSOR_TEST);g.bindFramebuffer(g.FRAMEBUFFER,null);}
  return pixel[0]+pixel[1]*256+pixel[2]*65536;
 }

 project(p){let q=M.apply(this.vp,[...p,1]);return{x:(q[0]/q[3]+1)*.5*this.canvas.clientWidth,y:(1-q[1]/q[3])*.5*this.canvas.clientHeight,visible:q[3]>0&&q[2]/q[3]<1}}
}
Y.Engine=Engine;
})(YY);
