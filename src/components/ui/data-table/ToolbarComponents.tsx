"use client";

import type { Column, ColumnSort, SortDirection, Table as TanstackTable } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import {
  ArrowDownUp,
  Check,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import type { ExtendedColumnFilter, FilterOperator } from "../../../types/data-table";
import {
  cn,
  formatDate,
  generateId,
  getDefaultFilterOperator,
  getFilterOperators,
} from "../../../utils/data-table";
import {
  DataTableDateFilter,
  DataTableFacetedFilter,
  DataTableRangeFilter,
  DataTableSliderFilter,
  FilterValueSelector,
} from "@/components/ui/data-table";
import { DataTableViewOptions } from "@/components/ui/data-table";

const FILTER_SHORTCUT_KEY = "f";
const SORT_SHORTCUT_KEY = "s";
const REMOVE_SHORTCUTS = ["backspace", "delete"];

// ─── DataTableToolbar ─────────────────────────────────────────

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const { direction } = useLanguage();
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  );

  const onReset = React.useCallback(() => table.resetColumnFilters(), [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className,
      )}
      dir={direction}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label={t("إعادة تعيين الفلاتر", "Reset filters")}
            variant="outline"
            size="sm"
            className={cn("border-dashed", direction === "rtl" && "flex-row-reverse")}
            onClick={onReset}
          >
            <X className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
            {t("إعادة تعيين", "Reset")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} align={direction === "rtl" ? "start" : "end"} />
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  const { direction } = useLanguage();
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
            dir={direction}
          />
        );

      case "number":
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn("h-8 w-[120px]", columnMeta.unit && (direction === "rtl" ? "ps-8" : "pe-8"))}
              dir={direction}
            />
            {columnMeta.unit && (
              <span className={cn(
                "absolute top-0 bottom-0 flex items-center bg-accent px-2 text-muted-foreground text-sm",
                direction === "rtl" ? "start-0 rounded-s-md" : "end-0 rounded-e-md"
              )}>
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case "range":
        return (
          <DataTableSliderFilter
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === "dateRange"}
          />
        );

      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === "multiSelect"}
          />
        );

      default:
        return null;
    }
  }, [column, columnMeta, direction]);

  return onFilterRender();
}

// ─── DataTableAdvancedToolbar ─────────────────────────────────

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const { direction } = useLanguage();
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className,
      )}
      dir={direction}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} align={direction === "rtl" ? "start" : "end"} />
      </div>
    </div>
  );
}
// ─── DataTableFilterMenu ──────────────────────────────────────

const DEBOUNCE_MS = 300;

interface DataTableFilterMenuProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: TanstackTable<TData>;
  filters: ExtendedColumnFilter<TData>[];
  onFiltersChange: (filters: ExtendedColumnFilter<TData>[]) => void;
  debounceMs?: number;
  disabled?: boolean;
}

