"use client";

import { useState } from "react";
import {
  FileText,
  User,
  MapPin,
  AlertTriangle,
  X,
  Filter,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/lib/types";

interface FiltersSidebarProps {
  filters: SearchFilters;
  onUpdateFilter: (key: keyof SearchFilters, values: string[]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const FILTER_SECTIONS = [
  {
    key: "doc_types" as const,
    label: "Document Type",
    icon: FileText,
    options: [
      "email",
      "flight_record",
      "law_enforcement",
      "court_document",
      "victim_statement",
      "correspondence",
      "financial",
    ],
  },
  {
    key: "people" as const,
    label: "People",
    icon: User,
    options: [
      "epstein",
      "maxwell",
      "prince_andrew",
      "bill_clinton",
      "alan_dershowitz",
      "jean_luc_brunel",
      "les_wexner",
    ],
  },
  {
    key: "locations" as const,
    label: "Locations",
    icon: MapPin,
    options: [
      "palm_beach",
      "new_york",
      "virgin_islands",
      "little_st_james",
      "paris",
      "london",
    ],
  },
  {
    key: "evidence_types" as const,
    label: "Evidence Type",
    icon: AlertTriangle,
    options: [
      "flight_log",
      "victim",
      "sexual",
      "trafficking",
      "financial",
      "communication",
    ],
  },
] as const;

export default function FiltersSidebar({
  filters,
  onUpdateFilter,
  onClearFilters,
  hasActiveFilters,
}: FiltersSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const isChecked = (key: keyof SearchFilters, value: string) =>
    filters[key]?.includes(value) ?? false;

  const toggleValue = (key: keyof SearchFilters, value: string) => {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdateFilter(key, next);
  };

  const getActiveCount = (key: keyof SearchFilters): number =>
    filters[key]?.length ?? 0;

  return (
    <aside className="w-56 shrink-0">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-amber-600/60" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Filters
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearFilters}
            className="font-mono text-[9px] text-zinc-600 transition-colors hover:text-amber-500"
          >
            <X className="size-2.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="section-line mb-4" />

      {/* Filter sections */}
      <div className="space-y-3">
        {FILTER_SECTIONS.map(({ key, label, icon: Icon, options }) => {
          const activeCount = getActiveCount(key);
          const isCollapsed = collapsed[key] ?? false;

          return (
            <div
              key={key}
              className="rounded border border-zinc-800/50 bg-zinc-900/30"
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(key)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-zinc-800/30"
              >
                <Icon className="size-3 text-zinc-600" />
                <span className="flex-1 font-mono text-[10px] font-medium text-zinc-300">
                  {label}
                </span>
                {activeCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-amber-600/20 font-mono text-[8px] font-bold text-amber-500">
                    {activeCount}
                  </span>
                )}
                {isCollapsed ? (
                  <ChevronRight className="size-3 text-zinc-600" />
                ) : (
                  <ChevronDown className="size-3 text-zinc-600" />
                )}
              </button>

              {/* Options */}
              {!isCollapsed && (
                <div className="border-t border-zinc-800/30 px-3 py-2 space-y-1">
                  {options.map((option) => {
                    const checked = isChecked(key, option);
                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 font-mono text-[10px] transition-colors hover:bg-zinc-800/40 ${
                          checked ? "text-amber-400" : "text-zinc-500"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleValue(key, option)}
                          className="size-3 rounded-[2px] border-zinc-700 data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                        />
                        <span className="leading-none">
                          {option.replace(/_/g, " ")}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
