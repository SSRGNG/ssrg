import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Contents, Hero } from "@/components/views/policy/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Privacy() {
  return (
    <Page>
      <Hero />
      <Contents />
    </Page>
  );
}
