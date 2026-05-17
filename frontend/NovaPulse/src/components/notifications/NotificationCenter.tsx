import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Bell,
  Check,
  CheckCheck,
  Target,
  AlertTriangle,
  Clock,
  MessageSquare,
  Shield,
  BellOff,
  Filter,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "approval" | "reminder" | "escalation" | "system" | "feedback";
  isRead: boolean;
  timestamp: string;
  priority: "low" | "medium" | "high";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Goal Approved",
    message: "Sarah Chen approved your goal 'Modernize Enterprise Design System'",
    type: "approval",
    isRead: false,
    timestamp: "2 min ago",
    priority: "high",
  },
  {
    id: "n2",
    title: "Check-in Reminder",
    message: "Q2 quarterly check-in is due in 3 days. Update your achievements.",
    type: "reminder",
    isRead: false,
    timestamp: "1 hour ago",
    priority: "medium",
  },
  {
    id: "n3",
    title: "Escalation Alert",
    message: "Accessibility Compliance goal is overdue. Manager has been notified.",
    type: "escalation",
    isRead: false,
    timestamp: "3 hours ago",
    priority: "high",
  },
  {
    id: "n4",
    title: "Peer Feedback",
    message: "David Kim left recognition: 'Outstanding UX work on the onboarding flow!'",
    type: "feedback",
    isRead: true,
    timestamp: "Yesterday",
    priority: "low",
  },
  {
    id: "n5",
    title: "System Update",
    message: "NovaPulse v2.0 is live with AI Goal Architect and enhanced analytics.",
    type: "system",
    isRead: true,
    timestamp: "2 days ago",
    priority: "low",
  },
  {
    id: "n6",
    title: "Rework Requested",
    message: "Sarah Chen requested changes on 'Team Mentorship Program' — please review comments.",
    type: "approval",
    isRead: false,
    timestamp: "4 hours ago",
    priority: "high",
  },
];

const TYPE_CONFIG = {
  approval: { icon: Check, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  reminder: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  escalation: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
  system: { icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
  feedback: { icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
};

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<string>("all");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-6 top-20 bottom-6 w-[400px] z-50 flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40"
        style={{ background: "rgba(10, 15, 30, 0.95)", backdropFilter: "blur(40px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/20 flex items-center justify-center">
              <Bell className="size-4.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <p className="text-[10px] text-slate-500 font-semibold">
                {unreadCount} unread
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-7 px-2 text-[10px] text-slate-400 hover:text-white hover:bg-white/5 font-semibold"
            >
              <CheckCheck className="size-3 mr-1" />
              Mark all
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-white/5 text-slate-400"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.04] overflow-x-auto">
          {["all", "unread", "approval", "reminder", "escalation", "feedback"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <BellOff className="size-10 text-slate-700 mb-3" />
              <p className="text-sm text-slate-500 font-medium">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((n) => {
                const config = TYPE_CONFIG[n.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => markRead(n.id)}
                    className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-white/[0.02] ${
                      !n.isRead ? "bg-indigo-500/[0.03]" : ""
                    }`}
                  >
                    <div className={`size-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`size-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`text-sm font-semibold truncate ${!n.isRead ? "text-white" : "text-slate-400"}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && <div className="size-1.5 rounded-full bg-indigo-500 shrink-0" />}
                        {n.priority === "high" && (
                          <Badge className="h-4 px-1.5 text-[8px] bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold">
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-600 font-medium mt-1 block">{n.timestamp}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
