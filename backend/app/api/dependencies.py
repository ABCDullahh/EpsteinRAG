from __future__ import annotations

from typing import Optional

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth_service import AuthService
from app.core.search_service import SearchService
from app.domain.entities import User
from app.infrastructure.database import get_session
from app.infrastructure.repositories.cache_repo import CacheRepository
from app.infrastructure.repositories.document_repo import DocumentRepository
from app.infrastructure.repositories.history_repo import HistoryRepository
from app.infrastructure.repositories.user_repo import UserRepository
from app.utils.exceptions import AuthenticationError


def get_document_repo(session: AsyncSession = Depends(get_session)) -> DocumentRepository:
    return DocumentRepository(session)


def get_user_repo(session: AsyncSession = Depends(get_session)) -> UserRepository:
    return UserRepository(session)


def get_history_repo(session: AsyncSession = Depends(get_session)) -> HistoryRepository:
    return HistoryRepository(session)


def get_cache_repo(session: AsyncSession = Depends(get_session)) -> CacheRepository:
    return CacheRepository(session)


def get_auth_service(user_repo: UserRepository = Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo)


def get_search_service(
    doc_repo: DocumentRepository = Depends(get_document_repo),
    cache_repo: CacheRepository = Depends(get_cache_repo),
) -> SearchService:
    return SearchService(doc_repo, cache_repo)


async def get_current_user(
    authorization: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise AuthenticationError("Missing or invalid authorization header")
    token = authorization.removeprefix("Bearer ").strip()
    return await auth_service.get_current_user(token)


async def get_optional_user(
    authorization: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> Optional[User]:
    """Same as get_current_user but returns None instead of raising."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    try:
        return await auth_service.get_current_user(token)
    except Exception:
        return None
