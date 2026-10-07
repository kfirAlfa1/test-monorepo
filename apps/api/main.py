from fastapi import FastAPI

app = FastAPI(title="test-monorepo API")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/message")
def message() -> dict[str, str]:
    return {"message": "Hello from FastAPI"}
