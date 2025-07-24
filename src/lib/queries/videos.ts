import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  exists,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { appConfig } from "@/config";
import { CACHED_VIDEOS } from "@/config/constants";
import { db } from "@/db";
import { authors, researchers, users, videoAuthors, videos } from "@/db/schema";
import {
  videoQuerySchema,
  type VideoQueryInput,
} from "@/lib/validations/params";

export async function getVideoByYoutubeId(youtubeId: string) {
  try {
    const video = await db.query.videos.findFirst({
      where: eq(videos.youtubeId, youtubeId),
      with: {
        authors: {
          columns: { order: true, role: true },
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
                  columns: { id: true, title: true, orcid: true },
                },
              },
            },
          },
          orderBy: (a, { asc }) => [asc(a.order)],
        },
        // Add any relations you want to include
      },
    });

    if (!video) {
      throw new Error(`Video with YouTubeID ${youtubeId} not found`);
    }
    return video;
  } catch (error) {
    throw error;
  }
}

// Get all videos (for public publications/videos page)
export async function getVideos(params: VideoQueryInput = {}) {
  const validatedParams = videoQuerySchema.parse(params);
  const {
    page,
    limit,
    search,
    category,
    series,
    creatorId,
    authorId,
    isPublic,
    isFeatured,
    filterByAcademics,
    publishedAfter,
    publishedBefore,
    sortBy,
    sortOrder,
  } = validatedParams;

  const offset = (page - 1) * limit;

  // Apply filters
  const conditions = [];

  conditions.push(eq(videos.isPublic, isPublic));

  if (search) {
    const searchPattern = `%${search.trim()}%`;
    conditions.push(
      or(
        ilike(videos.title, searchPattern),
        ilike(videos.description, searchPattern)
      )
    );
  }

  if (category) {
    conditions.push(eq(videos.category, category));
  }

  if (series) {
    conditions.push(eq(videos.series, series));
  }

  if (creatorId) {
    conditions.push(eq(videos.creatorId, creatorId));
  }

  if (authorId) {
    conditions.push(
      exists(
        db
          .select()
          .from(videoAuthors)
          .where(
            and(
              eq(videoAuthors.videoId, videos.id),
              eq(videoAuthors.authorId, authorId)
            )
          )
      )
    );
  }

  if (isFeatured !== undefined) {
    conditions.push(eq(videos.isFeatured, isFeatured));
  }

  if (filterByAcademics) {
    conditions.push(
      exists(
        db
          .select()
          .from(videoAuthors)
          .innerJoin(authors, eq(videoAuthors.authorId, authors.id))
          .innerJoin(researchers, eq(authors.researcherId, researchers.id))
          .where(eq(videoAuthors.videoId, videos.id))
      )
    );
  }

  if (publishedAfter) {
    conditions.push(sql`${videos.publishedAt} >= ${publishedAfter}`);
  }

  if (publishedBefore) {
    conditions.push(sql`${videos.publishedAt} <= ${publishedBefore}`);
  }

  // Determine sort column - only allow specific sortable columns
  const sortableColumns = {
    publishedAt: videos.publishedAt,
    createdAt: videos.created_at,
    updatedAt: videos.updated_at,
    title: videos.title,
    category: videos.category,
    series: videos.series,
  } as const;

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] ||
    videos.publishedAt;
  const orderByClause =
    sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

  // Execute query with window function for total count
  const results = await db
    .select({
      ...getTableColumns(videos),
      creatorName: users.name,
      creatorEmail: users.email,
      authors: sql<
        Array<{
          id: string;
          name: string;
          email: string;
          affiliation: string;
          orcid: string;
          order: number;
          role: string;
        }>
      >`
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', a.id::text,
              'name', a.name,
              'email', a.email,
              'affiliation', a.affiliation,
              'orcid', a.orcid,
              'order', va.order,
              'role', va.role
            )
            ORDER BY va.order
          )
          FROM ${videoAuthors} va
          JOIN ${authors} a ON va.author_id = a.id
          WHERE va.video_id = ${videos.id}
          ), '[]'::json
        )
      `.as("authors"),
      // Total count using window function
      totalCount: sql<number>`count(*) over()`,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  const totalCount = results.length > 0 ? results[0].totalCount : 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    videos: results,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

// similar to getAllPublications
export async function getAllVideos(
  limit = Infinity,
  offset = 0,
  filterByAcademics = false,
  category?: VideoQueryInput["category"],
  series?: string
) {
  const whereConditions = [];

  // Add academics filter if needed
  if (filterByAcademics) {
    whereConditions.push(
      // Only videos where at least one author has a researcher profile
      exists(
        db
          .select()
          .from(videoAuthors)
          .innerJoin(authors, eq(videoAuthors.authorId, authors.id))
          .innerJoin(researchers, eq(authors.researcherId, researchers.id))
          .where(eq(videoAuthors.videoId, videos.id))
      )
    );
  }

  // Add category filter
  if (category) {
    whereConditions.push(eq(videos.category, category));
  }

  // Add series filter
  if (series) {
    whereConditions.push(eq(videos.series, series));
  }

  // Only show public videos
  whereConditions.push(eq(videos.isPublic, true));

  const results = await db.query.videos.findMany({
    with: {
      authors: {
        columns: {
          role: true,
          order: true,
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
                columns: { id: true, title: true, orcid: true },
              },
            },
          },
        },
        orderBy: (a, { asc }) => [asc(a.order)],
      },
    },
    orderBy: (v, { desc }) => [desc(v.publishedAt)], // Most recent first
    limit: limit === Infinity ? undefined : limit,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
  });

  return results.map((video) => ({
    ...video,
    authors: video.authors.map(({ role, order, author }) => ({
      role,
      order,
      name: author.name,
      email: author.email,
      affiliation: author.affiliation,
      orcid: author.orcid,
      researcher: author.researcher || null,
    })),
  }));
}

