/* Additional photo-corrected details. Their map anchors are stored separately. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo;
P.guanghuaMotto32=function(){
 this.noPlant(0,0,8,2);this.box(0,.035,.3,7.6,.045,1.5,'#82966b',0);this.box(0,.10,0,7.2,.20,.84,'#62665f',24);this.box(0,.91,0,7,1.52,.42,'#292e2b',9);
 // Literal inscription, independent of unverified calligraphic brush forms.
 this.econCaption('团结  博采  实践  创新',0,.99,.213,6.35,.75,'v32-gsm-gold','#cfad51',.8);
};
P.gsmEntry32=function(){
 const n=16,front=x=>1.0+1.45*Math.cos(x/14*Math.PI);
 for(let i=0;i<n;i++){
  const a=-7+i*14/n,c=a+14/n,z1=front(a),z2=front(c),angle=-Math.atan2(z2-z1,c-a),w=Math.hypot(c-a,z2-z1);
  this.local((a+c)/2,0,(z1+z2)/2,angle,()=>{
   this.box(0,2.8,0,w,5.2,.065,'#83a29d',28);this.box(-w/2,2.8,.075,.065,5.2,.06,'#c5d0ca',29);
   for(const y of[.3,2.6,5.15])this.box(0,y,.075,w,.065,.06,'#c5d0ca',29);
   this.box(0,5.45,.015,w,.40,.16,'#606965',29);this.box(0,5.78,.44,w+.025,.09,1.14,'#a6bdb3',28);
   this.box(0,5.73,.44,.05,.05,1.14,'#d1d9cf',29);
   if(i>=7&&i<=10){this.box(w*.34,1.35,.17,.035,.55,.06,'#d6ddd4',29);this.box(0,.27,.72,w,.1,1.5,'#b8bcae',24);}
  });
 }
};
P.economicsMarker32=function(){
 const g=this.geo('v32-economics-slab',()=>{const q=new G.Geometry(),a=[[-2.75,.08,-.34],[2.75,.08,-.34],[2.75,.08,.34],[-2.75,.08,.34]],b=[[-2.27,1.95,-.31],[2.25,1.95,-.31],[2.25,1.95,.28],[-2.27,1.95,.28]];q.quad(...a);q.quad(b[3],b[2],b[1],b[0]);for(let i=0;i<4;i++)q.quad(a[i],b[i],b[(i+1)%4],a[(i+1)%4]);return q});
 this.mesh('v32-economics-slab',g,0,.09,0,1,1,1,'#b8ac95',24,.5);this.box(0,.09,0,5.7,.18,1.05,'#858b80',24);
 this.econCaption('经济学院',.46,1.28,.313,3.22,.75,'v32-econ-name','#d3a339',.7);
 this.econCaption('School of Economics',.45,.70,.335,3.22,.35,'v32-econ-en','#b68d35',.7);
 // A neutral reserved area avoids inventing the university seal from incomplete artwork.
};
P.canteenEntry32=function(){
 // Photo-supported door and curved glazing only; no assumed interior or rear extension.
 for(let i=0;i<12;i++){
  const a=-.72+i*.12,x=Math.sin(a)*6,z=Math.cos(a)*6-5.4;
  this.local(x,0,z,-a,()=>{this.box(0,3.9,0,.73,7.1,.12,'#637572',28);this.box(-.35,3.9,.07,.06,7.1,.07,'#c4c8c2',29);for(const y of[1.5,3.2,5.1,7.25])this.box(0,y,.08,.73,.07,.07,'#bbc0b8',29);});
 }
 this.box(0,3.2,1.07,5.1,.43,1.2,'#d3d3c8',24);this.box(0,3.47,1.07,5.5,.08,1.3,'#6f8176',28);
 for(const x of[-2.43,2.43])this.box(x,1.53,1.59,.09,3.05,.09,'#b8c0b8',29);
 for(const x of[-.63,.63]){this.box(x,1.35,1.62,1.22,2.7,.055,'#748781',28);for(const dx of[-.59,.59])this.box(x+dx,1.35,1.66,.06,2.7,.045,'#c3c8bf',29);this.box(x+(x<0?.43:-.43),1.2,1.75,.04,.5,.07,'#d3d6cd',29);}
 this.econCaption('成府园食堂',0,4.16,.9,4.9,.64,'v32-canteen-title','#d3c9b9',.6);
};
})(YY);
