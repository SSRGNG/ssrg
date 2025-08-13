import "server-only";

import { and, desc, eq, isNotNull, like, or } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { FileCategory, ImageFilters } from "@/types";

/**
 * Unified function to get images based on flexible filters
 */
export async function getImages(filters: ImageFilters = {}) {
  const {
    categories,
    userId,
    publicOnly,
    includeResearch,
    customWhere,
    // limit
  } = filters;

  const conditions = [];
  conditions.push(
    // Always filter for images only
    like(files.mimeType, "image/%"),
    // Has UploadThing URL (excludes legacy files)
    isNotNull(files.uploadthingUrl)
  );

  // Build category conditions
  const categoryConditions = [];

  if (categories && categories.length > 0) {
    categoryConditions.push(
      or(...categories.map((cat) => eq(files.category, cat)))
    );
  }

  if (includeResearch) {
    categoryConditions.push(
      or(
        eq(files.category, "research_image"),
        and(eq(files.category, "general"), eq(files.isPublic, true))
      )
    );
  }

  // Add category conditions if any exist
  if (categoryConditions.length > 0) {
    conditions.push(
      categoryConditions.length === 1
        ? categoryConditions[0]
        : or(...categoryConditions)
    );
  }

  // Add user filter
  if (userId) {
    conditions.push(eq(files.uploadedBy, userId));
  }

  // Add public filter
  if (publicOnly) {
    conditions.push(eq(files.isPublic, true));
  }

  // Add custom conditions
  if (customWhere) {
    conditions.push(customWhere);
  }

  const images = await db
    .select({
      id: files.id,
      url: files.uploadthingUrl,
      name: files.originalName,
      uploadedAt: files.created_at,
      category: files.category,
      altText: files.altText,
      caption: files.caption,
      size: files.size,
      mimeType: files.mimeType,
    })
    .from(files)
    .where(and(...conditions))
    .orderBy(desc(files.created_at));
  // .limit(limit);

  return images.map((img) => ({
    ...img,
    url: img.url || "", // Fallback to empty string if null
    uploadedAt: img.uploadedAt || new Date(),
  }));
}
/**
 * Get images for the research area gallery
 * Filters for research images and general images that are public
 */
export async function getResearchImages() {
  return getImages({ includeResearch: true });
}

/**
 * Get all images uploaded by a specific user
 */
export async function getUserImages(userId: string) {
  return getImages({ userId });
}

export async function getProfileImages() {
  return getImages({ categories: ["profile_picture"] });
}

/**
 * Get images by category
 */
export async function getImagesByCategory(category: FileCategory) {
  return getImages({ categories: [category] });
}

/**
 * Get public images
 */
export async function getPublicImages() {
  return getImages({ publicOnly: true });
}

/**
 * Get images by multiple categories
 */
export async function getImagesByCategories(categories: FileCategory[]) {
  return getImages({ categories });
}
// export async function getResearchImages() {
//   const images = await db
//     .select({
//       id: files.id,
//       url: files.uploadthingUrl,
//       name: files.originalName,
//       uploadedAt: files.created_at,
//       category: files.category,
//       altText: files.altText,
//       caption: files.caption,
//       size: files.size,
//       mimeType: files.mimeType,
//     })
//     .from(files)
//     .where(
//       and(
//         // Only images
//         like(files.mimeType, "image/%"),
//         // Research images OR public general images
//         or(
//           eq(files.category, "research_image"),
//           and(eq(files.category, "general"), eq(files.isPublic, true))
//         ),
//         // Has UploadThing URL (excludes legacy files)
//         isNotNull(files.uploadthingUrl)
//       )
//     )
//     .orderBy(desc(files.created_at));

//   return images.map((img) => ({
//     ...img,
//     url: img.url || "", // Fallback to empty string if null
//     uploadedAt: img.uploadedAt || new Date(),
//   }));
// }

/**
 * Get all images uploaded by a specific user
 */
// export async function getUserImages(userId: string) {
//   const images = await db
//     .select({
//       id: files.id,
//       url: files.uploadthingUrl,
//       name: files.originalName,
//       uploadedAt: files.created_at,
//       category: files.category,
//       altText: files.altText,
//       caption: files.caption,
//       size: files.size,
//       mimeType: files.mimeType,
//     })
//     .from(files)
//     .where(
//       and(
//         eq(files.uploadedBy, userId),
//         like(files.mimeType, "image/%"),
//         isNotNull(files.uploadthingUrl)
//       )
//     )
//     .orderBy(desc(files.created_at));

//   return images.map((img) => ({
//     ...img,
//     url: img.url || "",
//     uploadedAt: img.uploadedAt || new Date(),
//   }));
// }

/**
 * Get images by category
 */
// export async function getImagesByCategory(category: FileCategory) {
//   const images = await db
//     .select({
//       id: files.id,
//       url: files.uploadthingUrl,
//       name: files.originalName,
//       uploadedAt: files.created_at,
//       category: files.category,
//       altText: files.altText,
//       caption: files.caption,
//       size: files.size,
//       mimeType: files.mimeType,
//     })
//     .from(files)
//     .where(
//       and(
//         eq(files.category, category),
//         like(files.mimeType, "image/%"),
//         isNotNull(files.uploadthingUrl)
//       )
//     )
//     .orderBy(desc(files.created_at));

//   return images.map((img) => ({
//     ...img,
//     url: img.url || "",
//     uploadedAt: img.uploadedAt || new Date(),
//   }));
// }
