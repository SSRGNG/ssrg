import { type Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown, EyeOff } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> = React.ComponentProps<"div"> & {
  column: Column<TData, TValue>;
  title: string;
};

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div className={cn(className)} {...props}>
        {title}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === "desc"
                ? "Sorted descending. Click to sort ascending."
                : column.getIsSorted() === "asc"
                ? "Sorted ascending. Click to sort descending."
                : "Not sorted. Click to sort ascending."
            }
            variant="ghost"
            size="sm"
            className="-ml-1.5 h-8 data-[state=open]:bg-accent gap-1 px-2 has-[>svg]:px-1.5"
            // className="h-8 data-[state=open]:bg-accent"
          >
            <span className="leading-0 pb-0.5">{title}</span>
            {column.getCanSort() && column.getIsSorted() === "desc" ? (
              <ChevronDown
                className="size-3.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp
                className="size-3.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            ) : (
              <ChevronsUpDown
                className="size-3.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <React.Fragment>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => column.toggleSorting(false)}
              >
                <ChevronUp
                  className="size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => column.toggleSorting(true)}
              >
                <ChevronDown
                  className="size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </DropdownMenuItem>
            </React.Fragment>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Hide column"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff
                className="size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { DataTableColumnHeader };
