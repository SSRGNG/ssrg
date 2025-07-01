import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div"> & {
  hasNextPage: boolean;
  nextCursor?: string | null;
  baseUrl: string;
  searchParams?: Record<string, string>;
};

function InfiniteScrollTrigger({
  hasNextPage,
  nextCursor,
  baseUrl,
  searchParams = {},
  className,
  ...props
}: Props) {
  if (!hasNextPage || !nextCursor) return null;

  const params = new URLSearchParams(searchParams);
  params.set("cursor", nextCursor);
  const nextUrl = `${baseUrl}?${params.toString()}`;
  return (
    <div className={cn("flex justify-center py-8", className)} {...props}>
      <Link
        href={nextUrl}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
          "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "h-10 px-8 py-2"
        )}
      >
        Load More Publications
      </Link>
    </div>
  );
}

export { InfiniteScrollTrigger };
