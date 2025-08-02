import "server-only";

import { count, desc, eq, gte, like, or, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import { auth } from "@/auth";
import {
  CACHED_FORMATTED_RESEARCHER,
  CACHED_FORMATTED_RESEARCHERS,
  CACHED_PROJECTS,
  CACHED_RESEARCH_AREAS,
  CACHED_RESEARCH_FRAMEWORKS,
  CACHED_RESEARCH_METHODOLOGIES,
} from "@/config/constants";
import { publications as pubEnums, videoCats } from "@/config/enums";
import { db } from "@/db";
import {
  authors,
  projects,
  publicationAuthors,
  publications,
  researchAreas,
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
  users,
  videoAuthors,
  videos,
} from "@/db/schema";
import { isRoleAllowed } from "@/lib/utils";
import { Role } from "@/types";

export async function getAdminStats() {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }
    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false as const,
        error: "Unauthorized",
        details: "User does not have permission to view stats",
      };
    }
    const [
      totalUsersResult,
      totalPublicationsResult,
      totalProjectsResult,
      totalAreasResult,
      activeResearchersResult,
      totalVideosResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(publications),
      db.select({ count: count() }).from(projects),
      db.select({ count: count() }).from(researchAreas),
      db
        .select({ count: count() })
        .from(researchers)
        .leftJoin(users, eq(researchers.userId, users.id))
        .where(or(eq(users.role, "researcher"), eq(users.role, "admin"))),
      db.select({ count: count() }).from(videos),
    ]);

    return {
      success: true as const,
      data: {
        totalUsers: totalUsersResult[0]?.count || 0,
        totalPublications: totalPublicationsResult[0]?.count || 0,
        totalProjects: totalProjectsResult[0]?.count || 0,
        totalAreas: totalAreasResult[0]?.count || 0,
        activeResearchers: activeResearchersResult[0]?.count || 0,
        totalVideos: totalVideosResult[0]?.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      success: false as const,
      error: "Failed to fetch admin statistics",
    };
  }
}

// Publication type distribution
export async function getPublicationTypeDistribution() {
  const result = await db
    .select({
      type: publications.type,
      count: count(),
    })
    .from(publications)
    .groupBy(publications.type)
    .orderBy(desc(count()));

  return result;
}

// Video category distribution
export async function getVideoCategoryDistribution() {
  const result = await db
    .select({
      category: videos.category,
      count: count(),
    })
    .from(videos)
    .groupBy(videos.category)
    .orderBy(desc(count()));

  return result;
}

// Monthly activity data
export async function getMonthlyActivity(months: number = 6) {
  const monthsAgo = new Date();
  monthsAgo.setMonth(monthsAgo.getMonth() - months);

  const [
    publicationsActivity,
    videosActivity,
    usersActivity,
    projectsActivity,
  ] = await Promise.all([
    db
      .select({
        month: sql<string>`TO_CHAR(${publications.created_at}, 'Mon')`,
        count: count(),
      })
      .from(publications)
      .where(gte(publications.created_at, monthsAgo))
      .groupBy(
        sql`TO_CHAR(${publications.created_at}, 'Mon'), EXTRACT(month FROM ${publications.created_at})`
      )
      .orderBy(sql`EXTRACT(month FROM ${publications.created_at})`),

    db
      .select({
        month: sql<string>`TO_CHAR(${videos.created_at}, 'Mon')`,
        count: count(),
      })
      .from(videos)
      .where(gte(videos.created_at, monthsAgo))
      .groupBy(
        sql`TO_CHAR(${videos.created_at}, 'Mon'), EXTRACT(month FROM ${videos.created_at})`
      )
      .orderBy(sql`EXTRACT(month FROM ${videos.created_at})`),

    db
      .select({
        month: sql<string>`TO_CHAR(${users.createdAt}, 'Mon')`,
        count: count(),
      })
      .from(users)
      .where(gte(users.createdAt, monthsAgo))
      .groupBy(
        sql`TO_CHAR(${users.createdAt}, 'Mon'), EXTRACT(month FROM ${users.createdAt})`
      )
      .orderBy(sql`EXTRACT(month FROM ${users.createdAt})`),

    db
      .select({
        month: sql<string>`TO_CHAR(${projects.created_at}, 'Mon')`,
        count: count(),
      })
      .from(projects)
      .where(gte(projects.created_at, monthsAgo))
      .groupBy(
        sql`TO_CHAR(${projects.created_at}, 'Mon'), EXTRACT(month FROM ${projects.created_at})`
      )
      .orderBy(sql`EXTRACT(month FROM ${projects.created_at})`),
  ]);

  // Combine the data by month
  const monthlyData = publicationsActivity.map((pub) => ({
    month: pub.month,
    publications: pub.count,
    videos: videosActivity.find((v) => v.month === pub.month)?.count || 0,
    users: usersActivity.find((u) => u.month === pub.month)?.count || 0,
    projects: projectsActivity.find((p) => p.month === pub.month)?.count || 0,
  }));

  return monthlyData;
}

