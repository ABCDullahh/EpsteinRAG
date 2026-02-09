from __future__ import annotations

from typing import Any, AsyncGenerator, Dict, List

from google import genai
from google.genai import types

from app.config import settings
from app.domain.entities import Document
from app.utils.exceptions import ExternalServiceError
from app.utils.logger import get_logger

logger = get_logger(__name__)

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


# ── Embeddings ──────────────────────────────────────────────────────────────


async def embed_text(text: str) -> List[float]:
    """Generate a 768-dim embedding for a single text."""
    try:
        client = _get_client()
        result = client.models.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            contents=text,
        )
        return list(result.embeddings[0].values)
    except Exception as exc:
        logger.error("gemini_embed_error", error=str(exc))
        raise ExternalServiceError("Gemini Embedding", str(exc))


async def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed multiple texts in one call."""
    try:
        client = _get_client()
        result = client.models.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            contents=texts,
        )
        return [list(e.values) for e in result.embeddings]
    except Exception as exc:
        logger.error("gemini_embed_batch_error", error=str(exc))
        raise ExternalServiceError("Gemini Embedding", str(exc))


# ── LLM (Gemini 2.5 Pro) ───────────────────────────────────────────────────

SYSTEM_INSTRUCTION = """You are an expert research assistant specializing in the Jeffrey Epstein case files released by the U.S. Department of Justice.

Your job is to answer user questions accurately using ONLY the provided document excerpts as context.

Rules:
1. Answer in clear, factual language. Do not speculate beyond what the documents say.
2. Cite your sources using [1], [2], etc. matching the document numbers provided.
3. If the documents do not contain enough information, say so explicitly.
4. Include relevant names, dates, and locations from the documents.
5. Keep answers concise but thorough — aim for 2-4 paragraphs.
6. Always end with a list of document citations used."""


def _build_context(documents: List[Document]) -> str:
    parts: List[str] = []
    for i, doc in enumerate(documents, 1):
        text = doc.content_preview or doc.content[:500]
        meta = f"[Type: {doc.doc_type or 'unknown'}]"
        if doc.people:
            meta += f" [People: {', '.join(doc.people[:5])}]"
        parts.append(f"[{i}] EFTA: {doc.efta_id} {meta}\n{text}\n")
    return "\n---\n".join(parts)


async def generate_answer(query: str, documents: List[Document]) -> str:
    """Generate a complete answer with citations."""
    context = _build_context(documents)
    prompt = f"""Based on the following Epstein case documents, answer the user's question.

DOCUMENTS:
{context}

USER QUESTION: {query}

Provide a comprehensive answer with [N] citations referencing the document numbers above."""

    try:
        client = _get_client()
        response = client.models.generate_content(
            model=settings.GEMINI_LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.3,
                max_output_tokens=2048,
            ),
        )
        return response.text or ""
    except Exception as exc:
        logger.error("gemini_llm_error", error=str(exc))
        raise ExternalServiceError("Gemini LLM", str(exc))


async def generate_answer_stream(
    query: str, documents: List[Document]
) -> AsyncGenerator[str, None]:
    """Stream answer token-by-token via SSE."""
    context = _build_context(documents)
    prompt = f"""Based on the following Epstein case documents, answer the user's question.

DOCUMENTS:
{context}

USER QUESTION: {query}

Provide a comprehensive answer with [N] citations referencing the document numbers above."""

    try:
        client = _get_client()
        stream = client.models.generate_content_stream(
            model=settings.GEMINI_LLM_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.3,
                max_output_tokens=2048,
            ),
        )
        for chunk in stream:
            if chunk.text:
                yield chunk.text
    except Exception as exc:
        logger.error("gemini_stream_error", error=str(exc))
        raise ExternalServiceError("Gemini LLM", str(exc))
