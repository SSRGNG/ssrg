import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/resources/guides";

export const metadata: Metadata = {
  title: "Field Guides",
};

export default function FieldGuides() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
