# FitnessBytes deployment

This deployment runs the React frontend, Express/Socket.IO server, and MongoDB in Docker. The frontend and backend share one public origin, so the same build works at `http://localhost` and behind a Cloudflare Tunnel.

## Requirements

- Docker Desktop or Docker Engine with Docker Compose
- A Cloudflare Tunnel only when public access is needed

## Local deployment

From the repository root:

```bash
cp .env.example .env
```

Generate a session secret and place it in `.env`:

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```

Start the application:

```bash
docker compose up -d --build
```

Open:

```text
http://localhost
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

To also delete all local application data:

```bash
docker compose down -v
```

## Cloudflare Tunnel deployment

In the Cloudflare Zero Trust dashboard, configure the tunnel's public hostname to forward to:

```text
http://frontend:80
```

Set these values in the root `.env` file:

```dotenv
PUBLIC_ORIGIN=https://your-domain.example
COOKIE_SECURE=true
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
```

Start the normal stack plus the optional tunnel service:

```bash
docker compose --profile tunnel up -d --build
```

The tunnel token is a credential. Keep it only in `.env`, never in Git, screenshots, issue comments, or shell-history exports that will be shared.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `HTTP_PORT` | `80` | Host port used by the Nginx frontend |
| `PUBLIC_ORIGIN` | `http://localhost` | Allowed deployed browser origin |
| `COOKIE_SECURE` | `false` | Set to `true` for an HTTPS tunnel/domain |
| `COOKIE_MAX_AGE` | `86400000` | Session lifetime in milliseconds |
| `JSON_BODY_LIMIT` | `12mb` | Express and Nginx request-size limit |
| `SECRETKEY` | local placeholder | Express session-signing secret |
| `CLOUDFLARE_TUNNEL_TOKEN` | empty | Token used only by the optional tunnel profile |

## Media persistence

Post images are stored in MongoDB by the existing application. The Compose volume named `mongo-data` preserves those images, accounts, posts, sessions, conversations, and messages across container restarts and rebuilds.

The existing application stores each image inside a MongoDB document. Keep each processed upload below the configured request limit and MongoDB's per-document limit. Native video-post uploads are not implemented in the current codebase; this deployment preserves the existing image-post feature and is suitable for capturing screenshots or screen recordings of the application.

## Rebuild after code changes

```bash
docker compose up -d --build
```

## Troubleshooting

```bash
docker compose logs --tail=200 server
docker compose logs --tail=200 frontend
docker compose logs --tail=200 mongo
docker compose logs --tail=200 cloudflared
```

The backend health endpoint is available through the proxy at:

```text
http://localhost/api/health
```
