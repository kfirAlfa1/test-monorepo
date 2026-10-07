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
