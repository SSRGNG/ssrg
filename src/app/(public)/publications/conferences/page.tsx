import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Conferences",
};

export default function Home() {
  return <Page>Conferences</Page>;
}
