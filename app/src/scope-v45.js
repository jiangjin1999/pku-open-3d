/* Display scope approved in the V43 browser annotations. Source records remain archived. */
(function(Y){'use strict';
 const source=Y.CAMPUS,excluded=new Set(['way/876428130']);
 const features=source.features.filter(f=>!excluded.has(f.properties.id));
 const scope={bounds:[-1260,-735,530,795],excludedIds:[...excluded],reason:'使用者圈定本部及西侧园区，移除孤立中关园食堂',groundRects:[[-545,-735,1075,1530],[-1260,-480,745,620]]};
 Y.CAMPUS={...source,version:source.version==='44'?'45':source.version,title:'燕园 · 逐栋细化',features,rawFeatures:source.rawFeatures.filter(f=>!excluded.has(f.properties.id)),peripheryImagery:source.peripheryImagery.filter(a=>a.id!=='east'),displayScope45:scope};
})(YY);
