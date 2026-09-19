// Metric surface detail for the existing material families. This is a shading
// description, not a claim about an unmeasured building's construction. Preserve
// the full-resolution atlas and offline source in materials.js; tile ribs remain
// geometry, while material 25 supplies only the clay's fine surface texture.
// Inject after the renderer's noise, filteredNoise and bump helpers.
YY.MATERIAL_DETAIL_GLSL=`
void campusMaterialDetail(float mat,vec2 st,float dist,inout vec3 base,inout vec3 n,inout float rough){
 if(mat==18.){
  // Existing 240 x 74 mm brick course, with a narrow recessed mortar bed.
  // Take derivatives before staggering: row boundaries must not inflate the
  // footprint and erase the neighbouring courses.
  vec2 b=st/vec2(.24,.074),fw=max(fwidth(b),vec2(.0001));
  b.x+=mod(floor(b.y),2.)*.5;
  vec2 edge=min(fract(b),1.-fract(b));
  vec2 face=smoothstep(vec2(.012,.033)-fw*.5,vec2(.023,.054)+fw*.5,edge);
  float fade=1.-smoothstep(.35,1.5,max(fw.x,fw.y));
  float joint=face.x*face.y,variation=mix(.5,hash(floor(b)),fade);
  float patina=filteredNoise(st*.53),grain=filteredNoise(st*19.);
  vec3 brick=base*(.86+.18*variation-.045*patina);
  // Mortar inherits the local masonry colour rather than painting all walls
  // with one green-grey joint colour.
  base=mix(brick,base*.76,(1.-joint)*fade);
  rough=clamp(.94+(grain-.5)*.05, .90,.98);
  float height=joint*.0018*fade+(grain-.5)*.00045;
  vec3 detail=bump(n,height);
  n=normalize(mix(n,detail,1.-smoothstep(75.,95.,dist)));
 }
 if(mat==19.){
  vec2 t=st/vec2(.235,.34),fw=max(fwidth(t),vec2(.0001)),q=fract(t);
  float fade=1.-smoothstep(.35,1.7,max(fw.x,fw.y));
  float gutter=.5+.5*cos(q.x*6.2831853);
  // A smooth overlap at both ends of a course prevents a discontinuous bump
  // impulse at fract() wrap. Existing physical tile meshes use material 25.
  float lip=1.-smoothstep(.015,.06+fw.y,min(q.y,1.-q.y));
  float variation=mix(.5,hash(floor(t)),fade);
  base*=.86+.10*variation+(.08*(gutter-.5)-.035*lip)*fade;
  rough=.90+.045*(variation-.5);
  vec3 detail=bump(n,(gutter*.012-lip*.002)*fade);
  n=normalize(mix(n,detail,1.-smoothstep(70.,90.,dist)));
 }
 if(mat==20.){
  // Elongated grain keeps timber distinct from isotropic mineral surfaces.
  // Pixel filtering preserves quiet grain at grazing angles and far distances.
  float grain=filteredNoise(st*vec2(5.,110.));
  base*=.90+.13*grain;
  rough=.80+.08*(grain-.5);
  vec3 detail=bump(n,(grain-.5)*.00035);
  n=normalize(mix(n,detail,1.-smoothstep(25.,40.,dist)));
 }
 if(mat==24.){
  float mineral=filteredNoise(st*2.),grain=filteredNoise(st*70.);
  base*=.94+.035*mineral+.020*grain;
  rough=.94+.035*(grain-.5);
  vec3 detail=bump(n,filteredNoise(st*25.)*.00065);
  n=normalize(mix(n,detail,1.-smoothstep(35.,45.,dist)));
 }
 if(mat==25.){
  float clay=filteredNoise(st*7.),grain=filteredNoise(st*55.);
  base*=.91+.045*clay+.025*grain;
  rough=.89+.05*(clay-.5);
  vec3 detail=bump(n,filteredNoise(st*23.)*.0008);
  n=normalize(mix(n,detail,1.-smoothstep(45.,55.,dist)));
 }
}
// Rain response distinguishes porous surfaces, foliage, glass and metal.
// Exposure uses surface orientation only; it does not imply surveyed shelter.
void campusRainResponse(float mat,float upward,inout vec3 base,inout float rough){
 if(mat==4.)return;
 if(mat==3.||mat==16.||mat==45.||mat==46.){base*=.94;rough*=.80;return;}
 if(mat==5.||mat==28.||mat==44.){rough*=.90;return;}
 if(mat==9.||mat==29.||mat==32.||mat==37.||mat==43.){base*=.96;rough*=.82;return;}
 float exposure=.15+.85*smoothstep(-.35,.75,upward);
 base*=mix(1.,.82,exposure);rough*=mix(1.,.54,exposure);
}
`;
