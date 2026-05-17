/**
 * NovaPulse Enterprise Types
 * Complete type system covering the full BRD requirements
 */

export type UserRole = 'employee' | 'manager' | 'admin';

export type GoalStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'locked' | 'rework';

export type GoalProgressStatus = 'not-started' | 'on-track' | 'completed' | 'delayed';

/** BRD-mandated UoM types with specific scoring formulas */
export type UnitOfMeasure = 'numeric-min' | 'numeric-max' | 'percentage-min' | 'percentage-max' | 'timeline' | 'zero-based';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  departmentId?: string;
  managerId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  thrustArea: string;
  uom: UnitOfMeasure;
  uomLabel: string; // Human readable like "Revenue (USD)", "TAT (days)"
  target: number;
  achievement: number;
  weightage: number;
  status: GoalStatus;
  progressStatus: GoalProgressStatus;
  progressScore: number; // 0-100 computed score
  deadline: string;
  ownerId: string;
  ownerName?: string;
  isShared?: boolean;
  sharedGoalId?: string;
  sharedWithIds?: string[];
  comments?: GoalComment[];
  lockedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoalComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface QuarterlyCheckin {
  id: string;
  goalId: string;
  goalTitle: string;
  employeeId: string;
  cycleId: string;
  cycleName: string;
  plannedTarget: number;
  actualAchievement: number;
  progressStatus: GoalProgressStatus;
  notes: string;
  completionPercentage: number;
  managerComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'locked';
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  entityType: string;
  entityId: string;
  action: string;
  fieldChanged?: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'checkin' | 'escalation' | 'system' | 'feedback' | 'ai';
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  targetId: string;
  targetName: string;
  reason: string;
  status: 'open' | 'resolved';
  level: number;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  goalId: string;
  goal: Goal;
  requesterId: string;
  requesterName: string;
  status: 'pending' | 'approved' | 'rejected' | 'rework';
  comments?: string;
  createdAt: string;
}

/** Progress score calculation per UoM type (BRD Section 2.2) */
export function calculateProgressScore(uom: UnitOfMeasure, target: number, achievement: number): number {
  if (target === 0) return 0;

  switch (uom) {
    case 'numeric-min':
    case 'percentage-min':
      // Higher is better — Achievement ÷ Target
      return Math.min(Math.round((achievement / target) * 100), 100);

    case 'numeric-max':
    case 'percentage-max':
      // Lower is better — Target ÷ Achievement
      if (achievement === 0) return 100; // Achieved zero when lower is better
      return Math.min(Math.round((target / achievement) * 100), 100);

    case 'timeline':
      // Date-based: if achievement (days taken) <= target (days allowed), 100%
      return achievement <= target ? 100 : Math.max(0, Math.round((target / achievement) * 100));

    case 'zero-based':
      // Zero = Success
      return achievement === 0 ? 100 : 0;

    default:
      return Math.min(Math.round((achievement / target) * 100), 100);
  }
}

/** UoM display labels */
export const UOM_OPTIONS: { value: UnitOfMeasure; label: string; description: string }[] = [
  { value: 'numeric-min', label: 'Numeric (Higher is Better)', description: 'e.g., Sales Revenue, Units Sold' },
  { value: 'numeric-max', label: 'Numeric (Lower is Better)', description: 'e.g., TAT, Cost, Defects' },
  { value: 'percentage-min', label: 'Percentage (Higher is Better)', description: 'e.g., Customer Satisfaction %' },
  { value: 'percentage-max', label: 'Percentage (Lower is Better)', description: 'e.g., Error Rate %' },
  { value: 'timeline', label: 'Timeline (Date-based)', description: 'Completion date vs. Deadline' },
  { value: 'zero-based', label: 'Zero-Based', description: 'Zero = Success, e.g., Safety Incidents' },
];

/** Thrust areas */
export const THRUST_AREAS = [
  'Product Excellence',
  'Engineering Quality',
  'Customer Success',
  'Strategic Growth',
  'People & Culture',
  'Operational Efficiency',
  'Innovation & R&D',
  'Compliance & Governance',
];
