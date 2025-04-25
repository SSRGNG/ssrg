import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Impacts",
};

export default function Home() {
  return <Page>Impacts</Page>;
}
