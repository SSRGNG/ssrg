import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { CallToAction } from "@/components/views/areas/call-to-action";
import { Demo } from "@/components/views/areas/demo";
import { Hero } from "@/components/views/areas/hero";
import { ImpactMeasurement } from "@/components/views/areas/impact-measurement";
import { Interconnections } from "@/components/views/areas/interconnections";
import { JoinResearchNetwork } from "@/components/views/areas/join-research-network";
import { Methodologies } from "@/components/views/areas/methodologies";
import { Projects } from "@/components/views/areas/projects";
import { ResearchAreas } from "@/components/views/areas/research-areas";
import { ResearchEthics } from "@/components/views/areas/research-ethics";
import { ResearchPartnerships } from "@/components/views/areas/research-partnerships";
import { Resources } from "@/components/views/areas/resources";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: "R Areas",
  description: appConfig.description,
};

export default function Home() {
  return (
    <Page>
      <Hero />
      <Methodologies />
      <Interconnections />
      <ResearchAreas />
      <Projects />
      <ImpactMeasurement />
      <ResearchPartnerships />
      <ResearchEthics />
      <Resources />
      <JoinResearchNetwork />
      <Demo />
      <CallToAction />
    </Page>
  );
}
