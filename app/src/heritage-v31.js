/* Heritage models use independently anchored metre coordinates, never V28 campus x/z. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
P.singleHuabiao31=function(p){
 // Keep the complete original carving, but draw exactly one pillar at its mapped point.
 const local=this.local,origin=[...this.origin],rotation=this.rotation;let ordinal=0;
 this.local=function(x,y,z,r,fn){if(x===0&&y===0&&Math.abs(z)===18){if(ordinal++===0)return local.call(this,0,0,0,r,fn);return;}return local.call(this,x,y,z,r,fn)};
 try{this.historicHuabiao({...p,detailModel:{...p.detailModel,shaftRadii:p.detailModel?.shaftRadii||[.46,.52]}})}finally{this.local=local;this.origin=origin;this.rotation=rotation}
};
P.weimingStone31=function(){
 // Asymmetric upright natural rock, based on the archived ground photo; outline is approximate.
 const profile=[[-.73,0],[-.91,.6],[-.85,1.6],[-.42,2.45],[-.10,2.79],[.32,2.64],[.68,1.85],[.79,.55],[.96,.10]];
 const g=this.geo('heritage31-inscription-rock',()=>{
  const a=new G.Geometry(),outline=[];for(let i=0;i<profile.length;i++)for(let j=0;j<7;j++){const t=j/7,ps=[-1,0,1,2].map(k=>profile[(i+k+profile.length)%profile.length]);outline.push([0,1].map(k=>.5*((2*ps[1][k])+(-ps[0][k]+ps[2][k])*t+(2*ps[0][k]-5*ps[1][k]+4*ps[2][k]-ps[3][k])*t*t+(-ps[0][k]+3*ps[1][k]-3*ps[2][k]+ps[3][k])*t*t*t)))}
  const rings=[[.84,.355],[1,.15],[.93,-.31],[.73,-.48]].map(([scale,depth],l)=>outline.map(([x,y],i)=>{const rough=(Math.sin(i*3.7+l*1.3)+Math.sin(i*1.31))* .014;return[x*scale+rough,(y-1.35)*scale+1.35,depth+rough*.6]}));
  for(let i=0;i<outline.length;i++){const j=(i+1)%outline.length;a.tri([0,1.35,.36],rings[0][j],rings[0][i]);a.tri([0,1.35,-.48],rings[3][i],rings[3][j]);for(let k=0;k<3;k++)a.quad(rings[k][i],rings[k][j],rings[k+1][j],rings[k+1][i])}return a;});
 this.mesh('heritage31-inscription-rock',g,0,.09,0,1,1,1,'#74766b',22,.3);
 // Lettering is a readable transcription, not a facsimile of the calligraphy.
 for(const [i,ch]of [...'未名湖'].entries()){
  const key='stone-red-'+ch;let uv=this.signs.get(key);
  if(!uv){const k=this.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.font='90px "Songti SC",serif';this.ctx.fillStyle='#a92725';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.save();this.ctx.translate(px+256,py+64);this.ctx.scale(4,1);this.ctx.fillText(ch,0,0);this.ctx.restore();uv=[px/4096,1-(py+128)/4096,512/4096,128/4096];this.signs.set(key,uv)}
  this.mesh('plane',this.geo('plane',G.plane),.05,2.1-i*.58,.405,.42,.48,1,'#ffffff',8,.4,0,uv);
 }
};
P.snow31=function(){this.box(0,.16,0,3.8,.28,3.4,'#b7baae',10);this.box(0,.38,.3,2.5,.22,1.65,'#b8bcb1',10);this.box(0,.8,-.73,2.1,1.0,.24,'#d2d1c4',10);this.sign('埃德加·斯诺之墓',0,.87,-.59,1.86,.40,0,true)};
P.locationMarker31=function(){this.cyl(0,.10,0,.40,.12,'#ad815c',24,1,10);this.cyl(0,.22,0,.11,.30,'#6d7864',16,1,10)};
const rows=new Map(Y.HERITAGE31.map(a=>[a.id,a]));
function render(b,f){const a=rows.get(f.properties.id),old=[b.origin,b.rotation,b.id,b.anim];b.origin=[a.centre[0],a.method==='lakeStoneFish'?.53:.10,a.centre[1]];b.rotation=a.rotation;b.id=f.properties.pickId;b.anim=0;
 try{if(a.method==='lakeTempleGate')b[a.method](a.legacyModel,5.8,3.5);else b[a.method](a.legacyModel||{},a.size[0],a.size[1]);}finally{[b.origin,b.rotation,b.id,b.anim]=old}
}
Y.Heritage31={render};
})(YY);
