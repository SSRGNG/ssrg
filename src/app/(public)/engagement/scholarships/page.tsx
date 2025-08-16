import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/engagement/scholarships";

export const metadata: Metadata = {
  title: "Scholarships",
};

export default function Scholarships() {
  return (
    <Page>
      <Hero />
      {/* Current Opportunities */}
      {/* Past Awardees */}
    </Page>
  );
}
