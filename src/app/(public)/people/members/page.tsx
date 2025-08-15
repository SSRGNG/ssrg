import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Members",
};

export default function Members() {
  return (
    <Page className="grid content-center justify-center text-center space-y-4 md:space-y-4">
      <h1 className="text-lg">Members</h1>
      <small>
        Upload in progress, this page will be updated, hopefully, soon
      </small>
    </Page>
  );
}
