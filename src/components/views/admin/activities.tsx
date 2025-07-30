import { Monthly } from "@/components/views/admin/monthly";
import { Recent } from "@/components/views/admin/recent";
import { getMonthlyActivity, getRecentActivity } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"section">;

async function Activities({ className, ...props }: Props) {
  const [monthly, recent] = await Promise.all([
    getMonthlyActivity(),
    getRecentActivity(),
  ]);
  return (
    <section className={cn("grid gap-4", className)} {...props}>
      <Monthly monthly={monthly} />
      <Recent recent={recent} />
    </section>
  );
}

export { Activities };
