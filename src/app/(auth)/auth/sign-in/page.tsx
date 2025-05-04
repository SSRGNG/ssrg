import type { Metadata } from "next";

import { Signin } from "@/components/auth/signin";
import { appConfig } from "@/config";

export const metadata: Metadata = {
  title: appConfig.auth.signin.title,
  description: appConfig.auth.signin.description,
};

export default function Page() {
  return <Signin />;
}
