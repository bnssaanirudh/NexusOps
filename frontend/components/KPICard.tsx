import type { KPISummary } from "@/lib/types";

interface KPICardProps {
  title: string;
  value: number;
  variant: "total" | "healthy" | "warning" | "risk" | "critical";
  icon: React.ReactNode;
  subtitle?: string;
}

const variantConfig = {
  total: {
    gradient: "from-blue-600/20 to-blue-500/5",
    border: "border-blue-500/30",
    icon: "bg-blue-500/20 text-blue-400",
    value: "text-blue-300",
    glow: "shadow-blue-500/10",
  },
  healthy: {
    gradient: "from-emerald-600/20 to-emerald-500/5",
    border: "border-emerald-500/30",
    icon: "bg-emerald-500/20 text-emerald-400",
    value: "text-emerald-300",
    glow: "shadow-emerald-500/10",
  },
  warning: {
    gradient: "from-amber-600/20 to-amber-500/5",
    border: "border-amber-500/30",
    icon: "bg-amber-500/20 text-amber-400",
    value: "text-amber-300",
    glow: "shadow-amber-500/10",
  },
  risk: {
    gradient: "from-orange-600/20 to-orange-500/5",
    border: "border-orange-500/30",
    icon: "bg-orange-500/20 text-orange-400",
    value: "text-orange-300",
    glow: "shadow-orange-500/10",
  },
  critical: {
    gradient: "from-red-600/20 to-red-500/5",
    border: "border-red-500/30",
    icon: "bg-red-500/20 text-red-400",
    value: "text-red-300",
    glow: "shadow-red-500/10",
  },
};

export function KPICard({ title, value, variant, icon, subtitle }: KPICardProps) {
  const config = variantConfig[variant];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${config.gradient} ${config.border} p-6 shadow-xl ${config.glow} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
    >
      {/* Background glow orb */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{title}</p>
          <p className={`mt-2 text-5xl font-black tabular-nums ${config.value}`}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-3 ${config.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

// Convenience wrapper for the full KPI row
interface KPIRowProps {
  kpi: KPISummary;
}

export function KPIRow({ kpi }: KPIRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <KPICard
        title="Total"
        value={kpi.total}
        variant="total"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
      />
      <KPICard
        title="Healthy"
        value={kpi.healthy}
        variant="healthy"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <KPICard
        title="Warning"
        value={kpi.warning}
        variant="warning"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
      />
      <KPICard
        title="Risk"
        value={kpi.risk}
        variant="risk"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
      />
      <KPICard
        title="Critical"
        value={kpi.critical}
        variant="critical"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
    </div>
  );
}
