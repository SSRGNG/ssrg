import { VideosDataTable } from "@/components/views/portal/ui-tables";
import { getCurrentUserResearcher } from "@/lib/queries/portal";
import { getUserVideos } from "@/lib/queries/videos";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

async function Videos({ className, ...props }: Props) {
  const [userResult, vids] = await Promise.all([
    getCurrentUserResearcher(),
    getUserVideos({ limit: 5 }),
  ]);

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
