/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'employee' | 'manager' | 'admin';

export type GoalStatus = 'not-started' | 'on-track' | 'completed' | 'delayed' | 'draft' | 'under-review' | 'approved' | 'rework';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  thrustArea: string;
  uom: string; // Unit of Measure
  target: number;
  achievement: number;
  weightage: number;
  status: GoalStatus;
  deadline: string;
  ownerId: string;
  isShared?: boolean;
  sharedWithIds?: string[];
  comments?: GoalComment[];
}

export interface GoalComment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'locked';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  fieldChanged?: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
}
