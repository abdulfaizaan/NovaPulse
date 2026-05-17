import { Users, CheckCircle2, AlertCircle, BarChart3, ChevronRight, UserMinus, UserPlus, Filter, Search, FileDown, Plus } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGoalStore, TEAM_MEMBERS } from "@/src/stores/goalStore";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import * as React from "react";
import { CascadeGoalModal } from "../components/goals/CascadeGoalModal";

export function ManagerDashboard() {
  const { user } = useAuth();
  const { goals, getPendingApprovals } = useGoalStore();
  const [isCascadeModalOpen, setIsCascadeModalOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);

  // Real team data
  const teamGoals = goals.filter((g) => {
    return g.employee?.managerId === user?.id || TEAM_MEMBERS.some((m) => m.id === g.ownerId && m.managerId === user?.id);
  });
  const pendingCount = getPendingApprovals(user?.id || '').length;
  const delayedCount = teamGoals.filter((g) => g.progressStatus === 'delayed').length;
  const teamProgress = teamGoals.length > 0 ? Math.round(teamGoals.reduce((s, g) => s + g.progressScore, 0) / teamGoals.length) : 0;
  const completedCount = teamGoals.filter((g) => g.progressStatus === 'completed').length;

  // Build the direct reports map dynamically (seed with TEAM_MEMBERS fallback)
  const derivedMembersMap = new Map<string, { id: string; name: string; department: string; avatar: string }>();
  
  TEAM_MEMBERS.filter((m) => m.managerId === user?.id).forEach((m) => {
    derivedMembersMap.set(m.id, {
      id: m.id,
      name: m.name,
      department: m.department,
      avatar: m.avatar,
    });
  });

  teamGoals.forEach((g) => {
    if (g.ownerId) {
      derivedMembersMap.set(g.ownerId, {
        id: g.ownerId,
        name: g.ownerName,
        department: (g.employee as any)?.department?.name || 'Engineering',
        avatar: (g.employee as any)?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${g.ownerName.split(' ')[0]}`,
      });
    }
  });

  // Per-member stats
  const memberStats = Array.from(derivedMembersMap.values()).map((member) => {
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
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/10 h-11 px-6" onClick={() => setIsCascadeModalOpen(true)}>
            <Plus className="mr-2 size-4" /> Cascade Goal
          </Button>
          <Button variant="outline" className="border-white/10 glass-effect font-bold text-immersive-text hover:bg-white/5 h-11 px-6" onClick={handleExport}>
            <FileDown className="mr-2 size-4" /> Export Analytics
          </Button>
        </div>
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
                      <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-indigo-400 hover:bg-transparent hover:text-indigo-300" onClick={() => setSelectedMember(member)}>
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

      <CascadeGoalModal open={isCascadeModalOpen} onOpenChange={setIsCascadeModalOpen} />

      {/* Subordinate Goals Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-[700px] bg-[#090D16] border border-white/10 text-white p-6 rounded-2xl shadow-2xl">
          {selectedMember && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="size-12 border-2 border-indigo-500/50 shadow-lg">
                    <AvatarImage src={selectedMember.avatar} />
                    <AvatarFallback className="bg-slate-800 text-white font-black">
                      {selectedMember.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <DialogTitle className="text-xl font-black tracking-tight text-white">
                      {selectedMember.name}'s Goals
                    </DialogTitle>
                    <DialogDescription className="text-xs text-immersive-muted font-bold uppercase tracking-wider">
                      {selectedMember.department} • {selectedMember.goalCount} Active Goals ({selectedMember.progress}% overall)
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="bg-white/10" />

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {goals.filter((g) => g.ownerId === selectedMember.id).length === 0 ? (
                  <p className="text-sm text-immersive-muted text-center py-8 font-bold">This employee has no active goals in this performance cycle.</p>
                ) : (
                  goals.filter((g) => g.ownerId === selectedMember.id).map((goal) => (
                    <div key={goal.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 hover:border-indigo-500/20 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Badge className="bg-indigo-600/10 text-indigo-400 border-none text-[8px] font-black uppercase tracking-widest mb-1.5">
                            {goal.thrustArea}
                          </Badge>
                          <h4 className="text-sm font-black text-white">{goal.title}</h4>
                          <p className="text-xs text-immersive-muted mt-1 leading-relaxed">{goal.description}</p>
                        </div>
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest border-none",
                          goal.progressStatus === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                          goal.progressStatus === 'delayed' ? "bg-rose-500/10 text-rose-400" :
                          "bg-amber-500/10 text-amber-400"
                        )}>
                          {goal.progressStatus || 'ON-TRACK'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/5 text-[10px] uppercase font-bold text-immersive-muted">
                        <div>
                          <span>Planned Target</span>
                          <p className="text-xs font-black text-white mt-0.5">{goal.target} {goal.uomLabel}</p>
                        </div>
                        <div>
                          <span>Actual Achieved</span>
                          <p className="text-xs font-black text-white mt-0.5">{goal.achievement || 0} {goal.uomLabel}</p>
                        </div>
                        <div>
                          <span>Weightage</span>
                          <p className="text-xs font-black text-indigo-400 mt-0.5">{goal.weightage}%</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-black text-immersive-muted">
                          <span>Completion Score</span>
                          <span>{goal.progressScore}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${goal.progressScore}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
