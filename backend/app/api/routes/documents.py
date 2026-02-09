from typing import Optional

from fastapi import APIRouter, Depends

from app.api.dependencies import get_document_repo, get_optional_user
from app.api.schemas.search_schemas import DocumentDetailResponse, DocumentResponse, FilterMetadataResponse
from app.domain.entities import User
from app.infrastructure.repositories.document_repo import DocumentRepository
from app.utils.exceptions import NotFoundError

router = APIRouter(tags=["documents"])


@router.get("/{document_id}", response_model=DocumentDetailResponse)
async def get_document(
    document_id: str,
    user: Optional[User] = Depends(get_optional_user),
    doc_repo: DocumentRepository = Depends(get_document_repo),
):
    doc = await doc_repo.get_by_id(document_id)
    if not doc:
        raise NotFoundError("Document")
    return DocumentDetailResponse(
        id=doc.id,
        efta_id=doc.efta_id,
        content=doc.content,
        content_preview=doc.content_preview,
        doc_type=doc.doc_type,
        people=doc.people,
        locations=doc.locations,
        aircraft=doc.aircraft,
        evidence_types=doc.evidence_types,
        pages=doc.pages,
        source=doc.source,
        dataset=doc.dataset,
        file_path=doc.file_path,
        source_url=f"https://www.justice.gov/epstein/files/{doc.file_path}" if doc.file_path else None,
    )


@router.get("/{document_id}/related", response_model=list[DocumentResponse])
async def get_related_documents(
    document_id: str,
    limit: int = 5,
    user: Optional[User] = Depends(get_optional_user),
    doc_repo: DocumentRepository = Depends(get_document_repo),
):
    docs = await doc_repo.find_related(document_id, limit=limit)
    return [
        DocumentResponse(
            id=d.id,
            efta_id=d.efta_id,
            content_preview=d.content_preview,
            doc_type=d.doc_type,
            people=d.people,
            locations=d.locations,
            aircraft=d.aircraft,
            evidence_types=d.evidence_types,
            pages=d.pages,
            source=d.source,
            dataset=d.dataset,
            file_path=d.file_path,
            relevance_score=d.relevance_score,
        )
        for d in docs
    ]


@router.get("/", response_model=FilterMetadataResponse)
async def get_filter_metadata(
    user: Optional[User] = Depends(get_optional_user),
    doc_repo: DocumentRepository = Depends(get_document_repo),
):
    return await doc_repo.get_filter_metadata()
