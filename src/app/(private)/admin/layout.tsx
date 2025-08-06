import { redirect } from "next/navigation";
import * as React from "react";

import { appConfig } from "@/config";
import { getCachedSession } from "@/lib/queries/auth";

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const role = (await getCachedSession())?.user.role;
  if (role !== "admin") redirect(appConfig.entry.href);

  return children;
}
