from __future__ import annotations

from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.domain.entities import SearchFilters


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=1000)
    filters: Optional[SearchFilters] = None
    limit: int = Field(default=20, ge=1, le=100)
    semantic_weight: float = Field(default=0.7, ge=0.0, le=1.0)


class CitationResponse(BaseModel):
    document_id: str
    efta_id: str
    snippet: str
    doc_type: Optional[str] = None
    relevance_score: float


class AIAnswerResponse(BaseModel):
    text: str
    citations: List[CitationResponse]


class DocumentResponse(BaseModel):
    id: str
    efta_id: str
    content_preview: Optional[str] = None
    doc_type: Optional[str] = None
    people: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    aircraft: List[str] = Field(default_factory=list)
    evidence_types: List[str] = Field(default_factory=list)
    pages: Optional[int] = None
    source: Optional[str] = None
    dataset: Optional[str] = None
    file_path: Optional[str] = None
    relevance_score: Optional[float] = None
    match_type: Optional[str] = None


class SearchResponse(BaseModel):
    query_id: UUID
    query: str
    ai_answer: AIAnswerResponse
    documents: List[DocumentResponse]
    total_results: int
    search_time_ms: Optional[int] = None
    cached: bool = False


class DocumentDetailResponse(BaseModel):
    id: str
    efta_id: str
    content: str
    content_preview: Optional[str] = None
    doc_type: Optional[str] = None
    people: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    aircraft: List[str] = Field(default_factory=list)
    evidence_types: List[str] = Field(default_factory=list)
    pages: Optional[int] = None
    source: Optional[str] = None
    dataset: Optional[str] = None
    file_path: Optional[str] = None
    source_url: Optional[str] = None


class FilterMetadataResponse(BaseModel):
    doc_types: List[Dict[str, Any]]
    people: List[Dict[str, Any]]
    locations: List[Dict[str, Any]]
    evidence_types: List[Dict[str, Any]]
