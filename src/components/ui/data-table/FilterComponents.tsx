"use client";

import type { Column } from "@tanstack/react-table";
import {
  BadgeCheck,
  CalendarIcon,
  Check,
  PlusCircle,
  Text,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";
import type { DateRange } from "react-day-picker";

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
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { ExtendedColumnFilter, Option } from "../../../types/data-table";
import {
  cn,
  formatDate,
  getIsValidRange,
  parseAsDate,
  parseColumnFilterValue,
  parseValuesAsNumbers,
  type RangeValue,
} from "../../../utils/data-table";

// ─── DataTableFacetedFilter ───────────────────────────────────

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { direction } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(columnFilterValue) ? columnFilterValue : [],
  );

  const onItemSelect = React.useCallback(
    (option: Option, isSelected: boolean) => {
      if (!column) return;
      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) newSelectedValues.delete(option.value);
        else newSelectedValues.add(option.value);
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("border-dashed font-normal", direction === "rtl" && "flex-row-reverse")}>
          {selectedValues?.size > 0 ? (
            <div
              role="button"
              aria-label={t(`إلغاء فلتر ${title}`, `Clear ${title} filter`)}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
            >
              <XCircle className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
            </div>
          ) : (
            <PlusCircle className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
          )}
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} {t("مختار", "selected")}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align={direction === "rtl" ? "end" : "start"}>
        <Command dir={direction}>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full">
            <CommandEmpty>{t("لم يتم العثور على نتائج.", "No results found.")}</CommandEmpty>
            <CommandGroup className="max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option, isSelected)}
                    className={cn(direction === "rtl" && "flex-row-reverse")}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border border-primary",
                        direction === "rtl" ? "ml-2" : "mr-2",
                        isSelected
                          ? "bg-primary"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && <option.icon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />}
                    <span className="truncate">{option.label}</span>
                    {option.count && (
                      <span className={cn(direction === "rtl" ? "me-auto" : "ms-auto", "font-mono text-xs")}>
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="justify-center text-center"
                  >
                    {t("مسح الفلاتر", "Clear filters")}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── DataTableSliderFilter ────────────────────────────────────

interface DataTableSliderFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
}

export function DataTableSliderFilter<TData>({
  column,
  title,
}: DataTableSliderFilterProps<TData>) {
  const { direction } = useLanguage();
  const id = React.useId();
  const columnFilterValue = parseValuesAsNumbers(column.getFilterValue());
  const defaultRange = column.columnDef.meta?.range;
  const unit = column.columnDef.meta?.unit;

  const { min, max, step } = React.useMemo<{
    min: number;
    max: number;
    step: number;
  }>(() => {
    let minValue = 0;
    let maxValue = 100;

    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (values && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (
          typeof facetMinValue === "number" &&
          typeof facetMaxValue === "number"
        ) {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    const step =
      rangeSize <= 20
        ? 1
        : rangeSize <= 100
          ? Math.ceil(rangeSize / 20)
          : Math.ceil(rangeSize / 50);

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange]);

  const range = React.useMemo(
    (): RangeValue => columnFilterValue ?? [min, max],
    [columnFilterValue, min, max],
  );

  const formatValue = React.useCallback(
    (value: number) =>
      value.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    [],
  );

  const onFromInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (!Number.isNaN(numValue) && numValue >= min && numValue <= range[1]) {
        column.setFilterValue([numValue, range[1]]);
      }
    },
    [column, min, range],
  );

  const onToInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (!Number.isNaN(numValue) && numValue <= max && numValue >= range[0]) {
        column.setFilterValue([range[0], numValue]);
      }
    },
    [column, max, range],
  );

  const onSliderValueChange = React.useCallback(
    (value: RangeValue) => {
      if (Array.isArray(value) && value.length === 2)
        column.setFilterValue(value);
    },
    [column],
  );

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.target instanceof HTMLDivElement) event.stopPropagation();
      column.setFilterValue(undefined);
    },
    [column],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("border-dashed font-normal", direction === "rtl" && "flex-row-reverse")}>
          {columnFilterValue ? (
            <div
              role="button"
              aria-label={t(`إلغاء فلتر ${title}`, `Clear ${title} filter`)}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              onClick={onReset}
            >
              <XCircle className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
            </div>
          ) : (
            <PlusCircle className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
          )}
          <span>{title}</span>
          {columnFilterValue ? (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              {formatValue(columnFilterValue[0])} -{" "}
              {formatValue(columnFilterValue[1])}
              {unit ? ` ${unit}` : ""}
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={direction === "rtl" ? "end" : "start"} className="flex w-auto flex-col gap-4">
        <div className="flex flex-col gap-3" dir={direction}>
          <p className="font-medium leading-none">{title}</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                id={`${id}-from`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                placeholder={min.toString()}
                min={min}
                max={max}
                value={range[0]?.toString()}
                onChange={onFromInputChange}
                className={cn("h-8 w-24", unit && (direction === "rtl" ? "ps-8" : "pe-8"))}
              />
              {unit && (
                <span className={cn(
                  "absolute top-0 bottom-0 flex items-center bg-accent px-2 text-muted-foreground text-sm",
                  direction === "rtl" ? "start-0 rounded-s-md" : "end-0 rounded-e-md"
                )}>
                  {unit}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id={`${id}-to`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                placeholder={max.toString()}
                min={min}
                max={max}
                value={range[1]?.toString()}
                onChange={onToInputChange}
                className={cn("h-8 w-24", unit && (direction === "rtl" ? "ps-8" : "pe-8"))}
              />
              {unit && (
                <span className={cn(
                  "absolute top-0 bottom-0 flex items-center bg-accent px-2 text-muted-foreground text-sm",
                  direction === "rtl" ? "start-0 rounded-s-md" : "end-0 rounded-e-md"
                )}>
                  {unit}
                </span>
              )}
            </div>
          </div>
          <Slider
            id={`${id}-slider`}
            min={min}
            max={max}
            step={step}
            value={range}
            onValueChange={onSliderValueChange}
          />
        </div>
        <Button
          aria-label={t(`إلغاء فلتر ${title}`, `Clear ${title} filter`)}
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          {t("مسح", "Clear")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

// ─── DataTableDateFilter ──────────────────────────────────────

type DateSelection = Date[] | DateRange;

function getIsDateRange(value: DateSelection): value is DateRange {
  return value && typeof value === "object" && !Array.isArray(value);
}

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
  multiple?: boolean;
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
}: DataTableDateFilterProps<TData>) {
  const { direction } = useLanguage();
  const columnFilterValue = column.getFilterValue();

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue)
      return multiple ? { from: undefined, to: undefined } : [];
    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0] as number | string | undefined),
        to: parseAsDate(timestamps[1] as number | string | undefined),
      };
    }
    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0] as number | string | undefined);
    return date ? [date] : [];
  }, [columnFilterValue, multiple]);

  const onSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (!date) {
        column.setFilterValue(undefined);
        return;
      }
      if (multiple && !("getTime" in date)) {
        const from = (date as DateRange).from?.getTime();
        const to = (date as DateRange).to?.getTime();
        column.setFilterValue(from || to ? [from, to] : undefined);
      } else if (!multiple && "getTime" in date) {
        column.setFilterValue((date as Date).getTime());
      }
    },
    [column, multiple],
  );

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      column.setFilterValue(undefined);
    },
    [column],
  );

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from || selectedDates.to;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return "";
    if (range.from && range.to)
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null;
      const hasSelectedDates = selectedDates.from || selectedDates.to;
      const dateText = hasSelectedDates
        ? formatDateRange(selectedDates)
        : t("اختر نطاق تاريخ", "Select date range");
      return (
        <span className={cn("flex items-center gap-2", direction === "rtl" && "flex-row-reverse")}>
          <span>{title}</span>
          {hasSelectedDates && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <span>{dateText}</span>
            </>
          )}
        </span>
      );
    }
    if (getIsDateRange(selectedDates)) return null;
    const hasSelectedDate = selectedDates.length > 0;
    const dateText = hasSelectedDate
      ? formatDate(selectedDates[0])
      : t("اختر تاريخ", "Select date");
    return (
      <span className={cn("flex items-center gap-2", direction === "rtl" && "flex-row-reverse")}>
        <span>{title}</span>
        {hasSelectedDate && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, multiple, formatDateRange, title, direction]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("border-dashed font-normal", direction === "rtl" && "flex-row-reverse")}>
          {hasValue ? (
            <div
              role="button"
              aria-label={t(`إلغاء فلتر ${title}`, `Clear ${title} filter`)}
              tabIndex={0}
              onClick={onReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <XCircle className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
            </div>
          ) : (
            <CalendarIcon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={direction === "rtl" ? "end" : "start"}>
        {multiple ? (
          <Calendar
            autoFocus
            captionLayout="dropdown"
            mode="range"
            selected={
              getIsDateRange(selectedDates)
                ? selectedDates
                : { from: undefined, to: undefined }
            }
            onSelect={onSelect as (date: DateRange | undefined) => void}
            dir={direction}
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            mode="single"
            selected={
              !getIsDateRange(selectedDates) ? selectedDates[0] : undefined
            }
            onSelect={onSelect as (date: Date | undefined) => void}
            dir={direction}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── DataTableRangeFilter ─────────────────────────────────────

interface DataTableRangeFilterProps<TData>
  extends React.ComponentProps<"div"> {
  filter: ExtendedColumnFilter<TData>;
  column: Column<TData>;
  inputId: string;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
}

export function DataTableRangeFilter<TData>({
  filter,
  column,
  inputId,
  onFilterUpdate,
  className,
  ...props
}: DataTableRangeFilterProps<TData>) {
  const { direction } = useLanguage();
  const meta = column.columnDef.meta;

  const [min, max] = React.useMemo(() => {
    const range = column.columnDef.meta?.range;
    if (range) return range;
    const values = column.getFacetedMinMaxValues();
    if (!values) return [0, 100];
    return [values[0], values[1]];
  }, [column]);

  const formatValue = React.useCallback(
    (value: string | number | undefined) => {
      if (value === undefined || value === "") return "";
      const numValue = Number(value);
      return Number.isNaN(numValue)
        ? ""
        : numValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
    },
    [],
  );

  const value = React.useMemo(() => {
    if (Array.isArray(filter.value)) return filter.value.map(formatValue);
    return [formatValue(filter.value as string | number | undefined), ""];
  }, [filter.value, formatValue]);

  const onRangeValueChange = React.useCallback(
    (val: string, isMin?: boolean) => {
      const numValue = Number(val);
      const currentValues = Array.isArray(filter.value)
        ? filter.value
        : ["", ""];
      const otherValue = isMin
        ? (currentValues[1] ?? "")
        : (currentValues[0] ?? "");

      if (
        val === "" ||
        (!Number.isNaN(numValue) &&
          (isMin
            ? numValue >= min && numValue <= (Number(otherValue) || max)
            : numValue <= max && numValue >= (Number(otherValue) || min)))
      ) {
        onFilterUpdate(filter.filterId, {
          value: isMin
            ? [val, otherValue as string]
            : [otherValue as string, val],
        });
      }
    },
    [filter.filterId, filter.value, min, max, onFilterUpdate],
  );

  return (
    <div
      data-slot="range"
      className={cn("flex w-full items-center gap-2", className, direction === "rtl" && "flex-row-reverse")}
      {...props}
    >
      <Input
        id={`${inputId}-min`}
        type="number"
        aria-label={`${meta?.label} ${t("الحد الأدنى", "minimum value")}`}
        data-slot="range-min"
        inputMode="numeric"
        placeholder={min?.toString()}
        min={min}
        max={max}
        className="h-8 w-full rounded"
        defaultValue={value[0]}
        onChange={(event) => onRangeValueChange(event.target.value, true)}
        dir={direction}
      />
      <span className="sr-only shrink-0 text-muted-foreground">{t("إلى", "to")}</span>
      <Input
        id={`${inputId}-max`}
        type="number"
        aria-label={`${meta?.label} ${t("الحد الأقصى", "maximum value")}`}
        data-slot="range-max"
        inputMode="numeric"
        placeholder={max?.toString()}
        min={min}
        max={max}
        className="h-8 w-full rounded"
        defaultValue={value[1]}
        onChange={(event) => onRangeValueChange(event.target.value)}
        dir={direction}
      />
    </div>
  );
}

// ─── FilterValueSelector ──────────────────────────────────────

interface FilterValueSelectorProps<TData> {
  column: Column<TData>;
  value: string;
  onSelect: (value: string) => void;
}

export function FilterValueSelector<TData>({
  column,
  value,
  onSelect,
}: FilterValueSelectorProps<TData>) {
  const { direction } = useLanguage();
  const variant = column.columnDef.meta?.variant ?? "text";

  switch (variant) {
    case "boolean":
      return (
        <CommandGroup dir={direction}>
          <CommandItem 
            value="true" 
            onSelect={() => onSelect("true")}
            className={cn(direction === "rtl" && "flex-row-reverse")}
          >
            {t("صحيح", "True")}
          </CommandItem>
          <CommandItem 
            value="false" 
            onSelect={() => onSelect("false")}
            className={cn(direction === "rtl" && "flex-row-reverse")}
          >
            {t("خطأ", "False")}
          </CommandItem>
        </CommandGroup>
      );

    case "select":
    case "multiSelect":
      return (
        <CommandGroup dir={direction}>
          {column.columnDef.meta?.options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => onSelect(option.value)}
              className={cn(direction === "rtl" && "flex-row-reverse")}
            >
              {option.icon && <option.icon className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />}
              <span className="truncate">{option.label}</span>
              {option.count && (
                <span className={cn(direction === "rtl" ? "me-auto" : "ms-auto", "font-mono text-xs")}>{option.count}</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      );

    case "date":
    case "dateRange":
      return (
        <Calendar
          autoFocus
          captionLayout="dropdown"
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) =>
            onSelect(date?.getTime().toString() ?? "")
          }
          dir={direction}
        />
      );

    default: {
      const isEmpty = !value.trim();
      return (
        <CommandGroup dir={direction}>
          <CommandItem
            value={value}
            onSelect={() => onSelect(value)}
            disabled={isEmpty}
            className={cn(direction === "rtl" && "flex-row-reverse")}
          >
            {isEmpty ? (
              <>
                <Text className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
                <span>{t("اكتب لإضافة فلتر...", "Type to add filter...")}</span>
              </>
            ) : (
              <>
                <BadgeCheck className={cn(direction === "rtl" ? "ml-2" : "mr-2")} />
                <span className="truncate">
                  {t("فلترة حسب", "Filter by")} &quot;{value}&quot;
                </span>
              </>
            )}
          </CommandItem>
        </CommandGroup>
      );
    }
  }
}
