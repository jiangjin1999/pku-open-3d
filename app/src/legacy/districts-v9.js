/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* West entrance axis + Jingyuan. Original component geometry, not a survey or
   photogrammetry model. Visible motifs follow official photographs; hidden
   facade, footprint and courtyard details remain explicitly approximate. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
const C={roof:'#697070',tile:'#747a78',red:'#7e3329',wood:'#894537',ink:'#243e43',green:'#446c60',blue:'#426476',gold:'#c3b183',wall:'#d2d0c3',stone:'#adada2',dark:'#464b46',glass:'#37494b'};
P.v9box=function(key,x,y,z,w,h,d,c,mat=18,part=.6){this.mesh(key,this.geo(key,G.box),x,y,z,w,h,d,c,mat,part)};
/* Smooth double-curvature eaves; normal-mapped tile texture is supplemented by
   cylindrical cover-tile ridges. Hip/gable transition is actual roof geometry. */
P.v9Roof=function(x,y,z,w,d,h,kind='hipgable',part=2){this.local(x,y,z,0,()=>{
 const hip=kind==='hip',gable=kind==='gable',half=t=>gable?.5:.5-.16*Math.min(1,t/(hip?1:.52)),height=(t,u)=>Math.pow(t,1.60)+.12*Math.pow(Math.abs(u),10)*Math.pow(1-t,2),key='v9-roof-'+kind;
 const q=this.geo(key,()=>{const a=new G.Geometry(),N=22,U=24;
 for(const s of[-1,1])for(let j=0;j<N;j++)for(let i=0;i<U;i++){const f=(t,u)=>[half(t)*u,height(t,u),s*.5*(1-t)],t=j/N,v=(j+1)/N,u=-1+2*i/U,k=-1+2*(i+1)/U;if(s===1)a.quad(f(t,u),f(t,k),f(v,k),f(v,u));else a.quad(f(t,k),f(t,u),f(v,u),f(v,k));}
 if(!gable)for(const s of[-1,1])for(let j=0;j<N;j++)for(let i=0;i<12;i++){const f=(t,u)=>[s*half(t),height(t,1),.5*(1-t)*u],t=j/N,v=(j+1)/N,u=-1+2*i/12,k=-1+2*(i+1)/12;if(s===1)a.quad(f(t,k),f(t,u),f(v,u),f(v,k));else a.quad(f(t,u),f(t,k),f(v,k),f(v,u));}return a;});
 this.mesh(key,q,0,0,0,w,h,d,C.roof,25,part);
 this.box(0,-.15,0,w-.5,.22,d-.5,C.dark,20,part-.08);
 if(gable)for(const s of[-1,1]){const key='v9-gable-white';this.mesh(key,this.geo(key,()=>new G.Geometry().tri([0,0,-.5],[0,1,0],[0,0,.5])),s*(w/2-.45),-.08,0,1,h*.96,d-.6,C.wall,24,part-.1);}
 // Physical cover tiles run up the roof rather than a screen-space stripe.
 const tkey='v9-cover-tiles-'+[w,d,h,kind].join('-'),tiles=this.geo(tkey,()=>{let a=new G.Geometry();const R=.058;
 for(const s of[-1,1])for(let xx=-w/2+.24;xx<w/2-.15;xx+=.41){let last=null;for(let j=0;j<=20;j++){let t=j/20;if(Math.abs(xx)>w*half(t)-.04)break;let yy=h*height(t,xx/(w*half(t)))+.027,zz=s*d*.5*(1-t),ring=[];for(let k=0;k<=6;k++){const theta=k*Math.PI/6;ring.push([xx+R*Math.cos(theta),yy+R*Math.sin(theta),zz]);}if(last)for(let k=0;k<6;k++){if(s===1)a.quad(last[k],last[k+1],ring[k+1],ring[k]);else a.quad(last[k+1],last[k],ring[k],ring[k+1]);}last=ring;}}
 return a;});this.mesh(tkey,tiles,0,0,0,1,1,1,C.tile,25,part+.035);
 const ridge=w*(gable?1:.68);this.beam([-ridge/2,h+.04,0],[ridge/2,h+.04,0],.135,'#68706b',25,part+.06);
 for(const s of[-1,1]){this.beam([s*ridge/2,h+.03,0],[s*(ridge/2+.37),h+.31,0],.12,C.tile,25,part+.06);
 // Rounded tile ends and small exposed rafters at the eave, no decorative labels.
 for(let xx=-w/2+.23;xx<w/2-.14;xx+=.82){let up=h*.12*Math.pow(Math.abs(xx/(w/2)),10);this.box(xx,-.20+up,s*(d/2-.24),.07,.1,.74,'#866e50',20,part-.1);this.sphere(xx,up+.01,s*d/2,.076,.076,.056,C.tile,25,part+.035,true);}}
 });};
