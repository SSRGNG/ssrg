import { PublicationsDataTable } from "@/components/views/portal/ui-tables";
import {
  CurrentResearcherRes,
  PortalResearcherPubs,
} from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & {
  userResult: CurrentResearcherRes;
  pubs: PortalResearcherPubs;
};

function Publications({ userResult, pubs, className, ...props }: Props) {
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
