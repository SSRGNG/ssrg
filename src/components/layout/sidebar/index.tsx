import type { User as AuthUser } from "next-auth";
import * as React from "react";

import { Actions } from "@/components/layout/sidebar/actions";
import { Credit } from "@/components/layout/sidebar/credit";
import { Main } from "@/components/layout/sidebar/main";
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
import { isRoleAllowed } from "@/lib/utils";

function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <User user={user} userNav={appConfig.userNav} />
      </SidebarHeader>
      <SidebarContent className="gap-1">
        <Main items={appConfig.appNav} user={user} />
        {isRoleAllowed(["admin"], user.role) ? (
          <Actions actions={appConfig.actions} />
        ) : null}
        <Secondary items={appConfig.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Credit />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
