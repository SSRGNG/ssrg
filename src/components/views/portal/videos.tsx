import { VideosDataTable } from "@/components/views/portal/ui-tables";
import {
  CurrentResearcherRes,
  PortalVideosWithPagination,
} from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & {
  userResult: CurrentResearcherRes;
  vids: PortalVideosWithPagination;
};

function Videos({ userResult, vids, className, ...props }: Props) {
  return (
    <VideosDataTable
      vids={vids["videos"]}
      researcher={userResult.success ? userResult.researcher : undefined}
      pageSizeOptions={[5, 3]}
      className={cn(className)}
      {...props}
    />
  );
}

export { Videos };
