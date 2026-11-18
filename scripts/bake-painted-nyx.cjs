'use strict';
// Optional offline art-source assembly. Runtime only draws the finished whole-frame images.
const fs=require('node:fs'),path=require('node:path'),F=require('../public/core.js'),M=require('../public/motion.js');
const sharp=require(process.env.SHARP_MODULE||'sharp'),root=path.resolve(__dirname,'..'),input=path.join(root,'art-source','painted-parts.png'),out=path.join(root,'art-source','nyx.png');
const R=[{x:14,y:670,w:176,h:183},{x:244,y:667,w:135,h:190},{x:431,y:671,w:99,h:184},{x:584,y:672,w:100,h:177},{x:733,y:671,w:129,h:190},{x:920,y:670,w:92,h:187},{x:1045,y:666,w:170,h:209},{x:1246,y:692,w:153,h:127}];let textures=[];
function ik(a,b,l1,l2,bend){const dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1,d=Math.max(Math.abs(l1-l2)+.01,Math.min(n,l1+l2-.1)),ux=dx/n,uy=dy/n,k=(d*d+l1*l1-l2*l2)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-k*k));return {k:{x:a.x+ux*k-uy*h*bend,y:a.y+uy*k+ux*h*bend},b:{x:a.x+ux*d,y:a.y+uy*d}};}
function unpack(a){const p={};M.fields.forEach((k,i)=>p[k]={x:a[i*2],y:a[i*2+1]});p.rotation=a[15];p.bodyAngle=a[16];return p;}
function svg(pose){let s='';const part=(index,x,y,w,h,angle=0)=>{const r=R[index];s+=`<g transform="translate(${x} ${y}) rotate(${angle*180/Math.PI})"><svg x="${-w/2}" y="0" width="${w}" height="${h}" viewBox="0 0 ${r.w} ${r.h}" preserveAspectRatio="none"><use href="#paint${index}"/></svg></g>`;},joint=(p,r)=>s+=`<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="#302a3d"/>`,segment=(index,a,b,w)=>part(index,a.x,a.y-1,w,Math.hypot(b.x-a.x,b.y-a.y)+3,Math.atan2(b.y-a.y,b.x-a.x)-Math.PI/2);
 const h=pose.hip,c=pose.chest,feet=[pose.leftFoot,pose.rightFoot],hands=[pose.offHand,pose.hand],arms=[];
 part(6,c.x-6,c.y-2,25,47,-.12);
 for(let i=0;i<2;i++){const a={x:h.x+(i?5:-5),y:h.y},v=ik(a,feet[i],22,23,-1);joint(a,6);joint(v.k,4);segment(4,a,v.k,14);segment(5,v.k,v.b,13);}
 for(let i=0;i<2;i++){const a={x:c.x+(i?9:-7),y:c.y+1},v=ik(a,hands[i],17,17,i?1:-1);arms.push({a,...v});if(!i){joint(a,5);joint(v.k,4);segment(2,a,v.k,10);segment(3,v.k,v.b,9);}}
 const spineAngle=Math.atan2(c.x-h.x,-(c.y-h.y));part(1,h.x,h.y-30,28,35,spineAngle*.4);
 part(7,c.x-7,c.y-3,16,12,-.12);
 s+=`<path d="M${c.x} ${c.y+2} L${pose.head.x} ${pose.head.y+11}" stroke="#3c314a" stroke-width="7"/>`;part(0,pose.head.x,pose.head.y-8,24,26,pose.bodyAngle*.25);
 const a=arms[1];joint(a.a,5);joint(a.k,4);segment(2,a.a,a.k,11);segment(3,a.k,a.b,10);part(7,a.a.x,a.a.y-4,17,12,pose.bodyAngle*.2);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><defs>${textures.map((t,i)=>`<image id="paint${i}" width="${R[i].w}" height="${R[i].h}" href="data:image/png;base64,${t}"/>`).join('')}</defs><g transform="translate(76 151) scale(1.48)"><g transform="translate(0 -43) rotate(${(pose.rotation||0)*180/Math.PI}) translate(0 43)">${s}</g></g></svg>`;
}
(async()=>{textures=await Promise.all(R.map(async r=>(await sharp(input).extract({left:r.x,top:r.y,width:r.w,height:r.h}).png().toBuffer()).toString('base64')));const anchors={};const clips=['idle','run','jump','dodge','side','up','down','light'],cells=[];for(let row=0;row<8;row++)for(let col=0;col<8;col++){const p=F.create({players:[{id:'nyx',character:'nyx'},{id:'b'}]}).players[0];Object.assign(p,{grounded:true,invuln:0,vx:0,landSquash:0});let pose;const t=col/7;if(row===1){p.vx=440;p.runPhase=col/8;}if(row===2){p.grounded=false;p.vy=-690+1380*t;if(col===0||col===6)p.landSquash=.1;}if(row===3){p.grounded=false;p.dodgeTime=.1;p.dodgeAge=t*.19;}if(row>=4)pose=unpack(M.sample(row===4?'punch':row===5?'upper':row===6?'slam':col<3?'punch':col<5?'cross':'kick',row===7?(col<3?col/2:col<5?(col-3):((col-5)/2)):t));else pose=F.pose(p,col/8);
 (anchors[clips[row]]??=[]).push([(76+1.48*pose.hand.x)/160,(151+1.48*pose.hand.y)/160]);cells.push({input:await sharp(Buffer.from(svg(pose))).png().toBuffer(),left:col*160,top:row*160});}
 await sharp({create:{width:1280,height:1280,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(cells).png().toFile(out);fs.writeFileSync(path.join(root,'art-source','nyx-grips.json'),JSON.stringify(anchors));console.log('Baked 64 complete Nyx frames from preserved painted assets.');})().catch(e=>{console.error(e);process.exit(1)});
