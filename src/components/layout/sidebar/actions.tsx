"use client";

import { GitBranchPlus, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

import { CreateActions } from "@/components/shared/create-actions";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ActionItem, ActionKey } from "@/types";

type Props = React.ComponentProps<typeof SidebarGroup> & {
  actions: ActionItem;
};

function Actions({ actions, className, ...props }: Props) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    >
      <SidebarGroupLabel>{actions.title}</SidebarGroupLabel>
      <SidebarMenu>
        {actions.items.map((item) => {
          const Icon = Icons[item.icon];
          // Get the option keys for this item
          const optionKeys = item.options
            ? (Object.keys(item.options) as ActionKey[])
            : [];

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size={"sm"}
                className={cn(
                  item.href === pathname &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <a href={item.href}>
                  {item.icon && <Icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {optionKeys.length > 0 && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    {optionKeys.map((key) => (
                      <DropdownMenuItem asChild key={key}>
                        <CreateActions
                          actionKey={key}
                          isMobile={isMobile}
                          label={item.options[key]}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full justify-start text-xs"
                          >
                            <GitBranchPlus className="text-muted-foreground" />
                            {item.options[key] || key}
                          </Button>
                        </CreateActions>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { Actions };
