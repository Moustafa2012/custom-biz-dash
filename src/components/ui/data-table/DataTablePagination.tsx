"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import * as React from "react";
import { t } from "@/lib/translations";
import { useLanguage } from "@/components/language-provider";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "../../../utils/data-table";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  /** Show selected row count on the left */
  showSelectedCount?: boolean;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Show first/last page buttons */
  showFirstLastButtons?: boolean;
  /** Called when page changes */
  onPageChange?: (pageIndex: number) => void;
  /** Called when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** RTL mode */
  isRTL?: boolean;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showSelectedCount = true,
  showPageSizeSelector = true,
  showFirstLastButtons = true,
  onPageChange,
  onPageSizeChange,
  isRTL: isRTLProp,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { direction } = useLanguage();
  const isRTL = isRTLProp ?? direction === "rtl";
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    table.setPageSize(newSize);
    onPageSizeChange?.(newSize);
  };

  const handleFirstPage = () => {
    table.setPageIndex(0);
    onPageChange?.(0);
  };

  const handlePreviousPage = () => {
    table.previousPage();
    onPageChange?.(table.getState().pagination.pageIndex - 1);
  };

  const handleNextPage = () => {
    table.nextPage();
    onPageChange?.(table.getState().pagination.pageIndex + 1);
  };

  const handleLastPage = () => {
    const lastPageIndex = table.getPageCount() - 1;
    table.setPageIndex(lastPageIndex);
    onPageChange?.(lastPageIndex);
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        className,
      )}
      {...props}
    >
      {/* Selected rows count */}
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm min-h-[20px]">
        {showSelectedCount && selectedRowsCount > 0 && (
          <span>
            {selectedRowsCount} {t("من", "of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("صفوف مختارة.", "row(s) selected.")}
          </span>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <p className="whitespace-nowrap font-medium text-sm">
              {t("الصفوف لكل صفحة", "Rows per page")}
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-18 data-size:h-8">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-center font-medium text-sm">
          {t("الصفحة", "Page")} {currentPage} {t("من", "of")} {totalPages}
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {showFirstLastButtons && (
            <Button
              aria-label={t("انتقل إلى الصفحة الأولى", "Go to first page")}
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={handleFirstPage}
              disabled={!table.getCanPreviousPage()}
            >
              {isRTL ? <ChevronsRight /> : <ChevronsLeft />}
            </Button>
          )}
          <Button
            aria-label={t("انتقل إلى الصفحة السابقة", "Go to previous page")}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handlePreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            {isRTL ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <Button
            aria-label={t("انتقل إلى الصفحة التالية", "Go to next page")}
            variant="outline"
            size="icon"
            className="size-8"
            onClick={handleNextPage}
            disabled={!table.getCanNextPage()}
          >
            {isRTL ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          {showFirstLastButtons && (
            <Button
              aria-label={t("انتقل إلى الصفحة الأخيرة", "Go to last page")}
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={handleLastPage}
              disabled={!table.getCanNextPage()}
            >
              {isRTL ? <ChevronsLeft /> : <ChevronsRight />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
