/**
 * Goal Version History — Full version timeline and change comparison.
 */

import * as React from "react";
import {
  History,
  GitCommit,
  ArrowRight,
  RotateCcw,
  User,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HISTORY_DATA = [
  {
    id: "v4",
    date: "Today, 10:30 AM",
    actor: "Alex Rivera",
    action: "Updated Progress",
    changes: [{ field: "Achievement", from: "45%", to: "65%" }],
    isCurrent: true
  },
  {
    id: "v3",
    date: "May 14, 2026, 2:15 PM",
    actor: "Sarah Chen (Manager)",
    action: "Approved Goal",
    changes: [{ field: "Status", from: "Under Review", to: "On Track" }]
  },
  {
    id: "v2",
    date: "May 12, 2026, 11:00 AM",
    actor: "Alex Rivera",
    action: "Edited Description & Target",
    changes: [
      { field: "Target", from: "80%", to: "100%" },
      { field: "Description", from: "Initial draft", to: "Lead the effort to migrate..." }
    ]
  },
  {
    id: "v1",
    date: "May 10, 2026, 9:00 AM",
    actor: "Alex Rivera",
    action: "Created Goal",
    changes: [{ field: "Status", from: "None", to: "Draft" }]
  }
];

export function GoalVersionHistory() {
  return (
    <Card className="glass-effect border-white/5">
      <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <History className="size-4 text-indigo-400" />
            Version History
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-indigo-400 font-black">
            Compare Versions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {HISTORY_DATA.map((entry, idx) => (
            <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#05070a] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <GitCommit className={`size-4 ${entry.isCurrent ? "text-emerald-400" : "text-immersive-muted"}`} />
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-white/5 text-[9px] font-black uppercase tracking-widest border-none px-2 h-4">
                    {entry.action}
                  </Badge>
                  {entry.isCurrent && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 text-[9px] border-none">Current</Badge>
                  )}
                </div>
                
                <div className="space-y-2 mt-3">
                  {entry.changes.map((change, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium bg-black/20 p-2 rounded">
                      <span className="text-immersive-muted w-20 truncate">{change.field}:</span>
                      <span className="text-rose-400 line-through truncate max-w-[80px]">{change.from}</span>
                      <ArrowRight className="size-3 text-immersive-muted shrink-0" />
                      <span className="text-emerald-400 truncate max-w-[100px]">{change.to}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[10px] text-immersive-muted font-bold">
                  <div className="flex items-center gap-1">
                    <User className="size-3" />
                    {entry.actor}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {entry.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
