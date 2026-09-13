/* May Fourth Sports Center: independent east stands and west entrance; storey total unknown. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832253';
const O=[182.329,572.683],R=Math.atan2(.989,19.677),CO=Math.cos(R),SI=Math.sin(R);
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}

function render(b,f,add){const id=f.properties.pickId;b.id=id;
const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'043-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
const roofZones=[{name:'long-main',box:[-.2,0,15.2,98.283],h:10.7},{name:'south-low',box:[-.2,98.283,19.75,131.81],h:6.3},{name:'west-entry-high',box:[-3.45,85.786,5.2,98.283],h:13.6}];
for(const q of roofZones){const g=new G.Geometry();for(const p of pieces(f,q.box))for(let k=1;k<p.length-1;k++)g.tri(...[p[0],p[k],p[k+1]].map(p=>vertex(p[0],q.h,p[1])));add('043-flat-roof-'+q.name,g,'#aaa99a',24,id);}
// Rectangular apertures are cut from wall panels, with glass set behind each opening.
function face(name,u,v,angle,len,h,opens){const p=world(u,v);b.local(p[0],0,p[1],R+angle,()=>group(name,()=>{
 const panel=(s,e,lo,hi)=>{if(e>s+1e-6&&hi>lo+1e-6)b.box((s+e)/2,(hi+lo)/2,-.055,e-s,hi-lo,.11,'#dddcd0',24);};
 const cuts=[0,h,...opens.flatMap(o=>[o.lo,o.hi])].filter(y=>y>=0&&y<=h).sort((a,b)=>a-b);
 for(let j=1;j<cuts.length;j++){const lo=cuts[j-1],hi=cuts[j],os=opens.filter(o=>o.lo<hi-1e-6&&o.hi>lo+1e-6).sort((a,b)=>a.x-b.x);let x=0;for(const o of os){panel(x,Math.max(x,o.x-o.w/2),lo,hi);x=Math.max(x,o.x+o.w/2);}panel(x,len,lo,hi);}
 for(const o of opens){if(o.air)continue;const w=o.w,hh=o.hi-o.lo,y=(o.lo+o.hi)/2;b.box(o.x,y,-.23,w-.08,hh-.08,.04,'#637e79',5);for(const x of[o.x-w/2,o.x+w/2])b.box(x,y,-.075,.055,hh,.15,'#3f5b53',24);for(const yy of[o.lo,o.hi])b.box(o.x,yy,-.075,w,.055,.15,'#3f5b53',24);const n=o.grille?Math.ceil(w/.18):Math.max(1,Math.round(w/.7));for(let k=1;k<n;k++)b.box(o.x-w/2+w*k/n,y,-.025,.025,hh,.09,o.grille?'#c6ccbc':'#3f5b53',24);if(!o.grille)b.box(o.x,o.hi-.55,-.025,w,.035,.09,'#3f5b53',24);}
 b.box(len/2,h-.10,0,len,.20,.22,'#e8e6d9',24);
 }));}
const pairRows=(len,lo,hi,step=6.3)=>{const os=[];for(let x=2.4;x<len-1.5;x+=step)for(const off of[-.78,.78])os.push({x:x+off,w:1.1,lo,hi});return os;};
// East upper wall has paired tall windows, a distinct middle terrace, and grilles below seating.
face('east-upper',15.2,98.283,Math.PI/2,98.283,10.7,[...pairRows(98.283,8.0,10.05),...pairRows(98.283,4.9,6.65)]);
const grills=[];for(let x=2.5;x<97;x+=6.3)grills.push({x,w:4.2,lo:.45,hi:2.55,grille:true});
face('east-under-stands',19.73,98.283,Math.PI/2,98.283,3.05,grills);
// West long facade is tree-obscured; only restrained visible upper bands are fitted.
face('west-main',0,0,-Math.PI/2,85.786,10.7,[...pairRows(85.786,4.5,6.4),...pairRows(85.786,7.9,9.9)]);
face('west-south',-.14,98.283,-Math.PI/2,33.52,6.3,pairRows(33.52,3.7,5.4));
face('east-south',19.74,131.8,Math.PI/2,33.517,6.3,pairRows(33.517,3.2,5.3));
face('north-end',15.2,0,Math.PI,15.2,10.7,[]);
// The stand end follows the low stepped deck instead of extending the main wall above its roof.
{const g=new G.Geometry(),p=[[15.2,0],[19.73,0],[19.73,3.05],[18.865,3.05],[18.865,3.39],[18.085,3.39],[18.085,3.73],[17.305,3.73],[17.305,4.07],[16.525,4.07],[16.525,4.41],[15.2,4.41]];for(let i=1;i<p.length-1;i++)g.tri(...[p[0],p[i+1],p[i]].map(q=>vertex(q[0],q[1],0)));add('043-north-low-stand-closure',g,'#dddcd0',24,id);}
face('south-end',-.134,131.8,0,19.873,6.3,[]);
face('south-step',0,98.283,0,15.2,10.7,[{x:7.6,w:15.2,lo:0,hi:6.3,air:true}]);
// Entrance block four unequal photo levels: doorway, small intermediate window, two upper windows.
const entryWindows=[{x:5.9,w:3.2,lo:.45,hi:3.7},{x:10.3,w:1.25,lo:1.4,hi:3.3},{x:10.3,w:1.15,lo:4.5,hi:6.2},{x:5.9,w:3.3,lo:7.0,hi:9.1},{x:10.3,w:1.15,lo:7.0,hi:9.1},{x:5.9,w:3.3,lo:10,hi:12.1},{x:10.3,w:1.15,lo:10,hi:12.1}];
face('west-entrance',-3.44,85.786,-Math.PI/2,12.497,13.6,entryWindows);
face('entry-north-return',5.2,85.786,Math.PI,8.64,13.6,[]);face('entry-south-return',-3.44,98.283,0,8.64,13.6,[]);
face('entry-upper-east',5.2,98.283,Math.PI/2,12.497,13.6,[{x:6.2485,w:12.497,lo:0,hi:10.7,air:true}]);
b.local(O[0],0,O[1],R,()=>{
 group('east-seating',()=>{for(let row=0;row<5;row++){const u=19.25-row*.78,h=3.05+row*.34;b.box(u,h-.17,49.1415,.79,.34,98.283,'#d0d0c2',24);for(let v=1;v<97.5;v+=.83){if((v%12.6)<1.5)continue;b.box(u,h+.09,v,.56,.16,.58,'#3996bd',24);b.box(u-.25,h+.30,v,.08,.45,.58,'#378ab0',24);}}});
 group('east-central-terrace',()=>{b.box(17.3,4.84,55.0,4.2,.24,27.0,'#dddccc',24);b.box(17.15,7.36,55.0,4.5,.18,29.0,'#e0dfd1',24);for(const v of[42,49,56,63,68])b.box(19.1,6.11,v,.18,2.32,.20,'#d7d7c9',24);for(const y of[5.32,5.7,6.05])b.box(19.35,y,55,.055,.045,27,'#c9d0c2',24);for(let v=41.5;v<=68.5;v+=2)b.box(19.35,5.49,v,.05,1.12,.05,'#c9d0c2',24);});
 group('terrace-front-wall',()=>b.box(19.35,4.55,55,.18,.82,27,'#dddccc',24));
 // Western entrance apron and south-running ramp stay on the road side.
 group('west-entry-apron',()=>{const v=91.686;b.box(-3.32,.225,v,.28,.45,3.2,'#bcbfb4',24);b.box(-4.4,.225,v,2.0,.45,4.6,'#bcbfb4',24);b.box(-4.55,3.95,v,2.4,.18,6.0,'#e1e0d4',24);for(let k=0;k<3;k++){const h=(k+1)*.15;b.box(-6.35+k*.48,h/2,v,.49,h,4.8,'#bcbfb4',24);}const g=new G.Geometry();g.quad(vertex(-5.2,.45,93.986),vertex(-3.6,.45,93.986),vertex(-3.6,.03,101.5),vertex(-5.2,.03,101.5));add('043-west-ramp-slope',g,'#b9bdb1',24,id);for(const u of[-5.2,-3.6]){b.beam([u,1.35,93.986],[u,.93,101.5],.045,'#aebaae',24);b.beam([u,.98,93.986],[u,.56,101.5],.035,'#aebaae',24);for(let j=0;j<=6;j++){const z=93.986+(101.5-93.986)*j/6,y=.45-.42*j/6;b.box(u,y+.45,z,.04,.9,.04,'#aebaae',24);}}});
});
// Sign is attached to the western door facade; text is not an assertion of floor count.
const wp=world(-3.56,85.786);b.local(wp[0],0,wp[1],R-Math.PI/2,()=>group('west-sign',()=>{[...'五四体育活动中心'].forEach((ch,i)=>b.lettering(ch,8.75,11.6-i*.85,.04,.58,.66,0,'#b49a56'));}));
return{strategy:'building043-v46',formalFloorsKnown:false,flatRoofZones:3,eastStands:true,westEntrance:true,entryVisibleLevels:4,mainUniformFourFloors:false,allEntrancesVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building043={id:ID,render,world,local,pieces};
})(YY);
