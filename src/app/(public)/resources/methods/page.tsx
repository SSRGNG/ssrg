import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/resources/methods";

export const metadata: Metadata = {
  title: "Methodologies",
};

export default function Methodologies() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
