/**
 * نظام الصلاحيات - S-ACM
 * 
 * هذا الملف يحتوي على كل ما يتعلق بنظام الصلاحيات:
 * - تعريفات الأنواع (Types)
 * - البيانات الثابتة (Constants)
 * - الدوال المساعدة (Helpers)
 */

// =============================================================================
// الأنواع (Types)
// =============================================================================

/**
 * صلاحية واحدة
 */
export interface Permission {
  id: string;           // معرف فريد (مثل: view_users)
  name: string;         // الاسم بالإنجليزية
  nameAr: string;       // الاسم بالعربية
  description: string;  // الوصف
  category: string;     // القسم التابع له
  parent?: string;      // الصلاحية الأب (إن وجدت)
  requires?: string[];  // الصلاحيات المطلوبة
}

/**
 * قسم الصلاحيات
 */
export interface PermissionCategory {
  id: string;           // معرف فريد (مثل: users)
  name: string;         // الاسم بالإنجليزية
  nameAr: string;       // الاسم بالعربية
  icon: string;         // اسم الأيقونة من Lucide
  permissions: string[]; // قائمة معرفات الصلاحيات
}

/**
 * دور المستخدم
 */
export interface Role {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;   // هل هو دور نظام (لا يمكن حذفه)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * المستخدم
 */
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  permissions: string[]; // الصلاحيات المحسوبة من الدور
}

// =============================================================================
// أقسام الصلاحيات
// =============================================================================

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    nameAr: "لوحة التحكم",
    icon: "LayoutDashboard",
    permissions: ["view_dashboard", "view_statistics", "view_user_stats", "view_file_stats", "view_course_stats", "view_activity_stats"]
  },
  {
    id: "users",
    name: "Users Management",
    nameAr: "إدارة المستخدمين",
    icon: "Users",
    permissions: ["view_users", "view_user_details", "export_users", "add_user", "edit_user", "change_user_role", "reset_user_password", "delete_user", "activate_user"]
  },
  {
    id: "roles",
    name: "Roles Management",
    nameAr: "إدارة الأدوار",
    icon: "Shield",
    permissions: ["view_roles", "view_role_permissions", "add_role", "edit_role", "edit_role_permissions", "delete_role"]
  },
  {
    id: "courses",
    name: "Courses Management",
    nameAr: "إدارة المقررات",
    icon: "BookOpen",
    permissions: ["view_courses", "view_course_details", "view_course_files", "add_course", "edit_course", "delete_course", "assign_instructor"]
  },
  {
    id: "files",
    name: "Files Management",
    nameAr: "إدارة الملفات",
    icon: "Files",
    permissions: ["view_files", "download_files", "preview_files", "upload_files", "edit_files", "rename_files", "move_files", "delete_files", "approve_files"]
  },
  {
    id: "academic",
    name: "Academic Data",
    nameAr: "البيانات الأكاديمية",
    icon: "GraduationCap",
    permissions: ["view_academic", "view_colleges", "view_departments", "view_levels", "manage_colleges", "add_college", "edit_college", "delete_college", "manage_departments", "add_department", "edit_department", "delete_department", "manage_levels", "add_level", "edit_level", "delete_level", "manage_semesters", "add_semester", "edit_semester", "delete_semester"]
  },
  {
    id: "notifications",
    name: "Notifications",
    nameAr: "الإشعارات",
    icon: "Bell",
    permissions: ["view_notifications", "send_notifications", "send_to_all", "send_to_role", "send_to_user", "manage_notifications", "delete_notification"]
  },
  {
    id: "ai",
    name: "AI Tools",
    nameAr: "الذكاء الاصطناعي",
    icon: "Brain",
    permissions: ["use_ai_summary", "use_ai_questions", "use_ai_chat"]
  },
  {
    id: "reports",
    name: "Reports",
    nameAr: "التقارير",
    icon: "BarChart",
    permissions: ["view_reports", "view_user_reports", "view_file_reports", "view_course_reports", "export_reports", "export_pdf", "export_excel", "generate_reports"]
  },
  {
    id: "settings",
    name: "Settings",
    nameAr: "الإعدادات",
    icon: "Settings",
    permissions: ["view_settings", "edit_settings", "edit_general_settings", "edit_notification_settings", "edit_security_settings"]
  },
  {
    id: "audit",
    name: "Audit Logs",
    nameAr: "سجلات التدقيق",
    icon: "ClipboardList",
    permissions: ["view_audit_logs", "filter_logs", "search_logs", "export_audit_logs"]
  },
  {
    id: "trash",
    name: "Trash",
    nameAr: "سلة المحذوفات",
    icon: "Trash2",
    permissions: ["view_trash", "restore_items", "permanent_delete"]
  }
];

