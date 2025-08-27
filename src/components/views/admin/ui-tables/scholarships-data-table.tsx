"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Ellipsis, Eye, Trash2, Users } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { scholarshipCats, scholarships as scholarTypes } from "@/config/enums";
import { AllScholarships } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { getTypedValue } from "@/types/table";

type ScholarshipType = AllScholarships[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  scholarships: AllScholarships;
};

function ScholarshipsDataTable({ scholarships, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [scholarshipToDelete, setScholarshipToDelete] =
    React.useState<ScholarshipType | null>(null);

  const handleDeleteClick = (scholarship: ScholarshipType) => {
    setScholarshipToDelete(scholarship);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!scholarshipToDelete) return;

    startTransition(async () => {
      try {
        // Replace with your delete action
        // const result = await deleteScholarship(scholarshipToDelete.id);

        toast.success("Scholarship deleted successfully", {
          description: `"${scholarshipToDelete.title}" has been removed.`,
        });
      } catch (error) {
        console.error("Delete scholarship error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setScholarshipToDelete(null);
      }
    });
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "tuition":
        return "default";
      case "conference_fee_waiver":
        return "secondary";
      case "presentation_award":
        return "outline";
      case "research_grant":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const columns = React.useMemo<ColumnDef<ScholarshipType>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
          const type = getTypedValue<ScholarshipType, string>(row, "type");
          return (
            <Badge variant={getTypeVariant(type)}>
              {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
          const category = getTypedValue<ScholarshipType, string>(
            row,
            "category"
          );
          return (
            <Badge variant="outline">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
          const amount = getTypedValue<ScholarshipType, string>(row, "amount");
          return amount ? (
            <span className="font-medium">{amount}</span>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          );
        },
      },
      {
        accessorKey: "deadline",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Deadline" />
        ),
        cell: ({ row }) => {
          const deadline = getTypedValue<ScholarshipType, Date>(
            row,
            "deadline"
          );
          return deadline ? (
            <span className="text-sm">{deadline.toLocaleDateString()}</span>
          ) : (
            <span className="text-muted-foreground">No deadline</span>
          );
        },
      },
      {
        accessorKey: "recipients",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Recipients" />
        ),
        cell: ({ row }) => {
          const recipients = row.original.recipients || [];
          return (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{recipients.length}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const active = getTypedValue<ScholarshipType, boolean>(row, "active");
          return (
            <Badge variant={active ? "default" : "secondary"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const scholarship = row.original;

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
                <DropdownMenuItem disabled>
                  <Eye className="size-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Users className="size-4" />
                  View Recipients
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Edit className="size-4" /> Edit Scholarship
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(scholarship)}
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
        data={scholarships}
        columns={columns}
        className={cn(className)}
        filterFields={[
          { label: "Title", value: "title", placeholder: "Search by title..." },
          {
            label: "Type",
            value: "type",
            options: scholarTypes.items.map((item) => ({
              ...item,
              withCount: true,
            })),
          },
          {
            label: "Category",
            value: "category",
            options: scholarshipCats.items.map((item) => ({
              ...item,
              withCount: true,
            })),
          },
        ]}
        barAction="scholarship"
        {...props}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete &quot;
                  {scholarshipToDelete?.title}&quot;?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone and will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>The scholarship program and its details</li>
                  <li>All associated recipients</li>
                  <li>All associated media files</li>
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
              {isPending ? "Deleting..." : "Delete Scholarship"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { ScholarshipsDataTable };
