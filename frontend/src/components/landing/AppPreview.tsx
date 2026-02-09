"use client";

import { Search, Brain, FileText, Shield } from "lucide-react";
import { useReveal } from "@/lib/hooks/useReveal";

const MOCK_DOCUMENTS = [
  {
    id: "EFTA00037442",
    type: "flight_record",
    typeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    preview:
      "Flight log entry dated March 15, 2002. Departure: TEB (Teterboro, NJ). Arrival: STT (St. Thomas, USVI). Passengers listed include...",
    score: 0.94,
  },
  {
    id: "EFTA00012891",
    type: "law_enforcement",
    typeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    preview:
      "FBI Field Office Report, Palm Beach County. Interview transcript regarding aircraft passenger manifests and travel patterns between 2001...",
    score: 0.89,
  },
];

export default function AppPreview() {
  const { ref: previewRef, revealed: previewRevealed } = useReveal(0.15);

  return (
    <section
      ref={previewRef}
      className="relative border-t border-zinc-800/50 py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.04)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        {/* Section header */}
        <div
          className={`mb-14 text-center ${
            previewRevealed ? "animate-reveal-up" : "opacity-0"
          }`}
        >
          <span className="stamp border-amber-600/40 font-mono text-[9px] text-amber-600/70">
            INTERFACE PREVIEW
          </span>
          <h2 className="font-display mt-6 text-4xl text-zinc-100 md:text-5xl">
            See It in Action
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            Real-time AI analysis with verifiable source documents
          </p>
        </div>

        {/* Browser window mockup - slightly rotated with depth shadow */}
        <div
          className={`${
            previewRevealed ? "animate-reveal-up delay-2" : "opacity-0"
          }`}
        >
          <div className="relative rotate-1 transition-transform duration-500 hover:rotate-0">
            {/* Heavy depth shadow */}
            <div className="absolute -inset-1 rounded-2xl bg-amber-600/5 blur-2xl" />
            <div className="absolute -inset-2 rounded-2xl bg-black/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(217,119,6,0.05)]">
              {/* CRT scanlines overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 bg-scanlines opacity-30" />

              {/* Window chrome / title bar */}
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
                {/* OS dots: red, yellow, green */}
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80" />
                  <div className="size-3 rounded-full bg-[#febc2e] transition-opacity hover:opacity-80" />
                  <div className="size-3 rounded-full bg-[#28c840] transition-opacity hover:opacity-80" />
                </div>

                {/* URL bar */}
                <div className="mx-auto flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-4 py-1.5">
                  <Shield className="size-3 text-emerald-500/60" />
                  <span className="font-mono text-[11px] text-zinc-500">
                    epsteinrag.app/search
                  </span>
                </div>

                {/* Spacer for symmetry */}
                <div className="w-[52px]" />
              </div>

              {/* App content area */}
              <div className="relative p-6 md:p-8">
                {/* Search bar mockup */}
                <div className="mb-6 rounded-lg border border-zinc-700/80 bg-zinc-950 px-4 py-3.5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Search className="size-4 text-amber-600/50" />
                    <span className="font-mono text-sm text-zinc-300">
                      Flight logs 2001-2005
                    </span>
                    <div className="ml-auto rounded border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 font-mono text-[9px] text-zinc-600">
                      3 results
                    </div>
                  </div>
                </div>

                {/* AI Answer box */}
                <div className="mb-6 rounded-lg border border-amber-600/20 bg-amber-600/[0.03] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="size-4 animate-pulse text-amber-500" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500">
                      AI Analysis
                    </span>
                    <span className="ml-auto rounded bg-amber-600/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-600/60">
                      12 sources
                    </span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                    Based on <span className="text-amber-500">12 documents</span> from
                    DOJ Datasets 3 and 8, multiple flight records document
                    travel patterns on Epstein&apos;s Boeing 727 (tail number
                    N908JE) between 2001 and 2005. The logs show{" "}
                    <span className="redacted">redacted name</span>{" "}
                    departures primarily from Teterboro Airport (TEB) to
                    destinations including St. Thomas, USVI, Palm Beach
                    International, and{" "}
                    <span className="redacted">location withheld</span>
                    ...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["EFTA00037442", "EFTA00012891", "EFTA00005523"].map(
                      (id) => (
                        <span
                          key={id}
                          className="rounded border border-zinc-700/80 bg-zinc-800/60 px-2 py-0.5 font-mono text-[10px] text-amber-500/80 transition-colors hover:border-amber-600/30 hover:text-amber-500"
                        >
                          [{id}]
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Document cards - side by side */}
                <div className="grid gap-3 md:grid-cols-2">
                  {MOCK_DOCUMENTS.map((doc) => (
                    <div
                      key={doc.id}
                      className="group/doc rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700"
                    >
                      {/* Header: EFTA ID + type badge */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3 text-zinc-600" />
                          <span className="font-mono text-[10px] font-medium text-amber-500/80">
                            {doc.id}
                          </span>
                        </div>
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide ${doc.typeColor}`}
                        >
                          {doc.type.replace("_", " ")}
                        </span>
                      </div>

                      {/* Preview text */}
                      <p className="mb-3 text-xs leading-relaxed text-zinc-500 transition-colors group-hover/doc:text-zinc-400">
                        {doc.preview}
                      </p>

                      {/* Relevance score bar */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-zinc-600">
                          Relevance
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all"
                            style={{
                              width: `${doc.score * 100}%`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] font-medium text-amber-500/70">
                          {doc.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom status bar */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-zinc-600">
                      Connected to Pinecone vector store
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-700">
                    Response time: 1.2s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom label */}
        <div
          className={`mt-10 text-center ${
            previewRevealed ? "animate-reveal-up delay-4" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-700">
            EXHIBIT A &mdash; APPLICATION INTERFACE &mdash; LIVE DEMONSTRATION
          </span>
        </div>
      </div>
    </section>
  );
}
