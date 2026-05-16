import * as React from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Target,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Globe,
  Clock,
  Award,
  Layers,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

/* ------------------------------------------------------------------ */
/*  Reusable animated section wrapper                                  */
/* ------------------------------------------------------------------ */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
  ...rest
}: React.PropsWithChildren<{ className?: string; delay?: number }> & { [key: string]: any }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Target,
    title: "Smart Goal Lifecycle",
    desc: "Draft → Submit → Review → Approve → Lock. Every stage tracked, validated, and audit-logged automatically.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "QoQ trends, heatmaps, department comparisons, and manager-effectiveness scores — all in stunning interactive charts.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade RBAC",
    desc: "Three distinct roles — Employee, Manager, Admin — each with precise permissions, guards, and audit trails.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Shared KPI System",
    desc: "Assign organization-wide KPIs that cascade down. Achievements sync across linked goals in real time.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Clock,
    title: "Quarterly Check-Ins",
    desc: "Structured review windows for Q1–Q4. Employees update achievements, managers conduct reviews — on schedule.",
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: Layers,
    title: "Cycle Governance",
    desc: "Admins create cycles, open/close phases, unlock goals, and configure windows. Full organizational control.",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3x", label: "Faster Reviews" },
  { value: "100%", label: "Audit Coverage" },
  { value: "50+", label: "Enterprise Clients" },
];

const TESTIMONIALS = [
  {
    quote:
      "NovaPulse transformed how we manage quarterly objectives. Our review cycles went from 3 weeks to 3 days.",
    name: "Sarah Chen",
    role: "VP of People Ops",
    company: "TechCorp",
  },
  {
    quote:
      "The shared KPI system alone justified the switch. Finally, alignment from C-suite to individual contributors.",
    name: "Marcus Johnson",
    role: "Chief Strategy Officer",
    company: "ScaleUp Inc.",
  },
  {
    quote:
      "Audit logs, escalation workflows, and RBAC — all out of the box. Our compliance team was ecstatic.",
    name: "Priya Sharma",
    role: "Head of HR",
    company: "GlobalTech",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#030711] text-white overflow-x-hidden">
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06]">
        <div className="absolute inset-0 backdrop-blur-2xl bg-[#030711]/70" />
        <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Nova<span className="text-gradient">Pulse</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#why" className="hover:text-white transition-colors">Why NovaPulse</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onGetStarted}
              className="text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl px-5 shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[128px]" />
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Enterprise Performance Management
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Align Goals.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Track Performance.
            </span>
            <br />
            Drive Excellence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            The only platform that unifies goal lifecycle management, quarterly
            reviews, shared KPI tracking, and organizational analytics — built
            for teams that refuse to compromise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl px-8 h-13 text-base shadow-2xl shadow-indigo-500/25 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-slate-300 hover:text-white hover:bg-white/5 font-medium rounded-xl px-8 h-13 text-base group"
            >
              Watch Demo
              <ChevronRight className="ml-1 size-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 md:mt-24 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/60" />
                  <div className="size-3 rounded-full bg-yellow-500/60" />
                  <div className="size-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/[0.04] text-xs text-slate-500 font-mono">
                    app.novapulse.io/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard mock content */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Active Goals", val: "24", color: "from-indigo-500/20 to-indigo-500/5" },
                    { label: "Completion", val: "78%", color: "from-emerald-500/20 to-emerald-500/5" },
                    { label: "Pending Reviews", val: "6", color: "from-amber-500/20 to-amber-500/5" },
                    { label: "Team Score", val: "92", color: "from-purple-500/20 to-purple-500/5" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-xl bg-gradient-to-b ${s.color} border border-white/[0.06] p-4`}
                    >
                      <div className="text-xs text-slate-500 font-medium mb-1">{s.label}</div>
                      <div className="text-2xl font-bold text-white">{s.val}</div>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder bars */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <div className="text-xs text-slate-500 font-medium mb-3">Quarterly Performance Trend</div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80, 95, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: 1 + i * 0.06 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.1} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">{s.value}</div>
              <div className="text-sm text-slate-500 font-medium">{s.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 uppercase tracking-wider">
              <Globe className="size-3.5" />
              Platform Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Everything your org needs.{" "}
              <span className="text-gradient">Nothing it doesn't.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              From goal drafting to quarterly reviews, from shared KPIs to
              escalation workflows — NovaPulse covers the full performance
              management spectrum.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.08}>
                <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 h-full">
                  <div
                    className={`size-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <f.icon className="size-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why NovaPulse ─────────────────────────────── */}
      <section
        id="why"
        className="py-24 md:py-32 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4 uppercase tracking-wider">
              <Award className="size-3.5" />
              The NovaPulse Difference
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Why teams choose{" "}
              <span className="text-gradient">NovaPulse</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Other tools give you spreadsheets with a UI. We give you an
              intelligent performance engine.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Complete Goal Lifecycle — Not Just Tracking",
                points: [
                  "Multi-step goal creation with built-in validation (max 8 goals, min 10% weightage, total = 100%)",
                  "Draft → Submitted → Under Review → Approved → Locked workflow",
                  "Manager rework requests with inline comments",
                ],
                icon: TrendingUp,
              },
              {
                title: "Role-Specific Dashboards That Actually Help",
                points: [
                  "Employees see their goals, progress, quarterly trends, and thrust-area analytics",
                  "Managers get a review queue, team analytics, and approval workflows",
                  "Admins control cycles, audit logs, escalations, and governance",
                ],
                icon: Users,
              },
              {
                title: "Governance & Compliance, Built In",
                points: [
                  "Full audit logging — who changed what, before/after values, timestamps",
                  "Escalation engine for missed submissions and overdue approvals",
                  "Cycle management with configurable quarterly windows",
                ],
                icon: Shield,
              },
              {
                title: "Analytics That Drive Decisions",
                points: [
                  "QoQ trends, completion-rate heatmaps, department comparisons",
                  "Manager effectiveness scoring across review cycles",
                  "CSV & Excel exports for board-level reporting",
                ],
                icon: BarChart3,
              },
            ].map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 hover:bg-white/[0.04] transition-colors h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                      <card.icon className="size-5 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {card.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {card.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-400 font-medium leading-relaxed">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section id="testimonials" className="py-24 md:py-32 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Trusted by{" "}
              <span className="text-gradient">forward-thinking</span> teams
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Sparkles
                        key={j}
                        className="size-3.5 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-5 italic font-medium">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[128px]" />
        </div>
        <AnimatedSection className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
            Ready to transform your{" "}
            <span className="text-gradient">performance culture</span>?
          </h2>
          <p className="text-slate-400 text-lg mb-8 font-medium">
            Join organizations that have replaced chaotic review cycles with
            structured, transparent, and scalable performance governance.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl px-10 h-14 text-base shadow-2xl shadow-indigo-500/25 group"
          >
            Get Started — It's Free
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AnimatedSection>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-400">
              Nova<span className="text-slate-300">Pulse</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            © 2026 NovaPulse. All rights reserved. Built for enterprises that
            demand excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
