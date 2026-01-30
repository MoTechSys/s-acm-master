/**
 * مكون PermissionGate
 * 
 * يستخدم لإخفاء/إظهار العناصر حسب الصلاحيات
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';

// =============================================================================
// Context للصلاحيات
// =============================================================================

interface PermissionContextType {
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

// =============================================================================
// Provider للصلاحيات
// =============================================================================

interface PermissionProviderProps {
  permissions: string[];
  children: ReactNode;
}

export function PermissionProvider({ permissions, children }: PermissionProviderProps) {
  const value: PermissionContextType = {
    permissions,
    hasPermission: (permission) => hasPermission(permissions, permission),
    hasAnyPermission: (perms) => hasAnyPermission(permissions, perms),
    hasAllPermissions: (perms) => hasAllPermissions(permissions, perms),
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

// =============================================================================
// Hook للصلاحيات
// =============================================================================

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    // إذا لم يكن هناك Provider، نعيد صلاحيات كاملة (للتطوير)
    return {
      permissions: ['__all__'],
      hasPermission: () => true,
      hasAnyPermission: () => true,
      hasAllPermissions: () => true,
    };
  }
  return context;
}

// =============================================================================
// مكون PermissionGate
// =============================================================================

interface PermissionGateProps {
  /** صلاحية واحدة مطلوبة */
  permission?: string;
  
  /** قائمة صلاحيات - يجب توفر واحدة منها على الأقل */
  anyOf?: string[];
  
  /** قائمة صلاحيات - يجب توفرها جميعاً */
  allOf?: string[];
  
  /** المحتوى المعروض إذا توفرت الصلاحية */
  children: ReactNode;
  
  /** المحتوى المعروض إذا لم تتوفر الصلاحية (اختياري) */
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  anyOf,
  allOf,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOf) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf) {
    hasAccess = hasAllPermissions(allOf);
  } else {
    // إذا لم يتم تحديد أي صلاحية، يتم عرض المحتوى
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;
