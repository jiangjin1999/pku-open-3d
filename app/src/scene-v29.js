/* Assemble every mapped object directly in the reviewed local metre frame. */
(function(Y){'use strict';const {M,Geo:G,Footprints:F}=Y,D=Y.CAMPUS;
function create(engine){const L=Y.Landscape42,b=new Y.Builder(engine),I=M.identity(),registry=new Map(),roofChecks=[],geomStats={sourceBuildings:0,buildingPolygons:0,courtyards:0},batch=new Map();
 const add=(key,g,color,mat,id=0)=>{if(g.v.length)engine.add(key,g,I,color,[mat,id,0,0])};
 function merged(key,g,color,mat){if(!batch.has(key))batch.set(key,{g:new G.Geometry(),color,mat});const v=batch.get(key).g.v;for(const n of g.v)v.push(n)}
 const extent=D.imagery.rect,ground={type:'Polygon',coordinates:[[[extent[0],extent[1]],[extent[0]+extent[2],extent[1]],[extent[0]+extent[2],extent[1]+extent[3]],[extent[0],extent[1]+extent[3]],[extent[0],extent[1]]]]};
 const groundCuts=[Y.Building008,Y.Building080,Y.StudentCenterSouth46].filter(Boolean).map(q=>q.groundCut),cutGround=g=>Y.GroundCuts46.geometry(g,groundCuts);
 b.id=999999;D.displayScope45.groundRects.forEach((rect,i)=>Y.GroundCuts46.plate(b,add,rect,groundCuts,i));b.id=0;
 add('geographic-basemap',F.surface(cutGround(ground),.01),'#dce2ce',40);
 const boundary=D.features.find(f=>f.properties.kind==='boundary');add('campus-land',F.surface(cutGround(boundary.geometry),.02),'#c6d3b4',0);
 for(const f of D.landcover)merged('mapped-green',F.surface(cutGround({type:'Polygon',coordinates:[f.ring]}),.035),f.wooded?'#a1ba91':'#aebf95',0);
 L.ground(b,add);
 for(const f of D.features){const p=f.properties,g=f.geometry,id=p.pickId,kind=p.kind;if(kind==='boundary')continue;
  registry.set(id,f);
  if(kind==='building'){
   geomStats.sourceBuildings++;const poly=F.polygons(g);geomStats.buildingPolygons+=poly.length;geomStats.courtyards+=poly.reduce((s,x)=>s+x.length-1,0);const h=p.height,bodyHeight=p.roofTreatment==='hip'?h-Math.min(3.2,h*.20):p.roofTreatment==='barrel'?h*.55:h;
   const architecture=L.withElevation(b,f,()=>Y.Architecture30.render(b,f,add));roofChecks.push({id:p.id,architecture});
  }else if(kind==='heritage'){if(!L.bridge(b,f))L.withElevation(b,f,()=>{if(!Y.Refinements41?.bell(b,f))Y.Heritage31.render(b,f)});
  }else if(kind==='water'){add('water-'+id,F.surface(g,.5),'#689a91',4,id);for(const pg of F.polygons(g))for(const ring of pg)merged('water-edge',G.ribbon(ring,1.1,.25,false),'#aeb4a4',10);
  }else if(kind==='road'){if(g.type==='LineString'){const walk=['footway','path','steps'].includes(p.tags.highway);merged(walk?'footpaths':'roads',Y.StudentCenterSouth46.clipGroundRibbon(L.warp(G.ribbon(g.coordinates,p.width,.12,false))),walk?'#cbc7b7':'#9a9f96',walk?7:15);}else merged('road-plazas',L.warp(F.surface(cutGround(g),.10)),'#cbc7b7',7);
  }else if(kind==='landscape'){add('lawn-'+id,L.warp(F.surface(cutGround(g),.08)),'#9db683',0,id);
  }else if(kind==='sport'){
   if(!F.polygons(g).length)continue;const track=p.tags.leisure==='track'||/体育场/.test(p.label),climb=/攀岩|拓展/.test(p.label);add('sport-'+id,F.surface(g,track?.15:.20),climb?'#c5b797':track?'#b79078':'#91aa93',track?22:climb?7:0,id);
   const subdivided=Y.Sports32.render(b,f);const polygon=F.polygons(g)[0][0];if(!climb&&!subdivided){const lines=new G.Geometry();for(const ring of F.polygons(g)[0]){const ctr=p.centre,inner=ring.map(q=>[ctr[0]+(q[0]-ctr[0])*.92,ctr[1]+(q[1]-ctr[1])*.92]);for(const v of G.ribbon(inner,.13,.23,false).v)lines.v.push(v)}add('sport-lines-'+id,lines,'#e8e9d7',10,id);}
  }else if(kind==='pier'){if(Y.Building047?.render(b,f,add))continue;add('pier-body-'+id,F.walls(g,.2,1.25),'#b9b6a6',10,id);add('pier-deck-'+id,F.surface(g,1.25),'#c3c2b6',10,id);const fr=Y.ArchitectureAdapter.frame(g),cs=Math.cos(fr.r),sn=Math.sin(fr.r);b.id=id;for(const poly of F.polygons(g))for(const ring of poly)for(let k=1;k<ring.length;k++){const a=ring[k-1],c=ring[k],n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1]))),level=q=>{const x=cs*(q[0]-fr.centre[0])-sn*(q[1]-fr.centre[1]),z=sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1]),t=Math.abs(fr.w>=fr.d?x:z)/(Math.max(fr.w,fr.d)/2);return 1.46+.40*Math.pow(Math.max(0,(t-.68)/.32),1.3);};for(let j=0;j<n;j++){const u=j/n,v=(j+1)/n,q=[a[0]+(c[0]-a[0])*u,a[1]+(c[1]-a[1])*u],r=[a[0]+(c[0]-a[0])*v,a[1]+(c[1]-a[1])*v];b.beam([q[0],level(q),q[1]],[r[0],level(r),r[1]],.10,'#aeb5ac',10);}}
  }else if(kind==='gate'){Y.Gates33.render(b,f);}
 }
 const fenceRuns=Y.Fences35.render(b,D);
 // Historical courtyard sampling keeps its original RNG/IDs; enforce the current physical footprint last.
 const currentTreeClear=Y.Vegetation33.makeClear(D);
 const trees=[...Y.Vegetation33.generate(D).filter(t=>currentTreeClear(t.point,t.crownRadius)).filter(t=>!Y.Building010?.excludeGeneratedTree(t.point)).filter(t=>!L.officeTrees.some(o=>Math.hypot(o.point[0]-t.point[0],o.point[1]-t.point[1])<8)),...L.officeTrees],treeCount=trees.length;for(const t of trees){if(t.type==='conifer')L.conifer(b,t);else L.withElevation(b,{properties:{centre:t.point}},()=>b.tree(t.point[0],t.point[1],t.height,t.type||'broad',t.id,t));}
 for(const [key,v]of batch)add(key,v.g,v.color,v.mat);
 const roads=D.features.filter(f=>f.properties.kind==='road'&&f.geometry.type==='LineString');
 const network=Y.Network.build(roads.map(f=>({points:f.geometry.coordinates,w:f.properties.width,name:f.properties.label,kind:f.properties.tags.highway,source:f.properties.id})));for(const edge of network.edges)add('route-'+edge.id,Y.StudentCenterSouth46.clipGroundRibbon(L.warp(G.ribbon(edge.points,1.8,.32))), '#3a9a7d',17,950000+edge.id);
 engine.setAtlas(b.atlas);engine.upload();return{registry,geomStats,roofChecks,treeCount,trees,network,fenceRuns};
}
Y.createMetricCampus=create;
})(YY);
