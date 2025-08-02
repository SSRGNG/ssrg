import type { Metadata } from "next";
import * as React from "react";

import { Shell } from "@/components/shell";
import { Users } from "@/components/views/admin/users/users";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Admin User Management`,
};

export default function UserManagement() {
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Users />
      </React.Suspense>
    </Shell>
  );
}
