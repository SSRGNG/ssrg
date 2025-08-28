import type { Metadata } from "next";

import { Page } from "@/components/shell";
import {
  Hero,
  Opportunities,
} from "@/components/views/engagement/scholarships";

export const metadata: Metadata = {
  title: "Scholarships",
};

export default function Scholarships() {
  return (
    <Page>
      <Hero />
      <Opportunities />
      {/* Current Opportunities */}
      {/* Past Awardees */}
    </Page>
  );
}
