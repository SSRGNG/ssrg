import { PublicationsDataTable } from "@/components/views/portal/ui-tables";
import {
  getCurrentUserResearcher,
  getResearcherPublications,
} from "@/lib/queries/portal";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

async function Publications({ className, ...props }: Props) {
  const [userResult, pubs] = await Promise.all([
    getCurrentUserResearcher(),
    getResearcherPublications({ limit: 5 }),
  ]);

  return (
    <PublicationsDataTable
      pubs={pubs}
      researcher={userResult.success ? userResult.researcher : undefined}
      pageSizeOptions={[5, 3]}
      className={cn(className)}
      {...props}
    />
  );
}

export { Publications };
