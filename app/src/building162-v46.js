/* 162: the official north-oriented campus map places Weixiu 24 at this ring;
 * the 2023 housing list documents five storeys in three separate units.
 * Only the floor count is corrected here. Existing outline, flat roof,
 * display height and fitted dormitory facade treatment remain unchanged.
 * A measured elevation and complete facade reconstruction are still missing.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/876533985';
function render(b,f,add){
 const result=A.footprint(b,f,add,{key:'building162-v46',floors:5});
 return {...result,strategy:'building162-v46',floors:5,heightMeasured:false,displayHeightRetained:true,facadesVerified:false,entranceVerified:false,scope:'documented-floor-count-only; retained-display-height-and-fitted-facades'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building162={id:ID,render};
})(YY);
