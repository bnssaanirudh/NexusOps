"use client";

export default function ArchitecturePage() {
  const layers = [
    {
      id: "iot",
      label: "IoT Sensor Layer",
      icon: "📡",
      color: "from-teal-500/20 to-teal-600/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      items: ["Temperature Sensors", "Vibration Sensors", "Pressure Transducers", "Voltage Meters", "RPM Encoders"],
      description: "5 virtual industrial machines generating real-time sensor telemetry every 5 seconds",
    },
    {
      id: "streaming",
      label: "Real-Time Streaming Layer",
      icon: "⚡",
      color: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      items: ["FastAPI WebSocket Server", "Sensor Simulator (Python)", "Fault Override Engine", "Connection Manager"],
      description: "Async WebSocket architecture pushing updates to all connected clients simultaneously",
    },
    {
      id: "database",
      label: "Persistent Storage Layer",
      icon: "🗄️",
      color: "from-indigo-500/20 to-indigo-600/10",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      items: ["PostgreSQL 15", "Sensor Readings", "Health Records", "Predictions", "Maintenance Tickets"],
      description: "PostgreSQL with TimescaleDB-compatible schema for time-series IoT data at scale",
    },
    {
      id: "ml",
      label: "AI/ML Prediction Layer",
      icon: "🧮",
      color: "from-violet-500/20 to-violet-600/10",
      border: "border-violet-500/30",
      text: "text-violet-400",
      items: ["Isolation Forest (Anomaly)", "XGBoost (Failure Prob)", "SHAP Explainer (XAI)", "Health Engine", "RUL Estimator"],
      description: "Ensemble ML pipeline with explainable AI — every prediction comes with a human-readable reason",
    },
    {
      id: "agents",
      label: "Multi-Agent System (LangGraph)",
      icon: "🤖",
      color: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      items: ["Monitoring Agent", "Diagnosis Agent", "Planner Agent", "Cost Agent", "Approval Agent", "Ticket Agent"],
      description: "6-node LangGraph state machine — autonomous reasoning, cost analysis, and maintenance planning",
    },
    {
      id: "rag",
      label: "RAG Knowledge Base",
      icon: "📚",
      color: "from-pink-500/20 to-pink-600/10",
      border: "border-pink-500/30",
      text: "text-pink-400",
      items: ["Maintenance Manuals", "Equipment Documentation", "Safety Procedures (SOPs)", "Repair Procedures", "Copilot Interface"],
      description: "Retrieval-Augmented Generation over 8 curated industrial knowledge modules — instant expert answers",
    },
    {
      id: "dashboard",
      label: "Executive Intelligence Layer",
      icon: "📊",
      color: "from-orange-500/20 to-orange-600/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      items: ["Next.js 14 Dashboard", "Real-time Digital Twin", "Predictive Analytics", "ROI Engine", "Report Generator"],
      description: "React/Next.js frontend with real-time WebSocket updates, 10 specialized dashboards, and CSV exports",
    },
  ];

  const techStack = [
    { cat: "Frontend", items: ["Next.js 14", "React 18", "TailwindCSS", "TypeScript", "WebSocket"] },
    { cat: "Backend", items: ["FastAPI", "SQLAlchemy (async)", "Pydantic", "uvicorn"] },
    { cat: "ML/AI", items: ["XGBoost", "scikit-learn", "SHAP", "LangGraph", "Custom RAG"] },
    { cat: "Database", items: ["PostgreSQL 15", "asyncpg", "TimeSeries Schema"] },
    { cat: "Infrastructure", items: ["Docker", "Docker Compose", "Multi-container", "Health checks"] },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
        <h1 className="text-xl font-bold text-slate-100">System Architecture</h1>
        <p className="text-xs text-slate-500 mt-0.5">SentinelAI — Autonomous Industrial Reliability Intelligence Platform</p>
      </div>

      <div className="px-6 py-8">
        {/* Title card */}
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/5 p-6 mb-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">SentinelAI Architecture</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            A fully containerized, event-driven, autonomous industrial intelligence platform combining IoT telemetry, 
            predictive ML, multi-agent AI, RAG knowledge retrieval, and real-time human-in-the-loop automation.
          </p>
        </div>

        {/* Architecture Stack */}
        <div className="grid gap-4 mb-8">
          {layers.map((layer, i) => (
            <div key={layer.id} className="relative">
              {/* Connector arrow */}
              {i > 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-px h-3 bg-slate-600" />
                  <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 8L1 3h10L6 8z" />
                  </svg>
                </div>
              )}
              <div className={`rounded-2xl border bg-gradient-to-r ${layer.color} ${layer.border} p-5`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{layer.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-bold text-base ${layer.text}`}>{layer.label}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${layer.border} ${layer.text} font-mono uppercase tracking-wider`}>
                        Layer {i + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span key={item} className="text-xs bg-slate-900/60 border border-slate-700/50 rounded-full px-2.5 py-1 text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Flow Diagram */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 mb-8">
          <h2 className="text-base font-bold text-slate-200 mb-6">Data Flow — Sensor to Ticket</h2>
          <div className="flex items-center flex-wrap gap-2 justify-center">
            {[
              { label: "Sensor Reading", icon: "📡", color: "text-teal-400" },
              { label: "Health Engine", icon: "💊", color: "text-green-400" },
              { label: "ML Anomaly Detection", icon: "🔍", color: "text-blue-400" },
              { label: "XGBoost Prediction", icon: "🎯", color: "text-violet-400" },
              { label: "SHAP Explanation", icon: "🔬", color: "text-pink-400" },
              { label: "Alert Engine", icon: "🚨", color: "text-red-400" },
              { label: "Agent Workflow", icon: "🤖", color: "text-purple-400" },
              { label: "Human Approval", icon: "🧑‍⚖️", color: "text-orange-400" },
              { label: "Maintenance Ticket", icon: "🎫", color: "text-emerald-400" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700/50 flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                  <span className={`text-[9px] font-bold mt-1 text-center max-w-[60px] ${step.color}`}>{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg className="w-4 h-4 text-slate-600 mb-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
          <h2 className="text-base font-bold text-slate-200 mb-4">Technology Stack</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {techStack.map((cat) => (
              <div key={cat.cat}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{cat.cat}</p>
                <div className="space-y-1">
                  {cat.items.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                      <span className="text-xs text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
