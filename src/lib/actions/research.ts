"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
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

export async function deleteResearchFramework(frameworkId: string) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You must be logged in to delete research frameworks",
      };
    }

    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Insufficient permissions",
        details: "You must be an admin to delete research frameworks",
      };
    }

    // Validate framework ID
    if (!frameworkId || typeof frameworkId !== "string") {
      return {
        success: false,
        error: "Invalid framework ID",
        details: "Framework ID is required and must be a valid string",
      };
    }

    // Check if framework exists
    const existingFramework = await db
      .select({
        id: researchFrameworks.id,
        title: researchFrameworks.title,
      })
      .from(researchFrameworks)
      .where(eq(researchFrameworks.id, frameworkId))
      .limit(1);

    if (existingFramework.length === 0) {
      return {
        success: false,
        error: "Research framework not found",
        details:
          "The research framework does not exist or may have already been deleted",
      };
    }

    // Delete the framework
    const deletedFramework = await db
      .delete(researchFrameworks)
      .where(eq(researchFrameworks.id, frameworkId))
      .returning({
        id: researchFrameworks.id,
        title: researchFrameworks.title,
      });

    if (deletedFramework.length === 0) {
      return {
        success: false,
        error: "Failed to delete research framework",
        details: "An error occurred while deleting the framework",
      };
    }

    const framework = deletedFramework[0];

    // Revalidate relevant paths and tags
    revalidateTag(CACHED_RESEARCH_FRAMEWORKS);
    revalidatePath("/admin");
    revalidatePath("/admin/core");

    return {
      success: true,
      message: `Research framework "${framework.title}" deleted successfully`,
      deletedFramework: {
        id: framework.id,
        title: framework.title,
      },
    };
  } catch (error) {
    console.error("Research framework deletion error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return {
          success: false,
          error: "Cannot delete research framework",
          details:
            "Framework is being used by other resources and cannot be deleted",
        };
      }
    }

    return {
      success: false,
      error: "Failed to delete research framework",
      details: "An unexpected error occurred while deleting the framework",
    };
  }
}

export async function deleteResearchMethodology(methodologyId: string) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You must be logged in to delete research methodologies",
      };
    }

    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Insufficient permissions",
        details: "You must be an admin to delete research methodologies",
      };
    }

    // Validate methodology ID
    if (!methodologyId || typeof methodologyId !== "string") {
      return {
        success: false,
        error: "Invalid methodology ID",
        details: "Methodology ID is required and must be a valid string",
      };
    }

    // Check if methodology exists
    const existingMethodology = await db
      .select({
        id: researchMethodologies.id,
        title: researchMethodologies.title,
      })
      .from(researchMethodologies)
      .where(eq(researchMethodologies.id, methodologyId))
      .limit(1);

    if (existingMethodology.length === 0) {
      return {
        success: false,
        error: "Research methodology not found",
        details:
          "The research methodology does not exist or may have already been deleted",
      };
    }

    // Delete the methodology
    const deletedMethodology = await db
      .delete(researchMethodologies)
      .where(eq(researchMethodologies.id, methodologyId))
      .returning({
        id: researchMethodologies.id,
        title: researchMethodologies.title,
      });

    if (deletedMethodology.length === 0) {
      return {
        success: false,
        error: "Failed to delete research methodology",
        details: "An error occurred while deleting the methodology",
      };
    }

    const methodology = deletedMethodology[0];

    // Revalidate relevant paths and tags
    revalidateTag(CACHED_RESEARCH_METHODOLOGIES);
    revalidatePath("/admin");
    revalidatePath("/admin/core");

    return {
      success: true,
      message: `Research methodology "${methodology.title}" deleted successfully`,
      deletedMethodology: {
        id: methodology.id,
        title: methodology.title,
      },
    };
  } catch (error) {
    console.error("Research methodology deletion error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return {
          success: false,
          error: "Cannot delete research methodology",
          details:
            "Methodology is being used by other resources and cannot be deleted",
        };
      }
    }

    return {
      success: false,
      error: "Failed to delete research methodology",
      details: "An unexpected error occurred while deleting the methodology",
    };
  }
}

export async function deleteMultipleResearchFrameworks(frameworkIds: string[]) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        success: false,
        error: "Insufficient permissions",
        details: "You must be an admin to delete research frameworks",
      };
    }

    if (!Array.isArray(frameworkIds) || frameworkIds.length === 0) {
      return {
        success: false,
        error: "Invalid input",
        details: "Framework IDs must be a non-empty array",
      };
    }

    const results = [];
    const errors = [];

    // Process each framework individually
    for (const frameworkId of frameworkIds) {
      const result = await deleteResearchFramework(frameworkId);
      if (result.success) {
        results.push(result.deletedFramework);
      } else {
        errors.push({
          frameworkId,
          error: result.error,
          details: result.details,
        });
      }
    }

    return {
      success: errors.length === 0,
      deletedCount: results.length,
      deletedFrameworks: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${results.length} framework(s)${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    };
  } catch (error) {
    console.error("Bulk framework deletion error:", error);
    return {
      success: false,
      error: "Failed to delete frameworks",
      details: "An unexpected error occurred during bulk deletion",
    };
  }
}

export async function deleteMultipleResearchMethodologies(
  methodologyIds: string[]
) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return {
        success: false,
        error: "Insufficient permissions",
        details: "You must be an admin to delete research methodologies",
      };
    }

    if (!Array.isArray(methodologyIds) || methodologyIds.length === 0) {
      return {
        success: false,
        error: "Invalid input",
        details: "Methodology IDs must be a non-empty array",
      };
    }

    const results = [];
    const errors = [];

    // Process each methodology individually
    for (const methodologyId of methodologyIds) {
      const result = await deleteResearchMethodology(methodologyId);
      if (result.success) {
        results.push(result.deletedMethodology);
      } else {
        errors.push({
          methodologyId,
          error: result.error,
          details: result.details,
        });
      }
    }

    return {
      success: errors.length === 0,
      deletedCount: results.length,
      deletedMethodologies: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${
        results.length
      } methodology/methodologies${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    };
  } catch (error) {
    console.error("Bulk methodology deletion error:", error);
    return {
      success: false,
      error: "Failed to delete methodologies",
      details: "An unexpected error occurred during bulk deletion",
    };
  }
}
