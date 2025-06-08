// "use server";

// import { and, count, eq, ilike, inArray, isNull, or } from "drizzle-orm";
// import { db } from "@/db";
// import {
//   authors,
//   publicationAuthors,
//   researchers,
//   users,
// } from "@/db/schema";
// import {
//   type CreateAuthorPayload,
//   createAuthorSchema,
//   searchAuthorSchema,
// } from "@/lib/validations/author";

// type BaseAuthor = {
//   id: string;
//   name: string;
//   email?: string | null;
//   affiliation?: string | null;
//   orcid?: string | null;
// };

// type Author = BaseAuthor & {
//   researcherId?: string | null;
//   publicationCount?: number;
// };

// type Researcher = {
//   id: string;
//   userId: string;
//   name: string;
//   email: string | null;
//   affiliation: string | null;
//   title: string | null;
//   bio: string | null;
//   featured: boolean;
//   orcid: string | null;
//   avatar: string | null;
// };

// export class AuthorService {
//   static async searchAuthors(query: string, limit: number = 20) {
//     try {
//       const validation = searchAuthorSchema.safeParse({ query, limit });
//       if (!validation.success) {
//         return {
//           success: false,
//           error: "Invalid search parameters",
//         };
//       }

//       const { query: searchQuery, limit: searchLimit } = validation.data;

//       // Search researchers (platform users)
//       const researcherResults = await this.searchResearchers(searchQuery, Math.floor(searchLimit / 2));

//       // Search standalone authors
//       const authorResults = await this.searchStandaloneAuthors(searchQuery, Math.floor(searchLimit / 2));

//       // Get publication counts for standalone authors
//       const publicationCountMap = await this.getAuthorPublicationCounts(authorResults);

//       // Format combined results
//       const results = [
//         ...researcherResults.map(researcher => ({
//           type: "researcher" as const,
//           data: researcher
//         })),
//         ...authorResults.map(author => ({
//           type: "author" as const,
//           data: {
//             ...author,
//             publicationCount: publicationCountMap.get(author.id) || 0
//           }
//         }))
//       ];

//       return { success: true, results };
//     } catch (error) {
//       console.error("Author search error:", error);
//       return {
//         success: false,
//         error: "Failed to search authors",
//       };
//     }
//   }

//   private static async searchResearchers(query: string, limit: number) {
//     return db
//       .select({
//         id: researchers.id,
//         userId: researchers.userId,
//         name: users.name,
//         email: users.email,
//         affiliation: users.affiliation,
//         title: researchers.title,
//         bio: researchers.bio,
//         featured: researchers.featured,
//         orcid: researchers.orcid,
//         avatar: users.image,
//       })
//       .from(researchers)
//       .innerJoin(users, eq(researchers.userId, users.id))
//       .where(
//         or(
//           ilike(users.name, `%${query}%`),
//           ilike(users.email, `%${query}%`),
//           ilike(users.affiliation, `%${query}%`),
//           ilike(researchers.orcid, `%${query}%`)
//         )
//       )
//       .limit(limit);
//   }

//   private static async searchStandaloneAuthors(query: string, limit: number) {
//     return db
//       .select({
//         id: authors.id,
//         name: authors.name,
//         email: authors.email,
//         affiliation: authors.affiliation,
//         orcid: authors.orcid,
//         researcherId: authors.researcherId,
//       })
//       .from(authors)
//       .where(
//         and(
//           isNull(authors.researcherId),
//           or(
//             ilike(authors.name, `%${query}%`),
//             ilike(authors.email, `%${query}%`),
//             ilike(authors.affiliation, `%${query}%`),
//             ilike(authors.orcid, `%${query}%`)
//           )
//         )
//       )
//       .limit(limit);
//   }

//   private static async getAuthorPublicationCounts(authors: Author[]): Promise<Map<string, number>> {
//     const authorIds = authors.map(a => a.id);
//     if (authorIds.length === 0) return new Map();

//     const counts = await db
//       .select({
//         authorId: publicationAuthors.authorId,
//         count: count(),
//       })
//       .from(publicationAuthors)
//       .where(inArray(publicationAuthors.authorId, authorIds))
//       .groupBy(publicationAuthors.authorId);

