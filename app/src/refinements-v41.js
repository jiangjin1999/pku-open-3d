/* Photo-led V41 refinements. Dimensions and hidden faces remain estimates. */
(function(Y){'use strict';const G=Y.Geo,F=Y.Footprints;
function teacher(b,f,add){const p=f.properties;if(!['way/1075644760','way/1075644761'].includes(p.id))return false;
 const h=p.id==='way/1075644760'?6.8:3.8;b.id=p.pickId;
 add('teacher41-walls-'+p.pickId,F.walls(f.geometry,.15,h),'#d2cec1',24,p.pickId);
 add('teacher41-roof-'+p.pickId,F.surface(f.geometry,h+.18),'#828c88',22,p.pickId);
 for(const ring of F.polygons(f.geometry).flat())for(let i=1;i<ring.length;i++){
  const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,n=F.area(ring)>0?1:-1,nx=uz*n,nz=-ux*n;
  b.beam([a[0],h+.22,a[1]],[c[0],h+.22,c[1]],.19,'#939d98',29);
  if(len<7)continue;
  for(let t=3;t<len-2;t+=5.5){const x=a[0]+ux*t+nx*.08,z=a[1]+uz*t+nz*.08;
   b.local(x,0,z,Math.atan2(nx,nz),()=>{const wh=h-1.6;b.box(0,.8+wh/2,0,2.5,wh,.10,'#344a4b',28);for(const dx of[-1.29,1.29])b.box(dx,.8+wh/2,.05,.10,wh+.15,.14,'#4f5e5b',29);b.box(0,2.05,.075,2.6,.16,.12,'#596560',29);});
  }
 }
 if(p.id==='way/1075644760'){
  // West-facing high window and vertical name follow the opening-day image.
  b.local(199.55,0,-102.0,-Math.PI/2+.02,()=>{b.box(0,3.4,.17,3.0,6.6,.25,'#d4cebd',24);for(const [i,ch] of [...'北京大学教师之家'].entries())b.lettering(ch,0,6.2-i*.56,.33,.5,.5,0,'#a37c56');b.box(0,.18,.35,6,.32,.65,'#c3bfaf',10);});
 }
 return {strategy:'teacher41',height:h,limits:'官方照片与用户定位；层高、后立面、窗位为近似'};
}
function football(b,f){const fr=Y.ArchitectureAdapter.frame(f.geometry),w=68,d=105,rot=fr.r+(fr.w>fr.d?Math.PI/2:0);b.id=f.properties.pickId;
 b.local(fr.centre[0],0,fr.centre[1],rot,()=>{
  for(let i=0;i<14;i++)b.box(0,.225,-d/2+(i+.5)*d/14,w,.025,d/14,i%2?'#7d9b76':'#879f7c',0);
  const g=new G.Geometry(),line=p=>{g.v.push(...G.ribbon(p,.12,.253,false).v);},arc=(x,z,r,start=0,end=Math.PI*2)=>line(Array.from({length:65},(_,i)=>[x+r*Math.cos(start+(end-start)*i/64),z+r*Math.sin(start+(end-start)*i/64)]));
  line([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[-w/2,-d/2]]);line([[-w/2,0],[w/2,0]]);arc(0,0,9.15);arc(0,0,.16);
  for(const s of[-1,1]){const end=s*d/2;for(const [ww,depth] of [[40.32,16.5],[18.32,5.5]])line([[-ww/2,end],[-ww/2,end-s*depth],[ww/2,end-s*depth],[ww/2,end]]);arc(0,end-s*11,.16);
   arc(0,end-s*11,9.15,s===1?Math.PI+Math.asin(5.5/9.15):Math.asin(5.5/9.15),s===1?2*Math.PI-Math.asin(5.5/9.15):Math.PI-Math.asin(5.5/9.15));
   for(const x of[-3.66,3.66]){b.beam([x,.25,end],[x,2.69,end],.065,'#e8e8db',29);b.beam([x,2.69,end],[x,.25,end+s*2],.045,'#bcc6bd',29);}
   b.beam([-3.66,2.69,end],[3.66,2.69,end],.065,'#e8e8db',29);
   for(let x=-3.6;x<=3.6;x+=.4)b.beam([x,.26,end+s*2],[x,2.65,end],.012,'#c7d0be',29);
   for(let y=.4;y<2.69;y+=.35)b.beam([-3.66,y,end+s*2*(1-(y-.25)/2.44)],[3.66,y,end+s*2*(1-(y-.25)/2.44)],.012,'#c7d0be',29);
  }
  b.mesh('football41-lines',g,0,0,0,1,1,1,'#e9e9d9',10);
  for(const x of[-1,1])for(const z of[-1,1]){b.cyl(x*42,.2,z*57,.15,16,'#8a9790',10,1,29);b.box(x*42,16,z*57,3,.35,.3,'#8a9790',29);for(const dx of[-.9,0,.9])b.box(x*42+dx,16.3,z*57,.62,.62,.18,'#d9e0d5',29);}
 });return true;
}
function climbing(b,f){b.id=f.properties.pickId;const fr=Y.ArchitectureAdapter.frame(f.geometry);
 if(f.properties.id==='way/320679832')b.local(106.4,0,-288.5,-.24,()=>{
  const h=15,w=7.6,d=5.5;for(const x of[-w/2,w/2])for(const z of[-d/2,d/2])b.box(x,h/2,z,.18,h,.18,'#687e78',29);
  b.box(0,h+.25,0,w+1.6,.28,d+1.6,'#6f7b77',29);
  for(const side of[0,1,2,3])b.local(0,0,0,side*Math.PI/2,()=>{
   const ww=side%2?d:w,zz=side%2?w/2:d/2;
   for(let row=0;row<6;row++)for(let col=0;col<3;col++){
    const x=(col-1)*ww/3,y=.3+row*2.4,out=(row===2||row===3)&&col===1?.65:0;
    b.box(x,y+1.2,zz+out,ww/3-.04,2.36,.15,col===1&&row>=2?'#869fa2':side%2?'#bdbaa7':'#bfa186',24);
    for(let j=0;j<5;j++){const dx=(j%2?-.55:.45)+Math.sin(row*9+col*3+j)*.25,yy=y+.3+j*.42;b.sphere(x+dx,yy,zz+out+.14,.11,.09,.09,['#a58c58','#648374','#92776b','#697e9a'][j%4],29);}
   }
   for(const x of[-ww*.3,0,ww*.3])b.beam([x,.35,zz+.2],[x,h-.3,zz+.2],.016,'#d0ccb8',29);
  });
  for(const x of[-w/2,w/2])for(let y=0;y<13;y+=3)b.beam([x,y,-d/2],[x,y+3,d/2],.05,'#657b73',29);
  b.box(0,.22,7,13,.08,6,'#a4b49b',7);
  b.local(0,0,13,0,()=>{b.box(0,1.8,0,10,3.6,.7,'#acb3a5',24);b.box(0,3.75,.25,11,.24,2,'#7b8783',29);for(let x=-4.5;x<4.5;x+=.7)for(let y=.5;y<3.4;y+=.6)b.sphere(x,y,.46,.12,.10,.12,(Math.round(x*10+y*10)%2)?'#628f99':'#b5a16f',29);});
 });
 else b.local(146,0,-295,-.24,()=>{for(const x of[-6,6])b.cyl(x,.2,0,.14,10.5,'#67989f',12,1,29);b.beam([-6,10.6,0],[6,10.6,0],.14,'#67989f',29);for(const x of[-4,4])b.beam([x,.5,.05],[x,10.5,.05],.022,'#aaa99a',29);for(const y of[1.2,3.2,5.5,8])b.beam([-4,y,0],[4,y,0],.14,'#9d8b6c',6);b.box(0,.22,0,17,.08,9,'#abb4a0',7);});
 return true;
}
function sport(b,f){if(f.properties.id==='way/226702532')return football(b,f);if(['way/320679832','manual/outdoor-zone'].includes(f.properties.id))return climbing(b,f);return false;}
function bell(b,f){if(f.properties.id!=='manual/teacher-bell41')return false;b.id=f.properties.pickId;
 b.local(f.properties.centre[0],0,f.properties.centre[1],0,()=>{
  b.box(0,.13,0,3.5,.26,2.6,'#b7b5a6',10);for(const x of[-1.25,1.25]){b.box(x,1.8,0,.20,3.35,.23,'#606858',29);b.beam([x,.25,-.8],[x,2,0],.08,'#606858',29);b.beam([x,.25,.8],[x,2,0],.08,'#606858',29);}b.box(0,3.46,0,2.9,.22,.25,'#606858',29);b.beam([0,2.70,0],[0,3.4,0],.09,'#736a4f',29);
  const g=new G.Geometry(),profile=[[.84,.98],[.81,1.16],[.69,1.30],[.60,1.78],[.48,2.45],[.30,2.68],[.10,2.75]];
  for(let j=1;j<profile.length;j++)for(let i=0;i<48;i++){const a=i*Math.PI/24,c=(i+1)*Math.PI/24,[r,y]=profile[j-1],[rr,yy]=profile[j];g.quad([r*Math.cos(a),y,r*Math.sin(a)],[r*Math.cos(c),y,r*Math.sin(c)],[rr*Math.cos(c),yy,rr*Math.sin(c)],[rr*Math.cos(a),yy,rr*Math.sin(a)]);}b.mesh('bell41-bronze',g,0,0,0,1,1,1,'#7b7455',29);b.cyl(0,1.01,0,.78,.07,'#343a30',48,1,29);b.beam([0,1,0],[0,1.5,0],.07,'#4c4e3a',29);
 });return true;}
Y.Refinements41={teacher,sport,bell};
})(YY);
