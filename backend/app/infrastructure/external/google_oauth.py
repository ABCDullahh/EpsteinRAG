from __future__ import annotations

from typing import Any, Dict

import httpx

from app.config import settings
from app.utils.exceptions import AuthenticationError
from app.utils.logger import get_logger

logger = get_logger(__name__)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


async def exchange_code(code: str) -> Dict[str, Any]:
    """Exchange an OAuth authorization code for tokens."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if resp.status_code != 200:
            logger.error("google_oauth_token_error", body=resp.text)
            raise AuthenticationError("Failed to exchange authorization code")
        return resp.json()


async def get_user_info(access_token: str) -> Dict[str, Any]:
    """Fetch Google user profile using the access token."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if resp.status_code != 200:
            logger.error("google_userinfo_error", body=resp.text)
            raise AuthenticationError("Failed to fetch user info")
        return resp.json()


async def verify_id_token(id_token: str) -> Dict[str, Any]:
    """Verify a Google ID token and return claims."""
    import time

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": id_token},
        )
        if resp.status_code != 200:
            raise AuthenticationError("Invalid ID token")
        claims = resp.json()
        if claims.get("aud") != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationError("Token audience mismatch")
        exp = claims.get("exp")
        if exp and int(exp) < int(time.time()):
            raise AuthenticationError("Token has expired")
        return claims
