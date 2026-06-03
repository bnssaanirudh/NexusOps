"use client";

import { motion } from "framer-motion";
import { Activity, Thermometer, Gauge, Zap, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DigitalTwinState } from "@/lib/api";

interface DigitalTwinViewerProps {
  twin: DigitalTwinState | null;
}

export function DigitalTwinViewer({ twin }: DigitalTwinViewerProps) {
  if (!twin) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
        <Activity className="w-12 h-12 mb-4 opacity-20" />
        <p>Select a machine to view its Digital Twin</p>
      </Card>
    );
  }

  // Determine colors based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy": return "#16A34A";
      case "Warning": return "#F59E0B";
      case "Critical": return "#DC2626";
      default: return "#0F4C81";
    }
  };
  
  const statusColor = getStatusColor(twin.status);
  
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (twin.health_score / 100) * circumference;

  return (
    <Card className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      <CardHeader className="border-b border-[#E5E7EB] bg-white z-10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-[#0F4C81]">{twin.machine_id}</CardTitle>
            <p className="text-sm text-slate-500 mt-1">{twin.machine_type} • {twin.location}</p>
          </div>
          <Badge 
            variant={twin.status.toLowerCase() as any}
            className="text-sm px-3 py-1 uppercase tracking-wider"
          >
            {twin.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Animated Background Pulse for Critical State */}
        {twin.status === "Critical" && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse-subtle pointer-events-none" />
        )}

        {/* Central Health Ring */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
            <circle
              cx="150"
              cy="150"
              r="120"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            <motion.circle
              cx="150"
              cy="150"
              r="120"
              stroke={statusColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="text-center z-10 flex flex-col items-center">
            <span className="text-6xl font-bold text-slate-900 tracking-tighter">
              {Math.round(twin.health_score)}%
            </span>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Health</span>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8 z-10">
          <SensorBox icon={Thermometer} label="Temp" value={`${twin.temperature.toFixed(1)}°C`} />
          <SensorBox icon={Activity} label="Vibration" value={`${twin.vibration.toFixed(3)}g`} />
          <SensorBox icon={Wind} label="Pressure" value={`${twin.pressure.toFixed(1)} PSI`} />
          <SensorBox icon={Zap} label="Voltage" value={`${twin.voltage.toFixed(1)}V`} />
        </div>
      </CardContent>
    </Card>
  );
}

function SensorBox({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
      <Icon className="w-5 h-5 text-slate-400 mb-2" />
      <span className="text-lg font-semibold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}
