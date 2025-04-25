import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Collaborations } from "@/components/views/research/areas/collaborations";
import { Hero } from "@/components/views/research/areas/hero";
import { Integration } from "@/components/views/research/areas/integration";

export const metadata: Metadata = {
  title: "Research Areas",
};

export default function Home() {
  return (
    <Page>
      <Hero />
      <Integration />
      <Collaborations />
    </Page>
  );
}
