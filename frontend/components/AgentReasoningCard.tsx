"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, BrainCircuit } from "lucide-react";

interface AgentReasoningProps {
  conclusion: string;
  evidence: Array<{ metric: string; trend: "up" | "down" | "stable"; value: string; }>;
}

const T = {
  cream: '#F2EEE8', creamDark: '#E8E2D9', creamMid: '#DDD5C8',
  ink: '#1C1A18', inkMid: '#3D3830', inkSoft: '#6B6158', inkGhost: '#9A9089',
  amber: '#C07C2A', amberLight: '#F5D6A8',
  rust: '#B84432', rustLight: '#F0C4BC',
  sage: '#3A6B4A', sageLight: '#C0D9C8',
  steel: '#3A5070', steelLight: '#D0DFF0',
  FONT: "'Space Grotesk', sans-serif",
  MONO: "'Space Mono', monospace",
};

export function AgentReasoningCard({ conclusion, evidence }: AgentReasoningProps) {
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
        <BrainCircuit style={{ width: '14px', height: '14px', color: T.amber }} />
        <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
          AI Diagnostics
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Evidence */}
        <div>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.75rem' }}>
            Key Evidence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {evidence.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.7rem 0.875rem',
                  backgroundColor: T.cream,
                  border: `1px solid ${T.creamMid}`,
                  borderRadius: '0.5rem',
                }}
              >
                <span style={{ fontFamily: T.FONT, fontWeight: 500, fontSize: '0.82rem', color: T.inkMid }}>
                  {item.metric}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '0.88rem', color: T.ink }}>
                    {item.value}
                  </span>
                  {item.trend === "up" && (
                    <TrendingUp style={{ width: '14px', height: '14px', color: T.rust }} />
                  )}
                  {item.trend === "down" && (
                    <TrendingDown style={{ width: '14px', height: '14px', color: T.sage }} />
                  )}
                  {item.trend === "stable" && (
                    <Minus style={{ width: '14px', height: '14px', color: T.inkGhost }} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.5rem' }}>
            Conclusion
          </div>
          <div style={{
            padding: '0.875rem 1rem',
            backgroundColor: T.amberLight,
            border: `1px solid ${T.amber}25`,
            borderRadius: '0.5rem',
            fontFamily: T.FONT, fontWeight: 600, fontSize: '0.85rem',
            color: T.ink, lineHeight: 1.5,
          }}>
            {conclusion}
          </div>
        </div>
      </div>
    </div>
  );
}
