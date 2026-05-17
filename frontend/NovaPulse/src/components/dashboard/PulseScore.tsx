import { motion } from "motion/react";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PulseScoreProps {
  score: number;
  previousScore?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function PulseScore({ score, previousScore, label = "Org Pulse", size = "md" }: PulseScoreProps) {
  const delta = previousScore != null ? score - previousScore : 0;
  const trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#10b981", text: "text-emerald-400", glow: "shadow-emerald-500/30" };
    if (s >= 60) return { stroke: "#818cf8", text: "text-indigo-400", glow: "shadow-indigo-500/30" };
    if (s >= 40) return { stroke: "#f59e0b", text: "text-amber-400", glow: "shadow-amber-500/30" };
    return { stroke: "#ef4444", text: "text-rose-400", glow: "shadow-rose-500/30" };
  };

  const colors = getColor(score);
  const dimensions = size === "lg" ? "size-40" : size === "md" ? "size-32" : "size-24";
  const fontSize = size === "lg" ? "text-4xl" : size === "md" ? "text-3xl" : "text-xl";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${dimensions}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
          {/* Progress arc */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors.stroke}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${colors.stroke}40)` }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${fontSize} font-extrabold ${colors.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1">
          <Activity className={`size-3.5 ${colors.text}`} />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        {previousScore != null && (
          <div className="flex items-center justify-center gap-1">
            {trend === "up" && <TrendingUp className="size-3 text-emerald-400" />}
            {trend === "down" && <TrendingDown className="size-3 text-rose-400" />}
            {trend === "flat" && <Minus className="size-3 text-slate-400" />}
            <span
              className={`text-[10px] font-bold ${
                trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {delta > 0 && "+"}
              {delta} from last quarter
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Goal Health Score (inline badge variant) ─────── */
export function GoalHealthBadge({ score }: { score: number }) {
  const getConfig = (s: number) => {
    if (s >= 80)
      return { label: "Healthy", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
    if (s >= 60)
      return { label: "On Track", bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" };
    if (s >= 40)
      return { label: "At Risk", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    return { label: "Critical", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" };
  };

  const config = getConfig(score);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} border ${config.border}`}>
      <div className={`size-1.5 rounded-full ${config.text.replace("text-", "bg-")}`} />
      <span className={`text-[10px] font-bold ${config.text} uppercase tracking-wider`}>
        {score} — {config.label}
      </span>
    </div>
  );
}
