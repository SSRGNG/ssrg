import * as React from "react";

import { Icons } from "@/components/shared/icons";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SocialItem } from "@/types";

type Props = React.ComponentProps<typeof SidebarGroup> & {
  items: Required<SocialItem>[];
};

function Secondary({ items, className, ...props }: Props) {
  return (
    <SidebarGroup
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    >
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = Icons[item.icon];
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size={"sm"}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { Secondary };
