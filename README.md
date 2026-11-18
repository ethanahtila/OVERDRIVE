# OVERDRIVE — 1.0.3 · Choreography

A desktop platform fighter with movement and combat on a **2D plane**. This update completes the combat animation pass with full-body choreography, attached weapons, connected neck/spine motion, and an animated Canvas fallback. Intentional attack movement locks and combat timing are preserved.

Keep this project separate from CU-Escape.

## Deploy or play

For Render, upload the project contents to the OVERDRIVE repository and use the included `render.yaml`, or follow **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)**. Keep the existing single-instance **Node Web Service** configuration:

- Build: `npm ci --omit=dev`
- Start: `npm start`
- Health check: `/health`
- Node: 24

The compiled graphics bundle is included. Render does not need a GPU, Blender, Three.js development dependencies or a separate graphics build: character rendering happens in players' browsers. HTTPS uses WSS on the same host. This ZIP does not publish itself.

For local play, install Node 24, run `npm ci` and `npm start`, then open http://localhost:3000. Bot mode also runs by opening `public/index.html` directly, provided the extracted public folder remains intact. Desktop WebGL 2 with hardware acceleration enables the 3D character renderer. Browsers without it use fully animated connected Canvas figures with the same body/weapon timelines. A notice identifies that fallback. Both renderers include attack animations; neither uses disassembled image limbs.

## Review the animations

Click **ANIMATION LAB** above the weapon field guide. Select any of the five fighters, fifteen weapons (or unarmed), direction and attack type:

- Ground heavy
- Shared aerial heavy
- Dash-air / ghost-platform ground heavy
- Shared light attacks

Use slow motion, replay and the simulated opener-hit checkbox to inspect the finish and miss branches. The preview deliberately simulates the opener result so it is an animation inspection tool, not evidence that a particular opening always connects in a real match. Gameplay still requires a real hit. Normal speed is the default.

## Controls

| Input | Action |
| --- | --- |
| A / D | Move left / right |
| W / S | Aim attacks up / down |
| S | Drop through thin platforms |
| Space | Jump; release and press again for an air jump |
| Shift | Dash/dodge; use W/S for vertical air-dodge direction |
| Left mouse | Light attacks; hold to chain |
| Right mouse | Hold to charge, release for heavy |
| W + heavy | Up heavy |
| S + heavy | Down heavy |
| Aerial Shift, then heavy | Gravity cancel: ghost platform and ground signature |
| E | Collect a mystery weapon pickup |
| Escape | Pause bots or open the online menu |

Press heavy during the aerial dodge or within **0.26 seconds** of it to create the ghost platform. Starting heavy at the same time as Shift also works. This cancels the dodge, visibly places a temporary platform beneath you, and selects the **same character-specific ground move** that would be used on a real floor. It is available once before landing on a real platform. It does not refresh your jumps or another gravity cancel. Charging is bounded and releases automatically after a full hold.

## Heavy attacks and hit confirmation

Each fighter has **side, up and down ground heavies for every weapon**: **225 armed ground signatures**, plus fifteen unarmed ground variants. Their animated phases drive the character, held weapon, hit volumes and projectiles together.

Ground signatures have an anticipation, an opener, an unconditional follow-up, a hit-confirmed finisher and recovery. **Only connecting the opener unlocks the finisher.** The follow-up can still hit after a missed opener, but that later hit does not enable the finisher. Connecting openers can gather a target into the follow-up; the final blow releases it with damage-scaled knockback. Interrupting the attacker ends the sequence. This is a confirmed combat sequence, not a passive effect added to one large hit.

Character-specific animation language:

| Fighter | Abilities |
| --- | --- |
| Ember | Flame fists, dragon-shaped fire, phoenix forms and erupting columns |
| Lyra | Sweeping wind forms, feathered gusts, crossing rushes and cyclones |
| Bastion | Orbiting stone, armored strikes, raised rocks and groundbreaks |
| Nyx | Phase steps, a full animated shadow double and echo weapons |
| Marin | Gathering currents, flowing movement and filled tidal crests |

The weapon and direction change the actual attack sequence. A blade's cut, a spear thrust, a hammer descent, a gauntlet rush, a bow volley and a chain lash do not share one generic swing animation.

### Aerial attacks

