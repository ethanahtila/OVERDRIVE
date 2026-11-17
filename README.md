# OVERDRIVE — 1.0.1 · Momentum

An original desktop 2D platform fighter. Keep this project separate from CU-Escape. This update replaces the original stiff cutout motion and generic heavy swings with articulated animation, responsive movement and staged character/weapon techniques.

## Play or deploy

For bot play, extract the ZIP and open `public/index.html` in a desktop browser. Keep all scripts and the `public/assets` folder together. Bot mode runs locally without matchmaking.

For the website and online multiplayer, deploy the included `render.yaml` as a **Render Node Web Service**, or follow **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)**. Use `npm ci --omit=dev` to build, `npm start` to start and `/health` for the health check. Keep one running instance because matchmaking is held in memory.

For local server testing, install Node 24 and run:

```sh
npm ci
npm start
```

Then open http://localhost:3000. A hosted HTTPS site automatically connects to WSS at the same hostname. This ZIP does not publish or update the live service itself.

## Controls

| Input | Action |
| --- | --- |
| A / D | Move left / right |
| W / S | Aim attacks up / down |
| S | Drop through thin platforms |
| Space | Jump; release and press again to double jump |
| Shift | Dash/dodge; air dodges also accept W/S for vertical direction |
| Left mouse | Shared weapon light attacks; hold to chain attacks |
| Right mouse | Hold to charge, release to perform a signature heavy |
| W + right mouse | Rising signature |
| S + right mouse | Falling signature |
| E | Collect a nearby mystery pickup, revealing a random weapon |
| Escape | Pause a bot match or open the online menu |

Everyone begins **unarmed**, including bots. Losing a stock also removes the weapon. Unarmed fighters can punch, kick and use their own heavy techniques. A/D moves horizontally; W/S chooses attack direction and drop-through behavior, not free flight. Space remains the jump button.

## Mystery weapons and light attacks

The fifteen armory entries are a **field guide**, not a starting loadout selector. Every pickup has the same mystery appearance. Its weapon is rolled when a player collects it; no model, name or weapon identifier appears in the pickup beforehand. E can replace an already-held weapon with a new random result. Online rolls happen on the server and are shared with all players.

Mystery pickups are present at match start and replenish every three seconds up to a bounded number. They are placed on reachable platform surfaces. Bots seek them when unarmed.

The fifteen weapons remain Sabre, Greatsword, Spear, War hammer, Gauntlets, Longbow, Scythe, Hand cannon, Twin katars, Astral orb, Crescent axe, Bo staff, Chain whip, Rapier and Chakrams.

**Light move timing and geometry are shared across characters for a given weapon.** Weapon types still have their own normal attacks; equipping a bow does not turn its light attack into a sword slash. Character damage stats can affect the final damage. A light chain cycles through three stages. Character powers now live in the heavy techniques rather than being a generic passive added to every heavy hit.

## Distinct heavy techniques

There are **75 named armed signatures**, one per character/weapon pairing, plus five unarmed signatures. Each supports side, rising and falling variants. A technique combines authored windup, movement, weapon/hit phases and recovery. The hit volumes, projectiles and rendered pose use the same phase clock.

Examples:

| Fighter | Sabre signature | Other examples |
| --- | --- | --- |
| Ember | Cinder Cross: advancing cut into an eruption | Dragon Lance, Phoenix Rain, Furnace Descent |
| Lyra | Gale Crossing: a crossing rush and wind finish | Zephyr Spiral, Skyfall Volley, Hurricane Halo |
| Bastion | Iron Procession: braced cleave and groundbreak | Worldbreaker, Citadel Salvo, Continental Divide |
| Nyx | Dusk Reversal: phase-step slash and an echo at the original position | Phantom Needle, Grave Waltz, Vanishing Point |
| Marin | Undertow Waltz: retreating draw, cut and tidal surge | Riptide Spear, Ocean's Heart, Riverdance |

Techniques include multi-hit rushes, rising strikes, vaults, dives, hook/pull sequences, recoil shots, orbiting projectiles, thrown rings, flame pillars, wind funnels, stone waves, shadow weapons and tidal crests. These are composed original moves, not copied Brawlhalla animations. Upward specials have an airborne lift allowance to limit repeated recovery boosts.

## Movement and animation

- Faster ground acceleration, braking and reversals, with strong air steering.
- A 0.10-second coyote window and 0.12-second jump buffer.
- Variable jump height based on release, plus a second jump.
- Short directional dodges with cooldown and brief invulnerability.
- Movement remains available while charging and during light attacks. Committed heavy stages have their own motion; late recovery can be dodged out of.
- Separately textured head, torso, arms, thighs, shins/boots and cloth replace the old horizontal-strip wobble. Joint poses blend continuously and include running, airborne tucking, landing compression, dodges, breathing and staged attacks.
- Detailed painted weapon artwork replaces the basic drawings when artwork is available. A lightweight vector fallback remains available.
- Offline rendering interpolates fixed physics steps. Online local movement predicts immediately, then reconciles acknowledged commands; remote fighters extrapolate briefly and smooth snapshots. Heavy pose clocks are advanced between snapshots.

This is a 2D skeletal animation system, not millions of separate frames or motion capture. Network latency still affects authoritative hits and remote information; this update does not claim zero-latency play or rollback netcode.

## Modes, rules and performance

Select a bot duel or four-fighter bot free-for-all, with three bot behavior levels. Online has separate real-player duel and four-player queues, never filled by bots. Random character selection remains available. All five characters can use all fifteen weapons.

The fifty selectable arenas remain across five regions, with unique platform configurations and six shared detailed environment paintings. Three stocks, four minutes: launch opponents beyond the blast zones. Timeouts compare stocks, then damage, then KOs; exact ties draw.

The server simulates 60 fixed steps per second and broadcasts about 20 snapshots per second. Clients send bounded, sequenced inputs. Effects, projectiles, prediction history and queues are bounded. Body-part alpha bounds are precomputed and bundled; no runtime pixel scan is needed. A larger frame count is not used as a substitute for smooth motion.

Names and sound volume are saved in that browser. There are no accounts, purchases or persistent match records. Online games continue while the menu is open. Server restarts and disconnects end participation; there is no reconnect/resume in this release.

## Verification

```sh
npm test
```

Tests cover unarmed starts/respawns, hidden pickup rewards, all fifteen randomized results, all 75 armed signature definitions, directional variants, shared light moves, staged hits, movement and jump response, coyote time, buffering, dodge immunity, articulated poses, prediction parity, fifty-arena bot simulations, real WebSocket matchmaking, authoritative pickup reveal, input acknowledgements, disconnects and emulated client-script flows. A delayed-snapshot client test verifies that local movement occurs before a server reply.

The art and poses were rendered and inspected locally. Public Render deployment and full manual browser playtesting are not claimed. Playtesting should guide further animation and combat-balance tuning. See `UPDATE_1.0.1.md` and `ARTWORK.md` for release scope and artwork provenance.
