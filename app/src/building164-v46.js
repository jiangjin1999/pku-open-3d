/* 164: Weixiuyuan 14, identified independently on the official2024 numbered map.
   Official2023 room records establish five floors; facade spacing remains a type fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/876533987',FLOORS=5,HEIGHT_FIT=15;
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 // Preserve the exact original ring and the existing dorm material/detail family.
 const result=A.footprint(b,f,add,{height:HEIGHT_FIT,floors:FLOORS,roof:'flat',style:'dorm',key:'164-five-floor-mass'});
 return{...result,strategy:'building164-five-floor-mass',officialFloors:FLOORS,heightMeasured:false,sourceFootprintPreserved:true,allFacadesVerified:false,entranceVerified:false,externalAppendagesVerified:false};
};
Y.Building164={id:ID,officialFloors:FLOORS,heightFit:HEIGHT_FIT};
})(YY);
