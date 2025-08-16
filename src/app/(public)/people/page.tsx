import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/people";

export const metadata: Metadata = {
  title: "People",
};

export default function People() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
