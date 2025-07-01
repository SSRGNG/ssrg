import type { Metadata } from "next";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: "Video Contents",
};

export default function Video() {
  return (
    <Page
      variant={"publications"}
      className="content-center justify-center text-center"
    >
      <h1 className="text-lg">Video Contents</h1>
      <small>There are no video contents yet</small>
    </Page>
  );
}
