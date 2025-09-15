import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import type {
  ClientUploadedFileData,
  inferEndpointOutput,
} from "uploadthing/types";

import { auth } from "@/auth";
import { db } from "@/db";
import { files, researchers, users } from "@/db/schema";
import { FileCategory } from "@/types";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // General image uploader
  imageUploader: f({
    image: {
      maxFileSize: "512KB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "general" as FileCategory, // Default category
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Automatically save to database
        const [savedFile] = await db
          .insert(files)
          .values({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type || "image/*",
            size: file.size,
            path: file.key,
            url: file.ufsUrl,
            uploadthingKey: file.key,
            uploadthingUrl: file.ufsUrl,
            category: metadata.category,
            uploadedBy: metadata.userId,
            isPublic: false, // Default to private
          })
          .returning();

        console.log("File saved to database:", savedFile.id);

        return {
          uploadedBy: metadata.userId,
          fileId: savedFile.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save file to database:", error);
        // Don't throw here - file is already uploaded to UploadThing
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),

  // Research-specific image uploader
  researchImageUploader: f({
    image: {
      maxFileSize: "1024KB",
      maxFileCount: 3,
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "research_image" as FileCategory,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const [savedFile] = await db
          .insert(files)
          .values({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type || "image/*",
            size: file.size,
            path: file.key,
            url: file.ufsUrl,
            uploadthingKey: file.key,
            uploadthingUrl: file.ufsUrl,
            category: metadata.category,
            uploadedBy: metadata.userId,
            isPublic: true,
          })
          .returning();

        console.log("Research image saved to database:", savedFile.id);

        return {
          uploadedBy: metadata.userId,
          fileId: savedFile.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save research image to database:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),

  // Profile picture uploader
  profileImageUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "profile_picture" as FileCategory,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const result = await db.transaction(async (tx) => {
          const [userResearcher] = await db
            .select({ id: researchers.id })
            .from(researchers)
            .where(eq(researchers.userId, metadata.userId))
            .limit(1);

          const researcherId = userResearcher.id;

          await tx
            .update(users)
            .set({ image: file.ufsUrl })
            .where(eq(users.id, metadata.userId))
            .returning();

          const [savedFile] = await tx
            .insert(files)
            .values({
              filename: file.name,
              originalName: file.name,
              mimeType: file.type || "image/*",
              size: file.size,
              path: file.key,
              url: file.url,
              uploadthingKey: file.key,
              uploadthingUrl: file.url,
              category: metadata.category,
              uploadedBy: metadata.userId,
              researcherId: researcherId, // Link to researcher profile
              isPublic: false,
            })
            .returning();
          return { id: savedFile.id };
        });

        console.log("Profile image saved to database:", result.id);

        return {
          uploadedBy: metadata.userId,
          fileId: result.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save profile image to database:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),

  // Document uploader (for publications, datasets, etc.)
  documentUploader: f({
    pdf: { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "document" as FileCategory,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const [savedFile] = await db
          .insert(files)
          .values({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type || "application/pdf",
            size: file.size,
            path: file.key,
            url: file.ufsUrl,
            uploadthingKey: file.key,
            uploadthingUrl: file.ufsUrl,
            category: metadata.category,
            uploadedBy: metadata.userId,
            isPublic: false, // Documents are private by default
          })
          .returning();

        console.log("Document saved to database:", savedFile.id);

        return {
          uploadedBy: metadata.userId,
          fileId: savedFile.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save document to database:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),

  // Award media uploader
  awardMediaUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "award_media" as FileCategory,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const [savedFile] = await db
          .insert(files)
          .values({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type || "image/*",
            size: file.size,
            path: file.key,
            url: file.ufsUrl,
            uploadthingKey: file.key,
            uploadthingUrl: file.ufsUrl,
            category: metadata.category,
            uploadedBy: metadata.userId,
            isPublic: true, // Award media is typically public
          })
          .returning();

        console.log("Award media file saved to database:", savedFile.id);

        return {
          uploadedBy: metadata.userId,
          fileId: savedFile.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save award media file to database:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),
  eventMediaUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = (await auth())?.user;
      if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user.id,
        category: "event_media" as FileCategory,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const [savedFile] = await db
          .insert(files)
          .values({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type || "image/*",
            size: file.size,
            path: file.key,
            url: file.ufsUrl,
            uploadthingKey: file.key,
            uploadthingUrl: file.ufsUrl,
            category: metadata.category,
            uploadedBy: metadata.userId,
            isPublic: true, // Event media is typically public
          })
          .returning();

        console.log("Event media file saved to database:", savedFile.id);

        return {
          uploadedBy: metadata.userId,
          fileId: savedFile.id,
          url: file.ufsUrl,
          category: metadata.category,
        };
      } catch (error) {
        console.error("Failed to save event media file to database:", error);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export type Endpoint = keyof OurFileRouter;
// export type UploadCompleteResponse<T extends Endpoint> = ClientUploadedFileData<
//   inferEndpointOutput<OurFileRouter[T]>
// >[];
export type UploadCompleteResponse = ClientUploadedFileData<
  inferEndpointOutput<OurFileRouter[Endpoint]>
>[];
