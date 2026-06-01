"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type ColumnPinningState,
} from "@tanstack/react-table";
import type { ShortcutInfo } from "../types/data-table";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../utils/data-table";

// ─── useDataTable ─────────────────────────────────────────────

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount?: number;
  initialState?: {
    pagination?: Partial<PaginationState>;
    sorting?: SortingState;
    columnVisibility?: VisibilityState;
    columnFilters?: ColumnFiltersState;
    columnPinning?: ColumnPinningState;
  };
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  initialState,
}: UseDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialState?.columnPinning ?? {},
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      columnPinning,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  return { table };
}

// ─── useDebouncedCallback ─────────────────────────────────────

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  return React.useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );
}

// ─── useGroupedData ───────────────────────────────────────────

export function useGroupedData<TData>(
  data: TData[],
  groupBy: string | null,
  getGroupValue: (item: TData, key: string) => string,
) {
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set(),
  );

  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;

    const groups = new Map<string, TData[]>();
    data.forEach((item) => {
      const groupValue = getGroupValue(item, groupBy);
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(item);
    });

    return groups;
  }, [data, groupBy, getGroupValue]);

  const toggleGroup = (groupValue: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupValue)) {
        next.delete(groupValue);
      } else {
        next.add(groupValue);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (groupedData) {
      setExpandedGroups(new Set(groupedData.keys()));
    }
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  return { groupedData, expandedGroups, toggleGroup, expandAll, collapseAll };
}

// ─── useColumnWidths ──────────────────────────────────────────

export function useColumnWidths(initialWidths: Record<string, number> = {}) {
  const [columnWidths, setColumnWidths] =
    React.useState<Record<string, number>>(initialWidths);

  const setColumnWidth = React.useCallback(
    (columnId: string, width: number) => {
      setColumnWidths((prev) => ({ ...prev, [columnId]: width }));
    },
    [],
  );

  const resetWidths = React.useCallback(() => {
    setColumnWidths(initialWidths);
  }, [initialWidths]);

  return { columnWidths, setColumnWidth, resetWidths };
}

// ─── useColumnSettings (persistence) ─────────────────────────

interface ColumnSettings {
  visibility: Record<string, boolean>;
  order: string[];
}

export function useColumnSettings(storageKey: string) {
  const fullKey = `datatable_settings_${storageKey}`;

  const load = React.useCallback(
    (): ColumnSettings | null => loadFromStorage<ColumnSettings>(fullKey),
    [fullKey],
  );

  const save = React.useCallback(
    (settings: ColumnSettings) => saveToStorage(fullKey, settings),
    [fullKey],
  );

  const reset = React.useCallback(
    () => removeFromStorage(fullKey),
    [fullKey],
  );

  return { load, save, reset };
}

// ─── useTableKeyboardShortcuts ────────────────────────────────

export const TABLE_SHORTCUTS: ShortcutInfo[] = [
  {
    key: "F",
    modifier: "ctrl",
    description: "Toggle filter menu",
  },
  {
    key: "S",
    modifier: "ctrl",
    description: "Toggle sort menu",
  },
  {
    key: "A",
    modifier: "ctrl",
    description: "Select all rows",
  },
  {
    key: "Escape",
    description: "Clear selection / close menu",
  },
  {
    key: "Delete",
    description: "Remove last active filter or sort",
  },
];

interface UseTableKeyboardShortcutsOptions<TData = any> {
  table?: import("@tanstack/react-table").Table<TData>;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onToggleFilter?: () => void;
  onToggleSort?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  shortcuts?: ShortcutInfo[];
  enabled?: boolean;
}

export function useTableKeyboardShortcuts<TData>({
  table,
  onSelectAll,
  onClearSelection,
  onToggleFilter,
  onToggleSort,
  onSearch,
  onRefresh,
  onExport,
  onDelete,
  enabled = true,
}: UseTableKeyboardShortcutsOptions<TData> = {}) {
  React.useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      // Skip when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      )
        return;

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd && event.key.toLowerCase() === "a") {
        event.preventDefault();
        if (onSelectAll) onSelectAll();
        else table?.toggleAllRowsSelected(true);
        return;
      }

      if (event.key === "Escape") {
        if (onClearSelection) onClearSelection();
        else table?.resetRowSelection();
        return;
      }

      if (isCtrlOrCmd && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        onToggleFilter?.();
        onSearch?.();
        return;
      }

      if (isCtrlOrCmd && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        onToggleSort?.();
        return;
      }

      if (isCtrlOrCmd && event.key.toLowerCase() === "f") {
        event.preventDefault();
        onSearch?.();
        return;
      }

      if (isCtrlOrCmd && event.key.toLowerCase() === "r") {
        event.preventDefault();
        onRefresh?.();
        return;
      }

      if (isCtrlOrCmd && event.key.toLowerCase() === "e") {
        event.preventDefault();
        onExport?.();
        return;
      }

      if (event.key === "Delete" || (isCtrlOrCmd && event.key === "Backspace")) {
        onDelete?.();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onSelectAll, onClearSelection, onToggleFilter, onToggleSort, onSearch, onRefresh, onExport, onDelete, table]);
}

// ─── useResizableColumn ───────────────────────────────────────

interface UseResizableColumnOptions {
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  onResize?: (width: number) => void;
}

export function useResizableColumn({
  minWidth = 50,
  maxWidth = 500,
  initialWidth = 150,
  onResize,
}: UseResizableColumnOptions = {}) {
  const [width, setWidth] = React.useState(initialWidth);
  const [isResizing, setIsResizing] = React.useState(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(0);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = width;
    },
    [width],
  );

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidthRef.current + diff),
      );
      setWidth(newWidth);
      onResize?.(newWidth);
    },
    [isResizing, minWidth, maxWidth, onResize],
  );

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { width, isResizing, handleMouseDown };
}
