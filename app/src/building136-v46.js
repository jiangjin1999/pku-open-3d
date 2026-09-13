/* 136 / Weixiu 28 main bar: the official 2023 unit list supports five floors.
 * This correction keeps the original boundary and 15 m display envelope;
 * it does not assign that floor count or a new height to the eastern 137 wing. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/876533979';
function render(b,f,add){
 const copy={...f,properties:{...f.properties,floors:5,height:15,roofTreatment:'flat',architecture:{...f.properties.architecture,strategy:'footprint'}}};
 const result=A.footprint(b,copy,add,{key:'136-five-floor-fit',height:15,floors:5,roof:'flat',style:'dorm'});
 return {...result,id:ID,strategy:'building136-five-floor-v46',mainBarFloors:5,officialUnits:[4,6],heightMeasured:false,sourceOutline:true,facadesVerified:false,eastWingAltered:false,entranceVerified:false,limits:'Five floors of the 28 main bar are supported by the official unit list. The unchanged 15 m envelope and inherited opening rhythm are unmeasured; 137 and the exact joint/facades remain separate unresolved work.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building136={id:ID,render};
})(YY);
