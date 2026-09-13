/* v5 planar road graph. The render mesh and route solver consume these same edges.
   Coordinates are reviewed local metres, referenced to WGS84. */
(function(Y){'use strict';
const EPS=1e-7,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),cross=(a,b)=>a[0]*b[1]-a[1]*b[0],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]];
function build(roads){
 const raw=[];roads.forEach((r,ri)=>{for(let i=1;i<r.points.length;i++){let a=r.points[i-1],b=r.points[i];if(dist(a,b)>EPS)raw.push({a,b,r,ri,cuts:[0,1]})}});
 function cut(s,p){let d=sub(s.b,s.a),l=d[0]*d[0]+d[1]*d[1],t=((p[0]-s.a[0])*d[0]+(p[1]-s.a[1])*d[1])/l;if(t>-EPS&&t<1+EPS&&Math.abs(cross(sub(p,s.a),d))<EPS*Math.sqrt(l))s.cuts.push(Math.max(0,Math.min(1,t)))}
 for(let i=0;i<raw.length;i++)for(let j=i+1;j<raw.length;j++){let a=raw[i],b=raw[j],u=sub(a.b,a.a),v=sub(b.b,b.a),w=sub(b.a,a.a),den=cross(u,v);
  if(Math.abs(den)>EPS){let t=cross(w,v)/den,s=cross(w,u)/den;if(t>=-EPS&&t<=1+EPS&&s>=-EPS&&s<=1+EPS){a.cuts.push(Math.max(0,Math.min(1,t)));b.cuts.push(Math.max(0,Math.min(1,s)))}}
  else if(Math.abs(cross(w,u))<EPS){cut(a,b.a);cut(a,b.b);cut(b,a.a);cut(b,a.b)}
 }
 const nodes=[],edges=[],keys=new Map(),edgeKeys=new Map();
 function node(p){let key=p.map(x=>Math.round(x*1e6)).join(',');if(keys.has(key))return keys.get(key);let id=nodes.length;nodes.push({id,p:[...p],links:[]});keys.set(key,id);return id}
 for(let s of raw){let cuts=s.cuts.sort((a,b)=>a-b).filter((t,i,a)=>!i||t-a[i-1]>EPS);for(let k=1;k<cuts.length;k++){let pts=[cuts[k-1],cuts[k]].map(t=>[s.a[0]+(s.b[0]-s.a[0])*t,s.a[1]+(s.b[1]-s.a[1])*t]);let a=node(pts[0]),b=node(pts[1]);if(a===b)continue;let key=[Math.min(a,b),Math.max(a,b)].join(':');if(edgeKeys.has(key)){const e=edges[edgeKeys.get(key)];e.w=Math.max(e.w,s.r.w||3);continue}let e={id:edges.length,a,b,points:pts,w:s.r.w||3,kind:s.r.kind||'road',name:s.r.name||'校园道路',length:dist(...pts),source:s.r.source||'mapImage'};edgeKeys.set(key,e.id);edges.push(e);nodes[a].links.push({to:b,edge:e.id,cost:e.length});nodes[b].links.push({to:a,edge:e.id,cost:e.length})}}
 return{nodes,edges,frame:'WGS84-local-metres-v29',georeferenced:true};
}
function nearest(g,p){let best=null,d=Infinity;for(let n of g.nodes){let dd=dist(n.p,p);if(dd<d){best=n;d=dd}}return best}
function components(g){let visited=new Set(),out=[];for(let n of g.nodes)if(!visited.has(n.id)){let q=[n.id],arr=[];visited.add(n.id);while(q.length){let i=q.pop();arr.push(i);for(let l of g.nodes[i].links)if(!visited.has(l.to)){visited.add(l.to);q.push(l.to)}}out.push(arr)}return out}
function route(g,start,end){let s=nearest(g,start),t=nearest(g,end);if(!s||!t)return null;
 // Doors must be explicitly attached to graph; reject accidental long "snaps".
 if(dist(s.p,start)>.1||dist(t.p,end)>.1)return null;
 let cost=new Float64Array(g.nodes.length).fill(Infinity),prev=new Int32Array(g.nodes.length).fill(-1),done=new Set();cost[s.id]=0;
 for(let count=0;count<g.nodes.length;count++){let u=-1,best=Infinity;for(let n of g.nodes)if(!done.has(n.id)&&cost[n.id]<best){best=cost[n.id];u=n.id}if(u<0)break;if(u===t.id)break;done.add(u);for(let l of g.nodes[u].links){let d=cost[u]+l.cost;if(d<cost[l.to]){cost[l.to]=d;prev[l.to]=u}}}
 if(!Number.isFinite(cost[t.id]))return null;let ids=[],u=t.id;while(u!==-1){ids.unshift(u);if(u===s.id)break;u=prev[u]}return{points:ids.map(i=>g.nodes[i].p.slice()),nodeIds:ids,length:cost[t.id],distanceNote:'公开路网平面长度，未核验实际通行'};
}
function sample(points,d){if(!points.length)return{point:[0,0],direction:[0,1],done:true};let total=0;for(let i=1;i<points.length;i++){let a=points[i-1],b=points[i],len=dist(a,b);if(d<=total+len||i===points.length-1){let t=Math.max(0,Math.min(1,(d-total)/(len||1)));return{point:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],direction:[(b[0]-a[0])/(len||1),(b[1]-a[1])/(len||1)],done:d>=total+len&&i===points.length-1}}total+=len}return{point:points[0].slice(),direction:[0,1],done:true}}
function routeEdges(g,r){if(!r)return[];let out=[];for(let i=1;i<r.nodeIds.length;i++){const link=g.nodes[r.nodeIds[i-1]].links.find(l=>l.to===r.nodeIds[i]);if(!link)throw new Error('Route contains a disconnected pair');out.push(link.edge)}return out}
Y.Network={build,route,routeEdges,components,nearest,sample};
})(YY);
