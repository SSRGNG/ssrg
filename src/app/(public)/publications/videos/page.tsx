import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Video Contents",
};

export default function Home() {
  return <Page>Video Contents</Page>;
}
