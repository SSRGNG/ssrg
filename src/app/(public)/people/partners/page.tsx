import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Partners",
};

export default function Home() {
  return <Page>Partners</Page>;
}
