"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Edit,
  Ellipsis,
  ExternalLink,
  EyeOff,
  FileText,
  Globe,
  ImageIcon,
  Star,
  StarOff,
  Trash2,
  Video,
} from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
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
import { AllEventMedia } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { T_Data } from "@/types";
import { getTypedValue } from "@/types/table";

type MediaType = AllEventMedia[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  media: AllEventMedia;
  t_data?: T_Data;
};

function EventMediaDataTable({ media, t_data, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [mediaToDelete, setMediaToDelete] = React.useState<MediaType | null>(
    null
  );

  const handleDeleteClick = (mediaItem: MediaType) => {
    setMediaToDelete(mediaItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!mediaToDelete) return;

    startTransition(async () => {
      try {
        // Replace with your delete action
        // const result = await deleteEventMedia(mediaToDelete.id);

        toast.success("Media deleted successfully", {
          description: "The event media item has been removed.",
        });
      } catch (error) {
        console.error("Delete event media error:", error);
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        });
      } finally {
        setDeleteDialogOpen(false);
        setMediaToDelete(null);
      }
    });
  };

  // Get file info from the files array (should contain one file per media item)
  const getFileInfo = (mediaItem: MediaType) => {
    return mediaItem.file || null;
  };

  // Determine media type from file MIME type
  const getMediaTypeFromMime = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text/")
    ) {
      return "document";
    }
    return "document"; // default fallback
  };

  const getMediaIcon = (mimeType: string) => {
    const type = getMediaTypeFromMime(mimeType);
    switch (type) {
      case "image":
        return <ImageIcon className="size-4" />;
      case "video":
        return <Video className="size-4" />;
      case "document":
        return <FileText className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const getMediaTypeVariant = (mimeType: string) => {
    const type = getMediaTypeFromMime(mimeType);
    switch (type) {
      case "image":
        return "default" as const;
      case "video":
        return "secondary" as const;
      case "document":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const columns = React.useMemo<ColumnDef<MediaType>[]>(
    () => [
      {
        id: "mediaType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
          const fileInfo = getFileInfo(row.original);
          if (!fileInfo)
            return <span className="text-muted-foreground">No file</span>;

          const type = getMediaTypeFromMime(fileInfo.mimeType);
          return (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant={getMediaTypeVariant(fileInfo.mimeType)}
                  className="gap-1"
                >
                  {getMediaIcon(fileInfo.mimeType)}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{fileInfo.mimeType}</p>
                <p className="text-xs">{formatFileSize(fileInfo.size)}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
        filterFn: (row, id, value) => {
          console.log(id);
          const fileInfo = getFileInfo(row.original);
          if (!fileInfo) return false;
          const type = getMediaTypeFromMime(fileInfo.mimeType);
          return value.includes(type);
        },
      },
      {
        id: "filename",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="File" />
        ),
        cell: ({ row }) => {
          const fileInfo = getFileInfo(row.original);
          if (!fileInfo)
            return <span className="text-muted-foreground">No file</span>;

          return (
            <div className="space-y-1">
              <p className="text-sm font-medium truncate max-w-[200px]">
                {fileInfo.filename}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(fileInfo.size)}
              </p>
            </div>
          );
        },
        filterFn: (row, _, value) => {
          const fileInfo = getFileInfo(row.original);
          return (
            fileInfo?.filename.toLowerCase().includes(value.toLowerCase()) ??
            false
          );
        },
      },
      {
        accessorKey: "caption",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Caption" />
        ),
        cell: ({ row }) => {
          const caption = getTypedValue<MediaType, string | null>(
            row,
            "caption"
          );
          return caption ? (
            <span className="text-sm max-w-xs truncate">{caption}</span>
          ) : (
            <span className="text-muted-foreground text-sm">No caption</span>
          );
        },
        filterFn: "includesString",
      },
      {
        id: "eventInfo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Event" />
        ),
        cell: ({ row }) => {
          const eventId = getTypedValue<MediaType, string | null>(
            row,
            "eventId"
          );
          const externalEvent = getTypedValue<MediaType, string | null>(
            row,
            "externalEvent"
          );

          if (eventId && t_data?.events) {
            const event = t_data.events.find((e) => e.id === eventId);
            if (event) {
              return (
                <Badge variant="default" className="gap-1">
                  <Globe className="h-3 w-3" />
                  {event.title}
                </Badge>
              );
            }
          }

          if (externalEvent) {
            return (
              <Badge variant="secondary" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                {externalEvent}
              </Badge>
            );
          }

          return (
            <span className="text-muted-foreground text-sm">No event</span>
          );
        },
      },
      {
        id: "location",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ row }) => {
          const externalLocation = getTypedValue<MediaType, string | null>(
            row,
            "externalLocation"
          );
          return externalLocation ? (
            <span className="text-sm max-w-xs truncate">
              {externalLocation}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">No location</span>
          );
        },
      },
      {
        accessorKey: "externalDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Event Date" />
        ),
        cell: ({ row }) => {
          const externalDate = getTypedValue<MediaType, Date | null>(
            row,
            "externalDate"
          );
          return externalDate ? (
            <span className="text-sm">{externalDate.toLocaleDateString()}</span>
          ) : (
            <span className="text-muted-foreground text-sm">No date</span>
          );
        },
      },
      {
        accessorKey: "isPublic",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Visibility" />
        ),
        cell: ({ row }) => {
          const isPublic = getTypedValue<MediaType, boolean>(row, "isPublic");
          return (
            <Badge
              variant={isPublic ? "default" : "secondary"}
              className="gap-1"
            >
              {isPublic ? (
                <Globe className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              {isPublic ? "Public" : "Private"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "isFeatured",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Featured" />
        ),
        cell: ({ row }) => {
          const isFeatured = getTypedValue<MediaType, boolean>(
            row,
            "isFeatured"
          );
          return (
            <Badge
              variant={isFeatured ? "default" : "outline"}
              className="gap-1"
            >
              {isFeatured ? (
                <Star className="h-3 w-3" />
              ) : (
                <StarOff className="h-3 w-3" />
              )}
              {isFeatured ? "Featured" : "Regular"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "sortOrder",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Order" />
        ),
        cell: ({ row }) => {
          const sortOrder = getTypedValue<MediaType, number>(row, "sortOrder");
          return <span className="text-sm font-mono">#{sortOrder}</span>;
        },
      },
      {
        id: "altText",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Alt Text" />
        ),
        cell: ({ row }) => {
          const fileInfo = getFileInfo(row.original);
          const altText = fileInfo?.altText;
          return altText ? (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline">Has alt text</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{altText}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground text-sm">No alt text</span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
          const createdAt = getTypedValue<MediaType, Date>(row, "created_at");
          return (
            <span className="text-sm">{createdAt.toLocaleDateString()}</span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const mediaItem = row.original;
          const fileInfo = getFileInfo(mediaItem);
          const mediaUrl = fileInfo?.url;

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
                {mediaUrl && (
                  <React.Fragment>
                    <DropdownMenuItem
                      onClick={() => window.open(`${mediaUrl}`, "_blank")}
                    >
                      <ExternalLink className="size-4" />
                      Open Media
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={mediaUrl}
                        download={fileInfo?.filename}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            className:
                              "w-full justify-start px-2 has-[>svg]:px-2",
                          })
                        )}
                      >
                        <Download className="size-4" />
                        Download
                      </a>
                    </DropdownMenuItem>
                  </React.Fragment>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Edit className="size-4" />
                  Edit Media
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick(mediaItem)}
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
    [isPending, t_data]
  );

  const visibilityOptions = [
    { label: "Public", value: "true", withCount: true },
    { label: "Private", value: "false", withCount: true },
  ];

  const featuredOptions = [
    { label: "Featured", value: "true", withCount: true },
    { label: "Regular", value: "false", withCount: true },
  ];

  return (
    <React.Fragment>
      <DataTable
        data={media}
        columns={columns}
        className={cn(className)}
        filterFields={[
          {
            label: "Caption",
            value: "caption",
            placeholder: "Search by caption...",
          },
          {
            label: "Visibility",
            value: "isPublic",
            options: visibilityOptions,
          },
          {
            label: "Featured",
            value: "isFeatured",
            options: featuredOptions,
          },
        ]}
        context={t_data}
        barAction="event_media"
        {...props}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event Media</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Are you sure you want to delete this event media item?</p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone and will permanently remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>The media file and its metadata</li>
                  <li>Caption and location information</li>
                  <li>All associated references</li>
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
              {isPending ? "Deleting..." : "Delete Media"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}

export { EventMediaDataTable };
