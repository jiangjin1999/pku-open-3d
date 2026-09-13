/* 102 中水站: a bounded correction, not completed facade reconstruction.
 * PKU Power Center documents one above-ground storey and a 5.3 m building.
 * The source ring is 155.698 m², consistent with its documented 156 m².
 * The native aerial shows a flat roof. Existing neutral window/frame treatment
 * remains fitted: no ground photograph yet fixes the full elevations or entry.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/1009051995';
const TOTAL=5.3,PARAPET_TOP_OFFSET=.825;
function render(b,f,add){
 // footprint()'s existing cap reaches body + .825. Account for that explicitly
 // so the parapet does not raise the documented 5.3 m building to 6.125 m.
 const result=A.footprint(b,f,add,{key:'building102-v46',style:'modern',roof:'flat',height:TOTAL-PARAPET_TOP_OFFSET,floors:1});
 return {...result,strategy:'building102-v46',floors:1,documentedHeight:TOTAL,basementFloors:2,sourceOutline:true,facadesVerified:false,entranceVerified:false,scope:'documented-massing-correction; retained-fitted-facades'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building102={id:ID,render,totalHeight:TOTAL,bodyHeight:TOTAL-PARAPET_TOP_OFFSET};
})(YY);
