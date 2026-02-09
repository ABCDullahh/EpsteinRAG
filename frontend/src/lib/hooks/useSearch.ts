"use client";

import { useState, useCallback } from "react";
import type { SearchFilters, SearchResult } from "@/lib/types";
import { searchDocuments } from "@/lib/api/search";

export function useSearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string, filters?: SearchFilters, limit = 20) => {
      if (!query.trim()) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchDocuments(query, filters, limit);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, isLoading, error, search, clear };
}
