import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type Props = React.ComponentPropsWithoutRef<"div">;

async function Teams({ className, ...props }: Props) {
  const [teams, insights] = await Promise.all([
    getAllProjectTeams(),
    getTeamCollaborationInsights(),
  ]);

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Project Teams</h1>
          <p className="text-muted-foreground">
            Manage research project teams and collaboration
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <Stats teams={teams} />
      <Alerts teams={teams} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">Project Teams</TabsTrigger>
          <TabsTrigger value="collaborators">Top Collaborators</TabsTrigger>
          <TabsTrigger value="network">Collaboration Network</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          <TeamsDataTable teams={teams} />
        </TabsContent>

        <Collaborators
          value="collaborators"
          collaborators={insights.collaborators}
        />
        <Network value="network" network={insights.collaborationPatterns} />
      </Tabs>
    </div>
  );
}

export { Teams };
