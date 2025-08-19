import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Contents, Hero } from "@/components/views/policy/data-protection";

export const metadata: Metadata = {
  title: "Data Protection",
};

export default function DataProtection() {
  return (
    <Page>
      <Hero />
      <Contents />
    </Page>
  );
}
