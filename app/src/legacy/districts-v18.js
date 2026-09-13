/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v18 / historic gymnasia and sports grounds.
 * Only photographed exterior motifs are reconstructed; proportions, lane count,
 * unphotographed faces and all model approach points remain explicitly inferred.
 * Both projected footprint and GPU picking use the canonical model transform.
 */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,PI=Math.PI;
const C={stone:'#9ca19b',joint:'#828d86',wall:'#e1ddd0',red:'#923e30',wood:'#914435',glass:'#46575a',blue:'#426778',green:'#43635c',gold:'#cbb991',line:'#e8e8da',turf:'#709650',track:'#b4705b',fence:'#496153'};
P.s18box=function(k,x,y,z,w,h,d,c,mat=10,part=.4){this.mesh(k,this.geo(k,G.box),x,y,z,w,h,d,c,mat,part);};
P.s18Window=function(x,y,z,w,h,r=0,tall=false,tag=null){this.local(x,y,z,r,()=>{
 this.s18box(tag||(tall?'v18-tall-window':'v18-gym-window'),0,0,-.005,w,h,.10,C.glass,5,.76);
 for(const xx of[-w/2,w/2])this.s18box('v18-window-frame',xx,0,.095,.13,h+.16,.20,C.wood,20,.80);
 for(const yy of[-h/2,h/2])this.s18box('v18-window-frame',0,yy,.095,w+.15,.14,.20,C.wood,20,.80);
 for(let i=1;i<4;i++)this.s18box('v18-window-mullion',-w/2+w*i/4,0,.10,.055,h,.14,C.red,20,.81);
 const rows=tall?6:3;for(let j=1;j<rows;j++)this.s18box('v18-window-mullion',0,-h/2+j*h/rows,.10,w,.055,.14,C.red,20,.81);
 this.s18box('v18-window-sill',0,-h/2-.18,.12,w+.42,.22,.62,'#b6b6a9',10,.72);
 });};
P.s18Base=function(w,d,h){this.s18box('v18-stone-base',0,h/2,0,w,h,d,C.stone,10,.16);
 // Mortar courses: exterior-only geometry, not falsely described as scan texture.
 for(const s of[-1,1])for(let y=.65;y<h-.15;y+=.65){this.s18box('v18-stone-course',0,y,s*(d/2+.012),w,.023,.022,C.joint,10,.17);let row=Math.round(y/.65);for(let x=-w/2+(row%2)*1.45;x<w/2;x+=2.9)this.s18box('v18-stone-joint',x,y-.31,s*(d/2+.015),.022,.61,.021,C.joint,10,.17);}
 this.s18box('v18-base-coping',0,h+.08,0,w+.30,.26,d+.30,'#b7b8aa',10,.22);
};
P.s18Arch=function(x,z,w,h,base=0){this.local(x,base,z,0,()=>{
 const k='v18-arch-reveal',arch=this.geo(k,()=>{const g=new G.Geometry(),rad=.5,spring=.56;let prev=[-.5,spring,0];g.quad([-.5,0,0],[.5,0,0],[.5,spring,0],[-.5,spring,0]);for(let i=1;i<=24;i++){let a=PI-i*PI/24,cur=[rad*Math.cos(a),spring+.44*Math.sin(a),0];g.tri([0,spring,0],cur,prev);prev=cur;}return g;});
 this.mesh(k,arch,0,0,0,w,h,1,'#313c39',10,.50);
 // Voussoirs are individual masonry blocks around an actual curved opening.
 for(let i=0;i<19;i++){const a=(i+.5)*PI/19,xx=(w/2+.15)*Math.cos(a),yy=h*.56+(h*.44+.1)*Math.sin(a);this.local(xx,yy,.07,-0,()=>{this.s18box('v18-arch-stone',0,0,0,.25,.32,.24,'#bcbcaf',10,.53);});}
 for(const s of[-1,1])this.s18box('v18-arch-jamb',s*(w/2+.14),h*.28,.1,.28,h*.56,.30,'#b6b9ac',10,.53);
 this.s18box('v18-arch-door',0,h*.26,.025,w*.86,h*.49,.07,'#343e35',20,.51);
 this.s18box('v18-arch-door-bar',0,h*.26,.08,.055,h*.49,.09,C.red,20,.52);
 });};
