"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Settings, ActivitySquare, ShieldAlert, ArrowRight } from "lucide-react";

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

const agents = [
  {
    num: "01",
    name: "Monitoring Agent",
    role: "Anomaly Detection",
    status: "Active",
    icon: ActivitySquare,
    color: T.steel, bg: T.steelLight,
    desc: "Continuously scans streaming telemetry for statistical deviations using adaptive Z-score thresholds. Operates 24/7 without interruption.",
    tasks: ["Vibration monitoring", "Temperature delta tracking", "Pressure variance analysis"],
  },
  {
    num: "02",
    name: "Diagnosis Agent",
    role: "Root Cause Analysis",
    status: "Active",
    icon: BrainCircuit,
    color: T.amber, bg: T.amberLight,
    desc: "Correlates anomalies with historical fault patterns using SHAP explainability to pinpoint the exact sensor driving failure probability.",
    tasks: ["SHAP feature attribution", "Historical pattern matching", "Confidence scoring"],
  },
  {
    num: "03",
    name: "Planner Agent",
    role: "Maintenance Optimization",
    status: "Active",
    icon: Settings,
    color: T.sage, bg: T.sageLight,
    desc: "Schedules maintenance actions by weighing failure risk against operational downtime, minimizing cost while maximizing asset life.",
    tasks: ["ROI calculation", "Schedule optimization", "Risk-cost trade-off analysis"],
  },
  {
    num: "04",
    name: "Approval Agent",
    role: "Human-in-the-Loop",
    status: "Active",
    icon: ShieldAlert,
    color: T.rust, bg: T.rustLight,
    desc: "Creates formal work orders and routes critical operations requiring executive sign-off, maintaining human oversight in the loop.",
    tasks: ["Ticket generation", "Escalation routing", "Approval gating"],
  },
];

export default function AgentsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.35rem' }}>
            — Autonomous Intelligence
          </div>
          <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: T.ink }}>
            Agent Center
          </h1>
          <p style={{ fontFamily: T.FONT, fontSize: '0.875rem', color: T.inkSoft, marginTop: '0.25rem' }}>
            Four specialized AI agents running collaboratively — 24/7.
          </p>
        </div>
        {/* System status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', backgroundColor: T.sageLight,
          border: `1px solid ${T.sage}25`, borderRadius: '0.5rem',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: T.sage, animation: 'live-pulse 1.8s ease-in-out infinite' }} />
          <span style={{ fontFamily: T.MONO, fontSize: '0.62rem', color: T.sage, letterSpacing: '0.1em', fontWeight: 700 }}>
            ALL AGENTS ACTIVE
          </span>
        </div>
      </div>

      {/* Pipeline visual — connecting line */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
        {/* Connecting bar */}
        <div style={{
          position: 'absolute', top: '2.5rem', left: '12%', right: '12%', height: '1px',
          backgroundColor: T.creamMid, zIndex: 0,
        }}>
          <motion.div
            style={{ height: '100%', backgroundColor: T.amber }}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
        </div>

        {agents.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.num}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ padding: '0 0.75rem', position: 'relative', zIndex: 1 }}
            >
              {/* Step indicator */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: agent.bg, border: `2px solid ${agent.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <Icon style={{ width: '17px', height: '17px', color: agent.color }} />
              </div>

              {/* Card */}
              <div style={{
                backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
                borderRadius: '0.75rem', overflow: 'hidden',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = agent.color + '40';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(28,26,24,0.08)`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = T.creamMid;
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Top accent bar */}
                <div style={{ height: '3px', backgroundColor: agent.color }} />
                
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: T.MONO, fontSize: '0.65rem', color: T.inkGhost, letterSpacing: '0.1em' }}>
                      {agent.num}
                    </span>
                    <span style={{
                      padding: '0.175rem 0.55rem', borderRadius: '100px',
                      backgroundColor: T.sageLight, color: T.sage,
                      fontFamily: T.FONT, fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.04em',
                    }}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <h3 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: T.ink, marginBottom: '0.25rem' }}>
                    {agent.name}
                  </h3>
                  <p style={{ fontFamily: T.MONO, fontSize: '0.6rem', color: agent.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.875rem', fontWeight: 700 }}>
                    {agent.role}
                  </p>
                  <p style={{ fontFamily: T.FONT, fontSize: '0.8rem', color: T.inkSoft, lineHeight: 1.6, marginBottom: '1rem' }}>
                    {agent.desc}
                  </p>

                  {/* Tasks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {agent.tasks.map(task => (
                      <div key={task} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: agent.color, flexShrink: 0 }} />
                        <span style={{ fontFamily: T.FONT, fontSize: '0.78rem', color: T.inkSoft }}>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Collaboration Note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
          borderRadius: '0.75rem', padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '0.625rem',
          backgroundColor: T.amberLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BrainCircuit style={{ width: '20px', height: '20px', color: T.amber }} />
        </div>
        <div>
          <h4 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', color: T.ink, marginBottom: '0.25rem' }}>
            Collaborative Agent Architecture
          </h4>
          <p style={{ fontFamily: T.FONT, fontSize: '0.82rem', color: T.inkSoft, lineHeight: 1.6, maxWidth: '800px' }}>
            All four agents operate as an autonomous swarm. When the Monitoring Agent flags an anomaly, the event propagates through the pipeline — each agent adding reasoning, cost estimates, and finally escalating to human approval via a formal maintenance ticket.
          </p>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <ArrowRight style={{ width: '18px', height: '18px', color: T.inkGhost }} />
        </div>
      </motion.div>
    </div>
  );
}
