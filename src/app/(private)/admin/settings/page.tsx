import type { Metadata } from "next";

import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: `Admin Settings`,
};

export default function Settings() {
  return (
    <Shell variant={"portal"} className="space-y-4">
      Settings
    </Shell>
  );
}
