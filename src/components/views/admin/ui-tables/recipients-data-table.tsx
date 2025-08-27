"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Calendar, Edit, Ellipsis, Eye, FileText, Trash2 } from "lucide-react";
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
import { AllRecipients } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { T_Data } from "@/types";
import { getTypedValue } from "@/types/table";

type RecipientType = AllRecipients[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  recipients: AllRecipients;
  t_data?: T_Data;
};

function RecipientsDataTable({
  recipients,
  t_data,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [recipientToDelete, setRecipientToDelete] =
    React.useState<RecipientType | null>(null);

  const handleDeleteClick = (recipient: RecipientType) => {
    setRecipientToDelete(recipient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!recipientToDelete) return;

    startTransition(async () => {
      try {
        // Replace with your delete action
        // const result = await deleteRecipient(recipientToDelete.id);

        toast.success("Recipient deleted successfully", {
          description: `"${recipientToDelete.name}" has been removed.`,
        });
      } catch (error) {
        console.error("Delete recipient error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setRecipientToDelete(null);
      }
    });
  };

  const columns = React.useMemo<ColumnDef<RecipientType>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "affiliation",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Affiliation" />
        ),
        cell: ({ row }) => {
          const affiliation = getTypedValue<RecipientType, string | null>(
            row,
            "affiliation"
          );
          return affiliation ? (
            <span className="text-sm">{affiliation}</span>
          ) : (
            <span className="text-muted-foreground text-sm">
              No affiliation
            </span>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "year",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Year" />
        ),
        cell: ({ row }) => {
          const year = getTypedValue<RecipientType, number>(row, "year");
          return (
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {year}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
          const amount = getTypedValue<RecipientType, string | null>(
            row,
            "amount"
          );
          return amount ? (
            <span className="font-medium">{amount}</span>
          ) : (
            <span className="text-muted-foreground">Not specified</span>
          );
        },
      },
      {
        accessorKey: "media",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Media" />
        ),
        cell: ({ row }) => {
          const media = row.original.media || [];
          return (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{media.length}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "notes",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Notes" />
        ),
        cell: ({ row }) => {
          const notes = getTypedValue<RecipientType, string | null>(
            row,
            "notes"
          );
          return notes ? (
            <Badge variant="secondary">Has notes</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">No notes</span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
          const createdAt = getTypedValue<RecipientType, Date>(
            row,
            "created_at"
          );
          return (
            <span className="text-sm">{createdAt.toLocaleDateString()}</span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const recipient = row.original;

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
                  <FileText className="size-4" />
                  View Media
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Edit className="size-4" /> Edit Recipient
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(recipient)}
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
        data={recipients}
        columns={columns}
        className={cn(className)}
        filterFields={[
          { label: "Name", value: "name", placeholder: "Search by name..." },
          {
            label: "Year",
            value: "year",
            options: Array.from(new Set(recipients.map((r) => r.year))).map(
              (year) => ({
                label: year.toString(),
                value: year.toString(),
                withCount: true,
              })
            ),
          },
        ]}
        context={t_data}
        barAction="recipient"
        {...props}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipient</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete &quot;
                  {recipientToDelete?.name}&quot;?
                </p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone and will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>The recipient record and details</li>
                  <li>All associated media files</li>
                  <li>All notes and documentation</li>
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
              {isPending ? "Deleting..." : "Delete Recipient"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { RecipientsDataTable };
