import type { Column } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FilterOperator, FilterVariant } from "../types/data-table";

// ─── Class Utilities ─────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Column Pinning Style ─────────────────────────────────────
export function getColumnPinningStyle<TData>({
  column,
}: {
  column: Column<TData>;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  if (!isPinned) return {};

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: "sticky",
    zIndex: 1,
  };
}

// ─── Filter Operators ────────────────────────────────────────
export function getDefaultFilterOperator(variant: FilterVariant): FilterOperator {
  switch (variant) {
    case "text":
      return "contains";
    case "number":
    case "range":
      return "equals";
    case "date":
    case "dateRange":
      return "equals";
    case "select":
    case "multiSelect":
      return "equals";
    case "boolean":
      return "equals";
    default:
      return "contains";
  }
}

export function getFilterOperators(
  variant: FilterVariant,
): { value: FilterOperator; label: string }[] {
  switch (variant) {
    case "text":
      return [
        { value: "contains", label: "contains" },
        { value: "doesNotContain", label: "does not contain" },
        { value: "startsWith", label: "starts with" },
        { value: "endsWith", label: "ends with" },
        { value: "equals", label: "equals" },
        { value: "notEquals", label: "not equals" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" },
      ];
    case "number":
    case "range":
      return [
        { value: "equals", label: "equals" },
        { value: "notEquals", label: "not equals" },
        { value: "isGreaterThan", label: "greater than" },
        { value: "isLessThan", label: "less than" },
        { value: "isGreaterThanOrEqual", label: "≥" },
        { value: "isLessThanOrEqual", label: "≤" },
        { value: "isBetween", label: "between" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" },
      ];
    case "date":
    case "dateRange":
      return [
        { value: "equals", label: "is" },
        { value: "notEquals", label: "is not" },
        { value: "isGreaterThan", label: "after" },
        { value: "isLessThan", label: "before" },
        { value: "isBetween", label: "between" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" },
      ];
    case "select":
    case "multiSelect":
      return [
        { value: "equals", label: "is" },
        { value: "notEquals", label: "is not" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" },
      ];
    case "boolean":
      return [
        { value: "equals", label: "is" },
        { value: "notEquals", label: "is not" },
      ];
    default:
      return [
        { value: "contains", label: "contains" },
        { value: "isEmpty", label: "is empty" },
        { value: "isNotEmpty", label: "is not empty" },
      ];
  }
}

// ─── Date Formatting ─────────────────────────────────────────
export function formatDate(
  date: Date | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: options?.month ?? "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

// ─── ID Generation ────────────────────────────────────────────
export function generateId({ length = 8 }: { length?: number } = {}): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

// ─── LocalStorage Helpers ─────────────────────────────────────
export function loadFromStorage<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // silent
  }
}

// ─── Range Helpers ────────────────────────────────────────────
export type RangeValue = [number, number];

export function getIsValidRange(value: unknown): value is RangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

export function parseValuesAsNumbers(value: unknown): RangeValue | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (v) =>
        (typeof v === "string" || typeof v === "number") && !Number.isNaN(v),
    )
  ) {
    return [Number(value[0]), Number(value[1])];
  }
  return undefined;
}

// ─── Date Parse Helpers ───────────────────────────────────────
export function parseAsDate(
  timestamp: number | string | undefined,
): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp =
    typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

export function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "number" || typeof item === "string") return item;
      return undefined;
    });
  }
  if (typeof value === "string" || typeof value === "number") return [value];
  return [];
}

// ─── Export Helpers ───────────────────────────────────────────
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
