# FitnessBytes deployment

This deployment runs the Vite frontend server, Express/Socket.IO backend, MongoDB, and an optional Cloudflare Tunnel in Docker. Vite serves the React application and proxies `/api` and `/socket.io` to the backend over the private Docker network.

## Architecture

```text
Browser
  -> localhost:5173 or Cloudflare Tunnel
  -> frontend:5173 (Vite)
      -> /api/* -> server:5301
      -> /socket.io/* -> server:5301
  -> mongo:27017
```

## Requirements

- Docker Desktop or Docker Engine with Docker Compose
- A remotely-managed Cloudflare Tunnel only when public access is needed

## Local deployment

From the repository root:

```bash
cp .env.example .env
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

Generate a session secret and place it in `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```

Keep the local defaults:

```dotenv
FRONTEND_PORT=5173
PUBLIC_ORIGIN=http://localhost:5173
PUBLIC_HOSTNAME=localhost
COOKIE_SECURE=false
```

Start the application:

```bash
docker compose up -d --build
```

Open:

```text
http://localhost:5173
```

Verify the backend through the Vite proxy:

```text
http://localhost:5173/api/health
```

View service status and logs:

```bash
docker compose ps
docker compose logs -f frontend server mongo
```

Stop the containers without deleting MongoDB data:

```bash
docker compose down
```

Delete the containers and all local MongoDB data only when intentionally resetting the application:

```bash
docker compose down -v
```

## Cloudflare Tunnel deployment

Create or select a remotely-managed tunnel in Cloudflare. Configure its public hostname to forward to this Docker-network service:

```text
http://frontend:5173
```

Set the deployment values in the root `.env` file:

```dotenv
PUBLIC_ORIGIN=https://fitnessbytes.your-domain.example
PUBLIC_HOSTNAME=fitnessbytes.your-domain.example
COOKIE_SECURE=true
CLOUDFLARE_TUNNEL_ID=your-tunnel-uuid
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
```

`CLOUDFLARE_TUNNEL_TOKEN` is the credential used by `cloudflared` to run the remotely-managed tunnel. `CLOUDFLARE_TUNNEL_ID` is retained in the container metadata so the deployed connector can be matched to the expected tunnel without putting either value in Git.

Start the application and tunnel:

```bash
docker compose --profile tunnel up -d --build
```

Inspect the tunnel:

```bash
docker compose ps
docker compose logs --tail=200 -f cloudflared
```

The token is a credential. Keep it only in `.env`, never in Git, screenshots, issue comments, or shared command output.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `FRONTEND_PORT` | `5173` | Host-only port mapped to the Vite frontend |
| `PUBLIC_ORIGIN` | `http://localhost:5173` | Browser origin accepted by Express and Socket.IO |
| `PUBLIC_HOSTNAME` | `localhost` | Additional hostname Vite accepts through the tunnel |
| `COOKIE_SECURE` | `false` | Set to `true` for an HTTPS Cloudflare hostname |
| `COOKIE_MAX_AGE` | `86400000` | Session lifetime in milliseconds |
| `JSON_BODY_LIMIT` | `12mb` | Express request-size limit for existing image uploads |
| `SECRETKEY` | local placeholder | Express session-signing secret |
| `CLOUDFLARE_TUNNEL_ID` | empty | Expected Cloudflare Tunnel UUID recorded in container metadata |
| `CLOUDFLARE_TUNNEL_TOKEN` | empty | Credential consumed by the optional tunnel profile |

## Media persistence

Post images are stored in MongoDB by the existing application. The Compose volume named `mongo-data` preserves images, accounts, posts, sessions, conversations, and messages across container restarts and rebuilds.

The existing application stores each image inside a MongoDB document. Keep each processed upload below the configured request limit and MongoDB's per-document limit. Native video-post uploads are not implemented in the current codebase; use external screen recording to capture a demonstration.

## Rebuild after changes

Local stack:

```bash
docker compose up -d --build
```

Tunnel stack:

```bash
docker compose --profile tunnel up -d --build
```

## Troubleshooting

```bash
docker compose logs --tail=200 frontend
docker compose logs --tail=200 server
docker compose logs --tail=200 mongo
docker compose logs --tail=200 cloudflared
```

If the Cloudflare hostname returns a Vite host error, confirm that `PUBLIC_HOSTNAME` contains only the hostname, without `https://` or a path, and recreate the frontend container.
