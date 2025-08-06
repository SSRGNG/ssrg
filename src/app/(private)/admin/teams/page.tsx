import type { Metadata } from "next";
import * as React from "react";

import { Shell } from "@/components/shell";
import { Teams } from "@/components/views/admin/teams";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Admin Team Management`,
  description: "Manage research project teams and collaboration",
};

export default function TeamManagement() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Teams />
      </React.Suspense>
    </Shell>
  );
}
