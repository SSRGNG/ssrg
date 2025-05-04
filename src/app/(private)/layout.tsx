import { redirect } from "next/navigation";
import * as React from "react";

import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/sidebar/header";
// import { Crumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { appConfig } from "@/config";
import { getCachedSession } from "@/lib/queries/auth";

export default async function PrivateLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getCachedSession();
  const user = session?.user;
  if (!user) redirect(appConfig.auth.signin.href);

  console.log({ user });

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 -ml-1.5"
          />
          {/* <Crumb appItems={appConfig.appNav} settings={appConfig.actions} /> */}
        </Header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
