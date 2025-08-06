"use client";

import { AlertTriangle, Clock } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTeams } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & { teams: AdminTeams };

function Alerts({ teams, className, ...props }: Props) {
  const analytics = React.useMemo(() => {
    const highPriorityTeams = teams.filter(
      (t) => t.priority === "high" || t.priority === "critical"
    );
    const overBudgetTeams = teams.filter(
      (t) =>
        t.budgetTotal &&
        t.budgetUsed &&
        Number(t.budgetUsed) > Number(t.budgetTotal)
    );

    return {
      highPriorityTeams,
      overBudgetTeams,
    };
  }, [teams]);

  return analytics.overBudgetTeams.length > 0 ||
    analytics.highPriorityTeams.length > 0 ? (
    <div className={cn("grid gap-4 xs:grid-cols-2", className)} {...props}>
      {analytics.overBudgetTeams.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700">
              {analytics.overBudgetTeams.length} project
              {analytics.overBudgetTeams.length > 1 ? "s" : ""} over budget
            </p>
            <div className="mt-2 space-y-1">
              {analytics.overBudgetTeams.slice(0, 3).map((team) => (
                <div key={team.id} className="text-xs text-orange-600">
                  • {team.title}
                </div>
              ))}
              {analytics.overBudgetTeams.length > 3 && (
                <div className="text-xs text-orange-600">
                  ...and {analytics.overBudgetTeams.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {analytics.highPriorityTeams.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              High Priority Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">
              {analytics.highPriorityTeams.length} high/critical priority
              project{analytics.highPriorityTeams.length > 1 ? "s" : ""}
            </p>
            <div className="mt-2 space-y-1">
              {analytics.highPriorityTeams.slice(0, 3).map((team) => (
                <div
                  key={team.id}
                  className="text-xs text-red-600 flex items-center gap-1"
                >
                  • {team.title}
                  <Badge variant="destructive" className="text-xs ml-auto">
                    {team.priority}
                  </Badge>
                </div>
              ))}
              {analytics.highPriorityTeams.length > 3 && (
                <div className="text-xs text-red-600">
                  ...and {analytics.highPriorityTeams.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  ) : null;
}

export { Alerts };
