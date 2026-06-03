"use client";

import { useState, useEffect, useCallback } from "react";
import { machineApi, simulatorApi } from "@/lib/api";
import type { Machine, DigitalTwinState } from "@/lib/types";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { AgentTimeline, AgentEvent } from "@/components/AgentTimeline";
import { AgentReasoningCard } from "@/components/AgentReasoningCard";
import { useWebSocket } from "@/lib/websocket";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, AlertTriangle, RefreshCw } from "lucide-react";

export default function SimulationLab() {
  const [activeMachineId, setActiveMachineId] = useState<string>("M001");
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);

  useEffect(() => {
    async function loadTwin() {
      try {
        const twinData = await machineApi.twin(activeMachineId);
        setTwin(twinData);
      } catch (err) {
        console.error("Failed to load twin:", err);
      }
    }
    loadTwin();
  }, [activeMachineId]);

  const handleSensorUpdate = useCallback((machineId: string, payload: any) => {
    if (machineId === activeMachineId && payload.twin) {
      setTwin(payload.twin);
      
      // If health drops, we can push a synthetic event for visual effect
      if (payload.twin.health_score < 80 && payload.twin.health_score >= 50) {
        setEvents(prev => [{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "Anomaly Detected", details: "Performance degradation observed" }, ...prev]);
      } else if (payload.twin.health_score < 50) {
        setEvents(prev => [
          { id: Date.now().toString() + "_2", timestamp: new Date().toISOString(), agent: "Planner Agent", action: "Maintenance Recommended", details: "Generate urgent ticket" },
          { id: Date.now().toString() + "_1", timestamp: new Date().toISOString(), agent: "Diagnosis Agent", action: "Critical Failure Predicted", details: "High risk of immediate failure" },
          ...prev
        ]);
      }
    }
  }, [activeMachineId]);

  useWebSocket({
    machineId: activeMachineId,
    onSensorUpdate: handleSensorUpdate,
  });

  const injectFault = async (scenario: string) => {
    setIsInjecting(true);
    setEvents([{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "System Check", details: `Injecting ${scenario}...` }]);
    try {
      await simulatorApi.inject(activeMachineId, scenario);
      // Let WS handle the rest
    } catch (err) {
      console.error(err);
    } finally {
      setIsInjecting(false);
    }
  };

  const resetMachine = async () => {
    setIsInjecting(true);
    try {
      await simulatorApi.reset(activeMachineId);
      setEvents([{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Approval Agent", action: "System Reset", details: "Machine restored to healthy baseline" }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto h-full pb-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-[#0F4C81] flex items-center gap-2">
            <FlaskConical className="w-8 h-8" /> Simulation Lab
          </h1>
          <p className="text-slate-500">Inject faults and observe real-time AI response and mitigation.</p>
        </div>
        <Button onClick={resetMachine} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Reset Machine
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left: Injection Controls (3 cols) */}
        <Card className="lg:col-span-3 flex flex-col bg-white border-[#E5E7EB]">
          <div className="p-4 border-b border-[#E5E7EB] bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Fault Injection
          </div>
          <div className="flex-1 p-4 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3 border-amber-200 hover:bg-amber-50 hover:text-amber-900"
              onClick={() => injectFault("bearing_wear")}
              disabled={isInjecting}
            >
              <div className="flex flex-col">
                <span className="font-bold">Inject Bearing Failure</span>
                <span className="text-xs font-normal opacity-70">Gradual vibration and temp increase</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3 border-rose-200 hover:bg-rose-50 hover:text-rose-900"
              onClick={() => injectFault("overheating")}
              disabled={isInjecting}
            >
              <div className="flex flex-col">
                <span className="font-bold">Inject Overheating</span>
                <span className="text-xs font-normal opacity-70">Rapid temperature spike</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3 border-blue-200 hover:bg-blue-50 hover:text-blue-900"
              onClick={() => injectFault("pressure_leak")}
              disabled={isInjecting}
            >
              <div className="flex flex-col">
                <span className="font-bold">Inject Pressure Leak</span>
                <span className="text-xs font-normal opacity-70">Sudden drop in pressure</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-3 border-purple-200 hover:bg-purple-50 hover:text-purple-900"
              onClick={() => injectFault("voltage_instability")}
              disabled={isInjecting}
            >
              <div className="flex flex-col">
                <span className="font-bold">Inject Voltage Failure</span>
                <span className="text-xs font-normal opacity-70">Erratic electrical behavior</span>
              </div>
            </Button>
          </div>
        </Card>

        {/* Center: Digital Twin (6 cols) */}
        <div className="lg:col-span-6 flex flex-col">
          <DigitalTwinViewer twin={twin} />
        </div>

        {/* Right: Agent Reasoning (3 cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <AgentReasoningCard 
            conclusion={twin?.status === "Critical" ? "Critical Failure Detected" : twin?.status === "Warning" ? "Anomaly - Degradation Observed" : "System Healthy"}
            evidence={[
              { metric: "Vibration", trend: twin?.vibration && twin.vibration > 0.15 ? "up" : "stable", value: twin?.vibration ? `${twin.vibration.toFixed(3)}g` : "0.10g" },
              { metric: "Temperature", trend: twin?.temperature && twin.temperature > 70 ? "up" : "stable", value: twin?.temperature ? `${twin.temperature.toFixed(1)}°C` : "65.0°C" },
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
