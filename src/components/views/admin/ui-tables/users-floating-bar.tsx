"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Table } from "@tanstack/react-table";
import { Trash2, UserCog, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { roles } from "@/config/enums";
import { bulkDeleteUsers, bulkUpdateUserRole } from "@/lib/actions";
import type { AdminUsers } from "@/lib/actions/queries";

const roleUpdateSchema = z.object({
  role: z.enum([
    "admin",
    "researcher",
    "affiliate",
    "partner",
    "member",
  ] as const),
});

type RoleUpdateFormData = z.infer<typeof roleUpdateSchema>;

type UserData = AdminUsers[number];
type Props<TData extends UserData> = React.ComponentProps<"div"> & {
  table: Table<TData>;
};

function UsersTableFloatingBar<TData extends UserData>({
  table,
}: Props<TData>) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [roleUpdateDialogOpen, setRoleUpdateDialogOpen] = React.useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const selectedUsers = selectedRows.map((row) => row.original);

  const userRoles = React.useMemo(() => roles.items, []);

  const form = useForm<RoleUpdateFormData>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      role: undefined,
    },
  });

  // Clear selection function
  const clearSelection = () => {
    table.toggleAllPageRowsSelected(false);
  };

  // Reset form when dialog closes
  const handleRoleDialogChange = (open: boolean) => {
    setRoleUpdateDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    startTransition(async () => {
      try {
        const userIds = selectedUsers.map((user) => user.id);
        const result = await bulkDeleteUsers(userIds);

        if (result.success) {
          toast.success(
            `Successfully deleted ${result.deletedCount} user${
              result.deletedCount > 1 ? "s" : ""
            }`
          );
          clearSelection();
        } else {
          toast.error("Failed to delete users", {
            description: result.error || "Please try again later.",
          });
        }
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    });
  };

  // Bulk role update handler
  const handleBulkRoleUpdate = (data: RoleUpdateFormData) => {
    startTransition(async () => {
      try {
        const userIds = selectedUsers.map((user) => user.id);
        const result = await bulkUpdateUserRole(userIds, data.role);

        if (result.success) {
          toast.success(
            `Successfully updated ${result.updatedCount} user${
              result.updatedCount > 1 ? "s" : ""
            } role${result.updatedCount > 1 ? "s" : ""}`,
            {
              description: `Role changed to ${roles.getLabel(data.role)}`,
            }
          );
          clearSelection();
          setRoleUpdateDialogOpen(false);
        } else {
          toast.error("Failed to update user roles", {
            description: result.error || "Please try again later.",
          });
        }
      } catch (error) {
        console.error("Bulk role update error:", error);
        toast.error("Failed to update user roles", {
          description: "Please try again later.",
        });
      }
    });
  };

  if (selectedCount === 0) return null;

  return (
    <React.Fragment>
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border bg-card p-2 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-2">
        <div className="flex h-8 items-center rounded-md border border-dashed px-2.5">
          <Badge variant="secondary" className="font-normal">
            {selectedCount}
          </Badge>
          <span className="ml-1.5 text-xs text-muted-foreground whitespace-nowrap">
            {selectedCount === 1 ? "user" : "users"} selected
          </span>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-5"
        />

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleUpdateDialogOpen(true)}
            disabled={isPending}
            className="px-2.5 has-[>svg]:px-2.5"
            title="Assign Role"
          >
            <UserCog className="size-3" />
            <span className="hidden xs:inline">Assign Role</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isPending}
            className=" text-rose-600 hover:text-rose-700 px-2.5 has-[>svg]:px-2.5"
            title="Delete"
          >
            <Trash2 className="size-3" />
            <span className="hidden xs:inline">Delete</span>
          </Button>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-5"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          // className="h-7 px-1.5"
        >
          <X className="size-3" />
        </Button>
      </div>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedCount} User{selectedCount > 1 ? "s" : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} user
              {selectedCount > 1 ? "s" : ""}? This action cannot be undone and
              will remove {selectedCount > 1 ? "these users" : "this user"} and
              all associated relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedCount <= 5 && (
            <div className="text-sm text-muted-foreground">
              <strong>Users to be deleted:</strong>
              <ul className="mt-1 list-disc list-inside">
                {selectedUsers.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AlertDialogFooter className="gap-3 xs:flex-row">
            <AlertDialogCancel className="flex-1" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="flex-1 bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
            >
              {isPending
                ? "Deleting..."
                : `Delete ${selectedCount} User${selectedCount > 1 ? "s" : ""}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Role Update Dialog */}
      <AlertDialog
        open={roleUpdateDialogOpen}
        onOpenChange={handleRoleDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Assign Role to {selectedCount} User{selectedCount > 1 ? "s" : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select the role you want to assign to the selected {selectedCount}{" "}
              user{selectedCount > 1 ? "s" : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedCount <= 5 && (
            <div className="text-sm text-muted-foreground">
              <strong>Users to be updated:</strong>
              <ul className="mt-1 list-disc list-inside">
                {selectedUsers.map((user) => (
                  <li key={user.id}>
                    {user.name}
                    <span className="ml-1 text-muted-foreground">
                      (current: {roles.getLabel(user.role)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleBulkRoleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>New Role</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <AlertDialogFooter className="gap-3 xs:flex-row">
                <AlertDialogCancel className="flex-1" disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isPending || !form.watch("role")}
                >
                  {isPending
                    ? "Updating..."
                    : `Update ${selectedCount} User${
                        selectedCount > 1 ? "s" : ""
                      }`}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { UsersTableFloatingBar };
