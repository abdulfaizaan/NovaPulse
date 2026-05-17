/**
 * ManagerApprovalView — Connected direct reports goal approvals and check-in review dashboard
 */
import * as React from "react";
import { CheckCircle2, XCircle, RotateCcw, Edit3, Save, ChevronRight, Target, Lock, MessageSquare, Calendar, TrendingUp } from "lucide-react";
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
  const { goals, checkins, approveGoal, requestRework, lockGoal, updateGoal, fetchGoalCheckins, reviewCheckin } = useGoalStore();
  
  const [activeSection, setActiveSection] = React.useState<'goals' | 'checkins'>('goals');
  const [reworkDialog, setReworkDialog] = React.useState<{ goalId: string; title: string } | null>(null);
  const [reworkComment, setReworkComment] = React.useState("");
  
  const [editingGoal, setEditingGoal] = React.useState<string | null>(null);
  const [editData, setEditData] = React.useState<{ target?: number; weightage?: number }>({});
  
  const [reviewDialog, setReviewDialog] = React.useState<{ checkinId: string; title: string; actual: number; target: number } | null>(null);
  const [reviewStatus, setReviewStatus] = React.useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewComment, setReviewComment] = React.useState("");

  const teamGoals = goals.filter((g) => {
    return g.employee?.managerId === user?.id || TEAM_MEMBERS.some((m) => m.id === g.ownerId && m.managerId === user?.id);
  });

  const pendingGoals = teamGoals.filter((g) => g.status === 'submitted');
  const approvedGoals = teamGoals.filter((g) => g.status === 'approved');

  // Load team checkins when switching tab
  React.useEffect(() => {
    if (activeSection === 'checkins') {
      teamGoals.forEach((g) => {
        fetchGoalCheckins(g.id);
      });
    }
  }, [activeSection, teamGoals.length]);

  const pendingCheckins = checkins.filter((c) => {
    const goal = goals.find((g) => g.id === c.goalId);
    return goal && (c.status.toUpperCase() === 'PENDING' || c.status.toLowerCase() === 'pending');
  });

  const reviewedCheckins = checkins.filter((c) => {
    const goal = goals.find((g) => g.id === c.goalId);
    return goal && (c.status.toUpperCase() === 'APPROVED' || c.status.toUpperCase() === 'REJECTED');
  });

  const handleApprove = (goalId: string) => {
    if (!user) return;
    approveGoal(goalId, user.id);
    toast.success("Goal approved!", { description: "Employee has been notified." });
  };

  const handleBulkApprove = () => {
    if (!user || pendingGoals.length === 0) return;
    pendingGoals.forEach(g => approveGoal(g.id, user.id));
    toast.success("Bulk Approved!", { description: `${pendingGoals.length} goals approved successfully.` });
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

  const handleCheckinReviewSubmit = async () => {
    if (!reviewDialog) return;
    await reviewCheckin(reviewDialog.checkinId, reviewStatus, reviewComment);
    setReviewDialog(null);
    setReviewComment("");
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Direct Subordinates Review</h1>
          <p className="text-immersive-muted font-medium">Verify submissions and calibration settings for active cycles.</p>
        </div>
        
        {/* Sleek Tab Toggles */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl self-start sm:self-auto">
          <Button onClick={() => setActiveSection('goals')} className={cn("rounded-xl px-5 h-9 font-bold text-xs uppercase tracking-wider text-immersive-muted hover:text-white transition-all shadow-none bg-transparent hover:bg-white/5", activeSection === 'goals' && "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/10")}>
            Goals {pendingGoals.length > 0 && <span className="ml-1.5 size-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px] font-black">{pendingGoals.length}</span>}
          </Button>
          <Button onClick={() => setActiveSection('checkins')} className={cn("rounded-xl px-5 h-9 font-bold text-xs uppercase tracking-wider text-immersive-muted hover:text-white transition-all shadow-none bg-transparent hover:bg-white/5", activeSection === 'checkins' && "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/10")}>
            Check-ins {pendingCheckins.length > 0 && <span className="ml-1.5 size-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px] font-black">{pendingCheckins.length}</span>}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'goals' ? (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Pending Approvals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-immersive-text">Pending Review</h2>
                  <Badge className="bg-amber-500/10 text-amber-400 font-black text-[10px] border-none">{pendingGoals.length}</Badge>
                </div>
                {pendingGoals.length > 1 && (
                  <Button variant="outline" className="border-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/10 h-8 text-xs px-4" onClick={handleBulkApprove}>
                    <CheckCircle2 className="mr-2 size-3" /> Approve All ({pendingGoals.length})
                  </Button>
                )}
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
                                      <Input type="number" className="h-7 w-20 text-xs bg-white/5 border-white/20 text-immersive-text" value={editData.target} onChange={(e) => setEditData({ ...editData, target: Number(e.target.value) })} />
                                    ) : (
                                      <p className="text-xs font-bold text-immersive-text">{goal.target}</p>
                                    )}
                                  </div>
                                  <Separator orientation="vertical" className="h-6 bg-white/10" />
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">Weightage</span>
                                    {isEditing ? (
                                      <Input type="number" className="h-7 w-20 text-xs bg-white/5 border-white/20 text-immersive-text" value={editData.weightage} onChange={(e) => setEditData({ ...editData, weightage: Number(e.target.value) })} />
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
          </motion.div>
        ) : (
          <motion.div key="checkins" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Pending Check-ins */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-immersive-text">Quarterly Check-ins Pending Review</h2>
                <Badge className="bg-amber-500/10 text-amber-400 font-black text-[10px] border-none">{pendingCheckins.length}</Badge>
              </div>

              {pendingCheckins.length === 0 ? (
                <Card className="glass-effect border-white/5">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="size-12 text-emerald-400 mb-4" />
                    <h3 className="text-sm font-black text-immersive-text">Everything Reviewed</h3>
                    <p className="text-xs text-immersive-muted mt-1">No subordinate check-ins awaiting calibration.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingCheckins.map((checkin, idx) => {
                    const goal = goals.find((g) => g.id === checkin.goalId);
                    if (!goal) return null;
                    const progressVal = checkin.plannedTarget > 0 ? Math.round((checkin.actualAchievement / checkin.plannedTarget) * 100) : 0;
                    return (
                      <motion.div key={checkin.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                        <Card className="glass-effect border-white/5 border-l-4 border-l-amber-500/50 shadow-xl overflow-hidden relative">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase border-none">{goal.thrustArea}</Badge>
                                  <span className="text-[10px] text-immersive-muted font-bold">by {goal.ownerName}</span>
                                </div>
                                <h3 className="text-base font-black text-immersive-text">Check-in for: "{goal.title}"</h3>
                                
                                {checkin.notes && (
                                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest flex items-center gap-1.5"><MessageSquare className="size-3 text-indigo-400" /> Employee Notes</span>
                                    <p className="text-xs text-immersive-text mt-1.5 italic">"{checkin.notes}"</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest flex items-center gap-1"><Target className="size-3 text-indigo-400" /> Target</span>
                                    <p className="text-sm font-black text-immersive-text">{checkin.plannedTarget} <span className="text-[10px] text-immersive-muted font-normal">{goal.uom}</span></p>
                                  </div>
                                  
                                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest flex items-center gap-1"><TrendingUp className="size-3 text-emerald-400" /> Achieved</span>
                                    <p className="text-sm font-black text-emerald-400">{checkin.actualAchievement} <span className="text-[10px] text-immersive-muted font-normal">{goal.uom}</span></p>
                                  </div>

                                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                                    <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest flex items-center gap-1">Progress</span>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-black text-indigo-400">{progressVal}%</p>
                                      <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(progressVal, 100)}%` }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                                <Button size="sm" onClick={() => {
                                  setReviewDialog({ checkinId: checkin.id, title: goal.title, actual: checkin.actualAchievement, target: checkin.plannedTarget });
                                  setReviewStatus('APPROVED');
                                }} className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest h-9 px-5">
                                  <CheckCircle2 className="mr-1.5 size-3.5" /> Calibrate Approve
                                </Button>
                                <Button size="sm" onClick={() => {
                                  setReviewDialog({ checkinId: checkin.id, title: goal.title, actual: checkin.actualAchievement, target: checkin.plannedTarget });
                                  setReviewStatus('REJECTED');
                                }} variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest h-9 px-5">
                                  <XCircle className="mr-1.5 size-3.5" /> Calibrate Reject
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

            {/* Reviewed Check-ins */}
            {reviewedCheckins.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-black text-immersive-text flex items-center gap-2">Calibration History <Badge className="bg-white/5 border border-white/10 text-immersive-muted font-black text-[10px] px-2.5">{reviewedCheckins.length}</Badge></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviewedCheckins.map((checkin) => {
                    const goal = goals.find((g) => g.id === checkin.goalId);
                    if (!goal) return null;
                    const isApproved = checkin.status.toUpperCase() === 'APPROVED';
                    return (
                      <Card key={checkin.id} className={cn("glass-effect border-white/5 border-l-4", isApproved ? "border-l-emerald-500/50" : "border-l-rose-500/50")}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-immersive-text">Check-in for "{goal.title}"</p>
                            <p className="text-[10px] text-immersive-muted font-bold">{goal.ownerName} · {checkin.actualAchievement}/{checkin.plannedTarget} achieved</p>
                          </div>
                          <Badge className={cn("border-none text-[9px] font-black uppercase tracking-widest", isApproved ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                            {checkin.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Rework Dialog */}
      <Dialog open={!!reworkDialog} onOpenChange={() => setReworkDialog(null)}>
        <DialogContent className="sm:max-w-[420px] bg-[#090D16] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-immersive-text">Request Goal Revision</DialogTitle>
            <DialogDescription className="text-xs text-immersive-muted mt-1">Provide helpful calibration guidelines for "{reworkDialog?.title}".</DialogDescription>
          </DialogHeader>
          <textarea className="w-full min-h-[100px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 mt-4" placeholder="Explain what changes are requested..." value={reworkComment} onChange={(e) => setReworkComment(e.target.value)} />
          <DialogFooter className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setReworkDialog(null)} className="border-white/10 text-white hover:bg-white/5 font-bold">Cancel</Button>
            <Button onClick={handleRework} disabled={!reworkComment} className="bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-lg shadow-rose-600/20">Send Revision Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-in Review Feedback Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="sm:max-w-[480px] bg-[#090D16] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-immersive-text">Calibrate Check-in Review</DialogTitle>
            <DialogDescription className="text-xs text-immersive-muted mt-1">Confirm and add constructive feedback comments for "{reviewDialog?.title}".</DialogDescription>
          </DialogHeader>
          
          {reviewDialog && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between mt-4">
              <div>
                <span className="text-[9px] uppercase font-black text-immersive-muted tracking-widest">Calibration Target</span>
                <p className="text-sm font-black text-immersive-text">{reviewDialog.actual} / {reviewDialog.target}</p>
              </div>
              <Badge className={cn("border-none text-[10px] font-black uppercase tracking-widest", reviewStatus === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                {reviewStatus}
              </Badge>
            </div>
          )}

          <textarea className="w-full min-h-[100px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 mt-4" placeholder="Leave review feedback / recommendations..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
          
          <DialogFooter className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setReviewDialog(null)} className="border-white/10 text-white hover:bg-white/5 font-bold">Cancel</Button>
            <Button onClick={handleCheckinReviewSubmit} className={cn("font-bold text-white shadow-lg", reviewStatus === 'APPROVED' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20")}>
              Confirm {reviewStatus}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
