import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/resources/tools";

export const metadata: Metadata = {
  title: "Data Tools",
};

export default function DataTools() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
