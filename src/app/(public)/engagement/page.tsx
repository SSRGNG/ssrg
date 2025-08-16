import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/engagement";

export const metadata: Metadata = {
  title: "Engagement",
};

export default function Engagement() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
