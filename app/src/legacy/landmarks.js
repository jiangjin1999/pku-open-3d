/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* Evidence-led architectural geometry. Local +Z denotes each model's principal front.
   Ground plans and 3D solids share one transform; no independently invented map icons. */
(function(Y){'use strict';const {Builder:B,Geo:G,M,COLORS:C}=Y,P=B.prototype;
P.hip=function(x,y,z,w,d,h,part=2){this.mesh('quietHip',this.geo('quietHip',()=>G.roof(.68)),x,y,z,w,h,d,C.roof,2,part);this.box(x,y-.18,z,w,.38,d,'#bebcaf',10,part);this.box(x,y+h*.94,z,w*.68,.16,.18,'#747b7b',2,part)};
// Window frame is true geometry with an opening, rather than paint on a wall.
P.window=function(x,y,z,w,h,r=0,tone='#535c5c',mullion=true){
 const key='recessFrame'+mullion,gg=this.geo(key,()=>{let g=new G.Geometry(),bar=(x,y,w,h,depth=.16)=>{let q=G.box(),t=M.transform([x,y,0],[w,h,depth],0);for(let i=0;i<q.v.length;i+=8){let p=M.apply(t,[...q.v.slice(i,i+3),1]);g.vertex(p.slice(0,3),q.v.slice(i+3,i+6),q.v.slice(i+6,i+8))}};bar(-.477,0,.046,1);bar(.477,0,.046,1);bar(0,-.476,1,.048);bar(0,.476,1,.048);if(mullion){bar(0,0,.028,1);bar(0,.09,1,.027)}return g});
 this.local(x,y,z,r,()=>{this.box(0,0,-.08,w,.99*h,.12,C.glass,5,.7);this.mesh(key,gg,0,0,0,w,h,1,tone,9,.7)});
};
P.lettering=function(text,x,y,z,w,h,r=0,color='#444b48'){
 let key='letters_'+text+color,uv=this.signs.get(key);if(!uv){let k=this.nSigns++,col=k%8,row=Math.floor(k/8),px=col*512,py=row*128;this.ctx.clearRect(px,py,512,128);this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.font=`500 ${Math.min(76,470/text.length)}px "Noto Sans CJK SC","Microsoft YaHei",sans-serif`;this.ctx.fillStyle=color;this.ctx.fillText(text,px+256,py+64);uv=[px/4096,1-(py+128)/4096,.125,.03125];this.signs.set(key,uv)}const fontSize=Math.min(76,470/text.length),naturalWidth=fontSize*text.length;const planeHeight=Math.min(h*128/fontSize,w*128/naturalWidth);this.mesh('plane',this.geo('plane',G.plane),x,y,z,planeHeight*4,planeHeight,1,'#ffffff',8,.85,r,uv);
};
P.parapet=function(x,y,z,w,d,col='#b9b9b1',h=.8){for(let side of[-1,1]){this.box(x+side*(w/2-.15),y+h/2,z,.3,h,d,col,10,1.6);this.box(x,y+h/2,z+side*(d/2-.15),w,h,.3,col,10,1.6)}};
P.steps=function(x,z,w,n=5,top=1.1){for(let i=0;i<n;i++)this.box(x,top*(i+.5)/n,z-i*.42,w,top/n,(n-i)*.43+.4,C.stone,10,.05)};
P.windows=function(x,z,w,h,d,floors=3,bays=8,modern=false){let fh=(h-1.3)/floors,step=w/(bays+1);for(let side of[-1,1])for(let f=0;f<floors;f++)for(let i=1;i<=bays;i++){let y=1+fh*(f+.48),xx=x-w/2+i*step;this.window(xx,y,z+side*(d/2+.15),step*.68,fh*.63,side<0?Math.PI:0,modern?'#6f7677':C.red);this.box(xx,y-fh*.33,z+side*(d/2+.23),step*.77,.12,.40,C.stone,10,.7)}let count=Math.max(1,Math.floor(d/5.8));for(let side of[-1,1])for(let f=0;f<floors;f++)for(let i=1;i<=count;i++)this.window(x+side*(w/2+.15),1+fh*(f+.48),z-d/2+d/(count+1)*i,d/(count+1)*.58,fh*.63,side*Math.PI/2,modern?'#6f7677':C.red)};
P.block=function(x,z,w,d,h,floors=4,col='#cecbbd',roof=false,bays=0){this.local(x,0,z,0,()=>{this.solid(0,0,w,d);this.box(0,.38,0,w+.7,.76,d+.7,'#b5b4ac',10);this.box(0,h/2+.65,0,w,h,d,col,13,.65);this.windows(0,0,w,h,d,floors,bays||Math.max(3,Math.round(w/5.2)),true);this.box(0,h+.85,0,w+.7,.42,d+.7,'#d7d6cc',10,1.3);if(roof)this.hip(0,h+1.2,0,w+2.3,d+2.3,Math.min(4.5,d*.16));else{this.box(0,h+.97,0,w-.5,.15,d-.5,'#939792',7,1.5);this.parapet(0,h+1,0,w,d)}})};
P.academic=function(w,d,h=18,roofed=false,title='',floors){this.block(0,0,w,d,h,floors||Math.max(2,Math.round(h/4.1)),'#cfcdc2',roofed);this.window(0,2.6,d/2+.20,Math.min(6,w*.2),4.3,0,'#3c4648');this.box(0,5.2,d/2+1.4,Math.min(9,w*.29),.22,3.2,'#a9aba5',10,1);this.steps(0,d/2+3.3,Math.min(9,w*.3),4,.7);if(title&&w>15)this.lettering(title,0,h-1.05,d/2+.31,Math.min(20,w*.48),1.15)};
P.zhihua=function(){
 // West-facing local frame: façade width 72 m (north/south), depth 76 m (east/west).
 const warm='#e3d8bd',slab=(x,z,w,d,h,f,bays)=>this.block(x,z,w,d,h,f,warm,false,bays);
 slab(0,27,62,20,19.4,5,12);slab(-27,-10,18,55,15.4,4,4);slab(27,-10,18,55,15.4,4,4);
 slab(0,-24,33,26,9.2,2,6);this.box(0,10.3,-24,34,.34,27,'#dbd4c4',10,1.5);
 // Square projecting piers, tall recessed central entry and four-floor side wings.
 for(let x=-28;x<=28;x+=4.7)this.box(x,10.3,37.35,.44,19.3,.38,'#f0e8d5',13,.9);
 for(let x of[-6,-3,0,3,6])this.window(x,3.0,37.66,2.66,4.8,0,'#48535a');
 this.box(0,5.65,39.1,19.0,.26,4.8,'#c7c6ba',10,1.1);for(let x of[-8,8])this.box(x,2.9,40.5,.32,5.3,.32,'#c8c9bf',9,1);
 this.steps(0,41.8,22,6,1.1);
 for(let i=0;i<3;i++)this.lettering('智华楼'[i],-13.85,15.9-i*1.1,37.63,1.0,1.0,0,'#767060');
 this.lettering('数学科学学院',0,9.0,-37.22,19,1.25,Math.PI,'#4c514d');
 for(let x=-12;x<=12;x+=3.0)this.window(x,5.25,-37.22,2.6,7.1,Math.PI,'#424e56');
 // Actual open courtyard instead of filling the footprint with a box.
 this.box(0,.15,-2,32,.25,21,'#c8c5b7',7);this.box(0,.3,-4,15,.3,7,'#73845a',0);
};
P.hall=function(){
 this.noPlant(0,12,84,108);
 this.solid(0,-9,44,47);this.box(0,.6,1,78,1.2,80,'#c4c5bd',10);
 this.box(0,15,-9,44,28.8,47,'#dfd8c8',14,.7);this.box(0,29.5,-9,46,.7,49,'#dedbcc',10,1.6);this.hip(0,30,-9,47,50,5.1);
 // High front flanks and the octagonal window.
 for(let side of[-1,1]){this.solid(side*28,0,14,62);this.box(side*28,7.7,0,14,14.1,62,'#d3cfc0',14,.7);this.hip(side*28,15,0,17,65,3.1);this.box(side*21.5,12.1,7,11,23,27,'#ddd6c6',14,.8);for(let z=-22;z<=24;z+=5)this.window(side*35.12,10,z,2.3,4.2,side*Math.PI/2,'#727877')}
 let win=new G.Geometry(),points=Array.from({length:8},(_,i)=>[Math.sin((i+.5)*Math.PI/4)*2.4,22.2+Math.cos((i+.5)*Math.PI/4)*2.4,14.58]);for(let i=1;i<7;i++)win.tri(points[0],points[i],points[i+1],undefined,[[0,0,1],[0,0,1],[0,0,1]]);this.mesh('hallOctagon',win,0,0,0,1,1,1,C.glass,5,1);for(let i=0;i<8;i++)this.beam(points[i],points[(i+1)%8],.095,'#dfe1d8',10,1);for(let x of[-1.25,0,1.25])this.box(x,22.2,14.70,.08,3.9,.09,'#c3d2d1',9,1);for(let y of[20.8,22.2,23.6])this.box(0,y,14.71,4.0,.08,.10,'#c3d2d1',9,1);
 for(let x of[-17,-12,-7,7,12,17]){this.box(x,20.4,14.61,.22,11.8,.15,'#716e62',9,.9);this.box(x,26.4,14.66,1.0,.35,.20,'#65655f',9,.9)}
 // Paired square colonnade, set forward; shallow central opening and projecting wings.
 this.box(0,12.2,28.5,70,3.1,4.5,'#d8d3c4',14,1.1);this.box(0,5.9,25.65,67,10.6,.3,C.glass,5,.8);
 for(let x=-32;x<=32;x+=8){for(let offset of[-.42,.42])this.box(x+offset,6.25,30.1,.44,11.3,.70,'#e1ded2',10,1);for(let dy of[4.5,8.5])this.box(x,dy,25.99,7.8,.07,.09,'#a8b1af',9,1);this.box(x,6.1,26.01,.11,10.8,.1,'#747f7d',9,1)}
 for(let x=-6;x<=6;x+=1.5)this.window(x,3.2,28.65,1.3,4.8,0,'#a2aaa8');
 this.box(0,9.1,31,10,4.8,.45,'#c5c6ba',14,1.1);this.steps(0,36.5,71,6,1.2);
 // Plaza shares the hall's diagonal transform, not a separately axis-aligned rectangle.
 this.box(0,.16,48,78,.25,29,'#c6c4b8',7,0);this.box(0,.68,45,17,1.06,7,'#282d2c',10,.05);this.box(0,1.24,45,16.5,.06,6.5,'#42575b',5,.05);
};
P.lv=function(w=95,d=72.5){
 const brick='#acada6';this.block(0,0,w,d,21.4,5,brick,false,15);
 // Original photo: three-storey recessed vertical glazing, fourth-floor small windows,
 // continuous fifth-floor glazing below a deep, low-pitched grey tiled roof.
 for(let side of[-1,1]){
  for(let i=0;i<15;i++){let x=-w/2+5+i*(w-10)/14;this.box(x,8.2,side*(d/2+.26),3.9,13.6,.32,'#373f40',9,.8);for(let k=0;k<3;k++)this.window(x,3.85+k*4.05,side*(d/2+.46),3.24,3.45,side<0?Math.PI:0,'#727c7c');this.window(x,17.1,side*(d/2+.31),2.7,2.8,side<0?Math.PI:0,'#596263')}
  this.box(0,19.35,side*(d/2+.18),w,1.8,.38,brick,1,.8);
  for(let i=0;i<19;i++)this.window(-w/2+3+i*(w-6)/18,21.7,side*(d/2+.3),3.5,3.2,side<0?Math.PI:0,'#576467');
 }
 this.hip(0,23.6,0,w+8,d+8,4.4);this.box(0,23.1,0,w+7,.48,d+7,'#d4ceba',10,1.7);
 this.lettering('吕志和楼  LUI CHE WOO BUILDING',0,19.35,d/2+.43,34,1.1,0,'#eeeade');
 this.steps(0,d/2+3,18,5,.9);this.window(0,3.5,d/2+.5,8,5.5,0,'#899490');
};
P.jinguang=function(w,d){this.block(0,0,w,d,19.5,4,'#d5d0bb',false,13);this.box(0,22,0,w-3,4.1,d-4,'#dddbc8',13,1.2);this.windows(0,0,w-3,24,d-4,5,12,true);this.hip(0,24.2,0,w+8,d+8,5.0);for(let x of[-w*.42,w*.42])this.box(x,12.6,d/2+1,1.0,24,2,'#c8c7b7',10,1);this.lettering('金光生命科学学院大楼',0,19.1,d/2+1.2,31,1.4);this.steps(0,d/2+5,25,6,1.4)};
P.jiayuan=function(w=87.5,d=77.5){
 this.solid(0,0,w,d);this.box(0,11.4,0,w,22.8,d,'#a8aaa4',1,.65);this.box(0,.5,0,w+1,1,d+1,'#c6c7bc',10);
 // Four levels: high recessed portal, long upper loggia, side slit windows, central tiled roof.
 for(let s of[-1,1]){this.local(0,0,s*d/2,s<0?Math.PI:0,()=>{
  this.box(0,17.1,.23,w*.66,3.3,.4,C.glass,5,.85);for(let x=-w*.30;x<=w*.30;x+=4.2)this.window(x,17.1,.43,3.5,2.95,0,'#697373');
  for(let i=-3;i<=3;i++){let x=i*7.9;this.box(x,7.6,.25,4.1,13.2,.4,'#424b4a',9,.8);for(let f=0;f<3;f++)this.window(x,3.0+f*4.2,.47,3.55,3.65,0,'#747e7e');this.box(x-2.4,7.8,.5,.35,13.7,.75,'#d2d1c5',10,.9)}
  for(let x of[-w*.44,-w*.40,w*.40,w*.44])this.window(x,10.2,.37,.75,14.8,0,'#757f7d',false);
  this.lettering('家园食堂',0,20.6,.41,15,1.35,0,'#dad8c9');this.window(0,2.8,.57,8,4.9,0,'#94a09b');
 })}
 for(let s of[-1,1])this.local(s*w/2,0,0,s*Math.PI/2,()=>{for(let k=0;k<4;k++)for(let j=0;j<10;j++)this.window(-d*.42+j*d*.093,3.0+k*4.8,.28,d*.066,3.5,0,'#65716f');this.box(0,4.2,2,d*.75,.23,5,'#9eaba8',9,1)});
 this.box(0,23.0,0,w-.8,.25,d-.8,'#8a928c',7,1.5);this.parapet(0,23.2,0,w,d,'#aaaea7',1.2);this.hip(0,23.2,-5,w*.71,d*.67,5.2);this.steps(0,d/2+3.8,20,5,.85);
 for(let s of[-1,1]){this.box(s*(w*.37),.2,d/2+4.5,w*.20,.3,6,'#77905c',0);for(let i=0;i<10;i++)this.box(s*(w*.37)-w*.09+i*w*.018,1.2,d/2+7.5,.07,1.9,.08,'#7b8780',9);this.box(s*(w*.37),2.2,d/2+7.5,w*.2,.08,.10,'#7b8780',9)}
 this.lettering('郑格如楼',w*.42,21.0,d/2+.45,6,1.0,0,'#535951');
};
P.nongyuan=function(w,d){this.block(0,0,w,d,13.5,3,'#c5c8bd',false,8);this.local(w*.29,0,-d*.25,0,()=>this.block(0,0,w*.4,d*.45,15.5,3,'#c6c9bf',false,4));this.box(-w*.12,7,d/2+.23,w*.67,11,.4,C.glass,5,.8);for(let i=0;i<7;i++)this.box(-w*.44+i*w*.105,7,d/2+.53,.18,11.1,.2,'#b8c3bf',9,.9);this.box(-w*.12,4.8,d/2+2.3,w*.72,.28,5,'#bdc8c4',9,1);this.lettering('农园',-w*.12,12.1,d/2+.57,7,1.7,0,'#823e2e');this.steps(-w*.12,d/2+4,w*.66,4,.75)};
P.dining=function(p,w,d){let v=p.variant,f=p.floors||2,h=p.h;this.block(0,0,w,d,Math.max(4,h-1.5),f,v==='tongyuan'?'#dad1b9':v==='songlin'?'#b8b5a4':'#c9c9bb',v==='xueyi'||v==='tongyuan',Math.max(3,Math.round(w/4.6)));let n=v==='xueyi'?3:1;for(let i=0;i<n;i++){let x=n===1?0:(i-1)*w*.29;this.window(x,2.0,d/2+.25,Math.min(4.8,w*.24),3.3,0,'#61756e');this.box(x,3.85,d/2+1.5,Math.min(8,w*.3),.23,3.2,v==='songlin'?'#82624d':'#aeb7ae',9,1);this.steps(x,d/2+3,Math.min(7,w*.3),3,.5)}this.lettering(p.name,0,h-.9,d/2+.35,Math.min(w*.65,22),1.4,0,v==='xuewu'?'#913f32':'#5a5f50');
 // Air-handling equipment only as generic service details, not a claimed measured roof plan.
 if(v!=='xueyi'&&v!=='tongyuan')for(let x of[-w*.23,w*.23]){this.box(x,h,-d*.24,3.3,1.5,2.0,'#9da6a2',9,1.5);this.cyl(x,h+.8,-d*.24,.65,.22,'#616d68',12,1,9,1.5)}
};
P.science=function(p,w,d){let f=p.floors||5,h=p.h;const arm=Math.min(w*.23,d*.29,20);if(p.layout==='ring'||p.type==='humanities'){this.block(0,-d/2+arm/2,w,arm,h,f,'#c6c9be',true);this.block(0,d/2-arm/2,w,arm,h*.88,f,'#cecec2',true);this.block(-w/2+arm/2,0,arm,d-arm*2,h,f,'#c6c9be',true);this.block(w/2-arm/2,0,arm,d-arm*2,h,f,'#c6c9be',true);this.box(0,.3,0,w-arm*2,.25,d-arm*2,'#90a476',0)}else if(p.layout==='comb'){this.block(0,-d*.27,w,d*.4,h,f,'#c7cbc2',false);for(let x of[-w*.38,0,w*.38])this.block(x,d*.11,w*.20,d*.65,h,f,'#c7cbc2',false)}else{this.block(-w*.16,0,w*.68,d,h,f,'#c6c8c0',false);this.block(w*.33,d*.25,w*.30,d*.50,h*.78,f-1,'#c6c8c0',false)}this.lettering(p.name,0,h-1,d/2+.35,Math.min(26,w*.65),1.3)};
P.luce=function(){this.solid(0,0,14,14);this.cyl(0,0,0,8,.65,C.stone,8,1,10);this.cyl(0,.65,0,6.4,4.6,'#c7c0a9',8,1,13,.6);for(let i=0;i<8;i++){let a=(i+.5)*Math.PI/4;this.local(Math.sin(a)*6.04,0,Math.cos(a)*6.04,a,()=>{this.window(0,3,0,4.25,3.3,0,C.red);for(let x of[-2.34,2.34])this.box(x,3,0,.26,4.8,.34,C.red,6,1)})}this.mesh('luceOctRoof',this.geo('luceOctRoof',()=>G.pagoda(8)),0,5.4,0,8.9,3.1,8.9,C.roof,2,2);this.cyl(0,8.1,0,.24,.3,C.roof,8,.7,2,2);this.steps(0,8.7,4.5,4,.65)};
P.pitch=function(w,d){
 for(let i=0;i<12;i++)this.box(0,.32,-d/2+d/12*(i+.5),w,.06,d/12,i%2?'#759454':'#688a4c',0);
 const line=(pts,width=.14)=>this.mesh('sportLine'+this.id+'_'+this.e.buckets.size+'_'+pts.flat().join('_'),G.ribbon(pts,width,.39),0,0,0,1,1,1,'#e2e5d8',10,0);
 line([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[-w/2,-d/2]]);line([[-w/2,0],[w/2,0]]);let rad=Math.min(9.15,w*.15);line(Array.from({length:65},(_,i)=>[Math.cos(i*Math.PI/32)*rad,Math.sin(i*Math.PI/32)*rad]));for(let side of[-1,1]){let z=side*d/2,bw=Math.min(w*.6,40.32),bd=Math.min(d*.16,16.5);line([[-bw/2,z],[-bw/2,z-side*bd],[bw/2,z-side*bd],[bw/2,z]]);line([[-9.16,z],[-9.16,z-side*5.5],[9.16,z-side*5.5],[9.16,z]]);for(let x of[-3.66,3.66]){this.beam([x,.4,z],[x,2.84,z],.065,'#e1e6da',9);this.beam([x,.4,z+side*2],[x,2.84,z],.045,'#dce1d5',9)}this.beam([-3.66,2.84,z],[3.66,2.84,z],.065,'#e1e6da',9);for(let x=-3.6;x<=3.6;x+=.4)this.beam([x,.4,z+side*2],[x,2.84,z],.012,'#c5d0c2',10);for(let k=0;k<5;k++)this.beam([-3.66,.4+k*.5,z+side*2*(1-k/5)],[3.66,.4+k*.5,z+side*2*(1-k/5)],.012,'#c5d0c2',10)}
};
P.fence=function(w,d,h=3.4){for(let s of[-1,1])for(let x=-w/2;x<=w/2;x+=5){this.cyl(x,0,s*d/2,.046,h,'#667366',8,1,9);if(x+5<=w/2){for(let y of[.4,1.8,h])this.beam([x,y,s*d/2],[x+5,y,s*d/2],.018,'#71836d',9)}}for(let s of[-1,1])for(let z=-d/2;z<=d/2;z+=5){this.cyl(s*w/2,0,z,.045,h,'#667366',8,1,9);if(z+5<=d/2)for(let y of[.4,1.8,h])this.beam([s*w/2,y,z],[s*w/2,y,z+5],.018,'#71836d',9)}};
P.field=function(w,d){this.solid(0,0,w,d);this.box(0,.2,0,w,.2,d,'#66854a',0);this.pitch(w-6,Math.min(112,d-8));this.fence(w+1,d+1,4);let rear=-d/2+15;this.box(0,.29,rear,w-5,.04,26,'#768b50',0);for(let side of[-1,1]){this.cyl(side*(w/2+2),0,0,.16,12,'#8b9691',10,1,9);this.box(side*(w/2+2),12,0,2,1,.3,'#c3c9bd',12)}};
P.gym=function(w,d,h){
 const mainD=83,z0=-18;this.solid(0,z0,w,mainD);this.box(0,7,z0,w*.91,14,mainD*.91,'#c0c4bd',14,.6);this.windows(0,z0,w*.91,14,mainD*.91,2,16,true);
 // Continuous two-fold spiral surface, panel seams and a central glazed ball.
 const surf=(t,a)=>{let rr=(w/2+1)*t,corner=.92+.07*Math.cos(4*a);let x=Math.cos(a)*rr*corner,z=z0+Math.sin(a)*rr*corner;let ridge=Math.pow(.5+.5*Math.cos(2*a+3.6*t),9);let y=13+8*Math.pow(1-t,.7)+ridge*6*Math.sin(t*Math.PI*.8);return[x,y,z]};
 let gg=new G.Geometry();for(let i=0;i<100;i++)for(let j=0;j<25;j++){let a=i/100*2*Math.PI,b=(i+1)/100*2*Math.PI,t=.10+j*.9/25,s=.10+(j+1)*.9/25;let A=surf(t,a),B=surf(t,b),C1=surf(s,b),D=surf(s,a);gg.quad(D,C1,B,A)}this.mesh('qiuSpiralRoof',gg,0,0,0,1,1,1,'#b7bfc0',9,2);
 for(let i=0;i<58;i++){let a=i/58*Math.PI*2,prev=surf(.1,a);for(let j=1;j<=15;j++){let p=surf(.1+j*.9/15,a);this.beam(prev,p,.055,'#e0e2db',9,2);prev=p}}
 for(let side of[0,Math.PI]){let prev=null;for(let j=0;j<=60;j++){let t=.14+j*.86/60,a=side-1.8*t,p=surf(t,a);p[1]+=.12;if(prev)this.beam(prev,p,.35,'#b3bcbc',9,2);prev=p}}
 this.sphere(0,22.5,z0,5.8,5.8,5.8,'#7b929d',5,2.5,true);for(let i=0;i<10;i++){let a=i/10*Math.PI*2,prev=null;for(let j=0;j<=16;j++){let v=j/16*Math.PI,p=[Math.sin(v)*Math.cos(a)*5.86,22.5+Math.cos(v)*5.86,z0+Math.sin(v)*Math.sin(a)*5.86];if(prev)this.beam(prev,p,.045,'#dce3df',9,2.5);prev=p}}
 // Low swimming annexe, south of the main hall in real-world orientation.
 this.local(0,0,43,0,()=>{this.block(0,0,w*.89,35,8.9,2,'#bdc5bd',false,14);this.box(0,10.0,0,w*.94,.65,37,'#acb6b5',9,2);for(let i=0;i<8;i++)this.box(-w*.37+i*w*.105,10.5,-2,w*.085,.2,21,'#465d6a',5,2)});
 this.lettering('邱德拔体育馆',0,10.8,z0-mainD*.456-.25,29,1.7,Math.PI,'#e8ebe3');this.steps(0,z0-mainD/2-2,26,6,1.2);
};
// Leaf cards have independent geometry and analytic leaf silhouettes in the shader.
P.tree=function(x,z,h=13,type='broad',id){let old=[this.origin,this.rotation,this.id,this.anim];this.origin=[x,0,z];this.rotation=(id*.618)%6.28;this.id=id;this.anim=0;const branch=(a,b,r)=>this.beam(a,b,r,'#756e5b',6);
 this.cyl(0,0,0,.22+h*.009,h*.57,'#777260',9,.55,6);for(let j=0;j<7;j++){let a=j*2.4,p=[Math.cos(a)*h*.20,h*(.48+j*.028),Math.sin(a)*h*.20];branch([0,h*.32,0],p,.10);branch(p,[p[0]*1.5,p[1]+h*.14,p[2]*1.5],.055)}
 const variant=id%4,key='leaves_'+type+variant,geo=this.geo(key,()=>{let g=new G.Geometry(),R=M.rng(1701+variant),count=340;for(let i=0;i<count;i++){let a=R()*6.283,u=R()*2-1,rr=Math.pow(R(),.30),q=Math.sqrt(1-u*u),center=[Math.cos(a)*q*.38*rr,.71+u*.31*rr,Math.sin(a)*q*.35*rr];if(type==='willow'){center[1]=.55+R()*.43;center[0]*=1.13;center[2]*=1.13}let n=M.norm([R()-.5,R()-.23,R()-.5]),side=M.norm(M.cross(n,Math.abs(n[1])>.9?[1,0,0]:[0,1,0])),up=M.cross(n,side),sz=.024+R()*.025;let pt=(xx,yy)=>M.add(center,M.add(M.mul(side,xx*sz),M.mul(up,yy*sz)));g.quad(pt(-1,-1),pt(1,-1),pt(1,1),pt(-1,1),n)}return g});this.anim=1;this.mesh(key,geo,0,0,0,h,h,h,['#62834d','#789052','#567b48','#899659'][variant],16);this.registry.set(id,{id,name:type==='willow'?'临水垂柳':'校园乔木',en:'Landscape planting · original geometry',type:'tree',zone:'景观',center:[x,0,z],h,radius:h*.55,level:'景观植被',source:'visit',desc:'树干、分枝和独立叶片簇构成的原创景观树；摆动随环境动画变化。位置不是树木普查数据。',materials:'树皮、枝条、叶片',detail:'叶片几何与叶缘遮罩；景观配置非实测。'});[this.origin,this.rotation,this.id,this.anim]=old;
};
})(YY);
