import type { User as AuthUser } from "next-auth";
import * as React from "react";

import { Credit } from "@/components/layout/sidebar/credit";
import { Secondary } from "@/components/layout/sidebar/secondary";
import { User } from "@/components/layout/sidebar/user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { appConfig } from "@/config";

function OnboardSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <User user={user} userNav={appConfig.userNav} />
      </SidebarHeader>
      <SidebarContent className="gap-1">
        <Secondary items={appConfig.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Credit />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { OnboardSidebar };
