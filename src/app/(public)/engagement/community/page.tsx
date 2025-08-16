import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/engagement/community";

export const metadata: Metadata = {
  title: "Community",
};

export default function Community() {
  return (
    <Page>
      <Hero />
      {/* Upcoming Events (queried from DB) */}
      {/* Past Highlights (photos, videos, reports) */}
    </Page>
  );
}
