import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="space-y-6">
      {/* AI Answer skeleton */}
      <div className="animate-reveal-up overflow-hidden rounded border border-amber-600/20 bg-amber-950/5">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-amber-600/10 px-5 py-3">
          <div className="animate-pulse-amber flex size-7 items-center justify-center rounded bg-amber-600/15">
            <Loader2 className="size-3.5 animate-spin text-amber-500" />
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
            Analyzing Documents...
          </span>
        </div>

        {/* Skeleton lines */}
        <div className="space-y-2.5 px-5 py-4">
          <Skeleton className="h-3 w-full bg-zinc-800/80" />
          <Skeleton className="h-3 w-[92%] bg-zinc-800/80" />
          <Skeleton className="h-3 w-[78%] bg-zinc-800/80" />
          <Skeleton className="h-3 w-[85%] bg-zinc-800/80" />
        </div>
      </div>

      {/* Loading Documents heading */}
      <div className="animate-reveal-up delay-1 flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Loading Documents...
        </span>
        <div className="section-line flex-1" />
      </div>

      {/* Skeleton document cards - 2x2 grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => {
          const delayClass = `delay-${i + 2}`;
          return (
            <div
              key={i}
              className={`animate-reveal-up ${delayClass} rounded border border-zinc-800/50 bg-[#0a0a0a] p-4`}
            >
              {/* Top row: EFTA ID + badge */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-8 rounded bg-zinc-800" />
                  <Skeleton className="h-3 w-20 bg-zinc-800" />
                </div>
                <Skeleton className="h-4 w-16 rounded-full bg-zinc-800" />
              </div>

              {/* Content lines */}
              <div className="mb-3 space-y-1.5">
                <Skeleton className="h-2.5 w-full bg-zinc-800/70" />
                <Skeleton className="h-2.5 w-[85%] bg-zinc-800/70" />
                <Skeleton className="h-2.5 w-[65%] bg-zinc-800/70" />
              </div>

              {/* Tags */}
              <div className="mb-3 flex gap-1.5">
                <Skeleton className="h-4 w-16 rounded bg-zinc-800/60" />
                <Skeleton className="h-4 w-14 rounded bg-zinc-800/60" />
                <Skeleton className="h-4 w-18 rounded bg-zinc-800/60" />
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between border-t border-zinc-800/30 pt-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-1.5 w-20 rounded-full bg-zinc-800/60" />
                  <Skeleton className="h-2 w-6 bg-zinc-800/60" />
                </div>
                <Skeleton className="size-3.5 rounded bg-zinc-800/40" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
