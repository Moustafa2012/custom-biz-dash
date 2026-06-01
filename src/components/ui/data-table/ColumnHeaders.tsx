"use client";

import type { Column, Table } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  Settings2,
  X,
} from "lucide-react";
import * as React from "react";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "../../../utils/data-table";

// ─── DataTableColumnHeader ────────────────────────────────────

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { direction } = useLanguage();
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ms-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {label}
        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={direction === "rtl" ? "end" : "start"} className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className={cn(
                "relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-muted-foreground",
                direction === "rtl" && "flex-row-reverse",
              )}
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
              {t("تصاعدي", "Asc")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className={cn(
                "relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-muted-foreground",
                direction === "rtl" && "flex-row-reverse",
              )}
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
              {t("تنازلي", "Desc")}
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className={cn(
                  "ps-2 [&_svg]:text-muted-foreground",
                  direction === "rtl" && "flex-row-reverse",
                )}
                onClick={() => column.clearSorting()}
              >
                <X className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
                {t("إعادة تعيين", "Reset")}
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className={cn(
              "relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-muted-foreground",
              direction === "rtl" && "flex-row-reverse",
            )}
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
            {t("إخفاء", "Hide")}
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── ColumnHeader (sortable with tooltip) ────────────────────

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  align?: "left" | "center" | "right";
  tooltip?: string;
  iconSize?: string;
  defaultSortOrder?: "asc" | "desc";
  onClick?: (column: Column<TData, TValue>) => void;
  multiSortEnabled?: boolean;
  isRTL?: boolean;
}

export function ColumnHeader<TData, TValue>({
  column,
  title,
  align = "left",
  tooltip,
  iconSize = "h-4 w-4",
  defaultSortOrder,
  onClick,
  multiSortEnabled = false,
  isRTL: isRTLProp,
}: ColumnHeaderProps<TData, TValue>) {
  const { direction } = useLanguage();
  const isRTL = isRTLProp ?? direction === "rtl";
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized && defaultSortOrder && column.getCanSort()) {
      column.toggleSorting(defaultSortOrder === "desc", multiSortEnabled);
      setIsInitialized(true);
    }
  }, [defaultSortOrder, column, multiSortEnabled, isInitialized]);

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          "font-medium",
          align === "right" && "text-right",
          align === "center" && "text-center",
          align === "left" && "text-left",
        )}
      >
        {title}
      </div>
    );
  }

  const isSorted = column.getIsSorted();
  const ariaSort =
    isSorted === "asc"
      ? t("تصاعدي", "ascending")
      : isSorted === "desc"
        ? t("تنازلي", "descending")
        : t("لا يوجد", "none");

  const tooltipText = isSorted === "asc"
    ? t("فرز تنازلي", "Sort descending")
    : isSorted === "desc"
      ? t("إلغاء الفرز", "Clear sort")
      : t("فرز تصاعدي", "Sort ascending");

  const handleClick = () => {
    column.toggleSorting(isSorted === "asc", multiSortEnabled);
    onClick?.(column);
  };

  const renderSortIcon = () => {
    const iconClasses = cn(
      iconSize,
      isSorted ? "opacity-100" : "opacity-50",
      isRTL ? "mr-2" : "ml-2",
    );
    if (isSorted === "desc") return <ArrowDown className={iconClasses} aria-hidden="true" />;
    if (isSorted === "asc") return <ArrowUp className={iconClasses} aria-hidden="true" />;
    return <ArrowUpDown className={iconClasses} aria-hidden="true" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={handleClick}
            className={cn(
              "group h-auto p-0 hover:bg-transparent",
              align === "right" && "justify-end",
              align === "center" && "justify-center",
              align === "left" && "justify-start",
              isRTL ? "flex-row-reverse" : "flex-row",
            )}
            aria-sort={ariaSort}
            aria-label={`${title}, ${ariaSort}`}
          >
            <span
              className={cn(
                "font-medium transition-colors group-hover:text-primary",
                align === "right" && "text-right",
                align === "center" && "text-center",
                align === "left" && "text-left",
              )}
            >
              {title}
            </span>
            {renderSortIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltip || tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── DataTableViewOptions ─────────────────────────────────────

interface DataTableViewOptionsProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  disabled?: boolean;
}

export function DataTableViewOptions<TData>({
  table,
  disabled,
  ...props
}: DataTableViewOptionsProps<TData>) {
  const { direction } = useLanguage();
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        ),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label={t("تبديل الأعمدة", "Toggle columns")}
          role="combobox"
          variant="outline"
          size="sm"
          className={cn("ms-auto hidden h-8 font-normal lg:flex", direction === "rtl" && "flex-row-reverse")}
          disabled={disabled}
        >
          <Settings2 className={cn("text-muted-foreground", direction === "rtl" ? "ml-2" : "mr-2")} />
          {t("عرض", "View")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-0" align={direction === "rtl" ? "start" : "end"} {...props}>
        <Command dir={direction}>
          <CommandInput placeholder={t("بحث عن أعمدة...", "Search columns...")} />
          <CommandList>
            <CommandEmpty>{t("لم يتم العثور على أعمدة.", "No columns found.")}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                  className={cn(direction === "rtl" && "flex-row-reverse")}
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <Check
                    className={cn(
                      direction === "rtl" ? "me-auto" : "ms-auto",
                      "size-4 shrink-0",
                      column.getIsVisible() ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
