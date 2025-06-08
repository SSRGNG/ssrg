import { and, eq, ilike, isNull, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { authors, publicationAuthors, researchers, users } from "@/db/schema";
import {
  createAuthorSchema,
  searchAuthorSchema,
} from "@/lib/validations/author";

// GET: Search for authors and researchers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "20");

    const validation = searchAuthorSchema.safeParse({ query, limit });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { query: searchQuery, limit: searchLimit } = validation.data;

    // Search researchers (with user data for name, email, avatar)
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
        role: users.role,
      })
      .from(researchers)
      .innerJoin(users, eq(researchers.userId, users.id))
      .where(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`),
          ilike(users.affiliation, `%${searchQuery}%`)
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // Search standalone authors (not linked to researchers)
    const authorResults = await db
      .select({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
        // type: "author" as const,
        // Get publication count for this author
        publicationCount: db.$count(
          db
            .select()
            .from(publicationAuthors)
            .where(eq(publicationAuthors.authorId, authors.id))
        ),
      })
      .from(authors)
      .where(
        and(
          isNull(authors.researcherId), // Only standalone authors
          or(
            ilike(authors.name, `%${searchQuery}%`),
            ilike(authors.email, `%${searchQuery}%`),
            ilike(authors.affiliation, `%${searchQuery}%`)
          )
        )
      )
      .limit(Math.floor(searchLimit / 2));

    // Combine and format results
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
          publicationCount: author.publicationCount,
        },
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Author search error:", error);
    return NextResponse.json(
      { error: "Failed to search authors" },
      { status: 500 }
    );
  }
}

// POST: Create a new author
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = createAuthorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid author data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, affiliation, orcid } = validation.data;

    // Check if author with same email already exists (if email provided)
    if (email) {
      const existingAuthor = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.email, email))
        .limit(1);

      if (existingAuthor.length > 0) {
        return NextResponse.json(
          { error: "Author with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Create the new author
    const [newAuthor] = await db
      .insert(authors)
      .values({
        name,
        email: email || null,
        affiliation: affiliation || null,
        orcid: orcid || null,
        researcherId: null, // Standalone author
      })
      .returning({
        id: authors.id,
        name: authors.name,
        email: authors.email,
        affiliation: authors.affiliation,
        orcid: authors.orcid,
        researcherId: authors.researcherId,
      });

    return NextResponse.json({
      success: true,
      author: {
        ...newAuthor,
        publicationCount: 0,
      },
    });
  } catch (error) {
    console.error("Author creation error:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}
