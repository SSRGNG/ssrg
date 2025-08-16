import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/engagement/funding";

export const metadata: Metadata = {
  title: "Funding",
};

export default function Funding() {
  return (
    <Page>
      <Hero />
      {/* Donate button / funding form */}
      {/* Acknowledgement of supporters */}
    </Page>
  );
}
