import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Members",
};

export default function Home() {
  return <Page>Members</Page>;
}
