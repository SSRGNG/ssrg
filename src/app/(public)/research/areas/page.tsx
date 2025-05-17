import type { Metadata } from "next";

import { Page } from "@/components/shell";
import {
  Collaborations,
  Hero,
  Integration,
} from "@/components/views/research/areas";

export const metadata: Metadata = {
  title: "Research Areas",
};

export default function Areas() {
  return (
    <Page>
      <Hero />
      <Integration />
      <Collaborations />
    </Page>
  );
}
