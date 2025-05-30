"use client";

import { User } from "next-auth";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn, isRoleAllowed } from "@/lib/utils";
import { AppNavItem } from "@/types";

// Helper function to check if a path exactly matches
const isExactMatch = (itemPath: string, currentPath: string) => {
  return currentPath === itemPath;
};

// Helper function to check if current path is a child of the given path
const isChildPath = (parentPath: string, currentPath: string) => {
  return currentPath.startsWith(`${parentPath}/`) && parentPath !== currentPath;
};

// Helper function to process nav items and set active state
const processNavItems = (
  items: AppNavItem[],
  currentPath: string
): AppNavItem[] => {
  return items.map((item) => ({
    ...item,
    // Only mark as active if it's an exact match
    isActive: isExactMatch(item.href, currentPath),
    // Mark as expanded if current path is a child
    isExpanded: isChildPath(item.href, currentPath),
    items: item.items.map((subItem) => ({
      ...subItem,
      // Only mark subitem as active if it's an exact match
      isActive: isExactMatch(subItem.href, currentPath),
    })),
  }));
};

type Props = React.ComponentProps<typeof SidebarGroup> & {
  items: AppNavItem[];
  user: User;
};

function Main({ items, user, ...props }: Props) {
  const pathname = usePathname();

  // Process nav items with current path to set active states
  const processedNavMain = React.useMemo(
    () => processNavItems(items, pathname),
    [items, pathname]
  );

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>Portal</SidebarGroupLabel>
      <SidebarMenu>
        {processedNavMain.map((item) => {
          if (isRoleAllowed(item.roles, user.role)) {
            const Icon = Icons[item.icon];
            return item.items.length === 0 ? (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    item.isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <a href={item.href}>
                    <Icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isExpanded}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        item.isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      {item.icon && <Icon />}
                      <span>{item.title}</span>
                      <Icons.right className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const SubIcon = Icons[subItem.icon];
                        return (
                          isRoleAllowed(subItem.roles, user.role) && (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  subItem.isActive &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                              >
                                <a href={subItem.href}>
                                  <SubIcon />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { Main };
