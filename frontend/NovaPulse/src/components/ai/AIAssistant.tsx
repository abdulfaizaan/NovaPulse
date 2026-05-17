import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Send,
  Target,
  BarChart3,
  Clock,
  Weight,
  X,
  Bot,
  User,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  suggestions?: AISuggestion;
  isStreaming?: boolean;
}

interface AISuggestion {
  title: string;
  description: string;
  kpis: string[];
  weightage: number;
  timeline: string;
  uom: string;
}

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
  onApplySuggestion?: (suggestion: AISuggestion) => void;
}

/* ── Mock AI response generator ───────────────────── */
const AI_RESPONSES: Record<string, AISuggestion> = {
  onboarding: {
    title: "Optimize Customer Onboarding Experience",
    description:
      "Reduce time-to-value for new enterprise customers by streamlining the onboarding flow, implementing guided setup wizards, and tracking activation milestones.",
    kpis: [
      "Time to first value (days)",
      "Onboarding completion rate (%)",
      "Customer activation score",
      "Support ticket reduction (%)",
    ],
    weightage: 25,
    timeline: "Q2 2026 (Apr–Jun)",
    uom: "Onboarding Time (minutes)",
  },
  revenue: {
    title: "Drive Revenue Growth Through Strategic Expansion",
    description:
      "Increase ARR by expanding into two new market segments while maintaining NRR above 110% through upsell/cross-sell initiatives.",
    kpis: [
      "ARR growth (%)",
      "Net Revenue Retention (%)",
      "New segment penetration",
      "Deal pipeline value ($M)",
    ],
    weightage: 30,
    timeline: "Q2–Q3 2026",
    uom: "Revenue ($M)",
  },
  quality: {
    title: "Achieve Engineering Quality Excellence",
    description:
      "Reduce production incidents by 40% through improved testing coverage, automated deployment pipelines, and proactive monitoring.",
    kpis: [
      "Incident frequency (per month)",
      "Test coverage (%)",
      "Deploy success rate (%)",
      "Mean time to recovery (hrs)",
    ],
    weightage: 20,
    timeline: "Q2 2026",
    uom: "Incident Count",
  },
  default: {
    title: "Improve Team Productivity & Collaboration",
    description:
      "Enhance cross-functional collaboration by establishing structured communication cadences, shared documentation practices, and measurable team velocity improvements.",
    kpis: [
      "Sprint velocity improvement (%)",
      "Cross-team dependency resolution time",
      "Documentation coverage score",
      "Team satisfaction index",
    ],
    weightage: 20,
    timeline: "Q2 2026",
    uom: "Productivity Score",
  },
};

function matchResponse(input: string): AISuggestion {
  const lower = input.toLowerCase();
  if (lower.includes("onboard") || lower.includes("customer")) return AI_RESPONSES.onboarding;
  if (lower.includes("revenue") || lower.includes("sales") || lower.includes("growth"))
    return AI_RESPONSES.revenue;
  if (lower.includes("quality") || lower.includes("engineering") || lower.includes("bug"))
    return AI_RESPONSES.quality;
  return AI_RESPONSES.default;
}

/* ── Streaming text effect ────────────────────────── */
function StreamingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = React.useState("");
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    setDisplayed("");
    idxRef.current = 0;
    const interval = setInterval(() => {
      if (idxRef.current < text.length) {
        setDisplayed(text.slice(0, idxRef.current + 1));
        idxRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-text-bottom" />
      )}
    </span>
  );
}

/* ── Main Component ───────────────────────────────── */
export function AIAssistant({ open, onClose, onApplySuggestion }: AIAssistantProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm your AI Goal Architect. Tell me what you'd like to achieve, and I'll generate a SMART goal with KPIs, weightage, and timeline recommendations.\n\nTry something like:\n• \"I want to improve customer onboarding\"\n• \"Help me set a revenue growth target\"\n• \"Reduce engineering incidents\"",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate AI thinking
    setTimeout(() => {
      const suggestion = matchResponse(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Here's a SMART goal based on your input:`,
        suggestions: suggestion,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 400, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-6 top-20 bottom-6 w-[420px] z-50 flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40"
        style={{ background: "rgba(10, 15, 30, 0.92)", backdropFilter: "blur(40px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="size-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Goal Architect</h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Powered by NovaPulse Intelligence
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-white/5 text-slate-400"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "ai" && (
                <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-3.5 text-indigo-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white/[0.04] text-slate-300 border border-white/[0.06] rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.content}</p>

                {/* AI Suggestion Card */}
                {msg.suggestions && (
                  <div className="mt-3 space-y-3">
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-white leading-snug pr-2">
                          {msg.isStreaming ? (
                            <StreamingText
                              text={msg.suggestions.title}
                              onComplete={() => {
                                setMessages((prev) =>
                                  prev.map((m) => (m.id === msg.id ? { ...m, isStreaming: false } : m))
                                );
                              }}
                            />
                          ) : (
                            msg.suggestions.title
                          )}
                        </h4>
                        <button
                          onClick={() => handleCopy(msg.suggestions!.title, msg.id)}
                          className="text-slate-500 hover:text-white transition-colors shrink-0"
                        >
                          {copied === msg.id ? (
                            <Check className="size-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {msg.suggestions.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Target className="size-3 text-indigo-400 shrink-0" />
                          <span className="font-semibold">{msg.suggestions.uom}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Weight className="size-3 text-amber-400 shrink-0" />
                          <span className="font-semibold">{msg.suggestions.weightage}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="size-3 text-emerald-400 shrink-0" />
                          <span className="font-semibold">{msg.suggestions.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <BarChart3 className="size-3 text-rose-400 shrink-0" />
                          <span className="font-semibold">{msg.suggestions.kpis.length} KPIs</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Suggested KPIs
                        </p>
                        <div className="space-y-1.5">
                          {msg.suggestions.kpis.map((kpi, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs text-slate-300"
                            >
                              <div className="size-1.5 rounded-full bg-indigo-400" />
                              {kpi}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {!msg.isStreaming && onApplySuggestion && (
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(msg.suggestions!)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl h-9"
                      >
                        <Sparkles className="size-3 mr-1.5" />
                        Apply to Goal Creator
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="size-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="size-3.5 text-slate-400" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Bot className="size-3.5 text-indigo-400" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-2">
                <Loader2 className="size-3.5 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Analyzing your input...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe what you want to achieve..."
              className="flex-1 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl h-11 text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              size="icon"
              className="size-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-40"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <p className="text-[10px] text-slate-600 mt-2 text-center font-medium">
            AI suggestions are recommendations — always review before submitting.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
