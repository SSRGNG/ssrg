import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { PublicationsDataTable } from "@/components/views/portal/ui-tables";
import {
  getCurrentUserResearcher,
  getResearcherPublications,
} from "@/lib/queries/portal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Portal Publications`,
};

export default async function Publications() {
  const [userResult, pubs] = await Promise.all([
    getCurrentUserResearcher(),
    getResearcherPublications({ limit: 100 }),
  ]);
  return (
    <Page variant={"portal"} className={cn("space-y-4")}>
      <PublicationsDataTable
        pubs={pubs}
        researcher={userResult.success ? userResult.researcher : undefined}
      />
    </Page>
  );
}
