"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { CACHED_VIDEOS } from "@/config/constants";
import { db } from "@/db";
import { authors, researchers } from "@/db/schema";
import { env } from "@/env";
import { isRoleAllowed } from "@/lib/utils";

import { videoAuthors, videos } from "@/db/schema";
import { createVideoSchema } from "@/lib/validations/videos";

const videoSchema = createVideoSchema.extend({
  youtubeId: z.string().min(1, "YouTube ID is required"),
});

type VideoPayload = z.infer<typeof videoSchema>;

type YouTubeVideoData = {
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
  language?: string;
  captions: boolean;
  definition?: string;
};

// YouTube API response types
interface YouTubeApiResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      channelTitle: string;
      defaultAudioLanguage: string;
      thumbnails: {
        high: { url: string };
        maxres?: { url: string };
      };
    };
    contentDetails: {
      duration: string; // ISO 8601 duration format (e.g., "PT4M13S")
      dimension: string;
      definition: string;
    };
    statistics: {
      viewCount: string;
      likeCount?: string;
      commentCount?: string;
    };
  }[];
}

interface YouTubeCaptionsResponse {
  items: {
    id: string;
    snippet: {
      language: string;
      name: string;
    };
  }[];
}

/**
 * Fetches YouTube video data using the YouTube Data API v3
 *
 * To use this function, you need to:
 * 1. Get a YouTube Data API key from Google Cloud Console
 * 2. Enable the YouTube Data API v3
 * 3. Add the API key to your environment variables as YOUTUBE_API_KEY
 *
 * @param videoId - The YouTube video ID (extracted from URL)
 * @returns Promise<YouTubeVideoData | null>
 */
