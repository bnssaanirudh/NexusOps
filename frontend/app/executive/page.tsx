"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Clock, DollarSign, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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

const performanceData = [
  { month: "Jan", uptime: 96.5, savings: 12000 },
  { month: "Feb", uptime: 97.2, savings: 18500 },
  { month: "Mar", uptime: 96.8, savings: 15200 },
  { month: "Apr", uptime: 98.1, savings: 24000 },
  { month: "May", uptime: 98.9, savings: 31000 },
  { month: "Jun", uptime: 99.2, savings: 43000 },
];

export default function ExecutiveDashboard() {
  const kpis = [
    { title: "Total Cost Saved", value: "$43K", trend: "+18% vs last month", icon: DollarSign, color: T.sage, bg: T.sageLight },
    { title: "Downtime Prevented", value: "142h", trend: "+12h vs last month", icon: Clock, color: T.steel, bg: T.steelLight },
    { title: "Maintenance Efficiency", value: "94%", trend: "+4% vs last month", icon: TrendingUp, color: T.amber, bg: T.amberLight },
    { title: "Assets at Risk", value: "3", trend: "−2 vs last month", icon: AlertCircle, color: T.rust, bg: T.rustLight },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1600px', margin: '0 auto', padding: '1.5rem 0 2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.25rem' }}>
        <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.35rem' }}>
          — Business Intelligence
        </div>
        <h1 style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.03em', color: T.ink }}>
          Executive Overview
        </h1>
        <p style={{ fontFamily: T.FONT, fontSize: '0.875rem', color: T.inkSoft, marginTop: '0.25rem' }}>
          High-level business impact and fleet reliability metrics.
        </p>
      </div>

      {/* KPI Cards — Editorial large display numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`,
              borderRadius: '0.75rem', padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1.25rem',
              cursor: 'default', transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
            whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(28,26,24,0.08)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.625rem', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon style={{ width: '18px', height: '18px', color: kpi.color }} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: T.FONT, fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.05em', color: T.ink, lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontFamily: T.MONO, fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: T.inkGhost, marginTop: '0.3rem' }}>
                {kpi.title}
              </div>
              <div style={{ fontFamily: T.FONT, fontSize: '0.75rem', color: kpi.color, marginTop: '0.5rem', fontWeight: 500 }}>
                {kpi.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Savings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', overflow: 'hidden' }}
        >
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.creamMid}`, backgroundColor: T.cream, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign style={{ width: '14px', height: '14px', color: T.sage }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
              Cumulative Savings (YTD)
            </span>
          </div>
          <div style={{ padding: '1.5rem', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.sage} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={T.sage} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.creamMid} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '8px', fontFamily: T.FONT, fontSize: '12px', color: T.ink }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Savings']}
                />
                <Area type="monotone" dataKey="savings" stroke={T.sage} strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Uptime Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '0.75rem', overflow: 'hidden' }}
        >
          <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${T.creamMid}`, backgroundColor: T.cream, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity style={{ width: '14px', height: '14px', color: T.steel }} />
            <span style={{ fontFamily: T.MONO, fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: T.inkGhost, fontWeight: 700 }}>
              Fleet Uptime Performance
            </span>
          </div>
          <div style={{ padding: '1.5rem', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.creamMid} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fill: T.inkGhost, fontFamily: T.MONO, fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: T.creamDark, border: `1px solid ${T.creamMid}`, borderRadius: '8px', fontFamily: T.FONT, fontSize: '12px', color: T.ink }}
                  formatter={(value: any) => [`${value}%`, 'Uptime']}
                />
                <Line type="monotone" dataKey="uptime" stroke={T.steel} strokeWidth={2.5} dot={{ r: 4, fill: T.steel, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
