import { User, MapPin, Plane, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/types";

interface MetadataGroup {
  label: string;
  icon: React.ElementType;
  items: string[];
  color: string;
  hoverColor: string;
}

interface DocumentMetadataProps {
  document: Document;
}

export default function DocumentMetadata({ document }: DocumentMetadataProps) {
  const groups: MetadataGroup[] = [
    {
      label: "People",
      icon: User,
      items: document.people,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      hoverColor: "hover:bg-blue-500/20 hover:border-blue-500/40",
    },
    {
      label: "Locations",
      icon: MapPin,
      items: document.locations,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      hoverColor: "hover:bg-emerald-500/20 hover:border-emerald-500/40",
    },
    {
      label: "Aircraft",
      icon: Plane,
      items: document.aircraft,
      color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      hoverColor: "hover:bg-violet-500/20 hover:border-violet-500/40",
    },
    {
      label: "Evidence Types",
      icon: AlertTriangle,
      items: document.evidence_types,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      hoverColor: "hover:bg-rose-500/20 hover:border-rose-500/40",
    },
  ];

  const activeGroups = groups.filter((g) => g.items.length > 0);
  if (activeGroups.length === 0) return null;

  return (
    <div className="animate-reveal-up delay-2 rounded-lg border border-zinc-800 bg-zinc-900/60">
      {/* Section header */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-6 py-3">
        <div className="size-1.5 rounded-full bg-amber-500/60" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          Extracted Metadata
        </span>
      </div>

      {/* Metadata groups */}
      <div className="space-y-5 p-6">
        {activeGroups.map(({ label, icon: Icon, items, color, hoverColor }, groupIdx) => (
          <div
            key={label}
            className={`animate-slide-in delay-${Math.min(groupIdx + 3, 8)}`}
          >
            {/* Group header */}
            <div className="mb-2.5 flex items-center gap-2">
              <Icon className="size-3.5 text-zinc-500" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {label}
              </span>
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                {items.length}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className={`cursor-default border font-mono text-[9px] transition-all ${color} ${hoverColor}`}
                >
                  {item.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
