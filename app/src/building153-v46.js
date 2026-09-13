/* 153: the registered winter panorama shows six north-facade window levels,
 * consistent with the official six-floor description. The northeast return,
 * entrances and elevations outside this view remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/849765901',FLOORS=6,HEIGHT_FIT=15;
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const result=A.footprint(b,f,add,{height:HEIGHT_FIT,floors:FLOORS,roof:'flat',style:'dorm',key:'153-six-floor-mass'});
 return {...result,strategy:'building153-six-floor-mass',officialFloors:FLOORS,northWindowLevels:FLOORS,heightMeasured:false,sourceFootprintPreserved:true,allFacadesVerified:false,entranceVerified:false,northeastReturnVerified:false};
};
Y.Building153={id:ID,officialFloors:FLOORS,heightFit:HEIGHT_FIT};
})(YY);
