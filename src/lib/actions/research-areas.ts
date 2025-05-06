"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
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

    // Revalidate the research areas tag
    revalidateTag("cached-research-areas");

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
    // if (err.name === "ZodError") {

    // }

    return {
      error: "Failed to create research area. Please try again.",
    };
  }
}