// =============================================================================
// الصلاحيات الكاملة
// =============================================================================

export const PERMISSIONS: Permission[] = [
  // لوحة التحكم
  { id: "view_dashboard", name: "View Dashboard", nameAr: "عرض لوحة التحكم", description: "الوصول للوحة التحكم الرئيسية", category: "dashboard" },
  { id: "view_statistics", name: "View Statistics", nameAr: "عرض الإحصائيات", description: "عرض الإحصائيات العامة", category: "dashboard", parent: "view_dashboard" },
  { id: "view_user_stats", name: "View User Stats", nameAr: "إحصائيات المستخدمين", description: "عرض إحصائيات المستخدمين", category: "dashboard", parent: "view_statistics" },
  { id: "view_file_stats", name: "View File Stats", nameAr: "إحصائيات الملفات", description: "عرض إحصائيات الملفات", category: "dashboard", parent: "view_statistics" },
  { id: "view_course_stats", name: "View Course Stats", nameAr: "إحصائيات المقررات", description: "عرض إحصائيات المقررات", category: "dashboard", parent: "view_statistics" },
  { id: "view_activity_stats", name: "View Activity Stats", nameAr: "إحصائيات النشاط", description: "عرض إحصائيات النشاط", category: "dashboard", parent: "view_statistics" },

  // إدارة المستخدمين
  { id: "view_users", name: "View Users", nameAr: "عرض المستخدمين", description: "عرض قائمة المستخدمين", category: "users" },
  { id: "view_user_details", name: "View User Details", nameAr: "عرض تفاصيل المستخدم", description: "عرض تفاصيل مستخدم", category: "users", parent: "view_users" },
  { id: "export_users", name: "Export Users", nameAr: "تصدير المستخدمين", description: "تصدير قائمة المستخدمين", category: "users", parent: "view_users" },
  { id: "add_user", name: "Add User", nameAr: "إضافة مستخدم", description: "إضافة مستخدم جديد", category: "users", requires: ["view_users"] },
  { id: "edit_user", name: "Edit User", nameAr: "تعديل مستخدم", description: "تعديل بيانات مستخدم", category: "users", requires: ["view_users"] },
  { id: "change_user_role", name: "Change User Role", nameAr: "تغيير دور المستخدم", description: "تغيير دور مستخدم", category: "users", parent: "edit_user" },
  { id: "reset_user_password", name: "Reset User Password", nameAr: "إعادة تعيين كلمة المرور", description: "إعادة تعيين كلمة مرور مستخدم", category: "users", parent: "edit_user" },
  { id: "delete_user", name: "Delete User", nameAr: "حذف مستخدم", description: "حذف مستخدم", category: "users", requires: ["view_users"] },
  { id: "activate_user", name: "Activate/Deactivate User", nameAr: "تفعيل/تعطيل مستخدم", description: "تفعيل أو تعطيل مستخدم", category: "users", requires: ["view_users"] },

  // إدارة الأدوار
  { id: "view_roles", name: "View Roles", nameAr: "عرض الأدوار", description: "عرض قائمة الأدوار", category: "roles" },
  { id: "view_role_permissions", name: "View Role Permissions", nameAr: "عرض صلاحيات الدور", description: "عرض صلاحيات دور", category: "roles", parent: "view_roles" },
  { id: "add_role", name: "Add Role", nameAr: "إضافة دور", description: "إنشاء دور جديد", category: "roles", requires: ["view_roles"] },
  { id: "edit_role", name: "Edit Role", nameAr: "تعديل دور", description: "تعديل دور", category: "roles", requires: ["view_roles"] },
  { id: "edit_role_permissions", name: "Edit Role Permissions", nameAr: "تعديل صلاحيات الدور", description: "تعديل صلاحيات دور", category: "roles", parent: "edit_role" },
  { id: "delete_role", name: "Delete Role", nameAr: "حذف دور", description: "حذف دور", category: "roles", requires: ["view_roles"] },

  // إدارة المقررات
  { id: "view_courses", name: "View Courses", nameAr: "عرض المقررات", description: "عرض قائمة المقررات", category: "courses" },
  { id: "view_course_details", name: "View Course Details", nameAr: "عرض تفاصيل المقرر", description: "عرض تفاصيل مقرر", category: "courses", parent: "view_courses" },
  { id: "view_course_files", name: "View Course Files", nameAr: "عرض ملفات المقرر", description: "عرض ملفات مقرر", category: "courses", parent: "view_courses" },
  { id: "add_course", name: "Add Course", nameAr: "إضافة مقرر", description: "إضافة مقرر جديد", category: "courses", requires: ["view_courses"] },
  { id: "edit_course", name: "Edit Course", nameAr: "تعديل مقرر", description: "تعديل بيانات مقرر", category: "courses", requires: ["view_courses"] },
  { id: "delete_course", name: "Delete Course", nameAr: "حذف مقرر", description: "حذف مقرر", category: "courses", requires: ["view_courses"] },
  { id: "assign_instructor", name: "Assign Instructor", nameAr: "تعيين مدرس", description: "تعيين مدرس للمقرر", category: "courses", requires: ["view_courses"] },

  // إدارة الملفات
  { id: "view_files", name: "View Files", nameAr: "عرض الملفات", description: "عرض قائمة الملفات", category: "files" },
  { id: "download_files", name: "Download Files", nameAr: "تحميل الملفات", description: "تحميل الملفات", category: "files", parent: "view_files" },
  { id: "preview_files", name: "Preview Files", nameAr: "معاينة الملفات", description: "معاينة الملفات", category: "files", parent: "view_files" },
  { id: "upload_files", name: "Upload Files", nameAr: "رفع ملفات", description: "رفع ملفات جديدة", category: "files", requires: ["view_files"] },
  { id: "edit_files", name: "Edit Files", nameAr: "تعديل ملفات", description: "تعديل بيانات الملفات", category: "files", requires: ["view_files"] },
  { id: "rename_files", name: "Rename Files", nameAr: "إعادة تسمية الملفات", description: "إعادة تسمية الملفات", category: "files", parent: "edit_files" },
  { id: "move_files", name: "Move Files", nameAr: "نقل الملفات", description: "نقل الملفات بين المقررات", category: "files", parent: "edit_files" },
  { id: "delete_files", name: "Delete Files", nameAr: "حذف ملفات", description: "حذف ملفات", category: "files", requires: ["view_files"] },
  { id: "approve_files", name: "Approve Files", nameAr: "الموافقة على الملفات", description: "الموافقة على الملفات المعلقة", category: "files", requires: ["view_files"] },

  // البيانات الأكاديمية
  { id: "view_academic", name: "View Academic Data", nameAr: "عرض البيانات الأكاديمية", description: "عرض البيانات الأكاديمية", category: "academic" },
  { id: "view_colleges", name: "View Colleges", nameAr: "عرض الكليات", description: "عرض قائمة الكليات", category: "academic", parent: "view_academic" },
  { id: "view_departments", name: "View Departments", nameAr: "عرض الأقسام", description: "عرض قائمة الأقسام", category: "academic", parent: "view_academic" },
  { id: "view_levels", name: "View Levels", nameAr: "عرض المستويات", description: "عرض قائمة المستويات", category: "academic", parent: "view_academic" },
  { id: "manage_colleges", name: "Manage Colleges", nameAr: "إدارة الكليات", description: "إدارة الكليات", category: "academic", requires: ["view_academic"] },
  { id: "add_college", name: "Add College", nameAr: "إضافة كلية", description: "إضافة كلية جديدة", category: "academic", parent: "manage_colleges" },
  { id: "edit_college", name: "Edit College", nameAr: "تعديل كلية", description: "تعديل كلية", category: "academic", parent: "manage_colleges" },
  { id: "delete_college", name: "Delete College", nameAr: "حذف كلية", description: "حذف كلية", category: "academic", parent: "manage_colleges" },
  { id: "manage_departments", name: "Manage Departments", nameAr: "إدارة الأقسام", description: "إدارة الأقسام", category: "academic", requires: ["view_academic"] },
  { id: "add_department", name: "Add Department", nameAr: "إضافة قسم", description: "إضافة قسم جديد", category: "academic", parent: "manage_departments" },
  { id: "edit_department", name: "Edit Department", nameAr: "تعديل قسم", description: "تعديل قسم", category: "academic", parent: "manage_departments" },
  { id: "delete_department", name: "Delete Department", nameAr: "حذف قسم", description: "حذف قسم", category: "academic", parent: "manage_departments" },
  { id: "manage_levels", name: "Manage Levels", nameAr: "إدارة المستويات", description: "إدارة المستويات", category: "academic", requires: ["view_academic"] },
  { id: "add_level", name: "Add Level", nameAr: "إضافة مستوى", description: "إضافة مستوى جديد", category: "academic", parent: "manage_levels" },
  { id: "edit_level", name: "Edit Level", nameAr: "تعديل مستوى", description: "تعديل مستوى", category: "academic", parent: "manage_levels" },
  { id: "delete_level", name: "Delete Level", nameAr: "حذف مستوى", description: "حذف مستوى", category: "academic", parent: "manage_levels" },
  { id: "manage_semesters", name: "Manage Semesters", nameAr: "إدارة الفصول", description: "إدارة الفصول الدراسية", category: "academic", requires: ["view_academic"] },
  { id: "add_semester", name: "Add Semester", nameAr: "إضافة فصل", description: "إضافة فصل دراسي جديد", category: "academic", parent: "manage_semesters" },
  { id: "edit_semester", name: "Edit Semester", nameAr: "تعديل فصل", description: "تعديل فصل دراسي", category: "academic", parent: "manage_semesters" },
  { id: "delete_semester", name: "Delete Semester", nameAr: "حذف فصل", description: "حذف فصل دراسي", category: "academic", parent: "manage_semesters" },

  // الإشعارات
  { id: "view_notifications", name: "View Notifications", nameAr: "عرض الإشعارات", description: "عرض الإشعارات الواردة", category: "notifications" },
  { id: "send_notifications", name: "Send Notifications", nameAr: "إرسال إشعارات", description: "إرسال إشعارات للمستخدمين", category: "notifications" },
  { id: "send_to_all", name: "Send to All", nameAr: "إرسال للكل", description: "إرسال إشعار لجميع المستخدمين", category: "notifications", parent: "send_notifications" },
  { id: "send_to_role", name: "Send to Role", nameAr: "إرسال لدور", description: "إرسال إشعار لدور معين", category: "notifications", parent: "send_notifications" },
  { id: "send_to_user", name: "Send to User", nameAr: "إرسال لمستخدم", description: "إرسال إشعار لمستخدم معين", category: "notifications", parent: "send_notifications" },
  { id: "manage_notifications", name: "Manage Notifications", nameAr: "إدارة الإشعارات", description: "إدارة الإشعارات", category: "notifications" },
  { id: "delete_notification", name: "Delete Notification", nameAr: "حذف إشعار", description: "حذف إشعار", category: "notifications", parent: "manage_notifications" },

  // الذكاء الاصطناعي
  { id: "use_ai_summary", name: "Use AI Summary", nameAr: "استخدام التلخيص", description: "استخدام ميزة التلخيص بالذكاء الاصطناعي", category: "ai" },
  { id: "use_ai_questions", name: "Use AI Questions", nameAr: "توليد الأسئلة", description: "توليد أسئلة من المحتوى", category: "ai" },
  { id: "use_ai_chat", name: "Use AI Chat", nameAr: "اسأل المستند", description: "محادثة مع المستند", category: "ai" },

  // التقارير
  { id: "view_reports", name: "View Reports", nameAr: "عرض التقارير", description: "عرض التقارير", category: "reports" },
  { id: "view_user_reports", name: "View User Reports", nameAr: "تقارير المستخدمين", description: "عرض تقارير المستخدمين", category: "reports", parent: "view_reports" },
  { id: "view_file_reports", name: "View File Reports", nameAr: "تقارير الملفات", description: "عرض تقارير الملفات", category: "reports", parent: "view_reports" },
  { id: "view_course_reports", name: "View Course Reports", nameAr: "تقارير المقررات", description: "عرض تقارير المقررات", category: "reports", parent: "view_reports" },
  { id: "export_reports", name: "Export Reports", nameAr: "تصدير التقارير", description: "تصدير التقارير", category: "reports", requires: ["view_reports"] },
  { id: "export_pdf", name: "Export PDF", nameAr: "تصدير PDF", description: "تصدير التقارير كـ PDF", category: "reports", parent: "export_reports" },
  { id: "export_excel", name: "Export Excel", nameAr: "تصدير Excel", description: "تصدير التقارير كـ Excel", category: "reports", parent: "export_reports" },
  { id: "generate_reports", name: "Generate Reports", nameAr: "إنشاء تقارير", description: "إنشاء تقارير مخصصة", category: "reports", requires: ["view_reports"] },

  // الإعدادات
  { id: "view_settings", name: "View Settings", nameAr: "عرض الإعدادات", description: "عرض صفحة الإعدادات", category: "settings" },
  { id: "edit_settings", name: "Edit Settings", nameAr: "تعديل الإعدادات", description: "تعديل الإعدادات", category: "settings", requires: ["view_settings"] },
  { id: "edit_general_settings", name: "Edit General Settings", nameAr: "الإعدادات العامة", description: "تعديل الإعدادات العامة", category: "settings", parent: "edit_settings" },
  { id: "edit_notification_settings", name: "Edit Notification Settings", nameAr: "إعدادات الإشعارات", description: "تعديل إعدادات الإشعارات", category: "settings", parent: "edit_settings" },
  { id: "edit_security_settings", name: "Edit Security Settings", nameAr: "إعدادات الأمان", description: "تعديل إعدادات الأمان", category: "settings", parent: "edit_settings" },

  // سجلات التدقيق
  { id: "view_audit_logs", name: "View Audit Logs", nameAr: "عرض السجلات", description: "عرض سجلات التدقيق", category: "audit" },
  { id: "filter_logs", name: "Filter Logs", nameAr: "فلترة السجلات", description: "فلترة سجلات التدقيق", category: "audit", parent: "view_audit_logs" },
  { id: "search_logs", name: "Search Logs", nameAr: "البحث في السجلات", description: "البحث في سجلات التدقيق", category: "audit", parent: "view_audit_logs" },
  { id: "export_audit_logs", name: "Export Audit Logs", nameAr: "تصدير السجلات", description: "تصدير سجلات التدقيق", category: "audit", requires: ["view_audit_logs"] },

  // سلة المحذوفات
  { id: "view_trash", name: "View Trash", nameAr: "عرض المحذوفات", description: "عرض العناصر المحذوفة", category: "trash" },
  { id: "restore_items", name: "Restore Items", nameAr: "استعادة العناصر", description: "استعادة العناصر المحذوفة", category: "trash", requires: ["view_trash"] },
  { id: "permanent_delete", name: "Permanent Delete", nameAr: "حذف نهائي", description: "حذف العناصر نهائياً", category: "trash", requires: ["view_trash"] },
];

