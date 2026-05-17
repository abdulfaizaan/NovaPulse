/**
 * AdminDashboard — Connected system command center with active Cycle Management, User Impersonation, and Audit Observation.
 */
import * as React from "react";
import { 
  CalendarDays, 
  History, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Download, 
  Send, 
  Play, 
  ChevronRight, 
  Plus, 
  Check, 
  Clock, 
  Search, 
  UserPlus, 
  ShieldAlert,
  Users 
} from "lucide-react";
import { StatWidget } from "@/src/components/dashboard/StatWidget";
import { PulseScore } from "@/src/components/dashboard/PulseScore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGoalStore } from "@/src/stores/goalStore";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api-client";
import { toast } from "sonner";

interface Cycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AdminDashboardProps {
  initialTab?: string;
}

export function AdminDashboard({ initialTab = "overview" }: AdminDashboardProps) {
  const { goals, auditLogs, notifications } = useGoalStore();
  const { impersonate } = useAuth();
  
  // Local state for Active Tab
  const [activeTab, setActiveTab] = React.useState(initialTab);

  // Sync activeTab whenever the initialTab navigation prop changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Local state for Cycle Management
  const [cycles, setCycles] = React.useState<Cycle[]>([]);
  const [isCycleModalOpen, setIsCycleModalOpen] = React.useState(false);
  const [newCycle, setNewCycle] = React.useState({
    name: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Local state for Teams Registry
  const [teams, setTeams] = React.useState<string[]>([
    "Design & UX",
    "Platform Frontend",
    "Enterprise Growth",
    "Executive Command"
  ]);
  const [selectedTeamFilter, setSelectedTeamFilter] = React.useState<string>("all");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = React.useState(false);
  const [newIndependentTeamName, setNewIndependentTeamName] = React.useState("");

  // Local state for Users & Teams database management
  const [teamMembers, setTeamMembers] = React.useState([
    { id: "u1", name: "Alex Rivera", email: "alex@novapulse.com", role: "employee", title: "Product Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", dept: "Design", team: "Design & UX" },
    { id: "u2", name: "Sarah Chen", email: "sarah@novapulse.com", role: "manager", title: "Engineering Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", dept: "Engineering", team: "Platform Frontend" },
    { id: "u4", name: "Jordan Smith", email: "jordan@novapulse.com", role: "employee", title: "Software Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", dept: "Engineering", team: "Platform Frontend" },
    { id: "u5", name: "Mila Chen", email: "mila@novapulse.com", role: "employee", title: "UX Researcher", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mila", dept: "Research", team: "Design & UX" },
    { id: "u6", name: "Oscar Wilde", email: "oscar@novapulse.com", role: "employee", title: "Sales Executive", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar", dept: "Sales", team: "Enterprise Growth" },
    { id: "u3", name: "System Admin", email: "admin@novapulse.com", role: "admin", title: "Platform Owner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin", dept: "Governance", team: "Executive Command" }
  ]);

  const [userSearchTerm, setUserSearchTerm] = React.useState("");
  const [userRoleFilter, setUserRoleFilter] = React.useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({ 
    name: "", 
    email: "", 
    role: "employee", 
    title: "", 
    dept: "",
    teamSelection: "Design & UX",
    newTeamName: ""
  });

  // Local state for Audit Logs search historian
  const [auditSearchTerm, setAuditSearchTerm] = React.useState("");
  const [auditActionFilter, setAuditActionFilter] = React.useState("all");

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === "all" ? true : m.role === userRoleFilter;
    const matchesTeam = selectedTeamFilter === "all" ? true : m.team === selectedTeamFilter;
    return matchesSearch && matchesRole && matchesTeam;
  });

  const loadCycles = async () => {
    const res = await apiClient.getCycles();
    if (res.success && res.data) {
      setCycles(res.data);
    }
  };

  React.useEffect(() => {
    loadCycles();
  }, []);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.progressStatus === 'completed').length;
  const globalCompletion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const escalationCount = notifications.filter((n) => n.type === 'escalation' && !n.isRead).length;

  const activeCycle = cycles.find((c) => c.isActive);

  // ── Action Handlers ──────────────────────────────────────────────
  const handleExportAudit = () => {
    const csvRows = [
      ['User', 'Action', 'Entity', 'Before', 'After', 'Timestamp'].join(','),
      ...auditLogs.map((l) => [l.userName, l.action, l.entityType, l.beforeValue || '', l.afterValue || '', l.timestamp].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_log.csv';
    a.click();
    toast.success('Audit log exported successfully!');
  };

  const handleCreateCycle = async () => {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) {
      toast.error("Please fill in all cycle details.");
      return;
    }
    const res = await apiClient.post('/admin/cycles', newCycle);
    if (res.success) {
      toast.success("New Performance Cycle provisioned successfully!");
      setNewCycle({ name: "", startDate: "", endDate: "", isActive: true });
      loadCycles();
      setIsCycleModalOpen(false);
    } else {
      toast.error("Failed to provision cycle.");
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.title) {
      toast.error("Please fill in all required user fields.");
      return;
    }

    let finalTeamName = newUser.teamSelection;
    if (newUser.teamSelection === "create_new") {
      const cleanTeam = newUser.newTeamName.trim();
      if (!cleanTeam) {
        toast.error("Please enter a name for the new team.");
        return;
      }
      finalTeamName = cleanTeam;
      if (!teams.includes(finalTeamName)) {
        setTeams(prev => [...prev, finalTeamName]);
        toast.success(`Created new team "${finalTeamName}" alongside member!`);
      }
    }

    const userObject = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      dept: newUser.dept,
      team: finalTeamName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
    };

    setTeamMembers(prev => [...prev, userObject]);
    setIsAddUserOpen(false);
    setNewUser({ 
      name: "", 
      email: "", 
      role: "employee", 
      title: "", 
      dept: "", 
      teamSelection: finalTeamName,
      newTeamName: "" 
    });
    toast.success(`${userObject.name} has been added to the ${finalTeamName} team!`);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTeam = newIndependentTeamName.trim();
    if (!cleanTeam) {
      toast.error("Please specify a team name.");
      return;
    }
    if (teams.includes(cleanTeam)) {
      toast.error("A team with this name already exists.");
      return;
    }
    setTeams(prev => [...prev, cleanTeam]);
    setIsCreateTeamOpen(false);
    setNewIndependentTeamName("");
    toast.success(`Team "${cleanTeam}" created successfully!`);
  };

  const cycleUserRole = (userId: string) => {
    setTeamMembers(prev => prev.map(m => {
      if (m.id === userId) {
        const roles = ["employee", "manager", "admin"];
        const nextIdx = (roles.indexOf(m.role) + 1) % roles.length;
        const nextRole = roles[nextIdx];
        toast.info(`Updated ${m.name}'s role to ${nextRole.toUpperCase()}`);
        return { ...m, role: nextRole };
      }
      return m;
    }));
  };

  // ── Render Helpers ────────────────────────────────────────────────
  const renderTabSwitcher = () => (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-3">
      {[
        { id: "overview", label: "Overview", icon: ShieldCheck },
        { id: "users", label: "Users & Teams", icon: UserPlus },
        { id: "cycles", label: "Cycles", icon: CalendarDays },
        { id: "audit", label: "Audit Logs", icon: History },
      ].map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn(
            "font-black text-[10px] uppercase tracking-widest px-5 h-9 rounded-lg transition-all gap-1.5",
            activeTab === tab.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-600 hover:text-white"
              : "text-immersive-muted hover:text-white hover:bg-white/5"
          )}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="size-3.5" />
          {tab.label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-immersive-text">Platform Governance</h1>
          <p className="text-immersive-muted font-medium">Global governance, user management, and cycle provision controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 glass-effect font-black text-[10px] uppercase tracking-widest px-6 h-11 text-immersive-text hover:bg-white/5" onClick={handleExportAudit}>
            <Download className="mr-2 size-4" /> Global Audit CSV
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 font-black text-[10px] uppercase tracking-widest px-8 h-11 shadow-xl shadow-indigo-600/20 text-white" onClick={() => toast.success("Broadcast message successfully queued for delivery.")}>
            <Send className="mr-2 size-4" /> System Broadcast
          </Button>
        </div>
      </div>

      {renderTabSwitcher()}

      {/* 🔮 1. OVERVIEW VIEW */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatWidget 
              title="Global Completion" 
              value={`${globalCompletion}%`} 
              description={`Across ${totalGoals} active goals`} 
              icon={Globe}
              trend={{ value: 8, isPositive: true }}
              color="indigo"
            />
            <StatWidget 
              title="Active Cycles" 
              value={String(cycles.length)} 
              description={activeCycle ? `${activeCycle.name} Open` : "No Active Cycle"} 
              icon={CalendarDays}
              color="blue"
            />
            <StatWidget 
              title="Pending Escalations" 
              value={String(escalationCount)} 
              description={escalationCount > 0 ? "Requires attention" : "All clear"} 
              icon={AlertTriangle}
              color="rose"
            />
            <StatWidget 
              title="System Health" 
              value="99.9%" 
              description="API latency: 45ms" 
              icon={Activity}
              color="emerald"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-effect border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4 bg-white/5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
                  <History className="size-4 text-indigo-400" />
                  Live Audit Logs Overview
                </CardTitle>
                <Button onClick={() => setActiveTab("audit")} variant="ghost" className="font-black text-[10px] text-indigo-400 uppercase tracking-widest hover:bg-transparent hover:text-indigo-300 px-0 h-auto">
                  View Historian <ChevronRight className="ml-1 size-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-b border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted py-4 pl-6">Initiator</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Action</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Delta</TableHead>
                      <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-immersive-muted pr-6">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.slice(0, 5).map((log, idx) => (
                      <TableRow key={idx} className="hover:bg-white/5 transition-colors border-b border-white/5">
                        <TableCell className="py-4 pl-6">
                          <span className="text-sm font-black text-immersive-text">{log.userName}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-immersive-muted shadow-none px-2 h-5 bg-white/5">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-immersive-muted line-through opacity-50">{log.beforeValue}</span>
                            <ChevronRight className="size-3 text-immersive-muted opacity-30" />
                            <span className="text-indigo-400 font-black">{log.afterValue}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">{new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6 flex flex-col">
              <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 py-4 bg-white/5">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-immersive-muted flex items-center gap-2">
                    <Activity className="size-4 text-indigo-400" />
                    Organization Pulse
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-6 flex justify-center">
                  <PulseScore score={76} previousScore={71} label="Org Health" size="md" />
                </CardContent>
              </Card>

              <Card className="border-white/5 glass-effect bg-indigo-600/10 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative group border flex-1">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                    <Play className="size-32" />
                 </div>
                 <CardHeader className="relative z-10 border-b border-white/5 bg-white/5">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Cycle Management</CardTitle>
                    <div className="text-xl font-black text-gradient mt-2 uppercase tracking-wide">
                      {activeCycle ? activeCycle.name : "NO ACTIVE CYCLE"}
                    </div>
                 </CardHeader>
                 <CardContent className="relative z-10 space-y-6 pt-6 flex-1 flex flex-col justify-between">
                    <p className="text-[11px] text-immersive-muted font-bold leading-relaxed uppercase tracking-wide">
                      {activeCycle ? (
                        <>Active duration: <span className="text-indigo-400 font-black">{new Date(activeCycle.startDate).toLocaleDateString()} to {new Date(activeCycle.endDate).toLocaleDateString()}</span>.</>
                      ) : (
                        <>Provision a new quarterly performance cycle to align organizational goals.</>
                      )}
                    </p>
                    <Button onClick={() => setActiveTab("cycles")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-transform mt-4">
                      Manage Cycles
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* 👥 2. USERS & TEAMS GOVERNANCE VIEW */}
      {activeTab === "users" && (
        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="border-b border-white/5 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-wider text-immersive-text">Users & Roster Management</CardTitle>
              <CardDescription className="text-xs text-immersive-muted font-bold mt-1 uppercase">Configure administrative credentials, manage organizational teams, and perform single-click impersonation.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateTeamOpen(true)} variant="outline" className="border-white/10 hover:bg-white/5 text-immersive-text font-black text-[10px] uppercase tracking-[0.2em] px-5 h-10 shrink-0">
                <Users className="mr-2 size-4" /> Create Team
              </Button>
              <Button onClick={() => setIsAddUserOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 px-6 h-10 shrink-0">
                <UserPlus className="mr-2 size-4" /> Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Teams Deck Selector Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Active Organization Teams ({teams.length})</h3>
                {selectedTeamFilter !== "all" && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedTeamFilter("all")} 
                    className="h-6 text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider p-0 bg-transparent hover:bg-transparent"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {teams.map((teamName) => {
                  const membersInTeam = teamMembers.filter((m) => m.team === teamName);
                  const isFiltered = selectedTeamFilter === teamName;

                  return (
                    <div 
                      key={teamName}
                      onClick={() => setSelectedTeamFilter(isFiltered ? "all" : teamName)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all duration-300 relative group overflow-hidden select-none",
                        isFiltered 
                          ? "bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10" 
                          : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                      )}
                    >
                      <div className="space-y-3">
                        <div>
                          <p className={cn("text-xs font-black uppercase tracking-wider", isFiltered ? "text-indigo-400" : "text-white")}>
                            {teamName}
                          </p>
                          <p className="text-[9px] text-immersive-muted font-bold uppercase tracking-widest mt-0.5">
                            {membersInTeam.length} {membersInTeam.length === 1 ? "Member" : "Members"}
                          </p>
                        </div>
                        {/* Avatar Pile */}
                        <div className="flex -space-x-2 overflow-hidden">
                          {membersInTeam.map((m) => (
                            <Avatar key={m.id} className="size-6 border border-[#0a0f1d] hover:translate-y-[-2px] transition-transform shrink-0">
                              <AvatarImage src={m.avatar} />
                              <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                      <div className={cn(
                        "absolute top-0 right-0 h-full w-1 transition-all duration-300",
                        isFiltered ? "bg-indigo-500" : "bg-transparent group-hover:bg-white/10"
                      )} />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-immersive-muted" />
                <Input 
                  placeholder="Search roster members by name or email..." 
                  value={userSearchTerm} 
                  onChange={(e) => setUserSearchTerm(e.target.value)} 
                  className="pl-10 bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs font-semibold h-10 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-immersive-muted tracking-wider shrink-0">Role Filter:</span>
                <select 
                  value={userRoleFilter} 
                  onChange={(e) => setUserRoleFilter(e.target.value)} 
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 h-10 text-xs text-white font-bold cursor-pointer focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Users Roster Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0a0f1d]/50">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-b border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted py-4 pl-6">Profile</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Email</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Team & Dept</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Role Badge (Click to Change)</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-immersive-muted pr-6">Controls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                      <TableCell className="py-4 pl-6 flex items-center gap-3">
                        <Avatar className="size-10 border border-white/10 shadow-lg">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-immersive-text">{member.name}</p>
                          <p className="text-[10px] text-immersive-muted font-bold uppercase tracking-wider">{member.title}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-white font-semibold">{member.email}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="border-white/10 text-indigo-400 text-[9px] font-black uppercase">
                            {member.team}
                          </Badge>
                          <p className="text-[9px] text-immersive-muted font-bold uppercase pl-1">{member.dept}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div onClick={() => cycleUserRole(member.id)} className="cursor-pointer">
                          <Badge 
                            className={cn(
                              "border-none shadow-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg",
                              member.role === 'admin' 
                                ? "bg-rose-500/10 text-rose-400" 
                                : member.role === 'manager' 
                                ? "bg-amber-500/10 text-amber-500" 
                                : "bg-indigo-500/10 text-indigo-400"
                            )}
                          >
                            {member.role.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-indigo-500/30 text-indigo-400 font-black uppercase tracking-wider hover:bg-indigo-500/10 text-[9px] px-3 h-8 rounded-lg"
                            onClick={() => {
                              impersonate(member.id);
                              toast.success(`Impersonating ${member.name} successfully!`, {
                                description: `You have temporarily assumed the credentials of ${member.name}.`
                              });
                            }}
                          >
                            Impersonate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📅 3. CYCLES VIEW */}
      {activeTab === "cycles" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Left panel: Active & Archived cycles */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 py-4 bg-white/5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-immersive-text flex items-center gap-2">
                  <CalendarDays className="size-4 text-indigo-400" />
                  Performance Cycle Registry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {cycles.length === 0 ? (
                  <p className="text-xs text-immersive-muted py-8 text-center font-bold">No performance cycles provisioned in database. Create one on the right!</p>
                ) : (
                  cycles.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className={cn("size-8 rounded-xl flex items-center justify-center text-[10px] font-black", c.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400")}>
                          {c.isActive ? <Check className="size-4" /> : <Clock className="size-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-wider">{c.name}</p>
                          <p className="text-[10px] text-immersive-muted font-bold">Schedule: {new Date(c.startDate).toLocaleDateString()} to {new Date(c.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge className={cn("border-none text-[9px] font-black uppercase tracking-widest px-3 h-6 rounded-lg", c.isActive ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-white/5 text-immersive-muted")}>
                        {c.isActive ? "ACTIVE CYCLE" : "ARCHIVED"}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Provision Cycle */}
          <Card className="glass-effect border-white/5 shadow-2xl h-fit">
            <CardHeader className="border-b border-white/5 py-4 bg-white/5">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-400">Provision Cycle</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Cycle Name *</Label>
                <Input placeholder="e.g. Q3 2026" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs font-semibold h-10 rounded-xl" value={newCycle.name} onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 h-[38px] cursor-pointer" onClick={() => setNewCycle({ ...newCycle, isActive: !newCycle.isActive })}>
                <input type="checkbox" checked={newCycle.isActive} onChange={() => {}} className="accent-indigo-600 size-4 cursor-pointer" />
                <Label className="text-[10px] font-black uppercase text-white cursor-pointer tracking-wider">Set as Active Cycle</Label>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Start Date *</Label>
                <Input type="date" className="bg-slate-900 border-white/10 text-white text-xs h-10 rounded-xl" value={newCycle.startDate} onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">End Date *</Label>
                <Input type="date" className="bg-slate-900 border-white/10 text-white text-xs h-10 rounded-xl" value={newCycle.endDate} onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })} />
              </div>
              <Button onClick={handleCreateCycle} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest py-6 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all mt-4">
                <Plus className="mr-2 size-4" /> Provision Cycle
              </Button>
            </CardContent>
          </Card>

        </div>
      )}

      {/* 📜 4. AUDIT LOGS SEARCH VIEW */}
      {activeTab === "audit" && (
        <Card className="glass-effect border-white/5 shadow-2xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="border-b border-white/5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-immersive-text flex items-center gap-2">
                <History className="size-4 text-indigo-400" />
                Global Audit Historian
              </CardTitle>
            </div>
            <Button onClick={handleExportAudit} className="border-white/10 glass-effect font-black text-[9px] uppercase tracking-widest px-4 h-9 text-white">
              <Download className="mr-2 size-3.5" /> Export Logs CSV
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Search Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-immersive-muted" />
                <Input 
                  placeholder="Search delta changes or initiator..." 
                  value={auditSearchTerm} 
                  onChange={(e) => setAuditSearchTerm(e.target.value)} 
                  className="pl-10 bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs font-semibold h-10 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-immersive-muted tracking-wider shrink-0">Action Type:</span>
                <select 
                  value={auditActionFilter} 
                  onChange={(e) => setAuditActionFilter(e.target.value)} 
                  className="bg-slate-900 border border-white/10 rounded-xl px-4 h-10 text-xs text-white font-bold cursor-pointer focus:outline-none"
                >
                  <option value="all">All Actions</option>
                  <option value="PATCH">PATCH</option>
                  <option value="CREATE">CREATE</option>
                  <option value="APPROVE">APPROVE</option>
                  <option value="REJECT">REJECT</option>
                </select>
              </div>
            </div>

            {/* Audit Table */}
            <div className="border border-white/5 rounded-xl overflow-hidden bg-[#0a0f1d]/50">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-b border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted py-4 pl-6">Initiator Name</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">Action</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-immersive-muted">State Delta (Before ➔ After)</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-immersive-muted pr-6">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.filter(log => {
                    const matchesSearch = log.userName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                                          (log.afterValue && log.afterValue.toLowerCase().includes(auditSearchTerm.toLowerCase()));
                    const matchesAction = auditActionFilter === "all" ? true : log.action === auditActionFilter;
                    return matchesSearch && matchesAction;
                  }).map((log, idx) => (
                    <TableRow key={idx} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <span className="text-sm font-black text-immersive-text">{log.userName}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/10 text-immersive-muted shadow-none px-2 h-5 bg-white/5">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-bold max-w-[400px] overflow-hidden truncate">
                          <span className="text-immersive-muted line-through opacity-50">{log.beforeValue}</span>
                          <ChevronRight className="size-3 text-immersive-muted opacity-30 shrink-0" />
                          <span className="text-indigo-400 font-black">{log.afterValue}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span className="text-[10px] font-black text-immersive-muted uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 👥 Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-[#090D16] text-white border-white/10 shadow-2xl">
          <form onSubmit={handleAddUserSubmit}>
            <div className="bg-indigo-600 p-6 text-white">
              <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
                <UserPlus className="size-5" /> Add Staff Member
              </DialogTitle>
              <DialogDescription className="text-indigo-100 font-medium text-xs mt-1">
                Provision a new staff account and associate it with a specific team.
              </DialogDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-immersive-muted">Full Name *</Label>
                <Input required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. Liam Neeson" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-immersive-muted">Email Address *</Label>
                <Input required type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="e.g. liam@novapulse.com" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-immersive-muted">Job Title *</Label>
                  <Input required value={newUser.title} onChange={(e) => setNewUser({ ...newUser, title: e.target.value })} placeholder="e.g. Lead Developer" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-immersive-muted">Department *</Label>
                  <Input required value={newUser.dept} onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })} placeholder="e.g. Engineering" className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-immersive-muted">Administrative Role *</Label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="bg-slate-900 border border-white/10 rounded-xl w-full h-10 text-xs text-white font-bold cursor-pointer focus:outline-none px-3">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Dynamic Assigned Team & Concurrent Team Creation Selector */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-immersive-muted">Assigned Team *</Label>
                <select 
                  value={newUser.teamSelection} 
                  onChange={(e) => setNewUser({ ...newUser, teamSelection: e.target.value })} 
                  className="bg-slate-900 border border-white/10 rounded-xl w-full h-10 text-xs text-white font-bold cursor-pointer focus:outline-none px-3"
                >
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="create_new">➕ Create New Team...</option>
                </select>
              </div>

              {newUser.teamSelection === "create_new" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <Label className="text-[10px] font-black uppercase text-indigo-400">New Team Name *</Label>
                  <Input 
                    required 
                    value={newUser.newTeamName} 
                    onChange={(e) => setNewUser({ ...newUser, newTeamName: e.target.value })} 
                    placeholder="e.g. Growth Marketing, Security Guild" 
                    className="bg-slate-900 border border-indigo-500/30 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" 
                  />
                </div>
              )}
            </div>
            <DialogFooter className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)} className="border-white/10 text-white font-bold">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Add Staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 👥 Create Team Dialog */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-[#090D16] text-white border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
          <form onSubmit={handleCreateTeamSubmit}>
            <div className="bg-indigo-600 p-6 text-white">
              <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
                <Users className="size-5" /> Create New Team
              </DialogTitle>
              <DialogDescription className="text-indigo-100 font-medium text-xs mt-1">
                Establish an independent team in the system registry.
              </DialogDescription>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-immersive-muted">Team Name *</Label>
                <Input 
                  required 
                  value={newIndependentTeamName} 
                  onChange={(e) => setNewIndependentTeamName(e.target.value)} 
                  placeholder="e.g. Platform Reliability, Product Design" 
                  className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl" 
                />
              </div>
            </div>
            <DialogFooter className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateTeamOpen(false)} className="border-white/10 text-white font-bold">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Create Team</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
