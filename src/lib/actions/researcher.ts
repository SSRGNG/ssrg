"use server";

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
  type CreateResearcherPayload,
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
