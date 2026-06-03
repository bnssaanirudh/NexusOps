"use client";

import { useState, useRef, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  category?: string;
  confidence?: number;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: "⚠️ At-risk machines", message: "Which machines need immediate attention right now?" },
  { label: "💰 Cost savings", message: "How much downtime and cost has been prevented this week?" },
  { label: "🔧 Bearing repair", message: "How do I replace a BX-17 bearing?" },
  { label: "🌡️ Overheating fix", message: "What causes motor overheating and how do I fix it?" },
  { label: "💧 Pressure leak", message: "What causes pressure instability and leaks?" },
  { label: "⚡ Voltage fault", message: "How do I diagnose voltage instability?" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`@keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `# Welcome to SentinelAI Copilot 🤖

I'm your **Industrial Intelligence Assistant**, powered by Retrieval-Augmented Generation (RAG).

I can help you with:
- 🔍 **Live machine status** — "Which machines are at risk?"
- 💰 **Cost & downtime analysis** — "How much downtime was prevented?"
- 🔧 **Maintenance procedures** — "How do I replace a bearing?"
- 📊 **Machine-specific reports** — "What's the status of M003?"
- 🩺 **Fault diagnosis** — "What causes pressure leaks?"

Ask me anything!`,
      source: "SentinelAI Knowledge Base",
      category: "System",
      confidence: 1.0,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/copilot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        source: data.source,
        category: data.category,
        confidence: data.confidence,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Backend is not reachable. Make sure Docker is running!\n\n```\ncd docker && docker-compose up -d\n```",
          source: "System",
          category: "Error",
          confidence: 1.0,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown renderer
  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-white mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-base font-bold text-slate-200 mb-1 mt-3">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="text-slate-300 ml-4 list-disc">$1</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 rounded text-cyan-300 text-xs">$1</code>')
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">SentinelAI Copilot</h1>
          <p className="text-xs text-slate-500">RAG-Powered Industrial Intelligence Assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Knowledge Base Online
        </div>
      </div>

      {/* Quick prompts */}
      <div className="border-b border-slate-800/50 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p.label}
            onClick={() => sendMessage(p.message)}
            disabled={isLoading}
            className="shrink-0 text-xs rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                <span className="text-xs">🤖</span>
              </div>
            )}
            <div className={`max-w-2xl ${msg.role === "user" ? "max-w-sm" : ""}`}>
              <div
                className={`rounded-2xl px-5 py-4 ${
                  msg.role === "user"
                    ? "bg-cyan-600/90 text-white rounded-tr-sm"
                    : "bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "assistant" && msg.source && (
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span className="text-[10px] text-slate-500">📚 {msg.source}</span>
                  {msg.confidence && (
                    <span className="text-[10px] text-slate-600">
                      · {(msg.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-xs">🤖</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/90 backdrop-blur-xl">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about machines, maintenance, failures, costs..."
            className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          Powered by RAG · Industrial Knowledge Base V3.2 · 8 knowledge modules loaded
        </p>
      </div>
    </div>
  );
}
