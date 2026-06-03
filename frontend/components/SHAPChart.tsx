"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

interface SHAPChartProps {
  shapValues: Record<string, number> | null;
}

export function SHAPChart({ shapValues }: SHAPChartProps) {
  const data = useMemo(() => {
    if (!shapValues) return [];
    
    // The ML engine returns normalized positive values (percentages)
    // Convert the dictionary to an array for Recharts
    const arr = Object.entries(shapValues).map(([feature, impact]) => ({
      feature: feature.charAt(0).toUpperCase() + feature.slice(1).replace("_", " "),
      impact: impact,
    }));
    
    // It's already sorted by ml_engine, but we can take top 5
    return arr.slice(0, 5);
  }, [shapValues]);

  if (!shapValues || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 text-sm">
        No explainability data available yet
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']} 
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
            unit="%"
          />
          <YAxis 
            dataKey="feature" 
            type="category" 
            tick={{ fill: "#e2e8f0", fontSize: 11 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f1f5f9", borderRadius: "8px" }}
            itemStyle={{ color: "#38bdf8" }}
            formatter={(value: any) => [`${Number(value).toFixed(1)}%`, "Impact"]}
          />
          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? "#f43f5e" : index === 1 ? "#f59e0b" : "#38bdf8"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
