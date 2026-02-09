from __future__ import annotations

import json
import time

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from typing import Optional

from app.api.dependencies import (
    get_history_repo,
    get_optional_user,
    get_search_service,
)
from app.api.schemas.search_schemas import SearchRequest, SearchResponse
from app.core.search_service import SearchService
from app.domain.entities import SearchQuery, User
from app.infrastructure.repositories.history_repo import HistoryRepository

router = APIRouter(tags=["search"])


@router.post("/search", response_model=SearchResponse)
async def search(
    body: SearchRequest,
    user: Optional[User] = Depends(get_optional_user),
    search_service: SearchService = Depends(get_search_service),
    history_repo: HistoryRepository = Depends(get_history_repo),
):
    query = SearchQuery(
        text=body.query,
        filters=body.filters,
        limit=body.limit,
        semantic_weight=body.semantic_weight,
    )
    result = await search_service.search(query)

    # save to history only if user is authenticated
    if user:
        await history_repo.create(
            user_id=user.id,
            query=body.query,
            filters=body.filters.model_dump(exclude_none=True) if body.filters else None,
            result_count=result.total_results,
            search_time_ms=result.search_time_ms or 0,
        )

    return result


@router.get("/search/stream")
async def search_stream(
    q: str = Query(..., min_length=2),
    limit: int = Query(default=20, ge=1, le=100),
    user: Optional[User] = Depends(get_optional_user),
    search_service: SearchService = Depends(get_search_service),
):
    query = SearchQuery(text=q, limit=limit)

    async def event_generator():
        try:
            async for event in search_service.search_stream(query):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
