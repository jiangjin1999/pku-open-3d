/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v8: Yannan heritage district. Original geometric reconstruction from numbered
   reference photographs and official typology descriptions, NOT a survey mesh.
   Geometry stays inside inherited schematic parcels; unknown facades are marked. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
const H={brick:'#a4a49b',darkBrick:'#858b82',stone:'#b3b4a9',wood:'#683b32',trim:'#9b5848',roof:'#666c64',green:'#466554',glass:'#5f716e',door:'#303a40'};
P.heritageBox=function(key,x,y,z,w,h,d,color,mat=18,part=.6){this.mesh(key,this.geo(key,G.box),x,y,z,w,h,d,color,mat,part);};
P.heritagePlaque=function(text,x,y,z,w=.36,h=.36,r=0,round=false){
 const key='historic-plaque-'+text+'-'+round;let uv=this.signs.get(key);
 if(!uv){let k=this.nSigns++,px=k%8*512,py=Math.floor(k/8)*128,ctx=this.ctx;ctx.clearRect(px,py,512,128);ctx.save();ctx.translate(px+256,py+64);ctx.fillStyle=round?'#8d3f3d':'#283c40';ctx.strokeStyle=round?'#bf8a7b':'#a1aaa4';ctx.lineWidth=2;
 if(round){ctx.beginPath();ctx.ellipse(0,0,58,59,0,0,Math.PI*2);ctx.fill();ctx.stroke()}else{ctx.fillRect(-90,-55,180,110);ctx.strokeRect(-88,-53,176,106)}
 ctx.fillStyle='#e2e3d6';ctx.font='600 72px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,0,4);ctx.restore();uv=[px/4096,1-(py+128)/4096,512/4096,128/4096];this.signs.set(key,uv)}
 // Atlas tiles are 4:1. Crop circular plaques without squeezing the number.
 let use=round?[uv[0]+uv[2]*(192/512),uv[1],uv[2]*128/512,uv[3]]:[uv[0]+uv[2]*(160/512),uv[1],uv[2]*192/512,uv[3]];
 this.mesh('plane',this.geo('plane',G.plane),x,y,z,w,h,1,'#ffffff',8,.95,r,use);
};
P.heritageWindow=function(x,y,z,w,h,r=0,arched=false,wood=H.wood){const muntin=wood===H.wood?H.trim:wood;this.local(x,y,z,r,()=>{
 this.box(0,0,-.028,w+.15,h+.15,.11,'#454840',18,.7);
 this.box(0,0,.034,w-.12,h-.12,.035,H.glass,5,.75);
 for(let s of[-1,1]){this.box(s*(w/2-.05),0,.10,.10,h,.12,wood,20,.9);this.box(0,s*(h/2-.05),.10,w,.10,.12,wood,20,.9)}
 this.box(0,0,.12,.045,h-.15,.10,muntin,20,.95);
 this.box(0,h*.16,.13,w-.15,.047,.10,muntin,20,.95);
 for(let s of[-1,1])this.box(s*w*.247,-h*.19,.13,.031,h*.58,.09,muntin,20,.95);
 this.box(0,-h/2-.10,.045,w+.27,.13,.29,H.stone,10,.92);
 this.box(0,h/2+.10,-.06,w+.25,.14,.13,'#b0afa3',18,.7);
 if(arched){const k='heritage-window-lintel';let g=this.geo(k,()=>{let q=new G.Geometry();for(let i=0;i<16;i++){let a=Math.PI*i/16,b=Math.PI*(i+1)/16;const pt=(t,R)=>[Math.cos(t)*R,Math.sin(t)*R*.35,0];q.quad(pt(a,.50),pt(b,.50),pt(b,.61),pt(a,.61))}return q});this.mesh(k,g,0,h/2-.02,.09,w,1,1,'#b7b3a6',18,.82)}
 });};
P.heritageDoor=function(x,y,z,w=1.3,h=2.5,r=0,color=H.wood){this.local(x,y,z,r,()=>{
 this.box(0,h/2,0,w+.17,h+.18,.22,'#4a4e46',18,.7);
 const dark=color===H.door,panelColor=dark?'#253039':'#56352f',frameColor=dark?'#344149':H.trim;
 for(let s of[-1,1]){this.box(s*w*.252,h/2,.10,w*.485,h,.09,color,20,.9);
 for(let yy of[h*.20,h*.56,h*.83]){this.box(s*w*.25,yy,.16,w*.37,h*.22,.02,panelColor,20,.9);for(let side of[-1,1])this.box(s*w*.25+side*w*.19,yy,.181,.022,h*.24,.025,frameColor,20,.92)}
 this.mesh('torus',this.geo('torus',()=>G.torus(24,8)),s*w*.11,h*.51,.24,.067,.090,.025,'#a39c73',9,.98);}
 this.box(0,-.045,.1,w+.4,.16,.47,H.stone,10,.2);
 });};
/* Spandrel geometry surrounds the void; it is not a painted dark arch on a wall. */
P.heritageArch=function(x,spring,z,gap,rise,depth=.46,part=.7){
 const key='heritage-arch-spandrel',g=this.geo(key,()=>{let a=new G.Geometry();for(let i=0;i<32;i++){let t=i/32*Math.PI,u=(i+1)/32*Math.PI,A=[-.5*Math.cos(t),Math.sin(t)],B=[-.5*Math.cos(u),Math.sin(u)];
 for(let s of[-1,1]){let z=s*.5;a.quad([A[0],A[1],z],[B[0],B[1],z],[B[0],1.23,z],[A[0],1.23,z]);}
 a.quad([A[0],A[1],-.5],[A[0],A[1],.5],[B[0],B[1],.5],[B[0],B[1],-.5]);
 }a.quad([-.5,1.23,-.5],[.5,1.23,-.5],[.5,1.23,.5],[-.5,1.23,.5]);return a});
 this.mesh(key,g,x,spring,z,gap,rise,depth,H.brick,18,part);
 const key2='heritage-arch-voussoirs',ring=this.geo(key2,()=>{let a=new G.Geometry();for(let i=0;i<21;i++){let t=(i+.035)/21*Math.PI,u=(i+.965)/21*Math.PI;let f=(a,r,z)=>[-.5*Math.cos(a)*r,Math.sin(a)*r,z];a.quad(f(t,1,.5),f(u,1,.5),f(u,1.16,.5),f(t,1.16,.5));a.quad(f(t,1,-.5),f(u,1,-.5),f(u,1.16,-.5),f(t,1.16,-.5));}return a});
 this.mesh(key2,ring,x,spring,z,gap,rise,depth+.024,'#b7b7ac',18,part+.05);
};
P.heritageRoof=function(x,y,z,w,d,h,kind='gable',col=H.roof,detailed=false,part=2.0){this.local(x,y,z,0,()=>{
 const hip=kind==='hip',key='heritage-roof-'+kind;
 let g=this.geo(key,()=>{let q=new G.Geometry();if(!hip){q.quad([-.5,0,.5],[.5,0,.5],[.5,1,0],[-.5,1,0]);q.quad([.5,0,-.5],[-.5,0,-.5],[-.5,1,0],[.5,1,0]);}
 else{q.quad([-.5,0,.5],[.5,0,.5],[.26,1,0],[-.26,1,0]);q.quad([.5,0,-.5],[-.5,0,-.5],[-.26,1,0],[.26,1,0]);q.tri([-.5,0,-.5],[-.5,0,.5],[-.26,1,0]);q.tri([.5,0,.5],[.5,0,-.5],[.26,1,0]);}return q});
 this.mesh(key,g,0,0,0,w,h,d,col,19,part);
 this.box(0,-.08,0,w,.15,d,'#4e5148',20,part-.1);
 if(!hip){let ge=this.geo('heritage-gable-wall',()=>new G.Geometry().tri([0,0,-.5],[0,1,0],[0,0,.5]));for(let s of[-1,1])this.mesh('heritage-gable-wall',ge,s*(w/2-.53),-.09,0,1,h,d-1.0,H.brick,18,part-.15);}
 let rr=w*(hip?.52:1);this.beam([-rr/2,h+.03,0],[rr/2,h+.03,0],.105,col,19,part+.1);
 for(let s of[-1,1]){
 this.box(0,-.19,s*d/2,w,.18,.11,'#596253',20,part-.15);
 for(let a=-w/2+.2;a<w/2-.1;a+=.48)this.box(a,-.11,s*(d/2-.15),.085,.11,.64,'#81634f',20,part-.17);
 }
 if(detailed){const tile=this.geo('heritage-eave-tile',()=>{let q=new G.Geometry();for(let i=0;i<8;i++){let a=Math.PI*i/8,b=Math.PI*(i+1)/8;let A=[Math.cos(a)*.5,Math.sin(a)],B=[Math.cos(b)*.5,Math.sin(b)];q.quad([A[0],A[1],-.5],[B[0],B[1],-.5],[B[0],B[1],.5],[A[0],A[1],.5]);}return q});
 for(let s of[-1,1])for(let a=-w/2+.15;a<w/2-.10;a+=.245)for(let row=0;row<2;row++){let zz=s*(d/2-.15-row*.28),yy=(.15+row*.28)*h/(d/2);this.mesh('heritage-eave-tile',tile,a,yy,zz,.18,.055,.35,col,19,part+.06);}
 }
 });};
P.heritageDrain=function(x,y,z,h,r=0){this.local(x,y,z,r,()=>{this.cyl(0,0,0,.055,h,H.green,12,1,9,.8);for(let yy=.7;yy<h;yy+=1.5)this.box(0,yy,-.03,.17,.055,.18,H.green,9,.8);this.beam([0,.03,0],[.16,.03,.17],.055,H.green,9,.8);});};
P.heritageFloor=function(w,d){this.solid(0,0,w+.15,d+.15);this.box(0,.23,0,w+.35,.46,d+.35,'#8f9387',10,.12);};
P.heritageSmallHouse=function(x,z,w,d,h,n=1,options={}){this.local(x,0,z,options.r||0,()=>{
 this.heritageFloor(w,d);this.box(0,.46+h/2,0,w,h,d,H.brick,18,.6);
 let bays=options.bays||Math.max(2,Math.round(w/3.3));
 for(let side of[-1,1])for(let f=0;f<n;f++)for(let j=0;j<bays;j++){let xx=-w*.40+(j+.5)*w*.8/bays;
 this.heritageWindow(xx,2.0+f*(h/n),side*(d/2+.022),Math.min(1.37,w/bays*.53),n===1?1.80:1.95,side<0?Math.PI:0,!!options.arched)}
 for(let side of[-1,1])for(let f=0;f<n;f++)for(let j of[-.26,.26])this.heritageWindow(side*(w/2+.03),2.0+f*h/n,j*d,1.25,1.8,side*Math.PI/2,!!options.arched);
 if(options.door!==false)this.heritageDoor(options.doorX||0,.45,d/2+.03,1.32,2.5);
 if(n>1)this.box(0,h/n+.46,0,w+.18,.15,d+.18,'#a6a699',18,1.0);
 if(options.roofTurn)this.local(0,0,0,Math.PI/2,()=>this.heritageRoof(0,h+.46,0,d+1.05,w+1.05,options.rise||2.15,options.roof||'gable',options.roofColor||H.roof,!!options.detailed));
 else this.heritageRoof(0,h+.46,0,w+1.05,d+1.05,options.rise||2.15,options.roof||'gable',options.roofColor||H.roof,!!options.detailed);
 for(let s of[-1,1])this.heritageDrain(s*(w/2+.075),.5,d/2+.12,h);
 });};
P.heritageDormer=function(x,y,z,w=1.5,h=1.2,d=1.3){this.local(x,y,z,0,()=>{this.box(0,h/2,0,w,h,d,H.brick,18,2.3);this.heritageWindow(0,h*.47,d/2+.03,w*.64,h*.75,0,false);this.box(0,h+.04,0,w+.32,.14,d+.3,H.wood,20,2.5)});};
P.heritage66=function(p,w,d){const n=p.houseNumber,h=7.8,ground=3.75,porch=2.6,front=d/2;
 this.heritageFloor(w,d);
 // Rear ground-floor rooms stop behind the open loggia.
 this.box(0,.46+ground/2,-porch/2,w,ground,d-porch,H.brick,18,.6);
 this.box(0,.46+ground+(h-ground)/2,0,w,h-ground,d,H.brick,18,1.15);
 this.box(0,ground+.44,0,w+.16,.20,d+.16,'#92978c',18,1.10);
 const col=.49,span=(w-col)/3,gap=span-col;
 for(let k=0;k<4;k++)this.box(-w/2+col/2+k*span,.46+ground/2,front-.21,col,ground,.47,H.brick,18,.65);
 for(let k=0;k<3;k++)this.heritageArch(-w/2+col+gap/2+k*span,2.47,front-.21,gap,.88,.47,.65);
 // A continuous brick spandrel closes the band above the curved openings.
 this.heritageBox('heritage-arcade-header',0,3.88,front-.21,w,.70,.47,H.brick,18,.70);
 // Return opening at the right-hand end of the same loggia, not a fake recess.
 this.local(w/2-.21,0,front-porch/2,Math.PI/2,()=>{this.heritageArch(0,2.46,0,porch-.5,.78,.43,.65);this.heritageBox('heritage-arcade-header',0,3.80,0,porch-.4,.87,.43,H.brick,18,.7);});
 this.box(-w/2+.2,2.20,front-porch/2,.40,3.45,porch-.45,H.brick,18,.65);
 this.heritageDoor(w*.28,.47,front-porch+.055,1.42,2.55);
 for(let x of[-w*.30,0])this.heritageWindow(x,2.11,front-porch+.06,1.45,1.92);
 for(let side of[-1,1]){
 for(let xx of[-.34,-.12,.12,.34])this.heritageWindow(xx*w,6.22,side*(d/2+.035),1.00,2.07,side<0?Math.PI:0);
 for(let zz of[-.30,0,.28]){this.heritageWindow(side*(w/2+.035),6.22,zz*d,zz===.28?1.70:1.06,2.07,side*Math.PI/2);if(zz<.1)this.heritageWindow(side*(w/2+.035),2.12,zz*d,1.45,1.98,side*Math.PI/2)}
 this.heritageDrain(side*(w/2+.09),.30,front+.04,7.80);
 }
 // Brick relieving lintels / shallow cornice, not white modern floor slabs.
 this.box(0,7.98,0,w+.22,.18,d+.22,'#91988c',18,1.32);
 this.heritageRoof(0,8.14,0,w+1.35,d+1.35,2.05,'hip','#77756b',true);
 for(let side of[-1,1]){this.box(0,7.99,side*(d+1.35)/2,w+1.35,.14,.12,H.green,20,2);this.box(side*(w+1.35)/2,7.99,0,.12,.14,d+1.35,H.green,20,2);}
 this.heritageDormer(0,9.80,.28,2.18,1.3,1.65);
 this.heritagePlaque(String(n),-.9,6.30,front+.052,.47,.47,0,true);
 this.steps(w*.30,front+1.24,2.80,4,.46);
 this.noPlant(0,front+1,w+6,10);
};
P.heritage53=function(p,w,d){let h=7.5;this.heritageSmallHouse(0,0,w,d,h,2,{door:false,detailed:true,arched:true,rise:2.70});
 // Entry portico/balcony: three masonry sides and a recessed wooden door.
 const ex=w*.24,ez=d/2+1.0,pw=3.5,pd=2.25;
 this.box(ex,.35,ez,pw+.4,.7,pd+.2,H.stone,10,.2);
 for(let s of[-1,1])this.box(ex+s*(pw/2-.23),1.91,ez,.46,3.10,pd,H.brick,18,.65);
 this.box(ex,3.58,ez,pw+.18,.20,pd+.15,H.stone,10,1.2);
 this.box(ex,4.06,ez+pd/2-.10,pw,.76,.28,H.brick,18,1.25);
 for(let s of[-1,1])this.box(ex+s*(pw/2-.11),4.06,ez,.24,.76,pd,H.brick,18,1.25);
 this.heritageDoor(ex,.70,d/2+.03,1.46,2.58);this.heritagePlaque('53',ex+pw/2+.16,2.55,ez+pd/2+.04,.38,.29);
 this.steps(ex,ez+pd/2+1.4,2.30,4,.66);
 for(let s of[-1,1])this.beam([ex+s*1.2,1.50,ez+pd/2],[ex+s*1.2,.88,ez+pd/2+1.8],.027,'#7b7c70',9,.45);
 for(let xx of[-.29,0,.29])this.heritageDormer(xx*w,8.92,d*.29,1.30,1.25,1.55);
 this.noPlant(ex,ez+3,pw+4,9);
};
P.heritageScreen=function(length,height=1.85){
 // Cross-shaped holes arise from omitted masonry, so view rays go through them.
 this.box(0,.20,0,length,.40,.29,H.darkBrick,18,.2);
 const cols=Math.floor(length/.08),rows=30,dx=length/cols,dy=(height-.47)/rows;
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const cx=col%6,cy=row%6,omit=((cx===2||cx===3)&&(cy>=1&&cy<=4))||((cy===2||cy===3)&&(cx>=1&&cx<=4));if(omit)continue;
 this.heritageBox('heritage-screen-brick',-length/2+(col+.5)*dx,.40+(row+.5)*dy,0,dx-.006,dy-.006,.27,(col+row)%5===0?'#9a9d91':H.brick,22,.25);
 }this.box(0,height+.03,0,length+.07,.15,.37,'#81897c',18,.35);
};
P.heritageGate=function(p,gateZ){let gap=1.64,outer=2.7;
 for(let s of[-1,1])this.box(s*(gap/2+.25),1.60,gateZ,.50,3.20,.72,H.brick,18,.6);
 this.box(0,3.12,gateZ,outer,.36,.72,H.brick,18,.8);
 this.heritageDoor(0,.13,gateZ+.02,gap,2.63,0,H.door);this.box(0,2.83,gateZ+.11,gap,.16,.15,H.door,20,.9);
 this.heritageRoof(0,3.46,gateZ,3.24,1.81,.65,'gable','#697265',true,2.10);
 this.box(0,2.95,gateZ+.45,2.18,.39,.07,'#a8793f',20,1);
 if(p.houseNumber===57)this.lettering('居故兰友冯',0,2.96,gateZ+.50,1.97,.26,0,'#222d26');
 else this.lettering('燕南园',0,2.96,gateZ+.50,1.18,.24,0,'#343b2d');
 this.heritagePlaque(String(p.houseNumber),1.08,2.05,gateZ+.40,.35,.28);
 for(let s of[-1,1]){this.box(s*.83,.22,gateZ+.30,.28,.42,.38,'#a4ac9e',10,.4);this.sphere(s*.83,.55,gateZ+.33,.125,.14,.12,'#a7ada0',10,.4,true)}
 this.box(0,.08,gateZ+.82,2.85,.15,.95,H.stone,10,.1);
};
P.heritageCourt=function(p,w,d){let f=p.heritageModel.form,hand=p.heritageModel.hand||1;
 const rearD=d*.36,rearZ=-d/2+rearD/2,hh=3.35,wingW=w*.29,wingD=d*.49;
 if(f==='screen-court'){
 this.heritageSmallHouse(0,rearZ,w*.84,rearD,hh,1,{doorX:-w*.12,bays:4,rise:1.7,detailed:true});
 this.heritageSmallHouse(-hand*(w*.5-wingW/2),d*.01,wingW,wingD,3.15,1,{door:false,rise:1.75,detailed:true,roofTurn:true,r:0});
 for(let s of[-1,1]){let len=(w-2.72)/2;this.local(s*(1.36+len/2),0,d/2,0,()=>this.heritageScreen(len));}
 this.heritageGate(p,d/2);
 for(let s of[-1,1])this.box(s*w/2,1.02,d*.06,.27,2.04,d*.87,H.brick,18,.25);
 this.box(hand*w*.16,.12,d*.09,w*.5,.13,d*.43,'#778a63',0,.1);
 this.box(0,.13,d*.25,1.4,.10,d*.51,'#aea997',21,.1);
 if(p.houseNumber===57){for(let [xx,zz,hh2]of[[-.29,-.02,8.1],[.29,-.05,9.0],[.23,.24,7.6]])this.heritagePine(xx*w,zz*d,hh2);}
 }else{
 this.heritageSmallHouse(0,rearZ,w,rearD,hh,1,{bays:f==='five-bay-hip'?5:4,rise:1.80,roof:f==='five-bay-hip'?'hip':'gable',detailed:p.houseNumber===55});
 if(f!=='five-bay-hip')this.heritageSmallHouse(hand*(w/2-wingW/2),d*.02,wingW,wingD,hh,1,{door:false,rise:1.74,detailed:p.houseNumber===55,roofTurn:true});
 if(f==='u-court')this.heritageSmallHouse(-hand*(w/2-wingW/2),d*.02,wingW,wingD,hh*.91,1,{door:false,rise:1.55,roofTurn:true});
 // Exposed veranda on the hall, separate red wooden posts and glazing.
 const vz=rearZ+rearD/2+.68;this.box(-hand*w*.07,.35,vz,w*.61,.21,1.43,H.stone,10,.25);
 for(let i=0;i<5;i++)this.box(-w*.33+i*w*.16,1.93,vz+.43,.11,3.12,.11,H.wood,20,1.05);
 this.box(0,3.46,vz+.43,w*.76,.12,.16,H.wood,20,1.05);
 this.box(-hand*w*.11,.08,d*.15,w*.45,.08,d*.42,'#869376',0,.1);
 this.box(0,.15,d*.29,1.45,.09,d*.45,'#b2ac9b',21,.1);
 if(f==='five-bay-hip'){this.box(w*.5+.35,.37,d*.13,.45,.72,d*.50,H.brick,18,.25);this.box(w*.5+.35,.76,d*.13,.65,.10,d*.50,H.stone,10,.3)}
 if(f==='l-court')this.heritagePlaque(String(p.houseNumber),hand*(w/2-wingW/2),3.46,d*.02+wingD/2+.053,.43,.43,0,true);else this.heritagePlaque(String(p.houseNumber),hand*(w/2+.04),2.5,0,.44,.44,hand*Math.PI/2,true);
 }
 this.noPlant(0,0,w+2,d+2);this.noPlant(0,d/2+2,6,5);
};
P.heritagePine=function(x,z,h){this.local(x,0,z,0,()=>{
 const rng=M.rng(Math.round((x+20)*233+(z+20)*53+h*31));
 this.cyl(0,0,0,.18,h*.95,'#646150',12,.52,20,.15);
 // Bundles of fine, radial needles leave sky visible; no solid green canopy discs.
 const needles=this.geo('heritage-pine-needles',()=>{let q=new G.Geometry();for(let j=0;j<24;j++){let a=j*2.39996,yy=.15+.7*((j*7)%23)/23,len=.3+.23*((j*11)%17)/17;let dir=[Math.cos(a)*.82,yy-.26,Math.sin(a)*.82],base=[0,(j%3)*.055,0],tip=M.add(base,M.mul(dir,len)),side=[-Math.sin(a)*.010,0,Math.cos(a)*.010];q.tri(M.add(base,side),M.sub(base,side),tip);}return q});
 for(let k=0;k<9;k++){let ang=k*2.39,yy=h*(.42+k*.062),reach=(9-k)*.16+1.0;let a=[Math.cos(ang)*reach,yy,Math.sin(ang)*reach];this.beam([0,yy-.65,0],a,.052,'#696652',20,.15);
  for(let branch=0;branch<4;branch++){let phi=ang+(branch-1.5)*.38,r=reach*(.42+branch*.19);this.beam([a[0]*.30,yy-.30,a[2]*.30],[Math.cos(phi)*r,yy+.18,Math.sin(phi)*r],.024,'#676750',20,.15);}
  for(let t=0;t<150;t++){let phi=rng()*Math.PI*2,rr=Math.sqrt(rng()),xx=a[0]+Math.cos(phi)*reach*.64*rr,zz=a[2]+Math.sin(phi)*reach*.64*rr,yyy=yy+(rng()-.5)*.72+.21*(1-rr);let scale=.72+rng()*.75;this.mesh('heritage-pine-needles',needles,xx,yyy,zz,scale,scale,scale,['#4a6046','#526a4e','#596d51','#65785b'][t%4],23,.15,rng()*Math.PI*2);}
 }
 for(let t=0;t<65;t++){let a=t*2.399,r=Math.sqrt(rng())*.56;this.mesh('heritage-pine-needles',needles,Math.cos(a)*r,h*(.94+rng()*.06),Math.sin(a)*r,.9,.9,.9,'#556b4c',23,.15,a);}
 });};
