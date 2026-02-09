from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from uuid import UUID

from jose import JWTError, jwt

from app.config import settings
from app.domain.entities import User
from app.infrastructure.external import google_oauth
from app.infrastructure.repositories.user_repo import UserRepository
from app.utils.exceptions import AuthenticationError
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AuthService:
    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    async def login_with_google(self, code: str) -> Dict[str, Any]:
        """Exchange OAuth code, create/update user, return JWT."""
        tokens = await google_oauth.exchange_code(code)
        access_token = tokens.get("access_token", "")
        user_info = await google_oauth.get_user_info(access_token)

        google_id = user_info["id"]
        email = user_info["email"]
        name = user_info.get("name")
        picture = user_info.get("picture")

        user = await self.user_repo.find_by_google_id(google_id)
        if user:
            await self.user_repo.update_login(user.id)
        else:
            user = await self.user_repo.create(google_id, email, name, picture)

        jwt_token = self._create_token(user)
        return {
            "access_token": jwt_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user.model_dump(mode="json"),
        }

    async def login_with_id_token(self, id_token: str) -> Dict[str, Any]:
        """Verify a Google ID token directly (for frontend NextAuth flow)."""
        claims = await google_oauth.verify_id_token(id_token)
        google_id = claims["sub"]
        email = claims["email"]
        name = claims.get("name")
        picture = claims.get("picture")

        user = await self.user_repo.find_by_google_id(google_id)
        if user:
            await self.user_repo.update_login(user.id)
        else:
            user = await self.user_repo.create(google_id, email, name, picture)

        jwt_token = self._create_token(user)
        return {
            "access_token": jwt_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user.model_dump(mode="json"),
        }

    async def get_current_user(self, token: str) -> User:
        """Validate JWT and return user."""
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            user_id = payload.get("sub")
            if not user_id:
                raise AuthenticationError("Invalid token payload")
        except JWTError:
            raise AuthenticationError("Invalid or expired token")

        user = await self.user_repo.find_by_id(UUID(user_id))
        if not user:
            raise AuthenticationError("User not found")
        return user

    @staticmethod
    def _create_token(user: User) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return jwt.encode(
            {"sub": str(user.id), "email": user.email, "exp": expire},
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )
