# OVERDRIVE 1.0.2 — Impact

This release removes the cropped-limb fighter assembly from the active renderer. Complete connected 3D models are animated on the same 2D combat plane, with constrained limb placement and attached, animated weapons. All animation is evaluated continuously. Filled character-specific fire, wind, stone, shadow and water abilities replace the reliance on lines alone.

There are 225 armed ground heavies: side, up and down for all five characters and fifteen weapons. Their opener can unlock a finisher. If it misses, the follow-up still plays and can hit, but it cannot unlock the finisher. High damage increases the finishing launch.

Normal air heavies use 45 shared weapon/direction attacks with no personal elemental finisher. An air dodge followed by heavy within 0.26 seconds creates a temporary ghost platform and uses the exact personal ground signature instead. One gravity cancel is allowed before a real landing; the artificial platform does not reset jumps or provide another cancel.

Animation Lab is available from the weapon field guide. It previews fighters, weapons, directions, light/ground/air/cancel attacks, a simulated opener result, replay and slow motion. Its forced opener result is only a preview feature; live matches use actual collision and server authority.

## Update on Render

Commit the **entire updated project**, including the new **public/fighters3d.js**, **public/combat-fx.js**, **public/move-lab.js**, **src/fighter-renderer.js**, the modified HTML/core/app/art/styles/server files, package files and license. The compiled renderer bundle is already included. Keep the existing Node 24 Web Service, one instance, `npm ci --omit=dev`, `npm start` and `/health` configuration.

Wait for a completed deployment, then refresh every player's tab. The menu and health endpoint should report **1.0.2**. No extra Render service, GPU server, database, paid game library or account reset is needed. Old unused rig-image files can remain in an existing repository; the new renderer no longer loads them. This ZIP does not deploy itself.

Full animation needs desktop WebGL 2/hardware acceleration. A visible warning explains when basic whole-character artwork is used as a compatibility fallback.

Tests cover combat branches, shared air moves, gravity cancels, more than 3,000 connected model poses, existing game rules and online/client flows. Offline model renders were inspected; live Render and full manual browser/WebGL playtesting are not claimed.
