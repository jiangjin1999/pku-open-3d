/* V30 component import: old campus terrain and cross-building links are intentionally excluded. */
/* v24 lake additions. Original geometry based on a small number of references;
 * dimensions, surface weathering and unseen sides are deliberately approximate. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo;
const oldBoat=P.lakeStoneBoat;
P.lakeStoneBoat=function(p,w,d){oldBoat.call(this,p,w,d);const a=Y.Lake24.dock(p);if(!a)return;
 const g=new G.Geometry(),top=q=>{let t=(q[1]-a.a[1])/(a.b[1]-a.a[1]);return[q[0],a.startY+(a.endY-a.startY)*t-.014,q[1]]};
 // Stone apron, not a stripe floating in water. Horizontal route is rendered on it.
 let q=a.polygon.map(top);g.quad(q[0],q[3],q[2],q[1]);for(let i=0;i<4;i++){let u=q[i],v=q[(i+1)%4];g.quad([u[0],.34,u[2]],[v[0],.34,v[2]],v,u)}
 this.mesh('v24-boat-side-apron',g,0,0,0,1,1,1,'#abae9f',10,.20);
 for(const s of[-1,1]){let x=s*(p.dock24.width/2-.06);this.beam([x,a.startY-.005,a.a[1]],[x,a.endY-.005,a.b[1]],.047,'#c4c5b5',10,.24)}
 const polygon=a.polygon.map(q=>Y.Lake24.world(p,q));this.mapBuildings.push({id:p.id,polygon,walkable:true,role:'boat-landing',x:this.origin[0],z:this.origin[2],w:p.dock24.width,d:a.b[1]-a.a[1],r:this.rotation});
};
// Small bearing aprons close the inherited gap between the short bridge and
// its banks. Dimensions are model support geometry, not surveyed masonry.
const oldBridge=P.lakeFlatBridge;
P.lakeFlatBridge=function(p,w,d){oldBridge.call(this,p,w,d);for(const sign of[-1,1]){
 const z=sign*(d/2+.5),len=1.10;this.box(0,.57,z,w+.18,.55,len,'#a6ad9e',10,.16);
 const pts=[[-(w+.18)/2,z-len/2],[(w+.18)/2,z-len/2],[(w+.18)/2,z+len/2],[-(w+.18)/2,z+len/2]].map(q=>{let v=this.world([q[0],0,q[1]]);return[v[0],v[2]]});
 this.mapBuildings.push({id:p.id,polygon:pts,walkable:true,role:'bridge-abutment',x:this.origin[0],z:this.origin[2],w:w+.18,d:len,r:this.rotation});
 }};
P.lakeTempleGate=function(p,w=5.8,d=3.5){
 const stone='#a8a99c',red='#954a3c',rim='#c7c5b5',roof='#737866',H=5.2,R=1.17,spring=2.3,base=.18,side=w/2-R;
 this.noPlant(0,0,w+5,d+5);
 // Low flush platform; two load-bearing piers. Do not register the void as solid.
 this.box(0,.09,0,w+1.0,.18,d+.9,stone,10,.05);
 for(const s of[-1,1]){
  let x=s*(R+side/2);this.box(x,(H+base)/2,0,side,H-base,d,red,24,.50);this.solid(x,0,side,d);
  this.box(x,.66,0,side+.03,.96,d+.035,stone,10,.30);
  for(const z of[-1,1]){this.box(s*(w/2-.115),2.9,z*(d/2+.02),.18,2.65,.10,rim,10,.66);this.box(x,1.15,z*(d/2+.035),side+.02,.12,.12,rim,10,.65);}
 }
 // Spandrel and intrados are triangles around an open arch, no black plane.
 const arch=new G.Geometry(),band=new G.Geometry(),N=40;
 for(let i=0;i<N;i++){
  let a=i*Math.PI/N,b=(i+1)*Math.PI/N,x=R*Math.cos(a),y=spring+R*Math.sin(a),X=R*Math.cos(b),Yy=spring+R*Math.sin(b);
  for(const s of[-1,1]){let z=s*d/2; if(s===1)arch.quad([x,y,z],[x,H,z],[X,H,z],[X,Yy,z]);else arch.quad([X,Yy,z],[X,H,z],[x,H,z],[x,y,z]);
   let ro=R+.28,oa=[ro*Math.cos(a),spring+ro*Math.sin(a),z+s*.034],ob=[ro*Math.cos(b),spring+ro*Math.sin(b),z+s*.034],ia=[x,y,z+s*.034],ib=[X,Yy,z+s*.034];if(s===1)band.quad(ia,oa,ob,ib);else band.quad(ib,ob,oa,ia);
  }
  arch.quad([x,y,-d/2],[x,y,d/2],[X,Yy,d/2],[X,Yy,-d/2]);
 }
 this.mesh('v24-temple-arched-spandrel',arch,0,0,0,1,1,1,red,24,.6);
 this.mesh('v24-temple-stone-arch-ring',band,0,0,0,1,1,1,rim,10,.7);
 for(const s of[-1,1])for(const z of[-1,1])this.box(s*(R+.13),spring/2,z*(d/2+.04),.26,spring,.11,rim,10,.7);
 // Pale frieze, projecting cornices and compact gray tiled roof.
 this.box(0,4.54,0,w+.08,.23,d+.10,rim,10,.92);this.box(0,4.98,0,w+.16,.19,d+.16,rim,10,.94);
 for(const s of[-1,1]){this.box(0,4.76,s*(d/2+.027),w-.42,.22,.035,'#a6a797',10,.94);for(let i=-2;i<=2;i++)this.box(i*w/6,4.76,s*(d/2+.06),.38,.16,.025,'#909688',10,.95);}
 for(let k=0;k<3;k++)this.box(0,5.17+k*.13,0,w+.22+k*.15,.14,d+.24+k*.15,k%2?rim:stone,10,1.15+k*.05);
 this.v9Roof(0,5.58,0,w+1.1,d+1.15,1.43,'hipgable',2.0);
 // Incised stone courses are restrained, not a generated inscription.
 for(const s of[-1,1])for(let j=0;j<2;j++){this.box(s*(R+side/2),.37+j*.39,d/2+.028,side,.025,.022,'#858e82',10,.35);}
};
})(YY);
