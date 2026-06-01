"use client";

import * as React from "react";
import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Keyboard,
  Layers,
  X,
  Save,
  Trash2,
  Edit,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type {
  FilterItem,
  GroupableColumn,
  ShortcutInfo,
  SheetMode,
} from "../../../types/data-table";
import { cn } from "../../../utils/data-table";
import { TABLE_SHORTCUTS } from "../../../hooks/use-data-table";

// ─── TableHeaderSection ───────────────────────────────────────

interface TableHeaderSectionProps {
  title: string;
  description: string;
  className?: string;
}

export function TableHeaderSection({
  title,
  description,
  className,
}: TableHeaderSectionProps) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/70 to-primary">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}

// ─── FeatureCards ─────────────────────────────────────────────

interface Feature {
  title: string;
  desc: string;
  icon: string;
}

interface FeatureCardsProps {
  features: Feature[];
  className?: string;
}

export function FeatureCards({ features, className }: FeatureCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {features.map((feature) => (
        <div
          key={feature.title}
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
        >
          <div className="text-3xl mb-2">{feature.icon}</div>
          <h3 className="font-semibold mb-1">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ─── RowGroupingButton ────────────────────────────────────────

interface RowGroupingButtonProps {
  groupableColumns: GroupableColumn[];
  activeGroup?: string | null;
  onGroupChange: (groupBy: string | null) => void;
}

export function RowGroupingButton({
  groupableColumns,
  activeGroup,
  onGroupChange,
}: RowGroupingButtonProps) {
  const { direction } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-9", direction === "rtl" && "flex-row-reverse")}>
          <Layers className={cn("h-4 w-4", direction === "rtl" ? "ml-2" : "mr-2")} />
          <span className="hidden sm:inline">{t("تجميع", "Group")}</span>
          {activeGroup && (
            <span className={cn("px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full", direction === "rtl" ? "mr-1" : "ml-1")}>
              {groupableColumns.find((c) => c.id === activeGroup)?.label}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-48">
        {groupableColumns.map((column) => (
          <DropdownMenuItem
            key={column.id}
            className={cn(
              "cursor-pointer",
              activeGroup === column.id && "bg-accent",
              direction === "rtl" && "flex-row-reverse"
            )}
            onClick={() => onGroupChange(column.id)}
          >
            {column.label}
          </DropdownMenuItem>
        ))}
        {activeGroup && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn("cursor-pointer text-muted-foreground", direction === "rtl" && "flex-row-reverse")}
              onClick={() => onGroupChange(null)}
            >
              {t("مسح التجميع", "Clear grouping")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── GroupHeader ──────────────────────────────────────────────

interface GroupHeaderProps {
  groupValue: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  depth?: number;
}

export function GroupHeader({
  groupValue,
  count,
  isExpanded,
  onToggle,
  depth = 0,
}: GroupHeaderProps) {
  const { direction } = useLanguage();
  return (
    <div
      className={cn(
        "flex items-center gap-2 py-3 px-4 bg-muted/50 border-y border-border cursor-pointer hover:bg-muted transition-colors",
        direction === "rtl" ? (depth > 0 && "pr-8") : (depth > 0 && "pl-8"),
        direction === "rtl" && "flex-row-reverse"
      )}
      onClick={onToggle}
    >
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          direction === "rtl" ? <ChevronRight className="h-4 w-4 rotate-180" /> : <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <span className="font-medium">{groupValue}</span>
      <span className="text-sm text-muted-foreground">({count} {t("عناصر", "items")})</span>
    </div>
  );
}

// ─── ResizableColumn ──────────────────────────────────────────

interface ResizableColumnProps {
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  onResize?: (width: number) => void;
  className?: string;
}

export function ResizableColumn({
  children,
  minWidth = 50,
  maxWidth = 500,
  initialWidth = 150,
  onResize,
  className,
}: ResizableColumnProps) {
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

  return (
    <div
      className={cn("relative", className)}
      style={{ width, minWidth, maxWidth }}
    >
      {children}
      <div
        className={cn(
          "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/30 transition-colors",
          isResizing && "bg-primary/50",
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

// ─── StickyColumn ─────────────────────────────────────────────

interface StickyColumnProps {
  children: ReactNode;
  position: "left" | "right";
  offset?: number;
  className?: string;
  zIndex?: number;
}

export function StickyColumn({
  children,
  position,
  offset = 0,
  className,
  zIndex = 10,
}: StickyColumnProps) {
  return (
    <div
      className={cn("sticky bg-inherit", className)}
      style={{ [position]: offset, zIndex }}
    >
      {children}
    </div>
  );
}

interface StickyTableCellProps {
  children: ReactNode;
  position: "left" | "right";
  offset?: number;
  className?: string;
  isHeader?: boolean;
}

export function StickyTableCell({
  children,
  position,
  offset = 0,
  className,
  isHeader = false,
}: StickyTableCellProps) {
  const bgClass = isHeader ? "bg-muted" : "bg-card";

  return (
    <div
      className={cn(
        "sticky",
        bgClass,
        position === "left"
          ? "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
          : "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
        className,
      )}
      style={{ [position]: offset, zIndex: isHeader ? 20 : 10 }}
    >
      {children}
    </div>
  );
}

// ─── KeyboardShortcutsHelp ────────────────────────────────────

interface KeyboardShortcutsHelpProps {
  shortcuts?: ShortcutInfo[];
}

export function KeyboardShortcutsHelp({
  shortcuts = TABLE_SHORTCUTS,
}: KeyboardShortcutsHelpProps) {
  const { direction } = useLanguage();
  const formatShortcut = (shortcut: ShortcutInfo) => {
    const parts: string[] = [];
    if (shortcut.modifier === "ctrl" || shortcut.modifier === "meta")
      parts.push(t("⌘/Ctrl", "⌘/Ctrl"));
    else if (shortcut.modifier === "alt") parts.push(t("Alt", "Alt"));
    else if (shortcut.modifier === "shift") parts.push(t("Shift", "Shift"));
    parts.push(shortcut.key);
    return parts;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("h-8 gap-2", direction === "rtl" && "flex-row-reverse")}>
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">{t("الاختصارات", "Shortcuts")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir={direction}>
        <DialogHeader>
          <DialogTitle className={cn(direction === "rtl" ? "text-right" : "text-left")}>
            {t("اختصارات لوحة المفاتيح", "Keyboard Shortcuts")}
          </DialogTitle>
          <DialogDescription className={cn(direction === "rtl" ? "text-right" : "text-left")}>
            {t("استخدم هذه الاختصارات للتنقل وإدارة الجدول بكفاءة.", "Use these shortcuts to navigate and manage the table efficiently.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50",
                direction === "rtl" && "flex-row-reverse"
              )}
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className={cn("flex items-center gap-1", direction === "rtl" && "flex-row-reverse")}>
                {formatShortcut(shortcut).map((part, i) => (
                  <kbd
                    key={i}
                    className="px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded shadow-sm"
                  >
                    {part}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── RowDetailsSheet ──────────────────────────────────────────

interface RowDetailsSheetProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: TData;
  title?: string;
  description?: string;
  mode?: SheetMode;
  onSave?: (data: TData) => void | Promise<void>;
  onDelete?: (data: TData) => void | Promise<void>;
  renderContent?: (data: TData, mode: SheetMode) => ReactNode;
  children?: ReactNode;
  allowEdit?: boolean;
  allowDelete?: boolean;
  side?: "right" | "left" | "top" | "bottom";
  width?: string;
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: string;
  customButtons?: ReactNode;
  activeFilters?: FilterItem[];
  onModeChange?: (mode: SheetMode) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  editButtonText?: string;
  deleteButtonText?: string;
  isRTL?: boolean;
}

export function RowDetailsSheet<TData = unknown>({
  open,
  onOpenChange,
  data,
  title: titleProp,
  description,
  mode: initialMode = "view",
  onSave,
  onDelete,
  renderContent,
  children,
  allowEdit = true,
  allowDelete = true,
  width = "w-full sm:max-w-xl",
  deleteConfirmTitle: deleteConfirmTitleProp,
  deleteConfirmDescription: deleteConfirmDescriptionProp,
  customButtons,
  activeFilters = [],
  onModeChange,
  saveButtonText: saveButtonTextProp,
  cancelButtonText: cancelButtonTextProp,
  editButtonText: editButtonTextProp,
  deleteButtonText: deleteButtonTextProp,
  isRTL: isRTLProp,
}: RowDetailsSheetProps<TData>) {
  const { direction } = useLanguage();
  const isRTL = isRTLProp ?? direction === "rtl";
  
  const title = titleProp || t("التفاصيل", "Details");
  const deleteConfirmTitle = deleteConfirmTitleProp || t("هل أنت متأكد؟", "Are you sure?");
  const deleteConfirmDescription = deleteConfirmDescriptionProp || t("لا يمكن التراجع عن هذا الإجراء.", "This action cannot be undone.");
  const saveButtonText = saveButtonTextProp || t("حفظ التغييرات", "Save Changes");
  const cancelButtonText = cancelButtonTextProp || t("إلغاء", "Cancel");
  const editButtonText = editButtonTextProp || t("تعديل", "Edit");
  const deleteButtonText = deleteButtonTextProp || t("حذف", "Delete");

  const [currentMode, setCurrentMode] = React.useState<SheetMode>(initialMode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode, open]);

  React.useEffect(() => {
    onModeChange?.(currentMode);
  }, [currentMode, onModeChange]);

  const handleSave = async () => {
    if (!onSave || !data) return;
    try {
      setIsLoading(true);
      await onSave(data);
      setCurrentMode("view");
      onOpenChange(false);
    } catch {
      // handled by caller
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete || !data) return;
    try {
      setIsLoading(true);
      await onDelete(data);
      onOpenChange(false);
    } catch {
      // handled by caller
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const sheetSide = isRTL ? "right" : "left";

  const getTitle = () => {
    if (currentMode === "add")
      return title.replace("Details", "Add New").replace(title, t(`إضافة ${title}`, `Add ${title}`));
    if (currentMode === "edit")
      return title.replace("Details", "Edit").replace(title, t(`تعديل ${title}`, `Edit ${title}`));
    return title;
  };

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={sheetSide}
          className={cn(
            width,
            "flex flex-col bg-background/95 backdrop-blur-md shadow-2xl ring-1 ring-border/50",
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <SheetHeader>
            <div
              className={cn(
                "flex items-center justify-between gap-4",
                isRTL && "flex-row-reverse",
              )}
            >
              <div className="flex-1 min-w-0">
                <SheetTitle
                  className={cn(
                    "text-2xl font-semibold tracking-tight truncate",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {getTitle()}
                </SheetTitle>
                {description && (
                  <SheetDescription
                    className={cn(
                      "mt-2 text-muted-foreground",
                      isRTL ? "text-right" : "text-left",
                    )}
                  >
                    {description}
                  </SheetDescription>
                )}
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 shrink-0",
                  isRTL && "flex-row-reverse",
                )}
              >
                {currentMode === "view" && (
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    {customButtons}
                    {allowEdit && onSave && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentMode("edit")}
                            disabled={isLoading}
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">{editButtonText}</TooltipContent>
                      </Tooltip>
                    )}
                    {allowDelete && onDelete && data && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isLoading}
                            className="hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">{deleteButtonText}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                )}
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>
            </div>

            {activeFilters.length > 0 && currentMode === "view" && (
              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border/50",
                  isRTL && "flex-row-reverse",
                )}
              >
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {t("الفلاتر النشطة:", "Active Filters:")}
                </span>
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant={filter.variant || "secondary"}
                    className={cn("px-3 py-1 text-sm rounded-full", isRTL && "flex-row-reverse")}
                  >
                    {filter.label}:{" "}
                    <span className={cn("font-semibold", isRTL ? "mr-1" : "ml-1")}>{filter.value}</span>
                  </Badge>
                ))}
              </div>
            )}
          </SheetHeader>

          <Separator className="my-6 border-border/50" />

          <ScrollArea className={cn("flex-1", isRTL ? "pl-4" : "pr-4")}>
            <div className={cn(isRTL ? "pl-4" : "pr-4", "space-y-6")}>
              {children ||
                (currentMode === "view" && data && renderContent
                  ? renderContent(data, currentMode)
                  : null)}
            </div>
          </ScrollArea>

          {(currentMode === "edit" || currentMode === "add") && (
            <>
              <Separator className="my-6 border-border/50" />
              <div
                className={cn(
                  "flex gap-3",
                  isRTL ? "justify-start flex-row-reverse" : "justify-end",
                )}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentMode("view");
                  }}
                  disabled={isLoading}
                >
                  <X className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {cancelButtonText}
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2
                      className={cn(
                        "h-4 w-4 animate-spin",
                        isRTL ? "ml-2" : "mr-2",
                      )}
                    />
                  ) : (
                    <Save
                      className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
                    />
                  )}
                  {saveButtonText}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          dir={isRTL ? "rtl" : "ltr"}
          className="rounded-xl border border-destructive/30"
        >
          <AlertDialogHeader>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold">
                {deleteConfirmTitle}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className={cn("mt-4 text-muted-foreground text-base", isRTL ? "text-right" : "text-left")}>
              {deleteConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn("mt-6 gap-2", isRTL ? "flex-row justify-start" : "flex-row justify-end")}>
            <AlertDialogCancel disabled={isLoading} className="mt-0">
              {cancelButtonText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className={cn(
                      "h-4 w-4 animate-spin",
                      isRTL ? "ml-2" : "mr-2",
                    )}
                  />
                  {t("جاري الحذف...", "Deleting...")}
                </>
              ) : (
                <>
                  <Trash2
                    className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
                  />
                  {deleteButtonText}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

// ─── DetailItem ───────────────────────────────────────────────

interface DetailItemProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  isRTL?: boolean;
}

export function DetailItem({ label, value, icon, isRTL = false }: DetailItemProps) {
  return (
    <div className="group py-4 border-b last:border-0 hover:bg-muted/10 -mx-3 px-3 rounded-xl transition-all duration-300">
      <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
        {icon && (
          <div className="mt-1 text-muted-foreground group-hover:text-primary transition-colors duration-300 flex-shrink-0">
            {icon}
          </div>
        )}
        <div className={cn("flex-1 space-y-1", isRTL ? "text-right" : "text-left")}>
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {label}
          </p>
          <div className="text-base font-medium leading-relaxed text-foreground">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DetailSection ────────────────────────────────────────────

interface DetailSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  isRTL?: boolean;
  collapsible?: boolean;
}

export function DetailSection({
  title,
  children,
  icon,
  isRTL = false,
  collapsible = false,
}: DetailSectionProps) {
  if (collapsible) {
    return (
      <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-500">
        <Accordion type="single" collapsible defaultValue="section">
          <AccordionItem value="section" className="border-0">
            <AccordionTrigger
              className={cn(
                "px-5 py-4 hover:no-underline hover:bg-muted/10",
                isRTL && "flex-row-reverse",
              )}
            >
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                {icon && (
                  <span className="text-primary bg-primary/5 p-2 rounded-full ring-1 ring-primary/10">
                    {icon}
                  </span>
                )}
                <h3
                  className={cn(
                    "text-lg font-semibold tracking-tight",
                    isRTL ? "text-right" : "text-left",
                  )}
                >
                  {title}
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 space-y-2">
              {children}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-all duration-500">
      <div className={cn("flex items-center gap-3 mb-4", isRTL && "flex-row-reverse")}>
        {icon && (
          <span className="text-primary bg-primary/5 p-2 rounded-full ring-1 ring-primary/10">
            {icon}
          </span>
        )}
        <h3
          className={cn(
            "text-lg font-semibold tracking-tight",
            isRTL ? "text-right" : "text-left",
          )}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
