import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { appConfig } from "@/config";
import { db } from "@/db";
import { researchers, users, videoResearchers, videos } from "@/db/schema";
import {
  videoQuerySchema,
  type VideoQueryInput,
} from "@/lib/validations/params";

// Query 1: Get all videos (for public publications/videos page)
export async function getAllVideos(params: VideoQueryInput = {}) {
  const validatedParams = videoQuerySchema.parse(params);
  const {
    page,
    limit,
    search,
    category,
    series,
    creatorId,
    researcherId,
    isPublic,
    isFeatured,
    publishedAfter,
    publishedBefore,
    sortBy,
    sortOrder,
  } = validatedParams;

  const offset = (page - 1) * limit;

  // Apply filters
  const conditions = [];

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

  if (researcherId) {
    conditions.push(eq(videoResearchers.researcherId, researcherId));
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

  // Apply pagination
  const results = await db
    .select({
      ...getTableColumns(videos),
      // Creator info
      creatorName: users.name,
      creatorEmail: users.email,
      // Total count using window function
      totalCount: sql<number>`count(*) over()`,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    .leftJoin(videoResearchers, eq(videos.id, videoResearchers.videoId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  //  const countQuery = db
  //   .select({ count: count() })
  //   .from(videos)
  //   .leftJoin(videoResearchers, eq(videos.id, videoResearchers.videoId))
  //   .where(conditions.length > 0 ? and(...conditions) : undefined);

  // const [{ count: totalCount }] = await countQuery;

  // Extract total count from first result (all rows will have the same count)
  const totalCount = results.length > 0 ? results[0].totalCount : 0;

  return {
    videos: results,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

// Query 2: Get videos where user is creator or researcher (for dashboard)
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

  // First get the user's researcher ID if they are a researcher
  const userResearcher = await db
    .select({ researcherId: researchers.id })
    .from(researchers)
    .where(eq(researchers.userId, userId))
    .limit(1);

  const researcherId = userResearcher[0]?.researcherId;

  // Build all conditions first
  const conditions = [];

  // Base permission condition - user must be creator or researcher
  const basePermissionConditions = [eq(videos.creatorId, userId)];

  if (researcherId) {
    basePermissionConditions.push(
      eq(videoResearchers.researcherId, researcherId)
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
      userRole: videoResearchers.role,
      userOrder: videoResearchers.order,
      // Total count using window function
      totalCount: sql<number>`count(*) over()`,
    })
    .from(videos)
    .leftJoin(users, eq(videos.creatorId, users.id))
    // .leftJoin(videoResearchers, eq(videos.id, videoResearchers.videoId))
    .leftJoin(
      videoResearchers,
      and(
        eq(videos.id, videoResearchers.videoId),
        researcherId
          ? eq(videoResearchers.researcherId, researcherId)
          : sql`false`
      )
    )
    .where(and(...conditions))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // Transform results to include permission calculations
  const videosWithPermissions = results.map((video) => {
    const isCreator = video.isCreator;
    const isResearcher = video.userRole !== null;
    const isLeadResearcher = video.userOrder === 0;

    return {
      ...video,
      // Permission flags
      canView: isCreator || isResearcher,
      canEdit: isCreator || isResearcher,
      canDelete: isCreator || isLeadResearcher,
      role: isCreator ? "creator" : video.userRole,
      isCreator,
      isResearcher,
      isLeadResearcher,
    };
  });

  // Get total count for pagination using the same conditions
  // const countQuery = db
  //   .select({ count: count() })
  //   .from(videos)
  //   // .leftJoin(videoResearchers, eq(videos.id, videoResearchers.videoId))
  //   .leftJoin(
  //     videoResearchers,
  //     and(
  //       eq(videos.id, videoResearchers.videoId),
  //       researcherId ? eq(videoResearchers.researcherId, researcherId) : sql`false`
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

  // Get all researchers for this video
  const videoResearchersList = await db
    .select({
      researcherId: videoResearchers.researcherId,
      role: videoResearchers.role,
      order: videoResearchers.order,
      researcherName: users.name,
      researcherEmail: users.email,
      researcherTitle: researchers.title,
      researcherBio: researchers.bio,
    })
    .from(videoResearchers)
    .leftJoin(researchers, eq(videoResearchers.researcherId, researchers.id))
    .leftJoin(users, eq(researchers.userId, users.id))
    .where(eq(videoResearchers.videoId, videoId))
    .orderBy(asc(videoResearchers.order));

  return {
    ...video[0],
    researchers: videoResearchersList,
  };
}

// Helper function to check user permissions for a video
export async function getUserVideoPermissions(videoId: string, userId: string) {
  // First get the user's researcher ID if they are a researcher
  const userResearcher = await db
    .select({ researcherId: researchers.id })
    .from(researchers)
    .where(eq(researchers.userId, userId))
    .limit(1);

  const researcherId = userResearcher[0]?.researcherId;

  const result = await db
    .select({
      isCreator: sql<boolean>`${videos.creatorId} = ${userId}`,
      researcherRole: videoResearchers.role,
      researcherOrder: videoResearchers.order,
    })
    .from(videos)
    .leftJoin(
      videoResearchers,
      and(
        eq(videos.id, videoResearchers.videoId),
        researcherId
          ? eq(videoResearchers.researcherId, researcherId)
          : sql`false`
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

  const { isCreator, researcherRole, researcherOrder } = result[0];
  const isResearcher = researcherRole !== null;
  const isLeadResearcher = researcherOrder === 0;

  return {
    canView: isCreator || isResearcher,
    canEdit: isCreator || isResearcher,
    canDelete: isCreator || isLeadResearcher,
    role: isCreator ? "creator" : researcherRole,
    isCreator,
    isResearcher,
    isLeadResearcher,
  };
}
