/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { 
  LayoutDashboard, 
  Target, 
  CheckCircle2, 
  Bell, 
  User, 
  BarChart3, 
  Users, 
  Settings, 
  History, 
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { UserRole } from "@/src/types";
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

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  id: string;
}

const EMPLOYEE_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "My Goals", icon: Target, id: "goals" },
  { title: "Quarterly Check-ins", icon: CheckCircle2, id: "checkins" },
  { title: "Notifications", icon: Bell, id: "notifications" },
];

const MANAGER_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Team Goals", icon: Users, id: "team-goals" },
  { title: "Approvals", icon: CheckCircle2, id: "approvals" },
  { title: "Analytics", icon: BarChart3, id: "analytics" },
];

const ADMIN_ITEMS: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Cycles", icon: CalendarDays, id: "cycles" },
  { title: "Audit Logs", icon: History, id: "audit" },
  { title: "Escalations", icon: AlertCircle, id: "escalations" },
  { title: "Settings", icon: Settings, id: "settings" },
];

interface AppSidebarProps {
  role: UserRole;
  activeId: string;
  onNavigate: (id: string) => void;
  user: { name: string; avatar?: string; email: string };
  onRoleSwitch: (role: UserRole) => void;
}

export function AppSidebar({ role, activeId, onNavigate, user, onRoleSwitch }: AppSidebarProps) {
  const items = role === 'admin' ? ADMIN_ITEMS : role === 'manager' ? MANAGER_ITEMS : EMPLOYEE_ITEMS;

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="glass-effect border-r-white/5 ring-0">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">N</div>
          <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden text-gradient">NovaPulse</span>
        </div>
      </SidebarHeader>
      <SidebarContent id="sidebar-navigation">
        <SidebarGroup>
          <SidebarGroupLabel className="text-immersive-muted font-black text-[10px] uppercase tracking-widest px-4 mb-2">Platform</SidebarGroupLabel>
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
                  <item.icon className={cn("size-4.5", activeId === item.id && "text-indigo-400")} />
                  <span className="text-sm">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4 mx-4 bg-white/5" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-immersive-muted font-black text-[10px] uppercase tracking-widest px-4 mb-2">Switch View</SidebarGroupLabel>
          <SidebarMenu className="px-2">
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onRoleSwitch('employee')} 
                isActive={role === 'employee'} 
                tooltip="Employee Mode"
                className={cn(
                  "transition-all duration-300 h-9 px-4 rounded-lg mb-1",
                  role === 'employee' ? "text-indigo-400 font-bold" : "text-immersive-muted"
                )}
              >
                <User className="size-4" />
                <span className="text-xs">Employee Mode</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onRoleSwitch('manager')} 
                isActive={role === 'manager'} 
                tooltip="Manager Mode"
                className={cn(
                  "transition-all duration-300 h-9 px-4 rounded-lg mb-1",
                  role === 'manager' ? "text-indigo-400 font-bold" : "text-immersive-muted"
                )}
              >
                <Users className="size-4" />
                <span className="text-xs">Manager Mode</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onRoleSwitch('admin')} 
                isActive={role === 'admin'} 
                tooltip="Admin Mode"
                className={cn(
                  "transition-all duration-300 h-9 px-4 rounded-lg mb-1",
                  role === 'admin' ? "text-indigo-400 font-bold" : "text-immersive-muted"
                )}
              >
                <Settings className="size-4" />
                <span className="text-xs">Admin Mode</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-8 border-2 border-indigo-500/50">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold truncate text-immersive-text">{user.name}</span>
            <span className="text-[9px] text-indigo-400 truncate uppercase tracking-tighter font-black">{role}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
