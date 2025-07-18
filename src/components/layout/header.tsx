import * as React from "react";

import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  PublicationsFilterFallback,
  ViewModeFallback,
} from "@/components/shared/loading-skeleton";
import { Logo } from "@/components/shared/logo";
import { PublicationsCommand } from "@/components/shared/publications-command";
import { PublicationsFilter } from "@/components/shared/publications-filter";
import { ViewMode } from "@/components/shared/view-mode";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"header"> & {
  blur?: boolean;
  publications?: boolean;
};

function Header({ blur, publications, className, ...props }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background",
        className
      )}
      {...props}
    >
      <section className="container py-3 flex items-center gap-4 md:gap-2.5 lg:gap-6">
        <Logo />
        <MainNav items={appConfig.mainNav} blur={blur} />
        {publications ? (
          <div className="w-full flex items-center gap-2.5">
            <PublicationsCommand className="flex-1 md:flex-initial md:ml-auto lg:ml-0 lg:flex-1" />
            <React.Suspense fallback={<PublicationsFilterFallback />}>
              <PublicationsFilter />
            </React.Suspense>
            <React.Suspense fallback={<ViewModeFallback />}>
              <ViewMode />
            </React.Suspense>
          </div>
        ) : null}
        <MobileNav className="ml-auto" />
      </section>
    </header>
  );
}

export { Header };
