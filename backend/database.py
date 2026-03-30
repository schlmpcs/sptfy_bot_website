import asyncpg
from typing import AsyncGenerator
from config import settings

_pool: asyncpg.Pool | None = None


async def init_db() -> None:
    """Create the asyncpg connection pool. Called on FastAPI startup."""
    global _pool
    ssl = settings.db_ssl_mode if settings.db_ssl_mode != "disable" else None
    _pool = await asyncpg.create_pool(
        host=settings.db_host,
        port=settings.db_port,
        user=settings.db_username,
        password=settings.db_password,
        database=settings.db_database,
        ssl=ssl,
        min_size=1,
        max_size=10,
    )


async def close_db() -> None:
    """Close the connection pool. Called on FastAPI shutdown."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    """FastAPI dependency that yields a connection from the pool."""
    if _pool is None:
        raise RuntimeError("Database pool is not initialised")
    async with _pool.acquire() as conn:
        yield conn
