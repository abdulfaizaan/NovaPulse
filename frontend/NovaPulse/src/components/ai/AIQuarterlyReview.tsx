/**
 * AI Quarterly Review — Automated performance summaries.
 */

import * as React from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Edit3,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AIQuarterlyReview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text flex items-center gap-2">
            AI Review Generator <Sparkles className="size-5 text-indigo-400" />
          </h2>
          <p className="text-immersive-muted font-medium text-sm">Auto-generate comprehensive performance summaries.</p>
        </div>
      </div>

      <Card className="glass-effect border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02] relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
              <FileText className="size-4" />
              Generated Review: Q1 2026
            </CardTitle>
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-immersive-text">
                 <Edit3 className="size-3 mr-2" /> Edit
               </Button>
               <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
                 <Download className="size-3 mr-2" /> Export PDF
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 relative z-10 space-y-8">
           <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <Avatar className="size-16 border-2 border-white/10 shadow-xl">
                 <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                 <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div>
                 <h3 className="text-xl font-black text-immersive-text">Alex Rivera</h3>
                 <p className="text-sm font-bold text-immersive-muted uppercase tracking-wider">Product Designer</p>
              </div>
           </div>

           <div className="space-y-6 text-sm text-immersive-text leading-relaxed">
              <div>
                 <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-2">Executive Summary</h4>
                 <p className="p-4 bg-white/5 rounded-xl border border-white/5">
                   Alex has demonstrated exceptional performance during Q1 2026, exceeding onboarding KPIs by 18% and completing 4 out of 5 strategic initiatives ahead of schedule. Their contribution to the Enterprise Design System overhaul significantly accelerated the frontend team's velocity.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-400 mb-2">Key Strengths</h4>
                    <ul className="space-y-2 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                       <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Cross-functional collaboration with engineering.</span>
                       </li>
                       <li className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>Rapid prototyping and iteration speed.</span>
                       </li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-amber-400 mb-2">Areas for Growth</h4>
                    <ul className="space-y-2 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                       <li className="flex items-start gap-2">
                          <div className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>Delegation of routine UI tasks to junior team members.</span>
                       </li>
                       <li className="flex items-start gap-2">
                          <div className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>Participation in external design community events.</span>
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