P.heritage61=function(p,w,d){
 // Numbered photo: a two-storey western house with a lower terrace wing.
 // The obscured rear layout is not asserted to be measured.
 const leftW=w*.67,leftX=-w*.165,rightW=w*.33,rightX=w*.335;
 this.heritageSmallHouse(leftX,0,leftW,d,7.4,2,{door:false,roof:'hip',roofColor:'#777063',rise:2.0,bays:2});
 this.local(rightX,0,d*.10,0,()=>{this.heritageFloor(rightW,d*.80);this.box(0,2.25,0,rightW,3.60,d*.80,H.brick,18,.6);this.box(0,4.13,0,rightW+.2,.20,d*.80+.2,H.stone,10,1.1);this.box(0,4.59,d*.4,rightW,.83,.27,H.brick,18,1.2);for(let side of[-1,1])this.box(side*rightW/2,4.59,0,.26,.83,d*.80,H.brick,18,1.2);this.heritageWindow(0,2.2,d*.4+.025,rightW*.60,1.80,0,false,'#afb6ab');});
 this.heritageDoor(-w*.26,.45,d/2+.08,1.23,2.45);
 this.heritagePlaque('61',-w*.34,2.70,d/2+.17,.38,.29);
 this.noPlant(0,0,w+2,d+2);
};
P.historicVilla=function(p,parcelW,parcelD){const cfg=p.heritageModel;if(!cfg)throw new Error('Missing heritageModel for '+p.id);const [sx,sz]=cfg.bodyScale||[1,1],w=parcelW*sx,d=parcelD*sz;
 if(cfg.form==='arcade66'||cfg.form==='arcade60')this.heritage66(p,w,d);
 else if(cfg.form==='western61')this.heritage61(p,w,d);
 else if(cfg.form==='dormer53')this.heritage53(p,w,d);
 else if(['l-court','screen-court','u-court','five-bay-hip'].includes(cfg.form))this.heritageCourt(p,w,d);
 else{
 const n=cfg.floors,h=n===2?7.3:3.55;
 this.heritageSmallHouse(0,0,w,d,h,n,{arched:cfg.form==='western54',roof:cfg.form==='western61'?'hip':'gable',bays:cfg.form==='row'?6:undefined,rise:n===2?2.10:1.65});
 this.heritagePlaque(String(p.houseNumber),w*.26,2.6,d/2+.14,.39,.30);
 if(cfg.form==='western61'){
 this.box(w*.24,3.90,d/2+1,4.1,.21,2.2,H.stone,10,1.1);for(let side of[-1,1])this.box(w*.24+side*1.95,5.38,d/2+1.8,.09,2.8,.09,H.wood,20,1.25);this.box(w*.24,4.25,d/2+2.0,4.1,.45,.13,H.wood,20,1.15);
 }
 this.noPlant(0,0,w+3,d+4);
 }
 // A short flagged approach joins each visible entry area to its canonical point.
 const end=cfg.approachLocal?.[1]||parcelD/2+1.5,begin=d/2+.40;
 if(cfg.form==='dormer53'){this.box(w*.12,.15,end,w*.24+1.25,.085,1.15,'#b0aa99',21,.08);this.box(w*.24,.15,(end+d/2+3.25)/2,1.45,.085,Math.abs(end-d/2-3.25)+.8,'#b0aa99',21,.08);}else if(end>begin)this.box(0,.19,(begin+end)/2,1.25,.065,end-begin,'#b0aa99',21,.08);
};
const gardenV7=P.yannanGarden;
P.heritageBollard=function(x,z){this.local(x,0,z,0,()=>{const key='heritage-circular-lamp',g=this.geo(key,()=>{let g=new G.Geometry();for(let k=0;k<40;k++){let a=2*Math.PI*k/40,b=2*Math.PI*(k+1)/40;const pt=(t,inner,Z)=>{let x=Math.cos(t),y=Math.sin(t);let r=inner?.31:.5/Math.max(Math.abs(x),Math.abs(y));return[x*r,y*r,Z]};for(let Z of[-.06,.06])g.quad(pt(a,true,Z),pt(b,true,Z),pt(b,false,Z),pt(a,false,Z));g.quad(pt(a,true,-.06),pt(b,true,-.06),pt(b,true,.06),pt(a,true,.06));}return g});this.mesh(key,g,0,.48,0,.63,.63,.8,'#51584b',20,.1);this.box(0,.10,0,.16,.20,.08,'#595e50',20,.1);this.box(0,.255,.018,.29,.045,.038,'#baa77b',12,.1)});};
P.yannanGarden=function(p,w,d){gardenV7.call(this,p,w,d);
 // Old boundary wall treatment and low approach lighting; positions are landscape interpretation.
 for(let [a,b]of[[[-w/2,-d/2],[w/2,-d/2]],[[-w/2,-d/2],[-w/2,29]],[[w/2,-32],[w/2,d/2]]]){
 const len=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=-Math.atan2(b[1]-a[1],b[0]-a[0]);this.local((a[0]+b[0])/2,0,(a[1]+b[1])/2,ang,()=>{
 for(let s of[-1,1])for(let row=0;row<4;row++)for(let xx=-len/2+.35;xx<len/2-.2;xx+=.64){this.sphere(xx+(row%2)*.14,.22+row*.36,s*.285,.34,.23,.065,row%2?'#9a9e8c':'#a9aa98',10,.12,false)}
 });}
 const center=Y.DATA.toWorld([p.x,p.z]);for(let [x,z]of[[487,524],[487,511],[500,485],[500,476],[496,465],[481,465],[526,465],[547,477],[547,499],[533,512]]){let q=Y.DATA.toWorld([x,z]);this.heritageBollard(q[0]-center[0]+1.45,q[1]-center[1]);}
 // Preserve a low horizon at the central clearing; no invented monumental furniture.
 for(let i=0;i<22;i++){let x=-4+Math.sin(i*2.39)*15,z=3+Math.cos(i*2.39)*12;this.sphere(x,.10,z,.30,.09,.22,'#9e9475',10,.04,true)}
};
})(YY);