P.firstGymHistoric=function(p,w,d){this.noPlant(0,0,w+3,d+5);const wing=w*.20,main=w-2*wing;
 const hall=(x,ww,depth,eave,base,roof,wingMode=false)=>this.local(x,0,0,0,()=>{
 this.solid(0,0,ww,depth);this.s18Base(ww,depth,base);
 this.s18box('v18-gym-plaster',0,(eave+base)/2,0,ww,eave-base,depth,C.wall,24,.60);
 const bays=Math.max(3,Math.round(ww/4.45));
 for(const s of[-1,1]){for(let i=0;i<bays;i++){const xx=-ww/2+(i+.5)*ww/bays;
 if(!wingMode){if(s>0)this.s18Window(xx,base*.38,s*(depth/2+.06),Math.min(1.8,ww/bays*.40),base*.30,s<0?PI:0);this.s18Window(xx,base+(eave-base)*.46,s*(depth/2+.07),ww/bays*.68,(eave-base)*.78,s<0?PI:0,true);}else{this.s18Window(xx,1.35,s*(depth/2+.06),ww/bays*.30,1.30,s<0?PI:0,false,'v18-wing-window');this.s18Window(xx,base+.78,s*(depth/2+.06),ww/bays*.26,1.16,s<0?PI:0,false,'v18-wing-window');this.s18Window(xx,eave-1.42,s*(depth/2+.07),ww/bays*.72,1.9,s<0?PI:0,false,'v18-wing-upper-window');}}
 for(let i=0;i<=bays;i++){const xx=-ww/2+i*ww/bays;this.mesh('v18-engaged-column',this.geo('v18-engaged-column',()=>G.cylinder(12)),xx,base+.22,s*(depth/2+.03),.22,eave-base-.4,.22,C.red,20,1.12);this.local(xx,eave-.40,s*(depth/2+.12),s<0?PI:0,()=>this.v9Bracket(0,0,0,.92));}
 this.s18box('v18-painted-band',0,eave-.18,s*(depth/2+.13),ww,.75,.48,C.blue,20,1.32);
 for(let i=0;i<bays;i++)this.local(-ww/2+(i+.5)*ww/bays,eave-.32,s*(depth/2+.40),s<0?PI:0,()=>this.v9PaintedBeam(0,0,0,ww/bays-.40,.48));}
 for(const s of[-1,1])for(let i=0;i<3;i++)this.s18Window(s*(ww/2+.04),base+(eave-base)*.45,-depth/2+(i+.5)*depth/3,depth/3*.58,(eave-base)*.69,s*PI/2,true);
 this.v9Roof(0,eave+.48,0,ww+1.9,depth+2.8,roof,'hip',2.2);
 });
 hall(0,main,d,12.2,5.45,4.15);for(const s of[-1,1])hall(s*(main+wing)/2,wing,d*.94,10.1,5.05,3.35,true);
 // Small entry near the photographed transition, not a invented central portico.
 this.s18Arch(main/2+2.4,d*.47+.07,2.25,2.65,2.25);
 for(let i=0;i<10;i++)this.s18box('v18-gym-step',main/2+2.4,.12+i*.225,d/2+3.6-i*.33,3.25,.24,.68,'#b8bcaf',10,.04);

};
P.secondGymHistoric=function(p,w,d){this.noPlant(0,0,w+3,d+5);this.solid(0,0,w,d);const base=3.8,eave=9.1;
 this.s18Base(w,d,base);this.s18box('v18-gym-plaster',0,(base+eave)/2,0,w,eave-base,d,C.wall,24,.60);
 const bays=9;for(const s of[-1,1]){for(let i=0;i<bays;i++){const x=-w/2+(i+.5)*w/bays;
 for(const dx of[-1.65,0,1.65])this.s18Window(x+dx,7.57,s*(d/2+.08),1.35,1.72,s<0?PI:0,false,'v18-upper-band-window');
 if(i!==4||s<0)this.s18Window(x,2.40,s*(d/2+.07),w/bays*.27,1.18,s<0?PI:0);}
 for(let i=0;i<=bays;i++){const x=-w/2+i*w/bays;this.mesh('v18-engaged-column',this.geo('v18-engaged-column',()=>G.cylinder(12)),x,base+.1,s*(d/2+.04),.18,eave-base-.15,.18,C.red,20,1.12);this.local(x,eave-.24,s*(d/2+.16),s<0?PI:0,()=>this.v9Bracket(0,0,0,.63));}
 this.s18box('v18-painted-band',0,eave-.08,s*(d/2+.14),w,.48,.36,C.green,20,1.3);
 for(let i=0;i<bays;i++)this.local(-w/2+(i+.5)*w/bays,eave-.13,s*(d/2+.36),s<0?PI:0,()=>this.v9PaintedBeam(0,0,0,w/bays-.6,.30));}
 for(const s of[-1,1])for(let i=0;i<6;i++)this.s18Window(s*(w/2+.06),7.5,-d/2+(i+.5)*d/6,2.7,1.72,s*PI/2,false,'v18-upper-band-window');
 this.s18Arch(0,d/2+.11,3.2,3.18,.18);
 for(let i=0;i<3;i++)this.s18box('v18-gym-step',0,.10+i*.1,d/2+.86-i*.27,4.2,.16,.9,'#b8bcaf',10,.04);
 this.v9Roof(0,eave+.4,0,w+2.7,d+2.8,4.2,'hip',2.2);
 this.s18box('v18-chimney',w*.33,12.5,d*.17,1.25,3.3,1.25,'#a3a698',10,2.35);
 this.s18box('v18-chimney-cap',w*.33,14.18,d*.17,1.6,.25,1.6,'#797f72',10,2.36);

};
/* Field surfaces share a reusable dimensional marking system; rendered dimensions
 * are scaled to the inherited plot, NOT asserted to meet competition standards. */
