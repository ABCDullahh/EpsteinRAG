"use client";

import { useState, useCallback } from "react";
import type { SearchFilters } from "@/lib/types";

export function useFilters() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const updateFilter = useCallback(
    (key: keyof SearchFilters, values: string[]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: values.length > 0 ? values : undefined,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v.length > 0
  );

  return { filters, updateFilter, clearFilters, hasActiveFilters };
}
