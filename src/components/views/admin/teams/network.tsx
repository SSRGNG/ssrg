import { Badge } from "@/components/ui/badge";
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
import { NetworkIcon } from "lucide-react";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  network: AdminTeamCollaborators["collaborationPatterns"];
};

function Network({ network, className, ...props }: Props) {
  return (
    <TabsContent className={cn("space-y-4", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Patterns</CardTitle>
          <CardDescription>
            Researchers who frequently work together on multiple projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {network.slice(0, 15).map((pattern, index) => (
              <div
                key={`${pattern.researcher1Id}-${pattern.researcher2Id}`}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="flex-shrink-0 w-6 text-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-medium">{pattern.researcher1Name}</div>
                  <div className="text-muted-foreground">
                    <NetworkIcon className="w-4 h-4" />
                  </div>
                  <div className="font-medium">{pattern.researcher2Name}</div>
                </div>
                <Badge variant="secondary">
                  {pattern.sharedProjects} shared project
                  {pattern.sharedProjects > 1 ? "s" : ""}
                </Badge>
              </div>
            ))}
            {network.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <NetworkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No collaboration patterns found</p>
                <p className="text-sm">
                  Researchers haven&apos;t worked together on multiple projects
                  yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export { Network };
