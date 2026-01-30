/**
 * S-ACM API Client
 * 
 * هذا الملف يوفر client للتواصل مع الـ Backend
 * 
 * @example
 * ```typescript
 * import { api } from '@/lib/api';
 * 
 * // Login
 * const result = await api.auth.login({ email: '...', password: '...' });
 * 
 * // Get users
 * const users = await api.users.list({ page: 1, limit: 20 });
 * ```
 */

// ============================================
// Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-47834.up.railway.app';

// ============================================
// Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Token Management
// ============================================

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
}

export function getAccessToken() {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
}

export function getRefreshToken() {
  if (!refreshToken) {
    refreshToken = localStorage.getItem('refreshToken');
  }
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ============================================
// Fetch with Auth
// ============================================

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle 401 - Try refresh token
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry with new token
        return fetchWithAuth(endpoint, options);
      }
    }

    return data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: errorMessage };
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      accessToken = data.data.accessToken;
      localStorage.setItem('accessToken', data.data.accessToken);
      return true;
    }

    // Refresh failed - clear tokens
    clearTokens();
    return false;
  } catch {
    clearTokens();
    return false;
  }
}

// ============================================
// API Wrapper Functions
// ============================================

export const api = {
  // Auth
  auth: {
    login: async (data: { email: string; password: string }) => {
      const result = await fetchWithAuth<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          fullName: string;
          role: { id: string; name: string; permissions: Array<{ permissionKey: string }> };
        };
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (result.success && result.data) {
        setTokens(result.data.accessToken, result.data.refreshToken);
      }
      return result;
    },
    logout: async () => {
      const result = await fetchWithAuth('/api/auth/logout', { method: 'POST' });
      clearTokens();
      return result;
    },
    me: () => fetchWithAuth('/api/auth/me'),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      fetchWithAuth('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Users
  users: {
    list: (params?: { page?: number; limit?: number; search?: string; roleId?: string; majorId?: string; status?: string }) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return fetchWithAuth(`/api/users${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchWithAuth(`/api/users/${id}`),
    create: (data: Record<string, unknown>) => fetchWithAuth('/api/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchWithAuth(`/api/users/${id}`, { method: 'DELETE' }),
    resetPassword: (id: string) => fetchWithAuth(`/api/users/${id}/reset-password`, { method: 'POST' }),
  },

  // Roles
  roles: {
    list: () => fetchWithAuth('/api/roles'),
    get: (id: string) => fetchWithAuth(`/api/roles/${id}`),
    create: (data: Record<string, unknown>) => fetchWithAuth('/api/roles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchWithAuth(`/api/roles/${id}`, { method: 'DELETE' }),
    permissions: () => fetchWithAuth('/api/roles/permissions'),
  },

  // Courses
  courses: {
    list: (params?: Record<string, string>) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return fetchWithAuth(`/api/courses${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchWithAuth(`/api/courses/${id}`),
    create: (data: Record<string, unknown>) => fetchWithAuth('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchWithAuth(`/api/courses/${id}`, { method: 'DELETE' }),
  },

  // Files
  files: {
    list: (params?: Record<string, string>) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return fetchWithAuth(`/api/files${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchWithAuth(`/api/files/${id}`),
    upload: (data: Record<string, unknown>) => fetchWithAuth('/api/files', { method: 'POST', body: JSON.stringify(data) }),
    download: (id: string) => fetchWithAuth(`/api/files/${id}/download`, { method: 'POST' }),
    delete: (id: string) => fetchWithAuth(`/api/files/${id}`, { method: 'DELETE' }),
    stats: () => fetchWithAuth('/api/files/stats'),
  },

  // Academic
  academic: {
    departments: {
      list: () => fetchWithAuth('/api/academic/departments'),
      create: (data: Record<string, unknown>) => fetchWithAuth('/api/academic/departments', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/academic/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => fetchWithAuth(`/api/academic/departments/${id}`, { method: 'DELETE' }),
    },
    majors: {
      list: () => fetchWithAuth('/api/academic/majors'),
      create: (data: Record<string, unknown>) => fetchWithAuth('/api/academic/majors', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/academic/majors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => fetchWithAuth(`/api/academic/majors/${id}`, { method: 'DELETE' }),
    },
    levels: {
      list: (majorId?: string) => fetchWithAuth(`/api/academic/levels${majorId ? `?majorId=${majorId}` : ''}`),
      create: (data: Record<string, unknown>) => fetchWithAuth('/api/academic/levels', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: Record<string, unknown>) => fetchWithAuth(`/api/academic/levels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => fetchWithAuth(`/api/academic/levels/${id}`, { method: 'DELETE' }),
    },
  },

  // Notifications
  notifications: {
    list: (params?: Record<string, string>) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return fetchWithAuth(`/api/notifications${query ? `?${query}` : ''}`);
    },
    send: (data: Record<string, unknown>) => fetchWithAuth('/api/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id: string) => fetchWithAuth(`/api/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => fetchWithAuth('/api/notifications/read-all', { method: 'PUT' }),
    delete: (id: string) => fetchWithAuth(`/api/notifications/${id}`, { method: 'DELETE' }),
  },

  // Reports
  reports: {
    dashboard: () => fetchWithAuth('/api/reports/dashboard'),
    users: () => fetchWithAuth('/api/reports/users'),
    courses: () => fetchWithAuth('/api/reports/courses'),
    files: () => fetchWithAuth('/api/reports/files'),
    activity: (days?: number) => fetchWithAuth(`/api/reports/activity${days ? `?days=${days}` : ''}`),
  },

  // AI
  ai: {
    chat: (data: { message: string; conversationId?: string; context?: string }) =>
      fetchWithAuth('/api/ai/chat', { method: 'POST', body: JSON.stringify(data) }),
    summarize: (data: { text: string; type?: 'brief' | 'detailed' | 'bullets' }) =>
      fetchWithAuth('/api/ai/summarize', { method: 'POST', body: JSON.stringify(data) }),
    generate: (data: { type: string; topic: string; options?: Record<string, unknown> }) =>
      fetchWithAuth('/api/ai/generate', { method: 'POST', body: JSON.stringify(data) }),
    translate: (data: { text: string; from?: string; to: string }) =>
      fetchWithAuth('/api/ai/translate', { method: 'POST', body: JSON.stringify(data) }),
    conversations: () => fetchWithAuth('/api/ai/conversations'),
    conversation: (id: string) => fetchWithAuth(`/api/ai/conversations/${id}`),
    deleteConversation: (id: string) => fetchWithAuth(`/api/ai/conversations/${id}`, { method: 'DELETE' }),
  },

  // Audit
  audit: {
    list: (params?: Record<string, string>) => {
      const query = params ? new URLSearchParams(params).toString() : '';
      return fetchWithAuth(`/api/audit${query ? `?${query}` : ''}`);
    },
    get: (id: string) => fetchWithAuth(`/api/audit/${id}`),
    actions: () => fetchWithAuth('/api/audit/actions'),
    entityTypes: () => fetchWithAuth('/api/audit/entity-types'),
  },

  // Trash
  trash: {
    list: (entityType?: string) => fetchWithAuth(`/api/trash${entityType ? `?entityType=${entityType}` : ''}`),
    restore: (entityType: string, entityId: string) =>
      fetchWithAuth('/api/trash/restore', { method: 'POST', body: JSON.stringify({ entityType, entityId }) }),
    permanentDelete: (entityType: string, entityId: string) =>
      fetchWithAuth('/api/trash/permanent', { method: 'DELETE', body: JSON.stringify({ entityType, entityId }) }),
    empty: (entityType?: string) =>
      fetchWithAuth(`/api/trash/empty${entityType ? `?entityType=${entityType}` : ''}`, { method: 'DELETE' }),
  },

  // Settings
  settings: {
    list: () => fetchWithAuth('/api/settings'),
    get: (category: string) => fetchWithAuth(`/api/settings/${category}`),
    update: (category: string, settings: Record<string, unknown>) =>
      fetchWithAuth('/api/settings', { method: 'PUT', body: JSON.stringify({ category, settings }) }),
  },
};

export default api;
