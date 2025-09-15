import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Test Page",
};

export default function Home() {
  return <Page></Page>;
}
