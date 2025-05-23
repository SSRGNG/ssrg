import type { Metadata } from "next";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { Shell } from "@/components/shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchAreas } from "@/components/views/admin/core";

export const metadata: Metadata = {
  title: `Core Features`,
};

const core_features = [
  { title: "Research Areas", icon: "focusAreas" as Icons },
  { title: "Frameworks", icon: "ethics" as Icons },
  { title: "Methodologies", icon: "methods" as Icons },
  { title: "Projects", icon: "projects" as Icons },
];
export default function Admin() {
  return (
    <Shell variant={"portal"}>
      <Tabs defaultValue={core_features[0].title}>
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {core_features.map((framework) => {
            const Icon = Icons[framework.icon];
            return (
              <TabsTrigger
                key={framework.title}
                value={framework.title}
                className="group"
              >
                <Icon strokeWidth={1.5} />
                <span className="hidden group-data-[state=active]:inline md:inline">
                  {framework.title}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <React.Suspense fallback={<p>Loading research areas</p>}>
          <ResearchAreas value={core_features[0].title} />
        </React.Suspense>
      </Tabs>
    </Shell>
  );
}
