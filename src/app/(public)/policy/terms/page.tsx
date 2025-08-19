import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Contents, Hero } from "@/components/views/policy/terms";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function Terms() {
  return (
    <Page>
      <Hero />
      <Contents />
    </Page>
  );
}
