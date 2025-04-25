"use client";

import type { User as AuthUser } from "next-auth";
import Link from "next/link";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { UserAvatar } from "@/components/shared/user-avatar";
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { appConfig } from "@/config";
import { cn, isRoleAllowed } from "@/lib/utils";
import { UserNavItem } from "@/types";

type UserProps = React.ComponentPropsWithRef<typeof DropdownMenuTrigger> & {
  user: AuthUser;
  userNav: UserNavItem[];
};

const User = ({ user, userNav, className, ...props }: UserProps) => {
  const { isMobile } = useSidebar();

  const email = user.email;
  const name = user.name;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                className
              )}
              {...props}
            >
              <UserAvatar user={{ name, email, image: user.image }} inline />
              <Icons.updown className="size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={{ name, email, image: user.image }} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userNav.slice(0, -1).map((item, index) => {
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
                <Icons.signout className="size-4" aria-hidden="true" />
                {appConfig.auth.signout.title}
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { User };