P.s18Line=function(key,pts,width=.18,y=.39,closed=false){const k=key+'-'+pts.flat().map(v=>v.toFixed(3)).join('_')+'-'+width;this.mesh(k,this.geo(k,()=>G.ribbon(pts,width,y,closed)),0,0,0,1,1,1,C.line,35,.03);};
P.s18Goal=function(x,z,w=7.3,r=0){this.local(x,0,z,r,()=>{const h=2.45,dep=2.25;
 for(const s of[-1,1])this.s18box('v18-net-post',s*w/2,h/2+.37,0,.13,h,.13,'#e6e8dd',9,.08);
 this.s18box('v18-net-post',0,h+.37,0,w+.13,.13,.13,'#e6e8dd',9,.08);
 // Combined net geometry rather than thousands of separate GPU draw calls.
 const key='v18-goal-net-'+w,g=this.geo(key,()=>{let q=new G.Geometry();const bar=(x,y,z,sx,sy,sz)=>{const box=G.box(),t=Y.M.transform([x,y,z],[sx,sy,sz],0);for(let i=0;i<box.v.length;i+=8)q.vertex(Y.M.apply(t,[...box.v.slice(i,i+3),1]).slice(0,3),box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));};
 for(let xx=-w/2;xx<=w/2+.02;xx+=.30){bar(xx,h/2,dep,.023,h,.023);bar(xx,h,dep/2,.023,.023,dep);}
 for(let yy=0;yy<=h;yy+=.30){bar(0,yy,dep,w,.023,.023);for(const s of[-1,1])bar(s*w/2,yy,dep/2,.023,.023,dep);}
 for(let zz=0;zz<=dep;zz+=.3)for(const s of[-1,1])bar(s*w/2,h/2,zz,.023,h,.023);return q;});this.mesh('v18-goal-net',g,0,.37,0,1,1,1,'#cdd5bb',9,.08);
 });};
