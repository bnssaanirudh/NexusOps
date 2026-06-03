"use client";
import { useState, useCallback } from "react";
import type { MachineStatus } from "@/lib/types";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (status: MachineStatus | "all") => void;
  activeFilter: MachineStatus | "all";
  resultCount?: number;
}

const filters: Array<{ value: MachineStatus | "all"; label: string; color: string }> = [
  { value: "all", label: "All", color: "bg-slate-600 text-slate-200 hover:bg-slate-500" },
  { value: "Healthy", label: "Healthy", color: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30" },
  { value: "Warning", label: "Warning", color: "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30" },
  { value: "Risk", label: "Risk", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30" },
  { value: "Critical", label: "Critical", color: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30" },
];

export function SearchFilter({ onSearch, onFilter, activeFilter, resultCount }: SearchFilterProps) {
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      onSearch(e.target.value);
    },
    [onSearch]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          id="machine-search"
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search machines..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all backdrop-blur-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); onSearch(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            id={`filter-${f.value}`}
            onClick={() => onFilter(f.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${f.color} ${activeFilter === f.value ? "ring-2 ring-offset-1 ring-offset-slate-900 ring-current" : ""}`}
          >
            {f.label}
          </button>
        ))}
        {resultCount !== undefined && (
          <span className="text-xs text-slate-500 ml-1">{resultCount} machine{resultCount !== 1 ? "s" : ""}</span>
        )}
      </div>
    </div>
  );
}
