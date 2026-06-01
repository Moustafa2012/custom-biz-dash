import type React from "react";

// ─── Shared Option Type ───────────────────────────────────────
export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
}

// ─── Filter Types ─────────────────────────────────────────────
export type FilterVariant =
  | "text"
  | "number"
  | "range"
  | "date"
  | "dateRange"
  | "select"
  | "multiSelect"
  | "boolean";

export type FilterOperator =
  | "contains"
  | "doesNotContain"
  | "startsWith"
  | "endsWith"
  | "equals"
  | "notEquals"
  | "isEmpty"
  | "isNotEmpty"
  | "isBetween"
  | "isGreaterThan"
  | "isLessThan"
  | "isGreaterThanOrEqual"
  | "isLessThanOrEqual";

export interface ExtendedColumnFilter<TData> {
  id: Extract<keyof TData, string>;
  value: string | string[] | number | number[];
  variant: FilterVariant;
  operator: FilterOperator;
  filterId: string;
}

export interface FilterConfig {
  type: "text" | "date" | "number" | "select";
  value: string | string[];
  operator?:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greater"
    | "less";
}

export interface FilterGroup {
  id: string;
  operator: "AND" | "OR";
  conditions: FilterCondition[];
}

export interface FilterCondition {
  id: string;
  column: string;
  operator: string;
  value: string;
}

// ─── Column Meta ─────────────────────────────────────────────
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
}

export interface ColumnMeta {
  label?: string;
  placeholder?: string;
  variant?: FilterVariant;
  options?: Option[];
  range?: [number, number];
  unit?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// ─── Edit Config ─────────────────────────────────────────────
export interface EditConfig {
  type: "text" | "number" | "select" | "date";
  options?: { value: string; label: string }[];
  validation?: (value: unknown) => string | null;
  placeholder?: string;
}

// ─── Action Item ─────────────────────────────────────────────
export interface ActionItem<T = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (data: T) => void | Promise<void>;
  variant?: "default" | "destructive";
  disabled?: boolean;
  hidden?: boolean;
}

// ─── Column Filter (Toolbar) ──────────────────────────────────
export interface ColumnFilter {
  id: string;
  label: string;
  type: "select" | "text" | "date" | "number";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// ─── Custom Action Button (Bulk) ──────────────────────────────
export interface CustomActionButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  onClick: (ids: string[]) => void | Promise<void>;
  disabled?: boolean;
}

// ─── Column Settings ──────────────────────────────────────────
export interface ColumnSettings {
  visibility: Record<string, boolean>;
  order: string[];
  filters: Record<string, FilterConfig>;
}

// ─── Feature Props ────────────────────────────────────────────
export interface GroupableColumn {
  id: string;
  label: string;
}

export interface ShortcutInfo {
  key: string;
  modifier?: "ctrl" | "meta" | "alt" | "shift";
  description: string;
}

export interface FilterItem {
  label: string;
  value: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export interface AvatarConfig {
  src?: string;
  fallback: string;
  size?: "6" | "8" | "10" | "12" | "16";
}

export type SheetMode = "view" | "edit" | "add";
export type SheetSide = "right" | "left" | "top" | "bottom";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
}

export interface CustomStyles {
  triggerButton?: string;
  dropdown?: string;
  searchInput?: string;
  columnItem?: string;
  iconColor?: string;
  containerClassName?: string;
  buttonClassName?: string;
  inputClassName?: string;
}

// ─── Quick Filter ─────────────────────────────────────────────
export interface QuickFilter {
  label: string;
  onClick: () => void;
  active?: boolean;
}
