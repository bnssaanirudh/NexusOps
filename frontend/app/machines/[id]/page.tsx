"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { DigitalTwinState, EventLog, ChartPoint, WSPayload, PredictionState, RiskAssessment } from "@/lib/types";
import { machineApi, eventApi, predictiveApi } from "@/lib/api";
import { useWebSocket } from "@/lib/websocket";
import { DigitalTwin } from "@/components/DigitalTwin";
import { LiveChart } from "@/components/LiveChart";
import { EventLogPanel } from "@/components/EventLog";
import { StatusBadge } from "@/components/StatusBadge";
import { SHAPChart } from "@/components/SHAPChart";

const MAX_CHART_POINTS = 60; // keep last 60 readings = 2 min at 2s interval

function addPoint(points: ChartPoint[], value: number): ChartPoint[] {
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return [...points.slice(-(MAX_CHART_POINTS - 1)), { time: now, value }];
}

export default function MachineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [prediction, setPrediction] = useState<PredictionState | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  // Chart state
  const [tempData, setTempData] = useState<ChartPoint[]>([]);
  const [vibData, setVibData] = useState<ChartPoint[]>([]);
  const [pressData, setPressData] = useState<ChartPoint[]>([]);
  const [healthData, setHealthData] = useState<ChartPoint[]>([]);
  const [humData, setHumData] = useState<ChartPoint[]>([]);
  const [rpmData, setRpmData] = useState<ChartPoint[]>([]);
  const [voltData, setVoltData] = useState<ChartPoint[]>([]);

  const [activeTab, setActiveTab] = useState<"charts" | "predictive" | "events">("predictive");

  // Load initial data
  useEffect(() => {
    async function load() {
      try {
        const [twinData, eventsData, predsData, riskData] = await Promise.all([
          machineApi.twin(id),
          eventApi.byMachine(id, 30),
          predictiveApi.predictionsByMachine(id, 1).catch(() => []),
          predictiveApi.riskByMachine(id, 1).catch(() => []),
        ]);
        setTwin(twinData);
        setEvents(eventsData);
        if (predsData.length > 0) setPrediction(predsData[0]);
        if (riskData.length > 0) setRisk(riskData[0]);

        // Bootstrap charts
        const now = new Date().toLocaleTimeString();
        setTempData([{ time: now, value: twinData.temperature }]);
        setVibData([{ time: now, value: twinData.vibration }]);
        setPressData([{ time: now, value: twinData.pressure }]);
        setHealthData([{ time: now, value: twinData.health_score }]);
        setHumData([{ time: now, value: twinData.humidity }]);
        setRpmData([{ time: now, value: twinData.rpm }]);
        setVoltData([{ time: now, value: twinData.voltage }]);
      } catch {
        // Machine may not have data yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // WebSocket
  const handleSensorUpdate = useCallback(
    (machineId: string, payload: WSPayload) => {
      if (machineId !== id) return;
      setTwin(payload.twin);
      
      if (payload.prediction) setPrediction(payload.prediction);
      if (payload.risk) setRisk(payload.risk);

      const s = payload.sensor;
      const h = payload.health.score;

      setTempData((p) => addPoint(p, s.temperature));
      setVibData((p) => addPoint(p, s.vibration));
      setPressData((p) => addPoint(p, s.pressure));
      setHealthData((p) => addPoint(p, h));
      setHumData((p) => addPoint(p, s.humidity));
      setRpmData((p) => addPoint(p, s.rpm));
      setVoltData((p) => addPoint(p, s.voltage));

      if (payload.events.length > 0) {
        const newEvents: EventLog[] = payload.events.map((e, i) => ({
          id: `ws-${machineId}-${Date.now()}-${i}`,
          machine_id: machineId,
          timestamp: new Date().toISOString(),
          event_type: e.event_type,
          severity: e.severity as EventLog["severity"],
          description: e.description,
          old_value: null,
          new_value: null,
          metric: e.metric,
        }));
        setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
      }
    },
    [id]
  );

  const { isConnected } = useWebSocket({
    machineId: id,
    onSensorUpdate: handleSensorUpdate,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!twin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-400">Machine <code className="font-mono text-cyan-400">{id}</code> not found or no data yet</p>
        <Link href="/machines" className="text-sm text-blue-400 hover:underline">← Back to machines</Link>
      </div>
    );
  }

  const charts = [
    { data: tempData, title: "Temperature", unit: "°C", color: "#f97316", gradientId: `temp-${id}`, domain: [0, 120] },
    { data: vibData, title: "Vibration", unit: "g", color: "#a855f7", gradientId: `vib-${id}`, domain: [0, 2] },
    { data: pressData, title: "Pressure", unit: "psi", color: "#3b82f6", gradientId: `press-${id}`, domain: [0, 130] },
    { data: healthData, title: "Health Score", unit: "%", color: "#10b981", gradientId: `health-${id}`, domain: [0, 100] },
    { data: humData, title: "Humidity", unit: "%", color: "#06b6d4", gradientId: `hum-${id}`, domain: [0, 100] },
    { data: rpmData, title: "RPM", unit: "rpm", color: "#eab308", gradientId: `rpm-${id}` },
    { data: voltData, title: "Voltage", unit: "V", color: "#ec4899", gradientId: `volt-${id}` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/machines" className="text-slate-500 hover:text-slate-200 transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-500">{twin.machine_id}</span>
                <h1 className="text-lg font-bold text-slate-100 truncate">{twin.machine_name}</h1>
                <StatusBadge status={twin.status} size="sm" />
                {risk && risk.risk_level === "Critical Risk" && (
                  <span className="ml-2 rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-500/20 animate-pulse">
                    Critical Risk
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{twin.machine_type} · {twin.location}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shrink-0 ${isConnected ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse shadow-[0_0_4px_#34d399]" : "bg-red-400"}`} />
            {isConnected ? "Live" : "Reconnecting..."}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Digital Twin */}
        <DigitalTwin twin={twin} />

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-800/60 p-1 w-fit border border-slate-700/50">
          {(["predictive", "charts", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-slate-700 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "predictive" ? "🤖 Predictive AI" : tab === "charts" ? "📊 Live Charts" : "📋 Event Log"}
            </button>
          ))}
        </div>

        {/* Predictive Dashboard */}
        {activeTab === "predictive" && prediction && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            
            {/* Failure Forecast */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm xl:col-span-1">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Failure Forecast
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Next 24 Hours</span>
                    <span className={`font-bold ${prediction.failure_prob_24h > 0.5 ? "text-red-400" : "text-emerald-400"}`}>
                      {(prediction.failure_prob_24h * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${prediction.failure_prob_24h > 0.5 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${prediction.failure_prob_24h * 100}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Next 48 Hours</span>
                    <span className={`font-bold ${prediction.failure_prob_48h > 0.6 ? "text-orange-400" : "text-slate-300"}`}>
                      {(prediction.failure_prob_48h * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${prediction.failure_prob_48h * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Next 72 Hours</span>
                    <span className="font-bold text-slate-300">
                      {(prediction.failure_prob_72h * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${prediction.failure_prob_72h * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated Remaining Life (RUL)</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${prediction.rul_days < 7 ? "text-red-400" : "text-emerald-400"}`}>
                    {prediction.rul_days.toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-slate-500">Days</span>
                </div>
              </div>
            </div>

            {/* Explainable AI (SHAP) */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm xl:col-span-1">
              <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                Explainable AI (SHAP)
              </h3>
              <p className="text-xs text-slate-500 mb-4">What is driving the failure prediction?</p>
              
              <SHAPChart shapValues={prediction.shap_values} />
            </div>

            {/* Risk & Anomaly */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm xl:col-span-1 space-y-4">
               <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Risk Assessment
              </h3>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Risk Score</p>
                  <p className="text-2xl font-bold text-slate-200">{risk?.risk_score.toFixed(1) || "—"}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  risk?.risk_level === "Critical Risk" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  risk?.risk_level === "High Risk" ? "bg-orange-500/10 border-orange-500/20 text-orange-400" :
                  risk?.risk_level === "Medium Risk" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  {risk?.risk_level || "Calculating"}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Anomaly Score</p>
                  {prediction.is_anomaly && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded animate-pulse">ANOMALY DETECTED</span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-200">
                    {prediction.anomaly_score.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">/ 1.00</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500" style={{ width: `${prediction.anomaly_score * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {activeTab === "charts" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {charts.map((c) => (
              <LiveChart key={c.gradientId} data={c.data} title={c.title} unit={c.unit} color={c.color} gradientId={c.gradientId} domain={c.domain as any} />
            ))}
          </div>
        )}

        {/* Events */}
        {activeTab === "events" && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm">
            <EventLogPanel events={events} maxHeight="500px" />
          </div>
        )}
      </div>
    </div>
  );
}
