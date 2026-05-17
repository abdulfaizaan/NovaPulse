/**
 * ManagerApprovalView — BRD Phase 1 Manager Workflow
 * Review submitted goals, inline edit, approve/reject/rework
 */
import * as React from "react";
import { CheckCircle2, XCircle, RotateCcw, Edit3, Save, ChevronRight, Target, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useGoalStore, TEAM_MEMBERS } from "../../stores/goalStore";
import { useAuth } from "../../context/AuthContext";
import { UOM_OPTIONS } from "../../types";
import { toast } from "sonner";

export function ManagerApprovalView() {
  const { user } = useAuth();
  const { goals, approveGoal, requestRework, lockGoal, updateGoal } = useGoalStore();
  const [reworkDialog, setReworkDialog] = React.useState<{ goalId: string; title: string } | null>(null);
  const [reworkComment, setReworkComment] = React.useState("");
  const [editingGoal, setEditingGoal] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<{ target?: number; weightage?: number }>({});

  const pendingGoals = goals.filter((g) => {
    const member = TEAM_MEMBERS.find((m) => m.id === g.ownerId);
    return member?.managerId === user?.id && g.status === 'submitted';
  });

  const approvedGoals = goals.filter((g) => {
    const member = TEAM_MEMBERS.find((m) => m.id === g.ownerId);
    return member?.managerId === user?.id && g.status === 'approved';
  });

  const handleApprove = (goalId: string) => {
    if (!user) return;
    approveGoal(goalId, user.id);
    toast.success("Goal approved!", { description: "Employee has been notified." });
  };

  const handleRework = () => {
    if (!reworkDialog || !user) return;
    requestRework(reworkDialog.goalId, user.id, reworkComment);
    toast.info("Rework requested", { description: `Employee will revise "${reworkDialog.title}"` });
    setReworkDialog(null);
    setReworkComment("");
  };

  const handleInlineEdit = (goalId: string) => {
    if (editingGoal === goalId) {
      // Save inline edits
      updateGoal(goalId, editData);
      setEditingGoal(null);
      setEditData({});
      toast.success("Goal updated", { description: "Target/weightage modified inline." });
    } else {
      const goal = goals.find((g) => g.id === goalId);
      setEditingGoal(goalId);
      setEditData({ target: goal?.target, weightage: goal?.weightage });
    }
  };

  const handleLock = (goalId: string) => {
    lockGoal(goalId);
    toast.success("Goal locked", { description: "No further edits without admin intervention." });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-immersive-text">Goal Approvals</h1>
        <p className="text-immersive-muted font-medium">Review, edit, and approve team member goal submissions.</p>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-black text-immersive-text">Pending Review</h2>
          <Badge className="bg-amber-500/10 text-amber-400 font-black text-[10px] border-none">{pendingGoals.length}</Badge>
        </div>

        {pendingGoals.length === 0 ? (
          <Card className="glass-effect border-white/5">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="size-12 text-emerald-400 mb-4" />
              <h3 className="text-sm font-black text-immersive-text">All Caught Up</h3>
              <p className="text-xs text-immersive-muted mt-1">No pending goal submissions to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingGoals.map((goal, idx) => {
              const uomInfo = UOM_OPTIONS.find((o) => o.value === goal.uom);
              const isEditing = editingGoal === goal.id;
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                  <Card className="glass-effect border-white/5 shadow-xl border-l-4 border-l-amber-500/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase border-none">{goal.thrustArea}</Badge>
                            <span className="text-[10px] text-immersive-muted font-bold">by {goal.ownerName}</span>
                          </div>
                          <h3 className="text-base font-black text-immersive-text">{goal.title}</h3>
                          <p className="text-xs text-immersive-muted">{goal.description}</p>

                          <div className="flex items-center gap-6 mt-3 flex-wrap">
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">UoM</span>
                              <p className="text-xs font-bold text-immersive-text">{uomInfo?.label || goal.uom}</p>
                            </div>
                            <Separator orientation="vertical" className="h-6 bg-white/10" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">Target</span>
                              {isEditing ? (
                                <Input type="number" className="h-7 w-20 text-xs bg-white/5 border-white/20 text-immersive-text" value={editData.target}
                                  onChange={(e) => setEditData({ ...editData, target: Number(e.target.value) })} />
                              ) : (
                                <p className="text-xs font-bold text-immersive-text">{goal.target}</p>
                              )}
                            </div>
                            <Separator orientation="vertical" className="h-6 bg-white/10" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">Weightage</span>
                              {isEditing ? (
                                <Input type="number" className="h-7 w-20 text-xs bg-white/5 border-white/20 text-immersive-text" value={editData.weightage}
                                  onChange={(e) => setEditData({ ...editData, weightage: Number(e.target.value) })} />
                              ) : (
                                <p className="text-xs font-bold text-immersive-text">{goal.weightage}%</p>
                              )}
                            </div>
                            <Separator orientation="vertical" className="h-6 bg-white/10" />
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">Deadline</span>
                              <p className="text-xs font-bold text-immersive-text">{goal.deadline}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => handleInlineEdit(goal.id)} variant="outline" className="border-white/10 text-immersive-text text-[10px] font-black uppercase tracking-widest h-8">
                            {isEditing ? <><Save className="mr-1 size-3" /> Save</> : <><Edit3 className="mr-1 size-3" /> Edit</>}
                          </Button>
                          <Button size="sm" onClick={() => handleApprove(goal.id)} className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest h-8">
                            <CheckCircle2 className="mr-1 size-3" /> Approve
                          </Button>
                          <Button size="sm" onClick={() => setReworkDialog({ goalId: goal.id, title: goal.title })} variant="outline" className="border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest h-8 hover:bg-rose-500/10">
                            <RotateCcw className="mr-1 size-3" /> Rework
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approved — ready to lock */}
      {approvedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-immersive-text flex items-center gap-2">Approved — Ready to Lock <Badge className="bg-emerald-500/10 text-emerald-400 font-black text-[10px] border-none">{approvedGoals.length}</Badge></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedGoals.map((goal) => (
              <Card key={goal.id} className="glass-effect border-white/5 border-l-4 border-l-emerald-500/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-immersive-text">{goal.title}</p>
                    <p className="text-[10px] text-immersive-muted font-bold">{goal.ownerName} · {goal.weightage}%</p>
                  </div>
                  <Button size="sm" onClick={() => handleLock(goal.id)} className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-widest h-8">
                    <Lock className="mr-1 size-3" /> Lock
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rework Dialog */}
      <Dialog open={!!reworkDialog} onOpenChange={() => setReworkDialog(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Request Rework</DialogTitle>
            <DialogDescription>Provide feedback on what needs to change for "{reworkDialog?.title}"</DialogDescription>
          </DialogHeader>
          <textarea className="w-full min-h-[100px] rounded-md border-2 border-input px-3 py-2 text-sm" placeholder="Explain what needs revision..."
            value={reworkComment} onChange={(e) => setReworkComment(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReworkDialog(null)}>Cancel</Button>
            <Button onClick={handleRework} disabled={!reworkComment} className="bg-rose-600 hover:bg-rose-500">Send Rework Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
