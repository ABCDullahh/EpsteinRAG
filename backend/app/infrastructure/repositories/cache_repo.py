from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings


class CacheRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _hash_query(query: str, filters: Optional[Dict[str, Any]] = None) -> str:
        raw = query.strip().lower()
        if filters:
            raw += json.dumps(filters, sort_keys=True)
        return hashlib.sha256(raw.encode()).hexdigest()

    async def get(
        self, query: str, filters: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        qhash = self._hash_query(query, filters)
        result = await self.session.execute(
            text("""
                SELECT response FROM query_cache
                WHERE query_hash = :qh AND expires_at > :now
            """),
            {"qh": qhash, "now": datetime.utcnow()},
        )
        row = result.fetchone()
        if not row:
            return None
        # Bump hit count
        await self.session.execute(
            text("UPDATE query_cache SET hit_count = hit_count + 1 WHERE query_hash = :qh"),
            {"qh": qhash},
        )
        await self.session.commit()
        return row[0] if isinstance(row[0], dict) else json.loads(row[0])

    async def set(
        self,
        query: str,
        filters: Optional[Dict[str, Any]],
        response: Dict[str, Any],
    ) -> None:
        qhash = self._hash_query(query, filters)
        expires = datetime.utcnow() + timedelta(seconds=settings.QUERY_CACHE_TTL_SECONDS)
        await self.session.execute(
            text("""
                INSERT INTO query_cache (query_hash, query_text, filters, response, expires_at)
                VALUES (:qh, :qt, :f, :resp, :exp)
                ON CONFLICT (query_hash) DO UPDATE SET
                    response = EXCLUDED.response,
                    expires_at = EXCLUDED.expires_at,
                    hit_count = query_cache.hit_count + 1
            """),
            {
                "qh": qhash,
                "qt": query,
                "f": json.dumps(filters) if filters else None,
                "resp": json.dumps(response),
                "exp": expires,
            },
        )
        await self.session.commit()

    async def cleanup_expired(self) -> int:
        result = await self.session.execute(
            text("DELETE FROM query_cache WHERE expires_at < :now"),
            {"now": datetime.utcnow()},
        )
        await self.session.commit()
        return result.rowcount
