import { DataTableSkeleton } from "@/components/data-table/skeleton";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { Shell } from "@/components/shell";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <StatsSkeleton />
      <DataTableSkeleton
        columnCount={7}
        rowCount={3}
        searchableColumnCount={1}
        filterableColumnCount={1}
        showViewOptions
      />
      <DataTableSkeleton
        columnCount={8}
        rowCount={3}
        searchableColumnCount={1}
        filterableColumnCount={1}
        showViewOptions
      />
    </Shell>
  );
}
