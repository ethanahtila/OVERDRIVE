'use strict';
// Fully animated Canvas fallback: complete connected figures, never cut-up sprites.
window.Fighter2D=(()=>{
 const TAU=Math.PI*2;
 function oval(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();}
 function limb(c,a,b,width,fill,highlight){c.lineCap='round';c.strokeStyle='#17202b';c.lineWidth=width+2;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();c.strokeStyle=fill;c.lineWidth=width;c.stroke();if(highlight){c.strokeStyle=highlight;c.lineWidth=Math.max(1,width*.18);c.beginPath();c.moveTo(a.x-1,a.y-1);c.lineTo(b.x-1,b.y-1);c.stroke();}}
 function ik(a,t,l1,l2,bend){const dx=t.x-a.x,dy=t.y-a.y,length=Math.hypot(dx,dy)||1,d=Math.min(length,l1+l2-.05),ux=dx/length,uy=dy/length,along=(d*d+l1*l1-l2*l2)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along));return {joint:{x:a.x+ux*along-uy*height*bend,y:a.y+uy*along+ux*height*bend},end:{x:a.x+ux*d,y:a.y+uy*d}};}
 function draw(c,p,time=0){const F=window.Fight,ch=F.char(p.character),pose=F.pose(p,time),wide=p.character==='bastion'?1.2:p.character==='lyra'?.9:1,armor=p.character==='bastion'?'#9a9d95':p.character==='nyx'?'#6f6387':'#8da4ad',skin=p.character==='marin'?'#b98a70':'#d2a28b';
 c.save();c.translate(p.x,p.y);c.scale(p.facing||1,1);if(p.invuln>0)c.globalAlpha*=.68+Math.sin(time*23)*.12;c.translate(0,-43);c.rotate(pose.rotation);c.translate(0,43);
 // Flowing cloth joins the shoulders and follows the same complete pose.
 c.fillStyle=ch.dark;c.beginPath();c.moveTo(pose.chest.x-7,pose.chest.y-1);c.bezierCurveTo(pose.chest.x-25-(p.vx||0)*.02,-47,pose.hip.x-13+Math.sin(time*8)*5,-16,pose.hip.x-6,-11);c.lineTo(pose.hip.x+7,pose.hip.y+2);c.closePath();c.fill();
 const legs=[];for(const [i,target]of [pose.leftFoot,pose.rightFoot].entries()){const a={x:pose.hip.x+(i?5:-5),y:pose.hip.y},k=ik(a,target,22,23,-1);legs.push(k);limb(c,a,k.joint,8*wide,ch.dark,'#ffffff24');limb(c,k.joint,k.end,7,armor,'#e0e5de66');oval(c,k.end.x+2,k.end.y-1,6,3,'#26323b');}
 const offA={x:pose.chest.x-7*wide,y:pose.chest.y+1},mainA={x:pose.chest.x+9*wide,y:pose.chest.y+1},off=ik(offA,pose.offHand,17,17,-1),main=ik(mainA,pose.hand,17,17,1);
 limb(c,offA,off.joint,7,ch.dark,'#ffffff22');limb(c,off.joint,off.end,6,armor,'#e3ddd855');oval(c,off.end.x,off.end.y,3,3.5,skin);
 const g=c.createLinearGradient(pose.chest.x-11,-65,pose.chest.x+12,-38);g.addColorStop(0,'#26333c');g.addColorStop(.42,ch.dark);g.addColorStop(1,armor);
 c.fillStyle=g;c.beginPath();c.moveTo(pose.hip.x-8*wide,pose.hip.y+3);c.quadraticCurveTo(pose.chest.x-13*wide,pose.chest.y+8,pose.chest.x-10*wide,pose.chest.y-2);c.quadraticCurveTo(pose.chest.x,pose.chest.y-8,pose.chest.x+12*wide,pose.chest.y);c.lineTo(pose.hip.x+9*wide,pose.hip.y+3);c.closePath();c.fill();
 limb(c,{x:pose.hip.x-8*wide,y:pose.hip.y+1},{x:pose.hip.x+8*wide,y:pose.hip.y+1},3,'#c3a573');
 limb(c,{x:pose.chest.x,y:pose.chest.y-2},{x:pose.head.x,y:pose.head.y+7},6,skin);
 c.save();c.translate(pose.head.x,pose.head.y);c.rotate(pose.bodyAngle*.2);oval(c,0,0,6.8,8.5,skin);c.fillStyle=p.character==='lyra'?'#dedbcf':'#332f36';c.beginPath();c.moveTo(-7,1);c.bezierCurveTo(-12,-12,5,-14,8,-5);c.lineTo(2,-6);c.lineTo(-5,-1);c.closePath();c.fill();c.fillStyle=skin;c.beginPath();c.moveTo(5,-2);c.lineTo(9,1);c.lineTo(5,3);c.fill();c.fillStyle='#16242d';c.fillRect(3,-2,2.3,1.4);
 if(p.character==='nyx'){c.fillStyle=ch.dark;c.beginPath();c.moveTo(-8,5);c.quadraticCurveTo(-14,-15,3,-12);c.quadraticCurveTo(12,-11,8,-4);c.lineTo(1,-6);c.lineTo(-4,0);c.fill();limb(c,{x:0,y:5},{x:7,y:4},4,ch.dark);}
 if(p.character==='ember'){c.strokeStyle=ch.color;c.lineWidth=3;c.beginPath();c.moveTo(-6,-8);c.quadraticCurveTo(-17,-15-Math.sin(time*8)*2,-22,-8);c.stroke();}
 if(p.character==='lyra'){c.fillStyle='#d9d9d0';c.beginPath();c.moveTo(-6,-4);c.quadraticCurveTo(-22,1,-23-Math.sin(time*6)*3,14);c.quadraticCurveTo(-10,9,-5,1);c.fill();}c.restore();
 limb(c,mainA,main.joint,7.5*wide,ch.dark,'#ffffff33');limb(c,main.joint,main.end,6.5,armor,'#e3e8de88');oval(c,mainA.x,mainA.y,5.8*wide,4.5,armor);oval(c,main.end.x,main.end.y,3.3,3.5,skin);
 const kind=F.weapon(p.weapon).kind;if(kind==='fists'||kind==='dual'){for(const hand of [off.end,main.end]){c.save();c.translate(hand.x,hand.y);c.rotate(pose.weaponAngle);if(kind==='fists')oval(c,4,0,8,6,armor);else{c.fillStyle='#d0dce2';c.beginPath();c.moveTo(1,-4);c.lineTo(34,0);c.lineTo(1,4);c.fill();}c.restore();}}
 else window.Art?.weapon(c,p.weapon,main.end.x,main.end.y,pose.weaponAngle,.85,ch.color);
 if(p.hitFlash>0){c.globalAlpha*=Math.min(.5,p.hitFlash*3);oval(c,pose.chest.x,pose.chest.y+8,12*wide,19,'#fff3d9');}c.restore();return true;
 }
 return {draw,ik};
})();
