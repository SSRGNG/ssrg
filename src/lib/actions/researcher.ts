"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import {
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
} from "@/db/schema";
import {
  createResearcherSchema,
  updateResearcherSchema,
  type CreateResearcherPayload,
  type UpdateResearcherPayload,
} from "@/lib/validations/researcher";

export async function createResearcher(formData: CreateResearcherPayload) {
  try {
    const role = (await auth())?.user.role;
    if (role !== "admin") {
      return {
        error: "Unauthorized. You must be an admin to create a researcher.",
      };
    }
    const parsedResult = createResearcherSchema.safeParse(formData);

    if (!parsedResult.success) {
      return {
        error: "Invalid input",
        details: parsedResult.error.format(),
      };
    }
    const { education, expertise, areas, orcid, x, ...researcherData } =
      parsedResult.data;

    const result = await db.transaction(async (tx) => {
      const [researcher] = await tx
        .insert(researchers)
        .values({ ...researcherData, x: x || null, orcid: orcid || null })
        .returning();

      const researcherId = researcher.id;

      if (expertise?.length) {
        await tx.insert(researcherExpertise).values(
          expertise.map(({ expertise, order }) => ({
            researcherId,
            expertise,
            order,
          }))
        );
      }

      if (education?.length) {
        await tx.insert(researcherEducation).values(
          education.map(({ education, order }) => ({
            researcherId,
            education,
            order,
          }))
        );
      }

      if (areas?.length) {
        await tx.insert(researcherAreas).values(
          areas?.map(({ areaId }) => ({
            areaId,
            researcherId,
          }))
        );
      }

      return { researcherId };
    });

    return {
      success: true,
      researcherId: result.researcherId,
    };
  } catch (error) {
    console.error("Error creating researcher:", error);
    return {
      error: "Failed to create researcher. Please try again.",
    };
  }
}

export async function updateResearcher(
  // researcherId: string,
  formData: UpdateResearcherPayload
) {
  try {
    const authUser = (await auth())?.user;

    const parsedResult = updateResearcherSchema.safeParse(formData);

    if (!parsedResult.success) {
      return {
        error: "Invalid input",
        details: parsedResult.error.format(),
      };
    }
    const {
      id: researcherId,
      education,
      expertise,
      areas,
      orcid,
      x,
      ...researcherData
    } = parsedResult.data;

    if (authUser?.role !== "admin" || authUser?.id !== researcherData.userId) {
      return {
        error: "Unauthorized. You cannot update this user account.",
      };
    }

    if (orcid) {
      const existingResearcherOrcid = await db
        .select({ id: researchers.id })
        .from(researchers)
        .where(
          and(eq(researchers.orcid, orcid), ne(researchers.id, researcherId))
        )
        .limit(1);

      if (existingResearcherOrcid.length > 0) {
        return { error: "Another researcher with this ORCID already exists" };
      }
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .update(researchers)
        .set({
          ...researcherData,
          x: x || null,
          orcid: orcid || null,
          updated_at: new Date(),
        })
        .where(eq(researchers.id, researcherId));

      if (expertise && expertise?.length > 0) {
        await tx
          .delete(researcherExpertise)
          .where(eq(researcherExpertise.researcherId, researcherId));
        await tx.insert(researcherExpertise).values(
          expertise.map(({ expertise, order }) => ({
            researcherId,
            expertise,
            order,
          }))
        );
      }

      if (education && education?.length > 0) {
        await tx
          .delete(researcherEducation)
          .where(eq(researcherEducation.researcherId, researcherId));
        await tx.insert(researcherEducation).values(
          education.map(({ education, order }) => ({
            researcherId,
            education,
            order,
          }))
        );
      }

      if (areas && areas?.length > 0) {
        await tx
          .delete(researcherAreas)
          .where(eq(researcherAreas.researcherId, researcherId));
        await tx.insert(researcherAreas).values(
          areas?.map(({ areaId }) => ({
            areaId,
            researcherId,
          }))
        );
      }

      return { success: true };
    });

    revalidatePath("/portal/profile");
    return { success: result.success };
  } catch (error) {
    console.error("Error updating researcher profile:", error);
    return {
      error: "Failed to update researcher profile. Please try again.",
    };
  }
}
