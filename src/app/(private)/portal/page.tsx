import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import { Publications, Stats } from "@/components/views/portal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Portal`,
};

export default function Portal() {
  return (
    <Page variant={"portal"} className={cn("space-y-4")}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Stats />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Publications />
      </React.Suspense>
    </Page>
  );
}
