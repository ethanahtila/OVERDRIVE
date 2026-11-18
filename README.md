# OVERDRIVE — 1.0.4 · Painted Motion

A desktop platform fighter on a **2D plane**, with the detailed illustrated character style restored. The game draws complete painted sprite pictures rather than the procedural 3D figures from the previous release. CU-Escape is separate.

## Deploy on Render

Upload all extracted project contents to the OVERDRIVE GitHub repository. Include the **entire** `public/assets/sprites` folder and the three new browser scripts: `sprite-data.js`, `painted-sprites.js`, `weapon-motion.js`. Keep these Render settings:

| Setting | Value |
| --- | --- |
| Service | Node Web Service, one instance |
| Build | `npm ci --omit=dev` |
| Start | `npm start` |
| Health check | `/health` |
| Node | 24 |

The game uses same-host HTTPS/WSS. Compiled/baked graphics are included: Render does **not** need FFmpeg, Sharp, Blender, WebGL or a graphics build. Refresh players' tabs after redeployment. This ZIP does not deploy to your account itself.

For local play, use Node 24, `npm ci`, `npm start`, then http://localhost:3000. Opening `public/index.html` directly also supports bot play when its adjacent files/folders remain intact. Online play requires the Node server.

## Painted frame animation

The production browser renderer now uses whole illustrated sprite frames:

- 320 source poses across five fighters and eight clips: idle, run, jump/land, dodge, side heavy, up heavy, down heavy and light chain.
- **20 motion-compensated in-betweens between each adjacent source pose.** These are interpolated pictures, not 20 additional independently painted drawings.
- 148 frames for each non-looping clip; 168 for each idle/run loop.
- **6,120 stored animation frames** in forty atlases, plus five compact source sheets.
- Existing attack timelines select and combine these body clips with the held weapon and character's fire, wind, stone, shadow or water ability. The body clips are reused across weapons; this is not 225 independently hand-painted animation sets.
- The original detailed roster artwork is used for selection portraits and as the last fallback while animation assets load.

Four new complete-pose sheets were generated in the original painted style: Ember, Lyra, Bastion and Marin. Image generation reached its usage limit on Nyx. Nyx's complete source frames were therefore baked offline from the existing detailed painted character-part assets, with constrained limbs and authored full-body poses. His frames are painted-texture composites, not a newly generated whole-body sheet. Runtime draws the complete baked pictures and never assembles his body from parts.

The main dense sheets load on demand, with at most three concurrent loads and a bounded decoded atlas cache. Versioned image URLs use long-lived caching to avoid repeated downloads when clips leave the decoded cache. On a first visit, original source poses can appear briefly while a dense atlas loads. The illustrated sheets are heavier downloads than the old simple models; browser and connection performance still need real-device evaluation.

## Weapons and attacks

The original detailed weapon artwork is restored. The chain whip has an articulated chain with a propagating curved swing, a close hanging/curled resting shape, a flexible snap and recovery; it is no longer rendered as one rigid sword-like picture. Its 148 animation phases are rasterized into a bounded frame cache as needed.

The bow's diagonal painting is normalized so its arc faces the shot and its string sits behind the grip. The string draws and releases, and the arrow points forward, or up/down for directed attacks. Facing left mirrors it correctly. Paired gauntlets/katars draw one item at each grip.

Ground heavies still have a windup, opener, follow-up, conditional finisher and recovery. **Only the opener hit enables the finisher.** A follow-up can hit after a missed opener but cannot unlock the final launch. Launch grows with damage. There are 225 armed ground signatures (five characters × fifteen weapons × three directions), plus fifteen unarmed variants.

Ordinary aerial heavies remain shared per weapon/direction across characters. An air dodge followed by heavy within **0.26 seconds** creates a ghost platform and selects the personal ground heavy. It is available once per real landing and does not restore jumps.

**Intentional movement/jump locks during heavy attacks, including recovery, are preserved.** This is a visual update, not a balance or movement-rule change.

## Controls

| Input | Action |
| --- | --- |
| A / D | Left / right |
| W / S | Aim up / down |
| S | Drop through thin platforms |
| Space | Jump, then press again for an air jump |
| Shift | Dash/dodge; W/S directs air dodges |
| Left click | Light attack; hold to chain |
| Right click | Hold to charge, release for heavy |
| Aerial Shift, then heavy | Ghost platform / ground signature |
| E | Collect a mystery weapon |
| Escape | Pause bots or open online match menu |

Everyone starts and respawns unarmed. Pickups all look identical and reveal a random weapon only when collected. The server alone assigns online weapon rewards.

Five fighters, fifteen universal weapons and fifty arenas remain. VS BOTS is local and separate from online queues. ONLINE supports real-player duels or four-player free-for-all, with no bot backfill. Three stocks, four minutes; timeout compares stocks, damage and KOs.

## Animation Lab

Click **ANIMATION LAB** above the weapon field guide. Select fighter, weapon, direction and ground/air/ghost-platform/light context. Replay at normal speed or slow motion, and toggle the simulated opener result to inspect hit/miss branches. The simulated result is for visual inspection; actual matches require a real hit.

## Validation and limits

49 automated tests pass. They cover all shipped atlas dimensions and frame totals, changing baked in-between pictures, the image-loaded sprite path, memory-cache bounds, shared aerial clips, flexible whip phases, bow orientation, combat/ghost-platform rules, all fifty arenas, WebSocket matchmaking and emulated full-client flows. Source sheets and representative in-between frames were visually inspected offline.

Interactive browser playtesting and hardware/network performance benchmarks are not claimed. The environment prevented the previously attempted Chromium launch; the new rendering path is tested with a Canvas/image fixture and actual baked image files. No rollback, reconnect/resume, account system or multi-instance matchmaking is added. Server restarts still end matches/queues.

## Rebuilding graphics (optional, not needed to deploy)

The source artwork is in `art-source/`. To rebuild the dense sprite atlases, install FFmpeg with `minterpolate` and `libwebp`, then run:

```sh
npm run build:sprites
```

The script motion-interpolates both color and alpha, packs forty atlases and writes `public/sprite-data.js`. To rebuild only one fighter, set `SPRITE_CHARACTERS=ember` (or another fighter ID). The optional `scripts/bake-painted-nyx.cjs` uses Sharp to reconstruct Nyx's source sheet from preserved painted components. Sharp is an optional offline tool and is not required by the deployed game.

The older 3D renderer source, compiled bundle and associated regression tests are retained as historical development assets; the production HTML does not load either that renderer or the simple vector character fallback. See `UPDATE_1.0.4.md` for this release and `ARTWORK.md` for art provenance.
