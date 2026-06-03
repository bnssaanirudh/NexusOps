"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AgentReasoningProps {
  conclusion: string;
  evidence: Array<{
    metric: string;
    trend: "up" | "down" | "stable";
    value: string;
  }>;
}

export function AgentReasoningCard({ conclusion, evidence }: AgentReasoningProps) {
  return (
    <Card className="h-full flex flex-col bg-white border-[#E5E7EB]">
      <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#0F4C81] flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" /> AI Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Key Evidence</p>
          <div className="space-y-3">
            {evidence.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100"
              >
                <span className="text-sm font-medium text-slate-700">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  {item.trend === "up" && <TrendingUp className="w-4 h-4 text-rose-500" />}
                  {item.trend === "down" && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Conclusion</p>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 font-semibold text-sm">
            {conclusion}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
