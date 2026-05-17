/**
 * Organizational Alignment Tree — Interactive hierarchy visualization.
 *
 * Shows Company Goal → Department KPI → Team Objective → Employee Goal
 * with progress indicators, animated connections, and alignment heatmap.
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  User,
  Target,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/* ── Alignment Data ─────────────────────────────── */
interface AlignmentNode {
  id: string;
  title: string;
  level: "company" | "department" | "team" | "employee";
  progress: number;
  status: "on-track" | "at-risk" | "behind" | "completed";
  owner?: string;
  weight?: number;
  children?: AlignmentNode[];
}

const ALIGNMENT_DATA: AlignmentNode = {
  id: "c1",
  title: "Accelerate Enterprise ARR to $50M",
  level: "company",
  progress: 62,
  status: "on-track",
  children: [
    {
      id: "d1",
      title: "Product Excellence & Innovation",
      level: "department",
      progress: 71,
      status: "on-track",
      children: [
        {
          id: "t1",
          title: "Platform Reliability ≥ 99.95%",
          level: "team",
          progress: 88,
          status: "on-track",
          owner: "Engineering",
          children: [
            { id: "e1", title: "Implement circuit breakers", level: "employee", progress: 100, status: "completed", owner: "Alex Rivera", weight: 30 },
            { id: "e2", title: "Reduce P95 latency to <200ms", level: "employee", progress: 75, status: "on-track", owner: "Jordan Smith", weight: 25 },
            { id: "e3", title: "Zero-downtime deployment pipeline", level: "employee", progress: 60, status: "at-risk", owner: "Mila Kunis", weight: 20 },
          ],
        },
        {
          id: "t2",
          title: "Launch AI Features Suite",
          level: "team",
          progress: 45,
          status: "at-risk",
          owner: "AI/ML Team",
          children: [
            { id: "e4", title: "Smart goal generation model", level: "employee", progress: 55, status: "at-risk", owner: "Oscar Wilde", weight: 35 },
            { id: "e5", title: "Performance prediction engine", level: "employee", progress: 30, status: "behind", owner: "Nina Patel", weight: 30 },
          ],
        },
      ],
    },
    {
      id: "d2",
      title: "Customer Acquisition & Growth",
      level: "department",
      progress: 58,
      status: "at-risk",
      children: [
        {
          id: "t3",
          title: "Enterprise Pipeline $25M",
          level: "team",
          progress: 65,
          status: "on-track",
          owner: "Sales",
          children: [
            { id: "e6", title: "Close 3 enterprise deals", level: "employee", progress: 66, status: "on-track", owner: "Chris Lee", weight: 40 },
            { id: "e7", title: "Build partner channel", level: "employee", progress: 40, status: "at-risk", owner: "Dana Kim", weight: 25 },
          ],
        },
        {
          id: "t4",
          title: "Reduce churn to <5%",
          level: "team",
          progress: 42,
          status: "behind",
          owner: "Customer Success",
          children: [
            { id: "e8", title: "Implement health scoring", level: "employee", progress: 50, status: "at-risk", owner: "Sam Wright", weight: 30 },
            { id: "e9", title: "Proactive renewal workflow", level: "employee", progress: 25, status: "behind", owner: "Tara Jones", weight: 35 },
          ],
        },
      ],
    },
    {
      id: "d3",
      title: "People & Culture Excellence",
      level: "department",
      progress: 78,
      status: "on-track",
      children: [
        {
          id: "t5",
          title: "Employee Engagement ≥ 85%",
          level: "team",
          progress: 82,
          status: "on-track",
          owner: "HR",
          children: [
            { id: "e10", title: "Launch pulse survey program", level: "employee", progress: 90, status: "on-track", owner: "Raj Mehta", weight: 25 },
            { id: "e11", title: "Manager training program", level: "employee", progress: 70, status: "on-track", owner: "Lisa Park", weight: 20 },
          ],
        },
      ],
    },
  ],
};

/* ── Status colors ─────────────────────────────── */
const statusColors = {
  "on-track": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10", bar: "from-emerald-500 to-teal-400" },
  "at-risk": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10", bar: "from-amber-500 to-orange-400" },
  "behind": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "shadow-rose-500/10", bar: "from-rose-500 to-red-400" },
  "completed": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/10", bar: "from-blue-500 to-indigo-400" },
};

const levelIcons = {
  company: Building2,
  department: Layers,
  team: Users,
  employee: User,
};

const levelLabels = {
  company: "Company Objective",
  department: "Department KPI",
  team: "Team Objective",
  employee: "Individual Goal",
};

