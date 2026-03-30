from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from database import init_db, close_db
from models import HealthResponse
from routes.plans import router as plans_router
from routes.users import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="Spotify Family API",
    description=(
        "REST API that mirrors the Spotify Family Telegram bot logic. "
        "Exposes subscription plans, user status, and purchase initiation."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(plans_router, prefix="/api")
app.include_router(users_router, prefix="/api")


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["meta"])
async def health() -> HealthResponse:
    """Liveness probe — also checks the database pool is alive."""
    from database import _pool
    db_status = "ok" if _pool else "unavailable"
    return HealthResponse(
        status="ok",
        database=db_status,
        timestamp=datetime.now(timezone.utc),
    )


# ── 404 handler ───────────────────────────────────────────────────────────────
@app.exception_handler(404)
async def not_found(_: Request, exc) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Not found"})
