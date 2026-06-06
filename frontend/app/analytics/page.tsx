"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const T = {
  cream: '#F2EEE8', creamDark: '#E8E2D9', creamMid: '#DDD5C8',
  ink: '#1C1A18', inkMid: '#3D3830', inkSoft: '#6B6158', inkGhost: '#9A9089',
  amber: '#C07C2A', amberLight: '#F5D6A8',
  rust: '#B84432', sage: '#3A6B4A', sageLight: '#C0D9C8',
  steel: '#3A5070', steelLight: '#D0DFF0',
  warning: '#917320', warningLight: '#F0DCA0',
  FONT: "'Space Grotesk', sans-serif",
  MONO: "'Space Mono', monospace",
};

const analyticsData = [
  { time: "08:00", temp: 65, vib: 0.12, press: 45 },
  { time: "09:00", temp: 66, vib: 0.13, press: 46 },
  { time: "10:00", temp: 65, vib: 0.14, press: 44 },
  { time: "11:00", temp: 68, vib: 0.16, press: 43 },
  { time: "12:00", temp: 72, vib: 0.22, press: 40 },
  { time: "13:00", temp: 75, vib: 0.35, press: 38 },
];

const anomalyData = [
  { name: "Bearing", count: 45 },
  { name: "Overheat", count: 32 },
  { name: "Pressure", count: 18 },
  { name: "Voltage", count: 12 },
];

export default function AnalyticsPage() {
  const kpis = [
    { title: "Anomaly Rate", value: "1.2%", trend: "↓ −0.3%", icon: AlertCircle, color: T.warning, bg: T.warningLight },
    { title: "Prediction Accuracy", value: "96.4%", trend: "↑ +2.1%", icon: Activity, color: T.sage, bg: T.sageLight },
    { title: "Models Active", value: "12", trend: "Stable", icon: BarChart3, color: T.steel, bg: T.steelLight },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.35rem' }}>
          — Predictive Intelligence
        </div>
        <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: T.ink }}>
          Analytics
        </h1>
        <p style={{ fontFamily: T.FONT, fontSize: '0.875rem', color: T.inkSoft, marginTop: '0.25rem' }}>
          Historical trends, forecasting and anomaly detection.
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
              borderRadius: '0.75rem', padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.625rem', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon style={{ width: '18px', height: '18px', color: kpi.color }} />
              </div>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '100px',
                backgroundColor: T.cream, border: `1px solid ${T.creamMid}`,
                fontFamily: T.MONO, fontSize: '0.62rem', color: T.inkSoft, letterSpacing: '0.04em',
              }}>{kpi.trend}</span>
            </div>
            <div>
              <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.04em', color: T.ink, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost, marginTop: '0.3rem' }}>
                {kpi.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Temp & Vibration Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', overflow: 'hidden' }}
        >
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.creamMid}`, backgroundColor: T.cream, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp style={{ width: '14px', height: '14px', color: T.rust }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
              Temperature & Vibration Correlation
            </span>
          </div>
          <div style={{ padding: '1.5rem', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.creamMid} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '8px', fontFamily: T.FONT, fontSize: '12px', color: T.ink }}
                />
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke={T.rust} strokeWidth={2.5} dot={{ r: 3, fill: T.rust }} />
                <Line yAxisId="right" type="monotone" dataKey="vib" stroke={T.amber} strokeWidth={2.5} dot={{ r: 3, fill: T.amber }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Anomaly Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', overflow: 'hidden' }}
        >
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.creamMid}`, backgroundColor: T.cream, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 style={{ width: '14px', height: '14px', color: T.steel }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
              Anomaly Distribution by Type
            </span>
          </div>
          <div style={{ padding: '1.5rem', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.creamMid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '8px', fontFamily: T.FONT, fontSize: '12px', color: T.ink }}
                />
                <Bar dataKey="count" fill={T.ink} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
