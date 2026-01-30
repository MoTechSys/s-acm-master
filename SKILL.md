# S-ACM Master Skill

> مهارة شاملة لفهم وتطوير مشروع S-ACM

---

## الوصف

هذه المهارة توفر كل المعلومات والمراجع اللازمة للعمل على مشروع S-ACM (نظام إدارة المحتوى الأكاديمي الذكي).

---

## متى تستخدم هذه المهارة؟

استخدم هذه المهارة عند:
- العمل على أي جزء من مشروع S-ACM
- فهم نظام الصلاحيات الديناميكي
- تطوير واجهات جديدة
- تحويل المشروع من React إلى Django
- إضافة ميزات جديدة

---

## هيكل المستودع

```
s-acm-master/
├── docs/                      # التوثيق الشامل
│   ├── project/              # فهم المشروع
│   │   ├── UNDERSTANDING.md  # الفهم الشامل
│   │   └── ROADMAP.md        # خريطة الطريق
│   ├── permissions/          # نظام الصلاحيات
│   │   └── SYSTEM.md         # توثيق الصلاحيات
│   ├── workflows/            # تدفقات العمليات
│   │   └── FLOWS.md          # التدفقات
│   └── design/               # التصميم
│       └── THEME.md          # الثيم والألوان
├── code/                      # الكود المرجعي
│   ├── utils/                # الأدوات
│   │   └── permissions.ts    # نظام الصلاحيات
│   ├── components/           # المكونات
│   │   ├── PermissionGate.tsx
│   │   └── PermissionSelector.tsx
│   └── frontend/             # كود React
│       └── mockData.ts       # البيانات الوهمية
└── SKILL.md                   # هذا الملف
```

---

## الملفات الأساسية

### للفهم العام
1. `docs/project/UNDERSTANDING.md` - ابدأ هنا لفهم المشروع
2. `docs/project/ROADMAP.md` - خريطة الطريق والمهام

### لنظام الصلاحيات
1. `docs/permissions/SYSTEM.md` - توثيق كامل للصلاحيات
2. `code/utils/permissions.ts` - كود نظام الصلاحيات
3. `code/components/PermissionGate.tsx` - مكون إخفاء العناصر
4. `code/components/PermissionSelector.tsx` - واجهة اختيار الصلاحيات

### للتصميم
1. `docs/design/THEME.md` - الألوان والخطوط والمكونات

### للتدفقات
1. `docs/workflows/FLOWS.md` - تدفقات العمليات

---

## المعلومات الأساسية

### نظام الصلاحيات
- **ديناميكي بالكامل** - لا أدوار ثابتة
- **3 مستويات** - قسم → رئيسية → فرعية
- **70+ صلاحية** موثقة
- **إخفاء ذكي** للعناصر

### التصميم (Omnitrix Theme)
- **اللون الرئيسي:** `#39ff14` (أخضر نيون)
- **الخلفية:** `#0f172a` (داكنة)
- **الخط:** Tajawal للعربية
- **دعم RTL:** كامل

### الصفحات (19 صفحة)
- صفحات المصادقة: 5
- صفحات النظام: 14

---

## كيفية الاستخدام

### 1. لفهم المشروع
```
اقرأ: docs/project/UNDERSTANDING.md
```

### 2. لفهم الصلاحيات
```
اقرأ: docs/permissions/SYSTEM.md
استخدم: code/utils/permissions.ts
```

### 3. لإضافة مكون محمي بصلاحية
```tsx
import { PermissionGate } from './components/PermissionGate';

<PermissionGate permission="add_user">
  <Button>إضافة مستخدم</Button>
</PermissionGate>
```

### 4. لإنشاء واجهة اختيار صلاحيات
```tsx
import { PermissionSelector } from './components/PermissionSelector';

<PermissionSelector
  selectedPermissions={permissions}
  onChange={setPermissions}
/>
```

---

## المستودعات المرتبطة

| المستودع | الغرض |
|----------|-------|
| s-acm-frontend | React Frontend |
| scamV4 | Django Backend (مرجع) |
| s-acm-skill | مهارة Manus |

---

## ملاحظات مهمة

1. **React Frontend** هو نموذج أولي فقط
2. **البيانات وهمية** في mockData.ts
3. **الهدف النهائي** هو Django + Bootstrap 5 + HTMX
4. **نفس التصميم** سينتقل للنسخة النهائية
