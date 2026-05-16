/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, User, PerformanceCycle } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@novapulse.io',
  role: 'employee',
  department: 'Product Design',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

export const MOCK_MANAGER: User = {
  id: 'u2',
  name: 'Sarah Chen',
  email: 'sarah.chen@novapulse.io',
  role: 'manager',
  department: 'Product Management',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
};

export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Modernize Enterprise Design System',
    description: 'Lead the effort to migrate our legacy design system to the new NovaPulse branding guidelines.',
    thrustArea: 'Product Excellence',
    uom: 'Components Migration %',
    target: 100,
    achievement: 65,
    weightage: 30,
    status: 'on-track',
    deadline: '2026-06-30',
    ownerId: 'u1',
  },
  {
    id: 'g2',
    title: 'Accessibility Compliance Audit',
    description: 'Perform a full audit and remediation of the core portal to meet WCAG 2.1 AA standards.',
    thrustArea: 'Engineering Quality',
    uom: 'Compliance Score',
    target: 100,
    achievement: 25,
    weightage: 20,
    status: 'delayed',
    deadline: '2026-05-15',
    ownerId: 'u1',
  },
  {
    id: 'g3',
    title: 'Customer Onboarding Flow Optimization',
    description: 'Reduce time-to-value for new enterprise customers by 15% through UX improvements.',
    thrustArea: 'Customer Success',
    uom: 'Time Redux (minutes)',
    target: 15,
    achievement: 15,
    weightage: 25,
    status: 'completed',
    deadline: '2026-03-31',
    ownerId: 'u1',
  },
  {
    id: 'g4',
    title: 'Team Mentorship Program',
    description: 'Guide junior designers through the Q2 performance cycle and provide bi-weekly feedback.',
    thrustArea: 'People & Culture',
    uom: 'Mentorship Sessions',
    target: 12,
    achievement: 8,
    weightage: 25,
    status: 'on-track',
    deadline: '2026-06-30',
    ownerId: 'u1',
  }
];

export const MOCK_TEAM_GOALS: Goal[] = [
  { ...MOCK_GOALS[0], id: 'tg1', ownerId: 'u3', achievement: 40, status: 'on-track' },
  { ...MOCK_GOALS[1], id: 'tg2', ownerId: 'u4', achievement: 90, status: 'completed' },
  { ...MOCK_GOALS[2], id: 'tg3', ownerId: 'u5', achievement: 10, status: 'not-started' },
];

export const MOCK_CYCLES: PerformanceCycle[] = [
  {
    id: 'c1',
    name: '2026 Q2 Goal Setting',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    status: 'open',
  },
  {
    id: 'c2',
    name: '2026 Q1 Review',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 'closed',
  }
];
