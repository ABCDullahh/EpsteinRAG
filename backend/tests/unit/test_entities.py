"""Unit tests for domain entities."""
from app.domain.entities import (
    AIAnswer,
    Citation,
    Document,
    FilterMetadata,
    SearchFilters,
    SearchHistoryEntry,
    SearchQuery,
    SearchResult,
    User,
)


def test_user_defaults():
    user = User(email="test@example.com", google_id="123")
    assert user.email == "test@example.com"
    assert user.google_id == "123"
    assert user.id is not None
    assert user.name is None


def test_document_creation():
    doc = Document(
        id="dataset8-EFTA00037442",
        efta_id="EFTA00037442",
        content="Some content here",
        doc_type="email",
        people=["epstein", "maxwell"],
    )
    assert doc.id == "dataset8-EFTA00037442"
    assert doc.efta_id == "EFTA00037442"
    assert len(doc.people) == 2
    assert doc.locations == []


def test_search_query_defaults():
    q = SearchQuery(text="epstein island")
    assert q.limit == 20
    assert q.semantic_weight == 0.7
    assert q.filters is None


def test_search_filters():
    f = SearchFilters(doc_types=["email", "flight_record"], people=["maxwell"])
    assert len(f.doc_types) == 2
    assert f.locations is None


def test_citation():
    c = Citation(
        document_id="abc",
        efta_id="EFTA00001",
        snippet="some text",
        relevance_score=0.95,
    )
    assert c.relevance_score == 0.95


def test_ai_answer():
    answer = AIAnswer(
        text="Based on documents...",
        citations=[
            Citation(
                document_id="d1",
                efta_id="EFTA00001",
                snippet="excerpt",
                relevance_score=0.9,
            )
        ],
    )
    assert len(answer.citations) == 1


def test_search_result():
    result = SearchResult(
        query="test",
        ai_answer=AIAnswer(text="answer"),
        total_results=0,
    )
    assert result.cached is False
    assert result.query_id is not None


def test_filter_metadata():
    fm = FilterMetadata()
    assert fm.doc_types == []
    assert fm.people == []
