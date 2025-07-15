"use server";

import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/auth";
import { CACHED_PUBLICATIONS } from "@/config/constants";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
  users,
} from "@/db/schema";
import { getCitationCount } from "@/lib/actions/citations";
import { isRoleAllowed } from "@/lib/utils";
import {
  type CreateAuthorPayload,
  createAuthorSchema,
} from "@/lib/validations/author";
import {
  CreatePublicationPayload,
  createPublicationSchema,
} from "@/lib/validations/publication";

export async function createAuthor(data: CreateAuthorPayload) {
  try {
    const validation = createAuthorSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid author data",
        details: validation.error.errors,
      };
    }

    const { email, name, affiliation, orcid } = validation.data;

    // Check if author with same email already exists (if email provided)
    if (email) {
      const existingAuthor = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.email, email))
        .limit(1);

      if (existingAuthor.length > 0) {
        return {
          success: false,
          error: "Author with this email already exists",
        };
      }
    }

    // Additional check: if ORCID provided, ensure it's unique
    if (orcid) {
      const existingOrcid = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.orcid, orcid))
        .limit(1);

      if (existingOrcid.length > 0) {
        return {
          success: false,
          error: "Author with this ORCID already exists",
        };
      }

      // Also check researchers table for ORCID conflicts
      const existingResearcherOrcid = await db
        .select({ id: researchers.id })
        .from(researchers)
        .where(eq(researchers.orcid, orcid))
        .limit(1);

      if (existingResearcherOrcid.length > 0) {
        return {
          success: false,
          error: "A researcher with this ORCID already exists in the system",
        };
      }
    }

    // Check for potential duplicates based on name and affiliation
    if (name && affiliation) {
      const potentialDuplicate = await db
        .select({
          id: authors.id,
          name: authors.name,
          affiliation: authors.affiliation,
        })
        .from(authors)
        .where(
          and(
            ilike(authors.name, name),
            ilike(authors.affiliation, affiliation)
          )
        )
        .limit(1);

      if (potentialDuplicate.length > 0) {
        return {
          success: false,
          error: "A similar author (same name and affiliation) already exists",
          suggestion: "Consider using the existing author record instead",
        };
      }
    }

    // Create the new author
    const [newAuthor] = await db
      .insert(authors)
      .values({
        ...validation.data,
        researcherId: null, // This will be null for external authors
      })
      .returning({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
      });

    return {
      success: true,
      author: {
        ...newAuthor,
        publicationCount: 0,
      },
    };
  } catch (error) {
    console.error("Author creation error:", error);
    return {
      success: false,
      error: "Failed to create author",
    };
  }
}

