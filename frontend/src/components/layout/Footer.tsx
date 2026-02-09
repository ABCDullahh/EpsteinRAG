import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-900 bg-[#060606]">
      <div className="section-line" />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto]">
          <div className="max-w-sm">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
              EpsteinRAG
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Open-source intelligence search engine for the 44,886 documents
              released by the U.S. Department of Justice. This tool provides
              AI-powered analysis across court records, FBI files, flight logs,
              emails, and victim statements.
            </p>
          </div>

          <div>
            <div className="mb-3 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              Official Sources
            </div>
            <div className="space-y-2">
              {[
                { label: "DOJ Epstein Library", href: "https://www.justice.gov/epstein" },
                { label: "DOJ Disclosures", href: "https://www.justice.gov/epstein" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] text-zinc-500 transition-colors hover:text-amber-500"
                >
                  <ExternalLink className="size-2.5" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="max-w-xs">
            <div className="mb-3 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              Legal Notice
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-700">
              All documents are public domain materials released under FOIA.
              This tool is for research and journalistic purposes only.
              No personal data is collected beyond authentication.
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-6">
          <span className="text-[9px] text-zinc-700">
            &copy; {new Date().getFullYear()} EpsteinRAG. Not affiliated with the U.S. Government.
          </span>
          <span className="text-[9px] text-zinc-800">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
