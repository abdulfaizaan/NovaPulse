/**
 * Advanced Analytics & Heatmaps — organizational insights.
 */

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  Map,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

const PERFORMANCE_DATA = [
  { subject: 'Engineering', A: 120, B: 110, fullMark: 150 },
  { subject: 'Sales', A: 98, B: 130, fullMark: 150 },
  { subject: 'Marketing', A: 86, B: 130, fullMark: 150 },
  { subject: 'Product', A: 99, B: 100, fullMark: 150 },
  { subject: 'Design', A: 85, B: 90, fullMark: 150 },
  { subject: 'HR', A: 65, B: 85, fullMark: 150 },
];

const TREND_DATA = [
  { name: 'W1', complete: 10, delayed: 2 },
  { name: 'W2', complete: 25, delayed: 3 },
  { name: 'W3', complete: 45, delayed: 5 },
  { name: 'W4', complete: 70, delayed: 4 },
  { name: 'W5', complete: 85, delayed: 2 },
];

export function AdvancedAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Advanced Analytics</h2>
          <p className="text-immersive-muted font-medium text-sm">Deep organizational performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-white/5">
          <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <Map className="size-4 text-indigo-400" />
              Department Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={PERFORMANCE_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Q1 Actual" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                <Radar name="Q2 Projected" dataKey="B" stroke="#34d399" fill="#34d399" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5">
          <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              Completion Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="complete" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorComplete)" />
                <Area type="monotone" dataKey="delayed" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorDelayed)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
