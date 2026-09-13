/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v6 district repairs. Distinct, inspectable geometry; schematic envelopes are NOT
   surveyed building plans. Clinical and service entrances are model approach points. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo;
const pale='#c6c6ba',edge='#d3d3c9',shadow='#77827f',metal='#68716d';
P.scienceOne=function(p,w,d){
 // Same pale tiled walls, steep roof planes and roof glazing family as No.2.
 // The separate courtyard plan is retained; it is not a duplicate of No.2.
 const arm=w*.19,bar=d*.22,h=22.2;
 this.noPlant(0,0,w+3,d+3);
 for(const side of[-1,1])this.local(0,0,side*(d-bar)/2,0,()=>{this.s19Wall(w,bar,h,5,18);this.s19Roof(w,bar,h+.55,7.6,18,2.6);});
 for(const side of[-1,1])this.local(side*(w-arm)/2,0,0,Math.PI/2,()=>{this.s19Wall(d-2*bar,arm,h,5,10);this.s19Roof(d-2*bar,arm,h+.55,7.6,10,2.6);});
 this.box(0,.13,0,w-2*arm,.15,d-2*bar,'#aab19c',7);
 this.box(0,.23,0,5,.12,d-2*bar,'#c1c3b6',7);
 this.entry(10,d/2,4.2,'理科一号楼',.65);
};
P.scienceTeaching=function(p,w,d){
 const wing=w*.20,bar=d*.20;
 this.block(0,-d/2+bar/2,w,bar,p.h,5,'#c0c0b4',false,Math.round(w/4.9));
 for(let s of[-1,1])this.block(s*(w-wing)/2,bar/2,wing,d-bar,p.h-.6,5,'#c7c6b9',false,4);
 this.block(0,d*.03,w-wing*2,d*.16,p.h-5,4,'#bbbeb2',false,Math.round(w*.6/4.9));
 this.block(0,d/2-bar/2,w-wing*2,bar,p.h-1.5,5,'#c8c7ba',false,Math.round(w*.6/4.9));
 for(let s of[-1,1]){this.box(0,.2,s*d*.24,w-wing*2-.8,.17,d*.19,'#a4ad97',0);this.noPlant(0,s*d*.24,w-wing*2,d*.2);}
 this.entry(9,d/2,4.1,'黄廷方楼',.7);
 this.lettering('理科教学楼',-w*.29,p.h-1.6,d/2+.27,16,1.05,0,'#665d50');
 for(let s of[-1,1])for(let i=0;i<4;i++){let x=s*(w*.32+i*w*.047);this.box(x,p.h*.5,d/2+.28,.36,p.h-1.6,.42,'#dddbce',10,1);}
 this.drainpipes(w,d,p.h);this.noPlant(0,d/2+2,15,6);
};
P.campusHospital=function(p,w,d){
 // A low-rise multi-wing envelope, not an invented room-by-room medical facility.
 const spine=w*.26,short=d*.24;
 this.block(-w/2+spine/2,0,spine,d,p.h,4,'#c5c5bb',false,4);
 this.block(spine/2,-d/2+short/2,w-spine,short,p.h-2,4,'#c7c8bf',false,Math.round(w/5));
 this.block(spine/2,d/2-short/2,w-spine,short,p.h-2,4,'#c7c8bf',false,Math.round(w/5));
 this.block(spine/2,0,w-spine,d*.28,p.h-3,4,'#c7c8bf',false,Math.round(w/5));
 this.local(w/2,0,0,Math.PI/2,()=>{this.entry(9,0,4.2,'北京大学医院',.6);this.box(0,5.2,1.35,16,.21,3.3,'#8faaa7',9,1.4);});
 for(let z of[-d*.23,d*.23]){this.box(w*.08,.2,z,w*.59,.18,d*.20,'#a7b196',0);this.noPlant(w*.08,z,w*.58,d*.20);}
 this.drainpipes(w,d,p.h-2);
 this.noPlant(w/2+2,0,8,22);
};
P.songlinCompact=function(p,w,d){
 this.block(0,0,w,d,p.h,1,'#acafa4',false,3);
 // A short compact shop front with one entrance, two service windows and thin fascia.
 this.entry(3.1,d/2,2.55,'',.34);
 for(let s of[-1,1])this.window(s*w*.30,2.22,d/2+.21,w*.23,2.3,0,'#64736b');
 this.box(0,p.h-.08,d/2+.23,w+.4,.8,.47,'#64766b',9,1.1);
 this.lettering('松林快餐',0,p.h-.04,d/2+.5,9.2,.8,0,'#e9e4d2');
 this.box(0,3.3,d/2+1.04,w-.3,.12,2.0,'#7b8b80',9,1.2);
 this.box(-w*.29,.82,d/2+.6,w*.22,.19,.72,'#b9b9a9',10,.7);
 this.box(w*.29,.82,d/2+.6,w*.22,.19,.72,'#b9b9a9',10,.7);
 this.drainpipes(w,d,p.h);this.noPlant(0,d/2+2.0,w+2,5);
};
P.sportsFence=function(w,d,gate='south'){
 const h=3.0,c='#708377';
 // Edges are split at access gates; no continuous mesh across the doorway.
 const edges=[{a:[-w/2,-d/2],b:[w/2,-d/2],key:'north'},
 {a:[w/2,-d/2],b:[w/2,d/2],key:'east'},
 {a:[w/2,d/2],b:[-w/2,d/2],key:'south'},
 {a:[-w/2,d/2],b:[-w/2,-d/2],key:'west'}];
 for(const {a,b,key}of edges){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),u=[(b[0]-a[0])/L,(b[1]-a[1])/L];
 const ranges=key===gate?[[0,L/2-1.0],[L/2+1.0,L]]:[[0,L]];
 for(let [s,e]of ranges){const at=(t,y)=>[a[0]+u[0]*t,y,a[1]+u[1]*t];
  for(let yy of[.55,1.4,2.2,3.05])this.beam(at(s,yy),at(e,yy),yy===3.05?.027:.013,c,9,.15);
  let n=Math.max(1,Math.ceil((e-s)/3));for(let j=0;j<=n;j++){let q=at(s+(e-s)*j/n,0);this.cyl(q[0],0,q[2],.048,h+.15,c,8,1,9,.1);}
  for(let j=s+.3;j<e;j+=.55){this.beam(at(j,.4),at(j,3.02),.009,c,9,.1);}
 }
 }
};
P.basketball=function(p,w,d){
 this.solid(0,0,w+1.2,d+1.2);this.noPlant(0,0,w+2.4,d+3);
 this.box(0,.25,0,w,.18,d,'#ac7763',11);
 const cw=Math.min(15,w-1.1),cd=Math.min(28,d-2.5),white='#e6e1cc';
 this.box(0,.36,0,cw,.045,cd,'#7f9783',11);
 let serial=0;const line=(pts,width=.08)=>this.mesh('v6-basket-line-'+p.id+'-'+serial++,G.ribbon(pts,width,.398),0,0,0,1,1,1,white,10);
 line([[-cw/2,-cd/2],[cw/2,-cd/2],[cw/2,cd/2],[-cw/2,cd/2],[-cw/2,-cd/2]]);
 line([[-cw/2,0],[cw/2,0]]);
 const arc=(cx,cz,r,a,b,n=32)=>Array.from({length:n+1},(_,i)=>[cx+Math.cos(a+(b-a)*i/n)*r,cz+Math.sin(a+(b-a)*i/n)*r]);
 line(arc(0,0,1.8,0,Math.PI*2,48));
 for(let s of[-1,1]){let end=s*cd/2,ft=end-s*5.8,rim=end-s*1.58;
  this.box(0,.375,end-s*2.9,4.9,.028,5.8,'#ad7964',11);
  line([[-2.45,end],[-2.45,ft],[2.45,ft],[2.45,end]]);line(arc(0,ft,1.8,s>0?Math.PI:0,s>0?2*Math.PI:Math.PI));
  // 3-point arc and corner lines fitted to standard court width.
  let a=s>0?Math.PI:0;line(arc(0,rim,6.75,a,a+Math.PI,48));
  for(let x of[-6.75,6.75])line([[x,end],[x,rim]]);
  let pole=end+s*.95;this.box(0,.62,pole,1.25,.52,1.5,'#727f73',9);
  this.cyl(0,.3,pole,.13,3.95,'#546a5c',12,1,9,.4);this.beam([0,3.75,pole],[0,3.75,end-s*1.15],.07,'#5c7163',9);
  this.box(0,3.44,end-s*1.15,1.8,1.05,.06,'#c5d4cb',9,.4);
  this.box(0,3.34,end-s*1.20,.60,.40,.015,'#586d64',9,.4);this.box(0,3.34,end-s*1.215,.49,.31,.015,'#d4ddd3',9,.4);
  // Ring is laid horizontally using individual segments, independent of torus convention.
  for(let j=0;j<20;j++){let t=j*Math.PI/10,u=(j+1)*Math.PI/10;
   this.beam([Math.cos(t)*.225,3.05,rim+Math.sin(t)*.225],[Math.cos(u)*.225,3.05,rim+Math.sin(u)*.225],.012,'#be7757',9,.5);
   if(j%2===0)this.beam([Math.cos(t)*.225,3.03,rim+Math.sin(t)*.225],[Math.cos(t+.25)*.14,2.63,rim+Math.sin(t+.25)*.14],.008,'#ccd1c5',10,.5);
  }
 }
 this.sportsFence(w+1.2,d+1.2,'south');
};
P.smallPitch=function(p,w,d){
 this.solid(0,0,w+1.2,d+1.2);this.noPlant(0,0,w+2.6,d+2.6);
 this.box(0,.25,0,w,.18,d,'#758e6b',0);
 const fw=w-3,fd=d-3;for(let i=0;i<8;i++)this.box(-fw/2+(i+.5)*fw/8,.36,0,fw/8,.03,fd,i%2?'#77976b':'#809d73',0);
 let n=0;const line=pts=>this.mesh('v6-futsal-'+p.id+'-'+n++,G.ribbon(pts,.1,.405),0,0,0,1,1,1,'#ece7d6',10);
 line([[-fw/2,-fd/2],[fw/2,-fd/2],[fw/2,fd/2],[-fw/2,fd/2],[-fw/2,-fd/2]]);line([[0,-fd/2],[0,fd/2]]);
 line(Array.from({length:41},(_,i)=>[Math.cos(i*Math.PI/20)*3,Math.sin(i*Math.PI/20)*3]));
 for(let s of[-1,1]){let x=s*fw/2;line([[x,-4],[x-s*6,-4],[x-s*6,4],[x,4]]);
  for(let z of[-1.5,1.5])this.beam([x,.45,z],[x,2.45,z],.055,'#dedfd3',10,.4);
  this.beam([x,2.45,-1.5],[x,2.45,1.5],.055,'#dedfd3',10,.4);
  for(let i=0;i<13;i++){let z=-1.5+i*.25;this.beam([x+s*.9,.45,z],[x,2.45,z],.01,'#bcc8b8',10,.4);}
 }
 this.sportsFence(w+1.2,d+1.2,'east');
};
P.netCourt=function(p,w,d){
 this.solid(0,0,w,d);this.noPlant(0,0,w+2,d+2);
 const tennis=p.type==='tennisCourt',cw=tennis?10.97:9,cd=tennis?23.77:18;
 this.box(0,.25,0,w,.18,d,tennis?'#7b9a80':'#b58b6e',11);
 this.box(0,.36,0,cw,.035,cd,tennis?'#668d7c':'#b99c7a',11);
 let n=0;const line=pts=>this.mesh('court26-line-'+p.id+'-'+n++,G.ribbon(pts,.08,.41),0,0,0,1,1,1,'#ebe6d4',10);
 line([[-cw/2,-cd/2],[cw/2,-cd/2],[cw/2,cd/2],[-cw/2,cd/2],[-cw/2,-cd/2]]);
 if(tennis){for(const x of[-4.115,4.115])line([[x,-cd/2],[x,cd/2]]);for(const z of[-6.4,6.4])line([[-4.115,z],[4.115,z]]);line([[0,-6.4],[0,6.4]]);}else{line([[-cw/2,0],[cw/2,0]]);for(const z of[-3,3])line([[-cw/2,z],[cw/2,z]]);}
 const nh=tennis?1.05:2.43;
 for(const x of[-cw/2-.55,cw/2+.55])this.cyl(x,.35,0,.07,nh,'#6b7e70',8,1,9,.2);
 for(let j=0;j<=4;j++)this.beam([-cw/2-.55,.35+nh-j*.14,0],[cw/2+.55,.35+nh-j*.14,0],j===0?.025:.009,'#d1d8c9',10,.2);
 for(let x=-cw/2-.5;x<cw/2+.5;x+=.32)this.beam([x,.35+nh,0],[x,.35+nh-.56,0],.009,'#849080',9,.2);
 this.sportsFence(w,d,'east');
};
})(YY);
