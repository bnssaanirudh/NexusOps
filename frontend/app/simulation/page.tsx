"use client";

import { useState, useEffect, useCallback } from "react";
import { machineApi, simulatorApi } from "@/lib/api";
import type { DigitalTwinState } from "@/lib/types";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { AgentTimeline, AgentEvent } from "@/components/AgentTimeline";
import { AgentReasoningCard } from "@/components/AgentReasoningCard";
import { useWebSocket } from "@/lib/websocket";
import { FlaskConical, AlertTriangle, RefreshCw, Zap, Thermometer, Droplets, Activity } from "lucide-react";
import { motion } from "framer-motion";

const T = {
  cream: '#F2EEE8', creamDark: '#E8E2D9', creamMid: '#DDD5C8',
  ink: '#1C1A18', inkMid: '#3D3830', inkSoft: '#6B6158', inkGhost: '#9A9089',
  amber: '#C07C2A', amberLight: '#F5D6A8',
  rust: '#B84432', rustLight: '#F0C4BC',
  sage: '#3A6B4A', sageLight: '#C0D9C8',
  steel: '#3A5070', steelLight: '#D0DFF0',
  warning: '#917320', warningLight: '#F0DCA0',
  FONT: "'Space Grotesk', sans-serif",
  MONO: "'Space Mono', monospace",
};

const FAULT_SCENARIOS = [
  { key: "bearing_wear",        label: "Bearing Failure",    sub: "Gradual vibration + temp increase", icon: Activity,     color: T.warning, bg: T.warningLight },
  { key: "motor_overheating",   label: "Motor Overheating",  sub: "Rapid temperature spike",           icon: Thermometer,  color: T.rust,    bg: T.rustLight },
  { key: "pressure_leak",       label: "Pressure Leak",      sub: "Sudden drop in pressure",           icon: Droplets,     color: T.steel,   bg: T.steelLight },
  { key: "voltage_instability", label: "Voltage Instability",sub: "Erratic electrical behaviour",      icon: Zap,          color: T.amber,   bg: T.amberLight },
];

const MACHINES = ["M001", "M002", "M003", "M004", "M005"];

