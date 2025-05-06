import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Featured } from "@/components/views/home/featured";
import { Hero } from "@/components/views/home/hero";
import { Metrics } from "@/components/views/home/metrics";
import { Newsletter } from "@/components/views/home/newsletter";
import { ResearchAreas } from "@/components/views/home/research-areas";
import { Testimonials } from "@/components/views/home/testimonials";
import { appConfig } from "@/config";
import { getFormattedResearchAreas } from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: appConfig.home.title,
  description: appConfig.home.description,
};

export default async function Home() {
  const areas = await getFormattedResearchAreas();

  console.log({ areas });
  return (
    <Page>
      <Hero />
      <Metrics />
      <ResearchAreas research_areas={areas} />
      <Featured />
      <Testimonials />
      <Newsletter />
    </Page>
  );
}
