import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { appConfig } from "@/config";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
  users,
  videoAuthors,
  videos,
} from "@/db/schema";
import {
  type PublicationQueryInput,
  publicationQuerySchema,
} from "@/lib/validations/params";

export async function getPublications(limit = Infinity, offset = 0) {
  const results = await db.query.publications.findMany({
    columns: {
      id: true,
      title: true,
      type: true,
      doi: true,
      publicationDate: true,
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
    orderBy: (q, { asc }) => [asc(q.publicationDate)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });

  return results.map((pub) => ({
    ...pub,
    authors: pub.authors.map(({ order, isCorresponding, author }) => ({
      order,
      isCorresponding,
      name: author.name,
      email: author.email,
      affiliation: author.affiliation,
      orcid: author.orcid,
      researcher: author.researcher || null, // Ensure consistent null handling
    })),
  }));
}

export async function getResearcherPublications(
  params: PublicationQueryInput = {}
) {
  const validatedParams = publicationQuerySchema.parse(params);
  const {
    page,
    limit,
    search,
    type,
    publishedAfter,
    publishedBefore,
    sortBy,
    sortOrder,
  } = validatedParams;

  const offset = (page - 1) * limit;

  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);

  // Create aliases for the second set of joins
  const allPublicationAuthors = alias(
    publicationAuthors,
    "allPublicationAuthors"
  );
  const authorProfiles = alias(authors, "authorProfiles");
  const authorResearchers = alias(researchers, "authorResearchers");

  // Build all conditions first
  const conditions = [];
  conditions.push(eq(researchers.userId, userId));

  // Additional filters
  if (search) {
    const searchPattern = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(publications.title, searchPattern),
        ilike(publications.abstract, searchPattern),
        ilike(publications.venue, searchPattern),
        ilike(publications.doi, searchPattern)
      )
    );
  }

  if (type) {
    conditions.push(eq(publications.type, type));
  }

  if (publishedAfter) {
    conditions.push(sql`${publications.publicationDate} >= ${publishedAfter}`);
  }

  if (publishedBefore) {
    conditions.push(sql`${publications.publicationDate} <= ${publishedBefore}`);
  }

  // Determine sort column - only allow specific sortable columns
  const sortableColumns = {
    publicationDate: publications.publicationDate,
    title: publications.title,
    citationCount: publications.citationCount,
    createdAt: publications.created_at,
  } as const;

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] ||
    publications.publicationDate;
  const primaryOrderBy =
    sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

  // Single query to get all publications for the authenticated researcher
  const results = await db
    .select({
      // Publication fields
      ...getTableColumns(publications),

      // Current user's authorship details
      userAuthorOrder: publicationAuthors.order,
      userIsCorresponding: publicationAuthors.isCorresponding,

      // All authors for each publication (for complete author list)
      authorOrder: allPublicationAuthors.order,
      authorIsCorresponding: allPublicationAuthors.isCorresponding,
      authorName: authorProfiles.name,
      authorEmail: authorProfiles.email,
      authorAffiliation: authorProfiles.affiliation,
      authorOrcid: authorProfiles.orcid,

      // Author's researcher details (optional)
      authorResearcherId: authorResearchers.id,
      authorResearcherTitle: authorResearchers.title,
      // authorUserName: authorUsers.name,
    })
    .from(researchers)
    .innerJoin(users, eq(researchers.userId, users.id))
    .innerJoin(authors, eq(authors.researcherId, researchers.id))
    .innerJoin(publicationAuthors, eq(publicationAuthors.authorId, authors.id))
    .innerJoin(
      publications,
      eq(publications.id, publicationAuthors.publicationId)
    )
    // Get all authors for each publication (using alias to avoid conflicts)
    .innerJoin(
      allPublicationAuthors,
      eq(allPublicationAuthors.publicationId, publications.id)
    )
    .innerJoin(
      authorProfiles,
      eq(authorProfiles.id, allPublicationAuthors.authorId)
    )
    .leftJoin(
      authorResearchers,
      eq(authorProfiles.researcherId, authorResearchers.id)
    )
    .where(and(...conditions))
    .orderBy(primaryOrderBy, asc(allPublicationAuthors.order))
    .limit(limit)
    .offset(offset);

  if (results.length === 0) return [];

  // Create type for the transformed result
  type Row = (typeof results)[number];
  type TransformedPublication = Pick<
    Row,
    | "id" // From publications
    | "title"
    | "type"
    | "doi"
    | "publicationDate"
    | "abstract"
    | "link"
    | "venue"
    | "metadata"
    | "citationCount"
    | "lastCitationUpdate"
    | "creatorId"
  > & {
    userAuthorOrder: Row["userAuthorOrder"];
    isLeadAuthor: boolean;
    authors: {
      order: Row["authorOrder"];
      isCorresponding: Row["authorIsCorresponding"];
      name: Row["authorName"];
      email: Row["authorEmail"];
      affiliation: Row["authorAffiliation"];
      orcid: Row["authorOrcid"];
      researcher: {
        id: Row["authorResearcherId"];
        title: Row["authorResearcherTitle"];
      } | null;
    }[];
  };

  // Group results by publication
  const publicationsMap = new Map<string, TransformedPublication>();

  results.forEach((row) => {
    if (!publicationsMap.has(row.id)) {
      publicationsMap.set(row.id, {
        id: row.id,
        title: row.title,
        type: row.type,
        doi: row.doi,
        publicationDate: row.publicationDate,
        abstract: row.abstract,
        link: row.link,
        venue: row.venue,
        metadata: row.metadata,
        citationCount: row.citationCount,
        lastCitationUpdate: row.lastCitationUpdate,
        creatorId: row.creatorId,
        userAuthorOrder: row.userAuthorOrder,
        isLeadAuthor: row.userAuthorOrder === 0,
        authors: [],
      });
    }

    const publication = publicationsMap.get(row.id)!;

    if (
      row.authorOrder !== null &&
      !publication.authors.some((a) => a.order === row.authorOrder)
    ) {
      publication.authors.push({
        order: row.authorOrder,
        isCorresponding: row.authorIsCorresponding,
        name: row.authorName,
        email: row.authorEmail,
        affiliation: row.authorAffiliation,
        orcid: row.authorOrcid,
        researcher: row.authorResearcherId
          ? {
              id: row.authorResearcherId,
              title: row.authorResearcherTitle,
            }
          : null,
      });
    }
  });

  // Add canDelete flag and return
  return Array.from(publicationsMap.values()).map((pub) => ({
    ...pub,
    canDelete:
      pub.authors.length > 0 &&
      pub.userAuthorOrder === Math.min(...pub.authors.map((a) => a.order)),
  }));
}

