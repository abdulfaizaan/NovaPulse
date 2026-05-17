import { motion } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Brain,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIInsight {
  id: string;
  type: "coaching" | "risk" | "recommendation" | "summary";
  title: string;
  message: string;
  actionLabel?: string;
}

const EMPLOYEE_INSIGHTS: AIInsight[] = [
  {
    id: "i1",
    type: "coaching",
    title: "Momentum Building",
    message:
      "Your 'Design System Migration' goal is at 65% — you're on pace to finish 2 weeks early. Consider raising the target to 110% to push for stretch impact.",
    actionLabel: "View Goal",
  },
  {
    id: "i2",
    type: "risk",
    title: "Deadline Risk Detected",
    message:
      "Accessibility Audit (25%) is significantly behind schedule with the deadline passed. Request a timeline extension or escalate blockers.",
    actionLabel: "Take Action",
  },
  {
    id: "i3",
    type: "recommendation",
    title: "Weightage Optimization",
    message:
      "Your goals are weighted 30/20/25/25. Consider shifting 5% from Mentorship to Accessibility to reflect its critical status.",
  },
];

const MANAGER_INSIGHTS: AIInsight[] = [
  {
    id: "m1",
    type: "summary",
    title: "Team Q2 Summary",
    message:
      "Your team of 5 is averaging 72% goal completion. 2 members are ahead of schedule, 1 is at risk. Overall team health: Strong.",
    actionLabel: "View Details",
  },
  {
    id: "m2",
    type: "risk",
    title: "Burnout Risk — David Kim",
    message:
      "David has 7 active goals (max recommended: 5) and hasn't taken PTO in 6 weeks. Consider redistributing workload.",
    actionLabel: "Review Workload",
  },
  {
    id: "m3",
    type: "recommendation",
    title: "Approval Queue",
    message:
      "3 goals have been pending your approval for 5+ days. Timely reviews improve team morale and velocity.",
    actionLabel: "Review Now",
  },
];

const TYPE_CONFIG = {
  coaching: {
    icon: Brain,
    gradient: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/15",
    iconColor: "text-indigo-400",
    dot: "bg-indigo-400",
  },
  risk: {
    icon: AlertTriangle,
    gradient: "from-rose-500/20 to-orange-500/20",
    border: "border-rose-500/15",
    iconColor: "text-rose-400",
    dot: "bg-rose-400",
  },
  recommendation: {
    icon: Lightbulb,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/15",
    iconColor: "text-amber-400",
    dot: "bg-amber-400",
  },
  summary: {
    icon: TrendingUp,
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/15",
    iconColor: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

interface AIInsightsCardProps {
  variant?: "employee" | "manager";
  onOpenAssistant?: () => void;
}

export function AIInsightsCard({ variant = "employee", onOpenAssistant }: AIInsightsCardProps) {
  const insights = variant === "manager" ? MANAGER_INSIGHTS : EMPLOYEE_INSIGHTS;

  return (
    <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
          <Sparkles className="size-4 text-indigo-400" />
          AI Insights
        </CardTitle>
        {onOpenAssistant && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenAssistant}
            className="h-7 px-3 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 uppercase tracking-wider"
          >
            Ask AI <ChevronRight className="size-3 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {insights.map((insight, idx) => {
          const config = TYPE_CONFIG[insight.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`rounded-xl bg-gradient-to-r ${config.gradient} border ${config.border} p-4 group hover:scale-[1.01] transition-transform`}
            >
              <div className="flex items-start gap-3">
                <div className={`size-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`size-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`size-1.5 rounded-full ${config.dot}`} />
                    <h4 className="text-xs font-bold text-white">{insight.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {insight.message}
                  </p>
                  {insight.actionLabel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 mt-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:bg-transparent uppercase tracking-wider"
                    >
                      {insight.actionLabel} <ChevronRight className="size-3 ml-0.5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
