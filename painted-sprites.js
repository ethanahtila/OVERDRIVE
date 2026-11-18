'use strict';
window.PaintedSprites=(()=>{
 const F=window.Fight,D=window.PaintedSpriteData,base=new Map(),atlases=new Map(),history=new Map(),active=new Set(),MAX_ATLASES=8,MAX_LOADS=3,waiting=[];let loading=0,clock=0,failed=false;
 const clamp=F.clamp,clipNames=['idle','run','jump','dodge','side','up','down','light'];
 // Grip anchors are authored with the source poses, not taken from the discarded 3D rig.
 const grip={
 idle:[[.78,.51],[.79,.51],[.8,.5],[.79,.5],[.8,.5],[.79,.5],[.79,.51],[.78,.51]],
 run:[[.75,.42],[.78,.43],[.77,.42],[.72,.44],[.75,.40],[.77,.44],[.76,.43],[.74,.42]],
 jump:[[.78,.53],[.77,.54],[.77,.44],[.79,.40],[.77,.39],[.77,.44],[.78,.55],[.78,.51]],
 dodge:[[.78,.5],[.76,.48],[.66,.53],[.5,.57],[.45,.45],[.72,.45],[.76,.53],[.79,.5]],
 side:[[.78,.49],[.78,.49],[.8,.35],[.96,.38],[.98,.39],[.98,.43],[.8,.51],[.78,.49]],
 up:[[.78,.49],[.78,.43],[.76,.35],[.73,.22],[.74,.14],[.77,.24],[.78,.42],[.78,.49]],
 down:[[.78,.49],[.72,.26],[.60,.12],[.68,.28],[.87,.65],[.8,.69],[.78,.51],[.78,.49]],
 light:[[.78,.49],[.92,.40],[.79,.48],[.94,.4],[.8,.47],[.75,.45],[.78,.48],[.78,.49]]};
 function loadBase(id){if(base.has(id))return base.get(id);const img=new Image(),entry={img,ready:false,promise:null};entry.promise=new Promise(resolve=>{img.onload=()=>{entry.ready=true;resolve(true)};img.onerror=()=>{failed=true;resolve(false)};img.src='./assets/sprites/'+id+'-source.webp?v='+F.VERSION;});base.set(id,entry);return entry;}
 function evict(){if(atlases.size<=MAX_ATLASES)return;for(const [key,e]of [...atlases].sort((a,b)=>a[1].at-b[1].at)){if(atlases.size<=MAX_ATLASES)break;if(!active.has(key)&&e.ready){atlases.delete(key);}}}
 function pump(){while(loading<MAX_LOADS&&waiting.length){const entry=waiting.shift();if(!atlases.has(entry.key)){entry.resolve(false);continue;}loading++;entry.img.onload=()=>{entry.ready=true;loading--;entry.resolve(true);pump();evict()};entry.img.onerror=()=>{entry.error=true;loading--;failed=true;entry.resolve(false);pump()};entry.img.src='./assets/sprites/'+entry.key+'.webp?v='+F.VERSION;}}
 function request(id,clip){const key=id+'-'+clip;let entry=atlases.get(key);if(entry){entry.at=++clock;return entry;}entry={key,img:new Image(),ready:false,error:false,at:++clock};entry.promise=new Promise(resolve=>entry.resolve=resolve);atlases.set(key,entry);waiting.push(entry);pump();return entry;}
 function choose(p,time=0){const a=p.attack;if(a){if(a.heavy){const st=F.activeStage(a);if(st){let clip=a.aim==='up'?'up':a.aim==='down'?'down':'side',t=clamp((a.age-st.start)/st.duration,0,1),u=t;if(st.role==='windup')u=t*.12;else if(st.role==='opener')u=.12+.88*t;else if(st.role==='follow')clip=st.pose==='slam'||st.pose==='chop'?'down':st.pose==='upper'?'up':'side';else if(st.role==='finisher')clip=p.character==='bastion'?'down':p.character==='lyra'||p.character==='ember'?'up':'side';else if(st.role==='recover'){clip=a.aim==='up'?'up':a.aim==='down'?'down':'side';u=1;}if(a.context==='air'){clip=a.aim==='up'?'up':a.aim==='down'?'down':'side';u=st.role==='windup'?t*.12:st.role==='recover'?1:.12+.88*t;}return {clip,progress:u,phase:st.role};}}
 const ranges=[[0,.32],[.27,.6],[.54,1]],r=ranges[a.combo||0];return {clip:'light',progress:r[0]+(r[1]-r[0])*clamp(a.age/a.duration,0,1),phase:'light'};}
 if(p.charging)return {clip:'side',progress:Math.min(.12,(p.charge||0)*.12),phase:'charge'};
 if(p.dodgeTime>0)return {clip:'dodge',progress:clamp((p.dodgeAge||0)/.19,0,1),phase:'dodge'};
 if(p.landSquash>0)return {clip:'jump',progress:.8+.2*(1-p.landSquash/.12),phase:'land'};
 if(!p.grounded)return {clip:'jump',progress:p.vy<0?.17+.28*clamp(1+p.vy/700,0,1):.45+.30*clamp(p.vy/800,0,1),phase:'air'};
 if(Math.abs(p.vx||0)>25)return {clip:'run',progress:((p.runPhase||0)%1+1)%1,phase:'run'};
 return {clip:'idle',progress:(time*.55)%1,phase:'idle'};
 }
 function gripAt(clip,progress,id){const points=D.anchors?.[id]?.[clip]||grip[clip],loop=D.clips[clip].loop,n=progress*(loop?8:7),i=Math.min(7,Math.floor(n)),j=loop?(i+1)%8:Math.min(7,i+1),t=n-i;return {x:points[i][0]+(points[j][0]-points[i][0])*t,y:points[i][1]+(points[j][1]-points[i][1])*t};}
 function imageFrame(id,choice){const meta=D.clips[choice.clip],entry=request(id,choice.clip);active.add(entry.key);const progress=clamp(choice.progress,0,1),frame=Math.min(meta.frames-1,Math.floor(progress*(meta.loop?meta.frames:meta.frames-1)));if(entry.ready)return {image:entry.img,sx:(frame%16)*160,sy:Math.floor(frame/16)*160,sw:160,sh:160,frame};const b=loadBase(id);if(b.ready){const key=Math.min(7,Math.floor(progress*(meta.loop?8:7)));return {image:b.img,sx:key*160,sy:meta.row*160,sw:160,sh:160,frame:key*21};}return null;}
 function beginFrame(players,time=0){active.clear();for(const [key,e]of history)if(time-e.time>1)history.delete(key);for(const p of players){loadBase(p.character);const choice=choose(p,time),e=request(p.character,choice.clip);active.add(e.key);}evict();}
 function draw(c,p,time=0){if(p.eliminated||p.respawn>0)return true;const choice=choose(p,time),frame=imageFrame(p.character,choice);if(!frame)return false;const size=116,footX=76/160*size,footY=.975*size,alpha=p.invuln>0?.68+Math.sin(time*23)*.12:1;
 c.save();c.translate(p.x,p.y);c.scale(p.facing||1,1);c.globalAlpha*=alpha;const last=history.get(p.id),token=(p.attack?.token||p.attack?.name||'')+':'+choice.clip+':'+choice.phase;if(last&&last.token!==token){last.previous=last.frame;last.changed=time;}const prior=last?.previous,blend=last?clamp((time-(last.changed||0))/.045,0,1):1;if(prior&&blend<1){c.globalAlpha*=1-blend;c.drawImage(prior.image,prior.sx,prior.sy,prior.sw,prior.sh,-footX,-footY,size,size);c.globalAlpha=alpha*blend;}if(p.hitFlash>0)c.filter='brightness(1.4)';c.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,-footX,-footY,size,size);c.filter='none';c.globalAlpha=alpha;
 const point=gripAt(choice.clip,choice.progress,p.character),hand={x:point.x*size-footX,y:point.y*size-footY},pose=F.pose(p,time),w=F.weapon(p.weapon),angle=(w.kind==='bow'?(p.attack?.aim==='up'?-Math.PI/2:p.attack?.aim==='down'?Math.PI/2:0):pose.weaponAngle)+(choice.clip==='dodge'?pose.rotation:0),ch=F.char(p.character),opts={p,time};
 if(w.kind==='fists'||w.kind==='dual'){window.Art?.weapon(c,p.weapon,hand.x,hand.y,angle,.56,ch.color,{...opts,single:true});window.Art?.weapon(c,p.weapon,hand.x-19,hand.y+7,angle-.25,.52,ch.color,{...opts,single:true,other:true});}else window.Art?.weapon(c,p.weapon,hand.x,hand.y,angle,.77,ch.color,opts);
 c.restore();history.set(p.id,{time,token,frame,changed:last?.changed||time,previous:blend<1?prior:null});if(history.size>24)history.delete(history.keys().next().value);return true;
 }
 // Load all base sheets once: complete painted pictures remain visible while dense clips stream.
 const ready=Promise.all(F.characters.map(c=>loadBase(c.id).promise));
 return {draw,beginFrame,choose,gripAt,ready,preload(id){loadBase(id);for(const clip of ['idle','run','jump','side'])request(id,clip);},get failed(){return failed;},stats(){return {atlases:atlases.size,decoded:[...atlases.values()].filter(e=>e.ready).length,loading,waiting:waiting.length};},reset(){history.clear();}};
})();
