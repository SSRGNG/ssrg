"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AdminUsers } from "@/lib/actions/queries";
import { createChartConfig, createChartData } from "@/lib/chart-utils";
import { cn } from "@/lib/utils";
import { Building, Crown, GraduationCap, Users } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  Label,
  Pie,
  PieChart,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
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
  // console.log({ users });

  const stats = React.useMemo(() => {
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<CTs, number>);

    // Only count users who have researcher records (actual researchers)
    const activeResearchers = users.filter((u) => u.researcherId);
    const researchersCount = activeResearchers.length;

    // Calculate research metrics only for active researchers
    const totalPublications = activeResearchers.reduce(
      (sum, u) => sum + Number(u.publicationCount || 0),
      0
    );
    const totalVideos = activeResearchers.reduce(
      (sum, u) => sum + Number(u.videoCount || 0),
      0
    );
    const totalProjects = activeResearchers.reduce(
      (sum, u) => sum + Number(u.projectCount || 0),
      0
    );

    // Calculate research productivity metrics
    const avgPublicationsPerResearcher =
      researchersCount > 0 ? totalPublications / researchersCount : 0;

    const productiveResearchers = activeResearchers.filter(
      (u) =>
        Number(u.publicationCount || 0) +
          Number(u.videoCount || 0) +
          Number(u.projectCount || 0) >
        0
    ).length;

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
      avgPublicationsPerResearcher,
      productiveResearchers,
      roleStats,
    };
  }, [users]);

  const roleData = Object.entries(stats.roleStats).map(([role, count]) => ({
    role,
    count,
  }));
  const roleChartData = createChartData(
    roleData,
    (role) => role.role,
    (role) => role.count,
    { dataKey: "count", nameKey: "role" }
  );

  const roleChartConfig = createChartConfig(roleData, (role) => role.role, {
    includeDataKeyConfig: true,
    dataKey: "count",
    dataKeyLabel: "Count",
    colorMode: "direct",
    palette: "vibrant",
  });
  // const roleChartData = Object.entries(stats.roleStats).map(
  //   ([role, count]) => ({
  //     role: role.charAt(0).toUpperCase() + role.slice(1),
  //     count,
  //     fill: COLORS[role as CTs],
  //   })
  // );

  // Research productivity breakdown (only for researchers)
  const researchData = [
    { name: "Publications", value: stats.totalPublications },
    { name: "Videos", value: stats.totalVideos },
    { name: "Projects", value: stats.totalProjects },
  ];

  const researchChartData = createChartData(
    researchData,
    (research) => research.name,
    (research) => research.value,
    { dataKey: "value", nameKey: "name" }
  );
  const researchChartConfig = createChartConfig(
    researchData,
    (research) => research.name,
    {
      includeDataKeyConfig: true,
      dataKey: "value",
      dataKeyLabel: "Value",
    }
  );

  const activityChartData = [
    {
      name: "active-researchers",
      value:
        stats.researchers > 0
          ? (stats.productiveResearchers / stats.researchers) * 100
          : 0,
      total: 100,
      fill: "var(--color-active-researchers)",
    },
    {
      name: "research-coverage",
      value: stats.total > 0 ? (stats.researchers / stats.total) * 100 : 0,
      total: 100,
      fill: "var(--color-research-coverage)",
    },
  ];
  const activityChartConfig = {
    value: {
      label: "Percentage",
    },
    "active-researchers": {
      label: "Active Researchers",
      color: "var(--chart-1)",
    },
    "research-coverage": {
      label: "Research Coverage",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const communityData = [
    { name: "Partners", value: stats.partners },
    { name: "Affiliates", value: stats.affiliates },
    { name: "Members", value: stats.members },
  ].filter((item) => item.value > 0); // Only show categories with data

  const communityChartData = createChartData(
    communityData,
    (community) => community.name,
    (community) => community.value,
    { dataKey: "value", nameKey: "name" }
  );
  const communityChartConfig = createChartConfig(
    communityData,
    (community) => community.name,
    {
      includeDataKeyConfig: true,
      dataKey: "value",
      dataKeyLabel: "Count",
    }
  );

  // console.log({ communityChartData });
  // console.log({ communityChartConfig });

  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      {...props}
    >
      {/* Total Users Overview */}
      <Card className="gap-2.5">
        <CardHeader>
          <CardTitle className="text-sm font-medium">User Activity</CardTitle>
          <CardDescription>
            {stats.productiveResearchers}/{stats.researchers} researchers active
          </CardDescription>
          <CardAction>
            <Users className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={activityChartConfig}
            className="mx-auto aspect-square w-full max-h-[250px]"
          >
            <RadialBarChart
              data={activityChartData}
              innerRadius={30}
              outerRadius={70}
              barSize={15}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[62, 50]}
              />
              <RadialBar dataKey="value" background cornerRadius={5} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={cn("fill-primary text-lg font-bold")}
                          >
                            {stats.total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-muted-foreground font-bold"
                          >
                            Total Users
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="flex-wrap gap-2.5 gap-y-0.5 [&>*]:justify-center"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="gap-2.5">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Role Distribution
          </CardTitle>
          <CardDescription>User roles breakdown</CardDescription>
          <CardAction>
            <Crown className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={roleChartConfig}
            className="mx-auto aspect-square w-full max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel />}
              />
              <Pie
                data={roleChartData}
                dataKey="count"
                nameKey="role"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                innerRadius={40}
                outerRadius={70}
                strokeWidth={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const roles = Object.keys(stats.roleStats).length;
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className={cn("fill-primary text-base font-bold")}
                          >
                            {roles}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-muted-foreground font-bold"
                          >
                            {roles === 1 ? "Role" : "Roles"}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="role" />}
                className="flex-wrap gap-2.5 gap-y-0.5 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Research Output (Only for Active Researchers) */}
      <Card className="gap-2.5">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Research Output</CardTitle>
          <CardDescription>
            {stats.researchers > 0
              ? `Avg ${stats.avgPublicationsPerResearcher.toFixed(
                  1
                )} pubs/researcher`
              : "No active researchers"}
          </CardDescription>
          <CardAction>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          {researchChartData.length > 0 ? (
            <ChartContainer
              config={researchChartConfig}
              className="mx-auto aspect-square w-full max-h-[250px]"
            >
              <BarChart
                accessibilityLayer
                data={researchChartData}
                margin={{ right: -5, left: -5, top: 30 }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  fontSize={12}
                  fontWeight={600}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground">
              No research output yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community & Partnerships */}
      <Card className="gap-2.5">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Community</CardTitle>
          <CardDescription>Partners, affiliates & members</CardDescription>
          <CardAction>
            <Building className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          {communityData.length > 0 ? (
            <ChartContainer
              config={communityChartConfig}
              className="mx-auto aspect-square w-full max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" hideLabel />}
                />
                <Pie
                  data={communityChartData}
                  dataKey="value"
                  nameKey="name"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  innerRadius={40}
                  outerRadius={70}
                  strokeWidth={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const total =
                          stats.partners + stats.affiliates + stats.members;
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className={cn("fill-primary text-base font-bold")}
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 16}
                              className="fill-muted-foreground font-bold"
                            >
                              {total === 1 ? "User" : "Users"}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="flex-wrap gap-2.5 gap-y-0.5 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold mb-2">0</div>
              <div className="text-sm text-muted-foreground">
                No community members yet
              </div>
            </div>
          )}
          {/* <div className="text-2xl font-bold mb-4">
            {stats.partners + stats.affiliates + stats.members}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Partners</span>
              <span className="font-medium">{stats.partners}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Affiliates</span>
              <span className="font-medium">{stats.affiliates}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Members</span>
              <span className="font-medium">{stats.members}</span>
            </div>
            {stats.partners + stats.affiliates + stats.members > 0 && (
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 rounded-full transition-all duration-300"
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
export { SummaryCards };
