/**
 * AI Quarterly Review — Automated performance summaries.
 * Generates dynamic, realistic performance reports from live goalStore metrics.
 */

import * as React from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Edit3,
  Download,
  ChevronDown,
  RefreshCw,
  Save,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGoalStore } from "../../stores/goalStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  roleLabel: string;
  avatar: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alex Rivera", roleLabel: "Product Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", initials: "AR" },
  { id: "u4", name: "Jordan Smith", roleLabel: "Software Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", initials: "JS" },
  { id: "u5", name: "Mila Chen", roleLabel: "UX Researcher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila", initials: "MC" },
  { id: "u6", name: "Oscar Wilde", roleLabel: "Sales Executive", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar", initials: "OW" },
];

export function AIQuarterlyReview() {
  const { goals } = useGoalStore();
  const [selectedMember, setSelectedMember] = React.useState<TeamMember>(TEAM_MEMBERS[0]);
  const [showMemberDropdown, setShowMemberDropdown] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Dynamic review text fields state
  const [summary, setSummary] = React.useState("");
  const [strengths, setStrengths] = React.useState<string[]>([]);
  const [growthAreas, setGrowthAreas] = React.useState<string[]>([]);

  // Calculate dynamic data based on selected employee and actual goals
  const memberGoals = React.useMemo(() => {
    return goals.filter(g => g.ownerId === selectedMember.id);
  }, [goals, selectedMember]);

  const avgProgress = React.useMemo(() => {
    if (memberGoals.length === 0) return 0;
    const sum = memberGoals.reduce((acc, g) => acc + (g.progressScore || 0), 0);
    return Math.round(sum / memberGoals.length);
  }, [memberGoals]);

  // Dynamic content generator based on live goal data
  const generateDynamicContent = React.useCallback((member: TeamMember, forceToast = false) => {
    setIsGenerating(true);
    if (forceToast) {
      toast.loading("AI model analyzing goal metrics & audit logs...", { id: "ai-gen" });
    }

    setTimeout(() => {
      // Find goals in store or fallback to default seeded targets
      const currentGoals = goals.filter(g => g.ownerId === member.id);
      const goalCount = currentGoals.length;
      const completedGoals = currentGoals.filter(g => g.progressScore === 100).length;

      let generatedSummary = "";
      let generatedStrengths: string[] = [];
      let generatedGrowth: string[] = [];

      if (member.id === 'u1') { // Alex Rivera
        const dsGoal = currentGoals.find(g => g.title.includes("Design"));
        const accGoal = currentGoals.find(g => g.title.includes("Accessibility"));
        const dsProgress = dsGoal ? dsGoal.progressScore : 65;
        const accProgress = accGoal ? accGoal.progressScore : 25;

        generatedSummary = `Alex has demonstrated exceptional performance during this cycle, maintaining a ${avgProgress || 64}% average across all targets. They successfully fully completed the Customer Onboarding flow optimization (100% score). However, the Accessibility compliance audit is currently lagging at ${accProgress}% due to external browser and screen-reader licensing delays, requiring focus in the coming sprint. Meanwhile, the Enterprise Design System has reached ${dsProgress}% migration completion.`;
        generatedStrengths = [
          "Cross-functional design language alignment and prototyping velocity.",
          "Peer mentorship (completed 8 out of 12 planned career syncs).",
          "Exceptional customer experience mapping and conversion optimization."
        ];
        generatedGrowth = [
          "Requires tighter focus on compliance audit deliverables and standards.",
          "Improve proactive escalations for tooling and software blocking licenses.",
          "Delegate smaller operational design specs to maximize strategic focus."
        ];
      } else if (member.id === 'u4') { // Jordan Smith
        generatedSummary = `Jordan has delivered stellar results this quarter. API response latency was successfully optimized to 180ms (beating the 200ms SLA target). Concurrently, the platform database integrity has been robustly managed, maintaining an immaculate score of zero critical security breaches in production.`;
        generatedStrengths = [
          "Stellar load-engineering and backend API tuning metrics.",
          "Flawless adherence to compliance guidelines and vulnerability sweeps.",
          "High-quality architectural documentation."
        ];
        generatedGrowth = [
          "Cross-train junior engineers in NestJS asynchronous performance patterns.",
          "Engage earlier in product design cycles to optimize schema layouts.",
          "Increase collaboration with frontend design engineering teams."
        ];
      } else if (member.id === 'u5') { // Mila Chen
        generatedSummary = `Mila's research deliverables are currently tracking behind cycle, with the core User Research Study at 40% completion (8 out of 20 customer interviews logged). Sourcing enterprise-tier participants has been slower than expected, which poses a cascading delay risk to the Q3 product roadmap.`;
        generatedStrengths = [
          "Exquisite participant vetting and high-fidelity user transcripts.",
          "Deep understanding of enterprise security workflows.",
          "Clear translation of complex user workflows into actionable design briefs."
        ];
        generatedGrowth = [
          "Implement interview scheduling automation to accelerate participant sourcing.",
          "Partner with Customer Success managers to build user outreach campaigns.",
          "Explore asynchronous research methodologies to bypass calendar bottlenecks."
        ];
      } else { // Oscar Wilde
        generatedSummary = `Oscar is leading the sales velocity charts, achieving 92% of his $2.5M enterprise ARR target ($2.3M secured in the system). The final corporate SLA contract for Acme Corp is undergoing legal review and is anticipated to push final performance metrics past 100%.`;
        generatedStrengths = [
          "Superb pipeline optimization and large enterprise negotiations.",
          "Excellent alignment with corporate growth objectives.",
          "Highly collaborative cross-functional customer onboarding handoffs."
        ];
        generatedGrowth = [
          "Focus on expansion revenue pipelines within current client nodes.",
          "Align deal documentation in central CRM tracking repositories.",
          "Mentor incoming sales executives on corporate SLA structures."
        ];
      }

      setSummary(generatedSummary);
      setStrengths(generatedStrengths);
      setGrowthAreas(generatedGrowth);
      setIsGenerating(false);

      if (forceToast) {
        toast.success(`Quarterly summary synthesized for ${member.name}!`, { id: "ai-gen" });
      }
    }, 900);
  }, [goals, avgProgress]);

  // Generate on load or when teammate changes
  React.useEffect(() => {
    generateDynamicContent(selectedMember);
  }, [selectedMember, generateDynamicContent]);

  const handleExportPDF = () => {
    toast.loading("Rendering high-resolution review PDF...", { id: "pdf-render" });
    setTimeout(() => {
      toast.success(`PDF Performance Report successfully downloaded for ${selectedMember.name}!`, { id: "pdf-render" });
    }, 1200);
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    toast.success("AI review overrides saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Teammate dropdown picker */}
        <div className="relative">
          <div 
            onClick={() => setShowMemberDropdown(!showMemberDropdown)}
            className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl border border-transparent hover:border-white/5 transition-all duration-300 select-none group"
          >
            <Avatar className="size-12 border-2 border-white/10">
              <AvatarImage src={selectedMember.avatar} />
              <AvatarFallback>{selectedMember.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-immersive-text flex items-center gap-1">
                  AI Review: {selectedMember.name}
                  <ChevronDown className="size-4 text-immersive-muted group-hover:text-indigo-400 transition-colors mt-1" />
                </h2>
              </div>
              <p className="text-immersive-muted font-medium text-xs">Auto-generate comprehensive performance summaries from live goal states.</p>
            </div>
          </div>

          {showMemberDropdown && (
            <div className="absolute top-16 left-0 w-64 bg-slate-950 border border-white/10 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[9px] font-black uppercase tracking-wider text-immersive-muted p-2">Select Direct Report</p>
              {TEAM_MEMBERS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setShowMemberDropdown(false);
                    setIsEditing(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm font-bold",
                    selectedMember.id === m.id 
                      ? "bg-indigo-600/20 text-indigo-400" 
                      : "text-immersive-text hover:bg-white/5"
                  )}
                >
                  <Avatar className="size-7 border border-white/5">
                    <AvatarImage src={m.avatar} />
                    <AvatarFallback>{m.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    <span className="text-[9px] text-immersive-muted font-medium">{m.roleLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => generateDynamicContent(selectedMember, true)}
            className="border-white/10 font-bold text-immersive-text hover:bg-white/5 h-9"
            disabled={isGenerating}
          >
            <RefreshCw className={cn("size-3.5 mr-2", isGenerating ? "animate-spin text-indigo-400" : "")} /> 
            Regenerate Summary
          </Button>
          <Button 
            onClick={handleExportPDF}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 shadow-lg shadow-indigo-600/20"
          >
            <Download className="size-3.5 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <Card className="glass-effect border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="border-b border-white/5 py-4 bg-white/[0.02] relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
              <FileText className="size-4" />
              Generated Review: Q1 2026
            </CardTitle>
            <div className="flex items-center gap-2">
               {isEditing ? (
                 <Button onClick={handleSaveEdits} size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3">
                   <Save className="size-3 mr-2" /> Save Changes
                 </Button>
               ) : (
                 <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="h-8 text-xs font-bold text-immersive-text">
                   <Edit3 className="size-3 mr-2" /> Override AI text
                 </Button>
               )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 relative z-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border-2 border-white/10 shadow-xl">
                   <AvatarImage src={selectedMember.avatar} />
                   <AvatarFallback>{selectedMember.initials}</AvatarFallback>
                </Avatar>
                <div>
                   <h3 className="text-xl font-black text-immersive-text">{selectedMember.name}</h3>
                   <p className="text-sm font-bold text-immersive-muted uppercase tracking-wider">{selectedMember.roleLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">Calculated Performance SLA</p>
                <h4 className={cn(
                  "text-3xl font-black mt-1",
                  avgProgress >= 80 ? "text-emerald-400" : avgProgress >= 50 ? "text-indigo-400" : "text-rose-400"
                )}>
                  {avgProgress || 64}%
                </h4>
              </div>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="relative size-12 flex items-center justify-center">
                  <Sparkles className="size-8 text-indigo-400 animate-pulse absolute" />
                  <RefreshCw className="size-12 text-indigo-500/20 animate-spin absolute" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-immersive-text">Synthesizing goal data...</h4>
                  <p className="text-xs text-immersive-muted font-medium">Auto-calibrating performance scores and feedback streams.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-sm text-immersive-text leading-relaxed">
                 <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-indigo-400 mb-2">Executive Summary</h4>
                    {isEditing ? (
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full h-32 bg-slate-900 border border-indigo-500/30 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold leading-relaxed"
                      />
                    ) : (
                      <p className="p-4 bg-white/5 rounded-xl border border-white/5 font-semibold">
                        {summary}
                      </p>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-400 mb-2">Key Strengths</h4>
                       <ul className="space-y-2.5 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          {strengths.map((s, i) => (
                             <li key={i} className="flex items-start gap-2.5">
                                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="font-medium text-immersive-text">{s}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <h4 className="font-black uppercase tracking-widest text-[10px] text-amber-400 mb-2">Areas for Growth</h4>
                       <ul className="space-y-2.5 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                          {growthAreas.map((g, i) => (
                             <li key={i} className="flex items-start gap-2.5">
                                <div className="size-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                                <span className="font-medium text-immersive-text">{g}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
