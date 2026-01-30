/**
 * مكون PermissionSelector
 * 
 * واجهة اختيار الصلاحيات المتداخلة مع Accordion
 */

import React, { useState, useCallback } from 'react';
import { ChevronLeft, Check, Minus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PERMISSION_CATEGORIES,
  PERMISSIONS,
  Permission,
  PermissionCategory,
  buildPermissionTree,
  getAllChildPermissions,
  getRequiredPermissions,
  PermissionTreeNode,
  getSelectedCountInCategory,
} from '@/lib/permissions';

// =============================================================================
// الأنواع
// =============================================================================

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
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
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = useCallback((categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const togglePermission = useCallback((permissionId: string, checked: boolean) => {
    if (disabled) return;

    let newPermissions = [...selectedPermissions];

    if (checked) {
      const required = getRequiredPermissions(permissionId);
      newPermissions = Array.from(new Set([...newPermissions, ...required]));
    } else {
      const children = getAllChildPermissions(permissionId);
      const toRemove = [permissionId, ...children];
      newPermissions = newPermissions.filter(p => !toRemove.includes(p));
    }

    onChange(newPermissions);
  }, [selectedPermissions, onChange, disabled]);

  const toggleAllCategory = useCallback((categoryId: string, checked: boolean) => {
    if (disabled) return;

    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    let newPermissions = [...selectedPermissions];

    if (checked) {
      newPermissions = Array.from(new Set([...newPermissions, ...category.permissions]));
    } else {
      newPermissions = newPermissions.filter(p => !category.permissions.includes(p));
    }

    onChange(newPermissions);
  }, [selectedPermissions, onChange, disabled]);

  const isCategoryFullySelected = useCallback((categoryId: string): boolean => {
    const category = PERMISSION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return false;
    return category.permissions.every(p => selectedPermissions.includes(p));
  }, [selectedPermissions]);

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
  const { selected, total } = getSelectedCountInCategory(category.id, selectedPermissions);
  
  // الحصول على الأيقونة ديناميكياً
  const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Circle;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* رأس القسم */}
      <div className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-3 text-foreground font-medium flex-1"
        >
          <ChevronLeft 
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "-rotate-90"
            )}
          />
          <IconComponent className="w-4 h-4 text-primary" />
          <span>{category.nameAr}</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({selected}/{total})
          </span>
        </button>

        {/* زر تحديد الكل */}
        <label className="flex items-center gap-2 cursor-pointer px-2">
          <div 
            className={cn(
              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
              isFullySelected 
                ? "bg-primary border-primary" 
                : isPartiallySelected 
                  ? "bg-primary/50 border-primary" 
                  : "border-muted-foreground/50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                onToggleAll(!isFullySelected);
              }
            }}
          >
            {isFullySelected && <Check className="w-3 h-3 text-primary-foreground" />}
            {isPartiallySelected && !isFullySelected && <Minus className="w-3 h-3 text-primary-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground">الكل</span>
        </label>
      </div>

      {/* محتوى القسم */}
      {isOpen && (
        <div className="p-3 space-y-1 border-t border-border">
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
  const childrenSelected = hasChildren 
    ? node.children.filter(child => selectedPermissions.includes(child.id)).length 
    : 0;
  const isPartiallySelected = hasChildren && childrenSelected > 0 && childrenSelected < node.children.length;

  return (
    <div className="space-y-1">
      {/* الصلاحية */}
      <label
        className={cn(
          "flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-muted/50 transition-colors",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ marginRight: `${level * 20}px` }}
      >
        <div 
          className={cn(
            "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
            isSelected 
              ? "bg-primary border-primary" 
              : isPartiallySelected 
                ? "bg-primary/50 border-primary" 
                : "border-muted-foreground/50"
          )}
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) {
              onToggle(node.id, !isSelected);
            }
          }}
        >
          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          {isPartiallySelected && !isSelected && <Minus className="w-3 h-3 text-primary-foreground" />}
        </div>
        <span className={cn(
          "text-sm",
          isSelected ? "text-foreground" : "text-muted-foreground"
        )}>
          {node.nameAr}
        </span>
      </label>

      {/* الأبناء */}
      {hasChildren && (
        <div className="mr-4 border-r border-border/50 pr-2">
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

export default PermissionSelector;
