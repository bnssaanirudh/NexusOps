"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Clock, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const performanceData = [
  { month: "Jan", uptime: 96.5, savings: 12000 },
  { month: "Feb", uptime: 97.2, savings: 18500 },
  { month: "Mar", uptime: 96.8, savings: 15200 },
  { month: "Apr", uptime: 98.1, savings: 24000 },
  { month: "May", uptime: 98.9, savings: 31000 },
  { month: "Jun", uptime: 99.2, savings: 43000 },
];

export default function ExecutiveDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
      
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-[#0F4C81]">Executive Overview</h1>
        <p className="text-slate-500">High-level business impact and fleet reliability metrics.</p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <KPICard title="Total Cost Saved" value="$43,000" trend="+18% vs last month" icon={DollarSign} color="text-emerald-600" bg="bg-emerald-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <KPICard title="Downtime Prevented" value="142 hrs" trend="+12 hrs vs last month" icon={Clock} color="text-blue-600" bg="bg-blue-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <KPICard title="Maintenance Efficiency" value="94%" trend="+4% vs last month" icon={TrendingUp} color="text-indigo-600" bg="bg-indigo-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <KPICard title="Assets at Risk" value="3" trend="-2 vs last month" icon={AlertCircle} color="text-rose-600" bg="bg-rose-100" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Chart 1: ROI / Savings Trend */}
        <Card className="hover-lift border-[#E5E7EB] bg-white">
          <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-4">
            <CardTitle className="text-base text-slate-700 font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Cumulative Savings (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Uptime Performance */}
        <Card className="hover-lift border-[#E5E7EB] bg-white">
          <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-4">
            <CardTitle className="text-base text-slate-700 font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Fleet Uptime Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value}%`, 'Uptime']}
                  />
                  <Line type="monotone" dataKey="uptime" stroke="#0F4C81" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color, bg }: any) {
  return (
    <Card className="flex flex-col p-6 bg-white border-[#E5E7EB] hover-lift transition-all h-full justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{trend}</span>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      </div>
    </Card>
  );
}
