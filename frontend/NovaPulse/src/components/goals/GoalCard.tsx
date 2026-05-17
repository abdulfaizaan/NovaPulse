/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { motion } from "motion/react";
import { 
  Target, 
  Calendar, 
  MoreHorizontal, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Users
} from "lucide-react";
import { Goal } from "@/src/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface GoalCardProps {
  key?: React.Key;
  goal: Goal;
  onClick?: (goal: Goal) => void;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  'not-started': { label: 'Not Started', class: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'on-track': { label: 'On Track', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'completed': { label: 'Completed', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'delayed': { label: 'Delayed', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  'draft': { label: 'Draft', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  'submitted': { label: 'Submitted', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  'under-review': { label: 'Under Review', class: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  'approved': { label: 'Approved', class: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  'locked': { label: 'Locked', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'rework': { label: 'Rework', class: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
};

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const status = statusConfig[goal.status] || statusConfig['not-started'];
  const progressDisplay = statusConfig[goal.progressStatus] || statusConfig['not-started'];
  const progress = goal.progressScore ?? ((goal.target > 0 ? (goal.achievement / goal.target) * 100 : 0));

  const getThrustIcon = (area: string) => {
    if (area.includes('Product')) return <Zap className="size-3" />;
    if (area.includes('Engineering')) return <Layers className="size-3" />;
    if (area.includes('Success') || area.includes('Customer')) return <ShieldCheck className="size-3" />;
    return <Users className="size-3" />;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="group relative overflow-hidden glass-effect border-white/5 transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
        onClick={() => onClick?.(goal)}
      >
        <CardHeader className="p-5 pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("rounded-full font-black text-[9px] uppercase tracking-wider py-0 px-2 h-5 border-white/10", status.class.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-'))}>
                  <div className={cn("size-1 rounded-full mr-1.5 shadow-[0_0_8px_currentColor]", status.class.split(' ')[1].replace('text-', 'bg-'))} />
                  {status.label}
                </Badge>
                {goal.isShared && (
                  <Badge variant="outline" className="rounded-full bg-purple-500/10 text-purple-400 border-purple-500/20 font-black text-[9px] uppercase tracking-wider h-5 flex items-center gap-1">
                    <Users className="size-2.5" />
                    Shared
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-black tracking-tight text-immersive-text group-hover:text-indigo-400 transition-colors">
                {goal.title}
              </h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="size-8 -mr-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5 flex items-center justify-center rounded-md text-immersive-muted outline-none cursor-pointer">
                <MoreHorizontal className="size-4 text-immersive-muted" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border-white/10">
                <DropdownMenuItem className="text-immersive-text focus:bg-white/10">Edit Goal</DropdownMenuItem>
                <DropdownMenuItem className="text-immersive-text focus:bg-white/10">Update Progress</DropdownMenuItem>
                <DropdownMenuItem className="text-rose-400 focus:bg-rose-500/10">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-3 space-y-5">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-immersive-muted bg-white/5 px-2 py-0.5 rounded border border-white/5">
               {getThrustIcon(goal.thrustArea)}
               {goal.thrustArea}
             </div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-immersive-muted tracking-wide">
               <Calendar className="size-3" />
               ENDS {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest font-black text-immersive-muted">Achievement</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-immersive-text">{Math.round(progress)}%</span>
                  <span className="text-[10px] text-immersive-muted font-bold tracking-tight">/ {goal.target} {(goal as any).uomLabel || goal.uom}</span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest font-black text-immersive-muted">Weight</p>
                <span className="text-xs font-black text-indigo-400">{goal.weightage}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
               />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex -space-x-1.5">
              <div className="size-6 rounded-full border border-white/10 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black shadow-lg">AR</div>
              {goal.isShared && (
                <>
                  <div className="size-6 rounded-full border border-white/10 bg-slate-700 flex items-center justify-center text-[10px] text-white font-black">JS</div>
                  <div className="size-6 rounded-full border border-white/10 bg-slate-800 flex items-center justify-center text-[9px] text-slate-400 font-bold">+5</div>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-0 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-transparent hover:text-indigo-300">
              EXPLORE ANALYTICS <ArrowUpRight className="ml-1 size-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
