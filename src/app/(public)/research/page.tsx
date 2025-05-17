import type { Metadata } from "next";

import { Page } from "@/components/shell";
import {
  Featured,
  FocusAreas,
  Framework,
  GetInvolved,
  Hero,
} from "@/components/views/research";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: "Research",
  description: appConfig.description,
};

export default function Research() {
  return (
    <Page>
      <Hero />
      <FocusAreas />
      <Featured />
      <Framework />
      <GetInvolved />
    </Page>
  );
}
