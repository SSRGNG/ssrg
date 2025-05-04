import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Featured } from "@/components/views/people/team/featured";

export const metadata: Metadata = {
  title: "Research Team",
};

export default function Team() {
  return (
    <Page>
      <Featured />
    </Page>
  );
}
