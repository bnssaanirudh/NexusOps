"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { predictiveApi } from "@/lib/api";
import type { Alert } from "@/lib/types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"Active" | "Resolved" | "All">("Active");

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await predictiveApi.alerts(filter === "All" ? undefined : filter, 100);
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadAlerts();
    // Poll for new alerts
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, [loadAlerts]);

  const handleResolve = async (id: string) => {
    await predictiveApi.resolveAlert(id);
    loadAlerts();
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Alert Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI-driven predictive maintenance recommendations</p>
          </div>
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            {(["Active", "Resolved", "All"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading && alerts.length === 0 ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" /></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">No {filter.toLowerCase()} alerts found.</div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`rounded-2xl border p-5 transition-all ${
                  alert.status === "Active" 
                    ? alert.severity === "Critical" ? "bg-red-500/5 border-red-500/20" : "bg-orange-500/5 border-orange-500/20"
                    : "bg-slate-800/40 border-slate-700/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                      alert.status === "Resolved" ? "bg-slate-700" :
                      alert.severity === "Critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                    }`}>
                      {alert.status === "Resolved" ? (
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={`/machines/${alert.machine_id}`} className="font-mono text-sm font-bold text-cyan-400 hover:underline">
                          {alert.machine_id}
                        </Link>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                           alert.status === "Resolved" ? "border-slate-600 text-slate-500" :
                           alert.severity === "Critical" ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-orange-500/30 text-orange-400 bg-orange-500/10"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      <p className={`text-base font-medium ${alert.status === "Resolved" ? "text-slate-400" : "text-slate-200"} mb-3`}>
                        {alert.message}
                      </p>
                      {alert.recommendation && (
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            AI Recommendation
                          </p>
                          <p className="text-sm text-slate-300">{alert.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {alert.status === "Active" && (
                    <button 
                      onClick={() => handleResolve(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
