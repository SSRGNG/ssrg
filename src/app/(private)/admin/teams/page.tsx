import type { Metadata } from "next";

import { Icons } from "@/components/shared/icons";
import { Shell } from "@/components/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alerts } from "@/components/views/admin/teams/alerts";
import { Collaborators } from "@/components/views/admin/teams/collaborators";
import { Network } from "@/components/views/admin/teams/network";
import { Stats } from "@/components/views/admin/teams/stats";
import { TeamsDataTable } from "@/components/views/admin/ui-tables/teams-data-table";
import {
  getAllProjectTeams,
  getTeamCollaborationInsights,
} from "@/lib/queries/teams";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Admin Team Management`,
  description: "Manage research project teams and collaboration",
};

const available_tabs = [
  { title: "teams", label: "Project Teams", icon: "team" as Icons },
  {
    title: "collaborators",
    label: "Top Collaborators",
    icon: "people" as Icons,
  },
  {
    title: "network",
    label: "Collaboration Network",
    icon: "collaborate" as Icons,
  },
];

export default async function TeamManagement() {
  const [teams, insights] = await Promise.all([
    getAllProjectTeams(),
    getTeamCollaborationInsights(),
  ]);
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <Stats teams={teams} />
      <Alerts teams={teams} />
      <Tabs defaultValue={available_tabs[0].title}>
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          {available_tabs.map((tab) => {
            const Icon = Icons[tab.icon];
            return (
              <TabsTrigger key={tab.title} value={tab.title} className="group">
                <Icon strokeWidth={1.5} />
                <span className="hidden group-data-[state=active]:inline md:inline">
                  {tab.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <TeamsDataTable teams={teams} pageSizeOptions={[5, 10, 15, 20]} />
        </TabsContent>

        <Collaborators
          value="collaborators"
          collaborators={insights.collaborators}
        />
        <Network value="network" network={insights.collaborationPatterns} />
      </Tabs>
    </Shell>
  );
}
