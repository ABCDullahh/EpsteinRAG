"use client";

import {
  Brain,
  FileSearch,
  Database,
  Zap,
  Shield,
  Link2,
} from "lucide-react";
import { useReveal } from "@/lib/hooks/useReveal";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    badge: "Gemini 2.5 Pro",
    description:
      "Advanced language model reads and cross-references documents to generate comprehensive answers with inline source citations and confidence scoring.",
  },
  {
    icon: FileSearch,
    title: "Semantic Search",
    badge: "Hybrid",
    description:
      "Ask questions in plain English. Our hybrid search pipeline combines BM25 keyword matching with dense vector similarity for maximum recall and precision.",
  },
  {
    icon: Database,
    title: "44,886+ Documents",
    badge: "Complete",
    description:
      "Every document from the DOJ January 2026 release -- court records, FBI files, flight logs, financial records, emails, and victim statements.",
  },
  {
    icon: Link2,
    title: "Source Citations",
    badge: "Verifiable",
    description:
      "Every AI-generated answer links directly to the exact EFTA document ID. Verify any claim against the original DOJ source PDFs in one click.",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    badge: "Live",
    description:
      "Watch answers generate token-by-token in real-time. Progressive response caching means repeated and similar queries return near-instantly.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    badge: "Secure",
    description:
      "Your search queries stay completely private. Secure Google OAuth for account protection. No search data is sold, shared, or used for training.",
  },
];

export default function Features() {
  const { ref: sectionRef, revealed: sectionRevealed } = useReveal(0.1);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-zinc-800/50 py-28"
    >
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mb-16">
          <div
            className={`mb-8 ${
              sectionRevealed ? "animate-reveal-up" : "opacity-0"
            }`}
          >
            <div className="section-line mb-6" />
            <span className="stamp border-amber-600/40 font-mono text-[9px] text-amber-600/70">
              CAPABILITIES
            </span>
          </div>

          <div
            className={`${
              sectionRevealed ? "animate-reveal-up delay-1" : "opacity-0"
            }`}
          >
            <h2 className="font-display mb-3 text-4xl text-zinc-100 md:text-5xl">
              Intelligence-Grade Search
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-zinc-500">
              Purpose-built for journalists, researchers, legal professionals,
              and investigators who need answers they can verify.
            </p>
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, badge, description }, index) => (
            <div
              key={title}
              className={`dossier-card group rounded-lg p-6 ${
                sectionRevealed
                  ? `animate-reveal-up delay-${index + 1}`
                  : "opacity-0"
              }`}
            >
              {/* Amber left accent bar */}
              <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-amber-600/0 transition-all duration-300 group-hover:bg-amber-600/40" />

              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-amber-600/30 group-hover:bg-amber-600/5">
                  <Icon className="size-5 text-amber-500/70 transition-colors group-hover:text-amber-500" />
                </div>
                <span className="rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500 transition-colors group-hover:border-amber-600/20 group-hover:text-amber-600/60">
                  {badge}
                </span>
              </div>

              <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-200">
                {title}
              </h3>

              <p className="text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
                {description}
              </p>

              {/* Bottom decorative line */}
              <div className="mt-4 h-px w-full bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
          ))}
        </div>

        {/* Bottom classification marker */}
        <div
          className={`mt-12 text-center ${
            sectionRevealed ? "animate-reveal-up delay-8" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-700">
            SECTION II &mdash; TECHNICAL OVERVIEW &mdash; PAGE 1 OF 1
          </span>
        </div>
      </div>
    </section>
  );
}
