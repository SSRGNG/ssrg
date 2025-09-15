"use server";

import { eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import {
  awardMedia,
  eventMedia,
  files,
  recipients,
  scholarships,
} from "@/db/schema";
import { deleteFile } from "@/lib/actions/files";
import {
  type CreateAwardMediaPayload,
  createAwardMediaSchema,
  type CreateEventMediaPayload,
  createEventMediaSchema,
  type CreateRecipientPayload,
  type CreateScholarshipPayload,
} from "@/lib/validations/event";

export async function createEventMedia(data: CreateEventMediaPayload) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    // Validate the input data
    const validatedData = createEventMediaSchema.parse(data);

    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      eventId: validatedData.eventId || null,
      externalEvent: validatedData.externalEvent || null,
      externalLocation: validatedData.externalLocation || null,
      externalDate: validatedData.externalDate || null,
    };

    // Insert the event media record
    // const [newEventMedia] = await db
    //   .insert(eventMedia)
    //   .values(cleanedData)
    //   .returning();

    let finalSortOrder: number;

    await db.transaction(async (tx) => {
      if (
        cleanedData.sortOrder === undefined ||
        cleanedData.sortOrder === null
      ) {
        // Auto-increment: Find the highest sortOrder and add 1
        const maxOrder = await tx
          .select({
            maxOrder: sql<number>`COALESCE(MAX(${eventMedia.sortOrder}), -1)`,
          })
          .from(eventMedia);

        finalSortOrder = (maxOrder[0]?.maxOrder ?? -1) + 1;
      } else {
        // Manual position: Shift existing items
        finalSortOrder = cleanedData.sortOrder;

        // Increment sortOrder for all items >= the specified position
        await tx
          .update(eventMedia)
          .set({
            sortOrder: sql`${eventMedia.sortOrder} + 1`,
            updated_at: sql`CURRENT_TIMESTAMP`,
          })
          .where(gte(eventMedia.sortOrder, finalSortOrder));
      }

      // Insert the new event media record with the calculated sortOrder
      const [newEventMedia] = await tx
        .insert(eventMedia)
        .values({
          ...cleanedData,
          sortOrder: finalSortOrder,
        })
        .returning();

      return newEventMedia;
    });

    // Revalidate relevant pages
    revalidatePath("/admin/scholarships");
    // revalidatePath("/events");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error creating event media:", error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: "An unexpected error occurred while creating event media.",
    };
  }
}

export async function createAwardMedia(data: CreateAwardMediaPayload) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Validate the input data
    const validatedData = createAwardMediaSchema.parse(data);

    // Clean up empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      scholarshipId: validatedData.scholarshipId || null,
      recipientId: validatedData.recipientId || null,
      eventId: validatedData.eventId || null,
      caption: validatedData.caption || null,
    };

    const [newAwardMedia] = await db
      .insert(awardMedia)
      .values(cleanedData)
      .returning();

    revalidatePath("/admin/events");
    // revalidatePath("/admin/award-media");

    return { success: true, data: newAwardMedia };
  } catch (error) {
    console.error("Error creating award media:", error);
    return { error: "Failed to create award media" };
  }
}

export async function createScholarship(data: CreateScholarshipPayload) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const [newScholarship] = await db
      .insert(scholarships)
      .values({
        ...data,
      })
      .returning();

    revalidatePath("/admin/events");
    // revalidatePath("/admin/award-media");

    return { success: true, data: newScholarship };
  } catch (error) {
    console.error("Error creating scholarship:", error);
    return { error: "Failed to create scholarship" };
  }
}

export async function createRecipient(data: CreateRecipientPayload) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const [newRecipient] = await db
      .insert(recipients)
      .values({
        ...data,
      })
      .returning();

    revalidatePath("/admin/events");
    // revalidatePath("/admin/award-media");

    return { success: true, data: newRecipient };
  } catch (error) {
    console.error("Error creating recipient:", error);
    return { error: "Failed to create recipient" };
  }
}

export async function deleteEventMedia(id: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // First, get the event media record with file information
      const [itemToDelete] = await tx
        .select({
          sortOrder: eventMedia.sortOrder,
          uploadthingKey: files.uploadthingKey,
        })
        .from(eventMedia)
        .innerJoin(files, eq(eventMedia.fileId, files.id))
        .where(eq(eventMedia.id, id));

      if (!itemToDelete) {
        throw new Error("Event media not found");
      }

      // Delete the event media record
      await tx.delete(eventMedia).where(eq(eventMedia.id, id));

      // Shift down all items that were after the deleted item
      await tx
        .update(eventMedia)
        .set({
          sortOrder: sql`${eventMedia.sortOrder} - 1`,
          updated_at: sql`CURRENT_TIMESTAMP`,
        })
        .where(gte(eventMedia.sortOrder, itemToDelete.sortOrder));

      return itemToDelete;
    });

    if (result.uploadthingKey) await deleteFile(result.uploadthingKey);

    // Revalidate relevant pages
    revalidatePath("/admin/events");

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    console.error("Error deleting event media:", error);

    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }

    return {
      data: null,
      error: "An unexpected error occurred while deleting event media.",
    };
  }
}

export async function deleteAwardMedia(id: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // First, get the award media record with file information
      const [itemToDelete] = await tx
        .select({ id: awardMedia.id, uploadthingKey: files.uploadthingKey })
        .from(awardMedia)
        .innerJoin(files, eq(awardMedia.fileId, files.id))
        .where(eq(awardMedia.id, id));

      if (!itemToDelete) {
        throw new Error("Award media not found");
      }

      // Delete the award media record
      await tx.delete(awardMedia).where(eq(awardMedia.id, id));

      return itemToDelete;
    });

    if (result.uploadthingKey) await deleteFile(result.uploadthingKey);

    // Revalidate relevant pages
    revalidatePath("/admin/events");

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    console.error("Error deleting event media:", error);

    if (error instanceof Error) {
      return {
        data: null,
        error: error.message,
      };
    }

    return {
      data: null,
      error: "An unexpected error occurred while deleting event media.",
    };
  }
}
