/* 172: official identity, three storeys and flat roof only.
 * The old 7.5 m total display envelope is retained as an estimate.
 * Fitted windows and parapet are not measured facade reconstruction.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/916931885';
function render(b,f,add){
 // The existing flat-roof cap reaches body + .825; keep the previous total
 // display envelope instead of adding an unmeasured .825 m above it.
 const total=f.properties.height;
 const result=A.footprint(b,f,add,{key:'building172-v46',roof:'flat',height:total-.825,floors:3});
 return {...result,strategy:'building172-v46',floors:3,heightMeasured:false,displayEnvelopeRetained:true,totalDisplayHeight:total,facadesVerified:false,entranceVerified:false,scope:'documented-storeys-and-roof-only; fitted-facades-and-unmeasured-height'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building172={id:ID,render};
})(YY);
