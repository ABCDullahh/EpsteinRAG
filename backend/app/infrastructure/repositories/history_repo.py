from __future__ import annotations

import json
from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import SearchHistoryEntry


class HistoryRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        user_id: UUID,
        query: str,
        filters: Optional[Dict[str, Any]] = None,
        result_count: int = 0,
        search_time_ms: int = 0,
    ) -> SearchHistoryEntry:
        result = await self.session.execute(
            text("""
                INSERT INTO search_history (user_id, query, filters, result_count, search_time_ms)
                VALUES (:uid, :query, :filters, :rc, :ms)
                RETURNING *
            """),
            {
                "uid": str(user_id),
                "query": query,
                "filters": json.dumps(filters) if filters else None,
                "rc": result_count,
                "ms": search_time_ms,
            },
        )
        await self.session.commit()
        row = result.mappings().fetchone()
        return SearchHistoryEntry(**row)

    async def list_by_user(
        self, user_id: UUID, limit: int = 50, offset: int = 0
    ) -> List[SearchHistoryEntry]:
        result = await self.session.execute(
            text("""
                SELECT * FROM search_history
                WHERE user_id = :uid
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            """),
            {"uid": str(user_id), "limit": limit, "offset": offset},
        )
        return [SearchHistoryEntry(**r) for r in result.mappings().fetchall()]

    async def count_by_user(self, user_id: UUID) -> int:
        result = await self.session.execute(
            text("SELECT count(*) FROM search_history WHERE user_id = :uid"),
            {"uid": str(user_id)},
        )
        return result.scalar() or 0

    async def delete(self, history_id: UUID, user_id: UUID) -> bool:
        result = await self.session.execute(
            text("DELETE FROM search_history WHERE id = :id AND user_id = :uid"),
            {"id": str(history_id), "uid": str(user_id)},
        )
        await self.session.commit()
        return result.rowcount > 0

    async def clear_user_history(self, user_id: UUID) -> int:
        result = await self.session.execute(
            text("DELETE FROM search_history WHERE user_id = :uid"),
            {"uid": str(user_id)},
        )
        await self.session.commit()
        return result.rowcount