P.v9Bracket=function(x,y,z,s=1){this.local(x,y,z,0,()=>{
 this.box(0,0,0,.34*s,.34*s,.44*s,C.red,20,1.4);
 for(let k=0;k<3;k++){let w=(.67+k*.32)*s,yy=(.18+k*.20)*s;this.box(0,yy,k*.10*s,w,.16*s,.33*s,k===1?C.green:C.blue,20,1.5+k*.02);for(let a of[-1,1])this.box(a*w*.43,yy+.12*s,k*.10*s,.15*s,.14*s,.44*s,C.gold,20,1.55);}
 this.box(0,.83*s,.20*s,.46*s,.13*s,1.13*s,C.green,20,1.6);
 });};
P.v9PaintedBeam=function(x,y,z,w,h=.58){this.local(x,y,z,0,()=>{
 this.box(0,0,0,w,h,.23,C.ink,20,1.45);
 for(let s of[-1,1]){this.box(0,s*(h/2-.04),.135,w,.045,.027,C.gold,20,1.46);this.box(0,s*(h/2-.12),.151,w-.14,.035,.019,C.green,20,1.47);}
 let spacing=Math.min(2.9,w/Math.max(1,Math.floor(w/2.9))),n=Math.round(w/spacing);for(let i=0;i<n;i++){let xx=-w/2+spacing*(i+.5);const dia=this.geo('v9-painted-diamond',()=>new G.Geometry().quad([-.5,0,0],[0,-.5,0],[.5,0,0],[0,.5,0]));this.mesh('v9-painted-diamond',dia,xx,0,.151,spacing*.48,h*.68,1,C.green,20,1.48);this.mesh('v9-painted-diamond',dia,xx,0,.155,spacing*.29,h*.43,1,C.blue,20,1.49);this.box(xx,0,.162,spacing*.10,h*.18,.016,C.gold,20,1.5);}
 });};
P.v9Lattice=function(x,y,z,w,h,r=0,diagonal=false){this.local(x,y,z,r,()=>{
 this.box(0,0,0,w+.18,h+.18,.16,'#493c32',20,.78);this.box(0,0,.10,w-.11,h-.12,.035,C.glass,5,.80);
 for(const s of[-1,1]){this.box(s*(w/2-.07),0,.18,.14,h,.17,C.red,20,.83);this.box(0,s*(h/2-.065),.18,w,.13,.17,C.red,20,.83);}
 if(diagonal){let W=w-.28,H=h-.28;for(const s of[-1,1])for(let a=-W-H;a<W+H;a+=.43){let pts=[];for(const xx of[-W/2,W/2]){let yy=s*xx+a;if(yy>=-H/2&&yy<=H/2)pts.push([xx,yy,.195]);}for(const yy of[-H/2,H/2]){let xx=(yy-a)/s;if(xx>-W/2&&xx<W/2)pts.push([xx,yy,.195]);}if(pts.length>=2)this.beam(pts[0],pts[1],.022,C.wood,20,.86);}}
 else{for(let i=1;i<4;i++)this.box(-w/2+w*i/4,0,.19,.042,h-.19,.10,C.wood,20,.86);for(let i=1;i<5;i++)this.box(0,-h/2+h*i/5,.19,w-.18,.046,.10,C.wood,20,.86);}
 this.box(0,-h/2-.13,.12,w+.24,.15,.37,C.stone,10,.83);
 });};
