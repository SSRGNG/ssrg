"use server";

import { and, count, eq, ilike, inArray, isNull, or } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
  users,
} from "@/db/schema";
import { isRoleAllowed } from "@/lib/utils";
import {
  type CreateAuthorPayload,
  createAuthorSchema,
  searchAuthorSchema,
} from "@/lib/validations/author";
import {
  CreatePublicationPayload,
  createPublicationSchema,
} from "@/lib/validations/publication";

export async function searchAuthors(query: string, limit: number = 20) {
  try {
    const validation = searchAuthorSchema.safeParse({ query, limit });
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid search parameters",
      };
    }

    const { query: searchQuery, limit: searchLimit } = validation.data;

    // Search researchers (with user data) - these are platform users
    const researcherResults = await db
      .select({
        id: researchers.id,
        userId: researchers.userId,
        name: users.name,
        email: users.email,
        affiliation: users.affiliation,
        title: researchers.title,
        bio: researchers.bio,
        featured: researchers.featured,
        orcid: researchers.orcid,
        avatar: users.image,
      })
      .from(researchers)
      .innerJoin(users, eq(researchers.userId, users.id))
      .where(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`),
          ilike(users.affiliation, `%${searchQuery}%`),
          ilike(researchers.orcid, `%${searchQuery}%`)
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // Search standalone authors (not linked to researchers)
    // These are external authors who have been added to publications but aren't platform users
    const authorResults = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
      })
      .from(authors)
      .where(
        and(
          isNull(authors.researcherId), // Only standalone authors (not linked to researchers)
          or(
            ilike(authors.name, `%${searchQuery}%`),
            ilike(authors.email, `%${searchQuery}%`),
            ilike(authors.affiliation, `%${searchQuery}%`),
            ilike(authors.orcid, `%${searchQuery}%`)
          )
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // Get publication counts for standalone authors
    const authorIds = authorResults.map((a) => a.id);
    let publicationCounts: { authorId: string; count: number }[] = [];

    if (authorIds.length > 0) {
      publicationCounts = await db
        .select({
          authorId: publicationAuthors.authorId,
          count: count(),
        })
        .from(publicationAuthors)
        .where(inArray(publicationAuthors.authorId, authorIds))
        .groupBy(publicationAuthors.authorId);
    }

    const publicationCountMap = new Map(
      publicationCounts.map((pc) => [pc.authorId, pc.count])
    );

    // Format results to match your component types
    const results = [
      ...researcherResults.map((researcher) => ({
        type: "researcher" as const,
        data: {
          id: researcher.id,
          userId: researcher.userId,
          name: researcher.name,
          email: researcher.email,
          affiliation: researcher.affiliation,
          title: researcher.title,
          bio: researcher.bio,
          featured: researcher.featured,
          orcid: researcher.orcid,
          avatar: researcher.avatar,
        },
      })),
      ...authorResults.map((author) => ({
        type: "author" as const,
        data: {
          id: author.id,
          name: author.name,
          email: author.email,
          affiliation: author.affiliation,
          orcid: author.orcid,
          researcherId: author.researcherId,
          publicationCount: publicationCountMap.get(author.id) || 0,
        },
      })),
    ];

    return { success: true, results };
  } catch (error) {
    console.error("Author search error:", error);
    return {
      success: false,
      error: "Failed to search authors",
    };
  }
}

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

export async function checkAuthorExists(
  email?: string,
  orcid?: string,
  name?: string,
  affiliation?: string
) {
  try {
    const conditions = [];

    if (email) {
      conditions.push(eq(authors.email, email));
    }

    if (orcid) {
      conditions.push(eq(authors.orcid, orcid));
    }

    if (conditions.length === 0 && name && affiliation) {
      // Fallback to name + affiliation match
      conditions.push(
        and(ilike(authors.name, name), ilike(authors.affiliation, affiliation))
      );
    }

    if (conditions.length === 0) {
      return { success: true, exists: false };
    }

    const existingAuthor = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
      })
      .from(authors)
      .where(or(...conditions))
      .limit(1);

    // Also check researchers table
    const researcherConditions = [];

    if (orcid) {
      researcherConditions.push(eq(researchers.orcid, orcid));
    }

    let existingResearcher = null;
    if (researcherConditions.length > 0) {
      const researcherResults = await db
        .select({
          id: researchers.id,
          userId: researchers.userId,
          name: users.name,
          email: users.email,
          affiliation: users.affiliation,
          title: researchers.title,
          bio: researchers.bio,
          featured: researchers.featured,
          orcid: researchers.orcid,
          avatar: users.image,
        })
        .from(researchers)
        .innerJoin(users, eq(researchers.userId, users.id))
        .where(or(...researcherConditions))
        .limit(1);

      existingResearcher = researcherResults[0] || null;
    }

    return {
      success: true,
      exists: existingAuthor.length > 0 || !!existingResearcher,
      author: existingAuthor[0] || null,
      researcher: existingResearcher,
    };
  } catch (error) {
    console.error("Check author exists error:", error);
    return {
      success: false,
      error: "Failed to check if author exists",
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

    // Start a transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // 1. Create the publication record
      const [newPublication] = await tx
        .insert(publications)
        .values({
          type: validatedData.type,
          title: validatedData.title,
          abstract: validatedData.abstract || null,
          link: validatedData.link || null,
          creatorId: creatorId,
          publicationDate: validatedData.publicationDate || null,
          doi: validatedData.doi || null,
          venue: validatedData.venue || null,
          metadata: validatedData.metadata || {},
          citationCount: 0,
          lastCitationUpdate: null,
        })
        .returning();

      // 2. Process authors and create author records if needed
      const authorInsertPromises = validatedData.authors.map(
        async (authorData) => {
          let authorId = authorData.id;

          // If no author ID provided, we need to find or create the author
          if (!authorId) {
            // Check if this author already exists
            let existingAuthor = null;

            // First check by ORCID if provided
            if (authorData.orcid) {
              const orcidResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.orcid, authorData.orcid))
                .limit(1);

              if (orcidResults.length > 0) {
                existingAuthor = orcidResults[0];
              }
            }

            // Then check by email if provided and no ORCID match
            if (!existingAuthor && authorData.email) {
              const emailResults = await tx
                .select({ id: authors.id })
                .from(authors)
                .where(eq(authors.email, authorData.email))
                .limit(1);

              if (emailResults.length > 0) {
                existingAuthor = emailResults[0];
              }
            }

            // If author exists, use existing ID
            if (existingAuthor) {
              authorId = existingAuthor.id;
            } else {
              // Create new author record
              const [newAuthor] = await tx
                .insert(authors)
                .values({
                  name: authorData.name,
                  email: authorData.email || null,
                  affiliation: authorData.affiliation || null,
                  orcid: authorData.orcid || null,
                  researcherId: authorData.researcherId || null,
                })
                .returning({ id: authors.id });

              authorId = newAuthor.id;
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

      // 3. Create publication-author relationships
      const publicationAuthorData = processedAuthors.map(
        ({ authorId, authorData }) => ({
          publicationId: newPublication.id,
          authorId,
          order: authorData.order,
          contribution: authorData.contribution || null,
          isCorresponding: authorData.isCorresponding || false,
        })
      );

      await tx.insert(publicationAuthors).values(publicationAuthorData);

      // 4. Handle research areas if provided
      if (validatedData.areas && validatedData.areas.length > 0) {
        console.log("Research areas to be implemented:", validatedData.areas);
      }

      return newPublication;
    });

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
      if (error.message.includes("duplicate key")) {
        return {
          success: false,
          error: "A publication with similar details already exists",
        };
      }

      if (error.message.includes("violates check constraint")) {
        return {
          success: false,
          error: "Invalid data format. Please check DOI, URL, and venue fields",
        };
      }
    }

    return {
      success: false,
      error: "Failed to create publication",
    };
  }
}

// import { auth } from "@/auth";
// import { db } from "@/db";
// import { publications, publicationAuthors } from "@/db/schema";
// import { authorService } from "@/lib/services/author";
// import {
//   CreatePublicationPayload,
//   createPublicationSchema,
// } from "@/lib/validations/publication";

// // Re-export author-related functions from the service
// export const searchAuthors = authorService.searchAuthors.bind(authorService);
// export const createAuthor = authorService.createAuthor.bind(authorService);
// export const checkAuthorExists = authorService.checkAuthorExists.bind(authorService);

// export async function createPublication(data: CreatePublicationPayload) {
//   try {
//     const user = (await auth())?.user;
//     if (user?.role !== "researcher" || !user.id) {
//       return {
//         success: false,
//         error: "Invalid authorization",
//         details: "You must be a researcher to create publications",
//       };
//     }

//     const creatorId = user.id;

//     // Validate the publication data
//     const validation = createPublicationSchema.safeParse(data);
//     if (!validation.success) {
//       return {
//         success: false,
//         error: "Invalid publication data",
//         details: validation.error.errors,
//       };
//     }

//     const validatedData = validation.data;

//     // Use the author service for batch processing
//     const authorProcessingResult = await authorService.processAuthorsForPublication(
//       validatedData.authors
//     );

//     if (!authorProcessingResult.success || !authorProcessingResult.processedAuthors) {
//       return {
//         success: false,
//         error: authorProcessingResult.error || "Failed to process authors",
//       };
//     }

//     // Extract processedAuthors to ensure TypeScript knows it's defined
//     const processedAuthors = authorProcessingResult.processedAuthors;

//     // Create publication in transaction
//     const result = await db.transaction(async (tx) => {
//       // 1. Create the publication record
//       const [newPublication] = await tx
//         .insert(publications)
//         .values({
//           type: validatedData.type,
//           title: validatedData.title,
//           abstract: validatedData.abstract || null,
//           link: validatedData.link || null,
//           creatorId: creatorId,
//           publicationDate: validatedData.publicationDate || null,
//           doi: validatedData.doi || null,
//           venue: validatedData.venue || null,
//           metadata: validatedData.metadata || {},
//           citationCount: 0,
//           lastCitationUpdate: null,
//         })
//         .returning();

//       // 2. Create publication-author relationships
//       const publicationAuthorData = processedAuthors.map(
//         ({ authorId, authorData }) => ({
//           publicationId: newPublication.id,
//           authorId,
//           order: authorData.order,
//           contribution: authorData.contribution || null,
//           isCorresponding: authorData.isCorresponding || false,
//         })
//       );

//       await tx.insert(publicationAuthors).values(publicationAuthorData);

//       // 3. Handle research areas if provided (future implementation)
//       if (validatedData.areas && validatedData.areas.length > 0) {
//         console.log("Research areas to be implemented:", validatedData.areas);
//       }

//       return newPublication;
//     });

//     return {
//       success: true,
//       publication: {
//         id: result.id,
//         type: result.type,
//         title: result.title,
//         abstract: result.abstract,
//         link: result.link,
//         creatorId: result.creatorId,
//         publicationDate: result.publicationDate,
//         doi: result.doi,
//         venue: result.venue,
//         metadata: result.metadata,
//         citationCount: result.citationCount,
//         created_at: result.created_at,
//         updated_at: result.updated_at,
//       },
//     };
//   } catch (error) {
//     console.error("Publication creation error:", error);

//     // Handle specific database constraint errors
//     if (error instanceof Error) {
//       if (error.message.includes("duplicate key")) {
//         return {
//           success: false,
//           error: "A publication with similar details already exists",
//         };
//       }

//       if (error.message.includes("violates check constraint")) {
//         return {
//           success: false,
//           error: "Invalid data format. Please check DOI, URL, and venue fields",
//         };
//       }
//     }

//     return {
//       success: false,
//       error: "Failed to create publication",
//     };
//   }
// }
