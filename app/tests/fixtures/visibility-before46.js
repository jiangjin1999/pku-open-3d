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
 Y.Visibility={keepDetail,keepSurfaceDetail,prepare,bounds};
})(YY);
