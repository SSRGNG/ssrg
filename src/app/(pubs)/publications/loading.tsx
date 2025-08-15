import { PublicationsSkeleton } from "@/components/shared/loading-skeleton";
import { Shell } from "@/components/shell";

export default function Loading() {
  return (
    <Shell variant={"publications"}>
      <PublicationsSkeleton />
    </Shell>
  );
}
