/**
 * @module data-table
 * Complete, composable data table system for TanStack Table.
 *
 * Usage:
 *   import { DataTable, DataTableToolbar, ... } from "@/components/data-table";
 */

// ─── Types ────────────────────────────────────────────────────
export type {
  Option,
  FilterVariant,
  FilterOperator,
  ExtendedColumnFilter,
  FilterConfig,
  FilterGroup,
  FilterCondition,
  ColumnMeta,
  EditConfig,
  ActionItem,
  ColumnFilter,
  CustomActionButton,
  ColumnSettings,
  GroupableColumn,
  ShortcutInfo,
  FilterItem,
  AvatarConfig,
  SheetMode,
  SheetSide,
  PaginationState,
  CustomStyles,
  QuickFilter,
} from "../../types/data-table";

// ─── Utils ────────────────────────────────────────────────────
export {
  cn,
  getColumnPinningStyle,
  getDefaultFilterOperator,
  getFilterOperators,
  formatDate,
  generateId,
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
  getIsValidRange,
  parseValuesAsNumbers,
  parseAsDate,
  parseColumnFilterValue,
  downloadFile,
} from "../../utils/data-table";
export type { RangeValue } from "../../utils/data-table";

// ─── Hooks ────────────────────────────────────────────────────
export {
  useDebouncedCallback,
  useGroupedData,
  useColumnWidths,
  useColumnSettings,
  useTableKeyboardShortcuts,
  useResizableColumn,
  TABLE_SHORTCUTS,
} from "../../hooks/use-data-table";

// ─── Core Table ───────────────────────────────────────────────
export { DataTable, DataTableSkeleton } from "./data-table/DataTable";
export { DataTablePagination } from "./data-table/DataTablePagination";

// ─── Column Components ────────────────────────────────────────
export {
  DataTableColumnHeader,
  ColumnHeader,
  DataTableViewOptions,
} from "./data-table/ColumnHeaders";

// ─── Row Components ───────────────────────────────────────────
export {
  CopyButton,
  CopyableCell,
  CopyableRow,
  DraggableRow,
  CellWithIcon,
  InlineEditCell,
} from "./data-table/RowComponents";

// ─── Filter Components ────────────────────────────────────────
export {
  DataTableFacetedFilter,
  DataTableSliderFilter,
  DataTableDateFilter,
  DataTableRangeFilter,
  FilterValueSelector,
} from "./data-table/FilterComponents";

// ─── Toolbar Components ───────────────────────────────────────
export {
  DataTableToolbar,
  DataTableAdvancedToolbar,
  DataTableFilterMenu,
  DataTableSortList,
} from "./data-table/ToolbarComponents";

// ─── Action Components ────────────────────────────────────────
export { TableActions, BulkActions, ExportButton } from "./data-table/ActionComponents";

// ─── Layout & UI Components ───────────────────────────────────
export {
  TableHeaderSection,
  FeatureCards,
  RowGroupingButton,
  GroupHeader,
  ResizableColumn,
  StickyColumn,
  StickyTableCell,
  KeyboardShortcutsHelp,
  RowDetailsSheet,
  DetailItem,
  DetailSection,
} from "./data-table/LayoutComponents";
