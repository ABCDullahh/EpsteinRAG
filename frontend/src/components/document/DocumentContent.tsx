import { FileText } from "lucide-react";

interface DocumentContentProps {
  content: string;
}

export default function DocumentContent({ content }: DocumentContentProps) {
  const lines = content ? content.split("\n") : [];
  const hasContent = lines.length > 0 && content.trim().length > 0;

  return (
    <div className="animate-reveal-up delay-1 rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-6 py-3">
        <FileText className="size-3.5 text-amber-500/70" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Document Content
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
        {hasContent && (
          <span className="font-mono text-[9px] text-zinc-600">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content body */}
      <div className="relative">
        {/* CRT scanline overlay */}
        <div className="bg-scanlines pointer-events-none absolute inset-0 z-10" />

        {hasContent ? (
          <div className="overflow-x-auto p-6">
            <pre className="font-mono text-xs leading-relaxed text-zinc-300">
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {/* Line number gutter - show every 5th line and line 1 */}
                  <span
                    className="mr-4 inline-block w-8 shrink-0 select-none text-right font-mono text-[10px] text-zinc-700"
                    aria-hidden="true"
                  >
                    {i === 0 || (i + 1) % 5 === 0 ? i + 1 : ""}
                  </span>
                  {/* Line content */}
                  <span className="whitespace-pre-wrap break-words">
                    {line || " "}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-3 size-8 text-zinc-700" />
            <p className="font-mono text-xs italic text-zinc-600">
              No text content available for this document.
            </p>
            <p className="mt-1 font-mono text-[10px] text-zinc-700">
              The original may be a scanned image or redacted file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
