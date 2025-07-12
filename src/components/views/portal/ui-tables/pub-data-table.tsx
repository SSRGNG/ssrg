"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Ellipsis, Eye, Trash2 } from "lucide-react";
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
import { publications } from "@/config/enums";
import { formatInTextCitation } from "@/db/utils";
import type {
  AuthResearcher,
  PortalResearcherPubs,
} from "@/lib/actions/queries";
import { cn, formatPublicationDate } from "@/lib/utils";
import { getTypedValue } from "@/types/table";

type PubType = PortalResearcherPubs[number];
type Props = React.ComponentPropsWithoutRef<"div"> & {
  pubs: PortalResearcherPubs;
  researcher?: AuthResearcher;
  pageSizeOptions?: number[];
};

function PublicationsDataTable({
  pubs,
  researcher,
  pageSizeOptions = [10, 20, 30, 40],
  className,
  ...props
}: Props) {
  // const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<PubType>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
          const title = getTypedValue<PubType, string>(row, "title");
          const link = row.original.link;

          return link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  className:
                    "whitespace-normal h-fit px-0 py-0 has-[>svg]:px-0 line-clamp-2",
                  variant: "link",
                })
              )}
            >
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
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
          return publications.getLabel(row.original.type);
        },
        // filterFn: (row, id, value: string[]) => {
        //   return value.includes(row.getValue(id));
        // },
        filterFn: "includesString",
      },
      {
        accessorKey: "venue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Venue" />
        ),
        cell: ({ row }) => {
          // const venue = getTypedValue<PubType, string | null>(row, "venue");
          const venue = row.original.venue;
          return (
            <span className="whitespace-normal line-clamp-2">
              {venue || "N/A"}
            </span>
          );
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "authors",
        header: "Authors",
        cell: ({ row }) => {
          const authors = getTypedValue<PubType, PubType["authors"]>(
            row,
            "authors"
          );
          return (
            <span className="whitespace-normal line-clamp-2">
              {formatInTextCitation(authors)}
            </span>
          );
        },
        enableSorting: false,
        filterFn: (row, columnId, filterValue: string) => {
          const authors = row.getValue(columnId) as PubType["authors"];
          const citation = formatInTextCitation(authors).toLowerCase();
          const allNames = authors.map((a) => a.name.toLowerCase()).join(" ");

          const search = filterValue.toLowerCase();
          return citation.includes(search) || allNames.includes(search);
        },
      },
      {
        accessorKey: "publicationDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
          const date = row.original.publicationDate;
          return formatPublicationDate(date);
        },
      },
      {
        accessorKey: "citationCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Citations" />
        ),
        cell: ({ row }) => {
          // const count = getTypedValue<PubType, number | null>(row, "citationCount");
          const count = row.original.citationCount;
          return <div className="text-center">{count ?? 0}</div>;
        },
      },
      {
        accessorKey: "userAuthorOrder",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Your Role" />
        ),
        // header: "Role",
        cell: ({ row }) => {
          const pub = row.original;
          if (pub.isLeadAuthor) {
            return <Badge variant="default">Lead Author</Badge>;
          }
          return (
            <Badge variant="secondary">
              Co-Author (#{pub.userAuthorOrder + 1})
            </Badge>
          );
        },
        meta: {
          displayName: "Role",
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const pub = row.original;

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
                {pub.doi && (
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(`https://doi.org/${pub.doi}`, "_blank")
                    }
                  >
                    <Eye />
                    View DOI
                  </DropdownMenuItem>
                )}
                {(pub.isLeadAuthor || pub.canDelete) && (
                  <DropdownMenuSeparator />
                )}
                {pub.isLeadAuthor && (
                  <DropdownMenuItem>
                    <Edit />
                    Edit Publication
                  </DropdownMenuItem>
                )}
                {pub.canDelete && (
                  <DropdownMenuItem
                    onClick={() => {
                      // Implement delete functionality
                      console.log("Delete publication:", pub.id);
                    }}
                    // disabled={isPending}
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
      data={pubs}
      columns={columns}
      className={cn(className)}
      noData="No publications."
      pageSizeOptions={pageSizeOptions}
      context={researcher}
      filterFields={[
        { label: "Title", value: "title", placeholder: "Search by title..." },
        {
          label: "Type",
          value: "type",
          options: publications.items.map((item) => ({
            ...item,
            withCount: true,
          })),
        },
      ]}
      barAction="publication"
      {...props}
    />
  );
}

export { PublicationsDataTable };
