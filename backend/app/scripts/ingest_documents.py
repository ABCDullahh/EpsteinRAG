"""
Pre-load documents from DugganUSA API into the local PostgreSQL database.

Usage:
    python -m app.scripts.ingest_documents --queries "epstein island" "flight log" "maxwell"
"""
from __future__ import annotations

import asyncio
import sys
from typing import List

from app.config import settings
from app.infrastructure.database import async_session, init_db
from app.infrastructure.external.duggan_client import DugganClient
from app.infrastructure.external import gemini_client
from app.infrastructure.repositories.document_repo import DocumentRepository
from app.utils.logger import get_logger, setup_logging

logger = get_logger(__name__)


async def ingest(queries: List[str], limit_per_query: int = 100) -> None:
    setup_logging(debug=True)
    await init_db()

    duggan = DugganClient()
    total_stored = 0

    async with async_session() as session:
        doc_repo = DocumentRepository(session)

        for q in queries:
            logger.info("fetching", query=q, limit=limit_per_query)
            docs = await duggan.search(query=q, limit=limit_per_query)
            if not docs:
                logger.warning("no_results", query=q)
                continue

            texts = [d.content_preview or d.content[:500] for d in docs]
            logger.info("embedding", count=len(texts))
            embeddings = await gemini_client.embed_batch(texts)

            for doc, emb in zip(docs, embeddings):
                await doc_repo.upsert(doc, embedding=emb)
                total_stored += 1

            logger.info("stored", query=q, count=len(docs))
            await asyncio.sleep(1)  # respect rate limits

    logger.info("ingestion_complete", total=total_stored)


if __name__ == "__main__":
    default_queries = [
        "epstein island",
        "flight log",
        "ghislaine maxwell",
        "prince andrew",
        "bill clinton",
        "victim statement",
        "palm beach",
        "little st james",
        "massage",
        "trafficking",
    ]

    queries = sys.argv[1:] if len(sys.argv) > 1 else default_queries
    asyncio.run(ingest(queries))
