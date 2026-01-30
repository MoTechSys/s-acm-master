import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setTokens, clearTokens, isAuthenticated, getAccessToken } from '@/lib/api';

// ============================================
// Types
// ============================================

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: {
    id: string;
    name: string;
    permissions: Array<{ permissionKey: string }>;
  };
  major?: {
    id: string;
    name: string;
  };
  level?: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  permissions: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (permission: string | string[]) => boolean;
  refreshUser: () => Promise<void>;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  // Extract permissions from user
  const extractPermissions = useCallback((userData: User | null): string[] => {
    if (!userData?.role?.permissions) return [];
    return userData.role.permissions.map((p) => p.permissionKey);
  }, []);

  // Check if user has permission
  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      if (!user) return false;
      
      // Admin has all permissions
      if (user.role.name === 'مدير النظام' || user.role.name === 'admin') {
        return true;
      }

      if (Array.isArray(permission)) {
        return permission.some((p) => permissions.includes(p));
      }
      return permissions.includes(permission);
    },
    [user, permissions]
  );

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await api.auth.login({ email, password });
      
      if (result.success && result.data) {
        const userData = result.data.user as User;
        setUser(userData);
        setPermissions(extractPermissions(userData));
        return { success: true };
      }
      
      return { success: false, error: result.error || 'فشل تسجيل الدخول' };
    } catch (error) {
      return { success: false, error: 'حدث خطأ في الاتصال' };
    } finally {
      setIsLoading(false);
    }
  }, [extractPermissions]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore errors
    } finally {
      clearTokens();
      setUser(null);
      setPermissions([]);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.auth.me();
      if (result.success && result.data) {
        const userData = result.data as User;
        setUser(userData);
        setPermissions(extractPermissions(userData));
      } else {
        clearTokens();
        setUser(null);
        setPermissions([]);
      }
    } catch {
      clearTokens();
      setUser(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [extractPermissions]);

  // Initial load
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    permissions,
    login,
    logout,
    hasPermission,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
