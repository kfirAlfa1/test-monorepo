# AGENTS.md

## Sandbox / preview environment (Base44)

- Start everything with `docker compose -f docker-compose.base44.yml up -d --build`.
- Two dev servers, one origin: the Vite dev server (web) is published on host port **3000** and proxies `/api` to the `api` service (`API_PROXY_TARGET=http://api:8000`). The FastAPI service is deliberately *not* published — keep it that way so the browser only ever talks to one origin.
- Both services run reloading dev servers from the bind-mounted source, so edits apply without an image rebuild. Dependencies are installed on container start: `npm install` (web — no lock file is committed) and `pip install -r requirements.txt` (api). Web `node_modules` live in the `web_node_modules` named volume, not on the host checkout.

## Non-obvious findings

- The dev server receives the sandbox hostname `3000-<id>.$BASE44_SANDBOX_HOST_DOMAIN` (the id rotates; from outside, the same app is served at `https://3000-$BASE44_PUBLIC_HOST_SUFFIX`). The host is a *subdomain* of `$BASE44_SANDBOX_HOST_DOMAIN`, so a probe Host of `3000-$BASE44_SANDBOX_HOST_DOMAIN` is NOT a real preview host and legitimately gets a 403 — use `3000-probe.$BASE44_SANDBOX_HOST_DOMAIN` instead. Vite ≥5.4 rejects unknown hosts with `403 Blocked request. This host (...) is not allowed.` Vite 5.4 does **not** read the platform's `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`, so `apps/web/vite.config.ts` adds `.${BASE44_SANDBOX_HOST_DOMAIN}` to `server.allowedHosts`, gated on `BASE44_PREVIEW_MODE === "1"`. With the flag unset (or any other value) no host allowlist is applied and behavior is the original local-dev behavior. Revisit if Vite is upgraded to ≥6.1, where the env var alone is honored.
- `CHOKIDAR_USEPOLLING=1` is set on the web service so live reload fires reliably across the bind mount.

## How to verify

- `curl -s http://localhost:3000/api/message` → `{"message":"Hello from FastAPI"}` proves the Vite → FastAPI proxy path end to end.
- `curl -s -o /dev/null -w '%{http_code}' -H "Host: 3000-probe.$BASE44_SANDBOX_HOST_DOMAIN" http://localhost:3000/` → `200` proves the preview host is accepted (`403` means Vite's host check is blocking the preview).
- `docker compose -f docker-compose.base44.yml ps` → both `api` and `web` report `(healthy)`.
- The page itself shows a green "API connected: Hello from FastAPI" badge; a red badge means the proxy target is wrong.