/* ── Tree Node ─────────────────────────────── */
function TreeNode({ node, depth = 0 }: { node: AlignmentNode; depth?: number; key?: React.Key }) {
  const [expanded, setExpanded] = React.useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const colors = statusColors[node.status];
  const Icon = levelIcons[node.level];

  return (
    <div className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 w-6 h-full pointer-events-none">
          <div className="absolute left-3 top-0 w-px h-5 bg-white/10" />
          <div className="absolute left-3 top-5 w-3 h-px bg-white/10" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05, duration: 0.3 }}
        className={cn("ml-6", depth === 0 && "ml-0")}
      >
        <div
          className={cn(
            "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
            "hover:bg-white/5 border border-transparent",
            expanded && hasChildren && "bg-white/[0.02] border-white/5"
          )}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {/* Expand icon */}
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            {hasChildren ? (
              expanded ? (
                <ChevronDown className="size-4 text-immersive-muted" />
              ) : (
                <ChevronRight className="size-4 text-immersive-muted" />
              )
            ) : (
              <div className="size-1.5 rounded-full bg-white/20" />
            )}
          </div>

          {/* Level icon */}
          <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", colors.bg, colors.border, "border")}>
            <Icon className={cn("size-4", colors.text)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-sm font-bold truncate text-immersive-text group-hover:text-white transition-colors",
                node.level === "company" && "text-base"
              )}>
                {node.title}
              </span>
              <Badge className={cn("shrink-0 text-[8px] font-black uppercase tracking-widest h-4 px-1.5 border-none", colors.bg, colors.text)}>
                {node.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold text-immersive-muted uppercase tracking-wider">
                {levelLabels[node.level]}
              </span>
              {node.owner && (
                <span className="text-[10px] text-indigo-400 font-semibold">
                  {node.owner}
                </span>
              )}
              {node.weight && (
                <span className="text-[10px] text-immersive-muted font-bold">
                  W: {node.weight}%
                </span>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-24 hidden sm:block">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full bg-gradient-to-r rounded-full", colors.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${node.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <span className={cn("text-sm font-black tabular-nums w-10 text-right", colors.text)}>
              {node.progress}%
            </span>
          </div>
        </div>

        {/* Children */}
        <AnimatePresence>
          {expanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-4 border-l border-white/5 ml-5"
            >
              {node.children!.map((child) => (
                <TreeNode key={child.id} node={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ── Heatmap Grid ─────────────────────────────── */
function AlignmentHeatmap() {
  const departments = [
    { name: "Engineering", goals: 12, onTrack: 8, atRisk: 3, behind: 1, score: 85 },
    { name: "Product", goals: 8, onTrack: 5, atRisk: 2, behind: 1, score: 72 },
    { name: "Sales", goals: 10, onTrack: 7, atRisk: 2, behind: 1, score: 78 },
    { name: "Customer Success", goals: 6, onTrack: 2, atRisk: 2, behind: 2, score: 52 },
    { name: "HR", goals: 5, onTrack: 4, atRisk: 1, behind: 0, score: 88 },
    { name: "Marketing", goals: 7, onTrack: 4, atRisk: 2, behind: 1, score: 68 },
  ];

  const getHeatColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
    if (score >= 60) return "bg-amber-500/20 border-amber-500/30 text-amber-400";
    return "bg-rose-500/20 border-rose-500/30 text-rose-400";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {departments.map((dept, idx) => (
        <motion.div
          key={dept.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className={cn(
            "p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
            getHeatColor(dept.score)
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider">{dept.name}</span>
            <span className="text-lg font-black">{dept.score}</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex-1 h-1 bg-emerald-500/40 rounded-full" style={{ flex: dept.onTrack }} />
            <div className="flex-1 h-1 bg-amber-500/40 rounded-full" style={{ flex: dept.atRisk }} />
            <div className="flex-1 h-1 bg-rose-500/40 rounded-full" style={{ flex: dept.behind }} />
          </div>
          <div className="flex items-center gap-2 mt-2 text-[9px] font-bold uppercase tracking-wider opacity-70">
            <span>{dept.goals} goals</span>
            <span>·</span>
            <span>{dept.onTrack} on track</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export function AlignmentTree() {
  const [viewMode, setViewMode] = React.useState<"tree" | "heatmap">("tree");

  const stats = [
    { label: "Total Goals", value: "1,204", icon: Target, color: "text-indigo-400" },
    { label: "Avg Alignment", value: "76%", icon: TrendingUp, color: "text-emerald-400" },
    { label: "At Risk", value: "18", icon: AlertTriangle, color: "text-amber-400" },
    { label: "Completed", value: "342", icon: CheckCircle2, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">
            Organizational Alignment
          </h1>
          <p className="text-immersive-muted font-medium">
            Strategic goal cascade from company vision to individual objectives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-4 text-xs font-bold rounded-md",
                viewMode === "tree" ? "bg-white/10 text-indigo-400" : "text-immersive-muted"
              )}
              onClick={() => setViewMode("tree")}
            >
              <Layers className="size-3.5 mr-1.5" /> Tree
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-4 text-xs font-bold rounded-md",
                viewMode === "heatmap" ? "bg-white/10 text-indigo-400" : "text-immersive-muted"
              )}
              onClick={() => setViewMode("heatmap")}
            >
              <Eye className="size-3.5 mr-1.5" /> Heatmap
            </Button>
          </div>
          <Button variant="outline" size="icon" className="size-9 border-white/10 hover:bg-white/5 text-immersive-text">
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-effect border-white/5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <stat.icon className={cn("size-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-immersive-text">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tree / Heatmap View */}
      <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02]">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
            <Building2 className="size-4 text-indigo-400" />
            {viewMode === "tree" ? "Goal Cascade Hierarchy" : "Department Alignment Heatmap"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {viewMode === "tree" ? (
              <motion.div
                key="tree"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TreeNode node={ALIGNMENT_DATA} />
              </motion.div>
            ) : (
              <motion.div
                key="heatmap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlignmentHeatmap />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