P.s18Pitch=function(w,d){this.s18box('v18-pitch-grass',0,.26,0,w,.12,d,C.turf,0,.01);
 for(let i=0;i<12;i++)this.s18box('v18-pitch-stripe',0,.331,-d/2+(i+.5)*d/12,w,.012,d/12,i%2?'#789b57':'#6d9052',0,.01);
 const edge=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]];this.s18Line('v18-pitch-line',edge,.20,.39,true);this.s18Line('v18-pitch-line',[[-w/2,0],[w/2,0]],.19);
 const circle=r=>Array.from({length:64},(_,i)=>[r*Math.cos(i/64*PI*2),r*Math.sin(i/64*PI*2)]);this.s18Line('v18-pitch-line',circle(Math.min(9.15,w*.17)),.19,.39,true);
 this.cyl(0,.375,0,.18,.025,C.line,12,1,10,.04);
 for(const s of[-1,1]){const pw=w*.62,pd=d*.15,gw=w*.31,gd=d*.053;
 this.s18Line('v18-pitch-line',[[-pw/2,s*d/2],[-pw/2,s*(d/2-pd)],[pw/2,s*(d/2-pd)],[pw/2,s*d/2]],.19);
 this.s18Line('v18-pitch-line',[[-gw/2,s*d/2],[-gw/2,s*(d/2-gd)],[gw/2,s*(d/2-gd)],[gw/2,s*d/2]],.19);
 this.cyl(0,.375,s*(d/2-d*.103),.18,.025,C.line,12,1,10,.04);this.s18Goal(0,s*d/2,Math.min(7.3,w*.15),s<0?PI:0);
 for(const ss of[-1,1]){this.s18box('v18-corner-flag',ss*w/2,1.08,s*d/2,.045,1.42,.045,'#e2dcd0',9,.09);this.s18box('v18-corner-cloth',ss*w/2+.16,1.64,s*d/2,.35,.29,.025,'#c3ac6a',20,.09);}
 }
};
P.s18Fence=function(w,d,h=4.1){for(const s of[-1,1]){const n=Math.ceil(d/6);for(let i=0;i<=n;i++)this.s18box('v18-net-post',s*w/2,h/2,-d/2+i*d/n,.11,h,.11,C.fence,9,.08);
 for(const y of[.4,h*.5,h])this.s18box('v18-fence-rail',s*w/2,y,0,.07,.07,d,C.fence,9,.08);
 for(let z=-d/2;z<d/2;z+=.65)this.s18box('v18-fence-wire',s*w/2,h/2,z,.021,h,.021,C.fence,9,.08);
 for(const y of[1,2,3])this.s18box('v18-fence-wire',s*w/2,y,0,.025,.025,d,C.fence,9,.08);
 const nx=Math.ceil(w/6);for(let i=0;i<=nx;i++)this.s18box('v18-net-post',-w/2+i*w/nx,h/2,s*d/2,.11,h,.11,C.fence,9,.08);
 for(const y of[.4,2,3,h])this.s18box('v18-fence-rail',0,y,s*d/2,w,.045,.045,C.fence,9,.08);
 for(let x=-w/2;x<w/2;x+=.65)this.s18box('v18-fence-wire',x,h/2,s*d/2,.021,h,.021,C.fence,9,.08);
 }};
