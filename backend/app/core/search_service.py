from __future__ import annotations

import time
from typing import Any, AsyncGenerator, Dict, List

from app.domain.entities import (
    AIAnswer,
    Citation,
    Document,
    SearchFilters,
    SearchQuery,
    SearchResult,
)
from app.infrastructure.external import duggan_client, gemini_client
from app.infrastructure.repositories.document_repo import DocumentRepository
from app.infrastructure.repositories.cache_repo import CacheRepository
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SearchService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        cache_repo: CacheRepository,
    ) -> None:
        self.doc_repo = document_repo
        self.cache_repo = cache_repo
        self.duggan = duggan_client.DugganClient()

    async def search(self, query: SearchQuery) -> SearchResult:
        start = time.time()

        # 1 — check cache
        filters_dict = query.filters.model_dump(exclude_none=True) if query.filters else None
        cached = await self.cache_repo.get(query.text, filters_dict)
        if cached:
            logger.info("cache_hit", query=query.text)
            cached["cached"] = True
            result = SearchResult(**cached)
            result.search_time_ms = int((time.time() - start) * 1000)
            return result

        # 2 — try local vector search first
        documents: List[Document] = []
        local_count = await self.doc_repo.count()
        if local_count > 100:
            embedding = await gemini_client.embed_text(query.text)
            documents = await self.doc_repo.vector_search(embedding, limit=query.limit)

        # 3 — if not enough local results, hit DugganUSA API
        if len(documents) < query.limit:
            filter_expr = self._build_duggan_filter(query.filters)
            api_docs = await self.duggan.search(
                query=query.text,
                limit=min(query.limit * 3, 100),
                filter_expr=filter_expr,
            )
            # Cache docs without embeddings first (fast), embed later
            for doc in api_docs:
                try:
                    await self.doc_repo.upsert(doc, embedding=None)
                except Exception:
                    pass
            # Merge & deduplicate
            seen_ids = {d.id for d in documents}
            for d in api_docs:
                if d.id not in seen_ids:
                    documents.append(d)
                    seen_ids.add(d.id)

        # 4 — DugganUSA already returns semantically ranked results, just trim
        documents = documents[: query.limit]

        # 5 — generate AI answer from top docs
        context_docs = documents[:5]
        answer_text = await gemini_client.generate_answer(query.text, context_docs)
        citations = [
            Citation(
                document_id=d.id,
                efta_id=d.efta_id,
                snippet=d.content_preview or d.content[:200],
                doc_type=d.doc_type,
                relevance_score=d.relevance_score or 0.0,
            )
            for d in context_docs
        ]
        ai_answer = AIAnswer(text=answer_text, citations=citations)

        elapsed = int((time.time() - start) * 1000)
        result = SearchResult(
            query=query.text,
            ai_answer=ai_answer,
            documents=documents,
            total_results=len(documents),
            search_time_ms=elapsed,
        )

        # 6 — cache result
        await self.cache_repo.set(
            query.text,
            filters_dict,
            result.model_dump(mode="json"),
        )

        return result

    async def search_stream(
        self, query: SearchQuery
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Streaming variant — yields SSE events."""
        # Fetch documents (same logic, abbreviated)
        filter_expr = self._build_duggan_filter(query.filters)
        documents = await self.duggan.search(
            query=query.text,
            limit=min(query.limit * 3, 100),
            filter_expr=filter_expr,
        )
        # Cache docs without embeddings (fast)
        for doc in documents:
            try:
                await self.doc_repo.upsert(doc, embedding=None)
            except Exception:
                pass
        documents = documents[: query.limit]

        context_docs = documents[:5]

        # Stream AI answer
        async for chunk in gemini_client.generate_answer_stream(query.text, context_docs):
            yield {"type": "answer_chunk", "content": chunk}

        # Send citations
        for d in context_docs:
            yield {
                "type": "citation",
                "document_id": d.id,
                "efta_id": d.efta_id,
                "snippet": d.content_preview or d.content[:200],
            }

        # Send document list
        for d in documents:
            yield {"type": "document", "document": d.model_dump(mode="json")}

        yield {"type": "complete", "total_results": len(documents)}

    # ── helpers ──────────────────────────────────────────────────────────

    async def _cache_documents(self, docs: List[Document]) -> None:
        """Store documents + embeddings in local DB for progressive caching."""
        texts = [d.content_preview or d.content[:500] for d in docs]
        if not texts:
            return
        try:
            embeddings = await gemini_client.embed_batch(texts)
            for doc, emb in zip(docs, embeddings):
                await self.doc_repo.upsert(doc, embedding=emb)
        except Exception:
            logger.warning("cache_documents_failed", exc_info=True)

    async def _rerank(
        self, query: str, docs: List[Document], limit: int
    ) -> List[Document]:
        """Re-rank documents using cosine similarity of embeddings."""
        import numpy as np

        query_emb = await gemini_client.embed_text(query)
        query_vec = np.array(query_emb)

        texts = [d.content_preview or d.content[:500] for d in docs]
        doc_embs = await gemini_client.embed_batch(texts)

        scored: List[tuple[float, Document]] = []
        for doc, emb in zip(docs, doc_embs):
            vec = np.array(emb)
            cos = float(np.dot(query_vec, vec) / (np.linalg.norm(query_vec) * np.linalg.norm(vec) + 1e-9))
            doc.relevance_score = cos
            doc.match_type = "hybrid"
            scored.append((cos, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [d for _, d in scored[:limit]]

    @staticmethod
    def _build_duggan_filter(filters: SearchFilters | None) -> str | None:
        if not filters:
            return None
        client = duggan_client.DugganClient()
        return client.build_filter(
            doc_types=filters.doc_types,
            people=filters.people,
            locations=filters.locations,
            evidence_types=filters.evidence_types,
        )
