"use client";

import { PanelRightDashed } from "lucide-react";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import * as React from "react";

import { MainNav, UserNav } from "@/components/layout/mobile";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { appConfig } from "@/config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type MobileNavProps = React.ComponentProps<typeof SheetTrigger> & {
  user?: User;
};

function MobileNav({ user, ...props }: MobileNavProps) {
  const isSmallScreen = useMediaQuery("(max-width: 475px)");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const items = appConfig.mainNav;
  const userItems = appConfig.userNav;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="hover:cursor-pointer" asChild {...props}>
        <Button
          size="icon"
          className={cn(
            "size-8 rounded-sm md:hidden bg-brand",
            user ? "ring-2 ring-ring" : "rounded-md"
          )}
        >
          {user ? (
            <UserAvatar user={user} className="rounded-lg" />
          ) : (
            <PanelRightDashed className="size-8" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isSmallScreen ? "top" : "right"}
        className={cn(
          "gap-0",
          isSmallScreen
            ? "[&>button]:ring-2 [&>button]:top-7"
            : "[&>button]:hidden"
        )}
      >
        <SheetHeader className="px-2">
          <SheetTitle>
            <UserNav
              items={userItems}
              user={user}
              pathname={pathname}
              setIsOpen={setIsOpen}
              className={cn(isSmallScreen && "has-[>svg]:pr-8")}
            />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4.5rem)] h-[calc(100svh-4.5rem)] px-2">
          <MainNav items={items} pathname={pathname} setIsOpen={setIsOpen} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
