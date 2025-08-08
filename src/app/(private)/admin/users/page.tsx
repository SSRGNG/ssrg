import type { Metadata } from "next";

import { Shell } from "@/components/shell";
import { UsersDataTable } from "@/components/views/admin/ui-tables";
import { SummaryCards } from "@/components/views/admin/users/summary-cards";
import { getAllUsersWithStats } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Admin User Management`,
};

export default async function UserManagement() {
  const users = await getAllUsersWithStats();
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <SummaryCards users={users} />
      <UsersDataTable users={users} />
    </Shell>
  );
}
