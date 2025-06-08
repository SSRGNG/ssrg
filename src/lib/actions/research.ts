"use server";

import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import {
  CACHED_RESEARCH_FRAMEWORKS,
  CACHED_RESEARCH_METHODOLOGIES,
} from "@/config/constants";
import { db } from "@/db";
import { researchFrameworks, researchMethodologies } from "@/db/schema";
import {
  type CreateMethodologyPayload,
  createMethodologySchema,
  type MultipleFrameworksPayload,
  multipleFrameworksSchema,
  type MultipleMethodologiesPayload,
  multipleMethodologiesSchema,
  UpdateFrameworkPayload,
  updateFrameworkSchema,
  type UpdateMethodologyPayload,
  updateMethodologySchema,
} from "@/lib/validations/research";
import { ResearchFramework, ResearchMethodology } from "@/types";

export async function createResearchMethodology(
  data: CreateMethodologyPayload
) {
  try {
    // Validate the input data
    const validatedData = createMethodologySchema.parse(data);

    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to create research methodology.",
      };
    }

    const [newMethodology] = await db
      .insert(researchMethodologies)
      .values(validatedData)
      .returning();

    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);

    return {
      success: true,
      data: newMethodology,
    };
  } catch (err) {
    console.error("Failed to create research methodology:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed",
        details: err.errors,
      };
    }

    return {
      error: "Failed to create research methodology. Please try again.",
    };
  }
}

export async function updateResearchMethodology(
  id: string,
  data: UpdateMethodologyPayload
) {
  try {
    // Validate the input data
    const validatedData = updateMethodologySchema.parse(data);

    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to update research methodology.",
      };
    }

    // Start a transaction for updating the research methodology
    const updatedMethodology = await db.transaction(async (tx) => {
      // Check if the research methodology exists
      const existingMethodology =
        await tx.query.researchMethodologies.findFirst({
          where: (model, { eq }) => eq(model.id, id),
        });

      if (!existingMethodology) {
        throw new Error(`Research methodology with id ${id} not found`);
      }

      // Update the research methodology data if provided
      if (Object.keys(validatedData).length > 0) {
        const [updatedMeth] = await tx
          .update(researchMethodologies)
          .set(validatedData)
          .where(eq(researchMethodologies.id, id))
          .returning();
        return updatedMeth;
      }
    });

    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);

    return {
      success: true,
      data: updatedMethodology,
    };
  } catch (err) {
    console.error("Failed to update research methodology:", err);

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
      error: "Failed to update research methodology. Please try again.",
    };
  }
}

export async function updateResearchFramework(
  id: string,
  data: UpdateFrameworkPayload
) {
  try {
    // Validate the input data
    const validatedData = updateFrameworkSchema.parse(data);

    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to create research framework.",
      };
    }

    // Start a transaction for updating the research framework
    const updatedFramework = await db.transaction(async (tx) => {
      // Check if the research framework exists
      const existingFramework = await tx.query.researchFrameworks.findFirst({
        where: (model, { eq }) => eq(model.id, id),
      });

      if (!existingFramework) {
        throw new Error(`Research framework with id ${id} not found`);
      }

      // Update the research framework data if provided
      if (Object.keys(validatedData).length > 0) {
        const [updatedFrame] = await tx
          .update(researchFrameworks)
          .set(validatedData)
          .where(eq(researchFrameworks.id, id))
          .returning();
        return updatedFrame;
      }
    });

    revalidateTag(CACHED_RESEARCH_FRAMEWORKS);

    return {
      success: true,
      data: updatedFramework,
    };
  } catch (err) {
    console.error("Failed to complete the task:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed",
        details: err.errors,
      };
    }

    return {
      error: "Failed to complete the task. Please try again.",
    };
  }
}

// New function for creating multiple methodologies
// export async function createMultipleResearchMethodologies(
//   data: MultipleMethodologiesPayload
// ) {
//   try {
//     // Validate the input data
//     const validatedData = multipleMethodologiesSchema.parse(data);

