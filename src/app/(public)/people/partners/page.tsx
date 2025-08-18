import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero, PartnerCards } from "@/components/views/people/partners";

export const metadata: Metadata = {
  title: "Partners",
};

export default function Partners() {
  return (
    <Page>
      <Hero />
      <PartnerCards />
    </Page>
  );
}
