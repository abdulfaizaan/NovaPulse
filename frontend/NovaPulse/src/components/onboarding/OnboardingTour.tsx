/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Step {
  id: string;
  targetId: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: Step[] = [
  {
    id: "step1",
    targetId: "sidebar-navigation",
    title: "Main Navigation",
    content: "Easily navigate between your Dashboard, Goals, Check-ins, and Analytics using this sidebar.",
    position: "right",
  },
  {
    id: "step2",
    targetId: "dashboard-widgets",
    title: "Dashboard Overview",
    content: "Get a high-level view of your performance metrics and active goals at a glance.",
    position: "bottom",
  },
  {
    id: "step3",
    targetId: "create-goal-button",
    title: "Create a Goal",
    content: "Start your journey by setting up a new performance objective for this cycle.",
    position: "bottom",
  },
  {
    id: "step4",
    targetId: "cycle-indicator",
    title: "Quarterly Cycle",
    content: "Stay updated on the active performance cycle and important deadlines.",
    position: "bottom",
  },
];

export function OnboardingTour({ 
  onComplete, 
  startStep = 0 
}: { 
  onComplete: () => void;
  startStep?: number;
}) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(startStep);
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0, height: 0 });

  const currentStep = TOUR_STEPS[currentStepIndex];

  React.useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(currentStep.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={onComplete} />
      
      {/* Highlight Box */}
      <motion.div
        animate={{
          top: coords.top - 8,
          left: coords.left - 8,
          width: coords.width + 16,
          height: coords.height + 16,
        }}
        className="absolute border-2 border-indigo-400 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] bg-white/5 pointer-events-none z-10"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute z-50 pointer-events-auto"
          style={{
            top: currentStep.position === "bottom" ? coords.top + coords.height + 24 : 
                 currentStep.position === "top" ? coords.top - 200 : coords.top + coords.height/2 - 100,
            left: currentStep.position === "right" ? coords.left + coords.width + 24 : 
                  currentStep.position === "left" ? coords.left - TOUR_CARD_WIDTH - 24 : coords.left + coords.width/2 - TOUR_CARD_WIDTH/2,
          }}
        >
          <Card className="w-[320px] shadow-2xl glass-effect border-indigo-500/30 overflow-hidden">
            <CardHeader className="bg-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">{currentStep.title}</CardTitle>
                <Button variant="ghost" size="icon" className="size-6 text-white hover:bg-white/20" onClick={onComplete}>
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              <p className="text-sm text-immersive-text leading-relaxed font-medium">
                {currentStep.content}
              </p>
              <div className="mt-4 flex items-center gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentStepIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-white/10'}`} 
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack} 
                disabled={currentStepIndex === 0}
                className="text-xs font-bold text-immersive-muted hover:text-immersive-text"
              >
                <ChevronLeft className="mr-1 size-3" /> Back
              </Button>
              <Button 
                size="sm" 
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-8 px-4"
              >
                {currentStepIndex === TOUR_STEPS.length - 1 ? (
                  <>Complete <Check className="ml-1 size-3" /></>
                ) : (
                  <>Next <ChevronRight className="ml-1 size-3" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const TOUR_CARD_WIDTH = 320;