// =============================================================================
// الدوال المساعدة
// =============================================================================

/**
 * التحقق من صلاحية
 */
export function hasPermission(userPermissions: string[], permission: string): boolean {
  // صلاحية كاملة (الأدمن)
  if (userPermissions.includes("__all__")) return true;
  
  return userPermissions.includes(permission);
}

/**
 * التحقق من أي صلاحية من قائمة
 */
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  if (userPermissions.includes("__all__")) return true;
  
  return permissions.some(p => userPermissions.includes(p));
}

/**
 * التحقق من كل الصلاحيات
 */
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
  if (userPermissions.includes("__all__")) return true;
  
  return permissions.every(p => userPermissions.includes(p));
}

/**
 * الحصول على الصلاحيات الفرعية
 */
export function getChildPermissions(parentId: string): Permission[] {
  return PERMISSIONS.filter(p => p.parent === parentId);
}

/**
 * الحصول على صلاحيات القسم
 */
export function getCategoryPermissions(categoryId: string): Permission[] {
  return PERMISSIONS.filter(p => p.category === categoryId);
}

/**
 * الحصول على الصلاحيات الرئيسية (بدون أب)
 */
export function getRootPermissions(categoryId: string): Permission[] {
  return PERMISSIONS.filter(p => p.category === categoryId && !p.parent);
}

