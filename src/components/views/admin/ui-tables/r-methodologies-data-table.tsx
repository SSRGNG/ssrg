"use client";

import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Ellipsis, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { deleteResearchMethodology } from "@/lib/actions/research";
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
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [methodologyToDelete, setMethodologyToDelete] =
    React.useState<RMethodologyType | null>(null);

  const handleDeleteClick = (methodology: RMethodologyType) => {
    setMethodologyToDelete(methodology);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!methodologyToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteResearchMethodology(methodologyToDelete.id);

        if (result.success) {
          toast.success("Research methodology deleted successfully", {
            description: `"${methodologyToDelete.title}" has been removed.`,
          });
        } else {
          toast.error("Failed to delete research methodology", {
            description: result.details || result.error,
          });
        }
      } catch (error) {
        console.error("Delete methodology error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setMethodologyToDelete(null);
      }
    });
  };

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
                  onClick={() => handleDeleteClick(meth)}
                  disabled={isPending}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Trash2 className="size-4" />
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isPending]
  );

  return (
    <React.Fragment>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research Methodology</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{methodologyToDelete?.title}
              &quot;? This action cannot be undone and will permanently remove
              the methodology.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
            >
              {isPending ? "Deleting..." : "Delete Methodology"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { RMethodologiesDataTable };
