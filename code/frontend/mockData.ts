/**
 * البيانات الوهمية - S-ACM
 * 
 * هذا الملف يحتوي على البيانات الوهمية المستخدمة في النموذج الأولي
 */

import { PERMISSIONS, PERMISSION_CATEGORIES } from '../utils/permissions';

// =============================================================================
// الأنواع
// =============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  departmentId?: string;
  collegeId?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  usersCount: number;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  collegeId: string;
  departmentId: string;
  levelId: string;
  semesterId: string;
  instructorId?: string;
  filesCount: number;
  studentsCount: number;
  status: 'active' | 'inactive';
}

export interface File {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image' | 'video' | 'other';
  size: number;
  courseId: string;
  uploaderId: string;
  status: 'approved' | 'pending' | 'rejected';
  downloads: number;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  nameEn: string;
  departmentsCount: number;
}

export interface Department {
  id: string;
  name: string;
  nameEn: string;
  collegeId: string;
  coursesCount: number;
}

export interface Level {
  id: string;
  name: string;
  order: number;
}

export interface Semester {
  id: string;
  name: string;
  year: string;
  isCurrent: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  senderId: string;
  recipientType: 'all' | 'role' | 'user';
  recipientId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip: string;
  createdAt: string;
}

// =============================================================================
// البيانات الأكاديمية
// =============================================================================

export const colleges: College[] = [
  { id: 'col-1', name: 'كلية الحاسب الآلي', nameEn: 'College of Computer Science', departmentsCount: 3 },
  { id: 'col-2', name: 'كلية الهندسة', nameEn: 'College of Engineering', departmentsCount: 5 },
  { id: 'col-3', name: 'كلية العلوم', nameEn: 'College of Science', departmentsCount: 4 },
];

export const departments: Department[] = [
  { id: 'dep-1', name: 'علوم الحاسب', nameEn: 'Computer Science', collegeId: 'col-1', coursesCount: 12 },
  { id: 'dep-2', name: 'نظم المعلومات', nameEn: 'Information Systems', collegeId: 'col-1', coursesCount: 10 },
  { id: 'dep-3', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', collegeId: 'col-1', coursesCount: 8 },
  { id: 'dep-4', name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', collegeId: 'col-2', coursesCount: 15 },
  { id: 'dep-5', name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', collegeId: 'col-2', coursesCount: 14 },
];

export const levels: Level[] = [
  { id: 'lev-1', name: 'المستوى الأول', order: 1 },
  { id: 'lev-2', name: 'المستوى الثاني', order: 2 },
  { id: 'lev-3', name: 'المستوى الثالث', order: 3 },
  { id: 'lev-4', name: 'المستوى الرابع', order: 4 },
  { id: 'lev-5', name: 'المستوى الخامس', order: 5 },
  { id: 'lev-6', name: 'المستوى السادس', order: 6 },
  { id: 'lev-7', name: 'المستوى السابع', order: 7 },
  { id: 'lev-8', name: 'المستوى الثامن', order: 8 },
];

export const semesters: Semester[] = [
  { id: 'sem-1', name: 'الفصل الأول', year: '1446', isCurrent: false },
  { id: 'sem-2', name: 'الفصل الثاني', year: '1446', isCurrent: true },
  { id: 'sem-3', name: 'الفصل الصيفي', year: '1446', isCurrent: false },
];

// =============================================================================
// الأدوار
// =============================================================================

export const roles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    nameAr: 'مدير النظام',
    description: 'صلاحيات كاملة على النظام',
    permissions: ['__all__'],
    isSystem: true,
    usersCount: 1,
    createdAt: '2024-01-01',
  },
  {
    id: 'role-instructor',
    name: 'Instructor',
    nameAr: 'مدرس',
    description: 'إدارة المقررات والملفات',
    permissions: [
      'view_dashboard', 'view_statistics', 'view_course_stats', 'view_file_stats',
      'view_courses', 'view_course_details', 'view_course_files',
      'view_files', 'download_files', 'preview_files', 'upload_files', 'edit_files', 'delete_files',
      'view_notifications', 'send_notifications', 'send_to_role',
      'use_ai_summary', 'use_ai_questions', 'use_ai_chat',
    ],
    isSystem: false,
    usersCount: 15,
    createdAt: '2024-01-15',
  },
  {
    id: 'role-student',
    name: 'Student',
    nameAr: 'طالب',
    description: 'عرض المقررات والملفات',
    permissions: [
      'view_dashboard',
      'view_courses', 'view_course_details', 'view_course_files',
      'view_files', 'download_files', 'preview_files',
      'view_notifications',
      'use_ai_summary', 'use_ai_questions', 'use_ai_chat',
    ],
    isSystem: false,
    usersCount: 500,
    createdAt: '2024-01-15',
  },
  {
    id: 'role-supervisor',
    name: 'Department Supervisor',
    nameAr: 'مشرف قسم',
    description: 'إدارة قسم أكاديمي',
    permissions: [
      'view_dashboard', 'view_statistics',
      'view_users', 'view_user_details',
      'view_courses', 'view_course_details', 'view_course_files', 'add_course', 'edit_course', 'assign_instructor',
      'view_files', 'download_files', 'preview_files', 'approve_files',
      'view_notifications', 'send_notifications',
      'view_reports', 'export_reports',
    ],
    isSystem: false,
    usersCount: 5,
    createdAt: '2024-02-01',
  },
];

// =============================================================================
// المستخدمين
// =============================================================================

export const users: User[] = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'admin@sacm.edu',
    roleId: 'role-admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2026-01-30',
  },
  {
    id: 'user-2',
    name: 'د. خالد العمري',
    email: 'khalid@sacm.edu',
    roleId: 'role-instructor',
    departmentId: 'dep-1',
    collegeId: 'col-1',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2026-01-29',
  },
  {
    id: 'user-3',
    name: 'محمد سالم',
    email: 'mohammed@sacm.edu',
    roleId: 'role-student',
    departmentId: 'dep-1',
    collegeId: 'col-1',
    status: 'active',
    createdAt: '2024-02-01',
    lastLogin: '2026-01-28',
  },
  {
    id: 'user-4',
    name: 'د. سارة أحمد',
    email: 'sara@sacm.edu',
    roleId: 'role-supervisor',
    departmentId: 'dep-1',
    collegeId: 'col-1',
    status: 'active',
    createdAt: '2024-02-01',
    lastLogin: '2026-01-30',
  },
];

