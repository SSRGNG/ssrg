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
              <Skeleton className="h-3 w-1/2" />
              <CardAction>
                <Skeleton className="size-4" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-end gap-8 aspect-square max-h-[250px] p-2">
                <Skeleton className="size-32 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <DataTableSkeleton
        columnCount={4}
        rowCount={3}
        searchableColumnCount={1}
        filterableColumnCount={1}
        showViewOptions
      />
    </Shell>
  );
}
