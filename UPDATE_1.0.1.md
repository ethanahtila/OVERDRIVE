# OVERDRIVE 1.0.1 — Momentum

Everyone now starts unarmed. Identical mystery pickups reveal one of fifteen random weapons only when collected. The armory is a reference, not a starting equipment selector. Bots follow the same pickup rule. Respawns are unarmed.

The heavy system is rebuilt around 75 named character/weapon recipes with side/up/down variants and five unarmed signatures. Their staged actor motion, hit volumes, projectiles and articulated weapon poses replace generic large swings and passive on-hit effects. Normal light moves remain shared across characters for the held weapon.

Movement adds fast acceleration/reversals, air control, variable-height jumping, coyote time, jump buffering, directional air dodges and late-heavy recovery cancels. Art uses independently textured, continuously blended body joints, new detailed weapon artwork, cloth movement and signature trails. The original backgrounds and fifty arenas remain.

Online inputs are sequenced, acknowledged and predicted locally, with server authority retained for equipment, hits and match results. Render interpolation and remote smoothing reduce visible stepping. There is no rollback or claim of zero-latency networking.

Commit **all changed files**, including `public/core.js`, `public/app.js`, `public/art.js`, `public/style.css`, `public/index.html`, `public/assets/rig.webp`, `public/assets/weapons.webp`, `server.cjs` and the package version files. Keep `render.yaml` and the existing one-instance Node service settings. Wait for Render's completed deployment and refresh every player's tab. Health should report **1.0.1**. No database or account migration is required. The package does not deploy itself.

Automated checks cover all 75 armed signatures, mystery pickup rules, prediction with delayed snapshots and end-to-end client/server matchmaking. Manual public-network balance testing remains necessary.
