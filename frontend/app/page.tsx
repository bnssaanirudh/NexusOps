"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ActivitySquare, ShieldCheck, Zap, TrendingUp, BrainCircuit, Activity, Settings, Database, Server } from "lucide-react";
import { TiltCard } from "@/components/ui/3d-card";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden bg-[#F8FAFC]">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: THE HERO
          ───────────────────────────────────────────────────────────── */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative px-4"
      >
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0F4C81 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="z-10 text-center max-w-6xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-white/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-[#0F4C81] shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse-subtle"></span>
            Project Sentinel: Phase 4 Deployed
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6"
            style={{ textShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
          >
            Industrial <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0F4C81] to-[#1F6FEB]">Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light mb-12"
          >
            A multi-agent autonomous platform that monitors physical assets, predicts catastrophic failures before they happen, and reasons through mitigation strategies.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <TiltCard className="bg-[#0F4C81] hover:bg-[#083A66] text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 w-full sm:w-auto">
                Enter Command Center <ArrowRight className="w-5 h-5" />
              </TiltCard>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <TiltCard className="bg-white border-2 border-[#E5E7EB] hover:border-blue-200 text-slate-700 hover:text-[#0F4C81] px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center w-full sm:w-auto shadow-sm">
                Watch Auto-Demo
              </TiltCard>
            </Link>
          </motion.div>
        </div>

        {/* Floating 3D Metric Cards */}
        <div className="absolute top-1/4 left-10 hidden lg:block perspective-1000">
          <TiltCard maxRotation={25} className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl w-64" style={{ transform: "rotateY(15deg) rotateX(10deg)" }}>
            <div className="flex items-center gap-4 translate-z-10">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Uptime</p>
                <p className="text-2xl font-black text-slate-900">99.9%</p>
              </div>
            </div>
          </TiltCard>
        </div>

        <div className="absolute bottom-1/4 right-10 hidden lg:block perspective-1000">
          <TiltCard maxRotation={25} className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl w-64" style={{ transform: "rotateY(-15deg) rotateX(10deg)" }}>
            <div className="flex items-center gap-4 translate-z-10">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-full"><ActivitySquare className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Anomalies Detected</p>
                <p className="text-2xl font-black text-slate-900">14 Active</p>
              </div>
            </div>
          </TiltCard>
        </div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: THE EVOLUTION (Digital Twins & Prediction)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-[#1F6FEB] tracking-widest uppercase mb-2">Phase 1 & 2</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">From Reactive to <span className="text-[#0F4C81]">Predictive</span></h3>
            <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">We don't just monitor machines. We simulate their future.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0}
              icon={Database}
              title="Real-Time Telemetry"
              desc="Ingesting thousands of data points per second (Vibration, Temperature, Pressure) to construct a live 1:1 Digital Twin."
            />
            <FeatureCard 
              delay={0.2}
              icon={Activity}
              title="Explainable ML"
              desc="Machine learning models predict remaining useful life (RUL) and isolate exactly which sensor is driving the failure probability."
            />
            <FeatureCard 
              delay={0.4}
              icon={TrendingUp}
              title="Cost Optimization"
              desc="Calculating the financial risk of failure against the cost of early maintenance to maximize operational efficiency."
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: AUTONOMOUS AGENTS (The Multi-Agent Workflow)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0F4C81] text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-blue-300 tracking-widest uppercase mb-2">Phase 3 & 4</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-4">Multi-Agent Intelligence</h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Four specialized AI agents collaborate to diagnose problems and propose solutions entirely autonomously.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-blue-800 -translate-y-1/2 z-0">
              <motion.div 
                className="h-full bg-blue-400"
                initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            <AgentStep delay={0.6} num="01" title="Monitoring Agent" desc="Constantly watches telemetry. Flags statistical anomalies." />
            <AgentStep delay={1.0} num="02" title="Diagnosis Agent" desc="Analyzes flagged data to find the root cause (e.g. Bearing Wear)." />
            <AgentStep delay={1.4} num="03" title="Planner Agent" desc="Calculates costs and proposes optimal maintenance schedules." />
            <AgentStep delay={1.8} num="04" title="Approval Agent" desc="Generates tickets and requests human executive sign-off." />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: FINAL CTA
          ───────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-white text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-8"
          >
            Ready to inject a fault?
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 mb-10"
          >
            Visit the Simulation Lab to manually break a machine and watch the AI swarm react in real-time.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Link href="/simulation">
              <TiltCard className="inline-flex bg-[#1F6FEB] hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl items-center gap-3 shadow-2xl shadow-blue-500/30">
                <Server className="w-6 h-6" /> Open Simulation Lab
              </TiltCard>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay }}
    >
      <TiltCard className="bg-slate-50 border border-slate-100 p-8 rounded-2xl h-full flex flex-col items-center text-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-6 border border-slate-100">
          <Icon className="w-8 h-8 text-[#0F4C81]" />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
      </TiltCard>
    </motion.div>
  );
}

function AgentStep({ num, title, desc, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay }}
      className="relative z-10 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-900 border-2 border-blue-400 flex items-center justify-center text-xl font-black text-white shadow-[0_0_30px_rgba(96,165,250,0.3)] mb-6">
        {num}
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-blue-200">{desc}</p>
    </motion.div>
  );
}
