import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Home() {
  return <Page>Projects</Page>;
}
