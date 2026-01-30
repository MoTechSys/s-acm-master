/**
 * مكون PermissionGate
 * 
 * يستخدم لإخفاء/إظهار العناصر حسب الصلاحيات
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

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
    throw new Error('usePermissions must be used within a PermissionProvider');
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

// =============================================================================
// مكون PermissionButton
// =============================================================================

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: string;
  children: ReactNode;
}

export function PermissionButton({ permission, children, ...props }: PermissionButtonProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  return <button {...props}>{children}</button>;
}

// =============================================================================
// مثال الاستخدام
// =============================================================================

/*
// في App.tsx أو Layout
import { PermissionProvider } from './components/PermissionGate';

function App() {
  const currentUser = { permissions: ['view_users', 'add_user'] };
  
  return (
    <PermissionProvider permissions={currentUser.permissions}>
      <Dashboard />
    </PermissionProvider>
  );
}

// في أي مكون
import { PermissionGate, PermissionButton, usePermissions } from './components/PermissionGate';

function UsersPage() {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      {/* إخفاء قسم كامل */}
      <PermissionGate permission="view_users">
        <UsersList />
      </PermissionGate>
      
      {/* إخفاء زر */}
      <PermissionGate permission="add_user">
        <Button>إضافة مستخدم</Button>
      </PermissionGate>
      
      {/* أو باستخدام PermissionButton */}
      <PermissionButton permission="delete_user" onClick={handleDelete}>
        حذف
      </PermissionButton>
      
      {/* عرض محتوى بديل */}
      <PermissionGate 
        permission="view_reports" 
        fallback={<p>ليس لديك صلاحية لعرض التقارير</p>}
      >
        <Reports />
      </PermissionGate>
      
      {/* التحقق من أي صلاحية */}
      <PermissionGate anyOf={['use_ai_summary', 'use_ai_questions', 'use_ai_chat']}>
        <AITools />
      </PermissionGate>
      
      {/* التحقق من كل الصلاحيات */}
      <PermissionGate allOf={['view_users', 'edit_user', 'delete_user']}>
        <FullUserManagement />
      </PermissionGate>
      
      {/* استخدام Hook مباشرة */}
      {hasPermission('export_users') && (
        <Button onClick={exportUsers}>تصدير</Button>
      )}
    </div>
  );
}
*/

export default PermissionGate;
