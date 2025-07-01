import "server-only";

import { unstable_cache as cache } from "next/cache";

import { CACHED_PUBLICATIONS, DEFAULT_PAGE_SIZE } from "@/config/constants";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
} from "@/db/schema";
import { and, desc, eq, exists, gt, lt, or } from "drizzle-orm";

export async function getAllPublications(
  limit = Infinity,
  offset = 0,
  filterByAcademics = false
) {
  const whereConditions = [];

  // Add academics filter if needed
  if (filterByAcademics) {
    whereConditions.push(
      // Only publications where at least one author has a researcher profile
      exists(
        db
          .select()
          .from(publicationAuthors)
          .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
          .innerJoin(researchers, eq(authors.researcherId, researchers.id))
          .where(eq(publicationAuthors.publicationId, publications.id))
      )
    );
  }

  const results = await db.query.publications.findMany({
    with: {
      authors: {
        columns: {
          order: true,
          isCorresponding: true,
        },
        with: {
          author: {
            columns: {
              name: true,
              email: true,
              affiliation: true,
              orcid: true,
            },
            with: {
              researcher: {
                columns: { id: true, title: true, orcid: true },
              },
            },
          },
        },
        orderBy: (a, { asc }) => [asc(a.order)],
      },
    },
    orderBy: (p, { asc }) => [asc(p.publicationDate)],
    limit: limit === Infinity ? undefined : limit,
    offset,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
  });

  return results.map((pub) => ({
    ...pub,
    authors: pub.authors.map(({ order, isCorresponding, author }) => ({
      order,
      isCorresponding,
      name: author.name,
      email: author.email,
      affiliation: author.affiliation,
      orcid: author.orcid,
      researcher: author.researcher || null, // Ensure consistent null handling
    })),
  }));
}

export async function getPublicationsCount(filterByAcademics = false) {
  const whereConditions = [];

  // Add academics filter if needed
  if (filterByAcademics) {
    whereConditions.push(
      // Only publications where at least one author has a researcher profile
      exists(
        db
          .select()
          .from(publicationAuthors)
          .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
          .innerJoin(researchers, eq(authors.researcherId, researchers.id))
          .where(eq(publicationAuthors.publicationId, publications.id))
      )
    );
  }
  const result = await db.query.publications.findMany({
    columns: { id: true },
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
  });
  return result.length;
}

export async function getPaginatedPublications(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filterByAcademics: boolean = false
) {
  const offset = (page - 1) * pageSize;

  const [publications, totalCount] = await Promise.all([
    getAllPublications(pageSize, offset, filterByAcademics),
    getPublicationsCount(filterByAcademics),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    publications,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
}

// For very large datasets (10k+ publications)
export async function getCursorPaginatedPublications(
  cursor?: string,
  limit: number = DEFAULT_PAGE_SIZE,
  filterByAcademics: boolean = false
) {
  const whereConditions = [];

  // Add cursor condition if provided
  if (cursor) {
    const [cursorDate, cursorId] = cursor.split("|");
    whereConditions.push(
      // Publications with date less than cursor date, OR same date but ID greater than cursor ID
      or(
        lt(publications.publicationDate, cursorDate),
        and(
          eq(publications.publicationDate, cursorDate),
          gt(publications.id, cursorId)
        )
      )
    );
  }

  // Add academics filter if needed
  if (filterByAcademics) {
    whereConditions.push(
      // Only publications where at least one author has a researcher profile
      exists(
        db
          .select()
          .from(publicationAuthors)
          .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
          .innerJoin(researchers, eq(authors.researcherId, researchers.id))
          .where(eq(publicationAuthors.publicationId, publications.id))
      )
    );
  }

  const results = await db.query.publications.findMany({
    with: {
      authors: {
        columns: {
          order: true,
          isCorresponding: true,
        },
        with: {
          author: {
            columns: {
              name: true,
              email: true,
              affiliation: true,
              orcid: true,
            },
            with: {
              researcher: {
                columns: { id: true, title: true, orcid: true },
              },
            },
          },
        },
        orderBy: (a, { asc }) => [asc(a.order)],
      },
    },
    orderBy: [desc(publications.publicationDate), desc(publications.id)],
    limit: limit + 1, // Fetch one extra to determine if there's a next page,
    where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
  });

  // Check if there are more items
  const hasNextPage = results.length > limit;
  const paginatedPublications = hasNextPage ? results.slice(0, -1) : results;

  // Generate next cursor from the last item
  const nextCursor =
    hasNextPage && paginatedPublications.length > 0
      ? `${
          paginatedPublications[paginatedPublications.length - 1]
            .publicationDate
        }|${paginatedPublications[paginatedPublications.length - 1].id}`
      : null;

  return {
    publications: paginatedPublications.map((pub) => ({
      ...pub,
      authors: pub.authors.map(({ order, isCorresponding, author }) => ({
        order,
        isCorresponding,
        name: author.name,
        email: author.email,
        affiliation: author.affiliation,
        orcid: author.orcid,
        researcher: author.researcher || null,
      })),
    })),
    nextCursor,
    hasNextPage,
  };
}

export async function getAcademicsPublicationsCount() {
  const result = await db.query.publications.findMany({
    columns: { id: true },
    where: exists(
      db
        .select()
        .from(publicationAuthors)
        .innerJoin(authors, eq(publicationAuthors.authorId, authors.id))
        .innerJoin(researchers, eq(authors.researcherId, researchers.id))
        .where(eq(publicationAuthors.publicationId, publications.id))
    ),
  });
  return result.length;
}

export const getCachedCursorPaginatedPublications = cache(
  async (
    cursor?: string,
    limit: number = DEFAULT_PAGE_SIZE,
    filterByAcademics: boolean = false
  ) => getCursorPaginatedPublications(cursor, limit, filterByAcademics),
  ["publications-cursor-paginated"],
  {
    tags: [CACHED_PUBLICATIONS],
    revalidate: 60 * 60 * 12, // 12 hours for cursor pagination
  }
);

export const getCachedPaginatedPublications = cache(
  async (page: number, pageSize: number = DEFAULT_PAGE_SIZE) =>
    getPaginatedPublications(page, pageSize),
  ["publications-paginated"],
  {
    tags: [CACHED_PUBLICATIONS],
    revalidate: 60 * 60 * 24, // 24 hours for paginated data
  }
);

export const getCachedPaginatedAcademicPublications = cache(
  async (page: number, pageSize: number = DEFAULT_PAGE_SIZE) =>
    getPaginatedPublications(page, pageSize, true),
  ["academic-publications-paginated"],
  {
    tags: [CACHED_PUBLICATIONS],
    revalidate: 60 * 60 * 24, // 24 hours for paginated data
  }
);

export const getCachedPublications = cache(
  async () => getAllPublications(),
  [CACHED_PUBLICATIONS],
  { tags: [CACHED_PUBLICATIONS], revalidate: 60 * 60 * 72 } // 72 hours
);
