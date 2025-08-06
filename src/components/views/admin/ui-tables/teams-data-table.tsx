"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format, isWithinInterval } from "date-fns";
import {
  CheckCircle,
  Clock,
  Edit,
  Ellipsis,
  Eye,
  Pause,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { UserAvatar } from "@/components/shared/user-avatar";
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
import { Progress } from "@/components/ui/progress";
import { AdminTeams } from "@/lib/actions/queries";
import { cn, formatDate } from "@/lib/utils";

type TeamType = AdminTeams[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  teams: AdminTeams;
  pageSizeOptions?: number[];
};

const statusConfig = {
  planning: {
    label: "Planning",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-gray-600",
  },
  active: {
    label: "Active",
    variant: "default" as const,
    icon: TrendingUp,
    color: "text-green-600",
  },
  on_hold: {
    label: "On Hold",
    variant: "outline" as const,
    icon: Pause,
    color: "text-yellow-600",
  },
  completed: {
    label: "Completed",
    variant: "brand" as const,
    icon: CheckCircle,
    color: "text-blue-600",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600",
  },
};

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "outline" as const },
  high: { label: "High", variant: "default" as const },
  critical: { label: "Critical", variant: "destructive" as const },
};

function TeamsDataTable({
  teams,
  pageSizeOptions = [10, 20, 30, 40],
  className,
  ...props
}: Props) {
  const [isPending] = React.useTransition();

  const columns = React.useMemo<ColumnDef<TeamType>[]>(
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
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Project Team" />
        ),
        cell: ({ row }) => {
          const team = row.original;
          const statusInfo = statusConfig[team.status];
          const StatusIcon = statusInfo.icon;

          return (
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  team.status === "active"
                    ? "bg-green-100 text-green-600"
                    : team.status === "completed"
                    ? "bg-blue-100 text-blue-600"
                    : team.status === "on_hold"
                    ? "bg-yellow-100 text-yellow-600"
                    : team.status === "cancelled"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <StatusIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm truncate">{team.title}</h3>
                  {team.featured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                {team.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {team.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>
                    {team.activeMemberCount}/{team.memberCount} active
                  </span>
                  {team.progressPercentage > 0 && (
                    <>
                      <span>•</span>
                      <span>{team.progressPercentage}% complete</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "leadResearcher",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Lead Researcher" />
        ),
        cell: ({ row }) => {
          const team = row.original;

          return (
            <div className="flex items-center gap-2">
              <UserAvatar
                user={{
                  name: team.leadResearcherName,
                  image: team.leadResearcherImage,
                }}
                className="size-8"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {team.leadResearcherName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {team.leadResearcherTitle}
                </p>
              </div>
            </div>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          const priority = row.original.priority;
          const statusInfo = statusConfig[status];
          const priorityInfo = priorityConfig[priority];

          return (
            <div className="flex flex-col gap-1">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              {priority !== "medium" && (
                <Badge variant={priorityInfo.variant} className="text-xs">
                  {priorityInfo.label}
                </Badge>
              )}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Progress" />
        ),
        cell: ({ row }) => {
          const team = row.original;

          return (
            <div className="w-full max-w-[120px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {team.progressPercentage}%
                </span>
                {team.endDate && (
                  <span className="text-xs text-muted-foreground">
                    {format(team.endDate, "MMM dd")}
                  </span>
                )}
              </div>
              <Progress value={team.progressPercentage} className="h-2" />
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ row }) => {
          const team = row.original;

          if (!team.budgetTotal) {
            return (
              <span className="text-xs text-muted-foreground">
                No budget set
              </span>
            );
          }

          const budgetUsedPercentage = team.budgetUsed
            ? (Number(team.budgetUsed) / Number(team.budgetTotal)) * 100
            : 0;

          return (
            <div className="text-sm">
              <div className="font-medium">
                ${Number(team.budgetTotal).toLocaleString()}
              </div>
              {team.budgetUsed && (
                <div className="text-xs text-muted-foreground">
                  ${Number(team.budgetUsed).toLocaleString()} used
                  <span
                    className={cn(
                      "ml-1",
                      budgetUsedPercentage > 90
                        ? "text-red-600"
                        : budgetUsedPercentage > 75
                        ? "text-yellow-600"
                        : "text-green-600"
                    )}
                  >
                    ({budgetUsedPercentage.toFixed(0)}%)
                  </span>
                </div>
              )}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Date;
          return (
            <div className="text-sm">
              {formatDate(date, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const date = new Date(row.getValue(id));
          if (!value) return true;

          if (Array.isArray(value)) {
            const [start, end] = value;
            return isWithinInterval(date, { start, end });
          } else {
            return (
              format(date, "yyyy-MM-dd") === format(value as Date, "yyyy-MM-dd")
            );
          }
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const team = row.original;
          console.log({ team });

          return (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="size-8 p-0 data-[state=open]:bg-muted"
                >
                  <Ellipsis className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye />
                  View Team
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users />
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isPending}
                  className="text-rose-600 focus:text-rose-600"
                >
                  <Trash2 />
                  Delete Project
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
    <DataTable
      data={teams}
      columns={columns}
      className={cn(className)}
      noData="No project teams found."
      pageSizeOptions={pageSizeOptions}
      filterFields={[
        {
          label: "Project",
          value: "title",
          placeholder: "Search projects...",
        },
        {
          label: "Status",
          value: "status",
          options: Object.entries(statusConfig).map(([value, config]) => ({
            label: config.label,
            value,
            withCount: true,
          })),
        },
        {
          label: "Priority",
          value: "priority",
          options: Object.entries(priorityConfig).map(([value, config]) => ({
            label: config.label,
            value,
            withCount: true,
          })),
        },
      ]}
      dateFields={[{ value: "created_at", label: "Created Date" }]}
      {...props}
    />
  );
}

export { TeamsDataTable };
