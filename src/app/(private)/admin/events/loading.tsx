import { DataTableSkeleton } from "@/components/data-table/skeleton";
import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
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
