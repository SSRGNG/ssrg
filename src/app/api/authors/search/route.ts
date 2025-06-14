import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { authors, publicationAuthors, researchers, users } from "@/db/schema";
import { searchAuthorSchema } from "@/lib/validations/author";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Validate input
    const validation = searchAuthorSchema.safeParse({ query, limit });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid search parameters",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { query: searchQuery, limit: searchLimit } = validation.data;
    const searchPattern = `%${searchQuery}%`;

    console.log({ searchPattern });

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

    console.log({ researcherResults });

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

    console.log({ authorResults });

    // Format results
    const results = [
      ...researcherResults.map((researcher) => ({
        type: "researcher" as const,
        data: {
          id: researcher.id,
          userId: researcher.userId,
          name: researcher.name || "",
          email: researcher.email || "",
          affiliation: researcher.affiliation || "",
          title: researcher.title || "",
          bio: researcher.bio || "",
          featured: researcher.featured || false,
          orcid: researcher.orcid || "",
          avatar: researcher.avatar || "",
          publicationCount: researcher.publicationCount || 0,
        },
      })),
      ...authorResults.map((author) => ({
        type: "author" as const,
        data: {
          id: author.id,
          name: author.name || "",
          email: author.email || "",
          affiliation: author.affiliation || "",
          orcid: author.orcid || "",
          researcherId: author.researcherId,
          publicationCount: author.publicationCount || 0,
        },
      })),
    ];

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Author search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search authors",
      },
      { status: 500 }
    );
  }
}
