/**
 * Constants — Legacy compatibility layer
 * All real data now lives in stores/goalStore.ts
 * This file is kept only for backward compat with components not yet migrated
 */
import type { User, PerformanceCycle } from './types';

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const CURRENT_USER: User = {
  id: 'u1', name: 'Alex Rivera', email: 'alex.rivera@novapulse.io',
  role: 'employee', department: 'Product Design',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

export const MOCK_MANAGER: User = {
  id: 'u2', name: 'Sarah Chen', email: 'sarah.chen@novapulse.io',
  role: 'manager', department: 'Product Management',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
};

export const MOCK_CYCLES: PerformanceCycle[] = [
  { id: 'c1', name: '2026 Q2 Goal Setting', startDate: '2026-04-01', endDate: '2026-06-30', status: 'open' },
  { id: 'c2', name: '2026 Q1 Review', startDate: '2026-01-01', endDate: '2026-03-31', status: 'closed' },
];
