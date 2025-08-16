import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Ethics as Comp, Hero } from "@/components/views/about/ethics";

export const metadata: Metadata = {
  title: "Ethics",
};

export default function Ethics() {
  return (
    <Page>
      <Hero />
      <Comp />
    </Page>
  );
}
