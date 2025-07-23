"use server";

import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "@/db";
import { files } from "@/db/schema";
import { getResearchImages as queryGetResearchImages } from "@/lib/queries/files";
import { FileCategory } from "@/types";

export async function getResearchImages() {
  return queryGetResearchImages();
}
const utapi = new UTApi({});

// export async function getResearchImages() {
//   const { getResearchImages: queryGetResearchImages } = await import("@/lib/queries/files");
//   return queryGetResearchImages();
// }

/**
 * Update image metadata (alt text, caption, etc.)
 */
export async function updateImageMetadata(
  fileId: string,
  updates: {
    altText?: string;
    caption?: string;
    category?: FileCategory;
    tags?: string;
    isPublic?: boolean;
  }
) {
  const [updatedFile] = await db
    .update(files)
    .set({
      ...updates,
      updated_at: new Date(),
    })
    .where(eq(files.id, fileId))
    .returning();

  return updatedFile;
}

/**
 * Delete a file from both database and UploadThing
 */
export async function deleteFile(uploadthingKey: string) {
  // Delete from database first
  await db.delete(files).where(eq(files.uploadthingKey, uploadthingKey));

  // Delete from UploadThing using their API
  await utapi.deleteFiles([uploadthingKey]);

  return { success: true };
}
