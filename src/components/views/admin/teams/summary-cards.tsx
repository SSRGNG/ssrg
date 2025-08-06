"use client";

import {
  Building,
  Crown,
  GraduationCap,
  Users as UsersIcon,
} from "lucide-react";
import * as React from "react";

import { AdminUsers } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> & { users: AdminUsers };

function SummaryCards({ users, className, ...props }: Props) {
  const stats = React.useMemo(() => {
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

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
    };
  }, [users]);
  return (
    <div
      className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
      {...props}
    >
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Total Users</h3>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{stats.total}</div>
        <p className="text-xs text-muted-foreground">
          {stats.researchers} active researchers
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Publications</h3>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{stats.totalPublications}</div>
        <p className="text-xs text-muted-foreground">
          {stats.totalVideos} videos, {stats.totalProjects} projects
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Roles</h3>
          <Crown className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{stats.admins}</div>
        <p className="text-xs text-muted-foreground">
          {stats.researchers} researchers, {stats.affiliates} affiliates
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">Partners</h3>
          <Building className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold">{stats.partners}</div>
        <p className="text-xs text-muted-foreground">
          {stats.members} general members
        </p>
      </div>
    </div>
  );
}

export { SummaryCards };
