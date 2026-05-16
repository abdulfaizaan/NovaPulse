/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  Info, 
  BarChart, 
  Send,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface GoalCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const steps = [
  { id: 1, title: "Basic Info", icon: Info },
  { id: 2, title: "Metrics", icon: BarChart },
  { id: 3, title: "Review", icon: Check },
];

export function GoalCreationModal({ open, onOpenChange, onSubmit }: GoalCreationModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    thrustArea: "",
    uom: "",
    target: "",
    weightage: "",
  });

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const totalWeightage = 85; // Mock existing weightage
  const newWeightage = Number(formData.weightage) || 0;
  const isWeightageValid = (totalWeightage + newWeightage) <= 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Target className="size-32" />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-black tracking-tight text-white">Create New Goal</DialogTitle>
            <DialogDescription className="text-indigo-100 font-medium">
              Define your objectives and key performance indicators for the current cycle.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-8 relative z-10">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    currentStep >= step.id ? "bg-white text-indigo-600 shadow-lg" : "bg-indigo-500 text-indigo-200"
                  )}>
                    {currentStep > step.id ? <Check className="size-4" /> : step.id}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    currentStep >= step.id ? "text-white" : "text-indigo-300"
                  )}>{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "h-px w-12 -mt-6 transition-colors duration-300",
                    currentStep > step.id ? "bg-white" : "bg-indigo-500"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-8 bg-white min-h-[350px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 flex-1"
            >
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Goal Title</Label>
                    <Input 
                      placeholder="e.g. Expand Market Share in APAC" 
                      className="border-2 focus-visible:ring-indigo-600"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</Label>
                    <textarea 
                      placeholder="Specify key objectives and milestones..." 
                      className="w-full min-h-[100px] rounded-md border-2 border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Thrust Area</Label>
                    <Select value={formData.thrustArea} onValueChange={(val) => setFormData({ ...formData, thrustArea: val })}>
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Select Organizational Pillars" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product Excellence</SelectItem>
                        <SelectItem value="engineering">Engineering Quality</SelectItem>
                        <SelectItem value="customer">Customer Success</SelectItem>
                        <SelectItem value="growth">Strategic Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Unit of Measure</Label>
                        <Input 
                          placeholder="%, USD, Count, etc." 
                          className="border-2"
                          value={formData.uom}
                          onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Value</Label>
                        <Input 
                          type="number"
                          placeholder="100" 
                          className="border-2"
                          value={formData.target}
                          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Weightage (%)</Label>
                    <Input 
                      type="number"
                      placeholder="Min 10%, Max 100%" 
                      className={cn("border-2", !isWeightageValid && "border-rose-300 focus-visible:ring-rose-500")}
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                    />
                    {!isWeightageValid && (
                      <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        Total weightage cannot exceed 100% (Current: {totalWeightage + newWeightage}%)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border-dashed border-2 border-slate-200">
                    <h4 className="font-black text-slate-900 mb-1">{formData.title || "No Title Set"}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{formData.description || "No description provided."}</p>
                    <div className="flex gap-4 mt-4">
                       <div className="space-y-0.5">
                         <span className="text-[10px] uppercase font-bold text-slate-400">Target</span>
                         <p className="text-sm font-bold">{formData.target} {formData.uom}</p>
                       </div>
                       <Separator orientation="vertical" className="h-8" />
                       <div className="space-y-0.5">
                         <span className="text-[10px] uppercase font-bold text-slate-400">Weight</span>
                         <p className="text-sm font-bold">{formData.weightage}%</p>
                       </div>
                       <Separator orientation="vertical" className="h-8" />
                       <div className="space-y-0.5">
                         <span className="text-[10px] uppercase font-bold text-slate-400">Area</span>
                         <p className="text-sm font-bold capitalize">{formData.thrustArea}</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-indigo-50/50 rounded-2xl border-indigo-100 border">
                    <div className="size-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <Send className="size-8 text-indigo-600" />
                    </div>
                    <h5 className="font-bold text-indigo-900">Ready to Submit?</h5>
                    <p className="text-xs text-indigo-600 mt-1 max-w-[200px]">Once submitted, your manager will be notified to review this goal.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter className="mt-8 pt-6 border-t flex items-center justify-between sm:justify-between w-full">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-2 font-bold px-6"
            >
              <ChevronLeft className="mr-2 size-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={(currentStep === 2 && (!isWeightageValid || !formData.weightage)) || (currentStep === 1 && !formData.title)}
              className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-lg shadow-indigo-600/20"
            >
              {currentStep === 3 ? "Submit Goal" : "Next Step"}
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
