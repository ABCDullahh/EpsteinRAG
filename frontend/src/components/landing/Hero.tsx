"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, FileText, Clock, Server, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/hooks/useReveal";

const TYPING_QUERIES = [
  "Who visited Epstein Island in 2005?",
  "Flight logs from Teterboro to St. Thomas",
  "FBI surveillance records Palm Beach",
  "Ghislaine Maxwell deposition excerpts",
  "Financial transactions 2001-2003",
];

const STATS = [
  { value: "44,886+", label: "Documents Indexed", icon: FileText },
  { value: "3.5M+", label: "Pages Released", icon: Database },
  { value: "12", label: "DOJ Datasets", icon: Server },
  { value: "< 2s", label: "Avg. Response", icon: Clock },
];

export default function Hero() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [stampVisible, setStampVisible] = useState(false);
  const { ref: statsRef, revealed: statsRevealed } = useReveal(0.2);

  const currentQuery = TYPING_QUERIES[cycle % TYPING_QUERIES.length];

  // Stamp entrance delay
  useEffect(() => {
    const timer = setTimeout(() => setStampVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Typing animation
  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      if (i <= currentQuery.length) {
        setTyped(currentQuery.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        timeout = setTimeout(() => {
          setTyped("");
          setCycle((c) => c + 1);
        }, 3000);
      }
    }, 60);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [cycle, currentQuery]);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(217,119,6,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,6,6,1)_0%,transparent_60%)]" />

      {/* Noise grain via parent grain-overlay on body */}

      {/* Diagonal classified watermark stripe */}
      <div className="absolute -right-24 top-24 rotate-12 select-none bg-amber-600/[0.03] px-24 py-1.5 text-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-amber-600/20">
          declassified &bull; declassified &bull; declassified &bull;
          declassified &bull; declassified &bull; declassified
        </span>
      </div>
      <div className="absolute -left-24 bottom-40 -rotate-12 select-none bg-amber-600/[0.02] px-24 py-1.5 text-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-amber-600/15">
          department of justice &bull; department of justice &bull;
          department of justice
        </span>
      </div>

      {/* Vertical side accents */}
      <div className="absolute left-6 top-1/4 hidden h-32 w-px bg-gradient-to-b from-transparent via-amber-600/20 to-transparent lg:block" />
      <div className="absolute right-6 bottom-1/4 hidden h-32 w-px bg-gradient-to-b from-transparent via-amber-600/20 to-transparent lg:block" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 text-center">
        {/* DECLASSIFIED stamp - slams in */}
        <div className="mb-10 inline-block">
          {stampVisible && (
            <span className="stamp animate-stamp border-amber-500/70 font-mono text-[11px] text-amber-500">
              DECLASSIFIED // EFTA-DOJ-2026
            </span>
          )}
        </div>

        {/* Main headline - Instrument Serif */}
        <h1 className="font-display mb-6 text-5xl leading-[1.1] font-normal tracking-tight text-zinc-100 md:text-7xl lg:text-8xl">
          Search{" "}
          <span className="relative inline-block text-amber-500">
            44,886
            <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-amber-600/60" />
            <span className="absolute -bottom-1 left-0 h-[3px] w-full animate-pulse rounded-full bg-amber-500/30 blur-sm" />
          </span>{" "}
          Declassified
          <br />
          <span className="text-zinc-300">Epstein Documents</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mb-12 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
          AI-powered intelligence search across the full Department of Justice
          release. Court records, FBI files, flight logs, financial documents,
          and victim statements -- every answer backed by exact source citations
          with direct links to original documents.
        </p>

        {/* Fake search bar with typing animation */}
        <div className="mx-auto mb-10 max-w-2xl">
          <div className="group relative overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-900/80 backdrop-blur-sm transition-all duration-300 hover:border-amber-600/50 focus-amber">
            <div className="flex items-center px-5 py-4">
              <Search className="mr-3 size-5 shrink-0 text-zinc-500 transition-colors group-hover:text-amber-600/60" />
              <span className="flex-1 text-left font-mono text-sm text-zinc-400 md:text-base">
                {typed}
                <span
                  className={`ml-0.5 inline-block h-5 w-[2px] translate-y-[2px] bg-amber-500 align-middle transition-opacity duration-100 ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <div className="ml-3 hidden rounded border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 font-mono text-[10px] text-zinc-500 sm:block">
                Enter
              </div>
            </div>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 -z-10 rounded-lg bg-amber-600/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          {/* Hint text below search */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <span className="text-terminal font-mono text-[10px] animate-blink">&gt;</span>
            <span className="font-mono text-[10px] tracking-wide text-zinc-600">
              Ask any question about the declassified documents
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group/btn bg-amber-600 px-8 font-mono text-xs uppercase tracking-wider text-zinc-950 transition-all hover:bg-amber-500 hover:shadow-[0_0_24px_rgba(217,119,6,0.25)]"
          >
            <Link href="/search">
              Start Searching
              <ArrowRight className="ml-1.5 size-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-zinc-700 px-8 font-mono text-xs uppercase tracking-wider text-zinc-400 transition-all hover:border-amber-600/50 hover:text-amber-500"
          >
            <a
              href="https://www.justice.gov/epstein"
              target="_blank"
              rel="noopener noreferrer"
            >
              View DOJ Source
            </a>
          </Button>
        </div>

        {/* Stats row with staggered reveal */}
        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {STATS.map(({ value, label, icon: Icon }, index) => (
            <div
              key={label}
              className={`rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-4 py-4 backdrop-blur-sm transition-all hover:border-zinc-700 ${
                statsRevealed
                  ? `animate-reveal-up delay-${index + 1}`
                  : "opacity-0"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="size-3.5 text-amber-600/50" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  {label}
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-amber-500">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 pb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
            Scroll to explore
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-amber-600/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
