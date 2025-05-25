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
import { EditResearchMethodology } from "@/components/views/admin/core/edit-research-methodology";
import { AdminMethodologiesData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RMethodologyType = AdminMethodologiesData[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  methodologies: AdminMethodologiesData;
};

function getTypedValue<TData, TValue>(
  row: Row<TData>,
  columnId: keyof TData
): TValue {
  return row.getValue(columnId as string) as TValue;
}

function RMethodologiesDataTable({
  methodologies,
  className,
  ...props
}: Props) {
  // const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<RMethodologyType>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
          const description = getTypedValue<RMethodologyType, string>(
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
          const meth = row.original;

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
                {/* <DropdownMenuItem asChild>
                  <MethDetails meth={meth} />
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <EditResearchMethodology meth={meth}>
                    <Button
                      aria-label="Toggle Edit"
                      size="sm"
                      variant="ghost"
                      className={cn("w-full justify-start text-xs px-2")}
                    >
                      Edit Methodology
                    </Button>
                  </EditResearchMethodology>
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
      data={methodologies}
      columns={columns}
      className={cn(className)}
      filterFields={[
        {
          label: "Description",
          value: "description",
          placeholder: "Filter by description...",
        },
      ]}
      actionKey="methodology"
      {...props}
    />
  );
}

export { RMethodologiesDataTable };
