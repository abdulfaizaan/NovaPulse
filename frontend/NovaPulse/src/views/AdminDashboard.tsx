/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalendarDays, History, AlertTriangle, ShieldCheck, Activity, Globe, Download, Send, Play, ChevronRight } from "lucide-react";
import { StatWidget } from "@/src/components/dashboard/StatWidget";
import { PulseScore } from "@/src/components/dashboard/PulseScore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useGoalStore } from "@/src/stores/goalStore";
import { toast } from "sonner";



export function AdminDashboard() {
  const { goals, auditLogs, notifications } = useGoalStore();
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.progressStatus === 'completed').length;
  const globalCompletion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const escalationCount = notifications.filter((n) => n.type === 'escalation' && !n.isRead).length;

  const handleExportAudit = () => {
    const csvRows = [
      ['User', 'Action', 'Entity', 'Before', 'After', 'Timestamp'].join(','),
      ...auditLogs.map((l) => [l.userName, l.action, l.entityType, l.beforeValue || '', l.afterValue || '', l.timestamp].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'audit_log.csv'; a.click();
    toast.success('Audit log exported!');
  };
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Platform Command</h1>
          <p className="text-immersive-muted font-medium">Global governance and monitoring for NovaPulse enterprise.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 glass-effect font-black text-[10px] uppercase tracking-widest px-6 h-11 text-immersive-text hover:bg-white/5" onClick={handleExportAudit}>
             <Download className="mr-2 size-4" /> Global Audit CSV
            </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-500 font-black text-[10px] uppercase tracking-widest px-8 h-11 shadow-xl shadow-indigo-600/20 text-white">
             <Send className="mr-2 size-4" /> System Broadcast
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget 
          title="Global Completion" 
          value={`${globalCompletion}%`} 
          description={`Across ${totalGoals} active goals`} 
          icon={Globe}
          trend={{ value: 8, isPositive: true }}
          color="indigo"
        />
        <StatWidget 
          title="Active Cycles" 
          value="2" 
          description="Q2 Open, Q1 Reconciliation" 
          icon={CalendarDays}
          color="blue"
        />
        <StatWidget 
          title="Pending Escalations" 
          value={String(escalationCount)} 
          description={escalationCount > 0 ? "Requires attention" : "All clear"} 
          icon={AlertTriangle}
          color="rose"
        />
        <StatWidget 
          title="System Health" 
          value="99.9%" 
          description="API latency: 45ms" 
          icon={Activity}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4 bg-white/5">
            <div className="space-y-0.5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
                <History className="size-4 text-indigo-400" />
                Live Audit Logs
              </CardTitle>
            </div>
            <Button variant="ghost" className="font-black text-[10px] text-indigo-400 uppercase tracking-widest hover:bg-transparent hover:text-indigo-300 px-0 h-auto">
              View Historian <ChevronRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted py-4 pl-6">Initiator</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Action</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Delta</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-immersive-muted pr-6">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.slice(0, 10).map((log, idx) => (
                  <TableRow key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <TableCell className="py-4 pl-6">
                      <span className="text-sm font-black text-immersive-text">{log.userName}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-immersive-muted shadow-none px-2 h-5 bg-white/5">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-immersive-muted line-through opacity-50">{log.beforeValue}</span>
                        <ChevronRight className="size-3 text-immersive-muted opacity-30" />
                        <span className="text-indigo-400 font-black">{log.afterValue}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">{new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col">
          {/* Org Pulse Score */}
          <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-white/5 py-4 bg-white/5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
                <Activity className="size-4 text-indigo-400" />
                Organization Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6 flex justify-center">
              <PulseScore score={76} previousScore={71} label="Org Health" size="md" />
            </CardContent>
          </Card>

          <Card className="border-white/5 glass-effect bg-indigo-600/10 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative group border flex-1">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                <Play className="size-32" />
             </div>
             <CardHeader className="relative z-10 border-b border-white/5 bg-white/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Cycle Management</CardTitle>
                <div className="text-xl font-black text-gradient mt-2">Q3 PLANNING START</div>
             </CardHeader>
             <CardContent className="relative z-10 space-y-6 pt-6">
                <p className="text-[11px] text-immersive-muted font-bold leading-relaxed uppercase tracking-wide">Automated provisioning and goal initialization scheduled for <span className="text-indigo-400 font-black">July 1st, 2026</span>.</p>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                   <div className="space-y-1">
                     <span className="text-[9px] font-black uppercase tracking-widest text-immersive-muted">Phase Status</span>
                     <p className="text-xs font-black text-immersive-text tracking-widest">PRE-PLANNING</p>
                   </div>
                   <Badge className="bg-amber-500/10 text-amber-500 font-black text-[10px] border-none shadow-[0_0_10px_rgba(245,158,11,0.2)]">LOCKED</Badge>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-transform">
                  Advance Phase
                </Button>
             </CardContent>
          </Card>

          <Card className="border-white/5 glass-effect shadow-xl overflow-hidden">
             <CardContent className="p-5">
                <div className="flex items-center gap-4">
                   <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <ShieldCheck className="size-5" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-black text-immersive-text uppercase tracking-widest">Security Audit Passing</h4>
                      <p className="text-[10px] text-immersive-muted font-bold uppercase tracking-tighter">Last automated scan: 12m ago</p>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
