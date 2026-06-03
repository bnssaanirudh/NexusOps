"use client";

import { useState, useEffect } from "react";
import { ticketApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Check, X } from "lucide-react";

export default function MaintenanceHub() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await ticketApi.list();
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await ticketApi.approve(id);
      setTickets(tickets.map(t => t.id === id ? { ...t, status: "Approved" } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await ticketApi.reject(id);
      setTickets(tickets.map(t => t.id === id ? { ...t, status: "Rejected" } : t));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-[#0F4C81]">Maintenance Hub</h1>
        <p className="text-slate-500">Review and approve autonomous maintenance actions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-slate-500">No active maintenance tickets.</p>
        ) : (
          tickets.map((t) => (
            <Card key={t.id} className="hover-lift border-[#E5E7EB] bg-white flex flex-col">
              <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-4 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-slate-500" /> Ticket #{t.id.slice(0,6).toUpperCase()}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{t.machine_id}</p>
                </div>
                <Badge variant={t.status === "Pending" ? "warning" : t.status === "Approved" ? "healthy" : "destructive"}>
                  {t.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Recommended Action</p>
                  <p className="text-sm font-medium text-slate-900">{t.recommended_action}</p>
                </div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Est. Cost</p>
                    <p className="text-sm font-bold text-emerald-600">${t.estimated_cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Downtime</p>
                    <p className="text-sm font-bold text-slate-700">{t.estimated_downtime_hours} hrs</p>
                  </div>
                </div>
                
                {t.status === "Pending" && (
                  <div className="flex gap-3 mt-auto pt-4 border-t border-[#E5E7EB]">
                    <Button 
                      className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" 
                      onClick={() => handleApprove(t.id)}
                    >
                      <Check className="w-4 h-4" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handleReject(t.id)}
                    >
                      <X className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
