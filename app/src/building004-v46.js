/* Liu Shui Building: real stone facade, flat roofs and open eastern high court. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/11975584';
const C={stone:'#aaa9a2',pale:'#d7d9cd',glass:'#42616f',joint:'#8c8e88',grid:'#cbd0c7',roof:'#818582',rail:'#95afb0'};
const H={main:20.5,bridgeBase:15.0,bridgeTop:15.75,frameBase:19.4,frameTop:20.5};
const local=p=>p,world=(x,z)=>[x,z];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const t of F.capTriangles(pg)){let p=t;for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
function render(b,f,add){const id=f.properties.pickId;b.id=id;
 function block(name,box,base,top,color=C.stone){const mesh=new G.Geometry(),cap=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];mesh.quad([a[0],base,a[1]],[c[0],base,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]);}for(let i=1;i<p.length-1;i++){const tri=[p[0],p[i],p[i+1]].map(p=>[p[0],top,p[1]]);cap.tri(...tri);if(base>0)mesh.tri(...tri.map(p=>[p[0],base,p[2]]).reverse());}}add('004-'+name,mesh,color,24,id);add('004-'+name+'-roof',cap,C.roof,22,id);}
 // All partitions are clipped to original OSM triangles, including the courtyard hole.
 block('north-wing',[370,-190,420,-153.416],0,H.main);
 block('south-wing',[370,-133.619,420,-90],0,H.main);
 block('west-court-wing',[370,-153.416,404.9,-133.619],0,H.main,C.pale);
 // The map's eastern strip is an elevated connection, not a five-storey solid wall.
 block('upper-open-bridge',[404.9,-153.416,420,-133.619],H.bridgeBase,H.bridgeTop,C.pale);
 block('high-roof-frame',[404.9,-153.416,420,-133.619],H.frameBase,H.frameTop,C.pale);
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(len));}
 function window(x,y,w,h,detailed){b.box(x,y,.075,w+.16,h+.16,.12,C.pale,29);b.box(x,y,.15,w,h,.055,C.glass,28);b.box(x,y,.193,.055,h,.045,C.joint,29);
  if(detailed){const gy=y-h/2-.46;b.box(x,gy,.08,w,.77,.12,C.grid,24);for(let i=1;i<7;i++)b.box(x-w/2+w*i/7,gy,.165,.035,.76,.035,C.pale,29);for(const dy of [-.24,0,.24])b.box(x,gy+dy,.166,w,.03,.035,C.pale,29);}
 }
 const pg=F.polygons(f.geometry)[0];
 for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive===(ri===0))[a,c]=[c,a];const mid=[(a[0]+c[0])/2,(a[1]+c[1])/2],east=ri===0&&mid[0]>411,open=east&&mid[1]>-153.5&&mid[1]<-133.5;if(open||(ri>0&&mid[0]>400))continue;
  boundary(a,c,len=>{if(len<3)return;const detailed=east&&len>20,slender=ri>0||(ri===0&&mid[1]<-180&&len>20),n=Math.max(1,Math.round(len/(detailed?4.8:slender?3.1:4.2))),step=(len-1.7)/n,w=Math.min(detailed?2.65:slender?1.02:2.25,step-.65);
   // Rows of large stone slabs are visible independently of the window openings.
   for(let j=1;j<15;j++)b.box(len/2,j*1.35,.018,len-.06,.022,.028,C.joint,24);
   for(let k=1;k<len/1.8;k++)b.box(k*1.8,10.2,.018,.02,20.3,.028,C.joint,24);
   for(let j=0;j<5;j++)for(let k=0;k<n;k++){const x=.85+(k+.5)*step;if(detailed&&((mid[1]>-133.619&&(k===0||x>len-5.6))||(mid[1]<-153.416&&x<4.8)))continue;window(x,2.4+j*4.05,w,detailed?2.15:slender?2.9:2.45,detailed);}
   if(detailed&&b.lettering){
    if(mid[1]>-133.619){b.lettering('刘水楼',len-2.7,17.65,.24,4.0,.8,0,'#eeeeea');b.lettering('LIU SHUI BUILDING',len-2.7,16.76,.24,4.1,.35,0,'#eeeeea');}
    else {for(const [i,ch]of [...'环境科学与工程学院'].entries())b.lettering(ch,2.2,16.8-i*.63,.24,.45,.49,0,'#eeeeea');}
   }
   if(detailed&&mid[1]>-133.619){const x=.85+step*.5;window(x,10.15,Math.min(3.4,step-.5),17.1,false);for(let j=1;j<5;j++)for(let q=0;q<4;q++)b.box(x,j*4.05+q*.14,.21,Math.min(3.4,step-.5),.06,.05,C.joint,29);}
  });
 }}
 // Eastern court-facing returns reveal tall glazed end strips, visible in the real photograph.
 for(const [z,flip] of [[-153.416,false],[-133.619,true]]){
  const a=flip?[414.15,z]:[404.9,z],c=flip?[406.55,z]:[412.5,z];boundary(a,c,len=>{b.box(len/2,10.1,.025,len-.15,20.0,.08,C.pale,24);window(len/2,10.2,Math.min(2.0,len-.8),17.4,false);for(let j=1;j<5;j++)b.box(len/2,j*4.05,.205,Math.min(2,len-.8),.1,.045,C.joint,29);});
 }
 // Recessed west wall and courtyard side faces inherit windows from the original inner ring.
 // Glass guardrail follows the slanted eastern edge; there is no opaque infill below it.
 const outer=pg[0],ea=outer[15],ec=outer[16];
 boundary(ea,ec,len=>{b.box(len/2,16.3,.06,len,.99,.075,C.rail,28);b.box(len/2,16.84,.09,len,.065,.065,C.pale,29);for(let i=0;i<=10;i++)b.box(i*len/10,16.3,.09,.055,1.05,.075,C.pale,29);});
 // The campus aerial shows a full glazed bridge enclosure set behind the outer high frame.
 boundary(ea,ec,len=>{b.box(len/2,17.575,-1.35,len-.15,3.65,.09,C.glass,28);for(let i=0;i<=13;i++)b.box(i*len/13,17.575,-1.27,.07,3.65,.06,C.pale,29);b.box(len/2,17.575,-1.26,len,.075,.07,C.pale,29);});
 // Narrow ventilation stacks are visible in the aerial; placements are fitted inside each solid roof.
 for(const [x,z] of [[402,-182],[405,-182],[408,-181],[401,-177],[404,-177],[407,-177],[401,-160],[398,-160],[405,-125],[402,-125],[399,-124],[410,-104],[406,-104],[402,-103]])if([[-.36,-.36],[.36,-.36],[.36,.36],[-.36,.36]].every(([dx,dz])=>F.inside([x+dx,z+dz],f.geometry))){b.cyl(x,20.5,z,.20,1.6,C.pale,24,1,12);b.cyl(x,22.05,z,.35,.15,C.pale,24,1,12);}
 // Small flat-roof stacks are as-built vocabulary; exact rooftop equipment is fitted.
 for(const [x,z,w,d,h] of [[399,-102,1.0,1.5,2.0],[404,-102,1.0,1.5,2.0],[411,-117,1.0,1.5,1.7],[411,-111,1.0,1.5,1.7],[390,-180,3.2,2.2,.8],[389,-140,3,3,1.0]])if([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[0,0]].every(([dx,dz])=>F.inside([x+dx,z+dz],f.geometry)))b.box(x,H.main+h/2,z,w,h,d,C.pale,24);
 return {strategy:'building004-v46',floors:5,sourceOutline:true,openEastCourt:true,heightFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building004={id:ID,render,pieces,local,world,heights:H};
})(YY);
