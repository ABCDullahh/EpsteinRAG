from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities import Document, FilterMetadata
from app.utils.logger import get_logger

logger = get_logger(__name__)


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def upsert(self, doc: Document, embedding: Optional[List[float]] = None) -> None:
        emb_param = json.dumps(embedding) if embedding else None
        await self.session.execute(
            text("""
                INSERT INTO documents (id, efta_id, content, content_preview, doc_type,
                    people, locations, aircraft, evidence_types, pages, source,
                    dataset, file_path, embedding)
                VALUES (:id, :efta_id, :content, :preview, :doc_type,
                    :people, :locations, :aircraft, :evidence_types, :pages,
                    :source, :dataset, :file_path, CAST(:embedding AS vector))
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    content_preview = EXCLUDED.content_preview,
                    embedding = EXCLUDED.embedding
            """),
            {
                "id": doc.id,
                "efta_id": doc.efta_id,
                "content": doc.content,
                "preview": doc.content_preview,
                "doc_type": doc.doc_type,
                "people": doc.people,
                "locations": doc.locations,
                "aircraft": doc.aircraft,
                "evidence_types": doc.evidence_types,
                "pages": doc.pages,
                "source": doc.source,
                "dataset": doc.dataset,
                "file_path": doc.file_path,
                "embedding": emb_param,
            },
        )
        await self.session.commit()

    async def get_by_id(self, doc_id: str) -> Optional[Document]:
        result = await self.session.execute(
            text("SELECT * FROM documents WHERE id = :id"), {"id": doc_id}
        )
        row = result.mappings().fetchone()
        if not row:
            return None
        return self._row_to_document(row)

    async def get_by_efta_id(self, efta_id: str) -> Optional[Document]:
        result = await self.session.execute(
            text("SELECT * FROM documents WHERE efta_id = :efta_id LIMIT 1"),
            {"efta_id": efta_id},
        )
        row = result.mappings().fetchone()
        if not row:
            return None
        return self._row_to_document(row)

    async def vector_search(
        self, embedding: List[float], limit: int = 20
    ) -> List[Document]:
        emb_str = json.dumps(embedding)
        result = await self.session.execute(
            text("""
                SELECT *, 1 - (embedding <=> CAST(:emb AS vector)) AS score
                FROM documents
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> CAST(:emb AS vector)
                LIMIT :limit
            """),
            {"emb": emb_str, "limit": limit},
        )
        rows = result.mappings().fetchall()
        docs = []
        for r in rows:
            doc = self._row_to_document(r)
            doc.relevance_score = float(r.get("score", 0))
            doc.match_type = "semantic"
            docs.append(doc)
        return docs

    async def keyword_search(self, query: str, limit: int = 20) -> List[Document]:
        result = await self.session.execute(
            text("""
                SELECT *, similarity(content, :query) AS score
                FROM documents
                WHERE content % :query
                ORDER BY score DESC
                LIMIT :limit
            """),
            {"query": query, "limit": limit},
        )
        rows = result.mappings().fetchall()
        docs = []
        for r in rows:
            doc = self._row_to_document(r)
            doc.relevance_score = float(r.get("score", 0))
            doc.match_type = "keyword"
            docs.append(doc)
        return docs

    async def find_related(self, doc_id: str, limit: int = 5) -> List[Document]:
        """Find documents similar to the given document via vector similarity."""
        result = await self.session.execute(
            text("SELECT embedding FROM documents WHERE id = :id"),
            {"id": doc_id},
        )
        row = result.fetchone()
        if not row or row[0] is None:
            return []
        emb_str = row[0] if isinstance(row[0], str) else json.dumps(row[0])
        result = await self.session.execute(
            text("""
                SELECT *, 1 - (embedding <=> CAST(:emb AS vector)) AS score
                FROM documents
                WHERE embedding IS NOT NULL AND id != :id
                ORDER BY embedding <=> CAST(:emb AS vector)
                LIMIT :limit
            """),
            {"emb": emb_str, "id": doc_id, "limit": limit},
        )
        rows = result.mappings().fetchall()
        docs = []
        for r in rows:
            doc = self._row_to_document(r)
            doc.relevance_score = float(r.get("score", 0))
            docs.append(doc)
        return docs

    async def count(self) -> int:
        result = await self.session.execute(text("SELECT count(*) FROM documents"))
        return result.scalar() or 0

    async def get_filter_metadata(self) -> FilterMetadata:
        doc_types: List[Dict[str, Any]] = []
        result = await self.session.execute(
            text("""
                SELECT doc_type AS value, count(*) AS count
                FROM documents WHERE doc_type IS NOT NULL
                GROUP BY doc_type ORDER BY count DESC LIMIT 50
            """)
        )
        for r in result.mappings().fetchall():
            doc_types.append({"value": r["value"], "count": r["count"]})

        people: List[Dict[str, Any]] = []
        result = await self.session.execute(
            text("""
                SELECT unnest(people) AS value, count(*) AS count
                FROM documents WHERE array_length(people, 1) > 0
                GROUP BY value ORDER BY count DESC LIMIT 50
            """)
        )
        for r in result.mappings().fetchall():
            people.append({"value": r["value"], "count": r["count"]})

        locations: List[Dict[str, Any]] = []
        result = await self.session.execute(
            text("""
                SELECT unnest(locations) AS value, count(*) AS count
                FROM documents WHERE array_length(locations, 1) > 0
                GROUP BY value ORDER BY count DESC LIMIT 50
            """)
        )
        for r in result.mappings().fetchall():
            locations.append({"value": r["value"], "count": r["count"]})

        evidence: List[Dict[str, Any]] = []
        result = await self.session.execute(
            text("""
                SELECT unnest(evidence_types) AS value, count(*) AS count
                FROM documents WHERE array_length(evidence_types, 1) > 0
                GROUP BY value ORDER BY count DESC LIMIT 50
            """)
        )
        for r in result.mappings().fetchall():
            evidence.append({"value": r["value"], "count": r["count"]})

        return FilterMetadata(
            doc_types=doc_types,
            people=people,
            locations=locations,
            evidence_types=evidence,
        )

    @staticmethod
    def _row_to_document(row: Any) -> Document:
        return Document(
            id=row["id"],
            efta_id=row["efta_id"],
            content=row["content"],
            content_preview=row.get("content_preview"),
            doc_type=row.get("doc_type"),
            people=row.get("people") or [],
            locations=row.get("locations") or [],
            aircraft=row.get("aircraft") or [],
            evidence_types=row.get("evidence_types") or [],
            pages=row.get("pages"),
            source=row.get("source"),
            dataset=row.get("dataset"),
            file_path=row.get("file_path"),
        )
