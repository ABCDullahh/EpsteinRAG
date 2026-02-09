from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=20,
    max_overflow=10,
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

INIT_SQL = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    picture TEXT,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255) PRIMARY KEY,
    efta_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_preview TEXT,
    doc_type VARCHAR(100),
    people TEXT[] DEFAULT '{}',
    locations TEXT[] DEFAULT '{}',
    aircraft TEXT[] DEFAULT '{}',
    evidence_types TEXT[] DEFAULT '{}',
    pages INTEGER,
    source VARCHAR(255),
    dataset VARCHAR(100),
    file_path TEXT,
    embedding vector(3072),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB,
    result_count INTEGER DEFAULT 0,
    search_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS query_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_hash VARCHAR(64) UNIQUE NOT NULL,
    query_text TEXT NOT NULL,
    filters JSONB,
    response JSONB NOT NULL,
    hit_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes (using IF NOT EXISTS via DO blocks)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_google_id') THEN
        CREATE INDEX idx_users_google_id ON users(google_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_efta_id') THEN
        CREATE INDEX idx_documents_efta_id ON documents(efta_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_doc_type') THEN
        CREATE INDEX idx_documents_doc_type ON documents(doc_type);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_content_trgm') THEN
        CREATE INDEX idx_documents_content_trgm ON documents USING gin(content gin_trgm_ops);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_search_history_user') THEN
        CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_query_cache_hash') THEN
        CREATE INDEX idx_query_cache_hash ON query_cache(query_hash);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_query_cache_expires') THEN
        CREATE INDEX idx_query_cache_expires ON query_cache(expires_at);
    END IF;
END $$;
"""

VECTOR_INDEX_SQL = """
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_embedding') THEN
        CREATE INDEX idx_documents_embedding ON documents USING hnsw (embedding vector_cosine_ops);
    END IF;
END $$;
"""


async def init_db() -> None:
    # asyncpg cannot execute multiple statements in one call,
    # so we use the raw asyncpg connection's .execute() which supports it.
    async with engine.connect() as conn:
        raw = await conn.get_raw_connection()
        await raw.driver_connection.execute(INIT_SQL)
        await conn.commit()

    # Note: pgvector vector index (ivfflat/hnsw) has 2000-dim limit.
    # With gemini-embedding-001 (3072 dims), we skip the index for now.
    # Sequential scan is fine for our dataset size (<100k docs).


async def close_db() -> None:
    await engine.dispose()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
