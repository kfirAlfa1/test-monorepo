# test-monorepo

Two apps in one repo:

| App | Path | Stack | Port |
|---|---|---|---|
| Web | `apps/web` | Vite + React + TypeScript | 5173 |
| API | `apps/api` | FastAPI (Python) | 8000 |

The web app calls the API through the Vite dev proxy (`/api` → `API_PROXY_TARGET`, default `http://localhost:8000`).

## Run locally

API:

```sh
cd apps/api
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Web (in a second terminal):

```sh
cd apps/web
npm install
npm run dev
```

Open http://localhost:5173.

## Run in the Base44 sandbox

```sh
docker compose -f docker-compose.base44.yml up -d --build
```

This is the dev-environment compose: both services run their reloading dev servers
from the bind-mounted source, so code edits show up without a rebuild. The Vite dev
server is published on host port **3000** (the preview entry point) and proxies `/api`
to the FastAPI service on the compose network, so there is a single origin and no CORS
setup is needed. `docker-compose.base44.yml` is for local/sandbox development only and
does not change how the apps run in production.

One sandbox-only override lives in the code: because the preview reaches the dev server
through a rotating sandbox hostname, `apps/web/vite.config.ts` adds
`.${BASE44_SANDBOX_HOST_DOMAIN}` to Vite's `server.allowedHosts` when
`BASE44_PREVIEW_MODE=1`. With that flag unset the config is unchanged from the local-dev
behavior above.
