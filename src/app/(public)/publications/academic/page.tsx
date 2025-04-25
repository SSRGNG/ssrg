import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Academic Publications",
};

export default function Home() {
  return <Page>Academic Publications</Page>;
}