export async function createAuthorForPublication(data: CreateAuthorPayload) {
  try {
    const validation = createAuthorSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid author data",
        details: validation.error.errors,
      };
    }

    const { email, name, affiliation, orcid } = validation.data;

    return await db.transaction(async (tx) => {
      // Single comprehensive check
      const existingRecords = await tx
        .select({
          // Author fields
          authorId: authors.id,
          authorName: authors.name,
          authorEmail: authors.email,
          authorAffiliation: authors.affiliation,
          authorOrcid: authors.orcid,
          authorResearcherId: authors.researcherId,

          // Researcher fields
          researcherId: researchers.id,
          researcherOrcid: researchers.orcid,
          userName: users.name,
          userEmail: users.email,
          userAffiliation: users.affiliation,

          // Publication count
          publicationCount: sql<number>`(
            SELECT COUNT(*)::int 
            FROM ${publicationAuthors} 
            WHERE ${publicationAuthors.authorId} = ${authors.id}
          )`,
        })
        .from(authors)
        .leftJoin(researchers, eq(authors.researcherId, researchers.id))
        .leftJoin(users, eq(researchers.userId, users.id))
        .where(
          or(
            // Exact matches
            email ? eq(authors.email, email) : sql`false`,
            orcid ? eq(authors.orcid, orcid) : sql`false`,
            // Fuzzy name + affiliation match
            name && affiliation
              ? and(
                  ilike(authors.name, `%${name}%`),
                  ilike(authors.affiliation, `%${affiliation}%`)
                )
              : sql`false`
          )
        )
        .limit(3);

      // Check for researchers without author records
      let unlinkedResearcher = null;
      if (email || orcid) {
        const unlinked = await tx
          .select({
            researcherId: researchers.id,
            researcherOrcid: researchers.orcid,
            userName: users.name,
            userEmail: users.email,
            userAffiliation: users.affiliation,
          })
          .from(researchers)
          .innerJoin(users, eq(researchers.userId, users.id))
          .leftJoin(authors, eq(authors.researcherId, researchers.id))
          .where(
            and(
              isNull(authors.id), // No author record
              or(
                email ? eq(users.email, email) : sql`false`,
                orcid ? eq(researchers.orcid, orcid) : sql`false`
              )
            )
          )
          .limit(1);

        unlinkedResearcher = unlinked[0] || null;
      }

      // Process results
      const exactMatch = existingRecords.find(
        (record) =>
          (email && record.authorEmail === email) ||
          (orcid && record.authorOrcid === orcid)
      );

      if (exactMatch) {
        return {
          success: true,
          conflictType: "existing_author",
          author: {
            id: exactMatch.authorId,
            name: exactMatch.authorName,
            email: exactMatch.authorEmail,
            affiliation: exactMatch.authorAffiliation,
            orcid: exactMatch.authorOrcid,
            researcherId: exactMatch.authorResearcherId,
            publicationCount: exactMatch.publicationCount || 0,
            isResearcher: !!exactMatch.authorResearcherId,
          },
        };
      }

      // If researcher exists without author record, create it
      if (unlinkedResearcher) {
        const [newAuthor] = await tx
          .insert(authors)
          .values({
            name: unlinkedResearcher.userName,
            email: unlinkedResearcher.userEmail,
            affiliation: unlinkedResearcher.userAffiliation,
            orcid: unlinkedResearcher.researcherOrcid,
            researcherId: unlinkedResearcher.researcherId,
          })
          .returning({
            id: authors.id,
            name: authors.name,
            email: authors.email,
            affiliation: authors.affiliation,
            orcid: authors.orcid,
            researcherId: authors.researcherId,
          });

        return {
          success: true,
          conflictType: "researcher_needs_author",
          author: {
            ...newAuthor,
            publicationCount: 0,
            isResearcher: true,
          },
        };
      }

      // Check for potential duplicates
      const fuzzyMatch = existingRecords.find((record) => {
        if (!name || !affiliation) return false;
        return (
          record.authorName?.toLowerCase().includes(name.toLowerCase()) &&
          record.authorAffiliation
            ?.toLowerCase()
            .includes(affiliation.toLowerCase())
        );
      });

      if (fuzzyMatch) {
        return {
          success: false,
          error: `Similar author found: "${fuzzyMatch.authorName}" at "${fuzzyMatch.authorAffiliation}"`,
          conflictType: "potential_duplicate",
          suggestedAuthor: {
            id: fuzzyMatch.authorId,
            name: fuzzyMatch.authorName,
            email: fuzzyMatch.authorEmail,
            affiliation: fuzzyMatch.authorAffiliation,
            orcid: fuzzyMatch.authorOrcid,
            researcherId: fuzzyMatch.authorResearcherId,
            publicationCount: fuzzyMatch.publicationCount || 0,
            isResearcher: !!fuzzyMatch.authorResearcherId,
          },
        };
      }

      // Create new external author
      const [newAuthor] = await tx
        .insert(authors)
        .values({
          name: validation.data.name,
          email: validation.data.email || null,
          affiliation: validation.data.affiliation || null,
          orcid: validation.data.orcid || null,
          researcherId: null, // External author
        })
        .returning({
          id: authors.id,
          name: authors.name,
          email: authors.email,
          affiliation: authors.affiliation,
          orcid: authors.orcid,
          researcherId: authors.researcherId,
        });

      return {
        success: true,
        conflictType: "new_author",
        author: {
          ...newAuthor,
          publicationCount: 0,
          isResearcher: false,
        },
      };
    });
  } catch (err) {
    console.error("Author creation error:", err);

    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      err.code === "23505"
    ) {
      return {
        success: false,
        error: "Author with this email or ORCID already exists",
      };
    }

    return {
      success: false,
      error: "Failed to create author",
    };
  }
}

