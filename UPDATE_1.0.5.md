# OVERDRIVE 1.0.5 — Separate Character Folders

The game now deploys from small files at repository root. `game-client.json` contains the active browser code and original artwork. `game-core.cjs` and `game-motion.cjs` contain the server simulation. The server does not read the old `public` directory, preventing stale public files from silently overriding an update.

Each character has a separate top-level folder, delivered in its own ZIP: `ember`, `lyra`, `bastion`, `nyx`, `marin`. Each contains nine WebP files and is below 19 MiB. All 45 images and 6,120 animation frames are preserved byte for byte.

Missing image requests return 404 with no-cache handling instead of raising an unhandled stream error that can crash the server. The game menu checks the installed character folders and reports per-character counts. `/graphics-status` lists exact missing or malformed image paths. The main bundle includes the original detailed roster, weapon and background artwork for fallback when character packs are absent.

53 automated tests pass, including real WebSocket matchmaking, a production server with no public directory, deliberately stale public files, all character images, malformed/missing files, and adding a character pack after a failed request. Interactive browser/device playtesting remains unverified.

Upload the main package files together at repository root, then each extracted character folder alongside them. No new graphics generation or gameplay/balance changes are part of this packaging repair.
