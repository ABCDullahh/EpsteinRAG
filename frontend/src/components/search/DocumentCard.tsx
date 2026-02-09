import Link from "next/link";
import { User, MapPin, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/types";

const DOC_TYPE_COLORS: Record<string, string> = {
  email: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  flight_record: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  law_enforcement: "bg-red-500/10 text-red-400 border-red-500/20",
  victim_statement: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  court_document: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  correspondence: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  financial: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

function getDocTypeColor(type: string | null): string {
  if (!type) return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  return (
    DOC_TYPE_COLORS[type.toLowerCase()] ??
    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  );
}

function formatRank(rank: number): string {
  return `#${String(rank).padStart(2, "0")}`;
}

interface DocumentCardProps {
  document: Document;
  rank?: number;
}

export default function DocumentCard({ document, rank }: DocumentCardProps) {
  const score = document.relevance_score;
  const scorePercent = score != null ? Math.min(score * 100, 100) : 0;
  const visiblePeople = document.people.slice(0, 2);
  const extraPeopleCount = document.people.length - 2;
  const visibleLocations = document.locations.slice(0, 2);

  return (
    <Link
      href={`/documents/${encodeURIComponent(document.id)}`}
      className="dossier-card group block rounded p-4"
    >
      {/* Top row: rank, EFTA ID, doc type */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {rank != null && (
            <span className="flex items-center justify-center rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-zinc-500">
              {formatRank(rank)}
            </span>
          )}
          <span className="font-mono text-xs font-semibold tracking-wide text-amber-500">
            {document.efta_id}
          </span>
        </div>

        <Badge
          variant="outline"
          className={`border font-mono text-[9px] uppercase tracking-wider ${getDocTypeColor(document.doc_type)}`}
        >
          <FileText className="mr-0.5 size-2.5" />
          {document.doc_type?.replace(/_/g, " ") ?? "unknown"}
        </Badge>
      </div>

      {/* Content preview */}
      <p className="mb-3 line-clamp-3 font-mono text-[11px] leading-relaxed text-zinc-400">
        {document.content_preview || "No preview available for this document."}
      </p>

      {/* Metadata tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {visiblePeople.map((person) => (
          <span
            key={person}
            className="flex items-center gap-1 rounded bg-zinc-800/60 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400"
          >
            <User className="size-2.5 text-zinc-500" />
            {person.replace(/_/g, " ")}
          </span>
        ))}
        {extraPeopleCount > 0 && (
          <span className="rounded bg-zinc-800/40 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600">
            +{extraPeopleCount} more
          </span>
        )}
        {visibleLocations.map((location) => (
          <span
            key={location}
            className="flex items-center gap-1 rounded bg-zinc-800/60 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400"
          >
            <MapPin className="size-2.5 text-zinc-500" />
            {location.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {/* Bottom: relevance bar + dataset + arrow */}
      <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3">
        <div className="flex items-center gap-3">
          {score != null && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="animate-progress h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-500"
                  style={
                    { "--target-width": `${scorePercent}%` } as React.CSSProperties
                  }
                />
              </div>
              <span className="font-mono text-[9px] tabular-nums text-zinc-500">
                {score.toFixed(2)}
              </span>
            </div>
          )}
          {document.dataset && (
            <span className="rounded bg-zinc-800/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-zinc-600">
              {document.dataset}
            </span>
          )}
        </div>

        <ArrowRight className="size-3.5 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-amber-500" />
      </div>
    </Link>
  );
}
