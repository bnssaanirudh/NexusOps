"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cpu, Activity, ShieldCheck, Zap, TrendingUp, BrainCircuit, Database, FlaskConical } from "lucide-react";
import { useRef } from "react";

/* ── Inline style tokens for consistency ── */
const T = {
  cream:      '#F2EEE8',
  creamDark:  '#E8E2D9',
  creamMid:   '#DDD5C8',
  ink:        '#1C1A18',
  inkMid:     '#3D3830',
  inkSoft:    '#6B6158',
  inkGhost:   '#9A9089',
  amber:      '#C07C2A',
  amberGlow:  '#E8943A',
  amberLight: '#F5D6A8',
  rust:       '#B84432',
  rustLight:  '#F0C4BC',
  sage:       '#3A6B4A',
  sageLight:  '#C0D9C8',
  steel:      '#3A5070',
};

const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_MONO    = "'Space Mono', monospace";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: T.cream, color: T.ink, minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* ── NAVIGATION ── */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 3rem',
          borderBottom: `1px solid ${T.creamMid}`,
          position: 'sticky',
          top: 0,
          backgroundColor: T.cream,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '30px', height: '30px', background: T.ink, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu style={{ width: '15px', height: '15px', color: T.cream }} />
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: T.ink }}>
            Nexus<span style={{ color: T.amber }}>Ops</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Agents', href: '/agents' },
            { label: 'Simulation', href: '/simulation' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '0.375rem',
                fontSize: '0.82rem',
                fontFamily: FONT_DISPLAY,
                fontWeight: 500,
                color: T.inkSoft,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = T.ink;
                (e.currentTarget as HTMLElement).style.backgroundColor = T.creamDark;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = T.inkSoft;
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ y: -1, boxShadow: '0 8px 24px rgba(28,26,24,0.15)' }}
            style={{
              background: T.ink,
              color: T.cream,
              border: `1px solid ${T.ink}`,
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              fontFamily: FONT_DISPLAY,
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              letterSpacing: '0.01em',
            }}
          >
            Open Platform <ArrowRight style={{ width: '14px', height: '14px' }} />
          </motion.button>
        </Link>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — Editorial Magazine Style
          ══════════════════════════════════════════ */}
      <section style={{ padding: '0 3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Top thin rule with metadata */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem 0',
            borderBottom: `1px solid ${T.creamMid}`,
            marginBottom: '3rem',
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Vol. IV — Industrial Intelligence Platform
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: T.creamMid }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: T.sage, animation: 'live-pulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: T.sage, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              Live System Active
            </span>
          </div>
        </div>

        {/* Main hero grid: big headline left + illustration right */}
        <motion.div
          style={{ y: heroY }}
          className="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            
            {/* Left — Headline block */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Section label */}
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: T.inkGhost,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span>Phase IV Deployed</span>
                  <span style={{ display: 'inline-block', width: '2rem', height: '1px', backgroundColor: T.inkGhost }} />
                </div>

                {/* Main headline — large editorial style */}
                <h1
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 'clamp(3.5rem, 6vw, 6.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.0,
                    letterSpacing: '-0.04em',
                    color: T.ink,
                    marginBottom: '1.5rem',
                  }}
                >
                  Industrial
                  <br />
                  <span style={{ color: T.amber }}>Intelligence</span>
                  <br />
                  Platform
                </h1>

                <p
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: '1.05rem',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: T.inkMid,
                    maxWidth: '420px',
                    marginBottom: '2.5rem',
                  }}
                >
                  A multi-agent autonomous platform that monitors physical assets, predicts catastrophic failures before they happen, and reasons through mitigation in real-time.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(28,26,24,0.18)' }}
                      style={{
                        background: T.ink,
                        color: T.cream,
                        border: `1px solid ${T.ink}`,
                        padding: '0.8rem 2rem',
                        borderRadius: '0.5rem',
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Enter Command Center <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </motion.button>
                  </Link>

                  <Link href="/simulation" style={{ textDecoration: 'none' }}>
                    <motion.button
                      whileHover={{ y: -2, borderColor: T.inkMid }}
                      style={{
                        background: 'transparent',
                        color: T.ink,
                        border: `1px solid ${T.creamMid}`,
                        padding: '0.8rem 2rem',
                        borderRadius: '0.5rem',
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        letterSpacing: '0.01em',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <FlaskConical style={{ width: '15px', height: '15px' }} />
                      Simulation Lab
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right — Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: `1px solid ${T.creamMid}`,
                  backgroundColor: T.creamDark,
                  aspectRatio: '4/3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Image
                  src="/hero-illustration.png"
                  alt="Industrial monitoring platform visualization"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                {/* Floating KPI overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                  }}
                >
                  {[
                    { label: 'Uptime', value: '99.9%', color: T.sage },
                    { label: 'Anomalies', value: '14 Active', color: T.amber },
                    { label: 'RUL Saved', value: '47 Days', color: T.steel },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      style={{
                        backgroundColor: 'rgba(242, 238, 232, 0.92)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${T.creamMid}`,
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                      }}
                    >
                      <div style={{ fontFamily: FONT_MONO, fontSize: '0.55rem', color: T.inkGhost, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{kpi.label}</div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: kpi.color }}>{kpi.value}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scrolling stats bar */}
        <div
          style={{
            borderTop: `1px solid ${T.creamMid}`,
            borderBottom: `1px solid ${T.creamMid}`,
            padding: '1.25rem 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0',
            marginBottom: '5rem',
          }}
        >
          {[
            { num: '5', label: 'Monitored Assets', unit: '' },
            { num: '15K', label: 'Sensor Readings', unit: '/hr' },
            { num: '4', label: 'Autonomous Agents', unit: '' },
            { num: '72h', label: 'Prediction Horizon', unit: '' },
            { num: '<2s', label: 'Detection Latency', unit: '' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              style={{
                padding: '0 2rem',
                borderRight: i < 4 ? `1px solid ${T.creamMid}` : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1 }}>
                {stat.num}<span style={{ color: T.amber, fontSize: '1.2rem' }}>{stat.unit}</span>
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: '0.58rem', color: T.inkGhost, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — How It Works (Editorial Columns)
          ══════════════════════════════════════════ */}
      <section style={{ padding: '0 3rem 6rem' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.5rem' }}>
              — 01 / Capability Overview
            </div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1.05 }}>
              From reactive<br />to <span style={{ color: T.amber }}>predictive</span>
            </h2>
          </div>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.95rem', color: T.inkMid, maxWidth: '340px', lineHeight: 1.6 }}>
            NexusOps replaces manual inspections and reactive maintenance with an always-on intelligent sensing and reasoning pipeline.
          </p>
        </div>

        {/* 3-column feature cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            {
              icon: Database,
              label: '01',
              title: 'Real-Time Digital Twin',
              desc: 'Ingests thousands of sensor readings per hour — vibration, temperature, pressure, voltage, RPM — to construct a live 1:1 machine model.',
              accent: T.steel,
              accentLight: '#D0DFF0',
            },
            {
              icon: BrainCircuit,
              label: '02',
              title: 'Explainable ML Engine',
              desc: 'Isolation Forest anomaly detection + gradient boosting predict remaining useful life (RUL) and failure probability over 24/48/72h horizons.',
              accent: T.amber,
              accentLight: T.amberLight,
            },
            {
              icon: ShieldCheck,
              label: '03',
              title: 'Autonomous Agent Swarm',
              desc: 'Four specialized agents — Monitoring, Diagnosis, Planner, Approval — collaborate without human intervention to produce actionable maintenance orders.',
              accent: T.sage,
              accentLight: T.sageLight,
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <div
                style={{
                  backgroundColor: T.creamDark,
                  border: `1px solid ${T.creamMid}`,
                  borderRadius: '1rem',
                  padding: '2rem',
                  height: '100%',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = card.accentLight;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(28,26,24,0.08)`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = T.creamMid;
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '0.625rem',
                      backgroundColor: card.accentLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${card.accent}20`,
                    }}
                  >
                    <card.icon style={{ width: '20px', height: '20px', color: card.accent }} />
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', color: T.inkGhost, letterSpacing: '0.1em' }}>{card.label}</span>
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.15rem', letterSpacing: '-0.02em', color: T.ink, marginBottom: '0.75rem' }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.875rem', lineHeight: 1.65, color: T.inkSoft }}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Agent Workflow (Large Visual)
          ══════════════════════════════════════════ */}
      <section
        style={{
          padding: '5rem 3rem',
          backgroundColor: T.ink,
          color: T.cream,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid bg */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(242,238,232,0.04) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(242,238,232,0.1)', paddingBottom: '1.5rem' }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,238,232,0.4)' }}>
              — 02 / Autonomous Agents
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, color: T.cream, marginBottom: '1.5rem' }}>
                Four agents.<br /><span style={{ color: T.amber }}>One mission.</span>
              </h2>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: '1rem', lineHeight: 1.65, color: 'rgba(242,238,232,0.6)', maxWidth: '380px' }}>
                The AI swarm detects, diagnoses, plans, and executes maintenance strategies — entirely autonomously. Each agent has a clear role with transparent reasoning.
              </p>
            </div>

            {/* Agents illustration */}
            <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(242,238,232,0.1)', aspectRatio: '4/3', position: 'relative' }}>
              <Image src="/agents-illustration.png" alt="Multi-agent AI workflow diagram" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>

          {/* 4 agent steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            {[
              { num: '01', title: 'Monitoring Agent', desc: 'Watches telemetry streams 24/7. Flags statistical deviations using adaptive thresholds.' },
              { num: '02', title: 'Diagnosis Agent', desc: 'Deep-dives into flagged anomalies using SHAP explainability to pinpoint root causes.' },
              { num: '03', title: 'Planner Agent', desc: 'Calculates repair costs, downtime impact, and schedules optimal maintenance windows.' },
              { num: '04', title: 'Approval Agent', desc: 'Generates formal work orders and routes them to human operators for sign-off.' },
            ].map((agent, i) => (
              <motion.div
                key={agent.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{
                  padding: '2rem',
                  borderTop: '1px solid rgba(242,238,232,0.12)',
                  borderLeft: i > 0 ? '1px solid rgba(242,238,232,0.08)' : 'none',
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: '2rem', fontWeight: 700, color: 'rgba(242,238,232,0.12)', letterSpacing: '-0.04em', marginBottom: '1rem' }}>{agent.num}</div>
                <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '0.95rem', color: T.cream, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  {agent.title}
                </h4>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.82rem', color: 'rgba(242,238,232,0.5)', lineHeight: 1.6 }}>
                  {agent.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Platform Features Grid
          ══════════════════════════════════════════ */}
      <section style={{ padding: '5rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: `1px solid ${T.creamMid}`, paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '0.5rem' }}>— 03 / Platform</div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: T.ink, lineHeight: 1.05 }}>
              Full-stack<br />observability
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {/* Large feature card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              gridRow: 'span 2',
              backgroundColor: T.creamDark,
              border: `1px solid ${T.creamMid}`,
              borderRadius: '1rem',
              padding: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${T.amberLight} 0%, transparent 70%)`, opacity: 0.4 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: T.amberLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <Activity style={{ width: '22px', height: '22px', color: T.amber }} />
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.03em', color: T.ink, marginBottom: '1rem' }}>
                Digital Twin Viewer
              </h3>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.9rem', lineHeight: 1.7, color: T.inkSoft, marginBottom: '2rem' }}>
                A real-time 3D-style visual representation of each machine, updated every second via WebSocket. See health score, live sensor readings, and fault status at a glance.
              </p>
              {/* Illustration */}
              <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: `1px solid ${T.creamMid}`, aspectRatio: '16/9', position: 'relative' }}>
                <Image src="/dashboard-illustration.png" alt="Digital Twin visualization" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </motion.div>

          {/* Smaller feature cards */}
          {[
            { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Interactive charts for anomaly scores, failure probability timelines, and SHAP feature importance — with machine comparison.', color: T.steel, colorLight: '#D0DFF0' },
            { icon: Zap, title: 'Fault Injection Lab', desc: 'Inject realistic fault scenarios (bearing wear, motor overheating, pressure leaks) and watch the AI swarm respond in real-time.', color: T.rust, colorLight: T.rustLight },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
              style={{
                backgroundColor: T.creamDark,
                border: `1px solid ${T.creamMid}`,
                borderRadius: '1rem',
                padding: '2rem',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(28,26,24,0.08)' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '0.625rem', backgroundColor: feat.colorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <feat.icon style={{ width: '20px', height: '20px', color: feat.color }} />
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em', color: T.ink, marginBottom: '0.75rem' }}>{feat.title}</h3>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: '0.875rem', lineHeight: 1.65, color: T.inkSoft }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════ */}
      <section
        style={{
          padding: '5rem 3rem',
          borderTop: `1px solid ${T.creamMid}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.inkGhost, marginBottom: '1.5rem' }}>
            — Ready to begin?
          </div>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.95,
              color: T.ink,
              marginBottom: '2rem',
            }}
          >
            Inject a fault.<br />
            <span style={{ color: T.amber }}>Watch AI react.</span>
          </h2>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: '1rem', color: T.inkSoft, maxWidth: '480px', lineHeight: 1.65, margin: '0 auto 2.5rem' }}>
            Break a machine in the Simulation Lab and observe the entire autonomous pipeline — from anomaly detection to maintenance ticket generation — unfold in seconds.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/simulation" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(28,26,24,0.18)' }}
                style={{
                  background: T.ink,
                  color: T.cream,
                  border: `1px solid ${T.ink}`,
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FlaskConical style={{ width: '18px', height: '18px' }} />
                Open Simulation Lab
              </motion.button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ y: -2 }}
                style={{
                  background: 'transparent',
                  color: T.ink,
                  border: `1px solid ${T.creamMid}`,
                  padding: '1rem 2.5rem',
                  borderRadius: '0.5rem',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'border-color 0.2s',
                }}
              >
                View Live Dashboard <ArrowUpRight style={{ width: '16px', height: '16px' }} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${T.creamMid}`,
          padding: '2rem 3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.1em' }}>
          NEXUSOPS — INDUSTRIAL INTELLIGENCE PLATFORM — v4.0
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: T.inkGhost, letterSpacing: '0.1em' }}>
          © 2025 — BUILT WITH FASTAPI + NEXT.JS
        </span>
      </footer>
    </div>
  );
}
