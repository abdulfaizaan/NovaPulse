import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Target,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "goal" | "employee" | "cycle" | "audit" | "department";
  title: string;
  subtitle: string;
  meta?: string;
}

const SEARCH_INDEX: SearchResult[] = [
  { id: "s1", type: "goal", title: "Modernize Enterprise Design System", subtitle: "Alex Rivera • Product Design", meta: "65% complete" },
  { id: "s2", type: "goal", title: "Improve Customer Onboarding", subtitle: "Jordan Smith • Engineering", meta: "85% complete" },
  { id: "s3", type: "goal", title: "Reduce Production Incidents", subtitle: "Mila Kunis • Engineering", meta: "40% complete" },
  { id: "s4", type: "goal", title: "Expand APAC Market Share", subtitle: "Oscar Wilde • Sales", meta: "92% complete" },
  { id: "s5", type: "goal", title: "Team Mentorship Program", subtitle: "Alex Rivera • Product Design", meta: "Draft" },
  { id: "s6", type: "employee", title: "Alex Rivera", subtitle: "Product Designer • Product Design", meta: "Employee" },
  { id: "s7", type: "employee", title: "Sarah Chen", subtitle: "Product Manager • Product Management", meta: "Manager" },
  { id: "s8", type: "employee", title: "Jordan Smith", subtitle: "Frontend Engineer • Engineering", meta: "Employee" },
  { id: "s9", type: "employee", title: "James Mitchell", subtitle: "Engineering Lead • Engineering", meta: "Admin" },
  { id: "s10", type: "employee", title: "Mila Kunis", subtitle: "UX Researcher • Design", meta: "Employee" },
  { id: "s11", type: "cycle", title: "Q2 2026 — Active", subtitle: "Apr 1 – Jun 30, 2026", meta: "Open" },
  { id: "s12", type: "cycle", title: "Q1 2026 — Reconciliation", subtitle: "Jan 1 – Mar 31, 2026", meta: "Closed" },
  { id: "s13", type: "department", title: "Product Design", subtitle: "8 members • 34 active goals", meta: "72% avg" },
  { id: "s14", type: "department", title: "Engineering", subtitle: "12 members • 48 active goals", meta: "68% avg" },
  { id: "s15", type: "audit", title: "Goal Approved: Design System", subtitle: "Sarah Chen • 2 minutes ago", meta: "Approval" },
  { id: "s16", type: "audit", title: "Weightage Changed: APAC Goal", subtitle: "Oscar Wilde • 15 minutes ago", meta: "Update" },
];

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  goal: { icon: Target, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  employee: { icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  cycle: { icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10" },
  audit: { icon: FileText, color: "text-rose-400", bg: "bg-rose-500/10" },
  department: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
};

interface EnterpriseSearchProps {
  open: boolean;
  onClose: () => void;
}

export function EnterpriseSearch({ open, onClose }: EnterpriseSearchProps) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setFilter("all");
    }
  }, [open]);

  // Keyboard shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) onClose(); // toggle — parent handles opening
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = React.useMemo(() => {
    let results = SEARCH_INDEX;
    if (filter !== "all") results = results.filter((r) => r.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          (r.meta && r.meta.toLowerCase().includes(q))
      );
    }
    return results.slice(0, 8);
  }, [query, filter]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Search modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50"
          style={{ background: "rgba(10, 15, 30, 0.97)", backdropFilter: "blur(40px)" }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <Search className="size-5 text-slate-500 shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search goals, people, cycles, and more..."
              className="flex-1 border-0 bg-transparent text-white text-sm placeholder:text-slate-500 focus-visible:ring-0 focus-visible:outline-none h-8 p-0"
            />
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono">
                ESC
              </kbd>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 px-5 py-2 border-b border-white/[0.04]">
            {["all", "goal", "employee", "cycle", "department", "audit"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {f === "all" ? "All" : f + "s"}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="size-8 text-slate-700 mb-3" />
                <p className="text-sm text-slate-500 font-medium">No results found</p>
                <p className="text-xs text-slate-600 mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="py-2">
                {filtered.map((result, idx) => {
                  const config = TYPE_CONFIG[result.type];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors text-left group"
                    >
                      <div className={`size-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`size-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">{result.title}</span>
                          {result.meta && (
                            <Badge className="h-4 px-1.5 text-[8px] bg-white/5 text-slate-400 border-white/10 font-bold shrink-0">
                              {result.meta}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                      </div>
                      <ArrowRight className="size-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3 text-indigo-400" />
              <span className="text-[10px] text-slate-500 font-medium">
                AI-enhanced search across {SEARCH_INDEX.length} items
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd>
              navigate
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
              select
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
