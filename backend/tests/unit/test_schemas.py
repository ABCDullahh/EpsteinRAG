"""Unit tests for API schemas."""
import pytest
from pydantic import ValidationError

from app.api.schemas.search_schemas import SearchRequest
from app.api.schemas.auth_schemas import GoogleLoginRequest


def test_search_request_valid():
    req = SearchRequest(query="epstein island")
    assert req.limit == 20
    assert req.semantic_weight == 0.7


def test_search_request_min_length():
    with pytest.raises(ValidationError):
        SearchRequest(query="a")  # min_length=2


def test_search_request_max_limit():
    with pytest.raises(ValidationError):
        SearchRequest(query="test", limit=200)  # max=100


def test_search_request_with_filters():
    req = SearchRequest(
        query="flight logs",
        filters={"doc_types": ["flight_record"]},
        limit=50,
    )
    assert req.filters.doc_types == ["flight_record"]
    assert req.limit == 50


def test_google_login_code():
    req = GoogleLoginRequest(code="abc123")
    assert req.code == "abc123"
    assert req.id_token is None


def test_google_login_id_token():
    req = GoogleLoginRequest(id_token="token_xyz")
    assert req.id_token == "token_xyz"