// User Management Queries
export async function getAllUsersWithStats() {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      affiliation: users.affiliation,
      createdAt: users.createdAt,
      image: users.image,
      // Researcher info if exists
      researcherId: researchers.id,
      bio: researchers.bio,
      // Publication count
      publicationCount: sql<number>`COALESCE(pub_counts.count, 0)`,
      // Video count
      videoCount: sql<number>`COALESCE(video_counts.count, 0)`,
      // Project count (as lead researcher)
      projectCount: sql<number>`COALESCE(project_counts.count, 0)`,
    })
    .from(users)
    .leftJoin(researchers, eq(users.id, researchers.userId))
    // Publication count subquery
    .leftJoin(
      sql`(
        SELECT pa.author_id, COUNT(*) as count 
        FROM ${publicationAuthors} pa 
        JOIN ${authors} a ON pa.author_id = a.id 
        WHERE a.researcher_id IS NOT NULL 
        GROUP BY pa.author_id
      ) as pub_counts`,
      sql`pub_counts.author_id = (SELECT id FROM authors WHERE researcher_id = ${researchers.id})`
    )
    // Video count subquery
    .leftJoin(
      sql`(
        SELECT va.author_id, COUNT(*) as count 
        FROM ${videoAuthors} va 
        JOIN ${authors} a ON va.author_id = a.id 
        WHERE a.researcher_id IS NOT NULL 
        GROUP BY va.author_id
      ) as video_counts`,
      sql`video_counts.author_id = (SELECT id FROM authors WHERE researcher_id = ${researchers.id})`
    )
    // Project count subquery
    .leftJoin(
      sql`(
        SELECT lead_researcher_id, COUNT(*) as count 
        FROM ${projects} 
        GROUP BY lead_researcher_id
      ) as project_counts`,
      sql`project_counts.lead_researcher_id = ${researchers.id}`
    )
    .orderBy(desc(users.createdAt));

  return result;
}

export async function getUsersByRole(role: Role) {
  return await db
    .select()
    .from(users)
    .where(eq(users.role, role))
    .orderBy(desc(users.createdAt));
}

