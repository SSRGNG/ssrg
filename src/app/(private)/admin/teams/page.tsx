import type { Metadata } from "next";
import * as React from "react";

import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Teams } from "@/components/views/admin/teams";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: `Admin Team Management`,
  description: "Manage research project teams and collaboration",
};

export default function TeamManagement() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Project Teams</h1>
          <p className="text-muted-foreground">
            Manage research project teams and collaboration
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Teams />
      </React.Suspense>
    </Shell>
  );
}
