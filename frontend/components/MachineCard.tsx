"use client";
import Link from "next/link";
import type { DigitalTwinState } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface MachineCardProps {
  twin: DigitalTwinState;
}

function MetricPill({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-slate-800/60 px-3 py-2">
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
      <span className="mt-0.5 text-sm font-bold text-slate-200 tabular-nums">
        {value.toFixed(1)}<span className="text-xs text-slate-400 ml-0.5">{unit}</span>
      </span>
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 90 ? "#34d399" : pct >= 70 ? "#fbbf24" : pct >= 40 ? "#fb923c" : "#f87171";

  return (
    <div className="relative flex flex-col items-center">
      <svg width="80" height="48" viewBox="0 0 80 48">
        {/* Background arc */}
        <path
          d="M 8 44 A 32 32 0 0 1 72 44"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d="M 8 44 A 32 32 0 0 1 72 44"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="absolute bottom-0 text-lg font-black tabular-nums" style={{ color }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export function MachineCard({ twin }: MachineCardProps) {
  const statusGlow: Record<string, string> = {
    Healthy: "hover:shadow-emerald-500/10",
    Warning: "hover:shadow-amber-500/10",
    Risk: "hover:shadow-orange-500/10",
    Critical: "hover:shadow-red-500/10 animate-pulse-subtle",
  };

  return (
    <Link href={`/machines/${twin.machine_id}`} className="block">
      <div
        className={`group rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-2xl ${statusGlow[twin.status] || ""}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono font-semibold text-slate-500 uppercase">{twin.machine_id}</p>
            <h3 className="mt-0.5 text-base font-bold text-slate-100 group-hover:text-white transition-colors">
              {twin.machine_name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{twin.machine_type}</p>
          </div>
          <StatusBadge status={twin.status} size="sm" />
        </div>

        {/* Health Gauge */}
        <div className="mt-4 flex items-center justify-between">
          <HealthGauge score={twin.health_score} />
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Health Score</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {twin.location || "No location"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(twin.last_updated).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <MetricPill label="Temp" value={twin.temperature} unit="°C" />
          <MetricPill label="Vib" value={twin.vibration} unit="g" />
          <MetricPill label="Press" value={twin.pressure} unit="psi" />
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
            Live
          </span>
          <span>RPM: {twin.rpm.toFixed(0)}</span>
        </div>
      </div>
    </Link>
  );
}