//     // Check authentication and authorization
//     const session = await auth();
//     if (!session || session.user.role !== "admin") {
//       return {
//         error:
//           "Unauthorized. You must be an admin to create research methodologies.",
//       };
//     }

//     // Prepare titles for checks (normalize early)
//     const inputMethodologies = validatedData.methodologies.map(m => ({
//         ...m,
//         normalizedTitle: m.title.toLowerCase().trim(),
//     }));
//     const normalizedTitles = inputMethodologies.map(m => m.normalizedTitle);

//     // Check for duplicate titles within the submission
//     const duplicateTitlesInSubmission = normalizedTitles.filter(
//       (title, index) => normalizedTitles.indexOf(title) !== index
//     );

//     if (duplicateTitlesInSubmission.length > 0) {
//       return {
//         error: `Duplicate titles found within submission: ${[
//           ...new Set(duplicateTitlesInSubmission),
//         ].join(", ")}`,
//       };
//     }

//     // Check for existing methodologies with the same titles in the database
//     if (normalizedTitles.length > 0) { // Only query if there are titles to check
//         const existingMethodologies = await db
//         .select({ title: researchMethodologies.title })
//         .from(researchMethodologies)
//         .where(
//             // Drizzle's sql.raw or a specific operator might be cleaner,
//             // but direct SQL with sql tagged template is also common for complex expressions.
//             // Using lower(trim(column)) IN (values)
//             sql`LOWER(TRIM(${researchMethodologies.title})) IN ${normalizedTitles}`
//         );

//         if (existingMethodologies.length > 0) {
//             const existingTitles = existingMethodologies.map((m) => m.title);
//             return {
//             error: `Methodologies with these titles already exist in DB: ${existingTitles.join(
//                 ", "
//             )}`,
//             };
//         }
//     }

//     // Prepare values for insertion, excluding normalizedTitle helper property
//     const methodologiesToInsert = inputMethodologies.map(({ normalizedTitle, ...rest }) => rest);

//     // Insert all methodologies in a transaction using a single statement
//     const newMethodologies = await db.transaction(async (tx) => {
//       if (methodologiesToInsert.length === 0) {
//         return []; // Nothing to insert
//       }
//       const inserted = await tx
//         .insert(researchMethodologies)
//         .values(methodologiesToInsert) // Drizzle handles multiple values objects
//         .returning();
//       return inserted;
//     });

//     // Revalidate cache
//     revalidateTag(CACHED_RESEARCH_METHODOLOGIES);

//     return {
//       success: true,
//       data: newMethodologies,
//       count: newMethodologies.length,
//     };
//   } catch (err) {
//     console.error("Failed to create research methodologies:", err);

//     if (err instanceof z.ZodError) {
//       return {
//         error: "Validation failed",
//         details: err.errors,
//       };
//     }

//     // Handle specific database errors (PostgreSQL unique violation)
//     if (err && typeof err === 'object' && 'code' in err && err.code === "23505") {
//       return {
//         error: "One or more methodologies with these titles already exist (database constraint).",
//       };
//     }

//     return {
//       error: "Failed to create research methodologies. Please try again.",
//     };
//   }
// }