P.v9DoorLeaf=function(x,y,z,w,h,angle=0){this.local(x,y,z,angle,()=>{
 this.v9box('v9-gate-door-leaf',w/2,h/2,0,w,h,.20,C.red,20,.85);
 for(let i=1;i<9;i++)for(let j=1;j<5;j++)this.sphere(j*w/5,i*h/9,.126,.042,.042,.040,'#a99261',9,.88,true);
 this.mesh('torus',this.geo('torus',()=>G.torus(24,8)),w*.70,h*.45,.18,.1,.13,.032,'#9e8b59',9,.91);
 this.box(w*.5,.13,.13,w-.14,.13,.045,'#6c2c25',20,.92);
 });};
P.v9StoneBeast=function(x,z,scale=1,kind='lion'){this.local(x,0,z,0,()=>{
 const c='#a5a69d';this.box(0,.32*scale,0,1.35*scale,.64*scale,1.65*scale,c,10,.18);this.box(0,.70*scale,0,1.53*scale,.17*scale,1.81*scale,'#b5b6a9',10,.2);
 const qilin=kind==='qilin';this.sphere(0,1.40*scale,-.07*scale,.43*scale,.65*scale,.47*scale,c,10,.6,true);
 for(const s of[-1,1]){this.beam([s*.28*scale,.8*scale,.46*scale],[s*.25*scale,1.55*scale,.18*scale],.12*scale,c,10,.6);this.sphere(s*.28*scale,.89*scale,.53*scale,.17*scale,.09*scale,.25*scale,c,10,.65,true);}
 this.sphere(0,2.02*scale,.19*scale,.38*scale,.37*scale,.37*scale,c,10,.65,true);this.sphere(0,1.92*scale,.50*scale,.24*scale,.16*scale,.19*scale,c,10,.67,true);
 for(const s of[-1,1]){this.sphere(s*.17*scale,2.1*scale,.49*scale,.048*scale,.048*scale,.028*scale,'#6c746d',10,.7,true);this.sphere(s*.35*scale,2.16*scale,.11*scale,.11*scale,.15*scale,.10*scale,c,10,.7,true);}
 if(qilin)this.beam([0,2.24*scale,.15*scale],[.12*scale,2.7*scale,-.05*scale],.055*scale,c,10,.74);
 else for(let i=0;i<17;i++){let a=i/17*Math.PI*2;this.sphere(Math.sin(a)*.37*scale,2.04*scale+Math.cos(a)*.35*scale,-.01*scale,.092*scale,.095*scale,.095*scale,'#959c91',10,.68,true);}
 });};
