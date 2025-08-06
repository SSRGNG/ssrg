import { UsersDataTable } from "@/components/views/admin/ui-tables";
import { SummaryCards } from "@/components/views/admin/users/summary-cards";
import { getAllUsersWithStats } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

async function Users({ className, ...props }: Props) {
  const users = await getAllUsersWithStats();

  // return <UsersDataTable users={users} className={cn(className)} {...props} />;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <SummaryCards users={users} />
      <UsersDataTable users={users} />
    </div>
  );
}

export { Users };
