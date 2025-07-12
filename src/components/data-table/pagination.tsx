import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DataTablePaginationProps<TData> = React.ComponentPropsWithoutRef<"div"> & {
  table: Table<TData>;
  pageSizeOptions?: number[];
};

function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const currentPageSize = table.getState().pagination.pageSize;
  const currentPageSizeString = `${currentPageSize}`;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;

  // Only show pagination controls if there are multiple pages or multiple page size options
  const showPaginationControls = totalPages > 1;
  const showPageSizeSelector =
    pageSizeOptions.length > 1 || totalRows > Math.min(...pageSizeOptions);

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-2 overflow-x-auto xsm:flex-row sm:gap-4 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {selectedRows !== 0 && (
        <div className="flex-1 whitespace-nowrap">
          {selectedRows} of {totalRows} row(s) selected.
        </div>
      )}

      {/* Only show pagination section if there are controls to display */}
      {(showPaginationControls || showPageSizeSelector) && (
        <div
          className={cn(
            "flex flex-col-reverse items-center gap-2 xsm:flex-row sm:gap-4",
            selectedRows === 0 && "w-full"
          )}
        >
          {/* Page size selector */}
          {showPageSizeSelector && (
            <div
              className={cn(
                "flex items-center gap-2",
                selectedRows === 0 && !showPaginationControls && "flex-1"
              )}
            >
              <p className="whitespace-nowrap text-xs">Rows per page</p>
              <Select
                value={currentPageSizeString}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="text-xs">
                  <SelectValue placeholder={currentPageSizeString} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Page indicator */}
          {showPaginationControls && (
            <div className="flex items-center justify-center">
              Page {table.getState().pagination.pageIndex + 1} of {totalPages}
            </div>
          )}

          {/* Navigation buttons */}
          {showPaginationControls && (
            <div className="flex items-center gap-2">
              <Button
                aria-label="Go to first page"
                variant="outline"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to previous page"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to next page"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                aria-label="Go to last page"
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { DataTablePagination };
