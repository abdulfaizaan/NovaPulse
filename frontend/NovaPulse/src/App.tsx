/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/AppSidebar";
import { CURRENT_USER } from "./constants";
import { UserRole } from "./types";
import { EmployeeDashboard } from "./views/EmployeeDashboard";
import { ManagerDashboard } from "./views/ManagerDashboard";
import { AdminDashboard } from "./views/AdminDashboard";
import { GoalCreationModal } from "./components/goals/GoalCreationModal";
import { OnboardingTour } from "./components/onboarding/OnboardingTour";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthPage } from "./components/auth/AuthPage";

type AppView = 'landing' | 'auth' | 'app';

export default function App() {
  // Auth gating — check sessionStorage for persisted login
  const [view, setView] = React.useState<AppView>(() => {
    return sessionStorage.getItem("novapulse_auth") === "true" ? "app" : "landing";
  });

  const [role, setRole] = React.useState<UserRole>('employee');
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isGoalModalOpen, setIsGoalModalOpen] = React.useState(false);
  const [showTour, setShowTour] = React.useState(false);

  // Auto-show tour for first time users (only in app view)
  React.useEffect(() => {
    if (view !== "app") return;
    const hasSeenTour = localStorage.getItem("novapulse_tour_seen");
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1500);
    }
  }, [view]);

  const handleAuth = () => {
    sessionStorage.setItem("novapulse_auth", "true");
    setView("app");
    toast.success("Welcome to NovaPulse!", {
      description: "You're now signed in. Let's get started.",
    });
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab('dashboard');
    toast.success(`Switched to ${newRole} view`);
  };

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

  const renderContent = () => {
    if (activeTab !== 'dashboard') {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
           <div className="size-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-immersive-muted">
              <Search className="size-10" />
           </div>
           <div className="space-y-1">
             <h3 className="text-lg font-black text-immersive-text uppercase tracking-widest">Module Integrated</h3>
             <p className="text-sm text-immersive-muted max-w-[300px] font-medium">The {activeTab} view is currently being optimized for your workflow.</p>
           </div>
           <Button variant="outline" className="glass-effect text-immersive-text border-white/10 font-bold" onClick={() => setActiveTab('dashboard')}>Return to Dashboard</Button>
        </div>
      );
    }

    switch (role) {
      case 'manager': return <ManagerDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <EmployeeDashboard onAddGoal={() => setIsGoalModalOpen(true)} />;
    }
  };

  const ThemeProviderAny = ThemeProvider as any;

  /* ── Landing page (unauthenticated) ── */
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
        <AuthPage onAuth={handleAuth} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  /* ── Main application (authenticated) ── */
  return (
    <ThemeProviderAny attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar 
            role={role} 
            activeId={activeTab} 
            onNavigate={setActiveTab} 
            user={CURRENT_USER}
            onRoleSwitch={handleRoleSwitch}
          />
          <SidebarInset className="bg-immersive-gradient min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-4 px-6 sticky top-0 z-30 justify-between glass-effect rounded-none border-t-0 border-x-0">
              <div className="flex items-center gap-4">
                <SidebarTrigger id="sidebar-trigger" className="-ml-1 text-immersive-text" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                <div id="search-bar" className="flex-1 max-w-xl relative group hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-immersive-muted group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search goals, people, and metrics..." 
                    className="pl-10 h-10 bg-white/5 border-white/10 text-immersive-text group-focus-within:bg-white/10 group-focus-within:ring-2 group-focus-within:ring-primary/20 transition-all font-medium py-2 rounded-full w-[300px]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div id="cycle-indicator" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-immersive-muted uppercase tracking-widest">Q2 2026 Cycle</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button id="notification-bell" variant="ghost" size="icon" className="size-10 rounded-full relative hover:bg-white/10">
                    <Bell className="size-5 text-immersive-text" />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-indigo-500 rounded-full border-2 border-[var(--immersive-bg)]" />
                  </Button>
                  <Button id="help-button" variant="ghost" size="icon" className="size-10 rounded-full hover:bg-white/10" onClick={() => setShowTour(true)}>
                    <HelpCircle className="size-5 text-immersive-text" />
                  </Button>
                </div>
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

          {showTour && <OnboardingTour onComplete={handleTourComplete} />}
          
          <Toaster position="bottom-right" />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProviderAny>
  );
}


