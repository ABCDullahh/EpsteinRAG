from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Epstein RAG Search Engine"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/epstein_rag"

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/api/auth/callback/google"

    # Gemini API
    GEMINI_API_KEY: str = ""
    GEMINI_EMBEDDING_MODEL: str = "gemini-embedding-001"
    GEMINI_LLM_MODEL: str = "gemini-2.5-flash"

    # DugganUSA API
    DUGGAN_API_BASE_URL: str = "https://analytics.dugganusa.com/api/v1"

    # Security
    JWT_SECRET_KEY: str = "change-this-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Search
    VECTOR_DIMENSIONS: int = 3072
    DEFAULT_SEARCH_LIMIT: int = 20
    MAX_SEARCH_LIMIT: int = 100
    QUERY_CACHE_TTL_SECONDS: int = 3600

    model_config = {"env_file": ".env", "case_sensitive": True}


settings = Settings()
