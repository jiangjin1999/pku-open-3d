/* Original, dependency-free vector and column-major matrix utilities. */
(function(G){'use strict';
const M={
 add:(a,b)=>a.map((v,i)=>v+b[i]), sub:(a,b)=>a.map((v,i)=>v-b[i]), mul:(a,k)=>a.map(v=>v*k),
 dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm(a){let n=Math.hypot(...a)||1;return a.map(v=>v/n)},lerp:(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
 identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),
 transform(p,s=[1,1,1],r=0){let c=Math.cos(r),q=Math.sin(r);return new Float32Array([c*s[0],0,-q*s[0],0,0,s[1],0,0,q*s[2],0,c*s[2],0,...p,1])},
 multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o},
 apply(m,p){let o=[0,0,0,0];for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[r]+=m[k*4+r]*p[k];return o},
 perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),q=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*q,-1,0,0,2*far*near*q,0])},
 ortho(l,r,b,t,n,f){return new Float32Array([2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1])},
 lookAt(eye,target,up=[0,1,0]){let z=M.norm(M.sub(eye,target)),x=M.norm(M.cross(up,z)),y=M.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-M.dot(x,eye),-M.dot(y,eye),-M.dot(z,eye),1])},
 inverse(m){let a=Array.from({length:4},(_,r)=>[...Array.from({length:4},(_,c)=>m[c*4+r]),...Array.from({length:4},(_,c)=>+(r===c))]);for(let c=0;c<4;c++){let p=c;for(let r=c+1;r<4;r++)if(Math.abs(a[r][c])>Math.abs(a[p][c]))p=r;if(Math.abs(a[p][c])<1e-12)throw Error('Singular matrix');[a[c],a[p]]=[a[p],a[c]];let d=a[c][c];a[c]=a[c].map(x=>x/d);for(let r=0;r<4;r++)if(r!==c){let f=a[r][c];a[r]=a[r].map((x,i)=>x-f*a[c][i])}}return new Float32Array(Array.from({length:16},(_,i)=>a[i%4][4+Math.floor(i/4)]))},
 frustum(m){return [[3,0,1],[3,0,-1],[3,1,1],[3,1,-1],[3,2,1],[3,2,-1]].map(([a,b,s])=>{let p=[m[a]+s*m[b],m[a+4]+s*m[b+4],m[a+8]+s*m[b+8],m[a+12]+s*m[b+12]],n=Math.hypot(p[0],p[1],p[2]);return p.map(v=>v/n)})},
 sphereVisible(f,c,r){return f.every(p=>p[0]*c[0]+p[1]*c[1]+p[2]*c[2]+p[3]>=-r)},
 pointInPoly([x,y],p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){let a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c},
 rng(seed=1898){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}},
 color(h){h=h.replace('#','');return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)},
 smooth:(x)=>x*x*(3-2*x),
 catmull(points,steps=10,closed=false){let out=[],n=points.length;for(let i=0;i<(closed?n:n-1);i++){let at=k=>points[closed?(k+n)%n:M.clamp(k,0,n-1)];let a=at(i-1),b=at(i),c=at(i+1),d=at(i+2);for(let j=0;j<steps;j++){let t=j/steps,t2=t*t,t3=t2*t;out.push(b.map((v,k)=>.5*(2*v+(-a[k]+c[k])*t+(2*a[k]-5*v+4*c[k]-d[k])*t2+(-a[k]+3*v-3*c[k]+d[k])*t3)))}}if(!closed)out.push(points[n-1]);return out}
};G.YY=G.YY||{};G.YY.M=M;if(typeof module!=='undefined')module.exports=M;
})(globalThis);
