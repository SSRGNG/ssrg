"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
import { Edit, Ellipsis, Eye, Trash2, User } from "lucide-react";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UsersTableFloatingBar } from "@/components/views/admin/ui-tables/users-floating-bar";
import { roles } from "@/config/enums";
import { deleteUser } from "@/lib/actions";
import type { AdminUsers, AuthResearcher } from "@/lib/actions/queries";
import { cn, formatDate } from "@/lib/utils";

type UserType = AdminUsers[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  users: AdminUsers;
  researcher?: AuthResearcher;
  pageSizeOptions?: number[];
};

function UsersDataTable({
  users,
  researcher,
  pageSizeOptions = [10, 20, 30, 40],
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<UserType | null>(null);

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    startTransition(async () => {
      try {
        const result = await deleteUser(userToDelete.id);

        if (result.success) {
          toast.success("User deleted successfully", {
            description: `"${userToDelete.name}" has been removed from your users.`,
          });
        } else {
          toast.error("Failed to delete user", {
            description: result.details || result.error,
          });
        }
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    });
  };

  const columns = React.useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex items-center gap-1.5">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="User image"
                  width={40}
                  height={40}
                  className="size-10 object-cover rounded border shadow-sm"
                  unoptimized={true}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="flex-shrink-0 inline-flex items-center justify-center size-10 rounded-full bg-muted">
                  <User className="size-5" strokeWidth={1.0} />
                </span>
              )}
              <p className="text-sm">
                <span className="font-medium">{user.name}</span>{" "}
                {user.affiliation ? (
                  <span className="text-xs text-muted-foreground/70">
                    ({user.affiliation})
                  </span>
                ) : null}
                <span className="text-muted-foreground block">
                  {user.email}
                </span>
              </p>
            </div>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const role = row.original.role;
          // return roles.getLabel(role);
          return (
            <Badge
              variant={
                role === "admin"
                  ? "brand"
                  : role === "researcher"
                  ? "default"
                  : role === "affiliate"
                  ? "secondary"
                  : role === "partner"
                  ? "outline"
                  : "destructive"
              }
            >
              {roles.getLabel(role)}
            </Badge>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        // cell: ({ row }) => {
        //   const venue = row.original.createdAt;
        //   return (
        //     <span className="whitespace-normal line-clamp-2">
        //       {venue || "N/A"}
        //     </span>
        //   );
        // },
        cell: ({ cell }) =>
          formatDate(cell.getValue() as Date, {
            month: "short", //"Jan-Dec" instead of "January-December"
            day: "numeric",
            year: "numeric",
          }),
        filterFn: (row, id, value) => {
          const date = new Date(row.getValue(id));
          if (!value) return true;

          if (Array.isArray(value)) {
            // Month filter
            const [start, end] = value;
            return isWithinInterval(date, { start, end });
          } else {
            // Single date filter
            return (
              format(date, "yyyy-MM-dd") === format(value as Date, "yyyy-MM-dd")
            );
          }
        },
        // filterFn: "includesString",
        meta: { displayName: "Date Joined" },
      },
      {
        accessorKey: "projectCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stat" />
        ),
        cell: ({ row }) => {
          const { projectCount, publicationCount, videoCount } = row.original;
          return (
            <p className="text-sm">
              <span className="font-medium block">
                {publicationCount}{" "}
                {publicationCount === 1 ? "publication" : "publications"}
              </span>
              <span className="text-muted-foreground">
                {videoCount} {videoCount === 1 ? "video" : "videos"}
              </span>{" "}
              <span className="text-xs text-muted-foreground/70">
                & {projectCount} {projectCount === 1 ? "project" : "projects"}
              </span>
            </p>
          );
        },
        meta: { displayName: "Stat" },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;

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
                <DropdownMenuItem>
                  <Eye />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(user)}
                  disabled={isPending}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Trash2 />
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
        data={users}
        columns={columns}
        className={cn(className)}
        noData="No users."
        pageSizeOptions={pageSizeOptions}
        context={researcher}
        filterFields={[
          { label: "Name", value: "name", placeholder: "Search by name..." },
          {
            label: "Role",
            value: "role",
            options: roles.items.map((item) => ({
              ...item,
              withCount: true,
            })),
          },
        ]}
        dateFields={[
          { value: "createdAt", label: "Date Joined" },
          // You can add more date columns here:
          // { value: "updatedAt", label: "Last Updated" },
          // { value: "publication_date", label: "Publication Date" },
        ]}
        actionKey="user"
        floatingBar={(table) => <UsersTableFloatingBar table={table} />}
        {...props}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{userToDelete?.name}
              &quot;? This action cannot be undone and will remove the user and
              all associated relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { UsersDataTable };
