"use client";

import { BrainCircuit, Settings, ActivitySquare, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const agents = [
  { name: "Monitoring Agent", role: "Anomaly Detection", status: "Active", icon: ActivitySquare, color: "text-blue-500", bg: "bg-blue-50", desc: "Continuously scans streaming telemetry for statistical deviations." },
  { name: "Diagnosis Agent", role: "Root Cause Analysis", status: "Active", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50", desc: "Correlates anomalies with historical fault patterns to diagnose issues." },
  { name: "Planner Agent", role: "Maintenance Optimization", status: "Active", icon: Settings, color: "text-emerald-500", bg: "bg-emerald-50", desc: "Schedules maintenance actions weighing failure risk vs operational downtime." },
  { name: "Approval Agent", role: "Human-in-the-Loop", status: "Active", icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50", desc: "Creates tickets and gates critical operations requiring executive sign-off." },
];

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-[#0F4C81]">Agent Center</h1>
        <p className="text-slate-500">Manage autonomous AI agents and their operational logic.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <Card key={idx} className="hover-lift border-[#E5E7EB] bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-xl ${agent.bg} ${agent.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    {agent.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{agent.name}</h3>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{agent.role}</p>
                <p className="text-slate-600">{agent.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
