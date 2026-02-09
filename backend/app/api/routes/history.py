from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_current_user, get_history_repo, get_optional_user
from app.api.schemas.history_schemas import HistoryListResponse
from app.domain.entities import User
from app.infrastructure.repositories.history_repo import HistoryRepository

router = APIRouter(tags=["history"])


@router.get("/", response_model=HistoryListResponse)
async def list_history(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    user: Optional[User] = Depends(get_optional_user),
    history_repo: HistoryRepository = Depends(get_history_repo),
):
    if not user:
        return HistoryListResponse(history=[], total=0)
    entries = await history_repo.list_by_user(user.id, limit=limit, offset=offset)
    total = await history_repo.count_by_user(user.id)
    return HistoryListResponse(
        history=[e.model_dump(mode="json") for e in entries],
        total=total,
    )


@router.delete("/{history_id}")
async def delete_history_entry(
    history_id: UUID,
    user: User = Depends(get_current_user),
    history_repo: HistoryRepository = Depends(get_history_repo),
):
    deleted = await history_repo.delete(history_id, user.id)
    if not deleted:
        return {"message": "Entry not found or already deleted"}
    return {"message": "Deleted"}


@router.delete("/")
async def clear_history(
    user: User = Depends(get_current_user),
    history_repo: HistoryRepository = Depends(get_history_repo),
):
    count = await history_repo.clear_user_history(user.id)
    return {"message": f"Cleared {count} entries"}
