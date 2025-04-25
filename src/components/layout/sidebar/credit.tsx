"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { Separator } from "@/components/ui/separator";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { appConfig } from "@/config";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof SidebarMenu>;

function Credit({ className, ...props }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const year = new Date().getFullYear();
  return (
    <SidebarMenu
      className={cn(
        "flex-row group-data-[collapsible=icon]:flex-col",
        className
      )}
      {...props}
    >
      <SidebarMenuItem className="w-full">
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="truncate text-xs">&copy; {year}</span>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <span className="truncate font-semibold">{appConfig.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={"Theme"}
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        >
          <Icons.sun
            className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            aria-hidden="true"
          />
          <Icons.moon
            className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle theme</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { Credit };
