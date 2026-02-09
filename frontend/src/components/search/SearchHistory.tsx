"use client";

import { useState, useEffect } from "react";
import {
  History,
  ChevronDown,
  ChevronUp,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHistory, clearHistory } from "@/lib/api/history";
import type { HistoryEntry } from "@/lib/types";

interface SearchHistoryProps {
  onSelectQuery: (query: string) => void;
}

export default function SearchHistory({ onSelectQuery }: SearchHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getHistory(10);
        setEntries(data.history);
      } catch {
        // Not logged in or no history available
      }
    };
    load();
  }, []);

  if (entries.length === 0) return null;

  const handleClear = async () => {
    await clearHistory();
    setEntries([]);
  };

  return (
    <div className="animate-reveal-up delay-3 rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50"
      >
        <History className="size-3.5 text-zinc-600 transition-colors group-hover:text-amber-500/70" />
        <span className="flex-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Recent Searches ({entries.length})
        </span>
        <div className="flex size-5 items-center justify-center rounded bg-zinc-800 transition-colors group-hover:bg-zinc-700">
          {expanded ? (
            <ChevronUp className="size-3 text-zinc-500" />
          ) : (
            <ChevronDown className="size-3 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded entries list */}
      {expanded && (
        <div className="border-t border-zinc-800">
          <div className="space-y-0.5 p-2">
            {entries.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => onSelectQuery(entry.query)}
                className={`group/entry flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left transition-all hover:bg-zinc-800/80 hover:shadow-[inset_2px_0_0_0_theme(colors.amber.600)] animate-slide-in delay-${Math.min(i + 1, 8)}`}
              >
                <Clock className="size-3 shrink-0 text-zinc-700 transition-colors group-hover/entry:text-amber-500/60" />
                <span className="flex-1 truncate font-mono text-xs text-zinc-400 transition-colors group-hover/entry:text-zinc-200">
                  {entry.query}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">
                    {entry.result_count} results
                  </span>
                  {entry.search_time_ms != null && (
                    <span className="font-mono text-[9px] text-zinc-700">
                      {entry.search_time_ms}ms
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Clear history */}
          <div className="border-t border-zinc-800/50 p-2">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClear}
              className="w-full font-mono text-[9px] uppercase tracking-wider text-zinc-600 hover:text-red-400 hover:bg-red-500/5"
            >
              <Trash2 className="size-3" />
              Clear History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
