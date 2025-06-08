"use client";

import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

// import { DataTableDateFilter } from "@/components/data-table/date-filter";
import { DataTableCreateOptions } from "@/components/data-table/create-options";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { ToolbarActions } from "@/components/data-table/toolbar-actions";
import { DataTableViewOptions } from "@/components/data-table/view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DataTableFilterField, TableMeta } from "@/types";

type DataTableToolbarProps<TData> = React.ComponentProps<"div"> & {
  table: Table<TData>;
};

function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { searchableColumns, filterableColumns } = table.options
    .meta as unknown as {
    searchableColumns: DataTableFilterField<TData>[];
    filterableColumns: DataTableFilterField<TData>[];
  };

  // Type guard to check if table has the required meta structure for ToolbarActions
  const hasToolbarMeta = (
    table: Table<TData>
  ): table is Table<TData> & {
    options: {
      meta: TableMeta<TData, unknown>;
    };
  } => {
    return table.options.meta !== undefined;
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 overflow-x-auto",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <Input
                  key={String(column.value)}
                  placeholder={column.placeholder}
                  value={
                    (table
                      .getColumn(String(column.value))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.value))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-30 sm:w-36 lg:w-64 placeholder:text-xs placeholder:truncate"
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ""
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <span className="hidden sm:inline-flex">Reset</span>
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
        <DataTableCreateOptions table={table} />
        {hasToolbarMeta(table) && <ToolbarActions table={table} />}
      </div>
    </div>
  );
}

export { DataTableToolbar };
