from fastapi import APIRouter, Depends

from app.api.dependencies import get_auth_service, get_current_user
from app.api.schemas.auth_schemas import AuthResponse, GoogleLoginRequest
from app.core.auth_service import AuthService
from app.domain.entities import User
from app.utils.exceptions import AuthenticationError

router = APIRouter(tags=["auth"])


@router.post("/login", response_model=AuthResponse)
async def google_login(
    body: GoogleLoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    if body.code:
        return await auth_service.login_with_google(body.code)
    if body.id_token:
        return await auth_service.login_with_id_token(body.id_token)
    raise AuthenticationError("Provide either 'code' or 'id_token'")


@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return user.model_dump(mode="json")
