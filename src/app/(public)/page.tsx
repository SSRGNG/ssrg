import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import {
  Featured,
  Hero,
  Metrics,
  Newsletter,
  ResearchAreas,
  Testimonials,
} from "@/components/views/home";
import { appConfig } from "@/config";
import { getCachedAdminResearchAreas } from "@/lib/queries/admin";
import { mapResearchAreas } from "@/lib/utils";

export const metadata: Metadata = {
  title: appConfig.home.title,
  description: appConfig.home.description,
};

export default async function Home() {
  const rawAreas = await getCachedAdminResearchAreas();
  const areas = mapResearchAreas(rawAreas);

  return (
    <Page>
      <Hero />
      <Metrics />
      <React.Suspense fallback={<div>Loading...</div>}>
        <ResearchAreas research_areas={areas} />
      </React.Suspense>
      <Featured />
      <Testimonials />
      <Newsletter />
    </Page>
  );
}
