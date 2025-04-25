import * as React from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCachedSession } from "@/lib/queries/auth";

export default async function PublicLayout({
  children,
}: React.PropsWithChildren) {
  const session = await getCachedSession();
  return (
    <React.Fragment>
      <Header user={session?.user} />
      {children}
      <Footer />
    </React.Fragment>
  );
}
