"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  initialQuery = "",
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="animate-reveal-up">
      {/* Main search container */}
      <div className="focus-amber relative overflow-hidden rounded border border-zinc-800 bg-[#0a0a0a] transition-all">
        {/* Amber accent line at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

        <div className="flex items-center">
          {/* Icon */}
          <div className="flex items-center pl-4">
            {isLoading ? (
              <Loader2 className="size-5 animate-spin text-amber-500" />
            ) : (
              <Search className="size-5 text-zinc-600 transition-colors group-focus-within:text-amber-500" />
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Interrogate the Epstein files..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-4 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          {/* Clear button */}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-1 flex size-7 items-center justify-center rounded text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="m-2 rounded bg-amber-600 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-950 transition-all hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(217,119,6,0.25)] disabled:opacity-30"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>SEARCHING</span>
              </>
            ) : (
              "SEARCH"
            )}
          </Button>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="mt-2.5 flex items-center justify-end">
        <span className="font-mono text-[9px] tracking-wide text-zinc-600">
          Press{" "}
          <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
            Enter
          </kbd>{" "}
          to search
        </span>
      </div>
    </form>
  );
}
