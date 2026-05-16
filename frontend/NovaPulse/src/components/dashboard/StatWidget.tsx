/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "purple";
  className?: string;
}

const colorMap = {
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
};

export function StatWidget({ title, value, description, icon: Icon, trend, color = "indigo", className }: StatWidgetProps) {
  return (
    <Card className={cn("overflow-hidden glass-effect border-white/5 shadow-2xl", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">{title}</p>
            <h3 className="text-3xl font-black tracking-tight text-immersive-text">{value}</h3>
            {description && <p className="text-[10px] text-immersive-muted font-bold uppercase tracking-wider">{description}</p>}
          </div>
          <div className={cn("p-2.5 rounded-2xl border transition-all duration-500", colorMap[color])}>
            <Icon className="size-6" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-1.5">
            <div className={cn(
              "flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
              trend.isPositive ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-rose-500/10 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
            )}>
              {trend.isPositive ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
              {trend.value}%
            </div>
            <span className="text-[9px] uppercase font-black text-immersive-muted tracking-[0.15em]">vs baseline</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