export function DataTableFilterMenu<TData>({
  table,
  filters,
  onFiltersChange,
  debounceMs = DEBOUNCE_MS,
  disabled,
  ...props
}: DataTableFilterMenuProps<TData>) {
  const { direction } = useLanguage();
  const id = React.useId();
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.columnDef.enableColumnFilter),
    [table],
  );

  const [open, setOpen] = React.useState(false);
  const [selectedColumn, setSelectedColumn] =
    React.useState<Column<TData> | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    }
  }, []);

  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        REMOVE_SHORTCUTS.includes(event.key.toLowerCase()) &&
        !inputValue &&
        selectedColumn
      ) {
        event.preventDefault();
        setSelectedColumn(null);
      }
    },
    [inputValue, selectedColumn],
  );

  const onFilterAdd = React.useCallback(
    (column: Column<TData>, value: string) => {
      if (
        !value.trim() &&
        column.columnDef.meta?.variant !== "boolean"
      )
        return;

      const filterValue =
        column.columnDef.meta?.variant === "multiSelect" ? [value] : value;
      const newFilter: ExtendedColumnFilter<TData> = {
        id: column.id as Extract<keyof TData, string>,
        value: filterValue,
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text",
        ),
        filterId: generateId({ length: 8 }),
      };

      onFiltersChange([...filters, newFilter]);
      setOpen(false);
      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    },
    [filters, onFiltersChange],
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      onFiltersChange(filters.filter((filter) => filter.filterId !== filterId));
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [filters, onFiltersChange],
  );

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
    ) => {
      onFiltersChange(
        filters.map((filter) =>
          filter.filterId === filterId
            ? ({ ...filter, ...updates } as ExtendedColumnFilter<TData>)
            : filter,
        ),
      );
    },
    [filters, onFiltersChange],
  );

  const onFiltersReset = React.useCallback(
    () => onFiltersChange([]),
    [onFiltersChange],
  );

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      )
        return;

      if (
        event.key.toLowerCase() === FILTER_SHORTCUT_KEY &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_SHORTCUTS.includes(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    },
    [filters, onFilterRemove],
  );

  return (
    <div role="list" className={cn("flex flex-wrap items-center gap-2", direction === "rtl" && "flex-row-reverse")}>
      {filters.map((filter) => (
        <FilterMenuItem
          key={filter.filterId}
          filter={filter}
          filterItemId={`${id}-filter-${filter.filterId}`}
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          onFilterRemove={onFilterRemove}
        />
      ))}
      {filters.length > 0 && (
        <Button
          aria-label={t("إعادة تعيين جميع الفلاتر", "Reset all filters")}
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onFiltersReset}
        >
          <X />
        </Button>
      )}
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            aria-label={t("فتح قائمة أوامر الفلترة", "Open filter command menu")}
            variant="outline"
            size={filters.length > 0 ? "icon" : "sm"}
            className={cn(filters.length > 0 && "size-8", "h-8 font-normal", direction === "rtl" && "flex-row-reverse")}
            ref={triggerRef}
            onKeyDown={onTriggerKeyDown}
            disabled={disabled}
          >
            <ListFilter className={cn("text-muted-foreground", direction === "rtl" ? "ml-2" : "mr-2")} />
            {filters.length > 0 ? null : t("فلترة", "Filter")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full max-w-(--radix-popover-content-available-width) p-0"
          align={direction === "rtl" ? "end" : "start"}
          {...props}
        >
          <Command loop className="[&_[cmdk-input-wrapper]_svg]:hidden" dir={direction}>
            <CommandInput
              ref={inputRef}
              placeholder={
                selectedColumn
                  ? (selectedColumn.columnDef.meta?.label ?? selectedColumn.id)
                  : t("بحث في الحقول...", "Search fields...")
              }
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={onInputKeyDown}
            />
            <CommandList>
              {selectedColumn ? (
                <>
                  {selectedColumn.columnDef.meta?.options && (
                    <CommandEmpty>{t("لم يتم العثور على خيارات.", "No options found.")}</CommandEmpty>
                  )}
                  <FilterValueSelector
                    column={selectedColumn}
                    value={inputValue}
                    onSelect={(value) => onFilterAdd(selectedColumn, value)}
                  />
                </>
              ) : (
                <>
                  <CommandEmpty>{t("لم يتم العثور على حقول.", "No fields found.")}</CommandEmpty>
                  <CommandGroup>
                    {columns.map((column) => (
                      <CommandItem
                        key={column.id}
                        value={column.id}
                        onSelect={() => {
                          setSelectedColumn(column);
                          setInputValue("");
                          requestAnimationFrame(() =>
                            inputRef.current?.focus(),
                          );
                        }}
                        className={cn(direction === "rtl" && "flex-row-reverse")}
                      >
                        {column.columnDef.meta?.icon && (
                          <column.columnDef.meta.icon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
                        )}
                        <span className="truncate">
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── FilterMenuItem (internal) ────────────────────────────────

interface FilterMenuItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  filterItemId: string;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function FilterMenuItem<TData>({
  filter,
  filterItemId,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: FilterMenuItemProps<TData>) {
  const { direction } = useLanguage();
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((column) => column.id === filter.id);
  const operatorListboxId = `${filterItemId}-operator-listbox`;
  const inputId = `${filterItemId}-input`;
  const columnMeta = column?.columnDef.meta;
  const filterOperators = getFilterOperators(filter.variant);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (showFieldSelector || showOperatorSelector || showValueSelector)
        return;
      if (REMOVE_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault();
        onFilterRemove(filter.filterId);
      }
    },
    [
      filter.filterId,
      showFieldSelector,
      showOperatorSelector,
      showValueSelector,
      onFilterRemove,
    ],
  );

  if (!column) return null;

  return (
    <div
      role="listitem"
      id={filterItemId}
      className={cn("flex h-8 items-center rounded-md bg-background", direction === "rtl" && "flex-row-reverse")}
      onKeyDown={onItemKeyDown}
    >
      <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border font-normal dark:bg-input/30",
              direction === "rtl" ? "rounded-e-md border-s-0 flex-row-reverse" : "rounded-s-md border-e-0"
            )}
          >
            {columnMeta?.icon && (
              <columnMeta.icon className={cn("text-muted-foreground", direction === "rtl" ? "ml-2" : "mr-2")} />
            )}
            {columnMeta?.label ?? column.id}
          </Button>
        </PopoverTrigger>
        <PopoverContent align={direction === "rtl" ? "end" : "start"} className="w-48 p-0">
          <Command loop dir={direction}>
            <CommandInput placeholder={t("بحث في الحقول...", "Search fields...")} />
            <CommandList>
              <CommandEmpty>{t("لم يتم العثور على حقول.", "No fields found.")}</CommandEmpty>
              <CommandGroup>
                {columns.map((col) => (
                  <CommandItem
                    key={col.id}
                    value={col.id}
                    onSelect={() => {
                      onFilterUpdate(filter.filterId, {
                        id: col.id as Extract<keyof TData, string>,
                        variant: col.columnDef.meta?.variant ?? "text",
                        operator: getDefaultFilterOperator(
                          col.columnDef.meta?.variant ?? "text",
                        ),
                        value: "",
                      });
                      setShowFieldSelector(false);
                    }}
                    className={cn(direction === "rtl" && "flex-row-reverse")}
                  >
                    {col.columnDef.meta?.icon && <col.columnDef.meta.icon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />}
                    <span className="truncate">
                      {col.columnDef.meta?.label ?? col.id}
                    </span>
                    <Check
                      className={cn(
                        direction === "rtl" ? "me-auto" : "ms-auto",
                        col.id === filter.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Select
        open={showOperatorSelector}
        onOpenChange={setShowOperatorSelector}
        value={filter.operator}
        onValueChange={(value: FilterOperator) =>
          onFilterUpdate(filter.filterId, {
            operator: value,
            value:
              value === "isEmpty" || value === "isNotEmpty"
                ? ""
                : filter.value,
          })
        }
      >
        <SelectTrigger
          aria-controls={operatorListboxId}
          className="h-8 rounded-none border-e-0 px-2.5 lowercase data-size:h-8 [&_svg]:hidden"
          dir={direction}
        >
          <SelectValue placeholder={filter.operator} />
        </SelectTrigger>
        <SelectContent id={operatorListboxId} dir={direction}>
          {filterOperators.map((operator) => (
            <SelectItem
              key={operator.value}
              className="lowercase"
              value={operator.value}
            >
              {operator.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Inline filter input renderer */}
      <FilterInputRenderer
        filter={filter}
        column={column}
        inputId={inputId}
        onFilterUpdate={onFilterUpdate}
        showValueSelector={showValueSelector}
        setShowValueSelector={setShowValueSelector}
      />

      <Button
        aria-controls={filterItemId}
        variant="ghost"
        size="sm"
        className={cn(
          "h-full rounded-none border px-1.5 font-normal dark:bg-input/30",
          direction === "rtl" ? "rounded-s-md border-e-0" : "rounded-e-md border-s-0"
        )}
        onClick={() => onFilterRemove(filter.filterId)}
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

// ─── FilterInputRenderer (internal) ──────────────────────────

interface FilterInputRendererProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  column: Column<TData>;
  inputId: string;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}

function FilterInputRenderer<TData>({
  filter,
  column,
  inputId,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: FilterInputRendererProps<TData>) {
  const { direction } = useLanguage();
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        role="status"
        aria-live="polite"
        className="h-full w-16 rounded-none border bg-transparent px-1.5 py-0.5 text-muted-foreground dark:bg-input/30"
      />
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range": {
      if (filter.operator === "isBetween") {
        return (
          <DataTableRangeFilter
            filter={filter}
            column={column}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
            className="size-full max-w-28 gap-0 **:data-[slot='range-min']:border-e-0 [&_input]:rounded-none [&_input]:px-1.5"
          />
        );
      }
      const isNumber =
        filter.variant === "number" || filter.variant === "range";
      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : "text"}
          inputMode={isNumber ? "numeric" : undefined}
          placeholder={column.columnDef.meta?.placeholder ?? t("أدخل قيمة...", "Enter value...")}
          className="h-full w-24 rounded-none px-1.5"
          defaultValue={
            typeof filter.value === "string" ? filter.value : ""
          }
          onChange={(event) =>
            onFilterUpdate(filter.filterId, { value: event.target.value })
          }
          dir={direction}
        />
      );
    }

    case "boolean": {
      const inputListboxId = `${inputId}-listbox`;
      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={typeof filter.value === "string" ? filter.value : "true"}
          onValueChange={(value: "true" | "false") =>
            onFilterUpdate(filter.filterId, { value })
          }
        >
          <SelectTrigger
            id={inputId}
            aria-controls={inputListboxId}
            className="rounded-none bg-transparent px-1.5 py-0.5 [&_svg]:hidden"
            dir={direction}
          >
            <SelectValue placeholder={filter.value ? t("صحيح", "True") : t("خطأ", "False")} />
          </SelectTrigger>
          <SelectContent id={inputListboxId} dir={direction}>
            <SelectItem value="true">{t("صحيح", "True")}</SelectItem>
            <SelectItem value="false">{t("خطأ", "False")}</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const inputListboxId = `${inputId}-listbox`;
      const options = column.columnDef.meta?.options ?? [];
      const selectedValues = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];
      const selectedOptions = options.filter((option) =>
        selectedValues.includes(option.value),
      );

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              variant="ghost"
              size="sm"
              className={cn(
                "h-full min-w-16 rounded-none border px-1.5 font-normal dark:bg-input/30",
                direction === "rtl" && "flex-row-reverse"
              )}
            >
              {selectedOptions.length === 0 ? (
                filter.variant === "multiSelect"
                  ? t("اختر خيارات...", "Select options...")
                  : t("اختر خياراً...", "Select option...")
              ) : (
                <>
                  <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                    {selectedOptions.map((selectedOption) =>
                      selectedOption.icon ? (
                        <div
                          key={selectedOption.value}
                          className="rounded-full border bg-background p-0.5"
                        >
                          <selectedOption.icon className="size-3.5" />
                        </div>
                      ) : null,
                    )}
                  </div>
                  <span className="truncate">
                    {selectedOptions.length > 1
                      ? `${selectedOptions.length} ${t("مختار", "selected")}`
                      : selectedOptions[0]?.label}
                  </span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align={direction === "rtl" ? "end" : "start"}
            className="w-48 p-0"
          >
            <Command dir={direction}>
              <CommandInput placeholder={t("بحث في الخيارات...", "Search options...")} />
              <CommandList>
                <CommandEmpty>{t("لم يتم العثور على خيارات.", "No options found.")}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        const value =
                          filter.variant === "multiSelect"
                            ? selectedValues.includes(option.value)
                              ? selectedValues.filter(
                                  (v) => v !== option.value,
                                )
                              : [...selectedValues, option.value]
                            : option.value;
                        onFilterUpdate(filter.filterId, { value: value as string | string[] });
                      }}
                      className={cn(direction === "rtl" && "flex-row-reverse")}
                    >
                      {option.icon && <option.icon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />}
                      <span className="truncate">{option.label}</span>
                      {filter.variant === "multiSelect" && (
                        <Check
                          className={cn(
                            direction === "rtl" ? "me-auto" : "ms-auto",
                            selectedValues.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    case "date":
    case "dateRange": {
      const inputListboxId = `${inputId}-listbox`;
      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);

      const startDate = dateValue[0]
        ? new Date(Number(dateValue[0]))
        : undefined;
      const endDate = dateValue[1]
        ? new Date(Number(dateValue[1]))
        : undefined;
      const isSameDate =
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString();

      const displayValue =
        filter.operator === "isBetween" &&
        dateValue.length === 2 &&
        !isSameDate
          ? `${formatDate(startDate, { month: "short" })} - ${formatDate(endDate, { month: "short" })}`
          : startDate
            ? formatDate(startDate, { month: "short" })
            : t("اختر تاريخاً...", "Pick date...");

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              variant="ghost"
              size="sm"
              className={cn(
                "h-full rounded-none border px-1.5 font-normal dark:bg-input/30",
                !filter.value && "text-muted-foreground",
                direction === "rtl" && "flex-row-reverse"
              )}
            >
              <span className="truncate">{displayValue}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align={direction === "rtl" ? "end" : "start"}
            className="w-auto p-0"
          >
            {filter.operator === "isBetween" ? (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="range"
                selected={
                  dateValue.length === 2
                    ? {
                        from: new Date(Number(dateValue[0])),
                        to: new Date(Number(dateValue[1])),
                      }
                    : { from: new Date(), to: new Date() }
                }
                onSelect={(date: DateRange | undefined) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                          (date.from?.getTime() ?? "").toString(),
                          (date.to?.getTime() ?? "").toString(),
                        ]
                      : [],
                  });
                }}
                dir={direction}
              />
            ) : (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="single"
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : undefined
                }
                onSelect={(date: Date | undefined) => {
                  onFilterUpdate(filter.filterId, {
                    value: (date?.getTime() ?? "").toString(),
                  });
                }}
                dir={direction}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}

// ─── DataTableSortList ────────────────────────────────────────

interface DataTableSortListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: TanstackTable<TData>;
  disabled?: boolean;
}

export function DataTableSortList<TData>({
  table,
  disabled,
  ...props
}: DataTableSortListProps<TData>) {
  const { direction } = useLanguage();
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const sorting = table.getState().sorting;
  const onSortingChange = table.setSorting;

  const sortOrders = [
    { value: "asc", label: t("تصاعدي", "Ascending") },
    { value: "تنازلي", label: t("تنازلي", "Descending") },
  ];

  const { columnLabels, columns } = React.useMemo(() => {
    const labels = new Map<string, string>();
    const sortingIds = new Set(sorting.map((s) => s.id));
    const availableColumns: { id: string; label: string }[] = [];

    for (const column of table.getAllColumns()) {
      if (!column.getCanSort()) continue;
      const label = column.columnDef.meta?.label ?? column.id;
      labels.set(column.id, label);
      if (!sortingIds.has(column.id))
        availableColumns.push({ id: column.id, label });
    }

    return { columnLabels: labels, columns: availableColumns };
  }, [sorting, table]);

  const onSortAdd = React.useCallback(() => {
    const firstColumn = columns[0];
    if (!firstColumn) return;
    onSortingChange((prevSorting) => [
      ...prevSorting,
      { id: firstColumn.id, desc: false },
    ]);
  }, [columns, onSortingChange]);

  const onSortUpdate = React.useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      onSortingChange((prevSorting) => {
        return prevSorting.map((s) =>
          s.id === sortId ? { ...s, ...updates } : s
        );
      });
    },
    [onSortingChange],
  );

  const onSortRemove = React.useCallback(
    (sortId: string) => {
      onSortingChange((prevSorting) =>
        prevSorting.filter((s) => s.id !== sortId)
      );
    },
    [onSortingChange],
  );

  const onSortReset = React.useCallback(
    () => onSortingChange([]),
    [onSortingChange],
  );

  const onSortMove = React.useCallback(
    (activeIndex: number, overIndex: number) => {
      onSortingChange((prevSorting) => {
        const newSorting = [...prevSorting];
        const [movedSort] = newSorting.splice(activeIndex, 1);
        if (movedSort) newSorting.splice(overIndex, 0, movedSort);
        return newSorting;
      });
    },
    [onSortingChange],
  );

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      )
        return;

      if (
        event.key.toLowerCase() === SORT_SHORTCUT_KEY &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t("فتح قائمة الفرز", "Open sort menu")}
          variant="outline"
          size={sorting.length > 0 ? "icon" : "sm"}
          className={cn(sorting.length > 0 && "size-8", "h-8 font-normal", direction === "rtl" && "flex-row-reverse")}
          disabled={disabled}
        >
          <ArrowDownUp className={cn("text-muted-foreground", direction === "rtl" ? "ml-2" : "mr-2")} />
          {sorting.length > 0 ? null : t("فرز", "Sort")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
        align={direction === "rtl" ? "start" : "end"}
        {...props}
      >
        <div className="p-4" dir={direction}>
          <div className="flex items-center justify-between mb-4">
            <h4 id={labelId} className="font-medium leading-none">
              {t("الفرز", "Sort")}
            </h4>
            {sorting.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSortReset}
                className="h-8 px-2 text-xs"
              >
                {t("إعادة تعيين", "Reset")}
              </Button>
            )}
          </div>
          <p id={descriptionId} className="sr-only">
            {t("إدارة فرز الأعمدة", "Manage column sorting")}
          </p>

          <Sortable
            value={sorting}
            onMove={({ activeIndex, overIndex }) =>
              onSortMove(activeIndex, overIndex)
            }
          >
            <SortableContent className="flex flex-col gap-2">
              {sorting.map((sort) => (
                <SortableItem key={sort.id} value={sort.id}>
                  <div className={cn("flex items-center gap-2", direction === "rtl" && "flex-row-reverse")}>
                    <SortableItemHandle asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                      >
                        <GripVertical className="size-4" />
                      </Button>
                    </SortableItemHandle>

                    <Select
                      value={sort.id}
                      onValueChange={(value) =>
                        onSortUpdate(sort.id, { id: value })
                      }
                    >
                      <SelectTrigger className="h-8 flex-1 text-xs">
                        <SelectValue>
                          {columnLabels.get(sort.id)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent dir={direction}>
                        {table.getAllColumns()
                          .filter((c) => c.getCanSort())
                          .map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              className="text-xs"
                            >
                              {c.columnDef.meta?.label ?? c.id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sort.desc ? "desc" : "asc"}
                      onValueChange={(value) =>
                        onSortUpdate(sort.id, { desc: value === "desc" })
                      }
                    >
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir={direction}>
                        {sortOrders.map((order) => (
                          <SelectItem
                            key={order.value}
                            value={order.value}
                            className="text-xs"
                          >
                            {order.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSortRemove(sort.id)}
                      className="size-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </SortableContent>
            <SortableOverlay>
              <div className="bg-background border rounded-md p-2 shadow-lg opacity-80">
                {t("جاري النقل...", "Moving...")}
              </div>
            </SortableOverlay>
          </Sortable>

          {columns.length > 0 && (
            <Button
              ref={addButtonRef}
              variant="outline"
              size="sm"
              onClick={onSortAdd}
              className={cn("w-full mt-4 h-8 text-xs border-dashed", direction === "rtl" && "flex-row-reverse")}
            >
              <PlusCircle className={cn("size-3", direction === "rtl" ? "ml-2" : "mr-2")} />
              {t("إضافة فرز", "Add sort")}
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
