"use server";

import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
  users,
} from "@/db/schema";
import { searchSchema } from "@/lib/validations";
import { searchAuthorSchema } from "@/lib/validations/author";

export async function searchAuthors(query: string, limit: number = 20) {
  try {
    const validation = searchAuthorSchema.safeParse({ query, limit });
    if (!validation.success) {
      return {
        success: false as const,
        error: "Invalid search parameters",
      };
    }

    const { query: searchQuery, limit: searchLimit } = validation.data;
    const searchPattern = `%${searchQuery.trim()}%`;

    // console.log({ searchPattern });

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
        // Get publication count directly in the query
        publicationCount: sql<number>`(
          SELECT COALESCE(COUNT(*), 0)::int 
          FROM ${authors} a
          JOIN ${publicationAuthors} pa ON a.id = pa.author_id
          WHERE a.researcher_id = ${researchers.id}
        )`,
      })
      .from(researchers)
      .innerJoin(users, eq(researchers.userId, users.id))
      .where(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(users.affiliation, searchPattern),
          ilike(researchers.orcid, searchPattern)
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // console.log({ researcherResults });
    // Search standalone authors (not linked to researchers) with publication count
    const authorResults = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
        // Get publication count directly in the query
        publicationCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${publicationAuthors} 
          WHERE ${publicationAuthors.authorId} = ${authors.id}
        )`,
      })
      .from(authors)
      .where(
        and(
          isNull(authors.researcherId), // Only standalone authors
          or(
            ilike(authors.name, searchPattern),
            ilike(authors.email, searchPattern),
            ilike(authors.affiliation, searchPattern),
            ilike(authors.orcid, searchPattern)
          )
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // console.log({ authorResults });
    return {
      success: true as const,
      results: [
        ...researcherResults.map((r) => ({
          type: "researcher" as const,
          data: r,
        })),
        ...authorResults.map((a) => ({ type: "author" as const, data: a })),
      ],
    };
  } catch (error) {
    console.error("Author search error:", error);
    return {
      success: false as const,
      error: "Failed to search authors",
    };
  }
}

// export async function searchPublications(query: string, limit: number = 20) {
//   try {
//     const validation = searchSchema.safeParse({ query, limit });
//     if (!validation.success) {
//       return {
//         success: false as const,
//         error: "Invalid search parameters",
//       };
//     }

//     const { query: searchQuery, limit: searchLimit } = validation.data;
//     const searchPattern = `%${searchQuery.trim()}%`;

//     // Search publications with basic author info
//     const publicationResults = await db
//       .select({
//         id: publications.id,
//         type: publications.type,
//         title: publications.title,
//         abstract: publications.abstract,
//         link: publications.link,
//         publicationDate: publications.publicationDate,
//         doi: publications.doi,
//         venue: publications.venue,
//         citationCount: publications.citationCount,
//         // Get first author name for display
//         firstAuthor: sql<string | null>`(
//           SELECT a.name
//           FROM ${authors.name}
//           JOIN ${publicationAuthors} pa ON a.id = pa.author_id
//           WHERE pa.pub_id = ${publications.id}
//           ORDER BY pa.order ASC
//           LIMIT 1
//         )`,
//         // Get total author count
//         authorCount: sql<number>`(
//           SELECT COUNT(*)::int
//           FROM ${publicationAuthors}
//           WHERE ${publicationAuthors.publicationId} = ${publications.id}
//         )`,
//       })
//       .from(publications)
//       .where(
//         or(
//           ilike(publications.title, searchPattern),
//           ilike(publications.abstract, searchPattern),
//           ilike(publications.venue, searchPattern),
//           ilike(publications.doi, searchPattern)
//         )
//       )
//       .orderBy(publications.citationCount) // Order by citation count (most cited first)
//       .limit(searchLimit);

//     return {
//       success: true as const,
//       results: publicationResults,
//     };
//   } catch (error) {
//     console.error("Publication search error:", error);
//     return {
//       success: false as const,
//       error: "Failed to search publications",
//     };
//   }
// }

export async function searchPublications(query: string, limit: number = 20) {
  try {
    const validation = searchSchema.safeParse({ query, limit });
    if (!validation.success) {
      return {
        success: false as const,
        error: "Invalid search parameters",
      };
    }

    const { query: searchQuery, limit: searchLimit } = validation.data;
    const searchPattern = `%${searchQuery.trim()}%`;

    const results = await db.query.publications.findMany({
      where: or(
        ilike(publications.title, searchPattern),
        ilike(publications.abstract, searchPattern),
        ilike(publications.venue, searchPattern),
        ilike(publications.doi, searchPattern)
      ),
      with: {
        authors: {
          columns: {
            order: true,
            isCorresponding: true,
          },
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                email: true,
                affiliation: true,
                orcid: true,
              },
              with: {
                researcher: {
                  columns: {
                    id: true,
                    title: true,
                    orcid: true,
                  },
                },
              },
            },
          },
          orderBy: (authors, { asc }) => [asc(authors.order)],
        },
      },
      orderBy: (publications, { desc }) => [desc(publications.citationCount)],
      limit: searchLimit,
    });

    const formattedResults = results.map((pub) => ({
      id: pub.id,
      type: pub.type,
      title: pub.title,
      abstract: pub.abstract,
      link: pub.link,
      publicationDate: pub.publicationDate,
      doi: pub.doi,
      venue: pub.venue,
      citationCount: pub.citationCount,
      authors: pub.authors.map(({ order, isCorresponding, author }) => ({
        id: author.id,
        name: author.name,
        email: author.email,
        affiliation: author.affiliation,
        orcid: author.orcid,
        order,
        isCorresponding,
        researcher: author.researcher || null,
      })),
    }));

    return {
      success: true as const,
      results: formattedResults,
    };
  } catch (error) {
    console.error("Publication search error:", error);
    return {
      success: false as const,
      error: "Failed to search publications",
    };
  }
}
