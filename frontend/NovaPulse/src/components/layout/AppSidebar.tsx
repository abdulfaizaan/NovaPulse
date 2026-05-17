/**
 * AppSidebar — RBAC-aware sidebar navigation.
 * 
 * Shows only the navigation items the user's role permits.
 * No manual role switching (removed). Admin impersonation is handled
 * separately via the AuthContext.
 */

import * as React from "react";
import {
  LayoutDashboard,
  Target,
  CheckCircle2,
  Bell,
  BarChart3,
  Users,
  Settings,
  History,
  AlertCircle,
  CalendarDays,
  Sparkles,
  Search,
  ShieldCheck,
  LogOut,
  UserCircle,
  Zap,
  Layers,
  GitBranch,
  MessageSquareHeart,
  MessageSquare,
  Activity,
  FileText,
  ShieldAlert,
  LineChart,
} from "lucide-react";
import { UserRole } from "@/src/types";
import { useGoalStore } from "@/src/stores/goalStore";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  id: string;
  badge?: string;
}

const EMPLOYEE_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "My Goals", icon: Target, id: "goals" },
  { title: "Quarterly Check-ins", icon: CheckCircle2, id: "checkins" },
  { title: "Alignment Tree", icon: Layers, id: "alignment" },
  { title: "Goal Graph", icon: GitBranch, id: "dependency-graph" },
  { title: "1-on-1 Workspace", icon: MessageSquare, id: "1on1" },
  { title: "Continuous Feedback", icon: MessageSquareHeart, id: "feedback" },
  { title: "Analytics", icon: BarChart3, id: "analytics" },
  { title: "AI Assistant", icon: Sparkles, id: "ai-assistant" },
];

const MANAGER_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "My Goals", icon: Target, id: "goals" },
  { title: "Team Goals", icon: Users, id: "team-goals" },
  { title: "1-on-1 Workspace", icon: MessageSquare, id: "1on1" },
  { title: "Capacity Planning", icon: Activity, id: "capacity" },
  { title: "Approvals", icon: CheckCircle2, id: "approvals", badge: "3" },
  { title: "AI Quarterly Review", icon: FileText, id: "ai-review" },
  { title: "Analytics", icon: BarChart3, id: "analytics" },
  { title: "AI Assistant", icon: Sparkles, id: "ai-assistant" },
];

const ADMIN_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Users & Teams", icon: Users, id: "users" },
  { title: "Cycles", icon: CalendarDays, id: "cycles" },
  { title: "Alignment Tree", icon: Layers, id: "alignment" },
  { title: "Escalations", icon: ShieldAlert, id: "escalations" },
  { title: "Advanced Analytics", icon: LineChart, id: "adv-analytics" },
  { title: "Audit Logs", icon: History, id: "audit" },
  { title: "Settings", icon: Settings, id: "settings" },
  { title: "AI Assistant", icon: Sparkles, id: "ai-assistant" },
];

interface AppSidebarProps {
  role: UserRole;
  activeId: string;
  onNavigate: (id: string) => void;
  user: { id?: string; name: string; avatar?: string; email: string };
  onLogout?: () => void;
  impersonating?: { name: string; role: UserRole } | null;
  onStopImpersonation?: () => void;
}

export function AppSidebar({
  role,
  activeId,
  onNavigate,
  user,
  onLogout,
  impersonating,
  onStopImpersonation,
}: AppSidebarProps) {
  const { getPendingApprovals } = useGoalStore();
  const pendingCount = getPendingApprovals(user?.id || '').length;

  const items = React.useMemo(() => {
    const rawItems = role === "admin"
      ? ADMIN_ITEMS
      : role === "manager"
      ? MANAGER_ITEMS
      : EMPLOYEE_ITEMS;

    return rawItems.map(item => {
      if (item.id === "approvals") {
        return { ...item, badge: pendingCount > 0 ? String(pendingCount) : undefined };
      }
      return item;
    });
  }, [role, pendingCount]);

  const roleBadge =
    role === "admin"
      ? { label: "Admin", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
      : role === "manager"
      ? { label: "Manager", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
      : { label: "Employee", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="glass-effect border-r-white/5 ring-0"
    >
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden text-gradient">
            NovaPulse
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent id="sidebar-navigation">
        {/* Impersonation banner */}
        {impersonating && (
          <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Impersonating
                </span>
              </div>
              <button
                onClick={onStopImpersonation}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline"
              >
                Stop
              </button>
            </div>
            <p className="text-[10px] text-amber-400/70 mt-0.5 font-medium">
              {impersonating.name} ({impersonating.role})
            </p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-immersive-muted font-black text-[10px] uppercase tracking-widest px-4 mb-2">
            Platform
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeId === item.id}
                  onClick={() => onNavigate(item.id)}
                  tooltip={item.title}
                  className={cn(
                    "transition-all duration-300 h-10 px-4 rounded-lg mb-1",
                    activeId === item.id
                      ? "bg-white/10 text-indigo-400 font-bold border border-white/10 shadow-sm shadow-indigo-500/10"
                      : "text-immersive-muted hover:text-immersive-text hover:bg-white/5"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4.5",
                      activeId === item.id && "text-indigo-400"
                    )}
                  />
                  <span className="text-sm flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge className="h-5 px-1.5 text-[9px] bg-indigo-600 text-white border-0 font-bold ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-white/5 bg-white/[0.02] space-y-2">
        {/* User info */}
        <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-8 border-2 border-indigo-500/50">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold truncate text-immersive-text">
              {user.name}
            </span>
            <Badge
              className={`w-fit h-4 px-1.5 text-[8px] font-bold ${roleBadge.color} uppercase tracking-wider`}
            >
              {roleBadge.label}
            </Badge>
          </div>
        </div>
        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors group-data-[collapsible=icon]:justify-center"
          >
            <LogOut className="size-3.5" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
