import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero, Researchers } from "@/components/views/people/team";

export const metadata: Metadata = {
  title: "Research Team",
};

export default function Team() {
  return (
    <Page>
      <Hero />
      <Researchers />
    </Page>
  );
}