//     return new Map(counts.map(pc => [pc.authorId, pc.count]));
//   }

//   static async createAuthor(data: CreateAuthorPayload) {
//     try {
//       const validation = createAuthorSchema.safeParse(data);
//       if (!validation.success) {
//         return {
//           success: false,
//           error: "Invalid author data",
//           details: validation.error.errors,
//         };
//       }

//       const { email, name, affiliation, orcid } = validation.data;

//       // Check for existing author
//       const existenceCheck = await this.checkAuthorExists(email, orcid, name, affiliation);
//       if (!existenceCheck.success) {
//         return existenceCheck;
//       }

//       if (existenceCheck.exists) {
//         if (existenceCheck.author) {
//           return {
//             success: true,
//             author: {
//               ...existenceCheck.author,
//               publicationCount: existenceCheck.author.publicationCount || 0
//             },
//             exists: true
//           };
//         }
//         if (existenceCheck.researcher) {
//           return {
//             success: false,
//             error: "This person is already a researcher in the system",
//           };
//         }
//       }

//       // Create new author
//       const [newAuthor] = await db
//         .insert(authors)
//         .values({
//           ...validation.data,
//           researcherId: null,
//         })
//         .returning({
//           id: authors.id,
//           name: authors.name,
//           email: authors.email,
//           affiliation: authors.affiliation,
//           orcid: authors.orcid,
//           researcherId: authors.researcherId,
//         });

//       return {
//         success: true,
//         author: {
//           ...newAuthor,
//           publicationCount: 0,
//         },
//       };
//     } catch (error) {
//       console.error("Author creation error:", error);
//       return {
//         success: false,
//         error: "Failed to create author",
//       };
//     }
//   }

//   static async checkAuthorExists(
//     email?: string | null,
//     orcid?: string | null,
//     name?: string,
//     affiliation?: string | null
//   ) {
//     try {
//       const conditions = [];

//       if (email) {
//         conditions.push(eq(authors.email, email));
//       }

//       if (orcid) {
//         conditions.push(eq(authors.orcid, orcid));
//       }

//       if (conditions.length === 0 && name && affiliation) {
//         conditions.push(
//           and(ilike(authors.name, name), ilike(authors.affiliation, affiliation))
//         );
//       }

//       let existingAuthor = null;
//       if (conditions.length > 0) {
//         const authorResults = await db
//           .select({
//             id: authors.id,
//             name: authors.name,
//             email: authors.email,
//             affiliation: authors.affiliation,
//             orcid: authors.orcid,
//             researcherId: authors.researcherId,
//           })
//           .from(authors)
//           .where(or(...conditions))
//           .limit(1);

//         existingAuthor = authorResults[0] || null;
//       }

//       // Check researchers table for ORCID conflicts
//       let existingResearcher = null;
//       if (orcid) {
//         const researcherResults = await db
//           .select({
//             id: researchers.id,
//             userId: researchers.userId,
//             name: users.name,
//             email: users.email,
//             affiliation: users.affiliation,
//             title: researchers.title,
//             bio: researchers.bio,
//             featured: researchers.featured,
//             orcid: researchers.orcid,
//             avatar: users.image,
//           })
//           .from(researchers)
//           .innerJoin(users, eq(researchers.userId, users.id))
//           .where(eq(researchers.orcid, orcid))
//           .limit(1);

//         existingResearcher = researcherResults[0] || null;
//       }

//       return {
//         success: true,
//         exists: !!existingAuthor || !!existingResearcher,
//         author: existingAuthor,
//         researcher: existingResearcher,
//       };
//     } catch (error) {
//       console.error("Check author exists error:", error);
//       return {
//         success: false,
//         error: "Failed to check if author exists",
//       };
//     }
//   }

//   static async getOrCreateAuthor(data: CreateAuthorPayload) {
//     // First check if author exists
//     const existenceCheck = await this.checkAuthorExists(
//       data.email || undefined,
//       data.orcid || undefined,
//       data.name,
//       data.affiliation || undefined
//     );

