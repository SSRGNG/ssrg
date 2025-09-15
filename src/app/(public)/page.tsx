import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import {
  LatestPublications,
  Metrics,
  Newsletter,
  ResearchAreas,
  // Featured,
  Slide,
} from "@/components/views/home";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.home.title,
  description: appConfig.home.description,
};

export default function Home() {
  return (
    <Page>
      <Slide />
      <Metrics />
      <React.Suspense fallback={<div>Loading...</div>}>
        <ResearchAreas />
      </React.Suspense>
      {/* <Featured /> */}
      <React.Suspense fallback={<p>Loading...</p>}>
        <LatestPublications />
      </React.Suspense>
      {/* <Testimonials /> */}
      <Newsletter />
    </Page>
  );
}
