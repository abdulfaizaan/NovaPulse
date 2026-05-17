/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import { UserRole } from "./types";
import { EmployeeDashboard } from "./views/EmployeeDashboard";
import { ManagerDashboard } from "./views/ManagerDashboard";
import { AdminDashboard } from "./views/AdminDashboard";
import { GoalCreationModal } from "./components/goals/GoalCreationModal";
import { OnboardingTour } from "./components/onboarding/OnboardingTour";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import { AccessRestricted } from "./components/layout/AccessRestricted";
import { AIAssistant } from "./components/ai/AIAssistant";
import { NotificationCenter } from "./components/notifications/NotificationCenter";
import { EnterpriseSearch } from "./components/search/EnterpriseSearch";
import { AlignmentTree } from "./components/alignment/AlignmentTree";
import { GoalDependencyGraph } from "./components/goals/GoalDependencyGraph";
import { OneOnOneWorkspace } from "./components/meetings/OneOnOneWorkspace";
import { CapacityPlanning } from "./components/capacity/CapacityPlanning";
import { GoalVersionHistory } from "./components/goals/GoalVersionHistory";
import { EscalationEngine } from "./components/escalations/EscalationEngine";
import { AdvancedAnalytics } from "./components/analytics/AdvancedAnalytics";
import { KPIForecasting } from "./components/analytics/KPIForecasting";
import { AIQuarterlyReview } from "./components/ai/AIQuarterlyReview";
import { ContinuousFeedback } from "./components/feedback/ContinuousFeedback";
import { QuarterlyCheckinPage } from "./components/goals/QuarterlyCheckinPage";
import { ManagerApprovalView } from "./components/goals/ManagerApprovalView";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Search, Bell, HelpCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthPage } from "./components/auth/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

type AppView = "landing" | "auth" | "app";

import { useWebSocket } from "./hooks/useWebSocket";
import { useGoalStore } from "./stores/goalStore";

