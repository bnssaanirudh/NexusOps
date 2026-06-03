"use client";
import type { EventLog } from "@/lib/types";

interface EventLogPanelProps {
  events: EventLog[];
  maxHeight?: string;
}

const severityConfig = {
  info: {
    dot: "bg-blue-400",
    bg: "bg-blue-500/5 border-blue-500/20",
    text: "text-blue-400",
    icon: "ℹ",
  },
  warning: {
    dot: "bg-amber-400",
    bg: "bg-amber-500/5 border-amber-500/20",
    text: "text-amber-400",
    icon: "⚠",
  },
  danger: {
    dot: "bg-orange-400",
    bg: "bg-orange-500/5 border-orange-500/20",
    text: "text-orange-400",
    icon: "⚡",
  },
  critical: {
    dot: "bg-red-400 animate-pulse",
    bg: "bg-red-500/5 border-red-500/20",
    text: "text-red-400",
    icon: "🚨",
  },
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function EventLogPanel({ events, maxHeight = "320px" }: EventLogPanelProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">No events recorded yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto space-y-2 pr-1" style={{ maxHeight }}>
      {events.map((event) => {
        const config = severityConfig[event.severity] || severityConfig.info;
        return (
          <div
            key={event.id}
            className={`flex gap-3 rounded-xl border p-3 transition-all ${config.bg}`}
          >
            {/* Dot */}
            <div className="flex flex-col items-center pt-1">
              <div className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
              <div className="w-px flex-1 bg-slate-700/50 mt-1" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-200 leading-snug">{event.description}</p>
                <span className={`text-xs font-mono shrink-0 ${config.text}`}>
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="text-[10px] rounded-full px-2 py-0.5 bg-slate-700/60 text-slate-400 font-mono">
                  {event.machine_id}
                </span>
                {event.metric && (
                  <span className="text-[10px] rounded-full px-2 py-0.5 bg-slate-700/60 text-slate-400">
                    {event.metric}
                  </span>
                )}
                {event.old_value && event.new_value && (
                  <span className="text-[10px] rounded-full px-2 py-0.5 bg-slate-700/60 text-slate-400">
                    {event.old_value} → {event.new_value}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
