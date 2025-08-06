"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
import {
  Edit,
  Ellipsis,
  ExternalLink,
  Eye,
  GitBranchPlus,
  GraduationCap,
  Trash2,
  User,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UsersTableFloatingBar } from "@/components/views/admin/ui-tables/users-floating-bar";
import { MakeAdminResearcher } from "@/components/views/admin/users";
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
          const isResearcher = !!user.researcherId;

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
                  {isResearcher ? (
                    <GraduationCap className="size-5" strokeWidth={1.5} />
                  ) : (
                    <User className="size-5" strokeWidth={1.5} />
                  )}
                </span>
              )}
              <div className="text-sm min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium truncate">{user.name}</span>
                  {isResearcher && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GraduationCap className="size-3 text-brand flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>Active Researcher</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                {user.affiliation && (
                  <span className="text-xs text-muted-foreground/70 block truncate">
                    {user.affiliation}
                  </span>
                )}
              </div>
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
          const isResearcher = !!row.original.researcherId;

          return (
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={
                  role === "admin"
                    ? "default"
                    : role === "researcher"
                    ? "brand"
                    : role === "affiliate"
                    ? "secondary"
                    : role === "partner"
                    ? "outline"
                    : "destructive"
                }
              >
                {roles.getLabel(role)}
              </Badge>
              {isResearcher && role !== "researcher" && (
                <Badge variant="brand" className="text-xs">
                  <GraduationCap className="size-2" />
                  Researcher
                </Badge>
              )}
            </div>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
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
        meta: { displayName: "Date Joined" },
      },
      {
        accessorKey: "projectCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Research Output" />
        ),
        cell: ({ row }) => {
          const { projectCount, publicationCount, videoCount, researcherId } =
            row.original;
          const hasResearchOutput =
            publicationCount > 0 || videoCount > 0 || projectCount > 0;

          if (!researcherId && !hasResearchOutput) {
            return (
              <span className="text-xs text-muted-foreground">
                No research activity
              </span>
            );
          }

          return (
            <div className="text-sm space-y-0.5">
              {publicationCount > 0 && (
                <div className="font-medium">
                  {publicationCount}{" "}
                  {publicationCount === 1 ? "publication" : "publications"}
                </div>
              )}
              <div className="text-muted-foreground text-xs space-x-1.5">
                {videoCount > 0 && (
                  <span>
                    {videoCount} {videoCount === 1 ? "video" : "videos"}
                  </span>
                )}
                {projectCount > 0 && (
                  <span>
                    {projectCount} {projectCount === 1 ? "project" : "projects"}
                  </span>
                )}
              </div>
            </div>
          );
        },
        enableSorting: false,
        meta: { displayName: "Research Output" },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          const isResearcher = !!user.researcherId;

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
                  View Profile
                </DropdownMenuItem>
                {isResearcher && (
                  <DropdownMenuItem>
                    <GraduationCap />
                    Research Profile
                    <DropdownMenuShortcut>
                      <ExternalLink className="size-3" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {user.role === "admin" && !isResearcher && (
                  <DropdownMenuItem>
                    <MakeAdminResearcher name={user.name}>
                      <Button
                        aria-label="Toggle creation"
                        size="sm"
                        variant="ghost"
                        className={cn("w-full justify-start text-xs px-2")}
                      >
                        <GitBranchPlus />
                        Make a Researcher
                      </Button>
                    </MakeAdminResearcher>
                  </DropdownMenuItem>
                )}
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
              {userToDelete?.researcherId && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ This user has research data that will also be affected.
                </span>
              )}
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
