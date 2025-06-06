import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: `Portal`,
};

export default function Portal() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page variant={"portal"}>
        <h2>Portal</h2>
      </Page>
    </React.Suspense>
  );
}