export default function SimulationLab() {
  const [activeMachineId, setActiveMachineId] = useState<string>("M001");
  const [twin, setTwin]     = useState<DigitalTwinState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  useEffect(() => {
    async function loadTwin() {
      try { const data = await machineApi.twin(activeMachineId); setTwin(data); }
      catch (err) { console.error("Failed to load twin:", err); }
    }
    loadTwin();
  }, [activeMachineId]);

  const handleSensorUpdate = useCallback((machineId: string, payload: any) => {
    if (machineId === activeMachineId && payload.twin) {
      setTwin(payload.twin);
      if (payload.twin.health_score < 80 && payload.twin.health_score >= 50) {
        setEvents(prev => [{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "Anomaly Detected", details: "Performance degradation observed" }, ...prev.slice(0, 9)]);
      } else if (payload.twin.health_score < 50) {
        setEvents(prev => [
          { id: Date.now() + "_p", timestamp: new Date().toISOString(), agent: "Planner Agent", action: "Maintenance Recommended", details: "Generate urgent ticket" },
          { id: Date.now() + "_d", timestamp: new Date().toISOString(), agent: "Diagnosis Agent", action: "Critical Failure Predicted", details: "High risk of immediate failure" },
          ...prev.slice(0, 8)
        ]);
      }
    }
  }, [activeMachineId]);

  useWebSocket({ machineId: activeMachineId, onSensorUpdate: handleSensorUpdate });

  const injectFault = async (scenario: string) => {
    setIsBusy(true);
    setActiveScenario(scenario);
    setEvents([{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Monitoring Agent", action: "System Check", details: `Injecting ${scenario} fault scenario...` }]);
    try { await simulatorApi.inject(activeMachineId, scenario); }
    catch (err) { console.error(err); }
    finally { setIsBusy(false); }
  };

  const resetMachine = async () => {
    setIsBusy(true);
    setActiveScenario(null);
    try {
      await simulatorApi.reset(activeMachineId);
      setEvents([{ id: Date.now().toString(), timestamp: new Date().toISOString(), agent: "Approval Agent", action: "System Reset", details: "Machine restored to healthy baseline" }]);
    } catch (err) { console.error(err); }
    finally { setIsBusy(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.35rem' }}>
            — What-If Scenario Testing
          </div>
          <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: T.ink, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <FlaskConical style={{ width: '22px', height: '22px', color: T.amber }} />
            Simulation Lab
          </h1>
          <p style={{ fontFamily: T.FONT, fontSize: '0.875rem', color: T.inkSoft, marginTop: '0.25rem' }}>
            Inject faults and observe real-time AI response and mitigation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Machine selector */}
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {MACHINES.map(mid => (
              <button
                key={mid}
                onClick={() => setActiveMachineId(mid)}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: `1px solid ${T.creamMid}`,
                  backgroundColor: activeMachineId === mid ? T.ink : T.cream,
                  color: activeMachineId === mid ? T.cream : T.inkSoft,
                  fontFamily: T.MONO, fontSize: '0.65rem', letterSpacing: '0.08em', cursor: 'pointer',
                  fontWeight: 700, transition: 'all 0.15s ease',
                }}
              >
                {mid}
              </button>
            ))}
          </div>
          
          <button
            onClick={resetMachine}
            disabled={isBusy}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              border: `1px solid ${T.creamMid}`, backgroundColor: T.cream,
              color: T.inkMid, fontFamily: T.FONT, fontWeight: 500, fontSize: '0.82rem',
              cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            Reset Machine
          </button>
        </div>
      </div>

      {/* Fault injection bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
        {FAULT_SCENARIOS.map((s, i) => {
          const Icon = s.icon;
          const isActive = activeScenario === s.key;
          return (
            <motion.button
              key={s.key}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(28,26,24,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => injectFault(s.key)}
              disabled={isBusy}
              style={{
                padding: '1rem 1.25rem', borderRadius: '0.75rem', cursor: isBusy ? 'not-allowed' : 'pointer',
                border: `1.5px solid ${isActive ? s.color : T.creamMid}`,
                backgroundColor: isActive ? s.bg : T.creamDark,
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.875rem',
                opacity: isBusy ? 0.5 : 1, transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: isActive ? s.color + '30' : T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: '16px', height: '16px', color: s.color }} />
              </div>
              <div>
                <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.82rem', color: T.ink }}>{s.label}</div>
                <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', color: T.inkGhost, letterSpacing: '0.05em', marginTop: '0.1rem' }}>{s.sub}</div>
              </div>
              {isActive && (
                <div style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: s.color, animation: 'live-pulse 1.8s ease-in-out infinite', flexShrink: 0 }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', minHeight: '500px' }}>
        <DigitalTwinViewer twin={twin} />
        <AgentReasoningCard
          conclusion={twin?.status === "Critical" ? "Critical Failure Detected" : twin?.status === "Warning" ? "Anomaly — Degradation Observed" : "System Healthy"}
          evidence={[
            { metric: "Vibration", trend: twin?.vibration && twin.vibration > 0.15 ? "up" : "stable", value: twin?.vibration ? `${twin.vibration.toFixed(3)}g` : "0.10g" },
            { metric: "Temperature", trend: twin?.temperature && twin.temperature > 70 ? "up" : "stable", value: twin?.temperature ? `${twin.temperature.toFixed(1)}°C` : "65.0°C" },
            { metric: "Health Score", trend: twin?.health_score && twin.health_score < 70 ? "down" : "stable", value: twin?.health_score ? `${twin.health_score.toFixed(1)}%` : "100%" },
          ]}
        />
      </div>

      {/* Agent Timeline */}
      <div style={{ height: '280px' }}>
        <AgentTimeline events={events} />
      </div>
    </div>
  );
}