// Helper function for handling researcher selection in publication workflow
export async function handleResearcherSelection(
  researcherId: string,
  needsAuthorRecord: boolean = false
) {
  if (!needsAuthorRecord) {
    // Researcher already has author record, just return the author info
    const authorInfo = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
      })
      .from(authors)
      .where(eq(authors.researcherId, researcherId))
      .limit(1);

    if (authorInfo[0]) {
      return {
        success: true,
        author: {
          ...authorInfo[0],
          publicationCount: 0, // Calculate if needed
          isResearcher: true,
        },
      };
    }
  }

  // Create author record for researcher
  return await createAuthorForResearcher(researcherId);
}

// Keep the createAuthorForResearcher function from previous version
export async function createAuthorForResearcher(researcherId: string) {
  try {
    return await db.transaction(async (tx) => {
      const researcher = await tx
        .select({
          id: researchers.id,
          title: researchers.title,
          orcid: researchers.orcid,
          name: users.name,
          email: users.email,
          affiliation: users.affiliation,
        })
        .from(researchers)
        .innerJoin(users, eq(researchers.userId, users.id))
        .where(eq(researchers.id, researcherId))
        .limit(1);

      if (!researcher[0]) {
        return {
          success: false,
          error: "Researcher not found",
        };
      }

      const r = researcher[0];

      // Check if author record already exists
      const existingAuthor = await tx
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.researcherId, researcherId))
        .limit(1);

      if (existingAuthor[0]) {
        return {
          success: false,
          error: "Author record already exists for this researcher",
        };
      }

      // Create author record
      const [newAuthor] = await tx
        .insert(authors)
        .values({
          name: r.name,
          email: r.email,
          affiliation: r.affiliation,
          orcid: r.orcid,
          researcherId: r.id,
        })
        .returning({
          id: authors.id,
          name: authors.name,
          email: authors.email,
          affiliation: authors.affiliation,
          orcid: authors.orcid,
          researcherId: authors.researcherId,
        });

      return {
        success: true,
        author: {
          ...newAuthor,
          publicationCount: 0,
          isResearcher: true,
        },
      };
    });
  } catch (error) {
    console.error("Error creating author for researcher:", error);
    return {
      success: false,
      error: "Failed to create author record for researcher",
    };
  }
}

