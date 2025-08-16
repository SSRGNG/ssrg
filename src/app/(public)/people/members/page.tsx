import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/people/members";

export const metadata: Metadata = {
  title: "Members",
};

export default function Members() {
  return (
    <Page>
      <Hero />
    </Page>
  );
}
