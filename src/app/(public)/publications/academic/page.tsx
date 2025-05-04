import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Academic Publications",
};

export default function Academic() {
  return <Page>Academic Publications</Page>;
}