/* ================================================================== */
/*  Inner app shell (consumes AuthContext)                             */
/* ================================================================== */
function AppShell() {
  const { user, effectiveRole, logout, hasPermission, impersonate, stopImpersonation } = useAuth();
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [showTour, setShowTour] = React.useState(false);
  const [showAI, setShowAI] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  
  const { fetchGoals, fetchAuditLogs } = useGoalStore();

  useWebSocket(user?.id || null, (event) => {
    // When a websocket event fires, refresh goals to sync UI
    fetchGoals();
    if (effectiveRole === "admin") {
      fetchAuditLogs();
    }
  });

  React.useEffect(() => {
    if (!user) return;
    fetchGoals(); // initial fetch
    if (effectiveRole === "admin") {
      fetchAuditLogs();
    }
    const hasSeenTour = localStorage.getItem("novapulse_tour_seen");
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1500);
    }
  }, [user, effectiveRole]);

  const handleGoalSubmit = (data: any) => {
    setIsGoalModalOpen(false);
    toast.success("Goal submitted successfully!", {
      description: "Your manager will be notified of the new draft.",
    });
  };

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem("novapulse_tour_seen", "true");
    toast.info("Onboarding complete!", {
      description: "You can restart the tour anytime from Help.",
    });
  };

  const handleNavigate = (id: string) => {
    // AI Assistant is a panel, not a page
    if (id === "ai-assistant") {
      setShowAI(true);
      return;
    }
    setActiveTab(id);
    setShowAI(false);
    setShowNotifications(false);
  };

  /* ── Route-level RBAC ─────────────────────────────── */
  const renderContent = () => {
    // Pages that need specific permissions
    const adminOnlyPages = ["users", "cycles", "audit", "escalations", "settings", "adv-analytics"];
    const managerPages = ["team-goals", "approvals", "capacity", "ai-review"];

    if (adminOnlyPages.includes(activeTab) && effectiveRole !== "admin") {
      return <AccessRestricted requiredRole="admin" onGoBack={() => setActiveTab("dashboard")} />;
    }

    if (managerPages.includes(activeTab) && effectiveRole === "employee") {
      return <AccessRestricted requiredRole="manager" onGoBack={() => setActiveTab("dashboard")} />;
    }

    if (activeTab === "dashboard") {
      switch (effectiveRole) {
        case "manager":
          return <ManagerDashboard />;
        case "admin":
          return <AdminDashboard />;
        default:
          return <EmployeeDashboard onAddGoal={() => setIsGoalModalOpen(true)} onOpenAI={() => setShowAI(true)} />;
      }
    }

    switch (activeTab) {
      case "goals":
        return <EmployeeDashboard onAddGoal={() => setIsGoalModalOpen(true)} onOpenAI={() => setShowAI(true)} />;
      case "team-goals":
        return <ManagerDashboard />;
      case "alignment":
        return <AlignmentTree />;
      case "dependency-graph":
        return <GoalDependencyGraph />;
      case "1on1":
        return <OneOnOneWorkspace />;
      case "capacity":
        return <CapacityPlanning />;
      case "escalations":
        return <EscalationEngine />;
      case "analytics":
        return <AdvancedAnalytics />;
      case "adv-analytics":
        return (
          <div className="space-y-8">
            <AdvancedAnalytics />
            <KPIForecasting />
          </div>
        );
      case "ai-review":
        return <AIQuarterlyReview />;
      case "feedback":
        return <ContinuousFeedback />;
      // History could be opened from a goal card, but let's keep it accessible
      case "history":
        return <GoalVersionHistory />;
      case "checkins":
        return <QuarterlyCheckinPage />;
      case "approvals":
        return <ManagerApprovalView />;
      case "users":
        return <AdminDashboard initialTab="users" />;
      case "cycles":
        return <AdminDashboard initialTab="cycles" />;
      case "audit":
        return <AdminDashboard initialTab="audit" />;
      case "settings":
        return <AdminDashboard initialTab="settings" />;
    }

    // Placeholder for non-dashboard pages
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="size-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-immersive-muted">
          <Search className="size-10" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-immersive-text uppercase tracking-widest">
            Module Active
          </h3>
          <p className="text-sm text-immersive-muted max-w-[300px] font-medium">
            The <span className="text-indigo-400 font-bold">{activeTab}</span> module is integrated and optimized for your workflow.
          </p>
        </div>
        <Button
          variant="outline"
          className="glass-effect text-immersive-text border-white/10 font-bold"
          onClick={() => setActiveTab("dashboard")}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar
        role={effectiveRole}
        activeId={activeTab}
        onNavigate={handleNavigate}
        user={user}
        onLogout={logout}
        impersonating={user.impersonating}
        onStopImpersonation={stopImpersonation}
      />
      <SidebarInset className="bg-immersive-gradient min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-4 px-6 sticky top-0 z-30 justify-between glass-effect rounded-none border-t-0 border-x-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger id="sidebar-trigger" className="-ml-1 text-immersive-text" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
            <div id="search-bar" className="flex-1 max-w-xl relative group hidden md:block cursor-pointer" onClick={() => setShowSearch(true)}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-immersive-muted" />
              <div className="pl-10 h-10 bg-white/5 border border-white/10 text-immersive-muted flex items-center rounded-full w-[300px] text-sm font-medium hover:bg-white/10 transition-all">
                Search goals, people...
                <kbd className="ml-auto mr-3 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-500">⌘K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div id="cycle-indicator" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-immersive-muted uppercase tracking-widest">
                Q2 2026 Cycle
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full hover:bg-indigo-500/10 text-indigo-400"
              onClick={() => {
                setShowAI(!showAI);
                setShowNotifications(false);
              }}
            >
              <Sparkles className="size-5" />
            </Button>
            <ThemeToggle />
            <Button
              id="notification-bell"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full relative hover:bg-white/10"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowAI(false);
              }}
            >
              <Bell className="size-5 text-immersive-text" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-indigo-500 rounded-full border-2 border-[var(--immersive-bg)]" />
            </Button>
            <Button
              id="help-button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full hover:bg-white/10"
              onClick={() => setShowTour(true)}
            >
              <HelpCircle className="size-5 text-immersive-text" />
            </Button>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full relative">
          <React.Suspense fallback={<div className="text-immersive-muted">Loading...</div>}>
            {renderContent()}
          </React.Suspense>
        </main>
      </SidebarInset>

      <GoalCreationModal
        open={isGoalModalOpen}
        onOpenChange={setIsGoalModalOpen}
        onSubmit={handleGoalSubmit}
      />

      <AIAssistant
        open={showAI}
        onClose={() => setShowAI(false)}
        onApplySuggestion={(s) => {
          setShowAI(false);
          setIsGoalModalOpen(true);
          toast.success("AI suggestion applied!", {
            description: `Goal "${s.title}" loaded into the creator.`,
          });
        }}
      />

      <NotificationCenter open={showNotifications} onClose={() => setShowNotifications(false)} />

      <EnterpriseSearch open={showSearch} onClose={() => setShowSearch(false)} />

      {showTour && <OnboardingTour onComplete={handleTourComplete} />}

      <Toaster position="bottom-right" />
    </SidebarProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = React.useState<AppView>(() => {
    return sessionStorage.getItem("novapulse_auth") === "true" ? "app" : "landing";
  });

  const ThemeProviderAny = ThemeProvider as any;

  // Automatically handle redirection when auth state changes (e.g. on sign out)
  React.useEffect(() => {
    if (!user && view === "app") {
      setView("landing");
    } else if (user && view !== "app") {
      setView("app");
    }
  }, [user, view]);

  /* ── Landing page ── */
  if (view === "landing") {
    return (
      <>
        <LandingPage onGetStarted={() => setView("auth")} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  /* ── Auth page ── */
  if (view === "auth") {
    return (
      <>
        <AuthPageWrapper onComplete={() => setView("app")} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  /* ── Main application ── */
  return (
    <ThemeProviderAny attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <AppShell />
      </TooltipProvider>
    </ThemeProviderAny>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

/* ── Small wrapper to connect AuthPage ↔ AuthContext ── */
function AuthPageWrapper({ onComplete }: { onComplete: () => void }) {
  const { login, loginWithToken } = useAuth();

  return (
    <AuthPage
      onAuth={async (email, role, token) => {
        if (token) {
          await loginWithToken(token);
        } else {
          login(email, "password", role as UserRole);
        }
        onComplete();
        toast.success("Welcome to NovaPulse!", {
          description: "You're now signed in. Let's get started.",
        });
      }}
    />
  );
}
