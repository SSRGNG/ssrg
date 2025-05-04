import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Featured } from "@/components/views/research/featured";
import { FocusAreas } from "@/components/views/research/focus-areas";
import { Framework } from "@/components/views/research/framework";
import { GetInvolved } from "@/components/views/research/get-involved";
import { Hero } from "@/components/views/research/hero";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: "Research",
  description: appConfig.description,
};

export default function Research() {
  return (
    <Page>
      <Hero />
      <FocusAreas />
      <Featured />
      <Framework />
      <GetInvolved />
    </Page>
  );
}
