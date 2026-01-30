/**
 * مكون PermissionSelector
 * 
 * واجهة اختيار الصلاحيات المتداخلة مع Accordion
 */

import React, { useState, useCallback } from 'react';
import {
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  Permission,
  PermissionCategory,
  buildPermissionTree,
  getAllChildPermissions,
  getRequiredPermissions,
  PermissionTreeNode,
} from '../utils/permissions';

// =============================================================================
// الأنواع
// =============================================================================

interface PermissionSelectorProps {
  /** الصلاحيات المحددة حالياً */
  selectedPermissions: string[];
  
  /** دالة تحديث الصلاحيات */
  onChange: (permissions: string[]) => void;
  
  /** تعطيل التعديل */
  disabled?: boolean;
}

// =============================================================================
// المكون الرئيسي
// =============================================================================

export function PermissionSelector({
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionSelectorProps) {
  // الأقسام المفتوحة
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  // فتح/إغلاق قسم
  const toggleCategory = useCallback((categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // تحديد صلاحية
  const togglePermission = useCallback((permissionId: string, checked: boolean) => {
    if (disabled) return;

    let newPermissions = [...selectedPermissions];

    if (checked) {
      // إضافة الصلاحية والصلاحيات المطلوبة
      const required = getRequiredPermissions(permissionId);
      newPermissions = [...new Set([...newPermissions, ...required])];
    } else {
      // إزالة الصلاحية والصلاحيات الفرعية
      const children = getAllChildPermissions(permissionId);
      const toRemove = [permissionId, ...children];
      newPermissions = newPermissions.filter(p => !toRemove.includes(p));
    }

    onChange(newPermissions);
  }, [selectedPermissions, onChange, disabled]);

  // تحديد كل صلاحيات القسم
  const toggleAllCategory = useCallback((categoryId: string, checked: boolean) => {
    if (disabled) return;

    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    let newPermissions = [...selectedPermissions];

    if (checked) {
      // إضافة كل صلاحيات القسم
      newPermissions = [...new Set([...newPermissions, ...category.permissions])];
    } else {
      // إزالة كل صلاحيات القسم
      newPermissions = newPermissions.filter(p => !category.permissions.includes(p));
    }

    onChange(newPermissions);
  }, [selectedPermissions, onChange, disabled]);

  // التحقق من تحديد كل صلاحيات القسم
  const isCategoryFullySelected = useCallback((categoryId: string): boolean => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return false;
    return category.permissions.every(p => selectedPermissions.includes(p));
  }, [selectedPermissions]);

  // التحقق من تحديد بعض صلاحيات القسم
  const isCategoryPartiallySelected = useCallback((categoryId: string): boolean => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return false;
    const selected = category.permissions.filter(p => selectedPermissions.includes(p));
    return selected.length > 0 && selected.length < category.permissions.length;
  }, [selectedPermissions]);

  return (
    <div className="space-y-2">
      {PERMISSION_CATEGORIES.map(category => (
        <CategoryAccordion
          key={category.id}
          category={category}
          isOpen={openCategories.includes(category.id)}
          onToggle={() => toggleCategory(category.id)}
          selectedPermissions={selectedPermissions}
          onTogglePermission={togglePermission}
          onToggleAll={(checked) => toggleAllCategory(category.id, checked)}
          isFullySelected={isCategoryFullySelected(category.id)}
          isPartiallySelected={isCategoryPartiallySelected(category.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// =============================================================================
// مكون القسم (Accordion)
// =============================================================================

interface CategoryAccordionProps {
  category: PermissionCategory;
  isOpen: boolean;
  onToggle: () => void;
  selectedPermissions: string[];
  onTogglePermission: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  isFullySelected: boolean;
  isPartiallySelected: boolean;
  disabled: boolean;
}

function CategoryAccordion({
  category,
  isOpen,
  onToggle,
  selectedPermissions,
  onTogglePermission,
  onToggleAll,
  isFullySelected,
  isPartiallySelected,
  disabled,
}: CategoryAccordionProps) {
  const permissionTree = buildPermissionTree(category.id);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* رأس القسم */}
      <div className="flex items-center justify-between p-4 bg-muted/50">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-foreground font-medium"
        >
          {/* أيقونة الطي/الفتح */}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          {/* اسم القسم */}
          <span>{category.nameAr}</span>
          
          {/* عدد الصلاحيات المحددة */}
          <span className="text-xs text-muted-foreground">
            ({selectedPermissions.filter(p => category.permissions.includes(p)).length}/{category.permissions.length})
          </span>
        </button>

        {/* زر تحديد الكل */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFullySelected}
            ref={el => {
              if (el) el.indeterminate = isPartiallySelected;
            }}
            onChange={(e) => onToggleAll(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">تحديد الكل</span>
        </label>
      </div>

      {/* محتوى القسم */}
      {isOpen && (
        <div className="p-4 space-y-2">
          {permissionTree.map(node => (
            <PermissionNode
              key={node.id}
              node={node}
              level={0}
              selectedPermissions={selectedPermissions}
              onToggle={onTogglePermission}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// مكون الصلاحية (Node)
// =============================================================================

interface PermissionNodeProps {
  node: PermissionTreeNode;
  level: number;
  selectedPermissions: string[];
  onToggle: (id: string, checked: boolean) => void;
  disabled: boolean;
}

function PermissionNode({
  node,
  level,
  selectedPermissions,
  onToggle,
  disabled,
}: PermissionNodeProps) {
  const isSelected = selectedPermissions.includes(node.id);
  const hasChildren = node.children.length > 0;

  // التحقق من تحديد بعض الأبناء
  const isPartiallySelected = hasChildren && !isSelected &&
    node.children.some(child => selectedPermissions.includes(child.id));

  return (
    <div className="space-y-1">
      {/* الصلاحية */}
      <label
        className="flex items-center gap-2 cursor-pointer"
        style={{ paddingRight: `${level * 24}px` }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          ref={el => {
            if (el) el.indeterminate = isPartiallySelected;
          }}
          onChange={(e) => onToggle(node.id, e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <span className={`text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
          {node.nameAr}
        </span>
      </label>

      {/* الأبناء */}
      {hasChildren && (
        <div className="mr-4 border-r border-border pr-2">
          {node.children.map(child => (
            <PermissionNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedPermissions={selectedPermissions}
              onToggle={onToggle}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// مثال الاستخدام
// =============================================================================

/*
import { PermissionSelector } from './components/PermissionSelector';

function RoleForm() {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  return (
    <form>
      <div>
        <label>اسم الدور</label>
        <input type="text" />
      </div>

      <div>
        <label>الصلاحيات</label>
        <PermissionSelector
          selectedPermissions={selectedPermissions}
          onChange={setSelectedPermissions}
        />
      </div>

      <button type="submit">حفظ</button>
    </form>
  );
}
*/

export default PermissionSelector;
