"use client";

import { useCallback } from "react";
import { FileSearch, Shield, Search } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import FiltersSidebar from "@/components/search/FiltersSidebar";
import SearchResults from "@/components/search/SearchResults";
import SearchHistory from "@/components/search/SearchHistory";
import LoadingState from "@/components/search/LoadingState";
import { useSearch } from "@/lib/hooks/useSearch";
import { useFilters } from "@/lib/hooks/useFilters";

const EXAMPLE_QUERIES = [
  "Who visited Epstein Island in 2005?",
  "Flight records mentioning Bill Clinton",
  "Victim statements about Palm Beach",
];

export default function SearchPage() {
  const { results, isLoading, error, search, clear } = useSearch();
  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useFilters();

  const handleSearch = useCallback(
    (query: string) => {
      search(query, filters);
    },
    [search, filters]
  );

  const handleSelectHistory = useCallback(
    (query: string) => {
      search(query, filters);
    },
    [search, filters]
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Filters sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <FiltersSidebar
          filters={filters}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-6">
          {/* Search bar - sticky at top */}
          <div className="sticky top-0 z-10 -mx-6 bg-zinc-950/80 px-6 pb-4 pt-2 backdrop-blur-md">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Error state */}
          {error && (
            <div className="animate-reveal-up rounded-lg border border-red-800/50 bg-red-950/20 p-4">
              <p className="font-mono text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && <LoadingState />}

          {/* Results */}
          {!isLoading && results && <SearchResults results={results} />}

          {/* Empty state - no query yet */}
          {!isLoading && !results && !error && (
            <div className="flex flex-col items-center justify-center py-16">
              {/* Central icon */}
              <div className="animate-reveal-up mb-8 relative">
                <div className="flex size-20 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800">
                  <FileSearch className="size-9 text-zinc-600" />
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 animate-ping rounded-full ring-1 ring-amber-500/10" />
              </div>

              {/* Heading */}
              <h2 className="animate-reveal-up delay-1 mb-3 font-display text-2xl font-medium tracking-tight text-zinc-200">
                Interrogate the Epstein Files
              </h2>

              {/* Description */}
              <p className="animate-reveal-up delay-2 max-w-lg text-center font-mono text-xs leading-relaxed text-zinc-500">
                Query 44,886+ declassified documents from the DOJ Epstein
                investigation. AI-powered semantic search will analyze relevant
                documents and return an answer with inline citations.
              </p>

              {/* Classification stamp */}
              <div className="animate-reveal-up delay-3 mt-6">
                <div className="stamp inline-flex items-center gap-2 rounded border-2 border-amber-500/30 px-3 py-1.5">
                  <Shield className="size-3 text-amber-500/70" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-500/70">
                    Clearance Level: Public
                  </span>
                </div>
              </div>

              {/* Example queries */}
              <div className="animate-reveal-up delay-4 mt-10 w-full max-w-md space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="size-3 text-zinc-600" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                    Suggested Queries
                  </span>
                  <div className="h-px flex-1 bg-zinc-800" />
                </div>

                {EXAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className={`hover-lift group block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left transition-all hover:border-amber-600/30 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(217,119,6,0.06)] animate-slide-in delay-${Math.min(i + 5, 8)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-5 items-center justify-center rounded bg-zinc-800 font-mono text-[9px] font-bold text-zinc-600 transition-colors group-hover:bg-amber-600/10 group-hover:text-amber-500">
                        {i + 1}
                      </span>
                      <span className="font-mono text-xs text-zinc-400 transition-colors group-hover:text-amber-500">
                        &quot;{q}&quot;
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search history at bottom */}
          <div className="mt-8 pb-4">
            <SearchHistory onSelectQuery={handleSelectHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
