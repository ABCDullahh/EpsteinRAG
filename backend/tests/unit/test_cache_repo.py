"""Unit tests for cache repository hash function."""
from app.infrastructure.repositories.cache_repo import CacheRepository


def test_hash_deterministic():
    h1 = CacheRepository._hash_query("epstein island")
    h2 = CacheRepository._hash_query("epstein island")
    assert h1 == h2


def test_hash_case_insensitive():
    h1 = CacheRepository._hash_query("Epstein Island")
    h2 = CacheRepository._hash_query("epstein island")
    assert h1 == h2


def test_hash_different_queries():
    h1 = CacheRepository._hash_query("epstein island")
    h2 = CacheRepository._hash_query("flight log")
    assert h1 != h2


def test_hash_with_filters():
    h1 = CacheRepository._hash_query("test", {"doc_types": ["email"]})
    h2 = CacheRepository._hash_query("test", {"doc_types": ["email"]})
    h3 = CacheRepository._hash_query("test")
    assert h1 == h2
    assert h1 != h3
