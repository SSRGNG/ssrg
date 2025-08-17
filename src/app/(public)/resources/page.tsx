import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Cards, Hero } from "@/components/views/resources";

export const metadata: Metadata = {
  title: "Resources",
};

export default function Resources() {
  return (
    <Page>
      <Hero />
      <Cards />
    </Page>
  );
}
