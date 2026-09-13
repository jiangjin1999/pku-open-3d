/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v5 everyday-campus architecture. Source-driven identities; estimated dimensions are
   documented on every object. Unseen sides are not presented as surveyed replicas. */
(function(Y){'use strict';const {Builder:B,COLORS:C,Geo:G,M}=Y,P=B.prototype;
const brick='#93958e',trim='#c7c5ba',frame='#4b5655';
P.drainpipes=function(w,d,h){for(let sx of[-1,1])for(let sz of[-1,1]){let x=sx*(w/2+.14),z=sz*(d/2-.7);this.cyl(x,.55,z,.058,h,'#68706a',8,1,9,.8);for(let yy=2;yy<h;yy+=3.8)this.box(x,yy,z,.18,.06,.18,'#7d847e',9,.8)}};
P.entry=function(w,z,height=4.5,title='',stair=1.0){
 this.box(0,height/2+stair,z+.16,w,height,.22,'#263331',9,.65);
 for(let x=-w/2+.9;x<w/2;x+=1.8)this.window(x,height/2+stair,z+.40,1.64,height-.12,0,'#674e43');
 for(let s of[-1,1]){this.box(s*(w/2+.42),height/2+stair,z+.28,.62,height+.25,.66,trim,10,.8);this.box(s*(w/2+.5),stair*.55,z+2.0,.6,stair*1.1,3.4,trim,10,.2)}
 this.box(0,height+stair+.36,z+1.05,w+2.3,.24,2.4,'#949f9b',9,1.2);this.steps(0,z+3.3,w+1.6,6,stair);this.noPlant(0,z+2,w+4,5.0);
 if(title)this.lettering(title,0,height+stair+1.4,z+.44,Math.min(w+9,26),1.22,0,'#663d34');
};
P.studentcenter=function(p,w,d){
 // Central opening and two flanking masses: not one box with a painted entrance.
 const f=d/2,wing=w*.31,cw=w-wing*2;
 this.block(0,-d*.18,w,d*.64,21.0,5,brick,true,Math.round(w/4.6));
 for(let side of[-1,1]){const x=side*(w-wing)/2;this.solid(x,d*.32,wing,d*.36);this.box(x,8.7,d*.32,wing,16.7,d*.36,brick,1,.75);this.box(x,17.16,d*.32,wing+.8,.25,d*.36+.8,trim,10,1.4);
  // Side windows only; the paired tall front glazing below is the only front system.
  for(let yy of[4.4,9.5,14.6])for(let iz=0;iz<4;iz++)this.window(x+side*(wing/2+.16),yy,d*.16+iz*d*.09,2.45,3.0,side*Math.PI/2,frame);
 }
 this.solid(0,d*.32,cw,d*.36);this.box(0,11.25,d*.32,cw,11.4,d*.36,brick,1,.7);
 this.box(0,18.0,f-.7,w,.65,2.0,trim,10,1.6);
 // White plinth, paired tall recessed glazing, thin stone belt from the viewed front photo.
 for(let s of[-1,1]){this.box(s*(cw/2+wing/2),1.65,f+.18,wing,3.0,.48,'#cccfc8',10,.5);
  for(let i=0;i<4;i++){let x=s*(cw/2+2.5+i*(wing-5)/3);this.box(x,9.75,f+.16,2.65,12.0,.18,'#283532',9,.7);for(let yy of[6.2,12.0])this.window(x,yy,f+.39,2.28,5.08,0,'#34443d');this.box(x,1.6,f+.47,1.4,2.2,.06,'#3d4640',5,.7)}
 }
 this.box(0,9.08,f+.42,w,.54,.28,'#d2d2c8',10,1.0);
 this.window(0,12.0,f+.41,cw*.72,4.9,0,'#33483e');
 for(let x=-cw*.32;x<cw*.34;x+=2.2)this.box(x,12.0,f+.57,.065,4.8,.06,'#829187',9,.8);
 this.box(0,3.45,f-.8,cw*.74,5.7,.32,'#2b3732',5,.7);
 for(let x of[-3.1,0,3.1])this.window(x,4.5,f+.16,2.8,4.6,0,'#684a3c');
 this.box(0,7.2,f+.3,cw*.76,.26,.4,trim,10,1.1);
 this.steps(0,f+5.6,cw*.85,10,2.45);
 for(let s of[-1,1]){this.box(s*cw*.48,1.5,f+2.9,1.0,2.8,5.8,'#c9ccc5',10,.3);this.box(s*cw*.48,3.02,f+2.9,1.27,.20,6.0,'#e0e1d6',10,.3)}
 this.lettering('新太阳学生中心',0,16.05,f+.5,26,1.36,0,'#7d4135');
 this.noPlant(0,f+3.2,cw+5,9);this.drainpipes(w,d,17.8);
};
P.teaching2=function(p,w,d){
 // Explicit L: courtyard is empty and accessible, not an opaque solid rectangle.
 const dep=d*.32,arm=w*.19;
 this.block(0,-d/2+dep/2,w,dep,p.h,5,brick,true,Math.round(w/4.7));
 this.local(-w/2+arm/2,0,dep/2,Math.PI/2,()=>this.block(0,0,d-dep,arm,p.h-2.5,4,'#999b94',true,Math.round((d-dep)/4.7)));
 this.box(w*.08,.19,d*.07,w*.70,.32,d*.54,'#b9b8ab',7);
 this.local(w*.01,0,-d/2+dep,0,()=>this.entry(9,0,4.8,'李兆基公共教学楼',.85));
 this.lettering('第二教学楼',w*.24,p.h-2.0,-d/2+dep+.20,20,1.1,0,'#704f43');
 this.drainpipes(w,dep,p.h);
};
P.lowTeaching=function(p,w,d){
 const H=p.h-.7,N=p.floors,fh=H/N;
 const wing=(ww,dd)=>{
  this.solid(0,0,ww,dd);this.box(0,H/2,0,ww,H,dd,'#aaa69a',1,.55);
  // Upper floor is the continuous white band in the university photograph.
  this.box(0,H-fh/2,0,ww+.06,fh,dd+.06,'#dbddd1',10,.7);
  for(const side of[-1,1])for(let j=0;j<N;j++)for(let x=-ww/2+2.1;x<ww/2-1;x+=4.15){
   this.window(x,(j+.53)*fh,side*(dd/2+.12),2.8,fh*.57,side<0?Math.PI:0,'#657570');
   this.box(x,(j+.53)*fh-fh*.33,side*(dd/2+.25),3.0,.12,.45,'#c3c6bb',10,.9);
  }
  this.hip(0,H+.25,0,ww+2.1,dd+2.1,1.1);
 };
 if(p.id===74){
  wing(w,d);
  // Northeast glazed staircase and white entrance canopy in the viewed photo.
  const x=w/2-.18,z=-d/2+4.8,sw=8.8;
  this.box(x+.24,H/2,z,.18,H,sw,'#8aaba5',5,.85);
  for(let j=0;j<=N*2;j++)this.box(x+.36,j*H/(N*2),z,.12,.09,sw,'#788b81',9,1);
  for(let j=-2;j<=2;j++)this.box(x+.36,H/2,z+j*sw/4,.12,H,.10,'#7a8d83',9,1);
  this.box(w/2-4.8,H/2,-d/2-.14,9.4,H,.18,'#8aaba5',5,.85);
  for(let j=0;j<=N*2;j++)this.box(w/2-4.8,j*H/(N*2),-d/2-.26,9.4,.09,.10,'#788b81',9,1);
  for(let j=0;j<=4;j++)this.box(w/2-9.3+j*2.25,H/2,-d/2-.26,.10,H,.10,'#7a8d83',9,1);
  this.local(0,0,d/2,0,()=>{this.entry(7.3,0,3.8,'刘卿楼',.4);this.box(0,4.85,1.1,10.5,.5,4,'#e0e0d4',10,1.2);});
  this.local(0,0,-d/2-.18,Math.PI,()=>this.lettering('刘 卿 楼',0,H*.69,.1,10,1.1,0,'#63736d'));
 }else{
  this.local(0,0,0,Math.PI/2,()=>wing(d,w));
  this.local(-w/2,0,0,-Math.PI/2,()=>this.entry(6.0,0,3.8,'第四教学楼',.4));
 }
};
P.heren=function(p,w,d){
 const draw=(ww,dd)=>{
 this.block(0,0,ww,dd,p.h,p.floors,'#969991',true,Math.max(4,Math.round(ww/4.8)));
 for(let s of[-1,1]){for(let yy of[.8,4.6,8.7,p.h+.8])this.box(0,yy,s*(dd/2+.21),ww,.18,.28,'#c4c5ba',10,1.0);
  for(let x=-ww/2+1.8;x<ww/2;x+=4.9)this.box(x,p.h*.5+.5,s*(dd/2+.1),.2,p.h,.18,'#b0b1a7',1,.9)}
 const no=String(p.id-100);this.entry(4.5,dd/2,3.7,no+'号楼',.7);
 this.lettering(p.id<=121?'河仁苑':p.id===122?'外国哲学研究所':p.id===124?'全球健康发展研究院':'23号楼',0,p.h-1.15,dd/2+.35,Math.min(ww*.64,24),1.0,0,'#775749');
 this.drainpipes(ww,dd,p.h);
 };
 if(d>w)this.local(0,0,0,Math.PI/2,()=>draw(d,w));else draw(w,d);
};
P.fang=function(p,w,d){
 this.block(0,-d*.06,w,d*.88,p.h,p.floors,'#a6a89e',true,Math.round(w/5.6));
 for(let s of[-1,1]){this.box(s*w*.38,8.0,d*.40,6.8,15.2,2.5,'#c3c2b5',10,.85);for(let yy=3.5;yy<15;yy+=3.8)this.window(s*w*.38,yy,d*.40+1.4,4.8,2.9,0,'#575e55')}
 this.entry(9,d*.38,5.2,'方李邦琴楼',1.0);
 this.lettering('对外汉语教育学院',0,12.65,d*.38+.25,25,1.25,0,'#735845');
 this.drainpipes(w,d*.88,p.h);
};
P.canteen=function(p,w,d){
 const compact=p.type==='songlin',yn=p.type==='yannanfood',xue=p.type==='xueyi',h=p.h;
 if(xue){this.block(0,0,w*.48,d,h,1,'#b7b5a7',true,9);for(let s of[-1,1])this.block(s*w*.37,0,w*.26,d*.87,h-.7,1,'#aaaea2',true,4)}
 else this.block(0,0,w,d,h,p.floors||2,compact?'#92978c':'#aeb0a5',!compact,Math.max(5,Math.round(w/4.5)));
 const n=compact?3:yn?3:2;for(let i=0;i<n;i++)this.local((i-(n-1)/2)*w/(n+.5),0,0,0,()=>this.entry(compact?4.4:5.0,d/2,compact?3.3:3.7,'',.5));
 this.box(0,compact?h+.2:3.8,d/2+1.2,w-.8,.14,2.2,'#79877d',9,1.2);
 this.lettering(compact?'松林快餐':yn?'燕南食堂':'学一食堂',0,h-.7,d/2+.26,Math.min(24,w*.42),1.2,0,'#754e3c');
 this.drainpipes(w,d,h);this.noPlant(0,d/2+2.2,w,5.5);
};
P.nongyuan=function(w,d){
 const h=16.2;this.block(0,-d*.04,w,d*.92,h,3,'#b9b8aa',false,Math.round(w/5.7));
 // North entrance (whole model rotates by pi); 2025 report supports three storeys.
 const front=d*.42;
 for(let side of[-1,1]){this.box(side*w*.42,h*.5+.65,front+1.1,w*.14,h,3.6,'#a0a496',1,.75);
  for(let f=0;f<3;f++)this.window(side*w*.42,3.0+f*5.25,front+3.01,w*.105,3.8,0,'#5a665c')}
 for(let f=1;f<3;f++){this.box(0,f*5.25+.60,front+.42,w,.26,.55,'#e0dacc',10,1.0);this.box(0,f*5.25+.44,-d*.50,w,.13,.35,'#999d92',10,1.0)}
 this.entry(12,front+.22,4.9,'农园食堂',.85);
 this.box(0,h+1.8,-d*.05,w*.75,1.2,d*.66,'#9da397',7,1.5);
 for(let x of[-w*.29,w*.29]){this.box(x,h+2.85,-d*.2,6.0,1.5,8.3,'#8b9592',9,1.6);for(let j=0;j<6;j++)this.box(x,h+3.61,-d*.2-3.5+j*1.35,5.7,.12,.3,'#63716d',9,1.6)}
 this.drainpipes(w,d*.92,h);this.noPlant(0,front+3.5,w*.7,8);
};
P.historymuseum=function(p,w,d){
 this.block(0,-d*.08,w,d*.84,5.4,1,'#bbbbae',true,9);
 this.entry(8,d*.34,3.7,'北京大学校史馆',.85);
 for(let s of[-1,1])this.box(s*w*.40,3.5,d*.35,5.6,5.2,.8,'#c1bfae',10,.9);
 this.noPlant(0,d*.42+2,w,5);
};
})(YY);
