import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"section">;

function LoadingSkeleton({ className, ...props }: Props) {
  return (
    <section className={cn(className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header skeleton */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-3/4 max-w-lg" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar with filters/navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={`nav-${index}`} className="h-6 w-full" />
                  ))}
              </div>

              <div className="mt-8 space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton key={`filter-${index}`} className="h-6 w-5/6" />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content - Research areas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Research area cards */}
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`area-${index}`}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon placeholder */}
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-7 w-3/4" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>

                  {/* Research questions */}
                  <div className="space-y-3 pt-2">
                    <Skeleton className="h-5 w-1/3" />
                    <div className="space-y-2">
                      {Array(3)
                        .fill(0)
                        .map((_, qIndex) => (
                          <Skeleton
                            key={`q-${index}-${qIndex}`}
                            className="h-4 w-full"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-2">
                    <Skeleton className="h-9 w-40" />
                  </div>
                </div>
              ))}

            {/* Pagination skeleton */}
            <div className="flex justify-center items-center space-x-2 pt-6">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    key={`page-${index}`}
                    className="h-8 w-8 rounded-md"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSkeleton({ className, ...props }: Props) {
  return (
    <section
      className={cn("grid xs:grid-cols-2 md:grid-cols-4 gap-4", className)}
      {...props}
    >
      {Array.from({ length: 4 }, (_, idx) => (
        <Card
          key={idx}
          className="gap-2.5 flex-row justify-between items-center"
        >
          <CardHeader className="gap-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-12 mt-2" />
          </CardHeader>
          <CardContent>
            <span className={cn("flex rounded-full p-3 bg-accent")}>
              <Skeleton className="size-4 rounded-full" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
export { LoadingSkeleton, StatsSkeleton };
