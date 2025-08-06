"use client";

import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColumnDisplayName } from "@/types/table";

type DataTableViewOptionsProps<TData> = React.ComponentPropsWithoutRef<
  typeof DropdownMenuTrigger
> & {
  table: Table<TData>;
};

function DataTableViewOptions<TData>({
  table,
  ...props
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild {...props}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Toggle columns"
              variant="outline"
              size="sm"
              className="ml-auto h-8"
            >
              <Settings2 className="size-4" />
              <span className="hidden sm:inline-flex">View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">Toggle Views</TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const displayName = getColumnDisplayName(column);

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                <span className="truncate">{displayName}</span>
                {/* <span className="truncate">{column.id}</span> */}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableViewOptions };
