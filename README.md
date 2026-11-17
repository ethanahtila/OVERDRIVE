# OVERDRIVE — 1.0.0

An original desktop-only 2D platform fighter. This is a **separate project from CU-Escape**; do not overwrite the CU-Escape repository or service with these files.

## Deploy the browser game on Render

Use the included **render.yaml** to create a Node Web Service, or follow the exact GitHub/Render settings in **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)**. The website and online matchmaking run together on one service. Upload the extracted project contents to a separate OVERDRIVE repository; keep CU-Escape separate. This deployment preparation retains game version **1.0.0**.

## Play against bots immediately

1. Extract the entire ZIP.
2. Open `public/index.html` in a current desktop browser.
3. Pick **VS BOTS**, a character, a weapon and an arena. Click **ENTER THE ARENA**.

Keep the `public` folder intact, including its scripts and `assets` folder. No account, installation or internet connection is required for bot matches after the files are downloaded. If your browser restricts local files, use the server below.

## Run the game server

Install Node.js **24 or later**, then open a terminal in the extracted project folder:

```sh
npm ci
npm start
```

Open **http://localhost:3000**. That single server serves the game and real-player matchmaking. For another computer on a reachable local network, open the server computer's LAN address on port 3000. A firewall or university client isolation can prevent LAN access; being on the same Wi-Fi does not guarantee connectivity.

For a public link, host **this project separately** on a Node-compatible web service with WebSocket support, using `npm ci` as the build/install command and `npm start` as the start command. The server reads the platform's `PORT` variable and binds to all interfaces. Health endpoint: `/health`. An HTTPS deployment automatically uses **WSS** on the same host. No third-party multiplayer service or database is needed.

This ZIP does **not** create or deploy a public URL. Do not replace CU-Escape when setting up the new game.

## Controls

| Input | Action |
| --- | --- |
| A / D | Move left / right |
| W / S | Aim attacks up / down in the 2D plane |
| S | Drop through thin floating platforms |
| Space | Jump; release and press again for a second jump |
| Shift | Directional dash/dodge with brief invulnerability and a cooldown |
| Left mouse | Light attack; hold to repeat |
| Right mouse | Heavy attack; hold to charge, release to strike |
| E | Pick up a nearby glowing weapon drop |
| Escape | Pause bots or open the online match menu |

There is gravity and no free flying. W aims upward; **Space** is the jump button. Online matches continue while the menu is open. Leaving or disconnecting forfeits the match. Backgrounding a bot match pauses it and releases held inputs.

## Fighters

All five fighters can use all fifteen weapons. Their powers modify heavy attacks, including projectiles, rather than restricting equipment.

| Fighter | Power | Strength |
| --- | --- | --- |
| Ember | Ignition | Strong damage and a short burn after heavy hits |
| Lyra | Slipstream | Fast movement/recovery, a shorter dodge cooldown and stronger heavy launch |
| Bastion | Stonebound | Highest defense, heavy knockback and ground tremor shots |
| Nyx | Afterimage | Strong aerial control and a delayed echo after heavy hits |
| Marin | Undertow | Balanced defense and movement; heavy hits pull and restore a little damage |

Weapons: **Sabre, Greatsword, Spear, War hammer, Gauntlets, Longbow, Scythe, Hand cannon, Twin katars, Astral orb, Crescent axe, Bo staff, Chain whip, Rapier and Chakrams.** They differ in reach, speed, damage, launch, charge behavior and projectile/melee behavior. Bows fire charged spreads; cannons recoil; chakrams return; scythes hook; hammers launch upward. Weapon drops appear every nine seconds, up to four at a time. Every player starts with their selected weapon, or a randomized weapon if Random is selected.

## Formats and arenas

- **VS BOTS** is entirely local and never enters online matchmaking. Choose one opponent or a four-fighter free-for-all and Apprentice, Contender or Veteran bot behavior. Bot character and weapon choices are randomized for each match.
- **ONLINE** has separate two-player duel and four-player free-for-all queues. It waits for that many actual players; it never fills slots with bots. The arena is selected from the matched players' choices, so players do not need identical selections to match.
- Players can independently choose **Random** for character and weapon.
- **50 selectable arenas** span five regions: Highlands, Coast, Wildwood, Sanctum and Ashlands. Each has its own name and platform configuration. The arenas share six detailed environment paintings, with regional variants, cropping, atmosphere and distinct layouts; they are not fifty independently painted backdrops.
- **Three stocks, four minutes.** Damage increases launch distance. Leaving the blast zone costs a stock. The last fighter standing wins; timeouts compare stocks, then lower damage, then KOs. Exact final ties are draws.

## Graphics and sound

Detailed painted fighter cutouts and cinematic matte-painted environments are included locally. Fighters use procedural pose deformation, directional weapon animations, charge effects and hit particles. These are original 2D assets, not 3D character models or full frame-by-frame animation sets. Canvas renders smoothly at the display's resolution, with device-pixel ratio capped at two. A vector fallback remains available if artwork cannot load.

Synthesized hit, jump, dodge, pickup and KO sounds have a local volume control that is available in the selection screen and match menu. Names and volume are remembered on that browser. There are no accounts, ranked progression, purchases or saved match records in 1.0.0.

## Online architecture and limits

The Node server runs the shared combat simulation at 60 fixed steps per second and sends authoritative state about 20 times per second. Clients send controls, not positions or damage. Rendering smooths network snapshots; real network latency still applies. This first release does not implement rollback netcode, regional server selection, reconnection/resume or persistent accounts. Restarting the server ends active matches and waiting queues.

Static artwork is cached, transient effects and projectiles are bounded, inputs are normalized, stale inputs expire, cross-origin browser WebSocket connections are rejected and message size/rate are limited. Online play requires the same deployed game version for all players.

## Validate

```sh
npm test
```

Tests cover all 75 fighter–weapon combinations, directional input/jump/dodge behavior, character powers, stocks and blast zones, randomized choices, all fifty arenas, deterministic simulation, real WebSocket matchmaking, simultaneous matches, disconnects, invalid input, actual browser-script menu flows and two game clients sending input through a local server. The UI tests execute the real client scripts in an emulated DOM; they do not replace manual browser/keyboard playtesting or public-network latency tests.

See `ARTWORK.md` for art provenance and generation prompts. Version 1.0.0 is the first playable foundation, with balance and animation intended to evolve through playtesting.
