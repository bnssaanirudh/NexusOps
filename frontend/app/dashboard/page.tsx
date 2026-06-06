"use client";

import { useState, useEffect, useCallback } from "react";
import { machineApi, agentApi } from "@/lib/api";
import type { DigitalTwinState } from "@/lib/types";
import { DigitalTwinViewer } from "@/components/DigitalTwinViewer";
import { AgentTimeline, AgentEvent } from "@/components/AgentTimeline";
import { AgentReasoningCard } from "@/components/AgentReasoningCard";
import { useWebSocket } from "@/lib/websocket";
import { ActivitySquare, CheckCircle, AlertTriangle, XCircle, LayoutDashboard } from "lucide-react";
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

export default function DashboardPage() {
  const [machines, setMachines] = useState<DigitalTwinState[]>([]);
  const [activeMachineId, setActiveMachineId] = useState<string | null>(null);
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [events, setEvents] = useState<AgentEvent[]>([]);

  const generateAgentEvents = (machineId: string) => [
    { id: "1", timestamp: new Date(Date.now() - 50000).toISOString(), agent: "Monitoring Agent" as const, action: "Anomaly Detected", details: `Vibration spike detected on ${machineId}` },
    { id: "2", timestamp: new Date(Date.now() - 40000).toISOString(), agent: "Diagnosis Agent" as const, action: "Root Cause Analysis", details: "Bearing degradation likely based on historical patterns" },
    { id: "3", timestamp: new Date(Date.now() - 30000).toISOString(), agent: "Planner Agent" as const, action: "Action Proposed", details: "Schedule bearing replacement within 48h" },
  ];

  useEffect(() => {
    async function init() {
      try {
        const list = await machineApi.twins();
        setMachines(list);
        if (list.length > 0) setActiveMachineId(list[0].machine_id);
      } catch (err) { console.error("Failed to load machines:", err); }
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
      } catch (err) { console.error("Failed to load twin:", err); }
    }
    loadTwin();
  }, [activeMachineId]);

  const handleSensorUpdate = useCallback((machineId: string, payload: any) => {
    if (machineId === activeMachineId && payload.twin) setTwin(payload.twin);
  }, [activeMachineId]);

  useWebSocket({ machineId: activeMachineId || "M001", onSensorUpdate: handleSensorUpdate });

  const healthyCount  = machines.filter(m => m.status === "Healthy").length;
  const warningCount  = machines.filter(m => m.status === "Warning").length;
  const criticalCount = machines.filter(m => m.status === "Critical").length;

  const getStatusMeta = (status: string) => {
    if (status === "Healthy")  return { color: T.sage,    bg: T.sageLight };
    if (status === "Warning")  return { color: T.warning, bg: T.warningLight };
    if (status === "Critical") return { color: T.rust,    bg: T.rustLight };
    return { color: T.steel, bg: T.steelLight };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div style={{ width: '32px', height: '32px', background: T.ink, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayoutDashboard style={{ width: '15px', height: '15px', color: T.cream }} />
        </div>
        <div>
          <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.03em', color: T.ink }}>
            Command Center
          </h1>
          <p style={{ fontFamily: T.MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Real-time fleet monitoring & digital twin control
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { title: 'Total Assets', value: machines.length, icon: ActivitySquare, color: T.steel, bg: T.steelLight },
          { title: 'Healthy', value: healthyCount, icon: CheckCircle, color: T.sage, bg: T.sageLight },
          { title: 'Warning', value: warningCount, icon: AlertTriangle, color: T.warning, bg: T.warningLight },
          { title: 'Critical', value: criticalCount, icon: XCircle, color: T.rust, bg: T.rustLight },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
              borderRadius: '0.75rem', padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '0.625rem',
              backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <kpi.icon style={{ width: '18px', height: '18px', color: kpi.color }} />
            </div>
            <div>
              <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.04em', lineHeight: 1, color: T.ink }}>
                {kpi.value}
              </div>
              <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost, marginTop: '0.15rem' }}>
                {kpi.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '1.25rem', minHeight: '520px' }}>
        
        {/* Left — Machine List */}
        <div style={{
          backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
          borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '0.875rem 1rem', borderBottom: `1px solid ${T.creamMid}`,
            backgroundColor: T.cream,
            fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700,
          }}>
            Active Assets
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {machines.map((m) => {
              const meta = getStatusMeta(m.status);
              const isActive = activeMachineId === m.machine_id;
              return (
                <button
                  key={m.machine_id}
                  onClick={() => setActiveMachineId(m.machine_id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.75rem 0.875rem',
                    borderRadius: '0.5rem', cursor: 'pointer', border: 'none',
                    backgroundColor: isActive ? T.cream : 'transparent',
                    boxShadow: isActive ? `0 0 0 1.5px ${T.creamMid}` : 'none',
                    display: 'flex', flexDirection: 'column', gap: '0.35rem',
                    transition: 'background 0.15s ease',
                    marginBottom: '0.25rem',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = T.cream + '80'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.85rem', color: T.ink }}>
                      {m.machine_id}
                    </span>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: '100px',
                      backgroundColor: meta.bg, color: meta.color,
                      fontFamily: T.FONT, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.04em',
                    }}>
                      {m.status}
                    </span>
                  </div>
                  <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.05em' }}>
                    {m.machine_type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center — Digital Twin */}
        <div>
          <DigitalTwinViewer twin={twin} />
        </div>

        {/* Right — Agent Reasoning */}
        <div>
          <AgentReasoningCard
            conclusion={twin?.status === "Critical" ? "Bearing Failure Detected" : twin?.status === "Warning" ? "Vibration Anomaly — Possible Degradation" : "Normal Operation"}
            evidence={[
              { metric: "Vibration", trend: twin?.vibration && twin.vibration > 0.15 ? "up" : "stable", value: twin?.vibration ? `${twin.vibration.toFixed(3)}g` : "0.10g" },
              { metric: "Temperature", trend: twin?.temperature && twin.temperature > 70 ? "up" : "stable", value: twin?.temperature ? `${twin.temperature.toFixed(1)}°C` : "65.0°C" },
              { metric: "Pressure", trend: twin?.pressure && twin.pressure < 40 ? "down" : "stable", value: twin?.pressure ? `${twin.pressure.toFixed(1)} PSI` : "45.0 PSI" },
            ]}
          />
        </div>
      </div>

      {/* Agent Timeline */}
      <div style={{ height: '280px' }}>
        <AgentTimeline events={events} />
      </div>
    </div>
  );
}
