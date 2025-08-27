"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { awardMedia, recipients, scholarships } from "@/db/schema";
import type {
  CreateAwardMediaPayload,
  CreateRecipientPayload,
  CreateScholarshipPayload,
} from "@/lib/validations/scholarship";

export async function createAwardMedia(data: CreateAwardMediaPayload) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const [newAwardMedia] = await db
      .insert(awardMedia)
      .values({
        scholarshipId: data.scholarshipId || null,
        recipientId: data.recipientId || null,
        eventId: data.eventId || null,
        fileId: data.fileId,
        caption: data.caption || null,
        isPublic: data.isPublic,
        sortOrder: data.sortOrder,
      })
      .returning();

    revalidatePath("/admin/scholarships");
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

    revalidatePath("/admin/scholarships");
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

    revalidatePath("/admin/scholarships");
    // revalidatePath("/admin/award-media");

    return { success: true, data: newRecipient };
  } catch (error) {
    console.error("Error creating recipient:", error);
    return { error: "Failed to create recipient" };
  }
}
