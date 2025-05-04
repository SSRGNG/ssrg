import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Findings } from "@/components/views/research/areas/c-dev/findings";
import { Hero } from "@/components/views/research/areas/c-dev/hero";
import { Projects } from "@/components/views/research/areas/c-dev/projects";
import { Publications } from "@/components/views/research/areas/c-dev/publications";
import { ResearchMethods } from "@/components/views/research/areas/c-dev/research-methods";
import { ResearchTeam } from "@/components/views/research/areas/c-dev/research-team";
import { GetInvolved } from "@/components/views/research/get-involved";

export const metadata: Metadata = {
  title: "Community Development",
};

export default function CommunityDevelopment() {
  return (
    <Page>
      <Hero />
      <Projects />
      <ResearchMethods />
      <Findings />
      <Publications />
      <ResearchTeam />
      <GetInvolved />
    </Page>
  );
}
