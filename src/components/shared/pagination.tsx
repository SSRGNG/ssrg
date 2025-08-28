import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"nav"> & {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
};

function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className,
  ...props
}: Props) {
  // const createPageUrl = (page: number) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", page.toString());
  //   return `${baseUrl}?${params.toString()}`;
  // };
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add existing search params (excluding page)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value);
      }
    });

    // Only add page param if it's not page 1
    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Build the range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show page 1
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Add the range (avoiding duplicates with page 1)
    rangeWithDots.push(...range.filter((page) => page !== 1));

    // Add last page if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates and sort
    return [...new Set(rangeWithDots)].sort((a, b) => {
      if (a === "..." || b === "...") return 0;
      return (a as number) - (b as number);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Pagination"
      {...props}
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <Button
          size={"icon"}
          variant={"outline"}
          disabled
          className="cursor-not-allowed"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="size-4" />
              </div>
            ) : (
              <Link
                href={createPageUrl(page as number)}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? "default" : "outline",
                    size: "icon",
                  })
                )}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Go to next page"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <Button
          size={"icon"}
          variant={"outline"}
          disabled
          className="cursor-not-allowed"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}

export { Pagination };
