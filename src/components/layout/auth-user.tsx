"use client";

import { LogOutIcon } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appConfig } from "@/config";
import { userNav } from "@/config/constants";
import { cn, isRoleAllowed } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button> & {
  user?: User;
};

function AuthUser({ user, className, ...props }: Props) {
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key) && (e.metaKey || e.ctrlKey)) {
        const key = e.key.toLowerCase();
        const item = userNav[key];
        if (item) {
          e.preventDefault();
          router.push(item.href);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <nav className={cn("hidden md:flex md:items-center")}>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:cursor-pointer" asChild>
            <Button
              size="icon"
              className={cn("size-8 rounded-lg ring-2 ring-ring", className)}
              {...props}
            >
              <UserAvatar user={user} className="rounded-lg" initials />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
          >
            <DropdownMenuLabel className="font-normal flex items-center gap-1 px-1 py-1.5 text-left text-sm">
              <UserAvatar user={user} inline />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {appConfig.userNav.slice(0, -1).map((item, index) => {
                if (isRoleAllowed(item.roles, user.role)) {
                  const { href, title, icon, cmd } = item;
                  const Icon = Icons[icon];
                  return (
                    <DropdownMenuItem
                      key={index}
                      asChild
                      className="hover:cursor-pointer"
                    >
                      <Link href={href}>
                        <Icon className="size-4" aria-hidden="true" />
                        {title}
                        <DropdownMenuShortcut>{cmd}</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  );
                }
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:cursor-pointer">
              <Link href={appConfig.auth.signout.href}>
                <LogOutIcon className="size-4" aria-hidden="true" />
                {appConfig.auth.signout.title}
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : // <Link
      //   href={appConfig.auth.signin.href}
      //   className={cn(
      //     "font-heading",
      //     buttonVariants({
      //       className:
      //         "font-semibold px-3 md:text-sm lg:text-base xl:text-lg",
      //     })
      //   )}
      // >
      //   Get Started
      //   <span className="sr-only">Get Started</span>
      // </Link>
      null}
    </nav>
  );
}

export { AuthUser };
