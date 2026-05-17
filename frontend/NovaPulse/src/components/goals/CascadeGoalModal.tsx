import * as React from "react";
import { Check, ChevronRight, ChevronLeft, Target, Info, BarChart, Send, AlertTriangle, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGoalStore, TEAM_MEMBERS } from "../../stores/goalStore";
import { UOM_OPTIONS, THRUST_AREAS } from "../../types";
import type { UnitOfMeasure } from "../../types";
import { toast } from "sonner";

interface CascadeGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CascadeGoalModal({ open, onOpenChange }: CascadeGoalModalProps) {
  const { createSharedGoal } = useGoalStore();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    thrustArea: "",
    uom: "" as UnitOfMeasure | "",
    target: "",
    deadline: "",
  });

  const [selectedEmployees, setSelectedEmployees] = React.useState<Record<string, { selected: boolean; weightage: string }>>({});

  React.useEffect(() => {
    // Initialize selected employees
    const initial: Record<string, { selected: boolean; weightage: string }> = {};
    TEAM_MEMBERS.forEach((m) => {
      initial[m.id] = { selected: false, weightage: "20" };
    });
    setSelectedEmployees(initial);
  }, []);

  const canProceedStep1 = formData.title.length > 2 && formData.thrustArea !== "";
  const canProceedStep2 = formData.uom !== "" && formData.target !== "" && formData.deadline !== "";
  
  const anyEmployeeSelected = Object.values(selectedEmployees).some((e) => (e as any).selected);
  const selectedCount = Object.values(selectedEmployees).filter((e) => (e as any).selected).length;

  const handleSubmit = async () => {
    const assignments = Object.entries(selectedEmployees)
      .filter(([_, data]) => (data as any).selected)
      .map(([id, data]) => ({
        employeeId: id,
        weightage: Number((data as any).weightage) || 20,
      }));

    if (assignments.length === 0) {
      toast.error("Please select at least one team member to cascade to.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      thrustArea: formData.thrustArea,
      unitOfMeasure: formData.uom,
      targetValue: Number(formData.target),
      dueDate: new Date(formData.deadline).toISOString(),
      assignments,
    };

    await createSharedGoal(payload);
    
    // Reset form
    setFormData({ title: "", description: "", thrustArea: "", uom: "", target: "", deadline: "" });
    const resetEmployees: Record<string, { selected: boolean; weightage: string }> = {};
    TEAM_MEMBERS.forEach((m) => {
      resetEmployees[m.id] = { selected: false, weightage: "20" };
    });
    setSelectedEmployees(resetEmployees);
    setCurrentStep(1);
    onOpenChange(false);
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
            <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Users className="size-6" /> Cascade Shared Goal
            </DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              Distribute key results and objectives to your direct reports instantly.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 bg-[#090D16] text-white min-h-[350px] flex flex-col border-t border-white/10">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6 flex-1">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Goal Title *</Label>
                    <Input placeholder="e.g. Boost Platform Reliability to 99.99%" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</Label>
                    <textarea placeholder="Outline the shared key results, scope, and operational expectations..." className="w-full min-h-[80px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                    <Select value={formData.uom} onValueChange={(val) => setFormData({ ...formData, uom: val as UnitOfMeasure })}>
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
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Select Subordinates & Assign Weightage *</span>
                    <span className="text-indigo-400 font-black">{selectedCount} selected</span>
                  </Label>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {TEAM_MEMBERS.map((member) => {
                      const selection = selectedEmployees[member.id] || { selected: false, weightage: "20" };
                      return (
                        <div key={member.id} className={cn("flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 transition-all", selection.selected && "border-indigo-500/30 bg-indigo-500/5")}>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id={`emp-${member.id}`} checked={selection.selected} onChange={(e) => setSelectedEmployees((prev) => ({
                              ...prev,
                              [member.id]: { ...selection, selected: e.target.checked },
                            }))} className="accent-indigo-600 size-4 cursor-pointer" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{member.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{member.department}</span>
                            </div>
                          </div>
                          {selection.selected && (
                            <div className="flex items-center gap-2">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase">Weight:</Label>
                              <Input type="number" min={10} max={100} className="w-16 h-8 text-xs border-white/10 bg-white/5 text-white" value={selection.weightage} onChange={(e) => setSelectedEmployees((prev) => ({
                                ...prev,
                                [member.id]: { ...selection, weightage: e.target.value },
                              }))} />
                              <span className="text-xs font-bold">%</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between sm:justify-between w-full">
            <Button variant="outline" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : null} disabled={currentStep === 1} className="border-white/10 text-white hover:bg-white/5 font-bold px-6">
              <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2) || (currentStep === 3 && !anyEmployeeSelected)}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-lg shadow-indigo-600/20 text-white">
              {currentStep === 3 ? "Cascade Goal" : "Next Step"} <ChevronRight className="ml-2 size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
