/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v17 · Northern historic precinct. Original study models, not measured buildings.
   Courtyard voids, upper galleries, tiled roofs and enclosure are separate geometry.
   Unlocated auxiliary buildings described by historical sources are NOT invented. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M,PI=Math.PI;
const C={wall:'#d9d7c9',base:'#a3a599',red:'#883f31',wood:'#854434',roof:'#65716f',ridge:'#929b8c',blue:'#456d72',gold:'#c4aa73',glass:'#496164',floor:'#b5b4a6'};
P.n17Box=function(k,x,y,z,w,h,d,c=C.wall,mat=24,part=.7){this.mesh(k,this.geo(k,G.box),x,y,z,w,h,d,c,mat,part);};
P.n17Column=function(x,z,h,y=.8){this.mesh('v17-red-column',this.geo('v17-red-column',()=>G.cylinder(12)),x,y,z,.27,h,.27,C.red,6,1);this.cyl(x,y-.20,z,.42,.24,C.base,12,1,10,.15);};
P.n17Lattice=function(x,y,z,w,h,rotation=0){this.local(x,y,z,rotation,()=>{
 this.n17Box('v17-glass',0,0,0,w,h,.10,C.glass,5,.75);
 for(const s of[-1,1]){this.n17Box('v17-window-frame',s*w/2,0,.10,.13,h+.2,.16,C.wood,6,.85);this.n17Box('v17-window-frame',0,s*h/2,.10,w+.16,.13,.16,C.wood,6,.85);}
 this.n17Box('v17-lattice',0,0,.14,.075,h,.085,C.wood,6,.88);
 for(const sy of[-.28,.28]){this.n17Box('v17-lattice',0,sy*h,.14,w,.065,.09,C.wood,6,.88);for(const sx of[-.26,.26]){this.n17Box('v17-lattice',sx*w,sy*h,.16,w*.23,.06,.08,C.wood,6,.89);this.n17Box('v17-lattice',sx*w,sy*h,.16,.06,h*.24,.08,C.wood,6,.89);}}
 });};
P.n17Roof=function(x,y,z,w,d,h,rotation=0){this.local(x,y,z,rotation,()=>{
 const roof=this.geo('v17-hip-gable',()=>{const g=new G.Geometry(),N=12,U=20;
 const half=t=>.5-.14*Math.min(1,t/.54),ht=(t,u)=>Math.pow(t,1.48)+.09*Math.pow(Math.abs(u),8)*(1-t)*(1-t);
 for(const side of[-1,1])for(let j=0;j<N;j++)for(let i=0;i<U;i++){const f=(t,u)=>[u*half(t),ht(t,u),side*.5*(1-t)],t=j/N,s=(j+1)/N,u=-1+2*i/U,v=-1+2*(i+1)/U;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}
 for(const side of[-1,1])for(let j=0;j<7;j++)for(let i=0;i<8;i++){const f=(t,u)=>[side*half(t),ht(t,1),u*.5*(1-t)],t=j/7*.54,s=(j+1)/7*.54,u=-1+2*i/8,v=-1+2*(i+1)/8;g.quad(f(t,u),f(t,v),f(s,v),f(s,u));}return g;});
 this.mesh('v17-hip-gable',roof,0,0,0,w,h,d,C.roof,2,2.1);
 const panel=this.geo('v17-gable-panel',()=>{const q=new G.Geometry();q.tri([0,.407,-.23],[0,1,0],[0,.407,.23]);return q;});
 for(const s of[-1,1]){this.mesh('v17-gable-panel',panel,s*w*.359,0,0,1,h,d,C.red,6,2.06);for(const zz of[-.09,.09])this.n17Box('v17-gable-trim',s*w*.361,h*.56,d*zz,.08,h*.23,.09,C.gold,29,2.07);this.n17Box('v17-gable-trim',s*w*.361,h*.44,0,.08,.10,d*.37,C.gold,29,2.07);}
 this.n17Box('v17-roof-ridge',0,h+.04,0,w*.72,.21,.30,C.ridge,2,2.2);
 for(const s of[-1,1]){this.beam([s*w*.36,h,0],[s*w*.39,h+.47,0],.13,C.ridge,2,2.2);this.n17Box('v17-eave-fascia',0,-.16,s*d*.50,w,.26,.28,C.blue,6,1.9);}
 // Sparse physical cover tiles complement the shader tile texture; not 1:1 roof tiles.
 const nr=Math.max(6,Math.round(w/1.75));for(const s of[-1,1])for(let i=0;i<=nr;i++){let xx=-w*.48+i*w*.96/nr;this.cyl(xx,-.13,s*d*.501,.13,.23,C.ridge,8,1,2,2.05);}
 });};
