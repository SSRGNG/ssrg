import type { Metadata } from "next";

import { Shell } from "@/components/shell";
import { InvalidateTags } from "@/components/views/admin/settings/invalidate-tags";

export const metadata: Metadata = {
  title: `Admin Settings`,
};

export default function Settings() {
  return (
    <Shell variant={"portal"} className="space-y-4">
      <InvalidateTags />
    </Shell>
  );
}
