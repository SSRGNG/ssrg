import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { VideosDataTable } from "@/components/views/portal/ui-tables";
import { getCurrentUserResearcher } from "@/lib/queries/portal";
import { getUserVideos } from "@/lib/queries/videos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Portal Videos`,
};

export default async function Videos() {
  const [userResult, vids] = await Promise.all([
    getCurrentUserResearcher(),
    getUserVideos({ limit: 100 }),
  ]);
  return (
    <Page variant={"portal"} className={cn("space-y-4")}>
      <VideosDataTable
        vids={vids["videos"]}
        researcher={userResult.success ? userResult.researcher : undefined}
      />
    </Page>
  );
}
