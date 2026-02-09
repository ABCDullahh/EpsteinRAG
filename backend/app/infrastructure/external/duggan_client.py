from __future__ import annotations

from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import settings
from app.domain.entities import Document
from app.utils.exceptions import ExternalServiceError
from app.utils.logger import get_logger

logger = get_logger(__name__)

TIMEOUT = 30.0


class DugganClient:
    """Client for the DugganUSA Epstein Files search API (Meilisearch-backed)."""

    def __init__(self) -> None:
        self.base_url = settings.DUGGAN_API_BASE_URL

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def search(
        self,
        query: str,
        limit: int = 100,
        filter_expr: Optional[str] = None,
    ) -> List[Document]:
        params: Dict[str, Any] = {
            "q": query,
            "indexes": "epstein_files",
            "limit": limit,
        }
        if filter_expr:
            params["filter"] = filter_expr

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                resp = await client.get(f"{self.base_url}/search", params=params)
                resp.raise_for_status()
                data = resp.json()
        except httpx.HTTPError as exc:
            logger.error("duggan_api_error", error=str(exc))
            raise ExternalServiceError("DugganUSA API", str(exc))

        if not data.get("success"):
            raise ExternalServiceError("DugganUSA API", "unsuccessful response")

        hits = data.get("data", {}).get("hits", [])
        return [self._hit_to_document(h) for h in hits]

    def build_filter(
        self,
        doc_types: Optional[List[str]] = None,
        people: Optional[List[str]] = None,
        locations: Optional[List[str]] = None,
        evidence_types: Optional[List[str]] = None,
    ) -> Optional[str]:
        parts: List[str] = []
        if doc_types:
            clauses = " OR ".join(f'doc_type="{v}"' for v in doc_types)
            parts.append(f"({clauses})")
        # People, locations, evidence_types are arrays in Meilisearch —
        # filter syntax: field = "value"
        for field, values in [
            ("people", people),
            ("locations", locations),
            ("evidence_types", evidence_types),
        ]:
            if values:
                clauses = " OR ".join(f'{field}="{v}"' for v in values)
                parts.append(f"({clauses})")
        return " AND ".join(parts) if parts else None

    @staticmethod
    def _hit_to_document(hit: Dict[str, Any]) -> Document:
        content = hit.get("content", "")
        preview = hit.get("content_preview", content[:300] if content else "")
        return Document(
            id=hit.get("id", ""),
            efta_id=hit.get("efta_id", ""),
            content=content,
            content_preview=preview,
            doc_type=hit.get("doc_type"),
            people=hit.get("people", []),
            locations=hit.get("locations", []),
            aircraft=hit.get("aircraft", []),
            evidence_types=hit.get("evidence_types", []),
            pages=hit.get("pages"),
            source=hit.get("source"),
            dataset=hit.get("dataset"),
            file_path=hit.get("file_path"),
        )
