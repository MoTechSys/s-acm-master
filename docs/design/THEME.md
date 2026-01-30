# 🎨 التصميم والثيم (Omnitrix Theme)

> آخر تحديث: 2026-01-30

---

## 1. نظرة عامة

يستخدم مشروع S-ACM تصميم **Omnitrix Theme** المستوحى من ساعة Omnitrix الشهيرة. يتميز التصميم بالأناقة والحداثة مع لمسة تقنية مميزة.

---

## 2. الألوان

### الألوان الأساسية

| اللون | الكود | CSS Variable | الاستخدام |
|-------|-------|--------------|----------|
| **أخضر نيون** | `#39ff14` | `--primary` | اللون الرئيسي، الأزرار، العناصر المميزة |
| **خلفية داكنة** | `#0f172a` | `--background` | خلفية الصفحات |
| **خلفية البطاقات** | `#1e293b` | `--card` | خلفية البطاقات والعناصر |
| **نص رئيسي** | `#f8fafc` | `--foreground` | النصوص الرئيسية |
| **نص ثانوي** | `#94a3b8` | `--muted-foreground` | النصوص الثانوية |
| **حدود** | `#334155` | `--border` | حدود العناصر |

### ألوان الحالات

| الحالة | اللون | الكود | الاستخدام |
|--------|-------|-------|----------|
| نجاح | أخضر | `#22c55e` | رسائل النجاح |
| تحذير | أصفر | `#eab308` | رسائل التحذير |
| خطأ | أحمر | `#ef4444` | رسائل الخطأ |
| معلومات | أزرق | `#3b82f6` | رسائل المعلومات |

### CSS Variables

```css
:root {
  --primary: 120 100% 54%;        /* #39ff14 */
  --primary-foreground: 0 0% 0%;  /* أسود */
  --background: 222 47% 11%;      /* #0f172a */
  --foreground: 210 40% 98%;      /* #f8fafc */
  --card: 217 33% 17%;            /* #1e293b */
  --card-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  --border: 217 33% 27%;
  --destructive: 0 84% 60%;       /* أحمر */
  --success: 142 71% 45%;         /* أخضر */
  --warning: 48 96% 53%;          /* أصفر */
}
```

---

## 3. الخطوط

### الخط العربي: Tajawal

```html
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
```

### الخط الإنجليزي: Inter

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### أحجام الخطوط

| الفئة | الحجم | الاستخدام |
|-------|-------|----------|
| `text-xs` | 12px | التفاصيل الصغيرة |
| `text-sm` | 14px | النصوص الثانوية |
| `text-base` | 16px | النص الأساسي |
| `text-lg` | 18px | العناوين الفرعية |
| `text-xl` | 20px | العناوين |
| `text-2xl` | 24px | العناوين الكبيرة |
| `text-3xl` | 30px | عناوين الصفحات |

---

## 4. المسافات والأبعاد

### نظام المسافات

| الفئة | القيمة | الاستخدام |
|-------|--------|----------|
| `p-2` | 8px | padding صغير |
| `p-4` | 16px | padding داخلي للبطاقات |
| `p-6` | 24px | padding للأقسام |
| `gap-2` | 8px | مسافة صغيرة |
| `gap-4` | 16px | مسافة بين العناصر |
| `gap-6` | 24px | مسافة بين الأقسام |

### الزوايا المستديرة

| الفئة | القيمة | الاستخدام |
|-------|--------|----------|
| `rounded-sm` | 4px | زوايا صغيرة |
| `rounded-md` | 6px | زوايا متوسطة |
| `rounded-lg` | 8px | زوايا البطاقات |
| `rounded-xl` | 12px | زوايا الأقسام الكبيرة |
| `rounded-full` | 9999px | الأزرار الدائرية |

---

## 5. الظلال والتأثيرات

### الظلال

| الفئة | الاستخدام |
|-------|----------|
| `shadow-sm` | ظل خفيف للعناصر الصغيرة |
| `shadow-md` | ظل متوسط للبطاقات |
| `shadow-lg` | ظل كبير للنوافذ المنبثقة |

### تأثير التوهج (Glow)

```css
.shadow-glow {
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.shadow-glow-sm {
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.2);
}

.shadow-glow-lg {
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
}
```

---

## 6. الأيقونات

### مكتبة Lucide React

```bash
npm install lucide-react
```

### أيقونات القائمة الجانبية