A normal airborne heavy uses a **shared weapon-specific aerial moveset**. Side, up and down variants are identical across all five characters holding that weapon: **45 shared armed aerial attacks**, plus three unarmed variants. They have common timing, geometry, movement and base damage, and do not use character elemental finishers. Defender stats can still affect the resulting knockback. Upward aerial moves have a bounded recovery allowance.

Ground and gravity-cancel heavies use the personal signature; ordinary air heavies use the shared moveset. Light attacks remain shared across characters for the held weapon, with weapon-specific animations and direction.

## Characters, weapons and modes

Five fighters: Ember, Lyra, Bastion, Nyx and Marin. Every fighter can use every weapon.

Fifteen weapons: Sabre, Greatsword, Spear, War hammer, Gauntlets, Longbow, Scythe, Hand cannon, Twin katars, Astral orb, Crescent axe, Bo staff, Chain whip, Rapier and Chakrams.

Everyone starts and respawns **unarmed**. Pickups all have the same mystery appearance and reveal a random weapon only when collected. The armory is a field guide, not a starting loadout selector. In online matches only the server assigns the result. Bots follow the same rule.

VS BOTS stays local and separate from online queues. It supports duels or four-fighter free-for-all and three bot behavior levels. ONLINE has separate real-player duel and four-player queues with no bot backfill. Random character selection remains available. Fifty selectable arenas remain across five regions. Three stocks and four minutes; timeouts compare stocks, damage and KOs, with exact ties drawing.

## Animation and technical scope

Authored full-body key poses are interpolated continuously through anticipation, contact, follow-through and recovery. The pelvis, ribcage, head, both hands and both feet all participate. Complete smooth meshes are posed with constrained limbs, attached weapons, continuous stage-to-stage transitions, running cycles, jumping, rolling, breathing and animated cloth. The neck follows the actual animated head, and the torso follows the spine. Hit recoil and flashes are presentation only, and do not add impact pauses or change combat timing. Paired weapons follow both hands; bowstrings draw, chain links flex and orb rings rotate. The body and weapon evaluate fresh poses at render time. This is continuous animation, not a promise of millions of downloaded sprite frames.

The models are original procedural, stylized fantasy models. They are not scanned people, motion capture or photorealistic character assets. An atlas batches the main fighters into one GPU-to-Canvas transfer per rendered frame instead of performing a separate readback for each fighter. Actual performance depends on the browser and graphics hardware; no measured frame-rate improvement is claimed. The older environment paintings remain. Filled fire/wind/water/stone/shadow constructs and impact animation complement the models; trails are supplemental.

The server retains 60-step authoritative combat, about 20 snapshots per second, bounded sequenced inputs and one-process matchmaking. Local input prediction and render interpolation remain. New hit confirmation and ghost-platform state travel through the existing snapshots. Real network latency remains; this release does not implement rollback or reconnect/resume. Server restarts end matches and queues. No database or account migration is needed.

The browser bundle is self-contained and has no CDN dependency. It includes Three.js under its MIT license; see `public/assets/THREE-LICENSE.txt`. Its editable source is `src/fighter-renderer.js`. To edit/rebuild the renderer locally:

```sh
npm ci
npm run build:avatars
npm test
```

Commit `public/fighters3d.js` with renderer-source changes. Production installation intentionally omits the development build tools.

## Verification and limits

41 automated tests pass. Coverage includes all 225 ground animation curves, exact shared aerial poses, joint continuity at phase boundaries, weapons attached across more than 3,000 3D poses, all 240 armed/unarmed ground sequences in the Canvas fallback, batched renderer orchestration, hit/miss finisher logic, ghost platforms, all fifty arenas, actual WebSocket matchmaking and emulated client/Animation Lab flows.

A separate regression comparison matched the previous release's gameplay state for 92,072 simulation ticks across all fifty arenas, excluding version and new presentation fields. The intended heavy-attack movement/jump lock, including recovery, remains intact. Physics, attacks, pickup rules, damage and bot behavior are preserved.

Actual model geometry and twenty representative move poses were rendered offline and visually inspected. A headless Chromium launch was attempted but the environment prevented it from starting; an interactive browser/WebGL playtest is not claimed. Renderer batching is tested with a mocked graphics backend, not a GPU performance benchmark. Public Render deployment is not performed by this ZIP.

See `UPDATE_1.0.3.md` for this update. The file name remains `OVERDRIVE.zip`.
