import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div"> & {
  hasNextPage: boolean;
  nextCursor?: string | null;
  currentCursor?: string | null;
  baseUrl: string;
  searchParams?: Record<string, string>;
  isLoading?: boolean;
  totalCount?: number;
  currentCount: number;
};

function CursorPagination({
  hasNextPage,
  nextCursor,
  currentCursor,
  baseUrl,
  searchParams = {},
  isLoading = false,
  totalCount,
  currentCount,
  className,
  ...props
}: Props) {
  const createPageUrl = (cursor?: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (cursor) {
      params.set("cursor", cursor);
    } else {
      params.delete("cursor");
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const createPrevUrl = () => {
    // For "previous", we need to implement reverse pagination
    // This is more complex with cursor pagination
    const params = new URLSearchParams(searchParams);
    params.delete("cursor");
    return `${baseUrl}?${params.toString()}`;
  };
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center space-x-2">
        {/* Previous Button - goes back to first page */}
        {currentCursor ? (
          <Link
            href={createPrevUrl()}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
              "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "h-10 px-4 py-2"
            )}
            aria-label="Go to first page"
          >
            <ChevronLeft className="h-4 w-4" />
            First Page
          </Link>
        ) : (
          <div
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
              "h-10 px-4 py-2 opacity-50 cursor-not-allowed border border-input bg-background"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            First Page
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>
          Showing {currentCount} publications
          {totalCount && ` of ${totalCount} total`}
        </span>
      </div>

      {/* Next Button */}
      <div className="flex items-center space-x-2">
        {hasNextPage && nextCursor ? (
          <Link
            href={createPageUrl(nextCursor)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
              "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "h-10 px-4 py-2"
            )}
            aria-label="Load more publications"
          >
            Load More
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
              "h-10 px-4 py-2 opacity-50 cursor-not-allowed border border-input bg-background"
            )}
          >
            Load More
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export { CursorPagination };
