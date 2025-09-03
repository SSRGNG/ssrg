"use server";

import { and, eq, ilike, isNull, ne, or, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/auth";
import { CACHED_PUBLICATIONS } from "@/config/constants";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchAreaPublications,
  researchers,
  users,
} from "@/db/schema";
import { getCitationCount } from "@/lib/actions/citations";
import { isRoleAllowed } from "@/lib/utils";
import {
  calculateNameSimilarity,
  normalizeAuthorName,
} from "@/lib/utils/fuzzy-name";
import {
  type CreateAuthorPayload,
  createAuthorSchema,
  type UpdateAuthorPayload,
  updateAuthorSchema,
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
            const isAutoFillEmail = authorData.email === "auto-fill@ssrg.org";

            // Normalize empty strings to null
            const normalizedOrcid = authorData.orcid?.trim() || null;
            const normalizedEmail = isAutoFillEmail
              ? null
              : authorData.email?.trim() || null;
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

            // THIRD: Check by email if provided, not auto-fill, and no previous matches
            if (!existingAuthor && normalizedEmail && !isAutoFillEmail) {
              const emailResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.email, normalizedEmail))
                .limit(1);

              if (emailResults.length > 0) {
                existingAuthor = emailResults[0];
              }
            }

            // FOURTH: For auto-fill emails, try to find by name + affiliation combination
            if (!existingAuthor && isAutoFillEmail) {
              const nameAffiliationResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(
                  and(
                    eq(authors.name, authorData.name.trim()),
                    authorData.affiliation
                      ? eq(authors.affiliation, authorData.affiliation.trim())
                      : isNull(authors.affiliation)
                  )
                )
                .limit(1);

              if (nameAffiliationResults.length > 0) {
                existingAuthor = nameAffiliationResults[0];
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
                // if (
                //   dbError instanceof Error &&
                //   dbError.message.includes("duplicate key")
                // ) {
                //   // Try one more time to find the author by researcherId first, then ORCID/email
                //   if (researcherId) {
                //     const retryResearcher = await tx
                //       .select({ id: authors.id })
                //       .from(authors)
                //       .where(eq(authors.researcherId, researcherId))
                //       .limit(1);
                //     if (retryResearcher.length > 0) {
                //       authorId = retryResearcher[0].id;
                //     }
                //   } else if (normalizedOrcid) {
                //     const retryOrcid = await tx
                //       .select({ id: authors.id })
                //       .from(authors)
                //       .where(eq(authors.orcid, normalizedOrcid))
                //       .limit(1);
                //     if (retryOrcid.length > 0) {
                //       authorId = retryOrcid[0].id;
                //     }
                //   } else if (normalizedEmail) {
                //     const retryEmail = await tx
                //       .select({ id: authors.id })
                //       .from(authors)
                //       .where(eq(authors.email, normalizedEmail))
                //       .limit(1);
                //     if (retryEmail.length > 0) {
                //       authorId = retryEmail[0].id;
                //     }
                //   }

                //   if (!authorId) {
                //     throw dbError; // Re-throw if we still can't find the author
                //   }
                // } else {
                //   throw dbError;
                // }

                if (
                  dbError instanceof Error &&
                  dbError.message.includes("duplicate key")
                ) {
                  // Try one more time to find the author by researcherId first, then ORCID/name+affiliation
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
                  } else if (normalizedEmail && !isAutoFillEmail) {
                    const retryEmail = await tx
                      .select({ id: authors.id })
                      .from(authors)
                      .where(eq(authors.email, normalizedEmail))
                      .limit(1);
                    if (retryEmail.length > 0) {
                      authorId = retryEmail[0].id;
                    }
                  } else if (isAutoFillEmail) {
                    // Retry fuzzy matching by name for auto-fill
                    const normalizedInputName = normalizeAuthorName(
                      authorData.name.trim()
                    );

                    // Get potential matches
                    const potentialRetryMatches = await tx
                      .select({
                        id: authors.id,
                        name: authors.name,
                      })
                      .from(authors)
                      .limit(20);

                    // Find best match
                    let bestRetryMatch = null;
                    let bestRetryScore = 0;
                    const RETRY_SIMILARITY_THRESHOLD = 0.85;

                    for (const author of potentialRetryMatches) {
                      const normalizedDbName = normalizeAuthorName(author.name);
                      const similarity = calculateNameSimilarity(
                        normalizedInputName,
                        normalizedDbName
                      );

                      if (
                        similarity > bestRetryScore &&
                        similarity >= RETRY_SIMILARITY_THRESHOLD
                      ) {
                        bestRetryScore = similarity;
                        bestRetryMatch = author;
                      }
                    }

                    if (bestRetryMatch) {
                      authorId = bestRetryMatch.id;
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
        // Prepare research area publications data
        const researchAreaPubData = validatedData.areas.map(
          ({ order, researchAreaId }) => ({
            researchAreaId,
            publicationId: newPublication.id,
            order,
          })
        );

        await tx.insert(researchAreaPublications).values(researchAreaPubData);
      }

      return newPublication;
    });

    revalidateTag(CACHED_PUBLICATIONS);
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

export async function deletePublication(publicationId: string) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User does not have permission to delete publications",
      };
    }

    const userId = user.id;

    // Validate publication ID
    if (!publicationId || typeof publicationId !== "string") {
      return {
        success: false,
        error: "Invalid publication ID",
        details: "Publication ID is required and must be a valid string",
      };
    }

    // Check if publication exists and verify permissions
    const publicationQuery = await db
      .select({
        id: publications.id,
        title: publications.title,
        creatorId: publications.creatorId,
        userAuthorOrder: publicationAuthors.order,
        minAuthorOrder:
          sql<number>`MIN(${publicationAuthors.order}) OVER (PARTITION BY ${publications.id})`.as(
            "minAuthorOrder"
          ),
      })
      .from(publications)
      .innerJoin(
        publicationAuthors,
        eq(publicationAuthors.publicationId, publications.id)
      )
      .innerJoin(authors, eq(authors.id, publicationAuthors.authorId))
      .innerJoin(researchers, eq(researchers.id, authors.researcherId))
      .where(
        and(eq(publications.id, publicationId), eq(researchers.userId, userId))
      )
      .limit(1);

    if (publicationQuery.length === 0) {
      return {
        success: false,
        error: "Publication not found",
        details: "Publication does not exist or you don't have access to it",
      };
    }

    const publication = publicationQuery[0];

    // Check deletion permissions:
    // 1. User is admin OR
    // 2. User is the creator OR
    // 3. User is the lead author (lowest order number)
    const canDelete =
      user.role === "admin" ||
      publication.creatorId === userId ||
      publication.userAuthorOrder === publication.minAuthorOrder;

    if (!canDelete) {
      return {
        success: false,
        error: "Insufficient permissions",
        details:
          "You can only delete publications you created or where you are the lead author",
      };
    }

    // Start transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Delete publication-author relationships first (foreign key constraint)
      await tx
        .delete(publicationAuthors)
        .where(eq(publicationAuthors.publicationId, publicationId));

      await tx
        .delete(researchAreaPublications)
        .where(eq(researchAreaPublications.publicationId, publicationId));

      // Finally, delete the publication
      const deletedPublication = await tx
        .delete(publications)
        .where(eq(publications.id, publicationId))
        .returning({
          id: publications.id,
          title: publications.title,
        });

      if (deletedPublication.length === 0) {
        throw new Error("Failed to delete publication");
      }

      return deletedPublication[0];
    });

    // Revalidate relevant paths and tags
    revalidateTag(CACHED_PUBLICATIONS);
    revalidatePath("/portal");
    revalidatePath("/portal/publications");

    return {
      success: true,
      message: `Publication "${result.title}" deleted successfully`,
      deletedPublication: {
        id: result.id,
        title: result.title,
      },
    };
  } catch (error) {
    console.error("Publication deletion error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        return {
          success: false,
          error: "Cannot delete publication",
          details: "Publication has associated data that must be removed first",
        };
      }

      if (error.message.includes("not found")) {
        return {
          success: false,
          error: "Publication not found",
          details: "The publication may have already been deleted",
        };
      }
    }

    return {
      success: false,
      error: "Failed to delete publication",
      details: "An unexpected error occurred while deleting the publication",
    };
  }
}

