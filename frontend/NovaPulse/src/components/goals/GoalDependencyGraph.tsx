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
  Plus,
  X,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGoalStore } from "../../stores/goalStore";
import { toast } from "sonner";

export function GoalDependencyGraph() {
  const { goals } = useGoalStore();
  
  // Local state to manage dependencies dynamically
  const [dependencies, setDependencies] = React.useState<Record<string, string[]>>({});
  const [showAddBlockerFor, setShowAddBlockerFor] = React.useState<string | null>(null);

  // Initialize realistic default dependencies based on seeded goals if present
  React.useEffect(() => {
    if (Object.keys(dependencies).length === 0 && goals.length > 0) {
      const initialDeps: Record<string, string[]> = {};
      
      // Default links:
      // g1 is blocked by g2 and g3
      // g2 is blocked by g4 (or g5 if present)
      goals.forEach(goal => {
        if (goal.id === 'g1' && goals.some(g => g.id === 'g2') && goals.some(g => g.id === 'g3')) {
          initialDeps[goal.id] = ['g2', 'g3'];
        }
        if (goal.id === 'g2' && goals.some(g => g.id === 'g4')) {
          initialDeps[goal.id] = ['g4'];
        }
      });
      
      setDependencies(initialDeps);
    }
  }, [goals]);

  const handleAddBlocker = (goalId: string, blockerId: string) => {
    if (goalId === blockerId) {
      toast.error("A goal cannot block itself.");
      return;
    }
    
    // Check for circular dependency
    const wouldBeCircular = checkIsCircular(blockerId, goalId);
    if (wouldBeCircular) {
      toast.error("Circular dependency detected! This chain would block both goals permanently.");
      return;
    }

    setDependencies(prev => {
      const current = prev[goalId] || [];
      if (current.includes(blockerId)) return prev;
      return {
        ...prev,
        [goalId]: [...current, blockerId]
      };
    });
    
    setShowAddBlockerFor(null);
    toast.success("Goal blocker chain established successfully.");
  };

  const handleRemoveBlocker = (goalId: string, blockerId: string) => {
    setDependencies(prev => {
      const current = prev[goalId] || [];
      const updated = current.filter(id => id !== blockerId);
      const next = { ...prev };
      if (updated.length === 0) {
        delete next[goalId];
      } else {
        next[goalId] = updated;
      }
      return next;
    });
    toast.success("Blocker resolved and dependency chain updated.");
  };

  const handleResolveAllBlockers = () => {
    setDependencies({});
    toast.success("All dependency chains solved!", {
      description: "Platform calibration successfully restored to 100% On-Track."
    });
  };

  // Helper to detect circular dependencies
  const checkIsCircular = (startId: string, targetId: string): boolean => {
    const visited = new Set<string>();
    const dfs = (currId: string): boolean => {
      if (currId === targetId) return true;
      if (visited.has(currId)) return false;
      visited.add(currId);
      const nextBlockers = dependencies[currId] || [];
      for (const nextId of nextBlockers) {
        if (dfs(nextId)) return true;
      }
      return false;
    };
    return dfs(startId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "delayed": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "completed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  // Build dynamic nodes from live goals list
  const nodes = React.useMemo(() => {
    return goals.map(goal => {
      const dependsOn = dependencies[goal.id] || [];
      
      // Determine progress status dynamically
      // If blocked by any delayed or uncompleted goal, status is delayed
      let status: "on-track" | "delayed" | "completed" = goal.progressStatus === 'completed' ? 'completed' : 'on-track';
      
      if (dependsOn.length > 0) {
        // If there are active blockers, progress is delayed
        status = "delayed";
      }

      // Calculate dynamic risk level
      const riskLevel: "low" | "medium" | "high" = dependsOn.length > 1 ? "high" : dependsOn.length === 1 ? "medium" : "low";
      const delayDays = dependsOn.length > 0 ? dependsOn.length * 6 : undefined;

      return {
        id: goal.id,
        title: goal.title,
        owner: goal.ownerName || "Unassigned",
        status,
        riskLevel,
        delayDays,
        dependsOn
      };
    });
  }, [goals, dependencies]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-immersive-text">Dependency Graph</h2>
          <p className="text-immersive-muted font-medium text-sm">Track cascading delays and blocker chains across all active goals.</p>
        </div>
        {Object.keys(dependencies).length > 0 && (
          <Button 
            onClick={handleResolveAllBlockers}
            variant="outline" 
            className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-bold"
          >
            <ShieldAlert className="mr-2 size-4" /> Resolve All Blockers
          </Button>
        )}
      </div>

      <Card className="glass-effect border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <GitBranch className="size-4 text-indigo-400" />
            Active Dependency Chains ({nodes.length} Goals Monitored)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
              <div className="size-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <GitCommit className="size-6" />
              </div>
              <h4 className="text-sm font-black text-immersive-text">No Goals Logged</h4>
              <p className="text-xs text-immersive-muted max-w-[280px] mt-1 font-medium">Create goals in your profile dashboard first to map active blocker structures.</p>
            </div>
          ) : (
            <div className="space-y-6 relative">
              {/* Visual connector line background */}
              <div className="absolute left-[39px] top-6 bottom-6 w-px bg-white/10 hidden md:block" />

              {nodes.map((node, index) => (
                <div key={node.id} className="relative z-10 flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="shrink-0 size-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-black/20 z-10">
                    <GitCommit className={cn("size-8", node.status === 'delayed' ? 'text-rose-400 animate-pulse' : 'text-indigo-400')} />
                  </div>
                  
                  <div className="flex-1 space-y-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-immersive-text">{node.title}</h4>
                        <p className="text-[10px] text-immersive-muted font-semibold uppercase tracking-wider">Owner: {node.owner}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-[9px] font-black uppercase tracking-widest border shadow-none px-2 h-5 rounded", getStatusColor(node.status))}>
                          {node.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowAddBlockerFor(showAddBlockerFor === node.id ? null : node.id)}
                          className="h-6 w-6 p-0 rounded-full bg-white/5 hover:bg-white/10 text-immersive-text"
                          title="Add Blocker Link"
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Inline Dropdown/Select to Add Blocker */}
                    {showAddBlockerFor === node.id && (
                      <div className="p-3 mt-2 rounded-lg border border-indigo-500/20 bg-indigo-950/20 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-300 mb-2">Select Blocker Goal</p>
                        <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto pr-1">
                          {nodes
                            .filter(n => n.id !== node.id && !node.dependsOn.includes(n.id))
                            .map(n => (
                              <button
                                key={n.id}
                                onClick={() => handleAddBlocker(node.id, n.id)}
                                className="w-full text-left px-3 py-1.5 rounded text-xs font-bold text-immersive-text hover:bg-white/5 transition-colors flex items-center justify-between"
                              >
                                <span>{n.title}</span>
                                <Badge className="text-[8px] uppercase tracking-widest ml-2 bg-indigo-500/10 text-indigo-400 border-none px-1.5 h-4">
                                  {n.owner}
                                </Badge>
                              </button>
                            ))}
                          {nodes.filter(n => n.id !== node.id && !node.dependsOn.includes(n.id)).length === 0 && (
                            <p className="text-[10px] text-immersive-muted font-bold italic py-1">No other target goals available.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Blocked By Listing */}
                    {node.dependsOn.length > 0 && (
                      <div className="pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Link2 className="size-3 text-rose-400" />
                          <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Blocked by ({node.dependsOn.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {node.dependsOn.map(depId => {
                            const depNode = nodes.find(n => n.id === depId);
                            return depNode ? (
                              <Badge key={depId} variant="outline" className="bg-rose-500/5 border-rose-500/10 text-[10px] text-immersive-text font-medium flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded">
                                <AlertCircle className="size-3 text-rose-400 shrink-0" />
                                <span className="truncate max-w-[200px]">{depNode.title}</span>
                                <button 
                                  onClick={() => handleRemoveBlocker(node.id, depId)}
                                  className="ml-1.5 p-0.5 rounded-full hover:bg-rose-500/20 text-immersive-muted hover:text-rose-300 transition-colors"
                                  title="Resolve blocker linkage"
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {node.status === 'delayed' && node.delayDays && (
                      <div className="flex items-center gap-2 text-[9px] font-black text-rose-400 bg-rose-500/10 px-2 py-1 rounded w-fit mt-2 uppercase tracking-widest shadow-inner shadow-rose-950/20">
                        <Clock className="size-3" />
                        DELAYED BY {node.delayDays} DAYS (CASCADING RISK)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
