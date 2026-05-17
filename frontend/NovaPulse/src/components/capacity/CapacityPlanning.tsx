/**
 * Workforce Capacity Planning — Workload distribution and resource utilization.
 */

import * as React from "react";
import {
  Users,
  Activity,
  Battery,
  BatteryWarning,
  Flame,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const CAPACITY_DATA = [
  { name: "Alex Rivera", role: "Product Designer", capacity: 95, goals: 4, status: "overloaded" },
  { name: "Jordan Smith", role: "Frontend Eng", capacity: 70, goals: 3, status: "optimal" },
  { name: "Mila Kunis", role: "UX Researcher", capacity: 110, goals: 5, status: "burnout-risk" },
  { name: "Oscar Wilde", role: "Product Manager", capacity: 60, goals: 2, status: "available" },
];

export function CapacityPlanning() {
  const getCapacityColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 progress-emerald";
      case "available": return "bg-blue-500/10 border-blue-500/20 text-blue-400 progress-blue";
      case "overloaded": return "bg-amber-500/10 border-amber-500/20 text-amber-400 progress-amber";
      case "burnout-risk": return "bg-rose-500/10 border-rose-500/20 text-rose-400 progress-rose";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Capacity Planning</h2>
          <p className="text-immersive-muted font-medium text-sm">Monitor workload and prevent employee burnout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="size-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">Avg Utilization</p>
              <p className="text-xl font-black text-immersive-text">83%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-white/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Flame className="size-5 text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">Burnout Risk</p>
              <p className="text-xl font-black text-immersive-text">1 Staff</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-white/5">
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <Activity className="size-4 text-indigo-400" />
            Resource Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {CAPACITY_DATA.map((person, i) => (
              <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-immersive-text">{person.name}</span>
                      <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border shadow-none px-1.5 h-4 ${getCapacityColor(person.status).split('progress')[0]}`}>
                        {person.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-immersive-muted font-semibold uppercase tracking-wider">{person.role}</p>
                  </div>
                  
                  <div className="flex-1 w-full md:max-w-md space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <span className="text-immersive-muted">Workload</span>
                      <span className={person.capacity > 100 ? "text-rose-400" : "text-immersive-text"}>{person.capacity}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${person.capacity > 100 ? 'bg-rose-500' : person.capacity > 85 ? 'bg-amber-500' : person.capacity > 65 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(person.capacity, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-[10px] font-bold text-immersive-muted bg-white/5 px-2 py-1 rounded">
                    <Briefcase className="size-3" />
                    {person.goals} Active Goals
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