//     if (!existenceCheck.success) {
//       return existenceCheck;
//     }

//     if (existenceCheck.exists) {
//       if (existenceCheck.author) {
//         return {
//           success: true,
//           author: existenceCheck.author,
//           created: false
//         };
//       }
//       if (existenceCheck.researcher) {
//         return {
//           success: false,
//           error: "This person is already a researcher in the system",
//         };
//       }
//     }

//     // Author doesn't exist, create new one
//     const creationResult = await this.createAuthor(data);
//     return {
//       ...creationResult,
//       created: creationResult.success
//     };
//   }
// }
// lib/services/author.ts
"use server";

import { db } from "@/db";
import { authors, publicationAuthors, researchers, users } from "@/db/schema";
import {
  type CreateAuthorPayload,
  createAuthorSchema,
  searchAuthorSchema,
} from "@/lib/validations/author";
import { and, count, eq, ilike, inArray, isNull, or } from "drizzle-orm";

// Unified types for author operations
export type AuthorSearchResult = {
  type: "researcher" | "author";
  data: {
    id: string;
    name: string;
    email: string | null;
    affiliation: string | null;
    orcid: string | null;
    avatar?: string | null;
    title?: string | null;
    bio?: string | null;
    featured?: boolean;
    userId?: string;
    researcherId?: string | null;
    publicationCount?: number;
  };
};

type AuthorData = {
  id?: string;
  name: string;
  email?: string | null;
  affiliation?: string | null;
  orcid?: string | null;
  researcherId?: string | null;
  order: number;
  contribution?: string | null;
  isCorresponding?: boolean;
};
export type AuthorExistenceResult = {
  exists: boolean;
  author?: AuthorSearchResult | null;
  conflicts?: {
    email?: boolean;
    orcid?: boolean;
    nameAffiliation?: boolean;
  };
};

