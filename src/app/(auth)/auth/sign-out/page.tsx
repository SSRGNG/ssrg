import type { Metadata } from "next";

import { Signout } from "@/components/auth/signout";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.auth.signout.title,
  description: appConfig.auth.signout.description,
};

export default function Page() {
  return <Signout />;
}
