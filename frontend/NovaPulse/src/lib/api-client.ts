/**
 * API Client — Centralized API interface for NovaPulse backend
 * Handles authentication, error handling, and request/response formatting
 */

import { API_URL } from '../constants';

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private getAuthToken(): string | null {
    return sessionStorage.getItem('novapulse_token');
  }

  private async request<T>(config: ApiRequest): Promise<ApiResponse<T>> {
    const url = `${API_URL}${config.endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      if (response.status === 401) {
        // Token invalid, clear it
        sessionStorage.removeItem('novapulse_token');
        sessionStorage.removeItem('novapulse_user');
        window.location.href = '/auth';
        return { success: false, error: 'Unauthorized - please login again' };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}`,
          statusCode: response.status,
        };
      }

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', endpoint, body });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', endpoint, body });
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', endpoint, body });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint });
  }

  // ─────────────────────────────────────────────────────────────────
  // Goals API
  // ─────────────────────────────────────────────────────────────────

  async listGoals(filter?: { status?: string; employeeId?: string }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.employeeId) params.append('employeeId', filter.employeeId);
    const query = params.toString();
    return this.get(`/goals${query ? '?' + query : ''}`);
  }

  async getGoal(id: string) {
    return this.get(`/goals/${id}`);
  }

  async createGoal(data: any) {
    return this.post('/goals', data);
  }

  async updateGoal(id: string, data: any) {
    return this.patch(`/goals/${id}`, data);
  }

  async submitGoal(id: string) {
    return this.patch(`/goals/${id}/submit`, {});
  }

  async approveGoal(id: string) {
    return this.patch(`/goals/${id}/approve`, {});
  }

  async rejectGoal(id: string, comment: string) {
    return this.patch(`/goals/${id}/reject`, { comment });
  }

  async unlockGoal(id: string) {
    return this.patch(`/goals/${id}/unlock`, {});
  }

  // ─────────────────────────────────────────────────────────────────
  // Check-ins API
  // ─────────────────────────────────────────────────────────────────

  async getGoalCheckins(goalId: string) {
    return this.get(`/goals/${goalId}/checkins`);
  }

  async submitCheckin(goalId: string, data: any) {
    return this.post(`/goals/${goalId}/checkins`, data);
  }

  async reviewCheckin(checkinId: string, data: any) {
    return this.patch(`/checkins/${checkinId}/review`, data);
  }

  // ─────────────────────────────────────────────────────────────────
  // Approvals API
  // ─────────────────────────────────────────────────────────────────

  async listApprovals(filter?: { status?: string }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    const query = params.toString();
    return this.get(`/approvals${query ? '?' + query : ''}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // Admin API
  // ─────────────────────────────────────────────────────────────────

  async getSystemHealth() {
    return this.get('/admin/health');
  }

  async getSystemEvents(limit: number = 50, offset: number = 0) {
    return this.get(`/admin/events?limit=${limit}&offset=${offset}`);
  }

  async getAuditLogs(limit: number = 50) {
    return this.get(`/admin/audit-logs?limit=${limit}`);
  }

  async getCycles() {
    return this.get('/admin/cycles');
  }

  async createCycle(data: any) {
    return this.post('/admin/cycles', data);
  }

  // ─────────────────────────────────────────────────────────────────
  // Auth API
  // ─────────────────────────────────────────────────────────────────

  async getProfile() {
    return this.get('/auth/profile');
  }

  async logout() {
    return this.post('/auth/logout', {});
  }

  async refreshToken() {
    return this.post('/auth/refresh', {});
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