export async function createMultipleResearchMethodologies(
  data: MultipleMethodologiesPayload
) {
  try {
    const validatedData = multipleMethodologiesSchema.parse(data);

    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to create research methodologies.",
        createdCount: 0,
        skippedCount: 0,
      };
    }

    // Normalize title using same logic as DB index: LOWER(TRIM(title))
    const methodologiesToInsert = validatedData.methodologies.map((m) => ({
      title: m.title.trim(), // assume lowercasing happens in DB/index only
      description: m.description,
      order: m.order,
    }));

    if (methodologiesToInsert.length === 0) {
      return {
        success: true,
        data: [],
        createdCount: 0,
        skippedCount: 0,
        message: "No methodologies submitted for creation.",
      };
    }

    const inserted = await db
      .insert(researchMethodologies)
      .values(methodologiesToInsert)
      .onConflictDoNothing({
        target: researchMethodologies.title,
        // target: sql`LOWER(TRIM(title))`,
        // target: lower(researchMethodologies.title),
      })
      .returning();

    const createdCount = inserted.length;
    const submittedCount = methodologiesToInsert.length;
    const skippedCount = submittedCount - createdCount;

    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);

    return {
      success: true,
      data: inserted,
      createdCount,
      skippedCount,
      message: `${createdCount} methodolog${
        createdCount === 1 ? "y" : "ies"
      } created. ${
        skippedCount > 0 ? `${skippedCount} skipped due to duplicates.` : ""
      }`,
    };
  } catch (err) {
    console.error("Failed to create research methodologies:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed.",
        details: err.errors,
        createdCount: 0,
        skippedCount: 0,
      };
    }

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      return {
        error: "Unique constraint violated for another field.",
        createdCount: 0,
        skippedCount: 0,
      };
    }

    return {
      error: "Unexpected error occurred. Please try again.",
      createdCount: 0,
      skippedCount: 0,
    };
  }
}

