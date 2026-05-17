/**
 * Goal Dependency Graph — Dependency management visualization.
 *
 * Shows goal blockers, dependency chains, cascading delays, risk indicators.
 */

import * as React from "react";
import {
  Link2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  GitCommit,
  GitBranch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DependencyNode {
  id: string;
  title: string;
  owner: string;
  status: "on-track" | "delayed" | "completed";
  riskLevel: "low" | "medium" | "high";
  delayDays?: number;
  dependsOn?: string[]; // IDs of goals this goal depends on (blockers)
}

const NODES: DependencyNode[] = [
  { id: "g1", title: "Frontend Launch", owner: "Alex", status: "delayed", riskLevel: "high", delayDays: 5, dependsOn: ["g2", "g3"] },
  { id: "g2", title: "Backend API Completion", owner: "Jordan", status: "delayed", riskLevel: "high", delayDays: 14, dependsOn: ["g4"] },
  { id: "g3", title: "Design System Finalization", owner: "Sam", status: "completed", riskLevel: "low", dependsOn: [] },
  { id: "g4", title: "Database Migration", owner: "Taylor", status: "delayed", riskLevel: "medium", delayDays: 2, dependsOn: [] },
];

export function GoalDependencyGraph() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "delayed": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "completed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Dependency Graph</h2>
          <p className="text-immersive-muted font-medium text-sm">Track cascading delays and blocker chains.</p>
        </div>
        <Button variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300">
          <ShieldAlert className="mr-2 size-4" /> Resolve Blockers
        </Button>
      </div>

      <Card className="glass-effect border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <GitBranch className="size-4 text-indigo-400" />
            Active Dependency Chains
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6 relative">
            {/* Visual connector line background */}
            <div className="absolute left-[39px] top-6 bottom-6 w-px bg-white/10 hidden md:block" />

            {NODES.map((node, index) => (
              <div key={node.id} className="relative z-10 flex flex-col md:flex-row gap-4 md:items-center">
                <div className="shrink-0 size-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-black/20 z-10">
                  <GitCommit className="size-8 text-indigo-400" />
                </div>
                
                <div className="flex-1 space-y-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-immersive-text">{node.title}</h4>
                      <p className="text-[10px] text-immersive-muted font-semibold uppercase tracking-wider mt-1">Owner: {node.owner}</p>
                    </div>
                    <Badge className={cn("text-[9px] font-black uppercase tracking-widest border shadow-none", getStatusColor(node.status))}>
                      {node.status}
                    </Badge>
                  </div>

                  {node.dependsOn && node.dependsOn.length > 0 && (
                    <div className="pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Link2 className="size-3 text-immersive-muted" />
                        <span className="text-[10px] font-bold text-immersive-muted uppercase tracking-wider">Blocked by ({node.dependsOn.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {node.dependsOn.map(depId => {
                          const depNode = NODES.find(n => n.id === depId);
                          return depNode ? (
                            <Badge key={depId} variant="outline" className="bg-white/5 border-white/10 text-[10px] text-immersive-text font-medium flex items-center gap-1.5">
                              {depNode.status === 'delayed' && <AlertCircle className="size-3 text-rose-400" />}
                              {depNode.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {node.status === 'delayed' && node.delayDays && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-1 rounded w-fit mt-2">
                      <Clock className="size-3" />
                      DELAYED BY {node.delayDays} DAYS
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
