/* 192 Tencent wing: four visible levels and a single near east-west gable.
 * North labelled footage and independent south aerial agree on this topology.
 * Preserve the original display height, body envelope and ring. The south
 * upper setback, shafts, shared bridge and precise heights remain unresolved.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/1031892011';
function render(b,f,add){
 const result=A.footprint(b,f,add,{key:'building192-v46',roof:'gable',floors:4});
 return {...result,strategy:'building192-v46',floors:4,heightMeasured:false,displayHeightRetained:true,facadesVerified:false,entranceVerified:false,upperSetbackReconstructed:false,scope:'observed-gable-and-storeys-only; original-display-envelope'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building192={id:ID,render};
})(YY);
