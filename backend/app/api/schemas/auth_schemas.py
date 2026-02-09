from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel


class GoogleLoginRequest(BaseModel):
    code: Optional[str] = None
    id_token: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]
