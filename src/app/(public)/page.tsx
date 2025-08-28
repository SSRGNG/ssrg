import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import {
  // Featured,
  Hero,
  LatestPublications,
  Metrics,
  Newsletter,
  ResearchAreas,
} from "@/components/views/home";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.home.title,
  description: appConfig.home.description,
};

export default function Home() {
  return (
    <Page>
      <Hero />
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
