"use client";

import { useState, useEffect, useCallback } from "react";
import { machineApi, agentApi } from "@/lib/api";
import type { Machine, DigitalTwinState } from "@/lib/types";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { AgentTimeline, AgentEvent } from "@/components/AgentTimeline";
import { AgentReasoningCard } from "@/components/AgentReasoningCard";
import { useWebSocket } from "@/lib/websocket";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivitySquare, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeMachineId, setActiveMachineId] = useState<string | null>(null);
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  
  // Dummy agent events for the UI if API doesn't provide them nicely
  const generateAgentEvents = (machineId: string) => {
    return [
      { id: "1", timestamp: new Date(Date.now() - 50000).toISOString(), agent: "Monitoring Agent" as const, action: "Anomaly Detected", details: `Vibration spike detected on ${machineId}` },
      { id: "2", timestamp: new Date(Date.now() - 40000).toISOString(), agent: "Diagnosis Agent" as const, action: "Root Cause Analysis", details: "Bearing degradation likely based on historical patterns" },
      { id: "3", timestamp: new Date(Date.now() - 30000).toISOString(), agent: "Planner Agent" as const, action: "Action Proposed", details: "Schedule bearing replacement within 48h" }
    ];
  };

  useEffect(() => {
    async function init() {
      try {
        const list = await machineApi.list();
        setMachines(list);
        if (list.length > 0) {
          setActiveMachineId(list[0].machine_id);
        }
      } catch (err) {
        console.error("Failed to load machines:", err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!activeMachineId) return;
    async function loadTwin() {
      try {
        const twinData = await machineApi.twin(activeMachineId!);
        setTwin(twinData);
        setEvents(generateAgentEvents(activeMachineId!));
      } catch (err) {
        console.error("Failed to load twin:", err);
      }
    }
    loadTwin();
  }, [activeMachineId]);

  // WebSocket for real-time twin updates
  const handleSensorUpdate = useCallback((machineId: string, payload: any) => {
    if (machineId === activeMachineId && payload.twin) {
      setTwin(payload.twin);
    }
  }, [activeMachineId]);

  useWebSocket({
    machineId: activeMachineId || "M001",
    onSensorUpdate: handleSensorUpdate,
  });

  const healthyCount = machines.filter(m => m.status === "Healthy").length;
  const warningCount = machines.filter(m => m.status === "Warning").length;
  const criticalCount = machines.filter(m => m.status === "Critical").length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto h-full pb-10">
      
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <KPICard title="Total Assets" value={machines.length.toString()} icon={ActivitySquare} color="text-blue-600" />
        <KPICard title="Healthy" value={healthyCount.toString()} icon={CheckCircle} color="text-emerald-600" />
        <KPICard title="Warning" value={warningCount.toString()} icon={AlertTriangle} color="text-amber-500" />
        <KPICard title="Critical" value={criticalCount.toString()} icon={XCircle} color="text-red-500" />
      </div>

      {/* Main Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Left: Machine List (3 cols) */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden bg-white border-[#E5E7EB]">
          <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700">
            Active Assets
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[500px]">
            {machines.map((m) => (
              <button
                key={m.machine_id}
                onClick={() => setActiveMachineId(m.machine_id)}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors text-left ${
                  activeMachineId === m.machine_id ? "bg-[#0F4C81] text-white shadow-md" : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div>
                  <div className="font-semibold">{m.machine_id}</div>
                  <div className={`text-xs ${activeMachineId === m.machine_id ? "text-blue-200" : "text-slate-500"}`}>
                    {m.machine_type}
                  </div>
                </div>
                <Badge variant={m.status.toLowerCase() as any} className={activeMachineId === m.machine_id ? "border-white/20" : ""}>
                  {m.status}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Center: Digital Twin (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <DigitalTwinViewer twin={twin} />
        </div>

        {/* Right: Agent Reasoning (3 cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <AgentReasoningCard 
            conclusion={twin?.status === "Critical" ? "Bearing Failure Detected" : twin?.status === "Warning" ? "Vibration Anomaly - Possible Degradation" : "Normal Operation"}
            evidence={[
              { metric: "Vibration", trend: twin?.vibration && twin.vibration > 0.15 ? "up" : "stable", value: twin?.vibration ? `${twin.vibration.toFixed(3)}g` : "0.10g" },
              { metric: "Temperature", trend: twin?.temperature && twin.temperature > 70 ? "up" : "stable", value: twin?.temperature ? `${twin.temperature.toFixed(1)}°C` : "65.0°C" },
              { metric: "Pressure", trend: twin?.pressure && twin.pressure < 40 ? "down" : "stable", value: twin?.pressure ? `${twin.pressure.toFixed(1)} PSI` : "45.0 PSI" },
            ]}
          />
        </div>
      </div>

      {/* Bottom: Agent Timeline */}
      <div className="h-[250px]">
        <AgentTimeline events={events} />
      </div>
      
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="flex items-center p-5 bg-white hover-lift transition-all">
      <div className={`p-3 rounded-full bg-slate-50 border border-slate-100 mr-4 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}
