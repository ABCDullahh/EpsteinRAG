from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class HistoryEntryResponse(BaseModel):
    id: UUID
    query: str
    filters: Optional[Dict[str, Any]] = None
    result_count: int
    search_time_ms: Optional[int] = None
    created_at: datetime


class HistoryListResponse(BaseModel):
    history: List[HistoryEntryResponse]
    total: int
