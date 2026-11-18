(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FighterMotion=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
// Foot-anchored full-body poses: pelvis, ribcage, head, hands, feet, then weapon/body angles.
const neutral=[0,-39,0,-65,1,-85,21,-47,-10,-48,-10,0,10,0,-.2,0,0];
function frame(patch={}){const a=neutral.slice(),fields={hip:0,chest:2,head:4,hand:6,offHand:8,leftFoot:10,rightFoot:12};for(const [name,index]of Object.entries(fields))if(patch[name])a.splice(index,2,...patch[name]);for(const [name,index]of [['weaponAngle',14],['rotation',15],['bodyAngle',16]])if(name in patch)a[index]=patch[name];return a;}
const P={
 idle:frame(),
 low:frame({hip:[-3,-31],chest:[-7,-57],head:[-9,-76],hand:[5,-58],offHand:[-13,-53],leftFoot:[-18,0],rightFoot:[14,0],weaponAngle:-1.7,bodyAngle:-.2}),
 guard:frame({hip:[-2,-36],chest:[-5,-63],head:[-6,-83],hand:[12,-65],offHand:[-5,-61],leftFoot:[-15,0],rightFoot:[13,0],weaponAngle:-1.4,bodyAngle:-.1}),
 back:frame({hip:[-5,-35],chest:[-14,-59],head:[-16,-80],hand:[-24,-63],offHand:[2,-59],leftFoot:[-22,0],rightFoot:[17,0],weaponAngle:-2.6,bodyAngle:-.28}),
 high:frame({hip:[-3,-36],chest:[-8,-62],head:[-10,-82],hand:[-8,-88],offHand:[9,-77],leftFoot:[-20,0],rightFoot:[15,0],weaponAngle:-2.3,bodyAngle:-.18}),
 cut:frame({hip:[5,-34],chest:[14,-58],head:[19,-77],hand:[41,-62],offHand:[-12,-55],leftFoot:[-22,0],rightFoot:[27,0],weaponAngle:.1,bodyAngle:.3}),
 across:frame({hip:[6,-31],chest:[17,-53],head:[21,-73],hand:[35,-33],offHand:[-9,-59],leftFoot:[-20,0],rightFoot:[31,0],weaponAngle:1.55,bodyAngle:.38}),
 thrust:frame({hip:[8,-32],chest:[22,-55],head:[26,-75],hand:[54,-54],offHand:[12,-57],leftFoot:[-23,0],rightFoot:[33,0],weaponAngle:0,bodyAngle:.38}),
 thrustBack:frame({hip:[-3,-35],chest:[-11,-59],head:[-14,-79],hand:[0,-52],offHand:[-17,-53],leftFoot:[-22,0],rightFoot:[15,0],weaponAngle:0,bodyAngle:-.2}),
 lowCut:frame({hip:[5,-25],chest:[18,-47],head:[20,-66],hand:[42,-28],offHand:[-3,-55],leftFoot:[-22,0],rightFoot:[30,0],weaponAngle:.6,bodyAngle:.4}),
 upper:frame({hip:[2,-43],chest:[6,-69],head:[4,-89],hand:[18,-101],offHand:[-15,-58],leftFoot:[-16,-2],rightFoot:[17,-8],weaponAngle:-1.5,bodyAngle:-.12}),
 upperEnd:frame({hip:[4,-41],chest:[10,-66],head:[12,-87],hand:[39,-83],offHand:[-11,-55],leftFoot:[-19,0],rightFoot:[20,0],weaponAngle:-.85,bodyAngle:.13}),
 slam:frame({hip:[6,-25],chest:[22,-45],head:[26,-63],hand:[43,-23],offHand:[15,-30],leftFoot:[-20,0],rightFoot:[31,0],weaponAngle:1.3,bodyAngle:.6}),
 spinBack:frame({hip:[-2,-36],chest:[-8,-60],head:[-10,-80],hand:[-27,-55],offHand:[24,-52],leftFoot:[-16,0],rightFoot:[16,-3],weaponAngle:-2.8,bodyAngle:-.25}),
 spinFront:frame({hip:[3,-34],chest:[8,-60],head:[10,-80],hand:[40,-55],offHand:[-22,-51],leftFoot:[-12,-5],rightFoot:[23,0],weaponAngle:.35,bodyAngle:.22}),
 punchBack:frame({hip:[-3,-36],chest:[-8,-61],head:[-7,-81],hand:[6,-52],offHand:[8,-65],leftFoot:[-18,0],rightFoot:[15,0],weaponAngle:-.15,bodyAngle:-.18}),
 punch:frame({hip:[6,-34],chest:[17,-58],head:[19,-79],hand:[49,-54],offHand:[4,-65],leftFoot:[-23,0],rightFoot:[28,0],weaponAngle:-.05,bodyAngle:.32}),
 offPunch:frame({hip:[3,-34],chest:[12,-59],head:[15,-79],hand:[9,-63],offHand:[39,-56],leftFoot:[-17,0],rightFoot:[23,0],weaponAngle:-1.2,bodyAngle:.18}),
 kick:frame({hip:[-1,-42],chest:[-12,-65],head:[-18,-84],hand:[6,-67],offHand:[-24,-54],leftFoot:[-16,0],rightFoot:[38,-51],weaponAngle:-1.4,bodyAngle:-.35}),
 hookBack:frame({hip:[-4,-35],chest:[-12,-60],head:[-13,-80],hand:[-19,-72],offHand:[8,-60],leftFoot:[-21,0],rightFoot:[15,0],weaponAngle:-2.4,bodyAngle:-.23}),
 hook:frame({hip:[5,-32],chest:[15,-57],head:[18,-78],hand:[40,-46],offHand:[-12,-55],leftFoot:[-20,0],rightFoot:[27,0],weaponAngle:.6,bodyAngle:.3}),
 hookEnd:frame({hip:[-2,-32],chest:[-6,-57],head:[-8,-77],hand:[-14,-44],offHand:[4,-61],leftFoot:[-23,0],rightFoot:[20,0],weaponAngle:2.8,bodyAngle:-.2}),
 bowReady:frame({hip:[-2,-36],chest:[0,-63],head:[6,-83],hand:[29,-57],offHand:[10,-56],leftFoot:[-20,0],rightFoot:[18,0],weaponAngle:0}),
 bowDraw:frame({hip:[-4,-36],chest:[-6,-62],head:[1,-83],hand:[32,-57],offHand:[-27,-56],leftFoot:[-23,0],rightFoot:[19,0],weaponAngle:0,bodyAngle:-.12}),
 bowRelease:frame({hip:[-2,-35],chest:[-2,-62],head:[3,-83],hand:[34,-57],offHand:[-32,-61],leftFoot:[-23,0],rightFoot:[21,0],weaponAngle:.025,bodyAngle:-.05}),
 cannon:frame({hip:[1,-35],chest:[6,-60],head:[8,-81],hand:[28,-52],offHand:[16,-55],leftFoot:[-20,0],rightFoot:[21,0],weaponAngle:-.03,bodyAngle:.1}),
 recoil:frame({hip:[-7,-32],chest:[-17,-56],head:[-23,-75],hand:[10,-63],offHand:[-3,-61],leftFoot:[-27,0],rightFoot:[17,0],weaponAngle:-.45,bodyAngle:-.35}),
 cast:frame({hip:[0,-39],chest:[-4,-65],head:[-5,-85],hand:[20,-82],offHand:[-21,-61],leftFoot:[-15,-2],rightFoot:[14,-3],weaponAngle:-1.1,bodyAngle:-.12}),
 castOut:frame({hip:[4,-36],chest:[10,-60],head:[12,-81],hand:[39,-64],offHand:[-19,-49],leftFoot:[-22,0],rightFoot:[23,0],weaponAngle:.15,bodyAngle:.2}),
 plant:frame({hip:[2,-22],chest:[10,-46],head:[13,-65],hand:[30,-21],offHand:[5,-30],leftFoot:[-20,0],rightFoot:[25,0],weaponAngle:1.7,bodyAngle:.32}),
 phase:frame({hip:[2,-25],chest:[19,-45],head:[27,-61],hand:[14,-37],offHand:[-14,-37],leftFoot:[-23,-3],rightFoot:[23,-7],weaponAngle:-2.8,bodyAngle:.6}),
 leap:frame({hip:[0,-45],chest:[-4,-70],head:[-7,-90],hand:[8,-87],offHand:[-21,-63],leftFoot:[-20,-14],rightFoot:[13,-19],weaponAngle:-2.1,bodyAngle:-.15}),
 echo:frame({hip:[-4,-33],chest:[-12,-57],head:[-15,-78],hand:[-13,-67],offHand:[24,-50],leftFoot:[-22,0],rightFoot:[19,0],weaponAngle:-2,bodyAngle:-.25})
};
// Authored anticipation, contact and follow-through. All joints move together.
const actions={
 coil:['idle','low','low','guard'],guard:['idle','guard','guard','guard'],lean:['idle','back','back','back'],draw:['bowReady','bowDraw','bowDraw','bowDraw'],flow:['idle','back','low','guard'],
 lunge:['thrustBack','thrustBack','thrust','thrust'],thrust:['thrustBack','thrustBack','thrust','cut'],cut:['back','back','cut','across'],cleave:['high','high','cut','slam'],upper:['low','lowCut','upper','upperEnd'],slam:['high','high','slam','plant'],chop:['high','high','slam','lowCut'],sweep:['back','low','lowCut','hookEnd'],
 spin:['spinBack','spinBack','spinFront','spinBack'],punch:['punchBack','punchBack','punch','guard'],cross:['punchBack','offPunch','punch','across'],kick:['low','guard','kick','guard'],hook:['hookBack','hookBack','hook','hookEnd'],recoil:['cannon','cannon','recoil','cannon'],bow:['bowReady','bowDraw','bowRelease','bowReady'],cast:['guard','cast','castOut','cast'],throw:['back','back','thrust','across'],whip:['hookBack','high','thrust','hookEnd'],plant:['high','high','plant','plant'],phase:['back','phase','phase','cut'],echo:['back','echo','echo','cut'],surge:['back','low','thrust','across'],flip:['low','leap','leap','low'],recover:['guard','guard','idle','idle']
};
function sample(style,t){const names=actions[style]||actions.cut,frames=names.map(n=>P[n]),knots=[0,.23,.62,1];t=clamp(t,0,1);let j=t<knots[1]?0:t<knots[2]?1:2,u=(t-knots[j])/(knots[j+1]-knots[j]);
 // Cubic interpolation gives continuous velocity through contact, not stop/start tweening.
 const before=frames[Math.max(0,j-1)],a=frames[j],b=frames[j+1],after=frames[Math.min(3,j+2)],result=a.map((v,i)=>{const m0=(b[i]-before[i])*.38,m1=(after[i]-v)*.38,u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*v+(u3-2*u2+u)*m0+(-2*u3+3*u2)*b[i]+(u3-u2)*m1;});
 if(style==='spin'){const a=t*TAU;result[6]=Math.cos(a)*33+5;result[7]=-55+Math.sin(a)*22;result[14]=a;result[12]=8+Math.sin(a)*12;}
 if(style==='flip')result[15]=t*TAU;
 return result;
}
const fields=['hip','chest','head','hand','offHand','leftFoot','rightFoot'];
function unpack(a){const p={};fields.forEach((key,i)=>p[key]={x:a[i*2],y:a[i*2+1]});p.weaponAngle=a[14];p.rotation=a[15];p.bodyAngle=a[16];return p;}
function directional(a,aim){if(aim==='up'){a[7]-=8;a[9]-=4;a[14]-=.28;}if(aim==='down'){a[1]+=3;a[3]+=3;a[5]+=3;a[7]+=7;a[14]+=.18;}return a;}
function styleCharacter(a,id,role,t){const weight=role==='recover'?1-smooth(t):1;
 if(id==='ember'){a[2]+=3*weight;a[4]+=3*weight;a[16]+=.08*weight;}
 else if(id==='lyra'){a[1]-=2*weight;a[3]-=2*weight;a[5]-=2*weight;a[10]-=3*weight;a[12]+=3*weight;}
 else if(id==='bastion'){a[1]+=4*weight;a[3]+=3*weight;a[5]+=3*weight;a[10]-=4*weight;a[12]+=4*weight;a[8]-=3*weight;}
 else if(id==='nyx'){a[1]+=3*weight;a[3]+=4*weight;a[5]+=4*weight;a[8]-=6*weight;a[9]+=8*weight;}
 else if(id==='marin'){a[2]-=2*weight;a[8]-=5*weight;a[9]-=5*weight;a[16]-=.07*weight;}
 return a;
}
function pose(F,p,time=0){const speed=clamp(Math.abs(p.vx||0)/460,0,1),phase=(p.runPhase||0)*TAU,air=!p.grounded;let a=neutral.slice();
 const breathing=Math.sin(time*2.6)*.65,bob=air?0:Math.sin(phase*2)*speed*2;
 for(const index of [1,3,5,7,9])a[index]+=breathing*(index===1?.2:1)+bob;
 a[2]+=speed*5;a[4]+=speed*7;a[10]=-5+Math.sin(phase)*speed*22;a[11]=-Math.max(0,Math.cos(phase))*speed*14;a[12]=5-Math.sin(phase)*speed*22;a[13]=-Math.max(0,-Math.cos(phase))*speed*14;
 a[6]=18-Math.sin(phase)*speed*12;a[7]=-48+Math.cos(phase)*speed*5;a[8]=-11+Math.sin(phase)*speed*16;a[9]=-48-Math.cos(phase)*speed*5;
 if(air){a[1]=-43;a[3]=-67;a[5]=-87;a[10]=-16;a[11]=-12+clamp((p.vy||0)*.015,-8,8);a[12]=18;a[13]=-17-clamp((p.vy||0)*.01,-8,8);a[7]=-53;a[16]=clamp((p.vx||0)*.00022,-.15,.15);}
 const attack=p.attack;
 if(attack){const sig=attack.heavy?F.attackSpec(attack):null,stage=attack.heavy?F.activeStage(attack):{pose:F.lightPose(attack.weapon,attack.combo,attack.context),start:0,duration:attack.duration,role:'light'};
  if(stage){const t=clamp((attack.age-stage.start)/stage.duration,0,1),current=directional(sample(stage.pose,t),attack.aim);let origin=a.slice();
   if(sig){const index=sig.stages.indexOf(stage),previous=sig.stages[index-(attack.missed&&sig.stages[index-1]?.role==='finisher'?2:1)];if(previous){origin=directional(sample(previous.pose,1),attack.aim);if(attack.context!=='air')styleCharacter(origin,p.character,previous.role,1);}}
   if(attack.context!=='air'&&attack.heavy)styleCharacter(current,p.character,stage.role,t);
   // Avoid a full backwards revolution when a spin joins the next phase.
   for(const index of [14,15])origin[index]=current[index]+Math.atan2(Math.sin(origin[index]-current[index]),Math.cos(origin[index]-current[index]));
   const blend=smooth(t/.18);a=current.map((v,i)=>mix(origin[i],v,blend));
   if(stage.role==='recover'||!attack.heavy&&t>.74){const rest=stage.role==='recover'?smooth(t):smooth((t-.74)/.26);a=a.map((v,i)=>mix(v,neutral[i],rest));}
  }
 }
 if(p.charging){const kind=F.weapon(p.weapon).kind;a=(kind==='bow'?P.bowDraw:kind==='cannon'?P.cannon:kind==='orb'?P.cast:P.guard).slice();a[6]+=Math.sin(time*16)*(p.charge||0)*.8;}
 if(p.dodgeTime>0){a=P.leap.slice();a[15]=(p.dodgeAge||0)/.19*TAU;}
 if(p.landSquash>0){const squash=p.landSquash/.12*5;for(const i of [1,3,5])a[i]+=squash;}
 if(!attack&&!p.charging){const lean=(p.moveLean||0)*(p.facing||1);a[2]+=lean*4;a[4]+=lean*6;a[16]+=lean*.04;}
 if((p.stun||0)>0){const recoil=clamp(p.stun/.22,0,1),side=(p.hitDirection||1)*(p.facing||1);a[2]-=side*recoil*11;a[4]-=side*recoil*15;a[6]-=side*recoil*9;a[9]-=recoil*9;a[16]-=side*recoil*.18;a[11]-=recoil*6;a[13]-=recoil*11;}
 return unpack(a);
}
return {pose,sample,actions,fields};
});
