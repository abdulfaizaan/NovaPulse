/**
 * 1-on-1 Workspace — Manager/Employee meeting collaboration.
 *
 * Includes agendas, notes, action items, discussion history.
 */

import * as React from "react";
import {
  CalendarDays,
  CheckSquare,
  MessageSquare,
  FileText,
  Clock,
  Plus,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function OneOnOneWorkspace() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border-2 border-white/10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-black tracking-tight text-immersive-text">1-on-1 with Alex Rivera</h2>
            <p className="text-immersive-muted font-medium text-xs">Product Designer · Next meeting: Today, 2:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/10 text-immersive-text hover:bg-white/5">
            <Video className="mr-2 size-4" /> Join Call
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
            <CheckSquare className="mr-2 size-4" /> Wrap Up
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                  <FileText className="size-4 text-indigo-400" />
                  Meeting Agenda
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-indigo-400 font-black">
                  <Plus className="size-3 mr-1" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                "Review Q2 Goal Progress",
                "Discuss design system blockers",
                "Feedback on recent Figma prototypes",
                "Career growth: Senior Designer track"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="mt-0.5 size-4 rounded border border-white/20 flex-shrink-0" />
                  <p className="text-sm font-medium text-immersive-text">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <MessageSquare className="size-4 text-indigo-400" />
                Shared Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <textarea 
                className="w-full h-40 bg-transparent border-none resize-none p-4 text-sm text-immersive-text placeholder:text-immersive-muted/50 focus:ring-0 focus:outline-none"
                placeholder="Start typing notes here. Both of you can see this..."
                defaultValue="Alex mentioned the design system is currently blocked by the new brand guidelines approval."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <CheckSquare className="size-4 text-emerald-400" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 size-3.5 rounded-sm border border-emerald-500/50 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-immersive-text">Follow up with Marketing on brand guidelines</p>
                  <p className="text-[9px] text-immersive-muted mt-0.5 font-bold uppercase">Sarah (Manager)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 size-3.5 rounded-sm border border-emerald-500/50 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-immersive-text">Draft updated component spec</p>
                  <p className="text-[9px] text-immersive-muted mt-0.5 font-bold uppercase">Alex</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-indigo-400 mt-2 h-8">
                <Plus className="mr-2 size-3" /> Add Action Item
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/5">
            <CardHeader className="border-b border-white/5 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-immersive-muted flex items-center gap-2">
                <History className="size-4 text-indigo-400" />
                Past Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { date: "May 10, 2026", label: "Weekly Sync" },
                { date: "May 3, 2026", label: "Weekly Sync" },
                { date: "April 26, 2026", label: "Q1 Review & Q2 Planning" }
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3 text-immersive-muted group-hover:text-indigo-400 transition-colors" />
                    <span className="text-xs font-bold text-immersive-text group-hover:text-indigo-400 transition-colors">{m.date}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-white/10 text-immersive-muted">{m.label}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Ensure History is imported
import { History } from "lucide-react";
