import type { ColumnDef, Row, Table } from "@tanstack/react-table";

import { ActionKey, BarAction } from "@/types";

// Base column meta that can be extended
export type ColumnMeta = {
  displayName?: string;
  description?: string;
  sortable?: boolean;
  filterable?: boolean;
};

// Extended column definition with your meta
export type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  meta?: ColumnMeta;
};

// Filter option for data table
export type DataTableOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
};

// Filter field for data table
export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: DataTableOption[];
};

// Base table meta
export type TableMeta<TData, TContext = unknown> = {
  searchableColumns?: DataTableFilterField<TData>[];
  filterableColumns?: DataTableFilterField<TData>[];
  filterFields?: DataTableFilterField<TData>[];
  actionKey?: ActionKey;
  barAction?: BarAction;
  context?: TContext;
};

// Extended table with proper meta typing
export type ExtendedTable<TData, TContext = unknown> = Table<TData> & {
  options: {
    meta?: TableMeta<TData, TContext>;
  };
};

// Utility type guards
export function hasTableMeta<TData, TContext = unknown>(
  table: Table<TData>
): table is ExtendedTable<TData, TContext> {
  return table.options.meta !== undefined;
}

export function hasColumnMeta<TData, TValue = unknown>(
  columnDef: ColumnDef<TData, TValue>
): columnDef is ExtendedColumnDef<TData, TValue> {
  return columnDef.meta !== undefined;
}

// Safe getter functions
export function getColumnDisplayName<TData>(column: {
  id: string;
  columnDef: ColumnDef<TData>;
}): string {
  const meta = column.columnDef.meta as ColumnMeta | undefined;
  return meta?.displayName || formatColumnName(column.id);
}

export function getTableMeta<TData, TContext = unknown>(
  table: Table<TData>
): TableMeta<TData, TContext> | undefined {
  return table.options.meta as TableMeta<TData, TContext> | undefined;
}

// Helper function to format column names
export function formatColumnName(columnId: string): string {
  return columnId
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Rule of thumb: Only use getTypedValue for columns that have accessorKey defined in your columns array. For any other data access, use row.original.propertyName directly.
export function getTypedValue<TData, TValue>(
  row: Row<TData>,
  columnId: keyof TData
): TValue {
  return row.getValue(columnId as string) as TValue;
}
