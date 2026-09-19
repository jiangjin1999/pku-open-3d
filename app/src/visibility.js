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
  const groups=bucket.groups=n>=128?new Float64Array(Math.ceil(n/64)*5):null;
  const detail=bucket.groupDetail=groups?new Float64Array(Math.ceil(n/64)*4):null,routes=bucket.groupRoutes=groups?new Uint8Array(Math.ceil(n/64)):null;
  let x0=Infinity,y0=Infinity,z0=Infinity,x1=-Infinity,y1=-Infinity,z1=-Infinity,maxPart=0;
  let ax=Infinity,ay=Infinity,az=Infinity,bx=-Infinity,by=-Infinity,bz=-Infinity,part=0;
  let minDetail=Infinity,minSurface=Infinity,maxDetail=0,maxSurface=0,hasRoute=0;
  let previousId=NaN,previousMaterial=NaN,previousEssential=0;
  // Build bucket and group metadata in one traversal of the decoded records.
  // Folding consecutive group bounds preserves the original extrema exactly.
  for(let i=0,j=0,k=0;i<data.length;i+=28,j+=5,k++){
   const x=sp[j],y=sp[j+1],z=sp[j+2],r=sp[j+3];
   ax=Math.min(ax,x-r);ay=Math.min(ay,y-r);az=Math.min(az,z-r);bx=Math.max(bx,x+r);by=Math.max(by,y+r);bz=Math.max(bz,z+r);
   const id=data[i+21],material=data[i+20];
   if(id!==previousId){ids.add(id);previousId=id;}
   if(material!==previousMaterial){materials.add(material);previousEssential=essential.has(material)?1:0;previousMaterial=material;}
   part=Math.max(part,Math.abs(data[i+23]));flags[k]=previousEssential;
   if(surface)surface[k]=bucket.detailWidth*Math.min(Math.hypot(data[i],data[i+1],data[i+2]),Math.hypot(data[i+4],data[i+5],data[i+6]),Math.hypot(data[i+8],data[i+9],data[i+10]));
   if(groups){
    const size=Math.abs(sp[j+4]),width=material===38?sp[j+4]:(surface?surface[k]:0);
    if(!previousEssential)minDetail=Math.min(minDetail,size);
    if(width)minSurface=Math.min(minSurface,Math.abs(width));
    maxDetail=Math.max(maxDetail,previousEssential?Infinity:size);maxSurface=Math.max(maxSurface,width?Math.abs(width):Infinity);
    if(id>=950000&&id<960000)hasRoute=1;
   }
   if((k&63)===63||k===n-1){
    x0=Math.min(x0,ax);y0=Math.min(y0,ay);z0=Math.min(z0,az);x1=Math.max(x1,bx);y1=Math.max(y1,by);z1=Math.max(z1,bz);maxPart=Math.max(maxPart,part);
    if(groups){const g=k>>6,q=g*5,d=g*4;
     groups[q]=(ax+bx)/2;groups[q+1]=(ay+by)/2;groups[q+2]=(az+bz)/2;groups[q+3]=Math.hypot(bx-ax,by-ay,bz-az)/2+1e-7;groups[q+4]=part;
     detail[d]=minDetail;detail[d+1]=minSurface;detail[d+2]=maxDetail;detail[d+3]=maxSurface;routes[g]=hasRoute;
    }
    ax=ay=az=Infinity;bx=by=bz=-Infinity;part=0;minDetail=minSurface=Infinity;maxDetail=maxSurface=hasRoute=0;
   }
  }
  bucket.ids=ids;bucket.materials=materials;bucket.uniformMaterial=materials.size===1?materials.values().next().value:null;bucket.uniformId=ids.size===1?ids.values().next().value:null;bucket.maxPart=maxPart;bucket.surfaceWidths=surface;bucket.essentialFlags=flags;
  bucket.coarse=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2,Math.hypot(x1-x0,y1-y0,z1-z0)/2];
 }
 function select(bucket,planes,eye,focal,state,scratch,ownedScratch=false,appendToStream=false){
  const data=bucket.data,sp=bucket.spatial,iso=state.isolate,only=bucket.uniformId,coarse=bucket.coarse;
  if(iso&&!bucket.ids.has(iso)&&!bucket.ids.has(999999))return{count:0,culled:0};
  if(only!==null&&((state.vegetation===false&&only>=800000&&only<900000)||(only>=950000&&only<960000&&!state.routeEdges?.has(only-950000))))return{count:0,culled:0};
  if(!sphereVisible(planes,coarse[0],coarse[1],coarse[2],coarse[3]+Math.abs(state.explode||0)*bucket.maxPart))return{count:0,culled:0};
  const offset=appendToStream?scratch.used:0;
  let out=scratch?scratch.data:bucket.visible;if(!out){out=new Float32Array(Math.min(64,bucket.count)*28);if(scratch)scratch.data=out;else bucket.visible=out;}let count=0,culled=0;
  const enabled=state.detailLOD!==false,selected=state.selected,surface=bucket.surfaceWidths,flags=bucket.essentialFlags,groups=bucket.groups;
  let inside=false,runStart=-1,runEnd=0,runOutput=0;
  for(let i=0,j=0,k=0;i<data.length;i+=28,j+=5,k++){
   if(groups&&(k&63)===0){
    const q=(k>>6)*5,r=groups[q+3]+Math.abs(state.explode||0)*groups[q+4];let outside=false;inside=true;
    for(const p of planes){const distance=p[0]*groups[q]+p[1]*groups[q+1]+p[2]*groups[q+2]+p[3];if(distance< -r){outside=true;break;}if(distance<r)inside=false;}
    if(outside){i+=63*28;j+=63*5;k+=63;continue;}
    // Conservative group bounds can prove every existing per-instance test
    // would accept. Ambiguous detail thresholds and filtering use the scalar path.
    if(inside&&!iso&&state.vegetation!==false&&bucket.groupDetail&&!bucket.groupRoutes[k>>6]){
     const d=(k>>6)*4,distance=Math.hypot(groups[q]-eye[0],groups[q+1]-eye[1],groups[q+2]-eye[2]),far=distance+r,near=Math.max(0,distance-r);
     if(enabled&&((near>=260&&!bucket.ids.has(selected)&&near>bucket.groupDetail[d+2]*focal/1.6)||Math.max(1,near)>bucket.groupDetail[d+3]*focal/.85)){
      const rejected=Math.min(64,data.length/28-k);culled+=rejected;i+=(rejected-1)*28;j+=(rejected-1)*5;k+=rejected-1;continue;
     }
     if(!enabled||((far<260||far<bucket.groupDetail[d]*focal/1.6)&&Math.max(1,far)<bucket.groupDetail[d+1]*focal/.85)){
      const accepted=Math.min(64,data.length/28-k),end=i+accepted*28,needed=offset+(count+accepted)*28;
      if(needed>out.length){
       const length=appendToStream?Math.max(needed,Math.ceil(out.length*1.25)):Math.min(data.length,Math.max(needed,out.length*2));let next;
       if(ownedScratch&&scratch&&out.byteOffset===0&&out.byteLength===out.buffer.byteLength&&typeof out.buffer.transfer==='function')next=new Float32Array(out.buffer.transfer(length*4));
       else{next=new Float32Array(length);next.set(out);}out=next;if(scratch)scratch.data=next;else bucket.visible=next;
      }
      if(runStart>=0){out.set(data.subarray(runStart,runEnd),offset+runOutput*28);runStart=-1;}
      out.set(data.subarray(i,end),offset+count*28);count+=accepted;
      i+=(accepted-1)*28;j+=(accepted-1)*5;k+=accepted-1;continue;
     }
    }
   }
   const id=data[i+21];if(iso&&id!==iso&&id!==999999)continue;
   if((state.vegetation===false&&id>=800000&&id<900000)||(id>=950000&&id<960000&&!state.routeEdges?.has(id-950000)))continue;
   const x=sp[j],y=sp[j+1]+(id===selected?(state.explode||0)*data[i+23]:0),z=sp[j+2],r=sp[j+3];
   if(!inside&&!sphereVisible(planes,x,y,z,r))continue;
   if(enabled){
    const dx=x-eye[0],dy=y-eye[1],dz=z-eye[2],distanceSq=dx*dx+dy*dy+dz*dz,width=data[i+20]===38?sp[j+4]:(surface?surface[k]:0);
    const surfaceLimit=width*focal/.85;
    if(width&&Math.max(1,distanceSq)>surfaceLimit*surfaceLimit){culled++;continue;}
    if(!iso&&id!==selected&&!flags[k]&&distanceSq>=260*260){const limit=sp[j+4]*focal/1.6;if(distanceSq>limit*limit){culled++;continue;}}
   }
   if(offset+(count+1)*28>out.length){
    const length=appendToStream?Math.max(offset+(count+1)*28,Math.ceil(out.length*1.25)):Math.min(data.length,Math.max(28,out.length*2));let next;
    // Engine consumes each prefix synchronously before reusing its own scratch.
    if(ownedScratch&&scratch&&out.byteOffset===0&&out.byteLength===out.buffer.byteLength&&typeof out.buffer.transfer==='function')next=new Float32Array(out.buffer.transfer(length*4));
    else{next=new Float32Array(length);next.set(out);}
    out=next;if(scratch)scratch.data=next;else bucket.visible=next;
   }
   // Copy consecutive accepted records as one typed-array span. Visibility
   // decisions and order stay unchanged; gaps end a span, never its neighbors.
   if(runStart>=0&&runEnd!==i){out.set(data.subarray(runStart,runEnd),offset+runOutput*28);runStart=-1;}
   if(runStart<0){runStart=i;runOutput=count;}
   runEnd=i+28;count++;
  }
  if(runStart>=0)out.set(data.subarray(runStart,runEnd),offset+runOutput*28);
  return{count,culled};
 }
 Y.Visibility={keepDetail,keepSurfaceDetail,prepare,bounds,sphereVisible,compile,select};
})(YY);
