/**
 * EscalationEngine — Live background rules calibrator and compliance auditor
 */
import * as React from "react";
import {
  AlertTriangle,
  Settings,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Bell,
  Play,
  TrendingUp,
  Activity,
  ArrowRight,
  RefreshCw,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "../../lib/api-client";
import { toast } from "sonner";

interface Escalation {
  id: string;
  reason: string;
  level: number;
  status: string;
  createdAt: string;
  target?: {
    fullName: string;
    email: string;
  };
}

export function EscalationEngine() {
  const [escalations, setEscalations] = React.useState<Escalation[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchEscalations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getEscalations();
      if (res && Array.isArray(res)) {
        setEscalations(res);
      } else if (res && res.success && Array.isArray(res.data)) {
        setEscalations(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEscalations();
  }, []);

  const triggerScan = async (type: 'approvals' | 'checkins' | 'stale') => {
    toast.loading("Executing background compliance auditor scan...", { id: 'escalation-scan' });
    let res;
    try {
      if (type === 'approvals') {
        res = await apiClient.triggerPendingApprovalsEscalation();
      } else if (type === 'checkins') {
        res = await apiClient.triggerOverdueCheckinsEscalation();
      } else {
        res = await apiClient.triggerStaleGoalsEscalation();
      }

      if (res && (res.success || res.status === 201 || res.status === 200)) {
        toast.success("Compliance audit completed successfully! Any violations have been cataloged.", { id: 'escalation-scan' });
        fetchEscalations();
      } else {
        toast.error("Compliance audit failed to execute.", { id: 'escalation-scan' });
      }
    } catch (e) {
      toast.error("Error executing background scan.", { id: 'escalation-scan' });
    }
  };

  const handleResolveEscalation = async (id: string) => {
    toast.loading("Resolving compliance breach...", { id: 'resolve-esc' });
    try {
      const res = await apiClient.resolveEscalation(id);
      if (res && res.success) {
        toast.success("Escalation resolved and system status calibrated.", { id: 'resolve-esc' });
        fetchEscalations();
      } else {
        toast.error("Failed to resolve escalation.", { id: 'resolve-esc' });
      }
    } catch (e) {
      toast.error("Error resolving escalation.", { id: 'resolve-esc' });
    }
  };

  const ESCALATION_RULES = [
    {
      id: "approvals",
      condition: "Goal Pending Approval > 7 Days",
      priority: "High",
      action: "Escalate to target manager",
      level: 2,
      triggerType: 'approvals' as const,
    },
    {
      id: "checkins",
      condition: "Check-in Missed / Overdue",
      priority: "Medium",
      action: "Notify employee and owner",
      level: 1,
      triggerType: 'checkins' as const,
    },
    {
      id: "stale",
      condition: "Stale Goals (No updates > 30 days)",
      priority: "Critical",
      action: "Notify owner & calibration lead",
      level: 1,
      triggerType: 'stale' as const,
    },
  ];

  // Calculated Stats
  const totalBreaches = escalations.length;
  const criticalCount = escalations.filter(e => e.level >= 2).length;
  const compliantHealth = totalBreaches === 0 ? "Optimal" : totalBreaches > 3 ? "At Risk" : "Stable";

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Escalation Engine</h1>
          <p className="text-immersive-muted font-medium">Automated risk management and compliance auditor workflows.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchEscalations} 
            className="bg-[#090D16] border border-white/10 hover:bg-white/5 text-white font-bold h-11 px-6 shadow-xl"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Log
          </Button>
        </div>
      </div>

      {/* Compliance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><ShieldAlert className="size-16 text-indigo-400" /></div>
          <CardContent className="pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Active Breaches</h4>
            <p className="text-3xl font-black text-gradient mt-2">{totalBreaches}</p>
            <p className="text-[10px] text-immersive-muted font-bold mt-1 uppercase tracking-wider">Unresolved System Violations</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><AlertTriangle className="size-16 text-rose-400" /></div>
          <CardContent className="pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Critical Violations</h4>
            <p className="text-3xl font-black text-gradient mt-2">{criticalCount}</p>
            <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase tracking-wider">Level 2+ Escalations</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Activity className="size-16 text-emerald-400" /></div>
          <CardContent className="pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">SLA Calibration</h4>
            <p className="text-3xl font-black text-gradient mt-2">98.4%</p>
            <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wider">Average Compliance SLA</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><CheckCircle2 className="size-16 text-indigo-400" /></div>
          <CardContent className="pt-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted">Compliance Status</h4>
            <p className={`text-2xl font-black mt-3 ${compliantHealth === 'Optimal' ? 'text-emerald-400' : compliantHealth === 'Stable' ? 'text-amber-400' : 'text-rose-400'}`}>
              {compliantHealth}
            </p>
            <p className="text-[10px] text-immersive-muted font-bold mt-1 uppercase tracking-wider">Overall Platform Health</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Rules */}
        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 py-4 bg-white/5">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <ShieldAlert className="size-4 text-indigo-400" />
              Compliance Rule Book
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {ESCALATION_RULES.map((rule) => (
              <div key={rule.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[9px] font-black uppercase border-none shadow-none px-2.5 h-5 rounded-lg
                      ${rule.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 
                        rule.priority === 'High' ? 'bg-orange-500/10 text-orange-400' : 
                        'bg-amber-500/10 text-amber-400'}`}>
                      {rule.priority}
                    </Badge>
                    <span className="text-[9px] text-immersive-muted uppercase font-black tracking-widest">Level {rule.level} Escalation</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-black">
                    <span className="text-immersive-text">IF</span>
                    <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-lg">{rule.condition}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-immersive-muted">
                    <span>THEN</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-black uppercase text-[10px]">
                      <Bell className="size-3" /> {rule.action}
                    </span>
                  </div>
                </div>

                <Button size="sm" onClick={() => triggerScan(rule.triggerType)} className="bg-indigo-600 hover:bg-indigo-500 font-black text-[9px] uppercase tracking-widest h-8 px-3 shrink-0 shadow-lg shadow-indigo-600/20">
                  <Play className="mr-1.5 size-3" /> Run Scan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Overdue Breach logs */}
        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 py-4 bg-white/5">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
              <AlertTriangle className="size-4 text-rose-400 animate-pulse" />
              Live Governance Breaches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            {escalations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="text-sm font-black text-immersive-text">All Systems Calibrated</h4>
                <p className="text-xs text-immersive-muted max-w-[280px] mt-1 font-medium">No open escalations or system compliance compliance detected at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto pr-1">
                {escalations.map((esc) => (
                  <div key={esc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-immersive-text">{esc.reason}</span>
                        <Badge className="bg-rose-500/10 text-rose-400 text-[9px] uppercase border-none font-black px-2 h-5 rounded-lg">Level {esc.level}</Badge>
                      </div>
                      {esc.target && (
                        <p className="text-[10px] font-bold text-immersive-muted uppercase tracking-wider">
                          Target Assignee: <span className="text-indigo-400">{esc.target.fullName}</span> ({esc.target.email})
                        </p>
                      )}
                      <p className="text-[9px] text-immersive-muted font-bold flex items-center gap-1 uppercase">
                        <Clock className="size-3" /> Detected {new Date(esc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleResolveEscalation(esc.id)} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest h-8 px-3 shrink-0 shadow-lg shadow-emerald-600/20"
                    >
                      <Check className="mr-1.5 size-3" /> Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {escalations.length > 0 && (
              <div className="p-4 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-between bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  <span className="text-[10px] font-black uppercase text-rose-400">Total Breach Count</span>
                  <Badge className="bg-rose-600 text-white font-black text-[10px] px-3 py-0.5 rounded-lg border-none shadow-lg shadow-rose-600/20">{escalations.length} Active</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
