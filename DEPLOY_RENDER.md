# Deploy OVERDRIVE 1.0.4 on Render

OVERDRIVE is ready for a **Render Web Service**. One Node service hosts the browser game, artwork, bot play and online matchmaking. Do not choose Static Site: matchmaking needs the running server.

## 1. Put the game in a separate GitHub repository

1. Extract `OVERDRIVE.zip`.
2. Create a new GitHub repository for **OVERDRIVE**. Keep CU-Escape's repository and service as they are.
3. Upload the **contents** of the extracted `OVERDRIVE` folder to that repository and commit them. Do not upload the ZIP itself.
4. At the repository's top level, confirm that you can see `package.json`, `package-lock.json`, `server.cjs`, `render.yaml` and the `public` folder. The `public/assets` folder must be included. Do not upload `node_modules`.

## 2. Create the Render service

### Recommended: use the included Blueprint

1. Sign in to your Render dashboard.
2. Select **New → Blueprint** and connect the OVERDRIVE GitHub repository.
3. Let Render read `render.yaml` from the repository root.
4. Review the new `overdrive` web service. The file requests the Free instance type and exactly one instance.
5. Deploy the Blueprint. Wait until the service reports that it is live.
6. Open the **actual URL shown by Render**. That is the link to share with players. The final subdomain depends on availability; this package does not reserve a particular URL.

### Alternative: create a Web Service manually

Select **New → Web Service**, connect the same repository and enter:

| Setting | Value |
| --- | --- |
| Name | `overdrive`, or an available name you prefer |
| Language / Runtime | **Node** |
| Branch | The branch containing the game files |
| Root Directory | Leave blank if `package.json` is at the repository root |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Environment variable | `NODE_VERSION` = `24` |
| Environment variable | `NODE_ENV` = `production` |
| Instances | **1** |
| Auto-Deploy | On commit to the connected branch |

Choose Free for initial testing, or select a paid instance if you want to. Review the selected plan before creating the service. Do not use Docker for this manual path; the included Dockerfile is an optional alternative, while the Blueprint explicitly selects Node.

If you uploaded the containing folder instead of its contents, the manual service's Root Directory must be `OVERDRIVE`. For the Blueprint route, put the files at repository root as described above, or deliberately add the matching `rootDir` to the Blueprint.

Do not set a Publish Directory and do not replace `npm start` with a static file server. No manual PORT setting is needed: the server reads Render's provided PORT and listens on `0.0.0.0`.

## 3. Check the live game

1. Open the service's HTTPS URL. It should show **OVERDRIVE / VERSION 1.0.4**.
2. Open the same address with `/health` appended. It should return JSON with `"ok":true` and `"version":"1.0.4"`.
3. Play a bot match. Bot mode does not require another player.
4. To test online, open the same live address on two computers (or two separate browser windows for a quick check). On each, select **ONLINE** and **1 vs 1 · Duel**, then **FIND A MATCH**. Both players should enter the same match after the countdown.
5. For a four-player free-for-all, all four players must select that format. Duel and free-for-all have separate queues. There is no room code and no bot backfill.

The game automatically connects to `wss://` on its current HTTPS hostname at `/play`. You do not enter a separate WebSocket address or obtain another certificate. Players do not need to share Wi-Fi, although their network must allow HTTPS/WebSocket connections to the website.

Keep this release at **one running service instance**. Queues and matches live in that process; multiple instances would create separate queues. Supporting several instances requires shared matchmaking infrastructure that is not included in 1.0.4.

## 4. Future updates

Commit the changed OVERDRIVE files to the connected GitHub branch. The Blueprint enables deploy-on-commit. Wait for Render to finish, then refresh the open game tabs. Existing in-progress matches and queues end when the server restarts; coordinate updates between matches.

No database, disk, credentials, API keys or external multiplayer service are required for this first version. This package is prepared for deployment, but it has not been published to your Render account.

## Free instance expectations

Render can spin down an idle Free web service and takes time to wake it when someone returns. Free services can also restart and are subject to resource limits. A Free deployment is suitable for testing, but this package does not promise a particular player capacity or competitive latency on that plan. If your account also hosts CU-Escape on Free, check Render's shared included instance-hour allowance.

## If something goes wrong

- **Missing package.json:** upload the extracted project contents, or correct Root Directory.
- **Only the page loads; no online matches:** use a Web Service running `npm start`, include `server.cjs` and `core.js`, and keep all players on the same service URL and format. Matchmaking intentionally waits for real people.
- **Blank or sparse animation:** include the entire `public/assets/sprites` folder, `sprite-data.js`, `painted-sprites.js` and `weapon-motion.js`. The sprite folder contains 45 WebP files. Preserve filenames and capitalization.
- **Version mismatch:** wait for the completed deploy, then refresh all players' tabs.
- **Build failure:** read Render's deployment log. Node must be 24 and the lockfile must be committed.
- **A player disconnects during deploy:** server restarts end active matches in this version. Reopen the game and queue again.

Official references, checked November 17, 2026:

- https://render.com/docs/web-services
- https://render.com/docs/blueprint-spec
- https://render.com/docs/node-version
- https://render.com/docs/websocket
- https://render.com/docs/free
