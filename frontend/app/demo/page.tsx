"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, ShieldAlert, BrainCircuit, Wrench, TrendingUp, Settings } from "lucide-react";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { AgentTimeline, AgentEvent } from "@/components/AgentTimeline";
import { AgentReasoningCard } from "@/components/AgentReasoningCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEMO_STEPS = [
  { id: 1, name: "Normal Operation", icon: CheckCircle2, duration: 3000 },
  { id: 2, name: "Fault Injected (Bearing Wear)", icon: ShieldAlert, duration: 4000 },
  { id: 3, name: "Predictive Anomaly Detected", icon: TrendingUp, duration: 3000 },
  { id: 4, name: "AI Agent Diagnostics", icon: BrainCircuit, duration: 4000 },
  { id: 5, name: "Maintenance Planner Agent", icon: Settings, duration: 3000 },
  { id: 6, name: "Approval & Ticket Creation", icon: Wrench, duration: 4000 },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [twin, setTwin] = useState<any>({
    machine_id: "DEMO-001",
    machine_type: "CNC Mill",
    location: "Main Floor",
    status: "Healthy",
    health_score: 98,
    temperature: 65.2,
    vibration: 0.1,
    pressure: 45.1,
    voltage: 220,
    humidity: 50,
    rpm: 1500,
  });

  const startDemo = () => {
    setIsRunning(true);
    setActiveStep(1);
    setEvents([]);
    setTwin((prev: any) => ({ ...prev, status: "Healthy", health_score: 98, vibration: 0.1 }));
  };

  useEffect(() => {
    if (!isRunning || activeStep === 0) return;

    let timer: NodeJS.Timeout;

    if (activeStep === 1) {
      // Normal Operation
      setEvents([{ id: "e1", timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "System Check", details: "All parameters nominal" }]);
      timer = setTimeout(() => setActiveStep(2), DEMO_STEPS[0].duration);
    } 
    else if (activeStep === 2) {
      // Fault Injected
      setTwin((prev: any) => ({ ...prev, status: "Warning", health_score: 74, vibration: 1.2, temperature: 72 }));
      setEvents(prev => [{ id: "e2", timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "Vibration Spike Detected", details: "Vibration increased to 1.2g" }, ...prev]);
      timer = setTimeout(() => setActiveStep(3), DEMO_STEPS[1].duration);
    }
    else if (activeStep === 3) {
      // Predictive Anomaly
      setTwin((prev: any) => ({ ...prev, status: "Critical", health_score: 38, vibration: 2.8, temperature: 84 }));
      setEvents(prev => [{ id: "e3", timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "Critical Anomaly", alert: true, details: "Failure predicted within 24h (Prob: 89%)" }, ...prev]);
      timer = setTimeout(() => setActiveStep(4), DEMO_STEPS[2].duration);
    }
    else if (activeStep === 4) {
      // AI Diagnostics
      setEvents(prev => [{ id: "e4", timestamp: new Date().toISOString(), agent: "Diagnosis Agent", action: "Root Cause Analysis", details: "High correlation between vibration frequency and bearing wear. Structural damage imminent." }, ...prev]);
      timer = setTimeout(() => setActiveStep(5), DEMO_STEPS[3].duration);
    }
    else if (activeStep === 5) {
      // Planner Agent
      setEvents(prev => [{ id: "e5", timestamp: new Date().toISOString(), agent: "Planner Agent", action: "Maintenance Action Proposed", details: "Schedule immediate bearing replacement. Estimated cost: $450 vs $12,000 failure cost." }, ...prev]);
      timer = setTimeout(() => setActiveStep(6), DEMO_STEPS[4].duration);
    }
    else if (activeStep === 6) {
      // Ticket Creation
      setEvents(prev => [{ id: "e6", timestamp: new Date().toISOString(), agent: "Approval Agent", action: "Ticket Generated", details: "Auto-approved due to critical risk. Ticket #T-8894 assigned to Tech-Team-A." }, ...prev]);
      timer = setTimeout(() => setIsRunning(false), DEMO_STEPS[5].duration);
    }

    return () => clearTimeout(timer);
  }, [activeStep, isRunning]);

  return (
    <div className="max-w-[1400px] mx-auto w-full h-full pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F4C81]">Executive Demo</h1>
          <p className="text-slate-500">Automated sequence showcasing the full platform capability.</p>
        </div>
        <Button 
          size="lg" 
          onClick={startDemo} 
          disabled={isRunning}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Play className="w-5 h-5" />
          {isRunning ? "Demo Running..." : "Start Demo Sequence"}
        </Button>
      </div>

      {/* Demo Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {DEMO_STEPS.map((step) => {
          const Icon = step.icon;
          const isPast = activeStep > step.id || (!isRunning && activeStep === 6);
          const isCurrent = activeStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#F8FAFC] transition-colors duration-500 ${
                isPast ? "bg-emerald-500 text-white" : isCurrent ? "bg-blue-600 text-white animate-pulse shadow-lg" : "bg-slate-200 text-slate-400"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold mt-2 max-w-[100px] text-center ${isCurrent ? "text-blue-700" : "text-slate-500"}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center: Digital Twin (8 cols) */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          <DigitalTwinViewer twin={twin} />
        </div>

        {/* Right: Agent Reasoning & Timeline (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="h-[250px]">
            <AgentReasoningCard 
              conclusion={
                activeStep < 2 ? "Normal Operation" : 
                activeStep < 4 ? "Anomaly Detected - Analyzing..." : 
                "Critical Bearing Wear Detected. Maintenance Required."
              }
              evidence={[
                { metric: "Vibration", trend: twin.vibration > 0.15 ? "up" : "stable", value: `${twin.vibration}g` },
                { metric: "Temperature", trend: twin.temperature > 70 ? "up" : "stable", value: `${twin.temperature}°C` },
              ]}
            />
          </div>
          <div className="flex-1 h-[350px]">
            <AgentTimeline events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
