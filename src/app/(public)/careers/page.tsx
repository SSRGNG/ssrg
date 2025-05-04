import type { Metadata } from "next";

import { CreateResearchArea } from "@/components/forms/create-research-area";
import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Careers",
};

export default function People() {
  return (
    <Page>
      <CreateResearchArea />
    </Page>
  );
}
