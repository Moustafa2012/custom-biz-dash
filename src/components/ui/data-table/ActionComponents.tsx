"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileText,
  Loader2,
  MoreHorizontal,
  Share2,
  Trash2,
  XCircle,
} from "lucide-react";

import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Table } from "@tanstack/react-table";
import type { ActionItem, CustomActionButton } from "../../../types/data-table";
import { cn, downloadFile } from "../../../utils/data-table";

// ─── TableActions ─────────────────────────────────────────────

interface TableActionsProps<T = unknown> {
  data: T;
  actions?: ActionItem<T>[];
  onView?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDownload?: (data: T) => void;
  onShare?: (data: T) => void;
  onDelete?: (data: T) => void;
  confirmDelete?: boolean;
  deleteMessage?: string;
  className?: string;
  menuWidth?: number;
  isRTL?: boolean;
}

export function TableActions<T = unknown>({
  data,
  actions = [],
  onView,
  onEdit,
  onDownload,
  onShare,
  onDelete,
  confirmDelete = true,
  deleteMessage,
  className = "",
  menuWidth = 192,
  isRTL: isRTLProp,
}: TableActionsProps<T>) {
  const { direction } = useLanguage();
  const isRTL = isRTLProp ?? direction === "rtl";
  const [isOpen, setIsOpen] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const defaultActions: ActionItem<T>[] = [
    onView && {
      id: "view",
      label: t("عرض", "View"),
      icon: <Eye className="w-4 h-4" />,
      onClick: onView,
    },
    onEdit && {
      id: "edit",
      label: t("تعديل", "Edit"),
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
    },
    onDownload && {
      id: "download",
      label: t("تحميل", "Download"),
      icon: <Download className="w-4 h-4" />,
      onClick: onDownload,
    },
    onShare && {
      id: "share",
      label: t("مشاركة", "Share"),
      icon: <Share2 className="w-4 h-4" />,
      onClick: onShare,
    },
    onDelete && {
      id: "delete",
      label: t("حذف", "Delete"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: confirmDelete ? () => setShowConfirm(true) : onDelete,
      variant: "destructive" as const,
    },
  ].filter(Boolean) as ActionItem<T>[];

  const allActions = [...defaultActions, ...actions].filter(
    (action) => !action.hidden,
  );

  const regularActions = allActions.filter((a) => a.variant !== "destructive");
  const destructiveActions = allActions.filter(
    (a) => a.variant === "destructive",
  );

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleAction = async (action: ActionItem<T>) => {
    if (action.disabled || isProcessing) return;
    try {
      setIsProcessing(true);
      await action.onClick(data);
      setIsOpen(false);
      setShowConfirm(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    try {
      setIsProcessing(true);
      await onDelete(data);
      setIsOpen(false);
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (allActions.length === 0) return null;

  return (
    <div
      className={cn("relative inline-flex", className)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isProcessing}
        className="inline-flex items-center justify-center w-8 h-8 text-muted-foreground transition-all rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isOpen ? t("إغلاق القائمة", "Close menu") : t("فتح القائمة", "Open menu")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <MoreHorizontal
          className="w-4 h-4 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute z-50 bg-popover text-popover-foreground rounded-lg shadow-lg ring-1 ring-border py-1 min-w-[180px]"
          style={{
            width: menuWidth,
            right: isRTL ? "auto" : 0,
            left: isRTL ? 0 : "auto",
            top: "100%",
            marginTop: 4,
          }}
        >
          <div className="p-1">
            {showConfirm ? (
              <div className="p-3 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    {deleteMessage || t("لا يمكن التراجع عن هذا الإجراء.", "This action cannot be undone.")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 focus:outline-none disabled:opacity-50 transition-colors"
                  >
                    {isProcessing ? t("جاري المعالجة...", "Processing...") : t("تأكيد", "Confirm")}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 text-sm font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 focus:outline-none disabled:opacity-50 transition-colors"
                  >
                    {t("إلغاء", "Cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {regularActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={action.disabled || isProcessing}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                      isRTL ? "flex-row-reverse text-right" : "text-left",
                    )}
                    role="menuitem"
                  >
                    {action.icon && (
                      <span className="flex-shrink-0 text-muted-foreground">
                        {action.icon}
                      </span>
                    )}
                    <span className="flex-1">{action.label}</span>
                  </button>
                ))}

                {destructiveActions.length > 0 && regularActions.length > 0 && (
                  <div className="my-1 h-px bg-border" />
                )}

                {destructiveActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action)}
                    disabled={action.disabled || isProcessing}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-red-600",
                      isRTL ? "flex-row-reverse text-right" : "text-left",
                    )}
                    role="menuitem"
                  >
                    {action.icon && (
                      <span className="flex-shrink-0 text-red-500">
                        {action.icon}
                      </span>
                    )}
                    <span className="flex-1">{action.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BulkActions ──────────────────────────────────────────────

interface BulkActionsProps<TData> {
  table: Table<TData>;
  onActivate?: (ids: string[]) => void | Promise<void>;
  onDeactivate?: (ids: string[]) => void | Promise<void>;
  onDelete?: (ids: string[]) => void | Promise<void>;
  onBulkActionSuccess?: (action: string, affectedIds: string[]) => void;
  confirmDeleteMessage?: string;
  actionButtons?: CustomActionButton[];
  clearSelectionAfterAction?: boolean;
  getRowId?: (row: TData) => string;
  disabled?: boolean;
}

export function BulkActions<TData>({
  table,
  onActivate,
  onDeactivate,
  onDelete,
  onBulkActionSuccess,
  confirmDeleteMessage,
  actionButtons = [],
  clearSelectionAfterAction = true,
  getRowId = (row: unknown) => (row as { id: string }).id,
  disabled = false,
}: BulkActionsProps<TData>) {
  const { direction } = useLanguage();
  const [actionState, setActionState] = React.useState<{
    isLoading: boolean;
    currentAction: string | null;
  }>({ isLoading: false, currentAction: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = React.useState<string[]>([]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const getSelectedIds = React.useCallback(
    () => selectedRows.map((row) => getRowId(row.original)),
    [selectedRows, getRowId],
  );

  const executeAction = async (
    actionName: string,
    actionFn: () => void | Promise<void>,
  ) => {
    setActionState({ isLoading: true, currentAction: actionName });
    try {
      await actionFn();
      const affectedIds = getSelectedIds();
      onBulkActionSuccess?.(actionName, affectedIds);
      if (clearSelectionAfterAction) table.resetRowSelection();
    } catch (error) {
      console.error(`Bulk action ${actionName} failed:`, error);
    } finally {
      setActionState({ isLoading: false, currentAction: null });
    }
  };

  const handleActivate = () => {
    if (!onActivate) return;
    const ids = getSelectedIds();
    executeAction("activate", () => onActivate(ids));
  };

  const handleDeactivate = () => {
    if (!onDeactivate) return;
    const ids = getSelectedIds();
    executeAction("deactivate", () => onDeactivate(ids));
  };

  const handleDeleteClick = () => {
    const ids = getSelectedIds();
    setPendingDeleteIds(ids);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (!onDelete) return;
    setShowDeleteConfirm(false);
    executeAction(
      "delete",
      () => onDelete(pendingDeleteIds),
    );
    setPendingDeleteIds([]);
  };

  const handleCustomAction = async (action: CustomActionButton) => {
    const ids = getSelectedIds();
    executeAction(action.id, () => action.onClick(ids));
  };

  if (selectedCount === 0) return null;

  const isActionDisabled = disabled || actionState.isLoading;

  return (
    <>
      <div 
        className="flex flex-wrap items-center gap-2 p-4 bg-accent/10 border border-accent rounded-lg"
        dir={direction}
      >
        <span className="text-sm font-medium text-accent-foreground mr-2 min-w-fit">
          {selectedCount} {t("صفوف مختارة", "row(s) selected")}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {onActivate && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleActivate}
              disabled={isActionDisabled}
              className="min-w-fit"
            >
              {actionState.isLoading && actionState.currentAction === "activate" ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", direction === "rtl" ? "ml-2" : "mr-2")} />
              ) : (
                <CheckCircle2 className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
              )}
              {t("تنشيط", "Activate")}
            </Button>
          )}

          {onDeactivate && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeactivate}
              disabled={isActionDisabled}
              className="min-w-fit"
            >
              {actionState.isLoading && actionState.currentAction === "deactivate" ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", direction === "rtl" ? "ml-2" : "mr-2")} />
              ) : (
                <XCircle className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
              )}
              {t("إلغاء التنشيط", "Deactivate")}
            </Button>
          )}

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              disabled={isActionDisabled}
              className="min-w-fit text-destructive hover:text-destructive"
            >
              {actionState.isLoading && actionState.currentAction === "delete" ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", direction === "rtl" ? "ml-2" : "mr-2")} />
              ) : (
                <Trash2 className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
              )}
              {t("حذف", "Delete")}
            </Button>
          )}

          {actionButtons.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "outline"}
              size="sm"
              onClick={() => handleCustomAction(action)}
              disabled={isActionDisabled || action.disabled}
              className="min-w-fit"
            >
              {actionState.isLoading && actionState.currentAction === action.id ? (
                <Loader2 className={cn("h-4 w-4 animate-spin", direction === "rtl" ? "ml-2" : "mr-2")} />
              ) : (
                action.icon && <span className={direction === "rtl" ? "ml-2" : "mr-2"}>{action.icon}</span>
              )}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent dir={direction}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("تأكيد الحذف", "Confirm deletion")}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeleteMessage ||
                t(
                  `هل أنت متأكد أنك تريد حذف ${pendingDeleteIds.length} من العناصر؟ لا يمكن التراجع عن هذا الإجراء.`,
                  `Are you sure you want to delete ${pendingDeleteIds.length} item${pendingDeleteIds.length !== 1 ? "s" : ""}? This action cannot be undone.`
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="mt-0">{t("إلغاء", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("حذف", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── ExportButton ─────────────────────────────────────────────

interface ExportButtonProps<TData> {
  table: Table<TData>;
  filename?: string;
  onExport?: (format: "csv" | "json" | "xlsx") => void;
}

export function ExportButton<TData>({
  table,
  filename = "export",
  onExport,
}: ExportButtonProps<TData>) {
  const { direction } = useLanguage();
  const [isExporting, setIsExporting] = React.useState(false);

  const getExportData = () => {
    const rows = table.getFilteredRowModel().rows;
    const columns = table
      .getAllColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "select" &&
          col.id !== "actions",
      );

    return rows.map((row) => {
      const rowData: Record<string, unknown> = {};
      columns.forEach((col) => {
        rowData[col.id] = row.getValue(col.id);
      });
      return rowData;
    });
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              const stringValue =
                value === null || value === undefined ? "" : String(value);
              return stringValue.includes(",") || stringValue.includes('"')
                ? `"${stringValue.replace(/"/g, '""')}"`
                : stringValue;
            })
            .join(","),
        ),
      ].join("\n");

      downloadFile(csvContent, `${filename}.csv`, "text/csv");
      onExport?.("csv");
    } catch (error) {
      console.error("CSV export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      if (data.length === 0) return;
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `${filename}.json`, "application/json");
      onExport?.("json");
    } catch (error) {
      console.error("JSON export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const data = getExportData();
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const tsvContent = [
        headers.join("\t"),
        ...data.map((row) =>
          headers.map((header) => row[header] ?? "").join("\t"),
        ),
      ].join("\n");

      downloadFile(
        tsvContent,
        `${filename}.xls`,
        "application/vnd.ms-excel",
      );
      onExport?.("xlsx");
    } catch (error) {
      console.error("Excel export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          disabled={isExporting}
        >
          <Download className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
          <span className="hidden sm:inline">{t("تصدير", "Export")}</span>
          <ChevronDown className={cn("h-4 w-4", direction === "rtl" ? "mr-1" : "ml-1")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-48">
        <DropdownMenuItem onClick={exportToCSV} className={cn("cursor-pointer", direction === "rtl" && "flex-row-reverse")}>
          <FileText className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
          {t("تصدير كـ CSV", "Export as CSV")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className={cn("cursor-pointer", direction === "rtl" && "flex-row-reverse")}>
          <FileJson className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
          {t("تصدير كـ JSON", "Export as JSON")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className={cn("cursor-pointer", direction === "rtl" && "flex-row-reverse")}>
          <FileSpreadsheet className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
          {t("تصدير كـ Excel", "Export as Excel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
