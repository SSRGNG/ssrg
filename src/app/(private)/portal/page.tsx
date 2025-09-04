import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Publications, Stats, Videos } from "@/components/views/portal";
import {
  getCurrentUserResearcher,
  getResearcherPublications,
  getUserStats,
} from "@/lib/queries/portal";
import { getUserVideos } from "@/lib/queries/videos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Portal`,
};

export default async function Portal() {
  const userStatsResult = await getUserStats();
  const [userResult, pubs, vids] = await Promise.all([
    getCurrentUserResearcher(),
    getResearcherPublications({ limit: 5 }),
    getUserVideos({ limit: 5 }),
    // getAssociatedPublications({ limit: 5 }),
  ]);
  // console.log({ associated });
  return (
    <Page variant={"portal"} className={cn("space-y-4")}>
      <Stats userStatsResult={userStatsResult} />
      <Publications userResult={userResult} pubs={pubs} />
      <Videos userResult={userResult} vids={vids} />
    </Page>
  );
}
