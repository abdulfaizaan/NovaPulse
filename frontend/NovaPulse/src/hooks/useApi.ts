import { useState, useCallback } from 'react';
import { API_URL } from '../constants';

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
}

/**
 * Custom hook for API calls with authentication
 */
export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const call = useCallback(
    async (method: string, endpoint: string, body?: any): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError({
            message: errorData.message || `HTTP ${response.status}`,
            status: response.status,
          });

          // Handle 401 - redirect to login
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/auth';
          }

          return null;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError({ message });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const get = useCallback((endpoint: string) => call('GET', endpoint), [call]);
  const post = useCallback((endpoint: string, body: any) => call('POST', endpoint, body), [call]);
  const patch = useCallback((endpoint: string, body: any) => call('PATCH', endpoint, body), [call]);
  const put = useCallback((endpoint: string, body: any) => call('PUT', endpoint, body), [call]);
  const delete_ = useCallback((endpoint: string) => call('DELETE', endpoint), [call]);

  return { get, post, patch, put, delete: delete_, loading, error };
}