export async function researcherPublications() {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) redirect(appConfig.url);

  const researcher = await db.query.researchers.findFirst({
    columns: {},
    with: {
      author: {
        columns: {},
        with: {
          publications: {
            columns: { isCorresponding: true, order: true },
            with: {
              publication: {
                with: {
                  authors: {
                    columns: { isCorresponding: true, order: true },
                    with: {
                      author: {
                        columns: {
                          name: true,
                          email: true,
                          affiliation: true,
                          orcid: true,
                        },
                        with: {
                          researcher: { columns: { id: true, title: true } },
                        },
                      },
                    },
                    orderBy: (pa, { asc }) => [asc(pa.order)],
                  },
                },
              },
            },
          },
        },
      },
    },
    where: (model, { eq }) => eq(model.userId, userId),
  });
  return researcher?.author?.publications || [];
}

export async function authResearcher() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);

  const [researcher] = await db
    .select({
      id: researchers.id,
      userId: researchers.userId,
      name: users.name,
      email: users.email,
      affiliation: users.affiliation,
      title: researchers.title,
      bio: researchers.bio,
      featured: researchers.featured,
      orcid: researchers.orcid,
      avatar: users.image,
    })
    .from(researchers)
    .innerJoin(users, eq(researchers.userId, users.id))
    .where(eq(researchers.userId, userId))
    .limit(1);

  return researcher;
}

export async function getCurrentUserResearcher() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);
  try {
    const researcher = await db
      .select({
        id: researchers.id,
        userId: researchers.userId,
        name: users.name,
        email: users.email,
        affiliation: users.affiliation,
        title: researchers.title,
        bio: researchers.bio,
        featured: researchers.featured,
        orcid: researchers.orcid,
        avatar: users.image,
      })
      .from(researchers)
      .innerJoin(users, eq(researchers.userId, users.id))
      .where(eq(researchers.userId, userId))
      .limit(1);

    if (researcher.length === 0) {
      return {
        success: false,
        error: "Researcher profile not found for this user",
      };
    }

    return {
      success: true,
      researcher: researcher[0],
    };
  } catch (error) {
    console.error("Get current researcher error:", error);
    return {
      success: false,
      error: "Failed to get researcher details",
    };
  }
}

export async function getNonResearchers() {
  // try {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      affiliation: users.affiliation,
    })
    .from(users)
    .leftJoin(researchers, eq(users.id, researchers.userId))
    .orderBy(users.name);
  // } catch (error) {
  //   console.error(error);
  // }
}

export async function getUserStats() {
  try {
    // Get authenticated user
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return {
        success: false as const,
        error: "User not authenticated",
      };
    }

    // Get user's researcher profile (if exists)
    const userResearcher = await db
      .select({ id: researchers.id })
      .from(researchers)
      .where(eq(researchers.userId, user.id))
      .limit(1);

    const researcherId = userResearcher[0]?.id;

    if (!researcherId) {
      // User doesn't have a researcher profile, return zeros
      return {
        success: true as const,
        data: {
          publicationCount: 0,
          totalCitations: 0,
          videoCount: 0,
        },
      };
    }

    // Get publication count and total citations for the user
    // This counts publications where the user is an author (through their researcher profile)
    const publicationStatsResult = await db
      .select({
        publicationCount: sql<number>`COUNT(DISTINCT ${publications.id})::int`,
        totalCitations: sql<number>`COALESCE(SUM(${publications.citationCount}), 0)::int`,
      })
      .from(publications)
      .innerJoin(
        publicationAuthors,
        eq(publications.id, publicationAuthors.publicationId)
      )
      .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
      .where(
        and(
          eq(authors.researcherId, researcherId),
          isNotNull(publications.id) // Ensure we're counting valid publications
        )
      );

    // Get video count for the user
    // This counts videos where the user is an author (through their researcher profile)
    const videoStatsResult = await db
      .select({
        videoCount: sql<number>`COUNT(DISTINCT ${videos.id})::int`,
      })
      .from(videos)
      .innerJoin(videoAuthors, eq(videos.id, videoAuthors.videoId))
      .innerJoin(authors, eq(videoAuthors.authorId, authors.id))
      .where(
        and(
          eq(authors.researcherId, researcherId),
          isNotNull(videos.id) // Ensure we're counting valid videos
        )
      );

    const publicationStats = publicationStatsResult[0] || {
      publicationCount: 0,
      totalCitations: 0,
    };
    const videoStats = videoStatsResult[0] || { videoCount: 0 };

    return {
      success: true as const,
      data: {
        publicationCount: publicationStats.publicationCount,
        totalCitations: publicationStats.totalCitations,
        videoCount: videoStats.videoCount,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false as const,
      error: "Failed to fetch user statistics",
    };
  }
}
