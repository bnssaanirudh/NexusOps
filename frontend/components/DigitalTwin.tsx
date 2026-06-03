"use client";
import type { DigitalTwinState } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface DigitalTwinProps {
  twin: DigitalTwinState;
}

interface SensorRowProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  normalRange: [number, number];
  currentValue: number;
}

function SensorRow({ label, value, unit, icon, normalRange, currentValue }: SensorRowProps) {
  const [lo, hi] = normalRange;
  const pct = Math.max(0, Math.min(100, ((currentValue - lo) / (hi - lo)) * 100));
  const isNormal = currentValue >= lo && currentValue <= hi;
  const barColor = isNormal ? "bg-emerald-500" : currentValue > hi ? "bg-red-500" : "bg-amber-500";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-sm font-bold text-slate-100 tabular-nums">
            {value} <span className="text-xs text-slate-400">{unit}</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-slate-600">{lo}{unit}</span>
          <span className="text-[10px] text-slate-600">{hi}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function PenaltyBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct < 20 ? "bg-emerald-500" : pct < 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-medium">-{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function DigitalTwin({ twin }: DigitalTwinProps) {
  const scoreColor =
    twin.health_score >= 90 ? "text-emerald-400" :
    twin.health_score >= 70 ? "text-amber-400" :
    twin.health_score >= 40 ? "text-orange-400" : "text-red-400";

  const scoreRing =
    twin.health_score >= 90 ? "stroke-emerald-400" :
    twin.health_score >= 70 ? "stroke-amber-400" :
    twin.health_score >= 40 ? "stroke-orange-400" : "stroke-red-400";

  const circumference = 2 * Math.PI * 45;
  const strokeDash = (twin.health_score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                Digital Twin
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-100">{twin.machine_name}</h2>
            <p className="text-xs text-slate-500">{twin.machine_type} · {twin.location || "No location"}</p>
          </div>
          <StatusBadge status={twin.status} size="md" />
        </div>
      </div>

      <div className="p-5 grid gap-5 md:grid-cols-2">
        {/* Health Score Ring */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="45" fill="none"
                className={scoreRing}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                style={{ filter: "drop-shadow(0 0 8px currentColor)", transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black tabular-nums ${scoreColor}`}>
                {twin.health_score.toFixed(0)}%
              </span>
              <span className="text-xs text-slate-500">Health</span>
            </div>
          </div>
          <p className={`mt-2 text-sm font-bold ${scoreColor}`}>{twin.status}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Updated {new Date(twin.last_updated).toLocaleTimeString()}
          </p>
        </div>

        {/* Sensor Readings */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Live Sensors</p>
          <SensorRow
            label="Temperature" value={twin.temperature.toFixed(1)} unit="°C" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>}
            normalRange={[40, 75]} currentValue={twin.temperature}
          />
          <SensorRow
            label="Vibration" value={twin.vibration.toFixed(3)} unit="g" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            normalRange={[0, 0.3]} currentValue={twin.vibration}
          />
          <SensorRow
            label="Pressure" value={twin.pressure.toFixed(1)} unit="psi" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            normalRange={[20, 90]} currentValue={twin.pressure}
          />
          <SensorRow
            label="Humidity" value={twin.humidity.toFixed(0)} unit="%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>}
            normalRange={[30, 70]} currentValue={twin.humidity}
          />
        </div>

        {/* More metrics */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Electrical</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Voltage", value: twin.voltage.toFixed(0), unit: "V" },
              { label: "Current", value: twin.current.toFixed(1), unit: "A" },
              { label: "RPM", value: twin.rpm.toFixed(0), unit: "rpm" },
              { label: "Machine ID", value: twin.machine_id, unit: "" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-800/60 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="mt-0.5 text-sm font-bold text-slate-200 tabular-nums">
                  {item.value}
                  {item.unit && <span className="text-xs text-slate-400 ml-1">{item.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
