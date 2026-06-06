"use client";

import { motion } from "framer-motion";
import { Clock, Settings } from "lucide-react";

export interface AgentEvent {
  id: string;
  timestamp: string;
  agent: "Monitoring Agent" | "Diagnosis Agent" | "Planner Agent" | "Approval Agent";
  action: string;
  details: string;
}

interface AgentTimelineProps {
  events: AgentEvent[];
}

const T = {
  cream: '#F2EEE8', creamDark: '#E8E2D9', creamMid: '#DDD5C8',
  ink: '#1C1A18', inkSoft: '#6B6158', inkGhost: '#9A9089',
  amber: '#C07C2A', amberLight: '#F5D6A8',
  rust: '#B84432', rustLight: '#F0C4BC',
  sage: '#3A6B4A', sageLight: '#C0D9C8',
  steel: '#3A5070', steelLight: '#D0DFF0',
  warning: '#917320', warningLight: '#F0DCA0',
  FONT: "'Space Grotesk', sans-serif",
  MONO: "'Space Mono', monospace",
};

const AGENT_META: Record<string, { color: string; bg: string; dot: string }> = {
  "Monitoring Agent": { color: T.steel,   bg: T.steelLight,   dot: T.steel },
  "Diagnosis Agent":  { color: T.warning, bg: T.warningLight, dot: T.amber },
  "Planner Agent":    { color: T.sage,    bg: T.sageLight,    dot: T.sage },
  "Approval Agent":   { color: T.rust,    bg: T.rustLight,    dot: T.rust },
};

export function AgentTimeline({ events }: AgentTimelineProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
      borderRadius: '0.75rem', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderBottom: `1px solid ${T.creamMid}`,
        backgroundColor: T.cream,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <Settings style={{ width: '13px', height: '13px', color: T.inkGhost }} />
        <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
          Agent Operations Timeline
        </span>
      </div>

      {/* Events */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
        {!events || events.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: T.inkGhost, gap: '0.5rem' }}>
            <Clock style={{ width: '24px', height: '24px', opacity: 0.3 }} />
            <p style={{ fontFamily: T.MONO, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No agent activity</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.map((event, idx) => {
              const meta = AGENT_META[event.agent] ?? { color: T.inkSoft, bg: T.creamMid, dot: T.inkSoft };
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  style={{
                    display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                    backgroundColor: T.cream,
                    border: `1px solid ${T.creamMid}`,
                    borderRadius: '0.625rem',
                    padding: '0.875rem 1rem',
                  }}
                >
                  {/* Dot */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: meta.dot, flexShrink: 0, marginTop: '5px',
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.375rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '0.175rem 0.6rem',
                        backgroundColor: meta.bg,
                        border: `1px solid ${meta.color}25`,
                        borderRadius: '100px',
                        fontFamily: T.FONT, fontWeight: 700, fontSize: '0.68rem',
                        color: meta.color, letterSpacing: '0.03em',
                      }}>
                        {event.agent}
                      </span>
                      <time style={{ fontFamily: T.MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.05em' }}>
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </time>
                    </div>
                    <h4 style={{ fontFamily: T.FONT, fontWeight: 600, fontSize: '0.85rem', color: T.ink, marginBottom: '0.15rem' }}>
                      {event.action}
                    </h4>
                    <p style={{ fontFamily: T.FONT, fontSize: '0.8rem', color: T.inkSoft, lineHeight: 1.5 }}>
                      {event.details}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
