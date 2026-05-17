/**
 * Continuous Feedback — Extended feedback system.
 */

import * as React from "react";
import {
  MessageSquareHeart,
  ThumbsUp,
  Award,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ContinuousFeedback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Continuous Feedback</h2>
          <p className="text-immersive-muted font-medium text-sm">Peer recognition, upward feedback, and 360 reviews.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20">
          <MessageSquareHeart className="mr-2 size-4" /> Give Feedback
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
                <ThumbsUp className="size-4 text-emerald-400" />
                Recent Peer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {[
                    { from: "Jordan Smith", to: "Alex Rivera", badge: "Team Player", text: "Alex's design mockups for the new dashboard were incredibly detailed and made the frontend implementation a breeze!", time: "2h ago" },
                    { from: "Sarah Chen", to: "Mila Kunis", badge: "Innovator", text: "Great job leading the user research sessions this week. The insights directly shaped our Q3 roadmap.", time: "1d ago" },
                  ].map((fb, i) => (
                    <div key={i} className="p-6 hover:bg-white/[0.02] transition-colors">
                       <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                             <Avatar className="size-8 border border-white/10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fb.from}`} />
                                <AvatarFallback>{fb.from.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-xs font-bold text-immersive-text">
                                  {fb.from} <span className="text-immersive-muted font-medium mx-1">recognized</span> {fb.to}
                                </p>
                                <p className="text-[9px] font-bold text-immersive-muted uppercase tracking-widest">{fb.time}</p>
                             </div>
                          </div>
                          <Badge className="bg-indigo-500/10 text-indigo-400 border-none uppercase tracking-widest text-[9px] font-black shadow-none">
                            <Award className="size-3 mr-1" /> {fb.badge}
                          </Badge>
                       </div>
                       <p className="text-sm text-immersive-text/90 italic p-4 bg-white/5 rounded-xl border border-white/5">
                         "{fb.text}"
                       </p>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect border-white/5 bg-indigo-500/5">
             <CardContent className="p-6 text-center space-y-4">
                <div className="size-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                   <Send className="size-8" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white mb-1">Request Feedback</h3>
                   <p className="text-xs text-immersive-muted">Ask your peers or manager for constructive feedback on your recent work.</p>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold">
                   New Request
                </Button>
             </CardContent>
          </Card>

          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">
                My Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors w-20">
                     <div className="size-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                        <Award className="size-5" />
                     </div>
                     <span className="text-[10px] font-bold text-center">MVP x3</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/50 transition-colors w-20">
                     <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <ThumbsUp className="size-5" />
                     </div>
                     <span className="text-[10px] font-bold text-center">Helpful</span>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
