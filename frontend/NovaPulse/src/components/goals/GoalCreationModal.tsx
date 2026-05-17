/**
 * GoalCreationModal — BRD-compliant goal creation wizard
 * Enforces: UoM types, min 10% weightage, max 8 goals, total 100%
 */
import * as React from "react";
import { Check, ChevronRight, ChevronLeft, Target, Info, BarChart, Send, AlertTriangle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGoalStore } from "../../stores/goalStore";
import { useAuth } from "../../context/AuthContext";
import { UOM_OPTIONS, THRUST_AREAS } from "../../types";
import type { UnitOfMeasure, GoalProgressStatus } from "../../types";
import { toast } from "sonner";

interface GoalCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const steps = [
  { id: 1, title: "Basic Info", icon: Info },
  { id: 2, title: "Metrics", icon: BarChart },
  { id: 3, title: "Review", icon: Check },
];

export function GoalCreationModal({ open, onOpenChange, onSubmit }: GoalCreationModalProps) {
  const { user } = useAuth();
  const { goals, addGoal, submitGoal } = useGoalStore();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    title: "", description: "", thrustArea: "",
    uom: "" as UnitOfMeasure | "", uomLabel: "",
    target: "", weightage: "", deadline: "",
  });

  // Calculate real weightage from store
  const myGoals = goals.filter((g) => g.ownerId === user?.id && g.status !== 'rework');
  const currentWeightage = myGoals.reduce((sum, g) => sum + g.weightage, 0);
  const newWeightage = Number(formData.weightage) || 0;
  const totalWeightage = currentWeightage + newWeightage;

  // Validation
  const isWeightageValid = totalWeightage <= 100;
  const isMinWeightage = newWeightage >= 10;
  const isMaxGoals = myGoals.length < 8;
  const canProceedStep1 = formData.title.length > 2 && formData.thrustArea !== "";
  const canProceedStep2 = formData.uom !== "" && formData.target !== "" && formData.weightage !== "" && formData.deadline !== "" && isWeightageValid && isMinWeightage;

  const handleSubmit = () => {
    if (!user || !formData.uom) return;
    if (!isMaxGoals) { toast.error("Maximum 8 goals allowed"); return; }
    if (!isWeightageValid) { toast.error("Total weightage exceeds 100%"); return; }
    if (!isMinWeightage) { toast.error("Minimum weightage per goal is 10%"); return; }

    const goal = addGoal({
      title: formData.title, description: formData.description, thrustArea: formData.thrustArea,
      uom: formData.uom as UnitOfMeasure, uomLabel: formData.uomLabel || formData.uom,
      target: Number(formData.target), achievement: 0, weightage: newWeightage,
      status: 'draft', progressStatus: 'not-started' as GoalProgressStatus, deadline: formData.deadline,
      ownerId: user.id, ownerName: user.name, lockedAt: null,
    });

    toast.success("Goal created!", { description: `"${goal.title}" saved as draft. Submit when ready.` });
    setFormData({ title: "", description: "", thrustArea: "", uom: "", uomLabel: "", target: "", weightage: "", deadline: "" });
    setCurrentStep(1);
    onOpenChange(false);
    onSubmit?.(goal);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="size-32" /></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-black tracking-tight text-white">Create New Goal</DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              {myGoals.length}/8 goals created · {currentWeightage}% weightage allocated
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-8 relative z-10">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn("size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300", currentStep >= step.id ? "bg-white text-indigo-600 shadow-lg" : "bg-indigo-500 text-indigo-200")}>
                    {currentStep > step.id ? <Check className="size-4" /> : step.id}
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors", currentStep >= step.id ? "text-white" : "text-indigo-300")}>{step.title}</span>
                </div>
                {idx < steps.length - 1 && <div className={cn("h-px w-12 -mt-6 transition-colors duration-300", currentStep > step.id ? "bg-white" : "bg-indigo-500")} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-8 bg-[#090D16] text-white min-h-[350px] flex flex-col border-t border-white/10">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6 flex-1">
              {currentStep === 1 && (
                <div className="space-y-4">
                  {!isMaxGoals && (
                    <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-3 flex items-center gap-2 text-rose-400 text-sm font-bold">
                      <AlertTriangle className="size-4" /> Maximum 8 goals reached. Delete an existing goal first.
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Goal Title *</Label>
                    <Input placeholder="e.g. Expand Market Share in APAC" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</Label>
                    <textarea placeholder="Specify key objectives and milestones..." className="w-full min-h-[80px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Thrust Area *</Label>
                    <Select value={formData.thrustArea} onValueChange={(val) => setFormData({ ...formData, thrustArea: val })}>
                      <SelectTrigger className="w-full border-white/10 bg-white/5 text-white"><SelectValue placeholder="Select Organizational Pillar" /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white w-[var(--anchor-width)]">
                        {THRUST_AREAS.map((area) => <SelectItem key={area} value={area} className="focus:bg-indigo-600 focus:text-white py-2 px-3">{area}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Unit of Measurement *</Label>
                    <Select value={formData.uom} onValueChange={(val) => {
                      const opt = UOM_OPTIONS.find((o) => o.value === val);
                      setFormData({ ...formData, uom: val as UnitOfMeasure, uomLabel: opt?.description || val });
                    }}>
                      <SelectTrigger className="w-full border-white/10 bg-white/5 text-white"><SelectValue placeholder="Select UoM Type" /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white w-[var(--anchor-width)]">
                        {UOM_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="focus:bg-indigo-600 focus:text-white py-2 px-3">
                            <div className="flex flex-col gap-0.5"><span className="font-bold">{opt.label}</span><span className="text-[10px] text-slate-400">{opt.description}</span></div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Value *</Label>
                      <Input type="number" placeholder="100" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Deadline *</Label>
                      <Input type="date" className="border-white/10 bg-white/5 text-white dark:color-scheme-dark" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Weightage (%) * — Min 10%, Available: {100 - currentWeightage}%</Label>
                    <Input type="number" min={10} max={100 - currentWeightage} placeholder={`Min 10%, Max ${100 - currentWeightage}%`}
                      className={cn("border-white/10 bg-white/5 text-white placeholder:text-slate-500", (!isWeightageValid || !isMinWeightage) && formData.weightage && "border-rose-500/50 focus-visible:ring-rose-500")}
                      value={formData.weightage} onChange={(e) => setFormData({ ...formData, weightage: e.target.value })} />
                    {formData.weightage && !isMinWeightage && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1"><AlertTriangle className="size-3" /> Minimum weightage per goal is 10%</p>}
                    {formData.weightage && !isWeightageValid && <p className="text-[10px] font-bold text-rose-400 flex items-center gap-1"><AlertTriangle className="size-3" /> Total weightage would be {totalWeightage}% (max 100%)</p>}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-xl border-dashed border border-white/10">
                    <h4 className="font-black text-white mb-1">{formData.title || "No Title"}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2">{formData.description || "No description"}</p>
                    <div className="flex gap-4 mt-4 flex-wrap">
                      <div className="space-y-0.5"><span className="text-[10px] uppercase font-bold text-slate-500">Target</span><p className="text-sm font-bold text-white">{formData.target}</p></div>
                      <Separator orientation="vertical" className="h-8 bg-white/10" />
                      <div className="space-y-0.5"><span className="text-[10px] uppercase font-bold text-slate-500">Weight</span><p className="text-sm font-bold text-white">{formData.weightage}%</p></div>
                      <Separator orientation="vertical" className="h-8 bg-white/10" />
                      <div className="space-y-0.5"><span className="text-[10px] uppercase font-bold text-slate-500">UoM</span><p className="text-sm font-bold text-white">{UOM_OPTIONS.find(o => o.value === formData.uom)?.label || '—'}</p></div>
                      <Separator orientation="vertical" className="h-8 bg-white/10" />
                      <div className="space-y-0.5"><span className="text-[10px] uppercase font-bold text-slate-500">Thrust Area</span><p className="text-sm font-bold text-white">{formData.thrustArea}</p></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 text-center bg-indigo-500/10 rounded-2xl border-indigo-500/20 border">
                    <div className="size-14 bg-white/5 rounded-full flex items-center justify-center mb-3 shadow-sm"><Send className="size-7 text-indigo-400" /></div>
                    <h5 className="font-bold text-indigo-200">Ready to Create?</h5>
                    <p className="text-xs text-indigo-300 mt-1 max-w-[240px]">Goal will be saved as draft. Submit it when you're ready for manager review.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between sm:justify-between w-full">
            <Button variant="outline" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : null} disabled={currentStep === 1} className="border-white/10 text-white hover:bg-white/5 font-bold px-6">
              <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2) || !isMaxGoals}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-lg shadow-indigo-600/20 text-white">
              {currentStep === 3 ? "Create Goal" : "Next Step"} <ChevronRight className="ml-2 size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