P.historicWestGate=function(p,w=25.5,d=7.8){
 this.noPlant(0,2,w+18,d+12);this.box(0,.16,0,w+2,.25,d+2,'#b8b9ac',10,.0);
 const doorCenters=[-5.25,0,5.25],gap=4.2,H=4.37;
 for(const x of[-8.05,-2.62,2.62,8.05]){this.cyl(x,.3,d/2-.08,.22,4.98,C.red,16,1,20,.9);this.v9Bracket(x,5.28,d/2-.18,.85);}
 for(const s of[-1,1]){
 this.box(s*10.4,2.66,0,4.15,4.85,d,C.wall,24,.5);this.solid(s*10.4,0,4.15,d);
 this.v9Lattice(s*10.4,3.05,d/2+.05,3.4,3.38,0,true);
 this.box(s*10.4,.79,d/2+.03,4.1,1.05,.25,C.stone,10,.6);
 this.box(s*12.7,2.7,0,.55,4.95,d+.25,C.wall,24,.5);
 // Flanking low walls; local opening bounds exclude the traversable center.
 this.box(s*16.5,1.77,-.4,6.5,3.2,.60,C.wall,24,.45);this.solid(s*16.5,-.4,6.5,.60);this.v9Roof(s*16.5,3.45,-.4,6.9,1.7,.65,'gable',1.8);
 this.v9StoneBeast(s*9.6,d/2+3.3,.98,'lion');}
 for(const x of doorCenters){this.box(x,4.74,0,gap+.9,.86,d,C.red,20,1.1);for(const s of[-1,1]){this.box(x+s*(gap/2+.19),2.44,0,.32,4.25,d-.3,C.red,20,.75);this.solid(x+s*(gap/2+.19),0,.32,d-.3);} // three actual passage voids
 this.v9DoorLeaf(x-gap/2,.31,-d/2+.40,gap/2,4.00,Math.PI*.45);
 this.local(x+gap/2,.31,-d/2+.40,Math.PI,()=>this.v9DoorLeaf(0,0,0,gap/2,4.00,-Math.PI*.45));}
 this.v9PaintedBeam(0,5.33,d/2+.13,w+.15,.96);this.v9PaintedBeam(0,5.33,-d/2-.13,w+.15,.96);
 this.v9Roof(0,6.13,0,w+2.3,d+3.0,1.72,'hipgable');
 this.box(0,4.82,d/2+.22,4.44,1.16,.21,'#c6c7b4',10,1.35);
 this.sign('北京大学',0,4.82,d/2+.344,4.25,1.00,0,true);
};
P.historicOffice=function(p,w=59,d=23){
 this.noPlant(0,2,w+8,d+20);this.solid(0,0,w,d);
 const base=1.75,body=10.8;this.box(0,.65,0,w+2,1.3,d+2,C.stone,10,.15);this.box(0,1.48,0,w+2.3,.32,d+2.3,'#c1c0b2',10,.25);
 this.box(0,base+body/2,0,w,body,d,C.wall,24,.5);
 const facade=d/2+.06,bay=(w-12)/9;
 // Recessed timber bays and red vertical columns; white end piers stay visible.
 for(let i=-4;i<=4;i++){let x=i*bay;this.v9box('v9-office-bay-panel',x,base+body/2,facade,bay-.38,body-.55,.16,'#472f29',20,.7);
 this.v9Lattice(x,base+2.65,facade+.16,bay-.65,4.30,0,i%2===0);
 this.v9Lattice(x,base+8.03,facade+.16,bay-.65,3.82,0,false);
 this.box(x,base+5.4,facade+.27,bay-.32,.83,.23,C.wall,24,.82);
 for(let q of[-1,0,1]){this.box(x+q*bay*.24,base+5.41,facade+.415,bay*.19,.50,.03,'#babfb2',10,.84);this.box(x+q*bay*.24,base+5.41,facade+.44,bay*.14,.35,.025,'#d1d1c4',10,.85);}
 }
 for(let i=-5;i<=5;i++){let x=i*bay+bay/2;if(Math.abs(x)>w*.44)continue;this.cyl(x,base,facade+.32,.245,10.3,C.red,20,1,20,1.05);this.v9Bracket(x,12.40,facade+.31,1.17);}
 for(const side of[-1,1])this.local(side*(w/2+.05),0,0,side*Math.PI/2,()=>{for(const zz of[-6,0,6])for(const yy of[4.4,9.8])this.v9Lattice(zz,yy,0,3.8,3.3,0,false);});
 // Balcony and central door; replace central lower glazing with real panelled entry.
 this.heritageDoor(0,base,facade+.41,4.6,4.1,0,C.red);
 this.box(0,6.97,facade+1.13,7.6,.35,3.05,C.stone,10,1.05);
 this.v9PaintedBeam(0,6.75,facade+2.7,7.6,.72);
 for(const xx of[-3.25,-1.65,0,1.65,3.25])this.v9Bracket(xx,6.03,facade+2.20,.7);
 for(const xx of[-3.3,3.3])this.cyl(xx,base,facade+2.1,.18,4.86,C.red,16,1,20,1.05);
 this.v9PaintedBeam(0,12.1,facade+.44,w-9,1.0);
 // Hybrid roof: higher hip-gabled central volume, lower hipped outer wings.
 for(const s of[-1,1])this.v9Roof(s*(w/2-5.6),11.88,0,14.0,d+3.1,3.65,'hip',1.9);
 this.v9Roof(0,13.19,0,w-13,d+5.05,4.78,'hipgable',2.3);
 // Broad stair has two pedestrian flights beside an ornamental central stone ramp.
 for(let i=0;i<9;i++){let yy=.12+i*.18,zz=facade+8.1-i*.58;for(const s of[-1,1])this.box(s*3.6,yy,zz,4.4,.24,1.04,C.stone,10,.2);}
 const ramp=this.geo('v9-office-danbi',()=>{let q=new G.Geometry();q.quad([-1.30,.15,0],[1.30,.15,0],[1.30,1.68,-5.7],[-1.30,1.68,-5.7]);return q});this.mesh('v9-office-danbi',ramp,0,0,facade+8.48,1,1,1,'#8f958b',10,.22);
 for(let i=0;i<18;i++){let t=i/17;this.local(0,.20+t*1.50,facade+8.40-t*5.7,0,()=>{this.beam([-.88+Math.sin(t*18)*.10,0,0],[.88-Math.cos(t*16)*.12,0,-.08],.028,'#b1b5a9',10,.23);});}
 for(const s of[-1,1]){this.v9StoneBeast(s*12.2,facade+5.5,1.13,'qilin');this.box(s*12.2,.30,facade+5.5,3.8,.6,3.0,'#b2b5a8',10,.12);}
};
P.alumniBridge=function(p,w=27,d=8.2){
 this.noPlant(0,0,w+2,d+4);const spacing=6.7,rad=2.86,spring=.31,rise=1.58,deck=2.22;
 // Three empty barrel arches; no box fills their openings.
 const key='v9-bridge-arch',geo=this.geo(key,()=>{let q=new G.Geometry();for(let i=0;i<32;i++){let a=i*Math.PI/32,b=(i+1)*Math.PI/32,pt=(t,z)=>[-Math.cos(t),Math.sin(t),z];for(let s of[-1,1]){let A=pt(a,s*.5),B=pt(b,s*.5);if(s>0)q.quad(A,B,[B[0],1.26,s*.5],[A[0],1.26,s*.5]);else q.quad(B,A,[A[0],1.26,s*.5],[B[0],1.26,s*.5]);}q.quad(pt(a,-.5),pt(a,.5),pt(b,.5),pt(b,-.5));}return q});
 for(const x of[-spacing,0,spacing]){this.mesh(key,geo,x,spring,0,rad,rise,d,C.stone,10,.5);
 for(const s of[-1,1])for(let k=0;k<17;k++){let a=(k+.05)/17*Math.PI,b=(k+.95)/17*Math.PI;this.beam([x-Math.cos(a)*(rad+.085),spring+Math.sin(a)*(rise+.07),s*(d/2+.015)],[x-Math.cos(b)*(rad+.085),spring+Math.sin(b)*(rise+.07),s*(d/2+.015)],.059,'#b9baaf',10,.54);}}
 for(let x of[-spacing*1.5,-spacing*.5,spacing*.5,spacing*1.5]){this.box(x,1.01,0,.98,2.0,d,C.stone,10,.4);this.solid(x,0,.98,d);}
 this.box(0,deck,0,21.1,.22,d+.35,'#bdc0b2',10,.65);
 for(const s of[-1,1]){const key='v9-bridge-slope-'+s,geom=this.geo(key,()=>{const A=[s*w/2,.24,-(d+.35)/2],B=[s*10.5,2.22,-(d+.35)/2],C=[s*10.5,2.22,(d+.35)/2],E=[s*w/2,.24,(d+.35)/2];return s>0?new G.Geometry().quad(A,B,C,E):new G.Geometry().quad(E,C,B,A)});this.mesh(key,geom,0,0,0,1,1,1,'#b2b8aa',21,.2);}
 for(const side of[-1,1]){
 for(let x=-10;x<=10.01;x+=2){this.box(x,deck+.81,side*(d/2+.22),.26,1.65,.30,C.stone,10,.9);this.sphere(x,deck+1.70,side*(d/2+.22),.22,.22,.22,'#b5b9ad',10,.92,true);}
 for(let x=-9;x<10;x+=2){this.box(x,deck+.24,side*(d/2+.22),1.76,.30,.22,C.stone,10,.85);this.box(x,deck+1.42,side*(d/2+.22),1.76,.14,.28,C.stone,10,.90);for(const a of[-.58,0,.58])this.box(x+a,deck+.85,side*(d/2+.22),.10,1.05,.18,'#b4b8aa',10,.9);}
 for(const s of[-1,1])this.beam([s*10.5,deck+1.45,side*(d/2+.22)],[s*w/2,1.1,side*(d/2+.22)],.12,C.stone,10,.85);
 }
};
P.historicHuabiao=function(p){
 this.noPlant(0,0,8,42);for(let n=0;n<2;n++)this.local(0,0,(n?1:-1)*18,0,()=>{
 const r=p.detailModel.shaftRadii[n],c='#babfb3';this.solid(0,0,3,3);
 for(let k=0;k<4;k++)this.cyl(0,k*.31,0,1.43-k*.17,.31,c,8,1,10,.15+k*.04);
 this.cyl(0,1.24,0,r,5.66,c,32,.94,10,.7);
 // Shallow, irregular relief around the shaft (not a scan of the dragon carving).
 for(let i=0;i<90;i++){let a=i*.26,yy=1.38+i*.058;this.sphere(Math.cos(a)*(r+.02),yy,Math.sin(a)*(r+.02),.081,.062,.081,'#a7b0a4',10,.76,true);}
 const key='v9-huabiao-cloud',cloud=this.geo(key,()=>{let a=new G.Geometry();let pts=[[-1.45,0],[-1.35,.18],[-1.0,.19],[-1.15,.35],[-.94,.51],[-.73,.42],[-.52,.60],[-.28,.49],[0,.58],[.28,.49],[.52,.60],[.73,.42],[.94,.51],[1.15,.35],[1,.19],[1.35,.18],[1.45,0]];for(let i=1;i<pts.length-1;i++)a.tri([pts[0][0],pts[0][1],.06],[pts[i][0],pts[i][1],.06],[pts[i+1][0],pts[i+1][1],.06]);for(let i=0;i<pts.length;i++){let q=pts[i],t=pts[(i+1)%pts.length];a.quad([q[0],q[1],-.06],[t[0],t[1],-.06],[t[0],t[1],.06],[q[0],q[1],.06]);}return a;});this.mesh(key,cloud,0,6.16,0,1,1,1,c,10,1.1,Math.PI/2);
 this.cyl(0,6.83,0,r+.26,.17,c,24,1,10,1.25);this.cyl(0,7.0,0,.43,.18,c,16,1,10,1.3);
 this.sphere(0,7.46,0,.25,.29,.33,c,10,1.35,true);this.sphere(0,7.73,.15,.19,.22,.22,c,10,1.4,true);for(const s of[-1,1])this.beam([s*.16,7.15,.17],[s*.14,7.50,.13],.056,c,10,1.35);
 });};
