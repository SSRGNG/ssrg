"use client";

import { Edit2Icon, EyeClosedIcon, MoreHorizontal } from "lucide-react";

import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
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
import { ActionItem } from "@/types";

type Props = React.ComponentProps<typeof SidebarGroup> & {
  actions: ActionItem;
};

function Actions({ actions, className, ...props }: Props) {
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
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size={"sm"}>
                <a href={item.href}>
                  {item.icon && <Icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem asChild>
                    <a
                      href={item.href}
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          className: "w-full justify-start text-xs",
                        })
                      )}
                    >
                      <EyeClosedIcon className="text-muted-foreground" />
                      <span>{item.options?.view}</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {/* <CreateAction
                      type={item.title}
                      label={item.options.create}
                      isMobile={isMobile}
                    /> */}
                    <a
                      href={item.href}
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          className: "w-full justify-start text-xs",
                        })
                      )}
                    >
                      <Edit2Icon className="text-muted-foreground" />
                      <span>{item.options?.edit}</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { Actions };
