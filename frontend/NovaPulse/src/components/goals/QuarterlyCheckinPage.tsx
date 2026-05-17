/**
 * QuarterlyCheckinPage — BRD Phase 2 implementation
 * Employees log actual achievement vs planned target per goal
 */
import * as React from "react";
import { CheckCircle2, Clock, TrendingUp, AlertTriangle, Send, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGoalStore } from "../../stores/goalStore";
import { useAuth } from "../../context/AuthContext";
import { calculateProgressScore, UOM_OPTIONS } from "../../types";
import type { GoalProgressStatus } from "../../types";
import { toast } from "sonner";

const CURRENT_CYCLE = { id: 'c2', name: 'Q2 2026' };
const STATUS_OPTIONS: { value: GoalProgressStatus; label: string; color: string }[] = [
  { value: 'not-started', label: 'Not Started', color: 'bg-slate-500/10 text-slate-400' },
  { value: 'on-track', label: 'On Track', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400' },
  { value: 'delayed', label: 'Delayed', color: 'bg-rose-500/10 text-rose-400' },
];

export function QuarterlyCheckinPage() {
  const { user } = useAuth();
  const { goals, checkins, addCheckin } = useGoalStore();
  const myGoals = goals.filter((g) => g.ownerId === user?.id && (g.status === 'approved' || g.status === 'locked'));
  const myCheckins = checkins.filter((c) => c.employeeId === user?.id);

  const [checkinData, setCheckinData] = React.useState<Record<string, { actual: string; status: GoalProgressStatus; notes: string }>>({});

  const getCheckinForGoal = (goalId: string) => myCheckins.filter((c) => c.goalId === goalId && c.cycleId === CURRENT_CYCLE.id);

  const handleSubmitCheckin = (goalId: string) => {
    const data = checkinData[goalId];
    if (!data || !user) return;
    const goal = myGoals.find((g) => g.id === goalId);
    if (!goal) return;

    const actual = Number(data.actual);
    const score = calculateProgressScore(goal.uom, goal.target, actual);

    addCheckin({
      goalId, goalTitle: goal.title, employeeId: user.id, cycleId: CURRENT_CYCLE.id, cycleName: CURRENT_CYCLE.name,
      plannedTarget: goal.target, actualAchievement: actual, progressStatus: data.status,
      notes: data.notes, completionPercentage: score,
    });

    toast.success("Check-in submitted!", { description: `Achievement logged for "${goal.title}"` });
    setCheckinData((prev) => { const next = { ...prev }; delete next[goalId]; return next; });
  };

  if (myGoals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="size-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center"><Clock className="size-10 text-immersive-muted" /></div>
        <h3 className="text-lg font-black text-immersive-text">No Approved Goals Yet</h3>
        <p className="text-sm text-immersive-muted max-w-[300px]">Your goals need to be approved by your manager before you can log check-ins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Quarterly Check-in</h1>
          <p className="text-immersive-muted font-medium">Log your actual achievement against planned targets for {CURRENT_CYCLE.name}.</p>
        </div>
        <Badge className="bg-indigo-500/10 text-indigo-400 font-black text-xs border-indigo-500/20 h-8 px-4">{CURRENT_CYCLE.name} Active</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {myGoals.map((goal, idx) => {
          const existing = getCheckinForGoal(goal.id);
          const data = checkinData[goal.id] || { actual: '', status: goal.progressStatus, notes: '' };
          const hasExisting = existing.length > 0;
          const latestCheckin = hasExisting ? existing[existing.length - 1] : null;
          const uomInfo = UOM_OPTIONS.find((o) => o.value === goal.uom);

          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between border-b border-white/5 py-4 bg-white/5">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-sm font-black text-immersive-text">{goal.title}</CardTitle>
                    <CardDescription className="text-xs text-immersive-muted">{goal.thrustArea} · {uomInfo?.label || goal.uom} · Weight: {goal.weightage}%</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-[9px] font-black uppercase border-none",
                      goal.progressStatus === 'completed' ? "bg-emerald-500/10 text-emerald-400" :
                      goal.progressStatus === 'on-track' ? "bg-blue-500/10 text-blue-400" :
                      goal.progressStatus === 'delayed' ? "bg-rose-500/10 text-rose-400" : "bg-slate-500/10 text-slate-400"
                    )}>{goal.progressStatus}</Badge>
                    <div className="text-right">
                      <p className="text-lg font-black text-immersive-text">{goal.progressScore}%</p>
                      <p className="text-[9px] text-immersive-muted font-bold uppercase">Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Previous check-ins */}
                  {hasExisting && (
                    <div className="mb-4 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Previous Check-ins</p>
                      {existing.map((ci) => (
                        <div key={ci.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-immersive-text">{ci.cycleName}:</span>
                            <span className="text-immersive-muted ml-2">Planned {ci.plannedTarget} → Actual {ci.actualAchievement} ({ci.completionPercentage}%)</span>
                          </div>
                          {ci.managerComment && (
                            <div className="flex items-center gap-1 text-indigo-400"><MessageSquare className="size-3" /><span className="text-[10px]">Manager feedback</span></div>
                          )}
                        </div>
                      ))}
                      <Separator className="bg-white/5 my-4" />
                    </div>
                  )}

                  {/* New check-in form */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Planned Target</Label>
                      <div className="h-10 bg-white/5 border border-white/10 rounded-md flex items-center px-3 text-sm font-bold text-immersive-text">{goal.target}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Actual Achievement *</Label>
                      <Input type="number" placeholder="Enter actual" className="bg-white/5 border-white/10 text-immersive-text" value={data.actual}
                        onChange={(e) => setCheckinData((prev) => ({ ...prev, [goal.id]: { ...data, actual: e.target.value } }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Status *</Label>
                      <Select value={data.status} onValueChange={(val) => setCheckinData((prev) => ({ ...prev, [goal.id]: { ...data, status: val as GoalProgressStatus } }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-immersive-text"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Notes</Label>
                      <Input placeholder="Progress notes..." className="bg-white/5 border-white/10 text-immersive-text" value={data.notes}
                        onChange={(e) => setCheckinData((prev) => ({ ...prev, [goal.id]: { ...data, notes: e.target.value } }))} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => handleSubmitCheckin(goal.id)} disabled={!data.actual}
                      className="bg-indigo-600 hover:bg-indigo-500 font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                      <Send className="mr-2 size-3" /> Submit Check-in
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