P.s18Floodlight=function(x,z,h=16,r=0){this.local(x,0,z,r,()=>{this.cyl(0,.15,0,.24,h,'#8d9b94',12,1,9,.1);this.s18box('v18-light-crossbar',0,h-.3,0,3.6,.15,.14,'#839188',9,.12);for(const xx of[-1.4,-.47,.47,1.4]){this.s18box('v18-light-fixture',xx,h-.3,.2,.75,.64,.40,'#6e7b77',9,.13);this.s18box('v18-light-lens',xx,h-.3,.42,.58,.46,.045,'#e7e4c8',12,.13);}});};
P.field=function(w,d){this.solid(0,0,w,d);this.noPlant(0,0,w+3,d+3);this.s18box('v18-field-base',0,.14,0,w,.22,d,'#80946e',7,.01);
 // Existing elongated football arrangement retained; rear open grass is not a
 // made-up baseball diamond or a second surveyed pitch.
 const pw=w-9,pd=Math.min(112,d-15);this.s18Pitch(pw,pd);this.s18Fence(w-1,d-1);
 for(const s of[-1,1]){this.s18Floodlight(s*(w/2-1.8),-d*.32,14,s<0?PI/2:-PI/2);this.s18Floodlight(s*(w/2-1.8),d*.32,14,s<0?PI/2:-PI/2);}
};
P.stadium=function(w,d){this.solid(0,0,w,d);this.noPlant(0,0,w+6,d+6);const rad=w/2-1,straight=d/2-rad;
 // Half-open semicircles + separate straight segments: no duplicated seam
 // vertices. This fixes the old zero-length joins at the lane transitions.
 const capsule=r=>{const a=[];for(let i=0;i<=64;i++){let t=i/64*PI;a.push([r*Math.cos(t),straight+r*Math.sin(t)]);}for(let i=0;i<=64;i++){let t=PI+i/64*PI;a.push([r*Math.cos(t),-straight+r*Math.sin(t)]);}return a;};
 const surface=(key,r,y,col)=>this.mesh(key,this.geo(key+'-'+r,()=>G.polygon(capsule(r),y)),0,0,0,1,1,1,col,11,.01);
 surface('v18-stadium-perimeter',rad,.14,'#a1a99b');surface('v18-track-surface',rad-.7,.22,C.track);
 const inner=rad-13;surface('v18-track-infield',inner,.29,'#7c995d');
 for(let i=0;i<=7;i++)this.s18Line('v18-track-lane',capsule(inner+i*1.68),.18,.34,true);
 this.s18Line('v18-track-curb',capsule(inner-.30),.32,.325,true);
 const fw=Math.min(63,inner*1.72),fd=Math.min(105,2*straight+inner*.64);this.s18Pitch(fw,fd);
 const startZ=straight*.62;this.s18Line('v18-track-start',[[inner,startZ],[rad-1.0,startZ]],.22,.335);
 for(let i=0;i<7;i++)this.local(inner+(i+.5)*1.68,.35,startZ+1.5,PI/2,()=>{this.mesh('v18-track-number-'+i,this.geo('v18-track-number-'+i,()=>G.ribbon([[0,0],[0,.55],[.30,.55]],.10,.015,false)),0,0,0,1,1,1,C.line,35,.03);});
 // Lights and restrained seating follow an approximate existing stadium envelope.
 for(const x of[-1,1])for(const z of[-1,1])this.s18Floodlight(x*(w/2-.5),z*d*.27,20,x<0?PI/2:-PI/2);
 for(let i=0;i<3;i++){const x=w/2-1.5-i*.6;this.s18box('v18-bleacher-step',x,.3+i*.25,0,.58,.22,straight*1.50,'#c2c6b7',10,.03);}
};
// Western stadium building and track-facing stepped stand, from aerial video.
P.sportsCentre=function(p,w,d){
 this.noPlant(0,0,w+3,d+3);
 // The west hall is a separately selectable canonical venue (26005).
 const n=9,depth=w*.42/n;
 for(let i=0;i<n;i++){const x=w*.08+(i+.5)*depth,h=5.8-i*.56;
  this.box(x,h/2,0,depth+.02,h,d*.83,'#bcbfb4',10,.2);
  this.box(x,h+.075,0,depth*.72,.15,d*.81,i%2?'#a7b5b1':'#c4cac3',24,.3);
 }
 this.solid(w*.29,0,w*.42,d*.83);
 for(const z of[-d*.30,0,d*.30])this.box(w*.29,3.2,z,w*.42,.16,1.4,'#969f94',10,.25);
};
P.badmintonHall=function(p,w,d){this.noPlant(0,0,w+3,d+3);this.local(0,0,0,Math.PI/2,()=>{this.s19Wall(d,w,p.h,3,30);this.box(0,p.h+.35,0,d+.4,.45,w+.4,'#aab1a5',24,1.5);});this.local(-w/2,0,0,-Math.PI/2,()=>this.econCaption('五四羽毛球馆',0,9,.3,21,1.25,'wusi26-badminton-sign','#4d574c',1.2));};
})(YY);
