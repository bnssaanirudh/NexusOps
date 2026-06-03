"use client";

import { useState, useEffect } from "react";
import { machineApi } from "@/lib/api";
import type { Machine } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TimelinePoint {
  day: number;
  label: string;
  health_score: number;
  status: string;
  color: string;
}

export default function TimelinePage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ machine_name: string; current_health: number; current_status: string } | null>(null);

  useEffect(() => {
    machineApi.list({ active_only: true }).then((m) => {
      setMachines(m);
      if (m.length > 0) {
        setSelectedMachine(m[0].machine_id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedMachine) loadForecast(selectedMachine);
  }, [selectedMachine]);

  const loadForecast = async (machineId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/simulator/forecast/${machineId}`);
      const data = await res.json();
      setTimeline(data.timeline || []);
      setMeta({
        machine_name: data.machine_name,
        current_health: data.current_health,
        current_status: data.current_status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusEmoji = (status: string) => {
    if (status === "Healthy") return "🟢";
    if (status === "Warning") return "🟡";
    if (status === "Risk") return "🟠";
    return "🔴";
  };

  const failureDay = timeline.find((t) => t.status === "Critical")?.day;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>📅</span> Failure Timeline Forecast
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">14-day AI-powered health degradation forecast</p>
          </div>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            {machines.map((m) => (
              <option key={m.machine_id} value={m.machine_id}>
                {m.machine_id} — {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : timeline.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            {meta && (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Health</p>
                  <p className="text-4xl font-black text-white">{meta.current_health}%</p>
                  <p className="text-sm text-slate-400 mt-1">{meta.machine_name} · {meta.current_status}</p>
                </div>
                <div className={`rounded-2xl border p-5 ${failureDay && failureDay <= 7 ? "border-red-500/40 bg-red-500/10" : "border-slate-700/50 bg-slate-800/40"}`}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Critical Status Reached</p>
                  <p className={`text-4xl font-black ${failureDay && failureDay <= 7 ? "text-red-400" : "text-slate-200"}`}>
                    Day {failureDay ?? ">14"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {failureDay && failureDay <= 3 ? "⚠️ Urgent — Immediate action required" :
                      failureDay && failureDay <= 7 ? "⏰ Plan maintenance this week" :
                        "✅ Sufficient time for scheduled maintenance"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Recommended Action</p>
                  <p className="text-2xl font-black text-white">
                    {failureDay && failureDay <= 3 ? "Emergency Repair" :
                      failureDay && failureDay <= 7 ? "Schedule Repair" :
                        "Continue Monitoring"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Based on current degradation trajectory</p>
                </div>
              </div>
            )}

            {/* Timeline Visual */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">14-Day Health Trajectory</h2>
              
              {/* Health bar chart */}
              <div className="flex items-end gap-1.5 h-40 mb-4">
                {timeline.map((point, i) => {
                  const heightPct = Math.max(4, point.health_score);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md transition-all duration-300 relative group"
                      style={{ height: `${heightPct}%`, backgroundColor: point.color, opacity: 0.85 }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {point.label}: {point.health_score}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Day labels */}
              <div className="flex gap-1.5">
                {timeline.map((point, i) => (
                  <div key={i} className="flex-1 text-center">
                    <p className="text-[9px] text-slate-500 truncate">{point.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline List */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Day-by-Day Breakdown</h2>
              <div className="space-y-2">
                {timeline.filter((_, i) => i % 2 === 0 || i === timeline.length - 1).map((point) => (
                  <div key={point.day} className="flex items-center gap-4 py-2 border-b border-slate-700/30 last:border-0">
                    <div className="w-20 shrink-0">
                      <p className="font-mono text-sm text-slate-400">{point.label}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${point.health_score}%`, backgroundColor: point.color }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
                      <span className="font-bold text-sm" style={{ color: point.color }}>{point.health_score}%</span>
                      <span className="text-xs text-slate-500">{getStatusEmoji(point.status)} {point.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">No forecast data available</div>
        )}
      </div>
    </div>
  );
}
