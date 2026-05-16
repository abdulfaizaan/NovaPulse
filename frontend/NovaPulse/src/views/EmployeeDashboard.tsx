/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { 
  Plus, 
  Target, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { MOCK_GOALS } from "@/src/constants";
import { GoalCard } from "@/src/components/goals/GoalCard";
import { StatWidget } from "@/src/components/dashboard/StatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { name: 'Jan', achievement: 45 },
  { name: 'Feb', achievement: 52 },
  { name: 'Mar', achievement: 48 },
  { name: 'Apr', achievement: 61 },
  { name: 'May', achievement: 55 },
  { name: 'Jun', achievement: 67 },
];

const kpiData = [
  { name: 'Product', value: 85 },
  { name: 'Eng', value: 65 },
  { name: 'Customer', value: 92 },
  { name: 'Culture', value: 78 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4'];

export function EmployeeDashboard({ onAddGoal }: { onAddGoal: () => void }) {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Employee Portal</h1>
          <p className="text-immersive-muted font-medium">Your performance overview for the current quarter.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 glass-effect font-bold text-immersive-text hover:bg-white/5">
             <FileText className="mr-2 size-4" /> Download Report
           </Button>
           <Button id="create-goal-button" className="bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/20 text-white" onClick={onAddGoal}>
             <Plus className="mr-2 size-4" /> New Goal
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-widgets">
        <StatWidget 
          title="Goal Completion" 
          value="68%" 
          description="Average across 4 goals" 
          icon={Target}
          trend={{ value: 12, isPositive: true }}
          color="indigo"
        />
        <StatWidget 
          title="Active Goals" 
          value="3" 
          description="1 draft goal pending" 
          icon={Zap}
          color="amber"
        />
        <StatWidget 
          title="Completed" 
          value="1" 
          description="Target achieved on time" 
          icon={CheckCircle2}
          color="emerald"
        />
        <StatWidget 
          title="Next Review" 
          value="14d" 
          description="Scheduled for June 15" 
          icon={Clock}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <TrendingUp className="size-4 text-indigo-400" />
              Performance Trend
            </CardTitle>
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 font-black border-indigo-500/20 text-[10px] tracking-widest">2026 Q2</Badge>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="achievement" 
                      stroke="#818cf8" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorAch)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 py-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Thrust Area Health</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    width={80}
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8', letterSpacing: '0.05em' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {kpiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 mt-6">
               {kpiData.map((item, idx) => (
                 <div key={item.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <div className="size-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[idx], color: COLORS[idx] }} />
                       <span className="text-[10px] font-black text-immersive-muted group-hover:text-immersive-text transition-colors uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-immersive-text">{item.value}%</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-immersive-text flex items-center gap-3">
            My Focus Goals
            <Badge className="bg-indigo-600 font-black text-[10px] h-5 px-2">{MOCK_GOALS.length}</Badge>
          </h2>
          <Button variant="ghost" className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 px-4 h-9">
            Explore All <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
           {MOCK_GOALS.map((goal) => (
             <GoalCard key={goal.id} goal={goal} />
           ))}
        </div>
      </div>
    </div>
  );
}
