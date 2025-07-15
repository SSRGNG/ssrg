"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Ellipsis, ExternalLink, Eye, Play, Trash2 } from "lucide-react";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { videoCats } from "@/config/enums";
import type { AuthResearcher, PortalVideos } from "@/lib/actions/queries";
import { cn, formatDate } from "@/lib/utils";
import { getTypedValue } from "@/types/table";

type PortalVideo = PortalVideos[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  vids: PortalVideos;
  researcher?: AuthResearcher;
  pageSizeOptions?: number[];
};

function VideosDataTable({
  vids,
  researcher,
  pageSizeOptions = [10, 20, 30, 40],
  className,
  ...props
}: Props) {
  const columns = React.useMemo<ColumnDef<PortalVideo>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
          const title = getTypedValue<PortalVideo, string>(row, "title");
          const youtubeUrl = row.original.youtubeUrl;

          return youtubeUrl ? (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  className:
                    "whitespace-normal h-fit px-0 py-0 has-[>svg]:px-0 line-clamp-2 justify-start",
                  variant: "link",
                })
              )}
            >
              <Play className="size-3 mr-1 flex-shrink-0" />
              {title}
            </a>
          ) : (
            <span className="font-medium whitespace-normal line-clamp-2">
              {title}
            </span>
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
          const category = row.original.category;
          return category ? (
            <Badge variant="secondary">{videoCats.getLabel(category)}</Badge>
          ) : (
            <span className="text-muted-foreground">Uncategorized</span>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "series",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Series" />
        ),
        cell: ({ row }) => {
          const series = row.original.series;
          return series ? (
            <Badge variant="outline">{series}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "creatorName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Creator" />
        ),
        cell: ({ row }) => {
          const creatorName = row.original.creatorName;
          const creatorEmail = row.original.creatorEmail;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{creatorName || "Unknown"}</span>
              {creatorEmail && (
                <span className="text-xs text-muted-foreground">
                  {creatorEmail}
                </span>
              )}
            </div>
          );
        },
        filterFn: "includesString",
        meta: { displayName: "Creator" },
      },
      {
        accessorKey: "publishedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Published" />
        ),
        cell: ({ row }) => {
          const publishedAt = row.original.publishedAt;
          return publishedAt ? formatDate(publishedAt) : "Not published";
        },
        meta: {
          displayName: "Published Date",
        },
      },
      {
        accessorKey: "viewCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Views" />
        ),
        cell: ({ row }) => {
          const viewCount = row.original.viewCount;
          return (
            <div className="text-center">
              {viewCount ? viewCount.toLocaleString() : 0}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const video = row.original;
          const badges = [];

          if (video.isFeatured) {
            badges.push(
              <Badge key="featured" variant="default" className="mr-1">
                Featured
              </Badge>
            );
          }

          if (!video.isPublic) {
            badges.push(
              <Badge key="private" variant="destructive" className="mr-1">
                Private
              </Badge>
            );
          }

          if (badges.length === 0) {
            badges.push(
              <Badge key="public" variant="secondary">
                Public
              </Badge>
            );
          }

          return <div className="flex flex-wrap">{badges}</div>;
        },
        filterFn: (row, _, filterValue: string) => {
          const video = row.original;
          const status = [];

          if (video.isFeatured) status.push("featured");
          if (video.isPublic) status.push("public");
          else status.push("private");

          return status.some((s) =>
            s.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
      },
      {
        accessorKey: "userRole",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Your Role" />
        ),
        cell: ({ row }) => {
          const video = row.original;

          if (video.isCreator) {
            return <Badge variant="default">Creator</Badge>;
          }

          if (video.isLeadAuthor) {
            return <Badge variant="default">Lead Author</Badge>;
          }

          if (video.isAuthor && !video.isLeadAuthor) {
            return (
              <Badge variant="secondary">
                Author{" "}
                {video.userOrder !== null ? `(#${video.userOrder + 1})` : ""}
              </Badge>
            );
          }

          return <span className="text-muted-foreground">-</span>;
        },
        meta: {
          displayName: "Role",
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const video = row.original;

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
                {video.youtubeUrl && (
                  <DropdownMenuItem
                    onClick={() => window.open(video.youtubeUrl, "_blank")}
                  >
                    <ExternalLink />
                    Watch on YouTube
                  </DropdownMenuItem>
                )}
                {video.canEdit && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit />
                      Edit Video
                    </DropdownMenuItem>
                  </>
                )}
                {video.canDelete && (
                  <DropdownMenuItem
                    onClick={() => {
                      // Implement delete functionality
                      console.log("Delete video:", video.id);
                    }}
                    disabled
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 />
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
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
      data={vids}
      columns={columns}
      className={cn(className)}
      noData="No videos."
      pageSizeOptions={pageSizeOptions}
      context={researcher}
      filterFields={[
        { label: "Title", value: "title", placeholder: "Search by title..." },
        {
          label: "Category",
          value: "category",
          options: videoCats.items.map((item) => ({
            ...item,
            withCount: true,
          })),
        },
      ]}
      barAction="video"
      {...props}
    />
  );
}

export { VideosDataTable };
