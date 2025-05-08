import type { Metadata } from "next";
import * as React from "react";

import { Page } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedResearchAreas } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Core Features`,
};

export default async function Admin() {
  const areas = await getCachedResearchAreas();

  // console.log({ areas });
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page variant={"portal"}>
        {areas.length !== 0 && (
          <Card className={cn("gap-3.5")}>
            <CardHeader className={cn("gap-0")}>
              <CardTitle>Research Areas</CardTitle>
            </CardHeader>
            <CardContent
              className={cn("grid gap-4 xs:grid-cols-2 md:grid-cols-3")}
            >
              {areas.map((area, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <h4>{area?.title}</h4>
                  <p className="line-clamp-3 my-2.5 text-muted-foreground text-sm">
                    {area?.description}
                  </p>
                  <Button variant={"secondary"} disabled size={"sm"}>
                    Edit
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </Page>
    </React.Suspense>
  );
}