// Cache for frequent lookups
const authorCache = new Map<string, AuthorSearchResult[]>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class AuthorService {
  // Unified query builder for author/researcher joins
  private buildAuthorQuery() {
    return {
      researchers: () =>
        db
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
          .innerJoin(users, eq(researchers.userId, users.id)),

      authors: () =>
        db
          .select({
            id: authors.id,
            name: authors.name,
            email: authors.email,
            affiliation: authors.affiliation,
            orcid: authors.orcid,
            researcherId: authors.researcherId,
          })
          .from(authors),
    };
  }

  // Consolidated existence checking
  async checkAuthorExists(
    email?: string,
    orcid?: string,
    name?: string,
    affiliation?: string
  ): Promise<{
    success: boolean;
    result?: AuthorExistenceResult;
    error?: string;
  }> {
    try {
      // const cacheKey = `exists:${email || ""}:${orcid || ""}:${name || ""}:${
      //   affiliation || ""
      // }`;

      const queries = this.buildAuthorQuery();
      const conflicts = {
        email: false,
        orcid: false,
        nameAffiliation: false,
      };

      let foundAuthor: AuthorSearchResult | null = null;

      // Check email conflicts
      if (email) {
        const [authorByEmail] = await queries
          .authors()
          .where(eq(authors.email, email))
          .limit(1);

        if (authorByEmail) {
          conflicts.email = true;
          foundAuthor = {
            type: "author",
            data: {
              ...authorByEmail,
              publicationCount: await this.getPublicationCount(
                authorByEmail.id
              ),
            },
          };
        }

        // Check researchers by email
        const [researcherByEmail] = await queries
          .researchers()
          .where(eq(users.email, email))
          .limit(1);

        if (researcherByEmail) {
          conflicts.email = true;
          foundAuthor = {
            type: "researcher",
            data: researcherByEmail,
          };
        }
      }

      // Check ORCID conflicts
      if (orcid && !foundAuthor) {
        const [authorByOrcid] = await queries
          .authors()
          .where(eq(authors.orcid, orcid))
          .limit(1);

        if (authorByOrcid) {
          conflicts.orcid = true;
          foundAuthor = {
            type: "author",
            data: {
              ...authorByOrcid,
              publicationCount: await this.getPublicationCount(
                authorByOrcid.id
              ),
            },
          };
        }

        const [researcherByOrcid] = await queries
          .researchers()
          .where(eq(researchers.orcid, orcid))
          .limit(1);

        if (researcherByOrcid) {
          conflicts.orcid = true;
          foundAuthor = {
            type: "researcher",
            data: researcherByOrcid,
          };
        }
      }

      // Check name + affiliation combination
      if (name && affiliation && !foundAuthor) {
        const [authorByNameAff] = await queries
          .authors()
          .where(
            and(
              ilike(authors.name, name),
              ilike(authors.affiliation, affiliation)
            )
          )
          .limit(1);

        if (authorByNameAff) {
          conflicts.nameAffiliation = true;
          foundAuthor = {
            type: "author",
            data: {
              ...authorByNameAff,
              publicationCount: await this.getPublicationCount(
                authorByNameAff.id
              ),
            },
          };
        }
      }

      return {
        success: true,
        result: {
          exists: !!foundAuthor,
          author: foundAuthor,
          conflicts: Object.values(conflicts).some(Boolean)
            ? conflicts
            : undefined,
        },
      };
    } catch (error) {
      console.error("Check author exists error:", error);
      return {
        success: false,
        error: "Failed to check if author exists",
      };
    }
  }

  // Unified search functionality
  async searchAuthors(
    query: string,
    limit: number = 20
  ): Promise<{
    success: boolean;
    results?: AuthorSearchResult[];
    error?: string;
  }> {
    try {
      const validation = searchAuthorSchema.safeParse({ query, limit });
      if (!validation.success) {
        return {
          success: false,
          error: "Invalid search parameters",
        };
      }

      const { query: searchQuery, limit: searchLimit } = validation.data;
      const cacheKey = `search:${searchQuery}:${searchLimit}`;

      // Check cache first
      if (authorCache.has(cacheKey)) {
        const cached = authorCache.get(cacheKey);
        if (cached && Array.isArray(cached)) {
          return { success: true, results: cached };
        }
      }

      const queries = this.buildAuthorQuery();

      // Search researchers
      const researcherResults = await queries
        .researchers()
        .where(
          or(
            ilike(users.name, `%${searchQuery}%`),
            ilike(users.email, `%${searchQuery}%`),
            ilike(users.affiliation, `%${searchQuery}%`),
            ilike(researchers.orcid, `%${searchQuery}%`)
          )
        )
        .limit(Math.floor(searchLimit / 2));

      // Search standalone authors
      const authorResults = await queries
        .authors()
        .where(
          and(
            isNull(authors.researcherId),
            or(
              ilike(authors.name, `%${searchQuery}%`),
              ilike(authors.email, `%${searchQuery}%`),
              ilike(authors.affiliation, `%${searchQuery}%`),
              ilike(authors.orcid, `%${searchQuery}%`)
            )
          )
        )
        .limit(Math.floor(searchLimit / 2));

      // Get publication counts for authors
      const publicationCounts = await this.getPublicationCounts(
        authorResults.map((a) => a.id)
      );

      const results: AuthorSearchResult[] = [
        ...researcherResults.map((researcher) => ({
          type: "researcher" as const,
          data: researcher,
        })),
        ...authorResults.map((author) => ({
          type: "author" as const,
          data: {
            ...author,
            publicationCount: publicationCounts.get(author.id) || 0,
          },
        })),
      ];

      // Cache results
      setTimeout(() => authorCache.delete(cacheKey), CACHE_TTL);
      authorCache.set(cacheKey, results);

      return { success: true, results };
    } catch (error) {
      console.error("Author search error:", error);
      return {
        success: false,
        error: "Failed to search authors",
      };
    }
  }

  // Optimized author creation with deduplication
  async createAuthor(data: CreateAuthorPayload): Promise<{
    success: boolean;
    author?: AuthorSearchResult;
    error?: string;
    suggestion?: string;
  }> {
    try {
      const validation = createAuthorSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          error: "Invalid author data",
        };
      }

      const validatedData = validation.data;

      // Use consolidated existence check
      const existenceCheck = await this.checkAuthorExists(
        validatedData.email || undefined,
        validatedData.orcid || undefined,
        validatedData.name,
        validatedData.affiliation || undefined
      );

      if (!existenceCheck.success) {
        return existenceCheck;
      }

      const { result } = existenceCheck;

      if (result?.exists && result.author) {
        // Handle different conflict scenarios
        if (result.conflicts?.email) {
          return {
            success: false,
            error: "Author with this email already exists",
            suggestion: "Use the existing author record instead",
          };
        }

        if (result.conflicts?.orcid) {
          return {
            success: false,
            error: "Author with this ORCID already exists",
            suggestion: "Use the existing author record instead",
          };
        }

        if (result.conflicts?.nameAffiliation) {
          return {
            success: false,
            error:
              "A similar author (same name and affiliation) already exists",
            suggestion: "Consider using the existing author record instead",
          };
        }

        // If exists but no specific conflicts, return existing author
        return {
          success: true,
          author: result.author,
        };
      }

      // Create new author
      const [newAuthor] = await db
        .insert(authors)
        .values({
          ...validatedData,
          researcherId: null,
        })
        .returning({
          id: authors.id,
          name: authors.name,
          email: authors.email,
          affiliation: authors.affiliation,
          orcid: authors.orcid,
          researcherId: authors.researcherId,
        });

      const authorResult: AuthorSearchResult = {
        type: "author",
        data: {
          ...newAuthor,
          publicationCount: 0,
        },
      };

      // Clear relevant cache entries
      this.clearCache();

      return {
        success: true,
        author: authorResult,
      };
    } catch (error) {
      console.error("Author creation error:", error);
      return {
        success: false,
        error: "Failed to create author",
      };
    }
  }

  // Batch author processing for publication creation
  async processAuthorsForPublication(authorsData: Array<AuthorData>): Promise<{
    success: boolean;
    processedAuthors?: Array<{ authorId: string; authorData: AuthorData }>;
    error?: string;
  }> {
    try {
      const processedAuthors = await Promise.all(
        authorsData.map(async (authorData) => {
          let authorId = authorData.id;

          if (!authorId) {
            // Check if author exists
            const existenceCheck = await this.checkAuthorExists(
              authorData.email || undefined,
              authorData.orcid || undefined,
              authorData.name,
              authorData.affiliation || undefined
            );

            if (
              existenceCheck.success &&
              existenceCheck.result?.exists &&
              existenceCheck.result.author
            ) {
              authorId = existenceCheck.result.author.data.id;
            } else {
              // Create new author
              const createResult = await this.createAuthor({
                name: authorData.name,
                email: authorData.email,
                affiliation: authorData.affiliation,
                orcid: authorData.orcid,
                researcherId: authorData.researcherId,
              });

              if (!createResult.success || !createResult.author) {
                throw new Error(`Failed to create author: ${authorData.name}`);
              }

              authorId = createResult.author.data.id;
            }
          }

          return {
            authorId,
            authorData,
          };
        })
      );

      return {
        success: true,
        processedAuthors,
      };
    } catch (error) {
      console.error("Batch author processing error:", error);
      return {
        success: false,
        error: "Failed to process authors for publication",
      };
    }
  }

  // Helper methods
  private async getPublicationCount(authorId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(publicationAuthors)
      .where(eq(publicationAuthors.authorId, authorId));

    return result?.count || 0;
  }

  private async getPublicationCounts(
    authorIds: string[]
  ): Promise<Map<string, number>> {
    if (authorIds.length === 0) return new Map();

    const counts = await db
      .select({
        authorId: publicationAuthors.authorId,
        count: count(),
      })
      .from(publicationAuthors)
      .where(inArray(publicationAuthors.authorId, authorIds))
      .groupBy(publicationAuthors.authorId);

    return new Map(counts.map((c) => [c.authorId, c.count]));
  }

  private clearCache() {
    authorCache.clear();
  }
}

// Export singleton instance
export const authorService = new AuthorService();
