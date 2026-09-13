/* Changchunyuan 61/61A: own offset ring, red five-storey body, set-back white sixth floor.
 * East stairs, north entry and sixth-floor terrace doors are registered to the official 61A plan.
 * Four cross roofs follow the native roof; only eastern gables are clearly resolved in 4K.
 * Heights, western hidden openings and exact roof intersections remain a declared fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/849765891';
const O=[-681.318,-26.015],U=[.9937702097,-.1114485099],V=[.1114485099,.9937702097],H=15.35,FH=3.03;
const pieces=[{a:0,b:48.8,d:17.93,setback:6.3,cross:[8.4,39.0]},{a:48.8,b:71.45,d:13.30,setback:5.7,cross:[57.61,70.19]}];
const P=(u,v,y)=>[O[0]+U[0]*u+V[0]*v,y,O[1]+U[1]*u+V[1]*v];
function rect(a,b,c,d){return{type:'Polygon',coordinates:[[P(a,c,0),P(b,c,0),P(b,d,0),P(a,d,0),P(a,c,0)].map(p=>[p[0],p[2]])]};}
function render(b,f,add){
 const id=f.properties.pickId,old=[b.origin,b.rotation,b.id,b.anim];b.id=id;b.anim=0;
 const upQuad=(g,...ps)=>{if((ps[1][2]-ps[0][2])*(ps[2][0]-ps[0][0])-(ps[1][0]-ps[0][0])*(ps[2][2]-ps[0][2])<0)ps.reverse();g.quad(...ps);};
 const mesh=(key,g,col,mat=24)=>{b.id=id;b.mesh('144-'+key,g,0,0,0,1,1,1,col,mat);};
 const box=(key,u,v,y,w,d,h,col,mat=24)=>{const p=P(u,v,y);b.local(p[0],0,p[2],-Math.atan2(U[1],U[0]),()=>b.mesh('144-'+key,b.geo('144-unit-box',G.box),0,y,0,w,h,d,col,mat));};
 const pane=(key,a,c,y,h,col='#638682')=>box(key,(a+c)/2,-.045,y+h/2,c-a,.06,h,col,28);
 const northBay=(a,c,floor)=>{const y=.62+floor*FH;pane('north-window-band',a,c,y,1.63);box('north-sill',(a+c)/2,-.07,y-.07,c-a+.10,.15,.14,'#e4e1d7');for(let j=1;j<4;j++)box('north-window-frame',a+(c-a)*j/4,-.095,y+.82,.045,.08,1.68,'#dfdfd5',29);};
 try{
  mesh('red-body',F.walls(f.geometry,.34,H),'#bd6650',18);mesh('gray-base',F.walls(f.geometry,.02,.34),'#aaa79d',10);mesh('terrace-slab',F.surface(f.geometry,H+.02),'#747d72',22);
  const allCross=pieces.flatMap(p=>p.cross);
  // Main north continuous glazed strips, interrupted by light stair towers.
  for(let floor=0;floor<5;floor++)for(let a=.65;a<48.3;a+=2.32){const c=Math.min(a+2.22,48.3);if(allCross.some(x=>Math.abs((a+c)/2-x)<1.8))continue;northBay(a,c,floor);}
  // Official 61A plan: nine equal bays, north stair bays 4 and 9 (west-to-east).
  const east=pieces[1],bay=(east.b-east.a)/9;
  for(let floor=0;floor<5;floor++)for(let j=0;j<9;j++){if(j===3||j===8||(floor===0&&(j===4||j===5)))continue;northBay(east.a+j*bay+.10,east.a+(j+1)*bay-.10,floor);}
  box('61a-north-entry',61.48,-.12,1.39,3.22,.08,2.10,'#384f49',28);
  box('61a-entry-divider',61.48,-.17,1.39,.07,.06,2.10,'#d4d6ce');
  for(let i=0;i<5;i++)box('61a-north-steps',61.38,-1.65+i*.33,.035+i*.032,5.20,.33,.07+i*.064,'#b8b9ad',10);
  // East corridor door below, narrow corridor windows above, as shown by the north-arrow plan.
  box('61a-east-exit',71.475,6.54,1.43,.07,1.70,2.16,'#40564f',28);
  for(let floor=1;floor<5;floor++)box('61a-east-corridor-window',71.475,6.54,1.55+floor*FH,.07,1.38,1.55,'#607d77',28);
  for(const p of pieces){
   const attic=rect(p.a+.15,p.b-.15,p.setback,p.d-.14);mesh('white-attic-'+p.a,F.walls(attic,H,18.05),'#deded4');
   const roof=new G.Geometry(),tiles=new G.Geometry();
   const ridge=(p.setback+p.d)/2,roofY=v=>18.05+2.05*(1-Math.abs(v-ridge)/(ridge-p.setback));
   for(let i=0;i<64;i++)for(const [a,c]of [[p.setback,ridge],[ridge,p.d]]){const u=p.a+(p.b-p.a)*i/64,w=p.a+(p.b-p.a)*(i+1)/64;roof.quad(P(u,a,roofY(a)),P(u,c,roofY(c)),P(w,c,roofY(c)),P(w,a,roofY(a)));}
   mesh('main-red-roof-'+p.a,roof,'#b9674e',19);
   // Close the attic envelope under each fitted gable; no invented end-wall openings.
   const ends=new G.Geometry();
   ends.tri(P(p.a+.15,p.setback,18.05),P(p.a+.15,p.d,18.05),P(p.a+.15,ridge,20.1));
   ends.tri(P(p.b-.15,p.d,18.05),P(p.b-.15,p.setback,18.05),P(p.b-.15,ridge,20.1));
   mesh('main-white-gable-ends-'+p.a,ends,'#deded4');
   const lip=new G.Geometry();lip.quad(P(p.a,0,H+.12),P(p.a,1.75,H+.74),P(p.b,1.75,H+.74),P(p.b,0,H+.12));mesh('north-terrace-roof-lip-'+p.a,lip,'#b56850',19);
   for(let u=p.a+.7;u<p.b-.4;u+=2.35){if(p.a===0)box('sixth-north-window',u,p.setback-.045,H+1.42,1.45,.08,1.38,'#65847d',28);if(p.a===0)box('sixth-south-window',u,p.d+.035,H+1.35,1.55,.07,1.50,'#65847d',28);}
   if(p.a>40){for(const c of[52.60,65.20]){box('61a-sixth-terrace-door',c,p.setback-.045,H+1.02,1.55,.08,2.04,'#354e46',28);for(const dx of[-2.03,2.03])box('61a-sixth-terrace-window',c+dx,p.setback-.045,H+1.18,1.40,.08,.82,'#638178',28);}}
   for(const [j,c]of p.cross.entries()){
    const w=p.a>40?1.24:1.55,g=rect(c-w,c+w,.12,p.setback+.14);mesh('cross-white-walls-'+p.a+'-'+j,F.walls(g,H,17.74),'#dadbd3');
    const gable=new G.Geometry();gable.tri(P(c+w,.10,17.73),P(c-w,.10,17.73),P(c,.10,19.08));mesh('north-cross-gable-'+p.a+'-'+j,gable,'#e0e1d8');
    // Continue each cross slope into the main ridge so its rear edge is enclosed.
    const q=new G.Geometry();upQuad(q,P(c-w,.10,17.76),P(c,.10,19.10),P(c,ridge,20.10),P(c-w,ridge,18.47));upQuad(q,P(c,.10,19.10),P(c+w,.10,17.76),P(c+w,ridge,18.47),P(c,ridge,20.10));mesh('north-cross-roof-'+p.a+'-'+j,q,'#bb6c55',19);
    box('north-light-stair-strip',c,-.025,H/2,2.6,.075,H-.06,'#d4d5cc');
    for(let floor=0;floor<5;floor++)for(const dx of[-.37,.37])box('north-stair-light',c+dx,-.09,1.45+floor*FH,.60,.07,1.20,'#5b7770',28);
    for(const dx of[-.31,.31])box('north-cross-end-light',c+dx,.035,17.89,.50,.075,.64,'#536a66',28);
   }
   // Two terrace-door gables agree with the official sixth-floor plan and native 4K.
   if(p.a>40)for(const c of[52.60,65.20]){const q=new G.Geometry();q.tri(P(c+1.0,p.setback-.03,18.02),P(c-1.0,p.setback-.03,18.02),P(c,p.setback-.03,19.33));mesh('east-small-white-gable-'+c,q,'#dfdfd4');const r=new G.Geometry();upQuad(r,P(c-1.06,p.setback-.20,18.08),P(c,p.setback-.20,19.38),P(c,ridge,19.42),P(c-1.06,ridge,18.35));upQuad(r,P(c,p.setback-.20,19.38),P(c+1.06,p.setback-.20,18.08),P(c+1.06,ridge,18.35),P(c,ridge,19.42));mesh('east-small-red-gable-'+c,r,'#b96952',19);}
  }
  // Partial 2025 south photo supports red bands and white frames; exact complete openings remain fitted.
  for(const p of pieces)for(let floor=0;floor<(p.a>40?6:5);floor++)for(let u=p.a+(p.a>40?bay/2:1.2);u<p.b-1;u+=(p.a>40?bay:2.32)){box('south-window-fit',u,p.d+.04,1.55+floor*FH,2.15,.075,1.63,'#5e7b75',28);box('south-white-sill-fit',u,p.d+.08,.67+floor*FH,2.26,.12,.14,'#e1e0d7');}
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return{id:ID,model:'144-red-terrace-and-cross-roofs',sourceOutline:true,displayFloors:6,official61Floors:6,heightMeasured:false,eastAddress61AExtentVerified:false,official61AFloors:6,officialEastNorthPlanRegistered:true,allFacadesVerified:false,westernRoofDetailsVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building144={id:ID,render,P,pieces};
})(YY);