// Optional: Bulk delete function for multiple publications
export async function deleteMultiplePublications(publicationIds: string[]) {
  try {
    const user = (await auth())?.user;
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User not authenticated",
      };
    }

    const allowedRole = isRoleAllowed(["admin", "researcher"], user.role);
    if (!allowedRole) {
      return {
        success: false,
        error: "Unauthorized",
        details: "User does not have permission to delete publications",
      };
    }

    if (!Array.isArray(publicationIds) || publicationIds.length === 0) {
      return {
        success: false,
        error: "Invalid input",
        details: "Publication IDs must be a non-empty array",
      };
    }

    // const userId = user.id;
    const results = [];
    const errors = [];

    // Process each publication individually to maintain proper permission checks
    for (const publicationId of publicationIds) {
      const result = await deletePublication(publicationId);
      if (result.success) {
        results.push(result.deletedPublication);
      } else {
        errors.push({
          publicationId,
          error: result.error,
          details: result.details,
        });
      }
    }

    return {
      success: errors.length === 0,
      deletedCount: results.length,
      deletedPublications: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${results.length} publication(s)${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
    };
  } catch (error) {
    console.error("Bulk publication deletion error:", error);
    return {
      success: false,
      error: "Failed to delete publications",
      details: "An unexpected error occurred during bulk deletion",
    };
  }
}

