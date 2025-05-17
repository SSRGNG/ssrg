"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditResearchArea } from "@/components/views/admin/core/edit-research-area";
import { ResearchAreaDetails } from "@/components/views/admin/core/research-area-details";
import { AdminAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RAreaType = AdminAreasData[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  areas: AdminAreasData;
};

function getTypedValue<TData, TValue>(
  row: Row<TData>,
  columnId: keyof TData
): TValue {
  return row.getValue(columnId as string) as TValue;
}

function RAreasDataTable({ areas, className, ...props }: Props) {
  // const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<RAreaType>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        filterFn: "includesString",
        // cell: ({ row }) => {
        //   const title = getTypedValue<RAreaType, string>(row, "title");

        //   return <div className="text-right font-medium">{title}</div>;
        // },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
          const description = getTypedValue<RAreaType, string>(
            row,
            "description"
          );
          return (
            <span className="whitespace-normal line-clamp-2">
              {description}
            </span>
          );
        },
        filterFn: "includesString",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const area = row.original;

          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="size-8 p-0 data-[state=open]:bg-muted flex justify-self-end"
                >
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <ResearchAreaDetails area={area} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <EditResearchArea area={area}>
                    <Button
                      aria-label="Toggle Edit"
                      size="sm"
                      variant="ghost"
                      className={cn("w-full justify-start text-xs px-2")}
                    >
                      Edit Area
                    </Button>
                  </EditResearchArea>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // onClick={() => {
                  //   startTransition(() => {
                  //     row.toggleSelected(false);

                  //     toast.promise(deleteExpense({ id: row.original.id }), {
                  //       loading: "Deleting...",
                  //       success: () =>
                  //         "Expense transaction deleted successfully.",
                  //       error: (err: unknown) => getErrorMessage(err),
                  //     });
                  //   });
                  // }}
                  // disabled={isPending}
                  disabled
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );
  return (
    <DataTable
      data={areas}
      columns={columns}
      className={cn(className)}
      filterFields={[
        { label: "Title", value: "title", placeholder: "Search by title..." },
        {
          label: "Description",
          value: "description",
          placeholder: "Filter by description...",
        },
      ]}
      actionKey="area"
      {...props}
    />
  );
}

export { RAreasDataTable };