export async function getYouTubeVideoData(
  videoId: string
): Promise<YouTubeVideoData | null> {
  try {
    const apiKey = env.YOUTUBE_API_KEY;
    // if (!apiKey) {
    //   console.error("YouTube API key not found in environment variables");
    //   return null;
    // }

    // Fetch video details
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
        new URLSearchParams({
          id: videoId,
          part: "snippet,contentDetails,statistics",
          key: apiKey,
        }).toString(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Cache for 1 hour
        next: { revalidate: 3600 },
      }
    );

    // console.log({ videoResponse });

    if (!videoResponse.ok) {
      console.error("Failed to fetch video data:", videoResponse.statusText);
      return null;
    }

    const videoData: YouTubeApiResponse = await videoResponse.json();

    // console.log({ videoData });

    if (!videoData.items || videoData.items.length === 0) {
      console.error("No video found with ID:", videoId);
      return null;
    }

    const video = videoData.items[0];

    // console.log({ video });

    // Check for captions
    let hasCaptions = false;
    try {
      const captionsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/captions?` +
          new URLSearchParams({
            videoId: videoId,
            part: "snippet",
            key: apiKey,
          }).toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Cache for 1 hour
          next: { revalidate: 3600 },
        }
      );

      if (captionsResponse.ok) {
        const captionsData: YouTubeCaptionsResponse =
          await captionsResponse.json();
        hasCaptions = captionsData.items && captionsData.items.length > 0;
        // console.log("caption data: ", captionsData.items);
      }
    } catch (error) {
      console.warn("Failed to fetch captions info:", error);
      // Don't fail the entire request if captions check fails
    }

    // Get the best thumbnail URL
    const thumbnailUrl =
      video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url;

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      thumbnailUrl,
      viewCount: parseInt(video.statistics.viewCount) || 0,
      likeCount: parseInt(video.statistics.likeCount || "0") || 0,
      commentCount: parseInt(video.statistics.commentCount || "0") || 0,
      channelTitle: video.snippet.channelTitle,
      language: video.snippet.defaultAudioLanguage,
      definition: video.contentDetails.definition,
      captions: hasCaptions,
    };
  } catch (error) {
    console.error("Error fetching YouTube video data:", error);
    return null;
  }
}

export async function createVideo(data: VideoPayload) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You are no user and definitely not a researcher",
      };
    }
    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You are no user and definitely not a researcher",
      };
    }

    const creatorId = user.id;

    const validation = videoSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid video data",
        details: validation.error.errors,
      };
    }

    const validatedData = validation.data;

    // Validate author order uniqueness
    const orderValues = validatedData.authors?.map((a) => a.order);
    const uniqueOrders = new Set(orderValues);
    if (orderValues && orderValues.length !== uniqueOrders.size) {
      return {
        success: false,
        error: "Invalid author data",
        details: "Author order values must be unique",
      };
    }

    // Check for duplicate videos
    const duplicateCheck = await db
      .select({
        id: videos.id,
        title: videos.title,
        youtubeUrl: videos.youtubeUrl,
      })
      .from(videos)
      .where(eq(videos.youtubeId, validatedData.youtubeId))
      .limit(1);

    if (duplicateCheck && duplicateCheck.length > 0) {
      return {
        success: false,
        error: "Duplicate youTube ID detected",
        details: `A video with ID "${validatedData.youtubeId}" already exists`,
        duplicateId: duplicateCheck[0].id,
      };
    }

    const result = await db.transaction(async (tx) => {
      // **ADDITIONAL SAFETY CHECK: Recheck for duplicates within transaction**
      // This prevents race conditions where two requests might pass the initial check
      const txDuplicateCheck = await db
        .select({
          id: videos.id,
          title: videos.title,
          youtubeUrl: videos.youtubeUrl,
        })
        .from(videos)
        .where(eq(videos.youtubeId, validatedData.youtubeId))
        .limit(1);

      if (txDuplicateCheck.length > 0)
        throw new Error(`Duplicate video detected: ${validatedData.youtubeId}`);

      // Create video record
      const [newVideo] = await tx
        .insert(videos)
        .values({
          title: validatedData.title,
          youtubeUrl: validatedData.youtubeUrl,
          youtubeId: validatedData.youtubeId,
          publishedAt: new Date(validatedData.publishedAt),
          recordedAt: validatedData.recordedAt
            ? new Date(validatedData.recordedAt)
            : undefined,
          description: validatedData.description,
          category: validatedData.category,
          series: validatedData.series,
          creatorId: validatedData.creatorId || creatorId,
          metadata: validatedData.metadata,
          isPublic: validatedData.isPublic,
          isFeatured: validatedData.isFeatured,
        })
        .returning();

      if (validatedData.authors && validatedData.authors.length > 0) {
        // process authors
        const authorInsertPromises = validatedData.authors.map(
          async (authorData) => {
            let authorId = authorData.id;

            // If author ID provided, verify it exists
            if (authorId) {
              const existingAuthor = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.id, authorId))
                .limit(1);

              if (existingAuthor.length === 0) {
                throw new Error(`Author with ID ${authorId} not found`);
              }
            } else {
              // No author ID provided, find or create the author
              let existingAuthor = null;

              // Normalize empty strings to null for ORCID
              const normalizedOrcid = authorData.orcid?.trim() || null;
              const normalizedEmail = authorData.email?.trim() || null;
              const researcherId = authorData.researcherId || null;

              // FIRST: Check by researcherId if provided (internal researcher scenario)
              if (researcherId) {
                const researcherResults = await tx
                  .select({ id: authors.id })
                  .from(authors)
                  .where(eq(authors.researcherId, researcherId))
                  .limit(1);

                if (researcherResults.length > 0) {
                  existingAuthor = researcherResults[0];
                }
              }

              // SECOND: Check by email if provided and no previous matches
              if (!existingAuthor && normalizedEmail) {
                const emailResults = await tx
                  .select({ id: authors.id })
                  .from(authors)
                  .where(eq(authors.email, normalizedEmail))
                  .limit(1);

                if (emailResults.length > 0) {
                  existingAuthor = emailResults[0];
                }
              }

              // THIRD: Check by ORCID if provided and no researcher match
              if (!existingAuthor && normalizedOrcid) {
                const orcidResults = await tx
                  .select({ id: authors.id })
                  .from(authors)
                  .where(eq(authors.orcid, normalizedOrcid))
                  .limit(1);

                if (orcidResults.length > 0) {
                  existingAuthor = orcidResults[0];
                }
              }

              // If author exists, use existing ID
              if (existingAuthor) {
                authorId = existingAuthor.id;
              } else {
                // Create new author record with normalized data
                try {
                  const [newAuthor] = await tx
                    .insert(authors)
                    .values({
                      name: authorData.name.trim(),
                      email: normalizedEmail,
                      affiliation: authorData.affiliation?.trim() || null,
                      orcid: normalizedOrcid,
                      researcherId: researcherId,
                    })
                    .returning({ id: authors.id });

                  authorId = newAuthor.id;
                } catch (dbError) {
                  // Handle potential race condition where author was created between check and insert
                  if (
                    dbError instanceof Error &&
                    dbError.message.includes("duplicate key")
                  ) {
                    // Try one more time to find the author by researcherId first, then ORCID/email
                    if (researcherId) {
                      const retryResearcher = await tx
                        .select({ id: authors.id })
                        .from(authors)
                        .where(eq(authors.researcherId, researcherId))
                        .limit(1);
                      if (retryResearcher.length > 0) {
                        authorId = retryResearcher[0].id;
                      }
                    } else if (normalizedEmail) {
                      const retryEmail = await tx
                        .select({ id: authors.id })
                        .from(authors)
                        .where(eq(authors.email, normalizedEmail))
                        .limit(1);
                      if (retryEmail.length > 0) {
                        authorId = retryEmail[0].id;
                      }
                    } else if (normalizedOrcid) {
                      const retryOrcid = await tx
                        .select({ id: authors.id })
                        .from(authors)
                        .where(eq(authors.orcid, normalizedOrcid))
                        .limit(1);
                      if (retryOrcid.length > 0) {
                        authorId = retryOrcid[0].id;
                      }
                    }

                    if (!authorId) {
                      throw dbError; // Re-throw if we still can't find the author
                    }
                  } else {
                    throw dbError;
                  }
                }
              }
            }

            revalidateTag(CACHED_VIDEOS);

            return {
              authorId,
              authorData,
            };
          }
        );

        // Wait for all author processing to complete
        const processedAuthors = await Promise.all(authorInsertPromises);

        // Create video-author relationships
        const videoAuthorData = processedAuthors.map(
          ({ authorId, authorData }) => ({
            videoId: newVideo.id,
            authorId,
            order: authorData.order,
            role: authorData.role ?? null,
          })
        );

        // Sort by order to ensure consistent insertion
        videoAuthorData.sort((a, b) => a.order - b.order);

        await tx.insert(videoAuthors).values(videoAuthorData);
      }
      return newVideo;
    });

    revalidatePath("/portal");
    revalidatePath("/portal/videos");
    // Return success response with the created video
    return {
      success: true,
      video: result,
    };
  } catch (error) {
    console.error("Failed to create video:", error);

    // Handle specific database constraint errors
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("Duplicate video detected")
      ) {
        return {
          success: false,
          error: "A video with similar details already exists",
          details: error.message,
        };
      }

      if (error.message.includes("violates check constraint")) {
        return {
          success: false,
          error: "Invalid data format. Please check youtubeUrl field",
        };
      }

      if (error.message.includes("not found")) {
        return {
          success: false,
          error: "Referenced author not found",
          details: error.message,
        };
      }

      if (error.message.includes("Author order")) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    return {
      success: false as const,
      error: "Failed to create video",
    };
  }
}

export async function updateVideoViewCount(videoId: string) {
  try {
    await db
      .update(videos)
      .set({
        viewCount: sql`${videos.viewCount} + 1`,
        lastMetricsUpdate: new Date(),
      })
      .where(eq(videos.youtubeId, videoId));

    // Revalidate the videos cache
    revalidateTag(CACHED_VIDEOS);

    return { success: true };
  } catch (error) {
    console.error("Failed to update video view count:", error);
    return { success: false, error: "Failed to update view count" };
  }
}

export async function deleteVideo(videoId: string) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User does not have permission to delete videos",
      };
    }

    const userId = user.id;

    // Validate video ID
    if (!videoId || typeof videoId !== "string") {
      return {
        success: false,
        error: "Invalid video ID",
        details: "Video ID is required and must be a valid string",
      };
    }

    // Get the user's author ID via researchers table
    const userAuthor = await db
      .select({ authorId: authors.id })
      .from(authors)
      .leftJoin(researchers, eq(authors.researcherId, researchers.id))
      .where(eq(researchers.userId, userId))
      .limit(1);

    const authorId = userAuthor[0]?.authorId;

    // Check if video exists and verify permissions
    const videoQuery = await db
      .select({
        id: videos.id,
        title: videos.title,
        creatorId: videos.creatorId,
        userOrder: videoAuthors.order,
        minAuthorOrder:
          sql<number>`MIN(${videoAuthors.order}) OVER (PARTITION BY ${videos.id})`.as(
            "minAuthorOrder"
          ),
      })
      .from(videos)
      .leftJoin(
        videoAuthors,
        and(
          eq(videoAuthors.videoId, videos.id),
          authorId ? eq(videoAuthors.authorId, authorId) : sql`false`
        )
      )
      .where(eq(videos.id, videoId))
      .limit(1);

    if (videoQuery.length === 0) {
      return {
        success: false,
        error: "Video not found",
        details: "Video does not exist or you don't have access to it",
      };
    }

    const video = videoQuery[0];

    // Check deletion permissions:
    // 1. User is admin OR
    // 2. User is the creator OR
    // 3. User is the lead author (lowest order number)
    const isCreator = video.creatorId === userId;
    const isLeadAuthor =
      video.userOrder !== null && video.userOrder === video.minAuthorOrder;

    const canDelete = user.role === "admin" || isCreator || isLeadAuthor;

    if (!canDelete) {
      return {
        success: false,
        error: "Insufficient permissions",
        details:
          "You can only delete videos you created or where you are the lead author",
      };
    }

    // Start transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Delete video-author relationships first (foreign key constraint)
      await tx.delete(videoAuthors).where(eq(videoAuthors.videoId, videoId));

      // Delete research area associations if they exist
      // TODO: Add research area deletion when implemented
      // await tx
      //   .delete(videoResearchAreas)
      //   .where(eq(videoResearchAreas.videoId, videoId));

      // Finally, delete the video
      const deletedVideo = await tx
        .delete(videos)
        .where(eq(videos.id, videoId))
        .returning({
          id: videos.id,
          title: videos.title,
        });

      if (deletedVideo.length === 0) {
        throw new Error("Failed to delete video");
      }

      return deletedVideo[0];
    });

    // Revalidate relevant paths and tags
    revalidateTag(CACHED_VIDEOS);
    revalidatePath("/portal");
    revalidatePath("/portal/videos");

    return {
      success: true,
      message: `Video "${result.title}" deleted successfully`,
      deletedVideo: {
        id: result.id,
        title: result.title,
      },
    };
  } catch (error) {
    console.error("Video deletion error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return {
          success: false,
          error: "Cannot delete video",
          details: "Video has associated data that must be removed first",
        };
      }

      if (error.message.includes("not found")) {
        return {
          success: false,
          error: "Video not found",
          details: "The video may have already been deleted",
        };
      }
    }

    return {
      success: false,
      error: "Failed to delete video",
      details: "An unexpected error occurred while deleting the video",
    };
  }
}

// Optional: Bulk delete function for multiple videos
export async function deleteMultipleVideos(videoIds: string[]) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User does not have permission to delete videos",
      };
    }

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return {
        success: false,
        error: "Invalid input",
        details: "Video IDs must be a non-empty array",
      };
    }

    const results = [];
    const errors = [];

    // Process each video individually to maintain proper permission checks
    for (const videoId of videoIds) {
      const result = await deleteVideo(videoId);
      if (result.success) {
        results.push(result.deletedVideo);
      } else {
        errors.push({
          videoId,
          error: result.error,
          details: result.details,
        });
      }
    }

    return {
      success: errors.length === 0,
      deletedCount: results.length,
      deletedVideos: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${results.length} video(s)${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    };
  } catch (error) {
    console.error("Bulk video deletion error:", error);
    return {
      success: false,
      error: "Failed to delete videos",
      details: "An unexpected error occurred during bulk deletion",
    };
  }
}
