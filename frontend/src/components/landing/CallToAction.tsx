"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/hooks/useReveal";

export default function CallToAction() {
  const { ref: ctaRef, revealed: ctaRevealed } = useReveal(0.15);

  return (
    <section
      ref={ctaRef}
      className="relative overflow-hidden border-t border-zinc-800/50 py-32"
    >
      {/* Radial amber glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.04)_0%,transparent_30%)]" />

      {/* Grid pattern subtle */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Decorative corner stamps */}
      <div className="absolute left-8 top-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-800 lg:block">
        DOC//UNCLASS
      </div>
      <div className="absolute right-8 top-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-800 lg:block">
        REF: EFTA-2026
      </div>
      <div className="absolute bottom-8 left-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-800 lg:block">
        PAGE FINAL
      </div>
      <div className="absolute right-8 bottom-8 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-800 lg:block">
        END OF FILE
      </div>

      {/* Vertical accent lines */}
      <div className="absolute left-1/4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-amber-600/5 to-transparent lg:block" />
      <div className="absolute right-1/4 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-amber-600/5 to-transparent lg:block" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {/* Classification stamp */}
        <div
          className={`mb-10 inline-block ${
            ctaRevealed ? "animate-stamp" : "opacity-0"
          }`}
        >
          <span className="stamp border-amber-500/50 font-mono text-[10px] text-amber-500/80">
            AUTHORIZED FOR PUBLIC ACCESS
          </span>
        </div>

        {/* Large serif headline */}
        <h2
          className={`font-display mb-6 text-5xl leading-[1.1] text-zinc-100 md:text-6xl lg:text-7xl ${
            ctaRevealed ? "animate-reveal-up delay-1" : "opacity-0"
          }`}
        >
          The Truth Is in
          <br />
          <span className="text-amber-500">the Documents</span>
        </h2>

        {/* Subtitle */}
        <p
          className={`mx-auto mb-10 max-w-xl text-sm leading-relaxed text-zinc-500 md:text-base ${
            ctaRevealed ? "animate-reveal-up delay-2" : "opacity-0"
          }`}
        >
          3.5 million pages. 44,886 indexed documents. 12 DOJ datasets. Every
          answer traceable to its exact source. The most comprehensive search
          tool for the Epstein document release.
        </p>

        {/* Horizontal rule */}
        <div
          className={`mx-auto mb-10 ${
            ctaRevealed ? "animate-reveal-up delay-3" : "opacity-0"
          }`}
        >
          <div className="section-line mx-auto max-w-xs" />
        </div>

        {/* Big amber CTA button */}
        <div
          className={`${
            ctaRevealed ? "animate-reveal-up delay-4" : "opacity-0"
          }`}
        >
          <Button
            asChild
            size="lg"
            className="hover-glow group/cta bg-amber-600 px-10 py-6 font-mono text-sm uppercase tracking-wider text-zinc-950 transition-all hover:bg-amber-500 hover:shadow-[0_0_40px_rgba(217,119,6,0.3)]"
          >
            <Link href="/search">
              Begin Search
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8 ${
            ctaRevealed ? "animate-reveal-up delay-5" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] text-zinc-600">
              No account required
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] text-zinc-600">
              Open source
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] text-zinc-600">
              Searches stay private
            </span>
          </div>
        </div>

        {/* Bottom classification marker */}
        <div
          className={`mt-16 ${
            ctaRevealed ? "animate-reveal-up delay-6" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-800">
            &mdash; END OF DOSSIER &mdash;
          </span>
        </div>
      </div>
    </section>
  );
}
