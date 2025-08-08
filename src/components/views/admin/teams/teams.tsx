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
      <Stats teams={teams} />
      <Alerts teams={teams} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="teams">
        <TabsList className="flex flex-wrap justify-start gap-1.5 w-full">
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
