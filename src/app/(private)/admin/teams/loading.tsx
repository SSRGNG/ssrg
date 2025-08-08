import { DataTableSkeleton } from "@/components/data-table/skeleton";
import { Shell } from "@/components/shell";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <section className={cn("grid xs:grid-cols-2 md:grid-cols-4 gap-4")}>
        {Array.from({ length: 4 }, (_, idx) => (
          <Card key={idx} className="gap-2.5">
            <CardHeader className="gap-2.5">
              <Skeleton className="h-4 w-16" />
              <CardAction>
                <Skeleton className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-4 rounded-md mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </section>
      <section
        className={cn(
          "bg-muted text-muted-foreground flex flex-wrap justify-start gap-1.5 w-full h-9 rounded-lg p-[3px]"
        )}
      >
        {Array.from({ length: 3 }, (_, idx) => (
          <Skeleton key={idx} className="flex-1 h-auto border border-input" />
        ))}
      </section>
      <DataTableSkeleton
        columnCount={6}
        rowCount={3}
        searchableColumnCount={1}
        filterableColumnCount={1}
        showViewOptions
      />
    </Shell>
  );
}
