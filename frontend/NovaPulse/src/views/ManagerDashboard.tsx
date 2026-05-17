/**
 * ManagerDashboard — Connected to Zustand store with real team data
 */
import { Users, CheckCircle2, AlertCircle, BarChart3, ChevronRight, UserMinus, UserPlus, Filter, Search, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { StatWidget } from "@/src/components/dashboard/StatWidget";
import { AIInsightsCard } from "@/src/components/ai/AIInsightsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGoalStore, TEAM_MEMBERS } from "@/src/stores/goalStore";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";

export function ManagerDashboard() {
  const { user } = useAuth();
  const { goals, getPendingApprovals } = useGoalStore();

  // Real team data
  const teamGoals = goals.filter((g) => {
    const member = TEAM_MEMBERS.find((m) => m.id === g.ownerId);
    return member?.managerId === user?.id;
  });
  const pendingCount = getPendingApprovals(user?.id || '').length;
  const delayedCount = teamGoals.filter((g) => g.progressStatus === 'delayed').length;
  const teamProgress = teamGoals.length > 0 ? Math.round(teamGoals.reduce((s, g) => s + g.progressScore, 0) / teamGoals.length) : 0;
  const completedCount = teamGoals.filter((g) => g.progressStatus === 'completed').length;

  // Per-member stats
  const memberStats = TEAM_MEMBERS.filter((m) => m.managerId === user?.id).map((member) => {
    const memberGoals = teamGoals.filter((g) => g.ownerId === member.id);
    const progress = memberGoals.length > 0 ? Math.round(memberGoals.reduce((s, g) => s + g.progressScore, 0) / memberGoals.length) : 0;
    const status = memberGoals.some((g) => g.progressStatus === 'delayed') ? 'delayed' : progress >= 80 ? 'ahead' : 'on-track';
    return { ...member, progress, status, goalCount: memberGoals.length };
  });

  const handleExport = () => {
    const csvRows = [
      ['Employee', 'Goal Title', 'Thrust Area', 'Target', 'Achievement', 'Score', 'Status', 'Weightage'].join(','),
      ...teamGoals.map((g) => [g.ownerName, g.title, g.thrustArea, g.target, g.achievement, g.progressScore + '%', g.progressStatus, g.weightage + '%'].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'team_analytics.csv'; a.click();
    toast.success("Team report downloaded!");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Team Performance</h1>
          <p className="text-immersive-muted font-medium">Monitoring {memberStats.length} direct reports and {teamGoals.length} active goals.</p>
        </div>
        <Button variant="outline" className="border-white/10 glass-effect font-bold text-immersive-text hover:bg-white/5 h-11 px-6" onClick={handleExport}>
          <FileDown className="mr-2 size-4" /> Export Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget title="Team Progress" value={`${teamProgress}%`} description="Avg objective completion" icon={BarChart3} trend={{ value: 5, isPositive: true }} color="indigo" />
        <StatWidget title="Pending Approvals" value={String(pendingCount)} description={pendingCount > 0 ? "Needs your review" : "All clear"} icon={CheckCircle2} color="amber" />
        <StatWidget title="Delayed Goals" value={String(delayedCount)} description={delayedCount > 0 ? "Requires check-in" : "All on track"} icon={AlertCircle} color="rose" />
        <StatWidget title="Total Team" value={String(memberStats.length)} description={`${completedCount} goals completed`} icon={Users} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4 bg-white/5">
            <div className="space-y-0.5">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Employee Goal Status</CardTitle>
              <CardDescription className="text-xs font-medium text-immersive-muted opacity-70">Direct reports and their overall goal health</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted py-4 pl-6">Employee</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Goals</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Progress</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-immersive-muted pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberStats.map((member) => (
                  <TableRow key={member.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-10 border-2 border-white/10 shadow-lg">
                          <AvatarImage src={member.avatar} /><AvatarFallback className="bg-slate-800 text-white font-black">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-immersive-text">{member.name}</span>
                          <span className="text-[10px] text-immersive-muted font-bold uppercase tracking-wider">{member.department}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm font-black text-immersive-text">{member.goalCount}</span></TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-immersive-muted">{member.progress}% Complete</span>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${member.progress}%` }} /></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border-none shadow-lg",
                        member.status === 'on-track' ? "bg-blue-500/10 text-blue-400" : member.status === 'ahead' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      )}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-indigo-400 hover:bg-transparent hover:text-indigo-300">
                        View <ChevronRight className="ml-1 size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 py-4 bg-white/5">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Resource Outlook</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 flex-1">
            {memberStats.filter((m) => m.status === 'ahead' || m.progress >= 80).length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20"><UserPlus className="size-5" /></div>
                  <div>
                    <p className="text-xs font-black text-immersive-text">Capacity Available</p>
                    <p className="text-[10px] text-immersive-muted font-bold">{memberStats.filter((m) => m.progress >= 80).map((m) => m.name.split(' ')[0]).join(', ')}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 font-black text-[9px] border-none">Low Risk</Badge>
              </div>
            )}
            {memberStats.filter((m) => m.status === 'delayed').length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20"><UserMinus className="size-5" /></div>
                  <div>
                    <p className="text-xs font-black text-immersive-text">At Risk</p>
                    <p className="text-[10px] text-immersive-muted font-bold">{memberStats.filter((m) => m.status === 'delayed').map((m) => m.name.split(' ')[0]).join(', ')}</p>
                  </div>
                </div>
                <Badge className="bg-rose-500/10 text-rose-400 font-black text-[9px] border-none">High Risk</Badge>
              </div>
            )}
            <Separator className="bg-white/5" />
            <div className="glass-effect bg-indigo-500/10 rounded-2xl p-6 text-white relative overflow-hidden border border-indigo-500/20 shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><BarChart3 className="size-24" /></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Quarterly Summary</h4>
              <p className="text-3xl font-black text-gradient mt-1">{completedCount}/{teamGoals.length}</p>
              <p className="text-[10px] text-immersive-muted font-black uppercase tracking-widest">Goals completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIInsightsCard variant="manager" />
    </div>
  );
}
