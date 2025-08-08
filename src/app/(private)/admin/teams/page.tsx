import type { Metadata } from "next";

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

export default async function TeamManagement() {
  const [teams, insights] = await Promise.all([
    getAllProjectTeams(),
    getTeamCollaborationInsights(),
  ]);
  return (
    <Shell variant={"portal"} className={cn("space-y-4")}>
      <Stats teams={teams} />
      <Alerts teams={teams} />
      <Tabs defaultValue="teams">
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
          <TabsTrigger value="teams">Project Teams</TabsTrigger>
          <TabsTrigger value="collaborators">Top Collaborators</TabsTrigger>
          <TabsTrigger value="network">Collaboration Network</TabsTrigger>
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
