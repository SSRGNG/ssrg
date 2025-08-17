import type { Metadata } from "next";

import { Page } from "@/components/shell";
import {
  Hero,
  JoinResearchNetwork,
} from "@/components/views/engagement/collaborate";

export const metadata: Metadata = {
  title: "Collaborate",
};

export default function Collaborate() {
  return (
    <Page>
      <Hero />
      <JoinResearchNetwork />
    </Page>
  );
}
