/* Load the byte-exact prepared scene off the UI thread, in bounded chunks. */
(function(Y){'use strict';
 const pendingFiles=new Map();
 let localTextures;
 async function textureSource(kind,url){
  if(location.protocol!=='file:')return url;
  if(!localTextures)localTextures=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=Y.TEXTURE_FALLBACK46;script.onload=()=>{script.remove();Y.LOCAL_TEXTURES46?resolve(Y.LOCAL_TEXTURES46):reject(Error('Local textures are incomplete'));};script.onerror=()=>{script.remove();reject(Error('Local texture file is missing'));};document.head.append(script);});
  return(await localTextures)[kind];
 }
 const workerSource=`function unshuffle(buffer,width,little=new Uint8Array(new Uint32Array([1]).buffer)[0]===1){
  const src=new Uint8Array(buffer),out=new Uint8Array(src.length);
  // Restore four byte lanes per write without converting floating-point values.
  // Partial final records have equally sized lanes within each aligned word.
  if(little&&width%4===0&&src.length%4===0){
   const words=new Uint32Array(out.buffer),rows=Math.floor(src.length/width),tail=src.length%width,step=width/4;
   for(let lane=0;lane<width;lane+=4){
    const n=rows+(lane<tail?1:0),a=lane*rows+Math.min(lane,tail),b=a+n,c=b+n,d=c+n;
    for(let i=0,j=lane/4;i<n;i++,j+=step)words[j]=src[a+i]|src[b+i]<<8|src[c+i]<<16|src[d+i]<<24;
   }
  }else{let q=0;for(let lane=0;lane<width;lane++)for(let i=lane;i<src.length;i+=width)out[i]=src[q++];}
  return out.buffer;
 }
 self.onmessage=async({data:m})=>{try{
  let packed;
  if(m.encoded){const s=atob(m.encoded),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);packed=a;}
  else{const r=await fetch(m.url);if(!r.ok)throw Error('Scene chunk HTTP '+r.status);packed=new Uint8Array(await r.arrayBuffer());}
  const inflated=await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if(inflated.byteLength!==m.rawBytes)throw Error('Incomplete scene chunk');
  let buffer=inflated;
  if(m.shuffle)buffer=unshuffle(inflated,m.shuffle);
  if(self.crypto?.subtle){const digest=await crypto.subtle.digest('SHA-256',buffer),actual=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(actual!==m.sha256)throw Error('Scene chunk checksum mismatch');}
  self.postMessage({index:m.index,buffer},[buffer]);
 }catch(e){self.postMessage({index:m.index,error:String(e)});}};`;
 const yieldUI=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 function localChunk(base,index,chunk){
  if(pendingFiles.has(chunk.key))return pendingFiles.get(chunk.key).promise;
  const script=document.createElement('script');script.src=base+chunk.fallback;
  let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});
  const finish=()=>{script.remove();pendingFiles.delete(chunk.key);};
  pendingFiles.set(chunk.key,{promise,resolve:encoded=>{finish();resolve(encoded);}});
  script.onerror=()=>{finish();reject(Error('Scene data file is missing: '+chunk.fallback));};document.head.append(script);return promise;
 }
 function receive(key,encoded){pendingFiles.get(key)?.resolve(encoded);}
 async function load(engine,onProgress=()=>{}){
  const m=Y.SCENE_PACKAGE46;if(!m||m.version!==2)throw Error('Prepared scene manifest is missing or incompatible');
  const started=performance.now(),base=new URL(m.base,document.baseURI).href;
  const workerURL=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));
  const workers=Array.from({length:2},()=>new Worker(workerURL));let cursor=0,completed=0;
  const chunks=m.chunks.map(()=>({meshes:[],indices:[],buckets:[]}));
  m.meshes.forEach((mesh,index)=>{chunks[mesh.buffer.chunk].meshes.push({mesh,index});if(mesh.indices)chunks[mesh.indices.chunk].indices.push({mesh,index});});
  m.buckets.forEach(bucket=>chunks[bucket.data.chunk].buckets.push(bucket));
  engine.beginPrepared(m);
  const atlasSource=await textureSource('atlas',base+m.atlas),atlas=new Image();const atlasReady=new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=()=>reject(Error('Scene lettering atlas could not load'));atlas.src=atlasSource;});
  // Attach a handler immediately, even while the chunk workers are still active.
  atlasReady.catch(()=>{});
  const decode=(worker,index,chunk,encoded)=>new Promise((resolve,reject)=>{
   worker.onmessage=({data:r})=>r.error?reject(Error(r.error)):resolve(r.buffer);
   worker.onerror=e=>reject(Error(e.message||'Scene decoder failed'));
   worker.postMessage({index,url:base+chunk.file,encoded,rawBytes:chunk.rawBytes,shuffle:chunk.shuffle,sha256:chunk.sha256});
  });
  try{
   await Promise.all(workers.map(async worker=>{
    // One pending decode per worker overlaps the current chunk's bounded upload.
    const requestNext=()=>{
     if(cursor>=m.chunks.length)return null;
     const index=cursor++,chunk=m.chunks[index];
     const result=(async()=>{const encoded=location.protocol==='file:'?await localChunk(base,index,chunk):undefined;return decode(worker,index,chunk,encoded);})();
     result.catch(()=>{});return{index,result};
    };
    let next=requestNext();
    while(next){
     const {index,result}=next,buffer=await result;next=requestNext();
     const content=chunks[index];let checkpoint=performance.now();
     if(engine.disposed)throw Error('Scene loading was interrupted');
     for(const{mesh,index:mi}of content.meshes){engine.preparedVertices(mi,new Float32Array(buffer,mesh.buffer.offset,mesh.buffer.length));if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}}
     for(const{mesh,index:mi}of content.indices){const Type=mesh.indexType==='uint16'?Uint16Array:Uint32Array;engine.preparedIndices(mi,new Type(buffer,mesh.indices.offset,mesh.vertexCount));}
     for(const bucket of content.buckets){engine.preparedInstances(bucket,new Float32Array(buffer,bucket.data.offset,bucket.data.length),new Float32Array(buffer,bucket.spatial.offset,bucket.spatial.length));if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}}
     onProgress(++completed,m.chunks.length);await yieldUI();
    }
   }));
   await atlasReady;if(engine.disposed)throw Error('Scene loading was interrupted');engine.setAtlas(atlas);await engine.finishPrepared(yieldUI);
   const by=new Map(Y.CAMPUS.features.map(f=>[f.properties.pickId,f]));
   const campus={...m.campus,registry:new Map(m.campus.registryIds.map(id=>[id,by.get(id)]))};delete campus.registryIds;
   Y.sceneLoad46={ms:performance.now()-started,compressedBytes:m.packedStats.compressedBytes,chunks:m.chunks.length,sourceHash:m.sourceHash};
   return campus;
  }finally{workers.forEach(w=>w.terminate());URL.revokeObjectURL(workerURL);}
 }
 Y.SceneCache46={load,receive,textureSource};
})(YY);
