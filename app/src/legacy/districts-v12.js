/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v12 Law precinct — independent original exterior models.
 * Kaiyuan's visible cantilever/screen comes from official low-resolution photos.
 * Chen Ming and the three-court compound are qualified typology studies, NOT
 * measured floor plans. No texture is copied from a photograph. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,G=Y.Geo;
 const L={stone:'#b6b7b1',light:'#c9cac3',darkStone:'#989d97',joint:'#626c69',metal:'#475653',glass:'#657c83',paving:'#babdb3',wood:'#583e35',brick:'#9c9f96',roof:'#606b66'};
 P.lawPart=function(key,x,y,z,w,h,d,c=L.stone,mat=24,part=.7){this.mesh(key,this.geo(key,G.box),x,y,z,w,h,d,c,mat,part);};
 // Glazing is recessed relative to the independent stone frame. Reveals are
 // geometry, not a flat window decal or a dark rectangle on an intact wall.
 P.lawGlazing=function(x,y,z,w,h,r=0,part=.8,spacing=2.05){this.local(x,y,z,r,()=>{
  this.box(0,0,-.11,w,h,.11,'#273c3e',20,part);
  this.box(0,0,0,w-.10,h-.10,.035,L.glass,5,part+.01);
  for(const s of[-1,1]){this.box(s*(w/2-.05),0,.07,.10,h,.17,L.metal,9,part+.02);this.box(0,s*(h/2-.045),.07,w,.09,.17,L.metal,9,part+.02);}
  const n=Math.max(1,Math.round(w/spacing));for(let i=1;i<n;i++)this.box(-w/2+i*w/n,0,.08,.075,h,.15,L.metal,9,part+.02);
  this.box(0,h*.16,.09,w,.065,.17,L.metal,9,part+.025);
 });};
 P.lawStonePanels=function(x,y,z,w,h,r=0,c=L.stone,part=.8){this.local(x,y,z,r,()=>{
  this.box(0,0,-.16,w,h,.28,L.joint,24,part);
  const nx=Math.max(1,Math.round(w/1.25)),ny=Math.max(1,Math.round(h/.73));
  // Actual thin joints, shared instanced geometry and small color variation.
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){
   const col=(i*5+j*3)%11===0?L.light:c;this.lawPart('v12-stone-panel',-w/2+(i+.5)*w/nx,-h/2+(j+.5)*h/ny,.02,w/nx-.018,h/ny-.018,.07,col,24,part+.005);
  }
 });};
 P.lawRail=function(x,y,z,w,r=0,part=1.05){this.local(x,y,z,r,()=>{
  const n=Math.max(1,Math.round(w/1.55));for(let i=0;i<n;i++){
   let xx=-w/2+(i+.5)*w/n;this.box(xx,.56,0,w/n-.05,.88,.035,'#839c9c',5,part);
   this.box(-w/2+i*w/n,.58,.06,.055,1.17,.072,L.metal,9,part+.02);
  }
  this.box(w/2,.58,.06,.055,1.17,.072,L.metal,9,part+.02);
  this.box(0,1.15,.055,w+.10,.067,.085,L.metal,9,part+.04);this.box(0,.12,0,w,.095,.13,L.light,24,part-.03);
 });};
 P.lawFlatRoof=function(x,y,z,w,d,part=2.4){this.local(x,y,z,0,()=>{
  this.box(0,0,0,w,.25,d,'#b4b9b2',21,part);
  for(let s of[-1,1]){this.box(0,.29,s*(d/2-.13),w,.65,.28,L.light,24,part+.06);this.box(s*(w/2-.13),.29,0,.28,.65,d,L.light,24,part+.06);this.box(0,.65,s*(d/2-.13),w+.06,.07,.34,L.darkStone,9,part+.09);this.box(s*(w/2-.13),.65,0,.34,.07,d,L.darkStone,9,part+.09);}
  for(let zz=-d/2+5;zz<d/2;zz+=6)this.box(0,.14,zz,w-.7,.012,.025,'#838e85',21,part+.01);
 });};
 P.lawKaiyuan=function(p,w=82,d=58){
  this.noPlant(0,4,w+10,d+19);
  this.solid(0,-4,w,50); // occupied ground-floor footprint, excluding open front terrace
  this.box(0,.23,0,w+1,.46,d+1,L.darkStone,24,.10);
  // Core and three recessed lower levels. The lower facade sits 5m behind the
  // front of the cantilever; genuine void between outer column line and glass.
  this.box(-33,7.45,-.1,16,14.0,57.8,L.stone,24,.45);
  this.box(3,7.45,-10.0,56,14.0,29,L.stone,24,.45);
  this.box(37,7.45,-2,8,14.0,54,L.stone,24,.45);
  this.lawStonePanels(-33,7.45,29.04,16,14,0,L.stone,.49);
  for(let f=0;f<3;f++){
   const base=.48+f*4.62;
   this.box(6,base,4.8,62,.27,47.9,L.light,24,.72+f*.10);
   this.lawGlazing(4.7,base+2.2,23.8,59.4,4.07,0,.77+f*.10,2.12);
   // Ground entry pairs are distinct, while upper balconies remain open.
   if(f===0){for(let x=-7;x<11;x+=3.0){this.box(x,1.9,24.03,.085,2.75,.11,L.metal,9,.86);this.box(x+.19,1.72,24.17,.065,.77,.12,'#c2c6bd',9,.87);}}
   else{this.box(5.4,base+.37,28.77,60.6,.73,.40,L.stone,24,.81+f*.10);this.lawRail(5.4,base+.55,28.88,60.6,0,.90+f*.10);}
   this.box(5.4,base+4.47,27.10,61.8,.27,4.14,'#87938b',24,.90+f*.10);
   for(let x=-21;x<36;x+=4.15)this.lawPart('v12-kai-soffit',x,base+4.29,26.62,.115,.13,5.10,'#6f7b74',9,.95+f*.10);
  }
  for(const x of[-24.2,35.6])this.box(x,7.43,27.0,.64,14,.76,'#adb5aa',24,.75);
  // Tall end wall with narrow slits, separate from the deep glazed platforms.
  for(let f=0;f<3;f++)for(let j=0;j<3;j++)this.lawGlazing(-38.5+j*3.1,2.6+f*4.62,29.10,.8,2.8,0,.82,1);
  // The upper two storeys: plates and dark recessed planes behind a patterned
  // screen. No solid full facade behind the open glass cells.
  for(const yy of[14.55,20.00,25.48])this.box(0,yy,0,w+.35,.43,d+.35,L.light,24,1.35+(yy-14)*.018);
  this.box(0,19.97,-20.7,w,10.7,16.6,L.stone,24,1.45);
  this.box(-39.5,19.97,0,3.0,10.7,d,L.stone,24,1.45);
  const screen=(width,front,returnRotation=0)=>this.local(0,0,front,returnRotation,()=>{
   this.lawGlazing(0,19.96,-.56,width,10.34,0,1.48,2.37);
   const cells=Math.round(width/2.42),cell=width/cells;
   for(let i=0;i<cells;i++)for(let j=0;j<6;j++){
    const xx=-width/2+(i+.5)*cell,yy=15.54+j*1.77;
    // Deliberate documented family, not randomly generated windows. Cell count
    // is approximate, so recorded separately from the known five storeys.
    if((i+Math.floor(j/2))%3===0||j===2&&(i%3===2)||j===3&&(i%3===1))
     this.lawPart('v12-kai-screen',xx,yy,0,cell-.035,1.71,.40,(i+j)%7===0?L.light:L.stone,24,1.62+j*.025);
    this.box(xx-cell/2,yy,.025,.055,1.76,.51,L.darkStone,24,1.60+j*.025);
   }
   for(let j=0;j<7;j++)this.box(0,14.65+j*1.77,.02,width+.1,j===3?.27:.08,.48,L.light,24,1.61+j*.025);
  });
  screen(79.0,29.15);
  // Short returns and back facade retain the same material family, qualified
  // as approximations instead of pretending all four facades were photographed.
  for(const s of[-1,1])this.local(s*41.1,0,0,s*Math.PI/2,()=>{
   this.lawGlazing(0,19.97,-.16,57.8,10.4,0,1.50,2.5);
   for(let x=-27;x<=27;x+=3.0)for(let j=0;j<3;j++)if((Math.round(x/3)+j)%3!==1)this.lawPart('v12-kai-screen',x,16.47+j*3.47,.20,1.55,3.25,.39,L.stone,24,1.61+j*.05);
   for(const yy of[14.6,20.0,25.4])this.box(0,yy,.16,58.0,.40,.50,L.light,24,1.75);
   for(let f=0;f<3;f++)for(let z=-23;z<=18;z+=5.2)this.lawGlazing(z,2.7+f*4.62,.075,2.5,2.82,0,.9);
  });
  this.local(0,0,-29.08,Math.PI,()=>{for(let f=0;f<5;f++)for(let x=-35;x<39;x+=7.8)this.lawGlazing(x,2.65+f*4.56,.02,4.7,2.7,0,1.2);});
  this.lawFlatRoof(0,25.83,0,81.9,57.9,2.4);
  // Small mechanical roof plant shown as model detail, not a surveyed inventory.
  for(const x of[-15,5,25]){this.box(x,26.85,-15,8.0,1.4,6.0,'#939e99',9,2.57);for(let k=-3;k<=3;k++)this.box(x+k*.95,27.61,-15,.14,.045,5.75,'#5e6c67',9,2.60);this.cyl(x,27.64,-15,1.42,.08,'#566860',24,1,9,2.61);}
  // Modern lettering: alpha-text geometry, not a historical plaque.
  this.lettering('凯原楼',-33,11.24,29.38,9.9,1.94,0,'#626c65');
  this.lettering('LEO KOGUAN BUILDING',-33,9.72,29.38,13.1,.65,0,'#626c65');
  this.lettering('北京大学法学院',5.5,4.90,24.04,18.0,.80,0,'#c2c8be');
  this.box(0,.13,33.50,83,.22,8.0,L.paving,26,.08);
  for(let j=0;j<3;j++)this.box(6,.13+j*.14,30.8-j*.56,19,.23,1.16,L.light,24,.14);
  // Tactile strip and recessed drainage channel, not a navigation guarantee.
  this.box(6,.26,34.7,19,.027,.39,'#b8aa80',26,.10);this.box(6,.253,36.4,25,.025,.16,'#66756b',9,.10);
  for(const s of[-1,1]){this.box(s*31,.57,33.45,13,1.1,2.85,L.darkStone,24,.17);this.box(s*31,1.16,33.45,12.5,.23,2.30,'#51634c',13,.20);}
 };
 P.lawChenming=function(p,w=60,d=62){
  this.noPlant(0,0,w+6,d+10);
  // Three wings plus split front — the landscaped core is open to the sky.
  const pieces=[[-23,-1,14,58],[23,-1,14,58],[0,-24,32,14],[-18.5,24,23,14],[18.5,24,23,14]];
  for(const [x,z,bw,bd] of pieces){
   this.solid(x,z,bw,bd);this.box(x,.23,z,bw+.25,.46,bd+.25,L.darkStone,24,.12);
   this.box(x,8.8,z,bw,17.1,bd,'#a9b1aa',24,.65);
   for(const yy of[4.6,8.9,13.2,17.55])this.box(x,yy,z,bw+.28,.23,bd+.28,'#c4c9be',24,1.0);
   for(let f=0;f<4;f++)for(const s of[-1,1]){
    let n=Math.max(1,Math.floor(bw/4.6));for(let i=0;i<n;i++)this.lawGlazing(x-bw/2+(i+.5)*bw/n,2.64+f*4.3,z+s*(bd/2+.035),bw/n*.74,2.8,s<0?Math.PI:0,.78+f*.07,1.5);
    n=Math.max(1,Math.floor(bd/5.2));for(let i=0;i<n;i++)this.lawGlazing(x+s*(bw/2+.035),2.64+f*4.3,z-bd/2+(i+.5)*bd/n,bd/n*.71,2.8,s*Math.PI/2,.78+f*.07,1.5);
   }
   // A shallow folded metal eave, not a traditional tiled ring roof.
   const key='v12-chen-eave',geo=this.geo(key,()=>{const q=new G.Geometry();q.quad([-.5,0,.5],[.5,0,.5],[.5,.32,-.5],[-.5,.32,-.5]);q.quad([-.5,-.13,.5],[.5,-.13,.5],[.5,0,.5],[-.5,0,.5]);q.quad([-.5,.32,-.5],[.5,.32,-.5],[.5,.17,-.5],[-.5,.17,-.5]);return q;});
   this.mesh(key,geo,x,18.00,z,bw+3.0,1,bd+2.5,'#5d6d64',9,1.95);
   this.box(x,18.48,z,bw-.8,.24,bd-.8,'#939e92',21,2.10);
  }
  // Expressed glass corner: existing whole-building form still classified as
  // typology, pending clear Chen Ming elevation imagery.
  this.local(-23.15,0,27.28,0,()=>{this.lawGlazing(0,8.65,3.88,13.66,16.66,0,.95,1.54);this.lawGlazing(-6.98,8.65,-2.35,12.4,16.66,-Math.PI/2,.95,1.54);for(const yy of[4.5,8.8,13.1,17.4]){this.box(0,yy,4.07,14.0,.105,.17,'#849a94',9,1.18);this.box(-7.1,yy,-2.18,.17,.105,12.6,'#849a94',9,1.18);}});
  this.box(0,15.90,24,14.1,3.5,14,L.stone,24,1.32); // open entrance below
  for(const x of[-6.7,6.7])this.box(x,7.35,29.5,.46,13.5,.60,L.darkStone,24,.88);
  this.box(0,5.37,31.0,13.4,.25,4.2,'#748078',9,1.5);
  this.lettering('陈明楼',0,16.0,31.20,9.4,1.66,0,'#5f6960');
  this.lettering('北京大学法学院',0,14.57,31.20,10.8,.69,0,'#5f6960');
  this.box(0,.12,0,31,.20,34,L.paving,26,.08);this.box(0,.12,23.5,13.1,.20,22,L.paving,26,.08);
  this.box(0,.26,-3.5,16,.28,16,'#738368',13,.12);this.box(0,.22,33.0,17,.36,3.0,L.paving,26,.15);
  for(const s of[-1,1]){this.local(s*11,0,-3.5,s*Math.PI/2,()=>this.bench(0,0));this.box(s*11,.36,12,3,.65,3,L.darkStone,24,.12);this.box(s*11,.76,12,2.65,.32,2.65,'#66785d',13,.14);}
 };
 P.lawCourtyard=function(p,w=26,d=63){
  this.noPlant(0,0,w+1,d+2);this.box(0,.075,0,w,.12,d,'#babdb0',26,.04);
  // A documented sequence of three courtyards. Hall and wing dimensions are
  // deliberately recorded as schematic; no invented interior rooms.
  const h=4.45;
  const hall=(x,z,bw,bd,gate=false)=>this.local(x,0,z,0,()=>{
   if(!gate){this.solid(0,0,bw,bd);this.box(0,h/2+.25,0,bw,h,bd,L.brick,18,.60);}
   else{const a=(bw-2.8)/2;for(const s of[-1,1]){this.solid(s*(a/2+1.4),0,a,bd);this.box(s*(a/2+1.4),h/2+.25,0,a,h,bd,L.brick,18,.60);}this.box(0,4.14,0,2.8,1.10,bd,L.brick,18,.62);}
   this.box(0,.19,0,bw+.3,.26,bd+.2,L.darkStone,24,.12);
   const n=Math.max(2,Math.round(bw/3.4));for(const s of[-1,1])for(let i=0;i<n;i++){
    let xx=-bw/2+(i+.5)*bw/n;if(gate&&Math.abs(xx)<1.6)continue;
    this.heritageWindow(xx,2.35,s*(bd/2+.035),Math.min(1.70,bw/n*.68),2.44,s<0?Math.PI:0,false,L.wood);
   }
   this.heritageRoof(0,h+.32,0,bw+.8,bd+1.0,1.56,'gable',L.roof,true,2.1);
   if(gate){for(const s of[-1,1]){this.box(s*1.42,1.95,bd/2+.09,.16,3.55,.25,L.wood,20,.86);this.local(s*1.32,0,bd/2-.6,s*Math.PI*.32,()=>{this.box(-s*.60,1.87,0,1.22,3.30,.08,'#523f36',20,.9);for(let z of[.85,1.88,2.90])this.box(-s*.60,z,.055,.90,.68,.04,'#634b3c',20,.93);});}this.box(0,3.73,bd/2+.10,3.12,.17,.33,L.wood,20,.87);}
  });
  // Four transverse ranges create three unfilled courts. The two middle
  // passage halls and southern gate have real openings.
  hall(0,-28.4,25.6,6.2,false);hall(0,-10.5,25.6,5.4,true);hall(0,10.5,25.6,5.4,true);hall(0,28.3,25.6,6.3,true);
  for(const z of[-20.4,0,20.4])for(const s of[-1,1])this.local(s*10.5,0,z,Math.PI/2,()=>hall(0,0,z===0?14.2:9.7,4.4,false));
  for(const x of[-12.85,12.85]){this.box(x,1.28,0,.22,2.5,62.8,L.brick,18,.52);this.box(x,2.56,0,.36,.13,62.9,L.roof,19,.58);}
  for(const z of[-20.9,0,20.9]){
   this.box(0,.16,z,3.0,.11,13.0,'#b9b9aa',26,.12);
   for(const x of[-5.4,5.4]){this.box(x,.25,z,4.8,.22,7.2,'#878d76',13,.10);for(const dx of[-2.44,2.44])this.box(x+dx,.29,z,.12,.3,7.48,'#a6ad9c',24,.13);for(const dz of[-3.64,3.64])this.box(x,.29,z+dz,4.95,.3,.13,'#a6ad9c',24,.13);}
  }
  this.sign('国双庭院',0,4.07,31.53,3.48,.70,0,false);
  this.heritagePlaque('3',2.04,2.33,31.58,.36,.28,0,false);
  this.box(0,.09,33,3.9,.15,3.0,L.paving,26,.1);
  for(const x of[-1.72,1.72]){this.box(x,.28,31.45,.46,.49,.65,L.darkStone,24,.16);this.cyl(x,.55,31.45,.16,.23,'#989e94',16,1,24,.2);}
 };
})(YY);
