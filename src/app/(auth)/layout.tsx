import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
import { Logo } from "@/components/shared/logo";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: appConfig.auth.title,
  description: appConfig.auth.description,
};
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid min-h-svh lg:grid-cols-2")}>
      <main className={cn("flex flex-col gap-4 p-4 sm:p-6 md:p-10")}>
        <Logo href={"/"} className="mx-auto md:mx-0" />
        <div className="flex-1 grid content-center">{children}</div>
      </main>
      <aside className="relative hidden bg-background lg:block">
        <Icons.placeholder
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-primary/40"
        />
      </aside>
    </div>
  );
}