| الصفحة | الأيقونة | الاستيراد |
|--------|----------|----------|
| لوحة التحكم | `LayoutDashboard` | `import { LayoutDashboard } from 'lucide-react'` |
| المستخدمين | `Users` | `import { Users } from 'lucide-react'` |
| الأدوار | `Shield` | `import { Shield } from 'lucide-react'` |
| المقررات | `BookOpen` | `import { BookOpen } from 'lucide-react'` |
| الملفات | `Files` | `import { Files } from 'lucide-react'` |
| البيانات الأكاديمية | `GraduationCap` | `import { GraduationCap } from 'lucide-react'` |
| الإشعارات | `Bell` | `import { Bell } from 'lucide-react'` |
| الذكاء الاصطناعي | `Brain` | `import { Brain } from 'lucide-react'` |
| التقارير | `BarChart` | `import { BarChart } from 'lucide-react'` |
| الإعدادات | `Settings` | `import { Settings } from 'lucide-react'` |
| سجلات التدقيق | `ClipboardList` | `import { ClipboardList } from 'lucide-react'` |
| سلة المحذوفات | `Trash2` | `import { Trash2 } from 'lucide-react'` |

---

## 7. المكونات الأساسية

### الأزرار

| النوع | الوصف | الألوان |
|-------|-------|---------|
| Primary | الزر الرئيسي | خلفية خضراء نيون، نص أسود |
| Secondary | الزر الثانوي | خلفية رمادية داكنة، نص أبيض |
| Destructive | زر الحذف | خلفية حمراء، نص أبيض |
| Ghost | زر شفاف | بدون خلفية، نص أبيض |
| Outline | زر بحدود | حدود خضراء، نص أخضر |

```tsx
// Primary Button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  إضافة
</Button>

// Destructive Button
<Button variant="destructive">
  حذف
</Button>

// Ghost Button
<Button variant="ghost">
  إلغاء
</Button>
```

### البطاقات

```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle>العنوان</CardTitle>
    <CardDescription>الوصف</CardDescription>
  </CardHeader>
  <CardContent>
    المحتوى
  </CardContent>
</Card>
```

### الجداول

```tsx
<Table>
  <TableHeader className="bg-muted/50">
    <TableRow>
      <TableHead>العمود</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/30">
      <TableCell>البيانات</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### حقول الإدخال

```tsx
<Input 
  className="bg-muted border-border focus:border-primary"
  placeholder="أدخل النص..."
/>
```

---

## 8. دعم RTL

### إعداد HTML

```html
<html lang="ar" dir="rtl">
```

### Tailwind RTL

```tsx
// القائمة الجانبية على اليمين
<aside className="fixed right-0 top-0 h-full w-64">

// الأيقونة قبل النص
<span className="flex items-center gap-2">
  <Icon className="rtl:rotate-180" />
  النص
</span>
```

### فئات RTL

| الفئة | الوصف |
|-------|-------|
| `rtl:` | تطبيق في وضع RTL فقط |
| `ltr:` | تطبيق في وضع LTR فقط |
| `rtl:rotate-180` | قلب الأيقونة في RTL |
| `rtl:space-x-reverse` | عكس المسافات في RTL |

---

## 9. الرسوم المتحركة

### الانتقالات الأساسية

```css
transition-all duration-200 ease-in-out
```

### تأثيرات Hover

```tsx
// البطاقات
<Card className="transition-shadow hover:shadow-lg">

// الأزرار
<Button className="transition-colors hover:bg-primary/90">

// الروابط
<Link className="transition-colors hover:text-primary">
```

### تأثيرات التحميل

```tsx
// Skeleton
<Skeleton className="h-4 w-full animate-pulse" />

// Spinner
<Loader2 className="h-4 w-4 animate-spin" />
```

---

## 10. التصميم المتجاوب

### نقاط التوقف

| الفئة | الحجم | الاستخدام |
|-------|-------|----------|
| `sm` | 640px | الهواتف الكبيرة |
| `md` | 768px | الأجهزة اللوحية |
| `lg` | 1024px | الشاشات الصغيرة |
| `xl` | 1280px | الشاشات الكبيرة |
| `2xl` | 1536px | الشاشات الكبيرة جداً |

### القائمة الجانبية

```tsx
// الشاشات الكبيرة: ثابتة
// الشاشات الصغيرة: Drawer

<aside className="hidden lg:block fixed right-0 w-64">
  {/* القائمة الثابتة */}
</aside>

<Sheet>
  <SheetTrigger className="lg:hidden">
    <Menu />
  </SheetTrigger>
  <SheetContent side="right">
    {/* القائمة المنسدلة */}
  </SheetContent>
</Sheet>
```

### الجداول المتجاوبة

```tsx
// الشاشات الكبيرة: جدول
// الشاشات الصغيرة: بطاقات

<div className="hidden md:block">
  <Table>...</Table>
</div>

<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```
