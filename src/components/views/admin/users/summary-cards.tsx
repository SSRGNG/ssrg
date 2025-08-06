"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdminUsers } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { Building, Crown, GraduationCap, Users } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  admin: "#8b5cf6",
  researcher: "#06b6d4",
  affiliate: "#10b981",
  partner: "#f59e0b",
  member: "#ef4444",
};
type CTs = keyof typeof COLORS;
type Props = React.ComponentPropsWithoutRef<"div"> & { users: AdminUsers };

function SummaryCards({ users, className, ...props }: Props) {
  const stats = React.useMemo(() => {
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<CTs, number>);

    const researchersCount = users.filter((u) => u.researcherId).length;
    const totalPublications = users.reduce(
      (sum, u) => sum + (u.publicationCount || 0),
      0
    );
    const totalVideos = users.reduce((sum, u) => sum + (u.videoCount || 0), 0);
    const totalProjects = users.reduce(
      (sum, u) => sum + (u.projectCount || 0),
      0
    );

    return {
      total: users.length,
      researchers: researchersCount,
      admins: roleStats.admin || 0,
      affiliates: roleStats.affiliate || 0,
      partners: roleStats.partner || 0,
      members: roleStats.member || 0,
      totalPublications,
      totalVideos,
      totalProjects,
      roleStats,
    };
  }, [users]);

  const roleChartData = Object.entries(stats.roleStats).map(
    ([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
      fill: COLORS[role as CTs],
    })
  );

  const contentChartData = [
    { name: "Publications", value: stats.totalPublications, fill: "#8b5cf6" },
    { name: "Videos", value: stats.totalVideos, fill: "#06b6d4" },
    { name: "Projects", value: stats.totalProjects, fill: "#10b981" },
  ];

  const researcherProgressData = [
    {
      name: "Active Researchers",
      value: (stats.researchers / stats.total) * 100,
      fill: "#06b6d4",
    },
  ];

  const chartConfig = {
    count: {
      label: "Count",
    },
    admin: {
      label: "Admin",
      color: "#8b5cf6",
    },
    researcher: {
      label: "Researcher",
      color: "#06b6d4",
    },
    affiliate: {
      label: "Affiliate",
      color: "#10b981",
    },
    partner: {
      label: "Partner",
      color: "#f59e0b",
    },
    member: {
      label: "Member",
      color: "#ef4444",
    },
  };

  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 md:grid-cols-4", className)}
      {...props}
    >
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <CardDescription>
              {stats.researchers} active researchers
            </CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{stats.total}</div>
          <ChartContainer config={chartConfig} className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={researcherProgressData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#06b6d4" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {Math.round((stats.researchers / stats.total) * 100)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Role Distribution
            </CardTitle>
            <CardDescription>User roles breakdown</CardDescription>
          </div>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            {Object.keys(stats.roleStats).length} Roles
          </div>
          <ChartContainer config={chartConfig} className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Content Analytics
            </CardTitle>
            <CardDescription>Publications, videos & projects</CardDescription>
          </div>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            {stats.totalPublications + stats.totalVideos + stats.totalProjects}
          </div>
          <ChartContainer config={chartConfig} className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contentChartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Partnership Overview
            </CardTitle>
            <CardDescription>Partners and general members</CardDescription>
          </div>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{stats.partners}</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Partners</span>
              <span className="font-medium">{stats.partners}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Members</span>
              <span className="font-medium">{stats.members}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Affiliates</span>
              <span className="font-medium">{stats.affiliates}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (stats.partners /
                      (stats.partners + stats.members + stats.affiliates)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export { SummaryCards };
