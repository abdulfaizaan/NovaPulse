/**
 * NovaPulse Goal Store — Zustand-powered state management
 * Single source of truth for all goal data, replacing mock constants
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, GoalStatus, GoalProgressStatus, UnitOfMeasure, QuarterlyCheckin, AuditLogEntry, ApprovalRequest, Notification } from '../types';
import { calculateProgressScore, UOM_OPTIONS } from '../types';

// ── Seed Data (realistic demo) ─────────────────────────────
const SEED_GOALS: Goal[] = [
  {
    id: 'g1', title: 'Modernize Enterprise Design System', description: 'Lead the migration to NovaPulse branding guidelines across all customer-facing products.',
    thrustArea: 'Product Excellence', uom: 'percentage-min', uomLabel: 'Components Migrated %', target: 100, achievement: 65, weightage: 30,
    status: 'locked', progressStatus: 'on-track', progressScore: 65, deadline: '2026-06-30', ownerId: 'u1', ownerName: 'Alex Rivera',
    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-05-15T14:30:00Z', lockedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'g2', title: 'Accessibility Compliance Audit', description: 'Full audit and remediation to meet WCAG 2.1 AA standards.',
    thrustArea: 'Engineering Quality', uom: 'numeric-min', uomLabel: 'Compliance Score', target: 100, achievement: 25, weightage: 20,
    status: 'locked', progressStatus: 'delayed', progressScore: 25, deadline: '2026-05-15', ownerId: 'u1', ownerName: 'Alex Rivera',
    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-05-14T16:00:00Z', lockedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'g3', title: 'Customer Onboarding Flow Optimization', description: 'Reduce time-to-value for new enterprise customers by 15%.',
    thrustArea: 'Customer Success', uom: 'numeric-max', uomLabel: 'Avg Onboarding Time (days)', target: 15, achievement: 15, weightage: 25,
    status: 'locked', progressStatus: 'completed', progressScore: 100, deadline: '2026-03-31', ownerId: 'u1', ownerName: 'Alex Rivera',
    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-03-28T11:00:00Z', lockedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'g4', title: 'Team Mentorship Program', description: 'Guide junior designers through Q2 with bi-weekly feedback sessions.',
    thrustArea: 'People & Culture', uom: 'numeric-min', uomLabel: 'Sessions Completed', target: 12, achievement: 8, weightage: 25,
    status: 'locked', progressStatus: 'on-track', progressScore: 67, deadline: '2026-06-30', ownerId: 'u1', ownerName: 'Alex Rivera',
    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-05-14T09:00:00Z', lockedAt: '2026-05-05T10:00:00Z',
  },
  // Team member goals (for manager view)
  {
    id: 'g5', title: 'API Response Time Optimization', description: 'Reduce p95 latency below 200ms for all critical endpoints.',
    thrustArea: 'Engineering Quality', uom: 'numeric-max', uomLabel: 'p95 Latency (ms)', target: 200, achievement: 180, weightage: 35,
    status: 'locked', progressStatus: 'on-track', progressScore: 100, deadline: '2026-06-30', ownerId: 'u4', ownerName: 'Jordan Smith',
    createdAt: '2026-05-02T09:00:00Z', updatedAt: '2026-05-14T10:00:00Z', lockedAt: '2026-05-06T10:00:00Z',
  },
  {
    id: 'g6', title: 'Zero Critical Security Incidents', description: 'Maintain zero critical vulnerabilities in production.',
    thrustArea: 'Compliance & Governance', uom: 'zero-based', uomLabel: 'Critical Incidents', target: 0, achievement: 0, weightage: 30,
    status: 'locked', progressStatus: 'completed', progressScore: 100, deadline: '2026-06-30', ownerId: 'u4', ownerName: 'Jordan Smith',
    createdAt: '2026-05-02T09:00:00Z', updatedAt: '2026-05-14T10:00:00Z', lockedAt: '2026-05-06T10:00:00Z',
  },
  {
    id: 'g7', title: 'User Research Study Completion', description: 'Complete 20 user interviews for the Q3 product roadmap.',
    thrustArea: 'Customer Success', uom: 'numeric-min', uomLabel: 'Interviews Completed', target: 20, achievement: 8, weightage: 40,
    status: 'submitted', progressStatus: 'delayed', progressScore: 40, deadline: '2026-06-15', ownerId: 'u5', ownerName: 'Mila Chen',
    createdAt: '2026-05-03T09:00:00Z', updatedAt: '2026-05-14T10:00:00Z', lockedAt: null,
  },
  {
    id: 'g8', title: 'Quarterly Revenue Target', description: 'Achieve $2.5M in new ARR from enterprise segment.',
    thrustArea: 'Strategic Growth', uom: 'numeric-min', uomLabel: 'Revenue ($M)', target: 2.5, achievement: 2.3, weightage: 50,
    status: 'locked', progressStatus: 'on-track', progressScore: 92, deadline: '2026-06-30', ownerId: 'u6', ownerName: 'Oscar Wilde',
    createdAt: '2026-05-02T09:00:00Z', updatedAt: '2026-05-15T08:00:00Z', lockedAt: '2026-05-06T10:00:00Z',
  },
];

const SEED_CHECKINS: QuarterlyCheckin[] = [
  { id: 'ci1', goalId: 'g1', goalTitle: 'Modernize Enterprise Design System', employeeId: 'u1', cycleId: 'c1', cycleName: 'Q1 2026',
    plannedTarget: 50, actualAchievement: 45, progressStatus: 'on-track', notes: 'On track. Migrated core components. Typography and color tokens remaining.',
    completionPercentage: 90, createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z' },
  { id: 'ci2', goalId: 'g2', goalTitle: 'Accessibility Compliance Audit', employeeId: 'u1', cycleId: 'c1', cycleName: 'Q1 2026',
    plannedTarget: 50, actualAchievement: 20, progressStatus: 'delayed', notes: 'Behind schedule due to tooling issues. Need JAWS license.',
    completionPercentage: 40, managerComment: 'Lets discuss blockers in our 1:1. Will escalate license request.', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-02T14:00:00Z' },
];

const SEED_AUDIT: AuditLogEntry[] = [
  { id: 'a1', userId: 'u2', userName: 'Sarah Chen', entityType: 'GOAL', entityId: 'g1', action: 'APPROVED', fieldChanged: 'Status', beforeValue: 'Submitted', afterValue: 'Approved', timestamp: '2026-05-05T10:00:00Z' },
  { id: 'a2', userId: 'u2', userName: 'Sarah Chen', entityType: 'GOAL', entityId: 'g7', action: 'REWORK', fieldChanged: 'Status', beforeValue: 'Submitted', afterValue: 'Rework Requested', timestamp: '2026-05-14T11:30:00Z' },
  { id: 'a3', userId: 'u3', userName: 'James Mitchell', entityType: 'CYCLE', entityId: 'c1', action: 'CREATED', beforeValue: 'N/A', afterValue: 'Open', timestamp: '2026-05-01T08:00:00Z' },
  { id: 'a4', userId: 'u3', userName: 'James Mitchell', entityType: 'GOAL', entityId: 'g2', action: 'UNLOCKED', fieldChanged: 'Locked', beforeValue: 'True', afterValue: 'False', timestamp: '2026-05-14T16:00:00Z' },
];

// ── Store Interface ─────────────────────────────
interface GoalStore {
  goals: Goal[];
  checkins: QuarterlyCheckin[];
  auditLogs: AuditLogEntry[];
  notifications: Notification[];

  // Fetching
  fetchGoals: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchGoalCheckins: (goalId: string) => Promise<void>;

  // Goal CRUD
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progressScore'>) => Goal;
  createSharedGoal: (data: any) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Goal Workflow
  submitGoal: (id: string) => void;
  approveGoal: (id: string, managerId: string) => void;
  rejectGoal: (id: string, managerId: string, comment: string) => void;
  requestRework: (id: string, managerId: string, comment: string) => void;
  lockGoal: (id: string) => void;
  unlockGoal: (id: string, adminId: string) => void;

  // Check-ins
  addCheckin: (checkin: Omit<QuarterlyCheckin, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addManagerComment: (checkinId: string, comment: string) => void;
  reviewCheckin: (checkinId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', comment?: string) => Promise<void>;

  // Queries
  getGoalsByOwner: (ownerId: string) => Goal[];
  getGoalsByManager: (managerId: string) => Goal[];
  getPendingApprovals: (managerId: string) => Goal[];
  getCheckinsByEmployee: (employeeId: string) => QuarterlyCheckin[];

  // Audit
  addAuditLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  // Notifications
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

// Team structure for manager views
export const TEAM_MEMBERS = [
  { id: 'u1', name: 'Alex Rivera', role: 'employee' as const, department: 'Product Design', managerId: 'u2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'u4', name: 'Jordan Smith', role: 'employee' as const, department: 'Engineering', managerId: 'u2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: 'u5', name: 'Mila Chen', role: 'employee' as const, department: 'UX Research', managerId: 'u2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mila' },
  { id: 'u6', name: 'Oscar Wilde', role: 'employee' as const, department: 'Sales', managerId: 'u2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar' },
];

const uid = () => crypto.randomUUID().slice(0, 8);
const now = () => new Date().toISOString();

import { apiClient } from '../lib/api-client';

import { toast } from 'sonner';

const mapGoalFromApi = (apiGoal: any): Goal => ({
  id: apiGoal.id,
  title: apiGoal.title,
  description: apiGoal.description,
  thrustArea: apiGoal.thrustArea,
  uom: apiGoal.unitOfMeasure,
  uomLabel: UOM_OPTIONS.find((o) => o.value === apiGoal.unitOfMeasure)?.label || apiGoal.unitOfMeasure,
  target: apiGoal.targetValue,
  achievement: apiGoal.achievementValue || 0,
  weightage: apiGoal.weightage,
  status: (apiGoal.status || 'draft').toLowerCase() as GoalStatus,
  progressStatus: 'not-started', // simplified for now
  progressScore: apiGoal.progressScore || 0,
  deadline: apiGoal.dueDate ? new Date(apiGoal.dueDate).toISOString().split('T')[0] : '',
  ownerId: apiGoal.employeeId,
  ownerName: apiGoal.employee?.fullName || 'Unknown',
  lockedAt: apiGoal.lockedAt,
  createdAt: apiGoal.createdAt,
  updatedAt: apiGoal.updatedAt,
  employee: apiGoal.employee,
});

export const useGoalStore = create<GoalStore>()(
  (set, get) => ({
    goals: [],
    checkins: [],
    auditLogs: [],
    notifications: [],
    
    // Add fetch method
    fetchGoals: async () => {
      const res = await apiClient.listGoals();
      if (res.success && res.data) {
        set({ goals: (res.data as any[]).map(mapGoalFromApi) });
      }
    },
    
    fetchAuditLogs: async () => {
      const res = await apiClient.getAuditLogs();
      if (res.success && res.data) {
        const mapped = (res.data as any[]).map((log) => ({
          id: log.id,
          userId: log.userId || '',
          userName: log.user?.fullName || 'System',
          entityType: log.entityType,
          entityId: log.entityId,
          action: log.action,
          beforeValue: log.beforeValue || undefined,
          afterValue: log.afterValue || undefined,
          timestamp: log.createdAt || new Date().toISOString(),
        }));
        set({ auditLogs: mapped });
      }
    },

    fetchGoalCheckins: async (goalId) => {
      const res = await apiClient.getGoalCheckins(goalId);
      if (res.success && res.data) {
        const incoming = (res.data as any[]).map((c) => c as unknown as QuarterlyCheckin);
        set((s) => {
          const filtered = s.checkins.filter((existing) => existing.goalId !== goalId);
          return { checkins: [...filtered, ...incoming] };
        });
      }
    },

    addGoal: (goalData) => {
      const tempId = `g-${uid()}`;
      const newGoal: Goal = {
        ...goalData,
        id: tempId,
        progressScore: 0,
        createdAt: now(),
        updatedAt: now(),
      };
      
      // Optimistically add to store
      set((s) => ({ goals: [...s.goals, newGoal] }));

      // Trigger API call in background
      const payload = {
        title: goalData.title,
        description: goalData.description,
        thrustArea: goalData.thrustArea,
        unitOfMeasure: goalData.uom,
        targetValue: goalData.target,
        weightage: goalData.weightage,
        dueDate: goalData.deadline ? new Date(goalData.deadline).toISOString() : new Date().toISOString(),
      };

      apiClient.createGoal(payload).then((res) => {
        if (res.success && res.data) {
          const apiGoal = mapGoalFromApi(res.data);
          // Replace the optimistic goal with the real one from the server
          set((s) => ({
            goals: s.goals.map((g) => g.id === tempId ? apiGoal : g),
          }));
        } else {
          // Rollback if failed
          set((s) => ({ goals: s.goals.filter((g) => g.id !== tempId) }));
          toast.error("Failed to sync new goal with server.");
        }
      });

      return newGoal;
    },

    createSharedGoal: async (data) => {
      const res = await apiClient.createSharedGoal(data);
      if (res.success) {
        toast.success("Shared Goal Cascaded!", { description: "Assigned goals have been created for selected team members." });
        get().fetchGoals(); // Reload team goals
      } else {
        toast.error("Failed to cascade shared goal.");
      }
    },

    updateGoal: async (id, updates) => {
      const payload: any = {};
      if (updates.target) payload.targetValue = updates.target;
      if (updates.weightage) payload.weightage = updates.weightage;
      if (updates.title) payload.title = updates.title;
      if (updates.description) payload.description = updates.description;
      if (updates.status) payload.status = updates.status.toUpperCase();
      
      const res = await apiClient.updateGoal(id, payload);
      if (res.success && res.data) {
        set((s) => ({
          goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g),
        }));
      }
    },

    deleteGoal: (id) => {
      set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
      apiClient.delete(`/goals/${id}`);
    },

    submitGoal: async (id) => {
      const res = await apiClient.submitGoal(id);
      if (res.success && res.data) {
        set((s) => ({ goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g) }));
      }
    },

    approveGoal: async (id, managerId) => {
      const res = await apiClient.approveGoal(id);
      if (res.success && res.data) {
        set((s) => ({ goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g) }));
      }
    },

    rejectGoal: async (id, managerId, comment) => {
      const res = await apiClient.rejectGoal(id, comment);
      if (res.success && res.data) {
        set((s) => ({ goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g) }));
      }
    },

    requestRework: async (id, managerId, comment) => {
      const res = await apiClient.rejectGoal(id, comment);
      if (res.success && res.data) {
        set((s) => ({ goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g) }));
      }
    },

    lockGoal: async (id) => {
      // Placeholder if backend supports lock
      set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, status: 'locked' as any } : g) }));
    },

    unlockGoal: async (id, adminId) => {
      const res = await apiClient.unlockGoal(id);
      if (res.success && res.data) {
        set((s) => ({ goals: s.goals.map((g) => g.id === id ? mapGoalFromApi(res.data) : g) }));
      }
    },

    addCheckin: async (data) => {
      const res = await apiClient.submitCheckin(data.goalId, data);
      if (res.success && res.data) {
        set((s) => ({ checkins: [...s.checkins, res.data as unknown as QuarterlyCheckin] }));
        get().fetchGoals(); // Refresh goal progress
      }
    },

    addManagerComment: async (checkinId, comment) => {
      const res = await apiClient.reviewCheckin(checkinId, { comment });
      if (res.success && res.data) {
        set((s) => ({
          checkins: s.checkins.map((c) => c.id === checkinId ? res.data as unknown as QuarterlyCheckin : c),
        }));
      }
    },

    reviewCheckin: async (checkinId, status, comment) => {
      const res = await apiClient.reviewCheckin(checkinId, { status, comment });
      if (res.success && res.data) {
        set((s) => ({
          checkins: s.checkins.map((c) => c.id === checkinId ? res.data as unknown as QuarterlyCheckin : c),
        }));
        get().fetchGoals(); // Refresh goal achievements if approved!
        toast.success(`Check-in reviewed successfully! Status updated to ${status}.`);
      } else {
        toast.error("Failed to submit check-in review.");
      }
    },

    getGoalsByOwner: (ownerId) => get().goals.filter((g) => g.ownerId === ownerId || (g as any).employeeId === ownerId),
    getGoalsByManager: (managerId) => {
      return get().goals.filter((g) => (g as any).employee?.managerId === managerId);
    },
    getPendingApprovals: (managerId) => {
      return get().goals.filter((g) => (g as any).employee?.managerId === managerId && g.status === 'submitted');
    },
    getCheckinsByEmployee: (employeeId) => get().checkins.filter((c) => c.employeeId === employeeId),

    addAuditLog: (log) => {
      const entry: AuditLogEntry = { ...log, id: `al-${crypto.randomUUID().slice(0, 8)}`, timestamp: new Date().toISOString() };
      set((s) => ({ auditLogs: [entry, ...s.auditLogs] }));
    },

    addNotification: (n) => {
      const notif: Notification = { ...n, id: `n-${crypto.randomUUID().slice(0, 8)}`, createdAt: new Date().toISOString() };
      set((s) => ({ notifications: [notif, ...s.notifications] }));
    },
    markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n) })),
    markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })),
  })
);