export async function createPublication(data: CreatePublicationPayload) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You are no user and definitely not a researcher",
      };
    }
    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Invalid authorization",
        details: "You are no user and definitely not a researcher",
      };
    }

    const creatorId = user.id;

    const validation = createPublicationSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid publication data",
        details: validation.error.errors,
      };
    }

    const validatedData = validation.data;

    // Validate author order uniqueness
    const orderValues = validatedData.authors.map((a) => a.order);
    const uniqueOrders = new Set(orderValues);
    if (orderValues.length !== uniqueOrders.size) {
      return {
        success: false,
        error: "Invalid author data",
        details: "Author order values must be unique",
      };
    }

    let publicationDate = null;

    if (validatedData.publicationDate) {
      if (validatedData.publicationDate instanceof Date) {
        publicationDate = validatedData.publicationDate
          .toISOString()
          .split("T")[0];
      } else {
        const dateStr = validatedData.publicationDate;
        // Validate format but store as-is
        if (
          /^\d{4}$/.test(dateStr) ||
          /^\d{4}-\d{2}$/.test(dateStr) ||
          /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
        ) {
          publicationDate = dateStr;
        }
      }
    }

    // **NEW: Check for duplicate publications**
    let duplicateCheck = null;

    // Primary check: DOI (most reliable)
    if (validatedData.doi) {
      duplicateCheck = await db
        .select({
          id: publications.id,
          title: publications.title,
          doi: publications.doi,
        })
        .from(publications)
        .where(eq(publications.doi, validatedData.doi))
        .limit(1);
    }

    // Secondary check: Title + Venue combination (fallback for publications without DOI)
    if (!duplicateCheck?.length && validatedData.venue) {
      duplicateCheck = await db
        .select({
          id: publications.id,
          title: publications.title,
          venue: publications.venue,
        })
        .from(publications)
        .where(
          and(
            eq(publications.title, validatedData.title),
            eq(publications.venue, validatedData.venue)
          )
        )
        .limit(1);
    }

    // Tertiary check: Title + Publication Date (additional fallback)
    if (!duplicateCheck?.length && publicationDate) {
      duplicateCheck = await db
        .select({
          id: publications.id,
          title: publications.title,
          publicationDate: publications.publicationDate,
        })
        .from(publications)
        .where(
          and(
            eq(publications.title, validatedData.title),
            eq(publications.publicationDate, publicationDate)
          )
        )
        .limit(1);
    }

    if (duplicateCheck && duplicateCheck.length > 0) {
      const duplicate = duplicateCheck[0];
      return {
        success: false,
        error: "Duplicate publication detected",
        details: validatedData.doi
          ? `A publication with DOI "${validatedData.doi}" already exists`
          : `A publication with the same title "${duplicate.title}" already exists in the same venue or publication date`,
        duplicateId: duplicate.id,
      };
    }

    // Fetch citation count if DOI is provided
    let citationCount = 0;
    let lastCitationUpdate = null;

    if (validatedData.doi) {
      try {
        const fetchedCount = await getCitationCount(validatedData.doi);
        if (fetchedCount !== null) {
          citationCount = fetchedCount;
          lastCitationUpdate = new Date();
        }
      } catch (error) {
        console.warn(
          "Failed to fetch citation count during publication creation:",
          error
        );
        // Continue with creation even if citation fetch fails
      }
    }

    // Start a transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // **ADDITIONAL SAFETY CHECK: Recheck for duplicates within transaction**
      // This prevents race conditions where two requests might pass the initial check
      if (validatedData.doi) {
        const transactionDuplicateCheck = await tx
          .select({ id: publications.id })
          .from(publications)
          .where(eq(publications.doi, validatedData.doi))
          .limit(1);

        if (transactionDuplicateCheck.length > 0) {
          throw new Error(`Duplicate DOI detected: ${validatedData.doi}`);
        }
      }

      // Create the publication record
      const [newPublication] = await tx
        .insert(publications)
        .values({
          type: validatedData.type,
          title: validatedData.title,
          abstract: validatedData.abstract || null,
          link: validatedData.link || null,
          creatorId: creatorId,
          publicationDate: publicationDate,
          doi: validatedData.doi || null,
          venue: validatedData.venue || null,
          metadata: validatedData.metadata || {},
          citationCount: citationCount,
          lastCitationUpdate: lastCitationUpdate,
        })
        .returning();

      // Process authors and create author records if needed
      const authorInsertPromises = validatedData.authors.map(
        async (authorData) => {
          let authorId = authorData.id;

          // If author ID provided, verify it exists
          if (authorId) {
            const existingAuthor = await tx
              .select({ id: authors.id })
              .from(authors)
              .where(eq(authors.id, authorId))
              .limit(1);

            if (existingAuthor.length === 0) {
              throw new Error(`Author with ID ${authorId} not found`);
            }
          } else {
            // No author ID provided, find or create the author
            let existingAuthor = null;

            // Normalize empty strings to null for ORCID
            const normalizedOrcid = authorData.orcid?.trim() || null;
            const normalizedEmail = authorData.email?.trim() || null;
            const researcherId = authorData.researcherId || null;

            // FIRST: Check by researcherId if provided (internal researcher scenario)
            if (researcherId) {
              const researcherResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.researcherId, researcherId))
                .limit(1);

              if (researcherResults.length > 0) {
                existingAuthor = researcherResults[0];
              }
            }

            // SECOND: Check by ORCID if provided and no researcher match
            if (!existingAuthor && normalizedOrcid) {
              const orcidResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.orcid, normalizedOrcid))
                .limit(1);

              if (orcidResults.length > 0) {
                existingAuthor = orcidResults[0];
              }
            }

            // THIRD: Check by email if provided and no previous matches
            if (!existingAuthor && normalizedEmail) {
              const emailResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.email, normalizedEmail))
                .limit(1);

              if (emailResults.length > 0) {
                existingAuthor = emailResults[0];
              }
            }

            // If author exists, use existing ID
            if (existingAuthor) {
              authorId = existingAuthor.id;
            } else {
              // Create new author record with normalized data
              try {
                const [newAuthor] = await tx
                  .insert(authors)
                  .values({
                    name: authorData.name.trim(),
                    email: normalizedEmail,
                    affiliation: authorData.affiliation?.trim() || null,
                    orcid: normalizedOrcid,
                    researcherId: researcherId,
                  })
                  .returning({ id: authors.id });

                authorId = newAuthor.id;
              } catch (dbError) {
                // Handle potential race condition where author was created between check and insert
                if (
                  dbError instanceof Error &&
                  dbError.message.includes("duplicate key")
                ) {
                  // Try one more time to find the author by researcherId first, then ORCID/email
                  if (researcherId) {
                    const retryResearcher = await tx
                      .select({ id: authors.id })
                      .from(authors)
                      .where(eq(authors.researcherId, researcherId))
                      .limit(1);
                    if (retryResearcher.length > 0) {
                      authorId = retryResearcher[0].id;
                    }
                  } else if (normalizedOrcid) {
                    const retryOrcid = await tx
                      .select({ id: authors.id })
                      .from(authors)
                      .where(eq(authors.orcid, normalizedOrcid))
                      .limit(1);
                    if (retryOrcid.length > 0) {
                      authorId = retryOrcid[0].id;
                    }
                  } else if (normalizedEmail) {
                    const retryEmail = await tx
                      .select({ id: authors.id })
                      .from(authors)
                      .where(eq(authors.email, normalizedEmail))
                      .limit(1);
                    if (retryEmail.length > 0) {
                      authorId = retryEmail[0].id;
                    }
                  }

                  if (!authorId) {
                    throw dbError; // Re-throw if we still can't find the author
                  }
                } else {
                  throw dbError;
                }
              }
            }
          }

          revalidateTag(CACHED_PUBLICATIONS);

          return {
            authorId,
            authorData,
          };
        }
      );

      // Wait for all author processing to complete
      const processedAuthors = await Promise.all(authorInsertPromises);

      // Create publication-author relationships
      const publicationAuthorData = processedAuthors.map(
        ({ authorId, authorData }) => ({
          publicationId: newPublication.id,
          authorId,
          order: authorData.order,
          contribution: authorData.contribution?.trim() || null,
          isCorresponding: authorData.isCorresponding || false,
        })
      );

      // Sort by order to ensure consistent insertion
      publicationAuthorData.sort((a, b) => a.order - b.order);

      await tx.insert(publicationAuthors).values(publicationAuthorData);

      // 4. Handle research areas if provided
      if (validatedData.areas && validatedData.areas.length > 0) {
        console.log("Research areas to be implemented:", validatedData.areas);
        // TODO: Implement research areas logic
      }

      return newPublication;
    });

    revalidatePath("/portal");
    revalidatePath("/portal/publications");
    // Return success response with the created publication
    return {
      success: true,
      publication: {
        id: result.id,
        type: result.type,
        title: result.title,
        abstract: result.abstract,
        link: result.link,
        creatorId: result.creatorId,
        publicationDate: result.publicationDate,
        doi: result.doi,
        venue: result.venue,
        metadata: result.metadata,
        citationCount: result.citationCount,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
    };
  } catch (error) {
    console.error("Publication creation error:", error);

    // Handle specific database constraint errors
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("Duplicate DOI detected")
      ) {
        return {
          success: false,
          error: "A publication with similar details already exists",
          details: error.message,
        };
      }

      if (error.message.includes("violates check constraint")) {
        return {
          success: false,
          error: "Invalid data format. Please check DOI, URL, and venue fields",
        };
      }

      if (error.message.includes("not found")) {
        return {
          success: false,
          error: "Referenced author not found",
          details: error.message,
        };
      }

      if (error.message.includes("Author order")) {
        return {
          success: false,
          error: error.message,
        };
      }
    }

    return {
      success: false,
      error: "Failed to create publication",
    };
  }
}
