"use client";

import { DollarSign, LucideProps, TrendingUp, Users } from "lucide-react";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminTeams } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & { teams: AdminTeams };

function Stats({ teams, className, ...props }: Props) {
  const analytics = React.useMemo(() => {
    const totalTeams = teams.length;
    const activeTeams = teams.filter((t) => t.status === "active").length;
    const completedTeams = teams.filter((t) => t.status === "completed").length;
    const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);
    const totalActiveMembers = teams.reduce(
      (sum, team) => sum + team.activeMemberCount,
      0
    );
    const totalBudget = teams.reduce(
      (sum, team) => sum + (Number(team.budgetTotal) || 0),
      0
    );
    const totalBudgetUsed = teams.reduce(
      (sum, team) => sum + (Number(team.budgetUsed) || 0),
      0
    );
    const avgProgress =
      teams.length > 0
        ? teams.reduce((sum, team) => sum + team.progressPercentage, 0) /
          teams.length
        : 0;

    const highPriorityTeams = teams.filter(
      (t) => t.priority === "high" || t.priority === "critical"
    );

    return {
      totalTeams,
      activeTeams,
      completedTeams,
      totalMembers,
      totalActiveMembers,
      totalBudget,
      totalBudgetUsed,
      avgProgress,
      highPriorityTeams,
    };
  }, [teams]);

  const stats = [
    {
      title: "Total Teams",
      count: analytics.totalTeams,
      description: `${analytics.activeTeams} active, ${analytics.completedTeams} completed`,
      icon: Users,
    },
    {
      title: "Team Members",
      count: analytics.totalActiveMembers,
      description: `${analytics.totalMembers} total members across all teams`,
      icon: TrendingUp,
    },
    {
      title: "Total Budget",
      count: analytics.totalBudget.toLocaleString(),
      description: `${analytics.totalBudgetUsed.toLocaleString()} used 
                  (${
                    analytics.totalBudget > 0
                      ? (
                          (analytics.totalBudgetUsed / analytics.totalBudget) *
                          100
                        ).toFixed(0)
                      : 0
                  }%)`,
      icon: DollarSign,
    },
    {
      title: "Avg Progress",
      count: `${analytics.avgProgress.toFixed(0)}%`,
      description: `${analytics.highPriorityTeams.length} high priority teams`,
      icon: DollarSign,
    },
  ];

  return (
    <div
      className={cn("grid gap-4 xs:grid-cols-2 md:grid-cols-4", className)}
      {...props}
    >
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          title={stat.title}
          count={stat.count}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  count,
  icon: Icon,
  description,
}: {
  title: string;
  count: string | number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export { Stats };
