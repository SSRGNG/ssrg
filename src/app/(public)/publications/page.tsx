import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Publications",
};

export default function Home() {
  return <Page>Publications</Page>;
}