export async function searchUsers(searchTerm: string) {
  return await db
    .select()
    .from(users)
    .where(
      or(
        like(users.name, `%${searchTerm}%`),
        like(users.email, `%${searchTerm}%`),
        like(users.affiliation, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(users.createdAt));
}

export async function getUserWithDetails(userId: string) {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid userId provided");
    }
    const result = await db
      .select({
        // User info
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        affiliation: users.affiliation,
        createdAt: users.createdAt,
        image: users.image,
        // Researcher info
        researcherId: researchers.id,
        bio: researchers.bio,
        orcid: researchers.orcid,
        x: researchers.x,
      })
      .from(users)
      .leftJoin(researchers, eq(users.id, researchers.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) return null;

    const user = result[0];

    // Get researcher's publications if they are a researcher
    const [publicationsResult, videosResult, projectsResult, areasResult] =
      user.researcherId
        ? await Promise.all([
            db
              .select({
                id: publications.id,
                title: publications.title,
                type: publications.type,
                venue: publications.venue,
                publicationDate: publications.publicationDate,
                citationCount: publications.citationCount,
              })
              .from(publications)
              .leftJoin(
                publicationAuthors,
                eq(publications.id, publicationAuthors.publicationId)
              )
              .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
              .where(eq(authors.researcherId, user.researcherId))
              .orderBy(desc(publications.created_at)),
            db
              .select({
                id: videos.id,
                title: videos.title,
                youtubeUrl: videos.youtubeUrl,
                publishedAt: videos.publishedAt,
                viewCount: videos.viewCount,
                category: videos.category,
              })
              .from(videos)
              .leftJoin(videoAuthors, eq(videos.id, videoAuthors.videoId))
              .leftJoin(authors, eq(videoAuthors.authorId, authors.id))
              .where(eq(authors.researcherId, user.researcherId))
              .orderBy(desc(videos.created_at)),
            db
              .select({
                id: projects.id,
                title: projects.title,
                description: projects.description,
                period: projects.period,
                location: projects.location,
              })
              .from(projects)
              .where(eq(projects.leadResearcherId, user.researcherId))
              .orderBy(desc(projects.created_at)),
            db
              .select({
                id: researchAreas.id,
                title: researchAreas.title,
                description: researchAreas.description,
              })
              .from(researchAreas)
              .leftJoin(
                researcherAreas,
                eq(researchAreas.id, researcherAreas.areaId)
              )
              .where(eq(researcherAreas.researcherId, user.researcherId)),
          ])
        : [null, null, null, null];

    return {
      ...user,
      publications: publicationsResult,
      videos: videosResult,
      projects: projectsResult,
      researchAreas: areasResult,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
}

// Get recent activity for admin dashboard
export async function getRecentActivity(limit: number = 5) {
  const recentPublications = await db
    .select({
      type: sql<string>`'publications'`,
      userName: users.name,
      action: sql<string>`'published'`,
      createdAt: publications.created_at,
      title: publications.title,
      rawType: publications.type,
    })
    .from(publications)
    .leftJoin(users, eq(publications.creatorId, users.id))
    .orderBy(desc(publications.created_at))
    .limit(limit);

  const recentVideos = await db
    .select({
      type: sql<string>`'video'`,
      userName: users.name,
      action: sql<string>`'uploaded'`,
      createdAt: videos.created_at,
      title: videos.title,
      rawType: videos.category,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    .orderBy(desc(videos.created_at))
    .limit(limit);

  const recentUsers = await db
    .select({
      type: sql<string>`'user'`,
      userName: users.name,
      action: sql<string>`'registered as ' || CASE
        WHEN ${users.role} = 'admin' THEN 'an admin'
        WHEN ${users.role} = 'researcher' THEN 'a researcher'
        WHEN ${users.role} = 'affiliate' THEN 'an affiliate'
        WHEN ${users.role} = 'partner' THEN 'a partner'
        WHEN ${users.role} = 'member' THEN 'a member'
        ELSE 'a user'
      END`,
      createdAt: users.createdAt,
      title: sql<string>`null`,
      rawType: sql<string>`null`,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit);

  const recentProjects = await db
    .select({
      type: sql<string>`'projects'`,
      userName: users.name,
      action: sql<string>`'created project'`,
      createdAt: projects.created_at,
      title: projects.title,
      rawType: sql<string>`null`,
    })
    .from(projects)
    .leftJoin(researchers, eq(projects.leadResearcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .orderBy(desc(projects.created_at))
    .limit(limit);

  // Type-safe processing functions
  const processPublications = (items: typeof recentPublications) =>
    items.map((item) => ({
      ...item,
      action:
        item.rawType && pubEnums.values.includes(item.rawType)
          ? `Uploaded a new ${pubEnums.getLabel(item.rawType)}`
          : `Uploaded a new ${item.rawType || "publication"}`,
    }));

  const processVideos = (items: typeof recentVideos) =>
    items.map((item) => ({
      ...item,
      action:
        item.rawType && videoCats.values.includes(item.rawType)
          ? `uploaded a new ${videoCats.getLabel(item.rawType)} video`
          : `uploaded a new ${item.rawType || "video"}`,
    }));

  // Combine and sort all activities
  const allActivities = [
    ...processPublications(recentPublications),
    ...processVideos(recentVideos),
    ...recentUsers,
    ...recentProjects,
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return allActivities;
}

export async function getResearchAreas(limit = Infinity, offset = 0) {
  return await db.query.researchAreas.findMany({
    columns: {
      id: true,
      title: true,
      icon: true,
      image: true,
      description: true,
      detail: true,
      href: true,
      linkText: true,
    },
    with: {
      questions: {
        columns: {
          question: true,
          order: true,
        },
        orderBy: (q, { asc }) => [asc(q.order)],
      },
      methods: {
        columns: {
          title: true,
          description: true,
          order: true,
        },
        orderBy: (m, { asc }) => [asc(m.order)],
      },
      findings: {
        columns: {
          finding: true,
          order: true,
        },
        orderBy: (f, { asc }) => [asc(f.order)],
      },
      publications: {
        columns: {
          publicationId: true,
          order: true,
        },
        with: {
          publication: {
            columns: {
              id: true,
              title: true,
              type: true,
              doi: true,
              publicationDate: true,
              venue: true,
              metadata: true,
            },
            with: {
              authors: {
                columns: {
                  order: true,
                  isCorresponding: true,
                },
                with: {
                  author: {
                    columns: {
                      name: true,
                      email: true,
                      affiliation: true,
                      orcid: true,
                    },
                    with: {
                      researcher: {
                        columns: { title: true, orcid: true },
                      },
                    },
                  },
                },
                orderBy: (q, { asc }) => [asc(q.order)],
              },
            },
          },
        },
        orderBy: (p, { asc }) => [asc(p.order)],
      },
    },
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
export async function getResearchFrameworks(limit = Infinity, offset = 0) {
  return await db.query.researchFrameworks.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      href: true,
      linkText: true,
    },
    orderBy: (f, { asc }) => [asc(f.order)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
export async function getResearchMethodologies(limit = Infinity, offset = 0) {
  return await db.query.researchMethodologies.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
    },
    orderBy: (f, { asc }) => [asc(f.order)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}

export async function getProjects(limit = Infinity, offset = 0) {
  return await db.query.projects.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
    },
    with: {
      leadResearcher: {
        columns: {
          bio: true,
          featured: true,
          id: true,
          orcid: true,
          title: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              affiliation: true,
              email: true,
              image: true,
              id: true,
            },
          },
          education: {
            columns: {
              education: true,
              order: true,
            },
          },
          expertise: {
            columns: {
              expertise: true,
              order: true,
            },
          },
        },
      },
    },
    orderBy: (f, { asc }) => [asc(f.created_at)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
// 1. Get a researcher with the provided researcherId
export async function getResearcher(researcherId: string) {
  try {
    const researcher = await db.query.researchers.findFirst({
      where: eq(researchers.id, researcherId),
      with: {
        user: true,
        expertise: {
          orderBy: (expertise, { asc }) => [asc(expertise.order)],
        },
        education: {
          orderBy: (education, { asc }) => [asc(education.order)],
        },
        areas: {
          with: {
            area: true,
          },
        },
      },
    });

    // Handle not found case
    if (!researcher) {
      throw new Error(`Researcher with ID ${researcherId} not found`);
    }

    return researcher;
  } catch (error) {
    console.error(`Failed to fetch researcher ${researcherId}:`, error);
    throw error; // Re-throw to allow caller to handle
  }
}

export async function getResearchers() {
  try {
    const researchers = await db.query.researchers.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        expertise: {
          orderBy: (expertise, { asc }) => [asc(expertise.order)],
          columns: {
            expertise: true,
          },
        },
        education: {
          orderBy: (education, { asc }) => [asc(education.order)],
          columns: {
            education: true,
          },
        },
        areas: {
          with: {
            area: {
              columns: {
                title: true,
              },
            },
          },
        },
        author: {
          with: {
            publications: {
              with: {
                publication: {
                  columns: {
                    title: true,
                    publicationDate: true,
                  },
                },
              },
              orderBy: (pa, { desc }) => [desc(pa.order)],
            },
          },
        },
        leadProjects: {
          columns: {
            title: true,
          },
        },
      },
      orderBy: (researchers, { asc }) => [asc(researchers.created_at)],
    });
    return researchers;
  } catch (error) {
    console.error("Failed to fetch researchers:", error);
    throw new Error("Failed to fetch researchers");
  }
}

export async function getFeaturedResearchers() {
  const featuredResearchers = await db.query.researchers.findMany({
    where: eq(researchers.featured, true),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          affiliation: true,
          image: true,
        },
      },
      expertise: {
        orderBy: (expertise, { asc }) => [asc(expertise.order)],
      },
    },
    orderBy: (researchers, { asc }) => [asc(researchers.created_at)],
  });

  return featuredResearchers;
}

// 7. Add expertise to a researcher
export async function addResearcherExpertise(
  researcherId: string,
  expertiseList: string[]
) {
  // First delete existing expertise
  await db
    .delete(researcherExpertise)
    .where(eq(researcherExpertise.researcherId, researcherId));

  // Then add new expertise
  const expertiseToInsert = expertiseList.map((expertise, index) => ({
    researcherId,
    expertise,
    order: index,
  }));

  return db.insert(researcherExpertise).values(expertiseToInsert).returning();
}

// 8. Add education to a researcher
export async function addResearcherEducation(
  researcherId: string,
  educationList: string[]
) {
  // First delete existing education entries
  await db
    .delete(researcherEducation)
    .where(eq(researcherEducation.researcherId, researcherId));

  // Then add new education entries
  const educationToInsert = educationList.map((education, index) => ({
    researcherId,
    education,
    order: index,
  }));

  return db.insert(researcherEducation).values(educationToInsert).returning();
}

// 9. Associate researcher with research areas
export async function setResearcherAreas(
  researcherId: string,
  areaIds: string[]
) {
  // First delete existing area associations
  await db
    .delete(researcherAreas)
    .where(eq(researcherAreas.researcherId, researcherId));

  // Then add new area associations
  const areasToInsert = areaIds.map((areaId) => ({
    researcherId,
    areaId,
  }));

  return db.insert(researcherAreas).values(areasToInsert).returning();
}

// 10. Search researchers by name or expertise
export async function searchResearchers(searchTerm: string) {
  const userResults = await db.query.users.findMany({
    where: (users, { ilike }) => ilike(users.name, `%${searchTerm}%`),
    with: {
      researcher: {
        with: {
          expertise: true,
        },
      },
    },
  });

  // Filter to only include users who have a researcher profile
  const researchersFromUserSearch = userResults
    .filter((user) => user.researcher)
    .map((user) => user.researcher);

  // Also search by expertise
  const expertiseResults = await db.query.researcherExpertise.findMany({
    where: (expertise, { ilike }) =>
      ilike(expertise.expertise, `%${searchTerm}%`),
    with: {
      researcher: {
        with: {
          user: true,
          expertise: true,
        },
      },
    },
  });

  const researchersFromExpertiseSearch = expertiseResults.map(
    (result) => result.researcher
  );

  // Merge and deduplicate results
  const allResults = [
    ...researchersFromUserSearch,
    ...researchersFromExpertiseSearch,
  ];
  const uniqueResults = Array.from(
    new Map(allResults.map((item) => [item.id, item])).values()
  );

  return uniqueResults;
}

export const getCachedResearchers = cache(
  async () => getResearchers(),
  [CACHED_FORMATTED_RESEARCHERS],
  { tags: [CACHED_FORMATTED_RESEARCHERS], revalidate: 60 * 60 * 72 } // 72 hours
);

export async function getCachedResearcher(researcherId: string) {
  return await cache(
    async () => getResearcher(researcherId),
    [CACHED_FORMATTED_RESEARCHER],
    {
      tags: [`${CACHED_FORMATTED_RESEARCHER}-${researcherId}`],
      revalidate: 60 * 60 * 24,
    } // 24 hours
  )();
}

export const getCachedAdminResearchAreas = cache(
  async () => getResearchAreas(),
  [CACHED_RESEARCH_AREAS],
  { tags: [CACHED_RESEARCH_AREAS], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedResearchFrameworks = cache(
  async () => getResearchFrameworks(),
  [CACHED_RESEARCH_FRAMEWORKS],
  { tags: [CACHED_RESEARCH_FRAMEWORKS], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedResearchMethodologies = cache(
  async () => getResearchMethodologies(),
  [CACHED_RESEARCH_METHODOLOGIES],
  { tags: [CACHED_RESEARCH_METHODOLOGIES], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedProjects = cache(
  async () => getProjects(),
  [CACHED_PROJECTS],
  { tags: [CACHED_PROJECTS], revalidate: 60 * 60 * 72 } // 72 hours
);
