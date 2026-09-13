/* Stone boat: a single open stone deck, with an unobstructed west bank approach. */
(function(Y){'use strict';
const ID='way/272349094',G=Y.Geo,O=[-11.0855,-166.313],R=Math.atan2(.068,23.583),C=Math.cos(R),S=Math.sin(R),W=4.321,L=23.583,DECK=1.25,GAP=L/2-1.5;
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const curve=v=>Math.pow(Math.max(0,(Math.abs(v)/(L/2)-.67)/.33),1.3),width=v=>W/2*(1-.08*curve(v)),deck=v=>DECK+.24*curve(v),rim=v=>1.42+.62*curve(v);
function render(b,f,add){if(f.properties.id!==ID)return false;const id=f.properties.pickId,vert=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];},mesh={hull:new G.Geometry(),deck:new G.Geometry(),rim:new G.Geometry(),cap:new G.Geometry(),approach:new G.Geometry(),joints:new G.Geometry()};
 const stations=[-L/2,L/2,-GAP,GAP];for(let v=-L/2+.42;v<L/2;v+=.42)stations.push(v);stations.sort((a,b)=>a-b);
 for(let i=1;i<stations.length;i++){const a=stations[i-1],c=stations[i],wa=width(a),wc=width(c),da=deck(a),dc=deck(c);
  mesh.deck.quad(vert(-wa,da,a),vert(-wc,dc,c),vert(wc,dc,c),vert(wa,da,a));
  for(const side of[-1,1]){mesh.hull.quad(vert(side*(wa-.22),.22,a),vert(side*(wc-.22),.22,c),vert(side*wc,dc,c),vert(side*wa,da,a));
   if(side<0&&a>=-GAP-1e-8&&c<=GAP+1e-8)continue;
   const ua=side*wa,uc=side*wc,ia=side*(wa-.23),ic=side*(wc-.23),ha=rim(a),hc=rim(c);
   mesh.rim.quad(vert(ua,da-.02,a),vert(uc,dc-.02,c),vert(uc,hc+.04,c),vert(ua,ha+.04,a));
   mesh.rim.quad(vert(ia,ha+.04,a),vert(ic,hc+.04,c),vert(ic,dc,c),vert(ia,da,a));
   mesh.cap.quad(vert(ua,ha+.04,a),vert(uc,hc+.04,c),vert(ic,hc+.04,c),vert(ia,ha+.04,a));
  }
 }
 for(const v of[-L/2,L/2]){const w=width(v),d=deck(v),h=rim(v),inside=v-Math.sign(v)*.24;
  mesh.hull.quad(vert(-w+.22,.22,v),vert(w-.22,.22,v),vert(w,d,v),vert(-w,d,v));
  mesh.rim.quad(vert(-w,d,v),vert(w,d,v),vert(w,h+.04,v),vert(-w,h+.04,v));
  mesh.rim.quad(vert(-width(inside),deck(inside),inside),vert(-width(inside),rim(inside)+.04,inside),vert(width(inside),rim(inside)+.04,inside),vert(width(inside),deck(inside),inside));
  mesh.cap.quad(vert(-w,h+.04,v),vert(w,h+.04,v),vert(width(inside),rim(inside)+.04,inside),vert(-width(inside),rim(inside)+.04,inside));
 }
 // Join the mapped west rim path to the deck; both ends use this same surface.
 const start=-8.5,end=-W/2+.06,half=1.7,bank=world(start,0),bankY=(Y.Landscape42?.walkElevation(...bank)||.8)+.12;
 mesh.approach.quad(vert(start,bankY,-half),vert(start,bankY,half),vert(end,DECK,half),vert(end,DECK,-half));
 for(const v of[-half,half])mesh.approach.quad(vert(start,bankY-.18,v),vert(end,DECK-.18,v),vert(end,DECK,v),vert(start,bankY,v));
 // The historical photos show a bank-contact boat, not a free-standing pier.
 // Add only the small discrepancy between the mapped shoreline and boat back.
 const bankMesh=new G.Geometry(),shore=Y.CAMPUS.features.find(q=>q.properties.id==='precinct/531').geometry.coordinates[0];
 const shoreX=z=>{const hits=[];for(let i=1;i<shore.length;i++){const a=shore[i-1],c=shore[i];if((a[1]<=z&&c[1]>z)||(c[1]<=z&&a[1]>z))hits.push(a[0]+(c[0]-a[0])*(z-a[1])/(c[1]-a[1]));}return Math.max(...hits);};
 const contact=v=>{const outer=world(-width(v)+.018,v),x=shoreX(outer[1]);return[[x-.06,.84,outer[1]],[outer[0],.96,outer[1]]];};
 for(let i=1;i<stations.length;i++){const [a,b0]=contact(stations[i-1]),[c,d]=contact(stations[i]);bankMesh.quad(a,c,d,b0);}
 add('047-bank-contact',bankMesh,'#a4aa93',10,id);
 // Sparse masonry joints sit above the stone, not in the walking opening.
 for(let v=-L/2+1;v<L/2;v+=1.15){const w=width(v),h=rim(v);mesh.joints.quad(vert(w+.004,.55,v-.009),vert(w+.004,h-.05,v-.009),vert(w+.004,h-.05,v+.009),vert(w+.004,.55,v+.009));}
 for(const[k,g]of Object.entries(mesh))add('047-'+k,g,k==='joints'?'#858c84':k==='cap'?'#c8c9bb':k==='hull'?'#adb2a5':'#babfb1',10,id);
 return{strategy:'building047-v46',kind:'pier',roof:false,westBankOpening:true,deck:DECK,bankY,dimensionsMeasured:false};
}
Y.Building047={id:ID,render,world,local,width,deck,rim,dimensions:{width:W,length:L,gap:GAP*2}};
})(YY);
