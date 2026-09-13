/* Projected-detail policy. Does not remove campus objects or mutate their footprints.
   Shared by main, reflected, shadow and picking passes; inspected objects stay complete. */
(function(Y){'use strict';
 const essential=new Set([0,4,7,8,15,17,21]);
 function keepDetail(size,distance,focal,options={}){
  if(options.enabled===false||options.isolate||options.id===options.selected||essential.has(options.material))return true;
  if(distance<260)return true;
  return size*focal/Math.max(1,distance)>=1.6;
 }
 function bounds(geometry){let lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(let i=0;i<geometry.v.length;i+=8)for(let j=0;j<3;j++){lo[j]=Math.min(lo[j],geometry.v[i+j]);hi[j]=Math.max(hi[j],geometry.v[i+j]);}return{center:lo.map((v,i)=>(v+hi[i])/2),half:lo.map((v,i)=>(hi[i]-v)/2)};}
 function prepare(data,geometry){const{center:c,half:h}=bounds(geometry),out=new Float32Array(data.length/28*5);for(let i=0,n=0;i<data.length;i+=28,n+=5){out[n]=data[i]*c[0]+data[i+4]*c[1]+data[i+8]*c[2]+data[i+12];out[n+1]=data[i+1]*c[0]+data[i+5]*c[1]+data[i+9]*c[2]+data[i+13];out[n+2]=data[i+2]*c[0]+data[i+6]*c[1]+data[i+10]*c[2]+data[i+14];const ext=[0,1,2].map(j=>Math.abs(data[i+j])*h[0]+Math.abs(data[i+4+j])*h[1]+Math.abs(data[i+8+j])*h[2]);out[n+3]=Math.hypot(...ext)+1.2;const sides=[0,4,8].map((k,j)=>2*h[j]*Math.hypot(data[i+k],data[i+k+1],data[i+k+2])).sort((a,b)=>a-b);out[n+4]=sides[1];}return out;}
 function keepSurfaceDetail(width,distance,focal,enabled=true){return enabled===false||width*focal/Math.max(1,distance)>=.85;}
 function sphereVisible(planes,x,y,z,r){for(let k=0;k<planes.length;k++){const p=planes[k];if(p[0]*x+p[1]*y+p[2]*z+p[3]<-r)return false;}return true;}
 function compile(bucket){
  const data=bucket.data,sp=bucket.spatial,n=data.length/28,ids=new Set(),materials=new Set(),surface=bucket.detailWidth?new Float64Array(n):null,flags=new Uint8Array(n);
  let x0=Infinity,y0=Infinity,z0=Infinity,x1=-Infinity,y1=-Infinity,z1=-Infinity,maxPart=0;
  for(let i=0,j=0,k=0;i<data.length;i+=28,j+=5,k++){
   const x=sp[j],y=sp[j+1],z=sp[j+2],r=sp[j+3];x0=Math.min(x0,x-r);y0=Math.min(y0,y-r);z0=Math.min(z0,z-r);x1=Math.max(x1,x+r);y1=Math.max(y1,y+r);z1=Math.max(z1,z+r);
   ids.add(data[i+21]);materials.add(data[i+20]);maxPart=Math.max(maxPart,Math.abs(data[i+23]));flags[k]=essential.has(data[i+20])?1:0;
   if(surface)surface[k]=bucket.detailWidth*Math.min(Math.hypot(data[i],data[i+1],data[i+2]),Math.hypot(data[i+4],data[i+5],data[i+6]),Math.hypot(data[i+8],data[i+9],data[i+10]));
  }
  bucket.ids=ids;bucket.materials=materials;bucket.uniformMaterial=materials.size===1?materials.values().next().value:null;bucket.uniformId=ids.size===1?ids.values().next().value:null;bucket.maxPart=maxPart;bucket.surfaceWidths=surface;bucket.essentialFlags=flags;
  bucket.coarse=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,Math.hypot(x1-x0,y1-y0,z1-z0)/2];
 }
 function select(bucket,planes,eye,focal,state){
  const data=bucket.data,sp=bucket.spatial,iso=state.isolate,only=bucket.uniformId,coarse=bucket.coarse;
  if(iso&&!bucket.ids.has(iso)&&!bucket.ids.has(999999))return{count:0,culled:0};
  if(only!==null&&((state.vegetation===false&&only>=800000&&only<900000)||(only>=950000&&only<960000&&!state.routeEdges?.has(only-950000))))return{count:0,culled:0};
  if(!sphereVisible(planes,coarse[0],coarse[1],coarse[2],coarse[3]+Math.abs(state.explode||0)*bucket.maxPart))return{count:0,culled:0};
  let out=bucket.visible||(bucket.visible=new Float32Array(Math.min(64,bucket.count)*28)),count=0,culled=0;
  const enabled=state.detailLOD!==false,selected=state.selected,surface=bucket.surfaceWidths,flags=bucket.essentialFlags;
  for(let i=0,j=0,k=0;i<data.length;i+=28,j+=5,k++){
   const id=data[i+21];if(iso&&id!==iso&&id!==999999)continue;
   if((state.vegetation===false&&id>=800000&&id<900000)||(id>=950000&&id<960000&&!state.routeEdges?.has(id-950000)))continue;
   const x=sp[j],y=sp[j+1]+(id===selected?(state.explode||0)*data[i+23]:0),z=sp[j+2],r=sp[j+3];
   if(!sphereVisible(planes,x,y,z,r))continue;
   if(enabled){
    const dx=x-eye[0],dy=y-eye[1],dz=z-eye[2],distanceSq=dx*dx+dy*dy+dz*dz,width=data[i+20]===38?sp[j+4]:(surface?surface[k]:0);
    const surfaceLimit=width*focal/.85;
    if(width&&Math.max(1,distanceSq)>surfaceLimit*surfaceLimit){culled++;continue;}
    if(!iso&&id!==selected&&!flags[k]&&distanceSq>=260*260){const limit=sp[j+4]*focal/1.6;if(distanceSq>limit*limit){culled++;continue;}}
   }
   if((count+1)*28>out.length){const next=new Float32Array(Math.min(data.length,Math.max(28,out.length*2)));next.set(out);out=bucket.visible=next;}
   for(let t=0;t<28;t++)out[count*28+t]=data[i+t];count++;
  }
  return{count,culled};
 }
 Y.Visibility={keepDetail,keepSurfaceDetail,prepare,bounds,sphereVisible,compile,select};
})(YY);
