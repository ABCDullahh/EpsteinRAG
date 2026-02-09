"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { getRelatedDocuments } from "@/lib/api/search";
import type { Document } from "@/lib/types";
import DocumentCard from "@/components/search/DocumentCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedDocumentsProps {
  documentId: string;
}

export default function RelatedDocuments({ documentId }: RelatedDocumentsProps) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const related = await getRelatedDocuments(documentId, 4);
        setDocs(related);
      } catch {
        // Related documents not available — fail silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [documentId]);

  if (!loading && docs.length === 0) return null;

  return (
    <div className="animate-reveal-up delay-4">
      {/* Section header */}
      <div className="mb-4 flex items-center gap-2.5">
        <Link2 className="size-3.5 text-amber-500/70" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Related Documents
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
        {!loading && (
          <span className="font-mono text-[9px] text-zinc-600">
            {docs.length} found
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-3 w-24 bg-zinc-800" />
                <Skeleton className="h-4 w-16 rounded bg-zinc-800" />
              </div>
              <div className="mb-3 space-y-1.5">
                <Skeleton className="h-2.5 w-full bg-zinc-800" />
                <Skeleton className="h-2.5 w-[80%] bg-zinc-800" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-14 rounded bg-zinc-800" />
                <Skeleton className="h-4 w-14 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {docs.map((doc, i) => (
            <div
              key={doc.id}
              className={`animate-slide-in delay-${Math.min(i + 5, 8)}`}
            >
              <DocumentCard document={doc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
