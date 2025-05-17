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
import { getCachedResearchAreas } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: appConfig.home.title,
  description: appConfig.home.description,
};

export default async function Home() {
  const areas = await getCachedResearchAreas();

  // console.log({ areas });
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