P.n17Gallery=function(w,d,h=10.0,bays=9,upper=true){
 const z=d/2+1.05,span=w-2.6,bay=span/bays;
 this.n17Box('v17-gallery-slab',0,.88,z,w,.26,2.6,C.base,10,.15);
 if(upper)this.n17Box('v17-gallery-slab',0,h*.51,z,w,.28,2.45,C.floor,10,1.1);
 for(let i=0;i<=bays;i++)this.n17Column(-span/2+i*bay,z,h-.35);
 for(const y of upper?[h*.51+1.04,h-.12]:[h-.12])this.n17Box('v17-gallery-rail',0,y,z,w,.14,.22,C.red,6,1.25);
 if(upper)for(let i=0;i<=bays*3;i++){const xx=-span/2+i*span/(bays*3);this.n17Box('v17-gallery-rail',xx,h*.51+.6,z,.09,.9,.11,C.red,6,1.25);}
 this.n17Box('v17-painted-frieze',0,h-.19,z,w,.46,.28,C.blue,6,1.5);
 for(let i=0;i<bays;i++){let xx=-span/2+(i+.5)*bay;this.n17Box('v17-painted-gold',xx,h-.16,z+.16,bay*.61,.045,.07,C.gold,29,1.51);for(const s of[-1,1])this.beam([xx+s*bay*.43,h-.42,z],[xx+s*bay*.27,h-1.02,z],.075,C.wood,6,1.45);}
};
P.n17Hall=function(w,d,h=10,opts={}){
 this.solid(0,0,w,d);this.n17Box('v17-stone-plinth',0,.37,0,w+.6,.72,d+.6,C.base,10,.1);
 this.n17Box('v17-plaster-wall',0,(h+.8)/2,0,w,h-.8,d,C.wall,24,.55);
 const bays=Math.max(3,Math.round(w/4.6)),levels=opts.one?[3.0]:[3.0,7.4],faceZ=d/2+.085;
 for(const s of[-1,1])for(const yy of levels)for(let i=0;i<bays;i++){let xx=-w/2+(i+.5)*w/bays;this.n17Lattice(xx,yy,s*faceZ,Math.min(2.9,w/bays*.59),opts.one?2.35:2.6,s<0?PI:0);}
 for(const s of[-1,1])for(const yy of levels){const baysD=Math.max(2,Math.round(d/4.8));for(let i=0;i<baysD;i++)this.n17Lattice(s*(w/2+.06),yy,-d/2+(i+.5)*d/baysD,Math.min(2.4,d/baysD*.6),2.4,s*PI/2);}
 if(!opts.one)this.n17Box('v17-floor-belt',0,5.1,0,w+.15,.27,d+.15,'#c5c5b9',24,.65);
 if(opts.gallery)this.n17Gallery(w,d,h,bays,!opts.one);
 this.n17Box('v17-painted-frieze',0,h-.04,0,w+.2,.43,d+.2,C.blue,6,1.5);
 this.n17Roof(0,h+.35,0,w+2.4,d+(opts.gallery?4.4:2.5),opts.one?2.7:4.05);
};
P.northZhai=function(p,w,d){
 this.noPlant(0,0,w+3,d+5);this.n17Box('v17-court-ground',0,.13,0,w+.5,.18,d+.5,'#bebdab',7,.02);
 const depth=d>30?12:Math.min(10.2,d*.47),side=d>30?10.0:7.5,back=-d/2+depth/2;
 this.local(0,0,back,0,()=>this.n17Hall(w,depth,10,{gallery:true}));
 const wingD=d-depth,wingZ=depth/2;
 for(const s of[-1,1])this.local(s*(w/2-side/2),0,wingZ,PI/2,()=>this.n17Hall(wingD,side,9.65,{gallery:false}));
 if(d>30){this.n17Box('v17-court-lawn',0,.26,3.5,w-side*2-6,.10,d-depth-9,'#83946c',0,.01);this.n17Box('v17-court-axis',0,.32,d/2-4,4,.13,8,'#c7c6b7',7,.04);}
 this.sign(p.name,0,8.8,back+depth/2+1.26,4.2,1.12,0,false);
 for(let k=0;k<4;k++)this.n17Box('v17-entry-step',0,.16+k*.16,back+depth/2+3.4-k*.44,5.6,.24,1.0,C.base,10,.09);
};
P.northJian=function(p,w,d){
 this.noPlant(0,0,w+4,d+8);this.n17Hall(w,d,10.1,{gallery:true});
 this.sign('健斋',0,8.6,d/2+1.31,4.0,1.15,0,false);
 this.n17Roof(0,5.18,d/2+2.0,w-2,4.6,1.5);

};
P.northOctagon=function(p,w,d){
 const r=6.0;this.noPlant(0,0,w+3,d+3);const poly=Array.from({length:8},(_,i)=>{const a=i/8*2*PI,q=this.world([r*Math.cos(a),0,r*Math.sin(a)]);return[q[0],q[2]];});
 const c=this.world([0,0,0]);this.mapBuildings.push({id:this.id,x:c[0],z:c[2],w:r*2,d:r*2,polygon:poly,r:this.rotation});this.solidAreas.push([c[0],c[2],r*2,r*2]);
 this.cyl(0,.1,0,r+.75,.6,C.base,8,1,10,.1);
 this.mesh('v17-octagon-wall',this.geo('v17-octagon-wall',()=>G.cylinder(8)),0,.7,0,r,9.7,r,C.wall,24,.6);
 for(let i=0;i<8;i++){const a=(i+.5)/8*2*PI,rr=r*Math.cos(PI/8)+.06,xx=Math.cos(a)*rr,zz=Math.sin(a)*rr;
 for(const y of[3.0,7.6])this.n17Lattice(xx,y,zz,3.45,2.75,PI/2-a);
 const t=i/8*2*PI;this.n17Column(Math.cos(t)*(r+.32),Math.sin(t)*(r+.32),9.5,.75);}
 for(const[y,rad,hh]of[[5.1,r+1.8,1.2],[10.75,r+2.0,3.9]]){this.mesh('v17-octagon-roof',this.geo('v17-octagon-roof',()=>{const g=G.pagoda(8);for(let i=0;i<8;i++){const a=(i/8+.0625)*2*PI,b=((i+1)/8+.0625)*2*PI;g.tri([.43*Math.cos(a),.95,.43*Math.sin(a)],[0,1.12,0],[.43*Math.cos(b),.95,.43*Math.sin(b)]);}return g;}),0,y,0,rad,hh,rad,C.roof,2,2.1);for(let i=0;i<8;i++){let a=(i/8+.0625)*2*PI;this.beam([Math.cos(a)*rad,y+.10,Math.sin(a)*rad],[Math.cos(a)*rad*.43,y+hh*.95,Math.sin(a)*rad*.43],.11,C.ridge,2,2.18);}}
 this.sphere(0,15.30,0,.24,.35,.24,C.gold,29,2.3,true);
 this.sign('体斋',0,9.45,r+.35,2.7,.88,0,false);
};
P.northQuan=function(p,w,d){
 this.noPlant(0,0,w+2,d+2);this.n17Box('v17-quan-court',0,.10,0,w,.12,d,C.floor,7,.02);
 const deep=5.7,side=6.0;this.local(0,0,-d/2+deep/2,0,()=>this.n17Hall(w,deep,5.4,{one:true}));
 for(const s of[-1,1])this.local(s*(w/2-side/2),0,deep/2,PI/2,()=>this.n17Hall(d-deep,side,5.2,{one:true}));
 for(const s of[-1,1]){const ww=(w-6)/2;this.local(s*(3+ww/2),0,d/2-deep/2,0,()=>this.n17Hall(ww,deep,5.0,{one:true}));}
 this.n17Box('v17-quan-gateway',0,4.7,d/2-2.8,6,.55,5,C.red,6,1.1);this.n17Roof(0,5.0,d/2-2.8,7.6,7,2.0);this.sign('全斋',0,4.0,d/2-.15,2.7,.87,0,false);
};
P.sacklerMuseum=function(p,w,d){
 this.noPlant(0,0,w+3,d+5);this.n17Box('v17-museum-court',0,.12,0,w,.16,d,'#c3c4b4',7,.02);
 const depth=9.7,side=10.2;
 for(const s of[-1,1])this.local(0,0,s*(d/2-depth/2),s<0?PI:0,()=>this.n17Hall(w,depth,10.8,{gallery:true}));
 for(const s of[-1,1])this.local(s*(w/2-side/2),0,0,PI/2,()=>this.n17Hall(d-2*depth,side,10.3,{gallery:false}));
 this.n17Box('v17-museum-garden',0,.26,0,w*.46,.16,(d-2*depth)*.50,'#7f9366',0,.03);
 this.n17Box('v17-museum-entry',0,2.8,d/2+.15,5.8,4.4,.14,C.wood,6,.9);
 for(const x of[-1.43,1.43])this.n17Lattice(x,3.1,d/2+.27,2.4,3.4);
 this.n17Box('v17-museum-signboard',0,6.12,d/2+1.21,21,.90,.14,'#263f45',29,1.2);
 this.sign('北京大学赛克勒考古与艺术博物馆',0,6.13,d/2+1.33,20.8,.84,0,false);
 for(let i=0;i<4;i++)this.n17Box('v17-museum-step',0,.13+i*.17,d/2+3.5-i*.5,10,.24,1.1,C.base,10,.12);
};
})(YY);