// =============================================================================
// المقررات
// =============================================================================

export const courses: Course[] = [
  {
    id: 'course-1',
    name: 'مقدمة في البرمجة',
    code: 'CS101',
    collegeId: 'col-1',
    departmentId: 'dep-1',
    levelId: 'lev-1',
    semesterId: 'sem-2',
    instructorId: 'user-2',
    filesCount: 15,
    studentsCount: 45,
    status: 'active',
  },
  {
    id: 'course-2',
    name: 'هياكل البيانات',
    code: 'CS201',
    collegeId: 'col-1',
    departmentId: 'dep-1',
    levelId: 'lev-2',
    semesterId: 'sem-2',
    instructorId: 'user-2',
    filesCount: 20,
    studentsCount: 38,
    status: 'active',
  },
  {
    id: 'course-3',
    name: 'قواعد البيانات',
    code: 'CS301',
    collegeId: 'col-1',
    departmentId: 'dep-1',
    levelId: 'lev-3',
    semesterId: 'sem-2',
    filesCount: 12,
    studentsCount: 42,
    status: 'active',
  },
];

// =============================================================================
// الملفات
// =============================================================================

export const files: File[] = [
  {
    id: 'file-1',
    name: 'المحاضرة الأولى - مقدمة.pdf',
    type: 'pdf',
    size: 2500000,
    courseId: 'course-1',
    uploaderId: 'user-2',
    status: 'approved',
    downloads: 120,
    createdAt: '2026-01-15',
  },
  {
    id: 'file-2',
    name: 'تمارين الفصل الأول.pdf',
    type: 'pdf',
    size: 1200000,
    courseId: 'course-1',
    uploaderId: 'user-2',
    status: 'approved',
    downloads: 85,
    createdAt: '2026-01-18',
  },
  {
    id: 'file-3',
    name: 'شرح المصفوفات.pptx',
    type: 'ppt',
    size: 5000000,
    courseId: 'course-2',
    uploaderId: 'user-2',
    status: 'pending',
    downloads: 0,
    createdAt: '2026-01-28',
  },
];

// =============================================================================
// الإشعارات
// =============================================================================

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'ملف جديد',
    message: 'تم رفع ملف جديد في مقرر مقدمة في البرمجة',
    type: 'info',
    senderId: 'user-2',
    recipientType: 'role',
    recipientId: 'role-student',
    isRead: false,
    createdAt: '2026-01-30T10:00:00',
  },
  {
    id: 'notif-2',
    title: 'تحديث النظام',
    message: 'سيتم إجراء صيانة للنظام يوم الجمعة',
    type: 'warning',
    senderId: 'user-1',
    recipientType: 'all',
    isRead: true,
    createdAt: '2026-01-29T14:00:00',
  },
];

// =============================================================================
// سجلات التدقيق
// =============================================================================

export const auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-1',
    action: 'تسجيل دخول',
    details: 'تسجيل دخول ناجح',
    ip: '192.168.1.1',
    createdAt: '2026-01-30T09:00:00',
  },
  {
    id: 'log-2',
    userId: 'user-2',
    action: 'رفع ملف',
    details: 'رفع ملف: شرح المصفوفات.pptx',
    ip: '192.168.1.2',
    createdAt: '2026-01-28T15:30:00',
  },
];

// =============================================================================
// الإحصائيات
// =============================================================================

export const statistics = {
  totalUsers: 521,
  totalFiles: 1250,
  totalCourses: 45,
  totalDownloads: 15420,
  activeUsers: 320,
  pendingFiles: 12,
};

// =============================================================================
// المستخدم الحالي (للاختبار)
// =============================================================================

export const currentUser = users[0]; // الأدمن

// =============================================================================
// دالة التحقق من الصلاحية
// =============================================================================

export function hasPermission(permission: string): boolean {
  const role = roles.find(r => r.id === currentUser.roleId);
  if (!role) return false;
  
  if (role.permissions.includes('__all__')) return true;
  return role.permissions.includes(permission);
}

// =============================================================================
// تصدير الصلاحيات
// =============================================================================

export { PERMISSIONS, PERMISSION_CATEGORIES };
