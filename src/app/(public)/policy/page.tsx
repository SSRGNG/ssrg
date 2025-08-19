import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Cards, Hero, QuickReferences } from "@/components/views/policy";

export const metadata: Metadata = {
  title: "Policy",
};

export default function Policy() {
  return (
    <Page>
      <Hero />
      {/* <Commitment /> */}
      <Cards />
      <QuickReferences />
    </Page>
  );
}
