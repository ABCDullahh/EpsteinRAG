"use client";

import { Brain, ExternalLink, ShieldAlert } from "lucide-react";
import type { AIAnswer as AIAnswerType } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface AIAnswerProps {
  answer: AIAnswerType;
  isStreaming?: boolean;
  streamText?: string;
}

export default function AIAnswer({
  answer,
  isStreaming,
  streamText,
}: AIAnswerProps) {
  const text = streamText ?? answer.text;
  const hasCitations = answer.citations.length > 0;

  return (
    <div className="animate-reveal-up delay-1 overflow-hidden rounded border border-amber-600/20 bg-amber-950/5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-amber-600/10 px-5 py-3">
        <div
          className={`flex size-7 items-center justify-center rounded bg-amber-600/15 ${
            isStreaming ? "animate-pulse-amber" : ""
          }`}
        >
          <Brain className="size-3.5 text-amber-500" />
        </div>

        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
            {isStreaming ? "Analyzing..." : "AI Analysis"}
          </span>
        </div>

        {/* Source count */}
        {hasCitations && (
          <span className="ml-auto font-mono text-[9px] text-zinc-500">
            {answer.citations.length} source
            {answer.citations.length !== 1 ? "s" : ""} referenced
          </span>
        )}

        {/* CLASSIFIED stamp */}
        {hasCitations && !isStreaming && (
          <div className="ml-2 flex items-center gap-1.5 rounded border border-red-800/40 bg-red-950/20 px-2 py-0.5">
            <ShieldAlert className="size-2.5 text-red-500/70" />
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-red-500/70">
              Classified
            </span>
          </div>
        )}
      </div>

      {/* Answer body */}
      <div className="px-5 py-4">
        <div className="prose prose-invert prose-sm max-w-none text-zinc-300 prose-p:leading-relaxed prose-p:text-zinc-300 prose-strong:text-amber-400 prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-li:text-zinc-300 prose-headings:text-zinc-200 prose-headings:font-mono prose-code:text-amber-400/80 prose-code:bg-zinc-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
          <ReactMarkdown>{text}</ReactMarkdown>
          {isStreaming && (
            <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-amber-500" />
          )}
        </div>
      </div>

      {/* Citations */}
      {hasCitations && (
        <div className="border-t border-amber-600/10 px-5 py-3">
          <div className="mb-2.5 flex items-center gap-2">
            <div className="h-px w-3 bg-amber-600/40" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-500">
              Source Documents
            </span>
            <div className="h-px flex-1 bg-zinc-800/60" />
          </div>

          <div className="flex flex-wrap gap-2">
            {answer.citations.map((citation, idx) => (
              <Link
                key={`${citation.document_id}-${idx}`}
                href={`/documents/${encodeURIComponent(citation.document_id)}`}
                className="hover-lift group flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 transition-all hover:border-amber-600/40 hover:bg-amber-950/20"
              >
                <span className="flex size-4 items-center justify-center rounded-sm bg-amber-600/20 font-mono text-[9px] font-bold text-amber-500">
                  {idx + 1}
                </span>
                <span className="font-mono text-[10px] text-zinc-400 transition-colors group-hover:text-zinc-200">
                  {citation.efta_id}
                </span>
                {citation.doc_type && (
                  <span className="font-mono text-[8px] uppercase text-zinc-600">
                    {citation.doc_type.replace(/_/g, " ")}
                  </span>
                )}
                <ExternalLink className="size-2.5 text-zinc-700 transition-colors group-hover:text-amber-500" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
