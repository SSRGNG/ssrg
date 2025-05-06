import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";

export const metadata: Metadata = {
  title: `Admin`,
};

export default function Admin() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page variant={"portal"}>
        <h2>Admin</h2>
      </Page>
    </React.Suspense>
  );
}
