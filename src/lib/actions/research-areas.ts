"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import {
  CACHED_FORMATTED_RESEARCH_AREAS,
  CACHED_RESEARCH_AREAS,
} from "@/config/constants";
import { db } from "@/db";
import {
  researchAreaFindings,
  researchAreaMethods,
  researchAreaPublications,
  researchAreaQuestions,
  researchAreas,
} from "@/db/schema";
import {
  createResearchAreaSchema,
  UpdateResearchAreaPayload,
  updateResearchAreaSchema,
  type CreateResearchAreaPayload,
} from "@/lib/validations/research-area";

export async function createResearchArea(data: CreateResearchAreaPayload) {
  try {
    // Validate the input data
    const validatedData = createResearchAreaSchema.parse(data);

    // Extract the related data
    const { questions, methods, findings, publications, ...researchAreaData } =
      validatedData;

    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error: "Unauthorized. You must be an admin to create research areas.",
      };
    }

    // Start a transaction for creating the research area and related entities
    const newResearchArea = await db.transaction(async (tx) => {
      // Create the research area
      const [researchArea] = await tx
        .insert(researchAreas)
        .values(researchAreaData)
        .returning();

      // Create the questions
      if (questions && questions.length > 0) {
        await tx.insert(researchAreaQuestions).values(
          questions.map((question) => ({
            researchAreaId: researchArea.id,
            question: question.question,
            order: question.order,
          }))
        );
      }

      // Create the methods
      if (methods && methods.length > 0) {
        await tx.insert(researchAreaMethods).values(
          methods.map((method) => ({
            researchAreaId: researchArea.id,
            title: method.title,
            description: method.description,
            order: method.order,
          }))
        );
      }

      // Create the findings
      if (findings && findings.length > 0) {
        await tx.insert(researchAreaFindings).values(
          findings.map((finding) => ({
            researchAreaId: researchArea.id,
            finding: finding.finding,
            order: finding.order,
          }))
        );
      }

      // Create the publications
      if (publications && publications.length > 0) {
        await tx.insert(researchAreaPublications).values(
          publications.map((pub) => ({
            researchAreaId: researchArea.id,
            publicationId: pub.publicationId,
            order: pub.order,
          }))
        );
      }
      return researchArea;
    });

    // Revalidate the research areas tag & paths
    revalidateTag(CACHED_RESEARCH_AREAS);
    revalidateTag(CACHED_FORMATTED_RESEARCH_AREAS);

    return {
      success: true,
      data: newResearchArea,
    };
  } catch (err) {
    console.error("Failed to create research area:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed",
        details: err.errors,
      };
    }

    return {
      error: "Failed to create research area. Please try again.",
    };
  }
}

export async function updateResearchArea(
  id: string,
  data: UpdateResearchAreaPayload
) {
  try {
    // Validate the input data
    const validatedData = updateResearchAreaSchema.parse(data);

    // Extract the related data
    const { questions, methods, findings, publications, ...researchAreaData } =
      validatedData;

    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error: "Unauthorized. You must be an admin to update research areas.",
      };
    }

    // Start a transaction for updating the research area and related entities
    const updatedResearchArea = await db.transaction(async (tx) => {
      // Check if the research area exists
      const existingResearchArea = await tx.query.researchAreas.findFirst({
        where: (researchAreas, { eq }) => eq(researchAreas.id, id),
      });

      if (!existingResearchArea) {
        throw new Error(`Research area with id ${id} not found`);
      }

      // Update the research area data if provided
      if (Object.keys(researchAreaData).length > 0) {
        await tx
          .update(researchAreas)
          .set(researchAreaData)
          .where(eq(researchAreas.id, id));
      }

      // Update questions if provided
      if (questions !== undefined) {
        // Delete existing questions
        await tx
          .delete(researchAreaQuestions)
          .where(eq(researchAreaQuestions.researchAreaId, id));

        // Insert new questions if any
        if (questions.length > 0) {
          await tx.insert(researchAreaQuestions).values(
            questions.map((question) => ({
              researchAreaId: id,
              question: question.question,
              order: question.order,
            }))
          );
        }
      }

      // Update methods if provided
      if (methods !== undefined) {
        // Delete existing methods
        await tx
          .delete(researchAreaMethods)
          .where(eq(researchAreaMethods.researchAreaId, id));

        // Insert new methods if any
        if (methods.length > 0) {
          await tx.insert(researchAreaMethods).values(
            methods.map((method) => ({
              researchAreaId: id,
              title: method.title,
              description: method.description,
              order: method.order,
            }))
          );
        }
      }

      // Update findings if provided
      if (findings !== undefined) {
        // Delete existing findings
        await tx
          .delete(researchAreaFindings)
          .where(eq(researchAreaFindings.researchAreaId, id));

        // Insert new findings if any
        if (findings.length > 0) {
          await tx.insert(researchAreaFindings).values(
            findings.map((finding) => ({
              researchAreaId: id,
              finding: finding.finding,
              order: finding.order,
            }))
          );
        }
      }

      // Update publications if provided
      if (publications !== undefined) {
        // Delete existing publication associations
        await tx
          .delete(researchAreaPublications)
          .where(eq(researchAreaPublications.researchAreaId, id));

        // Insert new publication associations if any
        if (publications.length > 0) {
          await tx.insert(researchAreaPublications).values(
            publications.map((pub) => ({
              researchAreaId: id,
              publicationId: pub.publicationId,
              order: pub.order,
            }))
          );
        }
      }

      // Return the updated research area
      return await tx.query.researchAreas.findFirst({
        where: (researchAreas, { eq }) => eq(researchAreas.id, id),
        columns: {
          id: true,
          title: true,
          icon: true,
          image: true,
          description: true,
          detail: true,
          href: true,
          linkText: true,
        },
        with: {
          questions: {
            columns: {
              question: true,
              order: true,
            },
            orderBy: (q, { asc }) => [asc(q.order)],
          },
          methods: {
            columns: {
              title: true,
              description: true,
              order: true,
            },
            orderBy: (m, { asc }) => [asc(m.order)],
          },
          findings: {
            columns: {
              finding: true,
              order: true,
            },
            orderBy: (f, { asc }) => [asc(f.order)],
          },
          publications: {
            columns: {
              publicationId: true,
              order: true,
            },
            orderBy: (p, { asc }) => [asc(p.order)],
          },
        },
      });
    });

    // Revalidate the research areas tag & paths
    revalidateTag(CACHED_RESEARCH_AREAS);
    revalidateTag(CACHED_FORMATTED_RESEARCH_AREAS);

    return {
      success: true,
      data: updatedResearchArea,
    };
  } catch (err) {
    console.error("Failed to update research area:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed",
        details: err.errors,
      };
    }

    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }

    return {
      error: "Failed to update research area. Please try again.",
    };
  }
}
