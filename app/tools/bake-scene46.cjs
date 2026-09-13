/* Cache the complete original scene with lossless gzip and byte-exact mesh reuse. */
const fs=require('fs'),fsp=fs.promises,path=require('path'),http=require('http'),crypto=require('crypto'),zlib=require('zlib');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/runtime-v46/scene');
function playwright(){try{return require('playwright');}catch{}return require(path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).filter(p=>!/(?:assets|reference-gallery|engine|app-v29|materials|scene-cache46|scene-package46)\.js$/.test(p));
const atlasSourceHash=hash(Buffer.from(JSON.stringify(scripts.filter(p=>!p.endsWith('/visibility.js')).map(file=>[file,hash(fs.readFileSync(path.join(root,file)))]))));
const digest=crypto.createHash('sha256');for(const file of [...scripts,'tools/scene-collector46.js','tools/bake-scene46.cjs']){digest.update(file);digest.update(fs.readFileSync(path.join(root,file)));}
const baselineConfig=path.join(root,'data/scene-atlas-baseline46.json');if(fs.existsSync(baselineConfig)){const value=fs.readFileSync(baselineConfig);digest.update(value);digest.update(fs.readFileSync(path.join(root,JSON.parse(value).path)));}
const sourceHash=digest.digest('hex'),manifestPath=path.join(out,'manifest.json');
if(!process.argv.includes('--force')&&fs.existsSync(manifestPath)){
 const m=JSON.parse(fs.readFileSync(manifestPath));
 if(m.sourceHash===sourceHash&&m.chunks.every(c=>fs.existsSync(path.join(out,c.file))&&fs.existsSync(path.join(out,c.fallback)))&&fs.existsSync(path.join(out,m.atlas))){fs.writeFileSync(path.join(root,'src/scene-package46.js'),'YY.SCENE_PACKAGE46='+JSON.stringify({base:'assets/runtime-v46/scene/',...m})+';');console.log('Scene cache unchanged:',m.stats);process.exit(0);}
}
fs.mkdirSync(out,{recursive:true});
const temp=fs.mkdtempSync(path.join(out,'.bake-')),chunks=[],meshes=[],buckets=[],meshByHash=new Map(),bucketHashes=[];
let payload=[],payloadBytes=0,kind='mesh',meta,doneResolve,doneReject,buildStats;
const done=new Promise((a,b)=>{doneResolve=a;doneReject=b;});
function flush(){
 if(!payloadBytes)return;
 const raw=Buffer.concat(payload,payloadBytes);let compressed=zlib.gzipSync(raw,{level:6}),shuffle=0;
 // Reversible byte shuffling is selected only when it makes this chunk smaller.
 for(const stride of[4,32]){const arranged=Buffer.allocUnsafe(raw.length);let q=0;for(let lane=0;lane<stride;lane++)for(let i=lane;i<raw.length;i+=stride)arranged[q++]=raw[i];const zipped=zlib.gzipSync(arranged,{level:6});if(zipped.length<compressed.length){compressed=zipped;shuffle=stride;}}
 const n=chunks.length,key=hash(compressed).slice(0,24),file='chunk-'+key+'.bin.gz',fallback='chunk-'+key+'.js';
 fs.writeFileSync(path.join(temp,file),compressed);
 fs.writeFileSync(path.join(temp,fallback),'YY.SceneCache46.receive('+JSON.stringify(key)+','+JSON.stringify(compressed.toString('base64'))+');');
 chunks.push({key,file,fallback,kind,bytes:compressed.length,rawBytes:raw.length,shuffle,sha256:hash(raw)});payload=[];payloadBytes=0;
}
function append(bytes,type){
 if((kind!==type||payloadBytes+bytes.length>8*1024*1024)&&payloadBytes)flush();kind=type;
 const ref={chunk:chunks.length,offset:payloadBytes,length:bytes.length/4};payload.push(bytes);payloadBytes+=bytes.length;
 const padding=(4-bytes.length%4)%4;if(padding){payload.push(Buffer.alloc(padding));payloadBytes+=padding;}
 return ref;
}
function indexed(source){
 const copy=Buffer.from(source),bits=new Uint32Array(copy.buffer,copy.byteOffset,copy.length/4),n=bits.length/8,unique=[],table=new Map(),indices=new Uint32Array(n);
 for(let i=0;i<n;i++){
  const o=i*8;let h=2166136261;for(let k=0;k<8;k++)h=Math.imul(h^bits[o+k],16777619)>>>0;
  const candidates=table.get(h);let found=-1;
  if(candidates!==undefined)for(const id of typeof candidates==='number'?[candidates]:candidates){const q=unique[id]*8;let same=true;for(let k=0;k<8;k++)if(bits[q+k]!==bits[o+k]){same=false;break;}if(same){found=id;break;}}
  if(found<0){found=unique.length;unique.push(i);if(candidates===undefined)table.set(h,found);else if(typeof candidates==='number')table.set(h,[candidates,found]);else candidates.push(found);}indices[i]=found;
 }
 const small=unique.length<=65535,ix=small?new Uint16Array(indices):indices,indexBytes=Buffer.from(ix.buffer,ix.byteOffset,ix.byteLength);
 if(unique.length*32+indexBytes.length>=source.length*.95)return{vertices:source};
 const vertices=Buffer.allocUnsafe(unique.length*32);for(let i=0;i<unique.length;i++)copy.copy(vertices,i*32,unique[i]*32,unique[i]*32+32);
 // Verify the original ordered vertex stream, including normals and UVs, before accepting indexing.
 const restored=Buffer.allocUnsafe(copy.length);for(let i=0;i<n;i++)vertices.copy(restored,i*32,indices[i]*32,indices[i]*32+32);
 if(!restored.equals(copy))throw Error('Lossless vertex indexing changed source geometry');
 return{vertices,indices:indexBytes,indexType:small?'uint16':'uint32',uniqueVertices:unique.length};
}
function ranges(source){
 // Contiguous triangle ranges preserve the exact original drawing order.
 const copy=Buffer.from(source),p=new Float32Array(copy.buffer,copy.byteOffset,copy.length/4),n=p.length/8;
 if(n<6000)return null;
 const blocks=[];
 for(let first=0;first<n;first+=1536){const count=Math.min(1536,n-first),lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=first;i<first+count;i++)for(let k=0;k<3;k++){const v=p[i*8+k];lo[k]=Math.min(lo[k],v);hi[k]=Math.max(hi[k],v);}
  blocks.push([first,count,...lo,...hi]);
 }return blocks;
}
// Mesh and instance streams are temporarily separate so browser uploads can release mesh chunks immediately.
const meshBlobs=[],instanceBlobs=[];
async function body(req){const parts=[];for await(const c of req)parts.push(c);return Buffer.concat(parts);}
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
  if(req.method==='POST'&&url.pathname.startsWith('/__bake/')){
   const data=await body(req),name=url.pathname.slice(8);
   if(name==='meta')meta=JSON.parse(data);
   else if(name==='atlas')fs.writeFileSync(path.join(temp,'sign-atlas.png'),data);
   else if(name==='bucket'){
    const hlen=data.readUInt32LE(0),h=JSON.parse(data.subarray(4,4+hlen)),start=4+hlen,v=data.subarray(start,start+h.vertices*4),d=data.subarray(start+h.vertices*4,start+(h.vertices+h.instances)*4),s=data.subarray(start+(h.vertices+h.instances)*4);
    if(s.length!==h.spatial*4)throw Error('Incomplete scene bucket '+h.key);
    const signature=hash(v),identity=signature+':'+h.detailWidth;
    let mi=meshByHash.get(identity);
    if(mi===undefined){mi=meshes.length;meshByHash.set(identity,mi);const compact=indexed(v);meshes.push({hash:signature,detailWidth:h.detailWidth,vertexCount:h.vertices/8,uniqueVertexCount:compact.uniqueVertices||h.vertices/8,indexType:compact.indexType||null,ranges:h.instances===28?ranges(v):null});const f=path.join(temp,'mesh-'+mi+'.raw');fs.writeFileSync(f,compact.vertices);const ix=compact.indices?path.join(temp,'mesh-'+mi+'.indices'):null;if(ix)fs.writeFileSync(ix,compact.indices);meshBlobs.push({file:f,indices:ix});}
    const i=buckets.length,file=path.join(temp,'instances-'+i+'.raw');fs.writeFileSync(file,Buffer.concat([d,s]));instanceBlobs.push({file,dataBytes:d.length});
    buckets.push({key:h.key,mesh:mi,count:h.instances/28,dataHash:hash(d),spatialHash:hash(s)});bucketHashes.push({key:h.key,vertexHash:signature,dataHash:hash(d)});
   }else if(name==='done'){buildStats=JSON.parse(data);doneResolve();}
   else throw Error('Unknown bake endpoint');
   res.writeHead(200);res.end('ok');return;
  }
  if(url.pathname==='/__bake.html'){
   res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end('<!doctype html><meta charset="utf-8">'+scripts.map(s=>'<script src="/'+s+'"></script>').join('')+'<script src="/tools/scene-collector46.js"></script>');return;
  }
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep))throw Error('Invalid asset path');
  const stat=await fsp.stat(file);res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript; charset=utf-8':'application/octet-stream','Content-Length':stat.size});fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500);res.end(String(e));if(req.method==='POST')doneReject(e);else console.error('Asset request failed:',req.url,String(e));}
});
(async()=>{
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;
  browser=await playwright().chromium.launch({headless:true,channel:'chrome'});const p=await browser.newPage();p.on('console',m=>console.log(m.text()));p.on('pageerror',e=>doneReject(e));
  await p.goto('http://127.0.0.1:'+port+'/__bake.html',{timeout:120000});
  const[result]=await Promise.all([p.evaluate(()=>YY.collectScene46()),done]);console.log('Collected original scene:',result);
  await browser.close();browser=null;
  for(let i=0;i<meshBlobs.length;i++){const q=meshBlobs[i];meshes[i].buffer=append(fs.readFileSync(q.file),'mesh');fs.unlinkSync(q.file);if(q.indices){meshes[i].indices=append(fs.readFileSync(q.indices),'mesh');fs.unlinkSync(q.indices);}}flush();
  for(let i=0;i<instanceBlobs.length;i++){const q=instanceBlobs[i],raw=fs.readFileSync(q.file),ref=append(raw,'instances');buckets[i].data={...ref,length:q.dataBytes/4};buckets[i].spatial={chunk:ref.chunk,offset:ref.offset+q.dataBytes,length:(raw.length-q.dataBytes)/4};fs.unlinkSync(q.file);}flush();
  // Retain the original atlas for unchanged drawing inputs, including exact glyph antialiasing.
  const atlasBaselinePath=path.join(root,'data/scene-atlas-baseline46.json');
  if(fs.existsSync(atlasBaselinePath)){const baseline=JSON.parse(fs.readFileSync(atlasBaselinePath));if(baseline.sourceHash===atlasSourceHash){const original=fs.readFileSync(path.join(root,baseline.path));if(hash(original)!==baseline.sha256)throw Error('Original lettering atlas checksum mismatch');fs.writeFileSync(path.join(temp,'sign-atlas.png'),original);}}
  const atlas='sign-atlas-'+hash(fs.readFileSync(path.join(temp,'sign-atlas.png'))).slice(0,24)+'.png';fs.renameSync(path.join(temp,'sign-atlas.png'),path.join(temp,atlas));
  const manifest={...meta,version:2,sourceHash,meshes,buckets,chunks,buildStats,atlas};
  const rawVertices=meshes.reduce((s,m)=>s+m.vertexCount*32,0),instances=buckets.reduce((s,b)=>s+b.count,0),triangles=buckets.reduce((s,b)=>s+b.count*meshes[b.mesh].vertexCount/3,0);
  if(instances!==meta.stats.instances||triangles!==meta.stats.triangles)throw Error('Cached geometry counts differ from original scene');
  manifest.packedStats={originalBuckets:buckets.length,uniqueMeshes:meshes.length,originalVertexBytes:rawVertices,vertexBytes:meshes.reduce((s,m)=>s+m.uniqueVertexCount*32,0),indexBytes:meshes.reduce((s,m)=>s+(m.indices?m.vertexCount*(m.indexType==='uint16'?2:4):0),0),compressedBytes:chunks.reduce((s,c)=>s+c.bytes,0),rawBytes:chunks.reduce((s,c)=>s+c.rawBytes,0)};
  fs.writeFileSync(path.join(temp,'manifest.json'),JSON.stringify(manifest));fs.writeFileSync(path.join(temp,'bucket-hashes.json'),JSON.stringify(bucketHashes));
  fs.writeFileSync(path.join(root,'src/scene-package46.js'),'YY.SCENE_PACKAGE46='+JSON.stringify({base:'assets/runtime-v46/scene/',...manifest})+';');
  for(const file of fs.readdirSync(temp))fs.renameSync(path.join(temp,file),path.join(out,file));fs.rmdirSync(temp);
  console.log('Lossless scene cache:',manifest.packedStats);
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
