# OVERDRIVE 1.0.4 — Painted Motion

- Restores detailed illustrated characters and weapons; removes procedural 3D/vector figures from the active browser rendering path.
- Adds 6,120 whole-character animation frames. Each adjacent source-pose pair has twenty motion-compensated in-between pictures: 148 pictures per action clip and 168 per looping clip.
- Adds painted idle, run, jump/land, dodge, directional heavy and light-chain sequences. Existing multi-stage attacks combine these shared body clips with weapon-specific motion and personal powers.
- Adds a curved, articulated chain-whip swing and close, curled resting chain. Its 148 animation phases are raster-cached on demand.
- Corrects bow orientation, adds a moving draw/release string and visible forward arrow, and mirrors/aims it with the fighter.
- Uses source-pose grip anchors, separate paired-weapon grips, and higher nameplates to leave the larger illustrations visible.
- Adds painted texture samples to fire, water and stone attack constructs.
- Streams dense atlases with bounded concurrency/decoded caching and versioned long-lived asset caching. Source frames remain visible while a dense sheet loads.
- Preserves intentional heavy movement locks, attack rules, damage, unarmed starts, random pickups, shared aerial moves, ghost platforms, online matchmaking, bot mode and all fifty arenas.

## Art scope

Ember, Lyra, Bastion and Marin received new complete illustrated source-pose sheets. Generation reached its usage limit before Nyx's sheet completed. Nyx uses complete frames baked from his existing painted component art and constrained poses. His runtime images are whole-frame pictures, not live body-part assembly. The twenty additional images between poses are motion interpolation, not independently painted source drawings. Body clips are reused across weapons; this release does not claim thousands of individually drawn unique attacks.

## Validation

49 automated checks pass, including baked-image/frame checks, loaded sprite rendering, bow/whip behavior, shared aerial clips, combat and actual WebSocket matchmaking. Representative sheets and micro-frames were inspected offline. Interactive browser performance remains unverified.

## Deploy

Replace the project contents in GitHub, including all 45 WebP files in `public/assets/sprites` and all new scripts. Keep Render's existing Node Web Service settings (`npm ci --omit=dev`, `npm start`, `/health`). Refresh open game tabs after deploy.
