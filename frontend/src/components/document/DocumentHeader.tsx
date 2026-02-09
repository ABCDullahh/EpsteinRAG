import { ArrowLeft, ExternalLink, FileText, Hash, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    DOC_TYPE_COLORS[type.toLowerCase()] ||
    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  );
}

interface DocumentHeaderProps {
  document: Document;
}

export default function DocumentHeader({ document }: DocumentHeaderProps) {
  const color = getDocTypeColor(document.doc_type);

  const sourceUrl = document.source_url
    ? document.source_url
    : document.file_path
      ? `https://www.justice.gov/epstein/files/${document.file_path}`
      : null;

  return (
    <div className="space-y-4 animate-reveal-up">
      {/* Back navigation */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="group font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-amber-500 hover:bg-amber-500/5"
      >
        <Link href="/search">
          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
          Back to Search
        </Link>
      </Button>

      {/* Main header card */}
      <div className="dossier-card rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
        {/* Classification stamp */}
        <div className="mb-5 flex items-center justify-between">
          <div className="stamp inline-block rounded border-2 border-amber-500/40 px-3 py-1">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-amber-500">
              Intelligence Dossier
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
            Declassified
          </span>
        </div>

        <hr className="section-line mb-5 border-zinc-800" />

        {/* Document identity row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon block */}
            <div className="flex size-12 items-center justify-center rounded-md bg-amber-600/10 ring-1 ring-amber-600/20">
              <FileText className="size-6 text-amber-500" />
            </div>

            {/* ID info */}
            <div className="space-y-1">
              <h1 className="font-mono text-xl font-bold tracking-tight text-amber-500">
                {document.efta_id}
              </h1>
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Hash className="size-3" />
                <span className="font-mono text-[10px] select-all">
                  {document.id}
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`border font-mono text-[9px] font-semibold uppercase tracking-wide ${color}`}
            >
              {document.doc_type?.replace(/_/g, " ") || "unknown"}
            </Badge>
            {document.pages != null && (
              <Badge
                variant="outline"
                className="border-zinc-700 font-mono text-[9px] text-zinc-400"
              >
                <Layers className="mr-1 size-3" />
                {document.pages} page{document.pages !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        <hr className="section-line my-5 border-zinc-800" />

        {/* Source information row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
          {document.dataset && (
            <div className="text-zinc-500">
              <span className="uppercase tracking-wider">Dataset:</span>{" "}
              <span className="text-zinc-300">{document.dataset}</span>
            </div>
          )}
          {document.source && (
            <div className="text-zinc-500">
              <span className="uppercase tracking-wider">Source:</span>{" "}
              <span className="text-zinc-300">{document.source}</span>
            </div>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 text-amber-500 transition-colors hover:text-amber-400"
            >
              <ExternalLink className="size-3 transition-transform group-hover/link:translate-x-0.5" />
              <span className="underline decoration-amber-500/30 underline-offset-2">
                View Original PDF
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
