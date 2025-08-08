import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
import { Shell } from "@/components/shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResearchAreas,
  ResearchFrameworks,
  ResearchMethodologies,
} from "@/components/views/admin/core";
import {
  getCachedAdminResearchAreas,
  getCachedResearchFrameworks,
  getCachedResearchMethodologies,
} from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: `Core Features`,
};

const core_features = [
  { title: "Research Areas", icon: "focusAreas" as Icons },
  { title: "Frameworks", icon: "ethics" as Icons },
  { title: "Methodologies", icon: "methods" as Icons },
  // { title: "Projects", icon: "projects" as Icons },
];
export default async function CoreFeatures() {
  const areas = await getCachedAdminResearchAreas();
  const frameworks = await getCachedResearchFrameworks();
  const methodologies = await getCachedResearchMethodologies();
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
        <ResearchAreas areas={areas} value={core_features[0].title} />
        <ResearchFrameworks
          frameworks={frameworks}
          value={core_features[1].title}
        />
        <ResearchMethodologies
          methodologies={methodologies}
          value={core_features[2].title}
        />
        {/* <React.Suspense fallback={<p>Loading projects</p>}>
          <Projects value={core_features[3].title} />
        </React.Suspense> */}
      </Tabs>
    </Shell>
  );
}
