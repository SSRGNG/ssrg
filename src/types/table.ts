import type { ColumnDef, Row, Table } from "@tanstack/react-table";

import { ActionKey, BarAction } from "@/types";

// Enhanced icon props to support common Lucide icon properties
export type IconProps = {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  "aria-hidden"?: boolean;
};

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
  icon?: React.ComponentType<IconProps>;
  withCount?: boolean;
};

// Filter field for data table
export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: DataTableOption[];
};

// Date column configuration
export type DateColumn<TData> = {
  value: keyof TData;
  label?: string;
  placeholder?: string;
  showMonthSelect?: boolean;
  maxMonthsInSelect?: number;
};

// Base table meta
export type TableMeta<TData, TContext = unknown> = {
  searchableColumns?: DataTableFilterField<TData>[];
  filterableColumns?: DataTableFilterField<TData>[];
  dateFields?: DateColumn<TData>[];
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

// Helper function to create consistent icon props
export function createIconProps(
  className?: string,
  strokeWidth?: number,
  additionalProps?: Partial<IconProps>
): IconProps {
  return {
    className: className || "size-4",
    strokeWidth: strokeWidth || 1.5,
    "aria-hidden": true,
    ...additionalProps,
  };
}
