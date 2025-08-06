import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
import { Shell } from "@/components/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: `Admin Settings`,
};

const core_features = [
  { title: "Research Areas", icon: "focusAreas" as Icons },
  { title: "Frameworks", icon: "ethics" as Icons },
  { title: "Methodologies", icon: "methods" as Icons },
  // { title: "Projects", icon: "projects" as Icons },
];

export default function Settings() {
  return (
    <Shell variant={"portal"} className="space-y-4">
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
        <TabsContent value={core_features[0].title}>
          Research Framework
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
