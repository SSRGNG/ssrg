import "server-only";

import { asc, desc, eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { appConfig } from "@/config";
import { db } from "@/db";
import {
  authors,
  publicationAuthors,
  publications,
  researchers,
  users,
} from "@/db/schema";

export async function getPublications(limit = Infinity, offset = 0) {
  const results = await db.query.publications.findMany({
    columns: {
      id: true,
      title: true,
      type: true,
      doi: true,
      publicationDate: true,
    },
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
                columns: { title: true, orcid: true },
              },
            },
          },
        },
        orderBy: (q, { asc }) => [asc(q.order)],
      },
    },
    orderBy: (q, { asc }) => [asc(q.publicationDate)],
    limit: limit === Infinity ? undefined : limit,
    offset,
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

export async function getResearcherPublications() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);

  // Create aliases for the second set of joins
  const allPublicationAuthors = alias(
    publicationAuthors,
    "allPublicationAuthors"
  );
  const authorProfiles = alias(authors, "authorProfiles");
  const authorResearchers = alias(researchers, "authorResearchers");

  // Single query to get all publications for the authenticated researcher
  const results = await db
    .select({
      // Publication fields
      ...getTableColumns(publications),
      // publicationId: publications.id,
      // title: publications.title,
      // type: publications.type,
      // doi: publications.doi,
      // publicationDate: publications.publicationDate,
      // abstract: publications.abstract,
      // link: publications.link,
      // venue: publications.venue,
      // metadata: publications.metadata,
      // citationCount: publications.citationCount,
      // lastCitationUpdate: publications.lastCitationUpdate,
      // creatorId: publications.creatorId,

      // Current user's authorship details
      userAuthorOrder: publicationAuthors.order,
      userIsCorresponding: publicationAuthors.isCorresponding,

      // All authors for each publication (for complete author list)
      authorOrder: allPublicationAuthors.order,
      authorIsCorresponding: allPublicationAuthors.isCorresponding,
      authorName: authorProfiles.name,
      authorEmail: authorProfiles.email,
      authorAffiliation: authorProfiles.affiliation,
      authorOrcid: authorProfiles.orcid,

      // Author's researcher details (optional)
      authorResearcherId: authorResearchers.id,
      authorResearcherTitle: authorResearchers.title,
      // authorUserName: authorUsers.name,
    })
    .from(researchers)
    .innerJoin(users, eq(researchers.userId, users.id))
    .innerJoin(authors, eq(authors.researcherId, researchers.id))
    .innerJoin(publicationAuthors, eq(publicationAuthors.authorId, authors.id))
    .innerJoin(
      publications,
      eq(publications.id, publicationAuthors.publicationId)
    )
    // Get all authors for each publication (using alias to avoid conflicts)
    .innerJoin(
      allPublicationAuthors,
      eq(allPublicationAuthors.publicationId, publications.id)
    )
    .innerJoin(
      authorProfiles,
      eq(authorProfiles.id, allPublicationAuthors.authorId)
    )
    .leftJoin(
      authorResearchers,
      eq(authorProfiles.researcherId, authorResearchers.id)
    )
    // .leftJoin(authorUsers, eq(authorResearchers.userId, authorUsers.id))
    .where(eq(researchers.userId, userId))
    .orderBy(
      desc(publications.publicationDate),
      asc(allPublicationAuthors.order)
    );

  if (results.length === 0) return [];

  // Create type for the transformed result
  type Row = (typeof results)[number];
  type TransformedPublication = Pick<
    Row,
    | "id" // From publications
    | "title"
    | "type"
    | "doi"
    | "publicationDate"
    | "abstract"
    | "link"
    | "venue"
    | "metadata"
    | "citationCount"
    | "lastCitationUpdate"
    | "creatorId"
  > & {
    userAuthorOrder: Row["userAuthorOrder"];
    isLeadAuthor: boolean;
    authors: {
      order: Row["authorOrder"];
      isCorresponding: Row["authorIsCorresponding"];
      name: Row["authorName"];
      email: Row["authorEmail"];
      affiliation: Row["authorAffiliation"];
      orcid: Row["authorOrcid"];
      researcher: {
        id: Row["authorResearcherId"];
        title: Row["authorResearcherTitle"];
      } | null;
    }[];
  };

  // Group results by publication
  const publicationsMap = new Map<string, TransformedPublication>();

  results.forEach((row) => {
    if (!publicationsMap.has(row.id)) {
      publicationsMap.set(row.id, {
        id: row.id,
        title: row.title,
        type: row.type,
        doi: row.doi,
        publicationDate: row.publicationDate,
        abstract: row.abstract,
        link: row.link,
        venue: row.venue,
        metadata: row.metadata,
        citationCount: row.citationCount,
        lastCitationUpdate: row.lastCitationUpdate,
        creatorId: row.creatorId,
        userAuthorOrder: row.userAuthorOrder,
        isLeadAuthor: row.userAuthorOrder === 0,
        authors: [],
      });
    }

    const publication = publicationsMap.get(row.id)!;

    if (
      row.authorOrder !== null &&
      !publication.authors.some((a) => a.order === row.authorOrder)
    ) {
      publication.authors.push({
        order: row.authorOrder,
        isCorresponding: row.authorIsCorresponding,
        name: row.authorName,
        email: row.authorEmail,
        affiliation: row.authorAffiliation,
        orcid: row.authorOrcid,
        researcher: row.authorResearcherId
          ? {
              id: row.authorResearcherId,
              title: row.authorResearcherTitle,
            }
          : null,
      });
    }
  });

  // Add canDelete flag and return
  return Array.from(publicationsMap.values()).map((pub) => ({
    ...pub,
    canDelete:
      pub.authors.length > 0 &&
      pub.userAuthorOrder === Math.min(...pub.authors.map((a) => a.order)),
  }));
}

export async function researcherPublications() {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) redirect(appConfig.url);

  const researcher = await db.query.researchers.findFirst({
    columns: {},
    with: {
      author: {
        columns: {},
        with: {
          publications: {
            columns: { isCorresponding: true, order: true },
            with: {
              publication: {
                with: {
                  authors: {
                    columns: { isCorresponding: true, order: true },
                    with: {
                      author: {
                        columns: {
                          name: true,
                          email: true,
                          affiliation: true,
                          orcid: true,
                        },
                        with: {
                          researcher: { columns: { id: true, title: true } },
                        },
                      },
                    },
                    orderBy: (pa, { asc }) => [asc(pa.order)],
                  },
                },
              },
            },
          },
        },
      },
    },
    where: (model, { eq }) => eq(model.userId, userId),
  });
  return researcher?.author?.publications || [];
}

export async function authResearcher() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);

  const [researcher] = await db
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
    .where(eq(researchers.userId, userId))
    .limit(1);

  return researcher;
}

export async function getCurrentUserResearcher() {
  const userId = (await auth())?.user.id;
  if (!userId) redirect(appConfig.url);
  try {
    const researcher = await db
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
      .where(eq(researchers.userId, userId))
      .limit(1);

    if (researcher.length === 0) {
      return {
        success: false,
        error: "Researcher profile not found for this user",
      };
    }

    return {
      success: true,
      researcher: researcher[0],
    };
  } catch (error) {
    console.error("Get current researcher error:", error);
    return {
      success: false,
      error: "Failed to get researcher details",
    };
  }
}

export async function getNonResearchers() {
  // try {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      affiliation: users.affiliation,
    })
    .from(users)
    .leftJoin(researchers, eq(users.id, researchers.userId))
    .orderBy(users.name);
  // } catch (error) {
  //   console.error(error);
  // }
}
