import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { AdminTeamCollaborators } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  collaborators: AdminTeamCollaborators["collaborators"];
};

function Collaborators({ collaborators, className, ...props }: Props) {
  return (
    <TabsContent className={cn("space-y-4", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Most Active Collaborators</CardTitle>
          <CardDescription>
            Researchers with the highest project participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborators.slice(0, 10).map((collaborator, idx) => (
              <div
                key={collaborator.researcherId}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{idx + 1}
                  </span>
                </div>
                <UserAvatar
                  className="size-10"
                  user={{ image: collaborator.image, name: collaborator.name }}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{collaborator.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {collaborator.title}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {collaborator.projectCount} projects
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {collaborator.activeProjectCount} active
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${collaborator.totalBudgetInvolved.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">budget</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export { Collaborators };
