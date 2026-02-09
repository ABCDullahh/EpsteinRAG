"use client";

import { Clock, Zap, Database, FileSearch } from "lucide-react";
import type { SearchResult } from "@/lib/types";
import AIAnswer from "./AIAnswer";
import DocumentCard from "./DocumentCard";

interface SearchResultsProps {
  results: SearchResult;
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="animate-reveal-up flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
          <Database className="size-3 text-zinc-600" />
          <span className="font-mono text-[10px] tabular-nums text-zinc-400">
            {results.total_results.toLocaleString()} results
          </span>
        </div>

        {results.search_time_ms != null && (
          <div className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            <Clock className="size-3 text-zinc-600" />
            <span className="font-mono text-[10px] tabular-nums text-zinc-400">
              {results.search_time_ms}ms
            </span>
          </div>
        )}

        {results.cached && (
          <div className="flex items-center gap-1.5 rounded border border-emerald-900/40 bg-emerald-950/20 px-2.5 py-1">
            <Zap className="size-3 text-emerald-500" />
            <span className="text-terminal font-mono text-[10px]">
              Cached
            </span>
          </div>
        )}
      </div>

      {/* AI Answer */}
      <AIAnswer answer={results.ai_answer} />

      {/* Source Documents heading */}
      <div className="animate-reveal-up delay-2 flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Source Documents
        </span>
        <div className="section-line flex-1" />
      </div>

      {/* Document cards grid */}
      {results.documents.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {results.documents.map((doc, i) => {
            const delayClass =
              i < 8 ? `delay-${i + 1}` : "delay-8";
            return (
              <div
                key={doc.id}
                className={`animate-reveal-up ${delayClass}`}
              >
                <DocumentCard document={doc} rank={i + 1} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="animate-reveal-up delay-3 rounded border border-zinc-800 bg-zinc-900/30 py-16 text-center">
          <FileSearch className="mx-auto mb-3 size-8 text-zinc-700" />
          <p className="font-mono text-sm text-zinc-500">
            No documents found matching your query.
          </p>
          <p className="mt-1 font-mono text-[10px] text-zinc-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
