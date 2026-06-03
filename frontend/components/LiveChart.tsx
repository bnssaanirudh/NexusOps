"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ChartPoint } from "@/lib/types";

interface LiveChartProps {
  data: ChartPoint[];
  title: string;
  unit: string;
  color: string;
  gradientId: string;
  domain?: [number | "auto", number | "auto"];
  height?: number;
}

const CustomTooltip = ({
  active, payload, label, unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 shadow-2xl backdrop-blur-md">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-100">
          {payload[0].value.toFixed(2)}
          <span className="text-xs text-slate-400 ml-1">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function LiveChart({
  data,
  title,
  unit,
  color,
  gradientId,
  domain = ["auto", "auto"],
  height = 180,
}: LiveChartProps) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold border" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
          {data.length > 0 ? `${data[data.length - 1].value.toFixed(2)} ${unit}` : "—"}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={domain}
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#0f172a", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
