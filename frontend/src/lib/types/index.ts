export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  google_id: string;
  created_at: string;
}

export interface Citation {
  document_id: string;
  efta_id: string;
  snippet: string;
  doc_type: string | null;
  relevance_score: number;
}

export interface AIAnswer {
  text: string;
  citations: Citation[];
}

export interface Document {
  id: string;
  efta_id: string;
  content?: string;
  content_preview: string | null;
  doc_type: string | null;
  people: string[];
  locations: string[];
  aircraft: string[];
  evidence_types: string[];
  pages: number | null;
  source: string | null;
  dataset: string | null;
  file_path: string | null;
  relevance_score: number | null;
  match_type: string | null;
  source_url?: string | null;
}

export interface SearchFilters {
  doc_types?: string[];
  people?: string[];
  locations?: string[];
  evidence_types?: string[];
}

export interface SearchResult {
  query_id: string;
  query: string;
  ai_answer: AIAnswer;
  documents: Document[];
  total_results: number;
  search_time_ms: number | null;
  cached: boolean;
}

export interface HistoryEntry {
  id: string;
  query: string;
  filters: Record<string, unknown> | null;
  result_count: number;
  search_time_ms: number | null;
  created_at: string;
}

export interface FilterMetadata {
  doc_types: { value: string; count: number }[];
  people: { value: string; count: number }[];
  locations: { value: string; count: number }[];
  evidence_types: { value: string; count: number }[];
}

export interface SSEEvent {
  type: "answer_chunk" | "citation" | "document" | "complete";
  content?: string;
  document_id?: string;
  efta_id?: string;
  snippet?: string;
  document?: Document;
  total_results?: number;
}
