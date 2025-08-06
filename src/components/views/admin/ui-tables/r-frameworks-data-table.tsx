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
import { EditResearchFramework } from "@/components/views/admin/core/edit-research-framework";
import { AdminFrameworksData } from "@/lib/actions/queries";
import { deleteResearchFramework } from "@/lib/actions/research";
import { cn } from "@/lib/utils";

type RFrameworkType = AdminFrameworksData[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  frameworks: AdminFrameworksData;
};

function getTypedValue<TData, TValue>(
  row: Row<TData>,
  columnId: keyof TData
): TValue {
  return row.getValue(columnId as string) as TValue;
}

function RFrameworksDataTable({ frameworks, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [frameworkToDelete, setFrameworkToDelete] =
    React.useState<RFrameworkType | null>(null);

  const handleDeleteClick = (framework: RFrameworkType) => {
    setFrameworkToDelete(framework);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!frameworkToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteResearchFramework(frameworkToDelete.id);

        if (result.success) {
          toast.success("Research framework deleted successfully", {
            description: `"${frameworkToDelete.title}" has been removed.`,
          });
        } else {
          toast.error("Failed to delete research framework", {
            description: result.details || result.error,
          });
        }
      } catch (error) {
        console.error("Delete framework error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setFrameworkToDelete(null);
      }
    });
  };

  const columns = React.useMemo<ColumnDef<RFrameworkType>[]>(
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
          const description = getTypedValue<RFrameworkType, string>(
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
          const frame = row.original;

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
                  <FrameDetails frame={frame} />
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <EditResearchFramework frame={frame}>
                    <Button
                      aria-label="Toggle Edit"
                      size="sm"
                      variant="ghost"
                      className={cn("w-full justify-start text-xs px-2")}
                    >
                      Edit Framework
                    </Button>
                  </EditResearchFramework>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(frame)}
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
        data={frameworks}
        columns={columns}
        className={cn(className)}
        filterFields={[
          {
            label: "Description",
            value: "description",
            placeholder: "Filter by description...",
          },
        ]}
        actionKey="framework"
        {...props}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research Framework</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{frameworkToDelete?.title}
              &quot;? This action cannot be undone and will permanently remove
              the framework.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
            >
              {isPending ? "Deleting..." : "Delete Framework"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { RFrameworksDataTable };
