/**
 * KPI Forecasting — Predictive models for goal completion.
 */

import * as React from "react";
import {
  TrendingUp,
  LineChart,
  Target,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const FORECAST_DATA = [
  { month: 'Jan', actual: 20, predicted: 20, target: 25 },
  { month: 'Feb', actual: 45, predicted: 45, target: 50 },
  { month: 'Mar', actual: 65, predicted: 65, target: 75 },
  { month: 'Apr', actual: 80, predicted: 85, target: 100 },
  { month: 'May', predicted: 105, target: 125 }, // Future
  { month: 'Jun', predicted: 130, target: 150 }, // Future
];

export function KPIForecasting() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">KPI Forecasting</h2>
          <p className="text-immersive-muted font-medium text-sm">AI-driven trajectory analysis and end-of-quarter predictions.</p>
        </div>
      </div>

      <Card className="glass-effect border-white/5">
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <LineChart className="size-4 text-indigo-400" />
            Q2 Revenue Target Trajectory
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 h-[400px]">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={FORECAST_DATA} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              <Bar dataKey="actual" name="Actual Progress" barSize={20} fill="#818cf8" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="predicted" name="AI Forecast" stroke="#34d399" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#34d399' }} />
              <Line type="stepAfter" dataKey="target" name="Target Goal" stroke="#f43f5e" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="glass-effect border-white/5 bg-emerald-500/5">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                     <Target className="size-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Projected Finish</p>
                     <p className="text-2xl font-black text-white">87%</p>
                  </div>
               </div>
               <p className="text-xs text-immersive-muted font-medium">Model predicts falling 13% short of the $150M Q2 target based on current velocity.</p>
            </CardContent>
         </Card>
         <Card className="glass-effect border-white/5 bg-amber-500/5">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                     <TrendingUp className="size-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Required Velocity</p>
                     <p className="text-2xl font-black text-white">+24%</p>
                  </div>
               </div>
               <p className="text-xs text-immersive-muted font-medium">Team needs to increase weekly output by 24% to intercept the target line.</p>
            </CardContent>
         </Card>
         <Card className="glass-effect border-white/5 bg-rose-500/5">
            <CardContent className="p-6">
               <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                     <AlertCircle className="size-5" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Risk Factors</p>
                     <p className="text-2xl font-black text-white">High</p>
                  </div>
               </div>
               <p className="text-xs text-immersive-muted font-medium">Historical Q2 seasonality indicates a 15% drop in enterprise deal closures in June.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
