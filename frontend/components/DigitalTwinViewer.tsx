"use client";

import { motion } from "framer-motion";
import { Activity, Thermometer, Gauge, Zap, Wind, Droplets } from "lucide-react";
import type { DigitalTwinState } from "@/lib/types";

interface DigitalTwinViewerProps {
  twin: DigitalTwinState | null;
}

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

const getStatusMeta = (status: string) => {
  switch (status) {
    case "Healthy":  return { color: T.sage,    bg: T.sageLight,    ring: T.sage };
    case "Warning":  return { color: T.warning,  bg: T.warningLight, ring: T.amber };
    case "Critical": return { color: T.rust,     bg: T.rustLight,    ring: T.rust };
    default:         return { color: T.steel,    bg: T.steelLight,   ring: T.steel };
  }
};

export function DigitalTwinViewer({ twin }: DigitalTwinViewerProps) {
  if (!twin) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', minHeight: '400px', backgroundColor: T.creamDark,
        border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', color: T.inkGhost,
        gap: '0.75rem', padding: '2rem',
      }}>
        <Activity style={{ width: '36px', height: '36px', opacity: 0.3 }} />
        <p style={{ fontFamily: T.MONO, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Select a machine to view Digital Twin
        </p>
      </div>
    );
  }

  const meta = getStatusMeta(twin.status);
  const circumference = 2 * Math.PI * 108;
  const strokeDashoffset = circumference - (twin.health_score / 100) * circumference;

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
      borderRadius: '0.75rem', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: `1px solid ${T.creamMid}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        backgroundColor: T.cream,
      }}>
        <div>
          <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.2rem' }}>
            Digital Twin
          </div>
          <h3 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.03em', color: T.ink }}>
            {twin.machine_id}
          </h3>
          <p style={{ fontFamily: T.FONT, fontSize: '0.8rem', color: T.inkSoft, marginTop: '0.1rem' }}>
            {twin.machine_type} · {twin.location}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          padding: '0.35rem 0.875rem',
          backgroundColor: meta.bg,
          border: `1px solid ${meta.color}30`,
          borderRadius: '100px',
          fontFamily: T.FONT, fontWeight: 700, fontSize: '0.72rem',
          color: meta.color, letterSpacing: '0.04em',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: meta.color }} />
          {twin.status.toUpperCase()}
        </div>
      </div>

      {/* Central ring + sensors */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '2rem', position: 'relative' }}>
        
        {/* Critical pulse bg */}
        {twin.status === "Critical" && (
          <div style={{
            position: 'absolute', inset: 0, 
            background: `radial-gradient(ellipse at center, ${T.rustLight}60 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Health Ring */}
        <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle cx="130" cy="130" r="108" stroke={T.creamMid} strokeWidth="10" fill="none" />
            <motion.circle
              cx="130" cy="130" r="108"
              stroke={meta.ring}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '3.5rem', letterSpacing: '-0.05em', lineHeight: 1, color: T.ink }}>
              {Math.round(twin.health_score)}
              <span style={{ fontSize: '1.5rem', color: T.inkSoft }}>%</span>
            </div>
            <div style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, marginTop: '0.25rem' }}>
              Health Score
            </div>
          </div>
        </div>

        {/* Sensor readings grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', width: '100%' }}>
          <SensorTile icon={Thermometer} label="Temp" value={`${twin.temperature?.toFixed(1) ?? '--'}°C`} accent={T.rust} />
          <SensorTile icon={Activity}   label="Vibration" value={`${twin.vibration?.toFixed(3) ?? '--'}g`} accent={T.amber} />
          <SensorTile icon={Wind}       label="Pressure" value={`${twin.pressure?.toFixed(1) ?? '--'} PSI`} accent={T.steel} />
          <SensorTile icon={Zap}        label="Voltage" value={`${twin.voltage?.toFixed(1) ?? '--'}V`} accent={T.warning} />
        </div>

        {/* Secondary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', width: '60%' }}>
          <SensorTile icon={Gauge}    label="RPM" value={`${twin.rpm?.toFixed(0) ?? '--'}`} accent={T.inkMid} />
          <SensorTile icon={Droplets} label="Humidity" value={`${twin.humidity?.toFixed(1) ?? '--'}%`} accent={T.steel} />
        </div>
      </div>

      {/* Footer timestamp */}
      <div style={{
        padding: '0.75rem 1.5rem', borderTop: `1px solid ${T.creamMid}`, backgroundColor: T.cream,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: T.MONO, fontSize: '0.58rem', color: T.inkGhost, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Is Active: {twin.is_active ? 'Yes' : 'No'}
        </span>
        <span style={{ fontFamily: T.MONO, fontSize: '0.58rem', color: T.inkGhost, letterSpacing: '0.1em' }}>
          {twin.last_updated ? new Date(twin.last_updated).toLocaleTimeString() : 'Awaiting data'}
        </span>
      </div>
    </div>
  );
}

function SensorTile({ icon: Icon, label, value, accent }: { icon: any, label: string, value: string, accent: string }) {
  return (
    <div style={{
      backgroundColor: T.cream, border: `1px solid ${T.creamMid}`, borderRadius: '0.625rem',
      padding: '0.875rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '0.375rem', textAlign: 'center', transition: 'border-color 0.2s ease',
    }}>
      <Icon style={{ width: '16px', height: '16px', color: accent, opacity: 0.8 }} />
      <span style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: T.ink }}>
        {value}
      </span>
      <span style={{ fontFamily: T.MONO, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost }}>
        {label}
      </span>
    </div>
  );
}