// Get videos where user is creator or researcher (for dashboard)
export async function getUserVideos(params: VideoQueryInput = {}) {
  const validatedParams = videoQuerySchema.parse(params);
  const {
    page,
    limit,
    search,
    category,
    series,
    isPublic,
    isFeatured,
    publishedAfter,
    publishedBefore,
    sortBy,
    sortOrder,
  } = validatedParams;

  const offset = (page - 1) * limit;

  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);

  // Get the user's author ID via researchers table
  const userAuthor = await db
    .select({ authorId: authors.id })
    .from(authors)
    .leftJoin(researchers, eq(authors.researcherId, researchers.id))
    .where(eq(researchers.userId, userId))
    .limit(1);

  const authorId = userAuthor[0]?.authorId;

  // Build all conditions first
  const conditions = [];

  // Base permission condition - user must be creator or associated author
  const basePermissionConditions = [eq(videos.creatorId, userId)];
  // if (authorId) {
  //   basePermissionConditions.push(eq(videoAuthors.authorId, authorId));
  // }
  if (authorId) {
    basePermissionConditions.push(
      exists(
        db
          .select()
          .from(videoAuthors)
          .where(
            and(
              eq(videoAuthors.videoId, videos.id),
              eq(videoAuthors.authorId, authorId)
            )
          )
      )
    );
  }

  const basePermissionCondition = or(...basePermissionConditions);
  conditions.push(basePermissionCondition);

  // Additional filters
  if (search) {
    conditions.push(
      or(
        ilike(videos.title, `%${search}%`),
        ilike(videos.description, `%${search}%`)
      )
    );
  }

  if (category) {
    conditions.push(eq(videos.category, category));
  }

  if (series) {
    conditions.push(eq(videos.series, series));
  }

  if (isPublic !== undefined) {
    conditions.push(eq(videos.isPublic, isPublic));
  }

  if (isFeatured !== undefined) {
    conditions.push(eq(videos.isFeatured, isFeatured));
  }

  if (publishedAfter) {
    conditions.push(sql`${videos.publishedAt} >= ${publishedAfter}`);
  }

  if (publishedBefore) {
    conditions.push(sql`${videos.publishedAt} <= ${publishedBefore}`);
  }

  // Determine sort column - only allow specific sortable columns
  const sortableColumns = {
    publishedAt: videos.publishedAt,
    createdAt: videos.created_at,
    updatedAt: videos.updated_at,
    title: videos.title,
    category: videos.category,
    series: videos.series,
  } as const;

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] ||
    videos.publishedAt;
  const orderByClause =
    sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

  // Build and execute the main query in one chain
  const results = await db
    .select({
      // Video fields
      ...getTableColumns(videos),
      // Creator info
      creatorName: users.name,
      creatorEmail: users.email,
      // User permissions
      isCreator: sql<boolean>`${videos.creatorId} = ${userId}`,
      userRole: videoAuthors.role,
      userOrder: videoAuthors.order,
      // Total count using window function
      totalCount: sql<number>`count(*) over()`,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    .leftJoin(
      videoAuthors,
      and(
        eq(videos.id, videoAuthors.videoId),
        authorId ? eq(videoAuthors.authorId, authorId) : sql`false`
      )
    )
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // Transform results to include permission calculations
  const videosWithPermissions = results.map((video) => {
    const isCreator = video.isCreator;
    const isAuthor = video.userRole !== null;
    const isLeadAuthor = video.userOrder === 0;

    return {
      ...video,
      // Permission flags
      canView: isCreator || isAuthor,
      canEdit: isCreator || isAuthor,
      canDelete: isCreator || isLeadAuthor,
      role: isCreator ? "creator" : video.userRole,
      isCreator,
      isAuthor,
      isLeadAuthor,
    };
  });

  // Get total count for pagination using the same conditions
  // const countQuery = db
  //   .select({ count: count() })
  //   .from(videos)
  //   // .leftJoin(videoAuthors, eq(videos.id, videoAuthors.videoId))
  //   .leftJoin(
  //     videoAuthors,
  //     and(
  //       eq(videos.id, videoAuthors.videoId),
  //       authorId ? eq(videoAuthors.authorId, authorId) : sql`false`
  //     )
  //   )
  //   .where(and(...conditions));

  // const [{ count: totalCount }] = await countQuery;

  // Extract total count from first result (all rows will have the same count)
  const totalCount = results.length > 0 ? results[0].totalCount : 0;

  return {
    videos: videosWithPermissions,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

// Legacy wrapper for backward compatibility
export async function getPaginatedVideos(
  page: number = 1,
  pageSize: number = 10,
  filterByAcademics: boolean = false,
  category?: VideoQueryInput["category"],
  series?: string
) {
  const { videos: videoList, pagination } = await getVideos({
    page,
    limit: pageSize,
    filterByAcademics,
    category,
    series,
  });

  return {
    videos: videoList,
    pagination: {
      currentPage: pagination.page,
      pageSize: pagination.limit,
      totalCount: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
  };
}

// Helper function to get video with all researchers (for detailed view)
export async function getVideoWithResearchers(videoId: string) {
  const video = await db
    .select({
      ...getTableColumns(videos),
      // Creator info
      creatorName: users.name,
      creatorEmail: users.email,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    .where(eq(videos.id, videoId))
    .limit(1);

  if (!video.length) {
    return null;
  }

  // Get all authors for this video
  const videoAuthorsList = await db
    .select({
      authorId: videoAuthors.authorId,
      role: videoAuthors.role,
      order: videoAuthors.order,
      authorName: authors.name,
      authorEmail: authors.email,
      authorAffiliation: authors.affiliation,
      authorORCID: authors.orcid,
    })
    .from(videoAuthors)
    .leftJoin(authors, eq(videoAuthors.authorId, authors.id))
    .where(eq(videoAuthors.videoId, videoId))
    .orderBy(asc(videoAuthors.order));

  return {
    ...video[0],
    authors: videoAuthorsList,
  };
}

// Helper function to check user permissions for a video
export async function getUserVideoPermissions(videoId: string, userId: string) {
  // Get the user's author ID via researchers table
  const userAuthor = await db
    .select({ authorId: authors.id })
    .from(authors)
    .leftJoin(researchers, eq(authors.researcherId, researchers.id))
    .where(eq(researchers.userId, userId))
    .limit(1);

  const authorId = userAuthor[0]?.authorId;

  const result = await db
    .select({
      isCreator: sql<boolean>`${videos.creatorId} = ${userId}`,
      authorRole: videoAuthors.role,
      authorOrder: videoAuthors.order,
    })
    .from(videos)
    .leftJoin(
      videoAuthors,
      and(
        eq(videos.id, videoAuthors.videoId),
        authorId ? eq(videoAuthors.authorId, authorId) : sql`false`
      )
    )
    .where(eq(videos.id, videoId))
    .limit(1);

  if (!result.length) {
    return {
      canView: false,
      canEdit: false,
      canDelete: false,
      role: null,
    };
  }

  const { isCreator, authorRole, authorOrder } = result[0];
  const isAuthor = authorRole !== null;
  const isLeadAuthor = authorOrder === 0;

  return {
    canView: isCreator || isAuthor,
    canEdit: isCreator || isAuthor,
    canDelete: isCreator || isLeadAuthor,
    role: isCreator ? "creator" : authorRole,
    isCreator,
    isAuthor,
    isLeadAuthor,
  };
}

// export const getCachedPaginatedVideos = cache(
//   async (page: number = 1, limit: number = DEFAULT_PAGE_SIZE) =>
//     getVideos({ page, limit }),
//   ["videos-paginated"],
//   {
//     tags: [CACHED_VIDEOS],
//     revalidate: 60 * 60 * 24, // 24 hours for paginated data
//   }
// );

export const getCachedPaginatedVideos = cache(
  async (params: VideoQueryInput = {}) => getVideos(params),
  ["videos-paginated"],
  {
    tags: [CACHED_VIDEOS],
    revalidate: 60 * 60 * 24, // 24 hours for paginated data
  }
);

export const getCachedVideos = cache(
  async (params: VideoQueryInput = {}) => getVideos(params),
  [CACHED_VIDEOS],
  { tags: [CACHED_VIDEOS], revalidate: 60 * 60 * 72 } // 72 hours
);
