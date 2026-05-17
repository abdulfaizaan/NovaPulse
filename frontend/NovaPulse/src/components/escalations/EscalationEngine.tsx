/**
 * Smart Escalation Engine — Configurable escalation logic & logs.
 */

import * as React from "react";
import {
  AlertTriangle,
  Settings,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ESCALATION_RULES = [
  { id: 1, condition: "Goal Delayed > 14 days", priority: "High", action: "Notify Manager & HR" },
  { id: 2, condition: "Check-in Missed > 2 cycles", priority: "Medium", action: "Notify Manager" },
  { id: 3, condition: "Pulse Score < 40", priority: "Critical", action: "Trigger Intervention Workflow" },
];

const RECENT_ESCALATIONS = [
  { id: "e1", target: "Frontend Launch", rule: "Goal Delayed > 14 days", status: "Active", time: "2 hours ago" },
  { id: "e2", target: "Q2 Sales Quota", rule: "Check-in Missed", status: "Resolved", time: "1 day ago" },
];

export function EscalationEngine() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Escalation Engine</h2>
          <p className="text-immersive-muted font-medium text-sm">Automated risk management and intervention workflows.</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/20">
          <Settings className="mr-2 size-4" /> Configure Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-white/5">
          <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <ShieldAlert className="size-4 text-rose-400" />
              Active Escalation Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {ESCALATION_RULES.map(rule => (
              <div key={rule.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-[9px] font-black uppercase border-none shadow-none px-2 h-5
                    ${rule.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 
                      rule.priority === 'High' ? 'bg-orange-500/10 text-orange-400' : 
                      'bg-amber-500/10 text-amber-400'}`}>
                    {rule.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="text-immersive-text">IF</span>
                  <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{rule.condition}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold mt-2">
                  <span className="text-immersive-text">THEN</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Bell className="size-3" /> {rule.action}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5">
          <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              Recent Escalation Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {RECENT_ESCALATIONS.map(esc => (
                <div key={esc.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-immersive-text">{esc.target}</span>
                      {esc.status === 'Active' ? (
                        <Badge className="bg-rose-500/10 text-rose-400 text-[9px] uppercase border-none">Active</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] uppercase border-none">Resolved</Badge>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-immersive-muted uppercase tracking-wider flex items-center gap-1">
                      Rule: {esc.rule}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-immersive-muted flex items-center gap-1">
                    <Clock className="size-3" />
                    {esc.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5">
               <Button variant="outline" className="w-full text-xs font-bold border-white/10 text-immersive-text hover:bg-white/5">
                 View Full Logs
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
