/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v21: map-led grouped plan corrections. Facade details remain type studies.
 * Solid footprints, 3D picking, diagrams and source comparison share this builder.
 */
(function(Y){'use strict';const P=Y.Builder.prototype,PI=Math.PI;
P.n21Zhai=function(p,w,d){
 const side=p.northModel.side,sw=12,depth=11.5;
 this.noPlant(0,0,w+3,d+5);
 // Each named main building is L-shaped. Two mirrored buildings form one
 // south-opening pair; no new wall is placed across the courtyard opening.
 this.n17Box('v21-court-lawn',0,.13,1,w,.16,d,'#82936f',0,.02);
 this.local(side*(w/2-sw/2),0,0,-side*PI/2,()=>this.n17Hall(d,sw,10,{gallery:true}));
 this.local(-side*sw/2,0,-d/2+depth/2,0,()=>this.n17Hall(w-sw,depth,10,{gallery:true}));
 this.n17Box('v21-court-walk',-side*(w*.14),.26,3,3.1,.12,d-7,'#c0bcad',7,.03);
 this.sign(p.name,-side*sw/2,8.6,-d/2+depth+1.22,4.2,1.05,0,false);
 for(let k=0;k<4;k++)this.n17Box('v21-gallery-step',-side*sw/2,.16+k*.16,-d/2+depth+3.9-k*.43,5.4,.24,1.0,'#aaaea0',10,.12);
};
const old=P.northZhai;P.northZhai=function(p,w,d){if(p.northModel?.plan==='paired-L-wing')return this.n21Zhai(p,w,d);return old.call(this,p,w,d)};
Y.addReferencePrecinct21=function(b){
 for(const p of Y.DATA.referenceV21?.auxiliaryVolumes||[])b.group(p,()=>{
  const w=p.w*Y.DATA.scale,d=p.d*Y.DATA.scale;b.noPlant(0,0,w+3,d+3);
  if(p.kind==='court'){
   const t=6;b.local(0,0,-d/2+t/2,0,()=>b.n17Hall(w,t,5.6,{one:true}));
   for(const s of[-1,1])b.local(s*(w/2-t/2),0,t/2,PI/2,()=>b.n17Hall(d-t,t,5.6,{one:true}));
  }else b.n17Hall(w,d,5.6,{one:true});
 });
};
})(YY);
