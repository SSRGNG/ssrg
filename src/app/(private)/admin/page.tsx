import type { Metadata } from "next";
import * as React from "react";

import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { Shell } from "@/components/shell";
import { Activities, Charts, Stats } from "@/components/views/admin";

export const metadata: Metadata = {
  title: `Admin`,
};

export default function Admin() {
  return (
    <Shell variant={"portal"} className="space-y-4">
      <React.Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </React.Suspense>
      <React.Suspense fallback={<p>Loading...</p>}>
        <Charts />
      </React.Suspense>
      <React.Suspense fallback={<p>Loading...</p>}>
        <Activities />
      </React.Suspense>
    </Shell>
  );
}
