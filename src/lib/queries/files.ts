import "server-only";

import { and, desc, eq, isNotNull, like, or } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { FileCategory } from "@/types";

/**
 * Get images for the research area gallery
 * Filters for research images and general images that are public
 */
export async function getResearchImages() {
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
    .where(
      and(
        // Only images
        like(files.mimeType, "image/%"),
        // Research images OR public general images
        or(
          eq(files.category, "research_image"),
          and(eq(files.category, "general"), eq(files.isPublic, true))
        ),
        // Has UploadThing URL (excludes legacy files)
        isNotNull(files.uploadthingUrl)
      )
    )
    .orderBy(desc(files.created_at));

  return images.map((img) => ({
    ...img,
    url: img.url || "", // Fallback to empty string if null
    uploadedAt: img.uploadedAt || new Date(),
  }));
}

/**
 * Get all images uploaded by a specific user
 */
export async function getUserImages(userId: string) {
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
    .where(
      and(
        eq(files.uploadedBy, userId),
        like(files.mimeType, "image/%"),
        isNotNull(files.uploadthingUrl)
      )
    )
    .orderBy(desc(files.created_at));

  return images.map((img) => ({
    ...img,
    url: img.url || "",
    uploadedAt: img.uploadedAt || new Date(),
  }));
}

/**
 * Get images by category
 */
export async function getImagesByCategory(category: FileCategory) {
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
    .where(
      and(
        eq(files.category, category),
        like(files.mimeType, "image/%"),
        isNotNull(files.uploadthingUrl)
      )
    )
    .orderBy(desc(files.created_at));

  return images.map((img) => ({
    ...img,
    url: img.url || "",
    uploadedAt: img.uploadedAt || new Date(),
  }));
}
