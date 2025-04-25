import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "People",
};

export default function Home() {
  return <Page>People</Page>;
}
