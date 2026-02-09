"""Unit tests for DugganUSA client filter builder."""
from app.infrastructure.external.duggan_client import DugganClient


def test_build_filter_none():
    client = DugganClient()
    assert client.build_filter() is None


def test_build_filter_doc_types():
    client = DugganClient()
    f = client.build_filter(doc_types=["email", "flight_record"])
    assert 'doc_type="email"' in f
    assert 'doc_type="flight_record"' in f
    assert "OR" in f


def test_build_filter_combined():
    client = DugganClient()
    f = client.build_filter(doc_types=["email"], people=["maxwell"])
    assert "AND" in f
    assert 'doc_type="email"' in f
    assert 'people="maxwell"' in f


def test_hit_to_document():
    hit = {
        "id": "dataset8-EFTA00037442",
        "efta_id": "EFTA00037442",
        "content": "Document text",
        "content_preview": "Preview text",
        "doc_type": "email",
        "people": ["epstein"],
        "locations": ["new_york"],
        "aircraft": [],
        "evidence_types": ["correspondence"],
        "pages": 2,
        "source": "DOJ EFTA dataset8",
        "dataset": "dataset8",
        "file_path": "/dataset8/VOL00008/IMAGES/0010/EFTA00037442.pdf",
    }
    doc = DugganClient._hit_to_document(hit)
    assert doc.id == "dataset8-EFTA00037442"
    assert doc.efta_id == "EFTA00037442"
    assert doc.doc_type == "email"
    assert doc.people == ["epstein"]
    assert doc.pages == 2
