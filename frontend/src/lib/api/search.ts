import type { Document, FilterMetadata, SearchFilters, SearchResult } from "@/lib/types";
import { apiFetch } from "./client";

export async function searchDocuments(
  query: string,
  filters?: SearchFilters,
  limit = 20
): Promise<SearchResult> {
  return apiFetch<SearchResult>("/search", {
    method: "POST",
    body: JSON.stringify({ query, filters, limit }),
  });
}

export async function getDocument(id: string): Promise<Document> {
  return apiFetch<Document>(`/documents/${encodeURIComponent(id)}`);
}

export async function getRelatedDocuments(
  id: string,
  limit = 5
): Promise<Document[]> {
  return apiFetch<Document[]>(
    `/documents/${encodeURIComponent(id)}/related?limit=${limit}`
  );
}

export async function getFilterMetadata(): Promise<FilterMetadata> {
  return apiFetch<FilterMetadata>("/documents/");
}