export async function createMultipleFrameworks(
  data: MultipleFrameworksPayload
) {
  try {
    const validatedData = multipleFrameworksSchema.parse(data);

    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to create research frameworks.",
        createdCount: 0,
        skippedCount: 0,
      };
    }

    // Normalize title using same logic as DB index: LOWER(TRIM(title))
    const frameworksToInsert = validatedData.frameworks.map((f) => ({
      title: f.title.trim(), // assume lowercasing happens in DB/index only
      description: f.description,
      order: f.order,
      linkText: f.linkText,
      href: f.href,
    }));

    if (frameworksToInsert.length === 0) {
      return {
        success: true,
        data: [],
        createdCount: 0,
        skippedCount: 0,
        message: "No frameworks submitted for creation.",
      };
    }

    // const inserted = await db
    //   .insert(researchFrameworks)
    //   .values(frameworksToInsert)
    //   .onConflictDoNothing({
    //     target: [researchFrameworks.title, researchFrameworks.href]
    //   })
    //   .returning();

    // First, try to insert and handle title conflicts
    let inserted: ResearchFramework[];
    try {
      inserted = await db
        .insert(researchFrameworks)
        .values(frameworksToInsert)
        .onConflictDoNothing({
          target: researchFrameworks.title, // Handle title uniqueness
        })
        .returning();
    } catch (err) {
      // If there are href conflicts, this will still throw
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "23505"
      ) {
        return {
          error:
            "Some frameworks have duplicate URLs (href) that already exist.",
          createdCount: 0,
          skippedCount: frameworksToInsert.length,
        };
      }
      throw err; // Re-throw other errors
    }

    const createdCount = inserted.length;
    const submittedCount = frameworksToInsert.length;
    const skippedCount = submittedCount - createdCount;

    revalidateTag(CACHED_RESEARCH_FRAMEWORKS);

    return {
      success: true,
      data: inserted,
      createdCount,
      skippedCount,
      message: `${createdCount} framework${
        createdCount === 1 ? "" : "s"
      } created. ${
        skippedCount > 0 ? `${skippedCount} skipped due to duplicates.` : ""
      }`,
    };
  } catch (err) {
    console.error("Failed to create research frameworks:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed.",
        details: err.errors,
        createdCount: 0,
        skippedCount: 0,
      };
    }

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      return {
        error: "Unique constraint violated for another field.",
        createdCount: 0,
        skippedCount: 0,
      };
    }

    return {
      error: "Unexpected error occurred. Please try again.",
      createdCount: 0,
      skippedCount: 0,
    };
  }
}
// Utility function to bulk insert with better error handling
export async function bulkCreateResearchMethodologies(
  methodologies: CreateMethodologyPayload[],
  options: {
    skipDuplicates?: boolean;
    updateOnConflict?: boolean;
  } = {}
) {
  try {
    const validatedData = multipleMethodologiesSchema.parse({ methodologies });

    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        error:
          "Unauthorized. You must be an admin to create research methodologies.",
      };
    }
    const results = {
      created: [] as ResearchMethodology[],
      skippedTitles: [] as string[],
      updated: [] as ResearchMethodology[],
      errors: [] as { title: string; error: string }[],
    };

    if (validatedData.methodologies.length === 0) {
      return {
        success: true,
        data: results,
        summary: { total: 0, created: 0, skipped: 0, updated: 0, failed: 0 },
      };
    }

    // Prepare data for insertion. Normalize titles if your unique constraint is on a normalized form.
    // For this example, we'll assume 'title' as is, is the unique key.
    const methodologiesToProcess = validatedData.methodologies.map((m) => ({
      title: m.title, // Ensure this matches the unique constraint column
      description: m.description,
      order: m.order,
      // id, created_at, updated_at are not in payload for new items
    }));

    if (options.updateOnConflict) {
      // UPSERT: Insert new or update existing on conflict
      // Requires a unique constraint on `researchMethodologies.title`
      const upserted = await db
        .insert(researchMethodologies)
        .values(methodologiesToProcess)
        .onConflictDoUpdate({
          target: researchMethodologies.title, // Target column with unique constraint
          set: {
            description: sql`excluded.description`, // Use 'excluded' to get values from the conflicting row
            order: sql`excluded.order`,
            updated_at: new Date(), // Explicitly set updated_at on update
          },
          // where: sql`${researchMethodologies.title} ...` // Optional: condition for update
        })
        .returning();

      // To differentiate created vs. updated is tricky with a single upsert.
      // A common approach is to consider all returned items as "successfully processed".
      // For a more precise count, you'd need to query existing IDs before the upsert,
      // then compare IDs. For simplicity here, we'll count all as updated/created.
      // This simplification might not perfectly match your original detailed 'results' structure.
      // A more accurate split would require a pre-select of existing titles/ids.
      results.updated = upserted; // Or a mix of created/updated
    } else if (options.skipDuplicates) {
      // INSERT ... ON CONFLICT DO NOTHING
      // Requires a unique constraint on `researchMethodologies.title`
      const inserted = await db
        .insert(researchMethodologies)
        .values(methodologiesToProcess)
        .onConflictDoNothing({ target: researchMethodologies.title })
        .returning();

      results.created = inserted;
      const createdTitles = new Set(inserted.map((i) => i.title));
      methodologiesToProcess.forEach((m) => {
        if (!createdTitles.has(m.title)) {
          results.skippedTitles.push(m.title);
        }
      });
    } else {
      // Standard bulk insert: will fail if any duplicate title violates unique constraint
      // This behaves like createMultipleResearchMethodologies but for an array.
      // You might want a pre-check for existing titles like in createMultiple...
      // or rely on the database unique constraint to throw an error for the batch.
      try {
        const inserted = await db
          .insert(researchMethodologies)
          .values(methodologiesToProcess)
          .returning();
        results.created = inserted;
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "code" in err &&
          err.code === "23505"
        ) {
          // Unique violation
          // Hard to tell which ones failed in a batch without more complex logic or individual processing.
          // Mark all as error for simplicity in this catch block.
          validatedData.methodologies.forEach((m) =>
            results.errors.push({
              title: m.title,
              error: "Unique constraint violation in batch.",
            })
          );
        } else {
          throw err; // Re-throw other errors
        }
      }
    }

    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);

    return {
      success: true,
      data: results,
      summary: {
        total: validatedData.methodologies.length,
        created: results.created.length,
        skipped: results.skippedTitles.length,
        updated: results.updated.length,
        failed: results.errors.length,
      },
    };
  } catch (err) {
    console.error("Failed to bulk create research methodologies:", err);

    if (err instanceof z.ZodError) {
      return {
        error: "Validation failed",
        details: err.errors,
      };
    }

    return {
      error: "Failed to create research methodologies. Please try again.",
    };
  }
}
