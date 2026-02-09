from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class User(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    google_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None


class Document(BaseModel):
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
    relevance_score: Optional[float] = None
    match_type: Optional[str] = None


class Citation(BaseModel):
    document_id: str
    efta_id: str
    snippet: str
    doc_type: Optional[str] = None
    relevance_score: float = 0.0


class AIAnswer(BaseModel):
    text: str
    citations: List[Citation] = Field(default_factory=list)


class SearchFilters(BaseModel):
    doc_types: Optional[List[str]] = None
    people: Optional[List[str]] = None
    locations: Optional[List[str]] = None
    evidence_types: Optional[List[str]] = None


class SearchQuery(BaseModel):
    text: str
    filters: Optional[SearchFilters] = None
    limit: int = 20
    semantic_weight: float = 0.7


class SearchResult(BaseModel):
    query_id: UUID = Field(default_factory=uuid4)
    query: str
    ai_answer: AIAnswer
    documents: List[Document] = Field(default_factory=list)
    total_results: int = 0
    search_time_ms: Optional[int] = None
    cached: bool = False


class SearchHistoryEntry(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    user_id: UUID
    query: str
    filters: Optional[Dict[str, Any]] = None
    result_count: int = 0
    search_time_ms: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class FilterMetadata(BaseModel):
    doc_types: List[Dict[str, Any]] = Field(default_factory=list)
    people: List[Dict[str, Any]] = Field(default_factory=list)
    locations: List[Dict[str, Any]] = Field(default_factory=list)
    evidence_types: List[Dict[str, Any]] = Field(default_factory=list)
