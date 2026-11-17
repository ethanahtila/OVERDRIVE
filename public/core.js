(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.Fight=value;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const VERSION='1.0.0',DT=1/60,W=1440,H=900,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const characters=[
{id:'ember',name:'Ember',role:'The furnace duelist',power:'Ignition',color:'#ff9b64',dark:'#7d3b35',stats:[9,6,5,7],description:'Heavy strikes ignite. A brief burn keeps pressure on your opponent.',mechanic:'Burn damage after heavy hits',look:'knight'},
{id:'lyra',name:'Lyra',role:'The storm runner',power:'Slipstream',color:'#93dce6',dark:'#356b83',stats:[5,10,4,8],description:'Fast attacks and long dodges. Heavy strikes carry a gust of wind.',mechanic:'Faster recovery · stronger launch',look:'ranger'},
{id:'bastion',name:'Bastion',role:'The iron oath',power:'Stonebound',color:'#dfc698',dark:'#666d65',stats:[8,3,10,4],description:'Heavy armor absorbs knockback. Heavy strikes send out a tremor.',mechanic:'Knockback resistance · shockwaves',look:'guardian'},
{id:'nyx',name:'Nyx',role:'The dusk hunter',power:'Afterimage',color:'#c3a9f1',dark:'#51456c',stats:[6,8,5,9],description:'An echo repeats heavy hits after a short delay, rewarding precise spacing.',mechanic:'Delayed echo strike',look:'assassin'},
{id:'marin',name:'Marin',role:'The tide keeper',power:'Undertow',color:'#9ed6b6',dark:'#376e6f',stats:[6,7,8,6],description:'Heavy hits pull foes into a wave. Landing them restores a little damage.',mechanic:'Wave pull · modest self-healing',look:'monk'}
];
// Power, speed, defense, aerial control. Every weapon is available to every fighter.
const weapons=[
{id:'sabre',name:'Sabre',kind:'blade',reach:88,damage:7,force:390,cooldown:.32,weight:1,description:'Quick cuts and a sweeping finisher.'},
{id:'greatsword',name:'Greatsword',kind:'blade',reach:122,damage:12,force:510,cooldown:.65,weight:1.6,description:'Long, deliberate cleaves with enormous reach.'},
{id:'spear',name:'Spear',kind:'pole',reach:142,damage:8,force:390,cooldown:.47,weight:1.1,description:'Precise thrusts keep an opponent at arm’s length.'},
{id:'hammer',name:'War hammer',kind:'hammer',reach:90,damage:14,force:550,cooldown:.77,weight:1.8,description:'Short reach, crushing hits and vertical launches.'},
{id:'gauntlets',name:'Gauntlets',kind:'fists',reach:62,damage:5,force:310,cooldown:.23,weight:.8,description:'Close-range, rapid combinations.'},
{id:'bow',name:'Longbow',kind:'bow',reach:75,damage:6,force:330,cooldown:.48,weight:1,projectile:true,speed:850,description:'Fast arrows; charged volleys control the air.'},
{id:'scythe',name:'Scythe',kind:'scythe',reach:113,damage:9,force:390,cooldown:.52,weight:1.3,description:'Hooking arcs pull a target before launching.'},
{id:'cannon',name:'Hand cannon',kind:'cannon',reach:68,damage:10,force:490,cooldown:.68,weight:1.6,projectile:true,speed:650,description:'Heavy shells, recoil and explosive charged shots.'},
{id:'katars',name:'Twin katars',kind:'dual',reach:69,damage:5,force:320,cooldown:.25,weight:.8,description:'Twin blades turn mobility into relentless pressure.'},
{id:'orb',name:'Astral orb',kind:'orb',reach:70,damage:7,force:370,cooldown:.43,weight:1,projectile:true,speed:590,description:'Floating energy bolts with rising heavy shots.'},
{id:'axe',name:'Crescent axe',kind:'axe',reach:105,damage:12,force:510,cooldown:.66,weight:1.6,description:'Wide circular swings catch airborne approaches.'},
{id:'staff',name:'Bo staff',kind:'staff',reach:125,damage:7,force:360,cooldown:.36,weight:1,description:'Balanced reach and swift spinning strikes.'},
{id:'whip',name:'Chain whip',kind:'whip',reach:168,damage:6,force:350,cooldown:.57,weight:1.2,description:'The longest melee reach, with a whipping sweet spot.'},
{id:'rapier',name:'Rapier',kind:'rapier',reach:117,damage:6,force:370,cooldown:.3,weight:.9,description:'Narrow, fast lunges reward exact positioning.'},
{id:'chakram',name:'Chakrams',kind:'ring',reach:72,damage:6,force:360,cooldown:.39,weight:1,projectile:true,speed:700,description:'Returning rings threaten on the way out and back.'}
];
const themes=[
{id:'highlands',name:'Highlands',color:'#a8c8ca',accent:'#dfa778',names:['Crown of the Vale','The Last Watch','Cloudrest Bridge','Pilgrim’s Reach','Amber Overlook','The Broken Crown','Aerie Crossing','Windcarved Steps','The Silver Pass','Summit of Echoes']},
{id:'coast',name:'Coast',color:'#9bced0',accent:'#e8c69a',names:['Saltglass Harbor','Tideworn Sanctuary','Lighthouse Point','The Sunken Gate','Pearlwater Quay','Sirens’ Causeway','Whitecap Bastion','Coral Observatory','The Lantern Reef','Edge of the Blue']},
{id:'forest',name:'Wildwood',color:'#a8c19d',accent:'#d5bd82',names:['The Elder Hollow','Mosslight Garden','Rootbound Altar','Haven of Thorns','The Verdant Arch','Firefly Crossing','Silverleaf Court','The Quiet Grove','Ancient Canopy','Heart of the Wild']},
{id:'ruins',name:'Sanctum',color:'#b9acd0',accent:'#dfbed4',names:['Moonveil Temple','Astral Causeway','The Silent Archive','Fallen Observatory','Sanctum of Glass','Violet Meridian','The Shattered Dial','Nightfall Terrace','The Hollow Spire','Eclipse Cathedral']},
{id:'volcanic',name:'Ashlands',color:'#d99e8c',accent:'#ffb26b',names:['Furnace of Kings','Cinderfall Keep','The Obsidian Gate','Ashen Monastery','Emberglass Bridge','The Molten Ring','Blackstone Divide','Pyre of the Lost','The Copper Caldera','Dawn over Ash']}
];
const layouts=[
[[0,650,760],[ -285,495,175],[285,495,175]],
[[0,665,880],[0,460,220]],
[[0,665,700],[-290,520,165],[0,410,180],[290,520,165]],
[[-245,665,330],[245,665,330],[0,495,240]],
[[0,680,840],[-240,520,190],[200,400,170]],
[[0,675,640],[-340,525,190],[340,525,190],[0,380,180]],
[[-240,680,390],[240,600,390],[0,420,220]],
[[0,660,960],[-290,450,180],[290,450,180]],
[[0,695,700],[-270,540,170],[0,520,170],[270,540,170]],
[[-280,670,360],[280,670,360],[-180,465,210],[180,465,210]]
];
const maps=themes.flatMap((theme,t)=>theme.names.map((name,i)=>({id:t*10+i,name,theme:theme.id,themeIndex:t,layout:i,seed:(t+1)*493+i*773,platforms:layouts[i].map(([x,y,w],j)=>({x:W/2+x-w/2+(j?Math.sin((t+1)*(i+1)+j)*22:0),y:y+(j?t*5:0),w:w-(j?t*6:0),h:j?20:42,solid:j===0||i===3&&j===1||i>=6&&j===1})),spawnY:270})));
const char=id=>characters.find(c=>c.id===id)||characters[0],weapon=id=>weapons.find(w=>w.id===id)||weapons[0];
function rng(seed){let a=seed|0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function normalizeInput(i={}){return {left:!!i.left,right:!!i.right,up:!!i.up,down:!!i.down,jump:!!i.jump,dodge:!!i.dodge,light:!!i.light,heavy:!!i.heavy,interact:!!i.interact};}
function create(config={}){const random=rng(config.seed||28712),map=maps[Number(config.map)||0]||maps[0];const state={version:VERSION,seed:config.seed||28712,tick:0,time:0,duration:config.duration||240,phase:config.countdown?'countdown':'playing',countdown:config.countdown||0,map:map.id,players:[],shots:[],effects:[],pickups:[],events:[],nextId:1,winner:null,ended:false};
 const entries=config.players||[{id:'you',name:'You',character:'lyra',weapon:'sabre'},{id:'bot',name:'Bot',bot:true}];
 entries.forEach((q,i)=>{const ci=q.character==='random'||!q.character?characters[Math.floor(random()*5)].id:char(q.character).id,wi=q.weapon==='random'||!q.weapon?weapons[Math.floor(random()*15)].id:weapon(q.weapon).id;state.players.push({id:String(q.id??i),name:String(q.name||'Fighter').slice(0,20),character:ci,weapon:wi,bot:!!q.bot,botLevel:clamp(Number(config.botLevel)||2,1,3),x:W/2+(i-(entries.length-1)/2)*150,y:map.spawnY,vx:0,vy:0,facing:i%2?-1:1,damage:0,stocks:3,eliminated:false,grounded:false,jumps:2,attackCD:0,attack:null,dodgeCD:0,dodgeTime:0,stun:0,invuln:1.8,respawn:0,burn:0,burnSource:null,charge:0,charging:false,kos:0,falls:0,dealt:0,lastHit:null,previous:{},ai:{jump:0,dodge:0,heavy:0,think:0,dir:0}});});return state;}
function event(s,type,data={}){s.events.push({id:s.nextId++,type,...data});if(s.events.length>40)s.events.shift();}
function effect(s,type,x,y,color,extra={}){s.effects.push({id:s.nextId++,type,x,y,color,life:.38,max:.38,...extra});if(s.effects.length>180)s.effects.shift();}
function botInput(s,p){const foes=s.players.filter(q=>q.id!==p.id&&!q.eliminated&&q.respawn<=0);if(!foes.length)return {};const t=foes.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0],a=p.ai;a.think-=DT;a.jump=Math.max(0,a.jump-DT);a.dodge=Math.max(0,a.dodge-DT);const map=maps[s.map],w=weapon(p.weapon),dist=Math.abs(t.x-p.x),dy=t.y-p.y,below=p.y>710,nearEdge=p.x<310||p.x>1130;let left=t.x<p.x-35,right=t.x>p.x+35;
 if(below||p.y>590&&nearEdge){left=p.x>W/2+35;right=p.x<W/2-35;}
 const aggressive=p.botLevel===3||s.tick%180<100;let jump=false;if(a.jump===0&&p.jumps>0&&(below||dy< -75||!p.grounded&&p.vy>170&&p.y>580)){jump=true;a.jump=.42;}
 // Navigate onto a ledge rather than running forever into its side.
 if(p.grounded&&dist>110&&s.tick%110<2){jump=true;a.jump=.5;}
 const reach=w.projectile?640:w.reach+35,close=dist<reach&&Math.abs(dy)<(w.projectile?100:85);const dodge=a.dodge===0&&p.dodgeCD===0&&t.attack&&dist<180&&p.botLevel>1;if(dodge)a.dodge=1.3;
 const heavy=close&&aggressive&&s.tick%150>105&&s.tick%150<133;return {left,right,up:dy< -65,down:dy>75,jump,dodge,light:close&&!heavy&&(p.botLevel>1||s.tick%45<5),heavy};}
function hit(s,source,target,dmg,force,dx,dy,heavy=false,power=true){if(target.eliminated||target.respawn>0||target.invuln>0||target.dodgeTime>0)return false;const c=char(source.character),def=char(target.character).stats[2],amount=dmg*(.8+c.stats[0]*.04);target.damage=Math.min(999,target.damage+amount);source.dealt+=amount;target.lastHit=source.id;const mult=(.72+target.damage/105)*(1.16-def*.035),mag=Math.hypot(dx,dy)||1;target.vx=dx/mag*force*mult;target.vy=dy/mag*force*mult;target.grounded=false;target.stun=clamp(.12+amount*.012,.12,.48);target.charging=false;target.charge=0;
 if(heavy&&power){if(c.id==='ember'){target.burn=2.6;target.burnSource=source.id;}if(c.id==='lyra'){target.vx*=1.16;target.vy*=1.12;}if(c.id==='marin'){source.damage=Math.max(0,source.damage-4);target.vx=target.vx*.65+(source.x-target.x)*.8;}if(c.id==='nyx')s.shots.push({id:s.nextId++,owner:source.id,x:target.x,y:target.y-25,vx:0,vy:0,r:62,damage:4,force:280,life:.52,delay:.28,hit:[],kind:'echo',color:c.color,heavy:false});}
 effect(s,'impact',target.x,target.y-26,c.color,{heavy,life:.32,max:.32});event(s,'hit',{source:source.id,target:target.id,heavy,x:target.x,y:target.y-28});return true;}
function strike(s,p,heavy,charge,input){const w=weapon(p.weapon),c=char(p.character),up=input.up,down=input.down&&!p.grounded,dirY=up?-1:down?1:0,dirX=dirY===0?p.facing:p.facing*.22,mult=heavy?1.6+charge*.6:1;p.attackCD=w.cooldown*(heavy?1.7:1)*(c.id==='lyra'?.84:1);p.attack={heavy,age:0,duration:heavy?.4:.24,hit:[],dirX,dirY,charge,weapon:w.id,reach:w.reach*(heavy?1.22:1)};event(s,'swing',{source:p.id,heavy,weapon:w.id});
 if(w.projectile){const speed=w.speed*(heavy?1.05:1),count=heavy&&w.kind==='bow'?3:1;for(let i=0;i<count;i++){const angle=(dirY?Math.atan2(dirY,dirX):p.facing>0?0:Math.PI)+(i-(count-1)/2)*.14;s.shots.push({id:s.nextId++,owner:p.id,x:p.x+p.facing*32,y:p.y-34,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r:w.kind==='cannon'?heavy?20:13:w.kind==='orb'?heavy?17:11:8,damage:w.damage*mult,force:w.force*(heavy?1.35:1),life:w.kind==='ring'?1.4:1.5,hit:[],kind:w.kind,color:c.color,heavy,origin:p.x,returning:false});}if(w.kind==='cannon')p.vx-=p.facing*(heavy?155:70);}
 if(heavy&&c.id==='bastion')for(const dir of [-1,1])s.shots.push({id:s.nextId++,owner:p.id,x:p.x+dir*20,y:p.y-8,vx:dir*360,vy:0,r:24,damage:5,force:330,life:.7,hit:[],kind:'tremor',color:c.color,heavy:false});
}
function attackHits(s,p){const a=p.attack;if(!a||a.age<.045||a.age>.2||weapon(a.weapon).projectile)return;const w=weapon(a.weapon),cx=p.x+a.dirX*a.reach*.5,cy=p.y-30+a.dirY*a.reach*.55;for(const q of s.players){if(q.id===p.id||a.hit.includes(q.id))continue;const dx=q.x-cx,dy=q.y-30-cy;const horizontal=a.dirY===0,rx=horizontal?a.reach*.63:48,ry=horizontal?(w.kind==='axe'?80:50):a.reach*.7;if((dx*dx)/(rx*rx)+(dy*dy)/(ry*ry)>1)continue;const dirX=w.kind==='scythe'&&!a.heavy?-p.facing:a.dirX||p.facing*.3,dirY=a.dirY|| (w.kind==='hammer'?-.95:-.5);if(hit(s,p,q,w.damage*(a.heavy?1.6+a.charge*.6:1),w.force*(a.heavy?1.3+a.charge*.25:1),dirX,dirY,a.heavy))a.hit.push(q.id);}}
function eliminate(s,p){const killer=s.players.find(q=>q.id===p.lastHit&&!q.eliminated);if(killer)killer.kos++;p.stocks--;p.falls++;p.damage=0;p.burn=0;p.charge=0;p.charging=false;p.attack=null;p.stun=0;p.vx=p.vy=0;p.respawn=1.25;p.eliminated=p.stocks<=0;effect(s,'ko',clamp(p.x,80,W-80),clamp(p.y,80,H-50),char(p.character).color,{life:1,max:1});event(s,'ko',{target:p.id,killer:killer?.id||null});}
function step(s,inputs={}){if(s.ended)return;s.tick++;s.events=s.events.filter(e=>e.id>s.nextId-70);s.effects.forEach(e=>e.life-=DT);s.effects=s.effects.filter(e=>e.life>0);if(s.phase==='countdown'){s.countdown-=DT;if(s.countdown<=0){s.phase='playing';event(s,'start');}return;}s.time+=DT;const map=maps[s.map];for(const p of s.players){if(p.eliminated)continue;if(p.respawn>0){p.respawn-=DT;if(p.respawn<=0){p.x=W/2+(s.players.indexOf(p)-(s.players.length-1)/2)*110;p.y=240;p.invuln=2;p.jumps=2;p.lastHit=null;}continue;}
 const i=normalizeInput(p.bot?botInput(s,p):inputs[p.id]);const previous=p.previous;p.previous=i;p.attackCD=Math.max(0,p.attackCD-DT);p.dodgeCD=Math.max(0,p.dodgeCD-DT);p.dodgeTime=Math.max(0,p.dodgeTime-DT);p.invuln=Math.max(0,p.invuln-DT);p.stun=Math.max(0,p.stun-DT);if(p.burn>0){p.burn-=DT;p.damage+=DT*2.4;}if(p.attack){p.attack.age+=DT;if(p.attack.age>p.attack.duration)p.attack=null;}
 const c=char(p.character),speed=250+c.stats[1]*13,air=c.stats[3]/10;let direction=(i.right?1:0)-(i.left?1:0);if(p.stun<=0){if(direction)p.facing=direction;if(i.dodge&&!previous.dodge&&p.dodgeCD===0){p.dodgeTime=.22;p.dodgeCD=c.id==='lyra'?1.05:1.45;p.vx=(direction||p.facing)*650;p.vy*=.6;effect(s,'dodge',p.x,p.y-30,c.color,{life:.25,max:.25});event(s,'dodge',{source:p.id});}
 if(p.dodgeTime<=0){const target=direction*speed*(p.charging?.38:1),acc=p.grounded?22:8+air*5;p.vx+=(target-p.vx)*Math.min(1,acc*DT);if(i.jump&&!previous.jump&&p.jumps>0){p.vy=-(p.jumps===2?600:550);p.jumps--;p.grounded=false;effect(s,'jump',p.x,p.y,c.color,{life:.35,max:.35});event(s,'jump',{source:p.id});}
 if(i.heavy&&p.attackCD<=0){p.charging=true;p.charge=Math.min(1,p.charge+DT/1.0);}if(!i.heavy&&p.charging){strike(s,p,true,p.charge,i);p.charge=0;p.charging=false;}else if(i.light&&!i.heavy&&!p.charging&&p.attackCD<=0)strike(s,p,false,0,i);
 if(i.interact&&!previous.interact){const k=s.pickups.find(k=>Math.hypot(k.x-p.x,k.y-p.y+20)<80);if(k){p.weapon=k.weapon;s.pickups=s.pickups.filter(q=>q.id!==k.id);effect(s,'pickup',p.x,p.y-30,c.color);event(s,'pickup',{source:p.id,weapon:k.weapon});}}
 }}else p.vx*=.994;
 const oldY=p.y;p.vy=Math.min(980,p.vy+1500*DT);p.x+=p.vx*DT;p.y+=p.vy*DT;p.grounded=false;for(const f of map.platforms){if(p.vy>=0&&oldY<=f.y+4&&p.y>=f.y&&p.x+17>f.x&&p.x-17<f.x+f.w&&!(i.down&&!f.solid)){p.y=f.y;p.vy=0;p.grounded=true;p.jumps=2;}}
 if(p.x< -130||p.x>W+130||p.y>H+120||p.y< -240)eliminate(s,p);
 }
 for(const p of s.players)if(!p.eliminated&&p.respawn<=0)attackHits(s,p);
 for(const shot of s.shots){shot.life-=DT;if(shot.delay>0){shot.delay-=DT;continue;}const owner=s.players.find(p=>p.id===shot.owner);if(!owner)continue;if(shot.kind==='ring'&&shot.life<.7){shot.returning=true;shot.vx+=(owner.x-shot.x)*DT*20;shot.vy+=(owner.y-28-shot.y)*DT*20;}shot.x+=shot.vx*DT;shot.y+=shot.vy*DT;if(shot.kind==='cannon')shot.vy+=180*DT;for(const q of s.players){if(q.id===shot.owner||shot.hit.includes(q.id)||Math.hypot(q.x-shot.x,q.y-28-shot.y)>shot.r+25)continue;if(hit(s,owner,q,shot.damage,shot.force,shot.vx||owner.facing*200,shot.kind==='tremor'?-180:shot.vy-180,shot.heavy,shot.kind!=='echo')){shot.hit.push(q.id);if(!['ring','echo','tremor'].includes(shot.kind))shot.life=0;}}}
 s.shots=s.shots.filter(q=>q.life>0&&q.x> -170&&q.x<W+170&&q.y<H+150);if(s.tick%540===0&&s.pickups.length<4){const random=rng(s.seed+s.tick),f=map.platforms[Math.floor(random()*map.platforms.length)];s.pickups.push({id:s.nextId++,weapon:weapons[Math.floor(random()*15)].id,x:f.x+f.w*(.2+random()*.6),y:f.y-22,life:24});}for(const k of s.pickups)k.life-=DT;s.pickups=s.pickups.filter(k=>k.life>0);
 const alive=s.players.filter(p=>!p.eliminated);if(alive.length<=1||s.time>=s.duration){s.ended=true;s.phase='ended';const sorted=[...s.players].sort((a,b)=>b.stocks-a.stocks||a.damage-b.damage||b.kos-a.kos);const tied=sorted.length>1&&sorted[0].stocks===sorted[1].stocks&&Math.abs(sorted[0].damage-sorted[1].damage)<.001&&sorted[0].kos===sorted[1].kos;s.winner=alive.length&&!tied?sorted[0].id:null;event(s,'end',{winner:s.winner});}
}
return {VERSION,DT,W,H,characters,weapons,themes,maps,char,weapon,rng,clamp,normalizeInput,create,step,botInput,hit,strike};
});