/**
 * بناء شجرة الصلاحيات
 */
export interface PermissionTreeNode extends Permission {
  children: PermissionTreeNode[];
}

export function buildPermissionTree(categoryId: string): PermissionTreeNode[] {
  const rootPermissions = getRootPermissions(categoryId);
  
  function buildNode(permission: Permission): PermissionTreeNode {
    const children = getChildPermissions(permission.id);
    return {
      ...permission,
      children: children.map(buildNode)
    };
  }
  
  return rootPermissions.map(buildNode);
}

/**
 * الحصول على كل الصلاحيات المطلوبة (بما فيها التبعيات)
 */
export function getRequiredPermissions(permissionId: string): string[] {
  const permission = PERMISSIONS.find(p => p.id === permissionId);
  if (!permission) return [];
  
  const required: string[] = [permissionId];
  
  // إضافة الصلاحية الأب
  if (permission.parent) {
    required.push(...getRequiredPermissions(permission.parent));
  }
  
  // إضافة الصلاحيات المطلوبة
  if (permission.requires) {
    permission.requires.forEach(req => {
      required.push(...getRequiredPermissions(req));
    });
  }
  
  return [...new Set(required)]; // إزالة التكرار
}

/**
 * الحصول على كل الصلاحيات الفرعية (للتحديد التلقائي)
 */
export function getAllChildPermissions(permissionId: string): string[] {
  const children = getChildPermissions(permissionId);
  const result: string[] = [];
  
  children.forEach(child => {
    result.push(child.id);
    result.push(...getAllChildPermissions(child.id));
  });
  
  return result;
}

// =============================================================================
// الصادرات الافتراضية
// =============================================================================

export default {
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getChildPermissions,
  getCategoryPermissions,
  getRootPermissions,
  buildPermissionTree,
  getRequiredPermissions,
  getAllChildPermissions
};
