"use client";

import { motion } from "framer-motion";
import { Clock, ShieldAlert, ArrowRight, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AgentEvent {
  id: string;
  timestamp: string;
  agent: "Monitoring Agent" | "Diagnosis Agent" | "Planner Agent" | "Approval Agent";
  action: string;
  details: string;
}

interface AgentTimelineProps {
  events: AgentEvent[];
}

export function AgentTimeline({ events }: AgentTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Agent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-sm">No recent agent activity</p>
        </CardContent>
      </Card>
    );
  }

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case "Monitoring Agent": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Diagnosis Agent": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Planner Agent": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Approval Agent": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Agent Operations Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline marker */}
              <div className="absolute left-[-26px] md:left-1/2 md:-translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-slate-200 group-[.is-active]:bg-blue-600 shadow-sm"></div>
              
              <div className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-sm hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getAgentColor(event.agent)}`}>
                    {event.agent}
                  </span>
                  <time className="text-xs font-medium text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </time>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{event.action}</h4>
                <p className="text-sm text-slate-600 mt-1">{event.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
