import "server-only";

import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/db";
import {
  projectMembers,
  projects,
  researcherExpertise,
  researchers,
  users,
} from "@/db/schema";

export async function getAllProjectTeamsWithSubqueries() {
  const result = await db
    .select({
      ...getTableColumns(projects),
      leadResearcherName: users.name,
      leadResearcherTitle: researchers.title,
      leadResearcherImage: users.image,
      leadResearcherUserId: users.id,

      teamMembers: sql<
        Array<{
          id: string;
          name: string;
          title: string;
          role: string;
          isActive: boolean;
          joinedAt: Date;
          leftAt: Date | null;
        }>
      >`
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', pm.id::text,
              'name', u.name,
              'title', r.title,
              'role', pm.role,
              'isActive', pm.is_active,
              'joinedAt', pm.joined_at,
              'leftAt', pm.left_at
            )
            ORDER BY pm.joined_at DESC
          )
          FROM ${projectMembers} pm
          JOIN ${researchers} r ON pm.researcher_id = r.id
          JOIN ${users} u ON r.user_id = u.id
          WHERE pm.project_id = ${projects.id}
          ), '[]'::json
        )
      `,

      // Simple counts
      memberCount: sql<number>`
        (SELECT COUNT(*)
         FROM ${projectMembers} pm
         WHERE pm.project_id = ${projects.id})
      `,
      activeMemberCount: sql<number>`
        (SELECT COUNT(*)
         FROM ${projectMembers} pm
         WHERE pm.project_id = ${projects.id} AND pm.is_active = true)
      `,
    })
    .from(projects)
    .leftJoin(researchers, eq(projects.leadResearcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .orderBy(desc(projects.created_at));

  return result;
}

export async function getAllProjectTeams() {
  const result = await db
    .select({
      ...getTableColumns(projects),
      leadResearcherName: users.name,
      leadResearcherTitle: researchers.title,
      leadResearcherImage: users.image,
      leadResearcherUserId: users.id,

      // Team stats using window functions
      memberCount: sql<number>`COUNT(${projectMembers.id}) OVER (PARTITION BY ${projects.id})`,
      activeMemberCount: sql<number>`COUNT(${projectMembers.id}) FILTER (WHERE ${projectMembers.isActive} = true) OVER (PARTITION BY ${projects.id})`,
    })
    .from(projects)
    .leftJoin(researchers, eq(projects.leadResearcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .leftJoin(projectMembers, eq(projects.id, projectMembers.projectId))
    .groupBy(
      ...Object.values(getTableColumns(projects)),
      users.name,
      researchers.title,
      users.image,
      users.id
    )
    .orderBy(desc(projects.created_at));

  return result;
}

export async function getProjectTeamMembers(projectId: string) {
  const result = await db
    .select({
      id: projectMembers.id,
      researcherId: projectMembers.researcherId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
      leftAt: projectMembers.leftAt,
      isActive: projectMembers.isActive,

      // Researcher info
      name: users.name,
      title: researchers.title,
      bio: researchers.bio,

      // User info
      userId: users.id,
      email: users.email,
      image: users.image,
      affiliation: users.affiliation,

      // Expertise using subquery
      expertise: sql<string[]>`
        COALESCE(
          (SELECT json_agg(re.expertise ORDER BY re.order)
           FROM ${researcherExpertise} re
           WHERE re.researcher_id = ${researchers.id}
          ), '[]'::json
        )
      `,
    })
    .from(projectMembers)
    .leftJoin(researchers, eq(projectMembers.researcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(desc(projectMembers.joinedAt));

  return result;
}

// Get team collaboration insights
export async function getTeamCollaborationInsights() {
  // Most active collaborators
  const collaborators = await db
    .select({
      researcherId: projectMembers.researcherId,
      name: users.name,
      title: researchers.title,
      image: users.image,
      projectCount: sql<number>`COUNT(DISTINCT ${projectMembers.projectId})`,
      activeProjectCount: sql<number>`COUNT(DISTINCT CASE WHEN ${projects.status} = 'active' THEN ${projectMembers.projectId} END)`,
      totalBudgetInvolved: sql<number>`SUM(DISTINCT ${projects.budgetTotal})`,
    })
    .from(projectMembers)
    .leftJoin(researchers, eq(projectMembers.researcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .leftJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.isActive, true))
    .groupBy(
      projectMembers.researcherId,
      users.name,
      researchers.title,
      users.image
    )
    .orderBy(desc(sql<number>`COUNT(DISTINCT ${projectMembers.projectId})`))
    .limit(10);

  // Cross-project collaboration patterns using self-join with aliases
  const pm1 = alias(projectMembers, "pm1");
  const pm2 = alias(projectMembers, "pm2");
  const r1 = alias(researchers, "r1");
  const r2 = alias(researchers, "r2");
  const u1 = alias(users, "u1");
  const u2 = alias(users, "u2");

  const collaborationPatterns = await db
    .select({
      researcher1Id: pm1.researcherId,
      researcher1Name: u1.name,
      researcher2Id: pm2.researcherId,
      researcher2Name: u2.name,
      sharedProjects: sql<number>`COUNT(*)`,
    })
    .from(pm1)
    .innerJoin(
      pm2,
      and(
        eq(pm1.projectId, pm2.projectId),
        sql`${pm1.researcherId} < ${pm2.researcherId}`
      )
    )
    .leftJoin(r1, eq(pm1.researcherId, r1.id))
    .leftJoin(u1, eq(r1.userId, u1.id))
    .leftJoin(r2, eq(pm2.researcherId, r2.id))
    .leftJoin(u2, eq(r2.userId, u2.id))
    .where(and(eq(pm1.isActive, true), eq(pm2.isActive, true)))
    .groupBy(pm1.researcherId, u1.name, pm2.researcherId, u2.name)
    .having(sql`COUNT(*) > 1`)
    .orderBy(desc(sql<number>`COUNT(*)`))
    .limit(20);

  return {
    collaborators,
    collaborationPatterns,
  };
}
