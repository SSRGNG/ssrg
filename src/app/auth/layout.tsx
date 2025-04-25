import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
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
    <div
      className={cn(
        "flex min-h-screen min-h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-10"
      )}
    >
      <main
        className={cn(
          "w-full max-w-sm md:max-w-3xl grid md:grid-cols-2 rounded-lg bg-card border shadow overflow-hidden"
        )}
      >
        {children}
        <aside className="relative hidden bg-background md:block">
          <Icons.placeholder
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full text-primary/40"
          />
        </aside>
      </main>
    </div>
  );
}
