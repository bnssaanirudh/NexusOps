"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const analyticsData = [
  { time: "08:00", temp: 65, vib: 0.12, press: 45 },
  { time: "09:00", temp: 66, vib: 0.13, press: 46 },
  { time: "10:00", temp: 65, vib: 0.14, press: 44 },
  { time: "11:00", temp: 68, vib: 0.16, press: 43 },
  { time: "12:00", temp: 72, vib: 0.22, press: 40 },
  { time: "13:00", temp: 75, vib: 0.35, press: 38 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-[#0F4C81]">Predictive Analytics</h1>
        <p className="text-slate-500">Historical trends, forecasting, and anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KPICard title="Anomaly Rate" value="1.2%" trend="-0.3%" icon={AlertCircle} color="text-amber-500" />
        <KPICard title="Prediction Accuracy" value="96.4%" trend="+2.1%" icon={Activity} color="text-emerald-500" />
        <KPICard title="Models Active" value="12" trend="stable" icon={BarChart3} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-lift border-[#E5E7EB] bg-white">
          <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-4">
            <CardTitle className="text-base text-slate-700 font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" /> Temperature & Vibration Correlation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
                  <Line yAxisId="right" type="monotone" dataKey="vib" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift border-[#E5E7EB] bg-white">
          <CardHeader className="border-b border-[#E5E7EB] bg-slate-50/50 py-4">
            <CardTitle className="text-base text-slate-700 font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Anomaly Distribution by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Bearing", count: 45 },
                  { name: "Overheat", count: 32 },
                  { name: "Pressure", count: 18 },
                  { name: "Voltage", count: 12 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="flex flex-col p-6 bg-white border-[#E5E7EB] hover-lift transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{trend}</span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      </div>
    </Card>
  );
}
