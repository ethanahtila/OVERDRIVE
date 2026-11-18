# OVERDRIVE 1.0.3 — Choreography

Completes the requested combat animation work while preserving intentional attack locks and combat rules.

- Full-body key-pose sequences for anticipation, contact, follow-through and recovery. The hips, chest, head, hands and feet move together instead of only moving the weapon arm.
- Weapon-specific thrusts, cuts, cleaves, uppercuts, slams, sweeps, flips, punches, hooks, kicks, bow draws, cannon recoil, casts and throws.
- Connected neck/head and spine/chest motion. Weapons remain at their hands, with paired equipment on both hands and a bowstring that follows the drawing hand.
- Character-specific ground choreography and animated fire, wind, stone, shadow and water constructs, with directional staging and windup cues.
- Three ground heavies for every fighter/weapon pairing: 225 armed moves plus 15 unarmed moves.
- Three aerial heavies per weapon, identical across characters. Air dodge into heavy creates a ghost platform and uses the corresponding personal ground heavy.
- Connecting the opener unlocks the finisher. A missed opener still performs the follow-up, which cannot unlock the finisher on its own.
- Fully animated connected Canvas fallback for browsers without WebGL; it no longer falls back to a mostly static character illustration.
- Main-fighter rendering batches its GPU readback once per frame. This reduces readback count; actual hardware performance has not been benchmarked.
- Animation Lab includes normal/slow motion, hit/miss branches and all weapon/direction/context combinations. Slow motion also slows the model's secondary animation.

## Preserved gameplay

Movement/jump locks during heavy attacks, including recovery, remain intentional and unchanged. No hitstop, movement unlock, camera changes, balance changes, new modes or matchmaking changes were added in this pass. Starts and respawns remain unarmed; mystery pickups remain random. All five fighters, fifteen weapons and fifty arenas remain available, with separate bot and real-player matchmaking.

## Validation

41 automated tests pass. A regression comparison matched 92,072 simulation ticks against 1.0.2 across all fifty arenas, excluding version and presentation-only state. Actual model geometry and twenty representative poses were rendered offline and visually inspected. Full interactive browser/WebGL playtesting was blocked by this environment; production browser performance and deployment are not claimed.

## Deploy

Upload all extracted project contents to your OVERDRIVE GitHub repository, including the new `public/motion.js`, `public/fighter2d.js` and rebuilt `public/fighters3d.js`. Keep Render as one Node Web Service: build `npm ci --omit=dev`, start `npm start`, health check `/health`. Refresh all game tabs after deployment. The included compiled bundle means production does not need development dependencies.
