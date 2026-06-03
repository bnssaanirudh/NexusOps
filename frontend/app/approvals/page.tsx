"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ticketApi } from "@/lib/api";
import type { MaintenanceTicket } from "@/lib/types";

export default function ApprovalsPage() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadTickets = async () => {
    try {
      const data = await ticketApi.list("Pending Approval");
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await ticketApi.approve(id);
      await loadTickets();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await ticketApi.reject(id);
      await loadTickets();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <h1 className="text-xl font-bold text-slate-100">Human-in-the-Loop Approvals</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review AI-proposed maintenance actions and costs</p>
      </div>

      <div className="px-6 py-6">
        {loading && tickets.length === 0 ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">👍</div>
            <p className="text-slate-400">All caught up! No pending approvals.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-slate-500 mb-1 block">Ticket: {t.id}</span>
                    <Link href={`/machines/${t.machine_id}`} className="text-lg font-bold text-cyan-400 hover:underline flex items-center gap-2">
                      {t.machine_id}
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                        t.priority === "Critical" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                      }`}>
                        {t.priority}
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Summary</p>
                    <p className="text-sm text-slate-200">{t.issue_summary}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">AI Recommended Action</p>
                    <p className="text-sm text-emerald-300">{t.recommended_action}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Repair Cost</p>
                    <p className="text-xl font-bold text-slate-200">${t.repair_cost_est?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Est. Failure Cost</p>
                    <p className="text-xl font-bold text-red-400">${t.downtime_cost_est?.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApprove(t.id)}
                    disabled={processingId !== null}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {processingId === t.id ? "Processing..." : "Approve"}
                  </button>
                  <button 
                    onClick={() => handleReject(t.id)}
                    disabled={processingId !== null}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
