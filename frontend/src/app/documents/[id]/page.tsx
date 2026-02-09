"use client";

import { useState, useEffect, use } from "react";
import { AlertTriangle, ShieldAlert, FileWarning } from "lucide-react";
import { getDocument } from "@/lib/api/search";
import type { Document } from "@/lib/types";
import DocumentHeader from "@/components/document/DocumentHeader";
import DocumentContent from "@/components/document/DocumentContent";
import DocumentMetadata from "@/components/document/DocumentMetadata";
import RelatedDocuments from "@/components/document/RelatedDocuments";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await getDocument(id);
        setDocument(doc);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load document"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Back button skeleton */}
        <Skeleton className="h-7 w-36 bg-zinc-800" />

        {/* Header skeleton */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="size-12 rounded-md bg-zinc-800" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 bg-zinc-800" />
              <Skeleton className="h-3 w-72 bg-zinc-800" />
            </div>
          </div>
          <Skeleton className="h-px w-full bg-zinc-800" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-3 w-28 bg-zinc-800" />
            <Skeleton className="h-3 w-24 bg-zinc-800" />
          </div>
        </div>

        {/* Content + metadata skeleton */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <Skeleton className="mb-4 h-3 w-32 bg-zinc-800" />
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-full bg-zinc-800" />
              <Skeleton className="h-3 w-[95%] bg-zinc-800" />
              <Skeleton className="h-3 w-[88%] bg-zinc-800" />
              <Skeleton className="h-3 w-[92%] bg-zinc-800" />
              <Skeleton className="h-3 w-[70%] bg-zinc-800" />
              <Skeleton className="h-3 w-[85%] bg-zinc-800" />
              <Skeleton className="h-3 w-[78%] bg-zinc-800" />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <Skeleton className="mb-4 h-3 w-36 bg-zinc-800" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-20 rounded bg-zinc-800" />
              <Skeleton className="h-5 w-24 rounded bg-zinc-800" />
              <Skeleton className="h-5 w-16 rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Error state ─── */
  if (error || !document) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="animate-reveal-up rounded-lg border border-red-800/40 bg-red-950/10 p-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-950/30 ring-1 ring-red-800/40">
            <AlertTriangle className="size-7 text-red-500" />
          </div>
          <h2 className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider text-red-400">
            Document Not Found
          </h2>
          <p className="mx-auto mb-6 max-w-md font-mono text-xs leading-relaxed text-zinc-500">
            {error || "The requested document could not be loaded. It may have been redacted or removed from the archive."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <FileWarning className="size-3 text-zinc-600" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
              Document ID: {id}
            </span>
          </div>
          <div className="mt-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-amber-500"
            >
              <Link href="/search">
                <ShieldAlert className="size-3" />
                Return to Search
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Document detail view ─── */
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header with back button, EFTA ID, badges, source info */}
      <DocumentHeader document={document} />

      {/* Two-column layout: content + metadata sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Document text content */}
        <div className="space-y-6">
          <DocumentContent content={document.content || ""} />
        </div>

        {/* Metadata sidebar */}
        <div className="space-y-6">
          <DocumentMetadata document={document} />
        </div>
      </div>

      {/* Related documents section */}
      <hr className="section-line border-zinc-800" />
      <RelatedDocuments documentId={document.id} />
    </main>
  );
}
