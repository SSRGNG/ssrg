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
import { EditResearchArea } from "@/components/views/admin/core/edit-research-area";
import { ResearchAreaDetails } from "@/components/views/admin/core/research-area-details";
import { AdminAreasData } from "@/lib/actions/queries";
import { deleteResearchArea } from "@/lib/actions/research-areas";
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
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [areaToDelete, setAreaToDelete] = React.useState<RAreaType | null>(
    null
  );

  const handleDeleteClick = (area: RAreaType) => {
    setAreaToDelete(area);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!areaToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteResearchArea(areaToDelete.id);

        if (result.success) {
          toast.success("Research area deleted successfully", {
            description: `"${areaToDelete.title}" has been removed.${
              result.associatedPublications && result.associatedPublications > 0
                ? ` ${result.associatedPublications} publication association(s) were also removed.`
                : ""
            }`,
          });
        } else {
          toast.error("Failed to delete research area", {
            description: result.details || result.error,
          });
        }
      } catch (error) {
        console.error("Delete research area error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setAreaToDelete(null);
      }
    });
  };

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
                  onClick={() => handleDeleteClick(area)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research Area</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete &quot;{areaToDelete?.title}
                  &quot;?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone and will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>The research area and its description</li>
                  <li>All associated questions, methods, and findings</li>
                  <li>
                    All publication associations (publications themselves will
                    remain)
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
            >
              {isPending ? "Deleting..." : "Delete Research Area"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { RAreasDataTable };
