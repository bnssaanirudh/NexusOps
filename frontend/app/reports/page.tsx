"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ReportData {
  period_days: number;
  generated_at: string;
  machines: {
    total: number; healthy: number; warning: number; risk: number; critical: number; availability_pct: number;
  };
  alerts: { total: number; critical: number; high_risk: number; resolved: number; };
  predictions: { total_scans: number; anomalies_detected: number; accuracy_pct: number; };
  maintenance: {
    tickets_generated: number; tickets_approved: number;
    repair_cost_usd: number; failure_cost_averted_usd: number;
    net_savings_usd: number; downtime_hours_prevented: number; roi_multiplier: number;
  };
}

function StatCard({ label, value, subLabel, accent = false }: { label: string; value: string | number; subLabel?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${accent ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/60 border border-slate-700/50"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${accent ? "text-emerald-400" : "text-slate-500"}`}>{label}</p>
      <p className={`text-2xl font-black ${accent ? "text-emerald-300" : "text-slate-200"}`}>{value}</p>
      {subLabel && <p className="text-xs text-slate-500 mt-0.5">{subLabel}</p>}
    </div>
  );
}

export default function ReportsPage() {
  const [daily, setDaily] = useState<ReportData | null>(null);
  const [weekly, setWeekly] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/reports/daily`).then((r) => r.json()).catch(() => null),
      fetch(`${API_BASE}/reports/weekly`).then((r) => r.json()).catch(() => null),
    ]).then(([d, w]) => {
      setDaily(d);
      setWeekly(w);
      setLoading(false);
    });
  }, []);

  const report = activeTab === "daily" ? daily : weekly;

  const handleExportCsv = () => {
    const days = activeTab === "daily" ? 1 : 7;
    window.open(`${API_BASE}/reports/export/csv?days=${days}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Automated Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI-generated operational and financial summaries</p>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
        <div className="flex gap-1 mt-3">
          <button onClick={() => setActiveTab("daily")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "daily" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"}`}>
            Daily Report
          </button>
          <button onClick={() => setActiveTab("weekly")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "weekly" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-slate-400 hover:text-slate-200"}`}>
            Weekly Report
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        ) : !report ? (
          <div className="text-center py-20 text-slate-500">
            <p>Backend not reachable. Start Docker to generate reports.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {activeTab === "daily" ? "Daily" : "Weekly"} Operational Report
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Generated {new Date(report.generated_at).toLocaleString()} · Period: Last {report.period_days} day{report.period_days > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">SentinelAI</p>
                <p className="text-sm font-bold text-slate-300">Autonomous Report Engine</p>
              </div>
            </div>

            {/* Machine Status */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">🏭 Machine Status</h3>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                <StatCard label="Total" value={report.machines.total} />
                <StatCard label="Healthy" value={report.machines.healthy} subLabel="Optimal" accent />
                <StatCard label="Warning" value={report.machines.warning} />
                <StatCard label="At Risk" value={report.machines.risk} />
                <StatCard label="Critical" value={report.machines.critical} />
                <StatCard label="Availability" value={`${report.machines.availability_pct}%`} subLabel="Uptime" accent />
              </div>
            </div>

            {/* Predictions & AI */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">🧠 AI Intelligence</h3>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                <StatCard label="Total AI Scans" value={report.predictions.total_scans.toLocaleString()} />
                <StatCard label="Anomalies Detected" value={report.predictions.anomalies_detected} subLabel="By Isolation Forest" />
                <StatCard label="ML Accuracy" value={`${report.predictions.accuracy_pct}%`} subLabel="XGBoost Model" accent />
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">🚨 Alert Summary</h3>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                <StatCard label="Total Alerts" value={report.alerts.total} />
                <StatCard label="Critical" value={report.alerts.critical} />
                <StatCard label="High Risk" value={report.alerts.high_risk} />
                <StatCard label="Resolved" value={report.alerts.resolved} accent />
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">💰 Financial Impact</h3>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Tickets Generated" value={report.maintenance.tickets_generated} />
                <StatCard label="Tickets Actioned" value={report.maintenance.tickets_approved} accent />
                <StatCard label="Repair Spend" value={`$${report.maintenance.repair_cost_usd.toLocaleString()}`} />
                <StatCard label="Failure Cost Averted" value={`$${report.maintenance.failure_cost_averted_usd.toLocaleString()}`} subLabel="Prevented" accent />
                <StatCard label="Net Savings" value={`$${report.maintenance.net_savings_usd.toLocaleString()}`} accent />
                <StatCard label="Downtime Saved" value={`${report.maintenance.downtime_hours_prevented}h`} subLabel="Hours" accent />
              </div>
              <div className="mt-6 pt-6 border-t border-emerald-500/20 flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  Every $1 spent on predictive maintenance returned&nbsp;
                  <span className="font-black text-emerald-400 text-lg">${report.maintenance.roi_multiplier}</span>
                  &nbsp;in averted failure costs.
                </p>
                <button
                  onClick={handleExportCsv}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
