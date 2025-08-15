import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Framework, Hero } from "@/components/views/research/impacts";

export const metadata: Metadata = {
  title: "Impacts",
};

export default function Impacts() {
  return (
    <Page>
      <Hero />
      <Framework />
    </Page>
  );
}
