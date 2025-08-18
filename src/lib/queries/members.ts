import "server-only";

import { db } from "@/db";

export async function getAllMembers(limit = Infinity, offset = 0) {
  try {
    const results = await db.query.members.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            slug: true,
            affiliation: true,
          },
        },
      },
      orderBy: (v, { desc }) => [desc(v.joinedAt)],
      limit: limit === Infinity ? undefined : limit,
      offset,
    });

    return Array.isArray(results)
      ? results.map(({ user, ...data }) => ({
          ...data,
          ...user,
        }))
      : [];
  } catch (error) {
    console.error("Database members query failed:", error);
    throw new Error("Failed to fetch members");
  }
}

export async function getAllPartners(limit = Infinity, offset = 0) {
  try {
    const results = await db.query.partners.findMany({
      columns: { created_at: false, updated_at: false },
      with: {
        projects: {
          with: {
            project: { columns: { created_at: false, updated_at: false } },
          },
        },
      },
      orderBy: (v, { desc }) => [desc(v.created_at)],
      limit: limit === Infinity ? undefined : limit,
      offset,
    });

    return Array.isArray(results)
      ? results.map(({ projects, ...data }) => ({
          ...data,
          projects: projects.map(({ project }) => project),
        }))
      : [];
  } catch (error) {
    console.error("Database partners query failed:", error);
    throw new Error("Failed to fetch partners");
  }
}
