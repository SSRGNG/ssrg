import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import { getCachedResearchAreas } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: `Core Features`,
};

export default async function Admin() {
  const areas = await getCachedResearchAreas();

  console.log({ areas });
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page variant={"portal"}>
        <h2>Core Features</h2>
      </Page>
    </React.Suspense>
  );
}
