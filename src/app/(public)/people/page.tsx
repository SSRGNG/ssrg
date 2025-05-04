import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "People",
};

export default function People() {
  return <Page>People</Page>;
}
