import type { Metadata } from "next";

import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: `Admin`,
};

export default function Admin() {
  return (
    <Shell variant={"portal"}>
      <h2>Admin</h2>
    </Shell>
  );
}