export async function updateAuthor(formData: UpdateAuthorPayload) {
  try {
    const authUser = (await auth())?.user;

    const parsedResult = updateAuthorSchema.safeParse(formData);

    if (!parsedResult.success) {
      return {
        error: "Invalid input",
        details: parsedResult.error.format(),
      };
    }

    if (!authUser) {
      return {
        error: "Unauthorized. You cannot update this author account.",
      };
    }

    const { id, affiliation, orcid, email, name, researcherId } =
      parsedResult.data;

    // Email uniqueness (if email is editable)
    if (email) {
      const existingEmail = await db
        .select({ id: authors.id })
        .from(authors)
        .where(and(eq(authors.email, email), ne(authors.id, id)))
        .limit(1);
      if (existingEmail.length > 0) {
        return { error: "Another author with this email already exists" };
      }
    }

    // ORCID uniqueness across authors
    if (orcid) {
      // Check ORCID against other authors
      const existingOrcid = await db
        .select({ id: authors.id })
        .from(authors)
        .where(and(eq(authors.orcid, orcid), ne(authors.id, id)))
        .limit(1);

      if (existingOrcid.length > 0) {
        return { error: "Another author with this ORCID already exists" };
      }

      // Only check researchers table if this author isn't linked to one,
      // or to make sure we don't collide with *other* researchers
      if (!researcherId) {
        const existingResearcherOrcid = await db
          .select({ id: researchers.id })
          .from(researchers)
          .where(eq(researchers.orcid, orcid))
          .limit(1);

        if (existingResearcherOrcid.length > 0) {
          return { error: "A researcher with this ORCID already exists" };
        }
      } else {
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
    }

    // Optional: name + affiliation duplicate check
    if (name && affiliation) {
      const potentialDuplicate = await db
        .select({ id: authors.id })
        .from(authors)
        .where(
          and(
            ilike(authors.name, name),
            ilike(authors.affiliation, affiliation),
            ne(authors.id, id)
          )
        )
        .limit(1);
      if (potentialDuplicate.length > 0) {
        return { error: "A similar author already exists" };
      }
    }
    await db
      .update(authors)
      .set({
        name: name,
        email: email,
        affiliation: affiliation || null,
        orcid: orcid || null,
        researcherId: researcherId || null,
        updated_at: new Date(),
      })
      .where(eq(authors.id, id));

    revalidatePath("/portal/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating author profile:", error);
    return {
      error: "Failed to update author profile. Please try again.",
    };
  }
}