P.v9TigerWall=function(x,z,w,h=1.6,r=0){this.local(x,0,z,r,()=>{
 this.box(0,h/2+.2,0,w,h,.43,'#92998c',18,.45);this.solid(0,0,w,.43);
 const k='v9-tiger-stone',stone=this.geo(k,()=>G.sphere(9,5,.045));
 for(let row=0;row<4;row++)for(let i=0;i<Math.ceil(w/.61);i++){let xx=-w/2+.31+i*.61+(row%2)*.21;if(xx>w/2-.18)continue;let a=Math.sin((i+1)*12.31+row*9.17),col=['#b3b4a8','#939e93','#a8a591','#b8b9aa'][(i+row)%4];for(const side of[-1,1])this.mesh(k,stone,xx,.32+row*(h-.2)/4,side*.222,.26+a*.02,h*.11,.072,col,10,.51);}
 this.box(0,h+.26,0,w+.10,.15,.58,'#737e73',10,.54);
 });};
P.historicJingyuan=function(p,w=35,d=39){
 this.noPlant(0,0,w+4,d+4);this.box(0,.065,0,w,.09,d,'#b6b1a1',21,.02);const back=-d/2+5.2,bw=w-1.8,depth=9.6,H=8.8;
 this.local(0,0,back,0,()=>{
 this.solid(0,0,bw,depth);this.box(0,.41,0,bw+1,.8,depth+.8,C.stone,10,.17);this.box(0,4.75,0,bw,8.3,depth,C.wall,24,.5);
 for(const s of[-1,1])for(let i=-3;i<=3;i++){let xx=i*(bw/7.9),zz=s*(depth/2+.05);this.local(xx,0,zz,s===1?0:Math.PI,()=>{this.v9Lattice(0,2.77,0,bw/9.5,2.66,0,false);this.v9Lattice(0,6.48,0,bw/9.5,2.64,0,false);});}
 for(const s of[-1,1]){this.box(0,4.56,s*(depth/2+.20),bw,.27,.27,C.wall,24,.8);this.v9PaintedBeam(0,8.72,s*(depth/2+.14),bw,.43);}
 for(const i of[-3.5,-2.5,-1.5,-.5,.5,1.5,2.5,3.5])this.box(i*(bw/7.9),4.79,depth/2+.24,.13,8.0,.17,C.red,20,.9);
 this.heritageDoor(0,.82,depth/2+.29,1.8,2.7,0,C.red);this.v9Roof(0,9.20,0,bw+2.65,depth+3.25,3.1,'hipgable');
 });
 // Side houses are deliberately typological, not an asserted individual floor plan.
 for(const s of[-1,1])this.local(s*(w/2-2.9),0,1.8,s===1?-Math.PI/2:Math.PI/2,()=>{
 const sw=16,sd=4.5;this.solid(0,0,sw,sd);this.box(0,.30,0,sw+.6,.6,sd+.6,C.stone,10,.18);this.box(0,2.5,0,sw,4.0,sd,C.wall,24,.5);for(let i=-2;i<=2;i++)this.v9Lattice(i*2.9,2.6,sd/2+.05,2.0,2.2,0,true);this.v9Roof(0,4.63,0,sw+1.6,sd+1.6,1.8,'gable',1.9);
 });
 const front=d/2-.85,gap=2.9,wing=(w-gap)/2;
 for(const s of[-1,1]){this.v9TigerWall(s*(gap/2+wing/2),front,wing,1.5);this.v9TigerWall(s*(w/2-.23),d*.08,d*.76,1.5,Math.PI/2);this.box(s*(gap/2+.20),1.99,front,.45,3.6,.78,C.wall,24,.65);this.cyl(s*(gap/2-.04),.3,front+.37,.12,2.97,C.red,16,1,20,.85);}
 this.box(0,3.48,front,gap+.9,.50,1.11,C.red,20,1.0);this.v9Roof(0,3.91,front,gap+2.0,2.26,1.00,'gable',1.8);
 this.local(-gap/2,.25,front-.18,Math.PI*.44,()=>this.heritageDoor(.67,0,0,1.25,2.85,0,C.red));
 this.sign(p.name,0,3.45,front+.59,1.7,.46,0,true);
 // Garden and approach surface are not marked as obstacles.
 this.box(0,.14,2.8,w*.56,.11,d*.39,'#718562',0,.01);this.box(0,.235,(front+back+depth/2)/2,1.55,.07,front-(back+depth/2)+.3,'#bcb9a5',21,.1);
 this.box(0,.20,front+1.2,3.6,.17,3.2,'#b4b3a1',21,.08);
 // Wisteria pergola: open lattice, weathered wood, restrained leaf patches.
 const tz=7.3,tw=10.4;for(const sx of[-tw/2,tw/2])for(const zz of[tz-1.45,tz+1.45]){this.box(sx,1.55,zz,.15,2.9,.15,'#6b6550',20,.85);this.box(sx,2.9,tz,.17,.19,3.6,'#756f56',20,.9);}
 for(let xx=-tw/2;xx<=tw/2;xx+=.57)this.box(xx,3.03,tz,.10,.12,3.5,'#7b735a',20,.94);
 for(let i=0;i<35;i++){const xx=-tw/2+(i*.783)%tw,zz=tz-1.4+(i*.619)%2.8;this.sphere(xx,3.15+Math.sin(i)*.09,zz,.42,.16,.34,i%3?'#658056':'#7d8c60',3,1.00,true);}
 if(p.id===18){for(let i=0;i<35;i++){let xx=w/2-.42,yy=.6+(i*.637)%2.5,zz=-3+(i*1.479)%10;this.sphere(xx,yy,zz,.17,.26,.38,'#526b48',3,.83,true);}}
};
/* Local slope matches road ribbons AND navigation camera heights. */
})(YY);
